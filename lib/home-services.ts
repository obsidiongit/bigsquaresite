/* The homepage Services catalog, read by the Services section
   (components/sections/home/services/ServicesIndex.tsx; the older takes
   are in project-guidelines/archive/retired-code/2026-10-09/).

   Copy: group names locked (copy-rules). The 15 one-liners are DRAFT
   for Brad's copy pass, as before. `short` is the tile label where the
   full name will not fit a square; the full name always rides along as
   the link's accessible name. `img` is the service page's stock band
   photo (public/media/stock, credits in CREDITS.md): the renditions
   draw it as blue halftone squares (DotPortrait), the 2026-10-08 rule
   for stock photography on the site. */

export type HomeService = { label: string; short: string; href: string; line: string; img: string };
export type HomeServiceGroup = { title: string; href: string; items: HomeService[] };

const img = (slug: string) => `/media/stock/services-${slug}-band.webp`;

export const SERVICE_GROUPS_HOME: HomeServiceGroup[] = [
  {
    title: "Organic Marketing",
    href: "/services/#organic-marketing",
    items: [
      {
        label: "Search Engine Optimization (SEO)",
        short: "SEO",
        href: "/services/seo/",
        line: "Show up when people search for what you do, in every city you serve.",
        img: img("seo"),
      },
      {
        label: "Generative Engine Optimization (GEO)",
        short: "GEO",
        href: "/services/generative-engine-optimization/",
        line: "Get named when tools like ChatGPT answer the question you solve.",
        img: img("generative-engine-optimization"),
      },
      {
        label: "Social Media",
        short: "Social Media",
        href: "/services/social-media/",
        line: "Posts planned, made, and shipped. Your brand, active every week.",
        img: img("social-media"),
      },
      {
        label: "Content Marketing",
        short: "Content",
        href: "/services/content-marketing/",
        line: "Pages that answer real questions and bring buyers to your site.",
        img: img("content-marketing"),
      },
      {
        label: "Email",
        short: "Email",
        href: "/services/email/",
        line: "The list you own, working. Sends people open and act on.",
        img: img("email"),
      },
      {
        label: "Obsidion Portal",
        short: "Obsidion Portal",
        href: "/services/obsidion-portal/",
        line: "One login for every number we report. Check our work any day.",
        img: img("obsidion-portal"),
      },
    ],
  },
  {
    title: "Paid Advertising",
    href: "/services/#paid-advertising",
    items: [
      {
        label: "Paid Search",
        short: "Paid Search",
        href: "/services/paid-search/",
        line: "Ads on Google when buyers type exactly what you sell.",
        img: img("paid-search"),
      },
      {
        label: "Google Local Services Ads",
        short: "Local Services Ads",
        href: "/services/google-local-services-ads/",
        line: "Pay for leads, not clicks, at the very top of Google.",
        img: img("google-local-services-ads"),
      },
      {
        label: "Paid Social",
        short: "Paid Social",
        href: "/services/paid-social/",
        line: "Ads on Meta, TikTok, and more that find your next customer.",
        img: img("paid-social"),
      },
      {
        label: "Amazon Ads",
        short: "Amazon Ads",
        href: "/services/amazon-ads/",
        line: "Put your products in front of people already shopping on Amazon.",
        img: img("amazon-ads"),
      },
      {
        label: "Creator Network",
        short: "Creator Network",
        href: "/services/creator-network/",
        line: "Creators your customers already follow, talking about your brand.",
        img: img("creator-network"),
      },
    ],
  },
  {
    title: "Design & Development",
    href: "/services/#design-development",
    items: [
      {
        label: "Web Design",
        short: "Web Design",
        href: "/services/web-design/",
        line: "A fast site that looks sharp and turns visits into calls.",
        img: img("web-design"),
      },
      {
        label: "Branding",
        short: "Branding",
        href: "/services/branding/",
        line: "A look and a voice your customers know on sight.",
        img: img("branding"),
      },
      {
        label: "Video Production",
        short: "Video",
        href: "/services/video-production/",
        line: "Video shot, cut, and sized for every channel you run.",
        img: img("video-production"),
      },
      {
        label: "Custom Development",
        short: "Custom Dev",
        href: "/services/custom-development/",
        line: "The tools your team needs that off the shelf does not cover.",
        img: img("custom-development"),
      },
    ],
  },
];

/** flat view with each row's group index and global index */
export const SERVICES_FLAT = SERVICE_GROUPS_HOME.flatMap((group, g) => group.items.map((item) => ({ g, item }))).map(
  (r, i) => ({ ...r, i }),
);

/** global index of a group's first service */
export const groupBase = (g: number) => SERVICE_GROUPS_HOME.slice(0, g).reduce((n, gr) => n + gr.items.length, 0);
