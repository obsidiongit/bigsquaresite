import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Eyebrow } from "@/components/shared/mono";
import { Pill } from "@/components/shared/Pill";
import { FEATURED_WORK, type CaseStudy, type WorkEntry } from "@/lib/featured-work";
import { WorkMedia } from "@/components/shared/WorkMedia";
import { FOOTER_COLUMNS } from "@/lib/footer-links";
import { breadcrumbJsonLd } from "@/lib/jsonld";

/* Case study pages (project-sections/results/_case-study-template.md;
   data-driven 2026-08-31, Pane C). Two states from one entry in
   lib/featured-work.ts:
   - `caseStudy` absent: the reel piece page (ReelPiece): the clip, what
     it shows, the services behind it. noindex, no JSON-LD.
   - `caseStudy` present: the real layout in the template's section
     order, indexed, title tag "[Result] for [Client type] | BigSquare"
     from the headline, BreadcrumbList JSON-LD.
   Filling an entry is the whole content drop; no code changes. */

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return FEATURED_WORK.map((w) => ({ slug: w.slug }));
}

/** Display label for a /services/ slug, from the same source the footer
    IA uses (one source for service names). Falls back to the slug so a
    bad value is visible, not invisible. */
function serviceLabel(slug: string): string {
  for (const column of FOOTER_COLUMNS) {
    const hit = column.links.find((l) => l.href === `/services/${slug}/`);
    if (hit) return hit.label;
  }
  return slug;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const work = FEATURED_WORK.find((w) => w.slug === slug);
  const cs = work?.caseStudy;
  return {
    // The layout template appends " | BigSquare"
    title: cs ? cs.headline : work ? work.title : "Work",
    description: cs
      ? cs.summary
      : work?.blurb ?? "Work from the BigSquare reel.",
    alternates: { canonical: `/results/${slug}/` },
    // Indexed only once the entry carries real data
    robots: cs ? undefined : { index: false },
  };
}

function Metrics({ cs }: { cs: CaseStudy }) {
  return (
    <div className="grid gap-12 md:grid-cols-3 md:gap-6">
      {cs.metrics.map((metric) => (
        <div key={metric.label}>
          <p className="font-display text-metric text-sec-acc">{metric.value}</p>
          <p className="mt-3 text-body text-sec-ink">{metric.label}</p>
          <p className="mt-2 font-mono text-mono-sm uppercase text-sec-mid">
            {metric.window} · {metric.source}
          </p>
        </div>
      ))}
    </div>
  );
}

function CaseStudyBody({ cs }: { cs: CaseStudy }) {
  return (
    <>
      <h2 className="font-display text-h2 text-sec-ink">The situation</h2>
      {cs.situation.map((p) => (
        <p key={p} className="mt-6 text-body text-sec-mid">
          {p}
        </p>
      ))}

      <h2 className="mt-16 font-display text-h2 text-sec-ink">What we did</h2>
      <ol className="mt-6 flex flex-col gap-6">
        {cs.steps.map((step, i) => (
          <li key={step.text} className="flex items-baseline gap-4">
            <span className="shrink-0 font-mono text-mono-sm text-sec-acc">
              [{String(i + 1).padStart(2, "0")}]
            </span>
            <p className="text-body text-sec-mid">
              {step.text}{" "}
              <Link
                href={`/services/${step.serviceSlug}/`}
                className="whitespace-nowrap font-medium text-sec-ink underline underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-sec-acc"
              >
                {serviceLabel(step.serviceSlug)}
              </Link>
            </p>
          </li>
        ))}
      </ol>

      <h2 className="mt-16 font-display text-h2 text-sec-ink">The result</h2>
      {cs.result.map((p) => (
        <p key={p} className="mt-6 text-body text-sec-mid">
          {p}
        </p>
      ))}

      {cs.quote ? (
        <blockquote className="mt-16 border-y border-sec-line py-8">
          <p className="max-w-[26ch] font-display text-statement text-sec-ink">
            {cs.quote.text}
          </p>
          <footer className="mt-6 font-mono text-mono-sm uppercase text-sec-mid">
            {cs.quote.name} · {cs.quote.role}
          </footer>
        </blockquote>
      ) : null}

      <div className="mt-16">
        <Eyebrow>Services used</Eyebrow>
        <ul className="mt-4 flex flex-col gap-2">
          {cs.services.map((slug) => (
            <li key={slug}>
              <Link
                href={`/services/${slug}/`}
                className="text-body font-medium text-sec-ink underline underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-sec-acc"
              >
                {serviceLabel(slug)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* A piece from the BigSquare reel (entries without a caseStudy): the
   clip big, what it shows in one line, the services behind it, and the
   ask. No metrics: those only ship with a real, sourced case study. */
function ReelPiece({ work }: { work: WorkEntry }) {
  return (
    <main>
      <Section theme="light" size="lg" className="pt-40 md:pt-48">
        <Container>
          <Eyebrow>{work.media ? "From the BigSquare studio" : "From the BigSquare reel"}</Eyebrow>
          <h1 className="mt-6 max-w-[16ch] font-display text-h1 text-sec-ink">{work.title}</h1>
          {work.blurb ? <p className="mt-6 max-w-[52ch] text-lead text-sec-mid">{work.blurb}</p> : null}
          <p className="mt-4 font-mono text-mono-sm uppercase text-sec-mid">{work.tags.join(" · ")}</p>
          {/* a still shows whole at its own 4:5; a reel piece plays its clip */}
          <div
            className={
              work.media
                ? "relative mt-12 aspect-[4/5] w-full max-w-[640px] overflow-hidden rounded-[24px] bg-surf"
                : "relative mt-12 aspect-video overflow-hidden rounded-[24px] bg-darkpanel"
            }
          >
            <WorkMedia work={work} sizes="(min-width: 768px) 640px, 100vw" />
          </div>
        </Container>
      </Section>
      <Section theme="light">
        <Container className="max-w-[720px]">
          {work.services?.length ? (
            <div>
              <Eyebrow>Services behind it</Eyebrow>
              <ul className="mt-4 flex flex-col gap-2">
                {work.services.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/services/${slug}/`}
                      className="text-body font-medium text-sec-ink underline underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-sec-acc"
                    >
                      {serviceLabel(slug)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="mt-16 border-t border-sec-line pt-8">
            <p className="text-body text-sec-mid">
              Want work like this for your brand? Book a call and we will show you what we would do first.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Pill href="/schedule/">Schedule a Call</Pill>
              <Pill href="/results/" variant="secondary">
                See All Work
              </Pill>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const work = FEATURED_WORK.find((w) => w.slug === slug);
  if (!work) notFound();

  const cs = work.caseStudy;
  if (!cs) return <ReelPiece work={work} />;
  // JSON-LD only with real data: placeholder titles never reach
  // structured data (OrganizationJsonLd rule).
  const jsonLd = cs
    ? breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Results", path: "/results/" },
        { name: cs.headline, path: `/results/${slug}/` },
      ])
    : null;

  return (
    <main>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      {/* 1. Hero: eyebrow, headline result, client line, one-line summary */}
      <Section theme="light" size="lg" className="pt-40 md:pt-48">
        <Container>
          <Eyebrow>Case Study</Eyebrow>
          <h1 className="mt-6 max-w-[16ch] font-display text-h1 text-sec-ink">
            {cs.headline}
          </h1>
          {cs ? (
            <>
              <p className="mt-6 max-w-[52ch] text-lead text-sec-mid">
                {cs.summary}
              </p>
              <p className="mt-4 font-mono text-mono-sm uppercase text-sec-mid">
                {work.title} · {work.tags.join(" · ")}
              </p>
            </>
          ) : null}
        </Container>
      </Section>

      {/* 2. The numbers: 3 metrics on the dark band */}
      <Section theme="dark">
        <Container><Metrics cs={cs} /></Container>
      </Section>

      {/* 3 to 7. Situation, work, result, quote, services */}
      <Section theme="light">
        <Container className="max-w-[720px]">
          <CaseStudyBody cs={cs} />

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
