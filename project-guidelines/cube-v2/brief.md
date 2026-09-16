# Cube v2: the premium WebGL rebuild

Brad, 2026-09-05. This is the working file for the "award-show-grade" cube (tasks.md, "Premium cube"). It is built in Codex (GPT-6 Astro) with Claude steering. Everything here is ready to paste.

Folder:
- `brief.md` (this file): the illoca teardown, the direction options, the Codex prompts.
- `reference/illoca/`: 10 frames of illoca.com at 1440x900, real GPU, in scroll order.
- `reference/current/`: 6 frames of our homepage today, same setup, so the gap is visible side by side.

## 1. What illoca.com actually is (teardown, 2026-09-05)

Stack, read off the live site:
- Nuxt 3, one full-screen WebGL canvas (2160x1350 at DPR 1.5), Lenis virtual scroll. The document never scrolls (scrollHeight equals the viewport); the wheel drives a camera path.
- Assets: Draco-compressed GLB scenes (`letter_scene.glb`, `footer.glb`), KTX2/Basis textures (the sketch, the floor plans, the facades), a 49-frame JPG flipbook for the "blueprint drawing itself" beat, and a baked light mask (`illoca_light.png`). No GSAP on the window; motion is a scroll-progress camera plus damping.
- Post: film grain over everything, paper-grid page behind the framed canvas.

The six things worth stealing (none of them is "better glass"):

1. **One world, one camera.** The whole homepage is a single 3D room. Scroll moves the camera along a path with stations. Each section is a station where the camera parks and the DOM copy slides in beside the frame (`reference/illoca/illoca-07.jpg`). Nothing "appears": the camera arrives.
2. **The 3D tells the product story.** Sketch on tracing paper (04) becomes a floor plan (10), lifts into a massing model (18), gets an interior fit-out (36), gets a facade. The object transforms with the narrative. Ours spins.
3. **The rendering language IS the brand.** Two-tone non-photoreal shading: one cobalt blue for shadow, one paper beige for light, a hard terminator, thin navy ink outlines, paper grain, a translucent "tracing paper" sheet material. No photoreal, no glass, no HDRI reflections. This is why it never reads as stock 3D or AI slop.
4. **Framed, not full-bleed.** The canvas sits inset on the grid-paper page like a drawing; the nav floats over the page, not over the scene.
5. **Textures carry the detail, the shader stays cheap.** Hand-drawn plans and a baked light mask do the work. That is how it runs at DPR 1.5 with grain on top.
6. **Slow, damped, grounded.** Nothing floats or spins. Objects sit on surfaces and cast hard shadows. Motion comes from the camera; objects move only when the story says so.

## 2. Where we are (honest read of `reference/current/`)

- The hero cube is frosted glass with a stochastic "smoke" core: an opaque shader that discards fragments by noise so the glass will blur it. At DPR 1 to 2 and roughness 0.09 the blur never lands, so the core reads as blue pixel noise (`00-hero-rest.jpg`, `05-companion-empty-paper.jpg`). That is the "pixely animation" you are seeing. It is a rendering method problem, not a tuning problem.
- No ground, no shadow, no contact: the cube floats in front of the page with no relationship to it, so it reads as a pasted asset.
- The choreography (14 approved rounds: swoop, flatten, film develop, balloon, reform, companion, work panel morph, solution sweep, services dock, portal window) is rich and stays. The problem is the OBJECT and its LOOK, and that between beats it is a small cube spinning on empty paper.
- The genre is wrong for the brand. "Spline glass cube" is the 2024 AI-agency default. Our page is paper, one blue, mono type, hand-drawn ink (RoughAnnotation), a pixel cursor, a field of outlined squares. Illoca's genre (illustrated two-tone 3D on grid paper with hand lettering) is a near-perfect match for that system. Glass is not.

## 3. Direction options

**A. Glass, done properly.** Same genre, fixed execution: real refraction with dispersion (drei `MeshTransmissionMaterial`: backside, samples, chromatic aberration), the smoke replaced by a raymarched volumetric core rendered to a half-res buffer, a soft contact shadow, film grain. Lowest risk, least change. Likely verdict: "good, not great". Still a floating object.

**B. The blueprint world (illoca's method, our brand).** Replace the lone cube with a scene made of squares: a city of locations, every block a storefront, rendered two-tone (paper `#F5F6F8` lit, `#0657F9` shadow, `#0A2A73` ink outline, grain) on the page's own grid. Scroll is a camera path with a station per section. Because BigSquare's world is made of cubes, the geometry is PROCEDURAL: no GLB, no modeling, no Draco. The two-tone shader is cheap, which also attacks the homepage perf 40 score. Biggest swing, biggest rebuild.

**C. Same protagonist, new language, plus a world (recommended).** Keep the cube as the hero and keep the approved beat timings and section contracts (`data-cube-anchor`, `lib/work-panel`, `lib/solution-sweep`, `lib/services-dock`, `lib/portal-window`). Change three things:
1. Render it in the two-tone ink language (B's shader) instead of glass. Kill the smoke core; the cube's interior story becomes surface story (ink marks, the face that becomes the film).
2. Give it a ground: a shadow plane and a paper-grid floor the cube ROLLS on. A rolling cube (edge-over-edge tumble, 90 degrees per beat, on a surface) replaces the mid-air spin. It is physically grounded, it is literally "the square keeps moving", and it gives every scroll beat a checkpoint for free (rest on a face).
3. Let it multiply where the story wants numbers: six blocks in featured work, four modules snapping onto it in solution, one block found and pinned in search, 90 squares on the floor in First 90 Days (the day grid already exists in DOM; the world's floor can be it).

C gets us illoca's craft with a fraction of illoca's asset cost, and every existing choreography file keeps its clock. Do C in three phases and look at real renders before choosing anything: Prompt 1 below builds all three looks side by side so you pick from pixels, not words.

Hero ideas to try in Prompt 2 (pick one, not all):
- The cube sits ON the page, bottom-right of the headline, with a hard cast shadow across the grid; the headline's circle annotation and the cube's shadow are the only two "ink" marks in the fold.
- First scroll: the cube rolls one edge toward the film card position, and the face that lands up is the one that becomes the screen (keeps the flatten beat, adds the roll).
- A tracing-paper sheet drops over the cube during the film develop (illoca's sheet material) and the film shows through it, then lifts with the balloon.
- Pointer: the cube's ink outline thickens toward the pointer side (a cheap, on-brand hover answer), no tilt.

## 4. Ground rules for any Codex session (paste as Prompt 0)

Codex reads the repo, but it does not know the house rules. Prompt 0 sets them once per session.

```
You are working in the BigSquare marketing site (Next.js 16 App Router, TypeScript, Tailwind, three 0.185, @react-three/fiber 9, framer-motion 13, lenis). Read CLAUDE.md, then project-guidelines/cube-v2/brief.md in full, then look at every image in project-guidelines/cube-v2/reference/ (illoca frames in scroll order, then our current frames). Then read components/sections/home/HomeStage.tsx and components/sections/home/HomeCanvas.tsx end to end before writing any code.

Hard rules for this session:
1. Scope. You may create and edit files only under components/sections/home/cube/, app/dev/cube/, and lib/cube/. You may edit components/sections/home/HomeCanvas.tsx only when a prompt says so explicitly. Do not touch any other file. If you believe another file must change, stop and tell me which line and why.
2. Dependencies. Do not install anything without asking. If I approve one, add it to project-guidelines/PROJECT_REQUIREMENTS.md with a one-line reason. Report the gzipped size delta of the lazy 3D chunk after any dependency change (current: about 232KB gz, budget line 200KB, overage decision pending).
3. Scroll. The canvas already receives smoothed scroll progress via damped followers and useScrollCheckpoints. Do not add GSAP or ScrollTrigger. Do not hijack scroll. All motion must be a pure function of scroll progress plus time.
4. Three.js traps already learned in this repo (they are real, do not relearn them): never pass a uniforms object as a JSX prop to <shaderMaterial> (r3f binds a clone; build ShaderMaterials imperatively and attach with <primitive object={mat} attach="material" />); transmission materials exclude transparent partners and write depth, so anything composited over glass needs depthTest false and top renderOrder; raw ShaderMaterial colors use new THREE.Color().setHex(hex, THREE.NoColorSpace) and the Canvas is `flat`.
5. Brand. Exactly one accent blue, #0657F9. Navy #0A2A73 is depth, not a second accent. Paper #F5F6F8, ink #0B0F17. No gradients that introduce a new hue. No em dashes in any user-facing text.
6. Performance. Keep the existing IntersectionObserver frameloop gate, the DPR watchdog, and dispose on unmount. Any new render target runs at half resolution unless you justify full. Target 60fps at 1440x900 DPR 1.5 on an integrated GPU.
7. Reduced motion. When prefers-reduced-motion is set the canvas does not mount at all (HomeStage handles this). Do not break that.
8. Verification. After every task, run the dev server, open the page, and give me screenshots at the exact scroll positions I name, at 1440x900. Never tell me something looks right without a screenshot. Report frame time from the DPR watchdog if it stepped down.
9. Communication. Before a task that touches more than one file, write a five-line plan and wait. After a task, reply with: files changed, what each change does in one line, screenshots, open questions. No essays.
10. When I reject a frame, I will name the frame and what is wrong. Fix only that. Do not "improve" nearby things I did not mention.
```

## 5. Prompt 1: look-dev sandbox (paste after Prompt 0)

Goal: three real renders of the cube, side by side, in isolation, so the direction is chosen from pixels.

```
Task: build a look-dev sandbox at /dev/cube (app/dev/cube/page.tsx, client-only canvas, robots already disallow /dev/). It renders ONE 1x1x1 rounded cube (RoundedBoxGeometry 1,1,1,4,0.06 like HomeCanvas) three times in a row on the site's paper ground (#F5F6F8) with the ambient square field visible behind it, each with a different look. Same camera (fov 30), same idle turntable (0.15 turns per second, y axis), same pointer tilt as the current hero cube. A DOM slider at the bottom scrubs a `flat` value 0..1 for all three at once (0 = cube, 1 = a 16:9 pane the way HomeCanvas flattens it) so I can judge each look mid-morph, not only at rest.

Look 1, "glass fixed": MeshPhysicalMaterial transmission as today but with backside rendering, samples 8, chromatic aberration 0.03, roughness 0.12, thickness 0.8, ior 1.4; and the smoke core replaced by a raymarched volumetric (fbm density, 24 steps, brand blue scatter, rendered to a half-res target and composited inside the cube's screen rect). A soft contact shadow on a ground plane under it. No environment reflections of a room; a two-light studio only.

Look 2, "two-tone ink": custom ShaderMaterial. Lighting is a single directional light; the fragment shader steps N dot L at 0.5 with a 0.02 smoothstep into exactly two colors: lit = paper #F5F6F8 mixed 8 percent toward #0657F9, shadow = #0657F9. Ink outline: an inverted-hull back-face pass in #0A2A73 at 1.5 px screen-constant width. A paper grain overlay (hash noise, 4 percent, animated at 12fps, not per frame). A hard cast shadow on the ground plane in the same #0657F9 (shadow map, PCF off, so the edge is hard). The cube also gets one hand-drawn-looking ink mark per face (a small square outline, slightly wobbly, baked into a 512px texture with alpha) so faces are distinguishable while it turns.

Look 3, "ink plus tracing paper": Look 2 plus a translucent sheet material (a 1.4 x 1.0 plane, alpha 0.55, paper color, faint blue tint where it overlaps the cube's shadow side, slight grain) that hovers 0.05 above the cube's top face at flat 0 and becomes the pane's own surface at flat 1, so the film later shows through paper rather than through glass.

Deliverables: screenshots at 1440x900 for each look at flat 0, flat 0.5, flat 1, plus a 3-second GIF or frame strip of the idle turntable for Look 2. Tell me the frame time for each look. Do not touch HomeCanvas.tsx. Do not add dependencies; if Look 1 genuinely needs @react-three/drei for MeshTransmissionMaterial, stop and ask with the size cost.
```

When the renders come back, judge them against `reference/illoca/illoca-18.jpg` (their massing model on the desk) and `reference/current/00-hero-rest.jpg`. The bar: would this frame survive next to illoca's? Pick one look and only then move to Prompt 2.

## 6. Prompt 2: the hero WORLD (Brad picked two-tone ink, 2026-09-05)

### Why the material swap was not the rebuild

Brad's read after playing with /dev/cube: "we're just changing what the cube element is made out of... scratching the surface." Correct. Put `sandbox-captures/cube-1440-flat-0.0.jpg` next to `reference/illoca/illoca-18.jpg` and the difference is not the shader:

1. **They built a place. We have an object.** Illoca's frame has a desk, a person, a lamp, books, sheets, a window: five or six depth layers. Ours has one primitive on nothing. A single cube cannot carry a hero at any material quality; composition does that.
2. **Their camera moves. Our object moves.** Scroll drives a camera through the room, and the depth layers slide past each other (parallax). That parallax is the "advanced" feeling. Ours keeps the camera nailed and flies the cube around, which reads as a floating asset.
3. **One raking light, long shadows.** Their lamp throws shadows two or three object-widths across the desk. Half the drama in every illoca frame is a shadow. Our shadow is a stub.
4. **Scale.** Their scene fills 70 percent of the viewport. Our cube is 300 px on a 900 px stage.
5. **Assets.** Illoca is not vibe-coded end to end. The plans, the sketches, the light mask, the figure are hand-made by an illustrator and a 3D artist; the code is glue. Our advantage: BigSquare's world is made of squares, so the geometry is procedural, and the hand-drawn ink language already exists in RoughAnnotation. We need a handful of authored 2D textures (face marks, the mark, grid paper), not a modeler.

So the rebuild is structural, not cosmetic: a WORLD with depth layers and a camera path, in the ink look. Everything below is that.

### The world (locked for Prompt 2)

- **Ground.** A paper plane (#F5F6F8) with the site's hairline grid drawn in the shader (ink at 6 percent alpha, cell size matching the DOM square field), receiving hard #0657F9 shadows. The camera is pitched so the ground is visible and runs to the horizon like illoca's desk. Grain 4 percent at 12 fps over everything; a 6 percent vignette.
- **Light.** One directional key at 26 degrees elevation from the upper left. Shadows are long (2 to 3 cube widths) and hard. Shadow map 2048, resolved edge, no jaggies (the sandbox's torn-paper edge goes).
- **Protagonist.** The cube, 1 unit, two-tone ink from `lib/cube/ink.ts`, resting ON the ground. At hero rest it fills 40 percent of viewport height at 1440 and sits in the open area right of the headline, its shadow running under the headline's last line.
- **Supporting cast (this is the missing 80 percent).** Twelve blocks on the ground in three depth bands: 3 foreground (0.35 to 0.5 units, partly cropped by the frame edge), 5 midground (0.2 to 0.35), 4 background (0.15 to 0.25, near the horizon). Four of them are flat tiles lying on the paper (squares 0.6 wide, 0.02 thick) like illoca's sheets. Every block is ink-shaded and casts a shadow. Positions come from one seeded layout table in `lib/cube/world.ts`, so they never change between loads. Nothing overlaps the headline's text box at rest.
- **Ink on the world.** One hand-drawn ink ring on the ground around the protagonist (RoughAnnotation's stroke character, baked as a texture, blue), echoing the headline's circle. One face mark per cube face as today.
- **Pointer.** The CAMERA yaws and pitches by at most 1.5 degrees toward the pointer, damped. Objects never tilt.

### The hero choreography (replaces flatten, pane, and reform)

The film is no longer a separate pane the cube flattens into. The cube's front face IS the screen. One object, one camera, no morph seams:

1. **p 0 rest.** Composition above. Headline in DOM as today.
2. **p 0.08 to 0.46, the approach.** The camera cranes down and dollies toward the cube (headline exits as today). The foreground blocks slide out of frame faster than the background ones (parallax). The cube does not move.
3. **p 0.38 to 0.55, the face.** The camera arrives square to the front face; the face fills exactly the card rect (16:9, 0.34 stage width desktop, 0.62 mobile). The face's ink mark fades and the film develops ON the face (duotone to color, existing DEVELOP timing). The "Proof before promises." headline and side text arrive as today.
4. **p 0.62 to 0.92, the push.** The camera keeps pushing in until the face fills the framed panel (4vw margins, radius 24). Because it is a camera move, the frame edges of the face stay perfectly straight; no cloth morph.
5. **p 0.92 to 1, the hold.** Meta and marks as today.
6. **Reform (raw 6/7 to 1).** The camera pulls back and rises to the companion view: the cube on its ground with its shadow, smaller, right of center, and the film on the face re-inks and dies. No un-balloon, no re-thicken, no crossfade. This deletes the R_* block, FilmPane, skinW/skinH, and the transmission/alpha-glass mix.

Scroll-up is the same path reversed. Checkpoints: rest at p 0, the face at 0.55, the hold at 1, companion view at reform 1.

### Prompt 2, ready to paste

```
Task: build the hero WORLD described in project-guidelines/cube-v2/brief.md section 6 as a standalone route first, app/dev/cube-world/, with its own pinned 560vh scroll runway and a copy of the hero DOM (headline, statement, strip, card-beat text) so it can be judged as the real fold. Read section 6 twice. It is locked; do not reinterpret it.

Build order, one screenshot set per step, stop after each for my yes:
1. World at rest: ground with grid and grain, key light, protagonist cube in two-tone ink (reuse lib/cube/ink.ts, do not fork it), twelve supporting blocks and tiles from a seeded table in lib/cube/world.ts, long hard shadows, ink ring. Screenshot at 1440x900 and 375x812.
2. Camera path: the approach, the face, the push, the hold, the pull-back, scrubbed 1:1 by the runway with the damped follower pattern from HomeCanvas (copy the follower, not the file). Screenshots at p 0, 0.25, 0.46, 0.55, 0.75, 0.92, 1, reform 0.5, reform 1.
3. Film on the face: the front face samples the hero video texture (public/media/hero-loop.mp4 with the poster first, same media contract as HomeCanvas useFilmMedia), duotone to color on the existing DEVELOP timing. Screenshots at 0.5, 0.6, 0.92.
4. Pointer camera parallax, reduced motion (no canvas, the static composition Hero.tsx already renders), DPR watchdog, frameloop gate, dispose. Frame time at each preset.

Rules: no new dependencies; no GSAP; no changes outside app/dev/cube-world/, components/sections/home/cube/, lib/cube/. Shadow edges must be resolved, not aliased. Nothing may overlap the headline text box at rest. All colors are the four brand tokens. Report per step: files changed, one line each, screenshots, frame time, open questions.
```

Once step 4 is approved, Prompt 2b swaps the world into HomeCanvas.tsx behind HomeStage and deletes the glass, smoke, FilmPane, and R_* code, keeping the companion journey's clocks for Prompt 3.

### Shipping plan (Brad, 2026-09-05: "get this out of beta, no revisits 30 days in")

Four review rounds, not fourteen: (1) world at rest, (2) camera path, (3) film face plus swap into the homepage, (4) companion beats in one pass. Each round has its screenshot set named above, so a round is a yes or a list of frame numbers with what is wrong. Codex or Claude can build any round; whoever has usage builds, the other verifies with the GPU capture script.

## 7. Prompt 3: the page journey (after the hero is approved)

Do this one section at a time. One beat per message. Template:

```
Task: the <SECTION> beat only. Current behavior: <one sentence from HomeCanvas's comments>. New behavior: <two sentences, literal, with counts>. Clock: keep <lib file> as the clock; do not change its constants. The cube stays behind section ink (z-10) and over grounds. Give me screenshots at <SECTION> progress 0, 0.5, 1 at 1440x900 and 375. Do not touch any other beat.
```

Beat ideas, in page order (each is a candidate, not a list to build):
- Featured work: the cube rolls along the paper band under the headline and, on each quarter turn, LEAVES a block behind (six blocks for six works) instead of swapping captions. The last block is the one that floods blue and becomes the panel (the existing work-panel morph, unchanged).
- Problem strip: the blocks go dark one by one as the numbered rows pass (the "big accounts" problem), the protagonist stays lit.
- Solution card sweep: as the cube passes under each card, a small block snaps onto it (ads, search, site, creative), so by the end it is a 2x2 stack: one team, four modules.
- Search: the stack gets a pin (a single hand-drawn ink mark from RoughAnnotation's vocabulary, blue), the "found" moment.
- Services dock: the camera, not the cube, does the move: a slow orbit around the stack while the spotlight index runs.
- Portal: unchanged handoff (dive, flatten, flood, DOM window grows out of it). The stack un-stacks into one cube first, so the handoff object is still a square.
- First 90 Days: the 90-square DOM grid is the floor; the cube rolls one square per day-step and ends on square 90, which is the closing CTA.

## 7b. Status log

**2026-09-05, Prompt 1 DONE (Codex, local environment, usage limit hit at the final capture step).** Codex writes straight into this repo: `app/dev/cube/page.tsx`, `components/sections/home/cube/{CubeSandbox,LookCanvas}.tsx` + `sandbox.module.css`, `lib/cube/{glass,ink,performance,types}.ts`. No dependencies added. Open `http://localhost:3000/dev/cube/` on the running dev server to see it (the route did not exist before, so it does not show up on the homepage). Claude verified 2026-09-05 with GPU Chrome at 1440x900 and 375x812: no shader errors, all three looks under 7 ms/frame at DPR 1.5 (GPU: glass 1.2 ms, ink 0.3 ms, tracing 0.1 ms). Captures: `sandbox-captures/` (Claude's, real GPU) and `codex-captures/` (Codex's own, moved out of the app route tree). Claude's read of the renders: glass is a white blob with no silhouette and a white rectangle at flat 1 (fails the illoca bar); two-tone ink survives next to `reference/illoca/illoca-18.jpg` (hard blue shadow, navy outline, per-face marks, clean pane at flat 1); tracing paper adds almost nothing at rest and reads as a lighter band mid-morph. Known nits in the ink look for Prompt 2: the shadow edge is an unfiltered half-res shadow map (reads as torn-paper grain; decide if that is a feature), and the flattened pane still casts a shadow (Prompt 2 already says scale it to 0).

**2026-09-05 late, ROUND 1 (world at rest) BUILT by Claude, awaiting Brad.** Route: `http://localhost:3000/dev/cube-world/`. Files: `lib/cube/world.ts` (seeded cast table, ground grid shader, blue shadow plane, ink ring, key light), `components/sections/home/cube/WorldCanvas.tsx` (fixed canvas, rest framing per viewport, pointer camera parallax), `components/sections/home/cube/WorldStage.tsx` (harness: fold DOM copy at z-10 over the canvas at z-5, vignette, frame readout), `app/dev/cube-world/page.tsx`. `lib/cube/ink.ts` now exports its material factories and tokens (the sandbox still works). No dependencies. Six shot rounds to land the composition (1a: all faces blue because the key sat behind the cube; 1b: cube crowding the headline; 1c to 1f: cast placement, skyline pushed to the horizon, ring color fixed for the managed pipeline). Final frames: `sandbox-captures/world-r1f-{desktop,mobile,wide}.jpg`. 6.9 ms/frame at DPR 1.5 with a 4096 shadow map. Known: the cube's shadow runs under "you can count." on purpose; mobile keeps the cube small above the 5-line headline; the DOM grain overlay is vignette-only (grain lives in the materials). Next: round 2, the camera path (brief section 6, "The hero choreography").

**2026-09-05 night, ROUND 1 REBUILT as the town at rest (Claude, per 10.3 and 10.4), awaiting Brad.** Route: `http://localhost:3000/dev/cube-world/`. Frames: `sandbox-captures/world-r1-town-{desktop,mobile,wide}.jpg` (real GPU, DPR 1.5); `world-r1-town-1a-foreground-van.jpg` is the rejected first cut. Files: `lib/cube/props.ts` (new: road, startTick, storefront, tree, van, sheet, pin, contactShade; one shared ink material and one outline material; box hulls use corner-diagonal normals so the 1.5px outline never opens at an edge), `lib/cube/town.ts` (new: the road table, ROAD_HEADING, composeTown), `lib/cube/world.ts` (block table and face marks gone, plain cube, shadow box recentred between cube and town), `lib/cube/ink.ts` (outline offset scales by normal length, one line), `WorldCanvas.tsx` (PCF shadows, the "soft" flag is deprecated in r185). No dependencies. 7.0 ms/frame at DPR 1.5 on all three presets, tsc clean. Four shot rounds (1a to 1d). Deviations from 10.4, each forced by the rest framing (cube at 87 percent of the width, headline line 1 to 86 percent): (1) the road is flat geometry ribbons with a hand-drawn wobble, not a canvas texture: a 4096 texture over the 40 unit run is 114 px per unit next to the ring's 512, blurry beside the cube; only the START lettering is a texture (accent face). (2) The three storefronts stand where the road reaches the town (z -12 to -17), in the band above the headline: at 1440 the midground left of the road is behind the text and right of it is off frame. (3) The van is parked at the roadside in the town, cropped by the right edge, not in the foreground right: there a van hid the cube's corner and its shadow buried the START line (see the 1a frame). (4) Contact shades are soft rounded rects sized to each footprint (a disc under a box reads wrong). Mobile at rest shows the cube, its shadow, the ring and the road's start only: the band above the 5-line headline holds five units of depth, so the town is above the frame until round 2's camera moves; the START tick and the sheets are hidden below 768px. Open for Brad: the van's spot, the mobile rest fold, and whether START lettering on the paper stays. Next: round 2 (10.3).

**Brad's round 1 review (2026-09-05 night): direction approved, "good, not great", keep going.** Notes, verbatim in spirit: the van's spot in the town reads weird, and the van plus storefront idea is good, not great; the START mark is not liked where it is unless it plays into another part of the site; he wants a subtle 3D rendering of the BigSquare logo somewhere in the world, the way illoca's mark sits in a few of its scenes (`assets/logo.svg` is the mark; three's SVGLoader plus ExtrudeGeometry in the ink material, no dependency); `/dev/cube-world/` stays live as the place where he and the team piece together the site's animation from a few options, so do not fold it into the homepage yet. Round 2 carries these: drop the START lettering from the rest frame (or make it the first stroke the road draws on scroll), take the van out of the rest frame and bring it in at its story beat (10.1: problem and solution stretches), and add the logo as a cast member.

**2026-09-06, ROUND 2 (the hero moves) BUILT by Claude, awaiting Brad.** Route: `http://localhost:3000/dev/cube-world/` (add `?nosettle` to park at any progress; otherwise the checkpoints glide to the rests). Frames: `sandbox-captures/world-r2-{desktop,mobile,wide}-{p0,p0.25,p0.46,p0.55,p0.75,p0.92,p1,reform0.5,reform1}.jpg` (real GPU, DPR 1.5). Files: `lib/cube/path.ts` (new: the world constants, the beat windows, the camera keyframes per viewport, the roll kinematics, the film state per frame), `lib/cube/film.ts` (new: the film block shared by the paper decal and the protagonist's ink material; every fragment reprojects along the view ray onto the paper before sampling, duotone on HomeCanvas's math), `lib/cube/logo.ts` (new: assets/logo.svg path data through three's SVGLoader plus ExtrudeGeometry), `lib/cube/props.ts` (a frame that draws itself, storefronts that scrub their build, the logo sign, a stroke-progress attribute on ribbons), `lib/cube/town.ts` (the road's first straight through the origin, START gone, the van staged beyond the town, the sign), `lib/cube/world.ts` (applies the clocks), `lib/cube/ink.ts` (optional film branch, outline width uniform; the sandbox is untouched), `WorldCanvas.tsx` (runway follower at 4.5/s, 12/s past the hero; poster-then-video media; explicit camera basis), `WorldStage.tsx` (the 374/560vh runway with Hero.tsx's scrubs and checkpoints). No dependencies. 6.9 to 7.0 ms/frame at DPR 1.5 on all presets, tsc clean. Scroll-up frames at p 0.55 and p 0 match the forward frames.

What moves, in the K clock: [0.10 to 0.22] and [0.24 to 0.36] the two quarter turns, edge over edge about the leading bottom edge, two units down the road onto the film station; [0.12 to 0.32] the station's frame draws itself ahead of the roll (RoughAnnotation's double pass, un-draws on the way back); [0.06 to 0.34] the mid-build storefront tops out (walls rise from the plan, awning and top pop with a small overshoot); [0.08 to 0.55] the camera swings from its rest azimuth to the road's heading and cranes to square over the face, so the road runs up the screen at the top-down; [0.40 to 0.47] the top face lights up in duotone; [0.45 to 0.55] the film spreads from the face to the drawn frame, which fills the card rect at 0.55 (CARD_CENTER, 0.34 width, side text and "Proof before promises." as today); DEVELOP [0.5 to 0.7] to colour; [0.62 to 0.92] the dolly until the frame fills the viewport minus 4vw with 24px corners; hold. Reform: the film re-inks [0.02 to 0.4] and contracts to the face [0.05 to 0.38] while the camera is still over the top, dies on the face [0.36 to 0.56], and the camera rises to the follow shot behind the cube (REFORM_END framing, the road ahead) by 1. Checkpoints: 0, 0.6K, K, 1, as in Hero.tsx.

Decisions, each forced by a frame: (1) the film is one picture on two surfaces: the decal inside the drawn frame and the cube's upper faces both reproject onto the paper plane, so the square face sits flush inside the 16:9 frame with no zoom step at its edge from any angle; the navy hull fades where the silhouette is all film. (2) The drawn frame is not in the rest frame: two units down the road its corners cross "revenue", so it draws itself during the first roll. (3) The cast shadow fades with the film's alpha: over the top, the cube's two-unit shadow poked past the panel as a blue slab; nothing else is in frame then, and it returns as the film dies. (4) Mobile clamps the frame's aspect to 0.75, so the hold is a 3:4 frame filling the width (a 16:9 frame cropped to a portrait panel showed a sliver). (5) The van is staged on the road at z -23.5, the problem stretch, for round 4, and appears in no hero frame. (6) The mark is a pavement sign (0.5 wide) on the left verge four units in front of the first storefront, face lit, the "b" read by its outline and its blue walls; at rest it stands right of "customers." (7) Rest framing gained two steps the round 1 presets never showed: 768 to 1023 parks the cube above the headline (the DOM is the desktop layout there but the headline runs to 80 percent of the width and 62 percent of the height; the sheets hide below 1024), and 1024 to 1439 sits it a little further right and smaller, where the headline wraps "you" onto its second line to 90 percent of the width and the tail of "you" runs in front of the cube's corner. That wrap is a type-scale question for the fold, not a camera one. Open for Brad: the ink frame around the panel at the hold (keep, or fade the stroke as the film fills it); the drawn frame staying around the cube in the companion view; the laptop wrap; the van's first appearance. Next: round 3 (10.3).

**Brad's round 2 review (2026-09-06): "looks good so far, I like the way this is going"; the open points are Claude's call; iterate and expand later.** Decided, so round 3 does not reopen them: (1) the hand-drawn ink frame stays around the panel at the hold: it is the RoughAnnotation box, the same ink system as the headline's circle, and it is what makes the panel a drawn thing on the desk rather than a video player. (2) The drawn frame stays around the cube in the companion view: it is the station the journey leaves from, and round 4's featured-work frames use the same idiom (a drawn frame per work). (3) The laptop wrap (1024 to 1439): the camera stays as built; round 3, which is on the homepage anyway, may make the one-line DOM fix in Hero.tsx (keep "you can count." together at md and up, a nowrap span or a line break) and mirror it in WorldStage. (4) The van first appears in round 4's problem stretch, driving the road ahead of the cube, as 10.1 says; it is staged at z -23.5 now. Also on record for round 3: below the hero the world's grid paper is the home's ground (the canvas is opaque paper at z-5, above section grounds), so the SquareField should stop mounting on the home once WebGL is up and stay for the reduced-motion and no-WebGL branches; sections with full-bleed grounds (search, proof band at z-6) keep painting over the canvas as today. Next: round 3, prompt in 10.6.

**2026-09-06, ROUND 3 as "the homepage swap" BUILT and REJECTED by Brad; code reverted the same day.** Claude ported the world into HomeCanvas per the 10.6 prompt of the time (glass, smoke, FilmPane, R_* deleted; the SquareField dropped with WebGL up; a 6 percent vignette; the canvas clipped at the stage's bottom edge) and the animation itself did not move. Brad's review: "100% not ready to take over to the live version of the site"; the world stays on `/dev/cube-world/` until the WHOLE animation is finished there; the homepage keeps the glass hero and everything else exactly as committed; a round must advance the animation, not its plumbing, and he wants to wake up to progress on the world. Reverted: HomeCanvas.tsx, HomeStage.tsx, Hero.tsx to the committed state; the round 3 edits to lib/cube/path.ts (nav floor, phone rest) and cube/WorldStage.tsx (headline wrap) undone; the world-r3 frames removed. `/dev/cube-world/` renders round 2's frames again.

Kept as notes for the swap, which is now the LAST round and only after Brad signs off the whole world on the dev route: (1) the fixed nav is 72px and frosted once scrolled, so the hold needs a 96px top floor on desktop (the round 4 rule; the dev route has no nav and never shows it); (2) on phones the nav's Let's Talk pill sits on the round 2 rest cube; a lower, smaller rest (dist 13, fy 0.31) clears it; (3) the swap is mechanical and one file: the Tracker's follower drives path.ts, WorldCanvas's camera basis, pointer parallax, layout and media lift into HomeCanvas unchanged, and the section clocks (panel, sweep, dock, portal) survive; (4) below the hero the paper covers Portal's tint ground and the footer unless the canvas clips at the stage's bottom edge; (5) bundle after `next build` with the world: 255.5 KB gz lazy (235.2 three + r3f + world core, 17.2 props/town/SVGLoader/roughjs, 3.1 glue), about +23 KB gz against the 232 KB glass number, the 200 KB line's overage call still Brad's; (6) the homepage capture recipe: wheel only under Lenis, and a synthetic zero-delta wheel event every 60 ms keeps useScrollCheckpoints from gliding off a mid-beat stop while the follower converges (scripts in the session scratchpad, recipe in the memory file). Round plan re-cut in 10.3. Next: round 3 is THE JOURNEY on `/dev/cube-world/`, handoff in 10.6.

Brad's pick (2026-09-05): two-tone ink. Tracing paper rejected ("weird floating piece of paper"). Verdict on the sandbox as a whole: a step, not the rebuild; the world build in section 6 is the answer. Round 1 (world at rest) started by Claude on `/dev/cube-world/` the same evening while Codex was out of usage.

## 9. The concept (brainstorm, 2026-09-05, after Brad's round 1 review)

Brad on round 1: better, more unique, likes the camera; NOT a fan of the multiple cubes; the little face marks are weird; some pieces read as phasing through the floor. Wants the whole concept settled before building more. This section is that.

### 9.1 Rules that fall out of the review

- **One square. Never duplicated.** The cast is not more cubes. Everything else in the world is paper and ink.
- **The world is a drafting sheet.** Graph paper ground, a raking light, long hard shadows. Supporting cast = things that belong on a sheet of paper: hand-drawn ink (the RoughAnnotation vocabulary, drawn on the ground in 3D), flat paper artifacts (a print of the film, a sheet with a drawn chart), and nothing else.
- **Plain faces.** No marks on the cube. Two-tone plus the navy hull carries it. The one exception is the face that becomes the film.
- **Grounded physics.** The cube rests on a face or rolls edge over edge. It never floats, spins in the air, or fades. Every roll is a quarter turn, which gives every scroll beat a natural rest (Brad's checkpoint rule for free).
- **Camera does the moving.** Scroll drives the camera along a path; the cube moves only when the story says roll.
- Round 1 fixes carried into round 2: tiles were a rounded box squashed to 2cm, which is why they look sunk (use a real thin box); solids need a contact shade at the base; cut all blocks.

### 9.2 Three concepts

**A. The drafting table.** The cube is the brand mark sitting on the sheet. Scroll moves the camera across the sheet; the STORY is drawn on the paper as the camera reaches each section (numbered rows, arrows, a chart, a map pin, the film frame), and the cube walks to each drawing. Strength: pure brand, cheap, unique. Weakness: the cube is a bystander; the ink does the acting.

**B. The square becomes everything.** One object that morphs into each section's thing: the screen, the work panel, the search bar, the portal window. Strength: the "one team does it all" metaphor. Weakness: this is the v6 idea again with a new skin; the morphs are where the last 14 rounds went, and it fights the "grounded, never a slab" rule.

**C. The roll (recommended).** One cube rolls along an ink road drawn on the paper. The road is the client's journey and the page is its map. The camera tracks the cube like a follow shot; each section is a station where the road widens into a drawn scene. The cube leaves a faint ink trail behind it (it is the pen). The road ends on day 90: the First 90 Days grid is the last stretch of paper, and the cube comes to rest on square 90, which is the closing CTA. One protagonist, grounded motion, ink as the cast, the camera as the storyteller, and a reason for every section to exist on the same sheet. The film beat: the cube rolls onto a drawn 16:9 frame; the camera cranes down over it; the top face becomes the screen; the camera pulls back and the roll continues.

### 9.3 Concept C storyboard, section by section

Page order: Hero, FeaturedWork, ProblemStrip, Solution, Search, ProofBand, TrustMarquee, Services, Portal, Newsletter, FirstNinetyDays. Camera language: high three-quarter follow shot, pitched down about 20 degrees, with the cube kept in the right third so the DOM ink owns the left.

1. **Hero, rest.** The sheet. The cube at rest lower right, long shadow under "you can count." A short ink road starts under it and runs off toward the top of the frame, with a drawn "START" tick, so the journey is announced before anything moves. Skyline of blocks is GONE; the horizon is empty paper with the road going into it.
2. **Hero, approach and film.** First scroll: the cube rolls two quarter turns along the road onto a drawn 16:9 frame while the headline exits. The camera cranes down until the frame fills the card rect; the top face develops into the film (duotone to color); the camera keeps pushing until the face is the framed panel; hold. Pull back: the film re-inks, the cube is a cube on the road again, smaller, and the camera rises to the follow height.
3. **Featured work.** The road runs past six drawn "frames" on the paper (empty ink rectangles, the way a contact sheet is ruled), one per work. The cube rolls one quarter turn per frame; the DOM cards below are the real content. The last frame floods blue under the cube and becomes the work panel (the existing handoff, driven by the same clock).
4. **Problem strip.** The road narrows and gets messy: crossed-out marks, a scribbled dead end, the four numbered rows drawn as ink on the paper beside the road as each DOM row passes. The cube slows to a stop at the dead end.
5. **Solution.** The road turns. As each of the four cards sweeps by, an ink stroke draws the next stretch of road ahead of the cube (ads, search, site, creative are four strokes of one line), and the cube rolls onto it. The underline moment stays in the DOM.
6. **Search.** A drawn map pin on the paper; the cube rolls to it and stops on it; the pin's ring draws around the cube. The "found" beat.
7. **Proof band and trust marquee.** The camera lifts high and wide: the whole road so far is visible as one drawn line across the sheet, the cube a small square on it. The dark proof band ground paints over the canvas as today; the road reappears under the marquee.
8. **Services.** The camera orbits a half turn around the resting cube while the spotlight index runs; the road ahead fans out into five drawn lanes (the five services), then merges back to one.
9. **Portal.** The road reaches a drawn window frame. The cube rolls onto it, the camera cranes straight down, the top face floods blue and the DOM window grows out of it (existing handoff, same clock).
10. **Newsletter.** Quiet stretch: plain paper, the road, the cube rolling in the right margin beside the form.
11. **First 90 Days.** The road enters the 90-square grid; the grid IS the paper here. The cube rolls one square per step and stops on square 90; its shadow is the last mark on the page. The closing CTA grows out of square 90.

Scroll-up plays everything backwards: the cube rolls back, the ink un-draws (RoughAnnotation already supports two-way).

### 9.4 What this costs

- Geometry: one cube, one ground, N flat ink decals (canvas textures) and a road texture drawn once per section from a small path table. No models, no dependencies.
- Existing clocks (`lib/work-panel`, `lib/solution-sweep`, `lib/services-dock`, `lib/portal-window`, the day grid) keep their constants; only what the canvas draws on those clocks changes.
- The hero fold DOM stays as is. The card-beat headline and side text stay.
- Rounds: 1 rest (rebuild with the road, no blocks), 2 camera path plus the roll plus the film face, 3 swap into the homepage, 4 featured work through First 90 Days in one pass with one review.

### 9.5 Open questions for Brad

1. Concept C, yes or no. If no, which of A or B, or a fourth idea.
2. The ink trail: should the cube leave a mark behind it (the pen idea) or stay clean?
3. Face marks are gone. Should ONE face carry the BigSquare mark, or all faces plain?
4. The road ends on day 90. OK to let First 90 Days be the literal end of the sheet?

## 10. Locked: concept C, the cast, and the round plan (Brad, 2026-09-05)

Brad: go with C. Keep A and B on record (section 9.2 stays; tasks.md points here) in case C does not land. And the note that matters most: what makes illoca premium is DYNAMISM, many different 3D things tying into one story (a person drawing, buildings expanding, trees, the office view). One cube plus ink is not enough on its own.

### 10.1 Reconciling "one square" with "many things"

The rule is one PROTAGONIST, not one object. Illoca has one story with a cast. Ours: the sheet is a client's town drawn on a planner's desk, and the road runs through it. The cast is the town, never a second cube.

The cast (all procedural, all in the two-tone ink material with the navy hull; primitives read as illustration once the shader is flat, so consistency comes from the shader, not from modeling):

- **The road and the pen.** The ink road, and a 3D pen that draws the next stretch ahead of the cube at the solution beat. The pen is our "person drawing" without a figure (a procedural human is where this would turn uncanny; illoca's figure is hand-sculpted).
- **Storefronts.** A box with an awning, a door, a sign board and a step. They BUILD UP from a drawn footprint on the paper to full height as the camera arrives (illoca's massing move), which is the multi-location growth story made literal. Varied widths, heights and awning depths so no two read as copies. Featured work: six of them, one per work. First 90 Days: the whole street stands.
- **Trees.** Low-poly cone-and-sphere stacks along the road, in blue and paper only (one-accent rule; illoca's green does not exist here). They pop up with a small overshoot as the camera passes.
- **The van.** A box van parked at the hero, driving the road ahead of the cube through the problem and solution stretches (the home-services line of the business, and the thing that gives the frame life between stations).
- **The billboard.** A roadside board that carries the case film in featured work, so the film exists in the world as well as on the cube's face.
- **The map pin.** Cone plus sphere, dropped from above at the search station; its ring draws on the paper around the cube.
- **The film set.** A camera on a tripod and a softbox on a stand at the services station (the creative work).
- **Paper artifacts.** Flat sheets with drawn charts, a taped photo, a sticky note. Real thin boxes this time, not squashed rounded cubes.
- **Sky.** None. It is paper to the horizon. The road is the only line that leaves the frame.

If a procedural prop reads too crude in the renders (the van and the camera are the risk), the fallback is a hand-made GLB for that one prop, Draco-compressed, decided after seeing the procedural version. Not before.

### 10.2 What this does to the storyboard (9.3)

Same stations, richer scenes: storefronts rise along the featured work stretch; the van drives the problem road and stalls at the dead end; the pen draws the solution road; the pin drops at search; the film set stands at services; the street is complete at day 90. Everything else in 9.3 holds.

### 10.3 The round plan, one conversation per round (re-cut 2026-09-06 after Brad's round 3 review)

This conversation carries the research and is heavy. Each round below starts a fresh conversation that reads sections 6, 9 and 10 of this file plus `sandbox-captures/` first, and ends by writing its status into section 7b. Codex builds when it has usage (prompts below); Claude builds when Codex is out; whoever did not build verifies with the GPU capture script. One review per round. EVERY round until the last lives on `/dev/cube-world/`: the homepage is not touched, and nothing that exists on the live site is removed, until Brad signs off the whole world there (his 2026-09-06 review, 7b).

- **Round 1, the town at rest.** DONE. Rebuild `/dev/cube-world/`: no blocks; the road; three storefronts at different heights, one mid-build; four trees; two paper artifacts; plain cube faces; contact shade at every base; thin boxes for sheets.
- **Round 2, the hero moves.** DONE, reviewed ("looks good so far"). Scroll runway, camera path, the two-quarter-turn roll onto the drawn frame, the top face becomes the film, push to panel, pull back to the follow shot. Storefronts build as the camera arrives.
- **Round 3, the journey (on the dev route).** WorldStage grows the page below the hero as stand-in stations, one pinned runway per section in page order with the section's real headline as DOM, and the world plays 9.3 and 10.2 on them: six drawn frames and six rising storefronts (featured work), the scribbled dead end and the van (problem), the pen drawing the road in four strokes (solution), the pin dropping and its ring (search), the camera lifting high over the whole road (proof and trust), the half orbit with the film set and the five lanes (services), the drawn window frame and the flood (portal), the quiet stretch (newsletter), the 90-square grid and square 90 (first 90 days). Screenshots at every station's progress 0, 0.5 and 1. One review with a frame list. Handoff in 10.6.
- **Round 4, polish (on the dev route).** Ink trail decision, sound hooks on the roll (lib/sfx exists), scroll-up pass, frame time at every station, Lighthouse of the dev route.
- **Round 5, the homepage swap, LAST, only after Brad's sign-off of the whole world.** HomeCanvas takes the world on the Tracker's follower; the glass hero, the SquareField-with-WebGL and the companion code go only then, and the stations wire to the real section clocks. The 2026-09-06 notes in 7b apply (nav floor, phone rest, stage clip, bundle, capture recipe).

### 10.4 Codex prompt for round 1 (paste after Prompt 0)

```
Task: rebuild app/dev/cube-world/ as "the town at rest" per project-guidelines/cube-v2/brief.md sections 9 and 10. Read both, then lib/cube/world.ts and components/sections/home/cube/WorldCanvas.tsx, which already carry the ground, key light, shadow plane, ring, ink materials and rest framing. Keep those. Delete the WORLD block table and the face marks (uMarks contributes nothing; leave the atlas code, pass a 1x1 transparent texture).

Add lib/cube/props.ts with procedural builders, each returning a THREE.Group of meshes that share the ink material and the outline material: road(points) as a flat ink decal drawn to a canvas texture from a path table and laid on the paper; storefront({w, h, d, awning}) with a step, a door recess, a sign board and an awning; tree({h}) as a trunk cylinder and two stacked cones; van() as a cab box, a body box, four cylinder wheels; sheet({w, h}) as a real thin BoxGeometry; pin() as a cone and a sphere. Every solid casts a shadow and gets a contact shade (a small dark disc decal at its base, blue at 18 percent alpha). No second cube anywhere.

Compose the rest frame in lib/cube/town.ts: the protagonist lower right as today; the road starting under it and running to the horizon with a hand-drawn START tick; three storefronts of different heights beside the road in the midground, the nearest one at 60 percent height as if mid-build; four trees; the van parked at the roadside in the foreground right, cropped by the frame; two sheets bottom left. Nothing over the headline text box at rest (1440 and 375).

Deliverables: screenshots at 1440x900, 375x812 and 1536x960; frame time; files changed with one line each. No dependencies. No changes outside app/dev/cube-world/, components/sections/home/cube/, lib/cube/.
```

### 10.5 Handoff prompt for a fresh Claude conversation (one per round)

```
This window owns the homepage cube rebuild (cube v2). Read, in order: CLAUDE.md, project-guidelines/cube-v2/brief.md sections 6, 9 and 10 in full, the status log in section 7b, and every image in project-guidelines/cube-v2/reference/illoca/ and project-guidelines/cube-v2/sandbox-captures/. Then read lib/cube/ink.ts, lib/cube/world.ts, components/sections/home/cube/WorldCanvas.tsx and WorldStage.tsx before writing code.

Build ROUND <N> exactly as brief.md 10.3 defines it. For round 1 the Codex prompt in 10.4 is the spec; follow it literally. Scope: only app/dev/cube-world/, components/sections/home/cube/, lib/cube/ (round 3 adds HomeCanvas.tsx). No dependencies. No GSAP. Concept C is locked: one protagonist cube, never duplicated; the cast is procedural props in the two-tone ink material; camera does the moving; every roll is a quarter turn.

Verify with real-GPU Chrome, not the in-app browser: Playwright is not in the project; install it in the session scratchpad (npm i playwright --no-save) and launch with channel "chrome" and args --enable-gpu --use-angle=d3d11 --ignore-gpu-blocklist. Shoot 1440x900, 375x812 and 1536x960 at DPR 1.5, plus every scroll position the round names. Send me the frames inline as you go, not only at the end. Judge every frame against reference/illoca/illoca-18.jpg before sending it.

When the round is done: copy the final frames into project-guidelines/cube-v2/sandbox-captures/ with the round in the filename, write the status into brief.md section 7b, tick the round in project-guidelines/tasks.md under "Premium cube", and end with a short built-this-conversation list. No commits unless I say so.
```

### 10.6 Handoff prompt for round 3, the journey (written after Brad's round 3 review, 2026-09-06; the homepage-swap prompt it replaces is recorded in 7b and moves to round 5)

```
This window owns the cube world on /dev/cube-world/ (cube v2). The homepage is OFF LIMITS: do not touch HomeCanvas.tsx, HomeStage.tsx, Hero.tsx or any section file; the world stays on the dev route until I sign off the whole animation there (my 2026-09-06 review in brief.md 7b). Read, in order: CLAUDE.md, project-guidelines/cube-v2/brief.md sections 6, 9 and 10 in full, the status log in 7b including every review, and every image in project-guidelines/cube-v2/reference/illoca/ and project-guidelines/cube-v2/sandbox-captures/ (world-r2-* are the current frames). Then read lib/cube/path.ts, film.ts, world.ts, town.ts, props.ts, ink.ts, logo.ts and components/sections/home/cube/WorldCanvas.tsx and WorldStage.tsx end to end. Read the section files only for their headline copy (FeaturedWork, ProblemStrip, Solution, SolutionCards, Search, ProofBand, TrustMarquee, Services, Portal, Newsletter, FirstNinetyDays): the words, not the components.

Build ROUND 3, THE JOURNEY, exactly as brief.md 9.3 and 10.2 storyboard it, on /dev/cube-world/ only. Concretely: (1) WorldStage grows the page below the hero: one pinned runway per station in page order (featured work, problem, solution, search, proof band and trust, services, portal, newsletter, first 90 days), each carrying that section's real headline copy as a stand-in DOM at z-10 over the canvas, sized so the station reads as the real section would at 1440 and 375; the hero runway stays exactly as built. (2) The world plays the storyboard on those runways, each beat a pure function of its station's progress the way the hero is of its runway: the road runs past six drawn frames and six storefronts rise as the camera arrives, the cube rolls one quarter turn per frame, the last frame floods blue (featured work); the road narrows into scribbles and a dead end, the van drives the road ahead of the cube and stalls (problem); the pen draws the next stretch in four strokes and the cube rolls onto each (solution); the pin drops and its ring draws around the cube (search); the camera lifts high and wide over the whole road drawn so far (proof and trust); a half orbit around the resting cube with the film set standing and the road fanning into five lanes and back (services); the drawn window frame, the crane down, the top face floods blue (portal); a quiet stretch beside the form (newsletter); the road enters the 90-square grid and the cube stops on square 90 (first 90 days). Every roll is a quarter turn; the camera does the moving; the cube never floats, spins in the air, or fades; never a second cube. (3) New props in lib/cube/props.ts in the same ink material with the same hull: the pen, the billboard, the film set (a camera on a tripod, a softbox on a stand), the dropping pin, the window frame, the day grid drawn on the paper. (4) The road table in lib/cube/town.ts extends through every station; the van's staged spot at z -23.5 is where the problem stretch starts. (5) Scroll-up plays everything backwards. (6) Frame time at every station at DPR 1.5; the hero stays at its round 2 numbers and frame for frame at p 0, 0.55, 1 and reform 1.

Scope: app/dev/cube-world/, components/sections/home/cube/, lib/cube/. Nothing else. No dependencies. No GSAP. Concept C is locked: one protagonist cube, never duplicated; the cast is procedural props in the two-tone ink material; camera does the moving; every roll is a quarter turn.

Verify with real-GPU Chrome, not the in-app browser: Playwright in the session scratchpad (write a package.json first, then npm i playwright), channel "chrome", args --enable-gpu --use-angle=d3d11 --ignore-gpu-blocklist, DPR 1.5, load /dev/cube-world/?nosettle, wheel ticks only, settle 1.9s per stop, read [data-world-stats] back to prove each stop. Shoot 1440x900, 375x812 and 1536x960 at the hero's p 0, 0.55, 1 and reform 1 (must be unchanged), then every station at progress 0, 0.5 and 1. Send me the frames inline as you go, one station at a time, and judge every frame against reference/illoca/illoca-18.jpg before sending it. I want to see the animation progress, station by station.

When the round is done: copy the final frames into project-guidelines/cube-v2/sandbox-captures/ with the round in the filename, write the status into brief.md section 7b, tick the round in project-guidelines/tasks.md under "Premium cube", and end with a short built-this-conversation list. No commits unless I say so.
```

## 8. Steering Codex: the short version

- One beat per message. Never "make it more premium". Say what frame, what is wrong, what it should be, with a number.
- Ask for the plan first on anything touching more than one file, then say "go".
- Always demand screenshots at named scroll positions. Rejections reference the screenshot filename.
- Literal counts (2 quarter turns, 6 blocks, 90 squares). "Spin a few times" produces 40 turns.
- When it wants a dependency, ask for the gz cost first, then decide.
- When it drifts into other files, paste rule 1 from Prompt 0 again verbatim.
- Every accepted round: commit with a one-line message so you can bisect a regression.
