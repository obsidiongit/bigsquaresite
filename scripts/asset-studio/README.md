# Asset studio (Lane 1: code-built interior assets)

The blog-figure engine generalized for the asset fill workstream
(`project-sections/assets/asset-fill-plan.md`). Any manifest slot tagged
LANE-1-CODE is authored as a self-contained HTML file in `slots/<slot-id>.html`,
rendered at 2x by `render.mjs`, and the webp lands as a CANDIDATE in
`assets/generated/<slot-id>/code-v<N>.webp` for review on `/dev/assets`.
Nothing here writes to `public/media/` or `lib/asset-files.ts`: promotion is a
manual step after Brad approves (see `assets/generated/README.md`).

- `npm run assets:studio` renders every slot HTML; pass ids for a subset,
  `--new` to keep the old version and write the next `code-v<N>`.
- Authoring rules are the blog-figure contract (`scripts/blog-figures/README.md`):
  inline CSS only, fonts via `@font-face` from `../../../public/fonts/`, real
  tokens verbatim, no network, no JS.
- Sizing: `<meta name="figure-viewport" content="WxH">`, default 1680x720
  (~21:9 band at 2x = 3360x1440). Bands crop to 16:9 on mobile: keep the
  composition inside the central ~76% of the width.
- These are ASSETS, not blog figures: no FIG stamp. UI compositions follow
  STYLE_GUIDE 6.12 (structural skeletons, no invented numbers or names; field
  labels fine, digits are not) and 6.4's UI-fragment rule (bare rounded cards
  with soft shadows, never fake browser chrome). Anything with illustrative
  numbers carries a small SAMPLE label.
- Playwright: not in package.json, same resolution as blog-figures
  (`ASSET_STUDIO_PW`/`BLOG_FIGURES_PW` hint or `npm i --no-save playwright`;
  `PW_CHANNEL=chrome` uses installed Chrome).

Lane 2 stills run through `codex-still.mjs` (the Codex CLI hookup): prompt file
per run (world-bible fragments), reference images via `-i`, output cropped to
the slot aspect as `assets/generated/<slot-id>/gen-v<N>.webp`. See the header
comment for the contract; `project-sections/assets/world-bible.md` for the
prompt kit. The Codex CLI must be installed and signed in (`codex login status`).
