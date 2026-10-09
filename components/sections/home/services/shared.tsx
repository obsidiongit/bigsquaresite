import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Pill } from "@/components/shared/Pill";
import { cn } from "@/lib/utils";

/* Pieces every Services rendition shares (formerly review toggle "servicesLook"). Copy is the original section's, unchanged: headline,
   support, and the two-CTA repeat pair (DRAFT for Brad's copy pass). */

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("h-[0.9em] w-[0.9em]", className)}>
      <path
        d="M4 12h15m0 0-6.5-6.5M19 12l-6.5 6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ServicesHeader({ ctas = true }: { ctas?: boolean }) {
  return (
    <>
      <BaselineReveal as="h2" className="max-w-[16ch] font-display text-h2 text-sec-ink">
        Every channel, one team.
      </BaselineReveal>
      <Reveal className="mt-6 md:flex md:items-end md:justify-between md:gap-12">
        <p className="max-w-[44ch] text-lead text-sec-mid">
          3 groups, 15 services, one point of contact. No hand-offs between vendors, no gaps between channels.
        </p>
        {ctas && (
          <div className="mt-8 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
            <Pill href="/schedule/" variant="primary" className="max-md:w-full max-md:justify-center">
              Schedule a Call
            </Pill>
            <Pill href="/audit/" variant="secondary" className="max-md:w-full max-md:justify-center">
              Get a Free Audit
            </Pill>
          </div>
        )}
      </Reveal>
    </>
  );
}

/** the running-text name: the parenthetical acronym drops, the link's
    title keeps the full name */
export const runName = (label: string) => label.replace(/ \((SEO|GEO)\)$/, "");
