import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { Eyebrow, NoLabel } from "@/components/shared/mono";
import { cn } from "@/lib/utils";

/* <SectionHeader> (STYLE_GUIDE.md 6.3): eyebrow row (Nº label with a
   SeparatorIn hairline above it), H2 with baseline reveal, and a right
   column holding either a support paragraph (text-small, sec-mid, max
   40ch, top-aligned to the H2) or the two-CTA pair. Huge-left,
   small-right; stacks on mobile: eyebrow, H2, support, CTAs. */

type Props = {
  title: string;
  /** Nº section label parts; pass both for "Nº001 / INTRO" */
  no?: number;
  label?: string;
  /** Plain eyebrow for sections that are not numbered */
  eyebrow?: string;
  support?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  no,
  label,
  eyebrow,
  support,
  actions,
  className,
}: Props) {
  const hasRight = Boolean(support || actions);
  return (
    <header className={cn(className)}>
      <SeparatorIn />
      {no !== undefined && label ? (
        <NoLabel n={no} label={label} className="mt-4" />
      ) : eyebrow ? (
        <Eyebrow className="mt-4">{eyebrow}</Eyebrow>
      ) : null}
      <div
        className={cn(
          "mt-6 flex flex-col gap-8",
          hasRight && "md:grid md:grid-cols-12 md:items-start md:gap-6",
        )}
      >
        <BaselineReveal
          as="h2"
          className={cn(
            "font-display text-h2 text-sec-ink",
            hasRight && "md:col-span-7",
          )}
        >
          {title}
        </BaselineReveal>
        {hasRight && (
          <div className="flex flex-col gap-6 md:col-span-4 md:col-start-9">
            {support && (
              <div className="max-w-[40ch] text-small text-sec-mid">{support}</div>
            )}
            {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
          </div>
        )}
      </div>
    </header>
  );
}
