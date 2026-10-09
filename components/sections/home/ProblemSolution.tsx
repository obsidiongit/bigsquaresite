import Link from "next/link";
import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { WorkMedia } from "@/components/shared/WorkMedia";
import { workBySlug, type WorkEntry } from "@/lib/featured-work";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

/* Problem, then solution, as one section in two acts (2026-10-09; replaces
   ProblemStrip + Solution, now in project-guidelines/archive/retired-code).
   The review: the homepage turned "white, black, and blue" right under
   the colour of the hero and the work, and these two sections were
   "underproduced". So each act gets a real piece of work beside it, two
   of the studio's own campaign posters, and they carry the argument:

     the old way       "Let's circle back." A black-and-white boardroom,
                       the meeting that never ends, one blue cube on the
                       table. Beside it, the four things most agencies do,
                       crossed out by the blue pen as they scroll in
                       (ScrollStrike).
     the BigSquare way "Think inside the box." Full colour, the square
                       as the idea. Beside it, the three promises as
                       numbered ruled rows and the two asks.

   Black and white, then colour: the page's own before and after, in the
   same poster language as Featured work above it. Each poster opens its
   piece on /results/. Copy carried over unchanged (DRAFT for the copy
   pass; the promise titles are Brad's locked wording). */

const PAINS = [
  "Lock you into a long contract before you see a result",
  "Withhold your data and your account access",
  "Sell siloed services that never talk to each other",
  "Split your locations across fragmented teams",
];

const PROMISES = [
  { title: "No Long Term Contracts", line: "Month to month. We earn the next month by delivering this one." },
  { title: "Transparency", line: "Every task we run for you, open for you to see." },
  { title: "Full Approach", line: "Every channel and every location, handled by one team." },
];

function Poster({ work, className }: { work: WorkEntry; className?: string }) {
  return (
    <Reveal className={className}>
      <Link href={`/results/${work.slug}/`} className="group block" aria-label={`${work.title}, a BigSquare campaign poster`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-surf">
          <div className="absolute inset-0 transition-transform duration-[800ms] ease-house group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <WorkMedia work={work} decorative sizes="(min-width: 1024px) 34vw, 100vw" />
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

function CircleX() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className="mt-[5px] size-5 shrink-0 text-sec-mid">
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.4 7.4 L12.6 12.6 M12.6 7.4 L7.4 12.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const GRID = "grid items-center gap-10 md:gap-12 lg:gap-[clamp(48px,6vw,112px)]";

export function ProblemSolution() {
  return (
    <Section theme="light" anchor="problem">
      <div className={cn(EDGE, "relative z-10")}>
        {/* ---- act 1: the old way ------------------------------------- */}
        <div className={cn(GRID, "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]")}>
          <Poster work={workBySlug("lets-circle-back")} className="mx-auto w-full max-w-[460px] lg:max-w-none" />
          <div>
            <Reveal>
              <p className="font-mono text-eyebrow uppercase tracking-[0.08em] text-sec-mid">The old way</p>
            </Reveal>
            <BaselineReveal as="h2" className="mt-4 max-w-[20ch] font-display text-h2 text-sec-ink">
              Most growing brands struggle to get marketing right on their own.
            </BaselineReveal>
            <Reveal className="mt-5">
              <p className="max-w-[44ch] text-lead text-sec-mid">They hire an agency and find out fast that most agencies:</p>
            </Reveal>
            <Reveal stagger className="mt-8 border-t border-sec-line">
              {PAINS.map((text) => (
                <RevealItem key={text} className="flex gap-4 border-b border-sec-line py-4 md:py-5">
                  <CircleX />
                  <p data-strike className="text-[clamp(18px,16px+0.45vw,22px)] font-medium leading-[1.4] text-sec-ink">
                    {text}
                  </p>
                </RevealItem>
              ))}
            </Reveal>
          </div>
        </div>

        {/* ---- act 2: the BigSquare way -------------------------------- */}
        <div className={cn(GRID, "mt-[clamp(80px,10vw,160px)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]")}>
          <div className="max-lg:order-2">
            <Reveal>
              <p className="font-mono text-eyebrow uppercase tracking-[0.08em] text-sec-acc">The BigSquare way</p>
            </Reveal>
            <BaselineReveal as="h2" className="mt-4 font-display text-h2 text-sec-ink">
              {"That's where we come in."}
            </BaselineReveal>
            <Reveal className="mt-5">
              <p className="max-w-[48ch] text-lead text-sec-mid">
                BigSquare was built on a simple idea: working with an agency should be painless. One team, one plan, and
                numbers you can check any day of the week.
              </p>
            </Reveal>
            <Reveal stagger className="mt-8 border-t border-sec-line">
              {PROMISES.map((p, i) => (
                <RevealItem key={p.title} className="flex gap-5 border-b border-sec-line py-5 md:gap-6">
                  <span className="mt-[6px] font-mono text-eyebrow tabular-nums text-sec-acc">[{String(i + 1).padStart(2, "0")}]</span>
                  <div>
                    <p className="font-display text-[clamp(20px,17px+0.6vw,26px)] leading-[1.2] text-sec-ink">{p.title}</p>
                    <p className="mt-1.5 text-body text-sec-mid">{p.line}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
            <Reveal className="mt-9 flex flex-wrap gap-3">
              <Pill href="/schedule/" variant="primary" className="max-md:w-full max-md:justify-center">
                Schedule a Call
              </Pill>
              <Pill href="/audit/" variant="secondary" className="max-md:w-full max-md:justify-center">
                Get a Free Audit
              </Pill>
            </Reveal>
          </div>
          <Poster work={workBySlug("think-inside-the-box")} className="mx-auto w-full max-w-[460px] max-lg:order-1 lg:max-w-none" />
        </div>
      </div>
    </Section>
  );
}
