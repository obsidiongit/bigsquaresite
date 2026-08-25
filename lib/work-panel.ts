/* Shared scroll math for the featured work PANEL MORPH (2b v6, Brad
   2026-08-24 rounds 5-8): the companion cube floats beside the
   "Featured work" headline, spins, dives, flattens into a brand-blue
   slab, stretches into a bar, and ONE blue panel takes over behind
   all six cards; at the grid's far edge it all runs backwards.

   THE PIN (round 8). Rounds 5-7 drove the morph off the panel's own
   passage through the viewport, which caps the whole choreography at
   ~0.5vh of scroll: even careful scrolling blasted past it, and the
   round-7 attempt to fix that with one giant checkpoint band made a
   single wheel notch auto-glide the entire journey ("it's jumping...
   blasted past the cube spinning animation entirely"). The fix is the
   hero's own architecture: the section's header + grid PIN (position
   sticky inside a taller wrapper) and a scroll RUNWAY drives the
   morph 1:1 under the visitor's finger, exactly like the film
   takeover. No auto-play; the checkpoint band only covers the runway
   itself, settling a mid-beat park to the nearer end.

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

/* morph value where the canvas slab and the DOM panel trade places
   (slab geometry == bar geometry there, so the swap is invisible) */
export const PANEL_HANDOFF = 0.8;

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
   pin runway and the exit window, as absolute scrollY ranges resolved
   at settle time. Inside the runway, pinStart = scrollY - pin offset
   is exact; parked outside it the degenerate band lands on a closed
   edge and the hook stays inert. */
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
    bands.push([pinStart, pinStart + runway]);
  }
  const bottom = panelBottom + scrollY;
  bands.push([bottom - vh * EXIT[0], bottom - vh * EXIT[1]]);
  return bands;
}
