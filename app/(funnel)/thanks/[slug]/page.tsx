import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { FunnelMark } from "@/components/sections/funnels/FunnelMark";
import { ThanksBeacon } from "@/components/sections/funnels/ThanksBeacon";
import { UtmLink } from "@/components/sections/funnels/UtmLink";
import { NumberedRuledList } from "@/components/shared/NumberedRuledList";
import { THANKS_PAGES } from "@/lib/funnels/registry";

/* /thanks/[slug]/: the funnel thank-you page. Big type, one job: say
   exactly what happens next. Mark, the headline at display scale, one
   lead line, the next steps as a numbered ruled list, one secondary
   link to /results/. The UTMs arrive on the URL from the form's
   redirect and stay there for the tracking tags; ThanksBeacon fires
   the spec's `booked` event once per view.

   The accent ground (D6: one ground per page): the one place the brand
   blue goes full bleed on the site is the closing CTA band, and a
   thank-you page is exactly that moment. Everything on it resolves
   through the sec-* tokens (white ink, white hairlines, the pill
   inverts). The page's one accent-font word is the NEXT label.
   Noindex, no nav, no footer, never in the sitemap. */

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(THANKS_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const funnel = THANKS_PAGES[slug];
  return {
    title: funnel?.title ?? "BigSquare",
    robots: { index: false, follow: false },
  };
}

export default async function ThanksPage({ params }: Params) {
  const { slug } = await params;
  const funnel = THANKS_PAGES[slug];
  if (!funnel) notFound();

  return (
    <main data-theme={funnel.palette} className="flex min-h-svh flex-col">
      <ThanksBeacon funnel={slug} />
      <div className="mx-auto flex w-full max-w-[900px] flex-1 flex-col px-5 pb-16 pt-8 sm:px-8 md:pb-24 md:pt-10">
        <FunnelMark palette={funnel.palette} />

        <div className="flex flex-1 flex-col justify-center py-16 md:py-24">
          <Reveal>
            <h1 className="max-w-[12ch] font-display text-display text-sec-ink">
              {funnel.headline}
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[40ch] text-lead text-sec-mid">{funnel.lead}</p>
          </Reveal>

          <Reveal delay={0.14}>
            <p
              aria-hidden
              className="mt-14 font-accent text-h2 uppercase text-sec-ink md:mt-16"
            >
              Next
            </p>
          </Reveal>
          <h2 className="sr-only">What happens next</h2>
          <NumberedRuledList
            items={funnel.next.map((text) => ({ text }))}
            size="compact"
            className="mt-2"
          />

          <Reveal delay={0.1}>
            <div className="mt-10 md:mt-12">
              <UtmLink href={funnel.secondary.href} className="pill pill-secondary">
                <span className="pill-label">{funnel.secondary.label}</span>
              </UtmLink>
            </div>
          </Reveal>
        </div>

        <p className="text-center font-mono text-mono-sm uppercase text-sec-mid">
          BigSquare Marketing © {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
