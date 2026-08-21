import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Trailing slashes are ON sitewide (sitemap.md). Next redirects
  // /path -> /path/ with a 308, which satisfies "enforced with redirects".
  trailingSlash: true,
};

export default nextConfig;
