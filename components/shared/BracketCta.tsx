import Link from "next/link";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { cn } from "@/lib/utils";

/* Bracket CTA (STYLE_GUIDE.md 6.1 #3, signature move #1): a mono
   uppercase 13px label wrapped by a rough-drawn [ ] bracket in the
   section accent. The editorial secondary CTA: report downloads, case
   study links, in-page asks. Counts against the annotation budget
   (1 per viewport, 3 per page). */

export function BracketCta({
  href,
  children,
  className,
  active,
  delay,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Forwarded to RoughAnnotation for choreographed draws */
  active?: boolean;
  delay?: number;
}) {
  return (
    <RoughAnnotation variant="bracket" className={className} active={active} delay={delay}>
      <Link
        href={href}
        className={cn(
          "inline-flex items-center gap-2 px-7 py-3.5",
          "font-mono text-eyebrow uppercase text-sec-ink",
          "transition-colors hover:text-sec-acc",
        )}
      >
        {children}
      </Link>
    </RoughAnnotation>
  );
}
