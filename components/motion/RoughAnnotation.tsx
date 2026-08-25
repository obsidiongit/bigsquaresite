"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs/bin/rough";
import { EASE, IN_VIEW_MARGIN } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* <RoughAnnotation> (STYLE_GUIDE.md 7.3 contract, 6.1, 8; e2vc probe):
   the hand-drawn annotation system. One primitive, four variants:
   bracket (the Bracket CTA), circle (one word in the hero H1), underline
   (key links, nav active state), box (full-perimeter squiggle border,
   the featured work panel).

   Contract:
   - fixed seeds so shapes are stable across redraws
   - draw-on entry via pathLength 0 -> 1 (1.2s, circle 2s, house ease)
   - 3 pre-rendered boil frames cycled by visibility toggle, only while
     on screen, only after the draw completes
   - stroke reads var(--sec-acc) at draw time (live CSS var on the path)
   - static render under reduced motion (drawn, no draw-on, no boil)
   - redraw only on viewport WIDTH change (iOS Safari fires height-only
     resizes while scrolling)
   - the SVG overlay is overflow-visible so strokes can leave the box;
     pair with reveals that release overflow when done (BaselineReveal)

   Budget (STYLE_GUIDE.md 0, 8): at most 1 per viewport, 3 per page. */

type Variant = "bracket" | "circle" | "underline" | "box";

type PathSpec = { d: string; strokeWidth: number };

/* e2vc probe values: seeds 3,5,7,11,13,17; boil frames offset seed +17 */
const SEEDS = [3, 5, 7, 11, 13, 17];
const BOIL_FRAMES = 3;
const BOIL_SEED_STEP = 17;
const BOIL_INTERVAL_MS = 200;
/* SVG bleed so rough strokes can wobble outside the measured box */
const PAD = 14;

function buildFrame(variant: Variant, w: number, h: number, frame: number): PathSpec[] {
  const gen = rough.generator();
  const paths: PathSpec[] = [];
  const seed = (i: number) => SEEDS[i % SEEDS.length] + frame * BOIL_SEED_STEP;
  const push = (drawable: ReturnType<typeof gen.line>, strokeWidth: number) => {
    for (const p of gen.toPaths(drawable)) paths.push({ d: p.d, strokeWidth });
  };

  if (variant === "bracket") {
    /* 6 lines forming [ and ]: top tip, vertical, bottom tip per side
       (e2vc geometry: inset max(6, min*0.04), tip max(14, h*0.12)) */
    const inset = Math.max(6, Math.min(w, h) * 0.04);
    const tip = Math.max(14, h * 0.12);
    const yPad = h * 0.12;
    const tipOpts = (i: number) => ({ seed: seed(i), roughness: 1.6, strokeWidth: 3 });
    const vertOpts = (i: number) => ({ seed: seed(i), roughness: 2.2, strokeWidth: 3 });
    push(gen.line(inset + tip, yPad, inset, yPad, tipOpts(0)), 3);
    push(gen.line(inset, yPad, inset, h - yPad, vertOpts(1)), 3);
    push(gen.line(inset, h - yPad, inset + tip, h - yPad, tipOpts(2)), 3);
    push(gen.line(w - inset - tip, yPad, w - inset, yPad, tipOpts(3)), 3);
    push(gen.line(w - inset, yPad, w - inset, h - yPad, vertOpts(4)), 3);
    push(gen.line(w - inset, h - yPad, w - inset - tip, h - yPad, tipOpts(5)), 3);
  } else if (variant === "box") {
    /* one closed squiggle riding ON the measured edge (inset 0), with
       rounded corners matching the surface's radius. Pair it with a
       stroke in the surface's own fill: the inside half disappears
       into the surface and only the wobble that escapes onto the
       ground shows, so the EDGE reads hand-drawn instead of a
       contrasting line floating inside the box (Brad round 6: the
       white inner border clashed). Long edges are chopped into ~240px
       runs before rough.js sees them: a single rough line only bows
       over its length, and at panel scale that reads as ruled, not
       hand-drawn. */
    const rad = Math.min(32, Math.min(w, h) / 2);
    const pts: [number, number][] = [[rad, 0]];
    const lineTo = (x1: number, y1: number) => {
      const [x0, y0] = pts[pts.length - 1];
      const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 240));
      for (let i = 1; i <= n; i++)
        pts.push([x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n]);
    };
    const arcTo = (cx: number, cy: number, from: number) => {
      for (let k = 1; k <= 3; k++) {
        const a = from + (k / 3) * (Math.PI / 2);
        pts.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)]);
      }
    };
    lineTo(w - rad, 0);
    arcTo(w - rad, rad, -Math.PI / 2);
    lineTo(w, h - rad);
    arcTo(w - rad, h - rad, 0);
    lineTo(rad, h);
    arcTo(rad, h - rad, Math.PI / 2);
    lineTo(0, rad);
    arcTo(rad, rad, Math.PI); /* ends back at [rad, 0]: closed */
    push(
      gen.linearPath(pts, { seed: seed(0), roughness: 2.2, strokeWidth: 4.5 }),
      4.5,
    );
  } else if (variant === "circle") {
    push(
      gen.ellipse(w / 2, h / 2, w * 1.15, h * 1.7, {
        seed: seed(0),
        roughness: 2.8,
        strokeWidth: 3.5,
      }),
      3.5,
    );
  } else {
    push(
      gen.line(2, h + 3, w - 2, h + 3, {
        seed: seed(0),
        roughness: 1.8,
        strokeWidth: 3,
      }),
      3,
    );
  }
  return paths;
}

type Props = {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  /** External draw trigger (e.g. after a headline reveal completes).
      Leave undefined to draw once when the element enters the viewport. */
  active?: boolean;
  delay?: number;
  /** Render pre-drawn: no draw-on, no boil (nav active-link underline,
      1.nav.md). Same output as the reduced-motion branch. */
  staticRender?: boolean;
  /** Stroke override. Defaults to the theme accent read at draw time;
      the box variant passes the annotated surface's own fill so only
      the wobble escaping the edge shows. */
  stroke?: string;
};

export function RoughAnnotation({
  variant = "underline",
  children,
  className,
  active,
  delay = 0,
  staticRender = false,
  stroke = "var(--sec-acc, var(--acc))",
}: Props) {
  const reducedPref = useReducedMotion();
  const reduced = reducedPref || staticRender;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: IN_VIEW_MARGIN });
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [frames, setFrames] = useState<PathSpec[][] | null>(null);
  const [fired, setFired] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [boilFrame, setBoilFrame] = useState(0);

  const shouldDraw = active ?? inView;
  const draw = fired || shouldDraw;

  useEffect(() => {
    if (shouldDraw) setFired(true);
  }, [shouldDraw]);

  // Measure the wrapped content and pre-render the boil frames.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let lastWidth = window.innerWidth;
    const generate = () => {
      /* layout size, not getBoundingClientRect: the box variant lives
         inside the work panel's scale transform, and measuring the
         transformed rect would size the squiggle to the shrunken
         panel (SVG coordinates live in layout space) */
      const w = Math.max(1, Math.round(el.offsetWidth));
      const h = Math.max(1, Math.round(el.offsetHeight));
      setSize({ w, h });
      setFrames(
        Array.from({ length: BOIL_FRAMES }, (_, f) => buildFrame(variant, w, h, f)),
      );
    };
    generate();
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      generate();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [variant]);

  // Gentle boil: cycle frame visibility after the draw, while on screen.
  useEffect(() => {
    if (reduced || !drawn || !inView) return;
    const id = window.setInterval(
      () => setBoilFrame((f) => (f + 1) % BOIL_FRAMES),
      BOIL_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [reduced, drawn, inView]);

  const duration = variant === "circle" || variant === "box" ? 2 : 1.2;
  const visibleFrame = drawn ? boilFrame : 0;

  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      {children}
      {size && frames && (reduced || draw) && (
        <svg
          aria-hidden
          className="pointer-events-none absolute overflow-visible"
          style={{
            left: -PAD,
            top: -PAD,
            width: size.w + PAD * 2,
            height: size.h + PAD * 2,
          }}
          viewBox={`${-PAD} ${-PAD} ${size.w + PAD * 2} ${size.h + PAD * 2}`}
        >
          {frames.map((frame, f) => (
            <g key={f} visibility={visibleFrame === f ? "visible" : "hidden"}>
              {frame.map((p, i) =>
                reduced || f > 0 ? (
                  <path
                    key={i}
                    d={p.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={p.strokeWidth}
                    strokeLinecap="round"
                  />
                ) : (
                  <motion.path
                    key={i}
                    d={p.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={p.strokeWidth}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={draw ? { pathLength: 1 } : undefined}
                    transition={{
                      duration,
                      ease: EASE.house,
                      delay: delay + i * 0.08,
                    }}
                    onAnimationComplete={
                      i === frame.length - 1 ? () => setDrawn(true) : undefined
                    }
                  />
                ),
              )}
            </g>
          ))}
        </svg>
      )}
    </span>
  );
}
