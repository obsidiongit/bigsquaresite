import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { MediaSlot } from "@/components/shared/MediaSlot";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";
import type { IndustryPageContent } from "@/lib/industry-pages/types";

/* T3 hero (_industry-page-template.md v3 section 1): display type
   beside a framed media object. Mono breadcrumb row (the visible half
   of the BreadcrumbList schema), H1 with the hand-drawn circle on the
   industry word (T3's system ink; T2 owns the underline), the GEO
   answer lead, the two-CTA pair, the hero MediaSlot right (designed
   placeholder until Brad drops the file), and the sub-market mono
   strip running the hero's foot (the film-meta voice; keyword seeding
   without list chrome). Mobile stacks: H1, lead, CTAs, media, strip.
   Annotation budget: 1 of 3 (the circle). */

export function IndustryHero({ content }: { content: IndustryPageContent }) {
  return (
    <Section theme="light" size="none" className="pt-36 pb-20 md:pt-44 md:pb-24">
      <div className={EDGE}>
        <div className="relative z-10">
          <SeparatorIn />
          <nav
            aria-label="Breadcrumb"
            className="mt-4 font-mono text-eyebrow uppercase text-sec-mid"
          >
            <Link
              href="/industries/"
              className="transition-colors duration-[150ms] hover:text-sec-ink"
            >
              Industries
            </Link>
            <span aria-hidden> / </span>
            <span className="text-sec-ink">{content.name}</span>
          </nav>

          <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-6">
            <div className="lg:col-span-7">
              <Reveal>
                <h1 className="mt-8 max-w-[22ch] font-display text-h1 text-sec-ink">
                  {content.h1.map((seg, i) =>
                    seg.mark ? (
                      <RoughAnnotation
                        key={i}
                        variant="circle"
                        delay={0.75}
                        className="whitespace-nowrap"
                      >
                        {seg.text}
                      </RoughAnnotation>
                    ) : (
                      <span key={i}>{seg.text}</span>
                    ),
                  )}
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-[56ch] text-lead text-sec-mid">
                  {content.answer}
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

            {/* the hero media object; per-page asset, designed
                placeholder until the file lands (asset-manifest.md) */}
            <Reveal
              delay={0.22}
              className="mt-12 lg:col-span-5 lg:mt-8 lg:pl-4 xl:pl-8"
            >
              <MediaSlot
                id={content.heroMedia.id}
                note={content.heroMedia.note}
                alt={content.heroMedia.alt}
                aspect="4 / 3"
                priority
              />
            </Reveal>
          </div>

          {/* the sub-market mono strip: the hero's foot row */}
          <Reveal delay={0.3} className="mt-12 lg:mt-14">
            {/* explicit {" "} between chunks: JSX strips the newline
                whitespace, and adjacent nowrap spans with nothing
                between them fuse into one unbreakable line (found as an
                833px overflow at 375) */}
            <p className="font-mono text-mono-sm uppercase leading-[2] text-sec-mid">
              {content.monoStrip.map((item, i) => (
                <span key={item}>
                  <span className="whitespace-nowrap">
                    {item}
                    {i < content.monoStrip.length - 1 && (
                      <span aria-hidden className="ml-3 text-sec-acc">
                        /
                      </span>
                    )}
                  </span>{" "}
                </span>
              ))}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
