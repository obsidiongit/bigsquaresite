"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { Container } from "@/components/shared/Container";
import type { WorldStats } from "./WorldCanvas";

const WorldCanvas = dynamic(() => import("./WorldCanvas"), { ssr: false });

/* WorldStage: the dev harness for the hero world (round 1, the town at rest).
   A page-level fixed canvas at z-5 with a copy of the hero's fold DOM
   at z-10 over it, so the composition is judged as the real fold:
   headline left, statement bottom right, cube in the open area. The
   grain + vignette overlay sits above everything like illoca's film
   grain. Reduced motion: no canvas, the fold stands alone. */
export function WorldStage() {
  const reduced = useReducedMotionSafe();
  const pointer = useRef({ x: 0, y: 0 }).current;
  const [stats, setStats] = useState<WorldStats | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointer]);

  return (
    <main data-theme="light" className="relative min-h-svh bg-paper">
      {!reduced && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[5]">
          <WorldCanvas pointer={pointer} onStats={setStats} />
        </div>
      )}
      {/* grain + vignette over the whole fold */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[20]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(11,15,23,0) 55%, rgba(11,15,23,0.06) 100%)",
        }}
      />
      <section className="relative z-10 h-svh overflow-hidden">
        <Container className="relative flex h-full flex-col pb-24 pt-28 md:pb-28">
          <div className="flex-[1.15]" />
          <h1 className="font-display text-display text-sec-ink">
            <span className="block">More customers.</span>
            <span className="block">
              More revenue you can{" "}
              <RoughAnnotation variant="circle" active className="whitespace-nowrap font-accent">
                count.
              </RoughAnnotation>
            </span>
          </h1>
          <div className="flex-1" />
          <div className="mt-10 md:mt-0 md:flex md:justify-end">
            <p className="max-w-[38ch] text-body text-sec-mid md:text-right">
              BigSquare is the growth partner for brands that want proof. One
              team runs your ads, your search, your site, and your creative.
            </p>
          </div>
        </Container>
      </section>
      <p
        data-world-stats
        className="fixed bottom-4 left-4 z-[30] font-mono text-[11px] text-sec-mid"
      >
        {stats ? `${stats.frameMs.toFixed(1)} ms/frame · DPR ${stats.dpr.toFixed(2)}` : "measuring"}
      </p>
    </main>
  );
}
