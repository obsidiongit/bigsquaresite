"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/logo.svg";

/* The footer wordmark (6.8, rebuilt 2026-08-30): the mark at cap
   height followed by BIGSQUARE in Lenia Mono 700, sized together to
   the full container width. It is the footer's first row and its one
   big move; nothing else in the footer is allowed to be loud. The
   glyphs rise into view on the row's own scroll entry (scrubbed, left
   letters leading) and each letter floods --sec-acc bottom-up on hover
   (the 6.1 directional fill applied to a glyph via a clip-path twin).
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
    <motion.span style={{ y }} className="group/letter relative inline-block">
      <span>{char}</span>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 text-sec-acc",
          "[clip-path:inset(100%_0_0_0)] group-hover/letter:[clip-path:inset(0_0_0_0)]",
          "transition-[clip-path] duration-300 ease-swoop motion-reduce:transition-none",
        )}
      >
        {char}
      </span>
    </motion.span>
  );
}

/* The mark leads the lockup at cap height. It is `em`-sized so the one
   fit pass scales it with the type. */
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
      className="relative mr-[0.08em] mt-[0.06em] inline-block size-[0.72em] self-start"
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
      className={cn("w-full overflow-hidden", className)}
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
    </div>
  );
}
