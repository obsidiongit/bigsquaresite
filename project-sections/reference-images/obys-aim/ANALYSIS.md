# Reference: AIM by Obys (aim.obys.agency)

Captured 2026-08-21 with a headless Chrome pass at 1440x900 (desktop) and 390x844 (mobile). No WebGL anywhere (zero canvases), so the stills are faithful to the layout, but the site is animated top to bottom: black glyph shapes tumble through the page, headlines reveal against ghost copies of themselves, and gallery images slide horizontally. Open aim.obys.agency alongside these images when making motion decisions.

Status: typographic and editorial ceiling reference. AIM is an art project by Obys (a reimagining of Kharkiv Modernism via AI imagery). It proves how far you can get with two colors, one typeface, hairline rules, and conviction. We borrow its editorial systems, not its palette and not its art-project looseness.

## Why this reference matters for BigSquare

Lusion showed our palette can carry a world-class site. AIM shows the other half: structure. Its information bars, footnote annotations, bracketed index labels, and viewport-scaled statement type all read technical, measured, and expensive, which is exactly the moodboard's "Clean. Measured. Premium. Technical." Every pattern here works in Graphite with the blue accent added; none of it requires their colors, their font, or any GPU cost.

## Screenshot index

| File | What it shows |
|---|---|
| `obys-aim-desktop-01-top.png` | Hero: viewport-filling AIM logotype cropped by a thick black rule, then a 4-column hairline info bar (brand line / Index / Experiment / About / [Gallery] / Obys Agency ©2025), then a two-column intro: "Modernists:" index list left (E01: through E05:), "AIM— AI Modernism Of Kharkiv" heading right, "Scroll to Explore" bottom right |
| `obys-aim-desktop-02.png` | Scroll transition: black rectangular glyph shapes tumble through the viewport and collide with the heading mid-reveal |
| `obys-aim-desktop-03.png` | Manifesto section: full-width statement paragraph at roughly 5vw with footnote markers [*] and [**] in the running text; a ghost duplicate of the text sits behind the settling black shapes |
| `obys-aim-desktop-04.png` | Manifesto continues; second paragraph "By leveraging modern technology, we [***]..." with shapes mid-fall |
| `obys-aim-desktop-05.png` | Footnote row: three annotations ([*] Collective name, [**] Main visual AI tool, [***] Experiment produced by Obys) spread across three columns with small portrait media panels between them |
| `obys-aim-desktop-06.png` | Three tall portrait media panels in a row on the greige page (captured before their content painted; on the live site these are video/image panels) |
| `obys-aim-desktop-07.png` | Full-black gallery band begins: images stagger in from the edges over the black ground |
| `obys-aim-desktop-08.png` | Gallery band mid-entrance: fashion portrait and sculptural artwork sliding in, large black negative space |
| `obys-aim-desktop-09.png` | Gallery band settled: three AI artworks side by side on black (portrait, constructivist forms, architecture) |
| `obys-aim-desktop-10.png` to `-11.png` | Gallery scrolls horizontally within the vertical page: images shift as one strip, greige returns behind them |
| `obys-aim-desktop-12.png` | "Explore Experiment" pinned section entering; headline caught mid mask-reveal against its own ghost |
| `obys-aim-desktop-13.png` to `-16.png` | Pinned showcase: "Explore Experiment" display type left, full-width underlined "Learn More →" rule link, "[06] Featured:" list where the active name is ink and the rest are grayed (Suprematista, then Buntesglas), right-side media swaps per name, "1—6" / "2—6" counter, footer line "Kharkiv Modernism × Obys × AI  ©2025" |
| `obys-aim-mobile-*.png` | Same flow at 390px: nav collapses to a single "Menu" word, everything stacks to one column, type stays viewport-huge, the pinned showcase becomes a stacked image + headline + list |
| `obys-aim-extracted-data.json` | Fonts, body style, headings, page copy, and script list pulled from the live DOM. Note: colors and easings arrays are empty because Webflow serves CSS from a cross-origin CDN the extractor cannot read; tokens below were pulled from that CSS file directly |

## Design tokens (exact, pulled from their live CSS)

From `aim-faa90d.webflow.shared.*.css` and the live DOM:

- Colors: the entire custom CSS uses exactly two: page `#E7E4DF` (warm greige) and ink `#141414`. There is no accent color anywhere in the UI; all color on the site comes from the AI artwork (brick red-orange `#A72805` range, ochre, sky blue). Compare ours: `--paper #F5F6F8` is cooler and lighter, `--ink #0B0F17` is close to their ink. Their palette does not transfer; their two-color discipline does.
- Fonts: **Khtekatrial 400 and 500 only** (a custom grotesk in the Helvetica family tree). One family, two weights, for everything from the mega logotype to 14px meta. Same lesson as Lusion's two-family stack: premium comes from restraint, not variety.
- Type scale: `html { font-size: 1vw }` makes every em value viewport-scaled. Display sizes in the CSS: 16em (hero logotype, about 16vw), 9.5 to 9.7em (section display), 5 to 5.7em (manifesto statement), then fixed 14px / 18px / 24px for UI and meta. Two-tier system: viewport-scaled display, fixed-px utility text.
- Letter-spacing: -0.02em to -0.035em on display type. Line-height 0.85 to 1 on display, 1.2 on text. Tighter than anything in our current scale; this is where their poster feel comes from.
- Rules and chrome: 1px `#141414` hairlines everywhere (under the info bar, above footnotes, on the "Learn More" link row). No rounded corners, no pills, no shadows. Media is hard-edged and square.
- Labels: bracketed and indexed meta everywhere: `[Gallery]`, `[06] Featured:`, `[*]` footnotes, `E01:` to `E05:` list numbering, `1—6` counters. This is their version of our mono eyebrow system, done with the body font instead of a mono.
- Easings: none in CSS. Motion runs through Lenis smooth scroll (v1.0.27 from CDN, confirmed in the page scripts) plus Webflow interaction JS. CSS transitions are utilitarian (`opacity .2s`, `all .3s`).
- Stack fact: Webflow plus jQuery plus Lenis. Zero WebGL, zero canvas. The most striking site in our reference set so far is also the cheapest to render.

## Patterns worth stealing (ranked for BigSquare)

1. **Hairline info bar.** A single row under the hero: brand line left, nav center, a bracketed utility link, copyright right, all 14px over a 1px rule. Direct fit for our nav-adjacent meta or the top of the footer. Costs nothing, reads instantly as "engineered."
2. **Footnote annotation system.** Small `[*]` markers inside running text, resolved in a hairline-ruled annotation row below. Perfect for our rigor story: qualify a claim, name a data source, define a term. Use the mono font for markers to tie into our eyebrow system. (Copy rules still apply: no invented numbers to footnote.)
3. **Viewport-scaled statement section.** One manifesto paragraph at display scale (their 5em on a 1vw root, ours would be a `clamp()` value near 4vw) with tight leading and footnote markers. Strong candidate for the positioning statement under our hero. Expensive-feeling, zero GPU.
4. **Bracketed index labels.** `[01]`, `E01:`, `1—6` counters for services, process steps, and case study lists. Slots straight into our IBM Plex Mono eyebrow slot with tabular numerals.
5. **Pinned showcase with cycling list.** Sticky display headline left, an index list where only the active item is ink (rest at `--mid`), media panel right that swaps per item, with an n-of-total counter. Strong pattern for our services section or featured case studies.
6. **Full-width rule link.** "Learn More →" sitting on its own 1px rule spanning the column. A quiet secondary CTA for in-section links; our pill buttons stay primary per the moodboard.
7. **One oversized cropped wordmark moment.** Their hero logotype fills the viewport and is cropped by a rule. Our version, if any, is a footer moment (giant BigSquare wordmark cropped at the page bottom), not the hero: our hero is the framed video panel per the moodboard and the Lusion analysis.

## What we do NOT take

- The palette. Warm greige is the opposite temperature of Graphite. Unlike Lusion, nothing here color-matches; we take structure only.
- Zero-accent monochrome UI. Their restraint works for an art archive. A marketing site needs conversion cues; our blue stays on buttons, links, and metrics.
- Tumbling black shapes that collide with and occlude the copy, and the ghost-text reveals. Playful art gestures that fight readability; the moodboard says measured, not busy.
- Lenis smooth scroll. Same call as the Lusion analysis: native scroll for SEO, accessibility, and LCP.
- The global `html { font-size: 1vw }` trick. It breaks user font-size preferences and browser zoom. If we want viewport-scaled display type we use `clamp()` on specific display classes only.
- Display type at 0.85 line-height and -0.035em tracking as a default. A small dose on one statement section maybe; our scale stays as the moodboard defines it.
- Their content model (an art gallery). Our media stays real work, real team, or brand-abstract shapes.

## Implementation notes for our stack

- Info bar and rule links: plain flex rows with `border-top: 1px solid var(--line)`. No JS.
- Footnotes: `<sup>` markers styled in `--m` (mono), annotation row as a grid under a hairline. Anchor links optional.
- Pinned showcase: CSS `position: sticky` for the left column plus a Framer Motion `AnimatePresence` swap on the media panel; active list item toggles `--ink` vs `--mid` color. No scroll hijack needed.
- Statement section: `clamp(28px, 4vw, 56px)` display size, Framer Motion line-stagger reveal, `prefers-reduced-motion` respected per the moodboard.
- Counters: IBM Plex Mono with `font-variant-numeric: tabular-nums` so "1—6" does not jitter when cycling. (Site copy itself never uses em dashes; the counter glyph is part of the mono index styling, not prose. If that reads as a conflict with copy-rules.md, use "1/6".)
