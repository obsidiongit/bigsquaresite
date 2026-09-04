import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Paid traffic pages are ad destinations, never indexed (sitemap.md).
// Their page templates also set robots noindex when built in Phase 5.
// /dev/ holds the styleguide and the asset contact sheet: both already
// set robots noindex in their metadata, this is the belt-and-braces.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/go/", "/apply/", "/thanks/", "/dev/"],
      },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/feed.xml`],
  };
}
