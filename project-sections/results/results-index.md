# /results/ Design Brief (v2, 2026-08-27, Batch 2)

v1 was the Phase 1 stub. This v2 makes the index a REAL page under the open layout while case-study CONTENT stays hard-gated on real data: the 6 /results/[slug]/ skeletons stay noindex and untouched, and nothing on this page invents a client, metric, or review. The index's job until data lands: be the destination "See the Results" buttons deserve, and say honestly how we measure.

## Page
- URL: /results/
- Title: "Client Results & Case Studies" (template appends "| BigSquare")
- Meta description: real draft, Brad's sweep covers it

## Posture
- Open layout at EDGE. No SquareField, no pinned runways.
- Theme rhythm: light hero, light grid, tint how-we-measure, accent CtaBand.
- Annotation budget: 2 of 3 (H1 circle on "Real numbers", CtaBand bracket).
- No registration marks.

## Section order
1. **Hero**: SeparatorIn + eyebrow "Results". H1 kept from v1: "Real brands. Real numbers." (circle on "Real numbers"). Support right, v1's draft kept: every number comes from a real account, ask about any of them on a call.
2. **The case study grid**: 6 cards from `lib/featured-work.ts` (the same array the homepage grid and the skeleton pages read; one source). 2-up from md, 1-up below. Card anatomy in the PLACEHOLDER STATE: 3:2 designed media frame (the MediaSlot placeholder grammar: surf ground, ghost brand square, mono CASE STUDY chip), flagged title straight from the array, real service tags as mono text, RuleLink "See the Results" into the skeleton. NO metric chips and NO outcome headlines until real values exist (6.4's card lockup needs numbers; a 000% stand-in on an indexable page reads as a claim). One flagged mono line above the grid marks the whole grid as placeholder until client data lands.
3. **How we measure** (tint): the page's real copy while data is owed. 3 numbered ruled rows, claims that are true today: numbers come from accounts you own; you see them in the same dashboard we do; we walk every report on a call. Short, no invented specifics.
4. **CtaBand** (shared): headline swapped to the proof ask ("Want numbers like these with your name on them?" style, drafted in-page), buttons default.

## Data model (filters, post-launch)
Ignite structures case studies by industry + category; build the fields now, no filter UI at launch: `WorkEntry` gains `industry: string | null` and `brandType: "franchisor" | "franchisee-group" | "regional-brand" | "single-location" | "ecommerce" | null` (audience rule: the taxonomy includes single-location and ecommerce from day one). All null until real studies land.

## JSON-LD
BreadcrumbList (Home > Results). No CollectionPage/ItemList until the cards carry real content (structured data never carries placeholders).
