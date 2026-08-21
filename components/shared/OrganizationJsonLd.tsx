import { SITE_NAME, SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

/**
 * Organization structured data, rendered sitewide from the root layout
 * (seo-requirements.md). Logo, phone numbers, office addresses, and social
 * links are added when the real values exist. Structured data never carries
 * placeholder values.
 */
export function OrganizationJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    email: SUPPORT_EMAIL,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  );
}
