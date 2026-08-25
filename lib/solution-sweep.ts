/* The solution CARD SWEEP (5.solution.md v3.2, Brad 2026-08-24): the
   companion cube dives below the frame as the solution section
   arrives, the section PINS in full viewport (sticky stage + scroll
   runway, the hero/work-panel architecture; Brad round 4: "stop the
   scroll with this in full viewport so we can see the cube
   animation"), and the runway scrubs the sweep 1:1: the cube rises
   from below on the right, sweeps flat right-to-left under the three
   frozen cards (each title drawing its rough underline as the cube
   crosses beneath it), then dives back below frame at the left edge,
   and the pin releases.

   Three consumers must agree on the clock: the canvas cube
   (HomeCanvas Tracker), the DOM underlines (SolutionCards), and the
   stage itself (SolutionStage). All measure the same two elements
   ([data-solution-stage] wrapper, [data-solution-pin] sticky child)
   with the same rect math each frame: no shared state, no drift.

   The whole runway is a free-park zone (STYLE_GUIDE 7.4 round-9
   rule: the cube is alive at rest everywhere in it), so it declares
   no checkpoint bands. */

/* the pin runway (svh). Collapsed to 0 on mobile, reduced motion,
   and no-WebGL paths: with zero room the sticky child never pins and
   the section scrolls natively. */
export const SWEEP_RUNWAY_VH = 130;

/* pin-progress p at which the cube sits under each card's CENTER, in
   sweep order (right to left): Full Approach (column 3), Transparency
   (column 2), No Long Term Contracts (column 1). */
export const SWEEP_UNDER: [number, number, number] = [0.3, 0.5, 0.7];
/* rise from below the frame at the right edge, and the left-edge
   exit dive that ends below frame just before the release */
export const SWEEP_ENTER: [number, number] = [0.02, 0.2];
export const SWEEP_EXIT: [number, number] = [0.7, 0.97];

type Rect = { top: number; height: number };

/* pin clock, the work-panel rect math: p = 0 until the child sticks,
   1 when the runway is consumed (and it stays 1 after release).
   room <= 1 means the runway is collapsed (fallback paths). */
export const sweepPin = (stage: Rect, pin: Rect) => {
  const room = stage.height - pin.height;
  if (room <= 1) return { room: 0, p: 0 };
  return {
    room,
    p: Math.min(1, Math.max(0, (pin.top - stage.top) / room)),
  };
};
