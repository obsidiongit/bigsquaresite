/* Event tracking helper. The tag components (components/tracking/*)
   only mount when NEXT_PUBLIC_META_PIXEL_ID / NEXT_PUBLIC_GTAG_ID /
   NEXT_PUBLIC_GA4_ID have values (decisions.md: a teammate fills them
   in on a separate pass), so every call here is a silent no-op until
   then and the funnel pages can wire their events today.

   Funnel events (project-sections/landing-pages specs): video_play,
   video_50, video_complete, calendar_open (the click through to
   /schedule/; the name is the spec's tracking contract even though
   the calendar embed itself is retired), lead, qualified_lead, booked
   (the thank-you page view, the conversion URL ad platforms hook onto). */

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

/** A form lead: GA4 generate_lead + Meta's standard Lead event. */
export function trackLead(params: TrackParams = {}): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "generate_lead", params);
  window.fbq?.("track", "Lead", params);
}
