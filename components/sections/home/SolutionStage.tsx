"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useWebGLSupport } from "@/components/motion/useWebGLSupport";
import { SWEEP_RUNWAY_VH } from "@/lib/solution-sweep";

/* SolutionStage (5.solution.md v3.2, Brad round 4): the card sweep's
   pin. The whole solution composition (headline + intro + cards) is
   a sticky child inside this stage; the spacer below it is the
   sweep's scroll runway, scrubbed 1:1 by HomeCanvas and
   SolutionCards via the shared sweepPin clock (lib/solution-sweep).
   Scroll freezes the section in full viewport while the cube sweeps
   under the cards, and resumes as the cube dives out at the left.

   Hero/work-panel engineering rules apply: the runway is a REAL
   SPACER element (sticky offsets are constrained to the containing
   block's content box; runway-as-padding silently never sticks), and
   fallback paths collapse it to 0 so the sticky child has no room
   and never pins (mobile: the cube's journey exits at featured work;
   reduced motion / no WebGL: no cube at all).

   The sticky top is MEASURED, not authored: show as much of the
   composition as the viewport affords while keeping the sweep lane
   below the card row on screen. Tall viewports pin comfortably low
   (capped at 88px); short laptops let the headline run off the top
   edge instead of sinking the lane below the fold. */

export function SolutionStage({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotionSafe();
  const webgl = useWebGLSupport();
  const pinRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState("24px");

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;
    const compute = () => {
      const lane = Math.max(96, window.innerHeight * 0.12);
      const t = Math.round(window.innerHeight - el.offsetHeight - lane);
      setTop(`${Math.min(88, Math.max(-180, t))}px`);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  const pinned = !reduced && webgl !== false;
  return (
    <div data-solution-stage>
      <div ref={pinRef} data-solution-pin className="sticky" style={{ top }}>
        {children}
      </div>
      <div
        aria-hidden
        className="hidden md:block"
        style={{ height: pinned ? `${SWEEP_RUNWAY_VH}svh` : 0 }}
      />
    </div>
  );
}
