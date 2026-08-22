"use client";

import { MotionConfig } from "framer-motion";

/* App-wide reduced-motion honoring (STYLE_GUIDE.md 7.8). The root layout
   is a server component, so this small client wrapper mounts MotionConfig. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
