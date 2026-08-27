# /contact/ Design Brief (v2, 2026-08-27)

v1 was the Phase 1 spec. This v2 grounds it in the built system: a quiet utility conversion page under the open layout. Not T1 flagship drama; a person on /contact/ wants to reach us, so the page gets out of the way.

## Page
- URL: /contact/
- Title: "Contact BigSquare Marketing" (absolute, no template suffix)
- Meta description: real draft, Brad's sweep covers it

## Posture
- Open layout at EDGE. No SquareField (utility page, quiet ground). No CtaBand: the form is the ask; /schedule/ gets one linked line instead.
- Annotation budget: 1 of 3 (H1 underline). Calm page.

## Section order
1. **Hero + the split**: SeparatorIn + eyebrow "Contact". H1 "Talk to us." Sub: "Want to skip the form? Book a time that works:" with a Schedule a Call rule-link. Then the two-column split (v1): form left (7 cols), offices right (5 cols); stacks form-first on mobile.
2. **Form** (surf card): name, email, phone, company on the shared `Field`; how many locations as the pill radio row ("Online only" included, audience rule); message as a textarea on the Field anatomy (56px min, radius 16, paper face). Button "Send the Message". formType "contact", in-place confirmation per 6.13.
3. **Offices column**: two surf cards, Denver and Tampa, each linking to its /locations/ page. Street address + phone stay `[PLACEHOLDER]` until Brad provides them (never invented). Under them, the email row: support@bigsquaremarketing.com as a rule-link.
4. **Before you write** (D5): the shared Faq block on the BUYER_PROCESS_FAQ array (same set as /schedule/; FAQPage JSON-LD comes with it).

## JSON-LD
BreadcrumbList (Home > Contact) + the Faq block's FAQPage. Organization is sitewide; no extra schema (v1 rule stands).

## Shared primitive
Office cards ship as `components/shared/OfficeCards.tsx`: /about/ renders the same two cards (one source for office facts, `lib/offices.ts`). /locations/ pages consume the same data in Batch 2.
