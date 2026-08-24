"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

/* Shared play gate for the widget vignette loops (STYLE_GUIDE 7.10).
   `data-play` rides on the `.wgt` root: absent in the SSR HTML (so the
   first frame is always the deterministic keyframe-0 composition), set
   while the widget is in view, cleared offscreen so the loop pauses
   in place. Reduced motion never plays; the widget renders its settled
   end frame instead (the second layer over the CSS kill). */
export function useWidgetLoop() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotionSafe();
  return { ref, play: inView && !reduced, reduced };
}
