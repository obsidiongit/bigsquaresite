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
  "blog-author-mike": { src: "/media/blog-author-mike.webp" },
  "blog-author-russel": { src: "/media/blog-author-russel.webp" },
  "blog-author-sadie": { src: "/media/blog-author-sadie.webp" },
  "blog-cover-agency-7-numbers": { src: "/media/blog-cover-agency-7-numbers.webp" },
  "blog-cover-local-seo-scale": { src: "/media/blog-cover-local-seo-scale.webp" },
  "blog-fig-local-seo-system": { src: "/media/blog-fig-local-seo-system.webp" },
  "blog-fig-spend-by-channel": { src: "/media/blog-fig-spend-by-channel.webp" },
  // END AUTO-MANAGED
};
