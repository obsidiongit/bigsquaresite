# Industry Page Template (T3) Design Brief

v3, 2026-08-26 (Brad's round-1 flagship review: "pretty solid... 7 or 8 out of 10" but "very minimalistic, with a very standard, templated feel"; wants more playful, more interactive, asset slots so the pages are not "a big wall of text", visible variance between industry pages, SEO still the top priority). v3 adds the ASSET SLOTS, THE BOARD (the template's interactive signature), and the VARIANCE DIALS; the SEO contract is untouched. v2 (2026-08-25) rewrote the v1 outline into the reference-grounded design brief per interior-buildout-plan.md Lane 3 session 1; the sitewide open layout governs (STYLE_GUIDE 4.5, D1); v1's homepage-set-piece section is replaced by the interior-grade process card (STYLE_GUIDE 6.4). Grounded in two captures taken for v2: the structural model's own franchise page (`../reference-images/youtech-agency/pages/franchises/ANALYSIS.md`) and the page we have to outrank (`../reference-images/ignite-visibility/pages/franchise-marketing-company/ANALYSIS.md`).

Role: the site's SEO engine (T3). Four pages at launch (franchise, home-services, legal, healthcare), 30+ sub-verticals later, every one stamped from this template with its own copy pass. Each page owns ONE primary keyword and answers it fast, then proves we know the industry, routes to services, and asks.

Flagship: `/industries/franchise/` (spec: `franchise.md`), designated the most complete page on the site after the homepage (industries-index.md). THE FLAGSHIP GATE applies: no other industry page until Brad checks the Lane 3 GATE box in tasks.md.

## The SEO contract (every instance, non-negotiable)

- 1,500+ words rendered server-side. One primary keyword per page (industries-index.md table), carried by the title tag (sitemap.md), the H1, and the answer block, never stuffed.
- Answer block: the hero lead is 2 to 3 plain sentences a machine can quote, directly answering "what does a [industry] marketing agency do for me." Personas named in it (Ignite's move: the visitor self-identifies in paragraph one).
- FAQ block with FAQPage JSON-LD, 5 to 7 questions (6.7's range) buyers in THIS industry ask (D5: buyer-process questions live on /contact/ and /schedule/, not here).
- BreadcrumbList JSON-LD (Home > Industries > [Name]) mirrored by the visible mono breadcrumb row in the hero.
- Internal links: the 3 or 4 most relevant service pages (the services section), the /industries/ hub (breadcrumb), 1 case study slot (EMPTY until real case studies exist), /schedule/ + /audit/ (CTAs).
- Unique title tag under 60 chars (sitemap.md drafts), meta description under 155 chars written per page, canonical, brand-default OG image.
- No Service JSON-LD here (that is T2); Organization JSON-LD is already sitewide.

## Asset slots (v3, Brad's fill-at-the-end workflow)

Every media moment renders through the shared `<MediaSlot id=...>` (contract in `lib/asset-files.ts`): while an id has no file registered, the slot shows its DESIGNED placeholder (soft `--surf` panel at `--radius-media`, registration marks, a centered ghost brand square, a mono `ASSET` chip naming the wanted shot per copy-rules honesty); dropping a file into `public/media/` and adding one row to `ASSET_FILES` swaps in `next/image` with the alt text carried by the page's content module. Nothing else changes. Every slot is listed in `project-guidelines/asset-manifest.md` (id, page, aspect, suggested content). T3 pages carry 2 slots minimum: the hero object and one mid-spine band. Slots are decorative until filled (`aria-hidden` placeholder); filled images always get real alt text. Lazy below the fold; the hero slot may take priority.

## Section order and design

One page = 10 beats, all EDGE-framed (4.2), zero pinned runways, zero canvas. Long-form copy sits in the ~65ch spine; section headers use the 6.3 huge-left small-right anatomy. `SquareField` mounts as the ambient layer (it is page-agnostic; static under reduced motion), so interior pages inherit the homepage's quiet undercurrent without a set piece.

### 1. Hero (theme light, size lg)

Display type beside a framed media object (v3; the v2 type-only hero read as a wall of text). Never a photo GROUND (Youtech's overlay hero stays not-taken): the media is an object on the paper, and until a real asset lands it is a designed placeholder slot.

- Mono breadcrumb row on a `SeparatorIn` hairline: `INDUSTRIES / FRANCHISE`, the eyebrow family (6.2). "INDUSTRIES" links to `/industries/`; the current page name sits in `--sec-mid`. This is Ignite's visible breadcrumb translated into our meta voice, and the BreadcrumbList schema made visible.
- H1: Bluu at `--text-h1`, sentence case, max ~22ch measure (2 to 3 lines), carrying the primary keyword naturally. ONE hand-drawn annotation: `RoughAnnotation variant="circle"` (or underline where a circle crowds) on the industry word, drawing after the H1 reveal completes, total hero choreography under 1s (7.3 hero exception).
- Answer lead: `--text-lead`, max ~60ch, 2 to 3 sentences. What we do, for whom (name the personas), and the one-line how. This is the page's quotable answer block; write it so it stands alone when lifted.
- CTA pair (6.1, the two-CTA repeat): "Schedule a Call" primary pill to /schedule/, "Get a Free Audit" secondary pill to /audit/.
- Right column (lg+): the HERO MEDIA OBJECT, a `MediaSlot` at 4:3 (~col-span-5) top-aligned to the H1, registration marks on lg+. The v2 hero was type-only and read as the wall-of-text opening Brad flagged; media-as-an-object beside display type is the framed-panel signature at interior scale. Per-page asset; designed placeholder until Brad drops the file.
- Under the CTAs (v3, replacing v2's right-column list): the sub-market MONO STRIP, one line of `--text-mono-sm` uppercase in `--sec-mid` with `/` separators (the film-meta voice), wrapping at narrow widths. Same keyword seeding, less list chrome. Plain text until sub-pages exist.

### 2. The difference (theme light)

Why marketing in this industry is its own job. The educational core; biggest word budget (~450 to 550).

- `SectionHeader`: eyebrow (e.g. "THE INDUSTRY"), H2 at `--text-h2` (flat-H2 rule), support paragraph right (max 40ch).
- Two intro paragraphs, `--text-body`, in the ~65ch spine.
- `NumberedRuledList` (major, 6.10): the 3 or 4 structural differences, each row title + 2 or 3 sentence sub. The approved editorial enumeration; never icon cards.

### 3. Who we work with (theme tint)

The visitor self-identifies (both references do this; Ignite in the hero, Youtech as a checklist card). ~200 to 240 words.

- `SectionHeader`: eyebrow, H2, support right.
- 3 base cards (6.4) in a row (`--paper` face on tint ground, radius 16): a mono outline chip topping each card with the persona's REAL segment fact where one exists (project-brief.md sources "20-500 units", "5 to 50 locations"; a persona without a sourced number gets a plain-words chip, never an invented range), then H3 persona name + 2 or 3 sentence body. No icons, no invented client examples. Cards do not hover (not links).

### 4. The board (theme light; the template's interactive signature, v3)

The playful-interactive moment Brad asked for, built from the brand mark: ONE soft `--surf` panel (radius 24, the ProblemStrip pattern) holding the page's thesis as a toy. Left column inside the panel: eyebrow, H2 (wearing the page's second annotation, a rough underline on its key word), ~60 to 80 words of body copy that INSTRUCTS the visitor to play, and the mono READOUT line. Right, the wider column: a grid of small outlined squares, each one a location/unit (the industry's own noun).

- **The concept is the page's argument made touchable**: every square is a location; interacting with any of them shows the SAME readout (its own pages, ads, budget, report), because every location gets the whole system. The readout's unit index updates (tabular nums); the system chips never change. That constancy IS the demo.
- Mechanics (FooterPixelGrid recipe, board-scoped): a deterministic seed pattern of pre-filled `--acc` squares (SSR-rendered, zero hydration pop); pointer-move paints squares `--acc` and they fade back over ~900ms; fine pointers paint on move, coarse pointers paint on tap only (`touch-action: pan-y`, scrolling never fights). While in view, a quiet ACTIVITY BLIP lights one square every ~2s on a deterministic stride (the system is alive); this is the page's ONE live loop (section 0 budget) and it pauses offscreen.
- The board is `aria-hidden` decoration-plus-play: every claim lives in the adjacent copy (the 6.11 vignette rule). No invented numbers inside: unit indexes are furniture (the calendar-furniture rule), chips name deliverables, the corner counter reads `[unit-noun] 01-N`.
- Reduced motion: the static seed composition, no blips, no paint; the readout shows its rest line.
- **Per-industry SKIN is data, not code**: unit noun, readout chips, grid size, seed pattern, and all copy come from the content module, so stamping restyles the board without touching the component.

### 5. Services for this industry (theme light)

The internal-linking engine, Youtech's franchise-angled service blocks compressed into our ruled-row family. The anti-thin-content rule from D4 applies in miniature: every one-liner is written for THIS industry, never the generic service pitch.

- `SectionHeader`: eyebrow (e.g. "WHAT WE RUN"), H2, support right.
- 4 to 6 ruled link rows (6.10 anatomy + rule-link hover): `[01]` bracketed index in `--sec-acc`, service name at `--text-h3` Apfel 700, industry-specific one-liner below in `--sec-mid`, arrow right sliding +4px on hover, whole row links to `/services/<slug>/`. Slugs from sitemap.md; those routes 404 until Lane 2 ships them, the same known state as the nav.
- The 3-or-4-most-relevant rule (seo-requirements) sets the minimum; 6 is the cap before the list stops being a selection.

### 6. The breadth band (theme light, compact)

The industry's breadth seeded as on-page keywords (Ignite's "sectors" section, quieted). Two sanctioned variants, and a hard rule found in the flagship build: **this band must never repeat the hero's mono index**; the page's spec assigns each list.

- **Sub-markets variant** (default): the future sub-vertical family from industries-index.md (home-services: HVAC, plumbing, roofing...). Chips become links as sub-vertical pages ship (a data change).
- **Sectors variant** (the franchise page, whose sub-markets already live in its hero index): the verticals the industry spans; chips for our other industries become links to the sibling `/industries/` pages once they exist.
- Anatomy either way: eyebrow + one intro line (~20 words) + a wrap row of outline `Chip`s (6.2, mono uppercase).

### 7. The method spine (theme light)

The long-form backbone, added in the flagship build when the rendered page measured ~1,080 words against the 1,500 contract: sections 1 to 5 are compositions, and a T3 page also needs sustained prose that answers the primary keyword in depth (both references carry an equivalent: Youtech's educational block, Ignite's pillar essays). ServicePage's spine idiom at T3 depth:

- 3 to 4 blocks in the ~65ch spine, each an H2 (`--text-h2`, flat-H2 rule) + 2 paragraphs (~100 to 130 words per block): how the work actually RUNS for this industry, month to month. The mechanics the buyer cannot get from a services list: operating rhythm, who pays for what, what the reporting shows whom. (The franchise flagship runs 4, its development motion earning its own block.)
- ONE `MediaSlot` band (16:9, spine width) between two of the blocks (position is a variance dial), punctuating the read the way Youtech intersperses media through its educational blocks. No other chrome: this is the reading section, and the whitespace is the design.

### 8. Proof slot (theme dark; HARD-GATED, renders nothing today)

The one dark moment the theme budget allows an interior page, and it does not mount until real data exists (copy-rules Claims; the ProofBand launch-gate precedent, lib/metrics.ts pattern). Never placeholder cards, never invented numbers. When real:

- One case study told deep (Youtech frame 08): case study card (6.4 lockup: client chip + metric chip pinned on the image, outcome-first headline) beside a challenges/results column pair, plus a "See the Results" rule link to /results/ and the case study page.
- Optionally up to 3 borderless stat tiles (6.4) with CountUp, and/or ONE testimonial lockup (6.4 testimonial card; contract in `../shared/testimonial-card.md`, design in `../home/11.testimonials.md`): real names and companies only.
- Until then the page flows services > sub-markets > process with no gap and no empty frame. The gate is a data-module check, so lighting it up is a data change.

### 9. The first 90 days (theme tint)

The interior-grade process moment. v1 lifted the homepage's 90-day set piece; that grid-and-slab finale is a homepage-only pin (10.how-it-works.md v3.1). Interior pages get the PROCESS CARD instead, STYLE_GUIDE 6.4's metacci pattern, built this flagship as shared `ProcessCard`:

- `SectionHeader`: eyebrow ("THE PLAN" family), H2, support right.
- 3 outlined cards (no fill, 1px `--sec-line`, radius 16), one per phase from `lib/ninety-days.ts` (the single source of record): outline day-range chip with the numbers in `--sec-acc` ("Days 1-10"), short verb title in Apfel 700, one-line body, then the phase's milestones as a check-glyph list (check in `--sec-acc`, text `--text-small`). Milestone DAY numbers stay off interior cards: the twelve day assignments are invented pending confirmation (flag lives in ninety-days.ts); phase ranges are approved structure. The checklist text carries its unverified-against-real-onboarding flag in the spec, not on screen.
- Under the cards: one payoff line (per-page copy, never cloned from the homepage finale) and the three reassurance facts as a quiet check row (month to month, you own your accounts, location-level reporting: all established true copy).

### 10. FAQ (theme light)

STYLE_GUIDE 6.7 exactly (metacci's objection pattern): eyebrow + H2, one bordered container (radius 16, divide-y hairlines) of shadcn Accordion items, max-w ~800px centered inside EDGE. Question Apfel 700 18px, chevron right, answer body in `--sec-mid`, one open at a time, answers under 60 words. 5 to 7 questions phrased the way this industry's buyer types them (both references do industry-specific FAQs here; buyer-process questions belong to Lane 1's pages per D5). FAQPage JSON-LD emitted from the same data array. Strip shadcn preset injections after `add` (CLAUDE.md rule).

### Close: CTA band + footer (site chrome)

The shared `CtaBand` (contract: `../shared/cta-band.md`; built this flagship since no earlier lane has) directly above the shared dark footer. Accent theme, the page's ONE full-accent surface: H2 in Bluu white, body white at 72% max 44ch, inverted white primary pill, `BracketCta` secondary (the white bracket, one annotation slot). Centered content inside EDGE, `--section-y-lg` padding. The v2 band spec predates D1: its GridLines rails and 1200px Container are retired; the open translation is the flat blue statement, nothing else on it.

## Annotation budget (3 per page)

1. Hero circle on the industry word. 2. The board H2's rough underline on its key word (v3). 3. The CTA band bracket. Budget fully spent; a stamped page may move an annotation (a variance dial) but never add a fourth. Interior pages hold the original discipline (the homepage's six-annotation state is its own cleanup item).

## Theme map

light (hero) > light (difference) > tint (personas) > light (board, its surf panel carrying the tint moment) > light (services) > light-compact (breadth band) > light (method spine, media band inside) > [dark proof, gated] > tint (process) > light (FAQ) > accent (CTA) > dark (footer). Tint and the two panel objects carry the alternation; dark appears only when proof is real; accent only in the band.

## Motion

Standard reveal kit, everything one-shot at ~85% viewport (7.3): BaselineReveal on H1/H2s, Reveal staggers on cards and rows, SeparatorIn on every rule, the hero annotation drawing post-reveal, rule-link and pill hovers (7.7). CountUp only inside the gated proof slot with real values. No pins, no scrubs. The BOARD is the page's one live element (its activity blip loop, viewport-paused) and its paint responds to the pointer; everything else is reading speed plus SquareField's ambient drift. Reduced motion per the 7.8 table (SquareField static, board static seed with no blips or paint, annotations pre-drawn, reveals instant).

## The variance dials (v3, the anti-sameness contract)

Brad's rule for the family: "not every page looks exactly the same." Stamping a T3 page means SETTING these dials, and two adjacent industry pages may not share the same setting on (2), (5), and (6):

1. Hero media content + its aspect ratio (4:3 default; 1:1 sanctioned where the asset suits it).
2. The board skin: unit noun, grid size, seed pattern, readout chips, and its copy. This is the loudest dial; the board must FEEL industry-native (locations for franchise, territories for home services, offices for legal, practices for healthcare).
3. Breadth band variant: sub-markets vs sectors (never repeating the hero strip).
4. Spine depth: 3 or 4 blocks, and which gap carries the media band.
5. Section order swap: the board sits after personas (default) OR after services (alternate).
6. Annotation placement: which H1 word wears the circle; which board word wears the underline (a page may trade the circle for an underline where the word shape crowds).
7. Eyebrow labels and persona chip wording (sourced facts only).

The dials are all data or composition-order choices: no new components per stamp. If a stamped page wants a NEW interactive pattern instead of the board, that is a flagship-grade change: bring it back to Brad first.

## Mobile (375)

Single column, nothing hidden: breadcrumb row, H1, lead, CTA pair full width, then the mono sub-market index as the hero's foot row. Persona and process cards stack; ruled rows and the FAQ container run full width minus gutters; chips wrap; CTA band centers with full-width buttons. No horizontal scroll at 375/768/1280/1536.

## Build with

Existing, read-only: `Section`, `SectionHeader`, `NumberedRuledList`, `RuleLink`, `Pill`, `BracketCta`, `Chip`/`Eyebrow`/`BracketIndex` (mono.tsx), `Reveal`, `BaselineReveal`, `SeparatorIn`, `RoughAnnotation`, `SquareField`, `CountUp`, `useReducedMotionSafe`, `EDGE`, `lib/ninety-days.ts`, `lib/site.ts`.

Shared interior primitives, built by Lane 2's parallel flagship session (2026-08-25) and consumed READ-ONLY here per the file-ownership rule: `CtaBand` (the open-layout translation of shared/cta-band.md), `ProcessCard` (6.4; its contract keeps day-range chips a caller variant, so this lane's `PhaseCard` composes the same anatomy locally), `Faq` (6.7 + FAQPage JSON-LD from one array), `lib/jsonld.ts` (breadcrumbJsonLd), `lib/services.ts` (canonical service names for the link rows). Template internals live under `components/sections/industries/` (IndustryPage, IndustryHero, IndustryServiceRows, PhaseCard); per-page content under `lib/industry-pages/` (types, registry, one module per page; the registry IS the flagship gate).

## Done when (every instance)

- [ ] 1,500+ words server-rendered; primary keyword in title, H1, answer lead
- [ ] Answer lead reads standalone; personas named
- [ ] Breadcrumb row + BreadcrumbList JSON-LD; FAQ + FAQPage JSON-LD validate
- [ ] 3 to 6 service links with industry-specific one-liners; case study slot empty (no placeholder proof anywhere)
- [ ] Process cards show phase ranges only (no invented day numbers on screen)
- [ ] Annotation budget: exactly 3 (hero circle, board underline, CTA bracket)
- [ ] Both MediaSlots render designed placeholders (or real assets) and are listed in asset-manifest.md
- [ ] Board: paint + readout + blips work by pointer, tap-only on touch, page scroll never fights; static seed under reduced motion
- [ ] Variance dials set in the page spec, differing from the neighbor page on dials 2, 5, and 6
- [ ] Copy passes copy-rules (no banned words, no em dashes, Flesch 70+, fresh copy per page, zero cloning)
- [ ] 375 / 768 / 1280 / 1536 screenshots + reduced motion pass before checkoff
- [ ] tasks.md updated; session logged in build-log.md

## Open with Brad

- The board's franchise skin ships first: confirm the pattern earns "cool interactive" before the other industries pick their skins.
- SquareField on interior pages: specced ON; kill sitewide-ambient if it reads as homepage-only DNA.
- Hero media aspect (4:3 vs square) once the first real asset exists.
- Proof slot composition when real data lands (deep single story vs tiles + testimonial) can be decided then; the gate keeps it out of review until Brad supplies data.
