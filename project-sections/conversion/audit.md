# Audit Page Specifications

The secondary conversion page. "Get a Free Audit" buttons land here.

## Page
- URL: /audit/
- Title tag: Get a Free Marketing Audit | BigSquare
- Meta description: `[PLACEHOLDER]`

## Content
- Eyebrow "FREE AUDIT", H1 "Get a free marketing audit".
- Sub: "We look at your search, your ads, your site, and your tracking. You get a short report on what is working, what is broken, and what we would fix first. `[PLACEHOLDER: confirm deliverable and turnaround time]`"
- Form (posts to the single server action with UTM and page slug):
  - Name, email, phone
  - Company and website
  - How many locations? (1, 2 to 5, 6 to 20, 21 to 100, 100+)
  - What are you running now? (checkboxes: search ads, social ads, SEO, email, none)
- Button: "Get a Free Audit" (or "Get My Audit"). Never Submit.
- What you get (3 to 4 bullets): `[PLACEHOLDER: confirm the real audit deliverables]`
- One proof point (metric or case study card) if real data exists.

## Components to Use
- shadcn Field/FieldGroup form pattern. Max width 640px. Big inputs.
- No popup on this page.

## Design Instructions
- `--paper` background, form in a `--surf` card. Nav and footer stay.
- The form is the hero. It must be visible above the fold on desktop and one short scroll on mobile.
