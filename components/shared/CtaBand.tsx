import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { BracketCta } from "@/components/shared/BracketCta";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";

/* <CtaBand> (project-sections/shared/cta-band.md; design source
   13.final-cta.md): the closing brand moment, part one. The page's ONE
   full-accent surface, flush above the dark footer on every marketing
   page that uses it (the homepage ends through the First 90 Days
   finale instead). Built 2026-08-25 under the open layout (D1): EDGE
   framing and centered content; the spec's GridLines and corner marks
   are retired with the instrument layer (4.3, 4.5).

   The primary pill inverts automatically inside the accent scope
   (globals.css); the Bracket CTA draws in white (--sec-acc resolves to
   --onacc here) and spends 1 slot of the page's annotation budget. */

export function CtaBand({
  headline = "Ready to grow your brand?",
  body = "Book a call. We will look at your numbers together and tell you exactly what we would do first.",
  primaryLabel = "Schedule a Call",
  primaryHref = "/schedule/",
  secondaryLabel = "Get a Free Audit",
  secondaryHref = "/audit/",
}: {
  headline?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <Section theme="accent" size="lg">
      <div className={EDGE}>
        <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
          <BaselineReveal as="h2" className="font-display text-h2 text-sec-ink">
            {headline}
          </BaselineReveal>
          <Reveal delay={0.06}>
            {/* sec-ink (full white on accent), not sec-mid: 72% white over
                --acc measures 3.6:1 and fails AA at lead size (guide §10) */}
            <p className="mt-6 max-w-[44ch] text-lead text-sec-ink">{body}</p>
          </Reveal>
          <Reveal
            delay={0.12}
            className="mt-10 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:gap-6"
          >
            <Pill
              href={primaryHref}
              className="max-sm:w-full max-sm:justify-center"
            >
              {primaryLabel}
            </Pill>
            <BracketCta href={secondaryHref}>{secondaryLabel}</BracketCta>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
