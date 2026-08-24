"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
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
import { EASE } from "@/lib/motion";

/* Hero (2.hero.md v5): the glass square becomes the film.
   One viewport of huge type on open paper (no rails), with the
   BigSquare mark floating as a glass cube with a solid accent core in
   the open area above the copy (ambient drift + damped pointer tilt
   at rest). On scroll the cube swoops down BEHIND the exiting
   headline (the canvas sits under the text layer), flattens into a
   small rounded pane at the lower left, the film develops inside that
   footprint as the glass clears, and the card balloons out with a
   cloth bend into a framed near-viewport panel (4vw margins, radius
   24: media as an object, not full bleed), then holds. All of it on
   one lazy WebGL canvas easing toward native scroll progress: no
   hijack, and never the LCP element (LCP stays this SSR headline). */

/* The brand film (decisions.md): swap in the real 4K commercial by
   changing this one line when it is delivered. */
const HERO_VIDEO: string | null = "/media/hero-loop.mp4";
const HERO_POSTER = "/media/hero-poster.jpg";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

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

/* WebGL availability, checked once on the client */
function useWebGLSupport() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}

export function Hero() {
  const reduced = useReducedMotionSafe();
  const [h1Done, setH1Done] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const webgl = useWebGLSupport();

  /* canvas runs only while the hero region intersects the viewport */
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { scrollYProgress: p } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /* All scrub bindings use the explicit callback form with a manual
     clamp (`seg` below): linear inside [a, b], held flat outside it. */
  const seg = (v: number, a: number, b: number) =>
    Math.min(1, Math.max(0, (v - a) / (b - a)));
  const lerp = (t: number, from: number, to: number) => from + (to - from) * t;

  /* Headline exit: lines drift up with per-line lag + blur while the
     glass cube swoops past behind them. */
  const line1Y = useTransform(p, (v) => `${lerp(seg(v, 0.06, 0.4), 0, -32)}svh`);
  const line2Y = useTransform(p, (v) => `${lerp(seg(v, 0.04, 0.38), 0, -24)}svh`);
  const stmtBlur = useTransform(p, (v) => lerp(seg(v, 0.1, 0.36), 0, 4));
  const stmtFilter = useMotionTemplate`blur(${stmtBlur}px)`;
  const stmtOpacity = useTransform(p, (v) => lerp(seg(v, 0.24, 0.42), 1, 0));
  const subY = useTransform(p, (v) => `${lerp(seg(v, 0.04, 0.38), 0, -16)}svh`);
  const stripOpacity = useTransform(p, (v) => lerp(seg(v, 0.03, 0.15), 1, 0));

  /* Film meta + registration marks on the settled panel (DOM) */
  const metaOpacity = useTransform(p, (v) => lerp(seg(v, 0.92, 0.98), 0, 1));
  const metaY = useTransform(p, (v) => lerp(seg(v, 0.92, 0.98), 10, 0));

  /* The card-beat side text (lusion's card + paragraph screen): slides
     in from the right while the film card holds, slides away as the
     balloon takes the frame. Copy is DRAFT pending Brad. */
  const sideIn = (v: number) => seg(v, 0.46, 0.54);
  const sideOut = (v: number) => seg(v, 0.66, 0.72);
  const sideOpacity = useTransform(p, (v) => sideIn(v) * (1 - sideOut(v)));
  const sideX = useTransform(
    p,
    (v) => lerp(sideIn(v), 48, 0) + lerp(sideOut(v), 0, -32),
  );
  const sidePointer = useTransform(p, (v) =>
    sideIn(v) > 0.5 && sideOut(v) < 0.5 ? "auto" : "none",
  );

  /* No-WebGL fallback: an honest simple rise into the framed panel */
  const fbOpacity = useTransform(p, (v) => lerp(seg(v, 0.5, 0.58), 0, 1));
  const fbY = useTransform(p, (v) => `${lerp(seg(v, 0.52, 0.9), 40, 0)}%`);
  const fbClip = useTransform(p, (v) => {
    const t = seg(v, 0.62, 0.92);
    return `inset(${lerp(t, 20, 4)}vw ${lerp(t, 20, 4)}vw round 24px)`;
  });

  if (reduced) return <HeroStatic />;

  return (
    <section data-theme="light" className="relative">
      <div ref={wrapRef} className="relative h-[320vh] md:h-[480vh]">
        <div className="sticky top-0 h-svh overflow-hidden">
          {/* The set piece: glass cube -> media card -> framed panel.
              First in the stage so the statement paints ABOVE it: the
              cube passes behind the text. */}
          {webgl !== false ? (
            <div aria-hidden className="absolute inset-0">
              <HeroCanvas
                progress={p}
                poster={HERO_POSTER}
                video={HERO_VIDEO}
                active={onScreen}
              />
            </div>
          ) : (
            /* No WebGL: simple rise, no cube */
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
            <a
              href="/results/"
              className="mt-8 flex items-center justify-between border-b border-sec-line pb-3 text-body font-bold text-sec-ink transition-colors hover:border-sec-ink"
            >
              See the Results
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
      <InfoBar className="relative pt-2" links={[{ label: "Results", href: "/results/" }]} />
    </section>
  );
}
