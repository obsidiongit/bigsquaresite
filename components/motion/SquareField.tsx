"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { HERO_K } from "@/components/sections/home/media";

/* SquareField (STYLE_GUIDE 7.4, ambient square field): ten hairline
   ink square outlines drifting behind the page like the brand mark's
   dust, on a fixed page-level layer. Two are off-frame giants that
   float like jellyfish: viewport-scale, barely-there, on long slow
   clocks. Each square slow-spins, breathes in scale, wanders on two
   incommensurate sines per axis, and sits at its own parallax depth,
   so scrolling to another section reshuffles the composition; scroll
   velocity also stirs the spin a touch. Squares recycle vertically
   through an offscreen band, so the field never empties on a long
   page.

   Kept below perception threshold on purpose: hairlines at 2-5% ink
   read on paper and tint grounds and vanish into dark ones. The whole
   field is one rAF loop writing transform strings; anchors are
   SSR-rendered from the deterministic table below (left/top % + rotate
   seed), and every animated term starts at zero, so the first client
   frame reproduces the server markup and nothing pops.

   LAYERING (Brad's 2026-08-24 round 3 call: squares must be visible
   in the hero too). While the hero wrapper is in play the canvas's
   in-canvas paper backdrop (z-5) hides anything below it, so with
   `heroStage` the field rides at z-6: above the canvas, under all ink
   (z-10), visually identical to sitting in the paper because the
   backdrop IS flat paper. At the reform (progress >= HERO_K) it drops
   to z-1, dipping under the backdrop for the reform's morph and
   resurfacing as the backdrop retires, so from the cube's release on,
   the companion passes OVER the squares (object above page texture).
   Without `heroStage` (no canvas: reduced motion, no WebGL, other
   pages) it stays at z-1 over the DOM grounds.

   Reduced motion: no loop, no parallax; the seeds stand as a static
   composition (one write to apply responsive scale only). */

type Spec = {
  x: number; /* anchor, % of viewport width (may be off-frame) */
  y: number; /* anchor, % of viewport height */
  size: number; /* px at scale 1 (desktop) */
  o: number; /* stroke opacity */
  bw?: number; /* border width px (default 1; giants go sub-pixel) */
  r0: number; /* seed rotation, deg */
  rv: number; /* spin, deg/s (sign = direction) */
  pf: number; /* parallax depth: y offset = -scrollY * pf */
  seed: number; /* PRNG seed for drift/breathe character */
};

/* Hand-placed field: edges biased, two off-frame giants (the
   jellyfish: slowest clocks, faintest strokes, lowest parallax so
   they linger across sections). Small far squares run slightly more
   opaque than large near ones so salience stays even. */
const SQUARES: Spec[] = [
  { x: 8, y: 16, size: 220, o: 0.034, r0: 12, rv: 0.3, pf: 0.12, seed: 11 },
  { x: 87, y: 8, size: 120, o: 0.042, r0: -25, rv: -0.45, pf: 0.075, seed: 23 },
  { x: 76, y: 44, size: 270, o: 0.03, r0: 32, rv: 0.2, pf: 0.15, seed: 37 },
  { x: 15, y: 62, size: 92, o: 0.046, r0: 58, rv: -0.55, pf: 0.06, seed: 41 },
  { x: 48, y: 88, size: 175, o: 0.036, r0: 8, rv: 0.38, pf: 0.1, seed: 53 },
  { x: 30, y: 34, size: 64, o: 0.05, r0: -40, rv: 0.62, pf: 0.05, seed: 67 },
  { x: 62, y: 12, size: 88, o: 0.045, r0: 20, rv: -0.42, pf: 0.065, seed: 79 },
  { x: 93, y: 76, size: 140, o: 0.04, r0: 45, rv: 0.48, pf: 0.088, seed: 97 },
  /* the jellyfish */
  { x: -4, y: 38, size: 680, o: 0.026, bw: 0.75, r0: -8, rv: -0.09, pf: 0.045, seed: 83 },
  { x: 104, y: 68, size: 820, o: 0.024, bw: 0.75, r0: 14, rv: 0.07, pf: 0.038, seed: 109 },
];

/* mulberry32: tiny deterministic PRNG so drift character is stable
   across server and client (no Math.random anywhere near render) */
function rng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let z = s;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

const TAU = Math.PI * 2;

/* Derived motion params. Drift amplitude scales with depth AND body
   size (a giant needs a wider sway to read as floating at all); big
   bodies also run on stretched clocks (`slow`) so the jellyfish
   billow instead of bob. Two periods per axis never divide evenly,
   so no path ever visibly loops. */
const MOTION = SQUARES.map((sq) => {
  const r = rng(sq.seed);
  const amp = 12 + sq.pf * 160 + sq.size * 0.045;
  const slow = 1 + sq.size / 900;
  return {
    ax1: amp, px1: (24 + r() * 36) * slow, phx1: r() * TAU,
    ax2: amp * 0.6, px2: (46 + r() * 44) * slow, phx2: r() * TAU,
    ay1: amp * 0.8, py1: (28 + r() * 34) * slow, phy1: r() * TAU,
    ay2: amp * 0.5, py2: (52 + r() * 40) * slow, phy2: r() * TAU,
    bs: 0.035 + r() * 0.03, pb: (18 + r() * 26) * slow, phb: r() * TAU,
    stir: (0.0025 + r() * 0.0045) * Math.sign(sq.rv),
  };
});

/* two-sine wander, baseline-subtracted so drift(0) = 0 */
const wander = (
  t: number,
  a1: number, p1: number, ph1: number,
  a2: number, p2: number, ph2: number,
) =>
  a1 * (Math.sin((t / p1) * TAU + ph1) - Math.sin(ph1)) +
  a2 * (Math.sin((t / p2) * TAU + ph2) - Math.sin(ph2));

const viewScale = () =>
  Math.min(1.12, Math.max(0.62, window.innerWidth / 1440));

export function SquareField({ heroStage = false }: { heroStage?: boolean }) {
  const reduced = useReducedMotionSafe();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.children) as HTMLElement[];
    let vh = window.innerHeight;
    let k = viewScale();

    if (reduced) {
      /* static composition: responsive scale only, nothing moves;
         no canvas mounts here, so the field simply shows at z-1 */
      root.style.opacity = "1";
      const paint = () => {
        k = viewScale();
        els.forEach((el, i) => {
          el.style.transform = `rotate(${SQUARES[i].r0}deg) scale(${k})`;
        });
      };
      paint();
      window.addEventListener("resize", paint, { passive: true });
      return () => window.removeEventListener("resize", paint);
    }

    /* hero-wrapper geometry for the z handoff (measured, not read
       per frame; the wrapper's height only changes with the viewport) */
    let heroTop = 0;
    let heroSpan = 0;
    const measureHero = () => {
      const el = heroStage
        ? document.querySelector('[data-cube-anchor="hero"]')
        : null;
      if (!el) {
        heroSpan = 0;
        return;
      }
      const rect = el.getBoundingClientRect();
      heroTop = rect.top + window.scrollY;
      heroSpan = rect.height - vh;
    };
    measureHero();

    const onResize = () => {
      vh = window.innerHeight;
      k = viewScale();
      measureHero();
    };
    window.addEventListener("resize", onResize, { passive: true });

    let raf = 0;
    let t0 = 0;
    let lastY = window.scrollY;
    let vel = 0; /* smoothed scroll px/frame, stirs the spin */
    let zCur = "";
    const stirAcc = SQUARES.map(() => 0);

    const frame = (now: number) => {
      if (!t0) t0 = now;
      const t = (now - t0) / 1000;
      const y = window.scrollY;
      vel += (y - lastY - vel) * 0.08;
      lastY = y;
      /* parallax eases in over the first ~1.6s so a mid-page reload
         settles instead of popping */
      const ramp = 1 - Math.pow(1 - Math.min(1, t / 1.6), 3);

      /* gentle materialize on mount (the layer SSRs at opacity 0) */
      root.style.opacity = (1 - Math.pow(1 - Math.min(1, t / 0.8), 3)).toFixed(3);

      /* z handoff: above the canvas backdrop through the statement and
         film beats, below the canvas from the reform on (the dip under
         the still-standing backdrop during the early reform is the
         authored disappearance; it resurfaces as the backdrop retires
         and the companion then passes over the field) */
      if (heroSpan > 0) {
        const p = (y - heroTop) / heroSpan;
        const z = p < HERO_K ? "6" : "1";
        if (z !== zCur) {
          zCur = z;
          root.style.zIndex = z;
        }
      }

      for (let i = 0; i < SQUARES.length; i++) {
        const sq = SQUARES[i];
        const m = MOTION[i];
        stirAcc[i] += vel * m.stir;

        const dx = wander(t, m.ax1, m.px1, m.phx1, m.ax2, m.px2, m.phx2);
        const driftY = wander(t, m.ay1, m.py1, m.phy1, m.ay2, m.py2, m.phy2);
        const breathe = m.bs * (Math.sin((t / m.pb) * TAU + m.phb) - Math.sin(m.phb));
        const rot = sq.r0 + sq.rv * t + stirAcc[i];

        /* vertical recycle: wrap the square's center through a band
           padded past its own diagonal, so the jump is always offscreen */
        const anchorY = (sq.y / 100) * vh;
        const pad = sq.size * k * 0.8 + 56;
        const band = vh + 2 * pad;
        const cy = anchorY + driftY - y * sq.pf * ramp;
        const wrapped = ((((cy + pad) % band) + band) % band) - pad;

        els[i].style.transform =
          `translate3d(${dx.toFixed(2)}px, ${(wrapped - anchorY).toFixed(2)}px, 0) ` +
          `rotate(${rot.toFixed(3)}deg) scale(${(k * (1 + breathe)).toFixed(4)})`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced, heroStage]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {SQUARES.map((sq, i) => (
        <div
          key={i}
          className="absolute rounded-[2px] border-solid border-ink will-change-transform"
          style={{
            left: `${sq.x}%`,
            top: `${sq.y}%`,
            width: sq.size,
            height: sq.size,
            marginLeft: -sq.size / 2,
            marginTop: -sq.size / 2,
            borderWidth: sq.bw ?? 1,
            opacity: sq.o,
            transform: `rotate(${sq.r0}deg)`,
          }}
        />
      ))}
    </div>
  );
}
