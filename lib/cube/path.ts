import * as THREE from "three";
import { HERO_K } from "@/components/sections/home/media";

/* The hero's camera path and the protagonist's roll (cube-v2/brief.md
   section 6 "The hero choreography", 9.3 step 2, 10.3 round 2). Pure
   functions of scroll progress: p is the hero clock (0..1 over the
   first K of the runway), c the reform clock (0..1 over the last 1-K),
   both already damped by the canvas. Nothing here touches three's
   scene; world.ts and WorldCanvas.tsx apply the numbers.

   World constants live here so town.ts and world.ts share one road:
   the protagonist rests at the origin, the road leaves under it along
   ROAD_DIR, the film station (a drawn frame) is FILM_S units down that
   straight, and the cube reaches it in exactly two quarter turns. */

export const GROUND_Y = -0.5;
/** heading of the road's first straight, radians from -z (left is positive) */
export const ROAD_HEADING = Math.atan2(0.58, 0.81);
/** unit direction of that straight in xz */
export const ROAD_DIR = new THREE.Vector3(-Math.sin(ROAD_HEADING), 0, -Math.cos(ROAD_HEADING));
/** screen-right at the top-down shot: across the road */
export const ACROSS = new THREE.Vector3(Math.cos(ROAD_HEADING), 0, -Math.sin(ROAD_HEADING));
/** the film station's distance down the straight: two quarter turns */
export const FILM_S = 2;
export const FILM_CENTER = ROAD_DIR.clone().multiplyScalar(FILM_S).setY(GROUND_Y);
/** viewports narrower than this take the mobile framing */
export const NARROW = 768;
export const K = HERO_K;

export type Seg = [number, number];
export const seg = (v: number, [a, b]: Seg) => Math.min(1, Math.max(0, (v - a) / (b - a)));
export const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* ---- beats, in 0..1 of the K clock ---------------------------------- */
/** the mid-build storefront tops out as the camera starts moving */
export const BUILD: Seg = [0.06, 0.34];
/** two quarter turns down the road, a rest between them */
export const ROLL_1: Seg = [0.1, 0.22];
export const ROLL_2: Seg = [0.24, 0.36];
/** the frame draws itself on the paper ahead of the roll */
export const FRAME_DRAW: Seg = [0.12, 0.32];
/** the crane: rest framing to square over the face */
export const CRANE: Seg = [0.08, 0.55];
/** the top face lights up (duotone) */
export const LIGHT_UP: Seg = [0.4, 0.47];
/** the film spreads from the face to the drawn frame */
export const SPREAD: Seg = [0.45, 0.55];
/** duotone to colour (HomeCanvas DEVELOP, unchanged) */
export const DEVELOP: Seg = [0.5, 0.7];
/** the dolly from the card to the framed panel */
export const PUSH: Seg = [0.62, 0.92];
export const MEDIA_SCALE: Seg = [0.62, 0.94];

/* ---- reform sub-beats, in 0..1 of the last 1-K ---------------------- */
/* The film re-inks and contracts to the face while the camera is still
   near the top-down (a panel shrinking to a square, seen square-on),
   dies on the face as the tilt begins, and only then does the camera
   rise to the follow shot with a plain cube: no dark mat under an
   oblique cube, which is what a late contraction read as. */
export const R_PULL: Seg = [0, 1];
export const R_TILT: Seg = [0.2, 0.92];
export const R_REINK: Seg = [0.02, 0.4];
export const R_CONTRACT: Seg = [0.05, 0.38];
export const R_DIE: Seg = [0.36, 0.56];

/* ---- camera ---------------------------------------------------------- */

/** An orbit pose: the camera sits `dist` from `target` at elevation
    `el` and azimuth `az` (0 = on +z looking down -z), and the
    projection is shifted so the target lands `fx` of the width right
    of centre and `fy` of the height above it. */
export type Pose = { target: THREE.Vector3; dist: number; el: number; az: number; fx: number; fy: number };

export type Layout = {
  narrow: boolean;
  /** the drawn frame's half size: across the road, along it */
  frameHalf: THREE.Vector2;
  /** the panel's 24px corner radius in world units */
  radius: number;
  rest: Pose;
  face: Pose;
  hold: Pose;
  follow: Pose;
};

const FOV = 30;
const TAN_HALF = Math.tan((FOV / 2 * Math.PI) / 180);

/** Everything the path needs that depends on the viewport. The card
    and panel rects are HomeCanvas's (0.34 / 0.62 of the width at
    CARD_CENTER; the panel is the viewport minus 4vw). */
export function computeLayout(width: number, height: number): Layout {
  const narrow = width < NARROW;
  const margin = Math.max(0.04 * width, 24);
  const panelW = width - 2 * margin;
  const panelH = height - 2 * margin;
  /* the frame takes the panel's aspect so the hold fills it exactly;
     clamped on phones so the drawn frame stays a frame, not a strip */
  const aspect = clamp(panelW / panelH, 0.75, 1.9);
  const fw = narrow ? 1.7 : 2.84;
  const frameHalf = new THREE.Vector2(fw / 2, fw / aspect / 2);
  /* the distance at which fw world units span px pixels (vertical fov) */
  const distFor = (px: number) => (height * fw) / (2 * TAN_HALF * px);
  const cardPx = (narrow ? 0.62 : 0.34) * width;
  const holdPx = Math.min(panelW, panelH * aspect);
  const radius = (24 * fw) / holdPx;
  const fc = FILM_CENTER;

  /* rest framing: desktop parks the cube lower right of the headline;
     tablets (768 to 1023, where the DOM is already the desktop layout
     but the headline runs to 80 percent of the width and down to 62
     percent of the height) park it in the band above the headline;
     phones park it small above the 5-line headline */
  const tablet = !narrow && width < 1024;
  /* 1024 to 1439 the headline wraps "you" onto its second line and runs
     to 90 percent of the width, with the statement from 77 percent of
     the height: no clear slot for a 40 percent cube. It sits a little
     further right and smaller than at 1440 so only the tail of "you"
     runs in front of its corner (lower would put it behind the
     statement). An open point for the fold's type scale, not solvable
     from the camera alone. */
  const laptop = !narrow && !tablet && width < 1440;
  const rest: Pose = narrow
    ? { target: new THREE.Vector3(0, -0.1, 0), dist: 12, el: 0.42, az: 0.12, fx: 0.2, fy: 0.37 }
    : tablet
      ? { target: new THREE.Vector3(0, -0.1, 0), dist: 10, el: 0.4, az: 0.12, fx: 0.3, fy: 0.3 }
      : laptop
        ? { target: new THREE.Vector3(0, -0.1, 0), dist: 7.9, el: 0.34, az: 0.12, fx: 0.41, fy: -0.05 }
        : { target: new THREE.Vector3(0, -0.1, 0), dist: 7.2, el: 0.34, az: 0.12, fx: 0.37, fy: -0.05 };
  const face: Pose = {
    target: fc.clone(),
    dist: distFor(cardPx),
    el: Math.PI / 2,
    az: ROAD_HEADING,
    fx: narrow ? -0.06 : -0.24,
    fy: narrow ? -0.16 : -0.17,
  };
  const hold: Pose = { ...face, target: fc.clone(), dist: distFor(holdPx), fx: 0, fy: 0 };
  const follow: Pose = {
    target: fc.clone().setY(-0.1),
    dist: narrow ? 12 : 8.5,
    el: narrow ? 0.42 : 0.36,
    az: ROAD_HEADING,
    fx: 0.2,
    fy: narrow ? 0.16 : 0.02,
  };
  return { narrow, frameHalf, radius, rest, face, hold, follow };
}

function lerpPose(a: Pose, b: Pose, t: number, tEl: number, out: Pose) {
  out.target.lerpVectors(a.target, b.target, t);
  out.dist = lerp(a.dist, b.dist, t);
  out.el = lerp(a.el, b.el, tEl);
  out.az = lerp(a.az, b.az, t);
  out.fx = lerp(a.fx, b.fx, t);
  out.fy = lerp(a.fy, b.fy, t);
}

/** The camera pose for the clocks. Rest -> crane over the face
    (elevation eased later than the dolly, so the camera swings round
    the cube before it tips down) -> push to the panel -> pull back and
    rise to the follow shot. Writes into `out`. */
export function cameraPose(p: number, c: number, L: Layout, out: Pose) {
  const u = smooth(seg(p, CRANE));
  lerpPose(L.rest, L.face, u, smooth(u), out);
  const v = smooth(seg(p, PUSH));
  if (v > 0) lerpPose(out, L.hold, v, v, out);
  if (c > 0) lerpPose(out, L.follow, smooth(seg(c, R_PULL)), smooth(seg(c, R_TILT)), out);
}

/* ---- the roll -------------------------------------------------------- */

const UP = new THREE.Vector3(0, 1, 0);
/** rolling forward along the road turns the cube about this axis */
const AXIS = new THREE.Vector3().crossVectors(UP, ROAD_DIR).normalize();
const BASE_Q = new THREE.Quaternion().setFromAxisAngle(UP, ROAD_HEADING);
const ROLL_Q = new THREE.Quaternion();
const PIVOT = new THREE.Vector3();
const ARM = new THREE.Vector3();

/** The protagonist's pose: edge-over-edge quarter turns down the road,
    each about the leading bottom edge, so the centre lifts and lands
    like a real block. Returns the roll phase within the current turn
    (0 at rest, 1 at the tipping point) for the contact shade. */
export function cubePose(p: number, position: THREE.Vector3, quaternion: THREE.Quaternion): number {
  const r1 = smooth(seg(p, ROLL_1));
  const r2 = smooth(seg(p, ROLL_2));
  const total = ((r1 + r2) * Math.PI) / 2;
  const done = r1 >= 1 ? 1 : 0;
  const theta = total - (done * Math.PI) / 2;
  PIVOT.copy(ROAD_DIR).multiplyScalar(done + 0.5).addScaledVector(UP, -0.5);
  ARM.copy(ROAD_DIR).multiplyScalar(-0.5).addScaledVector(UP, 0.5).applyAxisAngle(AXIS, theta);
  position.copy(PIVOT).add(ARM);
  ROLL_Q.setFromAxisAngle(AXIS, total);
  quaternion.multiplyQuaternions(ROLL_Q, BASE_Q);
  return Math.sin(theta * 2);
}

/* ---- the film and the cast, per frame -------------------------------- */

export type FilmState = {
  alpha: number;
  spread: number;
  ink: number;
  mediaScale: number;
  /** the drawn frame's stroke progress */
  draw: number;
  /** the mid-build storefront's height fraction */
  build: number;
};

export function filmState(p: number, c: number, out: FilmState) {
  const reink = smooth(seg(c, R_REINK));
  out.alpha = seg(p, LIGHT_UP) * (1 - smooth(seg(c, R_DIE)));
  out.spread = smooth(seg(p, SPREAD)) * (1 - smooth(seg(c, R_CONTRACT)));
  out.ink = 1 - seg(p, DEVELOP) * (1 - reink);
  out.mediaScale = 1.12 + (1 - 1.12) * seg(p, MEDIA_SCALE) * (1 - reink);
  out.draw = smooth(seg(p, FRAME_DRAW));
  out.build = 0.6 + 0.4 * smooth(seg(p, BUILD));
}
