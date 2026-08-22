import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";

/* <InfoBar> (STYLE_GUIDE.md 6.6): 13px mono row on a 1px top rule
   spanning the container. Brand line left, bracketed utility links
   center-right, © right. One under the hero region, one opening the
   footer. No JS. */

type InfoBarLink = { label: string; href: string };

export function InfoBar({
  brand = "BigSquare Marketing",
  links = [],
  className,
}: {
  brand?: string;
  links?: InfoBarLink[];
  className?: string;
}) {
  return (
    <Container className={className}>
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-x-6 gap-y-1",
          "border-t border-sec-line py-3",
          "font-mono text-eyebrow uppercase",
        )}
      >
        <span className="text-sec-ink">{brand}</span>
        <span className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sec-mid transition-colors hover:text-sec-ink"
            >
              [{link.label}]
            </Link>
          ))}
          <span className="text-sec-mid">© {new Date().getFullYear()}</span>
        </span>
      </div>
    </Container>
  );
}
