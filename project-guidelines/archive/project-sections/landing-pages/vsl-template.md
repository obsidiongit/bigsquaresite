> **BUILT 2026-08-30 (Batch 3, Pane B).** Lives at `app/(funnel)/go/[slug]/page.tsx`, content in `lib/funnels/registry.ts` (flagship `/go/audit/`), pieces in `components/sections/funnels/`. What changed from this spec: the calendar embed is retired (decisions.md), so the button routes to `/schedule/` with UTMs carried; the palette is one `[data-theme]` ground per page (D6) instead of the Graphite/Signal names; the player is a plain `<video>` slot until a URL lands; events fire through `lib/track.ts` (video_play, video_50, video_complete, calendar_open) and are no-ops until the tag IDs exist. Kept: the section order and the tracking list. Archived from `project-sections/landing-pages/`.

# VSL Landing Page Template

Ad destination. No nav, no footer, `noindex`. One goal: watch the video, book the call.

## Page
- URL: /go/[slug]/
- Thank-you: /thanks/[slug]/
- Traffic source: `[PLACEHOLDER: Meta, Google, cold DM, email]`
- Audience: `[PLACEHOLDER: who is this for, one line]`

## Section order
1. Top bar: logo mark only, centered, small.
2. Headline above the video: the promise in one line. `[PLACEHOLDER]`
3. Sub: who it is for and how long the video is. `[PLACEHOLDER]`
4. Video: 16:9, custom player (Mux, Wistia, or Vimeo), no related videos, big play button, poster frame. `[PLACEHOLDER: video URL]`
5. Button under the video: "Schedule a Call". Calendar embed opens inline or routes to /schedule/ with UTM carried.
6. Three proof bullets or one case study card. `[PLACEHOLDER]`
7. Short "what happens on the call" block (3 steps).
8. Second button.
9. Fine print and privacy link.

## Design
Palette: Graphite by default. Signal (dark) is allowed for VSL pages if the video has a dark thumbnail. One accent only. Max width 900px, centered. Mobile first.

## Tracking
- Meta Pixel and Google tag with page-specific events: video_play, video_50, video_complete, calendar_open, booked.
- UTM parameters passed through to the calendar and to the CRM.
