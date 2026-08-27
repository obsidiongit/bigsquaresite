import type { IndustryPageContent } from "./types";
import { FRANCHISE_PAGE } from "./franchise";
import { HEALTHCARE_PAGE } from "./healthcare";
import { HOME_SERVICES_PAGE } from "./home-services";
import { LEGAL_PAGE } from "./legal";

/* Industry pages exist exactly when they are registered here
   (app/(marketing)/industries/[slug]/page.tsx builds from this map,
   dynamicParams = false; mirrors lib/service-pages/registry.ts). The
   Lane 3 flagship gate opened 2026-08-26 (Brad's green light on
   /industries/franchise/); the other three stamped in with it. Order
   here is the hub's display order. */

export const INDUSTRY_PAGES: Record<string, IndustryPageContent> = {
  franchise: FRANCHISE_PAGE,
  "home-services": HOME_SERVICES_PAGE,
  legal: LEGAL_PAGE,
  healthcare: HEALTHCARE_PAGE,
};
