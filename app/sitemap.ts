import type { MetadataRoute } from "next";
import { INDUSTRY_PAGES } from "@/lib/industry-pages/registry";
import { SERVICE_PAGES } from "@/lib/service-pages/registry";
import { SITE_URL } from "@/lib/site";

// Only routes that exist are listed. Add each route here as its page ships
// (Phases 2 through 7); /go/, /apply/, and /thanks/ never appear (noindex).
// Service and industry pages join automatically as their content modules
// register.
const ROUTES = [
  "/",
  "/about/",
  "/contact/",
  "/schedule/",
  "/audit/",
  "/privacy-policy/",
  "/terms/",
  "/industries/",
  ...Object.keys(SERVICE_PAGES).map((slug) => `/services/${slug}/`),
  ...Object.keys(INDUSTRY_PAGES).map((slug) => `/industries/${slug}/`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
