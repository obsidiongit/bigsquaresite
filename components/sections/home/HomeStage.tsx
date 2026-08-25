"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SquareField } from "@/components/motion/SquareField";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useWebGLSupport } from "@/components/motion/useWebGLSupport";
import { HERO_POSTER, HERO_VIDEO } from "@/components/sections/home/media";

const HomeCanvas = dynamic(() => import("./HomeCanvas"), { ssr: false });

/* HomeStage (2.hero.md v6): hosts the page-level fixed WebGL canvas
   behind the homepage sections. Layering contract:

     nav (z-50)  >  section content (z-10)  >  square field during
     the hero beats (z-6)  >  canvas (z-5)  >  square field from the
     reform on (z-1)  >  section grounds + GridLines rails (z-auto)

   so the glass cube travels OVER the section backgrounds and rails
   but BEHIND every piece of ink. Exception (card sweep session,
   2026-08-24): Search and ProofBand lift their WHOLE section to
   z-[6], above the canvas, so the companion disappears behind those
   two full-viewport grounds between the solution card sweep and the
   trust marquee. The ambient square field (STYLE_GUIDE
   7.4) hands off across the canvas: above it during the hero (its
   opaque in-canvas paper backdrop would otherwise hide the squares),
   below it once the cube releases, so the companion passes over the
   field. Sections opt in by wrapping their content in a `relative
   z-10` layer and carrying a data-cube-anchor attribute the canvas
   reads for the companion journey.

   The children are server-rendered sections passed straight through:
   this wrapper adds no DOM around them beyond the stage div whose
   intersection drives the canvas frameloop. Reduced motion or no
   WebGL: no canvas at all (the hero renders its own fallbacks). */

export function HomeStage({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotionSafe();
  const webgl = useWebGLSupport();
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* heroStage: through the statement and film beats the field
          rides at z-6, above the canvas's opaque paper backdrop (so
          the squares live in the hero too, under its ink); from the
          reform on it sits at z-1 so the companion passes over it */}
      <SquareField heroStage={!reduced && webgl !== false} />
      {!reduced && webgl !== false && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[5]">
          <HomeCanvas poster={HERO_POSTER} video={HERO_VIDEO} active={active} />
        </div>
      )}
      <div ref={stageRef}>{children}</div>
    </>
  );
}
