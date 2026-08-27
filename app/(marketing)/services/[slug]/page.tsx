import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/sections/services/ServicePage";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/jsonld";
import { SERVICE_PAGES } from "@/lib/service-pages/registry";
import { getService } from "@/lib/services";

/* T2 service pages (_service-page-template.md v2): one layout,
   per-page content modules. A page exists exactly when its content is
   registered in lib/service-pages/registry.ts (the flagship gate lives
   there). FAQPage JSON-LD renders inside <Faq>; Organization renders
   sitewide from the root layout. */

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SERVICE_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = SERVICE_PAGES[slug];
  if (!content) return {};
  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: `/services/${slug}/` },
  };
}

export default async function ServiceRoute({ params }: Params) {
  const { slug } = await params;
  const content = SERVICE_PAGES[slug];
  const service = getService(slug);
  if (!content || !service) notFound();

  const path = `/services/${slug}/`;
  const jsonLd = [
    serviceJsonLd({
      name: service.name,
      description: content.answer,
      path,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services/" },
      { name: service.name, path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
      <ServicePage content={content} />
    </>
  );
}
