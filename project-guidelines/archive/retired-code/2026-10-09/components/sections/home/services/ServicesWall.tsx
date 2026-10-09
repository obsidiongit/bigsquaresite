"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { Reveal } from "@/components/motion/Reveal";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { SERVICE_GROUPS_HOME, groupBase } from "@/lib/home-services";
import { EDGE } from "@/lib/layout";
import { EASE, VIEWPORT_ONCE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ServicePhoto } from "./ServicePhoto";
import { ArrowIcon, ServicesHeader } from "./shared";

/* Services, take "wall" (review toggle lib/lab "servicesLook",
   2026-10-09). The catalog as 15 brand squares: one row per group, so
   the 6 / 5 / 4 split reads as a stepped shape (the old square map's
   idea, now big enough to be the interface). Each square is the
   service's photo drawn as blue halftone squares; the two asks fill the
   steps the short rows leave, so the wall closes into a rectangle.

   The squares turn in on entry, a quarter turn each, row by row (the
   TV's squares, the 90-day grid). Hover: the squares fade to the photo
   and a blue band rises with the one-liner. The caption under each
   square is the link text. No pencil underline (data-hand-off).
   Reduced motion: no turn-in, hover is a colour change only. */

function Tile({ item, i, hover, setHover, reduced }: {
  item: (typeof SERVICE_GROUPS_HOME)[number]["items"][number];
  i: number;
  hover: number | null;
  setHover: (i: number | null) => void;
  reduced: boolean;
}) {
  const lit = hover === i;
  return (
    <TurnIn reduced={reduced} delay={(i % 6) * 0.05}>
      <Link
        href={item.href}
        onPointerEnter={() => setHover(i)}
        onPointerLeave={() => setHover(null)}
        onFocus={() => setHover(i)}
        onBlur={() => setHover(null)}
        className="group/tile block"
      >
        <div className="relative aspect-square overflow-hidden rounded-[14px] border border-sec-line">
          <ServicePhoto
            src={item.img}
            reveal={lit}
            revealDelay={0.12}
            cell={4}
            cut={0.82}
            sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
            className={cn("transition-transform duration-[600ms] ease-house", lit && !reduced && "scale-[1.04]")}
          />
          <span className="absolute left-2.5 top-2.5 rounded-full bg-paper/90 px-2 py-0.5 font-mono text-[11px] tabular-nums text-ink">
            {String(i + 1).padStart(2, "0")}
          </span>
          {/* the band: rises from the bottom edge with the one-liner */}
          <span
            aria-hidden
            className={cn(
              "absolute inset-x-0 bottom-0 bg-acc px-3.5 py-3 text-[13px] leading-snug text-onacc transition-transform duration-[400ms] ease-swoop",
              lit ? "translate-y-0" : "translate-y-full",
            )}
          >
            {item.line}
          </span>
        </div>
        <span className="mt-3 flex items-start justify-between gap-3">
          <span
            title={item.label}
            className={cn(
              "text-[17px] font-bold leading-[1.25] tracking-[-0.01em] transition-colors duration-[250ms] md:text-[18px]",
              lit ? "text-sec-acc" : "text-sec-ink",
            )}
          >
            {item.short}
            <span className="sr-only"> ({item.label})</span>
          </span>
          <ArrowIcon
            className={cn(
              "mt-1 shrink-0 transition-[transform,color] duration-[250ms]",
              lit ? "translate-x-1 text-sec-acc" : "text-sec-mid",
            )}
          />
        </span>
      </Link>
    </TurnIn>
  );
}

/* the quarter-turn entry; plain markup under reduced motion (a motion
   wrapper that mounted hidden before the flag flipped can stay hidden) */
function TurnIn({ reduced, delay, children }: { reduced: boolean; delay: number; children: React.ReactNode }) {
  if (reduced) return <li>{children}</li>;
  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.6, ease: EASE.house, delay }}
    >
      {children}
    </motion.li>
  );
}

export function ServicesWall() {
  const reduced = useReducedMotionSafe();
  const [hover, setHover] = useState<number | null>(null);

  return (
    <Section theme="light" anchor="services">
      <div className={cn(EDGE, "relative z-10")}>
        <ServicesHeader ctas={false} />

        <div data-hand-off className="mt-12 space-y-10 md:mt-16 md:space-y-12">
          {SERVICE_GROUPS_HOME.map((group, g) => {
            const base = groupBase(g);
            return (
              <div key={group.title}>
                <Reveal>
                  <Link
                    href={group.href}
                    className="group/head flex items-baseline justify-between gap-4 border-b border-sec-line pb-3"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-eyebrow tabular-nums text-sec-acc">[{String(g + 1).padStart(2, "0")}]</span>
                      <span className="font-mono text-eyebrow uppercase tracking-[0.08em] text-sec-mid transition-colors duration-[250ms] group-hover/head:text-sec-acc">
                        {group.title}
                      </span>
                    </span>
                    <span className="font-mono text-eyebrow tabular-nums text-sec-mid">{group.items.length}</span>
                  </Link>
                </Reveal>
                <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-4">
                  {group.items.map((item, k) => (
                    <Tile key={item.href} item={item} i={base + k} hover={hover} setHover={setHover} reduced={reduced} />
                  ))}

                  {/* the steps the short rows leave: the two asks */}
                  {g === 1 && (
                    <TurnIn reduced={reduced} delay={0.25}>
                      <Link
                        href="/schedule/"
                        data-sfx=""
                        className="pill-square group/cta relative isolate flex aspect-square flex-col justify-between overflow-hidden rounded-[14px] p-4 md:p-5"
                      >
                        <span className="pill-label font-mono text-mono-sm uppercase opacity-80">Talk to the team</span>
                        <span className="pill-label flex items-end justify-between gap-2 text-[18px] font-bold leading-tight md:text-[20px]">
                          Schedule a Call
                          <ArrowIcon className="mb-1 shrink-0 transition-transform duration-[250ms] group-hover/cta:translate-x-1" />
                        </span>
                      </Link>
                    </TurnIn>
                  )}
                  {g === 2 && (
                    <Reveal className="col-span-2 flex">
                      <div className="flex w-full flex-col justify-between gap-6 rounded-[14px] border border-sec-line bg-surf p-5 max-lg:min-h-[220px] md:p-6 lg:aspect-[2/1]">
                        <div>
                          <p className="font-display text-[22px] leading-[1.15] text-sec-ink md:text-[26px]">Not sure where to start?</p>
                          <p className="mt-2 max-w-[34ch] text-small text-sec-mid">
                            We will look at what you run now and tell you what to fix first.
                          </p>
                        </div>
                        <div>
                          <Pill href="/audit/" variant="primary" className="max-md:w-full max-md:justify-center">
                            Get a Free Audit
                          </Pill>
                        </div>
                      </div>
                    </Reveal>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
