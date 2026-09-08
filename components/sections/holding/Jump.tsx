"use client";

import type { MouseEvent, ReactNode } from "react";
import { getLenis } from "@/components/motion/SmoothScroll";
import { cn } from "@/lib/utils";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -88, duration: 1.1 });
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Jump({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    scrollToId(to);
  }

  return (
    <a href={`#${to}`} onClick={onClick} className={cn(className)}>
      {children}
    </a>
  );
}
