import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { Container } from "@/components/shared/Container";
import { GridLines } from "@/components/shared/GridLines";
import { NumberedRuledList } from "@/components/shared/NumberedRuledList";
import { Section } from "@/components/shared/Section";
import { NoLabel } from "@/components/shared/mono";

/* Problem (4.problem.md v2): the setup, not the pitch. One oversized
   claim (the page's single --text-statement moment), then four pain
   points filed like line items in a report (NumberedRuledList,
   STYLE_GUIDE 6.10). No icons, no cards: the rules and indexes carry
   the structure. No annotations here (budget spent elsewhere).

   The statement column stays left; the right half of the section is
   deliberate whitespace where the glass cube companion holds and ticks
   a quarter turn as each row passes (HomeCanvas journey). */

const PAIN_POINTS = [
  { text: "Locations get different results and nobody knows why." },
  { text: "One vendor runs ads, another runs the site, and they never talk." },
  { text: "Reports come late, and they hide more than they show." },
  { text: "You get locked into a long contract before you see a result." },
];

export function Problem() {
  return (
    <Section theme="light" size="lg" anchor="problem">
      <GridLines />
      <Container className="relative z-10">
        <SeparatorIn />
        <NoLabel n={2} label="PROBLEM" className="mt-4" />

        <BaselineReveal
          as="h2"
          className="mt-10 max-w-[16ch] font-display text-statement text-sec-ink"
        >
          Growing more than one location is a different problem.
        </BaselineReveal>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-[56ch] text-lead text-sec-mid">
            Most agencies are built for one business with one address. When
            you have 10, 50, or 500 locations, the cracks show fast.
          </p>
        </Reveal>

        <NumberedRuledList items={PAIN_POINTS} className="mt-16 md:mt-20" />

        <Reveal delay={0.32}>
          <p className="mt-8 text-right text-h3 font-bold text-sec-ink">
            That&apos;s what we fix.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
