"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/* HomeCanvas (2.hero.md v6): the glass square becomes the film, then
   becomes the square again and keeps the visitor company down the page.

   One page-level FIXED WebGL canvas (lusion's architecture, the v6
   direction queued in tasks.md). It sits at z-5: above the section
   grounds and rails, below every section's z-10 content layer, so the
   cube always moves BEHIND the page's ink. Two acts:

   ACT 1, THE HERO (the first K = 6/7 of the hero wrapper; the v5.1
   choreography unchanged): glass cube floats above the copy, swoops
   behind the exiting headline, flattens into the media card, the film
   develops over it and balloons into the framed panel, holds.

   ACT 2, THE REFORM (the last 1/7 of the wrapper, still pinned): the
   film re-inks and shrinks back into the card footprint, quenches
   under re-frosting glass, and the slab thickens back into the cube;
   the smoke core re-ignites. In the same beat the material crossfades
   from transmission glass (which needs the in-canvas paper backdrop)
   to true alpha glass, and the backdrop retires: from here the REAL
   PAGE shows through the cube via canvas compositing.

   THE COMPANION: past the hero the cube is driven by a waypoint
   journey keyed to the page sections (data-cube-anchor hooks read per
   frame). Through the featured work grid it plays the WORK PANEL
   MORPH (lib/work-panel, 2b v3): it flattens into a brand-blue slab
   that the section's DOM panel grows out of, hides behind it for the
   grid's whole passage, and reforms off the panel's far edge; from
   there the open-region journey runs the problem strip, the solution
   CARD SWEEP (the section pins over a runway, SolutionStage, and the
   scrub sweeps the cube flat right-to-left under the frozen cards,
   each title drawing its blue squiggly underline as the cube passes:
   lib/solution-sweep syncs canvas, ink, and stage),
   then a HIDDEN PASSAGE behind the search + proof-band grounds (those
   two sections paint at z-[6], above this canvas) until the trust
   marquee releases it, and on to the dissolve over the services exit.
   Extend WAYPOINTS when later sections (portal) want the object
   back. Everything is a pure function of native scroll
   smoothed by damped followers: no hijack, no Lenis.

   Rendering contract (STYLE_GUIDE 7.9) and the three hard-won rules
   (r3f uniforms-clone trap, transmission-buffer exclusions, raw-sRGB
   NoColorSpace pipeline) carry over from the v5 build unchanged. */

type Props = {
  poster: string;
  video: string | null;
  /** page stage intersecting: drives the frameloop */
  active: boolean;
};

import { HERO_K } from "@/components/sections/home/media";
import {
  MORPH_REST,
  PANEL_BAR_VH,
  PANEL_HANDOFF,
  SLAB_VH,
  workMorph,
} from "@/lib/work-panel";
import {
  SWEEP_ENTER,
  SWEEP_EXIT,
  SWEEP_UNDER,
  sweepPin,
} from "@/lib/solution-sweep";
import {
  DOCK_ENGAGE,
  DOCK_FIT,
  DOCK_RELEASE,
  FLICK_DECAY,
  dockFlick,
} from "@/lib/services-dock";

/* ---- timeline ------------------------------------------------------ */
/* Act 1 beats are authored in 0..1 of the OLD wrapper and remapped by
   HERO_K: the wrapper grew from 320/480vh to 374/560vh so the reform
   gets the last 1/7 without retiming the approved v5.1 choreography. */

const SWOOP: [number, number] = [0.08, 0.46];
const FLATTEN: [number, number] = [0.38, 0.48];
const CUBE_FADE: [number, number] = [0.52, 0.6];
const GATE: [number, number] = [0.5, 0.58];
const PANE_SETTLE: [number, number] = [0.62, 0.68];
const DEVELOP: [number, number] = [0.5, 0.7];
const BALLOON: [number, number] = [0.62, 0.92];
const MEDIA_SCALE: [number, number] = [0.62, 0.94];

/* Act 2 sub-beats, in 0..1 of the reform segment (hero progress K..1) */
const R_SHRINK: [number, number] = [0.02, 0.5]; /* panel -> card, re-ink */
const R_SOLID: [number, number] = [0.4, 0.58]; /* glass re-materializes */
const R_PANE_FADE: [number, number] = [0.52, 0.7]; /* film quenches under it */
const R_UNFLATTEN: [number, number] = [0.58, 0.88]; /* slab -> cube, smoke back */
const R_GLASS_MIX: [number, number] = [0.84, 0.97]; /* transmission -> alpha
   glass; driven by RAW scroll so the backdrop retires exactly when
   transmission is gone, before the page can scroll under the canvas */

const CARD_CENTER: [number, number] = [-0.24, -0.17];
const CARD_W = 0.34;
const CARD_CENTER_MOBILE: [number, number] = [-0.06, -0.16];
const CARD_W_MOBILE = 0.62;
/* settled panel margin: fraction of viewport width with a px floor so
   the panel always clears the 72px nav bar (Brad round 4: at 4vw the
   panel top ran under the bar) */
const PANEL_MARGIN = 0.06;
const PANEL_MARGIN_PX_MIN = 96;

/* Where the reform quenches the film and re-forms the cube:
   right-of-center, near where the film card naturally sits (round 8:
   shrinking the card high-right instead read as "this awkward,
   shrunken-down media player box on the right" on scroll-up). Round 9
   (Brad: the PARKED cube sat "down too low and too far to the
   right"): the cube no longer waits at this landing. Once it is a
   cube again it ASCENDS to the float spot (R_ASCEND -> WORK_FLOAT,
   the measured midpoint of the headline/support gap) inside the
   reform's last beat, so the release REST already shows it raised
   between "Featured work" and the support text. The film card still
   develops/quenches at this low landing, so the scroll-up story is
   unchanged. The heroEnd waypoint mirrors the ASCENT END exactly, so
   the companion takeover stays motionless. Desktop only: mobile's
   journey exits over the section top from the landing itself. */
const REFORM_END: [number, number] = [0.2, 0.02];
const REFORM_END_MOBILE: [number, number] = [0.2, 0.16];
const REFORM_SETTLE_SCALE = 0.82;
const REFORM_SETTLE_SCALE_MOBILE = 0.7;
const R_SETTLE: [number, number] = [0.58, 0.95]; /* cube eases to settle scale */
const R_ASCEND: [number, number] = [0.86, 0.98]; /* landing -> WORK_FLOAT */

const seg = (v: number, [a, b]: [number, number]) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

/* Brand tokens in raw sRGB for the raw-shader pipeline */
const INK_DEEP = new THREE.Color().setHex(0x0a2a73, THREE.NoColorSpace);
const INK_LIGHT = new THREE.Color().setHex(0x6e9bff, THREE.NoColorSpace);
const INK_ACC = new THREE.Color().setHex(0x0657f9, THREE.NoColorSpace);

/* Alpha-glass tint for the companion (managed-material pipeline, so a
   normal sRGB constructor is right here): without transmission the
   cube's ground is its own base color, and pure white reads as milky
   plastic over the paper. A faint blue in the brand family keeps it
   reading as glass. */
const GLASS_TINT = new THREE.Color("#D7E3FF");
const WHITE = new THREE.Color("#FFFFFF");
/* the work panel's ground (--acc), managed pipeline like GLASS_TINT:
   the flattened cube floods to this so the DOM panel crossfade is
   color-invisible */
const WORK_BLUE = new THREE.Color("#0657F9");
const BLACK = new THREE.Color("#000000");

/* ---- the work panel morph ------------------------------------------- */
/* Sub-beats of the shared morph clock (lib/work-panel, 0 free cube ->
   1 settled panel). CANVAS-LED only to the flooded SQUARE since round
   10: the cube dives to the bar's center, unwinds face-on, flattens,
   floods to the flat panel blue (emissive: a lit PBR blue can never
   match the CSS hex) while the dive eases its scale to exactly
   SLAB_VH; at PANEL_HANDOFF the DOM opacity-swaps its identical
   clip-path square over the slab and plays the stretch + waterfall
   itself. The canvas never stretches anymore: RoundedBoxGeometry's
   bevel scales with the mesh, and the wide bar turned its ends into
   pill curves (Brad round 10: "morphs into a pill shape"). The whole
   ladder runs backwards off the grid's far edge. */
/* Round 11 choreography (Brad): the pin engages AT the release
   composition (FeaturedWork sticky top 30svh, zero dead travel), and
   the clock is the section's PIN RUNWAY (~240svh, FeaturedWork
   spacer), scrubbed 1:1 like the hero film. The cube arrives at the
   pin ALREADY at the float spot (the reform's R_ASCEND delivers it)
   and HOLDS STILL while the headline + support exit up and out
   (TEXT_EXIT, DOM-side); then it TRAVELS to center stage above cards
   01/02 and turntables WORK_TURNS slow full rotations; then the
   committed morph starts at the dive (== MORPH_REST, where the main
   checkpoint band begins): everything before it parks freely, dive
   on completes. */
const WORK_FLOAT: [number, number] = [0.14, 0.24];
/* center stage: x centered over the grid, high enough to clear the
   card row in the release-frozen composition */
const WORK_CENTER: [number, number] = [0, 0.18];
const WORK_HOLD: [number, number] = [0.02, 0.1];
const WORK_TRAVEL: [number, number] = [0.1, 0.22]; /* float -> center */
const WORK_SPIN: [number, number] = [0.18, 0.56]; /* the turntable */
const WORK_TURNS = 4; /* full rotations across WORK_SPIN */
const WORK_DIVE: [number, number] = [MORPH_REST, 0.66];
const WORK_FLATTEN: [number, number] = [0.62, 0.72];
const WORK_FLOOD: [number, number] = [0.63, 0.72];
const WORK_VANISH: [number, number] = [PANEL_HANDOFF + 0.01, PANEL_HANDOFF + 0.06];
/* damping ramps toward exact tracking approaching the handoff, so the
   slab and the DOM square cannot be offset by follower lag at the swap */
const WORK_LOCK: [number, number] = [0.62, PANEL_HANDOFF];

/* ---- the companion journey ------------------------------------------ */
/* Waypoints in viewport fractions from center (y up), keyed to the
   passage of an anchor section through the viewport (frac 0 = its top
   enters the bottom edge, 1 = its bottom leaves the top edge). scale
   is relative to the hero cube's rest scale; spin accumulates on top
   of the idle turn; ease "steps4" quantizes the spin into four
   quarter-turn ticks (currently untagged: the numbered problem rows it
   was keyed to are retired; the ease stays for Brad's 2K retune). */

type AnchorName =
  | "heroEnd"
  | "work"
  | "problem"
  | "solution"
  | "solutionCards"
  | "search"
  | "services"
  | "proof"
  | "trust";

type Waypoint = {
  anchor: AnchorName;
  frac: number;
  x: number;
  y: number;
  scale: number;
  spin: number;
  fade: number;
  ease?: "smooth" | "steps4";
};

const WAYPOINTS: Waypoint[] = [
  /* heroEnd mirrors the reform's ASCENT END (WORK_FLOAT) at settle
     scale (round 9): the reform quenches the film low at REFORM_END,
     re-forms the cube and climbs it to the float spot, so companion
     takeover is motionless AND the release rest shows the cube raised
     between the headline and the support text */
  { anchor: "heroEnd", frac: 0, x: WORK_FLOAT[0], y: WORK_FLOAT[1], scale: REFORM_SETTLE_SCALE, spin: 0.08, fade: 1 },
  /* featured work (2b.featured-work.md v7): the WORK PANEL MORPH
     (stage.panel, lib/work-panel) owns the section's pin runway: the
     cube holds the float spot beside the headline, spins, dives,
     flattens, floods brand blue, stretches into the bar and is
     swallowed by the DOM panel; it reforms off the panel's bottom
     edge and resumes here. These waypoints only steer the free cube
     outside the pin (they freeze with the pinned anchor during it,
     which is fine: the pin blends override them). */
  /* the pre-pin hold: the cube is already AT the float spot from the
     reform's ascent; this waypoint keeps it there over the short
     travel between the release and the pin start (easing down to the
     float scale) so nothing drifts before the pin's own hold blend
     takes over. frac 0.16 sits just short of the pin start at
     1536x864. */
  { anchor: "work", frac: 0.16, x: WORK_FLOAT[0], y: WORK_FLOAT[1], scale: 0.6, spin: 0.35, fade: 1 },
  { anchor: "work", frac: 0.5, x: 0, y: 0, scale: 0.55, spin: 0.5, fade: 1 },
  { anchor: "work", frac: 0.92, x: 0, y: -0.08, scale: 0.52, spin: 0.8, fade: 1 },
  /* The open region (region pivot 2026-08-24; card sweep session same
     day): document order problem, solution, search, proof, trust,
     services. The list MUST stay in document order: the segment walk
     below assumes monotonic waypoint ys. Brad retunes the journey
     himself in 2K. The problem panel is a filled surf strip, so the
     cube passes BEHIND it on the right (accepted). The Tracker
     filters missing anchors, so listing unbuilt sections is safe. */
  { anchor: "problem", frac: 0.35, x: 0.3, y: 0.04, scale: 0.55, spin: 1.0, fade: 1 },
  { anchor: "problem", frac: 0.85, x: 0.26, y: -0.02, scale: 0.5, spin: 1.35, fade: 1 },
  /* the solution CARD SWEEP (5.solution.md v3.2, Brad's card sweep
     session round 4: PINNED). The waypoints only stage the approach
     and the aftermath: the cube dives below the frame on the right
     as the section arrives, and parks below frame on the left after
     the pin releases. The sweep itself (rise from below right, flat
     pass under the three frozen cards, dive out at the left) is the
     PIN OVERRIDE: SolutionStage pins the section over a 130svh
     runway, and the Tracker scrubs the cube along a px path built
     from the frozen grid's column centers (lib/solution-sweep).
     During the pin, these anchors' rects freeze, so the waypoint
     walk holds a below-frame blend the override owns; both handoffs
     happen off-screen. */
  { anchor: "solution", frac: 0.3, x: 0.42, y: 0, scale: 0.48, spin: 1.8, fade: 1 },
  { anchor: "solutionCards", frac: 0.12, x: 0.44, y: -0.55, scale: 0.42, spin: 2.1, fade: 1 },
  { anchor: "solutionCards", frac: 0.35, x: 0.36, y: -0.52, scale: 0.4, spin: 2.3, fade: 1 },
  /* post-release park, below frame left: search and the proof band
     paint their grounds at z-[6], ABOVE this canvas (the two
     full-viewport occluders), so the cube stays out of sight from
     here until the proof band's bottom edge releases it over the
     trust marquee. The proof waypoint only steers the hidden drift
     so the reveal happens on the right. */
  { anchor: "solutionCards", frac: 0.85, x: -0.34, y: -0.55, scale: 0.4, spin: 3.1, fade: 1 },
  { anchor: "proof", frac: 0.6, x: 0.3, y: -0.12, scale: 0.44, spin: 3.5, fade: 1 },
  { anchor: "trust", frac: 0.5, x: 0.3, y: 0.06, scale: 0.44, spin: 3.7, fade: 1 },
  /* the spotlight DOCK (6.services.md v4): the journey's destination.
     The cube holds the right lane out of the trust strip; over
     DOCK_ENGAGE the Tracker's dock blend (lib/services-dock) takes
     x/y/scale into the panel's bay ([data-services-dock], measured
     per frame, so the sticky panel and any width both land exactly).
     These waypoints only shape the approach, the under-blend drift,
     and the exit: past DOCK_RELEASE the blend hands back here and
     the cube rises, shrinks, and dissolves over the section's exit.
     (frac 0.22, not lower: the walk needs this y AFTER trust 0.5 at
     short-viewport dims.) */
  { anchor: "services", frac: 0.22, x: 0.3, y: 0.02, scale: 0.46, spin: 4.0, fade: 1 },
  { anchor: "services", frac: 0.55, x: 0.28, y: 0, scale: 0.44, spin: 4.5, fade: 1 },
  { anchor: "services", frac: 0.9, x: 0.28, y: 0.04, scale: 0.4, spin: 5.0, fade: 1 },
  { anchor: "services", frac: 0.99, x: 0.28, y: 0.26, scale: 0.14, spin: 5.8, fade: 0 },
];

/* Mobile: no whitespace to live in; one graceful exit over the top of
   the featured work section instead of the full journey. */
const WAYPOINTS_MOBILE: Waypoint[] = [
  /* mirrors REFORM_END_MOBILE + settle scale, same as desktop */
  { anchor: "heroEnd", frac: 0, x: REFORM_END_MOBILE[0], y: REFORM_END_MOBILE[1], scale: REFORM_SETTLE_SCALE_MOBILE, spin: 0.08, fade: 1 },
  { anchor: "work", frac: 0.05, x: 0.28, y: 0.06, scale: 0.5, spin: 0.9, fade: 1 },
  { anchor: "work", frac: 0.16, x: 0.34, y: 0.22, scale: 0.34, spin: 1.8, fade: 0 },
];

/* quantized quarter-turn easing for the row ticks */
const steps4 = (t: number) => {
  const q = Math.min(3.999, Math.max(0, t) * 4);
  const i = Math.floor(q);
  const f = q - i;
  const snap = f < 0.3 ? 0 : f > 0.7 ? 1 : smooth((f - 0.3) / 0.4);
  return Math.min(1, (i + snap) / 4);
};

/* ---- shared per-frame stage state ----------------------------------- */

type StageState = {
  raw: number; /* raw hero wrapper progress 0..1 */
  sp: number; /* damped follower of raw */
  companion: boolean; /* past the hero: waypoint control */
  wp: { x: number; y: number; scale: number; spin: number; fade: number };
  /* work panel morph: shared clock + the bar's center and dims (px) */
  panel: { m: number; exiting: boolean; ax: number; ay: number; wPx: number; barPx: number };
  /* the services cube dock (lib/services-dock): blend + bay center/px */
  dock: { b: number; ax: number; ay: number; hPx: number };
  /* the solution card sweep pin (lib/solution-sweep): runway progress
     + the cube's px target along the under-card path */
  sweep: { on: boolean; p: number; ax: number; ay: number };
  els: Partial<
    Record<
      | AnchorName
      | "hero"
      | "workPanel"
      | "workStage"
      | "workPin"
      | "solutionStage"
      | "solutionPin"
      | "servicesDock",
      HTMLElement | null
    >
  >;
};

const createStage = (): StageState => ({
  raw: 0,
  sp: 0,
  companion: false,
  wp: { x: CARD_CENTER[0], y: CARD_CENTER[1], scale: 1, spin: 0, fade: 1 },
  panel: { m: 0, exiting: false, ax: 0, ay: 0, wPx: 1, barPx: 1 },
  dock: { b: 0, ax: 0, ay: 0, hPx: 1 },
  sweep: { on: false, p: 0, ax: 0, ay: 0 },
  els: {},
});

const ANCHOR_NAMES: AnchorName[] = [
  "work",
  "problem",
  "solution",
  "solutionCards",
  "search",
  "services",
  "proof",
  "trust",
];

/* Reads the DOM once per frame (reads only, during rAF: no thrash),
   updates raw/damped hero progress and the companion waypoint target.
   Mounted first in the scene so it runs before the actors. */
function Tracker({ stage }: { stage: StageState }) {
  useFrame((state, delta) => {
    if (typeof document === "undefined") return;
    const els = stage.els;
    if (!els.hero) els.hero = document.querySelector<HTMLElement>('[data-cube-anchor="hero"]');
    for (const name of ANCHOR_NAMES) {
      if (!els[name]) els[name] = document.querySelector<HTMLElement>(`[data-cube-anchor="${name}"]`);
    }
    const hero = els.hero;
    if (!hero) return;

    const vh = window.innerHeight;
    const scrollY = window.scrollY;
    const hr = hero.getBoundingClientRect();
    const denom = hr.height - vh;
    stage.raw = denom > 0 ? Math.min(1, Math.max(0, -hr.top / denom)) : 0;

    /* damped follower (v5 contract, 4.5/s); once the page has scrolled
       past the hero the follower converges fast so a flicked scroll
       never replays the film sequence over the sections */
    const rate = stage.raw >= 1 ? 12 : 4.5;
    const k = 1 - Math.exp(-rate * Math.min(delta, 0.1));
    stage.sp += (stage.raw - stage.sp) * k;
    if (Math.abs(stage.raw - stage.sp) < 0.0005) stage.sp = stage.raw;

    stage.companion = stage.raw >= 0.9995;
    if (!stage.companion) return;

    /* work panel morph clock (lib/work-panel, round 8: pin-runway
       driven): the DOM side measures the same elements with the same
       math each frame */
    if (!els.workPanel)
      els.workPanel = document.querySelector<HTMLElement>("[data-work-panel]");
    if (!els.workStage)
      els.workStage = document.querySelector<HTMLElement>("[data-work-stage]");
    if (!els.workPin)
      els.workPin = document.querySelector<HTMLElement>("[data-work-pin]");
    if (els.workPanel && els.workStage && els.workPin) {
      const r = els.workPanel.getBoundingClientRect();
      const ph = workMorph(
        els.workStage.getBoundingClientRect(),
        els.workPin.getBoundingClientRect(),
        r.bottom,
        vh,
      );
      const barPx = PANEL_BAR_VH * vh;
      stage.panel.m = ph.morph;
      stage.panel.exiting = ph.exiting;
      stage.panel.ax = r.left + r.width / 2;
      stage.panel.ay = ph.exiting ? r.bottom - barPx / 2 : r.top + barPx / 2;
      stage.panel.wPx = r.width;
      stage.panel.barPx = barPx;
    } else {
      stage.panel.m = 0;
    }

    const mobile = state.size.width < 768;

    /* the solution card sweep pin (lib/solution-sweep): while the
       runway scrubs, the cube's target is computed in PX off the
       FROZEN card grid's live rect (column centers + a lane below
       the row), so the under-card alignment is exact at any width.
       The path starts and ends BELOW THE FRAME, so the blend
       handoffs to the waypoint journey on both sides happen
       off-screen and can never show a seam. */
    if (!els.solutionStage)
      els.solutionStage = document.querySelector<HTMLElement>("[data-solution-stage]");
    if (!els.solutionPin)
      els.solutionPin = document.querySelector<HTMLElement>("[data-solution-pin]");
    stage.sweep.on = false;
    if (!mobile && els.solutionStage && els.solutionPin && els.solutionCards) {
      const pin = sweepPin(
        els.solutionStage.getBoundingClientRect(),
        els.solutionPin.getBoundingClientRect(),
      );
      const p = pin.p;
      stage.sweep.p = p;
      if (pin.room > 1 && p > 0 && p < 1) {
        const gr = els.solutionCards.getBoundingClientRect();
        const colX = (i: number) => gr.left + gr.width * ((i + 0.5) / 3);
        const laneY = Math.min(gr.bottom + 0.11 * vh, vh * 0.92);
        const xEnter = gr.right - gr.width * 0.03;
        const xExit = gr.left + gr.width * 0.02;
        const yOff = vh * 1.12; /* parked below the frame */
        let ax: number;
        let ay = laneY;
        if (p < SWEEP_ENTER[1]) {
          ax = xEnter;
          ay = lerp(smooth(seg(p, SWEEP_ENTER)), yOff, laneY);
        } else if (p < SWEEP_UNDER[0]) {
          ax = lerp(smooth(seg(p, [SWEEP_ENTER[1], SWEEP_UNDER[0]])), xEnter, colX(2));
        } else if (p < SWEEP_UNDER[1]) {
          ax = lerp(seg(p, [SWEEP_UNDER[0], SWEEP_UNDER[1]]), colX(2), colX(1));
        } else if (p < SWEEP_UNDER[2]) {
          ax = lerp(seg(p, [SWEEP_UNDER[1], SWEEP_UNDER[2]]), colX(1), colX(0));
        } else {
          const e = seg(p, SWEEP_EXIT);
          ax = lerp(e, colX(0), xExit);
          ay = lerp(smooth(e), laneY, yOff);
        }
        stage.sweep.on = true;
        stage.sweep.ax = ax;
        stage.sweep.ay = ay;
      }
    }

    /* the services cube dock (lib/services-dock, 6.services.md v4):
       blend the companion into the spotlight panel's bay over the
       section's passage frac. The bay is measured per frame (it rides
       a sticky panel: its rect moves), so the landing is exact at any
       width. Desktop only: mobile renders no bay and the mobile
       journey already ended at featured work. */
    stage.dock.b = 0;
    if (!mobile) {
      if (!els.servicesDock)
        els.servicesDock = document.querySelector<HTMLElement>(
          "[data-services-dock]",
        );
      if (els.services && els.servicesDock) {
        const sr = els.services.getBoundingClientRect();
        const frac = (vh - sr.top) / (vh + sr.height);
        const b =
          smooth(seg(frac, DOCK_ENGAGE)) *
          (1 - smooth(seg(frac, DOCK_RELEASE)));
        if (b > 0.001) {
          const br = els.servicesDock.getBoundingClientRect();
          stage.dock.b = b;
          stage.dock.ax = br.left + br.width / 2;
          stage.dock.ay = br.top + br.height / 2;
          stage.dock.hPx = Math.max(1, br.height);
        }
      }
    }

    /* companion target from the waypoint journey */
    const list = (mobile ? WAYPOINTS_MOBILE : WAYPOINTS).filter(
      (w) => w.anchor === "heroEnd" || els[w.anchor],
    );
    if (list.length === 0) return;

    const yOf = (w: Waypoint) => {
      if (w.anchor === "heroEnd") return hr.top + scrollY + hr.height - vh;
      const r = els[w.anchor]!.getBoundingClientRect();
      return r.top + scrollY - vh + w.frac * (vh + r.height);
    };

    let a = list[0];
    let b = list[0];
    let t = 0;
    if (scrollY <= yOf(list[0])) {
      t = 1;
    } else if (scrollY >= yOf(list[list.length - 1])) {
      a = b = list[list.length - 1];
      t = 1;
    } else {
      for (let i = 0; i < list.length - 1; i++) {
        const y0 = yOf(list[i]);
        const y1 = yOf(list[i + 1]);
        if (scrollY >= y0 && scrollY <= Math.max(y0 + 1, y1)) {
          a = list[i];
          b = list[i + 1];
          t = (scrollY - y0) / Math.max(1, y1 - y0);
          break;
        }
      }
    }
    const ts = smooth(Math.min(1, Math.max(0, t)));
    const tq = b.ease === "steps4" ? steps4(t) : ts;
    stage.wp.x = lerp(ts, a.x, b.x);
    stage.wp.y = lerp(ts, a.y, b.y);
    stage.wp.scale = lerp(ts, a.scale, b.scale);
    stage.wp.spin = lerp(tq, a.spin, b.spin);
    stage.wp.fade = lerp(ts, a.fade, b.fade);
  });
  return null;
}

/* ---- shared film media (poster-first, video cross-fade) ------------ */

type FilmMedia = {
  tex: { current: THREE.Texture | null };
  poster: { current: THREE.Texture | null };
  mix: { current: number };
  ready: { current: boolean };
  dims: { current: { w: number; h: number } };
};

function useFilmMedia(posterSrc: string, videoSrc: string | null, playing: boolean): FilmMedia {
  const media = useMemo<FilmMedia>(
    () => ({
      tex: { current: null },
      poster: { current: null },
      mix: { current: 0 },
      ready: { current: false },
      dims: { current: { w: 16, h: 9 } },
    }),
    [],
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const tex = new THREE.TextureLoader().load(posterSrc, (t) => {
      media.dims.current = { w: t.image.width, h: t.image.height };
    });
    tex.colorSpace = THREE.NoColorSpace;
    media.poster.current = tex;
    if (!media.tex.current) media.tex.current = tex;
    return () => tex.dispose();
  }, [posterSrc, media]);

  /* the film (decisions.md media contract): mounts after hydration,
     cross-fades over the poster once genuinely playing */
  useEffect(() => {
    if (!videoSrc) return;
    const el = document.createElement("video");
    el.src = videoSrc;
    el.muted = true;
    el.loop = true;
    el.playsInline = true;
    el.preload = "auto";
    el.crossOrigin = "anonymous";
    videoRef.current = el;
    let tex: THREE.VideoTexture | null = null;
    const onPlaying = () => {
      if (!tex) {
        tex = new THREE.VideoTexture(el);
        tex.colorSpace = THREE.NoColorSpace;
        media.tex.current = tex;
        media.dims.current = { w: el.videoWidth, h: el.videoHeight };
      }
      media.ready.current = true;
    };
    el.addEventListener("playing", onPlaying);
    el.play().catch(() => {});
    return () => {
      el.removeEventListener("playing", onPlaying);
      el.pause();
      el.removeAttribute("src");
      el.load();
      tex?.dispose();
      videoRef.current = null;
    };
  }, [videoSrc, media]);

  /* decode only while the hero region is near the viewport */
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (playing) el.play().catch(() => {});
    else el.pause();
  }, [playing]);

  return media;
}

/* cover-fit scale for a texture on a surface of the given aspect */
function coverScale(out: THREE.Vector2, texW: number, texH: number, aspect: number) {
  const texA = texW / texH;
  out.set(Math.min(1, aspect / texA), Math.min(1, texA / aspect));
}

function cardRect(w: number, h: number, mobile: boolean) {
  const cw = w * (mobile ? CARD_W_MOBILE : CARD_W);
  const center = mobile ? CARD_CENTER_MOBILE : CARD_CENTER;
  return { cx: center[0] * w, cy: center[1] * h, w: cw, h: (cw * 9) / 16 };
}
function panelRect(w: number, h: number, pxToWorld: number) {
  const m = Math.max(PANEL_MARGIN * w, PANEL_MARGIN_PX_MIN * pxToWorld);
  return { cx: 0, cy: 0, w: w - 2 * m, h: h - 2 * m };
}

/* ---- environment (glass needs something to reflect) ---------------- */

function StudioEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new RoomEnvironment();
    const target = pmrem.fromScene(envScene, 0.04);
    scene.environment = target.texture;
    pmrem.dispose();
    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene]);
  return null;
}

/* Paper backdrop: the transmission pipeline's ground during the hero.
   It retires the moment the glass finishes crossfading to alpha mode
   (raw-scroll gated), before any section can scroll under the fixed
   canvas; from then on the page itself is the ground. */
function PaperBackdrop({ stage }: { stage: StageState }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    m.visible = seg(seg(stage.raw, [HERO_K, 1]), R_GLASS_MIX) < 1;
  });
  return (
    <mesh ref={mesh} position={[0, 0, -6]} scale={[80, 50, 1]}>
      <planeGeometry />
      <meshBasicMaterial color="#F5F6F8" />
    </mesh>
  );
}

/* ---- the glass square (GlassCube) ---------------------------------- */

const SWOOP_PATH: [number, number][] = [
  [0.3, 0.24],
  [0.1, -0.06],
  [-0.12, -0.3],
  [-0.3, -0.26],
  [-0.24, -0.17],
];
const SWOOP_PATH_MOBILE: [number, number][] = [
  [0.24, 0.3],
  [0.12, 0.02],
  [-0.14, -0.28],
  [-0.06, -0.16],
];

function GlassCube({ stage, active }: { stage: StageState; active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const smoke = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const tilt = useRef({ x: 0, y: 0 });
  /* companion follower state (position/rotation/scale eased toward the
     waypoint target; initialized from the group on mode entry) */
  const follow = useRef({ on: false, x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1 });

  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 4, 0.06), []);
  const smokeGeometry = useMemo(() => new THREE.SphereGeometry(1, 48, 32), []);

  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        transmission: 1,
        roughness: 0.09,
        metalness: 0,
        ior: 1.25,
        thickness: 0.6,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        attenuationColor: new THREE.Color("#BFD4FF"),
        attenuationDistance: 1.4,
        envMapIntensity: 1.0,
        transparent: true,
      }),
    [],
  );
  /* the smoke core: opaque hashed-discard wisp (v5.1); survives both
     the transmission buffer AND the alpha-glass companion mode */
  const smokeMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uDensity: { value: 1 },
          uColorA: { value: INK_ACC },
          uColorB: { value: INK_LIGHT },
        },
        vertexShader: /* glsl */ `
          uniform float uTime;
          varying vec3 vPos;
          varying vec3 vNormal;
          varying vec3 vView;

          float hash(vec3 p){ p = fract(p*0.3183099+.1); p*=17.0;
            return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
          float noise(vec3 x){ vec3 i=floor(x); vec3 f=fract(x);
            f=f*f*(3.-2.*f);
            return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
                           mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                       mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                           mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }

          void main() {
            /* slow-breathing amorphous form, never a sphere */
            float n = noise(position * 2.2 + vec3(0.0, uTime * 0.22, uTime * 0.15));
            float m = noise(position * 4.6 - vec3(uTime * 0.12, 0.0, uTime * 0.09));
            vec3 pos = position * (0.72 + 0.55 * n + 0.18 * m);
            vPos = pos;
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            vView = -mv.xyz;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          uniform float uTime;
          uniform float uDensity;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying vec3 vPos;
          varying vec3 vNormal;
          varying vec3 vView;

          float hash(vec3 p){ p = fract(p*0.3183099+.1); p*=17.0;
            return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
          float noise(vec3 x){ vec3 i=floor(x); vec3 f=fract(x);
            f=f*f*(3.-2.*f);
            return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
                           mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                       mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                           mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
          float fbm(vec3 p){ float v=0.0; float a=0.5;
            for(int k=0;k<3;k++){ v+=a*noise(p); p*=2.1; a*=0.5; } return v; }

          void main() {
            float d = fbm(vPos * 2.6 + vec3(0.0, uTime * 0.16, uTime * 0.1));
            float facing = pow(abs(dot(normalize(vNormal), normalize(vView))), 1.2);
            float density = clamp(smoothstep(0.28, 0.72, d) * facing * 1.6 * uDensity, 0.0, 0.85);
            if (hash(vec3(gl_FragCoord.xy, 0.7)) > density) discard;
            gl_FragColor = vec4(mix(uColorA, uColorB, d), 1.0);
          }
        `,
      }),
    [],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      smokeGeometry.dispose();
      glass.dispose();
      smokeMat.dispose();
    },
    [geometry, smokeGeometry, glass, smokeMat],
  );

  const curves = useMemo(
    () => ({
      desktop: new THREE.CatmullRomCurve3(
        SWOOP_PATH.map(([x, y]) => new THREE.Vector3(x, y, 0)),
      ),
      mobile: new THREE.CatmullRomCurve3(
        SWOOP_PATH_MOBILE.map(([x, y]) => new THREE.Vector3(x, y, 0)),
      ),
    }),
    [],
  );

  /* pointer interactivity: the canvas is pointer-events none (the page
     stays fully interactive), so listen on the window and damp */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const { width: w, height: h } = state.viewport;
    const mobile = state.size.width < 768;
    const t = state.clock.elapsedTime;
    const s = Math.min(w, h) * 0.2; /* hero rest scale */
    const sm = smoke.current;

    /* transmission -> alpha-glass crossfade, raw-scroll gated so it
       always completes before the page scrolls under the canvas */
    const mix = smooth(seg(seg(stage.raw, [HERO_K, 1]), R_GLASS_MIX));
    glass.transmission = 1 - mix;

    if (stage.companion) {
      /* ---- Act 3: the companion ---------------------------------- */
      const f = follow.current;
      if (!f.on) {
        f.on = true;
        f.x = g.position.x;
        f.y = g.position.y;
        f.z = g.position.z;
        f.rx = g.rotation.x;
        f.ry = g.rotation.y;
        f.rz = g.rotation.z;
        f.s = g.scale.x / s || 1;
      }
      const fade = stage.wp.fade;
      const pm = stage.panel.m;
      const vanish = seg(pm, WORK_VANISH);

      /* damped pointer tilt, alive again as the object travels */
      tilt.current.x += (pointer.current.y * 0.12 - tilt.current.x) * 0.05;
      tilt.current.y += (pointer.current.x * 0.16 - tilt.current.y) * 0.05;

      let tx = stage.wp.x * w + Math.sin(t * 0.4) * 0.008 * w;
      let ty = stage.wp.y * h + Math.sin(t * 0.55 + 1.1) * 0.01 * h;
      let trx = 0.42 + tilt.current.x + Math.sin(t * 0.26) * 0.04;
      let try_ = 0.6 + stage.wp.spin + t * 0.1 + tilt.current.y;
      let trz = -0.08;

      /* the pin choreography, all scrubbed over the runway:
         HOLD: the cube arrived at the float spot via the reform's
         ascent; this blend pins it there against mid-pin waypoint
         drift while the headline exits overhead (round 11: "without
         this square moving").
         TRAVEL: float spot -> center stage above cards 01/02, where
         the TURNTABLE plays WORK_TURNS slow full rotations under the
         visitor's scroll.
         DIVE: from center stage down to the bar's center, unwinding
         to the nearest HALF turn (a quarter-turn landing shows the
         cube's side, which the z-flatten squashes to a sliver).
         Enter side only, so the exit's reform hands straight back to
         the waypoints instead. */
      if (!stage.panel.exiting) {
        const hold = smooth(seg(pm, WORK_HOLD));
        const travel = smooth(seg(pm, WORK_TRAVEL));
        try_ += smooth(seg(pm, WORK_SPIN)) * WORK_TURNS * Math.PI * 2;
        tx = lerp(hold, tx, lerp(travel, WORK_FLOAT[0], WORK_CENTER[0]) * w);
        ty = lerp(hold, ty, lerp(travel, WORK_FLOAT[1], WORK_CENTER[1]) * h);
      }

      /* the solution card sweep: while the pin runway scrubs, the
         cube rides the px path the Tracker computed off the frozen
         card grid (lib/solution-sweep). The path enters and exits
         BELOW THE FRAME, so this hard override and the waypoint
         journey only ever swap while the cube is off-screen. A slow
         roll accumulates across the pass. */
      if (stage.sweep.on) {
        tx = (stage.sweep.ax / state.size.width - 0.5) * w;
        ty =
          (0.5 - stage.sweep.ay / state.size.height) * h +
          Math.sin(t * 0.55 + 1.1) * 0.008 * h;
        try_ += smooth(stage.sweep.p) * 2.2;
      }

      /* the services dock: the journey's destination (6.services.md
         v4). Soft-blend the target into the bay's center and ease the
         scale to fit it; the idle bob and pointer tilt stay live
         (alive at rest, STYLE_GUIDE 7.4). The flick store integrates
         hover impulses from the service rows into the spin: flick a
         row, the cube spins up and coasts down. */
      dockFlick.v *= Math.exp(-FLICK_DECAY * Math.min(delta, 0.1));
      dockFlick.a += dockFlick.v * Math.min(delta, 0.1);
      try_ += dockFlick.a;
      let wpScale = stage.wp.scale;
      const db = stage.dock.b;
      if (db > 0.001) {
        const bayX = (stage.dock.ax / state.size.width - 0.5) * w;
        const bayY = (0.5 - stage.dock.ay / state.size.height) * h;
        tx = lerp(db, tx, bayX + Math.sin(t * 0.4) * 0.004 * w);
        ty = lerp(db, ty, bayY + Math.sin(t * 0.55 + 1.1) * 0.006 * h);
        const fit = (stage.dock.hPx * DOCK_FIT * (h / state.size.height)) / s;
        wpScale = lerp(db, wpScale, fit);
      }

      const dive = smooth(seg(pm, WORK_DIVE));
      if (dive > 0) {
        const wx = (stage.panel.ax / state.size.width - 0.5) * w;
        const wy = (0.5 - stage.panel.ay / state.size.height) * h;
        const face = Math.round(try_ / Math.PI) * Math.PI;
        tx = lerp(dive, tx, wx);
        ty = lerp(dive, ty, wy);
        trx = lerp(dive, trx, 0);
        try_ = lerp(dive, try_, face);
        trz = lerp(dive, trz, 0);
      }
      /* the dive also eases the scale to the shared SLAB_VH square,
         so the swap geometry is deterministic: the DOM builds the
         identical square from the same constant (round 10) */
      const tScale = lerp(dive, wpScale, (SLAB_VH * h) / s);

      /* damping ramps to near-exact tracking approaching the handoff
         (WORK_LOCK), so the slab cannot lag the DOM square at the swap */
      const lock = smooth(seg(pm, WORK_LOCK));
      const kd = 1 - Math.exp(-(4 + 24 * lock) * Math.min(delta, 0.1));
      f.x += (tx - f.x) * kd;
      f.y += (ty - f.y) * kd;
      f.z += (0 - f.z) * kd;
      f.rx += (trx - f.rx) * kd;
      f.ry += (try_ - f.ry) * kd;
      f.rz += (trz - f.rz) * kd;
      f.s += (tScale - f.s) * kd;

      g.visible = active && fade > 0.002 && vanish < 0.999;
      if (!g.visible) {
        /* swallowed by the DOM panel (or faded): keep the follower
           pinned to the live target so the reform off the panel's far
           edge starts from the right spot, not a stale one */
        f.x = tx;
        f.y = ty;
        f.z = 0;
        f.rx = trx;
        f.ry = try_;
        f.rz = trz;
        f.s = tScale;
        return;
      }

      g.position.set(f.x, f.y, f.z);
      g.rotation.set(f.rx, f.ry, f.rz);
      /* flatten only: the slab stays a SQUARE (uniform bevel, no pill
         ends) and the DOM's clip-path square takes over at the swap */
      const flat = smooth(seg(pm, WORK_FLATTEN));
      const base = s * f.s;
      g.scale.set(base, base, base * (1 - 0.965 * flat));

      /* flood: glass -> the panel's flat brand blue. The blue rides
         the EMISSIVE channel (base color to black, env to zero): a
         lit PBR base color cannot reproduce the CSS hex, and the DOM
         swap must be color-invisible */
      const flood = smooth(seg(pm, WORK_FLOOD));
      glass.transmission = 0;
      glass.opacity = (0.42 + 0.58 * flood) * fade * (1 - vanish);
      glass.thickness = 0;
      glass.roughness = 0.09 + 0.55 * flood;
      glass.clearcoat = 1 - flood;
      glass.envMapIntensity = 0.85 * (1 - flood);
      glass.color.copy(GLASS_TINT).lerp(BLACK, flood);
      glass.emissive.copy(BLACK).lerp(WORK_BLUE, flood);

      if (sm) {
        /* the smoke core stays lit through the whole turntable and
           only quenches into the dive/flatten */
        const smokeFade = fade * (1 - smooth(seg(pm, [0.56, 0.68])));
        sm.visible = smokeFade > 0.01;
        smokeMat.uniforms.uTime.value = t;
        smokeMat.uniforms.uDensity.value = smokeFade;
        sm.position.set(
          Math.sin(t * 0.14) * 0.08,
          Math.sin(t * 0.1 + 1.3) * 0.07,
          Math.cos(t * 0.12) * 0.06,
        );
        sm.rotation.y = t * 0.06;
        sm.scale.setScalar(0.3);
      }
      return;
    }
    follow.current.on = false;

    /* ---- Acts 1 and 2: the hero set piece + the reform ------------ */
    const p = Math.min(1, stage.sp / HERO_K);
    const c = seg(stage.sp, [HERO_K, 1]);
    const reform = smooth(seg(c, R_UNFLATTEN));
    /* the reform-side alpha rides the slab's THICKNESS: while still
       flat the re-materializing glass stays faint and it reaches full
       presence only as it thickens into the cube. Scrolling UP, the
       cube melts toward the film instead of parking as a bright flat
       "white frame" beside it (Brad round 7); scrolling down, the
       quench reads softer but intact. */
    const alpha = Math.max(
      1 - seg(p, CUBE_FADE),
      smooth(seg(c, R_SOLID)) * (0.25 + 0.75 * reform),
    );
    g.visible = alpha > 0.001 && active;
    if (!g.visible) return;

    const flight = smooth(seg(p, SWOOP));
    const rest = 1 - seg(p, [SWOOP[0], SWOOP[0] + 0.1]);
    const flat = smooth(seg(p, FLATTEN)) * (1 - reform);

    const curve = mobile ? curves.mobile : curves.desktop;
    const pos = curve.getPoint(flight);
    const bobX = Math.sin(t * 0.5) * 0.012 * rest;
    const bobY = Math.sin(t * 0.75 + 1.3) * 0.02 * rest;
    /* reform drift: ride the shrinking panel's center toward
       REFORM_END (same clock as the pane's R_SHRINK) so the cube
       materializes inside the card wherever the card is */
    const rc = mobile ? REFORM_END_MOBILE : REFORM_END;
    const drift = smooth(seg(c, R_SHRINK));
    /* the ascent (round 9): once the slab has thickened back into the
       cube, it climbs from the reform landing to the WORK_FLOAT spot
       in the reform's last beat, so the release rest parks it raised
       between the headline and the support text. Desktop only:
       mobile's short exit journey starts from the landing itself. */
    const ascend = mobile ? 0 : smooth(seg(c, R_ASCEND));
    g.position.set(
      lerp(ascend, (pos.x + bobX) * w + (rc[0] - pos.x) * w * drift, WORK_FLOAT[0] * w),
      lerp(ascend, (pos.y + bobY) * h + (rc[1] - pos.y) * h * drift, WORK_FLOAT[1] * h),
      Math.sin(Math.PI * flight) * h * 0.06,
    );

    tilt.current.x += (pointer.current.y * 0.2 * rest - tilt.current.x) * 0.05;
    tilt.current.y += (pointer.current.x * 0.28 * rest - tilt.current.y) * 0.05;
    const calm = 1 - flight;
    g.rotation.set(
      (0.44 + tilt.current.x + Math.sin(t * 0.3) * 0.05 * rest) * calm + Math.sin(Math.PI * flight) * 0.16,
      (0.72 + tilt.current.y + t * 0.05 * rest) * calm + flight * 0.5 * calm,
      -0.1 * calm,
    );

    /* scale: cube at rest; flattens into the card; the reform runs the
       same ramp backwards (flat returns to 0) and eases the cube down
       to its companion settle scale so the heroEnd handoff is still */
    const card = cardRect(w, h, mobile);
    const settleScale = mobile ? REFORM_SETTLE_SCALE_MOBILE : REFORM_SETTLE_SCALE;
    const sEff = s * (1 - (1 - settleScale) * smooth(seg(c, R_SETTLE)));
    g.scale.set(
      sEff + (card.w - sEff) * flat,
      sEff + (card.h - sEff) * flat,
      sEff * (1 - 0.965 * flat),
    );
    glass.thickness = 0.6 * (1 - 0.9 * flat) * (1 - mix);
    glass.envMapIntensity = (1 - 0.8 * flat) * (1 - 0.15 * mix);
    glass.roughness = 0.09 * (1 - 0.7 * flat);
    glass.clearcoat = 1; /* the companion's panel flood lowers these */
    glass.emissive.copy(BLACK);
    glass.opacity = alpha * (1 - 0.58 * mix);
    glass.color.copy(WHITE).lerp(GLASS_TINT, mix);

    if (sm) {
      sm.visible = flat < 0.9;
      smokeMat.uniforms.uTime.value = t;
      smokeMat.uniforms.uDensity.value = 1 - flat;
      sm.position.set(
        Math.sin(t * 0.14) * 0.08,
        Math.sin(t * 0.1 + 1.3) * 0.07,
        Math.cos(t * 0.12) * 0.06,
      );
      sm.rotation.y = t * 0.06;
      sm.scale.setScalar(0.3 * (1 - flat));
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} frustumCulled={false}>
        <primitive object={glass} attach="material" />
      </mesh>
      <group ref={smoke}>
        <mesh geometry={smokeGeometry} frustumCulled={false}>
          <primitive object={smokeMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

/* ---- the film pane: card -> balloon -> framed panel -> reform ------ */

const sheetVertex = /* glsl */ `
  uniform vec4 uStart;   /* cx, cy, w, h (world) */
  uniform vec4 uEnd;
  uniform float uGrow;   /* balloon progress */
  uniform float uLag;
  uniform float uZArc;
  varying vec2 vUv;
  varying float vT;

  const float PI = 3.141592653589793;

  void main() {
    vUv = uv;

    vec2 dir = normalize(vec2(0.72, 0.7));
    float d = dot(uv - 0.5, dir);
    float ev = clamp(uGrow * (1.0 + 1.42 * uLag) - (0.5 - d) * uLag, 0.0, 1.0);
    ev = ev * ev * (3.0 - 2.0 * ev);
    vT = ev;

    vec2 center = mix(uStart.xy, uEnd.xy, ev);
    vec2 size = mix(uStart.zw, uEnd.zw, ev);
    vec3 pos = vec3(center + (uv - 0.5) * size, 0.0);

    pos.z += sin(PI * ev) * uZArc * step(0.0001, uGrow) * (1.0 - step(0.9999, uGrow));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const sheetFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform sampler2D uPoster;
  uniform float uTexMix;
  uniform vec4 uStart;
  uniform vec4 uEnd;
  uniform vec2 uCover;
  uniform float uMediaScale;
  uniform float uRadiusStart; /* world units */
  uniform float uRadiusEnd;
  uniform float uInk;
  uniform float uAlpha;
  uniform vec3 uInkDeep;
  uniform vec3 uInkLight;
  varying vec2 vUv;
  varying float vT;

  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec2 uv = (vUv - 0.5) / uMediaScale * uCover + 0.5;
    vec3 col = mix(texture2D(uPoster, uv).rgb, texture2D(uTex, uv).rgb, uTexMix);

    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 ink = mix(uInkDeep, uInkLight, smoothstep(0.0, 0.62, lum));
    col = mix(col, ink, uInk);

    vec2 size = mix(uStart.zw, uEnd.zw, vT);
    float radius = mix(uRadiusStart, uRadiusEnd, vT);
    vec2 p = (vUv - 0.5) * size;
    float sdf = sdRoundBox(p, 0.5 * size, radius);
    float aa = max(fwidth(sdf), 1e-4) * 1.2;
    float mask = 1.0 - smoothstep(-aa, aa, sdf);

    gl_FragColor = vec4(col, uAlpha * mask);
  }
`;

function FilmPane({ stage, media }: { stage: StageState; media: FilmMedia }) {
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: sheetVertex,
        fragmentShader: sheetFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uStart: { value: new THREE.Vector4(0, 0, 1, 1) },
          uEnd: { value: new THREE.Vector4(0, 0, 1, 1) },
          uGrow: { value: 0 },
          uLag: { value: 0.34 },
          uZArc: { value: 0 },
          uTex: { value: null },
          uPoster: { value: null },
          uTexMix: { value: 0 },
          uCover: { value: new THREE.Vector2(1, 1) },
          uMediaScale: { value: 1.16 },
          uRadiusStart: { value: 0 },
          uRadiusEnd: { value: 0 },
          uInk: { value: 1 },
          uAlpha: { value: 0 },
          uInkDeep: { value: INK_DEEP },
          uInkLight: { value: INK_LIGHT },
        },
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const u = material.uniforms;

    /* poster -> film crossfade, eased in time not scroll */
    const target = media.ready.current ? 1 : 0;
    media.mix.current += (target - media.mix.current) * 0.06;

    /* Act 1 progress + Act 2 (reform) sub-beats */
    const p = Math.min(1, stage.sp / HERO_K);
    const c = seg(stage.sp, [HERO_K, 1]);
    const sh = smooth(seg(c, R_SHRINK)); /* panel back to card */
    const alpha = seg(p, GATE) * (1 - smooth(seg(c, R_PANE_FADE)));
    m.visible = alpha > 0.001 && !stage.companion;
    if (!m.visible) return;

    const { width: w, height: h } = state.viewport;
    const mobile = state.size.width < 768;
    const pxToWorld = h / state.size.height;

    m.position.z = 0.08 * (1 - smooth(seg(p, PANE_SETTLE)));
    m.renderOrder = 10;

    const card = cardRect(w, h, mobile);
    const panel = panelRect(w, h, pxToWorld);
    /* during the reform the shrink target slides from the balloon's
       card (CARD_CENTER) to REFORM_END, so the panel shrinks down to
       the RIGHT, into the cube's companion position */
    const rc = mobile ? REFORM_END_MOBILE : REFORM_END;
    (u.uStart.value as THREE.Vector4).set(
      card.cx + (rc[0] * w - card.cx) * sh,
      card.cy + (rc[1] * h - card.cy) * sh,
      card.w,
      card.h,
    );
    (u.uEnd.value as THREE.Vector4).set(panel.cx, panel.cy, panel.w, panel.h);

    const grow = seg(p, BALLOON) * (1 - sh);
    u.uGrow.value = grow;
    u.uZArc.value = h * 0.16;
    u.uAlpha.value = alpha;
    u.uRadiusStart.value = 24 * pxToWorld;
    u.uRadiusEnd.value = 24 * pxToWorld;
    u.uMediaScale.value = 1.16 + (1 - 1.16) * seg(p, MEDIA_SCALE) * (1 - sh);
    u.uInk.value = 1 - seg(p, DEVELOP) * (1 - sh);

    u.uTex.value = media.tex.current;
    u.uPoster.value = media.poster.current;
    u.uTexMix.value = media.mix.current;

    const midW = card.w + (panel.w - card.w) * smooth(grow);
    const midH = card.h + (panel.h - card.h) * smooth(grow);
    coverScale(u.uCover.value as THREE.Vector2, media.dims.current.w, media.dims.current.h, midW / midH);
  });

  return (
    <mesh ref={mesh} frustumCulled={false}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/* ---- watchdog: step DPR down on sustained slow frames (7.9) -------- */

function PerfGuard() {
  const setDpr = useThree((s) => s.setDpr);
  const dpr = useRef(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
  const slow = useRef(0);

  useFrame((_, delta) => {
    if (delta > 0.034) slow.current += 1;
    else slow.current = Math.max(0, slow.current - 2);
    if (slow.current > 45 && dpr.current > 1) {
      dpr.current = Math.max(1, dpr.current - 0.25);
      slow.current = 0;
      setDpr(dpr.current);
    }
  });
  return null;
}

/* ---- scene + canvas root ------------------------------------------- */

function Scene({ poster, video, active, heroNear }: Props & { heroNear: boolean }) {
  const stage = useMemo(createStage, []);
  const media = useFilmMedia(poster, video, active && heroNear);
  return (
    <>
      <Tracker stage={stage} />
      <PerfGuard />
      <StudioEnvironment />
      <PaperBackdrop stage={stage} />
      <GlassCube stage={stage} active={active} />
      <FilmPane stage={stage} media={media} />
    </>
  );
}

export default function HomeCanvas(props: Props) {
  const [dpr] = useState(() =>
    Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2),
  );

  /* the film only decodes while the hero region is near the viewport */
  const [heroNear, setHeroNear] = useState(true);
  useEffect(() => {
    const el = document.querySelector('[data-cube-anchor="hero"]');
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setHeroNear(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Canvas
      aria-hidden
      flat
      frameloop={props.active ? "always" : "never"}
      dpr={dpr}
      camera={{ fov: 30, position: [0, 0, 14], near: 0.1, far: 60 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      style={{ pointerEvents: "none" }}
    >
      <Scene {...props} heroNear={heroNear} />
    </Canvas>
  );
}
