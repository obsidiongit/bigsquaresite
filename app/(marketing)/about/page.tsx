import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { CtaBand } from "@/components/shared/CtaBand";
import { MediaSlot } from "@/components/shared/MediaSlot";
import { MetricBlock } from "@/components/shared/MetricBlock";
import { BracketIndex, Eyebrow } from "@/components/shared/mono";
import { OfficeCards } from "@/components/shared/OfficeCards";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { EDGE } from "@/lib/layout";
import { METRICS } from "@/lib/metrics";

export const metadata: Metadata = {
  title: { absolute: "About BigSquare Marketing" },
  description:
    "BigSquare is the growth partner for multi-location and franchise brands. One team across search, ads, sites, and creative, with numbers you can check any day.",
  alternates: { canonical: "/about/" },
};

/* /about/ (about.md v2, the design-brief pass): the TRUST page. Open
   layout, calm, no video, no pinned runways. Theme rhythm: light,
   light, tint, light, DARK proof band, light, accent CtaBand.

   Annotation budget: 3 of 3 (hero circle on "growth", underline on
   the what-we-are-not payoff, CtaBand bracket). No registration
   marks: every MediaSlot takes marks={false} (new-page rule). */

const HOW_WE_WORK = [
  {
    head: "Proof before promises.",
    body: "Numbers, case studies, and a portal you can log into. Every claim has a paper trail.",
  },
  {
    head: "One team, every channel.",
    body: "Search, ads, sites, and creative under one roof. No silos, no handoffs between vendors.",
  },
  {
    head: "Premium work, in house.",
    body: "Brand and creative built by our own team, not outsourced.",
  },
];

const NOTS = [
  {
    head: "Not a cheap template shop.",
    sub: "Your site and your brand are built for you, from scratch.",
  },
  {
    head: "Not a 300-person agency.",
    sub: "No layers, no waiting, no generic work moving slowly.",
  },
  {
    head: "Not a tool company.",
    sub: "The work comes first. The portal is how you check it.",
  },
];

function XGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      className="mt-1 size-5 shrink-0 text-sec-mid"
    >
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7.4 7.4 L12.6 12.6 M12.6 7.4 L7.4 12.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AboutPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about/" },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero: short, no media */}
      <Section theme="light" size="none" className="pt-32 pb-section-y md:pt-36">
        <div className={EDGE}>
          <SeparatorIn />
          <Eyebrow className="mt-4">Who we are</Eyebrow>

          <div className="mt-6 flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-6">
            <Reveal className="md:col-span-8">
              <h1 className="max-w-[20ch] font-display text-h1 text-sec-ink">
                The{" "}
                <RoughAnnotation
                  variant="circle"
                  delay={0.7}
                  className="whitespace-nowrap"
                >
                  growth
                </RoughAnnotation>{" "}
                partner for multi-location brands
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-end">
              <p className="max-w-[40ch] text-body text-sec-mid">
                We help you open more locations and get more revenue out of
                the ones you have. Single locations and ecommerce brands
                grow here too.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Pill href="/schedule/" className="max-sm:w-full max-sm:justify-center">
                  Schedule a Call
                </Pill>
                <Pill
                  href="/audit/"
                  variant="secondary"
                  className="max-sm:w-full max-sm:justify-center"
                >
                  Get a Free Audit
                </Pill>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 2. Story: 65ch spine + the founders slot */}
      <Section theme="light" size="none" className="pb-section-y">
        <div className={EDGE}>
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-6">
              <Eyebrow>The story</Eyebrow>
              <div className="mt-6 max-w-[65ch]">
                <p className="font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
                  [PLACEHOLDER: founding story, 2 to 3 short paragraphs from
                  Brad: how BigSquare started, why it serves multi-location
                  brands, and what changed along the way]
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <MediaSlot
                id="about-founders"
                note="The founders, or the first office. Real photo only."
                alt="The BigSquare founders"
                aspect="4 / 3"
                marks={false}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* 3. How we work: three cards on tint */}
      <Section theme="tint">
        <div className={EDGE}>
          <Eyebrow>How we work</Eyebrow>
          <h2 className="mt-4 max-w-[24ch] font-display text-h2 text-sec-ink">
            Three rules the work runs on
          </h2>
          <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-6">
            {HOW_WE_WORK.map((card, i) => (
              <Reveal key={card.head} delay={i * 0.08}>
                <div className="h-full rounded-[24px] border border-sec-line bg-paper p-6 md:p-8">
                  <BracketIndex n={i + 1} className="text-sec-acc" />
                  <h3 className="mt-5 text-h3 font-bold text-sec-ink">
                    {card.head}
                  </h3>
                  <p className="mt-3 text-body text-sec-mid">{card.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* 4. What we are not: the three nots, x-marked */}
      <Section theme="light">
        <div className={EDGE}>
          <div className="max-w-[720px]">
            <Eyebrow>What we are not</Eyebrow>
            <div className="mt-8 flex flex-col gap-7">
              {NOTS.map((not, i) => (
                <Reveal key={not.head} delay={i * 0.08}>
                  <div className="flex items-start gap-4">
                    <XGlyph />
                    <div>
                      <p className="text-body font-bold text-sec-ink">
                        {not.head}
                      </p>
                      <p className="mt-1 text-body text-sec-mid">{not.sub}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3}>
              <p className="mt-10 max-w-[30ch] font-display text-h3 text-sec-ink">
                What is left is a team that does the work and{" "}
                <RoughAnnotation
                  variant="underline"
                  delay={0.6}
                  className="whitespace-nowrap"
                >
                  shows you the numbers.
                </RoughAnnotation>
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 5. Proof numbers: the homepage metrics array, same launch
          gate (values are stand-ins until sourced, lib/metrics.ts) */}
      <Section theme="dark">
        <div className={EDGE}>
          <Eyebrow>The numbers</Eyebrow>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((metric) => (
              <MetricBlock key={metric.caption} metric={metric} />
            ))}
          </div>
        </div>
      </Section>

      {/* 6. Offices */}
      <Section theme="light">
        <div className={EDGE}>
          <Eyebrow>The offices</Eyebrow>
          <h2 className="mt-4 font-display text-h2 text-sec-ink">
            Denver and Tampa
          </h2>
          <OfficeCards className="mt-10 max-w-[880px]" />
        </div>
      </Section>

      {/* 7. Team: one wide slot, real photos only */}
      <Section theme="light" size="none" className="pb-section-y-lg">
        <div className={EDGE}>
          <Eyebrow>The team</Eyebrow>
          <MediaSlot
            id="about-team"
            note="The whole team, one frame. Real photos only, no stock."
            alt="The BigSquare team"
            aspectClassName="aspect-video md:aspect-[21/9]"
            marks={false}
            className="mt-6"
          />
        </div>
      </Section>

      {/* 8. The closing ask */}
      <CtaBand />
    </main>
  );
}
