import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { CtaBand } from "@/components/shared/CtaBand";
import { Eyebrow } from "@/components/shared/mono";
import { Section } from "@/components/shared/Section";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { EDGE } from "@/lib/layout";
import { RESOURCES } from "@/lib/resources";
import { ResourceList } from "./ResourceList";

export const metadata: Metadata = {
  title: "Free Guides & Tools",
  description:
    "Free checklists, calculators, and templates from BigSquare Marketing. The same things we use on client accounts, yours to keep.",
  alternates: { canonical: "/resources/" },
};

/* /resources/ (Pane A, 2026-08-30): a real page, not a shell. Hero,
   then the ruled list of the 5 lead magnets (lib/resources.ts) with
   the request form inside each row. The assets are not built yet, so
   the list is flagged and every form says so; /resources/[slug]/ stays
   404 until files land.

   Annotation budget: 2 of 3 (H1 circle, CtaBand bracket). No
   registration marks (new-page rule). */

export default function ResourcesPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources/" },
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
          <Eyebrow className="mt-4">Resources</Eyebrow>

          <div className="mt-6 flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-6">
            <Reveal className="md:col-span-8">
              <h1 className="max-w-[16ch] font-display text-h1 text-sec-ink">
                <RoughAnnotation
                  variant="circle"
                  delay={0.7}
                  className="whitespace-nowrap"
                >
                  Free
                </RoughAnnotation>{" "}
                guides, checklists, and tools.
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-end">
              <p className="max-w-[40ch] text-body text-sec-mid">
                The same things we use on client accounts. Take them, use
                them, and call us if you want a hand.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 2. The list */}
      <Section theme="light" size="none" className="pb-section-y-lg">
        <div className={EDGE}>
          <p className="mb-8 max-w-[64ch] font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
            [PLACEHOLDER: working titles below, confirm with Brad. The files
            are in production. Each form logs the request until its file
            exists]
          </p>
          <ResourceList resources={RESOURCES} />
        </div>
      </Section>

      {/* 3. The closing ask */}
      <CtaBand
        headline="Want us to walk you through it?"
        body="Book a call. We will go through your numbers together and tell you exactly what we would do first."
      />
    </main>
  );
}
