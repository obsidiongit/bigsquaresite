"use client";

import { motion } from "framer-motion";
import { EASE, VIEWPORT_ONCE } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { cn } from "@/lib/utils";

/* <SeparatorIn> (STYLE_GUIDE.md 7.3, pxpush): a 1px rule that draws in
   left to right on entry via clip-path, 600ms house, one-shot. Sized by
   its container; color defaults to the section line token. */

type Props = { className?: string; delay?: number };

export function SeparatorIn({ className, delay = 0 }: Props) {
  const reduced = useReducedMotionSafe();
  const classes = cn("h-px w-full bg-sec-line", className);

  if (reduced) return <div aria-hidden className={classes} />;

  return (
    <motion.div
      aria-hidden
      className={classes}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.6, ease: EASE.house, delay }}
    />
  );
}
