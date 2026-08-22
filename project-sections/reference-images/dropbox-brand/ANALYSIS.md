# Reference: Dropbox Brand Guidelines (brand.dropbox.com)

Captured 2026-08-21 with a headless Chrome pass at 1440x900 (desktop) and 390x844 (mobile). The homepage is a scroll-driven intro: statement typography on a visible grid, then eight colored category tiles fly in and assemble into a full-viewport mosaic that acts as the site nav. The stills capture the start, middle, and settled states, but the assembly choreography itself is the point: open brand.dropbox.com alongside these images when making motion decisions. Duplicate frames of the settled state were pruned; the 4 desktop and 4 mobile frames each show a distinct scroll state.

Status: grid discipline reference. This is a brand guidelines microsite (built in Webflow by Daybreak Studio), not a marketing site. It proves how much premium feel comes from one idea: an honest, visible layout grid that everything else snaps to. We take the grid thinking and the confident single-color typography; the rainbow tile palette and playful tone do not transfer.

## Why this reference matters for BigSquare

The company is literally named BigSquare and the logo is a square. This site is the best demonstration in the set of squares-on-a-grid as a design system: a faint blue-lined "graph paper" grid sits on the white page, and every block of color and text aligns to it exactly. It reads technical, engineered, and premium at zero GPU cost: no canvas, no WebGL, no Three.js anywhere on the page (canvasCount: 0). It also demonstrates a hero built from nothing but accent-blue typography on white, which maps one-to-one onto our `--acc #0657F9` on `--paper`.

## Screenshot index

| File | What it shows |
|---|---|
| `dropbox-brand-desktop-01-top.png` | Opening state: white page, faint blue baseline grid, statement headline set entirely in Dropbox blue, blue logo mark bottom-left, "scroll" chevron bottom-right. No nav bar, no imagery. |
| `dropbox-brand-desktop-02.png` | Second beat: solid blue tile snapped to the grid carrying white statement text and the white logo mark bottom-left; orange and cyan tiles entering from the page edges. |
| `dropbox-brand-desktop-03.png` | Mid-assembly: tiles at intermediate positions (Color, Imagery, Voice & Tone quote marks, Logo), still gapped so the graph-paper grid shows between them. |
| `dropbox-brand-desktop-04.png` | Settled mosaic: eight category tiles (Framework, Voice & Tone, Logo, Typography, Color, Iconography, Imagery, Motion) fill the viewport edge-to-edge, each one color plus one flat glyph plus one label, with a small blue logo tile as the keystone. This is the whole site nav. |
| `dropbox-brand-mobile-01-top.png` | Same opening at 390px: blue statement headline inside a grid cell, logo and chevron below. Type stays large. |
| `dropbox-brand-mobile-02.png` | Blue statement tile full-width on mobile. |
| `dropbox-brand-mobile-03.png` | Mid-assembly on mobile: tiles enter from the edges, grid visible between them. |
| `dropbox-brand-mobile-04.png` | Settled mosaic at 390px: same eight tiles reflow to a two-column stack. Nothing is dropped on mobile. |
| `dropbox-brand-extracted-data.json` | Fonts, easings, the full CSS-variable grid system, page copy, script list pulled from the live DOM. |

## Design tokens (exact, pulled from their live CSS)

From `dropbox-brand-extracted-data.json`:

- Grid (the headline finding): a full 12-column layout system published as CSS variables. `--body-margin-real: 120px`, `--body-gutter: 24px`, `--body-grid-width: min(calc(100vw - 240px), 1920px)`, and generated `--body-col-N-left/right` and `--body-span-N` variables for every column and span. There is a parallel `--opening-*` set for the intro. The visible graph-paper lines are these same columns painted on the page, so the grid is not decoration: it is the actual layout system made visible.
- Fonts: **Sharp Grotesk** (as `Dbsharpgroteskvariable Vf`, a variable font spanning weights 250 to 900) for display, **Atlas Grotesk** 400/500 for body, **Noto Sans Mono** 400/500 for code/meta. Same shape as Lusion: two families plus a mono. Their headline weight in the DOM is 700 with tight `-0.02em` letter-spacing (36px heading, -0.72px).
- Body: Atlas Grotesk at 14px on white (`rgb(255,255,255)` page, near-black `rgb(30,25,25)` ink). 14px body is too small for our audience; moodboard stays at 18px.
- Colors: only white and `rgba(0,0,0,0.1)` live in shared CSS; each tile's color is set per element. Observed tile palette in the frames (approximate, read from screenshots): Dropbox blue (their `#0061FF` range) plus cyan, orange-red, orange, yellow, lime, plum, lilac, and a black Color tile. Eight-plus hues on one screen: the exact opposite of our one-accent rule.
- Easings: 13 cubic-beziers extracted. The named ones: `--nav-easing: cubic-bezier(.4,0,.2,1)` (standard material ease) and `--nav-easing-swoop: cubic-bezier(.6,0,0,1)` (slow start, fast middle, dead stop) for the tile fly-in. Also present: `cubic-bezier(0.15, 0.5, 0.05, 1)` (very soft landing) and Lusion's exact workhorse `cubic-bezier(0.4, 0, 0.1, 1)`, independently confirming that curve family as the industry default for expensive-feeling UI.
- Motion system: the intro is driven by an `--overscroll-progress` variable and a `--highest-tile-yeet` offset (`calc((max(100vw, 100vh) - 90px) / -4)`): scroll position maps to tile transforms, all CSS, no canvas. `--tile-transition: 0.35s cubic-bezier(.4,0,.2,1)` for hover states.
- Stack fact: Webflow plus jQuery 3.5.1. The entire premium effect is grid discipline and easing curves, not tooling. Zero WebGL on the whole page.

## Patterns worth stealing (ranked for BigSquare)

1. **The visible grid.** Faint blue-tinted grid lines on the light page, with every element snapped to them. For a company named BigSquare this is close to a free brand idea: it says "measured, engineered, accountable" before a word of copy is read. Implementation is a CSS `linear-gradient` background or absolutely positioned 1px lines at our 12-column edges using `--line rgba(11,15,23,.12)` or a blue-tinted variant. Pairs naturally with Lusion's "+" registration marks: same blueprint family, one system.
2. **Accent-only statement typography.** The opening headline is 100 percent accent blue on white: no image, no gradient, no second color. Direct recipe for one statement section (or the hero pre-video state) using Bluu Next in `--acc #0657F9` on `--paper`. Confident and nearly free.
3. **The keystone color tile.** A solid accent block, snapped to the grid, white statement text top-left, white logo mark bottom-left, generous empty middle. This is our closing CTA band or dark hero panel pattern: our `--darkpanel` or `--acc` block with the transparent BigSquare mark sitting in the corner.
4. **Grid-snapped mosaic as a section layout.** The settled tile wall is a bento/services grid done with discipline: unequal tile sizes, but every edge lands on a shared grid line, gaps showing the grid beneath. Our version for the services or capabilities section: `--surf` tiles with one blue keystone tile, not eight hues.
5. **Scroll-assembled tiles.** Tiles flying in along the swoop easing as scroll progresses, pure CSS transforms driven by scroll progress. This is a Framer Motion `useScroll` + `useTransform` pattern for us, a candidate for the services grid entrance or the portal section, and proof that scroll theater needs no WebGL budget at all. Steal `cubic-bezier(.6,0,0,1)` for entrances that should feel decisive and `cubic-bezier(0.15, 0.5, 0.05, 1)` for soft settles.
6. **Mobile keeps everything.** The mosaic reflows to two columns at 390px with the same grid logic and nothing hidden. Matches our check-mobile-every-section protocol; worth copying the reflow rather than hiding tiles.

## What we do NOT take

- The rainbow. Eight simultaneous hues violates the one-accent rule and reads playful-consumer, not performance-marketing rigor. Our mosaic stays Graphite plus one blue.
- The playful glyph language (quote marks as illustration, padlock, cookie-emoji consent button). Charming for Dropbox, wrong tone for us.
- 14px body text. Our floor is 17px mobile / 18px desktop per the moodboard.
- Homepage-as-nav-only. Their homepage sells nothing; it is a table of contents. Our homepage has to argue and convert, so the mosaic idea demotes to one section, never the whole page.
- Scroll-hijacked intro pacing. The overscroll-driven opening delays content behind an animation. Keep native scroll; let the assembly play as an entrance animation on section entry instead of holding the page hostage.

## Implementation notes for our stack

- Visible grid: one reusable `<GridLines>` component (absolutely positioned 1px divs at column edges, `pointer-events: none`), toggled per section. Costs nothing at runtime; respect it in Tailwind via the same 12-col/24px-gutter tokens.
- Tile mosaic: CSS Grid with named areas over the same column system; Framer Motion `whileInView` staggered entrance using the swoop easing, `prefers-reduced-motion` renders it settled.
- Their grid math (margins 120px, gutters 24px, cap 1920px) is worth comparing against our 1200px content cap when the style guide is written; their wider cap is what lets full-bleed tiles breathe.
- Capture note: the Dropbox cookie banner occluded early frames; `scripts/capture-reference.js` now auto-dismisses consent banners (click Decline in any frame, CSS-hide fallback), which future captures inherit. The small cookie icon bottom-left in frames is the reopened-consent button; ignore it.
