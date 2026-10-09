/* THE ASSET DROP-IN MAP (Brad's fill-at-the-end workflow, 2026-08-26).

   Every media slot on interior pages renders through <MediaSlot id=...>.
   While an id is missing here the slot shows its designed placeholder
   (soft panel + mono ASSET chip). To fill one:

     1. drop the file into public/media/
     2. add its row here: "slot-id": { src: "/media/file.jpg" }

   Nothing else changes: the placeholder and its chip drop automatically
   and next/image takes over. The full slot list with suggested content
   and aspect ratios lives in project-guidelines/asset-manifest.md
   (append a row there whenever a new slot ships). Alt text lives with
   the slot definition in the page content module, not here. */

export type AssetFile = {
  /** path under public/, e.g. "/media/seo-hero.jpg" */
  src: string;
};

export const ASSET_FILES: Record<string, AssetFile> = {
  // empty on purpose: no real interior assets exist yet (2026-08-26)
  // AUTO-MANAGED by scripts/blog-assets.mjs (blog covers + headshots); do not edit inside
  "blog-author-brad": { src: "/media/blog-author-brad.webp" },
  "blog-author-chaley": { src: "/media/blog-author-chaley.webp" },
  "blog-author-levi": { src: "/media/blog-author-levi.webp" },
  "blog-author-mike": { src: "/media/blog-author-mike.webp" },
  "blog-author-russel": { src: "/media/blog-author-russel.webp" },
  "blog-author-sadie": { src: "/media/blog-author-sadie.webp" },
  "blog-cover-agency-7-numbers": { src: "/media/blog-cover-agency-7-numbers.webp" },
  "blog-cover-local-seo-scale": { src: "/media/blog-cover-local-seo-scale.webp" },
  "blog-fig-cost-per-customer": { src: "/media/blog-fig-cost-per-customer.webp" },
  "blog-fig-gbp-ownership": { src: "/media/blog-fig-gbp-ownership.webp" },
  "blog-fig-local-seo-system": { src: "/media/blog-fig-local-seo-system.webp" },
  "blog-fig-spend-by-channel": { src: "/media/blog-fig-spend-by-channel.webp" },
  // END AUTO-MANAGED
  // The team, composed from the real headshots above
  "about-founders": { src: "/media/team-group.webp" },
  "about-team": { src: "/media/team-group-wide.webp" },
  // The Obsidion portal window as built on the homepage (structural preview, no numbers)
  "services-obsidion-portal-exhibit": { src: "/media/obsidion-window.webp" },
  "franchise-method": { src: "/media/obsidion-window.webp" },
  "home-services-method": { src: "/media/obsidion-window.webp" },
  // Stock photography (Unsplash License, credits in public/media/stock/CREDITS.md): swap any row
  // for real BigSquare photography when it exists.
  "franchise-hero": { src: "/media/stock/franchise-hero.webp" },
  "healthcare-hero": { src: "/media/stock/healthcare-hero.webp" },
  "healthcare-method": { src: "/media/stock/healthcare-method.webp" },
  "home-services-hero": { src: "/media/stock/home-services-hero.webp" },
  "industries-franchise-card": { src: "/media/stock/industries-franchise-card.webp" },
  "industries-healthcare-card": { src: "/media/stock/industries-healthcare-card.webp" },
  "industries-home-services-card": { src: "/media/stock/industries-home-services-card.webp" },
  "industries-legal-card": { src: "/media/stock/industries-legal-card.webp" },
  "legal-hero": { src: "/media/stock/legal-hero.webp" },
  "legal-method": { src: "/media/stock/legal-method.webp" },
  "locations-denver-office": { src: "/media/stock/locations-denver-office.webp" },
  "locations-tampa-office": { src: "/media/stock/locations-tampa-office.webp" },
  "services-amazon-ads-band": { src: "/media/stock/services-amazon-ads-band.webp" },
  "services-amazon-ads-hero": { src: "/media/stock/services-amazon-ads-hero.webp" },
  "services-branding-band": { src: "/media/stock/services-branding-band.webp" },
  "services-branding-hero": { src: "/media/stock/services-branding-hero.webp" },
  "services-content-marketing-band": { src: "/media/stock/services-content-marketing-band.webp" },
  "services-content-marketing-hero": { src: "/media/stock/services-content-marketing-hero.webp" },
  "services-creator-network-band": { src: "/media/stock/services-creator-network-band.webp" },
  "services-creator-network-hero": { src: "/media/stock/services-creator-network-hero.webp" },
  "services-custom-development-band": { src: "/media/stock/services-custom-development-band.webp" },
  "services-email-band": { src: "/media/stock/services-email-band.webp" },
  "services-generative-engine-optimization-band": { src: "/media/stock/services-generative-engine-optimization-band.webp" },
  "services-google-local-services-ads-band": { src: "/media/stock/services-google-local-services-ads-band.webp" },
  "services-obsidion-portal-band": { src: "/media/stock/services-obsidion-portal-band.webp" },
  "services-paid-search-band": { src: "/media/stock/services-paid-search-band.webp" },
  "services-paid-search-hero": { src: "/media/stock/services-paid-search-hero.webp" },
  "services-paid-social-band": { src: "/media/stock/services-paid-social-band.webp" },
  "services-paid-social-hero": { src: "/media/stock/services-paid-social-hero.webp" },
  "services-seo-band": { src: "/media/stock/services-seo-band.webp" },
  "services-seo-hero": { src: "/media/stock/services-seo-hero.webp" },
  "services-social-media-band": { src: "/media/stock/services-social-media-band.webp" },
  "services-social-media-hero": { src: "/media/stock/services-social-media-hero.webp" },
  "services-video-production-band": { src: "/media/stock/services-video-production-band.webp" },
  "services-video-production-hero": { src: "/media/stock/services-video-production-hero.webp" },
  "services-web-design-band": { src: "/media/stock/services-web-design-band.webp" },
  "services-web-design-hero": { src: "/media/stock/services-web-design-hero.webp" },
};
