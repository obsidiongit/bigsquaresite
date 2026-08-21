import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Paid traffic pages are ad destinations, never indexed (sitemap.md).
// Their page templates also set robots noindex when built in Phase 5.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/go/", "/apply/", "/thanks/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
