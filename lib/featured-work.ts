/* Featured work entries (2b.featured-work.md). One entry per case
   study; the homepage grid and /results/[slug]/ pages both read this
   array, so adding a real case study here lights up both at once.

   Until real case studies land, the six entries are pieces from the
   BigSquare showreel (public/media/showreel-*.mp4), titled by what the
   footage shows: no client names, no numbers (copy-rules). `reel` is the
   clip window index in components/sections/home/WorkClip. When a real
   case study lands, set `title` to the client, add `caseStudy`, and the
   page switches to the full layout. */

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
  /** A still (poster, print, static ad) for the card; null plays the
      reel window instead. Statics are 4:5. */
  media: string | null;
  /** Alt text for a still: what the piece shows, headline included */
  alt?: string;
  /** /industries/ slug once real; null until then */
  industry?: string | null;
  /** brand category once real; null until then */
  brandType?: WorkBrandType | null;
  /** One plain line about what the piece shows (reel pieces) */
  blurb?: string;
  /** /services/ slugs behind the piece */
  services?: string[];
  /** Showreel clip window (WorkClip index) the card and page play */
  reel?: number;
  /** The full case study; absent = /results/[slug]/ renders the reel
      piece page. Filling this is the whole content drop. */
  caseStudy?: CaseStudy;
};

export const FEATURED_WORK: WorkEntry[] = [
  /* the statics (2026-10-09): BigSquare campaign posters, 4:5, sources
     in assets/work/, web files in public/media/work/. Titled by their
     own headlines; no client claims, no numbers. */
  {
    slug: "shake-things-up",
    title: "Shake things up",
    tags: ["Branding", "Paid Social"],
    blurb: "A snow globe in one hand, a corner shop inside, and the brand square shaken loose. One of our own campaign posters.",
    services: ["branding", "paid-social"],
    media: "/media/work/shake-things-up.webp",
    alt: "Poster: a hand holds a snow globe with a small shop inside while blue squares fly out of it. Headline: Shake things up.",
  },
  {
    slug: "seriously-fizzy",
    title: "Seriously fizzy",
    tags: ["Branding", "Paid Social"],
    blurb: "A pool full of orange soda and three swimmers on orange-slice floats. Launch poster art for a soda brand.",
    services: ["branding", "paid-social"],
    media: "/media/work/seriously-fizzy.webp",
    alt: "Poster: three swimmers on orange-slice floats in a pool of orange soda, a can on the poolside. Headline: Seriously fizzy.",
  },
  {
    slug: "theyre-moving-out",
    title: "They're moving out",
    tags: ["Branding", "Paid Social"],
    blurb: "Ants carrying their bags and boxes out past a pink front door. Poster art for a pest control brand.",
    services: ["branding", "paid-social"],
    media: "/media/work/theyre-moving-out.webp",
    alt: "Poster: a line of ants carrying tiny suitcases and boxes out of a pink house across the lawn. Headline: They're moving out.",
  },
  {
    slug: "hard-to-miss",
    title: "Hard to miss",
    tags: ["Branding"],
    blurb: "A giant blue cube parked on a sunny street, and a parking officer taking notes. One of our own campaign posters.",
    services: ["branding"],
    media: "/media/work/hard-to-miss.webp",
    alt: "Poster: a giant blue cube parked between two cars on a sunny street while a parking officer takes notes. Headline: Hard to miss.",
  },
  {
    slug: "lets-circle-back",
    title: "Let's circle back",
    tags: ["Branding"],
    blurb: "A black-and-white boardroom, a table of people who have heard it all before, and one blue cube. One of our own campaign posters.",
    services: ["branding"],
    media: "/media/work/lets-circle-back.webp",
    alt: "Black and white poster of an old boardroom meeting with one blue cube on the table. Headline: Let's circle back.",
  },
  {
    slug: "think-inside-the-box",
    title: "Think inside the box",
    tags: ["Branding"],
    blurb: "A square watermelon, a lime velvet tracksuit, and a lot of blue. One of our own campaign posters.",
    services: ["branding"],
    media: "/media/work/think-inside-the-box.webp",
    alt: "Poster: a woman in a lime velvet tracksuit holds a square watermelon against a blue wall. Headline: Think inside the box.",
  },
  {
    slug: "on-location",
    title: "Shot on location",
    tags: ["Video Production", "Branding"],
    blurb: "A camera, a forest path, and a brand that wanted to feel outdoors. Filmed on location, cut for ads and social.",
    services: ["video-production", "branding"],
    reel: 0,
    media: null,
  },
  {
    slug: "retail-launch",
    title: "Retail launch film",
    tags: ["Video Production", "Paid Social"],
    blurb: "A launch spot filmed in a real car park with real shoppers, cut down into paid social edits.",
    services: ["video-production", "paid-social"],
    reel: 1,
    media: null,
  },
  {
    slug: "menu-poster-series",
    title: "Menu poster series",
    tags: ["Branding", "Paid Social"],
    blurb: "One idea, three posters, one look. A food series built to stop the scroll and work in store.",
    services: ["branding", "paid-social"],
    reel: 2,
    media: null,
  },
  {
    slug: "creator-led-ads",
    title: "Creator-led ads",
    tags: ["Creator Network", "Paid Social"],
    blurb: "Real creators, real reactions, filmed for the feed. The kind of ad people watch to the end.",
    services: ["creator-network", "paid-social"],
    reel: 3,
    media: null,
  },
  {
    slug: "product-close-ups",
    title: "Product close-ups",
    tags: ["Video Production", "Amazon Ads"],
    blurb: "Macro product footage made for listings, ads, and the site from a single shoot.",
    services: ["video-production", "amazon-ads"],
    reel: 4,
    media: null,
  },
  {
    slug: "story-spot",
    title: "Story-driven spot",
    tags: ["Video Production", "Branding"],
    blurb: "A cat, a full glass, and the edge of a kitchen counter. A short spot people watch to the end.",
    services: ["video-production", "branding"],
    reel: 5,
    media: null,
  },
];

/** The homepage grid (2026-10-09): mostly statics, two reel clips, in
    this order (3 x 2 on desktop). Every entry also lives on /results/. */
export const HOME_WORK: WorkEntry[] = ["shake-things-up", "retail-launch", "seriously-fizzy", "theyre-moving-out", "hard-to-miss", "story-spot"].map(
  (slug) => FEATURED_WORK.find((w) => w.slug === slug)!,
);

/** One entry by slug (the problem/solution section shows two posters) */
export const workBySlug = (slug: string) => FEATURED_WORK.find((w) => w.slug === slug)!;
