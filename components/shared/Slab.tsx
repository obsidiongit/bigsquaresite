"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { EASE, IN_VIEW_MARGIN } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* The blue slab: the page's signature surface (the featured work panel,
   the first 90 days, the menu), made reusable for the lower-page pass
   (2026-10-09, review toggles "servicesLook" / "portalLook"). A brand
   blue panel at radius 32 whose edge is the boiling pencil box drawn in
   the slab's own blue, so only the wobble escaping onto the page shows
   (STYLE_GUIDE 7.3, box variant). On entry it opens out of its centre
   (the 90-day slab's clip), then the content fades up.

   Content sits in an accent theme scope with a transparent ground (the
   fill is the layer behind), so sec-* tokens read white-on-blue.
   Anything that must stay paper inside it (a product window) declares
   its own data-theme="light". */

const CLIP_CLOSED = "inset(48% 49% round 8px)";
const CLIP_OPEN = "inset(0% 0% round 8px)";

export function Slab({
  children,
  className,
  contentClassName,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const inView = useInView(ref, { once: true, margin: IN_VIEW_MARGIN });
  const open = reduced || inView;
  /* reduced motion renders plain, settled markup: a motion wrapper that
     mounted closed before the flag flipped stays closed (the framer trap
     PhaseReadout notes) */
  if (reduced)
    return (
      <div ref={ref} className={cn("relative", className)}>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div data-theme="accent" className="absolute inset-0 rounded-[32px]" />
          <RoughAnnotation variant="box" stroke="var(--acc)" instant className="absolute inset-0 block">
            {null}
          </RoughAnnotation>
        </div>
        <div data-theme="accent" style={{ background: "transparent" }} className={cn("relative", contentClassName)}>
          {children}
        </div>
      </div>
    );
  return (
    <div ref={ref} className={cn("relative", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -inset-4"
          initial={reduced ? false : { clipPath: CLIP_CLOSED }}
          animate={open ? { clipPath: CLIP_OPEN } : undefined}
          transition={{ duration: 0.7, ease: EASE.house }}
        >
          <div data-theme="accent" className="absolute inset-4 rounded-[32px]" />
          <RoughAnnotation variant="box" stroke="var(--acc)" instant active={open} className="absolute inset-4 block">
            {null}
          </RoughAnnotation>
        </motion.div>
      </div>
      <motion.div
        data-theme="accent"
        style={{ background: "transparent" }}
        initial={reduced ? false : { opacity: 0 }}
        animate={open ? { opacity: 1 } : undefined}
        transition={{ duration: 0.45, ease: EASE.house, delay: reduced ? 0 : 0.35 }}
        className={cn("relative", contentClassName)}
      >
        {children}
      </motion.div>
    </div>
  );
}
