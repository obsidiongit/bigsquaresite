# Handoff: Lower Region Rebuild, Build Session 1 (2D-R groundwork + ProblemStrip + Solution)

Written 2026-08-24 at the end of the planning session. Paste this file's path into the new session and say "build this". Everything below is self-contained, but the briefs are the law: read them before writing code.

## Read first, in order

1. `CLAUDE.md` (repo rules; briefs before build, copy governance)
2. `project-guidelines/copy-rules.md` (banned words: "AI" is banned; no em dashes; no invented numbers)
3. `project-guidelines/STYLE_GUIDE.md` (tokens, radii, motion rules; you will be updating it this session)
4. `project-sections/home/4.problem.md` v3 and `project-sections/home/5.solution.md` v3 (the two sections this session builds)
5. `project-guidelines/tasks.md`, the "Region pivot, 2026-08-24" note (full decision record)
6. `project-sections/reference-images/youtech-agency/2026-08-24-widgets/ANALYSIS-WIDGETS.md` (measured widget choreography; open the filmstrip PNGs)

## Context in three sentences

Brad approved everything from the hero through FeaturedWork; everything below it gets rebuilt to Youtech's open layout (no GridLines rails, no 1200px Container, no Nº labels) on the FeaturedWork edge width. New section order below FeaturedWork: ProblemStrip, Solution (3 widget cards), Search (typing mockup), Services (3 pillar cards), Testimonial, ProofBand, TrustMarquee. All 7 briefs are rewritten and approved for building; Youtech's widget animations turned out to be looping MP4s and ours get rebuilt as real HTML/CSS loops (the project's first `@keyframes`).

## This session's scope

Step A (groundwork), then Step B (ProblemStrip), then Step C (Solution + the three widgets). End at Break B: screenshots for Brad. Do NOT continue into Search/Services/Testimonial/ProofBand; those are later sessions (briefs `5b.search.md`, `6.services.md` v3, `11.testimonials.md` v3, `7.proof-numbers.md` v3, `3.trust.md` v2.1).

### Step A: groundwork (one commit, do not split the reorder from the waypoints)

1. New `lib/layout.ts`: `export const EDGE = "px-[max(5vw,40px)]"`. Refactor `components/sections/home/FeaturedWork.tsx` (local `EDGE` const around line 42) to import it. Zero visual change.
2. `app/(marketing)/page.tsx`: reorder to Hero, FeaturedWork, Problem(→ProblemStrip), Solution, Services, TrustMarquee for now; unbuilt sections keep their old components in place until their session replaces them (Services stays the rejected build until its session; that is accepted). TrustMarquee moves BELOW Services now so the order is stable.
3. `components/sections/home/HomeCanvas.tsx` waypoint re-map in the SAME commit (missing anchors degrade silently):
   - `AnchorName` union (~line 126) and `ANCHOR_NAMES` (~line 199) become: `heroEnd | work | problem | solution | search | services | proof | trust` (search/proof anchors exist once those sections build; Tracker filters missing ones, so listing them early is safe).
   - Keep `heroEnd` + the three `work` entries in `WAYPOINTS` (~lines 141-161) exactly as they are. Replace the trust/problem/solution/services entries with 1-2 waypoints per section in the NEW document order, ending with the existing dissolve (`fade: 0`) on `trust`. Drop the `steps4` ease tag (it was keyed to the retired numbered problem rows); keep the easing function for Brad's later retune (task 2K).
   - `WAYPOINTS_MOBILE` unchanged (only uses heroEnd + work).
   - This is a minimal keep-it-working remap. Brad retunes the journey himself later; do not design choreography.
4. `app/globals.css`: add the `wgt-*` keyframes block (see 5.solution.md v3 for names and timings) plus the gating rules:
   - `.wgt:not([data-play]) * { animation-play-state: paused }`
   - `@media (prefers-reduced-motion: reduce) { .wgt * { animation: none !important } }`
5. STYLE_GUIDE.md updates + dated changelog entry: §4 open-region pattern (EDGE below the hero on the homepage; the 1200px + hairline system remains for interior pages and footer), §6 widget-card pattern, §7 looping widget vignettes (keyframes sanctioned for ambient loops only: transform/opacity, pause offscreen, reduced motion = settled frame), §9 effect map rewritten to the new order (Nº narrative now ends at the hero).

### Step B: ProblemStrip

Per `4.problem.md` v3. New `components/sections/home/ProblemStrip.tsx` replaces `Problem.tsx` in the page (leave the old file until the session's end, then delete it; nothing else imports it). Soft `bg-surf rounded-[24px]` panel inside EDGE, heading left, four x-marked lines in a 2-col grid right, x-glyphs in `--sec-mid` (not red). Content wrapper `relative z-10`, `anchor="problem"`. Quick build; do not gold-plate it.

### Step C: Solution + widgets (the session's main event)

Per `5.solution.md` v3, which has full per-widget timing tables measured from the reference videos. Rebuild `Solution.tsx` in place; new `components/sections/home/widgets/{CalendarWidget,TaskListWidget,ChannelBarsWidget}.tsx`.

Non-negotiables:
- Widgets are pure CSS keyframe loops on the shared-timeline pattern (one duration per widget, percentage keyframes + delays, seamless repeat). `data-play` toggled by Framer `useInView`.
- Reduced motion is TWO layers: the CSS kill rule AND `useReducedMotionSafe()` rendering the settled end frame (checked row, grown bars, static month).
- No fake numbers, names, or dates anywhere (their videos show "Eric" and "Jul 29"; ours use generic task names, blurred value-bars, unlabeled ticks).
- Deterministic first frame for SSR (animation starts at keyframe 0, no random seeds).
- Card titles exactly: "No Long Term Contracts", "Transparency", "Full Approach" (Brad's wording, Title Case kept deliberately).

## Verification before showing Brad (ship gates)

- Screenshots 375 / 768 / 1280 / 1536 plus a reduced-motion run. Pipeline: install Playwright in the session scratchpad, launch chrome channel with `--enable-gpu --use-angle=d3d11` (glass cube renders wrong without it), screenshot the region at each width. Prior sessions' recipe is described in tasks.md notes; there is no committed shoot script.
- Reduced motion: widgets show settled frames, zero looping.
- Scroll-through at 1280: cube follows the remapped waypoints, no console errors, dissolves at trust. Screenshot the cube passing behind the ProblemStrip panel (the old path was tuned to whitespace that no longer exists; Brad accepted this and wants to see it).
- `tsc` clean, prod build green, no horizontal overflow, `/dev/styleguide` unaffected.
- Check the FeaturedWork seam: it ends `pb-section-y-lg`; ProblemStrip runs `py-section-y`.
- Update tasks.md (2D-R progress note) before ending.

## Do not

- Do not delete `GridLines`, `NumberedRuledList`, `RuledLinkTable`, `RuleLink`, `SeparatorIn`, `SectionHeader`, or `BentoPanel` (Nav overlay, styleguide, footer 2I, portal 2F all consume them; BentoPanel is a flagged deletion candidate only).
- Do not touch Hero or FeaturedWork beyond the EDGE import.
- Do not invent stats, client names, or partner status; wrap unknowns as `[PLACEHOLDER: ...]`.
- Do not use em dashes anywhere, code comments and docs included.
- Do not build Search/Services/Testimonial/ProofBand this session.

## Session queue after this one

1. Search section + ChatInputWidget (`5b.search.md`)
2. Services pillar cards (`6.services.md` v3), then Break C review
3. Testimonial + ProofBand + TrustMarquee final position (`11.testimonials.md` v3, `7.proof-numbers.md` v3, `3.trust.md` v2.1), full-region verification pass
