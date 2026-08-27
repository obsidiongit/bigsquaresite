import { FRANCHISE, HEALTHCARE } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/paid-social/. Variation picks: hero B statement-wide
   (hero media band, no fragment), work band after spine. */

export const PAID_SOCIAL_PAGE: ServicePageContent = {
  slug: "paid-social",
  title: "Paid Social Ads for Multi-Location Brands",
  description:
    "Paid social ads on Meta and TikTok built to fill the calendar at every location, with creative made in house and budgets split by market.",
  heroVariant: "statement-wide",
  h1: [
    { text: "Paid social", mark: true },
    { text: " ads for multi-location brands" },
  ],
  answer:
    "Paid social puts your brand in the feeds your customers scroll every day. We make the creative, run the ads on Meta and TikTok, and split budget by market so every location fills its calendar. When an ad wins in one city, every city gets it.",
  heroAsset: {
    id: "services-paid-social-hero",
    alt: "Paid social ad creative for a multi-location brand",
    note: "Wide shot: ad creative variations on screen, or a phone mid-scroll on a client ad.",
  },
  workBand: {
    id: "services-paid-social-band",
    alt: "A paid social campaign review",
    note: "Wide shot: a performance review, or a wall of creative tests.",
    href: "/results/",
  },
  bandPlacement: "after-spine",
  whoFor: [
    {
      text: "Your buyers are not searching yet.",
      sub: "Search catches demand that exists. Social creates it, putting you in front of people before they need you.",
    },
    {
      text: "You have offers worth showing off.",
      sub: "New location openings, seasonal pushes, events. Feeds are where offers travel.",
    },
    {
      text: "Your current ads wore out.",
      sub: "Feeds burn through creative fast. Winning here means always testing the next one.",
    },
  ],
  deliverables: [
    {
      text: "Creative made in house",
      sub: "Video and image ads produced for the feed, not resized print.",
    },
    {
      text: "Campaigns per market",
      sub: "Each location gets its own audience, budget, and offer.",
    },
    {
      text: "Constant creative testing",
      sub: "New angles every month. Winners scale, losers stop.",
    },
    {
      text: "Leads wired to follow-up",
      sub: "Every lead lands in your follow-up flow the minute it arrives.",
    },
    {
      text: "Results by location",
      sub: "Cost per lead, by market, in your portal.",
    },
  ],
  process: [
    {
      title: "Plan",
      body: "Offer, audience, and budget mapped for each market.",
      checklist: ["Offers per market", "Audiences", "Budget split"],
    },
    {
      title: "Produce",
      body: "We make the ads: hooks, cuts, and captions built for the feed.",
      checklist: ["Video and image ads", "Copy variants", "Landing pages"],
    },
    {
      title: "Scale",
      body: "Tests run weekly. Winners get budget, losers get cut.",
      checklist: ["Creative tests", "Budget moves", "Location report"],
    },
  ],
  spine: [
    {
      heading: "Social ads create demand",
      paragraphs: [
        "Search ads catch people who already want what you sell. Social ads reach the much larger crowd that would want it if you showed them. That is what makes the channel powerful for openings, offers, and seasonal pushes: you decide when the attention happens instead of waiting for it.",
        "It also means the ad has to earn the attention. Nobody went to the feed looking for you, so the first second decides everything.",
      ],
    },
    {
      heading: "Creative is the whole game",
      mark: "Creative",
      paragraphs: [
        "On Meta and TikTok, targeting is mostly the machine's job now. What you control is the creative, and it decides your cost more than any setting does. A tired ad quietly doubles your cost per lead. A fresh angle can cut it in half overnight.",
        "So we treat creative as a pipeline, not a project. New hooks and cuts enter testing every month, real people from our Creator Network feed it, and the losers get retired before they drag the account down.",
      ],
    },
    {
      heading: "One win, every market",
      paragraphs: [
        "The multi-location advantage here is simple: a winning ad found in Denver works in Tampa the same week, with the local details swapped. Single-location competitors pay full price to learn what works. Your brand learns once and spends everywhere with the answer key.",
        "The portal keeps it honest, showing each market's cost per lead so a win has to prove itself as it travels.",
      ],
    },
  ],
  faqTitle: "Questions we get about paid social",
  faq: [
    {
      q: "Which platforms do you run?",
      a: "Meta first for most local brands, TikTok where the audience fits, and others case by case. We follow your buyers, not a platform list.",
    },
    {
      q: "Do you make the videos and images?",
      a: "Yes, in house, and real customer-style clips come through our Creator Network. You approve the creative before it spends a dollar.",
    },
    {
      q: "How fast will we see leads?",
      a: "Paid ads can produce leads in the first 2 weeks. The early weeks also teach us which creative and markets convert, so results usually climb from there.",
    },
    {
      q: "What budget do we need?",
      a: "It depends on your markets and how many locations are pushing at once. The audit scopes it honestly, and budgets can shift between markets as results come in.",
    },
    {
      q: "What happens to the leads?",
      a: "Each one lands in your follow-up flow immediately and shows up in your portal with its source and location. Leads that wait go cold, so we make sure they never wait.",
    },
  ],
  related: ["paid-search", "creator-network", "social-media"],
  industries: [FRANCHISE, HEALTHCARE],
};
