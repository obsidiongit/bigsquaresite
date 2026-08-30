import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter } from "@/lib/blog";
import { extractHeadings, type Heading } from "@/lib/blog-toc";

/* Legal document loader (2026-08-31, Pane C; build plan in
   project-sections/legal/legal-pages-plan.md). Same one-file contract
   as the blog: content/legal/<slug>.mdx carries the copy AND its data
   (frontmatter `title` + `effectiveDate`); remark-frontmatter strips
   the block from the rendered body, this module reads it with fs, and
   the H2 list feeds the "On this page" rail through the blog's
   extractHeadings, so anchors and links share one slugify. Counsel's
   edits land in the MDX files only. */

export type LegalSlug = "privacy-policy" | "terms";

export type LegalDoc = {
  slug: LegalSlug;
  title: string;
  /** ISO date, YYYY-MM-DD */
  effectiveDate: string;
  headings: Heading[];
};

const LEGAL_DIR = path.join(process.cwd(), "content", "legal");
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function getLegalDoc(slug: LegalSlug): LegalDoc {
  const source = fs.readFileSync(path.join(LEGAL_DIR, `${slug}.mdx`), "utf8");
  const { data, body } = parseFrontmatter(source);

  const title = data.title;
  if (typeof title !== "string" || !title.trim()) {
    throw new Error(`content/legal/${slug}.mdx: missing "title"`);
  }
  const effectiveDate = data.effectiveDate;
  if (typeof effectiveDate !== "string" || !DATE_RE.test(effectiveDate)) {
    throw new Error(
      `content/legal/${slug}.mdx: "effectiveDate" must be an ISO date like 2026-08-31`,
    );
  }

  return {
    slug,
    title: title.trim(),
    effectiveDate,
    headings: extractHeadings(body),
  };
}
