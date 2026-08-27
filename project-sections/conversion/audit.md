# /audit/ Design Brief (v2, 2026-08-27)

v1 was the Phase 1 spec. This v2 grounds the page in the built system: the T1 conversion posture proven on /schedule/ (open layout, no CtaBand, every ask on the page IS the form), with the form as the hero per v1's rule.

## Page
- URL: /audit/ (secondary conversion; "Get a Free Audit" buttons sitewide land here)
- Title: "Get a Free Marketing Audit" (template appends "| BigSquare")
- Meta description: real draft, Brad's copy sweep covers it

## Posture (T1, from /schedule/)
- Open layout at EDGE, SquareField ambient layer, z-10 content wrappers.
- No CtaBand, no competing CTA: the form is the only ask.
- No popup on this page (v1 rule stands).
- Annotation budget: 2 of 3 (H1 underline, closing circle).

## Section order
1. **The audit stage** (hero): SeparatorIn + eyebrow "Free audit". H1 "Get a free marketing audit" with the underline annotation. Sub from v1: what we look at, what you get, flagged `[PLACEHOLDER: confirm deliverable and turnaround]`. Desktop: supporting column left (what we look at as a compact NumberedRuledList: search, ads, site, tracking; what-you-get bullets stay `[PLACEHOLDER]`-flagged), form card right (surf, radius 24), mirroring the /schedule/ stage so the form sits above the fold. Mobile: H1, sub, form, then the list.
2. **What happens after** (compact NumberedRuledList): request lands, we dig in, you get the report walked through. Flagged where turnaround is unconfirmed.
3. **Closing moment**: statement line with the circle annotation, pill back to `#audit-form`.

## The form (single screen, not stepped)
Stepped is /schedule/'s signature; the audit form is one card, all fields visible (a person requesting an audit is already committed; friction is the enemy on the secondary path).
- Fields (shared `Field`, 6.13 contract): name, email, phone, company, website.
- How many locations: pill radio row, "Online only" included (audience rule: never franchise-only).
- What are you running now: pill CHECKBOXES (search ads, social ads, SEO, email, none of these). Same pill anatomy as the /schedule/ picker, square indicators instead of radio behavior.
- Button: "Get My Audit" (never Submit). Full width in the card.
- Submits through submitForm, formType "audit", page slug + UTM. In-place confirmation, measured height lock, focus to confirmation (6.13).
- Reassurance line under the button: no contracts, you own your accounts.

## Proof
v1's "one proof point if real data exists": no real data exists, so nothing renders. No placeholder metric.

## JSON-LD
BreadcrumbList (Home > Get a Free Audit). Organization is sitewide.
