import Link from "next/link";
import { cn } from "@/lib/utils";

/* <RuleLink> (STYLE_GUIDE.md 6.1 #4): a quiet full-width link row on a
   1px bottom hairline. Label left, → or ↗ right. Hover: the arrow
   slides 4px right and the hairline darkens to --sec-ink, 250ms house.
   Reduced motion: color change only. Reused by the services tables,
   the footer link tables, and in-section quiet links. */

type Props = {
  href: string;
  children: React.ReactNode;
  arrow?: "→" | "↗";
  /** base: bold body scale; sm: the 16px Apfel 500 table-item row */
  size?: "base" | "sm";
  className?: string;
};

export function RuleLink({
  href,
  children,
  arrow = "→",
  size = "base",
  className,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-between gap-4 border-b border-sec-line text-sec-ink",
        "transition-colors duration-[250ms] ease-house hover:border-sec-ink",
        size === "base" ? "pb-3 text-body font-bold" : "py-3 text-[16px] font-medium",
        className,
      )}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="text-[15px] transition-transform duration-[250ms] ease-house group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      >
        {arrow}
      </span>
    </Link>
  );
}
