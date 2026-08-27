/* The service catalog (project-sections/services/services-index.md):
   every service page, its slug, group, and card one-liner. One source
   for the /services/ hub, related-services links on T2 pages, and
   static params. The homepage Services section carries its own DRAFT
   one-liners pending Brad's copy pass; this file mirrors the spec. */

export type ServiceGroup = {
  slug: "organic-marketing" | "paid-advertising" | "design-development";
  name: string;
};

export const SERVICE_GROUPS: ServiceGroup[] = [
  { slug: "organic-marketing", name: "Organic Marketing" },
  { slug: "paid-advertising", name: "Paid Advertising" },
  { slug: "design-development", name: "Design & Development" },
];

export type ServiceMeta = {
  slug: string;
  name: string;
  group: ServiceGroup["slug"];
  /** card / meta one-liner from services-index.md */
  line: string;
};

export const SERVICES: ServiceMeta[] = [
  {
    slug: "seo",
    name: "Search Engine Optimization (SEO)",
    group: "organic-marketing",
    line: "Show up when people search for what you do, in every city you serve.",
  },
  {
    slug: "generative-engine-optimization",
    name: "Generative Engine Optimization (GEO)",
    group: "organic-marketing",
    line: "Get named when people ask ChatGPT, Gemini, or Perplexity who to call.",
  },
  {
    slug: "social-media",
    name: "Social Media",
    group: "organic-marketing",
    line: "Posts and pages that make every location look alive and trusted.",
  },
  {
    slug: "content-marketing",
    name: "Content Marketing",
    group: "organic-marketing",
    line: "Articles and guides that bring in buyers and keep bringing them in.",
  },
  {
    slug: "email",
    name: "Email",
    group: "organic-marketing",
    line: "Email and text that follow up with every lead and bring old customers back.",
  },
  {
    slug: "obsidion-portal",
    name: "Obsidion Portal",
    group: "organic-marketing",
    line: "One login that shows every lead, every call, and every dollar, by location.",
  },
  {
    slug: "paid-search",
    name: "Paid Search",
    group: "paid-advertising",
    line: "Google and Microsoft ads that reach people the moment they search.",
  },
  {
    slug: "google-local-services-ads",
    name: "Google Local Services Ads",
    group: "paid-advertising",
    line: "The \"Google Guaranteed\" spots at the top of local search. Pay per lead.",
  },
  {
    slug: "paid-social",
    name: "Paid Social",
    group: "paid-advertising",
    line: "Meta and TikTok ads built to fill the calendar at every location.",
  },
  {
    slug: "amazon-ads",
    name: "Amazon Ads",
    group: "paid-advertising",
    line: "Ads that sell your products where people already buy.",
  },
  {
    slug: "creator-network",
    name: "Creator Network",
    group: "paid-advertising",
    line: "Real people making real content about your brand, run as ads that convert.",
  },
  {
    slug: "web-design",
    name: "Web Design",
    group: "design-development",
    line: "Fast, clean sites built to turn visitors into booked calls.",
  },
  {
    slug: "branding",
    name: "Branding",
    group: "design-development",
    line: "A look and a voice that make you the obvious choice in every market.",
  },
  {
    slug: "video-production",
    name: "Video Production",
    group: "design-development",
    line: "Commercials, ads, and brand films shot and edited in house.",
  },
  {
    slug: "custom-development",
    name: "Custom Development",
    group: "design-development",
    line: "Tools, portals, and integrations built for how your business runs.",
  },
];

export function getService(slug: string): ServiceMeta | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getGroup(slug: ServiceGroup["slug"]): ServiceGroup {
  return SERVICE_GROUPS.find((g) => g.slug === slug)!;
}
