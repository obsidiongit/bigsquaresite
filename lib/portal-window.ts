/* Shared scroll math for the PORTAL WINDOW MORPH (9.portal.md v3):
   the companion cube's ending. The services dock is no longer the
   journey's last stop; the cube carries on into the portal section and
   BECOMES the product.

   THE GESTURE, and why it is not the featured-work morph again. There,
   the cube floods brand blue and one solid panel waterfalls out of it
   behind the grid. Here the blue square it flattens into IS the
   Obsidion mark in the window's top bar: the cube shrinks onto the
   logo's own slot, the chrome bar stretches out around it, and the
   window unrolls downward from under the bar like a screen coming on.
   Same proven mechanics, a different read: the object does not become
   a panel, it becomes the software's identity.

   THE PIN. Same architecture as the hero film, the work panel, and
   the first-90-days close (the solution sweep left the pin family
   2026-08-30): the composition pins inside a taller wrapper and a
   scroll RUNWAY scrubs the choreography 1:1 under the visitor's
   finger. No auto-play, no hijack.

   TWO ACTORS, ONE CLOCK. The WebGL cube (HomeCanvas Tracker) and the
   DOM window (PortalExhibit's useAnimationFrame) both measure
   `[data-portal-stage]` and its sticky child `[data-portal-pin]`, and
   both build their handoff geometry from the SAME measured rects: the
   frame box `[data-portal-frame]`, the chrome bar `[data-portal-bar]`,
   and the logo mark `[data-portal-mark]`. Nothing is authored in
   offsets that the two sides could disagree about.

   Measuring the mark works because clip-path never changes layout: the
   window is laid out at full size the whole time and merely painted
   through a growing window. */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const seg = (v: number, [a, b]: [number, number]) =>
  clamp01((v - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

/* the runway: scroll room below the pinned composition, in svh */
export const PORTAL_RUNWAY_VH = 140;

/* The flattened slab's edge as a fraction of viewport height. Matches
   work-panel's SLAB_VH on purpose: the cube's flattened footprint is
   one size wherever it happens, so the object reads as the same object
   in both set pieces. Both actors build the swap square from this. */
export const PORTAL_SLAB_VH = 0.11;

/* ---- beats, in pin-runway progress 0..1 ----------------------------- */

/* The cube's ARRIVAL is not a constant here: it rides the normal
   waypoint journey (HomeCanvas, anchor "portal") until the dive takes
   over, so there is nothing for the two actors to agree about yet. */
/* a slow turntable while the section sits still: the beat needs
   presence before it resolves, or the morph reads as a jump cut */
export const PORTAL_TURN: [number, number] = [0.1, 0.4];
export const PORTAL_TURNS = 1.35;
/* dive onto the logo mark's centre and ease to the slab square */
export const PORTAL_DIVE: [number, number] = [0.38, 0.54];
export const PORTAL_FLATTEN: [number, number] = [0.44, 0.56];
/* the flood finishes a beat BEFORE the handoff: the DOM seed is flat
   --acc, so the cube must already be flat --acc when they crossfade,
   or the swap shows a step in colour */
export const PORTAL_FLOOD: [number, number] = [0.4, 0.525];
/* damping ramps to near-exact tracking into the swap, so the slab
   cannot lag the DOM square by a follower frame */
export const PORTAL_LOCK: [number, number] = [0.44, 0.56];

/* where the canvas hands the object to the DOM */
export const PORTAL_HANDOFF = 0.56;
/* the cube is gone a beat after the DOM square crossfades over it */
export const PORTAL_VANISH: [number, number] = [
  PORTAL_HANDOFF + 0.01,
  PORTAL_HANDOFF + 0.05,
];

/* the chrome bar stretches out from the seed to the frame's full
   width, and the seed shrinks onto the logo mark's own box */
export const PORTAL_STRETCH: [number, number] = [PORTAL_HANDOFF, 0.76];
/* the seed retires once it is exactly the mark, sitting on top of the
   real one: an invisible swap, not a fade-out */
export const PORTAL_SEED_FADE: [number, number] = [0.75, 0.81];
/* the body unrolls downward from under the bar */
export const PORTAL_UNROLL: [number, number] = [0.74, 0.95];
/* the second window and the frame's shadow arrive with the body */
export const PORTAL_SETTLE: [number, number] = [0.86, 1.0];

/* the first COMMITTED value: below it the cube is merely holding and
   turning above the window, and any park there is a legitimate rest.
   From the dive on, states are half-built and must complete, so the
   checkpoint band starts here (the work-panel MORPH_REST rule). */
export const PORTAL_COMMIT = PORTAL_DIVE[0];

type Rect = { top: number; height: number };

/* the master clock. With no runway (mobile, reduced motion, no WebGL:
   PortalStage collapses the spacer) this reads a settled 1, so every
   consumer renders the finished window with no special-casing. */
export function portalMorph(wr: Rect, cr: Rect) {
  const runway = wr.height - cr.height;
  return {
    /** 0 = free cube above the frame, 1 = settled window */
    p: runway > 1 ? clamp01((cr.top - wr.top) / runway) : 1,
    runway,
  };
}

/* Checkpoint band for useScrollCheckpoints (STYLE_GUIDE 7.4): the
   committed slice only, as an absolute scrollY range resolved at
   settle time. Inside the runway pinStart = scrollY - pin offset is
   exact; parked outside it the band is degenerate and the hook stays
   inert. Unlike the work turntable's free-park spin zone, a park here
   must complete: a half-built window reads as broken, not as an
   object at rest. */
export function portalBands(
  wr: Rect,
  cr: Rect,
  scrollY: number,
): [number, number][] {
  const runway = wr.height - cr.height;
  if (runway <= 1) return [];
  const pinStart = scrollY - (cr.top - wr.top);
  return [[pinStart + PORTAL_COMMIT * runway, pinStart + runway]];
}

/* The swap geometry BOTH actors build independently from the same
   measured rects. `mark` is the logo square's live box, `slabPx` the
   flattened cube's edge. The seed is centred on the mark so the
   shrink is a pure scale about a fixed point: no travel at the swap,
   which is where drift would show. */
export function seedGeometry(
  mark: { left: number; top: number; width: number; height: number },
  vh: number,
) {
  const slabPx = PORTAL_SLAB_VH * vh;
  return {
    slabPx,
    cx: mark.left + mark.width / 2,
    cy: mark.top + mark.height / 2,
    /** the slab's RoundedBox bevel, projected to CSS px */
    radius0: 0.06 * slabPx,
  };
}
