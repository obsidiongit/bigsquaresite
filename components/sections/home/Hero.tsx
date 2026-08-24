"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/shared/Container";
import { InfoBar } from "@/components/shared/InfoBar";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useScrollCheckpoints } from "@/components/motion/useScrollCheckpoints";
import { useWebGLSupport } from "@/components/motion/useWebGLSupport";
import { HERO_K, HERO_POSTER, HERO_VIDEO } from "@/components/sections/home/media";
import { EASE } from "@/lib/motion";

/* Hero (2.hero.md v6): the glass square becomes the film, and then the
   square again. The WebGL set piece itself moved to the page-level
   HomeCanvas (fixed, z-5, behind this section's z-10 ink): this file
   owns the DOM half: the statement, the exiting headline, the card
   beat side text, the settled panel's meta and marks, and the
   no-WebGL / reduced-motion fallbacks.

   The wrapper grew by 7/6 (374/560vh) so the film panel can un-balloon
   back into the cube in the last 1/7 while still pinned. All v5.1 DOM
   scrubs are remapped by HERO_K so their choreography is unchanged;
   the panel meta additionally fades OUT as the reform begins. */

/* Scroll checkpoints: the choreography's rest beats in wrapper
   progress (raw clock). When scrolling goes idle between two of
   these, useScrollCheckpoints glides the page to the boundary the
   gesture was heading for, so no beat (headline exit, balloon,
   reform) can be left parked half-played. The K-clock factors mirror
   the scrub timeline: 0.60 sits inside the held-card beat (flatten
   and gate done, side text fully in, balloon not started) and 0.98
   is the settled panel with its meta in, just before the reform. */
const CHECKPOINTS = [
  0, /* the statement */
  0.6 * HERO_K, /* the held film card + side text */
  0.98 * HERO_K, /* the settled framed panel */
  1, /* reform complete, the cube released as companion */
];

const H1_LINE1 = ["More", "locations."];
const H1_LINE2 = ["More", "revenue", "from"];

const h1Container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.15 } },
};

const h1Word: Variants = {
  hidden: { y: "0.65em" },
  show: { y: "0em", transition: { duration: 0.65, ease: EASE.house } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE.house } },
};

function H1Word({ children }: { children: string }) {
  return (
    <motion.span className="inline-block" variants={h1Word}>
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Film media + meta (DOM: static composition and no-WebGL fallback)   */
/* ------------------------------------------------------------------ */

function FilmMedia({ withVideo }: { withVideo: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <Image
        src={HERO_POSTER}
        alt=""
        fill
        preload
        loading="eager"
        sizes="100vw"
        className="object-cover"
      />
      {withVideo && HERO_VIDEO && mounted && (
        <video
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          onPlaying={() => setPlaying(true)}
          className={
            "absolute inset-0 size-full object-cover transition-opacity duration-[600ms] " +
            (playing ? "opacity-100" : "opacity-0")
          }
        />
      )}
    </>
  );
}

function FilmMeta({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-5 font-mono text-eyebrow uppercase text-ondarkmid " +
        className
      }
    >
      <span>BigSquare / Brand Film</span>
      <span className="hidden tabular-nums sm:inline">Nº001 / ©2026</span>
    </div>
  );
}

/* "+" registration marks around the settled panel (STYLE_GUIDE 4.3) */
function PanelMarks() {
  const mark = "absolute font-mono text-[12px] leading-none text-sec-mid";
  return (
    <div aria-hidden className="absolute inset-[calc(4vw-18px)] hidden md:block">
      <span className={`${mark} left-0 top-0`}>+</span>
      <span className={`${mark} right-0 top-0`}>+</span>
      <span className={`${mark} bottom-0 left-0`}>+</span>
      <span className={`${mark} bottom-0 right-0`}>+</span>
    </div>
  );
}

/* Static composition for prefers-reduced-motion: statement, then the
   film as a settled framed panel. No pin, no canvas, poster only. */
function HeroStatic() {
  return (
    <section data-theme="light" className="relative">
      <Container className="relative flex min-h-[82svh] flex-col justify-end pb-16 pt-32 md:pt-40">
        <h1 className="font-display text-display text-sec-ink">
          More locations. <br />
          More revenue from{" "}
          <RoughAnnotation variant="circle" active className="whitespace-nowrap">
            each one.
          </RoughAnnotation>
        </h1>
        <p className="mt-8 max-w-[44ch] text-lead text-sec-mid">
          BigSquare is the growth partner for multi-location and franchise
          brands. One team runs your ads, your search, your site, and your
          creative.
        </p>
      </Container>
      <div className="relative mx-[4vw] aspect-video max-h-svh overflow-hidden rounded-[24px] bg-darkpanel">
        <FilmMedia withVideo={false} />
        <FilmMeta />
      </div>
      <InfoBar className="relative mt-6" links={[{ label: "Results", href: "/results/" }]} />
    </section>
  );
}

export function Hero() {
  const reduced = useReducedMotionSafe();
  const [h1Done, setH1Done] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const webgl = useWebGLSupport();

  const { scrollYProgress: p } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /* idle-settle to the nearest rest beat; input always wins (7.4) */
  useScrollCheckpoints(wrapRef, { checkpoints: CHECKPOINTS, enabled: !reduced });

  /* All scrub bindings use the explicit callback form with a manual
     clamp (`seg` below): linear inside [a, b], held flat outside it.
     `segK` runs in the v5.1 clock (the first HERO_K of the wrapper);
     raw `seg` addresses the reform beat at the end. */
  const seg = (v: number, a: number, b: number) =>
    Math.min(1, Math.max(0, (v - a) / (b - a)));
  const segK = (v: number, a: number, b: number) =>
    seg(Math.min(1, v / HERO_K), a, b);
  const lerp = (t: number, from: number, to: number) => from + (to - from) * t;

  /* Headline exit: lines drift up with per-line lag + blur while the
     glass cube swoops past behind them. */
  const line1Y = useTransform(p, (v) => `${lerp(segK(v, 0.06, 0.4), 0, -32)}svh`);
  const line2Y = useTransform(p, (v) => `${lerp(segK(v, 0.04, 0.38), 0, -24)}svh`);
  const stmtBlur = useTransform(p, (v) => lerp(segK(v, 0.1, 0.36), 0, 4));
  const stmtFilter = useMotionTemplate`blur(${stmtBlur}px)`;
  const stmtOpacity = useTransform(p, (v) => lerp(segK(v, 0.24, 0.42), 1, 0));
  const subY = useTransform(p, (v) => `${lerp(segK(v, 0.04, 0.38), 0, -16)}svh`);
  const stripOpacity = useTransform(p, (v) => lerp(segK(v, 0.03, 0.15), 1, 0));

  /* Film meta + registration marks on the settled panel (DOM): in with
     the settle, out again the moment the reform starts pulling the
     panel back into the cube. */
  const metaIn = (v: number) => segK(v, 0.92, 0.98);
  const metaOut = (v: number) => seg(v, HERO_K + 0.01, HERO_K + 0.05);
  const metaOpacity = useTransform(p, (v) => metaIn(v) * (1 - metaOut(v)));
  const metaY = useTransform(p, (v) => lerp(metaIn(v), 10, 0));

  /* The card-beat side text (lusion's card + paragraph screen): slides
     in from the right while the film card holds, slides away as the
     balloon takes the frame. Copy is DRAFT pending Brad. */
  const sideIn = (v: number) => segK(v, 0.46, 0.54);
  const sideOut = (v: number) => segK(v, 0.66, 0.72);
  const sideOpacity = useTransform(p, (v) => sideIn(v) * (1 - sideOut(v)));
  const sideX = useTransform(
    p,
    (v) => lerp(sideIn(v), 48, 0) + lerp(sideOut(v), 0, -32),
  );
  const sidePointer = useTransform(p, (v) =>
    sideIn(v) > 0.5 && sideOut(v) < 0.5 ? "auto" : "none",
  );

  /* The card-beat headline (Brad, 2026-08-24: the beat needed a large
     statement, not just the small right column). Display-scale lines
     swing in from the top left with per-line lag and a clearing blur
     (mirroring the opening headline's exit) while the film card holds,
     then retreat upward as the balloon takes the frame. */
  const headIn1 = (v: number) => segK(v, 0.44, 0.55);
  const headIn2 = (v: number) => segK(v, 0.47, 0.58);
  const headOut = (v: number) => segK(v, 0.66, 0.72);
  const head1Opacity = useTransform(p, (v) => headIn1(v) * (1 - headOut(v)));
  const head2Opacity = useTransform(p, (v) => headIn2(v) * (1 - headOut(v)));
  const head1X = useTransform(p, (v) => lerp(headIn1(v), -110, 0));
  const head1Y = useTransform(
    p,
    (v) => lerp(headIn1(v), -100, 0) + lerp(headOut(v), 0, -56),
  );
  const head2X = useTransform(p, (v) => lerp(headIn2(v), -150, 0));
  const head2Y = useTransform(
    p,
    (v) => lerp(headIn2(v), -80, 0) + lerp(headOut(v), 0, -40),
  );
  const headBlur = useTransform(p, (v) => lerp(headIn1(v), 6, 0));
  const headFilter = useMotionTemplate`blur(${headBlur}px)`;

  /* No-WebGL fallback: an honest simple rise into the framed panel,
     which then simply holds (no cube, so no reform beat). */
  const fbOpacity = useTransform(p, (v) => lerp(segK(v, 0.5, 0.58), 0, 1));
  const fbY = useTransform(p, (v) => `${lerp(segK(v, 0.52, 0.9), 40, 0)}%`);
  const fbClip = useTransform(p, (v) => {
    const t = segK(v, 0.62, 0.92);
    return `inset(${lerp(t, 20, 4)}vw ${lerp(t, 20, 4)}vw round 24px)`;
  });

  if (reduced) return <HeroStatic />;

  return (
    <section data-theme="light" className="relative">
      <div
        ref={wrapRef}
        data-cube-anchor="hero"
        className="relative h-[374vh] md:h-[560vh]"
      >
        {/* The sticky stage carries z-10 so ALL of its ink paints above
            the page-level fixed canvas (z-5): the cube and film play
            behind the text. position:sticky makes this a stacking
            context, so the z must live here, not on the children. */}
        <div className="sticky top-0 z-10 h-svh overflow-hidden">
          {webgl === false && (
            /* No WebGL: simple rise, no cube (the page canvas is absent) */
            <motion.div
              aria-hidden
              style={{ opacity: fbOpacity, y: fbY }}
              className="absolute inset-0"
            >
              <motion.div
                style={{ clipPath: fbClip }}
                className="absolute inset-0 overflow-hidden bg-darkpanel"
              >
                <FilmMedia withVideo />
              </motion.div>
            </motion.div>
          )}

          {/* Phase A: the statement on open paper. The headline sits
              raised into the space left of the floating cube (review
              2); the statement paragraph gets its own clear row below,
              never under the headline. */}
          <Container className="relative flex h-full flex-col pb-24 pt-28 md:pb-28">
            <motion.div
              className="flex min-h-0 flex-1 flex-col"
              style={{ filter: stmtFilter, opacity: stmtOpacity }}
            >
              <div className="flex-[1.15]" />
              <motion.h1
                className="font-display text-display text-sec-ink"
                variants={h1Container}
                initial="hidden"
                animate="show"
                onAnimationComplete={() => setH1Done(true)}
              >
                <motion.span className="block" style={{ y: line1Y }}>
                  {H1_LINE1.map((w, i) => (
                    <span key={i}>
                      <H1Word>{w}</H1Word>
                      {i < H1_LINE1.length - 1 ? " " : null}
                    </span>
                  ))}
                </motion.span>
                <motion.span className="block" style={{ y: line2Y }}>
                  {H1_LINE2.map((w, i) => (
                    <span key={i}>
                      <H1Word>{w}</H1Word>{" "}
                    </span>
                  ))}
                  <RoughAnnotation
                    variant="circle"
                    active={h1Done}
                    className="whitespace-nowrap"
                  >
                    <H1Word>each</H1Word> <H1Word>one.</H1Word>
                  </RoughAnnotation>
                </motion.span>
              </motion.h1>

              <div className="flex-1" />

              <motion.div
                style={{ y: subY }}
                className="mt-10 md:mt-0 md:flex md:justify-end"
              >
                <motion.p
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.55 }}
                  className="max-w-[38ch] text-body text-sec-mid md:text-right"
                >
                  BigSquare is the growth partner for multi-location and
                  franchise brands. One team runs your ads, your search, your
                  site, and your creative.
                </motion.p>
              </motion.div>
            </motion.div>
          </Container>

          {/* The card-beat headline: the film's statement at display
              scale, in from the top left while the card holds (lusion's
              big-left/small-right card screen, completed).
              [PLACEHOLDER: headline copy is draft, awaiting Brad] */}
          <div className="pointer-events-none absolute inset-x-0 top-[9svh] md:top-[11svh]">
            <Container>
              <p className="font-display text-display text-sec-ink">
                <motion.span
                  className="block"
                  style={{
                    opacity: head1Opacity,
                    x: head1X,
                    y: head1Y,
                    filter: headFilter,
                  }}
                >
                  Proof before
                </motion.span>
                <motion.span
                  className="block"
                  style={{
                    opacity: head2Opacity,
                    x: head2X,
                    y: head2Y,
                    filter: headFilter,
                  }}
                >
                  <span className="italic">promises.</span>
                </motion.span>
              </p>
            </Container>
          </div>

          {/* The card beat: supporting text beside the held film card.
              [PLACEHOLDER: copy below is draft, awaiting Brad's text] */}
          <motion.div
            style={{ opacity: sideOpacity, x: sideX, pointerEvents: sidePointer }}
            className="absolute right-[max(20px,6vw)] top-1/2 hidden w-[min(40ch,34vw)] -translate-y-1/2 md:block"
          >
            <p className="font-mono text-eyebrow uppercase text-sec-mid">
              The Brand Film
            </p>
            <p className="mt-5 text-lead text-sec-ink">
              One team runs your ads, your search, your site, and your
              creative. This is the work in motion.
            </p>
            {/* Retargeted 2026-08-24: featured work now lands directly
                below the hero, so this points at the about page instead.
                [PLACEHOLDER: label is draft, awaiting Brad] */}
            <a
              href="/about/"
              className="mt-8 flex items-center justify-between border-b border-sec-line pb-3 text-body font-bold text-sec-ink transition-colors hover:border-sec-ink"
            >
              How We Work
              <span aria-hidden>→</span>
            </a>
          </motion.div>

          {/* The instrument strip along the fold */}
          <motion.div
            style={{ opacity: stripOpacity }}
            className="absolute inset-x-0 bottom-0"
          >
            <Container>
              <div className="flex items-center justify-between border-t border-sec-line py-4 font-mono text-eyebrow uppercase text-sec-mid">
                <span className="hidden md:inline">
                  Multi-Location & Franchise Marketing
                </span>
                <span className="md:hidden">Multi-Location Marketing</span>
                <span aria-hidden className="flex items-center gap-2 text-sec-ink">
                  Scroll
                  <motion.span
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ↓
                  </motion.span>
                </span>
                <span className="hidden tabular-nums sm:inline">©2026</span>
              </div>
            </Container>
          </motion.div>

          {/* Meta + registration marks on the settled panel */}
          <motion.div
            aria-hidden
            style={{ opacity: metaOpacity, y: metaY }}
            className="absolute inset-0"
          >
            <PanelMarks />
            <div className="absolute inset-[4vw]">
              <FilmMeta />
            </div>
          </motion.div>
        </div>
      </div>

      {/* The info bar grounds the region back on paper */}
      <InfoBar
        className="relative z-10 pt-2"
        links={[{ label: "Results", href: "/results/" }]}
      />
    </section>
  );
}
