import Link from "next/link";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { SquareField } from "@/components/motion/SquareField";
import { CtaBand } from "@/components/shared/CtaBand";
import { MediaSlot } from "@/components/shared/MediaSlot";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";

/* The /industries/ hub (industries-hub.md v1): an INDEX page, leaner
   than its children on purpose (the 1,500-word contract belongs to the
   leaf pages; no board, no spine, no FAQ here). Hero, four linked
   industry cards on the shared industries-*-card asset slots
   (asset-manifest.md; one file serves every page that links that
   industry), CtaBand. Annotations: hero circle + the band's bracket.

   Card one-liners are written HERE, never copied from the leaf pages'
   answer leads (copy-rules: no cloning). The whole card is the link,
   so the MediaSlot inside carries no href of its own (no nested
   anchors). */

const CARDS = [
  {
    slug: "franchise",
    name: "Franchise",
    assetId: "industries-franchise-card",
    note: "[PLACEHOLDER: storefront row or multi-unit signage, 3:2]",
    alt: "Franchise storefronts",
    line: "Development, local programs, and one report for the whole system.",
    tag: "Franchise marketing",
  },
  {
    slug: "home-services",
    name: "Home Services",
    assetId: "industries-home-services-card",
    note: "[PLACEHOLDER: tech at a door or branded van, 3:2]",
    alt: "A home services technician",
    line: "Local search, lead ads, and calls counted per territory.",
    tag: "Home services marketing",
  },
  {
    slug: "legal",
    name: "Legal",
    assetId: "industries-legal-card",
    note: "[PLACEHOLDER: office or consultation, 3:2]",
    alt: "A law firm consultation",
    line: "Search, ads, and content tracked from click to signed case.",
    tag: "Law firm marketing",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    assetId: "industries-healthcare-card",
    note: "[PLACEHOLDER: front desk or treatment room, 3:2]",
    alt: "A healthcare practice front desk",
    line: "Bookings, reviews, and ads that respect the rules of care.",
    tag: "Healthcare marketing",
  },
];

export function IndustriesHub() {
  return (
    <main>
      <SquareField />

      {/* hero: quiet index-page open */}
      <Section theme="light" size="none" className="pt-36 pb-16 md:pt-44 md:pb-20">
        <div className={EDGE}>
          <div className="relative z-10">
            <SeparatorIn />
            <p className="mt-4 font-mono text-eyebrow uppercase text-sec-mid">
              Industries
            </p>
            <Reveal>
              <h1 className="mt-8 max-w-[16ch] font-display text-h1 text-sec-ink">
                The{" "}
                <RoughAnnotation
                  variant="circle"
                  delay={0.75}
                  className="whitespace-nowrap"
                >
                  industries
                </RoughAnnotation>{" "}
                we grow.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[56ch] text-lead text-sec-mid">
                Generic marketing plans die on contact with a real industry. We
                build for 4 of them, deep enough to know the seasons, the
                rules, and the numbers that matter.
              </p>
            </Reveal>
            <Reveal delay={0.18} className="mt-10 flex flex-col gap-4 sm:flex-row">
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
            </Reveal>
          </div>
        </div>
      </Section>

      {/* the index: four linked industry cards */}
      <Section theme="light" size="none" className="pb-section-y-lg">
        <div className={EDGE}>
          <Reveal stagger className="relative z-10 grid gap-8 md:grid-cols-2 md:gap-10">
            {CARDS.map((card) => (
              <RevealItem key={card.slug}>
                <Link
                  href={`/industries/${card.slug}/`}
                  className="group block"
                  aria-label={`${card.name} marketing`}
                >
                  <MediaSlot
                    id={card.assetId}
                    note={card.note}
                    alt={card.alt}
                    aspect="3 / 2"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  {/* card names are the page's H2s, at the flat --text-h2
                      size (3.3): the index page's content IS its names */}
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h2 className="font-display text-h2 text-sec-ink">
                      {card.name}
                    </h2>
                    <span
                      aria-hidden
                      className="text-[18px] text-sec-ink transition-transform duration-[250ms] ease-house group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    >
                      →
                    </span>
                  </div>
                  <p className="mt-2 max-w-[44ch] text-body text-sec-mid">
                    {card.line}
                  </p>
                  <p className="mt-3 font-mono text-mono-sm uppercase text-sec-mid">
                    {card.tag}
                  </p>
                </Link>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </Section>

      <div className="relative z-10">
        <CtaBand />
      </div>
    </main>
  );
}
