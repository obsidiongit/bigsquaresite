/* The solution CARD SWEEP (5.solution.md v3.2; unpinned rebuild,
   Brad 2026-08-30: "I don't like this. It's a scroll lock"): the
   approved beat survives, the pin does not. The companion cube dives
   below the frame on the right as the section arrives, rises back in
   under the three cards, sweeps flat right-to-left (each title
   drawing its rough underline as the cube crosses beneath it), and
   dives out below frame at the left edge. All of it now rides the
   section's NATURAL PASSAGE, the services-dock clock model: no
   sticky stage, no runway, nothing stops the scroll.

   Two consumers must agree on the clock: the canvas cube (HomeCanvas
   Tracker) and the DOM underlines (SolutionCards). Both measure the
   SAME element ([data-cube-anchor="solutionCards"], the card grid)
   each frame and feed it through sweepFrac: no shared state, no
   drift. The beats below are fractions of that passage.

   The section declares no checkpoint bands: nothing pins, so every
   scroll position is a legitimate rest. */

type Rect = { top: number; height: number };

/* passage clock: 0 when the grid's top enters the viewport bottom,
   1 when its bottom leaves the top. The grid is ~0.5 viewport tall
   on desktop, so the full passage is ~1.5 viewport heights. */
export const sweepFrac = (rect: Rect, vh: number) =>
  Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));

/* passage frac at which the cube sits under each card's CENTER, in
   sweep order (right to left): Full Approach (column 3), Transparency
   (column 2), No Long Term Contracts (column 1). Tuned for the ~1.5vh
   passage: the grid is fully above the fold from ~0.33 and its top
   hits the viewport top at ~0.67, so the beats land while every title
   is on screen and the lane (clamped in HomeCanvas) rides up with the
   grid. */
export const SWEEP_UNDER: [number, number, number] = [0.55, 0.64, 0.73];
/* rise from below the frame at the right edge (opens right after the
   waypoint approach dive completes below frame at grid frac 0.36, so
   the journey/override handoff stays off-screen), and the left-edge
   exit dive that ends below frame before the section leaves (the
   below-frame-left park waypoint sits just past it) */
export const SWEEP_ENTER: [number, number] = [0.38, 0.5];
export const SWEEP_EXIT: [number, number] = [0.73, 0.84];
