import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { SolutionCards } from "@/components/sections/home/SolutionCards";
import { CalendarWidget } from "@/components/sections/home/widgets/CalendarWidget";
import { ChannelBarsWidget } from "@/components/sections/home/widgets/ChannelBarsWidget";
import { TaskListWidget } from "@/components/sections/home/widgets/TaskListWidget";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

/* Solution (5.solution.md v3.1, region pivot): the answer to the
   problem strip and the emotional turn of the lower page. Youtech's
   "That's Where We Come In" moment rebuilt token-native on the open
   region (STYLE_GUIDE 4.5): statement headline (the page's single
   statement-scale moment, relocated from the retired v2 problem
   headline), intro + CTA pair on one baseline row, then three equal
   widget cards (6.11) topped by looping HTML/CSS product-UI vignettes
   (7.10), the region's whole live budget.

   The card grid lives in SolutionCards (client): it hosts the CARD
   SWEEP (Brad 2026-08-24; unpinned 2026-08-30, the scroll lock is
   dead): the companion cube descends right of the row, sweeps flat
   right-to-left under all three cards on the section's natural
   passage, and each title draws a blue squiggly underline as the
   cube passes beneath it (beats shared via lib/solution-sweep). The
   widgets stay server-rendered here and pass through as nodes.

   Card titles are Brad's locked wording for now (Title Case kept
   deliberately; flagged against the sentence-case rule, he expects to
   swap at least one). All copy DRAFT for his single later pass. */

const CARDS = [
  {
    title: "No Long Term Contracts",
    line: "Month to month. We earn the next month by delivering this one.",
    widget: <CalendarWidget />,
  },
  {
    title: "Transparency",
    line: "Every task we run for you, open for you to see.",
    widget: <TaskListWidget />,
  },
  {
    title: "Full Approach",
    line: "Every channel and every location, handled by one team.",
    widget: <ChannelBarsWidget />,
  },
];

export function Solution() {
  return (
    <Section
      theme="light"
      size="none"
      anchor="solution"
      /* moderate bottom pad: the sweep completes on the section's own
         passage (nothing pins), so this only breathes between the
         cards and the Search occluder */
      className="pb-[max(140px,16svh)]"
    >
      {/* relative z-10 is load-bearing: the opaque cards must occlude
          the fixed SquareField (z-1) and the companion canvas (z-5).
          With no sticky ancestor (the old SolutionStage pin trapped a
          stacking context), this layer participates at the root and
          that is sufficient. */}
      <div className={cn(EDGE, "relative z-10 pt-10 md:pt-12")}>
        <BaselineReveal
          as="h2"
          className="max-w-[14ch] font-display text-statement text-sec-ink"
        >
          {"That's where we come in."}
        </BaselineReveal>

        <Reveal className="mt-8 md:mt-10 md:flex md:items-end md:justify-between md:gap-12">
          <p className="max-w-[52ch] text-lead text-sec-mid">
            BigSquare was built on a simple idea: working with an agency
            should be painless. One team, one plan, and numbers you can
            check any day of the week.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
            <Pill
              href="/schedule/"
              variant="primary"
              className="max-md:w-full max-md:justify-center"
            >
              Schedule a Call
            </Pill>
            <Pill
              href="/audit/"
              variant="secondary"
              className="max-md:w-full max-md:justify-center"
            >
              Get a Free Audit
            </Pill>
          </div>
        </Reveal>

        <SolutionCards cards={CARDS} />
      </div>
    </Section>
  );
}
