"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useDrawIn } from "@/components/shared/draft/Draft";
import { Section } from "@/components/shared/Section";
import { SERVICE_GROUPS_HOME } from "@/lib/home-services";
import { EDGE } from "@/lib/layout";
import { EASE } from "@/lib/motion";
import { GROUP_INTROS, SERVICE_GROUPS } from "@/lib/services";
import { cn } from "@/lib/utils";
import { ArrowIcon, ServicesHeader, runName } from "./shared";
import s from "./ServicesLanes.module.css";

/* Services (rebuilt 2026-10-09, third pass). The review of the running-type
   take: the pointer card "just blocks out the services". So nothing floats
   over anything now. The catalog is what it is, three groups, and each group
   gets a lane: three tall panels side by side in the brand's three flat
   fields (paper grey, the blue, ink), the way the campaign posters use
   colour. Each lane carries:

     - its number and a mark drawn in brand squares (growth steps for
       Organic, a square target for Paid, a selected square with its
       handles for Design & Development), which builds square by square on
       entry and sweeps when the lane is pointed at
     - the group name at display size and its one-line intro (the /services/
       hub's copy, lib/services GROUP_INTROS)
     - its services as ruled rows with the menu slab's square bullet (soft
       at rest, solid and a quarter turn when pointed at) and an arrow

   Pointing at a service swaps the lane's intro line for that service's
   one-liner, in place, above the list: the detail shows without covering
   a single name. Every name is a plain link; the swap is decoration on
   top (aria-hidden), and touch screens simply get the intro.

   No pencil underline under the names (data-hand-off). Reduced motion:
   the marks sit built, swaps are instant. */

type Lane = { theme: "tint" | "accent" | "dark"; mark: boolean[][] };

/* 7 x 7 marks, # = a square */
const grid = (rows: string[]) => rows.map((r) => [...r].map((c) => c === "#"));
const LANES: Lane[] = [
  {
    theme: "tint",
    mark: grid(["......#", ".....##", "....###", "...####", "..#####", ".######", "#######"]),
  },
  {
    theme: "accent",
    mark: grid([".#####.", "#.....#", "#.###.#", "#.###.#", "#.###.#", "#.....#", ".#####."]),
  },
  {
    theme: "dark",
    mark: grid(["##...##", "#.....#", "..###..", "..###..", "..###..", "#.....#", "##...##"]),
  },
];

function Mark({ mark }: { mark: boolean[][] }) {
  const ref = useDrawIn<HTMLDivElement>(0.4);
  let n = 0;
  return (
    <div ref={ref} aria-hidden className={s.mark}>
      {mark.flatMap((row, y) =>
        row.map((on, x) => (
          <i
            key={`${x}-${y}`}
            className={on ? s.on : s.off}
            style={on ? ({ "--i": n++, "--x": x } as CSSProperties) : undefined}
          />
        )),
      )}
    </div>
  );
}

export function ServicesLanes() {
  const reduced = useReducedMotionSafe();
  /* per lane: the pointed-at service, or null for the intro */
  const [lit, setLit] = useState<(number | null)[]>([null, null, null]);
  const point = (g: number, i: number | null) => setLit((l) => l.map((v, k) => (k === g ? i : v)));

  return (
    <Section theme="light" anchor="services">
      <div className={cn(EDGE, "relative z-10")}>
        <ServicesHeader />

        <div data-hand-off className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-3 lg:gap-5">
          {SERVICE_GROUPS_HOME.map((group, g) => {
            const lane = LANES[g];
            const slug = SERVICE_GROUPS[g].slug;
            const on = lit[g];
            /* two lines a lane; "&" stays with the word before it */
            const words = group.title.replace(" & ", "\u00a0& ").split(" ");
            return (
              <Reveal key={group.title} delay={g * 0.1} className="flex">
                <div
                  data-theme={lane.theme}
                  onPointerLeave={() => point(g, null)}
                  className={cn("group/lane flex w-full flex-col rounded-[24px] p-[clamp(24px,2.4vw,36px)]", s.lane)}
                >
                  <div className="flex items-start justify-between gap-6">
                    <span className="font-mono text-eyebrow tabular-nums text-sec-mid">
                      [{String(g + 1).padStart(2, "0")}] · {group.items.length} services
                    </span>
                    <Mark mark={lane.mark} />
                  </div>

                  <Link href={group.href} className="mt-8 block w-fit lg:mt-10">
                    <h3 className="font-display text-[clamp(30px,20px+1.5vw,44px)] leading-[1.02] tracking-[-0.02em] text-sec-ink">
                      {words.map((w, k) => (
                        <span key={k} className="block">
                          {w}
                        </span>
                      ))}
                    </h3>
                  </Link>

                  {/* the intro line, swapped in place for the pointed-at service's */}
                  <div aria-hidden className="relative mt-5 min-h-[4.8em] overflow-hidden text-small text-sec-mid">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.p
                        key={on === null ? "intro" : group.items[on].href}
                        initial={reduced ? false : { y: "70%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={reduced ? undefined : { y: "-70%", opacity: 0 }}
                        transition={{ duration: 0.28, ease: EASE.house }}
                        className={cn("max-w-[34ch]", on !== null && "text-sec-ink")}
                      >
                        {on === null ? GROUP_INTROS[slug] : group.items[on].line}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <p className="sr-only">{GROUP_INTROS[slug]}</p>

                  <ul className="mt-6 border-t border-sec-line">
                    {group.items.map((item, i) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          title={item.label}
                          onPointerEnter={() => point(g, i)}
                          onFocus={() => point(g, i)}
                          onBlur={() => point(g, null)}
                          className="group/row flex items-center gap-3.5 border-b border-sec-line py-3.5"
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "size-2 shrink-0 bg-sec-acc transition-[opacity,rotate] duration-[400ms] ease-house",
                              on === i ? "rotate-90 opacity-100" : "opacity-45",
                            )}
                          />
                          <span
                            className={cn(
                              "min-w-0 flex-1 text-[17px] font-bold leading-[1.3] tracking-[-0.01em] text-sec-ink transition-transform duration-[300ms] ease-house",
                              on === i && "translate-x-1",
                            )}
                          >
                            {runName(item.label)}
                          </span>
                          <ArrowIcon
                            className={cn(
                              "shrink-0 text-[18px] text-sec-ink transition-[transform,opacity] duration-[300ms] ease-house",
                              on === i ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-35",
                            )}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={group.href}
                    className="mt-auto inline-flex w-fit items-center gap-2 pt-7 font-mono text-mono-sm uppercase text-sec-mid transition-colors duration-[250ms] hover:text-sec-ink"
                  >
                    All of {group.title}
                    <ArrowIcon />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
