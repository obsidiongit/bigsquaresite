# Reference: Pear (pear.no) — DEEP DIVE

Captured 2026-08-21 with headless Chrome at 1440x900 (desktop) and 390x844 (mobile). This reference got the extended treatment Brad asked for: beyond screenshots, we pulled their full JS bundle (323KB, shipped with every shader comment intact) and CSS, and reverse-engineered how every effect works. Sections below labeled "how it works" come from reading their actual production code.

Status: **narrative ceiling reference and closest business analog.** Pear is an Oslo SEO + custom software firm selling a revenue-share model. They are literally our competitor category (performance marketing adjacent) proving that a "rigor" pitch can carry world-class theater. Lusion shows off 3D craft; Pear shows off storytelling craft. BigSquare borrows Pear's discipline, typography triad, and two or three of its tricks at 5 percent of its budget.

One caution up front: the site is a scroll-driven film. Stills undersell it badly. Open pear.no alongside these images for any motion decision. Useful debug URLs they shipped: `pear.no/?hud` (their own FPS profiler overlay), `pear.no/?drive=60` (auto-scrolls the whole page in 60s), `pear.no/?hero=signal|colossus|reveal` (pick the hero film), `pear.no/?t=breathe|slice|halftone|displace|static|ring` (pick the hero transition).

## Why this reference matters for BigSquare

1. It is a services company (SEO + software) with a premium editorial identity: serif display, grotesk body, mono meta, one blue, hairline rules. That is exactly our Graphite ambition executed at the highest level we have captured.
2. Its "chapters" structure (Ch. 1 The Model, Ch. 2 The Work, Ch. 3 The Terms, Ch. 4 Questions) is a masterclass in turning a sales pitch into a narrative. Our page flow (problem, method, proof, terms, CTA) can steal this framing without any WebGL.
3. Its engineering is the best documented we will ever see (they shipped commented shader source), so it doubles as a textbook for scroll-driven effects we may want in miniature.

## Screenshot index

Two capture sets. The standard pipeline pass walks the first stretch finely; the `journey/` set uses stepped jumps to cover the entire scroll road (47,250px, 53.5 viewports) to the footer.

**Capture artifact note:** many scrolled frames show a black band at the top. That is our headless capture racing their custom scroller mid-frame, not site design. Ignore it.

| File | What it shows |
|---|---|
| `pear-home-desktop-01-top.png` | Hero settled: renaissance painting film (cerulean sky, giant gilded pear on marble plinth, robed figures), serif headline "Pear makes you appear." over the art, mono pill CTAs, hairline grid + star crosshair marks |
| `pear-home-desktop-02.png` | The "ring" transition mid-flight: pixel-sort/dither glitch wave dissolving the hero film into the reel, channels splitting, blocks tearing |
| `pear-home-desktop-03.png` to `-06.png` | "The Model" chapter: extreme close-up scrub of the gold pear (a scroll-scrubbed frame sequence, not video), left rail chapter label with tick marks |
| `pear-home-desktop-07.png` to `-12.png` | Grafting/orchard sequence: branch being tied, pear tree canopy, serif overlay lines ("We build it.") entering per line, mono chip + typewriter body text |
| `pear-home-desktop-13.png` to `-16.png` | Portrait chapter: youth holding the gold pear, then slicing it (the knife scene is where the frame later tears in half along the blade line) |
| `journey/pear-journey-desktop-01.png` to `-06.png` | Same early road at coarser steps (3.5% to 24% of the page) |
| `journey/pear-journey-desktop-07.png` | ~28%: halftone chapter. The pear as a giant black and white halftone print being gilded back to color with a squeegee; sky-blue text panels (SEO / custom software copy) in serif + grotesk |
| `journey/pear-journey-desktop-08.png` to `-10.png` | ~33-41%: the burn. The frame chars and tears diagonally to reveal a hand-drawn parchment plan of the pear monument (procedural paper shader) |
| `journey/pear-journey-desktop-11.png` to `-12.png` | ~45-49%: "The Terms" on parchment: technical drawing of the monument under construction, dotted paper texture, ink lines |
| `journey/pear-journey-desktop-13.png` to `-16.png` | ~53-66%: return to sky: allegorical figure with trumpet, falling pear, "We say no more often than yes." and terms copy in serif |
| `journey/pear-journey-desktop-17.png` to `-19.png` | ~68-79%: "Questions" chapter: orator on marble steps pointing skyward, halftone clouds, FAQ section |
| `journey/pear-journey-desktop-20.png` to `-23.png` | ~84-97%: closing film: sapling being watered and pruned by two figures, constellation of star sparkles in pear shape |
| `journey/pear-journey-desktop-24.png` | 100%: footer. Lowercase `peλr.` wordmark (lambda as the r stem), tree centered between the two figures, mono legal line + email, thin box rule drawn around the composition |
| `pear-home-mobile-01-top.png` to `-12.png` | 390px, early road: same narrative, one column. Hero picked the "signal" film variant (concentric dotted rings radiating from the held pear). Type stays serif and large; mono chips persist; typewriter body text visible mid-animation ("built to be f") |
| `journey/pear-journey-mobile-01.png` to `-10.png` | 390px full road at 19% to 100% (the mobile road is 7300vh / 60,768px): every chapter survives the stack, phone-specific framing pans keep the key action centered (their shader takes phone-only pan/zoom uniforms per chapter), footer composition holds at one column |
| `pear-home-extracted-data.json` | Fonts, colors, easings, CSS variables, headings, scripts, meta pulled from the live DOM |

## Design tokens (exact, from their live CSS)

- Colors (their names): `--press: #0b0a09` (near-black ground, also `theme-color`), `--paper: #f2f1ed` (warm off-white), `--ink: #1d1c19`, `--ink-soft: #33322d`, `--rule: #1d1c1924` (ink at 14% alpha for hairlines), `--cross: #1d1c1957` (crosshair marks at 34%), `--sky: #015186` (THE one blue, a deep cerulean), `--fin-c: #fffaea` (cream text on dark FAQ). The film's cerulean sky (#1668b4 range on screen) does the heavy lifting; the UI itself stays monochrome plus one blue. Compare ours: `--paper #F5F6F8`, `--ink #0B0F17`, `--acc #0657F9`, `--line rgba(11,15,23,.12)`. Same discipline, cooler cast, our blue is brighter.
- Fonts, the triad that makes the site: display serif **Flecha** in three optical sizes (S, M, L; weights 300/400 only), body sans **GT Standard L** (400/500), meta mono **GT Standard Mono** (400). CSS vars: `--title` (Flecha M), `--text`, `--code`. Direct map to our Bluu Next / Apfel Grotezk / IBM Plex Mono triad. Their choice of LIGHT serif weights (300) at huge sizes is what reads "old money"; note Bluu only ships Bold, so our equivalent lever is Bluu at large size with generous leading, not weight.
- Type scale: display `clamp(1.875rem, 3.4vw, 3.25rem)` for standard headings, line-height 1.12; the big statement H2s render at 78px (Flecha M 300, letter-spacing -0.02em, line-height 0.88, tight); FAQ H3 26px Flecha M; body 16px GT Standard; mono chips ~11px uppercase with wide tracking.
- Easing: one house ease everywhere, `--ease: cubic-bezier(.22, 1, .36, 1)` (a soft expo-out, they call it `--ease-press`). Plus stock Tailwind `cubic-bezier(.4,0,.2,1)` for trivial UI. Steal `cubic-bezier(.22,1,.36,1)` verbatim; it is between our two lusion picks and could be THE BigSquare ease.
- Radius: `--r: 999px`. Pills only, everywhere (buttons, chips). No card radius vocabulary at all; the site has no cards.
- Layout: hairline vertical rules at `--v1: 5.3%` and `--v2: 85.6%` frame every screen; content hangs off those two rails. Star/plus crosshair marks sit where rules intersect. Same blueprint language as e2vc and lusion; three references now agree on this pattern.
- Tracking on mono UI: uppercase, ~0.14em, tiny sizes. Buttons are dark pills with mono uppercase label + arrow glyph in a bordered chip.

## DEEP DIVE: how the site actually works

Stack: Vite + React 19 (React only mounts the DOM skeleton; every effect is hand-rolled vanilla JS). No GSAP, no Lenis, no Three.js, no animation library at all. One 323KB JS bundle, one CSS file. Five canvases, but one does almost everything.

### 1. The scroll road

- The page is one `.stage` element, `height: 5350vh` desktop / `7300vh` mobile (a 53.5-viewport "road"). A full-viewport WebGL canvas is pinned on top; DOM text layers float over it.
- Custom smooth scroll in ~40 lines: `wheel` is `preventDefault`ed and accumulates into `L.target` (clamped to road length); a rAF loop lerps `L.current += (target - current) * 0.085` and calls `scrollTo`. Keyboard is remapped by hand (arrows 90px, PageDown/space 0.9 viewport, Home/End). A native `scroll` listener detects external jumps (scrollbar drag) and snaps the lerp state to match. On touch devices and for `prefers-reduced-motion` users, `L.on` is false and native scroll drives everything directly (they lerp at 0.3 just to smooth uniform values).
- Every animation on the page keys off ONE number: normalized road progress `p = L.current / (scrollHeight - innerHeight)`, remapped per chapter.

### 2. The chapter timeline

Their section budget is a table of vh constants divided by the road total, e.g. hero film 1200/5350, transition 600/5350, close-up 300/5350, parchment 900/5350, and so on. Each chapter's local progress is `clamp((p - start) / span, 0, 1)`, eased, then fed to the GPU as a uniform or applied to DOM transforms. This is exactly Framer Motion's `useScroll({ offset })` pattern, just hand-rolled. **The transferable idea: design the page as a fraction table first, then every effect is a pure function of scroll.** Nav menu links carry `data-at` fractions and simply set `L.target = fraction * road`.

### 3. The media pipeline (how a 53-viewport film stays fast)

- Hero: one of three mp4 films (`signal`, `colossus`, `reveal`) chosen at random per visit (URL param can force one), each with a poster for instant paint. The `<video>` plays only while its chapter is on screen; it is `pause()`d the moment its transition completes.
- Everything else that looks like video while scrolling is a **scroll-scrubbed WebP frame sequence** (Apple product-page technique): folders like `/films/plan/1440/f_001.webp` ... `f_121.webp` with a `manifest.json` listing tiers (1440 desktop / 768 mobile, ~89-121 frames each). Six sequences total (model close-up, plan, coda, tree, flysky, trans).
- Loading is priority-windowed: each sequence only warms when scroll approaches its chapter (each is registered with a from/to road fraction). Frames load in a subdivision order (coarse first, gaps fill in), so scrubbing early shows the nearest loaded frame via a `frameNear()` search rather than blocking.
- Hard budget: **at most one GPU texture upload per rAF frame** (a `_ > 0 && _--` counter in the render loop). Scrub too fast and you briefly ride an older frame instead of janking. This is why our too-fast auto-scroll capture got black frames: the loader intentionally will not race the network.

### 4. One fragment shader renders the whole story

The main canvas draws a single full-screen triangle with one large fragment shader; every visual chapter is a region of that shader gated by uniforms. They shipped it with comments intact, and it reads like a film treatment. Highlights worth knowing about (as vocabulary for what is possible, not as a build target for us):

- **Transitions catalog.** Six hero-to-reel transition modes exist (`breathe` radial lens swap, `slice` shearing slabs, `halftone` growing print dots, `displace` noise warp, `static` diagonal glitch wave, `ring` the default). Plus nine "secondary treatments" that ride behind the front (slabs, halftone, warp, tear, fine tear, mosaic, ordered dither, shred, dither-block). All are sampling-coordinate tricks on two textures, film A and reel B.
- **The ring transition** (their signature): the wipe originates at the pear held in the painted figure's hand. A helper inverts their cover-fit math so a point in film UV space stays pinned to the correct screen pixel at any viewport. The front is a circle deformed by two angular fbm harmonics (so it reads as chaos, not a ripple), and inside the crest: rows tear in quantized jumps on a 15Hz clock, sampling snaps to two octaves of blocks, RGB channels separate radially, and patches re-render as live ASCII art. The ASCII is a 5x5 bitmap font encoded in arithmetic (ten glyphs ordered by ink weight, chosen per cell by sampled luminance). A warm flare screen-blends along the crest.
- **The paper chapters** are fully procedural: pulp, fibre, tooth and fleck octaves of value noise make the parchment; a "light rake" with drift, jiggle and breathe animates it; torn edges come from decorrelated fbm fields; the burn front chars, embers and drags the incoming picture so the reveal "arrives moving." The knife scene splits the frame along the cut with a camera push-in, roll and directional motion blur (five-tap smear) so it reads as a camera move, not a wipe.
- **A baked scrim**: a full-page hard-light DOM overlay was replaced by one `col *= mix(vec3(1), vec3(0.698, 0.667, 0.635), uScrim)` line in the shader. Same math, no compositing cost. Good reminder that blend-mode DOM overlays above canvases are expensive.

### 5. Performance engineering (the part worth copying wholesale)

- **Phone-tier noise:** texture-shaping fbm drops from 4 octaves to 2 on mobile (`#ifdef PHONE`); motion-shaping fbm keeps 4 everywhere. Half the noise cost, visually identical below one device pixel.
- **Dead-road elimination:** once a later chapter fully owns the frame, earlier chapters' math is skipped entirely (`if (uCoda < 0.999 && uBurn < 0.999) { ... }`). Provable fast paths skip the expensive ring math for every pixel outside the active annulus.
- **Adaptive resolution:** a frame-time watchdog on mobile steps devicePixelRatio down by 0.25 (toward 1.0) after ~150 slow frames (>26ms), and back up after ~900 fast ones, with a 4s cooldown. Silent, gradual, effective.
- **Draw skipping:** past the GL portion of the road, `drawArrays` is not called at all; the canvas is just left black under the DOM sections.
- **Nav contrast sensing:** the header samples the live frame into an 8x5 offscreen canvas every 160ms, averages luminance of the region behind the nav, and toggles an `on-light` class with hysteresis (thresholds 132/168 desktop). The nav is always legible over any film frame without a scrim. **This one is cheap and brilliant; we can do it over video/imagery.**
- Their own `?hud` overlay shows fps, worst frame, per-stage ms (film/mask/uniforms/plate/tex/faq/sky/gl/overlay) and sequence load counts. They also detect 30Hz rAF quantization (low power mode) and label it.

### 6. The DOM and SVG layer (all of this transfers)

- **Text choreography:** headlines are line-wrapped; each line's inner span translates up from 175% with a per-line delay (`(t - i * 0.115) / 0.6`), i.e. the classic baseline mask reveal, driven by scroll not time. Exiting the hero, lines slide away with increasing per-line lag plus a 0-5px blur. Body copy under mono chips types on per character (opacity stagger `(u - i) * 2.4`), which reads as a telegraph and costs nothing.
- **Chapter rail:** fixed left rail with a mono label (THE MODEL / THE WORK / THE TERMS / QUESTIONS) and dash-drawn tick marks; the label crossfades per chapter, ticks draw via stroke-dashoffset as you progress. Excellent, cheap wayfinding for long pages.
- **SVG filters** define their texture voice: `#inkf` (feTurbulence + feDisplacementMap + alpha shaping) makes text soak into paper like ink; `#fqTear` (two stacked turbulence displacement passes, scales 23 and 7) gives the FAQ panel a torn paper edge. Both are pure SVG, GPU-composited, zero JS per frame.
- **Marginalia:** small `wob` doodle SVGs animate stroke-dashoffset with randomized durations and negative delays (`1.4 7` dash pattern), the same boiling-sketch idea as e2vc's rough.js annotations, done with plain dash animation. The footer draws a thin rect frame (stroke-dasharray 2884) around the closing composition as you arrive.
- **Accessibility fallbacks are real:** `prefers-reduced-motion` or coarse pointer switches to native scroll; keyboard is fully mapped; menu is focus-trapped with Escape; all decorative SVG/canvas is `aria-hidden`.

## Patterns worth stealing (ranked for BigSquare)

1. **The chapter system.** Mono left-rail label + tick marks + numbered chapters (Ch. 1 The Model...) turning a pitch into a story arc. Perfect for our method/process page and even the home page flow. Pure DOM, an afternoon of work.
2. **The fraction-table scroll architecture.** Define section spans as fractions, derive every animation from one scroll progress number. In our stack this is `useScroll` + `useTransform` with a constants table. It is how the whole site stays coherent.
3. **The type triad in their proportions.** Light serif display at huge sizes, quiet grotesk body, tiny wide-tracked mono chips. We own the same triad (Bluu / Apfel / Plex Mono). Their FAQ (serif question, grotesk answer, cream on near-black) is a directly stealable component.
4. **Luminance-sensing nav.** 8x5 canvas sample + hysteresis + class toggle. We will have video and imagery under a transparent nav; this beats gradient scrims.
5. **Baseline mask reveals with per-line lag, and exit motion.** We planned entry reveals (lusion); Pear adds the exit (lines slide off with lag and slight blur), which is half of why scrolling feels authored. Framer Motion handles both.
6. **Typewriter mono microcopy.** Per-character stagger on eyebrow/annotation text only (never body). Pairs perfectly with our mono eyebrow system.
7. **One scroll-scrubbed frame sequence for the "portal" moment.** Their WebP sequence + manifest + nearest-loaded-frame pattern works in 2D canvas without WebGL. If our portal section wants one wow moment, this is cheaper and more robust than Three.js: ~90 WebP frames at 1440w ≈ 3-6MB, lazy-loaded on approach, one texture per frame budget. Optional, only if the section earns it.
8. **Halftone as brand texture.** Their halftone clouds/prints tie the "print" story together. For us a subtle halftone or dither texture on ONE media treatment (SVG filter or CSS) could do similar work. Low priority.
9. **SVG displacement filters** (ink bleed, torn edge) for a single hero-adjacent moment. Zero-JS texture. Low priority, taste-dependent.
10. **The house ease.** `cubic-bezier(.22, 1, .36, 1)` for everything. Candidate to replace our two-easing plan with one signature curve plus a utility ease.

## What we do NOT take

- **Scroll hijack and the 53-viewport road.** Native scroll stays, per moodboard and for SEO/accessibility/LCP. The deep irony: Pear sells SEO with a page whose entire copy lives behind preventDefault and canvas. We will not copy that contradiction; our content stays SSR HTML.
- **The single-shader narrative film.** It is a two-person-months art piece with an enormous media budget (three mp4 films plus six frame sequences). Our Three.js budget is 200KB and one moment. We take the vocabulary, not the production.
- **AI-generated period art.** Their renaissance paintings are (per their own captions) synthetic. Gorgeous, but our copy-rules and trust positioning demand real work, real team, or abstract brand shapes.
- **Loading gate.** They boot behind "The film is loading" for several seconds on first paint. Our LCP target forbids it.
- **All-lowercase wordmark theatrics and the λ glyph swap.** Charming for them; our logo system is fixed.
- **Random hero variants per visit.** Fun, but it fights brand consistency and A/B measurement discipline. (The mechanism, a `?hero=` param with variants, IS worth remembering for landing-page experiments driven deliberately.)

## Implementation notes for our stack

- Chapter rail: fixed aside, `useScroll` progress against section refs, mono label crossfade + tick `pathLength` animation in Framer Motion.
- Reveals: line-split headlines in `overflow:hidden` wrappers, `staggerChildren: 0.115`, translateY 175% to 0, ease `[0.22, 1, 0.36, 1]`; add exit variants (x drift + blur 0 to 4px) tied to scroll leave. Respect `prefers-reduced-motion` (instant fades), matching their fallback behavior.
- Typewriter chips: single `useTransform` of section progress into a character count, render via CSS `opacity` per span; no per-frame React state.
- Nav luminance sensing: reusable hook, offscreen 8x5 canvas, sample the media element behind the header every 150-200ms only while a media section intersects; hysteresis thresholds; toggles a `data-on-light` attribute consumed by CSS tokens.
- Scrub sequence (if the portal earns it): static frames in `/public`, manifest JSON, `Image.decode()` warm-up on approach (IntersectionObserver), draw to a 2D canvas on scroll progress with nearest-loaded fallback; cap decodes per frame at 1-2. No WebGL required.
- Their DPR watchdog and one-upload-per-frame budget are the two performance rules to port verbatim into any canvas work we do.

## Files kept from the code probe

The prettified bundle and CSS live in the session scratchpad only (not committed; 18k lines). Everything durable from them is written into this document. Re-pull anytime: `https://pear.no/assets/index-BhJdAf8K.js` (hash will rotate on their next deploy; grab the current one from view-source).
