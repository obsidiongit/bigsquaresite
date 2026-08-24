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

- [x] 2A. Hero (`2.hero.md` v4; also built Pill, FramedMediaPanel, TitleAssemble, the ink-line set piece)
- [x] 2B. Nav (`1.nav.md` v3; two-pill bar + full-screen overlay index menu, static annotation active marker)

2A + 2B round 1 built 2026-08-23; Brad rejected it in review as generic conversion-page design. Round 2 rebuilt the same day against the corrected direction (briefs now v3; STYLE_GUIDE "direction pivot" changelog entry): hero is the scroll-driven film takeover with no CTAs, nav is a two-pill bar with a full-screen overlay index menu. Round 3 (same day): Brad approved the nav direction; hero takeover reworked per his notes into the pen-pull choreography (2.hero.md v4: ink line traces from the circled words and pulls the film in as a tilted sheet from bottom-left; rails removed from the hero; 360vh scroll room). Lusion.co studied live via wheel-driven capture (frames preserved in `project-sections/reference-images/lusion/live-scroll-capture/`).

Checked off 2026-08-23 with Brad as v1. His verdict on the hero set piece: direction right, execution "clunky and cheap, fragmented"; the Framer Motion sheet entrance is below the bar. **Queued for the next session: rebuild the hero set-piece rendering on a WebGL canvas** (bent/morphing video plane, lusion-style; three + r3f already sanctioned in PROJECT_REQUIREMENTS.md) — see the "Next iteration" block in 2.hero.md. Brad also plans his own nav iteration pass and a decision on the open area above the hero copy. Implementation notes: homepage at `app/(marketing)/page.tsx`, nav in `app/(marketing)/layout.tsx` (keeps funnels nav-free later); shared code: `Pill` (CSS in globals.css), `FramedMediaPanel` (kept for the portal section; hero now renders its own full-bleed media), `TitleAssemble` (built, currently unused); `ClipReveal.onMount`, `RoughAnnotation.staticRender`. Placeholder film: `public/media/hero-poster.jpg` + seamless `hero-loop.mp4` (ffmpeg breathe, 353KB); real 4K film is the one-line `HERO_VIDEO` swap in Hero.tsx. `/results/` stub added. shadcn navigation-menu/sheet/accordion were installed for round 1 and are unused after the pivot; leave for later reuse (footer accordions, dialogs). Verified round 2: 375/768/1280/1536 no overflow, reduced-motion static composition, prod build green. Favicon 404 remains (2J). Open with Brad: "Let's Talk" bar pill label vs copy-rules approved list; optional polish: luminance-sensing nav over the settled film, sound toggle when a scored film exists.
Hero v5 session (2026-08-23, same day): rebuilt the set piece on WebGL per the queued note, then reworked it twice more on Brad's live feedback. Final form (2.hero.md v5; STYLE_GUIDE "hero v5" changelog): glass cube with `--acc` core floats above the copy (Brad's addition: the 3D brand object; his Spline reference screenshots never reached the agent, look pending his sign-off), swoops behind the text on scroll, flattens to a glass pane, film develops over it in ink duotone, balloons with a per-vertex cloth bend into a framed 4vw panel (full-bleed settle retired). Ink line CUT. Canvas actors ease toward scroll via a damped follower (5.5/s); wrapper grew to 320/480vh. three + @react-three/fiber installed (drei deliberately not; PROJECT_REQUIREMENTS updated). New files: `components/sections/home/HeroCanvas.tsx` (lazy chunk). Verified: 375/768/1280/1536 no overflow, reduced motion = static framed panel with zero canvas, prod build green, 3D chunk lazy and off the LCP path. OPEN: 3D chunk ~232KB gz vs the 200KB budget line (three core growth; Brad to accept or fund slimming); cube aesthetic sign-off; v6 idea queued: cube as persistent companion following the page (needs page-level fixed canvas). Playwright headless now launches with `--enable-gpu --use-angle=d3d11` so glass/transmission screenshots reflect real rendering.

Hero v5.1 (same day, Brad's live review of v5): smoke core replaces the solid block (opaque hashed-discard shader wisp; solid core refracted into "multiple cubes"), ior/thickness calmed, spin halved, swoop stretched (timeline in 2.hero.md v5.1; follower 4.5/s), headline raised beside the cube + statement de-collided (was overlapping at 2560), and the held card beat gained the side text block (DRAFT copy flagged; "See the Results" rule link). Verified again at 375/768/1280/1536/1920 + reduced motion. Still open for Brad: side-text copy, cube look sign-off, bundle overage call.

- [x] 2C. Trust marquee + Problem (`3.trust.md`, `4.problem.md`; also builds the numbered ruled list, STYLE_GUIDE 6.10)
- [ ] 2D. Solution + Services (`5.solution.md`, `6.services.md`; also builds BentoPanel, RuleLink, RuledLinkTable) — build 1 done, REJECTED in review 2026-08-24, see the rework note below

2C + 2D built 2026-08-23 (one session, per Brad's ask) together with **hero v6: the cube companion** (the queued page-level canvas). The hero canvas moved to a fixed page-level layer (`components/sections/home/HomeStage.tsx` + `HomeCanvas.tsx`; `HeroCanvas.tsx` deleted); the hero wrapper grew to 374/560vh and its last 1/7 is the REFORM beat (film panel un-balloons back into the glass cube, transmission glass crossfades to alpha glass so the real page shows through it), then the cube travels the new sections as a waypoint companion (right side through trust, quarter-turn ticks per problem row, dives behind the solution bento, climbs the services rail, dissolves; mobile gets a short fade-out over trust). Waypoints live in HomeCanvas and extend per section in 2E/2F. New shared: NumberedRuledList, RuleLink, RuledLinkTable (+ `.row-fill` fill hover in globals.css), BentoPanel; SeparatorIn gained a delay prop; Section gained an `anchor` prop (data-cube-anchor). Verified: prod build green, 375/768/1280/1536 no horizontal overflow, reduced motion = zero canvas + static marquee grid + settled sections. OPEN with Brad: trust tiles are text wordmarks until real partner logo SVGs land (`[PLACEHOLDER]` in TrustMarquee.tsx); the 15 service links use the sitemap.md slugs and 404 until Phase 4; companion path/material is a first pass for his review (same open cube-look sign-off as v5.1); bundle overage call still pending.

**2D review, 2026-08-24 (Brad): REJECTED as built; 2D unchecked. Expect a ton of iteration over multiple sessions.** His verdict on the services section: "very generic SaaS template". It drops straight into a listing of things in a poor format: bad copy, not interactive, boring, a poor way of displaying the information. What it must become: the page should LEAD from the unique showcase sections above (hero film, cube) INTO a more unique section, with a more artistic approach, like the featured-work treatment above it. Calibration he gave: NOT extremely creative, not a portfolio, but clearly a step more unique and designed than what shipped. Reference calibration: the current result leans too much toward "the UTEC inspiration" (his word; most likely Youtech, the conversion-agency reference — CONFIRM with him which reference he means before rebuilding); pulling SOME inspiration from it is useful, but dial it back. Working plan for the rework sessions: confirm the reference read, rewrite `6.services.md` to v3 with the new direction FIRST (brief before build, per the phase loop), then rebuild with interactivity and better copy, and expect 1 to 2+ focused iteration rounds with Brad. Note: his critique named the services region specifically; 2C (trust + problem) was not flagged in this review, and the solution bento was not explicitly ruled on — re-confirm both when reviewing the services rework.
- [ ] 2E. Proof band + Case studies (`7.proof-numbers.md`, `8.case-studies.md`; also builds SectionWipe, MetricBlock, CaseStudyCard)
- [ ] 2F. Obsidion portal (`9.portal.md`; reuses FramedMediaPanel and the numbered ruled list)
- [ ] 2G. How it works + Testimonials (`10.how-it-works.md`, `11.testimonials.md`; also builds ProcessCard, TestimonialCard)
- [ ] 2H. FAQ + Final CTA band (`12.faq.md`, `13.final-cta.md`; builds the shared CtaBand, the page's one accent surface)
- [ ] 2I. Footer (`shared/footer.md`; builds Footer and OfficeClocks)
- [ ] 2J. Homepage metadata, OG image, real favicon asset (404s today), Lighthouse pass (CWV green)
- [ ] 2K. Cube animation quality passes (added 2026-08-24 from Brad's review; plan on a FEW dedicated conversations for this alone). The v6 companion/reform animation is "definitely kind of like a beta": good for what it is, but wonky, with a lot of room to improve. Goal: tighten the whole cube animation until it is a genuinely high-quality element on the page — choreography, easing/damping, the reform beat, the waypoint path through the sections, and the material/look (which also still carries the open v5.1 cube-look sign-off). Everything lives in `components/sections/home/HomeCanvas.tsx` (timeline constants, WAYPOINTS, follower rates, glass params); iterate with the shots pipeline and review each round with Brad.

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
