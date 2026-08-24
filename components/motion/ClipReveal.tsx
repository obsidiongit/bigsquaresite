"use client";

import { motion, type Variants } from "framer-motion";
import { EASE, VIEWPORT_ONCE } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { cn } from "@/lib/utils";

/* <ClipReveal> (STYLE_GUIDE.md 7.3, pxpush): framed media entry. The
   frame un-clips from inset(0 35%) while the media inside counter-scales
   1.15 -> 1, 800ms soft, one-shot. Radius defaults to the media radius
   (--radius-media = 24px); pass `radius` to override. */

type Props = {
  children: React.ReactNode;
  className?: string;
  radius?: string;
  /** Hero exception (7.3): animate on mount instead of on view */
  onMount?: boolean;
};

const frameVariants = (radius: string): Variants => ({
  hidden: { clipPath: `inset(0% 35% 0% 35% round ${radius})` },
  show: {
    clipPath: `inset(0% 0% 0% 0% round ${radius})`,
    transition: { duration: 0.8, ease: EASE.soft },
  },
});

const mediaVariants: Variants = {
  hidden: { scale: 1.15 },
  show: { scale: 1, transition: { duration: 0.8, ease: EASE.soft } },
};

export function ClipReveal({
  children,
  className,
  radius = "24px",
  onMount = false,
}: Props) {
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return (
      <div className={cn("overflow-hidden", className)} style={{ borderRadius: radius }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      style={{ borderRadius: radius }}
      variants={frameVariants(radius)}
      initial="hidden"
      {...(onMount
        ? { animate: "show" }
        : { whileInView: "show", viewport: VIEWPORT_ONCE })}
    >
      <motion.div variants={mediaVariants}>{children}</motion.div>
    </motion.div>
  );
}
