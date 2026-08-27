# Build Tasks

Only what is left to do. Endpoint status lives in `sitemap.md` (the single tracker). History, old handoffs, and built-page briefs live in `archive/` (moved 2026-08-27, never delete from it). Log a one-line note here when something ships; there is no separate build log anymore.

Working rules: batch builds now that all three template gates are open (Brad, 2026-08-27); one review round with Brad per batch, not per page. New template types (funnel, blog post, lead magnet, case study) still get one green-lit flagship, reviewed inside the batch. Per page before checkoff: screenshot 375 / 768 / 1280 / 1536 + reduced motion, no overflow, JSON-LD probe, typecheck; stop any dev server before `npm run build`. End every session with a simple list of what was built.

## Batch plan (order of work)

- [x] **Batch 1: /audit/, /contact/, /about/** BUILT 2026-08-27; REVIEWED by Brad same day: "good, not great", structure approved, no rebuild wanted. Known placeholders (CTAs, form copy, content) ride the sitewide final pass; pages improve as we play with them
- [ ] **Batch 2:** /locations/ hub + denver + tampa, /results/ real index (case-study content stays gated on real data), /careers/
- [ ] **Batch 3:** funnel templates /go/, /apply/, /thanks/ (one flagship each inside the batch; alternate palettes per D6) + /ad-credit/ when terms exist
- [ ] **Batch 4:** blog pipeline + 2 posts, lead magnets as assets land, then the D4 franchise service family after the keyword pass
- [ ] Interleaved: homepage punch list, metadata/OG/favicon/Lighthouse (2J), cube sessions (2K), registration-mark removal sweep, Brad's sitewide copy pass
- [x] SHIPPED 2026-08-27: sitewide sound design (synth engine, nav toggle, on-by-default) + page load/route transition veil (STYLE_GUIDE 7.11/7.12). REVIEWED by Brad same night: approved as V1 ("really solid"), named a focus point; v2 section below

## Homepage punch list (the remaining ~15%)

Needs Brad (facts and assets, none of which can be invented):
- [ ] The single copy pass: hero card-beat headline + "How We Work" link, featured work support (+ ALL-CAPS support vs copy-rules), ProblemStrip/Solution/Services drafts, portal + newsletter + 90-days copy, ProofBand test-copy lock, "Let's Talk" pill vs approved labels
- [ ] Sourced ProofBand metrics (launch gate in `lib/metrics.ts`; 3-vs-4 call) + real media for its panel
- [ ] 6 real featured-work clients + media (`lib/featured-work.ts`)
- [ ] Real 4K hero film (one-line HERO_VIDEO swap in Hero.tsx)
- [ ] Real 90-day milestones (`lib/ninety-days.ts`, currently invented + placeholder-flagged)
- [ ] Newsletter: 5 client headshots, 4 photos (`lib/newsletter-frames.ts`), a real cadence, confirm "600+ clients" wording
- [ ] Footer facts: socials, two office phones, BIGSQUARE vs BIGSQUARE MARKETING wordmark, keep-or-cut the paint layer
- [ ] Live Obsidion portal code for the window slot (chip drops with it)
- [ ] FORM_WEBHOOK_URL destination (submissions log a server warning until set)
- [ ] Cube look sign-off + the 3D bundle overage call (~232KB gz vs the 200KB line)
- [ ] Reviews to record: 2G1 First 90 Days round 2, 2I footer Back Cover round 2, cube reform round 14 (Brad may have approved verbally; confirm, then check off)

Build items (small, any session):
- [ ] Newsletter polish set: panel presence at 1536, frame cadence vs real photos, remove the headshot note when assets land, confirmation copy, optional cube anchor
- [ ] 2J: homepage metadata, OG image, real favicon asset (404s today), Lighthouse pass (CWV green)
- [ ] 2K: cube animation quality passes, a few dedicated sessions (choreography, easing/damping, waypoint path, material/look), all in `HomeCanvas.tsx`. Prerequisite: gather the waypoint retune list from every section note
- [ ] Migrate NewsletterForm onto the shared `Field` primitive so the form anatomy lives once
- [ ] FAQ accordion open/close height animation (keyframes never defined); one-file fix in a quiet window

## Sound v2 (Brad focus point, est. 1-2 sessions; V1 approved 2026-08-27)

All in the lib/sfx.ts system; keep the 7.11 rules (round-robin variants, ramps not cuts, quiet mix, one mute).

- [ ] Wire the background music loop when Brad's track lands (`MUSIC_SRC` + file in `public/audio/`), then: fade-in level check against the sfx mix, `sfx.duckMusic(true/false)` from the nav menu overlay open/close, and decide tab-blur behavior (duck vs pause)
- [ ] Interaction audio for the homepage three.js cube (HomeCanvas): sounds tied to its scroll moments (turntable spin-up, panel morph beats, release into featured work). Needs a session with the scrub map open; rate-limit so scrubbing never machine-guns
- [ ] A few more effect voices where the site already has moments: menu overlay open/close whoosh (distinct from page whoosh), form submit confirmation chime, FAQ accordion tick, possible ProcessCard/BentoPanel hover distinct from the standard pop
- [ ] Tuning pass on the V1 synths with Brad listening live (pitch set, levels, hover density; compare against the reference oggs in project-sections/reference-images/lusion-audio/)
- [ ] Transition polish ride-along: intro lockup beat + tile sweep timing once heard with sound on real pages

## Shared components still owed (Phase 3 remainder)

- [ ] PixelTrail cursor (quiet blue square trail, desktop pointer-fine only, off under reduced motion; STYLE_GUIDE 7.6)
- [ ] Effect library v2 as section specs demand: TypeOn, StickyShowcase, chapter rail, manifesto darkening (STYLE_GUIDE 7.3, 7.4)
- [ ] Ad credit popup (Dialog, exit intent + mobile triggers, 14-day localStorage, route exclusions, POPUP_DEADLINE)
- [ ] Portal scroll set piece once real Obsidion assets exist (STYLE_GUIDE 7.4)

## Backend / integrations

- [ ] GHL API lead capture for the /schedule/ application form (Mike; server-side behind GHL_* env vars; calendar component is RETIRED per decisions.md)
- [ ] Tracking IDs (Meta Pixel, Google tag, GA4 env values)

## Brad-owed content (blocks marked pages, nothing else)

The homepage punch list above, plus: ~37 asset slots in `asset-manifest.md` (drop files in `public/media/`, one row each in `lib/asset-files.ts`), the schedule VSL film + poster (`lib/schedule-media.ts`), real case studies + metrics + testimonials, leadership names/photos, office phones/addresses, socials, logo file, legal copy, ad-credit terms, lead-magnet assets, the Ahrefs keyword pass, FORM_WEBHOOK_URL + tracking IDs, the looping background music track (~60-90s seamless quiet loop, Suno is fine; drops into `public/audio/` + one-line `MUSIC_SRC` change in lib/sfx.ts). Possible project-brief.md positioning amendment (audience rule).

## Standing rules that bite

- Open layout sitewide (D1); no registration-mark plus signs on any newly built page; existing marks await Brad's site-wide audit
- Audience rule: conversion surfaces never read franchise-only (ecommerce + single-location clients too)
- copy-rules.md governs all copy; flagged drafts, never silent placeholders; Brad does one large sitewide copy sweep later
- Forms: single submitForm path, in-place confirmation, shared `Field` primitive
- Only Brad checks a GATE box for a new template type
