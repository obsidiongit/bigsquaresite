"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/logo.svg";

/* The footer wordmark (6.8, rebuilt 2026-08-30, hover reworked
   2026-08-30 round 2): the mark, sized a notch LARGER than the type
   (Brad: the logo must outweigh the letters beside it), followed by
   BIGSQUARE in Lenia Mono 700, sized together to the full container
   width. It is the footer's first row and its one big move; nothing
   else in the footer is allowed to be loud. The glyphs rise into view
   on the row's own scroll entry (scrubbed, left letters leading).
   Hover: the 7.6 pixel trail, letters-only. The bottom-up flood is
   cut; instead a cell grid rides the row under mix-blend-multiply, so
   a lit --acc cell multiplies to ~nothing against --darkpanel and
   flares brand blue only where a near-white glyph sits beneath it:
   the trail runs INSIDE the letters as the cursor crosses them.
   aria-hidden: the brand name lives as real text in the legal line.

   Sizing: the row renders at a vw estimate and corrects with one
   measure-and-scale pass (again once fonts finish loading), re-running
   on viewport WIDTH change only. Lenia is monospaced, so the estimate
   is close and the correction is a nudge. The wrapper clips the rise
   at its own bottom edge (no fixed crop; the row keeps its natural
   height so the descender room is never cut). */

const WORD = "BIGSQUARE".split("");
/* rise choreography inside the row's entry progress (scrubbed, so
   linear: the scroll is the easing) */
const RISE_STAGGER = 0.03;
const RISE_SPAN = 0.55;
/* SSR estimate before the fit pass corrects it: nine mono glyphs
   (~0.6em each) plus the mark */
const ESTIMATE = "15.5vw";

/* every glyph in the lockup rides the same rise, the mark included, so
   it reads as one object arriving rather than art plus type */
function useRise(
  progress: MotionValue<number>,
  index: number,
  reduced: boolean,
) {
  /* callback form with explicit clamps (framer-motion 13.1.1 rule) */
  return useTransform(progress, (v) => {
    if (reduced) return "0%";
    const start = index * RISE_STAGGER;
    const t = Math.min(1, Math.max(0, (v - start) / RISE_SPAN));
    return `${(1 - t) * 100}%`;
  });
}

function Letter({
  char,
  index,
  progress,
  reduced,
}: {
  char: string;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const y = useRise(progress, index, reduced);

  return (
    <motion.span style={{ y }} className="relative inline-block">
      {char}
    </motion.span>
  );
}

/* The pixel trail, letters-only (7.6, footer-scoped again after the
   2026-08-30 cut: whole-footer paint read as chaos). Mechanics are the
   old FooterPixelGrid's: one pointermove listener on the row, JS flips
   the cell under the pointer to opacity 1, CSS fades it back over
   ~700ms. The layer sits OVER the glyphs with mix-blend-multiply, so
   the cells are invisible on the dark ground and only show through the
   letters. Desktop fine pointers >= 1024px, idle-built, never under
   reduced motion. Zero canvas. */
const TARGET_CELL = 34;

type TrailGrid = { cell: number; cols: number; rows: number };

function LetterTrail({
  hostRef,
}: {
  hostRef: React.RefObject<HTMLDivElement | null>;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<TrailGrid | null>(null);

  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.innerWidth < 1024 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let disposed = false;
    const build = () => {
      const layer = layerRef.current;
      if (!layer || disposed) return;
      const width = layer.clientWidth;
      const height = layer.clientHeight;
      if (width <= 0 || height <= 0) return;
      const cols = Math.max(1, Math.round(width / TARGET_CELL));
      const cell = width / cols;
      setGrid({ cell, cols, rows: Math.ceil(height / cell) });
    };

    const idle: (cb: () => void) => number = window.requestIdleCallback
      ? window.requestIdleCallback.bind(window)
      : (cb) => window.setTimeout(cb, 200);
    idle(build);

    let width = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== width) {
        width = window.innerWidth;
        build();
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!grid) return;
    const layer = layerRef.current;
    const host = hostRef.current;
    if (!layer || !host) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = layer.getBoundingClientRect();
        const col = Math.floor((e.clientX - rect.left) / grid.cell);
        const row = Math.floor((e.clientY - rect.top) / grid.cell);
        if (col < 0 || col >= grid.cols || row < 0 || row >= grid.rows) return;
        const cell = layer.children[row * grid.cols + col] as
          | HTMLElement
          | undefined;
        if (!cell) return;
        cell.style.transition = "none";
        cell.style.opacity = "1";
        requestAnimationFrame(() => {
          cell.style.transition = "opacity 700ms ease-out";
          cell.style.opacity = "0";
        });
      });
    };

    host.addEventListener("pointermove", onMove);
    return () => {
      host.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [grid, hostRef]);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-multiply"
    >
      {grid &&
        Array.from({ length: grid.rows * grid.cols }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (i % grid.cols) * grid.cell,
              top: Math.floor(i / grid.cols) * grid.cell,
              width: grid.cell,
              height: grid.cell,
              background: "var(--acc)",
              opacity: 0,
            }}
          />
        ))}
    </div>
  );
}

/* The mark leads the lockup a notch taller than the caps (0.86em vs
   ~0.72em cap height), top-shifted so the extra height splits above
   cap line and below baseline. It is `em`-sized so the one fit pass
   scales it with the type. */
function Mark({
  progress,
  reduced,
}: {
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const y = useRise(progress, 0, reduced);

  return (
    <motion.span
      style={{ y }}
      /* margin, not translate-y: framer writes transform inline and
         would silently drop a Tailwind translate class */
      className="relative mr-[0.08em] mt-[-0.01em] inline-block size-[0.86em] self-start"
    >
      <Image src={logoMark} alt="" fill className="object-contain" sizes="30vw" />
    </motion.span>
  );
}

export function FooterWordmark({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const [fontSize, setFontSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    let width = 0;
    const fit = () => {
      const wrap = wrapRef.current;
      const row = rowRef.current;
      if (!wrap || !row) return;
      width = wrap.clientWidth;
      const current = parseFloat(getComputedStyle(row).fontSize);
      const measured = row.scrollWidth;
      if (!measured || !current || !width) return;
      setFontSize((current * (width * 0.995)) / measured);
    };
    fit();
    document.fonts?.ready.then(fit).catch(() => {});
    const onResize = () => {
      if (wrapRef.current && wrapRef.current.clientWidth !== width) fit();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* the rise maps over the row's own entry: from its top crossing the
     viewport bottom to its bottom reaching the lower third */
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end 70%"],
  });

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={cn("relative w-full overflow-hidden", className)}
    >
      <div
        ref={rowRef}
        className="flex w-max items-start whitespace-nowrap font-display leading-[0.92] tracking-[-0.03em] text-sec-ink"
        style={{ fontSize: fontSize ?? ESTIMATE }}
      >
        <Mark progress={scrollYProgress} reduced={reduced} />
        {WORD.map((char, i) => (
          <Letter
            key={i}
            char={char}
            index={i + 1}
            progress={scrollYProgress}
            reduced={reduced}
          />
        ))}
      </div>
      <LetterTrail hostRef={wrapRef} />
    </div>
  );
}
