# Location Page: Denver (v2 design brief, 2026-08-27, Batch 2)

v1 was the Phase 1 stub. This v2 is the CITY PAGE TEMPLATE brief: one layout component (`LocationPage`) plus a per-city content module in `lib/location-pages.ts`, the services/industries registry pattern at 2-page scale (`app/(marketing)/locations/[city]/`, dynamicParams false, pages exist exactly when registered). tampa.md consumes this template and records only its deltas. Never name the planned third office anywhere.

## Page
- URL: /locations/denver/
- Title: "Denver Marketing Agency" (template appends "| BigSquare")
- Primary keyword: marketing agency Denver
- Meta description: real draft, Brad's sweep covers it

## Posture
- Open layout at EDGE, quiet interior register: no canvas, no pinned runways, no SquareField.
- Theme rhythm: light hero, light band, tint what-we-do, light FAQ, accent CtaBand.
- Annotation budget: 2 of 3 (H1 underline on the city name, CtaBand bracket).
- No registration marks; MediaSlot takes marks={false}.
- Office FACTS come only from `lib/offices.ts` (address and phone are null until Brad provides them; null renders the honest mono placeholder). This module carries copy, never facts.

## Section order
1. **Hero**: SeparatorIn + 6.15 breadcrumb row (LOCATIONS / DENVER, real links, mirrored by BreadcrumbList). H1 from v1, kept: "BigSquare Marketing, Denver" (underline on "Denver"). Answer paragraph: v1's SEO paragraph reworded to the audience rule (brands of every size, not franchise-only; Colorado and the country). Right column: the OFFICE FACTS card (surf, radius 24): mono label, address row, phone row (both placeholder-honest), support email as a real mailto row, then Schedule a Call pill + Get a Free Audit secondary.
2. **Office band**: wide MediaSlot (`locations-denver-office`, 16:9 mobile / ~21:9 up, shared id with the hub panel): the office or the team in it.
3. **What we do from Denver** (tint): section header, then a 4-column link table (2-up below lg): the 3 service groups as RuleLink columns from `lib/services.ts` (all 15 pages, the internal-linking payload) plus an Industries column from the industry registry + hub link. One support line: every service runs from both offices for clients anywhere.
4. **Local proof**: NOT BUILT. The T2 rule holds (no placeholder proof sections); real Colorado case studies land here when they exist. Tracked, not rendered.
5. **Local FAQ** (shared Faq, FAQPage JSON-LD from the same array): 3 per-city questions with honest answers only (meet in person or on video, areas served, do I need to be near an office). No question that needs the unconfirmed address to answer.
6. **CtaBand** (shared, default copy).

## JSON-LD
- BreadcrumbList (Home > Locations > Denver), same trail as the visible row.
- **LocalBusiness** (new builder in lib/jsonld.ts): @id on the page, name SITE_NAME, url, email, parentOrganization -> the sitewide Organization @id, address with locality/region/country ONLY (street omitted while lib/offices.ts holds null; structured data never carries placeholders), telephone/geo/openingHours omitted until real, areaServed state + country.
- FAQPage via the Faq block.

## Asset slots
- `locations-denver-office` (shared with the hub; one file lights both).
