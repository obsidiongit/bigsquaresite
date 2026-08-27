# /careers/ Design Brief (v2, 2026-08-27, Batch 2)

v1 was the Phase 1 stub. This v2 grounds it in the built system: a short light trust page under the open layout. No invented roles, perks, or policies: structure plus flagged placeholders, built to grow the day real roles exist.

## Page
- URL: /careers/
- Title: "Careers at BigSquare" (absolute, brand already in it)
- Meta description: real draft, Brad's sweep covers it

## Posture
- Open layout at EDGE, calm, short. No SquareField, no pinned anything.
- Theme rhythm: light hero, tint the-work cards, light roles, light offices + team band, light close.
- **No CtaBand** (v1 rule kept: careers pages do not push Schedule a Call). The closing ask is "send us your work"; the contact precedent proves a page may close on its own ask.
- Annotation budget: 1 of 3 (H1 underline on "best work"). Quiet page.
- No registration marks.

## Section order
1. **Hero**: SeparatorIn + eyebrow "Careers". H1 kept from v1: "Do the best work of your career" (underline on "best work"). Support right: 2 short real sentences (offices in Denver and Tampa, clients across the country) + `[PLACEHOLDER: remote policy, from Brad]` flagged inline.
2. **The work** (tint, 3 cards on paper): the three real pillars recast for a candidate, derived from project-brief.md only (in-house premium creative, one team across every channel, proof culture with numbers clients can check). No perks, benefits, or values that are not in the brief.
3. **Open roles**: `lib/careers.ts` holds `OPEN_ROLES` (empty until Brad provides real roles; roles are facts, never invented). Empty state renders a designed placeholder block (mono ROLES chip + flagged line) plus the real ask: "Send us your work anyway" with the support email as a rule link. Role card anatomy, for when roles land: full-width ruled row, title left in Apfel 700, location + type mono right, arrow; applications post through submitForm with the role slug (`[PLACEHOLDER: application destination, Brad decides]`, mailto until then).
4. **The offices**: shared OfficeCards (facts from lib/offices.ts, placeholders honest) + the `about-team` MediaSlot as a wide band (shared id: one real team photo lights /about/ and this page).
5. **Close**: statement line ("Show us what you make.") + support email rule link. This is the page's ask.

## JSON-LD
BreadcrumbList (Home > Careers). No JobPosting until a real role exists (structured data never carries placeholders).
