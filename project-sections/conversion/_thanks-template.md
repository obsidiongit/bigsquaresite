# Thank-You Page Template

One dynamic route serving all funnels. `noindex`, no nav, no footer, no popup.

## Page
- URL: /thanks/[slug]/
- Slug matches the source funnel (/go/[slug]/, /apply/[slug]/, lead magnets, audit, contact).
- Config per slug: headline, sub, whether the calendar shows, download link if a lead magnet.

## Content
- Logo mark, centered, small (same top bar as the funnel pages).
- Default headline: "You're in. Pick a time." (calendar variant) or "Check your email." (download variant).
- Calendar variant: booking component, then one line on what to prepare for the call. `[PLACEHOLDER: confirm]`
- Download variant: instant download button + "We also sent it to your email." Then one line: "Want us to walk you through it? Schedule a Call."
- Contact/audit variant: "Got it. We reply within [time]." `[PLACEHOLDER: confirm response time]` plus a Schedule a Call button.

## Tracking
- Fire the conversion event for the source funnel on page load (lead, booked, download). UTM and slug carried from the source.

## Design Instructions
- Graphite palette, single centered column, max width 640px. Match the funnel pages' stripped-down frame.
- The calendar is the whole page when present. Nothing below it.
