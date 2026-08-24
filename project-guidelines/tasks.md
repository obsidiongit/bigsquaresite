# Build Tasks

Working rules: one section or page per session. Hero first on any new page. Check mobile (375 / 768 / 1280 / 1536) before checking anything off. Follow STYLE_GUIDE.md and the section spec. Update these checkboxes as work completes.

This is a living list. Phases get added or reordered as the build teaches us things; add new phases at the bottom with a dated note.

## Phase 1: Project setup
- [x] Scaffold Next.js (App Router, TypeScript) in this repo; verify `public/fonts/` woff2 files survive
- [x] Install dependencies from PROJECT_REQUIREMENTS.md, nothing else
- [x] `globals.css`: @font-face rules, palette variables (all four, Graphite default), `@theme inline` mapping, shadcn token bridge (all per STYLE_GUIDE.md)
- [x] Root layout: font preloads, metadata defaults (title template, canonical, OG image), trailing-slash redirects
- [x] shadcn init; confirm semantic tokens resolve to the palette
- [x] `<Logo />` placeholder component (square outline in `--acc`, "logo" inside); never hard-coded elsewhere
- [x] Tracking components (Meta Pixel, Google tag, GA4) reading NEXT_PUBLIC_* env vars, values empty, loaded after hydration
- [x] Single form server action posting to FORM_WEBHOOK_URL with UTM params + page slug on every submission
- [x] `sitemap.ts` and `robots.ts` (noindex rules for /go/, /apply/, /thanks/)
- [x] Legal skeletons: /privacy-policy/ and /terms/ (heading, last-updated, section headings, `[PLACEHOLDER: legal copy]`)
- [x] Stub routes for /schedule/ and /audit/ so every CTA resolves from day one (real pages in Phase 7)
- [x] Organization JSON-LD sitewide

## Phase 2 pre-work: reference capture and design system synthesis (added 2026-08-21, complete)
- [x] Scrape 9 reference sites (lusion, obys-aim, dropbox-brand, youtech-agency, readymag, e2vc, metacci, pear-no, pxpush): desktop + mobile captures at scroll depths, extracted tokens, ANALYSIS.md per site with ranked steals and do-not-take lists
- [x] Deep dives: e2vc annotation-system DOM probe, pear-no and pxpush full code reverse-engineering
- [x] Create STYLE_GUIDE.md from the moodboard + all 9 analyses (E2VC primary anchor; signature moves, tokens, components, motion system)
- [x] Update 0.design-moodboard.md with the scrape outcome and direction changes; add roughjs to PROJECT_REQUIREMENTS.md

## Phase 2: Homepage (sections in spec order)
Overrides from decisions.md: 3 metrics (three-up), 3 case study cards + "See All Results", 2 testimonials. All values `[PLACEHOLDER]` until real numbers exist.

Groundwork: build these with the first section that needs them (the hero needs all four), as shared code from day one.
- [x] 0a. globals.css additions per STYLE_GUIDE.md 1.2, 3.2, 4.1, 5, 7.2: `--accondark`/`--linedark`/`--lineacc`, `--radius-media`, selection color, type scale and section rhythm tokens, `data-theme` section scopes + `sec-*` utilities, ease and duration tokens (mirrored in `lib/motion.ts` for Framer Motion)
- [x] 0b. Motion primitives v1 (STYLE_GUIDE.md 7.3): MotionConfig reduced-motion wrapper, Reveal, BaselineReveal, WordReveal, CountUp, SeparatorIn, ClipReveal
- [x] 0c. Layout primitives (STYLE_GUIDE.md 4.3, 5, 6.3): Section wrapper with `data-theme`, GridLines rails, registration marks, InfoBar, SectionHeader with Nº labels
- [x] 0d. RoughAnnotation primitive (bracket/circle/underline) + Bracket CTA (STYLE_GUIDE.md 6.1, 7.3, 8)

Groundwork notes (2026-08-21): dev-only test bed at `app/dev/styleguide/page.tsx` (404s outside development, not in sitemap.ts) renders every primitive on all four theme grounds; verified 375/768/1280/1536 plus reduced motion, no horizontal overflow, no hydration errors. Site favicon is still missing (404s); needs a real icon asset in a later session.

Restructured 2026-08-23 with Brad: the old flat section list risked a one-shot generic build. Every home spec in `project-sections/home/` was rewritten into a reference-grounded design brief v2 (the old specs pre-dated the scrape and cited only Youtech/Scorpion; three contradicted STYLE_GUIDE.md). Locked decisions from that session: hero is statement-over-panel; problem/solution/services go editorial + bento (statement + numbered ruled rows, unequal bento, ruled index tables); motion is the specced system only with the scrubbed portal set piece deferred until real assets; build runs in the paired phases below, one phase per session, hero first.

Per-phase loop: read the brief and open its "Steal from" reference frames, build, screenshot 375/768/1280/1536 plus reduced motion, review with Brad, 1 to 2 focused iteration rounds, then check off.

- [ ] 2A. Hero (`2.hero.md`; also builds FramedMediaPanel and TitleAssemble)
- [ ] 2B. Nav (`1.nav.md`; ink-on-paper bar, mega menu, Sheet, static annotation active marker)
- [ ] 2C. Trust marquee + Problem (`3.trust.md`, `4.problem.md`; also builds the numbered ruled list, STYLE_GUIDE 6.10)
- [ ] 2D. Solution + Services (`5.solution.md`, `6.services.md`; also builds BentoPanel, RuleLink, RuledLinkTable)
- [ ] 2E. Proof band + Case studies (`7.proof-numbers.md`, `8.case-studies.md`; also builds SectionWipe, MetricBlock, CaseStudyCard)
- [ ] 2F. Obsidion portal (`9.portal.md`; reuses FramedMediaPanel and the numbered ruled list)
- [ ] 2G. How it works + Testimonials (`10.how-it-works.md`, `11.testimonials.md`; also builds ProcessCard, TestimonialCard)
- [ ] 2H. FAQ + Final CTA band (`12.faq.md`, `13.final-cta.md`; builds the shared CtaBand, the page's one accent surface)
- [ ] 2I. Footer (`shared/footer.md`; builds Footer and OfficeClocks)
- [ ] 2J. Homepage metadata, OG image, real favicon asset (404s today), Lighthouse pass (CWV green)

## Phase 3: Shared components (whatever Phase 2 did not already produce)
Trimmed 2026-08-23: CTA band, footer, case study card, testimonial card, metric block, and TitleAssemble now ship inside build phases 2A to 2I above.
- [ ] PixelTrail cursor (quiet blue square trail, desktop pointer-fine only, off under reduced motion; STYLE_GUIDE.md 7.6)
- [ ] Effect library v2 as section specs demand: TypeOn, StickyShowcase, chapter rail, manifesto darkening (STYLE_GUIDE.md 7.3, 7.4)
- [ ] Ad credit popup (Dialog, exit intent + mobile triggers, 14-day localStorage, route exclusions, POPUP_DEADLINE)
- [ ] Portal scroll set piece once real Obsidion assets exist (deferred 2026-08-23; STYLE_GUIDE 7.4 frame sequence or fragment assembly)

## Phase 4: Service, industry, and location pages
Create the spec from the template before building each page; order matches sitemap.md.
- [ ] Service page layout from `_service-page-template.md` (one component, per-page content)
- [ ] Organic Marketing: seo, generative-engine-optimization, social-media, content-marketing, email, obsidion-portal (richer layout per services-index note)
- [ ] Paid Advertising: paid-search, google-local-services-ads, paid-social, amazon-ads, creator-network
- [ ] Design & Development: web-design, branding, video-production, custom-development
- [ ] Service JSON-LD + internal links (2 industries + 1 case study per page)
- [ ] /industries/ index
- [ ] Industry pages: franchise (most complete page after homepage), home-services, legal, healthcare (1,500+ words each)
- [ ] /locations/ index
- [ ] /locations/denver/ and /locations/tampa/ (LocalBusiness JSON-LD, `[PLACEHOLDER]` office info)

## Phase 5: Funnels, lead magnets, booking
- [ ] Custom GHL booking component (styled placeholder first, API integration behind GHL_* env vars)
- [ ] VSL landing template (/go/[slug]/, no nav/footer, noindex, video events)
- [ ] Application funnel template (/apply/[slug]/, multi-step form, qualify events)
- [ ] Thank-you template (/thanks/[slug]/, calendar/download/contact variants)
- [ ] Lead magnet template (/resources/[slug]/) + /resources/ index
- [ ] Lead magnets 1 through 5 (specs in project-sections/lead-magnets/)

## Phase 6: Blog
- [ ] MDX pipeline (@next/mdx), /blog/ index, /blog/[slug]/ layout
- [ ] Article JSON-LD, BreadcrumbList, per-post OG
- [ ] Post template with internal-link rule (1 service + 1 industry link per post)
- [ ] 2 launch posts `[PLACEHOLDER: topics from keyword research]`

## Phase 7: Company and conversion pages (added 2026-08-20)
The original six phases did not cover these routes; specs now exist in project-sections/company/, /results/, /conversion/. Pull any of these forward if priorities shift; /schedule/ and /audit/ run on Phase 1 stubs until then.
- [ ] /schedule/ (real page on the booking component; primary conversion)
- [ ] /audit/ (real form page)
- [ ] /contact/
- [ ] /ad-credit/
- [ ] /about/
- [ ] /leadership/ (blocked until real people/photos provided)
- [ ] /careers/
- [ ] /results/ index
- [ ] Case study pages (blocked until real data; template ready)
