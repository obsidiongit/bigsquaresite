# Blog figure renderer

Every blog cover and inline figure is authored as a small self-contained HTML file in
`figures/`, screenshotted at 2x by `render.mjs`, and that render IS the asset
(Brad, 2026-08-30: no image models, no stock, no manual steps). `npm run blog:figures`
renders every stale figure into `public/media/<slot-id>.webp` and rewrites the
AUTO-MANAGED block in `lib/asset-files.ts` (through `scripts/blog-assets.mjs`, the
block's only writer). Pass slot ids to render a subset:
`npm run blog:figures -- blog-cover-agency-7-numbers`.

## Authoring a figure (the writer's contract)

Copy an existing file in `figures/` as the skeleton. Rules, from
`project-sections/blog/blog-plan.md` 2b and STYLE_GUIDE 3.1 / 4.3:

- File name = the slot id (`blog-cover-<short-name>.html` or `blog-fig-<short-name>.html`),
  which must match the post's `cover:` frontmatter or `<Figure id>`.
- Sizes via `<meta name="figure-viewport" content="WxH">`: covers `1600x800` (2:1),
  inline figures `1200x675` (16:9). Rendered at deviceScaleFactor 2.
- Self-contained: inline CSS only, fonts via `@font-face` pointing at
  `../../../public/fonts/LeniaMono-*.woff2`. No network, no JS.
- Tokens, verbatim: paper `#F5F6F8` or ink `#0B0F17` ground (covers alternate light/dark
  between posts), one blue `#0657F9`, hairlines `rgba(11,15,23,.12)` on paper /
  `rgba(233,236,241,.14)` on ink, labels Lenia Mono 500, uppercase, letter-spacing .08em,
  ink (or `#E9ECF1` on dark), `font-variant-numeric: tabular-nums`.
- The design language: a figure, not a poster. Blue squares depict the topic. Hairlines
  are chart geometry (baseline, axis, bracket). 2 or 3 tiny mono labels on covers
  (a system diagram may need a few more), never a sentence, never the headline.
  A `FIG. NNN` stamp top-left: covers increment per post (FIG. 001, FIG. 002, ...),
  inline figures take the post's number plus a decimal (FIG. 001.1). Flat: no gradients,
  no shadows, no photos, no 3D.
- Safe areas: covers are CSS-cropped to 16:9 on phones, so keep everything inside the
  central 88% of the width (>= 96px side margins at 1600). Inline figures render 1:1
  when the post's `<Figure>` passes `aspect="16 / 9"`; always pass it for a real render.
- Illustrative numbers in a figure (a sample table) get a small "SAMPLE NUMBERS" label
  on the render (copy-rules: nothing invented may look real).

## Precedence

A slot with a figure HTML here belongs to this renderer. `npm run blog:assets` skips raw
drops in `assets/blog-covers/` for such slots (warning, no overwrite), so the two
pipelines never fight over `public/media/<slot-id>.webp`. Raw drops remain the path for
photos, portal screenshots, and headshots only.

## Playwright (deliberately NOT in package.json)

Resolution order in `render.mjs`:

1. `BLOG_FIGURES_PW`: path to a directory containing a playwright install (a Claude
   session points this at its scratchpad `npm i playwright`); `PW_CHANNEL=chrome` uses
   the installed Chrome so no browser download is needed.
2. A normal `require("playwright")`. The scheduled writer job installs it in its own
   step, without touching package.json:
   `npm i --no-save playwright && npx playwright install chromium`.

`sharp` comes from the copy Next already ships.
