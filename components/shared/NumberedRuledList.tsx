import { Reveal } from "@/components/motion/Reveal";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { BracketIndex } from "@/components/shared/mono";
import { cn } from "@/lib/utils";

/* <NumberedRuledList> (STYLE_GUIDE.md 6.10): the editorial list
   pattern. Full-width rows, each on a 1px sec-line top hairline with a
   closing hairline under the last row. Left: [01] bracketed mono index
   in --sec-acc, tabular nums. Then the row's text in Apfel 700 (h3
   scale for major lists, 18px compact), optional one-liner below.

   Entry: each row's hairline draws (SeparatorIn), text Reveals, 80ms
   stagger between rows. Works on every ground via sec-* tokens. This
   replaces icon grids and card rows for enumerations. */

type Item = {
  text: string;
  sub?: string;
};

export function NumberedRuledList({
  items,
  size = "major",
  className,
}: {
  items: Item[];
  /** "major" sets rows at h3 scale; "compact" at 18px */
  size?: "major" | "compact";
  className?: string;
}) {
  return (
    <ol className={cn(className)}>
      {items.map((item, i) => (
        <li key={i}>
          <SeparatorIn delay={i * 0.08} />
          <Reveal delay={i * 0.08}>
            <div className="flex items-baseline gap-5 py-6 md:gap-8 md:py-7">
              <BracketIndex n={i + 1} className="shrink-0 text-sec-acc" />
              <div>
                <p
                  className={cn(
                    "font-bold text-sec-ink",
                    size === "major" ? "text-h3" : "text-[18px] leading-[1.4]",
                  )}
                >
                  {item.text}
                </p>
                {item.sub && (
                  <p className="mt-2 max-w-[56ch] text-body text-sec-mid">
                    {item.sub}
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </li>
      ))}
      <SeparatorIn delay={items.length * 0.08} />
    </ol>
  );
}
