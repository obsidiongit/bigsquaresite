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

/* The full case-study shape (2026-08-31, Pane C; section order from
   project-sections/results/_case-study-template.md). When an entry has
   a `caseStudy`, /results/[slug]/ renders the real layout, indexes the
   page, and emits BreadcrumbList JSON-LD; while it is absent the page
   stays a noindex skeleton. Every value must be real and sourced
   (copy-rules: no invented numbers or clients; FTC Endorsement Guides:
   every metric ships with its time window and source). */

export type CaseMetric = {
  /** The number as displayed, e.g. "34%" or "2.1x" */
  value: string;
  /** What the number is, plain words, e.g. "Lower cost per lead" */
  label: string;
  /** The time window it covers, e.g. "First 6 months" */
  window: string;
  /** Where it comes from, e.g. "Google Ads, Jan to Jun 2026" */
  source: string;
};

export type CaseStep = {
  /** One plain-words step naming the service used */
  text: string;
  /** The /services/ slug the step links to (key in SERVICE_PAGES) */
  serviceSlug: string;
};

export type CaseStudy = {
  /** The result sentence; also the title tag per the template pattern
      "[Result] for [Client type] | BigSquare" */
  headline: string;
  /** One line under the H1; doubles as the meta description */
  summary: string;
  /** Exactly 3, rendered on the dark band */
  metrics: [CaseMetric, CaseMetric, CaseMetric];
  /** 2 to 3 short paragraphs: where they started, what was broken */
  situation: string[];
  /** 3 to 5 steps, each naming the service used */
  steps: CaseStep[];
  /** 1 to 2 paragraphs restating the headline number with the window */
  result: string[];
  /** Real names only, or omit the quote entirely */
  quote?: { text: string; name: string; role: string };
  /** /services/ slugs for the "Services used" link list */
  services: string[];
};

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
  /** The full case study; absent = /results/[slug]/ renders the
      noindex skeleton. Filling this is the whole content drop. */
  caseStudy?: CaseStudy;
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
