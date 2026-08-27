import Link from "next/link";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { CtaBand } from "@/components/shared/CtaBand";
import { Faq } from "@/components/shared/Faq";
import { MediaSlot } from "@/components/shared/MediaSlot";
import { Eyebrow } from "@/components/shared/mono";
import { NumberedRuledList } from "@/components/shared/NumberedRuledList";
import { Pill } from "@/components/shared/Pill";
import { ProcessCard } from "@/components/shared/ProcessCard";
import { RuleLink } from "@/components/shared/RuleLink";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { EDGE } from "@/lib/layout";
import type { ServicePageContent } from "@/lib/service-pages/types";
import { getGroup, getService } from "@/lib/services";

/* The T2 service page layout (_service-page-template.md v2.1): one
   component, per-page content, three hero variants + a per-page UI
   fragment from the variation kit so the 15 pages share a system
   without repeating a composition. Interior register per STYLE_GUIDE
   4.5: open layout at EDGE, ~65ch spine, zero pinned runways, no
   canvas. NO registration marks anywhere here (Brad, 2026-08-26 gate
   review: the plus signs are retired for newly built pages).

   Annotation budget: 3 of 3 (H1 underline, spine circle, CTA
   bracket). The proof slot stays empty until real case studies exist. */

/* ---- UI fragments (6.4 family) --------------------------------------
   Token-native skeleton compositions, one per page. Bars carry layout
   weight, never quantities (6.12); glyphs say "up", "done", "queued"
   without a number. aria-hidden: the copy carries every claim. */

function Bar({ w, tone = "line" }: { w: string; tone?: "line" | "acc" }) {
  return (
    <span
      className={`h-2 rounded-full ${tone === "acc" ? "bg-acc" : "bg-sec-line"} ${w}`}
    />
  );
}

function Glyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-acc">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const CHECK = "M2.5 8.5 6 12l7.5-8";
const CLOCK = "M8 4.5V8l2.5 1.5M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z";
const PHONE =
  "M3 2.5h3l1.5 3.5-2 1.5a9 9 0 0 0 3 3l1.5-2 3.5 1.5v3a1 1 0 0 1-1 1A11.5 11.5 0 0 1 2 3.5a1 1 0 0 1 1-1z";
const BOX = "M2.5 5 8 2l5.5 3v6L8 14l-5.5-3zM8 8l5.5-3M8 8 2.5 5M8 8v6";
const STAR =
  "M8 1.8l1.9 3.8 4.2.6-3 3 .7 4.2L8 11.4l-3.8 2  .7-4.2-3-3 4.2-.6z";

function FragmentCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      className="w-[248px] rounded-[16px] border border-sec-line bg-paper p-5 shadow-[0_8px_24px_rgba(11,15,23,.08)]"
    >
      <p className="font-mono text-mono-sm uppercase text-sec-mid">{label}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Fragment({ kind }: { kind: NonNullable<ServicePageContent["heroVignette"]> }) {
  switch (kind) {
    case "local-rank":
      return (
        <FragmentCard label="Rankings by location">
          <ul className="space-y-3">
            {["w-[72%]", "w-[54%]", "w-[82%]"].map((w, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="size-[7px] shrink-0 bg-acc" />
                <Bar w={w} />
                <span className="ml-auto text-[15px] leading-none text-acc">↗</span>
              </li>
            ))}
          </ul>
        </FragmentCard>
      );
    case "chat-answer":
      return (
        <FragmentCard label="The answer">
          <div className="flex justify-end">
            <span className="flex w-[60%] items-center rounded-[10px] bg-surf px-3 py-2.5">
              <Bar w="w-full" />
            </span>
          </div>
          <div className="mt-3 flex items-start gap-2.5">
            <span className="mt-1 size-[10px] shrink-0 rounded-[2px] bg-acc" />
            <span className="flex w-[80%] flex-col gap-2 rounded-[10px] border border-sec-line px-3 py-3">
              <Bar w="w-full" />
              <Bar w="w-[70%]" />
              <Bar w="w-[38%]" tone="acc" />
            </span>
          </div>
        </FragmentCard>
      );
    case "review-stars":
      return (
        <FragmentCard label="Reviews">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Glyph key={i} d={STAR} />
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            <Bar w="w-full" />
            <Bar w="w-[62%]" />
          </div>
        </FragmentCard>
      );
    case "send-queue":
      return (
        <FragmentCard label="Send queue">
          <ul className="space-y-3">
            {[
              [CHECK, "w-[78%]"],
              [CHECK, "w-[64%]"],
              [CLOCK, "w-[70%]"],
            ].map(([g, w], i) => (
              <li key={i} className="flex items-center gap-3">
                <Glyph d={g} />
                <Bar w={w} />
              </li>
            ))}
          </ul>
        </FragmentCard>
      );
    case "portal-window":
      return (
        <FragmentCard label="Obsidion portal">
          <div className="overflow-hidden rounded-[10px] border border-sec-line">
            <div className="flex items-center gap-2 border-b border-sec-line bg-surf px-3 py-2">
              <span className="size-[8px] rounded-[2px] bg-acc" />
              <Bar w="w-[40%]" />
            </div>
            <div className="grid grid-cols-2 gap-2 p-3">
              {["w-[80%]", "w-[60%]"].map((w, i) => (
                <span
                  key={i}
                  className="flex flex-col gap-2 rounded-[8px] bg-surf p-2.5"
                >
                  <Bar w="w-[50%]" tone="acc" />
                  <Bar w={w} />
                </span>
              ))}
            </div>
          </div>
        </FragmentCard>
      );
    case "bid-bars":
      return (
        <FragmentCard label="Terms and bids">
          <div className="flex h-[72px] items-end gap-3">
            {[
              ["h-[40%]", "line"],
              ["h-[65%]", "line"],
              ["h-full", "acc"],
              ["h-[52%]", "line"],
            ].map(([h, tone], i) => (
              <span
                key={i}
                className={`w-6 rounded-t-[4px] ${tone === "acc" ? "bg-acc" : "bg-sec-line"} ${h}`}
              />
            ))}
          </div>
        </FragmentCard>
      );
    case "lead-calls":
      return (
        <FragmentCard label="Incoming calls">
          <ul className="space-y-3">
            {["w-[70%]", "w-[58%]", "w-[76%]"].map((w, i) => (
              <li key={i} className="flex items-center gap-3">
                <Glyph d={PHONE} />
                <Bar w={w} />
                <span className="ml-auto">
                  <Glyph d={CHECK} />
                </span>
              </li>
            ))}
          </ul>
        </FragmentCard>
      );
    case "cart-rows":
      return (
        <FragmentCard label="Products">
          <ul className="space-y-3">
            {["w-[74%]", "w-[60%]", "w-[68%]"].map((w, i) => (
              <li key={i} className="flex items-center gap-3">
                <Glyph d={BOX} />
                <Bar w={w} />
              </li>
            ))}
          </ul>
        </FragmentCard>
      );
    case "type-specimen":
      return (
        <FragmentCard label="Type and mark">
          <div className="flex items-end gap-4">
            <span className="font-display text-[44px] leading-none text-sec-ink">
              Aa
            </span>
            <span className="mb-1 size-[18px] rounded-[3px] bg-acc" />
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            <Bar w="w-full" />
            <Bar w="w-[56%]" />
          </div>
        </FragmentCard>
      );
    case "code-lines":
      return (
        <FragmentCard label="Your tools">
          <div className="flex flex-col gap-2.5">
            <Bar w="w-[60%]" />
            <span className="pl-5">
              <Bar w="w-[80%]" tone="acc" />
            </span>
            <span className="flex pl-5">
              <Bar w="w-[52%]" />
            </span>
            <Bar w="w-[34%]" />
          </div>
        </FragmentCard>
      );
  }
}

/* ---- the page ------------------------------------------------------ */

export function ServicePage({ content }: { content: ServicePageContent }) {
  const service = getService(content.slug);
  const group = service ? getGroup(service.group) : undefined;
  const variant = content.heroVariant;
  const bandAt = content.bandPlacement ?? "after-process";

  const h1 = (
    <h1
      className={`mt-8 font-display text-h1 text-sec-ink ${
        variant === "statement-wide" ? "max-w-[24ch]" : "max-w-[18ch]"
      }`}
    >
      {content.h1.map((seg, i) =>
        seg.mark ? (
          <RoughAnnotation key={i} variant="underline" delay={0.7}>
            {seg.text}
          </RoughAnnotation>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </h1>
  );

  const breadcrumb = (
    <nav
      aria-label="Breadcrumb"
      className="mt-4 font-mono text-eyebrow uppercase text-sec-mid"
    >
      <Link
        href="/services/"
        className="transition-colors duration-[150ms] hover:text-sec-ink"
      >
        Services
      </Link>
      {group && (
        <>
          <span aria-hidden> / </span>
          <Link
            href={`/services/#${group.slug}`}
            className="transition-colors duration-[150ms] hover:text-sec-ink"
          >
            {group.name}
          </Link>
        </>
      )}
    </nav>
  );

  const ctas = (
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
  );

  const workBandSection = content.workBand ? (
    <Section theme="light" size="none" className="pb-section-y">
      <div className={EDGE}>
        <MediaSlot
          id={content.workBand.id}
          note={content.workBand.note}
          alt={content.workBand.alt}
          href={content.workBand.href}
          aspectClassName="aspect-video md:aspect-[21/9]"
          sizes="100vw"
          marks={false}
        />
      </div>
    </Section>
  ) : null;

  return (
    <main>
      {/* 1. Hero: one of three variation-kit compositions */}
      <Section
        theme="light"
        size="none"
        className="pt-36 pb-20 md:pt-44 md:pb-24"
      >
        <div className={EDGE}>
          {variant === "statement-wide" ? (
            <>
              <div className="max-w-[72ch]">
                <SeparatorIn />
                {breadcrumb}
                <Reveal>{h1}</Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-6 max-w-[60ch] text-lead text-sec-mid">
                    {content.answer}
                  </p>
                </Reveal>
                {ctas}
              </div>
              {content.heroAsset && (
                <div className="mt-14 md:mt-16">
                  <MediaSlot
                    id={content.heroAsset.id}
                    note={content.heroAsset.note}
                    alt={content.heroAsset.alt}
                    aspectClassName="aspect-video md:aspect-[2.4/1]"
                    sizes="100vw"
                    marks={false}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-6">
              <div className="max-w-[65ch] lg:col-span-6">
                <SeparatorIn />
                {breadcrumb}
                <Reveal>{h1}</Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-6 max-w-[60ch] text-lead text-sec-mid">
                    {content.answer}
                  </p>
                </Reveal>
                {ctas}
              </div>
              {variant === "media-right" && content.heroAsset && (
                <div className="relative mt-12 max-w-[26rem] lg:col-span-5 lg:col-start-8 lg:mt-0 lg:max-w-none">
                  <MediaSlot
                    id={content.heroAsset.id}
                    note={content.heroAsset.note}
                    alt={content.heroAsset.alt}
                    aspectClassName="aspect-square"
                    sizes="(min-width: 1024px) 40vw, 26rem"
                    marks={false}
                  />
                  {content.heroVignette && (
                    <div className="absolute -bottom-8 -left-7 hidden xl:block">
                      <Reveal delay={0.35}>
                        <Fragment kind={content.heroVignette} />
                      </Reveal>
                    </div>
                  )}
                </div>
              )}
              {variant === "fragment-led" && content.heroVignette && (
                <div className="mt-12 max-w-[26rem] lg:col-span-5 lg:col-start-8 lg:mt-0 lg:max-w-none">
                  <Reveal delay={0.25}>
                    <div className="flex aspect-[4/3] items-center justify-center rounded-[24px] bg-surf">
                      <Fragment kind={content.heroVignette} />
                    </div>
                  </Reveal>
                </div>
              )}
            </div>
          )}
        </div>
      </Section>

      {/* 2. Who it is for */}
      <Section theme="light" size="none" className="pb-section-y">
        <div className={EDGE}>
          <SectionHeader eyebrow="Who It Is For" title="Right for you if" />
          <NumberedRuledList
            items={content.whoFor}
            size="compact"
            className="mt-10 md:mt-12"
          />
        </div>
      </Section>

      {/* 2b. The exhibit (obsidion-portal richer variant only): a big
          media moment with air on both sides (6.12), no chrome */}
      {content.exhibit && (
        <Section theme="light" size="lg">
          <div className={EDGE}>
            <MediaSlot
              id={content.exhibit.id}
              note={content.exhibit.note}
              alt={content.exhibit.alt}
              aspectClassName="aspect-video md:aspect-[16/10] lg:aspect-[2/1]"
              sizes="100vw"
              marks={false}
            />
          </div>
        </Section>
      )}

      {/* 3. What you get: the deliverables */}
      <Section theme="tint">
        <div className={EDGE}>
          <SectionHeader eyebrow="Deliverables" title="What you get" />
          <NumberedRuledList
            items={content.deliverables.map((d) => ({
              text: d.text,
              sub: d.sub,
            }))}
            size="major"
            className="mt-10 md:mt-12"
          />
        </div>
      </Section>

      {/* 4. The multi-location method: 3 process cards */}
      <Section theme="light">
        <div className={EDGE}>
          <SectionHeader
            eyebrow="How It Works"
            title="How we do it for many locations"
          />
          <Reveal stagger className="mt-10 grid gap-6 md:mt-12 lg:grid-cols-3">
            {content.process.map((step, i) => (
              <RevealItem key={step.title}>
                <ProcessCard
                  index={i + 1}
                  title={step.title}
                  body={step.body}
                  checklist={step.checklist}
                  className="h-full"
                />
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* 4b. The work band (placement per the variation kit) */}
      {bandAt === "after-process" && workBandSection}

      {/* 5. The long-form spine; one heading phrase carries the
          hand-drawn circle */}
      <Section theme="light" size="none" className="pb-section-y">
        <div className={EDGE}>
          <div className="max-w-[65ch]">
            {content.spine.map((block, i) => (
              <Reveal key={block.heading} className={i > 0 ? "mt-16" : ""}>
                <h2 className="font-display text-h2 text-sec-ink">
                  {block.mark && block.heading.includes(block.mark)
                    ? block.heading
                        .split(block.mark)
                        .flatMap((part, j, arr) =>
                          j < arr.length - 1
                            ? [
                                <span key={`t${j}`}>{part}</span>,
                                <RoughAnnotation
                                  key={`m${j}`}
                                  variant="circle"
                                  className="whitespace-nowrap"
                                >
                                  {block.mark}
                                </RoughAnnotation>,
                              ]
                            : [<span key={`t${j}`}>{part}</span>],
                        )
                    : block.heading}
                </h2>
                {block.paragraphs.map((p) => (
                  <p key={p.slice(0, 32)} className="mt-6 text-body text-sec-mid">
                    {p}
                  </p>
                ))}
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {bandAt === "after-spine" && workBandSection}

      {/* 6. Proof slot: HARD-GATED, renders nothing until real case
          studies exist (Phase 7) */}

      {/* 7. Related pages: the internal-linking contract */}
      <Section theme="tint">
        <div className={EDGE}>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-20">
            <div>
              <SeparatorIn />
              <Eyebrow className="mt-4">Related Services</Eyebrow>
              <div className="mt-6">
                {content.related.map((slug) => {
                  const rel = getService(slug);
                  if (!rel) return null;
                  return (
                    <RuleLink
                      key={slug}
                      href={`/services/${slug}/`}
                      className="py-4"
                    >
                      {rel.name}
                    </RuleLink>
                  );
                })}
              </div>
            </div>
            <div>
              <SeparatorIn />
              <Eyebrow className="mt-4">Industries</Eyebrow>
              {/* linked IMAGE cards: the images are internal links */}
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {content.industries.map((ind) => (
                  <Link key={ind.href} href={ind.href} className="group/ind block">
                    <MediaSlot
                      id={ind.asset.id}
                      note={ind.asset.note}
                      alt={ind.asset.alt}
                      aspectClassName="aspect-[3/2]"
                      sizes="(min-width: 640px) 25vw, 100vw"
                      marks={false}
                      compact
                    />
                    <span className="mt-3 flex items-center justify-between text-body font-bold text-sec-ink transition-colors duration-[250ms] group-hover/ind:text-sec-acc">
                      {ind.label}
                      <span
                        aria-hidden
                        className="text-[15px] transition-transform duration-[250ms] ease-house group-hover/ind:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover/ind:translate-x-0"
                      >
                        ↗
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 8. FAQ: service-specific questions (D5) + FAQPage JSON-LD */}
      <Section theme="light">
        <div className={EDGE}>
          <Faq title={content.faqTitle} items={content.faq} />
        </div>
      </Section>

      {/* 9. The closing set piece: accent CTA, dark footer follows */}
      <CtaBand />
    </main>
  );
}
