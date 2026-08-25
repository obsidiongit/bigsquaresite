/* Footer link columns (shared/footer.md v3): the four-column IA every
   page's footer renders, mirroring the services IA exactly. Slugs match
   sitemap.md and the nav overlay. One source: a route change is a data
   change here, never a Footer.tsx change. Blog and Resources 404 until
   Phases 5/6, the same known state as the service links (Phase 4).

   Privacy Policy and Terms are deliberately NOT in the Company column:
   the legal line at the footer's foot already links both, and listing
   them twice cost the column two rows of height for no new link. */

export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about/" },
      { label: "Leadership", href: "/leadership/" },
      { label: "Careers", href: "/careers/" },
      { label: "Blog", href: "/blog/" },
      { label: "Results", href: "/results/" },
      { label: "Resources", href: "/resources/" },
    ],
  },
  {
    title: "Organic Marketing",
    links: [
      { label: "Search Engine Optimization (SEO)", href: "/services/seo/" },
      {
        label: "Generative Engine Optimization (GEO)",
        href: "/services/generative-engine-optimization/",
      },
      { label: "Social Media", href: "/services/social-media/" },
      { label: "Content Marketing", href: "/services/content-marketing/" },
      { label: "Email", href: "/services/email/" },
      { label: "Obsidion Portal", href: "/services/obsidion-portal/" },
    ],
  },
  {
    title: "Paid Advertising",
    links: [
      { label: "Paid Search", href: "/services/paid-search/" },
      {
        label: "Google Local Services Ads",
        href: "/services/google-local-services-ads/",
      },
      { label: "Paid Social", href: "/services/paid-social/" },
      { label: "Amazon Ads", href: "/services/amazon-ads/" },
      { label: "Creator Network", href: "/services/creator-network/" },
    ],
  },
  {
    title: "Design & Development",
    links: [
      { label: "Web Design", href: "/services/web-design/" },
      { label: "Branding", href: "/services/branding/" },
      { label: "Video Production", href: "/services/video-production/" },
      { label: "Custom Development", href: "/services/custom-development/" },
    ],
  },
];
