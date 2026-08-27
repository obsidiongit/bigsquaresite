import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryPage } from "@/components/sections/industries/IndustryPage";
import { INDUSTRY_PAGES } from "@/lib/industry-pages/registry";
import { breadcrumbJsonLd } from "@/lib/jsonld";

/* T3 industry pages (_industry-page-template.md v2): one layout,
   per-page content modules. A page exists exactly when its content is
   registered in lib/industry-pages/registry.ts (the Lane 3 flagship
   gate lives there). FAQPage JSON-LD renders inside <Faq>; Organization
   renders sitewide from the root layout. No Service JSON-LD here (that
   is T2). */

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(INDUSTRY_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = INDUSTRY_PAGES[slug];
  if (!content) return {};
  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: `/industries/${slug}/` },
  };
}

export default async function IndustryRoute({ params }: Params) {
  const { slug } = await params;
  const content = INDUSTRY_PAGES[slug];
  if (!content) notFound();

  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries/" },
    { name: content.name, path: `/industries/${slug}/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IndustryPage content={content} />
    </>
  );
}
