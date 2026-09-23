"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Jump } from "@/components/sections/holding/Jump";
import { Logo } from "@/components/shared/Logo";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";
import { SUPPORT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

const META = "font-mono text-mono-sm uppercase text-sec-mid";
const LINK =
  "underline underline-offset-2 transition-colors duration-[var(--dur-fast)] hover:text-sec-ink";

export function HoldingChrome() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-[var(--dur-fast)]",
        solid
          ? "border-b border-line bg-paper/85 backdrop-blur-[12px]"
          : "border-b border-transparent bg-transparent",
      )}
    >
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
        <div className="flex items-center gap-4 md:gap-6">
          <p className={cn(META, "hidden md:block")}>Denver / Tampa</p>
          <Jump to="contact" className="pill pill-square pill-sm">
            <span className="pill-label">Talk to Us</span>
          </Jump>
        </div>
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
