import type { ReactNode } from "react";

/* Heading helpers shared by lib/blog.ts (which extracts the H2 list
   from the raw MDX for the table of contents) and mdx-components.tsx
   (which stamps the same id on the rendered H2). One slugify, so the
   TOC links and the anchors always agree. No fs here: this file is
   safe to import from anywhere. */

export type Heading = { id: string; text: string };

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Flatten React children (strings, numbers, nested elements) to text. */
export function childrenToText(children: ReactNode): string {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) return children.map(childrenToText).join("");
  if (typeof children === "object" && "props" in children) {
    const props = (children as { props?: { children?: ReactNode } }).props;
    return childrenToText(props?.children);
  }
  return "";
}

/** The H2 lines of an MDX body, in order, skipping fenced code. */
export function extractHeadings(body: string): Heading[] {
  const headings: Heading[] = [];
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = match[1].replace(/[*_`]/g, "");
    headings.push({ id: slugify(text), text });
  }
  return headings;
}
