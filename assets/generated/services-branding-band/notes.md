# services-branding-band: candidates

Slot brief (manifest): the brand applied on vehicles, signage, or uniforms. ~21:9 band on /services/branding/, links /results/. Lane: LANE-2-AI, the Codex flagship (asset-fill-plan session 1). World bible: `project-sections/assets/world-bible.md`.

## Queued prompt (fires when the Codex CLI lands; reference: `_world-refs/bigsquare-mark.png`)

Editorial brand photograph, measured and airy composition, soft even overcast daylight, 35mm film grain, matte finish, slightly desaturated muted palette of paper white, soft grey, graphite and pale wood, straight-on architectural framing, generous negative space, premium campaign photography, no people. A clean white work van in profile parked against a pale grey wall, one bold matte cobalt-blue painted square panel (#0657F9) on its side as the only color accent and only marking, wide cinematic 21:9 crop with the van left of center and quiet wall space right. No text, no letters, no words, no logos, no watermarks, no readable signage, no faces, no UI on screens, no HDR, no lens flare, no golden hour, no neon, no gradients, no oversaturation, no glossy 3D render look, no stock photo feel.

Variants to run in the same batch (same base, swap the subject clause): the storefront row with one blue blade sign; the uniform rack (graphite workwear, one blue square patch); the signage detail (blue square blade sign against overcast sky).

## Candidates

- gen-v1: Codex still 2026-08-31, THE HOOKUP PROOF (session 1 flagship). Prompt above, ref `_world-refs/bigsquare-mark.png`, via `codex exec` stdin pipe, workspace-write sandbox. The Codex agent self-corrected mid-run: first render had red/orange vehicle-light details breaking the one-blue rule, it fixed them before saving. Full frame 1774x887 (`gen-v1-full.png`), center 21:9 crop 1773x760 (`gen-v1.webp`). Review note: composition and palette on-brief (van, one blue square, overcast, air right); reads slightly cut-out/clinical vs the world bible's "printed, not rendered" bar, and 1774px source is under the 2x display target. Next runs: push film grain + ground shadow in the prompt, ask for the largest landscape size.
