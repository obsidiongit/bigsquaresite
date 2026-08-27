# Service Page Template (T2) Design Brief

v2.1, 2026-08-26 (flagship round 2, Brad's gate review of round 1: "good, not great... about a seven or eight out of 10... just a bit boring"; length and context approved). Round-1 corrections now in the spec: ASSET SLOTS on every page (placeholders now, Brad drops files at the end via one map), images that ARE internal links, more play within the signature system, and a VARIATION KIT so 15 stamped pages do not read as one template repeated ("it just doesn't follow the same boring, generic template over and over"). v2 (2026-08-25) replaced the v1 content outline, which had zero design direction. The v1 SEO contract carries forward whole: 800+ words, answer-first paragraph near the top, Service JSON-LD, FAQ block with FAQPage JSON-LD (D5), BreadcrumbList, internal links to 2 industry pages, 1 case study slot (empty until real case studies exist).

Governed by STYLE_GUIDE.md 4.5 (the sitewide open layout) and the top changelog entry. Flagship: `/services/seo/`. **THE FLAGSHIP GATE applies: no other service page exists until Brad checks the Lane 2 GATE box in tasks.md Phase 4.**

Role: the page a buyer lands on from search or the homepage index. It answers "what is this and why does it matter for a brand with many locations" in the first screen, proves we know the multi-location angle, and asks quietly at the end. This template carries T2's future growth: the 15 core services now, the ~10 franchise/multi-location variants in wave 2 (D4).

## Posture

Interior register per 4.5: open layout at EDGE, long-form copy in the ~65ch content spine, ZERO pinned runways, no canvas, no set pieces. Character comes from the cheap signature moves: the full 3-annotation budget, framed media objects with registration marks, a per-page UI fragment, the ruled-row family, mono meta, theme alternation, the closing accent CTA + dark footer. Quiet is still the register, but never bare (Brad, round 1): every T2 page carries real media slots and at least one playful moment, so a human reader who lands from search is impressed, not just informed.

## Assets and media slots (round 2, Brad's workflow)

Every media moment renders through the shared `MediaSlot`, wired to the ASSET DROP-IN MAP (`lib/asset-files.ts`): while a slot id is unmapped it shows the designed placeholder (surf ground, quiet brand-square composition, mono `ASSET / <id>` chip, the 6.12 honesty-gate move); mapping the id to a file in `public/media/` swaps in `next/image` with the slot's alt text and drops the chip, zero layout change. Rules:

- Every slot is DEFINED IN THE CONTENT MODULE (id, real alt text, a note saying what Brad should drop there) and LISTED in `project-guidelines/asset-manifest.md` the session it ships. That manifest is Brad's end-of-build shopping list.
- Slot ids: `services-<slug>-hero`, `services-<slug>-band`; industry card images are shared across pages as `industries-<slug>-card`.
- **Images link inward wherever they have a natural target** (Brad's SEO ask): the work band links to /results/, industry cards link their industry pages, and real images get the 6.4 hover scale as the link affordance. Alt text is written now, descriptive, with the service and audience in it: it ships the moment the asset does.
- Placeholders in page CONTENT under buildout are sanctioned and designed; site chrome still never ships placeholders (6.8).

## Section order and design direction

### 1. Hero (light, `--section-y-lg`, extra top padding under the fixed nav)

Editorial open with a framed media object, not a conversion hero and not a set piece. Default composition is VARIANT A, media-right: content in the left half (~6 of 12 cols at lg), the `services-<slug>-hero` MediaSlot as a SQUARE framed object in the right (~5 cols), with the page's UI FRAGMENT overlapping the media's bottom-left corner at xl (a token-native 6.4 fragment card, per-page, skeleton bars + no numbers; the SEO page's is "Rankings by location" rows with rising arrows). Below lg the media follows the CTAs, capped ~26rem (6.14's cap rule). See the variation kit for variants B and C. **NO registration marks anywhere on T2 pages (Brad, 2026-08-26 gate review: the plus signs read as grid-era leftovers; existing instances elsewhere get his site-wide audit).**

- **Breadcrumb row**: mono meta, `SERVICES / [GROUP NAME]` as real links (`/services/`, `/services/#[group-anchor]`), 13px mono uppercase in `--sec-mid`, on a drawn-in hairline (`SeparatorIn`). The BreadcrumbList JSON-LD mirrors the same trail with real page URLs only (Home, Services, the page; the group head is an anchor, so it stays visible-only).
- **H1**: `--text-h1`, Bluu, sentence case, max ~16ch. Pattern: "[Service] for multi-location brands" or the service's own natural phrasing. One per page.
- **The answer block**: directly under the H1 at `--text-lead`, max ~60ch. 2 to 3 sentences that answer the exact question a buyer types into a search engine or asks ChatGPT (seo-requirements.md, generative engine visibility). This is a load-bearing SEO element, not intro fluff: quotable, plain, complete on its own.
- **The annotation**: one `RoughAnnotation variant="underline"` on the H1's key phrase (the service name or its object), drawn on mount. This is T2's signature annotation. Budget: 1 of 3 (the CTA band bracket is the second; one spare per page).
- **CTA pair**: primary "Schedule a Call" (/schedule/), secondary "Get a Free Audit" (/audit/). Same labels wherever the pair repeats (two-CTA repeat pattern, 6.1).
- Composition: single column in the content spine. No right column, no media object, no metric row (nothing sourced to put in one yet). Whitespace is the hero's material; the hairline + mono breadcrumb is its measured accent.

### 2. Right for you if (light)

Section header (6.3, eyebrow "WHO IT IS FOR") with the H2 left. Body: 3 rows, compact numbered ruled list (6.10 compact). Each row: one situation where this service is the right call, one line each, second line optional. The rows are text, not links.

### 3. What you get (tint)

The deliverables. Section header (eyebrow "WHAT YOU GET"), H2, optional 40ch support line right. Body: 4 to 6 rows as a MAJOR numbered ruled list (6.10 major): deliverable name in Apfel 700 at h3 scale, one-liner under each in `--sec-mid`. 6.10 names service-page deliverable lists as a primary use of this pattern; it replaces any card-grid instinct here.

### 4. How we do it for many locations (light)

The multi-location proof-of-method. This is where the template earns the "for multi-location brands" in every title tag: the copy here is always about many-locations mechanics (per-location pages, location-level budgets, brand consistency across units, reporting by location), never generic service process.

- Section header (eyebrow "HOW IT WORKS FOR MANY LOCATIONS"), H2.
- Body: 3 **process cards** (STYLE_GUIDE 6.4 process/timeline card, built this session as the shared `ProcessCard`): outlined card, no fill, radius 16; mono chip holding the step number (digits in `--sec-acc`, outline chip); short verb title in Apfel 700 at h3 scale; 1 to 2 sentence body; then a 2 to 3 item checklist with check glyphs in `--sec-acc`.
- 3-up grid at `lg`, single column stacked below. Cards do not hover (not links). No day-range chips on T2 (that variant belongs to timeline uses).

### 4b. The work band (light)

Between the process cards and the spine: the `services-<slug>-band` MediaSlot at EDGE width, 16:9 mobile / ~21:9 at md+, no marks. It breaks the page's text run at its longest stretch, and it is an INTERNAL IMAGE LINK (default target /results/) per the linking contract. Variant-kit pages may move it after the spine or trade it for a larger hero (never both gone: every T2 page keeps at least 2 media slots).

### 5. The long-form spine (light)

The page's word-count backbone and the part search engines read closest. 2 to 3 H2 sections of real explanatory copy in the ~65ch content spine (4.2): what the work actually is, how it compounds across locations, what we report. Plain H2s at `--text-h2`, body at `--text-body`, generous paragraph spacing. ONE heading phrase per page carries the hand-drawn CIRCLE (`mark` in the content module; the page's third annotation, a different phrase on every page). Otherwise no decoration beyond the type: this is where most of the 800+ words live. Copy-rules govern hard: grade 3 to 5, short sentences, no banned words, every number sourced or absent.

### 6. Proof slot (HARD-GATED, renders nothing today)

When real case studies exist: one case study card (6.4, shared/case-study-card.md) for a client that used this service, under an eyebrow "PROOF". Until then the section is OMITTED entirely: placeholders never ship in site chrome (6.8 rule), and an empty proof section reads as debris. The slot lives in the page content type (`caseStudy?: ...`) so filling it later is a data change, not a layout change. Tracked in tasks.md Phase 7.

### 7. Related pages (tint)

Internal-linking contract as an editorial close, one section, two ruled stacks side by side at `lg` (stacked below):

- **Related services** (3): mono eyebrow "RELATED SERVICES" over 3 `RuleLink` rows (label + arrow, directional hover). Chosen per page for real adjacency, not rotation.
- **Industries we serve** (2): mono eyebrow "INDUSTRIES" over 2 linked IMAGE CARDS (3:2 MediaSlot + bold caption row with ↗; the whole card is the link, real images get the hover scale). Deliberately a different texture from the rule rows beside them, and the images are internal links (round-2 SEO ask). Card assets are the shared `industries-<slug>-card` ids.

### 8. FAQ (light)

6.7 as specced: eyebrow "FAQ", H2 "Questions we get about [service]", one bordered container (radius 16, divide-y hairlines) of shadcn Accordion items, max-w ~800px. 4 to 6 SERVICE-SPECIFIC questions phrased the way a buyer types them (D5: buyer-process questions live on /contact/ and /schedule/, not here). Answers under 60 words, claims sourced or absent. FAQPage JSON-LD emitted from the same data array that renders the accordion (one source), via the shared `Faq` component built this session.

### 9. CTA band (accent) + footer (dark)

The shared `CtaBand` (shared/cta-band.md props contract; built this session under the open layout: EDGE centered content, NO GridLines or rails, per D1). Default copy from the contract; per-page override allowed through props but rarely needed. The band is the page's one full-accent surface and sits flush above the dark footer.

## Page chrome and metadata

- Title tag and meta description per sitemap.md (title under 60 chars, description under 155, written per page).
- Canonical: the page's own trailing-slash URL.
- JSON-LD: `Service` (name, description = the answer block, provider = Organization by @id, serviceType, url) + `BreadcrumbList` + `FAQPage`. Organization already renders sitewide.
- One H1; H2s all at `--text-h2` (3.3 flat-H2 discipline).
- Copy renders server-side; motion wrappers never hide content from crawlers.

## Architecture (one component, per-page content)

- `lib/services.ts`: the catalog (slug, name, group, group anchor, one-liner) from services-index.md. One source for the hub, the related-services links, and static params.
- `lib/service-pages/[slug].ts`: one typed content module per page (`ServicePageContent`): metadata, H1, answer, sections' copy, FAQ array, related slugs, industry links, optional case study slot. Stamping a new service page = writing one content module with its own copy pass. No copy cloning between pages.
- `components/sections/services/ServicePage.tsx`: renders a `ServicePageContent`. The 14 stamped pages and the D4 wave reuse it unchanged.
- Route: `app/(marketing)/services/[slug]/page.tsx`, `generateStaticParams` from the content registry, `dynamicParams = false`. Pages exist exactly when their content module is registered.

## Steal from

- Youtech's homepage narrative discipline (problem, method, proof, ask) compressed to one service: `../reference-images/youtech-agency/ANALYSIS.md`. Their interior pages are the structural model per interior-buildout-plan.md section 2.
- Ruled editorial lists: e2vc impact rows, obys rule discipline (STYLE_GUIDE 6.10 carries the synthesis).
- Process cards: metacci's outlined step cards (STYLE_GUIDE 6.4).
- What NOT to build: Scorpion's template-stamped sameness (every service page identical but the noun). The layout is shared; the copy, FAQ, deliverables, and process checklists are written per service, per the stamping rules.

## Build with

Existing: `Section`, `SectionHeader`, `Pill`, `Eyebrow`, `Chip`, `NumberedRuledList`, `RuleLink`, `SeparatorIn`, `Reveal`, `BaselineReveal`, `RoughAnnotation`, shadcn `Accordion`, `EDGE`, `OrganizationJsonLd` pattern.

New this flagship session (shared, changelog entries; stampers consume read-only): `CtaBand` (components/shared), `Faq` (components/shared; accordion + FAQPage JSON-LD from one array), `ProcessCard` (components/shared, 6.4 spec), `lib/jsonld.ts` (BreadcrumbList + Service emitters), `lib/services.ts`, `ServicePage` layout component. Round 2 added: `MediaSlot` (components/shared) + `lib/asset-files.ts` (the drop-in map) + `project-guidelines/asset-manifest.md`.

## Motion

- All one-shot entry reveals, standard catalog: hairlines `SeparatorIn`, headers `BaselineReveal`, rows/cards `Reveal` with 60 to 80ms stagger. Nothing scrubbed, nothing pinned, nothing looping.
- H1 underline annotation draws on mount (after the H1 reveal), gentle boil; CTA band bracket draws on entry.
- Accordion open/close: shadcn height transition, house ease.
- Reduced motion: everything settled per 7.8; annotations render drawn, no boil.

## Mobile (375) and tablet (768)

Single column throughout; the spine is already narrow. Breadcrumb row wraps, H1 clamps down via the type scale, CTA pair goes full-width stacked. Process cards stack. Related-pages stacks become one column. FAQ container full width minus gutters, 44px tap targets. Nothing hidden at any width; no horizontal scroll.

## The variation kit (anti-sameness, round 2)

Brad's rule: 15 stamped pages must not read as one template repeated. The SYSTEM stays fixed (breadcrumb open, answer block placement, ruled-row family, spine measure, FAQ, CTA close, SEO contract); each page picks a COMPOSITION from these axes, recorded at the top of its content module:

1. **Hero**: A media-right (the flagship; default), B statement-wide (full-width H1 + answer, the hero media as a wide band directly beneath: for visual services like web-design, video-production, branding), C fragment-led (the UI fragment family, not a photo, carries the hero's right column: for tool-shaped services like GEO, email, custom-development). Variants B and C get built in the first stamping batch (Lane 2 owns `ServicePage.tsx`); no page may use A's exact composition AND A's vignette twice in a row within its group.
2. **UI fragment**: one per page, page-specific, or none (then the hero media must be mapped media, not a placeholder). SEO = rank rows; candidates: send-queue rows (email), review stars skeleton (social), storyboard frames (video). All token-native, no numbers, aria-hidden.
3. **Work band**: after process (default), after spine, or traded for variant B's hero band. Every page keeps at least 2 media slots.
4. **Annotation placement**: the underline word in the H1 and the circled phrase in the spine differ per page.
5. **Deliverable count** (4 to 6) and FAQ count (4 to 6) vary naturally with the copy.

The obsidion-portal page stands outside the kit as the sanctioned richer variant (6.12 exhibit window, never the homepage's portal morph), specced in its own session after the gate.

## Theme, annotations, budgets

- Theme rhythm: light, light, tint, light, light (band), light, (proof), tint, light, accent, dark. Tint carries alternation; no dark section on T2 until a sourced proof band exists.
- Annotations: 3 of 3 spent (H1 underline, spine circle, CTA bracket). The obsidion-portal variant re-budgets in its own spec.
- No pinned runways, no scroll-scrubbed elements, no loops, no WebGL. UI fragments are static compositions, not vignette loops (7.10 loops stay a homepage budget for now).

## Per-page content contract (fill per service, own copy pass each)

- URL, title tag (sitemap.md), meta description, primary keyword
- Variation-kit picks: hero variant, UI fragment (or none), band placement
- H1 (+ underline word), answer block (2 to 3 sentences)
- Asset slots: hero + band ids with real alt text and a drop note (manifest rows added same session)
- Who it is for: 3 situations
- What you get: 4 to 6 deliverables, name + one-liner
- How we do it for many locations: 3 steps, each title + body + 2 to 3 checklist items
- Long-form spine: 2 to 3 H2 sections (+ the circled phrase), enough words to clear 800 on the page total
- FAQ: 4 to 6 service-specific Q&As, answers under 60 words
- Related: 3 service slugs, 2 industry links (image cards, shared industry assets)
- Case study slot: empty until Phase 7 data exists

## Done when (per page)

- [ ] 800+ words server-rendered; answer block within the first screen
- [ ] Service + FAQPage + BreadcrumbList JSON-LD validate
- [ ] Title under 60 chars, description under 155, canonical set
- [ ] Links: 3 related services, 2 industry image cards, breadcrumb to /services/, work band target
- [ ] 2+ media slots defined with real alt text; manifest rows added; no bare-text page
- [ ] Variation-kit picks differ from the neighboring pages in the group
- [ ] No raw `[PLACEHOLDER]` strings visible (MediaSlot placeholders are the designed state)
- [ ] 375 / 768 / 1280 / 1536 + reduced motion checked, no horizontal scroll
- [ ] Own copy pass under copy-rules (Flesch 70+, no banned words, no invented numbers)
