import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { OFFICES } from "@/lib/offices";
import { cn } from "@/lib/utils";

/* <OfficeCards> (contact.md v2): the two office cards, one source for
   office facts (lib/offices.ts). Surf card at --radius-media, city in
   Apfel 700, mono state line, then address and phone rows that render
   the honest mono placeholder while lib/offices.ts holds null. The
   whole card links to its /locations/ page (arrow-leads-title hover
   grammar). Works on light and tint grounds via sec-* tokens; no
   registration marks (new-page rule). */

export function OfficeCards({
  layout = "row",
  className,
}: {
  /** "row": side-by-side from sm (about). "stack": one column (the
      contact rail). */
  layout?: "row" | "stack";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        layout === "row" && "sm:grid-cols-2 sm:gap-6",
        className,
      )}
    >
      {OFFICES.map((office, i) => (
        <Reveal key={office.city} delay={i * 0.08}>
          <Link
            href={office.href}
            className={cn(
              "group flex h-full flex-col rounded-[24px] border border-sec-line bg-surf p-6 md:p-8",
              "transition-shadow duration-[var(--dur-base)] hover:shadow-[0_8px_24px_rgba(11,15,23,.08)]",
            )}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-h3 font-bold text-sec-ink">{office.city}</h3>
              <span
                aria-hidden
                className="text-[15px] text-sec-mid transition-transform duration-[250ms] ease-house group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              >
                →
              </span>
            </div>
            <p className="mt-1 font-mono text-mono-sm uppercase text-sec-mid">
              {office.state}
            </p>
            <div className="mt-5 flex flex-col gap-1.5">
              <p className="font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
                {office.address ?? "[PLACEHOLDER: street address]"}
              </p>
              <p className="font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
                {office.phone ?? "[PLACEHOLDER: phone]"}
              </p>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
