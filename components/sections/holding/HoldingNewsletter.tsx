import { NewsletterForm } from "@/components/sections/home/NewsletterForm";
import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";

export function HoldingNewsletter() {
  return (
    <Section
      theme="accent"
      size="lg"
      id="newsletter"
      className="scroll-mt-24"
    >
      <div className={EDGE}>
        <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center text-center">
          <p className="font-mono text-mono-sm uppercase text-sec-ink/70">
            The list
          </p>
          <BaselineReveal
            as="h2"
            className="mt-5 font-display text-h2 text-sec-ink"
          >
            Notes from real accounts, in plain words.
          </BaselineReveal>
          <Reveal delay={0.12} className="mt-10 w-full max-w-[560px]">
            <NewsletterForm consentClassName="mt-3 text-sec-ink/80" />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
