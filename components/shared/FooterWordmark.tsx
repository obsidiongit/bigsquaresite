"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/logo.svg";

/* The back-cover wordmark (shared/footer.md v3): BIGSQUARE in Bluu at
   viewport scale, cropped by the page's bottom edge (obys). The letters
   rise into the crop on the footer's own scroll progress, left letters
   leading, and each letter floods --sec-acc bottom-up on hover (the 6.1
   directional fill applied to a glyph via a clip-path twin). aria-hidden:
   the brand name lives as real text in the info bar and colophon.

   Sizing: Bluu's metrics make pure vw sizing drift across viewports, so
   the row renders at a vw estimate and corrects with a measure-and-scale
   pass (again once fonts finish loading), re-running on viewport WIDTH
   change only (the RoughAnnotation resize rule). The crop is the
   wrapper: overflow hidden, height a fraction of the glyph size, the
   letters overflowing below its bottom edge, which is the page's last
   pixel. TRIM pulls the row up past the font's internal leading so the
   wrapper's top hugs the caps. */

const WORD = "BIGSQUARE".split("");
/* wrapper height as a fraction of the font size: the crop depth
   (deepened in round 2: the footer must stay compact, Brad) */
const CROP = 0.44;
/* top leading trim, fraction of the font size */
const TRIM = 0.06;
/* rise choreography inside the footer's entry progress (scrubbed, so
   linear: the scroll is the easing) */
const RISE_START = 0.2;
const RISE_STAGGER = 0.034;
const RISE_SPAN = 0.42;
/* SSR estimate before the fit pass corrects it */
const ESTIMATE = "15vw";

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
    const start = RISE_START + index * RISE_STAGGER;
    const t = Math.min(1, Math.max(0, (v - start) / RISE_SPAN));
    return `${(1 - t) * 80}%`;
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

/* The mark leads the lockup at cap height (e2vc set their own glyph
   into the giant wordmark; Brad asked for the large logo). It is
   `em`-sized so the one fit pass scales it with the type, and it sits
   inside the same crop, so it costs the footer no height. */
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
      className="relative mr-[0.07em] mt-[0.05em] inline-block size-[0.7em]"
    >
      <Image src={logoMark} alt="" fill className="object-contain" sizes="30vw" />
    </motion.span>
  );
}

export function FooterWordmark({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotionSafe();
  const [fontSize, setFontSize] = useState<number | null>(null);

  /* the rise maps over the whole footer's entry, not this element's own
     sliver of scroll, so the target is the closest footer landmark */
  useLayoutEffect(() => {
    footerRef.current =
      wrapRef.current?.closest("footer") ?? wrapRef.current ?? null;
  }, []);

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

  const { scrollYProgress } = useScroll({
    target: footerRef as React.RefObject<HTMLElement>,
    offset: ["start end", "end end"],
  });

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={cn("w-full overflow-hidden", className)}
      style={{
        height: fontSize
          ? fontSize * CROP
          : `calc(${ESTIMATE} * ${CROP})`,
      }}
    >
      <div
        ref={rowRef}
        className="flex w-max items-start whitespace-nowrap font-display font-bold leading-none tracking-[-0.02em] text-sec-ink"
        style={{
          fontSize: fontSize ?? ESTIMATE,
          marginTop: fontSize
            ? -fontSize * TRIM
            : `calc(${ESTIMATE} * -${TRIM})`,
        }}
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
