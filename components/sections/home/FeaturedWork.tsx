"use client";

import Link from "next/link";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useScrollCheckpoints } from "@/components/motion/useScrollCheckpoints";
import { useWebGLSupport } from "@/components/motion/useWebGLSupport";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { FEATURED_WORK, type WorkEntry } from "@/lib/featured-work";
import { EDGE } from "@/lib/layout";
import { EASE } from "@/lib/motion";
import {
  PANEL_BAR_VH,
  PANEL_HANDOFF,
  lerp,
  seg,
  smooth,
  workMorph,
  workMorphBands,
} from "@/lib/work-panel";
import { cn } from "@/lib/utils";

/* Featured work (2b.featured-work.md v2, Brad's direction 2026-08-24):
   the portfolio moment, lusion's work grid at lusion's scale. NO rails,
   no hairline framing, no mono instrument row: a display-scale
   headline, a small support paragraph pinned right, then 6 oversized
   media cards on a near-full-bleed 2-column grid with display-scale
   titles. Each card opens its case study at /results/[slug]/.

   PLACEMENT: the section rises INTO the hero's release beat (round 3:
   deep enough that the headline parks in the upper third). Because of
   that overlap the header text would ride up OVER the settled film
   panel while the panel is still on screen (round 4), so on the canvas
   path the header is scroll-GATED: hidden while the film beats play,
   and a quick load-in (baseline rise + support fade) fires once the
   section has climbed clear, re-arming if you scroll back up so the
   text can never sit over the film. The pull-up and the gate are both
   skipped when the hero has no canvas tail (reduced motion, no WebGL).

   Cube companion + WORK PANEL MORPH (2b v3, Brad 2026-08-24): the
   reform lands the cube at REFORM_END (HomeCanvas), in the whitespace
   between the headline and the support column. As the grid scrolls in,
   the cube flattens into a brand-blue slab and ONE shared blue panel
   (`data-work-panel`) grows out of it behind all six cards, wearing a
   RoughAnnotation box squiggle once settled; off the grid's far edge
   the panel collapses back into the cube, which resumes its journey.
   Both actors run off the same measured clock in lib/work-panel: the
   canvas Tracker and the useAnimationFrame below read the same
   untransformed box every frame, so no state crosses the boundary.
   The grid content sits in a data-theme="accent" scope (transparent
   ground override) so tags and titles read white on the panel. */

/* the text load-in: quick rise from the baseline mask + support fade;
   hiding is faster and quiet (it happens while scrolling back into
   the film beats) */
const lineRise: Variants = {
  hidden: { y: "112%", transition: { duration: 0.3, ease: EASE.house } },
  show: { y: "0%", transition: { duration: 0.65, ease: EASE.house } },
};
const supportRise: Variants = {
  hidden: { opacity: 0, y: 14, transition: { duration: 0.2, ease: EASE.house } },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE.house, delay: 0.14 },
  },
};

const SUPPORT_COPY =
  "A selection of work for multi-location and franchise brands. Open any project for the full story and the numbers behind it.";

function WorkCard({ work, index }: { work: WorkEntry; index: number }) {
  return (
    <Link href={`/results/${work.slug}/`} className="group block">
      {/* media: the biggest objects on the page after the hero film */}
      <div className="relative aspect-[3/2] overflow-hidden rounded-[24px] bg-darkpanel">
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-[600ms] ease-house",
            "group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
          )}
        >
          {work.media ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={work.media}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <>
              <span
                aria-hidden
                className="absolute -bottom-[0.14em] right-6 font-display text-[clamp(140px,12vw,260px)] leading-none text-ondark opacity-[0.07]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="absolute bottom-5 left-6 font-mono text-mono-sm uppercase text-ondarkmid">
                [PLACEHOLDER: case film]
              </span>
            </>
          )}
        </div>
      </div>

      {/* tags, lusion's dot-separated mono row */}
      <p className="mt-6 font-mono text-mono-sm uppercase text-sec-mid md:mt-7">
        {work.tags.join(" • ")}
      </p>

      {/* display-scale title; the arrow leads it in on hover */}
      <div className="relative mt-2 overflow-hidden">
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-0 -translate-x-6 font-display text-menu text-sec-ink opacity-0",
            "transition-[transform,opacity] duration-[250ms] ease-house",
            "group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:hidden",
          )}
        >
          →
        </span>
        <h3
          className={cn(
            "font-display text-menu text-sec-ink",
            "transition-transform duration-[250ms] ease-house",
            "group-hover:translate-x-[1.15em] motion-reduce:transition-none motion-reduce:group-hover:transform-none",
          )}
        >
          {work.title}
        </h3>
      </div>
    </Link>
  );
}

export function FeaturedWork() {
  const reduced = useReducedMotionSafe();
  const webgl = useWebGLSupport();
  /* rise into the hero's release beat only when the canvas hero runs
     (its stage tail is empty paper); the static/fallback heroes end
     settled and get the normal section rhythm instead */
  const overlap = !reduced && webgl !== false;

  /* header gate: progress 0 = header top at the viewport bottom,
     1 = header top 25% from the viewport top. Show once the section
     has climbed clear of the film panel (~46svh), hide again below
     ~55svh, so the text never sits over the film. */
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "start 0.25"],
  });
  const [shown, setShown] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    /* mobile's shallower pull-up (-48svh) parks the header lower at
       the release beat, so its thresholds sit lower too */
    const mobileT = typeof window !== "undefined" && window.innerWidth < 768;
    const showAt = mobileT ? 0.5 : 0.72;
    const hideAt = mobileT ? 0.4 : 0.6;
    if (v >= showAt) setShown(true);
    else if (v <= hideAt) setShown(false);
  });

  /* the work panel morph, DOM side (lib/work-panel v6, pin-runway
     driven; canvas-led to the handoff): the section's header + grid
     PIN inside the stage wrapper, and ~110svh of runway scrubs the
     whole choreography 1:1 like the hero film (round 8, Brad: the
     position-driven clock capped everything at ~0.5vh and it "just
     shoots straight there"). The CANVAS slab plays the whole cube ->
     bar transition; the DOM panel exists only from PANEL_HANDOFF,
     opacity-swapped over the slab's identical geometry, then sweeps
     scaleY down behind the cards. No fade-in: the swap is between two
     same-color same-shape rects. Measured off the UNTRANSFORMED pin
     elements and panel box so transforms never feed back. */
  const stageRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const panelBoxRef = useRef<HTMLDivElement>(null);
  const panelScaleX = useMotionValue(1);
  const panelScaleY = useMotionValue(overlap ? PANEL_BAR_VH : 1);
  const panelOpacity = useMotionValue(overlap ? 0 : 1);
  const panelOrigin = useMotionValue("50% 0%");
  const borderOpacity = useMotionValue(overlap ? 0 : 1);
  /* caption ink rides the same clock (0 section ink -> 1 on-accent)
     so tags and titles are never white on bare paper */
  const captionMix = useMotionValue(overlap ? 0 : 1);
  const [borderActive, setBorderActive] = useState(false);

  useAnimationFrame(() => {
    if (!overlap) return;
    const stageEl = stageRef.current;
    const pinEl = pinRef.current;
    const el = panelBoxRef.current;
    if (!stageEl || !pinEl || !el) return;
    const vh = window.innerHeight;
    const r = el.getBoundingClientRect();
    const { morph: m, exiting } = workMorph(
      stageEl.getBoundingClientRect(),
      pinEl.getBoundingClientRect(),
      r.bottom,
      vh,
    );
    /* the bar as a fraction of this panel's height: the scaleY start
       that makes the DOM slice equal the canvas slab exactly */
    const barFrac = (PANEL_BAR_VH * vh) / Math.max(1, r.height);
    panelOrigin.set(exiting ? "50% 100%" : "50% 0%");
    if (window.innerWidth < 768) {
      /* mobile has no cube by the time the grid arrives (it fades out
         over the section top), so the DOM bar leads its own morph:
         grow wide from a small slab, then sweep, instead of popping
         in at the handoff with no actor before it */
      panelOpacity.set(seg(m, [0.5, 0.6]));
      panelScaleX.set(lerp(smooth(seg(m, [0.5, PANEL_HANDOFF])), 0.14, 1));
      panelScaleY.set(lerp(smooth(seg(m, [0.6, 1])), barFrac, 1));
    } else {
      panelOpacity.set(seg(m, [PANEL_HANDOFF, PANEL_HANDOFF + 0.02]));
      panelScaleX.set(1);
      panelScaleY.set(lerp(smooth(seg(m, [PANEL_HANDOFF + 0.02, 1])), barFrac, 1));
    }
    captionMix.set(seg(m, [0.84, 0.96]));
    borderOpacity.set(seg(m, [0.96, 0.995]));
    if (m > 0.99) setBorderActive(true);
  });

  /* the morph's scroll checkpoints (STYLE_GUIDE 7.4): the pin runway
     and the exit window. Idle-parking mid-runway plays the beat to
     the nearer end; outside them the hook is inert. (Round 8: the
     round-7 single film-to-panel band auto-glided the whole journey
     off one wheel notch and is reverted.) */
  const morphBands = useCallback(() => {
    const stageEl = stageRef.current;
    const pinEl = pinRef.current;
    const el = panelBoxRef.current;
    if (!stageEl || !pinEl || !el) return [] as [number, number][];
    return workMorphBands(
      stageEl.getBoundingClientRect(),
      pinEl.getBoundingClientRect(),
      el.getBoundingClientRect().bottom,
      window.innerHeight,
      window.scrollY,
    );
  }, []);
  useScrollCheckpoints(panelBoxRef, { bands: morphBands, enabled: overlap });

  /* static/fallback paths (reduced motion, no WebGL): the panel is
     simply there, border drawn on entry, no morph */
  useEffect(() => {
    if (overlap) return;
    panelScaleX.set(1);
    panelScaleY.set(1);
    panelOpacity.set(1);
    panelOrigin.set("50% 0%");
    borderOpacity.set(1);
    captionMix.set(1);
  }, [overlap, panelScaleX, panelScaleY, panelOpacity, panelOrigin, borderOpacity, captionMix]);

  return (
    <Section
      theme="light"
      size="none"
      anchor="work"
      className={cn(
        "pb-section-y-lg",
        /* deep enough that the headline sits in the upper third at the
           release rest beat (Brad round 3), shallow enough that the
           section's top edge stays clear of the settled film panel
           until the reform starts pulling it in */
        overlap ? "-mt-[48svh] pt-[2svh] md:-mt-[72svh]" : "pt-section-y",
      )}
    >
      <div className="relative z-10">
        {/* the pin stage (round 8, lib/work-panel): the wrapper is
            taller than its sticky child by the RUNWAY, so the header
            + grid freeze at the release composition while the runway
            scroll scrubs the whole morph 1:1, hero-film style. Both
            morph actors read these two rects; pin progress needs no
            configured offsets (child.top - wrapper.top over the
            height difference). Fallback paths render no runway, so
            the pin never engages and the clock reads settled. */}
        <div ref={stageRef} data-work-stage>
        <div ref={pinRef} data-work-pin className={cn(overlap && "sticky top-[6svh]")}>
        {/* header: huge left, small support pinned right (lusion) */}
        <div
          ref={headerRef}
          className={cn(EDGE, "md:flex md:items-start md:justify-between md:gap-12")}
        >
          {overlap ? (
            <>
              <div className="overflow-hidden">
                <motion.h2
                  initial={false}
                  animate={shown ? "show" : "hidden"}
                  variants={lineRise}
                  className="font-display text-display text-sec-ink"
                >
                  Featured work
                </motion.h2>
              </div>
              <motion.div
                initial={false}
                animate={shown ? "show" : "hidden"}
                variants={supportRise}
                className="mt-8 md:mt-4 md:max-w-[38ch] md:shrink-0 md:basis-[30%]"
              >
                <p className="text-[13px] font-medium uppercase leading-[1.7] tracking-[0.08em] text-sec-mid">
                  {SUPPORT_COPY}
                </p>
              </motion.div>
            </>
          ) : (
            <>
              <BaselineReveal
                as="h2"
                className="font-display text-display text-sec-ink"
              >
                Featured work
              </BaselineReveal>
              <Reveal className="mt-8 md:mt-4 md:max-w-[38ch] md:shrink-0 md:basis-[30%]">
                <p className="text-[13px] font-medium uppercase leading-[1.7] tracking-[0.08em] text-sec-mid">
                  {SUPPORT_COPY}
                </p>
              </Reveal>
            </>
          )}
        </div>

        <div className="relative mt-16 md:mt-[14svh]">
          {/* the shared blue panel: ONE box behind all six cards. The
              untransformed outer div is the measured morph box (canvas
              Tracker reads it too); the inner motion div is the visual
              that grows/collapses at the live edge's growth point. */}
          <div
            ref={panelBoxRef}
            data-work-panel
            aria-hidden
            className="pointer-events-none absolute inset-x-[max(2.5vw,20px)] -bottom-[clamp(28px,3vw,56px)] -top-[clamp(64px,10vh,128px)]"
          >
            <motion.div
              data-theme="accent"
              style={{
                scaleX: panelScaleX,
                scaleY: panelScaleY,
                opacity: panelOpacity,
                transformOrigin: panelOrigin,
              }}
              className="absolute inset-0 rounded-[32px]"
            />
            {/* edge squiggle in the panel's OWN blue, riding the box
                edge: the inside half vanishes into the fill and only
                the wobble escaping onto the paper shows, so the edge
                reads hand-drawn (round 6: a white inner line clashed).
                Sits outside the scaled div: never distorted, and it
                only shows once the panel is settled anyway. */}
            <motion.div style={{ opacity: borderOpacity }} className="absolute inset-0">
              <RoughAnnotation
                variant="box"
                stroke="var(--acc)"
                active={overlap ? borderActive : undefined}
                className="absolute inset-0 block"
              >
                {null}
              </RoughAnnotation>
            </motion.div>
          </div>

          {/* caption ink scope: the sec-* tokens crossfade with the
              morph clock (via --wp) between the section's light-theme
              ink and the on-accent white, so tags and titles track the
              panel instead of jumping theme. color-mix keeps the
              tokens live for every sec-* consumer inside. */}
          <motion.div
            style={
              {
                "--wp": captionMix,
                "--sec-ink":
                  "color-mix(in srgb, var(--onacc) calc(var(--wp) * 100%), var(--ink))",
                "--sec-mid":
                  "color-mix(in srgb, rgba(255, 255, 255, 0.72) calc(var(--wp) * 100%), var(--mid))",
              } as React.ComponentProps<typeof motion.div>["style"]
            }
            className={cn(
              EDGE,
              "relative grid grid-cols-1 gap-x-[2vw] gap-y-20 md:grid-cols-2 md:gap-y-36",
            )}
          >
            {FEATURED_WORK.map((work, i) => (
              <Reveal key={work.slug} delay={i % 2 === 1 ? 0.12 : 0}>
                <WorkCard work={work} index={i} />
              </Reveal>
            ))}
          </motion.div>
        </div>
        </div>
        {/* the RUNWAY: sticky offsets are constrained to the parent's
            CONTENT box, so this must be a real spacer element: as
            wrapper padding the pin has zero room and never sticks
            (found live, round 8) */}
        {overlap && <div aria-hidden className="h-[70svh] md:h-[110svh]" />}
        </div>

        <Reveal className="mt-20 flex justify-center md:mt-32">
          <Pill href="/results/" variant="secondary" className="max-md:mx-[max(5vw,40px)] max-md:w-full max-md:justify-center">
            See All Results
          </Pill>
        </Reveal>
      </div>
    </Section>
  );
}
