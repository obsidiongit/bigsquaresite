# Schedule Page Specifications

v2.1, 2026-08-26 (round-3 amendments, Brad's round-2 review: "getting a bit better"; form becomes a STEPPED application, trust strip becomes the homepage marquee mirrored). v2 rewritten same day after his round-1 verdict ("6 out of 10": "really bland, really weak... this is where all of our organic traffic is gonna go"). v1's booking-calendar direction is retired; the page is a VSL + in-page application page. Premium like the homepage, "nice, not over the top," with honest playful details. Copy is DRAFT throughout: Brad does the copy pass himself; Mike wires the GHL API.

The primary conversion page. Every "Schedule a Call" CTA on the site lands here, and organic traffic is funneled here. It has to build trust fast (the VSL) and capture the lead without ever leaving the page.

## Page

- URL: /schedule/
- Title tag: Schedule a Call | BigSquare
- Meta description: filled from spec copy, confirm at review
- Indexable, BreadcrumbList JSON-LD (Home > Schedule a Call, JSON-LD only per STYLE_GUIDE 6.15: a top-level page shows no visible trail; the mono eyebrow fills the meta-row slot)

## Booking mechanism (Brad, 2026-08-26, supersedes v1 and decisions.md "Forms and booking" calendar line)

- NOT a GHL calendar embed and NOT the custom calendar component ("that just looks like shit"). A SHORT APPLICATION FORM that executes entirely on this page: no navigation, in-place confirmation (STYLE_GUIDE 6.13), captured through the GHL API as a lead afterwards.
- Until the GHL API wiring exists, the form posts through the site's single submit path (`submitForm`, formType "schedule", page slug + UTM). The GHL integration replaces the webhook destination later; the form itself never changes.
- STEPPED, not one block (Brad, round 2: "an application that you click through and submit the info piece by piece. It has a higher rate of converting"). Five steps, one question each: name -> company -> locations picker -> email -> phone. AUDIENCE RULE (Brad, round 3, 2026-08-26): the flow must never read franchise-only, "we serve ecommerce clients and single location businesses as well". So locations never leads (name opens; the picker is the mid-flow delight beat) and its options are "Online only" / 1 / 2 to 5 / 6 to 20 / 21 to 100 / 100+. The lib/faq.ts franchise answer was widened to match; this audience rule applies to every conversion page in the lane. Progress = a row of brand squares filling per step + the mono 1/5 counter; mono BACK control from step 2 on. One <form>: only the current step's inputs mount, so native validation gates each Next and Enter advances; answers persist in state across Back. The picker AUTO-ADVANCES on pointer selection (a beat after the meter fills); arrow-key browsing never advances. The arriving step's input focuses via mount-time autoFocus (an effect fires too early under AnimatePresence mode="wait"), never on initial page load, never on radios.
- Submit on the last step: primary pill "Schedule a Call" (mid-flow the pill reads "Next"). Confirmation: "Got it. We will set up your call." with the 6.13 in-place swap (height lock, focus move, role="status").
- Reassurance line inside the card, under the submit: "No long-term contracts. You own your accounts."

## The VSL (Brad, 2026-08-26)

- A lightweight 1-to-2-minute VSL builds the trust. Framed media object (radius 24, dark interior, registration marks), never full bleed, click-to-play WITH sound, native controls once playing. No autoplay.
- Asset does not exist yet: `lib/schedule-media.ts` owns the swap (VSL_VIDEO null until delivered; poster reuses the dark abstract placeholder from the brand-video contract). While null: poster + inert brand-square play glyph at reduced opacity + a visible mono `[PLACEHOLDER: VSL film]` chip (the honesty gate, 6.12 pattern).
- The play button is the brand square: a rounded accent square with a white triangle. Hover scale + shadow.
- Reduced motion: poster only, play on user action (7.8).

## Layout (the conversion stage)

Open layout at EDGE (4.5), NOT v1's single 720px spine (Brad: too weak for the traffic this page gets). Ambient `SquareField` mounts page-level for the homepage's quiet life; hero content wrappers carry `relative z-10` so squares pass behind panels.

1. **Hero stage** (light): SeparatorIn + eyebrow SCHEDULE A CALL. H1 huge-left ("Book a call. We bring the numbers." with the rough underline on "the numbers.") + support paragraph small-right (the 30-minutes copy). Then a 12-col grid: VSL panel left (7 cols), the application form card right (5 cols, `bg-surf` rounded-24, spans both rows, id="book"), and WHAT HAPPENS ON THE CALL under the VSL (mono label + 3 compact ruled rows, DRAFT steps with the visible confirm-with-Brad-or-Mike marker). Mobile order: H1, sub, VSL, form, steps.
2. **Partner strip**: the homepage TrustMarquee mounted as-is, read-only (Brad, round 2: the static row "doesn't scroll and looks a bit strange... mirroring it over here will probably be the best move"). Its circled eyebrow is the page's third annotation and the marquee is the page's one velocity element.
3. **Before you book** (light): the shared Faq block, buyer-process set (D5), FAQPage JSON-LD.
4. **Closing moment** (light): the page's one statement-scale line, "Ready when you are." with the rough circle on "Ready", + primary pill "Schedule a Call" anchoring to #book. Same ask, not a second CTA. Footer closes the page.

## The locations picker (the playful moment)

"How many locations?" as a real radiogroup of 5 segments (1 / 2 to 5 / 6 to 20 / 21 to 100 / 100+), native radio inputs styled as pills, selected segment floods accent. Above it a strip of small brand squares fills to match the chosen range with a quick stagger (transform/opacity, house ease; instant under reduced motion). Keyboard: native radio arrow keys. The counts are UI weight, not claims.

## Shared primitives

- This page's form extracts the shared `Field` primitive from NewsletterForm (6.13's Phase 3 item, Lane 1 owns it). NewsletterForm itself migrates to Field in its next homepage session, tracked in tasks.md (its file is homepage-owned; no cross-lane edit).
- Consumed read-only: Faq, jsonld builders, SquareField, RegistrationMarks, ClipReveal, NumberedRuledList.

## Annotation budget

3 of 3: the H1 underline, the marquee's circled eyebrow, the closing circle. One per viewport holds.

## Done when

- [ ] 375/768/1280/1536 + reduced motion screenshots, no horizontal overflow
- [ ] Form submits in place: success swap, focus move, no navigation, server warning logged while FORM_WEBHOOK_URL is empty
- [ ] Locations picker keyboard-operable, squares animate on selection
- [ ] BreadcrumbList + FAQPage JSON-LD present; one H1
- [ ] Fold at 1280x800: H1, VSL top, and the form's first fields visible
- [ ] Brad review: copy pass (H1, sub, steps, confirmation), VSL asset request, GHL API wiring plan
