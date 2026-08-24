"use client";

import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "framer-motion";
import { useRef, useState } from "react";
import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useWebGLSupport } from "@/components/motion/useWebGLSupport";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { FEATURED_WORK, type WorkEntry } from "@/lib/featured-work";
import { EDGE } from "@/lib/layout";
import { EASE } from "@/lib/motion";
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

   Cube companion: `work` anchor; the reform now lands the cube at
   REFORM_END right-of-center (HomeCanvas), in this header's open band;
   from there it slips down the grid's center seam toward trust. */

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

        <div
          className={cn(
            EDGE,
            "mt-16 grid grid-cols-1 gap-x-[2vw] gap-y-20 md:mt-[14svh] md:grid-cols-2 md:gap-y-36",
          )}
        >
          {FEATURED_WORK.map((work, i) => (
            <Reveal key={work.slug} delay={i % 2 === 1 ? 0.12 : 0}>
              <WorkCard work={work} index={i} />
            </Reveal>
          ))}
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
