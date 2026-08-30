import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { FunnelFinePrint } from "@/components/sections/funnels/FunnelFinePrint";
import { FunnelMark } from "@/components/sections/funnels/FunnelMark";
import { FunnelProof } from "@/components/sections/funnels/FunnelProof";
import { FunnelVideo } from "@/components/sections/funnels/FunnelVideo";
import { UtmLink } from "@/components/sections/funnels/UtmLink";
import { Eyebrow } from "@/components/shared/mono";
import { NumberedRuledList } from "@/components/shared/NumberedRuledList";
import { VSL_PAGES } from "@/lib/funnels/registry";

/* /go/[slug]/: the VSL landing page (vsl-template.md). Section order
   from the spec: mark, promise headline, sub, the video, the CTA,
   proof, what happens on the call, second CTA, fine print. One goal:
   watch the video, book the call. The CTA routes to /schedule/ with
   the UTMs carried (the calendar embed is retired, decisions.md; the
   /schedule/ application form is the booking step).

   Max width ~900, centered, mobile first. The page sits in ONE
   [data-theme] ground from the registry (D6). Noindex, no nav, no
   footer, never in the sitemap. Flagship: /go/audit/. */

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(VSL_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const funnel = VSL_PAGES[slug];
  return {
    title: funnel?.title ?? "BigSquare",
    robots: { index: false, follow: false },
  };
}

export default async function VslPage({ params }: Params) {
  const { slug } = await params;
  const funnel = VSL_PAGES[slug];
  if (!funnel) notFound();

  const cta = (
    <UtmLink
      href={funnel.cta.href}
      event="calendar_open"
      eventParams={{ funnel: slug }}
      sfx
      className="pill pill-primary"
    >
      <span className="pill-label">{funnel.cta.label}</span>
    </UtmLink>
  );

  return (
    <main data-theme={funnel.palette} className="min-h-svh">
      <div className="mx-auto max-w-[900px] px-5 pb-16 pt-8 sm:px-8 md:pb-24 md:pt-10">
        {/* 1. Mark */}
        <FunnelMark palette={funnel.palette} />

        {/* 2 + 3. The promise and who it is for */}
        <header className="mt-12 text-center md:mt-16">
          <Reveal>
            <Eyebrow>Free marketing audit</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mx-auto mt-5 max-w-[14ch] font-display text-display text-sec-ink">
              {funnel.headline}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-[46ch] text-lead text-sec-mid">
              {funnel.sub}
            </p>
          </Reveal>
        </header>

        {/* 4. The video */}
        <FunnelVideo
          src={funnel.video.src}
          poster={funnel.video.poster}
          funnel={slug}
          className="mt-10 md:mt-12"
        />

        {/* 5. The CTA */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex justify-center md:mt-10">{cta}</div>
        </Reveal>

        {/* 6. Proof */}
        <FunnelProof
          items={funnel.proof}
          note={funnel.proofNote}
          className="mt-16 md:mt-24"
        />

        {/* 7. What happens on the call */}
        <section className="mt-16 md:mt-24">
          <Eyebrow>What happens on the call</Eyebrow>
          <NumberedRuledList items={funnel.steps} size="compact" className="mt-4" />
          {funnel.stepsNote ? (
            <p className="mt-4 font-mono text-mono-sm uppercase text-sec-mid">
              {funnel.stepsNote}
            </p>
          ) : null}
        </section>

        {/* 8. Second CTA: same label, same destination (6.1 repeat pattern) */}
        <Reveal>
          <div className="mt-12 flex justify-center md:mt-16">{cta}</div>
        </Reveal>

        {/* 9. Fine print */}
        <FunnelFinePrint text={funnel.finePrint} className="mt-16 md:mt-20" />
      </div>
    </main>
  );
}
