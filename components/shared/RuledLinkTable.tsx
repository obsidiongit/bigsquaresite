import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { RuleLink } from "@/components/shared/RuleLink";
import { cn } from "@/lib/utils";

/* <RuledLinkTable> (STYLE_GUIDE.md 6.1, 6.2; pxpush tables): a ruled
   mono index table. One header rule row spanning the container ([01]
   mono index, group name in Apfel 700 at h3 scale, ↗ right; the whole
   row links and fills directionally on hover via .row-fill), then the
   group's items as quiet RuleLink rows in a one- or two-column grid.

   Shared treatment: the homepage services section, the footer link
   columns (phase 2I), and service pages all use this so they read as
   one system. */

type TableItem = { label: string; href: string };

type Props = {
  index: number;
  title: string;
  /** the header row's destination (group anchor or index page) */
  href: string;
  items: TableItem[];
  /** md+ column count for the item rows */
  columns?: 1 | 2;
  className?: string;
};

export function RuledLinkTable({
  index,
  title,
  href,
  items,
  columns = 2,
  className,
}: Props) {
  return (
    <div className={cn(className)}>
      <SeparatorIn />
      <Reveal>
        <Link
          href={href}
          className="row-fill group flex items-center gap-5 py-5 text-sec-ink md:gap-8"
        >
          <span className="shrink-0 font-mono text-mono-sm uppercase tabular-nums text-sec-acc transition-colors duration-[150ms] group-hover:text-sec-bg">
            [{String(index).padStart(2, "0")}]
          </span>
          <span className="flex-1 text-h3 font-bold">{title}</span>
          <span aria-hidden className="text-[18px]">
            ↗
          </span>
        </Link>
      </Reveal>
      <div
        className={cn(
          "grid grid-cols-1 gap-x-6 border-t border-sec-line",
          columns === 2 && "md:grid-cols-2",
        )}
      >
        {items.map((item, i) => (
          <Reveal key={item.href} delay={i * 0.04}>
            <RuleLink href={item.href} size="sm">
              {item.label}
            </RuleLink>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
