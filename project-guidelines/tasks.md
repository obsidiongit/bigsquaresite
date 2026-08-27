# Build Tasks

Only what is left to do. Endpoint status lives in `sitemap.md` (the single tracker). History, old handoffs, and built-page briefs live in `archive/` (moved 2026-08-27, never delete from it). Log a one-line note here when something ships; there is no separate build log anymore.

Working rules: batch builds now that all three template gates are open (Brad, 2026-08-27); one review round with Brad per batch, not per page. New template types (funnel, blog post, lead magnet, case study) still get one green-lit flagship, reviewed inside the batch. Per page before checkoff: screenshot 375 / 768 / 1280 / 1536 + reduced motion, no overflow, JSON-LD probe, typecheck; stop any dev server before `npm run build`. End every session with a simple list of what was built.

## Batch plan (order of work)

- [x] **Batch 1: /audit/, /contact/, /about/** BUILT 2026-08-27 (briefs v2 written first; audit = T1 single-screen form as the hero; contact = form + shared OfficeCards + D5 FAQ; about = trust page with story/team asset slots, metrics band, CtaBand). Verified 4 widths + reduced motion + JSON-LD per page. AWAITING Brad's one review round for the batch
- [ ] **Batch 2:** /locations/ hub + denver + tampa, /results/ real index (case-study content stays gated on real data), /careers/
- [ ] **Batch 3:** funnel templates /go/, /apply/, /thanks/ (one flagship each inside the batch; alternate palettes per D6) + /ad-credit/ when terms exist
- [ ] **Batch 4:** blog pipeline + 2 posts, lead magnets as assets land, then the D4 franchise service family after the keyword pass
- [ ] Interleaved: homepage punch list, metadata/OG/favicon/Lighthouse (2J), cube sessions (2K), registration-mark removal sweep, Brad's sitewide copy pass

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

## Shared components still owed (Phase 3 remainder)

- [ ] PixelTrail cursor (quiet blue square trail, desktop pointer-fine only, off under reduced motion; STYLE_GUIDE 7.6)
- [ ] Effect library v2 as section specs demand: TypeOn, StickyShowcase, chapter rail, manifesto darkening (STYLE_GUIDE 7.3, 7.4)
- [ ] Ad credit popup (Dialog, exit intent + mobile triggers, 14-day localStorage, route exclusions, POPUP_DEADLINE)
- [ ] Portal scroll set piece once real Obsidion assets exist (STYLE_GUIDE 7.4)

## Backend / integrations

- [ ] GHL API lead capture for the /schedule/ application form (Mike; server-side behind GHL_* env vars; calendar component is RETIRED per decisions.md)
- [ ] Tracking IDs (Meta Pixel, Google tag, GA4 env values)

## Brad-owed content (blocks marked pages, nothing else)

The homepage punch list above, plus: ~37 asset slots in `asset-manifest.md` (drop files in `public/media/`, one row each in `lib/asset-files.ts`), the schedule VSL film + poster (`lib/schedule-media.ts`), real case studies + metrics + testimonials, leadership names/photos, office phones/addresses, socials, logo file, legal copy, ad-credit terms, lead-magnet assets, the Ahrefs keyword pass, FORM_WEBHOOK_URL + tracking IDs. Possible project-brief.md positioning amendment (audience rule).

## Standing rules that bite

- Open layout sitewide (D1); no registration-mark plus signs on any newly built page; existing marks await Brad's site-wide audit
- Audience rule: conversion surfaces never read franchise-only (ecommerce + single-location clients too)
- copy-rules.md governs all copy; flagged drafts, never silent placeholders; Brad does one large sitewide copy sweep later
- Forms: single submitForm path, in-place confirmation, shared `Field` primitive
- Only Brad checks a GATE box for a new template type
