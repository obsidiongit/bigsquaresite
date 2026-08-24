"use client";

import { motion } from "framer-motion";
import { createElement } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

/* <TitleAssemble> (STYLE_GUIDE.md 7.3, pxpush): per-word opacity 0 -> 1
   in random order, 300ms, 30ms stagger. Mono eyebrows only, at most one
   per page. Opacity only, so layout is reserved (zero CLS).

   The "random" order is a seeded shuffle computed identically on server
   and client (no Math.random: hydration-safe and stable across renders). */

type Props = {
  /** Plain text only; the component splits it into words */
  children: string;
  as?: "span" | "p";
  className?: string;
  /** Hero exception (7.3): animate on mount instead of on view */
  onMount?: boolean;
  delay?: number;
};

function seededShuffle(n: number, seed: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function TitleAssemble({
  children,
  as = "span",
  className,
  onMount = false,
  delay = 0,
}: Props) {
  const reduced = useReducedMotionSafe();
  const words = children.split(/\s+/).filter(Boolean);

  if (reduced) {
    return createElement(as, { className }, children);
  }

  const order = seededShuffle(words.length, 7);
  const Container = as === "p" ? motion.p : motion.span;

  return (
    <Container
      className={className}
      initial="hidden"
      {...(onMount
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true } })}
    >
      {words.map((word, i) => (
        <span key={i}>
          <motion.span
            className="inline-block"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { duration: 0.3, delay: delay + order[i] * 0.03 },
              },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Container>
  );
}
