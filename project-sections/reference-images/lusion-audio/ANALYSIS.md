# Lusion.co sound + page transition system (decoded 2026-08-27)

> STATUS: BUILT 2026-08-27 (same day). lib/sfx.ts + SoundProvider/SoundToggle
> + PageTransitions, documented in STYLE_GUIDE.md 7.11/7.12. Our synthesized
> equivalents are rendered in `bigsquare-synth-preview.wav` in this folder:
> listen against the reference oggs. Music slot still empty (Brad's loop).

Reference files in this folder are downloaded from lusion.co for STUDY ONLY.
Do not ship them on the BigSquare site. Source our own equivalents (see Asset plan).

## How their sound system works

Decoded from their production bundle (`/_astro/hoisted.CUO_IjfL.js`). No Howler,
no library: raw Web Audio via Three.js `AudioListener` / `Audio` objects.

### Asset manifest (their `AUDIO_DATA` object, files at `/assets/audios/*.ogg`)

UI sfx (all preloaded as decoded buffers, tiny ~6KB files):
- `hover_[3]` -> hover_0/1/2.ogg, volume 1.0 (the 3 bubble pops at different pitches)
- `click_[2]` -> click_0/1.ogg, volume 1.0
- `focus_[3]` -> focus_0/1/2.ogg, volume 0.4
- `page_[2]`  -> page_0/1.ogg, volume 1.0 (played on page transitions, ~21KB whoosh)
- `glass_broken.ogg` (one-off easter egg)

Music (streamed via `<audio>` elements, not preloaded, all loopable ~236KB):
- `generic.ogg` (the main loop), `cinematic_0/2/3.ogg`, `generic_end.ogg`
- cinematic tracks have `needsFilter: true` -> a BiquadFilter low-pass that sweeps
  down to 300 Hz (LOW_PASS_FREQ) to "muffle" music during certain states

### The mechanics worth copying

1. **Variant round-robin, not random.** `countPlay("hover")` does
   `count = (count + 1) % 3` and plays `hover_<count>`. Sequential cycling is why
   rapid mouseovers sound musical instead of repetitive.
2. **Autoplay unlock.** The `AudioListener` (AudioContext) is only created on the
   first body click/pointerdown. Until then all play calls are no-ops.
3. **Hover wiring is manual, not global.** `addHoverEvent(el)` attaches
   `mouseenter -> countPlay("hover")` per interactive element. Clicks go through a
   global input system that checks the event path.
4. **Everything fades, nothing cuts.** Global volume ramps with
   `saturate(volume +/- dt)` per frame; music swaps use `fadeBgMusic` with
   crossfade (fade-in/fade-out per track). Mute toggle is a smooth ramp.
5. **Page-change sound is part of the transition**, fired by the page manager:
   `useGenericTransition && audios.countPlay("page")`.

## How their page transitions work

Fully custom SPA: their own `routeManager` (pushState/popstate) + `PageManager`
with a state machine (isHiding -> preload -> isShowing). A canvas-drawn
`TransitionOverlay` (with animated text) covers the swap; the incoming page
preloads behind it; `page_x.ogg` plays during the hide. First load runs a
preloader that gates the initial reveal, then elements stagger into place.

Nothing here transfers 1:1 to Next.js App Router; the *feel* transfers:
out-animation -> covered swap -> staggered in-animation, with sound.

## BigSquare implementation sketch

Sound (no Three.js needed, plain Web Audio):
- `lib/sound.ts` + a `SoundProvider` client component: fetch + decodeAudioData the
  sfx set on first pointerdown, `countPlay(id)` round-robin, master gain ramp,
  mute state persisted to localStorage, everything no-op when muted/SSR/reduced-motion.
- A `useSound()` hook or a tiny event-delegation layer (data-sfx="hover" on
  interactive elements) so buttons/cards/nav opt in without per-component wiring.
- Music: `<audio loop>` element gated behind an explicit sound-on toggle in the
  header (never autoplay), gain crossfade, optional low-pass duck when menu opens.

Transitions:
- First-load: preloader/intro overlay + staggered reveals (Framer Motion, already
  in stack). Route changes: template.tsx-level enter animations + an exit overlay;
  check the local Next docs (node_modules/next/dist/docs) for the current View
  Transitions story before building.

## Asset plan (do not ship Lusion's files)

- SFX: source CC0/royalty-free pops (freesound.org CC0, Pixabay SFX) or synthesize
  the pops directly in Web Audio (pitch-swept sine + fast decay gets very close,
  zero asset weight). Three pitch variants of the same sample also works: pitch
  shift one pop by +/- a few semitones.
- Music: Suno-generated loop is fine; target ~60-90s seamless loop, mixed quiet.
- Ship .ogg + .mp3 (Safari) or just .mp3/.m4a; keep sfx under ~10KB each.
