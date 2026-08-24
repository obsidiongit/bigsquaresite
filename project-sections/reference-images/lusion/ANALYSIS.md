# Reference: Lusion (lusion.co)

Captured 2026-08-21 with a headless Chrome pass at 1440x900 (desktop) and 390x844 (mobile). WebGL rendered live, so screenshots show the real site, but remember the site is in constant motion: stills undersell it. Open lusion.co alongside these images when making motion decisions.

Status: creative ceiling reference. Lusion is a 3D/interactive studio showing off. BigSquare is a performance marketing firm proving competence. We borrow their discipline and a small dose of their theater, not their intensity.

## Why this reference matters for BigSquare

Their base palette is nearly ours already: light cool lavender-gray page (`#EFEFF6` range), near-black ink, one electric blue (`#2242F5` range vs our `#0657F9`), white and dark pills for UI. They prove the exact BigSquare palette can feel world-class with zero extra colors. Everything below transfers without any color translation.

## Live scroll capture (added 2026-08-23)

`live-scroll-capture/` holds 15 wheel-driven frames of the live site (their scroll is hijacked, so window.scrollTo does nothing; drive it with mouse.wheel and ~850ms settle per step) plus `dom-notes.json`. Frames 03 to 09 are the money sequence for the hero rework: the rope arcs in from top-left and its tip leads to the emerging media (05), the reel enters as a bent tilted plane under the looping rope (07), and it settles into a crisp near-full-bleed frame with registration marks (09). DOM notes confirm one fixed full-viewport WebGL canvas renders rope + reel; the DOM carries only type and pills.

## Screenshot index

| File | What it shows |
|---|---|
| `lusion-home-desktop-01-top.png` | Hero: light page, logo left, statement sentence center, dark pill CTAs right, full-bleed rounded dark WebGL panel with 3D "jack" objects, "SCROLL TO EXPLORE" + registration "+" marks |
| `lusion-home-desktop-02.png` | Transition out of hero; headline caught mid mask-reveal (letters rise from behind a baseline) |
| `lusion-home-desktop-03.png` | Intro statement: huge grotesk two-line headline, blue 3D rope weaving through the layout, right-column body text, white pill button with dot |
| `lusion-home-desktop-04.png` | Showreel card mid-scroll: video plane bends like cloth while scrolling, blue rope continues across sections |
| `lusion-home-desktop-05.png` | Showreel settled: near-full-bleed video, PLAY (button) REEL type lockup, "+" grid marks around it |
| `lusion-home-desktop-06.png` | "Featured Work" section header: massive headline left, small uppercase paragraph pinned right |
| `lusion-home-desktop-07.png` to `-13.png` | Work grid: 2-col cards, rounded media, mono uppercase category tags with dot separators, big plain titles, centered "SEE ALL PROJECTS" pill after the grid |
| `lusion-home-desktop-14.png` | Second statement section: 3-line viewport-scale headline, rope element recolored teal, showing the accent thread evolves as you scroll |
| `lusion-home-desktop-15.png` to `-16.png` | Approach section: 3D tablet device tilting through the viewport with video content inside, body copy alongside |
| `lusion-home-mobile-*.png` | Same flow at 390px: everything stacks to one column, type stays huge, WebGL panel persists |
| `lusion-home-extracted-data.json` | Fonts, hex colors, cubic-bezier easings, CSS variables, page copy, script list pulled from the live DOM |

## Design tokens (exact, pulled from their live CSS)

From `lusion-home-extracted-data.json`:

- Colors: `--color-off-white: #f0f1fa` (page), `--color-dark-white: #e4e6ef` (surfaces), `--color-black: #000000`, `--color-blue: #1a2ffb` (accent), `--color-dark-blue: #071bdf`, `--color-grey-blue: #2b2e3a`. Compare ours: `--paper #F5F6F8`, `--surf #E9ECF1`, `--ink #0B0F17`, `--acc #0657F9`, `--acc2 #0A2A73`. Nearly one-to-one; theirs is one step more lavender and their blue one step more violet.
- Fonts: **Aeonik 400 and 500 only** (plus one italic) for everything, **IBM Plex Mono 400/500** for meta text. They ship exactly two families and three weights total. We already planned IBM Plex Mono as our mono; keep it.
- Type scale: statement H1 is only 36px; the huge section headlines are `10vw` display text (viewport-scaled, not fixed px). Card meta ~12px mono uppercase.
- Grid: 12 columns, `--grid-gap: 2vw`, `--base-padding-x: max(5vw, 40px)`, `--base-padding-y: clamp(30px, 4vw, 50px)`.
- Radius: `--global-border-radius: 20px` applied to every media panel. This one token is what makes dark WebGL panels feel like objects sitting on the page instead of sections.
- Easings: workhorse is `cubic-bezier(0.4, 0, 0.1, 1)` (fast-out, very soft landing), plus `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) for big reveals. No bounce anywhere. Steal these values verbatim.
- UI chrome: pill buttons everywhere (dark pill = primary "LET'S TALK", light pill = secondary "MENU"), always with a small dot or icon accent inside.
- "+" registration marks at grid intersections around full-bleed media. Reads technical/blueprint, costs nothing in performance.
- Per-letter DOM duplication on card titles: every title letter exists 4x in the DOM for staggered letter-swap hover animations. (Our version, if any: Framer Motion letter stagger on hover for case study titles. Low priority.)
- Stack fact: the site is built with Astro plus one custom WebGL bundle (3 canvases total). No heavy framework. The polish is craft, not tooling.

## Motion patterns worth stealing (ranked for BigSquare)

1. **Hero as a framed object, not a full-bleed takeover.** Their WebGL lives inside a rounded panel inset from the page edges, with calm typography above it on the light page. This is more corporate-compatible than a full-viewport canvas and is the single best structural idea for our hero. Works with video too, not just 3D.
2. **Baseline mask text reveal.** Headlines rise from behind their own baseline as sections enter. Framer Motion can do this with `overflow: hidden` line wrappers. Expensive-feeling, zero GPU cost, fully in line with the moodboard's "expensive and calm."
3. **Section header pattern.** Huge headline left, small uppercase supporting paragraph right. Direct fit for our H2 + eyebrow system.
4. **"+" registration marks** around media/full-bleed moments. Cheap, technical, matches our mono-eyebrow blueprint vibe.
5. **A single continuous accent element linking sections.** Their blue rope travels down the page connecting hero, statement, reel. Our version could be a subtle blue line/square path (even SVG, not 3D) that guides scroll. Candidate for the "portal" section.
6. **Scroll-bent video plane.** The showreel bending like cloth as you scroll. This is the over-the-top end; only worth it if the portal section earns it under the 200KB Three.js budget. Optional.

## What we do NOT take

- Constant WebGL on every section. Our audience is buying rigor, not spectacle. One hero moment plus one portal moment max.
- Scroll hijack/virtual scroll. Their whole page is a custom scroller. We keep native scroll; it is better for SEO, accessibility, and LCP.
- Their playful content (colorful playground scenes). Our media stays brand-abstract or real work.
- All-lowercase nav and art-project microcopy. Our copy-rules.md wins.

## Implementation notes for our stack

- Hero panel: static poster or `<video>` inside `rounded-3xl` dark panel, optional Three.js object later. The framed-panel structure works even with zero 3D on day one.
- Text reveals: Framer Motion `staggerChildren` on line-split headlines; respect `prefers-reduced-motion` per moodboard.
- Their tech (from script list in extracted JSON): custom WebGL build, no big framework visible on the wire. We do not need their engine to get 80% of the feel.
