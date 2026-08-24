import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { CalendarWidget } from "@/components/sections/home/widgets/CalendarWidget";
import { ChannelBarsWidget } from "@/components/sections/home/widgets/ChannelBarsWidget";
import { TaskListWidget } from "@/components/sections/home/widgets/TaskListWidget";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

/* Solution (5.solution.md v3, region pivot): the answer to the problem
   strip and the emotional turn of the lower page. Youtech's "That's
   Where We Come In" moment rebuilt token-native on the open region
   (STYLE_GUIDE 4.5): statement headline (the page's single statement-
   scale moment, relocated from the retired v2 problem headline), intro
   + CTA pair on one baseline row, then three equal widget cards (6.11)
   topped by looping HTML/CSS product-UI vignettes (7.10), the region's
   whole live budget.

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
    <Section theme="light" size="lg" anchor="solution">
      <div className={cn(EDGE, "relative z-10")}>
        <BaselineReveal
          as="h2"
          className="max-w-[14ch] font-display text-statement text-sec-ink"
        >
          {"That's where we come in."}
        </BaselineReveal>

        <Reveal className="mt-8 md:mt-10 md:flex md:items-end md:justify-between md:gap-12">
          <p className="max-w-[52ch] text-lead text-sec-mid">
            BigSquare was built on a simple idea: working with an agency
            should be painless. One team, one plan, and numbers you can check
            any day of the week.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
            <Pill href="/schedule/" variant="primary">
              Schedule a Call
            </Pill>
            <Pill href="/audit/" variant="secondary">
              Get a Free Audit
            </Pill>
          </div>
        </Reveal>

        <Reveal
          stagger
          className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3"
        >
          {CARDS.map((card) => (
            <RevealItem key={card.title} className="h-full">
              <div className="flex h-full flex-col rounded-[24px] border border-sec-line bg-surf p-5 lg:p-8">
                {/* the vignette is illustration; title + line carry meaning */}
                <div
                  aria-hidden
                  className="flex min-h-[224px] flex-1 items-center rounded-[16px] bg-paper px-4 py-5 shadow-[0_8px_24px_rgba(11,15,23,.05)] lg:px-7 lg:py-6"
                >
                  {card.widget}
                </div>
                <h3 className="mt-6 text-h3 font-bold text-sec-ink">
                  {card.title}
                </h3>
                <p className="mt-2 text-body text-sec-mid">{card.line}</p>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
