import { NewsletterForm } from "@/components/sections/home/NewsletterForm";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/shared/mono";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function HoldingNewsletter() {
  return (
    <Section theme="light" size="base" id="newsletter" className="scroll-mt-24">
      <div className={cn(EDGE, "relative z-10")}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-16">
          <div className="lg:col-span-5">
            <Eyebrow>The list</Eyebrow>
            <Reveal>
              <h2 className="mt-5 font-display text-h2 text-sec-ink">
                Get what we are seeing.
              </h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-5 max-w-[40ch] text-body text-sec-mid">
                Notes from real accounts, in plain words.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-7">
            <NewsletterForm />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
