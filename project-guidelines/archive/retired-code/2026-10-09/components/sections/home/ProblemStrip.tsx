"use client";

import { motion, type Variants } from "framer-motion";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { DraftFrame, Note, Sketch } from "@/components/shared/draft/Draft";
import { pHead } from "@/components/shared/draft/pencil";
import { Section } from "@/components/shared/Section";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useLab } from "@/lib/lab";
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
   pass.

   PEN FIX (review toggle lib/lab "problemFix", 2026-10-08): once the
   pencil strikes a line out (ScrollStrike sets data-struck), the same
   blue pen writes our answer under it in the handwriting face, the
   editor correcting the page. The fixes restate the Solution cards
   and the Services header, so they claim nothing new. The write-on is
   CSS (globals.css [data-fix]); with the strike toggle off or reduced
   motion on, the fixes simply sit there. */

const PAIN_POINTS = [
  { text: "Lock you into a long contract before you see a result", fix: "Month to month." },
  { text: "Withhold your data and your account access", fix: "You own every account." },
  { text: "Sell siloed services that never talk to each other", fix: "Every channel, one plan." },
  { text: "Split your locations across fragmented teams", fix: "Every location, one team." },
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

function PainLine({ text, fix }: { text: string; fix?: string }) {
  return (
    <div className="flex items-start gap-3">
      <CircleX className="mt-[3px] text-sec-mid" />
      <div className="min-w-0">
        <p data-strike className="text-body font-medium text-sec-ink">{text}</p>
        {fix && (
          <p data-fix className="mt-1.5 font-accent text-[clamp(21px,19px+0.5vw,26px)] font-bold leading-[1.15] text-sec-acc">
            {fix}
          </p>
        )}
      </div>
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
/* drafted (lib/lab "middleDraft"): no grey fill, a pencil frame instead */
const PANEL_DRAFT = "p-6 md:p-10 xl:p-16";

/* the margin note's arrow: from under the note, curling down and left into the list */
const NOTE_ARROW = [
  { d: "M66 4 C64 22 50 40 16 52", i: 0 },
  { d: pHead(16, 52, Math.PI * 0.86, 10, 5), i: 1 },
];
const SPLIT = "grid gap-10 lg:grid-cols-[1fr_1.9fr] lg:gap-16";
const LINES = "grid content-start gap-x-10 gap-y-6 sm:grid-cols-2";

export function ProblemStrip() {
  const reduced = useReducedMotionSafe();
  const pen = useLab("problemFix") === "pen";
  const draft = useLab("middleDraft") === "draft";
  const panel = draft ? PANEL_DRAFT : PANEL;

  const body = reduced ? (
            <div className={panel}>
              <div className={SPLIT}>
                <Heading />
                <div className={LINES}>
                  {PAIN_POINTS.map(({ text, fix }) => (
                    <PainLine key={text} text={text} fix={pen ? fix : undefined} />
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
              className={panel}
            >
              <div className={SPLIT}>
                <motion.div variants={itemVar}>
                  <Heading />
                </motion.div>
                <div className={LINES}>
                  {PAIN_POINTS.map(({ text, fix }) => (
                    <motion.div key={text} variants={itemVar}>
                      <PainLine text={text} fix={pen ? fix : undefined} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          );

  return (
    <Section
      theme="light"
      anchor="problem"
      size="none"
      /* drafted: the frame sits closer under "See All Results", closing the dead gap */
      className={draft ? "pt-6 pb-10 md:pt-8 md:pb-12" : "pt-section-y pb-10 md:pb-12"}
    >
      <div className={cn(EDGE, "relative z-10")}>
        {draft ? (
          /* the footer's hand: a drafted frame, and a margin note pointing at what the pen crosses out */
          <div className="relative">
            <DraftFrame className="text-sec-ink/80">
              <div className="text-sec-ink">{body}</div>
            </DraftFrame>
            <Note lines={["The old way"]} delay={0.5} className="absolute -top-9 right-[7%] hidden -rotate-6 md:flex" />
            <Sketch
              strokes={NOTE_ARROW}
              viewBox="0 0 80 60"
              delay={0.9}
              className="absolute -top-1 right-[calc(7%+150px)] hidden h-[60px] w-[80px] text-sec-acc md:block"
            />
          </div>
        ) : (
          <RoughAnnotation variant="bracket" outset className="block">
            {body}
          </RoughAnnotation>
        )}
      </div>
    </Section>
  );
}
