import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { SquareField } from "@/components/motion/SquareField";
import { CtaBand } from "@/components/shared/CtaBand";
import { Faq } from "@/components/shared/Faq";
import { MediaSlot } from "@/components/shared/MediaSlot";
import { Eyebrow, Chip } from "@/components/shared/mono";
import { NumberedRuledList } from "@/components/shared/NumberedRuledList";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { IndustryBoard } from "@/components/sections/industries/IndustryBoard";
import { IndustryHero } from "@/components/sections/industries/IndustryHero";
import { IndustryServiceRows } from "@/components/sections/industries/IndustryServiceRows";
import { PhaseCard } from "@/components/sections/industries/PhaseCard";
import { EDGE } from "@/lib/layout";
import type { IndustryPageContent } from "@/lib/industry-pages/types";
import { PHASES } from "@/lib/ninety-days";

/* The T3 industry page layout (_industry-page-template.md v3): one
   component, per-page content. Open layout at EDGE, long-form copy in
   the ~65ch spine, zero pinned runways, no canvas. SquareField gives
   interior pages the homepage's ambient undercurrent (fixed z-1, so
   every section's content wrapper carries relative z-10, the homepage
   layering contract; grounds stay under the field and ink stays over
   it). Media renders through MediaSlot (designed placeholders until
   Brad drops files; asset-manifest.md lists the slots); the BOARD is
   the template's interactive signature, skinned per industry by data.

   Theme map: light hero (media object) > light difference > tint
   personas > light board (surf panel) > light services > light breadth
   band > light spine (media band inside) > [dark proof, HARD-GATED,
   renders nothing until real data exists] > tint process > light FAQ >
   accent CtaBand > dark footer (chrome).

   Annotation budget: 3 of 3 (hero circle, board underline, CTA
   bracket). */

export function IndustryPage({ content }: { content: IndustryPageContent }) {
  return (
    <main>
      <SquareField />

      {/* 1. Hero: breadcrumb, circled H1, answer block, CTAs, mono index */}
      <IndustryHero content={content} />

      {/* 2. The difference: the educational core */}
      <Section theme="light" size="none" className="pb-section-y">
        <div className={EDGE}>
          <div className="relative z-10">
            <SectionHeader
              eyebrow={content.difference.eyebrow}
              title={content.difference.title}
              support={content.difference.support}
            />
            <Reveal className="mt-10 max-w-[65ch] md:mt-12">
              {content.difference.intro.map((p) => (
                <p
                  key={p.slice(0, 32)}
                  className="mt-6 text-body text-sec-mid first:mt-0"
                >
                  {p}
                </p>
              ))}
            </Reveal>
            <NumberedRuledList
              items={content.difference.points}
              size="major"
              className="mt-12 md:mt-14"
            />
          </div>
        </div>
      </Section>

      {/* 3. Who we work with: the visitor self-identifies */}
      <Section theme="tint">
        <div className={EDGE}>
          <div className="relative z-10">
            <SectionHeader
              eyebrow={content.personas.eyebrow}
              title={content.personas.title}
              support={content.personas.support}
            />
            <Reveal stagger className="mt-10 grid gap-6 md:mt-12 lg:grid-cols-3">
              {content.personas.cards.map((card) => (
                <RevealItem key={card.title}>
                  <div className="h-full rounded-[16px] border border-sec-line bg-paper p-6 md:p-8">
                    <Chip>
                      <span className="text-sec-acc">{card.chip}</span>
                    </Chip>
                    <h3 className="mt-5 text-h3 font-bold text-sec-ink">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-body text-sec-mid">{card.body}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 4. The board (default seat): the template's interactive
          signature (v3); skin AND position come from the content
          module (variance dial 5), so stamping restyles it */}
      {content.board.position === "after-personas" && (
        <IndustryBoard board={content.board} />
      )}

      {/* 5. Services for this industry: the internal-linking engine */}
      <Section theme="light" size="none" className="pt-section-y pb-16 md:pb-20">
        <div className={EDGE}>
          <div className="relative z-10">
            <SectionHeader
              eyebrow={content.services.eyebrow}
              title={content.services.title}
              support={content.services.support}
            />
            <IndustryServiceRows
              rows={content.services.rows}
              className="mt-10 md:mt-12"
            />
          </div>
        </div>
      </Section>

      {/* 4-alt. The board's alternate seat (variance dial 5) */}
      {content.board.position === "after-services" && (
        <IndustryBoard board={content.board} />
      )}

      {/* 6. The breadth band (variant per page spec; never repeats the
          hero strip); chips become links as their pages ship */}
      <Section theme="light" size="none" className="pb-section-y">
        <div className={EDGE}>
          <div className="relative z-10 max-w-[52rem]">
            <SeparatorIn />
            <Eyebrow className="mt-4">{content.subMarkets.eyebrow}</Eyebrow>
            <Reveal>
              <p className="mt-4 max-w-[52ch] text-body text-sec-mid">
                {content.subMarkets.line}
              </p>
              {/* chips link when their page exists (sibling industries
                  today, sub-verticals later); plain text until then */}
              <div className="mt-6 flex flex-wrap gap-3">
                {content.subMarkets.chips.map((chip) =>
                  chip.href ? (
                    <Link key={chip.label} href={chip.href}>
                      <Chip className="transition-colors duration-[150ms] ease-house hover:border-sec-ink hover:text-sec-acc">
                        {chip.label}
                      </Chip>
                    </Link>
                  ) : (
                    <Chip key={chip.label}>{chip.label}</Chip>
                  ),
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 7. The method spine: how the work actually runs for this
          industry. The long-form backbone of the 1,500-word contract
          (ServicePage's spine idiom at the T3 depth) */}
      <Section theme="light" size="none" className="pb-section-y">
        <div className={EDGE}>
          <div className="relative z-10 max-w-[65ch]">
            {content.spine.map((block, i) => (
              <div key={block.heading}>
                <Reveal className={i > 0 ? "mt-16" : ""}>
                  <h2 className="font-display text-h2 text-sec-ink">
                    {block.heading}
                  </h2>
                  {block.paragraphs.map((p) => (
                    <p
                      key={p.slice(0, 32)}
                      className="mt-6 text-body text-sec-mid"
                    >
                      {p}
                    </p>
                  ))}
                </Reveal>
                {/* the mid-spine media band: which gap carries it is a
                    variance dial (afterBlock, 1-based) */}
                {i + 1 === content.spineMedia.afterBlock && (
                  <Reveal className="mt-16">
                    <MediaSlot
                      id={content.spineMedia.id}
                      note={content.spineMedia.note}
                      alt={content.spineMedia.alt}
                      aspect="16 / 9"
                      sizes="(min-width: 1024px) 65ch, 100vw"
                    />
                  </Reveal>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 8. Proof slot: HARD-GATED, renders nothing until real case
          studies, metrics, or testimonials exist (template section 8);
          lighting it up is a data change, never a layout change */}

      {/* 9. The first 90 days: the interior-grade process moment */}
      <Section theme="tint">
        <div className={EDGE}>
          <div className="relative z-10">
            <SectionHeader
              eyebrow={content.process.eyebrow}
              title={content.process.title}
              support={content.process.support}
            />
            <Reveal stagger className="mt-10 grid gap-6 md:mt-12 lg:grid-cols-3">
              {PHASES.map((phase, i) => (
                <RevealItem key={phase.name}>
                  <PhaseCard
                    phase={phase}
                    body={content.process.phaseBodies[i]}
                    className="h-full bg-paper"
                  />
                </RevealItem>
              ))}
            </Reveal>
            {/* the page's one statement-scale moment (3.2: max one per
                page): the plan's payoff, closing the body content */}
            <Reveal className="mt-12 md:mt-14">
              <p className="max-w-[26ch] font-display text-statement text-sec-ink">
                {content.process.payoff}
              </p>
              <ul className="mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-x-10">
                {content.process.reassurance.map((fact) => (
                  <li key={fact} className="flex items-start gap-2.5">
                    <Check
                      aria-hidden
                      className="mt-[3px] h-4 w-4 shrink-0 text-sec-acc"
                      strokeWidth={2}
                    />
                    <span className="text-small text-sec-ink">{fact}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 10. FAQ: industry-specific questions (D5) + FAQPage JSON-LD */}
      <Section theme="light">
        <div className={EDGE}>
          <div className="relative z-10">
            <Faq title={content.faqTitle} items={content.faq} />
          </div>
        </div>
      </Section>

      {/* 11. The closing set piece: accent CTA, dark footer follows */}
      <div className="relative z-10">
        <CtaBand />
      </div>
    </main>
  );
}
