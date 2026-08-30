"use client";

import { useEffect, useState } from "react";

/* <ShareRow>: copy link, LinkedIn, X. Mono uppercase links on a top
   hairline, the quiet RuleLink voice. Copy uses the clipboard API and
   confirms in place for 2 seconds; no icons, no third-party share
   scripts. */

export function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);
  const item =
    "font-mono text-mono-sm uppercase text-sec-mid transition-colors duration-[var(--dur-fast)] hover:text-sec-ink";

  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-sec-line pt-5">
      <span className="font-mono text-mono-sm uppercase text-sec-acc">Share</span>
      <button type="button" onClick={copy} className={item} aria-live="polite">
        {copied ? "Link copied" : "Copy link"}
      </button>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className={item}
      >
        LinkedIn ↗
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className={item}
      >
        X ↗
      </a>
    </div>
  );
}
