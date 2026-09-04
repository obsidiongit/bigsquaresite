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
- [x] GA4 wired 2026-09-04: `NEXT_PUBLIC_GA4_ID=G-6HLE1X2VVL`. GPC gate is in the tag loaders: Google Ads (`NEXT_PUBLIC_GTAG_ID`) and Meta Pixel skip when `navigator.globalPrivacyControl` is true; GA4 still loads with ad signals off. STILL OPEN: Meta Pixel ID and Google Ads tag ID
- [x] 2J DONE 2026-08-31 (Pane B): favicon + app icons from the logo mark (`app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`, no console 404), OG card on Lenia Mono 700 with the wide-positioning tagline, metadata sweep over 42 routes clean (title/description/canonical on every indexable route; funnels noindex with registry-sourced descriptions), Lighthouse mobile: interiors perf 76-88 with CLS 0 and best-practices 100. STILL OPEN: home perf ~40 (TBT from the three.js bundle, Brad's overage call in the homepage punch list); interior LCP ~4.5s under mobile throttling is framework JS, revisit only if Brad wants deeper surgery
- [x] RSS feed at `/feed.xml` (2026-09-04): built from `getAllPosts()`, so a new `.mdx` in `content/blog/` shows up on the next Vercel build. Linked from `/blog/` and advertised sitewide as `rel=alternate`. STILL OPEN: Google Search Console + sitemap submit at launch (blog-plan.md "SEO plumbing")
- [ ] CI guard rails before the writer runs unattended: branch protection on main + Vercel build check, and the copy lint (blog-plan.md section 3 "guard rails")
- [ ] Launch config sweep: `[PLACEHOLDER]` grep across the repo must return zero hits (the full list is the "Placeholder fill list" section below), redirects/domains on Vercel
- [ ] `/team/` index flip when its content lands: `robots` to index in `app/(marketing)/team/page.tsx` + add the route in `app/sitemap.ts` (one commented line each)

**4. Blocked on Brad's content, not on code (full list: "Brad-owed content" below):**
- [ ] `/team/`: the 5 questionnaires (`project-sections/company/team.md`), 15 personal photos (`team-<first>-1..3` slots), names + roles for the 5 open slots. Headshots DONE for the current roster. Sadie Pursell removed 2026-09-04.
- [ ] Legal: lawyer review of the full drafts in `content/legal/*.mdx` (counsel edits the MDX only; ask counsel about restoring the footer "Do not sell or share" link Brad cut 2026-08-30)
- [ ] Real case studies into `lib/featured-work.ts` (the `caseStudy` shape: one filled entry lights /results/[slug]/, flips it to index, no code)
- [ ] The sitewide copy pass and "everything bigger" pass (under "Finalization" below); Brad may run these with an agent before handoff

**5. Asset fill workstream (Brad's 2026-08-31 verdict: 5 out of 10, not shippable as-is; the developer picks it up):**
- [ ] Read the "Brad's review" and "Developer handoff" sections of `project-sections/assets/asset-fill-plan.md` first. The plumbing works (`/dev/assets` contact sheet, `assets/generated/` archive, `npm run assets:studio`, `scripts/asset-studio/codex-still.mjs`, OWNER triage in `asset-manifest.md`); the two flagship outputs were rejected as below the brand bar and nothing is promoted
- [ ] Decide per lane WITH Brad before producing anything: refine (the plan's three directions: figures not mocks, world-bible seeds then image-to-image, or hand stills to the designer too). No candidate ships without his yes on `/dev/assets`; real photos and portal exports beat both in-house methods wherever they exist

Reviews still open (Brad may approve verbally; confirm and check off): Batch 2, Batch 3, blog v2, nav/menu/footer rebuilds, `/team/` round 2. (The 2026-08-30 home polish round WAS reviewed same day; verdicts + follow-ups in the next section.)

## Placeholder fill list (full-site sweep, 2026-09-03)

Every `[PLACEHOLDER: ...]` marker and empty media frame on the live site, grouped by the kind of answer it needs. Brad answers; the developer drops the value into the file named and deletes the marker. When a line is filled, check it here and re-run the grep (`grep -rn "\[PLACEHOLDER" app components lib content`) before launch: the site must ship with zero hits. Interior service and industry image slots are NOT repeated here; they live in `asset-manifest.md` (bucket 5 above).

**A. Facts (Brad types the answer)**

Offices and contact (footer, /contact/, /about/, /locations/, both city pages; all read `lib/offices.ts` except the footer, which has its own markers in `components/shared/Footer.tsx`):
- [ ] Denver street address
- [ ] Tampa street address
- [ ] Denver office phone
- [ ] Tampa office phone
- [ ] Footer social links: which networks, which URLs (or "none", then delete the marker)

Homepage proof numbers (`lib/metrics.ts`, reused on /about/; the shipped 75 / 400 / 47 / 12 are visual stand-ins, launch-gated):
- [ ] Ad spend managed: real dollar figure + the period it covers
- [ ] Locations supported: real count
- [ ] Average growth: real figure + how it is measured
- [ ] Years running paid media: real number
- [ ] Newsletter "Join the 600+ clients" line (`components/sections/home/Newsletter.tsx`): confirm 600+ or give the real count

Funnels and forms:
- [ ] Apply budget ranges (`components/sections/funnels/ApplyForm.tsx`): keep "Nothing yet / Under $5,000 / $5,000 to $15,000 / $15,000 to $50,000 / $50,000+" or change
- [ ] Apply qualifying floor: the minimum monthly budget that counts as qualified (same file)
- [ ] Audit turnaround: "Expect a call within ___" (`lib/funnels/registry.ts`, THANKS_PAGES.audit)
- [ ] Application turnaround: "We review your answers within ___" (same file, THANKS_PAGES["growth-partner"])
- [ ] Offer terms for the funnel fine print (same file, FINE_PRINT), or "none" and delete the marker
- [ ] VSL length for the /go/audit/ sub line (same file, VSL_PAGES.audit.sub)
- [ ] One sourced result or a case study card for /go/audit/ (same file, proofNote)
- [ ] Steps on the audit call: confirm "look at your accounts together / tell you what we would do first / you decide" or give the real steps. Used on /schedule/ (`app/(marketing)/schedule/page.tsx` CALL_STEPS) and /go/audit/ (registry steps + stepsNote)

Careers (`app/(marketing)/careers/page.tsx`, `lib/careers.ts`):
- [ ] Remote policy, one sentence for the hero
- [ ] Open roles, if any: title, Denver / Tampa / Remote, full time or contract (empty array = designed empty state, fine to leave)

First 90 days (`lib/ninety-days.ts`; every day number is invented, the section shows a flag until confirmed):
- [ ] Get set up: day 1 kickoff, day 2 audit, day 5 portal login, day 10 goals locked
- [ ] Launch: day 14 tracking fixed, day 18 first campaigns live, day 21 weekly check-in, day 28 creative round one
- [ ] Scale: day 35 first tests, day 45 cut and reallocate, day 60 add channels, day 90 location review

Team (`lib/team.ts`; questionnaire in `project-sections/company/team.md`), one set per person: Brad, Mike, Chaley, Levi, Russel:
- [ ] 2 to 4 sentences about themselves, in their own words
- [ ] 3 to 6 things they are into (chips)
- [ ] One "on rotation" line: a song, show, or podcast
- [ ] LinkedIn URL, or none
- [ ] Names + roles for the 4 open slots (or leave them open)

Case studies (`lib/featured-work.ts`; 6 tiles on the homepage and /results/, each `[PLACEHOLDER: Client 0N]` until real). Per case study Brad can share:
- [ ] Client name, or "industry, N locations" if unnamed
- [ ] Industry slug + brand type (franchisor / franchisee-group / regional-brand / single-location / ecommerce)
- [ ] 3 metrics, each with time window + source
- [ ] Situation (2 to 3 short paragraphs), 3 to 5 steps naming the service used, result paragraph
- [ ] Quote with a real name and role, or no quote
- [ ] Card media into `public/media/work/`

Lead magnets (`lib/resources.ts`; the 5 shipped titles are working titles, Brad's real list is on the whiteboard):
- [ ] The final 5: title, one line, format (Guide / Checklist / Calculator / Template), audience
- [ ] The 5 files (then `/resources/[slug]/` pages, bucket 1 above)

Blog (`app/(marketing)/blog/page.tsx`): the "no published posts yet" marker only shows when `content/blog/` has zero non-draft posts. Two posts are live, so it never renders; leave it.

**B. Copy to confirm (already written, flagged draft until Brad says yes)**
- [ ] Homepage hero headline "Proof before promises." + the side text beside the film card + the "How We Work" link label (`components/sections/home/Hero.tsx`, three markers in code comments)
- [ ] The rest of the homepage sections carry DRAFT notes in code comments only (Services, Solution, ProblemStrip, Portal, Newsletter, FirstNinetyDays). One read-through clears them; part of the sitewide copy pass under "Finalization"
- [ ] Legal: lawyer pass on `content/legal/privacy-policy.mdx` and `content/legal/terms.mdx` (arbitration clause especially)

**C. Media to send (files, not text; homepage media rows in `asset-manifest.md` say where each lands)**
- [ ] Hero brand film (`HERO_VIDEO` in `components/sections/home/media.ts`; a temporary loop plays now)
- [ ] /schedule/ VSL + poster frame (`lib/schedule-media.ts`)
- [ ] /go/audit/ funnel video URL + poster (`lib/funnels/registry.ts`)
- [ ] ProofBand trust film or photo (`components/sections/home/ProofBand.tsx`, replace `<MediaPlaceholder>`)
- [ ] Homepage featured work: 6 case films or stills (`lib/featured-work.ts` media, blocked on the case studies)
- [ ] Newsletter: 5 client headshots + 4 cycling photos (`lib/newsletter-frames.ts`: leadership team, Denver strategy session, client location shoot, Tampa creative team)
- [ ] /industries/ hub cards, 4 images at 3:2 (`components/sections/industries/IndustriesHub.tsx`; shared with the service pages, in the manifest)
- [ ] Industry page heroes (4:3) + method bands (16:9) for franchise, home services, legal, healthcare (`lib/industry-pages/*.ts`; in the manifest)
- [ ] Founders + team photos for /about/ and /careers/, Denver + Tampa office photos (manifest, REAL-ONLY)
- [ ] 15 personal photos for /team/ (3 per person, square, their own pick; `team-<first>-1..3`)
- [ ] Live Obsidion portal embed for the homepage exhibit
- [ ] Music loop, optional (`MUSIC_SRC` in `lib/sfx.ts` + file in `public/audio/`)

**D. Environment (developer, no content needed from Brad beyond the values)**
- [ ] `FORM_WEBHOOK_URL`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GTAG_ID`, `GHL_*` (see `.env.example`; forms post nowhere until the webhook is set). `NEXT_PUBLIC_GA4_ID` DONE 2026-09-04

## Brad's home review, 2026-08-30 (round 2: verdicts + what to iterate)

Brad reviewed the home polish round live. Approved as-is: footer (mark, letter trail, legal line), services cube containment, menu Resources group. Shipped on the spot: registration marks retired sitewide (component deleted), solution underlines pre-drawn + boiling (no more draw-one-by-one). Left to iterate, for Mike or a dedicated build session:

- [ ] **First 90 Days: rework the fill beat itself.** Brad: the square-fill is "kind of a whack animation... it doesn't look exciting, it's very boring", even at the shorter runway. The finale additions (circle, starburst, arrow, confetti, smiley) are GOOD and can be pushed further. Direction ideas for the session: fill by phase-row cascades instead of 90 ticks, make the big day counter the hero and demote the grid, or replace the grid fill with one bolder morph; keep the pin, keep the finale. Copy rides Brad's sitewide pass
- [ ] **Featured Work: a different idea for the six works during the spin.** "Getting closer, I really like that", but scrolling through captions 01 through 06 is out. Keep: header stays, shorter spin. Ideas to explore: all six titles as a static index rail with the active one highlighted per half-turn (no swapping), or cut the step mapping and let the grid cards themselves be the content while the cube spins freely
- [ ] **Solution: play with the cube's pass.** "Good, not great." The fly-under works but the moment wants more character; a dedicated play session on the sweep path/timing (underlines are already handled)

## Finalization: fit, finish, polish (Brad, 2026-08-31)

The sitewide passes, each its own session:
- [x] The big copy pass DONE 2026-08-31 (Pane A): 187 mentions found, 141 remain (all deliberate: /industries/franchise/, hub cards, scoped lane sections, comments). Home hero + subhead, root title/meta, org JSON-LD description, 15 service-page frames, /services/ hub, /about/, CtaBand default, Newsletter, FeaturedWork all read wide. copy-rules.md "Audience" rule + project-brief positioning amended. Awaiting Brad's review with the rest of the batch
- [ ] **Copy round 2, page by page (Brad, 2026-08-31): run this the day before launch.** Round 1 (above) set the wide positioning; round 2 is the line-by-line polish once the real content is in (metrics, case studies, team, legal, funnel facts), because those drops change the copy around them. Process per page: read every word on the page, run it through the installed skills (humanizer, no-ai-slop in detect mode, copywriting), fix what they catch, keep copy-rules.md as the tiebreaker, screenshot 375/1280, then show Brad the page. A box below gets checked only when Brad approves that page; a rejected page gets its notes written next to it and stays open. One session can walk many pages, but approval is per page, never per batch.
  - [ ] `/` (home, includes Hero/Newsletter/FeaturedWork/90-days section copy)
  - [ ] `/about/`
  - [ ] `/team/`
  - [ ] `/careers/`
  - [ ] `/results/` + the `/results/[slug]/` template copy
  - [ ] `/contact/`
  - [ ] `/schedule/`
  - [ ] `/audit/`
  - [ ] `/services/` hub
  - [ ] `/services/seo/`
  - [ ] `/services/generative-engine-optimization/`
  - [ ] `/services/social-media/`
  - [ ] `/services/content-marketing/`
  - [ ] `/services/email/`
  - [ ] `/services/obsidion-portal/`
  - [ ] `/services/paid-search/`
  - [ ] `/services/google-local-services-ads/`
  - [ ] `/services/paid-social/`
  - [ ] `/services/amazon-ads/`
  - [ ] `/services/creator-network/`
  - [ ] `/services/web-design/`
  - [ ] `/services/branding/`
  - [ ] `/services/video-production/`
  - [ ] `/services/custom-development/`
  - [ ] `/industries/` hub
  - [ ] `/industries/franchise/`
  - [ ] `/industries/home-services/`
  - [ ] `/industries/legal/`
  - [ ] `/industries/healthcare/`
  - [ ] `/locations/` hub
  - [ ] `/locations/denver/`
  - [ ] `/locations/tampa/`
  - [ ] `/blog/` index + the 2 launch posts
  - [ ] `/resources/` + lead magnet pages (once they exist)
  - [ ] Funnels: `/go/audit/`, `/apply/growth-partner/`, `/thanks/*`
  - [ ] Shared surfaces: nav + menu overlay, footer, CtaBand, form microcopy, 404
  - [ ] Legal pages: SKIP rewriting (lawyer owns the words); check only the H1/intro line
- [ ] "Everything feels bigger" pass: portfolio-style scale (type, media, spacing) while still reading as an agency that serves brands. Blend of both
- [ ] Asset fill workstream (Brad, 2026-08-31; multi-session): fill the ~61 empty slots + homepage media 30-50% in-house alongside the designer's video/statics project. Plan, lanes, rules: `project-sections/assets/asset-fill-plan.md` (code-built UI assets; Codex stills on a world bible, free so generate wide; Higgsfield for video only; nothing wired without Brad's OK). SESSION 1 DONE 2026-08-31 (log in the plan file): OWNER triage in asset-manifest.md (16 code / 23 AI / 22 real-only), `/dev/assets` contact sheet, world bible draft, GEO-band flagship (4 candidates) + Codex van still (hookup proven). REVIEWED by Brad 2026-08-31: 5 out of 10, both flagships REJECTED as-is ("cool on paper, needs a lot of refinement", "our brand needs to be not AI slop at all"). Plumbing stands, outputs do not; nothing promoted. Passed to the developer: bucket 5 of the DEVELOPER HANDOFF + the plan file's "Developer handoff" section
- [ ] Fonts polish: tracking on the display scale, where ss01 salt earns a place, kill the Bluu/Apfel @font-face fallback blocks in `app/globals.css`
- [x] Strip the dead `marks` prop from MediaSlot call sites DONE 2026-09-04: prop and its type removed from `components/shared/MediaSlot.tsx`, 17 `marks={false}` call sites deleted across 8 files
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
- [x] FAQ accordion open/close height animation: NOT A BUG (verified 2026-09-04). The note said "keyframes never defined", but `tw-animate-css` (imported at the top of `app/globals.css`) supplies both the `--animate-accordion-down/up` tokens and the `accordion-down/up` keyframes off `--radix-accordion-content-height`. Confirmed in the compiled CSS: the utility resolves and the keyframes ship. Nothing to fix

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
- [ ] Tracking IDs still empty: Meta Pixel and Google Ads (`NEXT_PUBLIC_GTAG_ID`). GA4 + GPC gate DONE 2026-09-04

## Brad-owed content (blocks marked pages, nothing else)

- [ ] **Team** (`lib/team.ts`; questionnaire in `project-sections/company/team.md`): 5 sets of answers (about, into, on rotation, optional LinkedIn), 15 personal photos (`team-<first>-1..3`, square crops), names + roles for the 5 open slots. Then the /team/ index flip (bucket 3). Headshots are DONE. Sadie Pursell removed 2026-09-04.
- [ ] **Lead magnets**: the 5 real picks (whiteboard; v1 rejected, v2 research is "fine info" but not it yet; dedicated iteration session, MUST precede launch), then 5 `lib/resources.ts` rows + specs + assets
- [ ] **Case studies**: real clients, 3 metrics each with time window + source, situation/steps/result copy, optional real-name quote (`lib/featured-work.ts`); testimonials for interior pages when real ones exist
- [ ] **Films**: the 4K hero film (one-line swap), the /schedule/ VSL + poster (`lib/schedule-media.ts`), the funnel video URL + poster
- [ ] **Funnel facts**: one sourced result, budget ranges + qualifying floor, call turnaround
- [ ] **Assets**: ~37 slots in `asset-manifest.md` (Brad's designer is producing them; drop files in `public/media/`, one `lib/asset-files.ts` row each, sweep as they land)
- [ ] **Facts**: office phones + addresses, socials, the logo file, the Ahrefs keyword pass, ProofBand metrics, 90-day milestones, newsletter cadence + photos
- [ ] **Music**: the ~60-90s seamless quiet loop (Suno is fine); drops into `public/audio/` + one-line `MUSIC_SRC` change in lib/sfx.ts
- [ ] **Env**: `FORM_WEBHOOK_URL`, Meta Pixel, Google Ads tag (`NEXT_PUBLIC_GTAG_ID`), `GHL_*`. GA4 DONE 2026-09-04
- [ ] **Legal**: the lawyer review (both drafts are complete; legal facts locked 2026-08-30). A mailing address is required in marketing EMAIL footers before campaigns send (CAN-SPAM); the site stays address-free per Brad

## Standing rules that bite

- Open layout sitewide (D1); registration-mark plus signs retired SITEWIDE 2026-08-30 (component deleted; MediaSlot's dead `marks` prop stripped 2026-09-04)
- Audience rule: conversion surfaces never read franchise-only (ecommerce + single-location clients too)
- copy-rules.md governs all copy; flagged drafts, never silent placeholders; the big copy pass is the one large sweep
- Forms: single submitForm path, in-place confirmation, shared `Field` primitive
- Only Brad checks a GATE box for a new template type
