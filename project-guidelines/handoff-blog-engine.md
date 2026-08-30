# Handoff, 2026-08-30: the blog asset engine (HTML/CSS figures) + question-led topics

Brad's direction, verbatim intent: GPT Image covers are REJECTED ("low quality, can't get the resolution or the size we need", and routing through Codex is "too clunky"). The move: **Claude builds each figure as an HTML/CSS element, screenshots it, and that render IS the asset.** One agent, one LLM, end to end: the writer job produces the post AND every visual in one pass. Also: pivot the topic queue toward answering real questions people actually ask (Reddit and the wider web), because direct answers are the stronger SEO play.

## Shared rules (same as every pane)

- Read first: CLAUDE.md, project-guidelines/project-brief.md, copy-rules.md, STYLE_GUIDE.md (3.1 fonts, 4.3 hairlines), decisions.md, and `project-sections/blog/blog-plan.md` (the blog plan; section 2b is the figure design language, 2c is the history of the rejected image-gen path).
- Brad runs parallel panes. Re-read shared files right before editing; never `git add -A`; stage your own paths by name. tasks.md / STYLE_GUIDE.md / asset-manifest.md often carry other panes' uncommitted hunks: stage ONLY your hunks (HEAD content + your edit via `git hash-object -w` + `git update-index` works).
- Copy rules bite: no em dashes, no invented numbers/people/quotes, `[PLACEHOLDER]` for anything unsourced, numerals for all numbers, sentence case headlines.
- Verify before done: screenshots at 375/768/1280/1536 + reduced motion, zero horizontal overflow, `npx tsc --noEmit`, `npm run build` (stop dev servers first; another pane may own :3000, check before killing anything). Playwright: install/symlink in the session scratchpad, `channel: "chrome"`, wheel-scroll not scrollTo (Lenis).
- End with a short plain list of what was built. Commit your own files; do not push.

## You own

`scripts/blog-figures/**` (new), `scripts/blog-assets.mjs`, `content/**`, `lib/blog.ts`, `lib/blog-toc.ts`, `lib/blog-authors.ts`, `mdx-components.tsx`, `app/(marketing)/blog/**`, `project-sections/blog/**`, plus your own hunks in asset-manifest.md, tasks.md, STYLE_GUIDE changelog.

## State as of 2026-08-30 (all committed on main)

- Blog pipeline v2 is LIVE: `content/blog/<slug>.mdx` frontmatter (title, description, date, author, tags, draft + v2 keys cover/coverAlt/takeaways/quote/resource), `lib/blog.ts` loader (drafts hidden, reading time computed, loud build failures, authors validated against `lib/blog-authors.ts`), post anatomy (cover MediaSlot, takeaways panel, sticky TOC, `<Quote>`/`<Callout>`/`<Figure>` MDX pieces, GFM tables, resource row, author card, share row), per-post typographic OG card, Article JSON-LD (Person + worksFor for named authors).
- 2 launch posts, bylined Brad Brown (CEO) and Mike Soden (CTO). 6 authors registered; headshots wired for 5 (levi.png still owed in `assets/team/`).
- `npm run blog:assets` (`scripts/blog-assets.mjs`): raw files in `assets/blog-covers/` and `assets/team/` become cropped webp in `public/media/` plus rows in the AUTO-MANAGED block of `lib/asset-files.ts`. Idempotent. Uses Next's bundled sharp.
- One GPT-generated cover is live (`blog-cover-agency-7-numbers`). Brad rejected the approach; REPLACE this render too so every figure is one crisp system.
- Empty placeholders still visible: `blog-cover-local-seo-scale`, `blog-fig-spend-by-channel`, `blog-fig-local-seo-system` (briefs in asset-manifest.md rows and in each post's `<Figure note>`).

## Job 1: the figure renderer (the core of this session)

Build `scripts/blog-figures/`: Claude authors each figure as a small self-contained HTML file, Playwright screenshots it, sharp converts, the existing wiring picks it up.

Suggested shape (yours to improve):
1. `scripts/blog-figures/figures/<slot-id>.html`: one file per figure. Self-contained: inline CSS, `@font-face` pointing at `../../public/fonts/LeniaMono-*.woff2` via relative file paths (Playwright loads file:// fine). Use the REAL tokens: paper #F5F6F8 / ink #0B0F17 grounds, one blue #0657F9, hairlines rgba(11,15,23,.12) light / rgba(233,236,241,.14) dark, Lenia Mono for the FIG stamp and labels. The design language is blog-plan.md 2b: a figure, not a poster; squares depict the topic; 2-3 tiny mono labels; FIG. NNN stamp; flat.
2. `scripts/blog-figures/render.mjs`: for each figure HTML, open at the right size and screenshot at deviceScaleFactor 2. Covers: 1600x800 viewport -> 3200x1600 render. Inline figures: 1440x810 (16:9) and 1200x900 (4:3) where the post asks. Output PNG to a temp dir, then sharp -> webp into `public/media/<slot-id>.webp` (crisp: these are exact-size renders, no cropping needed; extend `blog-assets.mjs` or call its block-rewrite so `lib/asset-files.ts` stays auto-managed).
3. `npm run blog:figures` runs it. Keep Playwright OUT of package.json (dependency rule): resolve it from the session scratchpad or an env var (`BLOG_FIGURES_PW=<path>`); document that the cron environment installs playwright + chromium in its own step.
4. Render ALL FOUR current slots this session: re-render `blog-cover-agency-7-numbers` (FIG.001: 7 squares on a baseline, bracket, N = 7), `blog-cover-local-seo-scale` (FIG.002, dark ground: 1 big square vs a 4x5 grid, N = 20), `blog-fig-spend-by-channel` (a real table composition: 4 channels, 2 months, cost per lead column; render the table in HTML with the site's table styling), `blog-fig-local-seo-system` (the 1-vs-20 system diagram with the source-of-truth / review-flow / leads-by-location bars). Delete the GPT source from `assets/blog-covers/` when its replacement lands so blog:assets does not fight the renderer over the same slot (decide the precedence and write it down).
5. Verify each render at 100% and downscaled in the page (screenshot the live post at 1280 + 375), then check the FULL gate list above.
6. Videos (Brad's stretch idea: "turn those into short videos or images"): do NOT build this session unless everything else lands. If attempted: CSS-animate the same figure HTML and capture with Playwright video or frame-by-frame -> webm; a new `<FigureVideo>` MDX piece with reduced-motion poster fallback. Otherwise record it in blog-plan as the next step with your recommended mechanics.
7. Update blog-plan 2c (the image-gen section) to point at the renderer as THE pipeline; update the 5 asset-manifest rows; STYLE_GUIDE changelog entry for the figure system; routine-prompt.md: the writer now AUTHORS a figure HTML per `<Figure>` it writes (spec: copy an existing figure file's skeleton) and the job runs `npm run blog:figures` before opening the PR.

## Job 2: question-led topics (Brad: "answer real-life questions... scrape against things like Reddit posts")

1. Research pass THIS session: use web search to collect 15-20 real questions owners ask in the agency/marketing space across the lanes (ecommerce, software, home services, legal, healthcare, franchise, general). Sources: Reddit (r/smallbusiness, r/marketing, r/PPC, r/bigseo, r/agency, r/franchise, r/ecommerce), Quora, People-Also-Ask phrasings. Take the QUESTION and the pain, never quotes or usernames (nothing scraped gets pasted into posts; no invented "people are saying" claims).
2. Rework `content/blog/TOPICS.md`: keep the format but make the working titles literal questions ("Should I run Google ads myself or hire an agency?"). Add a `source:` field naming where the question shows up (subreddit or "PAA") so a human can sanity-check demand. Replace or re-angle the weakest existing topics; keep anything already strong.
3. Routine prompt: posts open by answering the question DIRECTLY in the first 2 paragraphs (the GEO/answer-engine play; see lib/service-pages/generative-engine-optimization.ts for the house language), then earn the depth below. Title = the question where natural, under 60 chars.
4. Optional if time: a `research:` step in the writer job (blog-plan 2c/3) so the cron refreshes the queue itself monthly; needs web access in the cloud environment, note it for the developer.

## Owed by Brad (do not block on these)

levi.png headshot in `assets/team/`; the Claude GitHub App install; creating the routine with `/schedule` (blog-plan section 3); Batch 4 + Blog v2 review.

Wrap up with: files built, the 4 rendered figures (before/after shots), the new TOPICS.md question list, and what changed in the writer contract.
