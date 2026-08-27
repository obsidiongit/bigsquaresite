import { SITE_URL } from "@/lib/site";

/* JSON-LD builders for interior pages (seo-requirements.md).
   Organization renders sitewide from the root layout; these cover the
   per-page types. Values must always be real: structured data never
   carries placeholders (OrganizationJsonLd rule). */

export type Crumb = { name: string; path: string };

/** BreadcrumbList from the same data that renders the visible
    breadcrumb row (one source). Paths are site-relative with the
    trailing slash. */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

/** Service schema for T2 pages: name, the answer block as description,
    the page URL, and BigSquare as provider. */
export function serviceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description,
    url: `${SITE_URL}${path}`,
    /* Reference the sitewide Organization node by @id (one entity, not a
       duplicate; the id is minted in OrganizationJsonLd). */
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "United States",
  };
}

/** FAQPage from the same array that renders the accordion. */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
