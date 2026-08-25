"use client";

import { motion, type Variants } from "framer-motion";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { Section } from "@/components/shared/Section";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { EDGE } from "@/lib/layout";
import { EASE, VIEWPORT_ONCE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ProblemStrip (4.problem.md v3.1, region pivot + bracket beat): the
   setup, not the pitch. One soft surf panel on the open-region EDGE
   (STYLE_GUIDE 4.5): claim + lead-in left, four x-marked pain points
   in a 2x2 grid right. Compact and quiet on purpose; it reads in
   seconds and hands off to the Solution headline next door. No rails,
   no rules, no mono indexes, no looping motion.

   BRACKET PAIR (Brad, card sweep session rounds 2-3): the panel
   wears a hand-drawn [ ] pair, RoughAnnotation's e2vc bracket
   variant (the Apply-button brackets from their site) with `outset`
   so the brackets sit slightly BIGGER than the panel, escaping past
   every edge. Round 3 timing: they draw IMMEDIATELY on entering the
   viewport (default inView trigger, no waiting for the cube or a
   mid-viewport dwell) and PERSIST once drawn (standard one-shot +
   boil; no retract on scroll-away). The cube companion still passes
   BEHIND the filled panel (content z-10 over the z-5 canvas).
   Another Brad-approved annotation-budget exception.

   X-glyphs are --sec-mid, never red (Youtech's traffic-light x is on
   the do-not-take list). All copy DRAFT for Brad's single later
   pass. */

const PAIN_POINTS = [
  "Lock you into a long contract before you see a result",
  "Withhold your data and your account access",
  "Sell siloed services that never talk to each other",
  "Split your locations across fragmented teams",
];

/* One stagger: panel fades up, then heading, then the x-lines 60ms
   apart (the panel's staggerChildren covers heading + lines in tree
   order). */
const panelVar: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE.house,
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};
const itemVar: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE.house } },
};

/* inline circle-x, 20px, stroke inherits (currentColor) */
function CircleX({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      className={cn("size-5 shrink-0", className)}
    >
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7.4 7.4 L12.6 12.6 M12.6 7.4 L7.4 12.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PainLine({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CircleX className="mt-[3px] text-sec-mid" />
      <p className="text-body font-medium text-sec-ink">{text}</p>
    </div>
  );
}

function Heading() {
  return (
    <div>
      <h2 className="max-w-[22ch] font-display text-h2 text-sec-ink">
        Most growing brands struggle to get marketing right on their own.
      </h2>
      <p className="mt-4 max-w-[40ch] text-body text-sec-mid">
        They hire an agency and find out fast that most agencies:
      </p>
    </div>
  );
}

const PANEL = "rounded-[24px] bg-surf p-6 md:p-10 xl:p-16";
const SPLIT = "grid gap-10 lg:grid-cols-[1fr_1.9fr] lg:gap-16";
const LINES = "grid content-start gap-x-10 gap-y-6 sm:grid-cols-2";

export function ProblemStrip() {
  const reduced = useReducedMotionSafe();

  return (
    <Section
      theme="light"
      anchor="problem"
      size="none"
      className="pt-section-y pb-10 md:pb-12"
    >
      <div className={cn(EDGE, "relative z-10")}>
        <RoughAnnotation variant="bracket" outset className="block">
          {reduced ? (
            <div className={PANEL}>
              <div className={SPLIT}>
                <Heading />
                <div className={LINES}>
                  {PAIN_POINTS.map((text) => (
                    <PainLine key={text} text={text} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              variants={panelVar}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT_ONCE}
              className={PANEL}
            >
              <div className={SPLIT}>
                <motion.div variants={itemVar}>
                  <Heading />
                </motion.div>
                <div className={LINES}>
                  {PAIN_POINTS.map((text) => (
                    <motion.div key={text} variants={itemVar}>
                      <PainLine text={text} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </RoughAnnotation>
      </div>
    </Section>
  );
}
