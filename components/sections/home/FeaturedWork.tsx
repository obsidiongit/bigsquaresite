"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { WorkMedia } from "@/components/shared/WorkMedia";
import { HOME_WORK, type WorkEntry } from "@/lib/featured-work";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

/* Featured work (rebuilt 2026-10-09; the cube-era version, its blue work
   panel, the travelling pencil, and six autoplaying reel clips are in
   project-guidelines/archive/retired-code). The review: "way too
   noisy... every single creative there is a video". Now it is a quiet
   gallery: six 4:5 pieces on the paper, mostly the studio's campaign
   posters, two reel films among them. The posters bring the colour; the
   page around them stays still.

   The films rest on a frame and play only while pointed at (a FILM chip
   says so); touch screens, which cannot point, play them while on
   screen. Each piece opens its page on /results/. The section sits
   right under the TV hero, which uncovers it as its blue breaks into
   squares (WorkClip stays paused while the hero covers it). */

const SUPPORT = "Posters, ads, and films from the BigSquare studio. Open any piece to see the work behind it.";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-[18px]", className)}>
      <path d="M4 12h15m0 0-6.5-6.5M19 12l-6.5 6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WorkCard({ work, index, hoverPlay }: { work: WorkEntry; index: number; hoverPlay: boolean }) {
  const [over, setOver] = useState(false);
  const film = !work.media;
  return (
    <Link
      href={`/results/${work.slug}/`}
      data-sfx=""
      onPointerEnter={() => setOver(true)}
      onPointerLeave={() => setOver(false)}
      onFocus={() => setOver(true)}
      onBlur={() => setOver(false)}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-darkpanel">
        <div className="absolute inset-0 transition-transform duration-[800ms] ease-house group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
          <WorkMedia work={work} index={index} decorative play={film && hoverPlay ? over : undefined} />
        </div>
        {film && (
          <span className="absolute left-3.5 top-3.5 flex items-center gap-2 rounded-full bg-ink/75 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ondark backdrop-blur-sm">
            <svg viewBox="0 0 12 12" aria-hidden className="size-2.5">
              <path d="M3 1.8v8.4L10.2 6z" fill="currentColor" />
            </svg>
            Film
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-[clamp(20px,16px+0.7vw,26px)] leading-[1.15] tracking-[-0.01em] text-sec-ink">{work.title}</p>
          <p className="mt-2 font-mono text-mono-sm uppercase text-sec-mid">{work.tags.join(" · ")}</p>
        </div>
        <ArrowIcon className="mt-1.5 shrink-0 text-sec-mid transition-[transform,color] duration-[250ms] ease-house group-hover:translate-x-1 group-hover:text-sec-acc" />
      </div>
    </Link>
  );
}

export function FeaturedWork() {
  /* hover to play needs a pointer that hovers; touch plays on screen */
  const [hoverPlay, setHoverPlay] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setHoverPlay(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <Section theme="light" anchor="work">
      <div className={cn(EDGE, "relative z-10")}>
        <div className="md:flex md:items-end md:justify-between md:gap-12">
          <BaselineReveal as="h2" className="font-display text-display text-sec-ink">
            Featured work
          </BaselineReveal>
          <Reveal className="mt-6 md:mb-3 md:mt-0 md:max-w-[34ch] md:shrink-0">
            <p className="text-body text-sec-mid">{SUPPORT}</p>
          </Reveal>
        </div>

        {/* no pencil underline under the display-size titles (data-hand-off) */}
        <div data-hand-off className="mt-12 grid gap-x-[clamp(16px,2vw,32px)] gap-y-12 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-y-16">
          {HOME_WORK.map((work, i) => (
            <Reveal key={work.slug} delay={(i % 3) * 0.08}>
              <WorkCard work={work} index={i} hoverPlay={hoverPlay} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex justify-center md:mt-20">
          <Pill href="/results/" variant="secondary" className="max-md:w-full max-md:justify-center">
            See All Results
          </Pill>
        </Reveal>
      </div>
    </Section>
  );
}
