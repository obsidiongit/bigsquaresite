import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { CtaBand } from "@/components/shared/CtaBand";
import { BracketIndex, Chip, Eyebrow } from "@/components/shared/mono";
import { Section } from "@/components/shared/Section";
import { FEATURED_WORK, type WorkEntry } from "@/lib/featured-work";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { EDGE } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Client Results & Case Studies",
  description:
    "Case studies from the brands BigSquare works with. Every number comes from a real account, and you can ask us about any of them on a call.",
  alternates: { canonical: "/results/" },
};

/* /results/ (results-index.md v2, Batch 2): the real index. Case-study
   CONTENT stays hard-gated on real data: the grid reads the same
   lib/featured-work.ts array as the homepage and the noindex
   skeletons, cards render the designed placeholder state (no metric
   chips, no outcome headlines, no invented anything), and one flagged
   line marks the grid until client data lands. The how-we-measure rows
   carry the page's real copy.

   Annotation budget: 2 of 3 (H1 circle, CtaBand bracket). No
   registration marks (new-page rule). */

const HOW_WE_MEASURE = [
  {
    head: "The numbers come from accounts you own.",
    body: "Ad platforms, analytics, and call tracking in your name. Nothing lives in a report only we can open.",
  },
  {
    head: "You see what we see.",
    body: "The same dashboard, the same numbers, any day you want to look.",
  },
  {
    head: "We walk every report on a call.",
    body: "What worked, what did not, and what we change next. Ask about any number on this page.",
  },
];

/* The placeholder-state case study card: media frame in the MediaSlot
   placeholder grammar, flagged title from the array, real service tags.
   Metric chips and outcome headlines join when real values do (6.4's
   lockup needs numbers; a stand-in number on an indexable page reads
   as a claim). */
function WorkCard({ work, index }: { work: WorkEntry; index: number }) {
  return (
    <Reveal delay={(index % 2) * 0.08}>
      <Link href={`/results/${work.slug}/`} className="group block">
        <div className="relative aspect-[3/2] overflow-hidden rounded-[24px] border border-sec-line bg-surf">
          <div
            aria-hidden
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center"
          >
            <span className="block size-8 shrink-0 rounded-[4px] border-[1.5px] border-sec-acc/40" />
            <Chip className="text-sec-mid">Case Study</Chip>
          </div>
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-sec-line pb-4 transition-colors duration-[250ms] ease-house group-hover:border-sec-ink">
          <div>
            <p className="text-h3 font-bold text-sec-ink">{work.title}</p>
            <p className="mt-2 font-mono text-mono-sm uppercase text-sec-mid">
              {work.tags.join(" · ")}
            </p>
          </div>
          <span
            aria-hidden
            className="text-[18px] text-sec-mid transition-transform duration-[250ms] ease-house group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          >
            →
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export default function ResultsPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Results", path: "/results/" },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero */}
      <Section theme="light" size="none" className="pt-32 pb-section-y md:pt-36">
        <div className={EDGE}>
          <SeparatorIn />
          <Eyebrow className="mt-4">Results</Eyebrow>

          <div className="mt-6 flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-6">
            <Reveal className="md:col-span-8">
              <h1 className="max-w-[14ch] font-display text-h1 text-sec-ink">
                Real brands.{" "}
                <RoughAnnotation
                  variant="circle"
                  delay={0.7}
                  className="whitespace-nowrap"
                >
                  Real numbers.
                </RoughAnnotation>
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-end">
              <p className="max-w-[40ch] text-body text-sec-mid">
                Every number here comes from a real account. Ask us about any
                of them on a call.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 2. The case study grid (placeholder state until real data) */}
      <Section theme="light" size="none" className="pb-section-y">
        <div className={EDGE}>
          <p className="mb-8 max-w-[64ch] font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
            [PLACEHOLDER: real case studies. The cards below hold the grid
            until real client names, media, and metrics land in
            lib/featured-work.ts]
          </p>
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
            {FEATURED_WORK.map((work, i) => (
              <WorkCard key={work.slug} work={work} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* 3. How we measure: the page's real copy */}
      <Section theme="tint">
        <div className={EDGE}>
          <Eyebrow>How we measure</Eyebrow>
          <h2 className="mt-4 max-w-[24ch] font-display text-h2 text-sec-ink">
            Where our numbers come from
          </h2>
          <div className="mt-10 max-w-[880px] md:mt-12">
            {HOW_WE_MEASURE.map((row, i) => (
              <Reveal key={row.head} delay={i * 0.08}>
                <div className="flex flex-col gap-2 border-t border-sec-line py-6 sm:grid sm:grid-cols-[64px_1fr] sm:gap-6">
                  <BracketIndex n={i + 1} className="text-sec-acc" />
                  <div>
                    <h3 className="text-h3 font-bold text-sec-ink">
                      {row.head}
                    </h3>
                    <p className="mt-2 max-w-[56ch] text-body text-sec-mid">
                      {row.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-sec-line" />
          </div>
        </div>
      </Section>

      {/* 4. The closing ask */}
      <CtaBand headline="Want numbers like these with your name on them?" />
    </main>
  );
}
