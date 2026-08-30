import Link from "next/link";
import { cn } from "@/lib/utils";

/* Pill buttons (STYLE_GUIDE.md 6.1). Three variants:
   1. Primary: --acc bg, --onacc text; hover scale 1.02 + soft shadow;
      inverts to white/--acc inside [data-theme="accent"].
   2. Secondary: 1px --sec-ink outline, transparent; hover fills
      directionally from the bottom (fill exits through the top on
      leave), label flips to --sec-bg.
   3. Square (2026-08-30, the nav's action): the primary's fill with
      square corners, so it reads as one of the brand squares rather
      than a rounded pill. Hover: --ink floods up from the bottom, the
      label stays white. Nav bar and overlay only for now.
   Styling lives in globals.css (.pill, .pill-primary, .pill-secondary,
   .pill-square) because the directional fill needs ::before mechanics
   Tailwind can't express inline. Labels: Title Case, 2 to 4 words,
   approved list only. */

type Props = {
  href: string;
  variant?: "primary" | "secondary" | "square";
  /** sm is the 72px nav bar size (12px 20px padding) */
  size?: "base" | "sm";
  className?: string;
  children: React.ReactNode;
};

const VARIANT = {
  primary: "pill-primary",
  secondary: "pill-secondary",
  square: "pill-square",
} as const;

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
        VARIANT[variant],
        size === "sm" && "pill-sm",
        className,
      )}
    >
      <span className="pill-label">{children}</span>
    </Link>
  );
}
