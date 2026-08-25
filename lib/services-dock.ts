/* The services CUBE DOCK (6.services.md v4, Brad's spotlight session
   2026-08-24): the companion cube's journey ends by DOCKING inside the
   spotlight panel's bay. Two consumers agree on the clock the sweep
   way (lib/solution-sweep): HomeCanvas measures the bay element
   ([data-services-dock]) and the services section rect per frame with
   the math below; Services.tsx only renders the bay and fires flicks.

   The dock is a soft blend, not a pin: the section scrolls natively
   (the sticky panel does the holding), and the cube's target lerps
   waypoint-journey -> bay center over ENGAGE, back over RELEASE, with
   the retuned end-of-journey dissolve waiting past the release. Both
   handoffs happen on-screen and are legal BECAUSE they are blends:
   there is no swap frame to seam. */

/* services-section passage frac ranges (0 = top enters the bottom
   edge, 1 = bottom leaves the top edge, the waypoint convention) */
export const DOCK_ENGAGE: [number, number] = [0.1, 0.24];
export const DOCK_RELEASE: [number, number] = [0.78, 0.92];

/* cube size while docked, as a fraction of the bay's height */
export const DOCK_FIT = 0.46;

/* ---- the flick store ------------------------------------------------ */
/* Hovering a service row flicks the docked cube: an angular-velocity
   impulse the canvas integrates and decays each frame, like flicking a
   well-oiled turntable. A module singleton (not rect math) because
   pointer events are inherently push; the canvas only ever reads and
   decays it inside its own frame. */

const FLICK_IMPULSE = 2.4; /* rad/s per hover */
const FLICK_MAX = 6.5; /* rapid scrubbing cannot wind it past this */
export const FLICK_DECAY = 3; /* 1/s */

export const dockFlick = {
  v: 0 /* angular velocity, rad/s */,
  a: 0 /* accumulated angle, rad; the canvas adds this to its spin */,
};

/* dir: +1 flicks forward (moving DOWN the list), -1 back */
export function flickCube(dir: 1 | -1) {
  dockFlick.v = Math.min(
    FLICK_MAX,
    Math.max(-FLICK_MAX, dockFlick.v + dir * FLICK_IMPULSE),
  );
}
