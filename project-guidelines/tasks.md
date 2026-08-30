# Build Tasks

Only what is left to do. Endpoint status lives in `sitemap.md` (the single tracker). History, old handoffs, and built-page briefs live in `archive/` (moved 2026-08-27, never delete from it). Log a one-line note here when something ships; there is no separate build log anymore.

Working rules: batch builds now that all three template gates are open (Brad, 2026-08-27); one review round with Brad per batch, not per page. New template types (funnel, blog post, lead magnet, case study) still get one green-lit flagship, reviewed inside the batch. Per page before checkoff: screenshot 375 / 768 / 1280 / 1536 + reduced motion, no overflow, JSON-LD probe, typecheck; stop any dev server before `npm run build`. End every session with a simple list of what was built.

## Batch plan (order of work)

- [x] **Batch 1: /audit/, /contact/, /about/** BUILT 2026-08-27; REVIEWED by Brad same day: "good, not great", structure approved, no rebuild wanted. Known placeholders (CTAs, form copy, content) ride the sitewide final pass; pages improve as we play with them
- [ ] **Batch 2:** /locations/ hub + denver + tampa, /results/ real index (case-study content stays gated on real data), /careers/. BUILT 2026-08-27 (briefs v2 + 5 pages, LocalBusiness JSON-LD on city pages, all in sitemap.xml; verified 4 widths + reduced motion + build), awaiting Brad's batch review. Owed: office addresses/phones/photos (lib/offices.ts + 2 asset slots), careers remote policy + open roles + application destination (lib/careers.ts), real case studies (lib/featured-work.ts)
- [ ] **Batch 3:** funnel templates /go/, /apply/, /thanks/. BUILT 2026-08-30 (Pane B): `app/(funnel)/` route group (no nav, footer, or sound toggle; noindex; never in sitemap.xml), `lib/funnels/registry.ts`, `components/sections/funnels/`, `lib/track.ts` (no-op until tag IDs). Flagships `/go/audit/` (dark), `/apply/growth-partner/` (tint), `/thanks/audit/` + `/thanks/growth-partner/` (accent). Verified 4 widths + reduced motion + form flow + build; awaiting Brad's batch review. Owed: video URL + poster, one sourced result, budget ranges + qualifying floor, turnaround, offer terms. /ad-credit/ still 404: no offer terms posted yet
- [ ] **Batch 4:** blog pipeline + 2 posts (BUILT 2026-08-30, Pane A: MDX pipeline, /blog/ + 2 posts, /resources/ with request forms, the 404; awaiting Brad's review), lead magnets as assets land, then the D4 franchise service family after the keyword pass
- [ ] Interleaved: homepage punch list, metadata/OG/favicon/Lighthouse (2J), cube sessions (2K), registration-mark removal sweep, Brad's sitewide copy pass
- [x] SHIPPED 2026-08-27: sitewide sound design (synth engine, nav toggle, on-by-default) + page load/route transition veil (STYLE_GUIDE 7.11/7.12). REVIEWED by Brad same night: approved as V1 ("really solid"), named a focus point; v2 section below

## Brad's check-in, 2026-08-29 (goal: launch-ready this weekend)

Site state: 35 pages resolve. Missing before launch: /leadership/ (names + photos), /ad-credit/ (terms), /blog/ + 2 posts, /resources/ + lead magnets, /go/ /apply/ /thanks/ funnel templates, a real 404 page (app/not-found.tsx does not exist), favicon (404s today).

Brad's dislikes and wants, in his words, sorted into work:

Quick wins (this session):
- [x] DONE 2026-08-29. Hero bottom strip: cut "BigSquare / Brand Film", "Nº001 / ©2026", and the "+" corner marks in `components/sections/home/Hero.tsx` (FilmMeta + PanelMarks). A 50%-opacity office video goes behind the hero when Brad's asset lands
- [x] DONE 2026-08-29 (opt-in via data-sfx; nav + featured work cards tagged). Hover sound density: too many pops. `components/sound/SoundProvider.tsx` pops on every a/button sitewide. Switch to opt-in (`data-sfx` only), then re-add hover pops on the few surfaces that earn it (nav, primary CTAs, featured work cards)
- [x] DONE 2026-08-29 (Lenia Mono on --t/--m, Casual Human on --a/font-accent, hero "each one." is the first accent use; headlines moved to Lenia Mono 700 + ss01 filled-O alternate 2026-08-30; alt dials .alt-o/.alt-full/.alt-none). Fonts polish later: tracking on the display scale, where salt earns a place, kill the Bluu/Apfel @font-face blocks. New fonts: Brad has a zip with 2 licensed fonts (main + a playful scribble/handwriting accent). Drop into `public/fonts/`, swap the @font-face block in `app/globals.css`, keep Bluu/Apfel as fallback until sign-off. The accent font pairs with the scribble underline moments. Amends decisions.md "Fonts"

Next conversation, 3 panes in parallel:
- [x] DONE 2026-08-30 (Pane A). Owed: Brad confirms the 5 lead-magnet working titles in lib/resources.ts and picks the 404 lines he likes. Pane A: /blog/ + 2 posts (MDX), /resources/ shell, app/not-found.tsx (Brad: FUN and unique, big editorial type, portfolio style). Handoffs for all three panes: `project-guidelines/handoffs-2026-08-30.md`. Brad 2026-08-29: LAUNCH WITH blog and resources. Build the blog so the scheduled writer below can drop posts in with zero code: `content/blog/<slug>.mdx` with frontmatter (title, description, date, author, tags, draft), a `lib/blog.ts` loader, /blog/ index + /blog/[slug]/ page with Article JSON-LD, sitemap.ts picks posts up automatically, `draft: true` posts never render or list. Seed `content/blog/TOPICS.md` with ~10 topics
- [x] Pane B: funnel templates /go/, /apply/, /thanks/ (Batch 3). DONE 2026-08-30, see the Batch 3 line
- [ ] Pane C: nav rebuild (Brad dislikes the Menu button, the Let's Talk button, and the sound button; wants them simpler and more unique; he has ideas, ask first) + footer redo ("good not great, too much chaos", cleaner and more stylistic)

Then:
- [ ] The big copy pass, one conversation: 210 franchise/multi-location mentions across 38 files. New rule: BigSquare is a full-stack marketing agency with strong creative. Franchise and multi-location is one big lane, not the whole road. Ecommerce, software brands, and single-location clients read as equals. Applies to titles, metas, heros, JSON-LD. Home title tag changes too
- [ ] "Everything feels bigger" pass: portfolio-style scale (type, media, spacing) while still reading as an agency that serves brands. Blend of both
- [ ] Premium cube: Brad is building an award-show-grade WebGL version in a separate project; it drops into `HomeCanvas.tsx` when ready. Do not spend cube sessions here until then
- [ ] Music loop: a song is being made for the site (Lusion-style loop). Wire via `MUSIC_SRC` when it lands (see Sound v2)
- [ ] Placeholder assets: Brad's designer is producing them now. Sweep `asset-manifest.md` slots as files land

## Blog cadence: scheduled Claude writer (Brad 2026-08-29, "regular blog posts on a cron job for SEO")

How it works, once Pane A ships the MDX pipeline:
1. A Claude Code cloud routine (claude.ai/code/routines, created with `/schedule`) runs every Monday 6:00am Denver (12:00 UTC, cron `0 12 * * 1`). Cloud agent, its own checkout of github.com/obsidiongit/bigsquaresite, model claude-sonnet-5.
2. It reads `content/blog/TOPICS.md` (the queue: one line per topic, target keyword, angle, which service or industry page it should link to; seeded from the Ahrefs keyword pass, Brad or Mike keep it topped up), takes the top unwritten topic, writes one 900-1400 word post to `content/blog/<slug>.mdx` following copy-rules.md (no banned words, no em dashes, no invented numbers or client names, `[PLACEHOLDER]` for anything it cannot source), links 2-3 internal pages, marks the topic done in TOPICS.md.
3. It opens a PR titled "blog: <post title>". Brad reviews on GitHub; merge = publish (Vercel deploys main). Nothing goes live without a human merge.
4. Twice a month is a fine start (cron `0 12 1,15 * *`); weekly once the queue is deep enough.

Prerequisites, in order:
- [x] DONE 2026-08-30: Pane A shipped the MDX pipeline + `content/blog/TOPICS.md` with 12 seeded topics; `project-sections/blog/routine-prompt.md` updated to the built contract
- [ ] Install the Claude GitHub App on obsidiongit/bigsquaresite (https://claude.ai/code/onboarding?magic=github-app-setup); the routine cannot clone or open PRs without it (the /schedule check could not verify access on 2026-08-29)
- [ ] Create the routine with `/schedule` (environment "Default", env_01Fx9mjBD667qMn9xcsXLP9G; the prompt draft lives in `project-sections/blog/routine-prompt.md`)
- [ ] First run by hand (`run now`), review the PR, tune the prompt, then let it ride

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
