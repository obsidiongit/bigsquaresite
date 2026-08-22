# Reference: PX PUSH (pxpush.com) — DEEP DIVE

Captured 2026-08-21 with headless Chrome at 1440x900 (desktop, 24 frames) and 390x844 (mobile, 12 frames). This reference got the extended treatment Brad asked for: beyond screenshots, we downloaded all 19 of their production JS/CSS bundles, beautified them, and read the actual component code for every effect on the page. Sections labeled "how it works" come from their shipped source, not guesses.

Status: **personality ceiling + direct business analog.** PX PUSH is a design subscription service (Sofia, Bulgaria; PEAK/SHIFT LTD.) selling retainer creative at $3,500 to $6,500/mo. Same category of pitch as BigSquare: a productized service selling reliability. Their move is wrapping that boring promise in one totalizing metaphor: the whole site is a corporate "department" seen through a camcorder/CRT viewfinder. Scanlines, vignette, glowing green REC dot, chrome 90s hardware, floppy disks, mono terminal text. It is the strongest example we have captured of a single conceptual skin making a subscription service feel like a brand.

One caution: the site is in constant motion (marquees, spinning chrome, cloud flythrough). Stills undersell it; open pxpush.com alongside these frames for motion decisions.

## Why this reference matters for BigSquare

1. **It proves theme coherence beats effect quantity.** Every trick on the page (pixel cursor, slat wipes, scramble text, chrome 3D, REC dot, mono labels) is the SAME idea: "you are looking through a machine." Our Graphite "blueprint/technical" language can be pushed to the same coherence without adopting their retro skin.
2. **It is the best-documented GSAP + Lenis site we have.** Lusion is a custom engine, Pear is a hand-rolled shader film. PX PUSH is built from exactly our planned toolbox: scroll-scrubbed tweens, velocity-reactive loops, Splitting.js text, smooth scroll. Everything here is portable to Framer Motion or GSAP in our stack almost verbatim.
3. **Section numbering as navigation.** `Nº001 / Intro`, `Nº002 / Works`, `Nº003 / Benefits`, `Nº004 — Membership` in mono, each section a numbered department memo. Same instinct as Pear's chapters, cheaper to build, very compatible with our mono-eyebrow system.

## Screenshot index

Desktop frames walk the full page; a few frames intentionally catch transition overlays mid-wipe (noted). The three chrome objects (PX logo, floppy, cylinder in nav) render live via WebGL, so their angles differ run to run.

| File | What it shows |
|---|---|
| `pxpush-home-desktop-01-top.png` | Hero: WebGL cloud flythrough (teal-to-steel sky), giant chrome "px" logo, viewport-wide nav headline "…and Design Department" scrolling as a marquee, CRT scanlines + vignette over everything, mini video pill bottom-left ("SCROLL DOWN TO ACCESS DEPARTMENT"), mono system log bottom-right, green REC-style dot next to "Get started" |
| `pxpush-home-desktop-02.png` | Hero-to-intro handoff on light grey: "PX PUSH ●" H1 marquee between hairlines, `Nº001 / INTRO` mono label, chrome logo now shrunk and docked into the nav center, lead paragraph mid word-by-word fade |
| `pxpush-home-desktop-03.png` to `-04.png` | Intro on light grey: indented lead paragraphs revealing word by word as you scroll (scrubbed, so they un-reveal when you scroll back), mini video docked bottom-left cycling work |
| `pxpush-home-desktop-05.png` | Intro close ("…starting at $4,000/mo.") + full-width underline buttons (Get Started ↗ / View Pricing ↗), page cuts to the black Works section below, `Nº002 / WORKS` |
| `pxpush-home-desktop-06.png` to `-07.png` | Works on near-black: infinite image marquee of client work (posters, product UI, packaging) whose speed reacts to scroll velocity; uppercase mono support copy |
| `pxpush-home-desktop-08.png` to `-09.png` | Benefits on electric blue: `Nº003 / BENEFITS`, H4 mid "titleRandom" reveal (words at random order, still translucent), blue slat overlay from the section transition still visible |
| `pxpush-home-desktop-10.png` to `-12.png` | Benefits stack: full-width rows (Totally async / Fixed monthly rate / Lightning fast delivery / Workspace / Flexible and scalable), mono `Nº00x` counters, retro-office photography right, rows slide over each other as a card stack while scrolling |
| `pxpush-home-desktop-13.png` | Transition artifact frame: the black horizontal-slat overlay caught mid-wipe over the blue section. This is the `effect__overlayIn` wipe (10 strips scaling up from the bottom edge, staggered) — useful as a freeze-frame of the effect |
| `pxpush-home-desktop-14.png` to `-17.png` | Packages on black: "Packages ●" H1 marquee, `Nº004 — Membership`, 3D floppy disk (GLTF, scroll-scrubbed rotation + spin kicks from scroll velocity), pricing boxes Standard.PKG $3,500/mo and Pro.PKG $6,500/mo as ruled mono tables with full-width invert-fill buttons |
| `pxpush-home-desktop-18.png` to `-21.png` | Brand Sprint on deep blue: "Brand Sprint ●" marquee, From $12,000 pricing table, branding slideshow inside a clip-path frame bottom-left (velocity-flipbook: images flip faster the faster you scroll), black slat wipe visible in 18 |
| `pxpush-home-desktop-22.png` to `-24.png` | Footer on blue: giant pxpush wordmark with 3 vertically-offset "echo" copies that unmelt/settle as you arrive (scroll-scrubbed crop), ruled mono link tables (LinkedIn / X / Instagram / Get in Touch / Terms / Privacy, each with ↗), company registration block, GMT +02:00 |
| `pxpush-home-mobile-01-top.png` to `-12.png` | 390px: everything survives in one column. Cloud hero + chrome logo persist, marquee H1s stay viewport-scale, works marquee becomes drag-to-fling, benefits stack keeps photos, pricing tables full width, footer echo logo intact. Frame 05 catches the blue slat wipe mid-flight |
| `pxpush-home-extracted-data.json` | Fonts, colors, CSS variables, headings, body metrics, links, canvas count, full page copy from the live DOM |

## Design tokens (exact, from their live CSS)

- Colors (their `:root`): `--bgcolor: #1a1a1a` (ground), `--primarycolor: #d9d9d9` (text), `--grey: #bababa`, `--black: #111`, `--blue: #03049c` (THE blue, deep ultramarine section ground), `--lightblue: #9fe4f3`, `--red: #ff001a`, `--cream: #bab5a6`, `--green: #0f0` (REC dot, with `--rec-glow: rgba(60,255,123,.25)` text-shadow), `--pink: #a7849d`, `--lightgrey: #71737d`. Hairlines are white at 50 to 70% alpha (`--border`), not black. The WebGL family is separate and consistent: sky gradient `#003E6B → #0EAEBC`, chrome material `#e7edf6`, fill lights `#bcdfff` / `#a8d7ff`. Note the discipline inside the chaos: each SECTION is one flat color + grey text; the rainbow only exists across sections, never within one.
- Sections as theme scopes: every section sets `--background` and `--color` (`.section__grey`, `.section__black`, `.section__blue`, `.section__lightgrey`...). Same per-section token pattern e2vc uses; third reference to confirm it.
- Fonts: **Graphik** 400/200 (body sans), **SemiSqueezed** 400 (display, a squeezed grotesk used ONLY for `.lead` and the giant marquee H1s), **PP Neue Montreal Mono** (`Mono`, all UI/labels/buttons/pricing tables), **GeistMono** (spare). Maps cleanly onto our Bluu Next (display) / Apfel (body) / IBM Plex Mono (UI) triad.
- Type scale is fully viewport-based: body `font-size: 1.7vw` (24.5px at 1440) set on `body`, then components use %/vw. `.lead` = SemiSqueezed 2.8vw. Marquee H1 = 12vw (172.8px), line-height 0.96, letter-spacing -0.1vw. `.monospace` = 50% of parent (uppercase, prefixed with a `⬤` glyph via `:before`), `.monospace__p` = 70%. Buttons = Mono at 70%.
- `--radius: .5vw` (1vh mobile) — the only radius on the page (video pills, image frames). `--columns: 20` drives both the pixel cursor grid and overlay math.
- Indented leads: `.lead__indent { text-indent: 20vw }` with a small `→` arrow sitting in the indent. Reads like a memo. Cheap, distinctive, very stealable.
- No cubic-bezier easings in CSS at all (extraction found 0): all motion runs through GSAP with stock `power2.out` / `power4` / `expo.out` / `none` (linear scrub). The lesson: scrubbed effects use `ease: "none"` and let the scroll be the easing; discrete effects use expo/power-outs.

## DEEP DIVE: how every effect works (from their shipped code)

Stack: Nuxt 3 (Vue) + GSAP + ScrollTrigger + **Lenis** smooth scroll + Three.js. Lenis runs off GSAP's ticker (`autoRaf: false`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `lagSmoothing(0)`), and calls `ScrollTrigger.update` on its scroll event — the canonical Lenis+ScrollTrigger wiring. Lenis is disabled on mobile (native scroll). 3 WebGL canvases: cloud hero, nav logo, pricing floppy. All Three.js library code is bundled per-page (their home JS is 94KB of app code; Three itself is a separate 565KB chunk — heavy, not a budget to copy).

### 1. The global effect directive system (the most stealable idea here)

Every scroll effect on the site is an HTML attribute, applied declaratively in markup and wired once at page init by querying `[effect__*]`. Their catalog, with exact configs:

- `effect__textFade` — word-by-word reveal. Splitting.js splits into `.word`/`.line__inner`; `fromTo(opacity 0→1, stagger .05, ease none)` with `scrub: true`, start `top 80%`, end `bottom 80%`. Because it is scrubbed, text fades OUT again when you scroll back up: the page feels alive in both directions.
- `effect__titleRandom` — words fly in with `opacity: 0, z: -100` (parent gets `perspective: 1000`), to `z: 0` with `ease: power4` and `stagger: { each: .03, from: "random" }`, scrubbed from `top 90%` to `top 50%` (small) or `top 0%` (large). The random order is what makes it feel like a machine assembling text.
- `effect__titleIn` — per-char version: `rotationX: -30, z: -200, transformOrigin: 50% 0%`, stagger .05.
- `effect__fadeOut` — pinned-ish elements blur away: `opacity → 0, filter: blur(20px)` scrubbed as the element leaves (`top 5%` to `top -30%`). Used on the hero headline and marquees so sections dissolve rather than just slide off.
- `effect__fadeOutVideo` — hero canvas exit: `opacity → 0, yPercent → 50` from `top top` to `top -100%` (the cloud hero sinks and fades under the incoming section).
- `effect__overlayIn` — THE section transition. Each section owns an absolutely-positioned `.overlay` (grid of 10 row-strips desktop / 15 mobile, each `scaleY: 0`, `transform-origin: 50% 100%`). Scrubbed from `top 0%` to `top -80%`, strips scale to `scaleY: 1.01` with `stagger: { grid: [10,1], from: "end", each: .04 }` and `ease: power4`. Result: as a section scrolls past, the NEXT section's color wipes over it in staggered horizontal slats. Frame 13 shows it frozen. Overlay color per section (`overlay__blue`, `overlay__black`...).
- `effect__clipIn` — media frames expand from a centered slit: `clip-path: inset(0 35vw 0 35vw)` → none, scrubbed `top 70%` → `top 0`; inner slideshow counter-scales from 1.2 with rotation 3° and `yPercent: -50` parallax.
- `effect__separatorIn` — hairlines draw in: `clip-path: inset(0 100vw 0 0)` → none, scrubbed over a short window (`top 90%` → `top 70%`).
- `effect__parallax` — generic `yPercent: data-parallax` scrub (footer wrapper uses 70).

**The port for BigSquare:** implement 4 of these as reusable Framer Motion components/props (`textFade`, `titleRandom` for eyebrows only, `separatorIn`, `clipIn`) plus one section-wipe. That is 80% of this site's scroll feel inside our existing stack, with zero WebGL.

### 2. The pixel cursor (their signature)

A fixed full-viewport `.cursor` div, `mix-blend-mode: difference`, `pointer-events: none`, containing a CSS grid of 20-column square cells (`--size: 100vw/20`). On pointermove, the cell under the cursor is set to `opacity: 1` then back to `0` after a 0.2s delay (`gsap.set(..., { delay: ttl })`) — leaving a fading trail of inverted squares. The inner wrapper has SVG `filter: url(#gooey)` (skipped on Firefox) so adjacent lit cells melt together. Disabled on mobile and Safari, skipped over `.cursor_disabled`/`.hover_effect`/`.button` targets, initialized via `requestIdleCallback`. It is DOM + blend mode, no canvas. **This is extremely relevant to us: a literal "big square" cursor.** A quieter version (no gooey, lower opacity, our blue instead of invert) could be BigSquare's signature interaction.

### 3. Marquee headlines as section titles

Every giant title ("PX PUSH ●", "Packages ●", "Brand Sprint ●") is one component: the phrase duplicated 8x in a track, `gsap.to(track, { x: -titleWidth, duration: width/150, ease: "linear", repeat: -1 })` (speed 150px/s desktop, 80 mobile), wrapped between two full-bleed hairlines drawn in by `separatorIn`, layered with `titleRandom` (assembles on entry) and `fadeOut` (blurs away on exit). Width is re-measured on resize preserving progress. Infinite motion makes 12vw type feel like signage, not a heading.

### 4. Velocity-reactive systems (the "alive" feel)

Three different effects all key off scroll velocity, which is why the page reacts to how hard you scroll:

- **Works marquee**: a rAF loop advances `x` by a base 200px/s, PLUS `ScrollTrigger.getVelocity() * 0.85` clamped to [-1800, 1500] (decayed by 0.9 each frame) — scroll fast and the strip whips along; scroll up and it reverses. Hovering shows a "Hold to skim" pill cursor (lerped at 0.16); holding multiplies speed 15x (lerped in at .04) and squeezes the strip to `scale: 0.95`. On mobile it converts to drag-with-inertia (fling velocity clamped ±3600, decay .96/.94, `wrap()` for the infinite loop). All position math uses `gsap.utils.wrap(-loopWidth, 0)`.
- **Floppy disk**: base idle spin 0.55 rad/s; every ScrollTrigger update adds `|Δprogress| * 80` (capped 2) in the scroll direction, decaying via `interpolate(spin, 0, .08)` — the disk "spins up" when you scroll. Its orientation, camera position, and section opacity are separately scrubbed from the section progress (opacity ramps in over progress 0→.03, out over .70→.75).
- **Branding flipbook**: the Brand Sprint image stack advances one frame per accumulated `|velocity| * 7e-5`, forward or backward by scroll direction — a scroll-driven flipbook of 15 brand images inside a `clip-path` frame that opens `inset(100% 0 0 0 round var(--radius))` → 0 between progress 0 and 0.2 and closes again at 0.8, while the stack scales 1.18 → 1.
- **Nav logo**: idle yaw + `velocity * 2e-5` clamped ±0.08, zeroed while the pricing section is on screen (so the floppy is the only spinning object — deliberate focus management).

### 5. The chrome 3D system

- **Nav/hero logo**: `/img/pxpush.svg` extruded at runtime (`SVGLoader` → `ExtrudeGeometry`, depth 30, bevel, curveSegments 50) with `MeshPhysicalMaterial(color #e7edf6, metalness .92, roughness .05, clearcoat 1, envMapIntensity 1.7)` and a `RoomEnvironment` PMREM env map — that alone is the entire "liquid chrome" look, no HDR file. Placed as a DOM-positioned element (`.logo3d--hero`, 70vw wide over the clouds); on scroll a ScrollTrigger scrubs it to `scale: 0.25` pinned at viewport top where it becomes `position: fixed`, `zIndex: 21`, clickable (scrolls to top / navigates home). A shared-element hero→nav morph, done with pure GSAP `set()` math (measure rect, interpolate scale/top by `scrollY / distance`). A `logo3d--footer` variant sits by the footer.
- **Cloud hero**: the classic mrdoob clouds technique, modernized: 8,000 plane sprites with one cloud texture, randomized transforms, merged into a single geometry (1 draw call), duplicated once at z-8000 for an endless corridor. Camera rides `z = -(elapsed*speed*500 % 8000) + 8000` — a loop, not a scroll scrub. Mouse parallax eases camera x/y at .01. Custom fog shader: `texColor.w *= pow(gl_FragCoord.z, 20)` + `smoothstep` fog to `#0EAEBC`, tint `#dce7f5`, over a 32px-wide canvas-generated CSS gradient background (`#003E6B → #0EAEBC`). Speed lerps 0.2 → 2.0 while hovering the word "speed." in the intro paragraph (copy and effect shaking hands — lovely detail). A chrome 3D cursor OBJ (`/img/cursor.obj`) floats mid-sky rotating 0.5 rad/s. Rendering pauses via IntersectionObserver when off screen (they gate EVERY canvas + rAF loop this way, and kill everything properly on unmount).
- **Pricing floppy**: `scene.gltf` floppy disk; they rebuild its materials at runtime — load diffuse + specularGlossiness PNGs into canvases, invert the gloss alpha into a roughness map, remap the diffuse into a black→grey duotone (`#000`→`#777` by alpha), then `MeshPhysicalMaterial` with clearcoat 1.7 and 3 directional lights (key 10, fill 5.6 in `#bcdfff`, rim 1.8). Runtime duotone-ing a stock model to fit the palette is a smart budget trick.

### 6. Text scramble + micro-interactions

- **TextAnimator** (hover scramble): on `.hover_effect` mouseenter, each char tweens `opacity 0→1` in .01s with `repeat: 1, repeatRefresh: true`, swapping `innerHTML` to a random char from a 43-glyph pool, restoring the original after, staggered `(i+1) * .02`. Killed and reset on leave. Applied to nav links, buttons, and the floating pill cursors. Skipped on Safari and mobile.
- **Buttons**: full-width rows with a bottom hairline; a `::before` bar fills via CSS var `--anim` (scaleY) from `transform-origin: 50% var(--button-origin)`. GSAP animates `--anim` 0→1 with origin `100%` (fills up from the bottom), and on leave sets origin to `0%` and animates back — so the fill exits through the TOP: a directional sweep-through, not a fade-back. Text flips to the section background color, spans get `padding: 0 1vw`. Same var trick powers the FAQ accordion hover.
- **Floating pill cursors** ("Hold to skim", "Click to close"): fixed pills teleported to body, lerp-follow at 0.16 via a `gsap.ticker` loop, scramble on show.
- **Menu hover reveals** (Industries list, other pages): the Codrops image-trail pattern — a hidden image div per row, following the cursor with lerp .08, rotation mapped from mouse speed (up to ±60°) and brightness flaring to 8x on fast moves.
- **Benefits stack**: on Lenis's scroll event, each row gets `y = (animatedScroll - rowOffset + i*10vh*factor) * factor` once it passes — rows pile onto each other like a deck while the section scrolls. Direct `lenis.on('scroll')` DOM writes, no ScrollTrigger.
- **Mini video pill**: fixed bottom-left; scrubbed shrink+text-fade over the first 20% viewport of scroll; swaps `position: fixed` → `absolute` (`is-released`) via a ScrollTrigger on the hero wrapper so it "parks" at the hero's end. Click opens a fullscreen overlay, stopping Lenis (`lenis.stop()`) and restoring on close (Esc handled).
- **Footer logo echo**: the wordmark SVG is cloned 3x with per-clone `--trail-crop-offset`; one scrubbed tween drives `--trail-progress` 0→1 and `--trail-crop` 90%→65% as the footer enters — the echoes rise and settle into the "melted reflection" lockup. CSS vars as tween targets throughout.

### 7. Page lifecycle engineering (worth copying wholesale)

- A staged event chain: `pxpush:page:reset → prepared → revealed → ready`. On prepare: scroll restored manually to 0, Splitting.js runs (wrapping lines into `.line > .line__inner`), Lenis rebuilt, effects registered. Reveal gates on: fonts ready + only the media actually near the viewport (elements within 1.2 viewports, `data-critical`, or inside `position: fixed`), each with 2s/3.5s `Promise.race` timeouts so the loader can never hang. Then `body.loaded`, effect init, `ScrollTrigger.refresh()`.
- Feature-class gating everywhere: heavy candy (cursor grid, scramble, hover reveals) is skipped on mobile AND on `body.safari`. Idle-callback init for the cursor. Every component disconnects observers, kills triggers, disposes geometries/materials on unmount.
- Accessibility cost they paid that we will NOT: scrubbed text reveals mean copy is illegible until you scroll it in, body text at 1.7vw ignores user font-size prefs, and `prefers-reduced-motion` handling is minimal. Our version keeps reveals one-shot (`whileInView` + `once`) and respects reduced motion per the moodboard.

## Patterns worth stealing (ranked for BigSquare)

1. **The effect-directive catalog.** One init, declarative attributes, scrubbed configs above. Port `textFade` (as a one-shot), `separatorIn`, `clipIn`, and a restrained `titleRandom` (mono eyebrows only) as reusable components. This is the single highest-leverage steal: it makes "smooth scroll-triggered reveals" (our moodboard bar) systematic instead of hand-placed.
2. **The square-pixel cursor, translated.** A sparse grid trail in our `--acc` blue at low opacity (no blend-difference, no gooey) is an on-brand signature interaction for a company literally named BigSquare. Behind `prefers-reduced-motion` and desktop-only, it costs ~40 lines.
3. **Numbered section system.** `Nº001 / Intro` mono labels + per-section `--background`/`--color` theme scopes. Fits our existing eyebrow plan and e2vc's per-section tokens; adopt as-is with our palette.
4. **Directional button fill via CSS variables.** The `--anim`/`--button-origin` enter-bottom/exit-top sweep is better than our planned scale-on-hover and works for both light and dark pills. GSAP or Framer Motion can drive CSS vars the same way.
5. **One velocity-reactive element per page.** Their works marquee proves scroll-velocity coupling makes a page feel alive. Our logo marquee (already planned) can take a mild velocity boost + hover pause. Keep it to ONE element; PX PUSH has four and it is a lot.
6. **Chrome material recipe.** `MeshPhysicalMaterial` metalness .92 / roughness .05 / clearcoat 1 + `RoomEnvironment` env map = premium metal with no HDR assets. If our Obsidion portal moment happens, this is the material, in graphite/navy instead of chrome.
7. **Footer as a set piece.** Giant wordmark + one scroll-scrubbed settle effect + ruled mono link tables. Our dark footer panel could take the ruled-table link treatment immediately.
8. **Hover-the-word gimmick.** Copy word ("speed.") wired to an ambient effect. If our hero ever gets a 3D/motion element, wiring it to a keyword in the H1 is a memorable 20-line trick.

## What we do NOT take

- **The entire retro-CRT skin.** Scanlines, vignette, REC glow, VHS chrome, floppy disks: it is their brand, wholesale. Moodboard says premium/technical/airy, not nostalgic.
- **Scrubbed body-text reveals.** Illegible-until-scrolled paragraphs fail our readability bar (and SEO/a11y instincts). One-shot fades only.
- **12vw marquee H1s.** Infinite-scrolling titles are playful signage; our Bluu Next display headings should sit still. (The hairline-framed title BAND, minus the marquee, is compatible.)
- **Multi-color section grounds.** Ultramarine/black/grey/cream rotation breaks our one-blue Graphite discipline. We keep light paper with dark panels at hero/CTA/footer only.
- **Viewport-relative body sizing** (`body { font-size: 1.7vw }`). Fails accessibility and our 8px system.
- **Their Three.js budget.** 565KB Three chunk + 3 canvases + per-page loaders blows our 200KB cap. Steal the material recipe and IntersectionObserver gating, not the architecture.
- **The em dashes and lowercase-tech voice** in copy. copy-rules.md wins.

## Implementation notes for our stack

- Lenis + ScrollTrigger wiring (if we ever want smooth scroll): drive `lenis.raf` from `gsap.ticker` with `lagSmoothing(0)` and call `ScrollTrigger.update` on Lenis scroll; disable on mobile. But note our current plan (native scroll + Framer Motion `whileInView`/`useScroll`) reproduces every pattern ranked above without Lenis.
- Splitting.js's job is done in Framer Motion by manual line/word wrapping (we already planned line-mask reveals from lusion). PX PUSH's addition is only the scrub and the random stagger order.
- CSS-variable tweening (`--anim`, `--trail-progress`) works from Framer Motion via `animate()` on style vars or GSAP; keep interactive fills in CSS vars so the same button works on every section ground — pair with our per-section token scopes.
- All their scrubbed configs (starts/ends/staggers in the deep dive) are drop-in `useScroll({ offset })` + `useTransform` values; the exact numbers above are a tested starting point.
