import { FRANCHISE, HOME_SERVICES } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/seo/ (the T2 flagship). Title tag from sitemap.md.
   Widened 2026-08-31 (wide-positioning pass): the multi-location SEO
   keyword moves to its D4 wave-2 slug when the Ahrefs pass lands;
   final title lockdown waits on that pass.
   Every claim here is either process description or traces to approved
   copy (the 3-to-6-months line and the ownership line come from
   project-sections/home/12.faq.md's locked answers). */

export const SEO_PAGE: ServicePageContent = {
  slug: "seo",
  title: "Search Engine Optimization (SEO)",
  description:
    "SEO from one team: site fixes, content, and pages that rank where your buyers search. Watch rankings, calls, and leads move in one report.",
  h1: [
    { text: "SEO that " },
    { text: "proves", mark: true },
    { text: " it works" },
  ],
  answer:
    "SEO is the work of getting your brand found on Google. One team fixes the site, builds the pages, and writes the content that makes you rank. You watch rankings, calls, and leads move in one report.",
  heroVariant: "media-right",
  heroAsset: {
    id: "services-seo-hero",
    alt: "Search rankings tracked city by city in the Obsidion portal",
    note: "Square-ish shot: portal rankings view, or a map-grid rank tracker. Something with visible city-by-city structure.",
  },
  heroVignette: "local-rank",
  workBand: {
    id: "services-seo-band",
    alt: "The BigSquare team reviewing SEO results",
    note: "Wide (21:9) shot: team at work, a strategy wall, or a portal report on a big screen.",
    href: "/results/",
  },
  whoFor: [
    {
      text: "Some locations rank and others are invisible.",
      sub: "Your best market sits on page 1. The rest are nowhere. Each location needs its own push, run from one plan.",
    },
    {
      text: "You are opening new locations.",
      sub: "A new location starts at zero on Google. The earlier the work starts, the sooner it brings in its own leads.",
    },
    {
      text: "Every lead you get is a lead you paid for.",
      sub: "Ads work, but the meter never stops. Ranking brings in the buyers who search first and click the top result.",
    },
  ],
  deliverables: [
    {
      text: "A page for every location",
      sub: "Built to rank in its own city and turn searches into calls.",
    },
    {
      text: "A keyword plan per market",
      sub: "What people search in Denver is not what they search in Tampa. We map each market on its own.",
    },
    {
      text: "Google Business Profile management",
      sub: "Every profile claimed, correct, and active, so the map results work for you.",
    },
    {
      text: "Content that answers real questions",
      sub: "Pages and posts written around what your buyers actually type.",
    },
    {
      text: "Technical fixes and site speed",
      sub: "The quiet work that keeps Google happy: speed, structure, and clean links.",
    },
    {
      text: "Rankings and leads by location",
      sub: "One report in your portal. See what moved, city by city, any day you want.",
    },
  ],
  process: [
    {
      title: "Audit",
      body: "We check every location the way Google sees it, then show you the gaps.",
      checklist: ["Rankings by city", "Listings and profiles", "Site health and speed"],
    },
    {
      title: "Build",
      body: "We fix what blocks you and build what is missing, location by location.",
      checklist: ["Location pages", "Profile cleanup", "Technical fixes"],
    },
    {
      title: "Grow",
      body: "We publish, tune, and report, month after month, across every market.",
      checklist: ["New content each month", "Local links", "Reports by location"],
    },
  ],
  spine: [
    {
      heading: "How SEO gets you found",
      paragraphs: [
        "When someone searches \"roof repair near me\" or \"med spa in Tampa,\" Google shows businesses close to that person. Those results are local, and winning them takes local pages and listings. An ecommerce or software brand fights a different fight: national rankings for the things it sells. SEO is the work of winning the searches your buyers make, local or national, from one site.",
        "The pieces are simple to name and slow to fake. Pages that deserve to rank. Listings and profiles that are correct and active. A site that is fast and clean behind them. And content that answers the questions buyers type before they pick anyone.",
      ],
    },
    {
      heading: "The work compounds across locations",
      mark: "compounds",
      paragraphs: [
        "Many locations can help you here instead of hurting you. The keyword research, the page pattern, and the content plan get built once. Then every location draws on them. When we learn what makes one city rank, we apply it to the rest the same month. A single-location shop cannot match that pace, and most agencies never set the work up to use it.",
        "It also means new locations open with a head start. The page pattern is proven, the profile process is ready, and the first free leads arrive sooner.",
        "Reviews and local links work the same way. Every location that earns them lifts the whole brand, and a stronger brand helps each new local page rank faster. That flywheel only spins if one team runs it across all your locations at once. That is the job.",
      ],
    },
    {
      heading: "What you will see, and when",
      paragraphs: [
        "SEO is not instant, and anyone who says it is has something to sell you. Most brands see rankings start to move in 3 to 6 months, and easier markets move sooner. What you should see from day 1 is the work itself: pages shipped, profiles fixed, and content published, all listed in your portal next to the numbers they move.",
        "That is the deal. You should never have to wonder what your SEO team did this month.",
      ],
    },
  ],
  faqTitle: "Questions we get about SEO",
  faq: [
    {
      q: "How long does SEO take to work?",
      a: "Most brands see rankings start to move in 3 to 6 months. Easier markets can move sooner. We show you the trend every month, so you always know where things stand.",
    },
    {
      q: "Do you do local SEO for each location?",
      a: "Yes. Each location gets its own page, its own Google Business Profile work, and its own tracking. That per-location work is the core of multi-location SEO.",
    },
    {
      q: "Do we own the site and the content?",
      a: "Yes. You do. Always. Every page we build and every word we write stays with you, even if you leave.",
    },
    {
      q: "What do you report each month?",
      a: "Rankings, traffic, calls, and leads, broken out by location. It all lives in your portal, so you can check any day, not just on report day.",
    },
    {
      q: "Can you work with our franchisees?",
      a: "Yes. We can run the brand site, single franchisee markets, or the whole thing together, with budgets and reports split by location.",
    },
  ],
  related: ["generative-engine-optimization", "content-marketing", "paid-search"],
  industries: [FRANCHISE, HOME_SERVICES],
};
