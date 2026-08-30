import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Trailing slashes are ON sitewide (sitemap.md). Next redirects
  // /path -> /path/ with a 308, which satisfies "enforced with redirects".
  trailingSlash: true,
  // .mdx joins the module graph so content/blog/*.mdx can be imported
  // (app/(marketing)/blog/[slug]/page.tsx). No MDX file is a route.
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

/* MDX wiring (Pane A, 2026-08-30). Plugins are named as STRINGS: the
   default bundler here is Turbopack, which cannot take JS functions.
   remark-frontmatter strips the YAML block from the rendered body;
   lib/blog.ts reads the same block with fs for the post metadata, so
   one file carries both the copy and its data. */
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter"],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
