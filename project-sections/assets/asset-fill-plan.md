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
- **Tools, in order (Brad, 2026-08-31)**: **Codex is the image engine.** Brad's plan gives free, near-unlimited image generation there (GPT image-to-image with references), so stills volume costs nothing and we can generate wide and pick the best. Codex CLI is NOT on this machine yet (`codex` not on PATH as of 2026-08-31); Brad installs it and signs in, then the session wires it up: invoke it non-interactively, feed it the world-bible prompt plus reference images, have it write candidates straight into `assets/generated/<slot-id>/`. Proving that hookup end to end is part of the session 1 flagship. **Higgsfield is for video only**: it is expensive for stills and Codex makes that spend pointless, and even for video, good quality takes real iteration, so treat every video as its own small project (check the credit balance first, surface estimated cost before a batch and actuals after). kie.ai stays a fallback that needs an API key from Brad, only if we outgrow both.
- **Team composites**: real headshots exist in `assets/team/` (brad, mike, chaley, levi, russel, sadie). Character-reference generations can build the fun group shots and personality photos Brad described. Brad confirms his team is OK with AI-stylized likenesses before any of these ship. They should read as deliberately stylized brand art, not as fake candid photos.
- **Hard limits**: slots whose manifest row says real photo only (`about-founders`, `about-team`, `locations-denver-office`, `locations-tampa-office`) stay real and are never AI-filled. Nothing AI-made may pose as real client work, real results, or a real office. Case-study and results media stay blocked on real clients.

### Lane 3: designer coordination (track, do not block)

Brad's designer is covering the video sections plus a handful of statics. Add an OWNER column to `asset-manifest.md` (`DESIGNER` / `IN-HOUSE` / `REAL-ONLY`) as a tracking device, not a prohibition. For STILLS, overlap is fine (Brad, 2026-08-31): image generation costs nothing through Codex, so generating candidates for slots he is also covering just means more options on the contact sheet and Brad picks the winner. For VIDEO, do not double-build: that is his core deliverable and our video lane is the slow, paid one. When his files land, the existing sweep applies: file into `public/media/`, row into `lib/asset-files.ts`, manifest row flips to FILLED.

## Tracking: one place to see everything

- **Working folder**: `assets/generated/<slot-id>/` holds every candidate (`v1.webp`, `v2.webp`, prompt or source noted in a sidecar `notes.md`). Nothing goes to `public/media/` from here until Brad approves it. The folder is the archive Brad asked for: every asset we have made, browsable in one place.
- **Contact sheet**: a dev-only route `/dev/assets` (same idea as `/dev/styleguide`) that walks the manifest and shows, per slot: status, owner, the live placeholder, and any candidates from `assets/generated/`. One page to review everything fast. Build it in the first session; it is the review surface for every later session.
- **The manifest stays the ledger**: every candidate promoted to `public/media/` updates its row (FILLED + date + lane) in the same session, per the manifest's own rule.

## Rules that bite (carry into every session)

- STYLE_GUIDE.md governs look; copy-rules.md governs any words that appear anywhere near an asset. No text baked into images, ever (manifest rule).
- Output specs from the manifest: landscape sources at 2x display size, WebP or AVIF stills (JPG fine), mp4 + poster for video slots, respect each row's aspect.
- Review gate: candidates land in `assets/generated/` freely; wiring into `public/media/` happens only after Brad says yes, per batch, on the contact sheet. One flagship per lane gets his eye before volume production (build protocol).
- New deps go through PROJECT_REQUIREMENTS.md first. Higgsfield (the video lane) spends real credits: state estimated cost before a batch and actuals after. Codex stills are free; generate wide.
- Never `git add -A`. Asset binaries are staged by path like everything else.

## Session 1 scope (the next conversation)

1. **Triage**: walk all 61 empty manifest slots + the homepage media list (tasks.md punch list) and tag each: LANE-1-CODE, LANE-2-AI, DESIGNER (video especially), or REAL-ONLY. Add the OWNER column to the manifest. Post the counts, that IS the "what we can and cannot do" answer Brad wants.
2. **Skeleton**: create `assets/generated/` + the `/dev/assets` contact sheet.
3. **Flagship each lane**: one code-built asset (recommend `services-generative-engine-optimization-band`, the answer-engine response, it extends the ChatGPT-section idea Brad already loves; or the `services-obsidion-portal-exhibit` if a real portal export exists) and one Codex still in the world-bible style (recommend a person-free scene, e.g. `services-branding-band` vehicle/signage), which also proves the Codex hookup end to end. Both land as candidates on the contact sheet for Brad, nothing wired. No Higgsfield this session unless Brad asks for a video test.
4. **World bible draft**: the one-pager above, written before the Codex flagship so the test proves the blueprint, not a random prompt.

Later sessions: Codex volume production in batches (free, so generate wide and cull hard), Brad reviewing on the contact sheet; team composites after consent; Higgsfield video as its own careful project; figure videos; sweeps as designer files land.

## Session 1 log (2026-08-31, DONE; reviewed by Brad the same day, verdict below)

1. **Triage DONE**: OWNER column added to every manifest row + a new homepage-media table. Counts across the 61 empty slots: 16 LANE-1-CODE, 23 LANE-2-AI, 22 REAL-ONLY; homepage media: 3 DESIGNER (hero film, VSL, funnel video), 4 REAL-ONLY, 1 LANE-2-AI (newsletter cycle photos). In-house can cover 39 of 61 slots (64%), above the 30-50% target, so the designer's project stays small.
2. **Skeleton DONE**: `assets/generated/` (+ README with the promotion contract) and the `/dev/assets` contact sheet (dev-only, walks the manifest + candidate folders on refresh; verified live). `npm run assets:studio` renders Lane-1 slot HTMLs from `scripts/asset-studio/slots/` into candidate folders.
3. **World bible DRAFTED**: `world-bible.md` (the blue square as a physical object, no-text/no-screen-UI/no-people-v1 hard rules, light/lens/grain, place list, prompt kit + seed-ref contract). Brad reviews before volume production.
4. **Lane-1 flagship DONE**: `services-generative-engine-optimization-band`, 4 candidates (code-v1..v4) from a 4-angle design workflow with a contract gate; session pick code-v1 (the answer card). All on `/dev/assets`.
5. **Codex hookup PROVEN + Lane-2 flagship DONE**: CLI 0.151.0 signed in on Brad's plan; `scripts/asset-studio/codex-still.mjs` is the runner (prompt via stdin ALWAYS: the npm ps1 shim mangles multi-line args; refs via `-i`; workspace-write; `~/.codex/generated_images/` fallback scan; auto 21:9 crop + notes stamp). `services-branding-band/gen-v1` is the proof (the van still; agent self-corrected an off-palette detail unprompted).
6. Nothing wired into `public/media/`; manifest still all-EMPTY on the in-house lanes.

## Brad's review of session 1 (2026-08-31): 5 out of 10, not shippable as-is

Brad's words: "not super thrilled with how anything's coming out... a good idea, but definitely needs a lot of refinement... if I was grading this, I'd say it's like a 5 out of 10... Our brand needs to be not AI slop at all. We put a lot of effort into making the brand presence extremely premium and unique, and then we can really kill the vibe with low-quality assets like we produced using both methods... cool idea on paper, but in practice it's gonna take quite a bit more work."

Verdicts:
- `services-generative-engine-optimization-band` code-v1..v4: REJECTED AS-IS. Not promoted; the slot stays EMPTY.
- `services-branding-band` gen-v1 (the Codex van): REJECTED AS-IS. Not promoted; the slot stays EMPTY.
- The triage, the contact sheet, the candidate archive, the renderer, and the Codex hookup stand; they are plumbing, and the plumbing works. The OUTPUT of both lanes is below the bar. The workstream stays open and passes to the developer with the rest of the handoff.

## Developer handoff: where to pick this up

**What exists and works (do not rebuild):**
- `project-guidelines/asset-manifest.md`: OWNER column = the triage (16 LANE-1-CODE / 23 LANE-2-AI / 22 REAL-ONLY, plus the homepage-media table). Every slot's aspect and brief is there.
- `/dev/assets` (dev server only): the review surface. Reads the manifest and `assets/generated/<slot-id>/` on every refresh. Every candidate ever made shows here with its notes.md.
- `npm run assets:studio`: renders `scripts/asset-studio/slots/<slot-id>.html` at 2x into `assets/generated/<slot-id>/code-v<N>.webp` (`--new` keeps the old version). Playwright is deliberately not in package.json: `npm i --no-save playwright` or point `ASSET_STUDIO_PW` at an install, `PW_CHANNEL=chrome` uses installed Chrome.
- `node scripts/asset-studio/codex-still.mjs <slot-id> <prompt-file> [--aspect W:H] [--ref img]`: Codex CLI stills. Prompt goes via STDIN ALWAYS (the npm `codex.ps1` shim destroys multi-line arguments; the `.cmd` shim + stdin works). Codex must be signed in (`codex login status`). Output: `gen-v<N>-full.png` + aspect-cropped `gen-v<N>.webp`, notes stamped.
- `project-sections/assets/world-bible.md`: the Lane-2 art direction draft. Brad has not approved it; treat it as a starting point.
- Promotion contract (unchanged): a winner is copied to `public/media/`, gets one `lib/asset-files.ts` row, and its manifest row flips to FILLED + date + lane. Only after Brad says yes on `/dev/assets`.

**Why both flagships scored a 5 (the honest diagnosis, so the next attempt does not repeat it):**
- Lane 1 (code-built UI): the skeleton-bar language (grey pills standing in for text) is the generic wireframe look every AI mock uses. It was chosen to satisfy the no-invented-text rule, but skeleton + mock = placeholder, and a placeholder can never read premium. Contrast: the blog FIGURES (approved 2026-08-30) are geometric figures in the brand language, not product mocks. Lesson: figures beat mocks; real product beats both. For the "on a screen" slots, real Obsidion portal exports (Brad owes them) are the only thing that will read as real.
- Lane 2 (Codex stills): the van reads as a product cutout composited onto a wall: no grounding shadow, flat lighting, no grain, 1774px source (under the 2x target). Technically on-brief, emotionally stock. One free generation is a sketch, not an asset.

**Refinement directions if Brad wants another round (pick with him, do not run all):**
1. Lane 1: drop skeleton mocks. Build the code-built slots as FIGURES (the blog-figure language: squares, hairlines, one blue, mono labels, sample-labeled numbers where numbers appear), or as real-type compositions using sanctioned sample copy with the SAMPLE label. Start from `scripts/blog-figures/figures/` as the skeleton, not from `slots/`.
2. Lane 2: iterate the world bible with Brad before generating again (2 to 3 seed images he approves, then image-to-image from those); demand grain, real shadows, and the largest landscape size in every prompt; generate 6 to 10 per slot and cull to 1. Or hand stills to the designer too, and use Codex only to sketch briefs for the designer.
3. Everywhere: real beats generated. Office photos, team photos, portal exports, real client work. The REAL-ONLY rows plus Brad's owed content fill more of the site's credibility than any generated candidate.

**The bar (Brad, 2026-08-31):** the brand is premium and unique; a single low-quality asset kills the vibe. If a candidate would not survive next to the homepage, it does not go on `/dev/assets` as a serious option.

## What Brad owes this workstream

- ~~Codex CLI installed and signed in~~ DONE 2026-08-31 (0.151.0, ChatGPT login, hookup proven in session 1)
- The designer's covered VIDEO list (stills overlap is fine, video is where double-work costs money)
- Team OK for AI-stylized likenesses before composites ship
- kie.ai API key only if we outgrow Codex + Higgsfield
- Real Obsidion portal exports (beats any mockup for the portal slots)
- The real-photo-only shots (offices, founders, whole team) whenever they exist
