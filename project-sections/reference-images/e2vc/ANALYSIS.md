# Reference: e2vc (e2.vc)

Captured 2026-08-21 with headless Chrome at 1440x900 (desktop, full homepage plus all 8 section pages plus one founder case study) and 390x844 (mobile, full homepage). Also ran a DOM probe (`e2vc-annotation-probe.json`) that extracted the exact implementation of the hand-drawn annotation system, including the animated bracket CTA.

Status: **primary reference and closest token match**. Brad's favorite so far. A VC firm site, so the audience is different (founders being courted vs businesses buying rigor), but the design system is the closest thing yet to BigSquare's Graphite palette executed at a world-class level: one cream page color, one near-black ink, one electric blue accent doing all the work, visible blueprint grid, zero decoration that is not typography, photography, or a hand-drawn accent stroke.

## Why this reference matters for BigSquare

- Their entire system is `--bg #fcf7f0`, `--ink #1c2121`, `--e2vc-accent #3451f5`, plus a hairline grid `rgba(28,33,33,0.15)`. That is our Graphite trio (paper, ink, accent) one step warmer. Every structural idea transfers with zero color translation; only their warm cream shifts to our cool `#F5F6F8`.
- They prove the "one blue accent" rule can carry an entire site's personality: the blue appears only as annotation strokes, eyebrows, link accents, and one full-bleed footer. Nothing else is colored on core pages.
- One type family total (Inter Tight variable) at three jobs: gigantic lowercase display, medium headings, small uppercase meta. Confidence through restraint, exactly the moodboard's "expensive and calm."
- The hand-drawn annotation system (bracket CTA, circled word, underline) is the single most stealable signature: cheap, distinctive, technical-feeling, and it lives entirely in the accent color.

## Screenshot index

### Homepage desktop (`e2vc-home-desktop-*.png`)

| File | What it shows |
|---|---|
| `01-top` | Hero: cream page, hairline column grid, logo left, MENU + doodle asterisk right, 135px lowercase headline with rough.js blue circle scribbled around "friends", scattered snapshot-style founder photos with slight rotations |
| `02` | Hero photo strip continues below the headline |
| `03` | Transition: dark panels rise in stepped column blocks (curtain effect snapped to the grid columns) |
| `04` to `06` | Dark statement section "from the group chat": viewport-scale kinetic type with letters scattered off the baseline mid-scroll, blue hand-drawn underline beneath "group chat", grid hairlines persist on dark |
| `07` | Dark section empty state between moments (the site breathes; whole viewports of calm are part of the rhythm) |
| `08` to `19` | Portfolio feed on dark: alternating left/right cards, each photo overlaid with two black tag chips (COMPANY name left, metric right: "RAISED $750M", "EXIT $1.2B", "NASDAQ: BLLN"), title below in white; huge vertical whitespace between entries |
| `20` | Footer transition: electric blue band slides up over the dark feed |
| `24` | Footer settled: full-bleed accent blue, three world clocks with doodle asterisks, three link columns, giant cream logotype letters scattered at the bottom by a matter.js physics sim ("R TO RESET, HOLD SPACE FOR SPACEJUMP") |

### Homepage mobile (`e2vc-home-mobile-*.png`)

`01` hero stacks to one column and type stays huge; `02` to `04` photos then dark transition; `05` to `17` the feed goes single column, chips shrink but keep the two-chip lockup; `18` footer transition; `22` full blue footer with stacked clocks, two-column nav, tumbled logo letters. Everything survives 390px with no pattern changes, only stacking.

### Section pages (`pages/e2vc-<page>-desktop-*.png`)

| Page | What it shows |
|---|---|
| `friends` | Portfolio directory: "the company we keep" headline, three underlined filter dropdowns (verticals, status, funds) sitting directly on the grid lines, then a dense grid of dark logo tiles snapped to the page columns |
| `tribe` | Community page: "founders backing founders" with the rough circle on the first "founders", short intro paragraph, photo collage |
| `talent` | Statement page: "turns out great taste in friends is a pretty good strategy", then a manifesto paragraph that darkens word by word as you scroll (scroll-scrubbed color from light gray to ink) with small hand-drawn doodle icons inline between sentences |
| `chill` | Events page: blue uppercase eyebrow ("BACKYARD / ISTANBUL"), statement headline, tilted snapshot photo, "learn more" arrow links |
| `content` | Editorial hub: dark featured section with large branded cover left and compact article rows right (chip labels FOUNDER JOURNEY, VIDEO), then light archive with categories/type dropdowns plus search, three-column grid of branded cover cards |
| `impact` | The page from Brad's screenshot: blue uppercase eyebrow "FOUNDERS BUILD A BETTER TOMORROW", h1 "impact", h2 subtitle, one-line support, then the animated bracket CTA "DOWNLOAD IMPACT REPORT 2025"; numbered 01-04 process (64px numbers, 32px titles), flat solid-color stat tiles, portfolio highlights, document list rows |
| `team` | Dark page: snapshot-style portrait grid, lowercase gray role eyebrow plus lowercase name under each photo |
| `nextgen` | Program page: bracket CTA reused ("APPLY NOW") next to a plain text secondary link, "our 6 week program" heading, bento of flat solid-color cards (lowercase chip label top-left, big statement, support text) |
| `founder-fal` | Case study template: uppercase eyebrow "FRIENDS", giant lowercase company name, one-sentence description, bracket CTA "VISIT WEBSITE", meta block with uppercase gray labels (FOUNDERS, LOCATION) over plain values, tilted founder photo, embedded video, "related articles" grid where every headline carries the metric ("fal raises $250m at $4b valuation") |

### Data files

- `e2vc-home-extracted-data.json`: fonts, 108 colors, easings, CSS variables, headings with computed styles, links, scripts, canvas count, full text dump.
- `pages/e2vc-<page>-extracted-data.json`: same per section page.
- `e2vc-annotation-probe.json`: DOM probe of /impact with the bracket CTA's full outerHTML, every rough.js SVG on the page, and the site's inline source for the annotation and text reveal systems.

## Design tokens (exact, from their live CSS)

- Colors: `--bg: #fcf7f0` (warm cream paper), `--ink: #1c2121` (near-black, slight green cast), `--e2vc-accent: #3451f5` (electric blue), `--grid: rgba(28,33,33,0.15)` (hairlines), `--footer-bg: var(--e2vc-accent)`, `--selection-bg` accent with cream text. Dark sections flip via `--section-bg: #1c2121`, `--section-ink: #fcf7f0`, `--section-kicker: rgba(252,247,240,0.55)`, `--section-accent: #b8cbff` (lightened blue for dark grounds; note they lighten the accent on dark rather than using it raw). Compare ours: `--paper #F5F6F8`, `--ink #0B0F17`, `--acc #0657F9`, `--line rgba(11,15,23,.12)`, `--darkpanel #0B0F17`. Same skeleton, theirs warm, ours cool.
- Secondary chip palette used ONLY on content covers and impact stat tiles: `#31FE6A`, `#2D51FF`, `#C294FF`, `#E4FC53`, `#FF5001`, `#FF6FFF`, `#680030`. This violates our one-accent rule and does not transfer; see "what we do NOT take".
- Font: **Inter Tight variable, 100 to 900, one family for everything** (Webflow icons font aside). No mono, no serif.
- Type scale (computed): H1 135.36px, weight 600, line-height 0.95, letter-spacing -0.01em, `text-transform: lowercase`. H2 64px weight 700 lowercase. H3 titles 24px weight 500; process titles 32px weight 700; process numbers 64px. Body base 14px (too small for us). Meta chips and eyebrows uppercase.
- Grid and spacing: `--gutter-x: 64px`; 4 to 5 full-height hairline columns visible on every page, light or dark or blue (grid color adapts per section via tokens). Cards: `--card-size: 388px`, `--card-lg: 434px`, `--card-md: 421px`, `--card-sm: 408px`. Tilted photo strip: `--strip-angle: -13.2deg`, `--strip-step-x: 333px`.
- Easings: `cubic-bezier(0.7, 0, 0.3, 1)` and `cubic-bezier(0.9, 0, 0.1, 1)` (hard fast-out soft-land pair), `cubic-bezier(0.625, 0.05, 0, 1)` (expo-like), `cubic-bezier(0.4, 1.6, 0.4, 1)` and `cubic-bezier(0.34, 1.56, 0.64, 1)` (gentle overshoot, used for playful moments only).
- Stack (script list): Webflow + jQuery base, GSAP 3.15 with ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase, Draggable, InertiaPlugin, ScrambleTextPlugin, plus rough.js 4.6.6 (hand-drawn strokes), matter.js 0.19 (footer physics), locomotive-scroll. 4 canvases on the homepage. Heavy custom inline code on top of Webflow; the polish is hand-written, not template.

## The hand-drawn annotation system (deep dive)

This is the signature Brad called out, fully reverse-engineered in `e2vc-annotation-probe.json`.

How the bracket around "DOWNLOAD IMPACT REPORT 2025" works:

1. The CTA is a plain `<a>` with a text span plus an empty `<span data-cta-bracket aria-hidden="true">` positioned over it.
2. JS builds an SVG sized to the link (`viewBox 0 0 w h`, `preserveAspectRatio: none`) and uses **rough.js** to draw 6 lines forming `[` and `]`: top tip, vertical, bottom tip on each side. Options: `strokeWidth 3`, `stroke` read from `--e2vc-accent` at draw time, `roughness 1.6` on tips and `2.2` on verticals, fixed seeds (3, 5, 7, 11, 13, 17) so the shape is stable across redraws. Geometry: `inset = max(6, min(w,h) * 0.04)`, `tipLen = max(14, h * 0.12)`, top/bottom inset `h * 0.12`.
3. It pre-renders **8 "boiling" frames** of the same bracket (`seed + frame * 17`), each in its own `<g>`, only one visible at a time, cycled on a timer. The stroke wobbles like a living pencil line without any path animation. All frames sit under a shared `filter="url(#ink-texture)"` SVG filter for ink grain.
4. Entry animation: GSAP DrawSVGPlugin draws frame 0's paths from 0% with a stagger (the hero circle uses duration 2.0). The screenshots caught `stroke-dasharray`/`stroke-dashoffset` inline mid-flight; that is all DrawSVG is.
5. `prefers-reduced-motion` disables the boil and the draw-on; the bracket just renders.

The same engine draws everything hand-drawn on the site: the hero ellipse around "friends" (`rough.ellipse`, `roughness 2.8`, `strokeWidth 3.5`, 8 frames, drawn only AFTER the headline's word reveal completes, via the reveal's onComplete), the blue underlines, the nav's bracket around the current page link, the menu asterisk dot, footer clock asterisks, and card arrows (those in ink, not blue).

Their text reveal, from the same probe: `[data-text-reveal]` splits to words, **pure Y translate, no mask, no opacity**, duration 0.7, stagger 0.045, `power4.out`. Hero variant fires after the loader's `e2vc:ready` event; scroll variant fires once at ScrollTrigger "top 85%". After landing it flips line wrappers to `overflow: visible` so annotations can overflow the line box.

Even the vertical grid hairlines are SVG paths rebuilt with quadratic beziers through displaced points, so the lines can bend and settle. There is also a width-only resize guard (iOS toolbar scroll fires resize; they ignore height-only changes to stop doodle flicker). That gotcha is worth remembering if we build any of this.

Our version (Framer Motion stack): rough.js is ~9KB gzipped and framework-agnostic. Generate the bracket/circle/underline paths with fixed seeds in a `useEffect`, animate draw-on with Framer Motion `pathLength` 0 to 1, and boil by cycling 3 frames of visibility with an interval (8 is overkill for us). Colors from `var(--acc)`. Reduced motion: render static. This is a small, self-contained component, no GSAP needed.

## Patterns ranked for BigSquare

1. **Hand-drawn accent annotation system.** Bracket as the secondary CTA style, one circled word in the hero headline, underline for key links. It is the site's entire personality for the cost of a 9KB library and one component. Reads as "a human marked up this page", which fits a marketing firm annotating its own work. Use sparingly: one circle, one bracket style, one underline style, always in `--acc`, never more than one annotation per viewport.
2. **Visible full-height hairline column grid on every section.** Our moodboard already wants blueprint-technical; they show the grid itself can be the decoration, persisting across light, dark, and accent sections with a per-section grid color token. Trivial cost (CSS borders or one SVG), huge structure payoff. Their token architecture for it (`--grid`, `--section-bg/-ink/-kicker/-copy/-accent`) is textbook and matches the semantic-token approach we noted on metacci.
3. **Tag-chip metric lockup on case study cards.** Two small chips pinned on the image: name left, hard metric right ("RAISED $750M"). Direct model for our case study cards ("+212% ROAS" style, numbers already required to be `--acc` or on-image chips per moodboard). The alternating sparse feed with whole-viewport gaps is the premium version of a case study list.
4. **Word-by-word Y reveal, no mask, no opacity.** Snappier and cheaper-feeling-expensive than fade-ups; a strong candidate to replace our default fade-up for headlines. Their exact recipe: 0.7s, 0.045 stagger, power4.out equivalent, fire once at 85% viewport.
5. **Case study page template (founder-fal).** Eyebrow, giant company name, one-sentence description, bracket CTA, meta table with uppercase gray labels (FOUNDERS, LOCATION; ours: SERVICE, INDUSTRY, TIMEFRAME), tilted photo, video embed, related items with the metric inside every headline. Maps one-to-one onto our case study spec.
6. **Filterable directory with dropdowns on the grid lines (friends page).** Underlined select controls sitting directly on the layout grid, logo tiles snapped to columns. Model for a client/industry directory or the work index.
7. **Flat solid-color stat tiles and bento cards (impact, nextgen).** Chip label top-left, big number or statement, support text. Structure transfers beautifully for our stats band; recolor to `--acc`/`--acc2`/`--surf` only.
8. **Scroll-scrubbed manifesto paragraph (talent page).** Words darken from `--mid` to `--ink` as you scroll. One good spot for this on our about page. Keep the inline doodle icons idea only if it stays subtle.
9. **Accent-colored footer as the closing brand moment.** Their footer is the only full-accent surface on the site, with world clocks and nav columns. Our moodboard says dark footer; the idea to steal is "the footer is the one place the brand color goes full bleed", which could translate to a `--acc` CTA band above a `--darkpanel` footer. The matter.js physics logo is charming but skip it (see below).
10. **Stepped-column section transitions.** Dark panels rise in blocks aligned to the grid columns instead of a flat fade. Cheap (staggered translateY on column divs) and very on-brand for "big square" geometry.

## What we do NOT take

- **Lowercase everything.** Their all-lowercase voice ("we just have great taste in friends") is intimate group-chat branding. Our copy-rules and corporate-proof positioning keep sentence case.
- **The warm cream palette.** Ours stays cool Graphite. The lesson is the discipline, not the temperature.
- **The rainbow secondary palette** on content covers and stat tiles. Violates our one-accent rule. Our covers and tiles use blue, navy, surface, ink only.
- **The physics footer easter egg and spacejump.** Delightful for a VC courting founders, off-tone for buyers of rigor. Same for the scattered-baseline kinetic type in the "group chat" section; our type stays on its baseline.
- **14px base body text.** Too small; we hold the moodboard's 18px.
- **Their stack.** Webflow, jQuery, locomotive-scroll, five GSAP plugins. We get 90% of the feel with Framer Motion, one rough.js component, and native scroll.
- **Snapshot-casual photography as the only image language.** Works for "friends", partially transfers for our team section, but our case studies need product/work visuals too.

## Implementation notes for our stack

- Bracket CTA component: rough.js + Framer Motion `pathLength`, seeds fixed, colors from CSS vars, static under reduced motion (recipe in the deep dive above). Candidate for `components/AnnotatedCta.tsx` and a single `RoughAnnotation` primitive (variant: bracket, circle, underline).
- Grid hairlines: absolutely-positioned column borders per section, color from a per-section token. Skip their line-bending; it needs a canvas-grade path rebuild loop for a detail nobody consciously sees.
- Their easing pair `cubic-bezier(0.7, 0, 0.3, 1)` / `cubic-bezier(0.9, 0, 0.1, 1)` joins lusion's `cubic-bezier(0.4, 0, 0.1, 1)` on the shortlist for the style guide's canonical easings.
- The per-section theming (`--section-bg`, `--section-ink`, `--section-kicker`, `--section-copy`, `--section-accent`) is the cleanest pattern we have seen for light/dark/accent section switching in one component system. Adopt the naming idea in the style guide pass.
- iOS gotcha for any redraw-on-resize doodle work: only redraw when viewport WIDTH changes; height-only resize events fire constantly while scrolling on iOS Safari.
