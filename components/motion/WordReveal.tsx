"use client";

import { motion, type Variants } from "framer-motion";
import { createElement, useMemo } from "react";
import { DUR, EASE, VIEWPORT_ONCE } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

/* <WordReveal> (STYLE_GUIDE.md 7.3, e2vc recipe): word-split reveal.
   Pure y 0.6em -> 0 per word, no mask, no opacity, 700ms house, 45ms
   stagger. Transform only, so layout is reserved (zero CLS) and the
   words stay real text server-side. */

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

type Props = {
  /** Plain text only; the component splits it into words */
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
  show: { transition: { staggerChildren: 0.045, delayChildren: delay } },
});

const wordVariants: Variants = {
  hidden: { y: "0.6em" },
  show: { y: "0em", transition: { duration: DUR.reveal, ease: EASE.house } },
};

export function WordReveal({
  children,
  as = "span",
  className,
  onMount = false,
  delay = 0,
  onComplete,
}: Props) {
  const reduced = useReducedMotionSafe();
  const words = children.split(/\s+/).filter(Boolean);
  const Container = useMemo(() => motion.create(as), [as]);

  if (reduced) {
    return createElement(as, { className }, children);
  }

  return (
    <Container
      className={className}
      variants={containerVariants(delay)}
      initial="hidden"
      {...(onMount
        ? { animate: "show" }
        : { whileInView: "show", viewport: VIEWPORT_ONCE })}
      onAnimationComplete={onComplete}
    >
      {words.map((word, i) => (
        <span key={i}>
          <motion.span className="inline-block" variants={wordVariants}>
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Container>
  );
}
