import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";
import { SUPPORT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

const META = "font-mono text-mono-sm uppercase text-sec-mid";
const LINK =
  "underline underline-offset-2 transition-colors duration-[var(--dur-fast)] hover:text-sec-ink";

export function HoldingChrome() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper">
      <div
        className={cn(
          EDGE,
          "flex h-[72px] items-center justify-between gap-4",
        )}
      >
        <Link href="/" className="flex items-center gap-3 text-sec-ink">
          <Logo />
          <span className="font-medium text-small">BigSquare</span>
        </Link>
        <p className={cn(META, "hidden sm:block")}>Denver / Tampa</p>
      </div>
    </header>
  );
}

export function HoldingFooter() {
  const year = new Date().getFullYear();
  return (
    <Section as="footer" theme="dark" size="none">
      <div
        className={cn(
          EDGE,
          "flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between",
        )}
      >
        <p className="text-small text-sec-mid">
          <a href={`mailto:${SUPPORT_EMAIL}`} className={LINK}>
            {SUPPORT_EMAIL}
          </a>
        </p>
        <p className={cn(META, "flex flex-wrap gap-x-4 gap-y-2")}>
          <Link href="/privacy-policy/" className={LINK}>
            Privacy Policy
          </Link>
          <Link href="/terms/" className={LINK}>
            Terms
          </Link>
          <span>© {year} BigSquare Marketing</span>
        </p>
      </div>
    </Section>
  );
}
