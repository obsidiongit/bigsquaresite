# Schedule Page Specifications

The primary conversion page. Every "Schedule a Call" button on the site lands here. Keep it fast and empty of distraction.

## Page
- URL: /schedule/
- Title tag: Schedule a Call | BigSquare
- Meta description: `[PLACEHOLDER]`

## Content
- Eyebrow "SCHEDULE A CALL", H1 "Pick a time. We will bring the numbers."
- Sub: "30 minutes. We look at your accounts together and tell you exactly what we would do first. `[PLACEHOLDER: confirm call length and format]`"
- Booking calendar: the custom GHL booking component (env vars GHL_API_KEY, GHL_CALENDAR_ID, GHL_LOCATION_ID per decisions.md). Until the API integration is built, render the styled placeholder that links to `[PLACEHOLDER: GHL calendar link]`. Never a third-party iframe as the long-term solution.
- Under the calendar, small: "No long-term contracts. You own your accounts."
- What happens on the call (3 steps): `[PLACEHOLDER: confirm the real steps with Brad or Mike]`
- One testimonial card if a real one exists, else nothing.

## Components to Use
- Nav and footer stay (this page is indexed and linked site-wide). No popup on this page (per popup spec exclusions).
- Booking event carries UTM parameters and the page slug.

## Design Instructions
- `--paper` background, calendar in a `--surf` card, max width 720px centered.
- Nothing below the calendar competes with it. No secondary CTA on this page.
