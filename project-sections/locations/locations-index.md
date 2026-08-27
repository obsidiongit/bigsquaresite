# /locations/ Design Brief (v2, 2026-08-27, Batch 2)

v1 was the Phase 1 stub. This v2 grounds it in the built system: a short routing page under the open layout (4.5). Its job is to send people to the two city pages and back up the footer's Locations links. Nothing on it competes with that job.

## Page
- URL: /locations/
- Title: "Our Offices" (template appends "| BigSquare")
- Meta description: real draft, Brad's sweep covers it

## Posture
- Open layout at EDGE. No SquareField (short utility page). No pinned anything.
- Annotation budget: 2 of 3 (H1 circle on "Two offices", CtaBand bracket).
- No registration marks (standing new-page rule): every MediaSlot takes marks={false}.

## Section order
1. **Hero** (short): SeparatorIn + eyebrow "Locations". H1 from v1, kept: "Two offices. Brands across the country." (circle on "Two offices"). Support right: v1's sub reworded to the audience rule (single locations and ecommerce serve too, most clients never visit an office).
2. **The two city panels**: one composition per office, richer than the compact `OfficeCards` (which stays as the contact/about rail card). Each panel: MediaSlot photo on top (`locations-<city>-office`, 3:2, shared id with the city page's band), city in Bluu at H2 scale, mono state line, address + phone rows from `lib/offices.ts` (null renders the honest mono placeholder, never invented), then a RuleLink into /locations/<city>/. Side by side from md, stacked below. Facts render from `lib/offices.ts` only; this page adds zero facts of its own.
3. **Not near an office**: one short body block: we meet on video, the work shows up in your dashboard, support email as a rule link. This is the page's audience-rule beat.
4. **CtaBand** (shared, default copy).

## JSON-LD
BreadcrumbList (Home > Locations). LocalBusiness lives on the child pages only (v1 rule stands). Organization is sitewide.

## Asset slots (add to asset-manifest.md)
- `locations-denver-office`: Denver panel + the Denver page band. The Denver office or the team in it, real photo only.
- `locations-tampa-office`: same for Tampa.
