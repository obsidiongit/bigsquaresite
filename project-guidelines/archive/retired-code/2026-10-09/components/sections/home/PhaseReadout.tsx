"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { EASE } from "@/lib/motion";
import { PHASES, TOTAL_DAYS, phaseIndexForDay } from "@/lib/ninety-days";
import { cn } from "@/lib/utils";

/* PhaseReadout (10.how-it-works.md v3.1): the day clock's face, on
   the blue slab beside the grid. Rebuilt in round 2 (Brad: "the text
   on the right side is kind of weak"): a phase rail of three range
   chips with the active one inverted (so the three-act structure is
   visible at every moment), a display-scale mono day numeral over a
   "/ 90" denominator, the phase name at h3 in the display face, then
   the phase panel: that phase's four milestones as rows. A passed
   row carries the check glyph, a row still ahead leads with its mono
   day number, and the exact current day's chip inverts. Crossing a
   boundary swaps name and rows together: outgoing fall and fade,
   incoming rise, 240ms house with a 40ms stagger.

   Tabular nums everywhere a number changes, so nothing reflows while
   scrubbing; no CountUp, the number is scrubbed not counted. The
   whole component is aria-hidden by the parent: the full three-phase
   list lives in the section's always-rendered ordered list. */

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE.house } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.16, ease: EASE.house } },
};

function PhaseBlock({ day, phaseIndex }: { day: number; phaseIndex: number }) {
  const phase = PHASES[phaseIndex];
  return (
    <>
      <motion.p
        variants={rowVariants}
        className="font-display text-h3 font-bold text-sec-ink"
      >
        {phase.name}
      </motion.p>
      <ul className="mt-5 space-y-3.5">
        {phase.milestones.map((m) => {
          const done = day >= m.day;
          const now = day === m.day;
          return (
            <motion.li
              key={m.day}
              variants={rowVariants}
              className={cn(
                "flex items-center gap-3 text-small",
                done ? "text-sec-ink" : "text-sec-mid",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-9 shrink-0 items-center justify-center rounded-full font-mono text-mono-sm tabular-nums",
                  now
                    ? "bg-onacc text-acc"
                    : done
                      ? "text-sec-ink"
                      : "border border-sec-line text-sec-mid",
                )}
              >
                {done && !now ? (
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                ) : (
                  String(m.day).padStart(2, "0")
                )}
              </span>
              {m.label}
            </motion.li>
          );
        })}
      </ul>
    </>
  );
}

export function PhaseReadout({
  day,
  reduced = false,
}: {
  day: number;
  reduced?: boolean;
}) {
  const phaseIndex = phaseIndexForDay(Math.max(1, day));
  const shownDay = Math.max(1, day);

  return (
    <div className="max-w-[34rem]">
      {/* phase rail: the three acts, active inverted */}
      <div className="flex flex-wrap gap-2">
        {PHASES.map((p, i) => (
          <span
            key={p.name}
            className={cn(
              "rounded-full px-3.5 py-1.5 font-mono text-mono-sm uppercase tabular-nums transition-colors duration-300",
              i === phaseIndex
                ? "bg-onacc text-acc"
                : "border border-sec-line text-sec-mid",
            )}
          >
            Days {String(p.days[0]).padStart(2, "0")}-{p.days[1]}
          </span>
        ))}
      </div>

      {/* the clock. The numeral gets a landing pop when the clock
          reaches 90 (round 3): keyframes fire when the animate target
          flips from 1 to the array, so a scroll-back and return
          replays it. Driven by the integer day the parent already
          derives from dayMv (no new per-frame work); transform only,
          origin-bottom so it grows off the baseline without reflow.
          Reduced motion renders the plain span (framer trap: never a
          gated motion wrapper). */}
      <div className="mt-7 flex items-baseline gap-3">
        <span className="font-mono text-mono-sm uppercase text-sec-mid">
          Day
        </span>
        {reduced ? (
          <span className="inline-block font-mono text-[clamp(52px,4.5vw,76px)] leading-none tracking-[-0.03em] tabular-nums text-sec-ink">
            {String(shownDay).padStart(2, "0")}
          </span>
        ) : (
          <motion.span
            className="inline-block origin-bottom font-mono text-[clamp(52px,4.5vw,76px)] leading-none tracking-[-0.03em] tabular-nums text-sec-ink"
            initial={false}
            animate={{ scale: day >= TOTAL_DAYS ? [1, 1.06, 1] : 1 }}
            transition={{ duration: 0.5, ease: EASE.swoop }}
          >
            {String(shownDay).padStart(2, "0")}
          </motion.span>
        )}
        <span className="font-mono text-mono-sm uppercase tabular-nums text-sec-mid">
          / {TOTAL_DAYS}
        </span>
      </div>

      {/* the active phase: name + milestone rows swap together */}
      <div className="mt-7 min-h-[15rem]">
        {reduced ? (
          <div>
            <p className="font-display text-h3 font-bold text-sec-ink">
              {PHASES[phaseIndex].name}
            </p>
            <ul className="mt-5 space-y-3.5">
              {PHASES[phaseIndex].milestones.map((m) => (
                <li
                  key={m.day}
                  className="flex items-center gap-3 text-small text-sec-ink"
                >
                  <span className="flex h-6 w-9 shrink-0 items-center justify-center rounded-full font-mono text-mono-sm">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  {m.label}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={phaseIndex}
              variants={listVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <PhaseBlock day={day} phaseIndex={phaseIndex} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
