"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { bookingEnabled, verifyBookingToken } from "@/lib/booking-token";
import {
  addTags,
  createAppointment,
  findOpportunity,
  findStage,
  freeSlots,
  getContact,
  GhlError,
  moveOpportunity,
  removeTags,
  rescheduleAppointment,
  upcomingAppointment,
  updateContact,
  upsertOpportunity,
} from "@/lib/ghl";
import { BOOKING_EVENT } from "@/lib/lead-events";
import { capiEnabled, sendCapiEvent } from "@/lib/meta-capi";
import { SITE_URL } from "@/lib/site";

// The pick-a-time step after the /schedule/ application (lead-funnel.md
// section 5). The lead is already saved; these only read the GHL
// calendar's free slots and book one onto the contact the token names.
// The browser shows the slots in the visitor's own timezone.

const PIPELINE = "Website Leads";
const BOOKED_STAGE = "Call Booked";
const BOOKED_TAG = "booked";
const DAYS_AHEAD = 14;
const TITLE = "BigSquare strategy call";

export type SlotsResult =
  | { ok: true; slots: string[]; booked?: string }
  | { ok: false };

/** Free slot starts for the next two weeks (GHL applies the calendar's
    hours and minimum notice). `booked` is set when this contact already
    has an upcoming call: the picker shows it instead of booking twice,
    and the /schedule/book/ page offers to change it. */
export async function getSlots(token: string): Promise<SlotsResult> {
  if (!bookingEnabled()) return { ok: false };
  const contactId = verifyBookingToken(token);
  if (!contactId) return { ok: false };
  try {
    const existing = await upcomingAppointment(contactId).catch((error) => {
      console.warn("[booking] appointment lookup failed:", error);
      return null;
    });
    const now = Date.now();
    const slots = await freeSlots(now, now + DAYS_AHEAD * 864e5);
    return existing ? { ok: true, slots, booked: existing.startTime } : { ok: true, slots };
  } catch (error) {
    console.error("[booking] free slots failed:", error);
    return { ok: false };
  }
}

const bookSchema = z.object({
  token: z.string().max(200),
  start: z.string().max(40).refine((s) => !Number.isNaN(Date.parse(s))),
  /** Shared with the browser pixel's Schedule event */
  eventId: z.string().max(80),
  fbc: z.string().max(600).optional(),
  fbp: z.string().max(200).optional(),
  gpc: z.boolean().optional(),
  /** The visitor's IANA timezone: GHL formats {{appointment.*}} times in
      the contact's timezone, else the location's (Eastern). */
  timezone: z.string().max(64).optional(),
  /** Move the contact's upcoming call to `start` instead of refusing a
      second booking (the /schedule/book/ "change time" path) */
  reschedule: z.boolean().optional(),
});

export type BookResult =
  /** existing: already booked; rescheduled: moved. Neither is a new conversion. */
  | { ok: true; start: string; existing?: boolean; rescheduled?: boolean }
  /** taken: refresh the slots; failed: keep the lead, promise a call */
  | { ok: false; reason: "taken" | "failed" };

export async function bookCall(input: z.input<typeof bookSchema>): Promise<BookResult> {
  const parsed = bookSchema.safeParse(input);
  if (!parsed.success || !bookingEnabled()) return { ok: false, reason: "failed" };
  const { token, start, eventId, fbc, fbp, gpc: clientGpc, timezone, reschedule } = parsed.data;
  const contactId = verifyBookingToken(token);
  if (!contactId) return { ok: false, reason: "failed" };

  /* Before the appointment exists, so W3's confirmation email already
     shows the visitor's own time. Best effort. */
  if (timezone && validTimezone(timezone)) {
    await updateContact(contactId, { timezone }).catch((error) =>
      console.warn("[booking] contact timezone update failed:", error),
    );
  }

  /* One call per lead: a double click or a revisit never books twice. */
  const existing = await upcomingAppointment(contactId).catch(() => null);
  if (existing && !reschedule) return { ok: true, start: existing.startTime, existing: true };

  try {
    if (existing) {
      await rescheduleAppointment(existing.id, start);
      return { ok: true, start, rescheduled: true };
    }
    await createAppointment({ contactId, startTime: start, title: TITLE });
  } catch (error) {
    // GHL refuses a slot that stopped being free with a 4xx.
    if (error instanceof GhlError && error.status >= 400 && error.status < 500) {
      console.warn("[booking] slot refused:", error.message);
      return { ok: false, reason: "taken" };
    }
    console.error("[booking] appointment create failed:", error);
    return { ok: false, reason: "failed" };
  }

  const requestHeaders = await headers();
  const gpc = clientGpc || requestHeaders.get("sec-gpc") === "1";
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    undefined;
  const userAgent = requestHeaders.get("user-agent") || undefined;

  /* The booking is made; the CRM bookkeeping and the server-side event
     run after the response so the visitor sees the confirmation at once. */
  after(async () => {
    const results = await Promise.allSettled([
      markBooked(contactId),
      (async () => {
        if (gpc || !capiEnabled()) return;
        const c = await getContact(contactId);
        await sendCapiEvent({
          event: BOOKING_EVENT,
          eventId,
          sourceUrl: `${SITE_URL}/schedule/`,
          email: c.email,
          phone: c.phone,
          name: [c.firstName, c.lastName].filter(Boolean).join(" "),
          fbc,
          fbp,
          ip,
          userAgent,
          customData: { form_type: "schedule" },
        });
      })(),
    ]);
    for (const r of results) {
      if (r.status === "rejected") console.error("[booking] follow-up failed:", r.reason);
    }
  });

  return { ok: true, start };
}

function validTimezone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Deal to Call Booked and the `booked` tag (reset first so GHL's
    "tag added" trigger fires for a repeat booking too). */
async function markBooked(contactId: string) {
  await removeTags(contactId, [BOOKED_TAG]).catch(() => undefined);
  await addTags(contactId, [BOOKED_TAG]);
  const stage = await findStage(PIPELINE, BOOKED_STAGE);
  if (!stage) {
    console.warn(`[booking] pipeline "${PIPELINE}" / "${BOOKED_STAGE}" not found`);
    return;
  }
  const deal = await findOpportunity(contactId, stage.pipelineId);
  if (deal) {
    await moveOpportunity(deal.id, stage.pipelineId, stage.stageId);
    return;
  }
  const c = await getContact(contactId);
  await upsertOpportunity({
    ...stage,
    contactId,
    name: `${c.companyName || [c.firstName, c.lastName].filter(Boolean).join(" ") || c.email} (schedule)`,
    source: "Website: schedule",
  });
}
