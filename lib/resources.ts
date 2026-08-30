/* The lead magnets on /resources/ (Pane A, 2026-08-30). FIVE slots
   per sitemap.md; the spec files in project-sections/lead-magnets/
   are still all [PLACEHOLDER], so these are WORKING TITLES drafted to
   fit the wide positioning (ecommerce, software, and single-location
   clients read as equals). Confirm with Brad, then mirror the final
   values into the spec files. Brad, 2026-08-30: the real list is still
   on his whiteboard ("not sure exactly what the lead magnets are going
   to be quite yet"); expect all 5 rows to change. No asset exists yet: every row's "Get
   It" opens the request form on the page, and /resources/[slug]/
   stays 404 until files land (lib/asset-files.ts is where they go). */

export type ResourceFormat = "Guide" | "Checklist" | "Calculator" | "Template";

export type Resource = {
  slug: string;
  title: string;
  /** one line: what it does for the reader */
  line: string;
  format: ResourceFormat;
  /** who it is for, in plain words */
  audience: string;
};

export const RESOURCES: Resource[] = [
  {
    slug: "agency-numbers-checklist",
    title: "The 7 numbers to ask your agency for",
    line: "A 1-page checklist for judging any marketing report, with what a good answer looks like.",
    format: "Checklist",
    audience: "Any business that pays an agency",
  },
  {
    slug: "cost-per-lead-calculator",
    title: "Cost per lead calculator",
    line: "Put in your spend, leads, and close rate. Get your cost per lead and cost per customer by channel.",
    format: "Calculator",
    audience: "Anyone running paid ads",
  },
  {
    slug: "multi-location-seo-checklist",
    title: "The multi-location SEO checklist",
    line: "Listings, location pages, reviews, and tracking, in the order to fix them when you have more than 1 location.",
    format: "Checklist",
    audience: "Multi-location and franchise brands",
  },
  {
    slug: "website-conversion-checklist",
    title: "25 things to check before you rebuild your website",
    line: "The conversion checks we run on a site before anyone talks about a redesign.",
    format: "Guide",
    audience: "Ecommerce, software, and service businesses",
  },
  {
    slug: "ad-account-ownership-template",
    title: "Ad account ownership template",
    line: "What you should own, who should have access, and the exact steps to take it back from a vendor.",
    format: "Template",
    audience: "Any business that has ever used a vendor",
  },
];
