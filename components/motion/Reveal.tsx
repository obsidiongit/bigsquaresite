"use client";

import { motion, type Variants } from "framer-motion";
import { EASE, VIEWPORT_ONCE } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { cn } from "@/lib/utils";

/* <Reveal> (STYLE_GUIDE.md 7.3): the default block reveal. Fade-up
   y 16 -> 0, opacity 0 -> 1, 500ms house, one-shot at ~85% viewport.
   Transform + opacity only, so layout is always reserved (zero CLS).

   Stagger: wrap each staggered block in <RevealItem> inside a
   <Reveal stagger> container; items inherit the trigger and fire 60ms
   apart. Without `stagger`, <Reveal> animates itself as one block. */

const block: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE.house },
  },
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Container-only mode: children are <RevealItem>s staggered 60ms apart */
  stagger?: boolean;
  delay?: number;
};

export function Reveal({ children, className, stagger = false, delay }: RevealProps) {
  const reduced = useReducedMotionSafe();
  if (reduced) return <div className={className}>{children}</div>;

  const variants = stagger ? container : block;
  return (
    <motion.div
      className={className}
      variants={
        delay
          ? {
              ...variants,
              show: {
                ...variants.show,
                transition: {
                  ...(stagger
                    ? { staggerChildren: 0.06 }
                    : { duration: 0.5, ease: EASE.house }),
                  delayChildren: stagger ? delay : undefined,
                  delay: stagger ? undefined : delay,
                },
              },
            }
          : variants
      }
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT_ONCE}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div className={cn(className)} variants={block}>
      {children}
    </motion.div>
  );
}
