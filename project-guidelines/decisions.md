# Decisions and Overrides

This file wins over any conflicting line in project-brief.md, sitemap.md, or the section specs. Read it right after CLAUDE.md.

## Locked values
- Domain: https://www.bigsquaremarketing.com (canonical, OG, sitemap, redirects all use this)
- Portal (Login link in nav and footer): https://www.obsidion.ai/
- Support email: support@bigsquaremarketing.com (footer, contact page, location pages)
- Phone numbers: [PLACEHOLDER] for Denver and Tampa until provided
- Tailwind: v4, CSS-first config with @theme. Do not create tailwind.config.ts. Install the tailwind-design-system skill from skills.md before setup.

## Logo
Use a simple placeholder mark (a square outline in --acc with the word "logo" inside, or a standard broken-image style icon) in a shared `<Logo />` component. The real file drops in later. Never hard-code the placeholder outside that component.

## Fonts
Bluu Next (Velvetyne) and Apfel Grotezk (Collletttivo) are free OFL fonts. Try to extract them from project-sections/reference-images/bigsquare-style-sheet-v6.html first. If that fails, download from the foundries directly and place in public/fonts/. Do not substitute another font.

## Forms and booking
- All forms (contact, audit, popup, application funnel, lead magnets) post to a single server action that sends a webhook. The webhook URL is an env var: FORM_WEBHOOK_URL. Destination is GHL or the Obsidion dashboard, decided later. Build one submit path, not five.
- Booking: a custom-built calendar component that talks to GHL calendars through their API or a webhook. Env vars: GHL_API_KEY, GHL_CALENDAR_ID, GHL_LOCATION_ID. Until the API integration is built, render a styled placeholder that matches the style guide and links to [PLACEHOLDER: GHL calendar link]. Do not embed a third-party iframe as the long-term solution.
- Every form and booking event carries UTM parameters and the page slug as fields.

## Tracking
Meta Pixel, Google tag, and GA4 IDs are all env vars (NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_GTAG_ID, NEXT_PUBLIC_GA4_ID). Build the tag components now, leave the values empty. A teammate fills them in on a separate pass. Analytics loads after hydration.

## Proof density (overrides the homepage specs)
Launch with less, grow into more.
- 7.proof-numbers.md: 3 metrics, not 4. Three-up grid.
- 8.case-studies.md: 3 cards at launch, not 6. "See All Results" button under them. The grid component supports 6 for later.
- 11.testimonials.md: 2 at launch. Carousel supports more.
All values remain [PLACEHOLDER] until real numbers are supplied.

## Brand video
Hero uses a dark abstract placeholder loop until the commercial is delivered. Build the video component so swapping the file is a one-line change.

## Obsidion portal section
Portal is being built in tandem. Use clearly labeled placeholder screenshots (blurred frame with a "Portal preview" tag). Never render a fake UI with fake numbers. Layout takes inspiration from the Youtech Youlytics section: product frame on one side, five feature blocks on the other.

## Ad credit popup
Use "$1,000 Advertising Credit" and a rolling deadline from a single config value (POPUP_DEADLINE). Fine print is [PLACEHOLDER]. Terms will be finalized later.

## Legal pages
Create /privacy-policy/ and /terms/ with a heading, a last-updated date, and section headings only. No legal body text. Mark each as [PLACEHOLDER: legal copy].

## Competitor sitemap crawl
This is a Phase 2 task, not optional. Before writing tasks.md, fetch the XML sitemap index for each of the three competitors (youtechagency.com, scorpion.co, ignitevisibility.com), follow every child sitemap, and append every URL to the matching file in project-guidelines/competitor-sitemaps/ grouped by path prefix. Then add a short "what we are missing" note at the bottom of each file comparing their URL families to our sitemap.md.

## Reminder
No invented numbers, names, reviews, badges, or URLs anywhere. No em dashes in user-facing text.
