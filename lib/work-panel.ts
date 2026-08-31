/* Shared scroll math for the featured work PANEL MORPH (2b v11, Brad
   2026-08-24/25 rounds 5-12; retune 2026-08-30): from the release
   rest (headline left, cube in the headline/support gap, cards
   peeking below) the PIN engages IMMEDIATELY (sticky top 30svh == the
   release composition, round 11: "without scrolling down on the page
   any more than we already are now"). Scroll then scrubs: the
   headline + support STAY PUT for the whole choreography (the old
   TEXT_EXIT beat is retired: Brad, the title scrolled away and the
   box spun alone too long with no words); the cube drifts from the
   float spot to a spot just under the headline's baseline and
   turntables WORK_TURNS slow full turns in SIX eased half-turn steps,
   each step swapping a caption (index, title, tags of one
   FEATURED_WORK entry) in the support column beside it; then it
   dives, flattens, floods into a brand-blue square slab, and ONE blue
   panel grows out of it (a clip-path stretch into the top bar, then a
   top-down waterfall carrying the edge squiggle with it) behind all
   six cards; at the grid's far edge it all runs backwards.

   THE PIN (round 8). Rounds 5-7 drove the morph off the panel's own
   passage through the viewport, which caps the whole choreography at
   ~0.5vh of scroll: even careful scrolling blasted past it, and the
   round-7 attempt to fix that with one giant checkpoint band made a
   single wheel notch auto-glide the entire journey ("it's jumping...
   blasted past the cube spinning animation entirely"). The fix is the
   hero's own architecture: the section's header + grid PIN (position
   sticky inside a taller wrapper) and a scroll RUNWAY drives the
   morph 1:1 under the visitor's finger, exactly like the film
   takeover. No auto-play; the checkpoint band covers only the
   COMMITTED slice of the runway (MORPH_REST on, round 9): the
   float/spin zone before the dive parks freely, and a park past the
   dive completes the morph on a slow glide.

   Two actors read the same clock each frame and must agree exactly:
   the WebGL cube (HomeCanvas Tracker) and the DOM panel (FeaturedWork
   useAnimationFrame). Both measure the pin wrapper `[data-work-stage]`
   and its sticky child `[data-work-pin]`: pin progress is simply
   (child.top - wrapper.top) / runway, where runway = wrapper height -
   child height. That needs no configured offsets: before the pin the
   child sits at the wrapper top (0), during it the offset IS the
   scrolled distance, after it the offset equals the runway. The panel
   box `[data-work-panel]` (untransformed) still supplies the bar
   geometry and the EXIT clock at the grid's bottom edge. */

/* panel BOTTOM crossing these viewport fractions runs exit 0 -> 1
   (the reverse morph at the grid's far edge; position-driven, no pin) */
const EXIT: [number, number] = [0.55, 0.05];

/* the bar: the panel's top (enter) or bottom (exit) slice the cube
   stretches into, as a fraction of viewport height. Both actors size
   the handoff geometry from this. */
export const PANEL_BAR_VH = 0.14;

/* morph value where the canvas slab and the DOM panel trade places.
   Round 10 (Brad: the box "morphs into a pill shape... the rounded
   corners morph when it's being stretched"): the swap moved BEFORE
   the stretch. The canvas slab's RoundedBoxGeometry bevel scales with
   the mesh, so stretching it to the full-width bar turned its ends
   into ~90px pill curves; and the DOM's scaleY sweep squashed the
   32px corners flat. The canvas now dives/flattens/floods to a SQUARE
   slab of SLAB_VH edge (uniform bevel, no distortion) and the DOM
   plays the whole stretch + waterfall with clip-path inset(round r):
   absolute-px radii that never distort. */
export const PANEL_HANDOFF = 0.74;

/* the flooded square slab's edge (fraction of viewport height): the
   deterministic swap geometry BOTH actors build independently. The
   canvas dive eases the cube's scale to exactly this; the DOM's clip
   starts as this square. Must stay under PANEL_BAR_VH. */
export const SLAB_VH = 0.11;

/* morph value where the DOM stretch (square -> full-width top bar)
   ends and the top-down sweep begins */
export const STRETCH_END = 0.85;

/* the TURNTABLE window, shared by both actors (moved here from
   HomeCanvas in the spin-caption retune so the canvas rotation and
   the DOM caption rail can never disagree on where a step lands).
   WORK_SPIN[1] must stay <= MORPH_REST: the last face must land
   before (or exactly at) the dive. Felt turn rate, desktop: old =
   3 turns / (0.38 x 240svh runway) = 1 turn per 30.4svh; new =
   3 turns / (0.48 x 160svh runway) = 1 turn per 25.6svh (~16%
   faster, the closest the shorter runway allows with the dive ladder
   untouched). Widen the runway, not the count, to slow it (round
   13). */
export const WORK_SPIN: [number, number] = [0.08, 0.56];

/* one caption step per FEATURED_WORK entry; each step is half a turn,
   so STEP_COUNT / 2 == WORK_TURNS by construction. Round 12 (4 turns
   read "extremely fast") and round 13 ("go for three turns") settled
   the count at 3; the caption retune keeps it and indexes it. */
export const STEP_COUNT = 6;
export const WORK_TURNS = STEP_COUNT / 2;

/* where the COMMITTED morph begins: the main checkpoint band starts
   HERE, not at the pin start (round 9; the full-runway band meant one
   wheel notch into the pin idle-glided the entire choreography, which
   read as the panel appearing instantly). Below it the hold/travel
   zone parks freely and the spin parks on step edges (workMorphBands).
   It must equal the canvas dive's start (HomeCanvas WORK_DIVE): from
   the dive on, states are half-morphed and must complete. */
export const MORPH_REST = 0.56;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const seg = (v: number, [a, b]: [number, number]) =>
  clamp01((v - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

/* eased waypoint steps for the turntable (the steps4 pattern): within
   each 1/STEP_COUNT slice the value dwells on the landed face (first
   and last 15% of the slice), then EASES to the next: never a snap,
   which the canvas's damped follower would rubber-band on. Adjacent
   dwells merge into one 30%-of-a-slice rest exactly straddling each
   slice edge, which is also where spinStep flips: face landings and
   caption swaps read locked together. Continuous, stepEase(0) = 0,
   stepEase(1) = 1, so the dive's nearest-half-turn unwind starts on
   an exact face. */
export const stepEase = (t: number) => {
  const q = Math.min(STEP_COUNT, Math.max(0, t) * STEP_COUNT);
  const i = Math.min(STEP_COUNT - 1, Math.floor(q));
  const f = q - i;
  const glide = f < 0.15 ? 0 : f > 0.85 ? 1 : smooth((f - 0.15) / 0.7);
  return (i + glide) / STEP_COUNT;
};

/* which caption the turntable is on for a morph value: 0..STEP_COUNT-1,
   clamped so pre-spin reads step 0 and the dive holds the last one */
export const spinStep = (m: number) =>
  Math.min(STEP_COUNT - 1, Math.floor(seg(m, WORK_SPIN) * STEP_COUNT));

type Rect = { top: number; height: number };

/* the master clock. wr/cr are the pin wrapper's and sticky child's
   rects, panelBottom the panel box's viewport-relative bottom. With
   no runway (fallback paths render it at 0) the pin reads settled. */
export function workMorph(wr: Rect, cr: Rect, panelBottom: number, vh: number) {
  const runway = wr.height - cr.height;
  const pin = runway > 1 ? clamp01((cr.top - wr.top) / runway) : 1;
  const exit = seg(panelBottom / vh, EXIT);
  return {
    /** 0 = free cube, 1 = settled panel */
    morph: Math.min(pin, 1 - exit),
    /** which edge the morph is anchored to right now */
    exiting: exit > 0.001,
  };
}

/* Checkpoint bands for useScrollCheckpoints (STYLE_GUIDE 7.4): one
   band per turntable step (desktop pins only; mobile has no cube by
   the grid), the COMMITTED slice of the pin runway (MORPH_REST -> 1;
   the hold/travel zone before the spin parks freely) and the exit
   window, as absolute scrollY ranges resolved at settle time. The
   step bands tile WORK_SPIN edge to edge, so an idle park anywhere in
   the spin glides to a slice edge: a landed face with its caption
   settled, never a mid-swap. Their shared edges are legit rests (the
   hook only acts strictly inside a band), and the last edge is
   MORPH_REST itself, where the committed band takes over. Inside the
   runway, pinStart = scrollY - pin offset is exact; parked outside it
   the degenerate band lands on a closed edge and the hook stays
   inert. */
export function workMorphBands(
  wr: Rect,
  cr: Rect,
  panelBottom: number,
  vh: number,
  scrollY: number,
  desktop: boolean,
): [number, number][] {
  const runway = wr.height - cr.height;
  const bands: [number, number][] = [];
  if (runway > 1) {
    const pinStart = scrollY - (cr.top - wr.top);
    if (desktop) {
      const span = WORK_SPIN[1] - WORK_SPIN[0];
      for (let i = 0; i < STEP_COUNT; i++)
        bands.push([
          pinStart + (WORK_SPIN[0] + (i / STEP_COUNT) * span) * runway,
          pinStart + (WORK_SPIN[0] + ((i + 1) / STEP_COUNT) * span) * runway,
        ]);
    }
    bands.push([pinStart + MORPH_REST * runway, pinStart + runway]);
  }
  const bottom = panelBottom + scrollY;
  bands.push([bottom - vh * EXIT[0], bottom - vh * EXIT[1]]);
  return bands;
}
