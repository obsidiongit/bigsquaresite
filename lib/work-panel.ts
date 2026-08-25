/* Shared scroll math for the featured work PANEL MORPH (2b v8, Brad
   2026-08-24/25 rounds 5-10): the companion cube floats beside the
   "Featured work" headline, spins, dives, flattens into a brand-blue
   square slab, and ONE blue panel grows out of it (a clip-path
   stretch into the top bar, then a top-down waterfall carrying the
   edge squiggle with it) behind all six cards; at the grid's far
   edge it all runs backwards.

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
export const PANEL_HANDOFF = 0.62;

/* the flooded square slab's edge (fraction of viewport height): the
   deterministic swap geometry BOTH actors build independently. The
   canvas dive eases the cube's scale to exactly this; the DOM's clip
   starts as this square. Must stay under PANEL_BAR_VH. */
export const SLAB_VH = 0.11;

/* morph value where the DOM stretch (square -> full-width top bar)
   ends and the top-down sweep begins */
export const STRETCH_END = 0.76;

/* the last FREE morph value: below it the cube merely floats/spins at
   its rest spot and any park is a legit rest, so the checkpoint band
   starts HERE, not at the pin start (round 9; the full-runway band
   meant one wheel notch into the pin idle-glided the entire
   choreography, which read as the panel appearing instantly). It must
   equal the canvas dive's start (HomeCanvas WORK_DIVE): from the dive
   on, states are half-morphed and must complete. */
export const MORPH_REST = 0.3;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const seg = (v: number, [a, b]: [number, number]) =>
  clamp01((v - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

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

/* Checkpoint bands for useScrollCheckpoints (STYLE_GUIDE 7.4): the
   COMMITTED slice of the pin runway (MORPH_REST -> 1; the float/spin
   zone before it parks freely) and the exit window, as absolute
   scrollY ranges resolved at settle time. Inside the runway,
   pinStart = scrollY - pin offset is exact; parked outside it the
   degenerate band lands on a closed edge and the hook stays inert. */
export function workMorphBands(
  wr: Rect,
  cr: Rect,
  panelBottom: number,
  vh: number,
  scrollY: number,
): [number, number][] {
  const runway = wr.height - cr.height;
  const bands: [number, number][] = [];
  if (runway > 1) {
    const pinStart = scrollY - (cr.top - wr.top);
    bands.push([pinStart + MORPH_REST * runway, pinStart + runway]);
  }
  const bottom = panelBottom + scrollY;
  bands.push([bottom - vh * EXIT[0], bottom - vh * EXIT[1]]);
  return bands;
}
