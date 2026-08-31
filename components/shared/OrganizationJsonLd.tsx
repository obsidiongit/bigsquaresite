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
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    email: SUPPORT_EMAIL,
    description:
      "BigSquare is a full-service marketing agency based in Denver and Tampa. One team runs search, ads, websites, and creative for brands of every size, with reporting clients can check any day.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  );
}
