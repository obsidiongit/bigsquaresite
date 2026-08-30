"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/blog-toc";
import { cn } from "@/lib/utils";

/* <Toc>: the post's H2 list, sticky beside the spine on lg+. The
   active section is tracked with an IntersectionObserver and marked
   with the brand square (color change only, so it is the same under
   reduced motion). Rendered only when a post has 3 or more H2s. */

export function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
          else visible.delete(entry.target.id);
        }
        if (visible.size > 0) {
          const top = [...visible.entries()].sort((a, b) => a[1] - b[1])[0][0];
          setActive(top);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="On this page" className="border-l border-sec-line pl-5">
      <p className="font-mono text-eyebrow uppercase text-sec-mid">On this page</p>
      <ol className="mt-4 space-y-2.5">
        {headings.map((h) => {
          const isActive = h.id === active;
          return (
            <li key={h.id} className="flex items-baseline gap-3">
              <span
                aria-hidden
                className={cn(
                  "mt-[0.35em] block size-1.5 shrink-0 transition-colors duration-[var(--dur-fast)]",
                  isActive ? "bg-acc" : "bg-transparent",
                )}
              />
              <a
                href={`#${h.id}`}
                className={cn(
                  "text-small transition-colors duration-[var(--dur-fast)] hover:text-sec-ink",
                  isActive ? "text-sec-ink" : "text-sec-mid",
                )}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
