import type { ReactNode } from "react";
import { Toc } from "@/app/(marketing)/blog/Toc";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { Eyebrow } from "@/components/shared/mono";
import { Section } from "@/components/shared/Section";
import { formatDate } from "@/lib/blog";
import { EDGE } from "@/lib/layout";
import type { LegalDoc } from "@/lib/legal";
import { SUPPORT_EMAIL } from "@/lib/site";

/* <LegalArticle> (2026-08-31, Pane C; build plan in
   project-sections/legal/legal-pages-plan.md): the shared shell for
   /privacy-policy/ and /terms/. H1, the effective date, then the MDX
   body on the ~65ch spine with the blog's sticky "On this page" H2
   rail beside it at lg+ (read-only reuse of the blog's Toc; the ids
   match because both go through lib/blog-toc's slugify), and the
   contact line under the body. Quiet page: no CtaBand, no annotation
   budget spent. */

export function LegalArticle({
  doc,
  children,
}: {
  doc: LegalDoc;
  children: ReactNode;
}) {
  return (
    <main>
      {/* 1. Hero: eyebrow, title, effective date */}
      <Section theme="light" size="none" className="pt-32 pb-12 md:pt-36 md:pb-16">
        <div className={EDGE}>
          <SeparatorIn />
          <Eyebrow className="mt-4">Legal</Eyebrow>
          <h1 className="mt-6 max-w-[16ch] font-display text-h1 text-sec-ink">
            {doc.title}
          </h1>
          <p className="mt-6 font-mono text-mono-sm uppercase tabular-nums text-sec-mid">
            <time dateTime={doc.effectiveDate}>
              Effective {formatDate(doc.effectiveDate)}
            </time>
          </p>
        </div>
      </Section>

      {/* 2. The body on the spine, the H2 rail beside it at lg+ */}
      <Section theme="light" size="none" className="pb-section-y-lg">
        <div className={EDGE}>
          <div className="lg:grid lg:grid-cols-[minmax(0,720px)_1fr] lg:gap-16 xl:gap-24">
            <div className="max-w-[720px]">
              <article className="max-w-[65ch] [&>*:first-child]:mt-0">
                {children}
              </article>
              <p className="mt-14 border-t border-sec-line pt-8 text-body text-sec-mid">
                Questions about this page? Email{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-medium text-sec-ink underline underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-sec-acc"
                >
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            </div>
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <Toc headings={doc.headings} />
              </div>
            </aside>
          </div>
        </div>
      </Section>
    </main>
  );
}
