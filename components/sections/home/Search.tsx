import Link from "next/link";
import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { Section } from "@/components/shared/Section";
import { ArrowIcon } from "@/components/sections/home/services/shared";
import { SerpWidget } from "@/components/sections/home/widgets/SerpWidget";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

/* Search, rebuilt 2026-10-09: ads first. The ChatGPT take (5b.search.md
   v2.3, now in project-guidelines/archive/retired-code/2026-10-09/) sold
   GEO as the headline and pushed the audit for it; Brad: search and
   answers are on the menu but "certainly not our primary offer", they
   come after ads. So the section is now the top of a Google results
   page, and the order of the page is the order of the offer:

     the top of the page   the Sponsored slot, held by "Your Business"
                           and circled in blue pen (SerpWidget)
     the rest of the page  the map profile and the results under the
                           ads, with ChatGPT one clause in the legend

   One depicted product, aria-hidden (the "depicted product UI" rule);
   every claim is in the copy around it, and the copy only restates
   lines already on the site (GROUP_INTROS, the FAQ's "leads in the first
   2 weeks"). No Pill pair: Problem/Solution above and Services below
   both carry Schedule a Call + Get a Free Audit, so this section points
   at the Paid Advertising group with a quiet link instead. "AI" no
   longer appears on the homepage. Copy is DRAFT for Brad's pass. */

const LEGEND = [
  {
    title: "The top of the page",
    line: "Paid Search and Local Services Ads put you there. They can bring in leads within weeks, and your report shows what each one cost.",
    link: { label: "See Paid Advertising", href: "/services/#paid-advertising" },
  },
  {
    title: "The rest of the page",
    line: "Your map listing and the results under the ads. Search is slower to start and keeps paying off, and the same work helps tools like ChatGPT name you.",
  },
];

export function Search() {
  return (
    <Section theme="tint" anchor="search">
      <div className={cn(EDGE, "relative z-10")}>
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div>
            <Reveal>
              <p className="font-mono text-eyebrow uppercase tracking-[0.08em] text-sec-acc">Paid Advertising</p>
            </Reveal>
            <BaselineReveal as="h2" className="mt-4 max-w-[16ch] font-display text-h2 text-sec-ink">
              Be the first name they see.
            </BaselineReveal>
          </div>
          <Reveal className="mt-5 lg:mt-0">
            <p className="max-w-[40ch] text-lead text-sec-mid">
              When someone searches for what you sell, the top of the page is usually ads. That spot should be yours.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-10 md:mt-12">
          <SerpWidget />
        </Reveal>

        <Reveal stagger className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2 md:gap-12">
          {LEGEND.map((item, i) => (
            <RevealItem key={item.title} className="flex gap-5 border-t border-sec-line pt-5 md:gap-6">
              <span
                className={cn(
                  "mt-[6px] font-mono text-eyebrow tabular-nums",
                  i === 0 ? "text-sec-acc" : "text-sec-mid",
                )}
              >
                [{String(i + 1).padStart(2, "0")}]
              </span>
              <div>
                <p className="font-display text-[clamp(20px,17px+0.6vw,26px)] leading-[1.2] text-sec-ink">{item.title}</p>
                <p className="mt-1.5 max-w-[46ch] text-body text-sec-mid">{item.line}</p>
                {item.link && (
                  <Link
                    href={item.link.href}
                    className="mt-4 inline-flex items-center gap-2 font-mono text-mono-sm uppercase text-sec-ink transition-colors duration-[250ms] hover:text-sec-acc"
                  >
                    {item.link.label}
                    <ArrowIcon />
                  </Link>
                )}
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
