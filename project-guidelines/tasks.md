# Build Tasks

Working rules: one section or page per session. Hero first on any new page. Check mobile (375 / 768 / 1280 / 1536) before checking anything off. Follow STYLE_GUIDE.md and the section spec. Update these checkboxes as work completes.

Per-phase loop for design-led work: read the brief and open its "Steal from" reference frames, build, screenshot 375/768/1280/1536 plus reduced motion, review with Brad, 1 to 2 focused iteration rounds, then check off.

This is a living list. Phases get added or reordered as the build teaches us things; add new phases at the bottom with a dated note. Session history (build rounds, Brad's review verdicts, engineering findings) lives in `build-log.md`, restructured out of this file 2026-08-25; keep entries here to a checkbox plus a one-line status and log the detail there.

## Where things stand (2026-08-25)

- Homepage: built end to end (hero film + cube companion through footer). Brad's estimate: 70 to 80% done. What remains is the punch list below (copy pass, real assets, metadata, cube retunes, two pending reviews), not new sections.
- Interior pages (Phases 4 to 7): not started. Every nav/footer/services link beyond the homepage 404s or lands on a Phase 1 stub. Planning doc: `interior-buildout-plan.md` (draft 2026-08-25, iterating with Brad).

## Phase 1: Project setup (complete)
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

## Phase 2 pre-work: reference capture and design system synthesis (complete, 2026-08-21)
- [x] Scrape 9 reference sites, desktop + mobile at scroll depths, extracted tokens, ANALYSIS.md per site
- [x] Deep dives: e2vc annotation-system DOM probe, pear-no and pxpush full code reverse-engineering
- [x] Create STYLE_GUIDE.md from the moodboard + all 9 analyses (E2VC primary anchor)
- [x] Update 0.design-moodboard.md with the scrape outcome; add roughjs to PROJECT_REQUIREMENTS.md

## Phase 2: Homepage

Section order as shipped: Hero (film + cube) → Featured Work → ProblemStrip → Solution (card sweep) → Search → ProofBand → TrustMarquee → Services (spotlight index) → Portal → Newsletter → First 90 Days (morphs into the closing CTA) → Footer. Homepage close restructured 2026-08-25: testimonial and FAQ retired from the homepage; their patterns and SEO value move to interior pages.

- [x] 0a-0d. Groundwork: globals tokens, motion primitives v1, layout primitives, RoughAnnotation + Bracket CTA; dev test bed at `/dev/styleguide`
- [x] 2A. Hero (`2.hero.md` v6.1): scroll-driven film takeover + glass cube on WebGL, checkpoints, Lenis smooth scroll + progress rail, card-beat headline (copy DRAFT). History: build-log "2A Hero + 2B Nav"
- [x] 2B. Nav (`1.nav.md` v3): two-pill bar + full-screen overlay index menu
- [x] 2B2. Featured work (`2b.featured-work.md` v6): approved 2026-08-24 (hero + film + featured work together). Panel morph rounds 1-11 in the log; 6 placeholder cards await real clients + media
- [x] 2C. Trust marquee + Problem (`3.trust.md`, `4.problem.md`): problem section superseded by 2D-R; marquee moved to the proof block and rebuilt as the full-color 24-logo strip
- [x] 2D. Services first build: REJECTED 2026-08-24 ("very generic SaaS template"); triggered the region pivot to the Youtech open layout (build-log "2D services and the region pivot")
- [x] 2D-R. Lower region rebuild part 1 (`4.problem.md` v3.1, `5.solution.md` v3.1, `5b.search.md` v2.3, `6.services.md` v4): ProblemStrip + Solution APPROVED; Search with Brad's locked copy; card sweep pinned runway; Services spotlight index + cube dock ("pretty good", 2026-08-25)
- [x] 2E-R. Lower region rebuild part 2 (`7.proof-numbers.md` v3.4, `3.trust.md` v2.6): ProofBand + TrustMarquee shipped; homepage testimonial RETIRED. Open content items are in the punch list
- [x] 2E. Case studies remainder (`8.case-studies.md`): RETIRED (the grid became 2B2; case-study depth lives in /results/, Phase 7)
- [ ] 2F. Obsidion portal (`9.portal.md` v3): static window + the cube-reforms-into-the-window set piece SHIPPED and verified. Open: Brad's live portal code fills the window slot (chip drops with it), copy pass, beat timings + hold scale retune with 2K
- [ ] 2F2. Newsletter (`9b.newsletter.md` v1): built; in-place confirmation (no-navigation form rule, now sitewide in STYLE_GUIDE 6.13). Open items in the punch list
- [x] 2G. Testimonial carousel: RETIRED from the homepage. `11.testimonials.md` + `shared/testimonial-card.md` stay as the interior-page pattern once real testimonials exist
- [ ] 2G1. First 90 days (`10.how-it-works.md` v3.1): round 2 built (pinned 160svh runway, scrub, merge, CTA-morph finale). AWAITING Brad's round-2 review
- [x] 2H. FAQ + final CTA: restructured 2026-08-25. Closing CTA = the 2G1 morph finale (`13.final-cta.md` rules govern the settled state); FAQ CUT from the homepage. Where `12.faq.md` content + FAQPage JSON-LD land is an interior-pages decision (plan doc)
- [ ] 2I. Footer (`shared/footer.md` v3.1): Back Cover round 2 shipped (quiet columns + cropped wordmark set piece + paint layer). AWAITING Brad's screenshot review; open facts in the punch list
- [ ] 2J. Homepage metadata, OG image, real favicon asset (404s today), Lighthouse pass (CWV green)
- [ ] 2K. Cube animation quality passes: plan a FEW dedicated sessions (choreography, easing/damping, waypoint path, material/look; cube-look sign-off still open). Everything lives in `HomeCanvas.tsx`. DONE so far: turntable rate (rounds 12-13), the reform transition rebuilt as one contraction with spin-in + slow reverse glide (round 14, build-log; AWAITING Brad's review, knobs listed there)

### Homepage punch list (the remaining 20 to 30%)

Needs Brad (facts and assets, none of which can be invented):
- [ ] The single copy pass: hero card-beat headline + "How We Work" link, featured work support (+ ALL-CAPS support vs copy-rules), ProblemStrip/Solution/Services drafts, portal + newsletter + 90-days copy, ProofBand test-copy lock, "Let's Talk" pill vs approved labels
- [ ] Sourced ProofBand metrics (launch gate in `lib/metrics.ts`; 3-vs-4 call) + real media for its panel
- [ ] 6 real featured-work clients + media (`lib/featured-work.ts`)
- [ ] Real 4K hero film (one-line HERO_VIDEO swap in Hero.tsx)
- [ ] Real 90-day milestones (`lib/ninety-days.ts`, currently invented + placeholder-flagged)
- [ ] Newsletter: 5 client headshots, 4 photos (`lib/newsletter-frames.ts`), a real cadence, confirm "600+ clients" wording
- [ ] Footer facts: socials, two office phones, BIGSQUARE vs BIGSQUARE MARKETING wordmark, keep-or-cut the paint layer
- [ ] Live Obsidion portal code for the window slot
- [ ] FORM_WEBHOOK_URL destination (submissions log a server warning until set)
- [ ] Cube look sign-off + the 3D bundle overage call (~232KB gz vs the 200KB line)
- [ ] Pending reviews: 2G1 round 2, 2I footer, Search round 3 shots

Build items (small, any session):
- [ ] Newsletter polish set: panel presence at 1536, frame cadence vs real photos, remove the headshot note when assets land, confirmation copy, optional cube anchor
- [ ] Decide + relocate `12.faq.md` content and FAQPage JSON-LD (interior pages; see plan doc)
- [ ] 2K prerequisite: waypoint retune list gathered from every section note (all currently "placeholder-grade for 2K")

## Phase 3: Shared components (whatever Phase 2 did not already produce)
Trimmed 2026-08-23: CTA band, footer, case study card, testimonial card, metric block, and TitleAssemble now ship inside build phases 2A to 2I above.
- [ ] PixelTrail cursor (quiet blue square trail, desktop pointer-fine only, off under reduced motion; STYLE_GUIDE.md 7.6)
- [ ] Effect library v2 as section specs demand: TypeOn, StickyShowcase, chapter rail, manifesto darkening (STYLE_GUIDE.md 7.3, 7.4)
- [ ] Ad credit popup (Dialog, exit intent + mobile triggers, 14-day localStorage, route exclusions, POPUP_DEADLINE)
- [ ] Portal scroll set piece once real Obsidion assets exist (deferred 2026-08-23; STYLE_GUIDE 7.4 frame sequence or fragment assembly)
- [ ] Shared `Field` primitive extracted from NewsletterForm when the audit/contact forms are built (STYLE_GUIDE 6.13)

## Phase 4: Service, industry, and location pages
Planning note 2026-08-25: the buildout order, template system, and open design decisions for Phases 4 to 7 now live in `interior-buildout-plan.md`. Lock that doc with Brad before building; create the spec from the template before building each page; order matches sitemap.md.
FLAGSHIP GATES (added 2026-08-25, Brad's rule): one page of each style gets built and green-lit BEFORE any stamping. Only Brad checks a GATE box; while a gate is unchecked, building further pages of that template is out of scope for any agent.
- [ ] Service page layout from `_service-page-template.md` (one component, per-page content); flagship: /services/seo/
- [ ] **GATE (Lane 2): Brad green-lights /services/seo/.** No other service page may be built until this box is checked
- [ ] Organic Marketing: seo, generative-engine-optimization, social-media, content-marketing, email, obsidion-portal (richer layout per services-index note)
- [ ] Paid Advertising: paid-search, google-local-services-ads, paid-social, amazon-ads, creator-network
- [ ] Design & Development: web-design, branding, video-production, custom-development
- [ ] /services/ hub page (added to sitemap.md 2026-08-25, D2; carries the #group anchors the homepage Services heads target)
- [ ] Service JSON-LD + internal links (2 industries + 1 case study per page)
- [ ] Franchise/multi-location URL family: ~10 service-template variants (D4, approved 2026-08-25; slugs from the Ahrefs keyword pass, then amend sitemap.md; build after the 15 core service pages)
- [ ] Industry page flagship: /industries/franchise/ (most complete page after homepage, 1,500+ words)
- [ ] **GATE (Lane 3): Brad green-lights /industries/franchise/.** No other industry page may be built until this box is checked
- [ ] /industries/ index
- [ ] Industry pages: home-services, legal, healthcare (1,500+ words each)
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
The original six phases did not cover these routes; specs now exist in project-sections/company/, /results/, /conversion/. Pull any of these forward if priorities shift; /schedule/ and /audit/ run on Phase 1 stubs until then. The plan doc proposes pulling /schedule/, /audit/, /contact/, and /about/ forward.
- [ ] /schedule/ (real page on the booking component; primary conversion). Lane 1's FLAGSHIP
- [ ] **GATE (Lane 1): Brad green-lights /schedule/.** No other conversion or company page may be built until this box is checked
- [ ] /audit/ (real form page)
- [ ] /contact/
- [ ] /ad-credit/
- [ ] /about/
- [ ] /leadership/ (blocked until real people/photos provided)
- [ ] /careers/
- [ ] /results/ index
- [ ] Case study pages (blocked until real data; template ready)

## Phase 8: Interior-page buildout planning (added 2026-08-25)
- [x] Full project audit (2026-08-25): homepage link map, competitor sitemap synthesis (Scorpion/Youtech/Ignite), interior spec inventory, design-vocabulary handoff, constraints sweep. Findings folded into `interior-buildout-plan.md`
- [x] tasks.md restructure: session history moved to `build-log.md`, punch list consolidated (2026-08-25)
- [x] Iterate `interior-buildout-plan.md` with Brad (2026-08-25): ALL SIX decisions LOCKED. D1 open layout sitewide, D2 /services/ hub (in sitemap.md), D3 conversion-first, D4 franchise URL family approved as service-template wave 2, D5 FAQ to contact + service pages, D6 alternate palettes on ad landers. Plan is v1.2 with the three agent lane briefs in its appendix
- [x] STYLE_GUIDE hard update (2026-08-25, D1): open layout promoted to the sitewide system, instrument layer (rails, InfoBar, Nº labels, Container-as-chrome) retired, ruled rows + mono meta + registration marks kept as accents; changelog entry "the open layout goes sitewide". No separate `_interior-system.md`: the style guide is the single source
- [x] Doc hygiene from the audit (2026-08-25): decisions.md "Amendments" section added (AI-naming exception mirrored, open-layout pointer, proof-density reconciled, portal presentation superseded, trailing-slash + funnel-noindex recorded, D1-D6 recorded)
