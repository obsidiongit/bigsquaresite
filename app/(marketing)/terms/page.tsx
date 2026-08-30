import type { Metadata } from "next";
import Body from "@/content/legal/terms.mdx";
import { LegalArticle } from "@/components/sections/legal/LegalArticle";
import { getLegalDoc } from "@/lib/legal";

/* /terms/ (2026-08-31, Pane C): renders the full draft in
   content/legal/terms.mdx through the blog's MDX pipeline via the
   LegalArticle shell. The copy was drafted from
   project-sections/legal/legal-pages-plan.md and still needs a
   lawyer's review (the arbitration clause in particular); counsel's
   edits are text changes in the MDX file only. Indexed and in the
   sitemap. */

const doc = getLegalDoc("terms");

export const metadata: Metadata = {
  title: { absolute: "Terms of Service" },
  description:
    "The rules for using the BigSquare Marketing website, its forms, and its free resources.",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <LegalArticle doc={doc}>
      <Body />
    </LegalArticle>
  );
}
