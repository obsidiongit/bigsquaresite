"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useScrollCheckpoints } from "@/components/motion/useScrollCheckpoints";
import { DayGrid } from "@/components/sections/home/DayGrid";
import { PhaseReadout } from "@/components/sections/home/PhaseReadout";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";
import { EASE, IN_VIEW_MARGIN } from "@/lib/motion";
import { PHASES, TOTAL_DAYS } from "@/lib/ninety-days";
import { cn } from "@/lib/utils";

/* First 90 days (10.how-it-works.md v3.1, Brad's round 2 2026-08-25):
   the plan with dates as the page's closing set piece. The featured-
   work blue slab returns holding 90 day-cells (10 x 9, rows map to
   phases), and the section literally builds a big square out of
   little ones, ending in the site's CTA.

   ROUND 2 CHANGES (all four of Brad's notes):
   1. PINNED RUNWAY. Round 1's plain scroll map played the whole fill
      in ~1.5 viewports ("just happens way too fast... needs to lock
      and stop the scroll"). The stage (headline + slab) is now sticky
      inside a RUNWAY_SVH runway on desktop and the day clock scrubs
      1:1 over the pin, FeaturedWork's proven architecture (sticky
      needs the runway as SIBLING content, never wrapper padding).
      This is the page's THIRD pin, on Brad's explicit call,
      superseding the v3 spec's no-pin decision.
   2. CALM SCRUB. Hover no longer drives the clock (accidental
      mouse-over read as chaos); DayGrid highlights under the pointer
      and scrubs only on press-drag, and the clock CHASES the drag
      target with a distance-scaled tween so far jumps cascade in
      day order instead of teleporting.
   3. SCROLL-GATED MERGE. The 90-to-one-square merge fires on its own
      pin beat, never from the day value, so dragging to the last
      cell can no longer white the board out mid-play.
   4. THE FINALE. At day 90 the merged square is no longer a blank
      ending: a white panel grows out of it across the slab and
      becomes the section's CTA (Youtech's closing frame, translated):
      the closing line with a hand-drawn circle on "day 90", a
      Schedule a Call pill, a boiling white edge squiggle, and a
      hand-drawn smiley (Brad's ask; the moodboard's playful-out rule
      is overridden here by his direction). This finale IS the page's
      closing ask: the homepage-close restructure (Brad, footer
      session 2026-08-25) ends the page FirstNinetyDays -> footer,
      superseding the standalone 2H CTA band and retiring the
      homepage testimonial and FAQ.

   ROUND 3 (Brad 2026-08-30): the fill scrub dragged ("takes way too
   long") and the day-90 payoff was sparse. Runway halved and beats
   rebalanced so the finale owns the back half; the fill map gets a
   mild smoothstep; the payoff gains a staggered ink cascade (circle,
   starburst, arrow, smiley), a one-shot square-confetti burst as the
   panel takes over, and a landing pop on the day numeral. No new
   copy: every addition is aria-hidden decoration.

   One value still drives the clock: `day` 0..90 on a motion value.
   Scroll owns it (pin progress on desktop, a slab-based map on
   mobile where the stage is taller than the viewport and a pin
   cannot hold); dragging the grid takes it and release eases back.
   The finale runs on a second motion value (`expandMv`) driven by
   the pin's tail on desktop and a one-shot latch on mobile.

   A checkpoint band covers merge-through-finale so an idle park can
   never sit half-merged; fill beats stay free (drag-scrubbing is
   the point there).

   Copy is DRAFT until Brad's pass. Every milestone day number is
   invented pending confirmation (lib/ninety-days.ts owns them).

   Reduced motion: settled end state, no pin, no runway. Slab open,
   grid merged, finale panel visible with everything drawn, the full
   plan as a static visible list below. Zero animating elements
   (plain elements, never gated motion wrappers: framer never fires
   `animate` on elements mounted before the reduced flag flips). */

/* the slab entry: clip-path grow from a small centred square to the
   full padded box (same template both ends so framer interpolates) */
const CLIP_CLOSED = "inset(48% 49% round 8px)";
const CLIP_OPEN = "inset(0% 0% round 8px)";

/* pin beats, in 0..1 of the runway (round 3 rebalance: the fill owns
   the front 40%, the merge-expand payoff owns the back half). Scrub
   rate per the 7.4 rule: fill = 0.40 x 80svh = 32svh of scroll for
   90 days, ~2.8 days per svh average (the smoothstep peaks ~4.2
   mid-fill and lands soft), up from round 2's ~0.97 days/svh over
   the old 160svh runway. Beat order is load-bearing: merge strictly
   after fill's end, expand strictly after merge, and the finaleInk
   latch (expandMv 0.9 = runway 0.775) inside the expand window. */
const FILL: [number, number] = [0.02, 0.42];
const MERGE_AT = 0.48;
const EXPAND: [number, number] = [0.55, 0.8];
/* the checkpoint band: merge start (just before, so a park at the
   cusp resolves) through the runway's end. Locked to MERGE_AT per
   STYLE_GUIDE 7.4's hard lesson (the band starts where the
   choreography commits): move these two together, always. */
const BAND_FROM = 0.45;

const RUNWAY_SVH = 80;
/* RoughAnnotation's SVG bleed pad, reused for the finale clip math */
const PAD = 16;

/* square confetti (round 3): burst size and per-index jitter. Seeded
   per house rule (no Math.random, identical every play): the sin-hash
   gives a stable 0..1 per (index, salt). */
const CONFETTI_COUNT = 18;
const cJit = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export function FirstNinetyDays() {
  const reduced = useReducedMotionSafe();
  const wrapRef = useRef<HTMLDivElement>(null);
  const slabRef = useRef<HTMLDivElement>(null);
  const gridBoxRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const slabIn = useInView(slabRef, { once: true, margin: IN_VIEW_MARGIN });

  const desktopRef = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => (desktopRef.current = mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  /* ---- clocks ---------------------------------------------------- */
  /* pin progress: 0 when the runway wrapper tops the viewport, 1 when
     its bottom meets the viewport bottom */
  const { scrollYProgress: pinP } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  /* mobile clock: the slab's own approach, no pin */
  const { scrollYProgress: slabP } = useScroll({
    target: slabRef,
    offset: ["start end", "center 0.6"],
  });

  const dayMv = useMotionValue(0);
  const expandMv = useMotionValue(0);
  const [day, setDay] = useState(0);
  const [complete, setComplete] = useState(false);
  const [finaleInk, setFinaleInk] = useState(false);
  const [burst, setBurst] = useState(false);
  const manual = useRef({ pointer: false, focus: false });
  const scrollDayRef = useRef(0);
  const mobLatchRef = useRef(false);
  const animRef = useRef<AnimationPlaybackControls | null>(null);

  const stopAnim = () => {
    animRef.current?.stop();
    animRef.current = null;
  };

  useMotionValueEvent(pinP, "change", (v) => {
    if (reduced || !desktopRef.current) return;
    const raw = Math.min(1, Math.max(0, (v - FILL[0]) / (FILL[1] - FILL[0])));
    /* mild smoothstep on the fill map: at the halved runway a linear
       map reads as a metronome tick; easing the ends lets the first
       rows gather and the last rows land with a flourish */
    const t = raw * raw * (3 - 2 * raw);
    scrollDayRef.current = t * TOTAL_DAYS;
    if (!manual.current.pointer && !manual.current.focus) {
      stopAnim();
      dayMv.set(scrollDayRef.current);
    }
    setComplete(v >= MERGE_AT);
    expandMv.set(
      Math.min(1, Math.max(0, (v - EXPAND[0]) / (EXPAND[1] - EXPAND[0]))),
    );
  });

  useMotionValueEvent(slabP, "change", (v) => {
    if (reduced || desktopRef.current) return;
    scrollDayRef.current = v * TOTAL_DAYS;
    if (!manual.current.pointer && !manual.current.focus) {
      stopAnim();
      dayMv.set(scrollDayRef.current);
    }
    /* no pin on mobile: the merge and the finale latch once, when the
       scroll clock (never the drag) completes the fill */
    if (scrollDayRef.current >= TOTAL_DAYS && !mobLatchRef.current) {
      mobLatchRef.current = true;
      setComplete(true);
      animate(expandMv, 1, { duration: 0.9, ease: EASE.swoop, delay: 0.45 });
    }
  });

  useMotionValueEvent(dayMv, "change", (v) => {
    const d = Math.min(TOTAL_DAYS, Math.max(0, Math.round(v)));
    setDay((prev) => (prev === d ? prev : d));
  });

  useMotionValueEvent(expandMv, "change", (v) => {
    setFinaleInk((prev) => (v >= 0.9 ? true : v < 0.85 ? false : prev));
    /* the confetti one-shot: latch the moment EXPAND begins, release
       only once the expand fully unwinds so a scroll-back can replay
       the burst without it stuttering at the cusp */
    setBurst((prev) => (v >= 0.04 ? true : v <= 0.005 ? false : prev));
  });

  /* ---- drag scrub: chase the target, never teleport --------------- */
  const handleScrub = useCallback(
    (d: number, smooth = false) => {
      stopAnim();
      const dist = Math.abs(d - dayMv.get());
      const dur = smooth ? 0.18 : Math.min(0.55, 0.1 + dist * 0.012);
      animRef.current = animate(dayMv, d, { duration: dur, ease: EASE.house });
    },
    [dayMv],
  );

  const setManual = useCallback(
    (kind: "pointer" | "focus", on: boolean) => {
      manual.current[kind] = on;
      stopAnim();
      if (!on && !manual.current.pointer && !manual.current.focus) {
        /* hand back to scroll: ease to the scroll-derived day */
        animRef.current = animate(dayMv, scrollDayRef.current, {
          duration: 0.45,
          ease: EASE.house,
        });
      }
    },
    [dayMv],
  );

  /* ---- checkpoint band over merge + finale ------------------------ */
  const bands = useCallback((): [number, number][] => {
    const wrap = wrapRef.current;
    if (!wrap || !desktopRef.current) return [];
    const span = wrap.offsetHeight - window.innerHeight;
    if (span <= 0) return [];
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    return [[top + BAND_FROM * span, top + span]];
  }, []);
  useScrollCheckpoints(wrapRef, {
    bands,
    enabled: !reduced,
    glideMsPerVh: 1600,
  });

  /* ---- finale geometry: the white panel grows out of the merged
     grid square. Measured, not guessed: the clip's closed state is
     the grid's rect within the panel's padded box. -------------------- */
  const geomRef = useRef({ top: 40, right: 40, bottom: 40, left: 40 });
  useEffect(() => {
    const measure = () => {
      const p = panelRef.current;
      const g = gridBoxRef.current;
      if (!p || !g) return;
      const pr = p.getBoundingClientRect();
      const gr = g.getBoundingClientRect();
      geomRef.current = {
        top: gr.top - pr.top,
        left: gr.left - pr.left,
        right: pr.right - gr.right,
        bottom: pr.bottom - gr.bottom,
      };
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const finaleClip = useTransform(expandMv, (t) => {
    const m = geomRef.current;
    const e = 1 - t;
    return `inset(${(m.top + PAD) * e}px ${(m.right + PAD) * e}px ${(m.bottom + PAD) * e}px ${(m.left + PAD) * e}px round ${4 + 16 * t}px)`;
  });
  const panelOp = useTransform(expandMv, [0, 0.02], [0, 1]);
  const contentOp = useTransform(expandMv, [0.72, 1], [0, 1]);

  const shownDay = reduced ? TOTAL_DAYS : day;
  const showComplete = reduced || complete;

  /* ---- finale panel content (shared between paths) ----------------
     Round 3 ink cascade: all four annotations fire off the one
     finaleInk latch, sequenced by draw delay (circle 0, starburst
     0.5, arrow 0.95, smiley 1.35) so completions roll in that order
     rather than landing as one splat. All decorative pieces are
     aria-hidden and pointerless; every retract (rearm) unwinds them
     together when the latch drops. */
  const finaleContent = (
    <div
      data-theme="light"
      className="relative flex h-full w-full flex-col items-center justify-center gap-8 px-6 text-center md:gap-10"
    >
      <p className="max-w-[24ch] font-display text-h2 text-sec-ink">
        By{" "}
        <RoughAnnotation
          variant="circle"
          active={reduced ? undefined : finaleInk}
          rearm={!reduced}
          staticRender={reduced}
        >
          <span className="relative whitespace-nowrap">
            day 90
            {/* the starburst pops off the circle's shoulder; nested in
                the circled phrase so it tracks the words through any
                wrap or resize */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-9 -top-8 md:-right-11 md:-top-10"
            >
              <RoughAnnotation
                variant="starburst"
                active={reduced ? undefined : finaleInk}
                delay={0.5}
                rearm={!reduced}
                staticRender={reduced}
                className="block size-9 md:size-12"
              >
                {null}
              </RoughAnnotation>
            </span>
          </span>
        </RoughAnnotation>{" "}
        you will know exactly what every dollar did.
      </p>
      {/* the accent-scope pill inversion would render this white on
          white (globals 6.1: [data-theme="accent"] .pill-primary);
          the finale panel is paper inside the blue slab, so force the
          standard fill back on */}
      <div className="relative">
        <Link
          href="/schedule/"
          className="pill pill-primary !bg-acc !text-onacc"
        >
          <span className="pill-label">Schedule a Call</span>
        </Link>
        {/* the arrow rides the pill's box (not the panel) so its tip
            aims at the pill's left edge at every breakpoint */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-8 h-12 w-12 -rotate-6 md:-left-20 md:-top-10 md:h-14 md:w-14"
        >
          <RoughAnnotation
            variant="arrow"
            active={reduced ? undefined : finaleInk}
            delay={0.95}
            rearm={!reduced}
            staticRender={reduced}
            className="block h-full w-full"
          >
            {null}
          </RoughAnnotation>
        </div>
      </div>
      {/* the smiley doodle, tilted into the top-right whitespace; the
          cascade's closing beat */}
      <div className="pointer-events-none absolute right-[5%] top-[7%] rotate-6 md:right-[8%] md:top-[10%]">
        <RoughAnnotation
          variant="smiley"
          active={reduced ? undefined : finaleInk}
          delay={1.35}
          rearm={!reduced}
          staticRender={reduced}
          className="block size-12 md:size-16 lg:size-20"
        >
          {null}
        </RoughAnnotation>
      </div>
    </div>
  );

  return (
    <Section theme="light" size="base" id="ninety-days">
      {/* runway wrapper: taller than its sticky child by RUNWAY_SVH on
          the desktop motion path, so the stage freezes while the pin
          progress scrubs the fill, the merge, and the finale 1:1.
          Sticky offsets need the runway as sibling CONTENT (a spacer
          div), never wrapper padding (FeaturedWork round 8 lesson). */}
      <div ref={wrapRef} className={cn(EDGE, "relative z-10")}>
        {/* sticky offset clears the fixed 72px nav (found by screenshot:
            4svh parked the headline's first line behind the bar) */}
        <div className={cn(!reduced && "md:sticky md:top-[max(88px,4svh)]")}>
          <BaselineReveal
            as="h2"
            className="max-w-[24ch] font-display text-h2 text-sec-ink"
          >
            Here is what happens after you say yes.
          </BaselineReveal>
          <Reveal className="mt-6">
            <p className="max-w-[46ch] text-body text-sec-mid">
              No long onboarding. No guessing. A plan with dates.
            </p>
          </Reveal>

          {/* ---- the slab --------------------------------------- */}
          <div ref={slabRef} className="relative mt-12 md:mt-14">
            {/* slab visual, absolute behind the content: the padded
                -inset-4 box lets the squiggle's outside wobble survive
                the grow clip; fill and ink reveal under one edge. */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {reduced ? (
                <>
                  <div
                    data-theme="accent"
                    className="absolute inset-0 rounded-[32px]"
                  />
                  <RoughAnnotation
                    variant="box"
                    stroke="var(--acc)"
                    instant
                    className="absolute inset-0 block"
                  >
                    {null}
                  </RoughAnnotation>
                </>
              ) : (
                <motion.div
                  className="absolute -inset-4"
                  initial={{ clipPath: CLIP_CLOSED }}
                  animate={slabIn ? { clipPath: CLIP_OPEN } : undefined}
                  transition={{ duration: 0.7, ease: EASE.house }}
                >
                  <div
                    data-theme="accent"
                    className="absolute inset-4 rounded-[32px]"
                  />
                  <RoughAnnotation
                    variant="box"
                    stroke="var(--acc)"
                    instant
                    active={slabIn}
                    className="absolute inset-4 block"
                  >
                    {null}
                  </RoughAnnotation>
                </motion.div>
              )}
            </div>

            {/* slab content: accent scope, transparent ground (the
                fill is the layer behind). Plain div under reduced
                motion, motion fade otherwise. */}
            {(() => {
              const contentClass =
                "relative grid items-center gap-10 p-[clamp(24px,4vw,56px)] lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)] lg:gap-x-[clamp(40px,6vw,96px)]";
              const content = (
                <>
                  <div ref={gridBoxRef}>
                    <DayGrid
                      day={shownDay}
                      complete={showComplete}
                      inert={reduced}
                      onScrub={handleScrub}
                      onScrubStart={() => setManual("pointer", true)}
                      onScrubEnd={() => setManual("pointer", false)}
                      onFocusChange={(on) => setManual("focus", on)}
                    />
                  </div>
                  <div aria-hidden>
                    <PhaseReadout day={shownDay} reduced={reduced} />
                  </div>
                </>
              );
              return reduced ? (
                <div
                  data-theme="accent"
                  style={{ background: "transparent" }}
                  className={contentClass}
                >
                  {content}
                </div>
              ) : (
                <motion.div
                  data-theme="accent"
                  style={{ background: "transparent" }}
                  initial={{ opacity: 0 }}
                  animate={slabIn ? { opacity: 1 } : undefined}
                  transition={{ duration: 0.45, ease: EASE.house, delay: 0.35 }}
                  className={contentClass}
                >
                  {content}
                </motion.div>
              );
            })()}

            {/* ---- the finale panel: the merged square becomes the
                CTA. Hidden until the expand beat (its closed clip is
                exactly the grid's rect, so it takes over seamlessly),
                then grows across the slab leaving a blue ring, wearing
                its own boiling white squiggle. ----------------------- */}
            <div
              ref={panelRef}
              className="pointer-events-none absolute inset-[clamp(10px,1.4vw,20px)] z-20"
            >
              {reduced ? (
                <>
                  <div
                    className="absolute inset-0 rounded-[24px]"
                    style={{ background: "var(--onacc)" }}
                  />
                  <RoughAnnotation
                    variant="box"
                    stroke="var(--onacc)"
                    instant
                    className="absolute inset-0 block"
                  >
                    {null}
                  </RoughAnnotation>
                  <div className="pointer-events-auto absolute inset-0">
                    {finaleContent}
                  </div>
                </>
              ) : (
                <motion.div
                  style={{ clipPath: finaleClip, opacity: panelOp }}
                  className="absolute -inset-4"
                >
                  <div
                    className="absolute inset-4 rounded-[24px]"
                    style={{ background: "var(--onacc)" }}
                  />
                  <RoughAnnotation
                    variant="box"
                    stroke="var(--onacc)"
                    instant
                    active={complete}
                    className="absolute inset-4 block"
                  >
                    {null}
                  </RoughAnnotation>
                  <motion.div
                    style={{ opacity: contentOp }}
                    className={cn(
                      "absolute inset-4",
                      finaleInk ? "pointer-events-auto" : "pointer-events-none",
                    )}
                  >
                    {finaleContent}
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* ---- square confetti: a one-shot celebration burst as
                EXPAND begins. Brand squares scatter up and out of the
                merged grid rect, above the growing panel (z-30 over
                its z-20) so they read against the arriving paper.
                Position comes from the already-measured grid geometry
                (geomRef is populated on mount, long before the latch
                can fire); the flight is transform + opacity only, and
                the whole layer exists only while the burst is latched.
                Motion path only: never rendered under reduced motion.
                overflow-hidden is load-bearing: transformed squares
                extend scrollable overflow, and flights past the stage
                edge widened scrollWidth to 412px at 375 (the squares
                are near opacity 0 out there, so the clip never shows). */}
            {!reduced && burst && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-[clamp(10px,1.4vw,20px)] z-30 overflow-hidden"
              >
                <div
                  className="absolute"
                  style={{
                    top: geomRef.current.top,
                    left: geomRef.current.left,
                    right: geomRef.current.right,
                    bottom: geomRef.current.bottom,
                  }}
                >
                  {Array.from({ length: CONFETTI_COUNT }, (_, i) => {
                    /* fan the squares around the rect's edge, fly them
                       outward along their own bearing with an upward
                       bias; all jitter is seeded per index */
                    const a =
                      (i / CONFETTI_COUNT) * Math.PI * 2 + cJit(i, 1) * 0.6;
                    const size = 5 + Math.round(cJit(i, 2) * 5);
                    const fly = 70 + cJit(i, 3) * 110;
                    const dur = 0.85 + cJit(i, 7) * 0.45;
                    return (
                      <motion.span
                        key={i}
                        className="absolute block"
                        style={{
                          left: `${50 + Math.cos(a) * 46}%`,
                          top: `${50 + Math.sin(a) * 46}%`,
                          width: size,
                          height: size,
                          background:
                            i % 3 === 0 ? "var(--sec-ink)" : "var(--acc)",
                        }}
                        initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
                        animate={{
                          x: Math.cos(a) * fly,
                          y:
                            Math.sin(a) * fly * 0.7 -
                            (80 + cJit(i, 4) * 100),
                          rotate:
                            (cJit(i, 5) > 0.5 ? 1 : -1) *
                            (140 + cJit(i, 6) * 180),
                          opacity: [1, 1, 0],
                          scale: 0.55,
                        }}
                        transition={{
                          duration: dur,
                          ease: EASE.house,
                          delay: cJit(i, 8) * 0.12,
                          opacity: {
                            duration: dur,
                            /* per-value override drops the top-level
                               delay; restate it so the fade tracks
                               the flight */
                            delay: cJit(i, 8) * 0.12,
                            times: [0, 0.55, 1],
                            ease: "linear",
                          },
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* the runway spacer (motion desktop only) */}
        <div
          aria-hidden
          className={cn("hidden", !reduced && "md:block")}
          style={{ height: `${RUNWAY_SVH}svh` }}
        />
      </div>

      {/* ---- below the set piece -------------------------------- */}
      <div className={cn(EDGE, "relative z-10 mt-10")}>
        <p className="font-mono text-mono-sm uppercase text-sec-mid">
          [PLACEHOLDER: milestone days pending confirmation against the real
          onboarding]
        </p>

        {/* the full plan, always in the DOM: sr-only while the
            scrubbed panel presents it, VISIBLE under reduced motion */}
        <div
          className={reduced ? "mt-12 grid gap-10 md:grid-cols-3" : "sr-only"}
        >
          {PHASES.map((phase) => (
            <div key={phase.name}>
              <h3 className="font-display text-h3 text-sec-ink">
                Days {phase.days[0]} to {phase.days[1]}: {phase.name}
              </h3>
              <ol className="mt-4 space-y-2.5">
                {phase.milestones.map((m) => (
                  <li
                    key={m.day}
                    className="flex gap-3 text-small text-sec-mid"
                  >
                    <span className="shrink-0 font-mono text-mono-sm tabular-nums text-sec-acc">
                      {String(m.day).padStart(2, "0")}
                    </span>
                    {m.label}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
