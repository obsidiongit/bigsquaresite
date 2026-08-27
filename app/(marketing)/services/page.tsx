import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { CtaBand } from "@/components/shared/CtaBand";
import { Eyebrow } from "@/components/shared/mono";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { SERVICE_GROUPS, SERVICES } from "@/lib/services";

/* /services/ hub (D2, sitemap.md 2026-08-25). The full catalog as an
   editorial index: statement hero, then one section per group carrying
   the anchor ids the homepage Services group heads target
   (#organic-marketing, #paid-advertising, #design-development).
   Open layout, no registration marks (Brad, 2026-08-26), annotations:
   H1 underline + CTA bracket. */

export const metadata: Metadata = {
  title: "Marketing Services for Multi-Location Brands",
  description:
    "15 services in 3 groups: Organic Marketing, Paid Advertising, and Design & Development. One team, one plan, one report for every location.",
  alternates: { canonical: "/services/" },
};

const GROUP_INTROS: Record<string, string> = {
  "organic-marketing":
    "The channels you own: search, answers, content, social, and your list. Slower to start, cheapest to keep winning.",
  "paid-advertising":
    "Leads on demand. Ads that start producing in weeks and report their cost per lead by location.",
  "design-development":
    "What every channel points at: your brand, your site, and the tools behind them.",
};

const GROUP_THEMES = ["light", "tint", "light"] as const;

export default function ServicesHubPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services/" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        {/* Hero: the index's statement open */}
        <Section
          theme="light"
          size="none"
          className="pt-36 pb-16 md:pt-44 md:pb-20"
        >
          <div className={EDGE}>
            <div className="max-w-[72ch]">
              <SeparatorIn />
              <Eyebrow className="mt-4">Services</Eyebrow>
              <Reveal>
                <h1 className="mt-8 max-w-[22ch] font-display text-h1 text-sec-ink">
                  Every{" "}
                  <RoughAnnotation variant="underline" delay={0.7}>
                    service
                  </RoughAnnotation>
                  , one team
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-[60ch] text-lead text-sec-mid">
                  BigSquare runs marketing for multi-location and franchise
                  brands. 15 services in 3 groups, one team, one report. Pick a
                  service to see how it works, or book a call and we will tell
                  you where we would start.
                </p>
              </Reveal>
              <Reveal
                delay={0.18}
                className="mt-10 flex flex-col gap-4 sm:flex-row"
              >
                <Pill
                  href="/schedule/"
                  className="max-sm:w-full max-sm:justify-center"
                >
                  Schedule a Call
                </Pill>
                <Pill
                  href="/audit/"
                  variant="secondary"
                  className="max-sm:w-full max-sm:justify-center"
                >
                  Get a Free Audit
                </Pill>
              </Reveal>
            </div>
          </div>
        </Section>

        {/* One section per group, carrying the homepage anchor ids */}
        {SERVICE_GROUPS.map((group, g) => {
          const items = SERVICES.filter((s) => s.group === group.slug);
          return (
            <Section
              key={group.slug}
              id={group.slug}
              theme={GROUP_THEMES[g]}
              className="scroll-mt-24"
            >
              <div className={EDGE}>
                <SeparatorIn />
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <Eyebrow>{group.name}</Eyebrow>
                  <span className="font-mono text-eyebrow tabular-nums text-sec-mid">
                    {items.length}
                  </span>
                </div>
                <Reveal delay={0.05}>
                  <p className="mt-6 max-w-[52ch] text-lead text-sec-mid">
                    {GROUP_INTROS[group.slug]}
                  </p>
                </Reveal>
                <Reveal stagger className="mt-10 md:mt-12">
                  {items.map((s) => (
                    <RevealItem key={s.slug}>
                      <Link
                        href={`/services/${s.slug}/`}
                        className="group/row flex flex-col gap-2 border-b border-sec-line py-5 transition-colors duration-[250ms] hover:border-sec-ink md:flex-row md:items-baseline md:gap-8 md:py-6"
                      >
                        <span className="text-h3 font-bold text-sec-ink transition-colors duration-[250ms] group-hover/row:text-sec-acc md:w-[38%] md:shrink-0">
                          {s.name}
                        </span>
                        <span className="flex-1 text-body text-sec-mid">
                          {s.line}
                        </span>
                        <span
                          aria-hidden
                          className="hidden text-[18px] text-sec-mid transition-transform duration-[250ms] ease-house group-hover/row:translate-x-1 group-hover/row:text-sec-acc md:block motion-reduce:transition-none motion-reduce:group-hover/row:translate-x-0"
                        >
                          →
                        </span>
                      </Link>
                    </RevealItem>
                  ))}
                </Reveal>
              </div>
            </Section>
          );
        })}

        <CtaBand />
      </main>
    </>
  );
}
