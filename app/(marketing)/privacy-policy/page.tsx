import type { Metadata } from "next";
import Body from "@/content/legal/privacy-policy.mdx";
import { LegalArticle } from "@/components/sections/legal/LegalArticle";
import { getLegalDoc } from "@/lib/legal";

/* /privacy-policy/ (2026-08-31, Pane C): renders the full draft in
   content/legal/privacy-policy.mdx through the blog's MDX pipeline via
   the LegalArticle shell. The copy was drafted from
   project-sections/legal/legal-pages-plan.md and still needs a
   lawyer's review; counsel's edits are text changes in the MDX file
   only. Indexed and in the sitemap (legal pages are fine to index).
   The footer's "Do not sell or share" link targets
   #your-choices-and-rights (the H2 id mdx-components generates). */

const doc = getLegalDoc("privacy-policy");

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy" },
  description:
    "How BigSquare Marketing collects, uses, shares, and protects your information, and the choices you have.",
  alternates: { canonical: "/privacy-policy/" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalArticle doc={doc}>
      <Body />
    </LegalArticle>
  );
}
