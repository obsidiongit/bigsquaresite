# Asset fill: the in-house pipeline (Brad, 2026-08-31)

Brad's brief, from the launch-readiness wrap: the site has ~61 empty MediaSlot placeholders (asset-manifest.md) plus the homepage media owed in tasks.md (hero film, 6 featured-work tiles, newsletter photos, ProofBand panel, the VSL). The pages are built for SEO but real people will browse them, so blank placeholders cannot ship. Brad's designer (paid per project, elite generative AI creator) is producing a handful of video assets and statics that should cover the video sections and some stills. Everything else we fill in-house, targeting 30-50% of all slots, so the designer's project stays small and fast.

Brad's own words on the bar: we are "creating our own world," a blueprint that many assets grow from, cohesive, fun, and never reading as fake imagery. The anti-AI-slop rule from STYLE_GUIDE applies to every asset that ships.

## What already works (the precedents)

- **The ChatGPT section**: `components/sections/home/Search.tsx` renders a full-width chat-input mockup (`ChatInputWidget.tsx`) in pure HTML/CSS at brand tokens. Brad: it "came out great." This is the model: product-shaped visuals built in code, not generated.
- **The blog figure engine**: `scripts/blog-figures/` + `npm run blog:figures` (Playwright + sharp, deviceScaleFactor 2) renders authored HTML into shipped webp assets. The figure design language (paper/ink grounds, the one blue, hairlines, Lenia Mono labels, FIG stamps) is codified there and in blog-plan 2b.
- **The drop-in mechanism**: a finished asset is a file in `public/media/` plus one row in `lib/asset-files.ts`. The placeholder and its ASSET chip drop automatically. Content drops are data, not code.

## The three lanes

### Lane 1: code-built assets (start here, biggest safe win)

Any slot whose brief is a screen, a dashboard, a table, or a UI moment gets BUILT in HTML/CSS with real tokens, then captured. Candidates from the manifest briefs: `services-seo-hero` (map-grid rank tracker), `services-obsidion-portal-exhibit` (the centerpiece), `services-email-band` (send calendar), `services-paid-search-hero` (campaign structure), `services-generative-engine-optimization-band` (answer-engine response), `services-custom-development-band` (internal tool), `home-services-method` (dispatch board), `legal-method` (intake dashboard), `healthcare-method` (booking screen), `blog-author-bigsquare-team`, and every similar "on a screen" brief. That is roughly a dozen slots before touching a single image model.

- Extend the blog-figures runner into a general renderer (`scripts/asset-studio/` or grow `scripts/blog-figures/`; Playwright and sharp are already the pattern, still never in package.json dependencies without a PROJECT_REQUIREMENTS.md line).
- Video versions: CSS-animate the same HTML and capture (Playwright records webm; if ffmpeg is needed for mp4/h264, run it from the scratchpad, not as a repo dep). This also unlocks the blog figure-videos stretch item in tasks.md bucket 2.
- Data inside these UIs follows copy-rules: no invented client names, reviews, or numbers presented as real. Use neutral sample data with the small SAMPLE NUMBERS label where numbers show, or leave name fields as obvious sample brands. A real Obsidion portal screenshot beats a mockup wherever Brad can export one.

### Lane 2: AI-generated imagery (the world)

For photographic slots: storefronts, branded vans, sets, creative walls, workspace scenes, and the fun team composites Brad wants.

- **Blueprint first, generations second.** Before any slot-filling, write `project-sections/assets/world-bible.md`: palette anchored on the brand blue as a physical object in scenes (the square motif shows up in the world), light and lens rules, grain, what our offices and props look like, prompt fragments and negative prompts, and a small set of approved seed/reference images every later generation points back at. This is what makes 30 assets read as one world instead of 30 one-off generations.
- **Tools**: the Higgsfield MCP is already connected in Claude Code (image, video, batch, character reference, upscale, background removal; check the credit balance before a batch and surface costs to Brad). kie.ai needs an API key from Brad before it is an option; treat it as a fallback, not the start. Codex is Brad-driven, not this pipeline.
- **Team composites**: real headshots exist in `assets/team/` (brad, mike, chaley, levi, russel, sadie). Character-reference generations can build the fun group shots and personality photos Brad described. Brad confirms his team is OK with AI-stylized likenesses before any of these ship. They should read as deliberately stylized brand art, not as fake candid photos.
- **Hard limits**: slots whose manifest row says real photo only (`about-founders`, `about-team`, `locations-denver-office`, `locations-tampa-office`) stay real and are never AI-filled. Nothing AI-made may pose as real client work, real results, or a real office. Case-study and results media stay blocked on real clients.

### Lane 3: designer coordination (do not double-build)

Brad's designer is covering the video sections plus a handful of statics. Before building anything, get his covered list from Brad and record it in the manifest. Add an OWNER column to `asset-manifest.md` (`DESIGNER` / `IN-HOUSE` / `REAL-ONLY`), fill it in the triage session, and never build an IN-HOUSE asset for a DESIGNER slot. When his files land, the existing sweep applies: file into `public/media/`, row into `lib/asset-files.ts`, manifest row flips to FILLED.

## Tracking: one place to see everything

- **Working folder**: `assets/generated/<slot-id>/` holds every candidate (`v1.webp`, `v2.webp`, prompt or source noted in a sidecar `notes.md`). Nothing goes to `public/media/` from here until Brad approves it. The folder is the archive Brad asked for: every asset we have made, browsable in one place.
- **Contact sheet**: a dev-only route `/dev/assets` (same idea as `/dev/styleguide`) that walks the manifest and shows, per slot: status, owner, the live placeholder, and any candidates from `assets/generated/`. One page to review everything fast. Build it in the first session; it is the review surface for every later session.
- **The manifest stays the ledger**: every candidate promoted to `public/media/` updates its row (FILLED + date + lane) in the same session, per the manifest's own rule.

## Rules that bite (carry into every session)

- STYLE_GUIDE.md governs look; copy-rules.md governs any words that appear anywhere near an asset. No text baked into images, ever (manifest rule).
- Output specs from the manifest: landscape sources at 2x display size, WebP or AVIF stills (JPG fine), mp4 + poster for video slots, respect each row's aspect.
- Review gate: candidates land in `assets/generated/` freely; wiring into `public/media/` happens only after Brad says yes, per batch, on the contact sheet. One flagship per lane gets his eye before volume production (build protocol).
- New deps go through PROJECT_REQUIREMENTS.md first. MCP generation spends real credits; state estimated cost before a batch and actuals after.
- Never `git add -A`. Asset binaries are staged by path like everything else.

## Session 1 scope (the next conversation)

1. **Triage**: walk all 61 empty manifest slots + the homepage media list (tasks.md punch list) and tag each: LANE-1-CODE, LANE-2-AI, DESIGNER (from Brad's list, ask if missing), or REAL-ONLY. Add the OWNER column to the manifest. Post the counts, that IS the "what we can and cannot do" answer Brad wants.
2. **Skeleton**: create `assets/generated/` + the `/dev/assets` contact sheet.
3. **Flagship each lane**: one code-built asset (recommend `services-generative-engine-optimization-band`, the answer-engine response, it extends the ChatGPT-section idea Brad already loves; or the `services-obsidion-portal-exhibit` if a real portal export exists) and one Higgsfield test in the world-bible style (recommend a person-free scene, e.g. `services-branding-band` vehicle/signage). Both land as candidates on the contact sheet for Brad, nothing wired.
4. **World bible draft**: the one-pager above, written before the Higgsfield test so the test proves the blueprint, not a random prompt.

Later sessions: volume production per lane in batches, Brad reviewing on the contact sheet; team composites after consent; figure videos; sweeps as designer files land.

## What Brad owes this workstream

- The designer's covered-slot list (so the OWNER column is real)
- Team OK for AI-stylized likenesses before composites ship
- kie.ai API key only if we outgrow Higgsfield
- Real Obsidion portal exports (beats any mockup for the portal slots)
- The real-photo-only shots (offices, founders, whole team) whenever they exist
