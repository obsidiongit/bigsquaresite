import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Only routes that exist are listed. Add each route here as its page ships
// (Phases 2 through 7); /go/, /apply/, and /thanks/ never appear (noindex).
const ROUTES = ["/", "/schedule/", "/audit/", "/privacy-policy/", "/terms/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
