import Link from "next/link";
import { cn } from "@/lib/utils";

/* Pill buttons (STYLE_GUIDE.md 6.1). Two variants:
   1. Primary: --acc bg, --onacc text; hover scale 1.02 + soft shadow;
      inverts to white/--acc inside [data-theme="accent"].
   2. Secondary: 1px --sec-ink outline, transparent; hover fills
      directionally from the bottom (fill exits through the top on
      leave), label flips to --sec-bg.
   Styling lives in globals.css (.pill, .pill-primary, .pill-secondary)
   because the directional fill needs ::before mechanics Tailwind can't
   express inline. Labels: Title Case, 2 to 4 words, approved list only. */

type Props = {
  href: string;
  variant?: "primary" | "secondary";
  /** sm is the 72px nav bar size (12px 20px padding) */
  size?: "base" | "sm";
  className?: string;
  children: React.ReactNode;
};

export function Pill({
  href,
  variant = "primary",
  size = "base",
  className,
  children,
}: Props) {
  return (
    <Link
      href={href}
      data-sfx=""
      className={cn(
        "pill",
        variant === "primary" ? "pill-primary" : "pill-secondary",
        size === "sm" && "pill-sm",
        className,
      )}
    >
      <span className="pill-label">{children}</span>
    </Link>
  );
}
