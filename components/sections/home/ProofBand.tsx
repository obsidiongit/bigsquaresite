import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { MetricBlock } from "@/components/shared/MetricBlock";
import { RuleLink } from "@/components/shared/RuleLink";
import { Section } from "@/components/shared/Section";
import { METRICS } from "@/lib/metrics";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

/* Proof band (7.proof-numbers.md v3.1): the dark band where the trust
   argument goes quantitative. Youtech "Anti-Agency" composition:
   headline + support + stat grid left, media panel right; the logo
   marquee rides directly beneath the band (page.tsx) so the two read
   as one extended trust block. Full bleed dark, EDGE width, no rails,
   no No label. z-[6] (Brad 2026-08-24, card sweep session): the band
   paints its ground ABOVE the fixed cube canvas (z-5), the second of
   the two full-viewport occluders (with Search) that hide the
   companion between the solution card sweep and the trust marquee.

   Copy is Brad's TEST COPY (2026-08-24 proof-band copy test),
   applied verbatim for his review; not yet locked. TRIMMED same day
   at his ask (section too tall, dead space around the player): the
   second support paragraph ("Our team knows when to move fast...")
   is CUT from the render, held in 7.proof-numbers.md if he wants it
   back; rhythm dropped to base. Metric numbers in lib/metrics.ts are
   VISUAL PLACEHOLDERS he asked for (see the launch gate there); the
   media panel is still an honest placeholder. The closing rule link
   label is his line, kept in his sentence case.

   Media panel: when the real film lands, replace <MediaPlaceholder>
   with a poster-first video panel (Hero's media pattern, or
   FramedMediaPanel minus its registration marks). */

/* Decorative player chrome for the placeholder panel: reads as a
   media player (Youtech frame 05) without claiming any content.
   aria-hidden; the mono note carries the real information. */
function MediaPlaceholder() {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-sec-line bg-[rgba(0,0,0,.35)]">
      <div className="relative aspect-video">
        {/* centered play control */}
        <div
          aria-hidden
          className="absolute inset-0 flex flex-col items-center justify-center gap-5"
        >
          <span className="flex size-16 items-center justify-center rounded-full border border-sec-line bg-[rgba(255,255,255,.06)] md:size-20">
            <svg
              viewBox="0 0 24 24"
              className="ml-1 size-6 fill-ondark md:size-7"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
        <p className="absolute inset-x-0 bottom-14 px-6 text-center font-mono text-mono-sm uppercase text-sec-mid md:bottom-16">
          [PLACEHOLDER: trust film or photo]
        </p>
        {/* bottom control bar */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 flex items-center gap-4 px-5 py-4"
        >
          <svg viewBox="0 0 24 24" className="size-4 shrink-0 fill-ondark">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="relative h-[3px] flex-1 rounded-full bg-[rgba(255,255,255,.18)]">
            <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-sec-acc" />
            <span className="absolute left-1/3 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ondark" />
          </span>
          <svg
            viewBox="0 0 24 24"
            className="size-4 shrink-0 fill-none stroke-ondark stroke-2"
          >
            <path d="M4 9v6h4l5 4V5L8 9H4z" className="fill-ondark stroke-none" />
            <path d="M16.5 8.5a5 5 0 0 1 0 7" strokeLinecap="round" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            className="size-4 shrink-0 fill-none stroke-ondark stroke-2"
          >
            <path
              d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function ProofBand() {
  return (
    <Section theme="dark" size="base" anchor="proof" className="z-[6]">
      <div className={cn(EDGE, "relative z-10")}>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14 xl:gap-16">
          <div>
            <BaselineReveal
              as="h2"
              className="max-w-[20ch] font-display text-h2 text-sec-ink"
            >
              Big ad accounts need more than a few good ads.
            </BaselineReveal>
            <Reveal className="mt-4">
              <p className="max-w-[52ch] text-small text-sec-mid">
                They need a plan, a strong team, and a system that can keep
                up. We manage the full picture. That means budgets,
                campaigns, tracking, creative, and reporting all work
                together.
              </p>
            </Reveal>

            <Reveal
              stagger
              className="mt-8 grid grid-cols-2 gap-x-8 gap-y-7 md:gap-x-12"
            >
              {METRICS.map((metric) => (
                <RevealItem key={metric.caption}>
                  <MetricBlock metric={metric} />
                </RevealItem>
              ))}
            </Reveal>

            <Reveal className="mt-8">
              <RuleLink href="/results/" className="max-w-[22rem]">
                See how we help brands scale
              </RuleLink>
            </Reveal>
          </div>

          <Reveal>
            <MediaPlaceholder />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
