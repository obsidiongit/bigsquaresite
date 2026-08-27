import type { ServicePageContent } from "./types";
import { AMAZON_ADS_PAGE } from "./amazon-ads";
import { BRANDING_PAGE } from "./branding";
import { CONTENT_MARKETING_PAGE } from "./content-marketing";
import { CREATOR_NETWORK_PAGE } from "./creator-network";
import { CUSTOM_DEVELOPMENT_PAGE } from "./custom-development";
import { EMAIL_PAGE } from "./email";
import { GEO_PAGE } from "./generative-engine-optimization";
import { GLSA_PAGE } from "./google-local-services-ads";
import { OBSIDION_PORTAL_PAGE } from "./obsidion-portal";
import { PAID_SEARCH_PAGE } from "./paid-search";
import { PAID_SOCIAL_PAGE } from "./paid-social";
import { SEO_PAGE } from "./seo";
import { SOCIAL_MEDIA_PAGE } from "./social-media";
import { VIDEO_PRODUCTION_PAGE } from "./video-production";
import { WEB_DESIGN_PAGE } from "./web-design";

/* All 15 T2 service pages. The Lane 2 gate opened 2026-08-26 (Brad's
   verbal approval of the /services/seo/ flagship, tasks.md Phase 4);
   the other 14 stamped the same day, each with its own copy pass and
   variation-kit picks recorded at the top of its module. */

export const SERVICE_PAGES: Record<string, ServicePageContent> = {
  seo: SEO_PAGE,
  "generative-engine-optimization": GEO_PAGE,
  "social-media": SOCIAL_MEDIA_PAGE,
  "content-marketing": CONTENT_MARKETING_PAGE,
  email: EMAIL_PAGE,
  "obsidion-portal": OBSIDION_PORTAL_PAGE,
  "paid-search": PAID_SEARCH_PAGE,
  "google-local-services-ads": GLSA_PAGE,
  "paid-social": PAID_SOCIAL_PAGE,
  "amazon-ads": AMAZON_ADS_PAGE,
  "creator-network": CREATOR_NETWORK_PAGE,
  "web-design": WEB_DESIGN_PAGE,
  branding: BRANDING_PAGE,
  "video-production": VIDEO_PRODUCTION_PAGE,
  "custom-development": CUSTOM_DEVELOPMENT_PAGE,
};
