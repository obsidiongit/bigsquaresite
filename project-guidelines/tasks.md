# Build Tasks

Only what is left to do. Endpoint status lives in `sitemap.md` (the single tracker). History, old handoffs, and built-page briefs live in `archive/` (never delete from it); this file's completed narrative moved to `archive/build-log.md` on 2026-08-31.

Working rules: batch builds (Brad, 2026-08-27); one review round with Brad per batch, not per page. New template types still get one green-lit flagship, reviewed inside the batch. Per page before checkoff: screenshot 375 / 768 / 1280 / 1536 + reduced motion, no overflow, JSON-LD probe, typecheck; stop any dev server before `npm run build`. End every session with a simple list of what was built.

State (Brad, 2026-08-31): every URL in `sitemap.md` resolves and is built. "We got the majority of the meat and bones built; now fit, finish, polish." What is left: the handoff buckets below, the finalization passes, and content drops. Nothing is a new template.

## DEVELOPER HANDOFF (Brad, 2026-08-30): what to pick up, in order

Brad is finishing his section of the work and handing the site to the developer to finalize before go-live. The STATUS column in `sitemap.md` is the page-by-page truth. What is left falls into 4 buckets:

**1. Not built yet (the only real gaps):**
- [ ] `/resources/[slug]/` lead magnet pages: blocked on Brad's 5 picks (his whiteboard; research in `project-sections/lead-magnets/brainstorm-2026-08-31.md`; needs its own iteration session, MUST land before launch). When decided: 5 rows in `lib/resources.ts`, 5 specs in `project-sections/lead-magnets/`, then the pages and assets. `/resources/` itself is live with request forms in the meantime
- [ ] Wave 2 service pages (D4, ~10 franchise/multi-location variants of the service template): blocked on the Ahrefs keyword pass for slugs. Template exists; this is registry rows + copy per page
- [ ] `/press/`: post-launch only, gated on 3+ real placements (blog-plan.md section 4)

**2. Blog automation (Brad passed these 3 to the developer explicitly):**
- [ ] Install the Claude GitHub App on obsidiongit/bigsquaresite (https://claude.ai/code/onboarding?magic=github-app-setup); the routine cannot clone or open PRs without it (the /schedule check could not verify access on 2026-08-29)
- [ ] Create the writer routine with `/schedule` (environment "Default", env_01Fx9mjBD667qMn9xcsXLP9G; the prompt lives in `project-sections/blog/routine-prompt.md`; the job env must install Playwright in its own step, it is deliberately not in package.json). Full setup, both hosting options: `project-sections/blog/blog-plan.md` section 3
- [ ] First run by hand (`run now`), review the PR, tune the prompt, then let it ride
- [ ] Stretch: figure videos (CSS-animate the existing figure HTMLs, capture to webm, `<FigureVideo>` MDX piece + reduced-motion poster fallback; blog-plan.md 2c). Only after the still system is in use (stills approved 2026-08-30)

**3. Wiring and launch plumbing (no design work):**
- [ ] `FORM_WEBHOOK_URL` env: every form posts through one `submitForm` path (`lib/form-action.ts`) and logs a server warning until this is set
- [ ] GHL API capture for `/schedule/` + `/apply/` (server-side only, `GHL_*` env vars; see "Backend / integrations" below)
- [ ] Tracking IDs: `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GTAG_ID`, `NEXT_PUBLIC_GA4_ID` (components built, values empty; `lib/track.ts` is a no-op until then). When wiring: the shipped privacy policy states we honor Global Privacy Control, so the tag loader must skip ad tags when `navigator.globalPrivacyControl` is true (legal-pages-plan.md build step 4)
- [ ] 2J: real favicon (404s today), homepage metadata/OG check, Lighthouse pass (CWV green on key pages)
- [ ] Blog SEO plumbing: RSS feed route, Google Search Console + sitemap submit at launch (blog-plan.md "SEO plumbing")
- [ ] CI guard rails before the writer runs unattended: branch protection on main + Vercel build check, and the copy lint (blog-plan.md section 3 "guard rails")
- [ ] Launch config sweep: `[PLACEHOLDER]` grep across the repo (office phones, socials), redirects/domains on Vercel
- [ ] `/team/` index flip when its content lands: `robots` to index in `app/(marketing)/team/page.tsx` + add the route in `app/sitemap.ts` (one commented line each)

**4. Blocked on Brad's content, not on code (full list: "Brad-owed content" below):**
- [ ] `/team/`: the 6 questionnaires (`project-sections/company/team.md`), 18 personal photos (`team-<first>-1..3` slots), names + roles for the 4 open slots. Headshots DONE: all 6 wired via `npm run blog:assets` (Levi landed 2026-08-31)
- [ ] Legal: lawyer review of the full drafts in `content/legal/*.mdx` (counsel edits the MDX only; ask counsel about restoring the footer "Do not sell or share" link Brad cut 2026-08-30)
- [ ] Real case studies into `lib/featured-work.ts` (the `caseStudy` shape: one filled entry lights /results/[slug]/, flips it to index, no code)
- [ ] The sitewide copy pass and "everything bigger" pass (under "Finalization" below); Brad may run these with an agent before handoff

Reviews still open (Brad may approve verbally; confirm and check off): Batch 2, Batch 3, blog v2, nav/menu/footer rebuilds, `/team/` round 2. (The 2026-08-30 home polish round WAS reviewed same day; verdicts + follow-ups in the next section.)

## Brad's home review, 2026-08-30 (round 2: verdicts + what to iterate)

Brad reviewed the home polish round live. Approved as-is: footer (mark, letter trail, legal line), services cube containment, menu Resources group. Shipped on the spot: registration marks retired sitewide (component deleted), solution underlines pre-drawn + boiling (no more draw-one-by-one). Left to iterate, for Mike or a dedicated build session:

- [ ] **First 90 Days: rework the fill beat itself.** Brad: the square-fill is "kind of a whack animation... it doesn't look exciting, it's very boring", even at the shorter runway. The finale additions (circle, starburst, arrow, confetti, smiley) are GOOD and can be pushed further. Direction ideas for the session: fill by phase-row cascades instead of 90 ticks, make the big day counter the hero and demote the grid, or replace the grid fill with one bolder morph; keep the pin, keep the finale. Copy rides Brad's sitewide pass
- [ ] **Featured Work: a different idea for the six works during the spin.** "Getting closer, I really like that", but scrolling through captions 01 through 06 is out. Keep: header stays, shorter spin. Ideas to explore: all six titles as a static index rail with the active one highlighted per half-turn (no swapping), or cut the step mapping and let the grid cards themselves be the content while the cube spins freely
- [ ] **Solution: play with the cube's pass.** "Good, not great." The fly-under works but the moment wants more character; a dedicated play session on the sweep path/timing (underlines are already handled)

## Finalization: fit, finish, polish (Brad, 2026-08-31)

The sitewide passes, each its own session:
- [ ] The big copy pass, one conversation: ~210 franchise/multi-location mentions across ~38 files. Rule: BigSquare is a full-stack marketing agency with strong creative; franchise and multi-location is one big lane, not the whole road; ecommerce, software brands, and single-location clients read as equals. Titles, metas, heros, JSON-LD, the home title tag. Handoff: `handoffs-2026-08-31.md` Pane A
- [ ] "Everything feels bigger" pass: portfolio-style scale (type, media, spacing) while still reading as an agency that serves brands. Blend of both
- [ ] Fonts polish: tracking on the display scale, where ss01 salt earns a place, kill the Bluu/Apfel @font-face fallback blocks in `app/globals.css`
- [ ] Strip the dead `marks` prop from MediaSlot call sites in a quiet window (registration marks retired sitewide 2026-08-30; the prop is a no-op)
- [ ] Premium cube: Brad is building an award-show-grade WebGL version in a separate project; it drops into `HomeCanvas.tsx` when ready. No cube sessions here until then (the 2K choreography/waypoint retune list waits on it)

## Batch plan (review state)

- [x] **Batch 1: /audit/, /contact/, /about/** BUILT + REVIEWED 2026-08-27 ("good, not great", structure approved, no rebuild). Known placeholders ride the copy pass
- [ ] **Batch 2:** /locations/ hub + denver + tampa, /results/ index, /careers/. BUILT 2026-08-27, awaiting Brad's batch review. Owed: office addresses/phones/photos (`lib/offices.ts` + 2 asset slots), careers remote policy + open roles + application destination (`lib/careers.ts`)
- [ ] **Batch 3:** funnels /go/, /apply/, /thanks/. BUILT 2026-08-30 (`app/(funnel)/`, `lib/funnels/registry.ts`; noindex, never in sitemap.xml), awaiting Brad's batch review. Owed: video URL + poster, one sourced result, budget ranges + qualifying floor, turnaround. /ad-credit/ RETIRED 2026-08-31, never building
- [ ] **Batch 4:** blog + /resources/ + the 404. BUILT 2026-08-30 (MDX pipeline, 2 posts, blog v2 anatomy, figure engine), awaiting Brad's review. Lead magnets follow their session; D4 service family follows the keyword pass

## Blog cadence: scheduled Claude writer (Brad 2026-08-29, "regular blog posts on a cron job for SEO")

How it works (pipeline + figure engine SHIPPED 2026-08-30; setup details in `project-sections/blog/blog-plan.md` section 3):
1. A Claude Code cloud routine runs every Monday 6:00am Denver (cron `0 12 * * 1`), its own checkout of github.com/obsidiongit/bigsquaresite, model claude-sonnet-5.
2. It reads `content/blog/TOPICS.md` (25 question-led topics with source evidence; Brad or Mike keep it topped up), takes the top unwritten topic, writes one 900-1400 word post per copy-rules.md, authors its figure HTMLs and runs `npm run blog:figures`, links 2-3 internal pages, marks the topic done.
3. It opens a PR titled "blog: <post title>". Brad reviews on GitHub; merge = publish. Nothing goes live without a human merge.
4. Twice a month is a fine start (cron `0 12 1,15 * *`); weekly once the queue is deep enough.

The 3 remaining steps are the developer's: bucket 2 of the DEVELOPER HANDOFF above.

## Homepage punch list (the remaining ~15%)

Needs Brad (facts and assets, none of which can be invented):
- [ ] The single copy pass: hero card-beat headline + "How We Work" link, featured work support (+ ALL-CAPS support vs copy-rules), ProblemStrip/Solution/Services drafts, portal + newsletter + 90-days copy, ProofBand test-copy lock, "Let's Talk" pill vs approved labels
- [ ] Sourced ProofBand metrics (launch gate in `lib/metrics.ts`; 3-vs-4 call) + real media for its panel
- [ ] 6 real featured-work clients + media (`lib/featured-work.ts`)
- [ ] Real 4K hero film (one-line HERO_VIDEO swap in Hero.tsx)
- [ ] Real 90-day milestones (`lib/ninety-days.ts`, currently invented + placeholder-flagged)
- [ ] Newsletter: 5 client headshots, 4 photos (`lib/newsletter-frames.ts`), a real cadence, confirm "600+ clients" wording
- [ ] Footer facts: socials, two office phones, BIGSQUARE vs BIGSQUARE MARKETING wordmark (paint layer question ANSWERED 2026-08-30: it returns letters-only inside the wordmark, STYLE_GUIDE 7.6)
- [ ] Live Obsidion portal code for the window slot (chip drops with it)
- [ ] Cube look sign-off + the 3D bundle overage call (~232KB gz vs the 200KB line)
- [ ] Reviews to record: 2G1 First 90 Days round 2, 2I footer Back Cover round 2, cube reform round 14 (Brad may have approved verbally; confirm, then check off). The 2026-08-30 home polish round is REVIEWED; verdicts + follow-ups under "Brad's home review" above

Build items (small, any session):
- [ ] Newsletter polish set: panel presence at 1536, frame cadence vs real photos, remove the headshot note when assets land, confirmation copy, optional cube anchor
- [ ] Migrate NewsletterForm onto the shared `Field` primitive so the form anatomy lives once (it also owes its `<ConsentLine />` under the submit button, see handoffs-2026-08-31 cross-pane requests)
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
- [ ] Portal scroll set piece once real Obsidion assets exist (STYLE_GUIDE 7.4)

## Backend / integrations

- [ ] GHL API lead capture for the /schedule/ + /apply/ forms (Mike; server-side behind GHL_* env vars; calendar component is RETIRED per decisions.md)
- [ ] Tracking IDs (Meta Pixel, Google tag, GA4 env values) + the Global Privacy Control gate (bucket 3 above)

## Brad-owed content (blocks marked pages, nothing else)

- [ ] **Team** (`lib/team.ts`; questionnaire in `project-sections/company/team.md`): 6 sets of answers (about, into, on rotation, optional LinkedIn), 18 personal photos (`team-<first>-1..3`, square crops), names + roles for the 4 open slots. Then the /team/ index flip (bucket 3). Headshots are DONE
- [ ] **Lead magnets**: the 5 real picks (whiteboard; v1 rejected, v2 research is "fine info" but not it yet; dedicated iteration session, MUST precede launch), then 5 `lib/resources.ts` rows + specs + assets
- [ ] **Case studies**: real clients, 3 metrics each with time window + source, situation/steps/result copy, optional real-name quote (`lib/featured-work.ts`); testimonials for interior pages when real ones exist
- [ ] **Films**: the 4K hero film (one-line swap), the /schedule/ VSL + poster (`lib/schedule-media.ts`), the funnel video URL + poster
- [ ] **Funnel facts**: one sourced result, budget ranges + qualifying floor, call turnaround
- [ ] **Assets**: ~37 slots in `asset-manifest.md` (Brad's designer is producing them; drop files in `public/media/`, one `lib/asset-files.ts` row each, sweep as they land)
- [ ] **Facts**: office phones + addresses, socials, the logo file, the Ahrefs keyword pass, ProofBand metrics, 90-day milestones, newsletter cadence + photos
- [ ] **Music**: the ~60-90s seamless quiet loop (Suno is fine); drops into `public/audio/` + one-line `MUSIC_SRC` change in lib/sfx.ts
- [ ] **Env**: `FORM_WEBHOOK_URL`, the 3 tracking IDs, `GHL_*`
- [ ] **Legal**: the lawyer review (both drafts are complete; legal facts locked 2026-08-30). A mailing address is required in marketing EMAIL footers before campaigns send (CAN-SPAM); the site stays address-free per Brad

## Standing rules that bite

- Open layout sitewide (D1); registration-mark plus signs retired SITEWIDE 2026-08-30 (component deleted; MediaSlot's `marks` prop is a dead no-op, strip it in a quiet window)
- Audience rule: conversion surfaces never read franchise-only (ecommerce + single-location clients too)
- copy-rules.md governs all copy; flagged drafts, never silent placeholders; the big copy pass is the one large sweep
- Forms: single submitForm path, in-place confirmation, shared `Field` primitive
- Only Brad checks a GATE box for a new template type
