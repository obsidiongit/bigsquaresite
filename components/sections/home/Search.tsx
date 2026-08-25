import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { ChatInputWidget } from "@/components/sections/home/widgets/ChatInputWidget";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

/* Search split (5b.search.md v2.1, region pivot): the argument that
   search now runs through Google AND the chat products, and BigSquare
   works both. Centered copy around the section's hook: the one-to-one
   ChatGPT composer mockup with the typewriter + camera loop
   (ChatInputWidget), running the FULL EDGE width per Brad's round-2
   note (magazine scale, not a boxed widget). The mockup is aria-hidden
   illustration; the copy carries every claim. Copy is Brad's own
   wording from the round-2 review (its referential "AI" use is a
   recorded copy-rules exception), applied verbatim.

   z-[6] (Brad 2026-08-24, card sweep session): this section paints
   its ground ABOVE the fixed cube canvas (z-5), unlike the default
   HomeStage contract. After the solution card sweep the companion
   drops behind this full-viewport tint block and stays hidden
   through it and the proof band (also z-[6]) until the trust
   marquee releases it. */

export function Search() {
  return (
    <Section theme="tint" size="base" anchor="search" className="z-[6]">
      <div className={cn(EDGE, "relative z-10")}>
        <div className="mx-auto max-w-[56rem] text-center">
          <BaselineReveal as="h2" className="font-display text-h2 text-sec-ink">
            Your customers are not only searching on Google anymore.
          </BaselineReveal>
          <Reveal className="mt-6">
            <p className="text-body text-sec-mid">
              Many people now use AI tools like ChatGPT to find what they
              need. They ask for the best company, the right service, or help
              with a problem. AI reads what it can find online. Then it picks
              the businesses it thinks are a good fit.
            </p>
            <p className="mt-4 text-body text-sec-mid">
              Your business needs to be clear, trusted, and easy for AI to
              find. If it is not, AI may leave your name out.
            </p>
          </Reveal>
        </div>

        <Reveal stagger className="mt-8 md:mt-10">
          <RevealItem>
            <ChatInputWidget />
          </RevealItem>
          <RevealItem>
            <p className="mx-auto mt-8 max-w-[52rem] text-center text-body font-medium text-sec-ink md:mt-10">
              We help your business show up in search results and in the
              answers people get from AI.
            </p>
          </RevealItem>
          <RevealItem>
            <div className="mt-6 flex justify-center">
              <Pill
                href="/audit/"
                variant="primary"
                className="max-md:w-full max-md:justify-center"
              >
                Find Out Where You Show Up
              </Pill>
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </Section>
  );
}
