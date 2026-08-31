import { HEALTHCARE, LEGAL } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/content-marketing/. Variation picks: hero B
   statement-wide (hero media as the wide band, no fragment), work
   band after spine. */

export const CONTENT_MARKETING_PAGE: ServicePageContent = {
  slug: "content-marketing",
  title: "Content Marketing Services",
  description:
    "Content marketing that brings in buyers and keeps bringing them in: articles, guides, and pages built around what your customers actually search.",
  heroVariant: "statement-wide",
  h1: [
    { text: "Content", mark: true },
    { text: " marketing that compounds" },
  ],
  answer:
    "Content marketing is publishing articles, guides, and pages that answer what your buyers search, so they find you before they find a competitor. A good piece keeps bringing in readers for years. We plan it, write it, and tie every piece to a service you sell.",
  heroAsset: {
    id: "services-content-marketing-hero",
    alt: "A content plan built by BigSquare",
    note: "Wide shot: writing in progress, an article on screen, or a content plan board.",
  },
  workBand: {
    id: "services-content-marketing-band",
    alt: "Published content bringing readers to a client site",
    note: "Wide shot: published pieces in a grid, or a reader-facing article.",
    href: "/results/",
  },
  bandPlacement: "after-spine",
  whoFor: [
    {
      text: "Your site has service pages and nothing else.",
      sub: "Buyers with questions land on the pages that answer them. No answers, no visit.",
    },
    {
      text: "You want leads that do not cost per click.",
      sub: "A good article earns its traffic month after month, with no ad spend behind it.",
    },
    {
      text: "Your industry is full of bad answers.",
      sub: "If the top result is thin or wrong, a clear and honest piece can take its spot.",
    },
  ],
  deliverables: [
    {
      text: "A content plan built on real questions",
      sub: "Topics from search data and sales calls, not guesses.",
    },
    {
      text: "Articles and guides written for you",
      sub: "Clear, honest pieces in your voice, on a steady schedule.",
    },
    {
      text: "Every piece tied to a service and a market",
      sub: "Each article points readers at the service and the cities it feeds.",
    },
    {
      text: "Old content fixed, not just new content added",
      sub: "Updating a stale piece often beats writing a new one.",
    },
    {
      text: "A report that names the winners",
      sub: "Which pieces bring readers, which bring leads, and what we do next.",
    },
  ],
  process: [
    {
      title: "Map",
      body: "We find the questions your buyers ask on the way to hiring you.",
      checklist: ["Search data", "Sales-call questions", "Competitor gaps"],
    },
    {
      title: "Write",
      body: "We publish on a steady schedule, in your voice, with your review.",
      checklist: ["Articles and guides", "Service tie-ins", "Your sign-off"],
    },
    {
      title: "Feed",
      body: "Every piece gets linked, measured, and improved over time.",
      checklist: ["Internal links", "Refresh passes", "Winners report"],
    },
  ],
  spine: [
    {
      heading: "How content brings in buyers",
      paragraphs: [
        "Nobody wakes up wanting a marketing agency or a new roof. They wake up with a question: how much does this cost, is this worth fixing, who is good near me. Content marketing means being the one who answers those questions well. The reader arrives for the answer and leaves knowing your name, and the next time the question is bigger, they come back.",
        "Search engines and answer tools both feed on the same thing: pages that genuinely help. That is why every piece we write starts from a question real buyers ask, not from a topic that sounds nice.",
      ],
    },
    {
      heading: "One article, every market",
      mark: "every market",
      paragraphs: [
        "For a multi-location brand, content compounds twice. A guide written once works for every city you serve, and when a topic deserves a local angle, the proven piece becomes the template for each market's version. Your 20th location inherits a library the first one paid for.",
        "We also connect every piece to the rest of the site: to the service it sells, the industry it speaks to, and the location pages it feeds. A blog that links to nothing helps nothing.",
      ],
    },
    {
      heading: "Steady beats viral",
      paragraphs: [
        "One post that spikes and fades changes nothing. A steady schedule of useful pieces, kept for a year, changes what you rank for and how buyers meet you. We set a pace we can hold together, and the report shows the library growing and working every month.",
        "If a piece underperforms, we fix it or replace it. The plan is alive, not a calendar we worship.",
      ],
    },
  ],
  faqTitle: "Questions we get about content marketing",
  faq: [
    {
      q: "How often do you publish?",
      a: "A steady pace we set together, based on your market and budget. A held schedule of strong pieces beats a burst of filler every time.",
    },
    {
      q: "Do you write it or do we?",
      a: "We do. You review and approve, and your experts lend facts when a topic needs them. Your time cost is reading, not writing.",
    },
    {
      q: "Will it sound like us?",
      a: "Yes. We build a voice guide from your brand and your best people before the first piece, and you approve the tone once.",
    },
    {
      q: "We tried a blog before and it did nothing. Why would this work?",
      a: "Most dead blogs were written from topic lists, not search data, and linked to nothing. Every piece we write targets a real question and feeds a service page. Then we measure it.",
    },
    {
      q: "When does it start working?",
      a: "Content compounds. Some pieces get traction in weeks, and the library builds real traffic over months. The report shows readers and leads per piece the whole way.",
    },
  ],
  related: ["seo", "generative-engine-optimization", "email"],
  industries: [LEGAL, HEALTHCARE],
};
