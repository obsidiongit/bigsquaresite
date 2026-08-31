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
   the scrub timeline: 0.60 sits inside the fully-held card beat
   (side text and the v6.1 card-beat headline both in by 0.58, balloon
   not started until 0.62). The settled-panel rest sits at exactly
   HERO_K, the frame where the reform takes over: parking it earlier
   (the old 0.98K) left a dead zone ahead of the reform band that made
   its boundary feel sticky (Brad, 2026-08-24 review).

   Two hook instances (round 12): the reform band [K, 1] IS its whole
   beat, so per STYLE_GUIDE 7.4 it earns slow-glide pacing (work-morph
   precedent, 2600), while the Act-1 rests keep the approved 450
   default (the uniform 550/2200 tune once read as sluggish). The
   lists partition cleanly: each instance is inert outside its own
   range, and MIN_GLIDE_PX keeps both quiet at the shared K rest. */
const CHECKPOINTS_MAIN = [
  0, /* the statement */
  0.6 * HERO_K, /* the held film card: side text + card-beat headline */
  HERO_K, /* the settled framed panel, reform's doorstep */
];
const CHECKPOINTS_REFORM = [
  HERO_K, /* the settled framed panel, reform's doorstep */
  1, /* reform complete, the cube released as companion */
];
/* (Round 8, 2026-08-24: round 7 briefly dropped the release rest on
   the canvas path and merged everything to the work panel into one
   checkpoint band; a single wheel notch then auto-glided the whole
   journey. Reverted: the reform settles locally between K and 1 as
   before, and the featured work morph got real scroll room instead:
   a pinned runway of its own, see lib/work-panel.) */

const H1_LINE1 = ["More", "customers."];
const H1_LINE2 = ["More", "revenue", "you", "can"];

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

/* Fold strip, film meta ("Nº001 / ©2026") and "+" panel marks were
   cut 2026-08-29 (Brad: "not a fan"; registration marks retired per
   STYLE_GUIDE 4.3 changelog 2026-08-26). */

/* Static composition for prefers-reduced-motion: statement, then the
   film as a settled framed panel. No pin, no canvas, poster only. */
function HeroStatic() {
  return (
    <section data-theme="light" className="relative">
      <Container className="relative flex min-h-[82svh] flex-col justify-end pb-16 pt-32 md:pt-40">
        <h1 className="font-display text-display text-sec-ink">
          More customers. <br />
          More revenue you can{" "}
          <RoughAnnotation variant="circle" active className="whitespace-nowrap font-accent">
            count.
          </RoughAnnotation>
        </h1>
        <p className="mt-8 max-w-[44ch] text-lead text-sec-mid">
          BigSquare is the growth partner for brands that want proof. One
          team runs your ads, your search, your site, and your creative.
        </p>
      </Container>
      <div className="relative mx-[4vw] aspect-video max-h-svh overflow-hidden rounded-[24px] bg-darkpanel">
        <FilmMedia withVideo={false} />
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

  /* idle-settle to the nearest rest beat; input always wins (7.4).
     Split instances so the reform band alone gets slow-glide pacing:
     the auto-completed reform reads as the animation playing, not a
     450ms warp (Brad round 12: scrolling up "turns into a white box
     ... and zooms up", not enough delay). */
  useScrollCheckpoints(wrapRef, { checkpoints: CHECKPOINTS_MAIN, enabled: !reduced });
  useScrollCheckpoints(wrapRef, {
    checkpoints: CHECKPOINTS_REFORM,
    enabled: !reduced,
    glideMsPerVh: 2600,
    glideMaxMs: 3000,
  });

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
    /* settle margin matches the canvas panel: 6vw with a px floor so
       the frame clears the 72px nav bar on narrow desktops */
    const end =
      typeof window !== "undefined"
        ? Math.max(6, (96 / window.innerWidth) * 100)
        : 6;
    return `inset(${lerp(t, 20, end)}vw ${lerp(t, 20, end)}vw round 24px)`;
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
                    className="whitespace-nowrap font-accent"
                  >
                    <H1Word>count.</H1Word>
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
                  BigSquare is the growth partner for brands that want
                  proof. One team runs your ads, your search, your site, and
                  your creative.
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

        </div>
      </div>

      {/* No info bar here anymore: the featured work section rises
          into the release beat (2b.featured-work.md v2), so the hero
          hands straight off to it with nothing between. */}
    </section>
  );
}
