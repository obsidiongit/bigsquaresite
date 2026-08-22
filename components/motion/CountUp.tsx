"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE, IN_VIEW_MARGIN } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { cn } from "@/lib/utils";

/* <CountUp> (STYLE_GUIDE.md 7.3): animate a number to its value, 1.4s
   house, once on entry, tabular-nums. The final value renders
   server-side (SEO, no-JS, reduced motion); a hidden sizer keeps the
   final width reserved during the count (zero CLS). */

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Defaults to rounded, locale-separated integers */
  format?: (n: number) => string;
};

const defaultFormat = (n: number) => Math.round(n).toLocaleString("en-US");

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
  format = defaultFormat,
}: Props) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: IN_VIEW_MARGIN });
  const [display, setDisplay] = useState(value);
  const armedRef = useRef(false);

  // Arm after hydration so SSR and no-JS keep the real number; restore
  // the final value if the reduced-motion flag flips on after mount.
  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    if (!armedRef.current) {
      armedRef.current = true;
      setDisplay(0);
    }
  }, [reduced, value]);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: EASE.house,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  const final = `${prefix}${format(value)}${suffix}`;
  return (
    <span ref={ref} className={cn("relative inline-block tabular-nums", className)}>
      {/* invisible sizer reserves the final width */}
      <span className="invisible" aria-hidden>
        {final}
      </span>
      <span className="absolute inset-0" aria-hidden>
        {prefix}
        {format(display)}
        {suffix}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
