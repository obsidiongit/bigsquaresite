/* Event tracking helper. The tag components (components/tracking/*)
   only mount when NEXT_PUBLIC_META_PIXEL_ID / NEXT_PUBLIC_GTAG_ID /
   NEXT_PUBLIC_GA4_ID have values (and Meta + Google Ads stay off under
   Global Privacy Control), so every call here is a silent no-op until
   then.

   Funnel events (project-sections/landing-pages specs): video_play,
   video_50, video_complete, calendar_open (the click through to
   /schedule/; the name is the spec's tracking contract even though
   the calendar embed itself is retired), booked (the thank-you page
   view). Form conversions go through trackFormLead, which pairs every
   Meta event with the event_id the server-side Conversions API sends
   (lib/lead-events.ts, lead-funnel.md section 8). */

import {
  BOOKING_EVENT,
  leadEventFor,
  MIN_FILL_MS,
  QUALIFIED_EVENT,
  type LeadEvent,
} from "@/lib/lead-events";

export type TrackParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Custom event to Google tag / GA4 and the Meta Pixel (trackCustom). */
export function track(event: string, params: TrackParams = {}): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  window.fbq?.("trackCustom", event, params);
}

function fire(event: LeadEvent, eventId: string, params: TrackParams) {
  window.gtag?.("event", event.ga4, params);
  window.fbq?.(
    event.metaCustom ? "trackCustom" : "track",
    event.meta,
    params,
    { eventID: eventId },
  );
}

/** A form conversion: GA4 + Meta, deduplicated against the server's
    Conversions API event by `eventId`. Qualified applications also fire
    the qualified-lead event (its own id, `${eventId}-q`). Takes the
    submission's leadMeta so a submission the server drops as spam (it
    still answers "ok" on purpose) never counts as a conversion either. */
export function trackFormLead(
  formType: string,
  meta: { eventId: string; hp: string; elapsedMs?: number },
  extra: { qualified?: boolean; funnel?: string } = {},
): void {
  if (typeof window === "undefined") return;
  if (meta.hp || (meta.elapsedMs !== undefined && meta.elapsedMs < MIN_FILL_MS)) return;
  const event = leadEventFor(formType);
  if (!event) return;
  const eventId = meta.eventId;
  const params: TrackParams = { form_type: formType, ...extra };
  if (event.ga4 === "sign_up") params.method = "newsletter";
  fire(event, eventId, params);
  if (extra.qualified) fire(QUALIFIED_EVENT, `${eventId}-q`, params);
}

/** A booked strategy call: GA4 book_call + Meta Schedule, deduplicated
    against the server's Conversions API event by `eventId`. */
export function trackBooking(eventId: string): void {
  if (typeof window === "undefined") return;
  fire(BOOKING_EVENT, eventId, { form_type: "schedule" });
}
