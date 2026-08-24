"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useWebGLSupport } from "@/components/motion/useWebGLSupport";
import { HERO_POSTER, HERO_VIDEO } from "@/components/sections/home/media";

const HomeCanvas = dynamic(() => import("./HomeCanvas"), { ssr: false });

/* HomeStage (2.hero.md v6): hosts the page-level fixed WebGL canvas
   behind the homepage sections. Layering contract:

     nav (z-50)  >  section content (z-10)  >  canvas (z-5)  >
     section grounds + GridLines rails (z-auto)

   so the glass cube travels OVER the section backgrounds and rails
   but BEHIND every piece of ink. Sections opt in by wrapping their
   content in a `relative z-10` layer and carrying a data-cube-anchor
   attribute the canvas reads for the companion journey.

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
      {!reduced && webgl !== false && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[5]">
          <HomeCanvas poster={HERO_POSTER} video={HERO_VIDEO} active={active} />
        </div>
      )}
      <div ref={stageRef}>{children}</div>
    </>
  );
}
