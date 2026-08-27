/* Featured work entries (2b.featured-work.md). One entry per case
   study; the homepage grid and /results/[slug]/ pages both read this
   array, so adding a real case study here lights up both at once.

   [PLACEHOLDER: real case studies. Titles, summaries, metrics, and
   media are placeholders until real client data lands (copy-rules: no
   invented clients or numbers). `tags` are real BigSquare service
   names, which are safe to show. When a real case study lands, set
   `title` to the client (or "industry, N locations" if unnamed),
   drop media into public/media/work/, and fill the metrics.] */

/* Filter taxonomy (results-index.md v2, built now, no filter UI at
   launch): industry mirrors the /industries/ slugs; brandType is the
   Ignite-style category widened to the full audience (single-location
   and ecommerce clients too). Both stay null until a real case study
   fills the entry. */
export type WorkBrandType =
  | "franchisor"
  | "franchisee-group"
  | "regional-brand"
  | "single-location"
  | "ecommerce";

export type WorkEntry = {
  slug: string;
  /** Project title; client name or industry descriptor once real */
  title: string;
  /** Real service names from the services catalog (sitemap slugs exist) */
  tags: string[];
  /** Media still/loop for the card panel; null renders the placeholder frame */
  media: string | null;
  /** /industries/ slug once real; null until then */
  industry?: string | null;
  /** brand category once real; null until then */
  brandType?: WorkBrandType | null;
};

export const FEATURED_WORK: WorkEntry[] = [
  {
    slug: "case-study-01",
    title: "[PLACEHOLDER: Client 01]",
    tags: ["Paid Search", "Web Design"],
    media: null,
  },
  {
    slug: "case-study-02",
    title: "[PLACEHOLDER: Client 02]",
    tags: ["SEO", "Content Marketing"],
    media: null,
  },
  {
    slug: "case-study-03",
    title: "[PLACEHOLDER: Client 03]",
    tags: ["Branding", "Video Production"],
    media: null,
  },
  {
    slug: "case-study-04",
    title: "[PLACEHOLDER: Client 04]",
    tags: ["Paid Social", "Creator Network"],
    media: null,
  },
  {
    slug: "case-study-05",
    title: "[PLACEHOLDER: Client 05]",
    tags: ["Google Local Services Ads", "SEO"],
    media: null,
  },
  {
    slug: "case-study-06",
    title: "[PLACEHOLDER: Client 06]",
    tags: ["Web Design", "Custom Development"],
    media: null,
  },
];
