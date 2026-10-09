"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { bookingEnabled, bookingToken } from "@/lib/booking-token";
import { deliverToGhl, saveBookingLink, type LeadPayload } from "@/lib/ghl-lead";
import { ghlEnabled } from "@/lib/ghl";
import { leadEventFor, MIN_FILL_MS, QUALIFIED_EVENT } from "@/lib/lead-events";
import { capiEnabled, sendCapiEvent } from "@/lib/meta-capi";
import { SITE_URL } from "@/lib/site";
import type { UtmParams } from "@/lib/utm";

// The single submit path for every form on the site: schedule, contact,
// audit, application funnel, lead magnets, newsletter (decisions.md;
// lead-funnel.md section 3). Drops spam, writes the lead to GHL through
// the API when GHL_API_KEY is set, and falls back to FORM_WEBHOOK_URL (the
// "Website form inbound" workflow) so a lead is never lost. After the
// response, the matching Meta Conversions API event goes out with the
// browser pixel's event_id.

const text = (max: number) => z.string().max(max);

const utmSchema = z.object({
  utm_source: text(300).optional(),
  utm_medium: text(300).optional(),
  utm_campaign: text(300).optional(),
  utm_term: text(300).optional(),
  utm_content: text(300).optional(),
});

/* SMS consent record (TCPA/CTIA one-to-one consent, legal-pages-plan.md):
   the EXACT consent text the visitor saw, the checkbox state, and when it
   was checked. Sent only by forms that show the SMS checkbox (ApplyForm);
   the record rides to the CRM with the submission so proof of consent
   exists per lead. The checkbox never gates submission; it gates texting. */
const smsConsentSchema = z.object({
  /** Whether the box was checked at submit time */
  checked: z.boolean(),
  /** The consent sentence rendered next to the box, verbatim */
  text: text(1000).min(1),
  /** ISO timestamp of the check; absent while unchecked */
  checkedAt: text(40).optional(),
});

/* Where the visitor came from (lib/attribution.ts) */
const touchSchema = z.object({
  source: text(300),
  medium: text(300),
  campaign: text(300).optional(),
  content: text(300).optional(),
  term: text(300).optional(),
  landingPage: text(500),
  referrer: text(500).optional(),
  at: text(40),
});

const attributionSchema = z.object({
  firstTouch: touchSchema.optional(),
  lastTouch: touchSchema.optional(),
  clickIds: z.record(z.string(), text(500)).default({}),
  fbc: text(600).optional(),
  fbp: text(200).optional(),
  gaClientId: text(100).optional(),
});

const submissionSchema = z.object({
  /** Which form sent this: "schedule" | "contact" | "audit" | "apply" | "lead-magnet" | "newsletter" */
  formType: text(40).min(1),
  /** Page slug the visitor submitted from, e.g. "/audit/" */
  page: text(300).min(1),
  utm: utmSchema.default({}),
  /** The form's own fields (name, email, message, funnel answers, ...) */
  fields: z
    .record(z.string(), z.union([text(5000), z.number(), z.boolean()]))
    .default({}),
  smsConsent: smsConsentSchema.optional(),
  /** Shared with the browser pixel event so Meta deduplicates the pair */
  eventId: text(80).optional(),
  attribution: attributionSchema.optional(),
  /** The visitor's Global Privacy Control signal */
  gpc: z.boolean().optional(),
  /** Spam signals: the honeypot's value and time on the form */
  hp: text(500).optional(),
  elapsedMs: z.number().optional(),
});

export type FormSubmission = z.input<typeof submissionSchema>;

export type FormResult = {
  ok: boolean;
  error?: string;
  /** Schedule leads written through the GHL API while booking is on:
      opens the pick-a-time step (lib/booking-action.ts). Absent on the
      webhook fallback, which shows "we will call you to set a time". */
  bookingToken?: string;
};

const GENERIC_ERROR =
  "Your message did not send. Please try again, or email support@bigsquaremarketing.com.";

/** Leads who get a pick-a-time link (W3/W4 emails, lead-funnel.md section 7) */
const BOOKABLE_FORMS = new Set(["schedule", "apply", "audit"]);

const str = (v: unknown) => (v === undefined || v === null ? "" : String(v).trim());

export async function submitForm(
  submission: FormSubmission,
): Promise<FormResult> {
  const parsed = submissionSchema.safeParse(submission);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  const { hp, elapsedMs, gpc: clientGpc, ...data } = parsed.data;

  // Spam: answer like a success so the bot learns nothing.
  if (hp || (elapsedMs !== undefined && elapsedMs < MIN_FILL_MS)) {
    console.warn(
      `[form-action] dropped likely spam on ${data.page} (${data.formType}): ${hp ? "honeypot" : `${elapsedMs}ms`}`,
    );
    return { ok: true };
  }

  const f = data.fields;
  const payload: LeadPayload = {
    ...data,
    utm: data.utm satisfies UtmParams,
    contact: {
      name: str(f.name),
      email: str(f.email).toLowerCase(),
      phone: str(f.phone),
      company: str(f.company) || str(f.business),
    },
    submittedAt: new Date().toISOString(),
  };

  const delivered = await deliver(payload);
  if (!delivered.ok) return { ok: false, error: delivered.error };
  const result: FormResult = { ok: true };
  if (delivered.contactId && BOOKABLE_FORMS.has(data.formType) && bookingEnabled()) {
    const token = bookingToken(delivered.contactId);
    // The schedule form opens the picker in place; every bookable lead
    // also gets its link on the contact for the follow-up emails.
    if (data.formType === "schedule") result.bookingToken = token;
    const contactId = delivered.contactId;
    after(() =>
      saveBookingLink(contactId, `${SITE_URL}/schedule/book/?t=${encodeURIComponent(token)}`).catch(
        (error) => console.error("[form-action] booking link save failed:", error),
      ),
    );
  }

  const requestHeaders = await headers();
  const gpc = clientGpc || requestHeaders.get("sec-gpc") === "1";
  const event = leadEventFor(data.formType);
  if (event && data.eventId && !gpc && capiEnabled()) {
    const lead = {
      eventId: data.eventId,
      sourceUrl: `${SITE_URL}${data.page}`,
      email: payload.contact.email,
      phone: payload.contact.phone,
      name: payload.contact.name,
      fbc: data.attribution?.fbc,
      fbp: data.attribution?.fbp,
      ip:
        requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        requestHeaders.get("x-real-ip") ||
        undefined,
      userAgent: requestHeaders.get("user-agent") || undefined,
      customData: { form_type: data.formType },
    };
    after(async () => {
      await sendCapiEvent({ ...lead, event });
      if (f.qualified === true) {
        await sendCapiEvent({ ...lead, event: QUALIFIED_EVENT, eventId: `${data.eventId}-q` });
      }
    });
  }

  return result;
}

async function deliver(payload: LeadPayload): Promise<FormResult & { contactId?: string }> {
  if (ghlEnabled()) {
    try {
      const { contactId } = await deliverToGhl(payload);
      return { ok: true, contactId };
    } catch (error) {
      console.error(
        `[form-action] GHL API write failed for ${payload.formType} on ${payload.page}; falling back to the webhook:`,
        error,
      );
    }
  }
  return postWebhook(payload);
}

async function postWebhook(payload: LeadPayload): Promise<FormResult> {
  const webhookUrl = process.env.FORM_WEBHOOK_URL;
  if (!webhookUrl) {
    // Env vars are intentionally empty until launch config is set. Succeed so
    // the UI flow works, but make the missing config loud in server logs.
    console.warn(
      "[form-action] FORM_WEBHOOK_URL is not set; submission not delivered:",
      JSON.stringify(payload),
    );
    // On the live deployment a fake "sent" would silently drop a real lead:
    // tell the visitor it failed so they use the support email instead.
    if (process.env.VERCEL_ENV === "production") {
      return { ok: false, error: GENERIC_ERROR };
    }
    return { ok: true };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error(
        `[form-action] webhook responded ${response.status} for ${payload.formType} on ${payload.page}`,
      );
      return { ok: false, error: GENERIC_ERROR };
    }
    return { ok: true };
  } catch (error) {
    console.error("[form-action] webhook request failed:", error);
    return { ok: false, error: GENERIC_ERROR };
  }
}
