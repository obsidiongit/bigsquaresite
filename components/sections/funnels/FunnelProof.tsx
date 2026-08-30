import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/* Three proof bullets (landing-pages specs, "three proof bullets or
   one case study card"). Until a sourced case study exists the page
   runs the bullets: short bold lines behind a brand-square marker in
   --sec-acc, three across on sm+, stacked on mobile, plus a visible
   placeholder line for the sourced result. Works on every ground. */
export function FunnelProof({
  items,
  note,
  className,
}: {
  items: string[];
  note?: string;
  className?: string;
}) {
  return (
    <section aria-label="Why BigSquare" className={cn(className)}>
      <Reveal stagger>
        <ul className="grid gap-6 sm:grid-cols-3 sm:gap-8">
          {items.map((item) => (
            <li key={item}>
              <RevealItem className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-[7px] size-2 shrink-0 rounded-[2px] bg-sec-acc"
                />
                <p className="text-[18px] font-bold leading-[1.4] text-sec-ink">
                  {item}
                </p>
              </RevealItem>
            </li>
          ))}
        </ul>
      </Reveal>
      {note ? (
        <p className="mt-6 font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
          {note}
        </p>
      ) : null}
    </section>
  );
}
