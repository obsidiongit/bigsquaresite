import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Eyebrow } from "@/components/shared/mono";
import { Pill } from "@/components/shared/Pill";
import { FEATURED_WORK } from "@/lib/featured-work";

/* Case study pages (project-sections/results/_case-study-template.md).
   Skeleton state: the homepage featured work grid links here, so every
   slug must resolve from day one, but real client data does not exist
   yet (Phase 7 blocker). Section order follows the template; every
   content slot renders a visible [PLACEHOLDER]. When real case studies
   land, this page fills in from lib/featured-work.ts entry data. */

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return FEATURED_WORK.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "Case Study",
    description:
      "A BigSquare case study: the situation, the work, and the numbers.",
    alternates: { canonical: `/results/${slug}/` },
    robots: { index: false }, // noindex until real content replaces placeholders
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const work = FEATURED_WORK.find((w) => w.slug === slug);
  if (!work) notFound();

  return (
    <main>
      {/* 1. Hero: eyebrow, headline result, one-line summary */}
      <Section theme="light" size="lg" className="pt-40 md:pt-48">
        <Container>
          <Eyebrow>Case Study</Eyebrow>
          <h1 className="mt-6 max-w-[16ch] font-display text-h1 text-sec-ink">
            {work.title}
          </h1>
          <p className="mt-6 max-w-[52ch] text-lead text-sec-mid">
            [PLACEHOLDER: headline result and one-line summary. Pattern: the
            outcome with the number in it.]
          </p>
          <p className="mt-4 font-mono text-mono-sm uppercase text-sec-mid">
            {work.tags.join(" · ")}
          </p>
        </Container>
      </Section>

      {/* 2. The numbers: 3 metrics on the dark band */}
      <Section theme="dark">
        <Container>
          <div className="grid gap-12 md:grid-cols-3 md:gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n}>
                <p className="font-display text-metric text-sec-acc">000%</p>
                <p className="mt-3 font-mono text-mono-sm uppercase text-sec-mid">
                  [PLACEHOLDER: metric {n}, with time window and source]
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3 to 5. Situation, work, result */}
      <Section theme="light">
        <Container className="max-w-[720px]">
          <h2 className="font-display text-h2 text-sec-ink">The situation</h2>
          <p className="mt-6 text-body text-sec-mid">
            [PLACEHOLDER: 2 to 3 short paragraphs. Where they started, what
            was broken.]
          </p>

          <h2 className="mt-16 font-display text-h2 text-sec-ink">
            What we did
          </h2>
          <p className="mt-6 text-body text-sec-mid">
            [PLACEHOLDER: 3 to 5 steps, plain words, each naming the service
            used, linked.]
          </p>

          <h2 className="mt-16 font-display text-h2 text-sec-ink">
            The result
          </h2>
          <p className="mt-6 text-body text-sec-mid">
            [PLACEHOLDER: 1 to 2 paragraphs restating the headline number with
            the time window.]
          </p>

          <div className="mt-16 border-t border-sec-line pt-8">
            <p className="text-body text-sec-mid">
              Want numbers like these? Book a call and we will show you what we
              would do first.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Pill href="/schedule/">Schedule a Call</Pill>
              <Pill href="/results/" variant="secondary">
                See All Results
              </Pill>
            </div>
          </div>

          <p className="mt-12">
            <Link
              href="/"
              className="font-mono text-mono-sm uppercase text-sec-mid transition-colors duration-[250ms] ease-house hover:text-sec-ink"
            >
              ← Back to the homepage
            </Link>
          </p>
        </Container>
      </Section>
    </main>
  );
}
