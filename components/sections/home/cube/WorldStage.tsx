"use client";

import dynamic from "next/dynamic";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useScrollCheckpoints } from "@/components/motion/useScrollCheckpoints";
import { HERO_K, HERO_POSTER, HERO_VIDEO } from "@/components/sections/home/media";
import { Container } from "@/components/shared/Container";
import type { WorldStats } from "./WorldCanvas";

const WorldCanvas = dynamic(() => import("./WorldCanvas"), { ssr: false });

/* WorldStage: the dev harness for the hero world (rounds 1 and 2). A
   page-level fixed canvas at z-5 with a copy of the hero's DOM at z-10
   over it, on the hero's own pinned runway (374vh / 560vh, Hero.tsx),
   so the composition is judged as the real fold: headline left,
   statement bottom right, cube in the open area, then the headline's
   exit, the card beat's headline and side text, and the reform. The
   scrubs are Hero.tsx's, remapped by HERO_K; the checkpoints are the
   brief's (rest, the held face, the hold, the companion view).
   `?nosettle` disables the checkpoints for capture scripts that need
   to park at arbitrary progress. Reduced motion: no canvas, no runway,
   the fold stands alone. */

const CHECKPOINTS_MAIN = [0, 0.6 * HERO_K, HERO_K];
const CHECKPOINTS_REFORM = [HERO_K, 1];

export function WorldStage() {
  const reduced = useReducedMotionSafe();
  const pointer = useRef({ x: 0, y: 0 }).current;
  const [stats, setStats] = useState<WorldStats | null>(null);
  const [settle, setSettle] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSettle(!new URLSearchParams(window.location.search).has("nosettle"));
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointer]);

  const { scrollYProgress: p } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  useScrollCheckpoints(wrapRef, { checkpoints: CHECKPOINTS_MAIN, enabled: !reduced && settle });
  useScrollCheckpoints(wrapRef, {
    checkpoints: CHECKPOINTS_REFORM,
    enabled: !reduced && settle,
    glideMsPerVh: 2600,
    glideMaxMs: 3000,
  });

  /* Hero.tsx's scrub bindings, verbatim: linear inside [a, b], held
     flat outside; segK runs in the K clock */
  const seg = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));
  const segK = (v: number, a: number, b: number) => seg(Math.min(1, v / HERO_K), a, b);
  const lerp = (t: number, from: number, to: number) => from + (to - from) * t;

  const line1Y = useTransform(p, (v) => `${lerp(segK(v, 0.06, 0.4), 0, -32)}svh`);
  const line2Y = useTransform(p, (v) => `${lerp(segK(v, 0.04, 0.38), 0, -24)}svh`);
  const stmtBlur = useTransform(p, (v) => lerp(segK(v, 0.1, 0.36), 0, 4));
  const stmtFilter = useMotionTemplate`blur(${stmtBlur}px)`;
  const stmtOpacity = useTransform(p, (v) => lerp(segK(v, 0.24, 0.42), 1, 0));
  const subY = useTransform(p, (v) => `${lerp(segK(v, 0.04, 0.38), 0, -16)}svh`);

  const sideIn = (v: number) => segK(v, 0.46, 0.54);
  const sideOut = (v: number) => segK(v, 0.66, 0.72);
  const sideOpacity = useTransform(p, (v) => sideIn(v) * (1 - sideOut(v)));
  const sideX = useTransform(p, (v) => lerp(sideIn(v), 48, 0) + lerp(sideOut(v), 0, -32));

  const headIn1 = (v: number) => segK(v, 0.44, 0.55);
  const headIn2 = (v: number) => segK(v, 0.47, 0.58);
  const headOut = (v: number) => segK(v, 0.66, 0.72);
  const head1Opacity = useTransform(p, (v) => headIn1(v) * (1 - headOut(v)));
  const head2Opacity = useTransform(p, (v) => headIn2(v) * (1 - headOut(v)));
  const head1X = useTransform(p, (v) => lerp(headIn1(v), -110, 0));
  const head1Y = useTransform(p, (v) => lerp(headIn1(v), -100, 0) + lerp(headOut(v), 0, -56));
  const head2X = useTransform(p, (v) => lerp(headIn2(v), -150, 0));
  const head2Y = useTransform(p, (v) => lerp(headIn2(v), -80, 0) + lerp(headOut(v), 0, -40));
  const headBlur = useTransform(p, (v) => lerp(headIn1(v), 6, 0));
  const headFilter = useMotionTemplate`blur(${headBlur}px)`;

  const statement = (
    <>
      <h1 className="font-display text-display text-sec-ink">
        <motion.span className="block" style={{ y: reduced ? 0 : line1Y }}>
          More customers.
        </motion.span>
        <motion.span className="block" style={{ y: reduced ? 0 : line2Y }}>
          More revenue you can{" "}
          <RoughAnnotation variant="circle" active className="whitespace-nowrap font-accent">
            count.
          </RoughAnnotation>
        </motion.span>
      </h1>
      <div className="flex-1" />
      <motion.div style={{ y: reduced ? 0 : subY }} className="mt-10 md:mt-0 md:flex md:justify-end">
        <p className="max-w-[38ch] text-body text-sec-mid md:text-right">
          BigSquare is the growth partner for brands that want proof. One team
          runs your ads, your search, your site, and your creative.
        </p>
      </motion.div>
    </>
  );

  return (
    <main data-theme="light" className="relative bg-paper">
      {!reduced && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[5]">
          <WorldCanvas pointer={pointer} onStats={setStats} poster={HERO_POSTER} video={HERO_VIDEO} />
        </div>
      )}
      {/* vignette over the whole fold (grain lives in the materials) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[20]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(11,15,23,0) 55%, rgba(11,15,23,0.06) 100%)",
        }}
      />

      {reduced ? (
        <section className="relative z-10 h-svh overflow-hidden">
          <Container className="relative flex h-full flex-col pb-24 pt-28 md:pb-28">
            <div className="flex-[1.15]" />
            {statement}
          </Container>
        </section>
      ) : (
        <section className="relative">
          <div ref={wrapRef} data-world-runway className="relative h-[374vh] md:h-[560vh]">
            <div className="sticky top-0 z-10 h-svh overflow-hidden">
              <Container className="relative flex h-full flex-col pb-24 pt-28 md:pb-28">
                <motion.div
                  className="flex min-h-0 flex-1 flex-col"
                  style={{ filter: stmtFilter, opacity: stmtOpacity }}
                >
                  <div className="flex-[1.15]" />
                  {statement}
                </motion.div>
              </Container>

              {/* the card-beat headline (Hero.tsx, draft copy) */}
              <div className="pointer-events-none absolute inset-x-0 top-[9svh] md:top-[11svh]">
                <Container>
                  <p className="font-display text-display text-sec-ink">
                    <motion.span
                      className="block"
                      style={{ opacity: head1Opacity, x: head1X, y: head1Y, filter: headFilter }}
                    >
                      Proof before
                    </motion.span>
                    <motion.span
                      className="block"
                      style={{ opacity: head2Opacity, x: head2X, y: head2Y, filter: headFilter }}
                    >
                      <span className="italic">promises.</span>
                    </motion.span>
                  </p>
                </Container>
              </div>

              {/* the card beat's side text (Hero.tsx, draft copy) */}
              <motion.div
                style={{ opacity: sideOpacity, x: sideX }}
                className="pointer-events-none absolute right-[max(20px,6vw)] top-1/2 hidden w-[min(40ch,34vw)] -translate-y-1/2 md:block"
              >
                <p className="font-mono text-eyebrow uppercase text-sec-mid">The Brand Film</p>
                <p className="mt-5 text-lead text-sec-ink">
                  One team runs your ads, your search, your site, and your creative.
                  This is the work in motion.
                </p>
                <span className="mt-8 flex items-center justify-between border-b border-sec-line pb-3 text-body font-bold text-sec-ink">
                  How We Work
                  <span aria-hidden>→</span>
                </span>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      <p
        data-world-stats
        className="fixed bottom-4 left-4 z-[30] font-mono text-[11px] text-sec-mid"
      >
        {stats
          ? `${stats.frameMs.toFixed(1)} ms/frame · DPR ${stats.dpr.toFixed(2)} · raw ${stats.raw.toFixed(3)} · sp ${stats.sp.toFixed(3)}`
          : "measuring"}
      </p>
    </main>
  );
}
