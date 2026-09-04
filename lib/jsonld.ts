import { SITE_NAME, SITE_URL } from "@/lib/site";

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

/** LocalBusiness for the /locations/ city pages (denver.md v2). Only
    real values ship: while lib/offices.ts holds null for the street
    address and phone, those properties are OMITTED (never a
    placeholder string in structured data). Locality, region, and
    country are real facts today. Geo and openingHours join when the
    street address does. */
export function localBusinessJsonLd({
  path,
  city,
  stateCode,
  state,
  address,
  phone,
  email,
  siteName,
}: {
  path: string;
  city: string;
  stateCode: string;
  state: string;
  address: string | null;
  phone: string | null;
  email: string;
  siteName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}${path}#office`,
    name: `${siteName} ${city}`,
    url: `${SITE_URL}${path}`,
    email,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    address: {
      "@type": "PostalAddress",
      ...(address ? { streetAddress: address } : {}),
      addressLocality: city,
      addressRegion: stateCode,
      addressCountry: "US",
    },
    ...(phone ? { telephone: phone } : {}),
    areaServed: [state, "United States"],
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

/** Blog index: one Blog node with the live post list as blogPost. */
export function blogJsonLd(
  posts: { title: string; slug: string; date: string; description: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_NAME} Blog`,
    url: `${SITE_URL}/blog/`,
    description:
      "Plain notes on search, ads, websites, and creative from the BigSquare team. Written so you can use them on your own accounts.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}/`,
      datePublished: post.date,
      description: post.description,
    })),
  };
}
