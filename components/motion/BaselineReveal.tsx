"use client";

import { motion, type Variants } from "framer-motion";
import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { DUR, EASE, VIEWPORT_ONCE } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

/* <BaselineReveal> (STYLE_GUIDE.md 7.3): line-split headline reveal.
   Each rendered line rises y 110% -> 0 inside an overflow-hidden wrapper,
   700ms house, 115ms stagger per line.

   Zero-CLS contract (7.9): the text renders server-side as plain words,
   lines are measured after hydration (and after fonts load), and every
   phase occupies the same line boxes. After the animation the element
   returns to plain text with overflow visible, so annotations can
   overflow the line box (RoughAnnotation contract). */

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

type Props = {
  /** Plain text only; the component splits and re-renders it */
  children: string;
  as?: Tag;
  className?: string;
  /** Hero exception (7.3): animate on mount instead of on view */
  onMount?: boolean;
  delay?: number;
  onComplete?: () => void;
};

const containerVariants = (delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.115, delayChildren: delay } },
});

const lineVariants: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: DUR.reveal, ease: EASE.house } },
};

export function BaselineReveal({
  children,
  as = "h2",
  className,
  onMount = false,
  delay = 0,
  onComplete,
}: Props) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<"measure" | "ready" | "done">("measure");
  const [lines, setLines] = useState<string[]>([]);
  const startedRef = useRef(false);
  const words = children.split(/\s+/).filter(Boolean);
  const Container = useMemo(() => motion.create(as), [as]);

  // Group the measurement-pass word spans into visual lines by offsetTop.
  useEffect(() => {
    if (reduced || phase !== "measure") return;
    let cancelled = false;
    const measure = () => {
      const el = ref.current;
      if (cancelled || !el) return;
      const spans = el.querySelectorAll<HTMLSpanElement>("[data-word]");
      const grouped: string[][] = [];
      let lastTop: number | null = null;
      spans.forEach((span) => {
        const top = span.offsetTop;
        if (lastTop === null || Math.abs(top - lastTop) > 2) {
          grouped.push([]);
          lastTop = top;
        }
        grouped[grouped.length - 1].push(span.textContent ?? "");
      });
      setLines(grouped.map((g) => g.join(" ")));
      setPhase("ready");
    };
    // Wrapping depends on the loaded webfont; wait for it before splitting.
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(measure);
    } else {
      measure();
    }
    return () => {
      cancelled = true;
    };
  }, [reduced, phase]);

  // Re-split if the viewport width changes before the reveal has started.
  useEffect(() => {
    if (reduced || phase === "done") return;
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastWidth || startedRef.current) return;
      lastWidth = window.innerWidth;
      setPhase("measure");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [reduced, phase]);

  // Reduced motion, pre-hydration, and post-animation: plain text.
  if (reduced || phase === "done") {
    return createElement(as, { className }, children);
  }

  // Measurement pass (also the server-rendered markup): real text in spans.
  if (phase === "measure") {
    return createElement(
      as,
      { ref, className },
      words.map((word, i) => (
        <span data-word key={i}>
          {word}
          {i < words.length - 1 ? " " : null}
        </span>
      )),
    );
  }

  return (
    <Container
      className={className}
      variants={containerVariants(delay)}
      initial="hidden"
      {...(onMount
        ? { animate: "show" }
        : { whileInView: "show", viewport: VIEWPORT_ONCE })}
      onAnimationStart={() => {
        startedRef.current = true;
      }}
      onAnimationComplete={() => {
        setPhase("done");
        onComplete?.();
      }}
    >
      {lines.map((text, i) => (
        /* pb/-mb widen the mask window downward so descenders never clip */
        <span key={i} className="-mb-[0.15em] block overflow-hidden pb-[0.15em]">
          <motion.span className="block" variants={lineVariants}>
            {text}
          </motion.span>
        </span>
      ))}
    </Container>
  );
}
