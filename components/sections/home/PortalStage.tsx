"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useWebGLSupport } from "@/components/motion/useWebGLSupport";
import { PORTAL_RUNWAY_VH } from "@/lib/portal-window";

/* PortalStage (9.portal.md v3): the portal window morph's pin. The
   section's copy and the exhibit are a sticky child inside this stage;
   the spacer below is the morph's scroll runway, scrubbed 1:1 by
   HomeCanvas and PortalExhibit through the shared portalMorph clock.
   Scroll holds the composition in full viewport while the cube dives
   onto the logo mark and the window builds itself out of it.

   The standing engineering rules from the hero, the work panel, and
   the solution sweep all apply:

   - The runway is a REAL SPACER element. Sticky offsets are
     constrained to the containing block's content box, so a runway
     made of padding silently never sticks.
   - Fallback paths collapse the spacer to 0, which leaves the sticky
     child no room, so the pin never engages and portalMorph reads a
     settled 1. The gate is 768, matching HomeCanvas's own mobile
     cutoff: below it the cube's journey already exited at featured
     work, so there is nothing to morph. Reduced motion and no-WebGL
     never had a cube at all.
   - The sticky top is MEASURED, not authored: the exhibit centres in
     the viewport, capped so its chrome bar (the morph's target) never
     parks behind the nav.

   Only the EXHIBIT pins, not the section's copy with it. A 900px
   viewport cannot hold the copy and a full-height window clear of the
   nav at once, and pinning both parked a clipped line of support text
   over a void: the window does not exist yet for the first two thirds
   of the runway. Pinned alone, the copy scrolls away above like any
   section's would and the cube inherits the window's empty footprint
   to travel and turn in. */

export function PortalStage({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotionSafe();
  const webgl = useWebGLSupport();
  const pinRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState("24px");

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;
    const compute = () => {
      /* CENTRE the exhibit in the viewport, capped so it never parks
         under the 72px nav bar. Tall windows on short viewports hang
         their bottom edge below the fold rather than sliding their
         chrome bar (the morph's target) behind the nav. */
      const t = Math.round((window.innerHeight - el.offsetHeight) / 2);
      setTop(`${Math.min(96, Math.max(-160, t))}px`);
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
    <div data-portal-stage>
      <div ref={pinRef} data-portal-pin className="sticky" style={{ top }}>
        {children}
      </div>
      <div
        aria-hidden
        className="hidden md:block"
        style={{ height: pinned ? `${PORTAL_RUNWAY_VH}svh` : 0 }}
      />
    </div>
  );
}
