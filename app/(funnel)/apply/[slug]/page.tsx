import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { ApplyForm } from "@/components/sections/funnels/ApplyForm";
import { FunnelFinePrint } from "@/components/sections/funnels/FunnelFinePrint";
import { FunnelMark } from "@/components/sections/funnels/FunnelMark";
import { FunnelProof } from "@/components/sections/funnels/FunnelProof";
import { Eyebrow } from "@/components/shared/mono";
import { APPLY_PAGES } from "@/lib/funnels/registry";

/* /apply/[slug]/: the application funnel (application-funnel-
   template.md). Mark, the offer in one line, who qualifies, the
   stepped form in a paper card, proof bullets, fine print. Short page,
   max width 640, big inputs, no clutter. The form posts through
   submitForm and routes to /thanks/[slug]/ with the UTMs carried.

   One [data-theme] ground from the registry (D6). Noindex, no nav,
   no footer, never in the sitemap. Flagship: /apply/growth-partner/. */

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(APPLY_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const funnel = APPLY_PAGES[slug];
  return {
    title: funnel?.title ?? "BigSquare",
    robots: { index: false, follow: false },
  };
}

export default async function ApplyPage({ params }: Params) {
  const { slug } = await params;
  const funnel = APPLY_PAGES[slug];
  if (!funnel) notFound();

  return (
    <main data-theme={funnel.palette} className="min-h-svh">
      <div className="mx-auto max-w-[640px] px-5 pb-16 pt-8 sm:px-8 md:pb-24 md:pt-10">
        {/* 1. Mark */}
        <FunnelMark palette={funnel.palette} />

        {/* 2 + 3. The offer and who qualifies */}
        <header className="mt-12 text-center md:mt-16">
          <Reveal>
            <Eyebrow>Application</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mx-auto mt-5 max-w-[14ch] font-display text-h1 text-sec-ink">
              {funnel.headline}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-[40ch] text-body text-sec-mid">
              {funnel.sub}
            </p>
          </Reveal>
        </header>

        {/* 4 + 5. The stepped form (cards read as paper on the tint ground) */}
        <Reveal delay={0.16}>
          <div className="mt-10 rounded-[24px] border border-sec-line bg-paper p-6 sm:p-8 md:mt-12">
            <ApplyForm slug={slug} funnel={funnel} />
          </div>
        </Reveal>

        {/* 6. Proof */}
        <FunnelProof items={funnel.proof} className="mt-14 md:mt-16" />

        <FunnelFinePrint text={funnel.finePrint} className="mt-14 md:mt-16" />
      </div>
    </main>
  );
}
