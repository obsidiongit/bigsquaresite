> **BUILT 2026-08-30 (Batch 3, Pane B).** Lives at `app/(funnel)/apply/[slug]/page.tsx` with `components/sections/funnels/ApplyForm.tsx`, content in `lib/funnels/registry.ts` (flagship `/apply/growth-partner/`). What changed from this spec: no shadcn Form/Progress (the shared `Field` primitive + a hairline progress bar); "Online only" added to the industry and locations steps and "1" reads as a fine answer (audience rule); the thank-you page has no calendar (retired), it says what happens next; posts through `submitForm` (formType "apply") with UTMs, the slug, and a `qualified` flag (6+ locations and budget at or above the floor; ranges flagged placeholder), fires lead / qualified_lead through `lib/track.ts`, then routes to `/thanks/growth-partner/` with UTMs on the URL. Archived from `project-sections/landing-pages/`.

# Application Funnel Template

Quick qualifying funnel. Short page, multi-step form, calendar on the thank-you page. `noindex`.

## Page
- URL: /apply/[slug]/
- Thank-you: /thanks/[slug]/
- Traffic source: `[PLACEHOLDER]`

## Section order
1. Logo mark, centered.
2. Headline: the offer in one line. `[PLACEHOLDER]`
3. Sub: who qualifies. `[PLACEHOLDER]`
4. Multi-step form (one question per step, progress bar):
   - Step 1: Business name and website
   - Step 2: How many locations? (1, 2 to 5, 6 to 20, 21 to 100, 100+)
   - Step 3: Industry (franchise, home services, legal, healthcare, other)
   - Step 4: Monthly ad budget range `[PLACEHOLDER: ranges]`
   - Step 5: What is the biggest thing holding growth back? (short text)
   - Step 6: Name, email, phone
5. Submit button: "Apply" is fine here since it is the literal action, but "Book My Call" is preferred if the thank-you page has the calendar.
6. Three proof bullets under the form. `[PLACEHOLDER]`

## Thank-you page
- Headline: "You're in. Pick a time."
- Calendar embed.
- One line on what to prepare for the call.

## Tracking
- Fire a lead event on step 6 submit. Fire a qualified event if locations is 6+ and budget is above the floor. Pass all answers to the CRM as fields.

## Design
shadcn `Form` and `Progress`. Graphite palette. Max width 640px. Big inputs, big buttons, no clutter.
