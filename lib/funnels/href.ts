import type { UtmParams } from "@/lib/utm";

/* Carry UTM params forward on funnel links (decisions.md: every form
   and booking event carries UTMs; the thank-you URL keeps them for the
   tracking tags). Existing query params on `href` are preserved. */
export function withUtm(href: string, utm: UtmParams): string {
  const entries = Object.entries(utm).filter(([, v]) => Boolean(v));
  if (entries.length === 0) return href;
  const [path, existing = ""] = href.split("?");
  const params = new URLSearchParams(existing);
  for (const [key, value] of entries) params.set(key, value as string);
  return `${path}?${params.toString()}`;
}
