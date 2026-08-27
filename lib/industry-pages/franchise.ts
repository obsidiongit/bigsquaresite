import type { IndustryPageContent } from "./types";

/* /industries/franchise/ content (project-sections/industries/
   franchise.md v2). The Lane 3 flagship: franchise is both an industry
   and our core positioning, so this is the most complete page on the
   site after the homepage. Copy follows copy-rules.md; the only
   quantities on the page are the project-brief.md segment figures
   (20-500 units, 5-50 locations) and the 90-day structure
   (lib/ninety-days.ts). Board unit indexes are furniture, not claims.
   No proof claims anywhere: the proof slot stays gated until real
   data exists. */

export const FRANCHISE_PAGE: IndustryPageContent = {
  slug: "franchise",
  name: "Franchise",
  title: "Franchise Marketing Agency",
  description:
    "BigSquare is a franchise marketing agency for franchisors and franchisee groups. Search, ads, and creative with budgets and reports for every location.",

  h1: [
    { text: "The " },
    { text: "franchise", mark: true },
    { text: " marketing agency that shows its work." },
  ],
  answer:
    "BigSquare grows franchise brands. We run search, ads, and creative for franchisors, franchisee groups, and emerging brands, with a budget and a report for every location. You see every lead and every dollar in Obsidion, our client portal.",
  heroMedia: {
    id: "franchise-hero",
    note: "[PLACEHOLDER: franchise client storefront or team on site, 4:3 crop]",
    alt: "A BigSquare franchise client location",
  },
  monoStrip: [
    "Franchise development",
    "Franchisee local marketing",
    "Emerging franchise brands",
    "Franchise resale",
  ],

  difference: {
    eyebrow: "The Industry",
    title: "Franchise marketing is a different job.",
    support:
      "Most agencies build for one brand in one place. A franchise is many owners in many markets, moving as one.",
    intro: [
      "A franchise sells twice. The brand sells franchises to future owners. Each location sells to the customers down the street. Most marketing plans pick one of those jobs and quietly drop the other.",
      "Then the plan meets the org chart. Corporate wants one brand and clean numbers. Franchisees want leads this month in their market. The agency in the middle needs a system that serves both without slowing either down. That system is what we build.",
      "The cost of a generic plan shows up fast. Locations rank in some markets and not others. Ad money pools where it is easy to spend, not where it is needed. Every owner reads a different report, so nobody trusts any of them. The fix is not more effort. It is a plan built for the shape of a franchise.",
    ],
    points: [
      {
        text: "Two customers, one brand",
        sub: "Franchise development finds your next owners. Local marketing fills each location's pipeline. They need different messages, different budgets, and different reports, running side by side under one brand. Drop either one and the other gets more expensive.",
      },
      {
        text: "Local rankings decide revenue",
        sub: "A franchise does not rank once. It ranks in every market it enters, or it does not. Each location needs its own pages, listings, and reviews, built and kept current at scale. The brand site alone cannot carry every market.",
      },
      {
        text: "Budgets split across owners",
        sub: "Brand funds, co-op dollars, and franchisee spend all pull in different directions. The plan has to say who pays for what. The report has to show each owner what their share bought, or the next budget meeting turns into a fight about the fee.",
      },
      {
        text: "Brand standards meet local speed",
        sub: "Franchisees want to move now. The brand needs every ad on standard. Approved creative, clear rules, and shared templates let both happen without a fight, and without a long approval queue in the middle.",
      },
    ],
  },

  personas: {
    eyebrow: "Who We Work With",
    title: "Built for every seat at the table.",
    support:
      "Three shapes of franchise buyer, one system underneath them all.",
    cards: [
      {
        chip: "20-500 units",
        title: "Franchisors",
        body: "You own the brand and sell the next unit. We run franchise development to find qualified owners, keep the national brand sharp, and hand every location a local program that works on day one.",
      },
      {
        chip: "5-50 locations",
        title: "Franchisee groups",
        body: "You own 5 to 50 locations of a brand you believe in. We run local marketing for each one inside brand standards, with its own budget, its own numbers, and a report per store.",
      },
      {
        chip: "First locations",
        title: "Emerging brands",
        body: "You have your first locations open and more on the way. We build the playbook early, so every new opening starts with pages, tracking, and ads that already work.",
      },
    ],
  },

  /* the board's franchise skin (template v3 section 4). The seed
     scatter is deterministic on purpose (SSR renders it; no random). */
  board: {
    eyebrow: "The System",
    title: [{ text: "Pick any location. " }, { text: "Same system.", mark: true }],
    body: "Every square is a location. Each one gets its own pages, its own ads, its own budget, and its own report, all inside one brand. Try a few. The readout does not change, no matter which location you land on. That is the whole point.",
    unitNoun: "Location",
    restLabel: "Every location",
    chips: ["Pages", "Ads", "Budget", "Report"],
    cols: 16,
    rows: 6,
    /* 2 per row, columns hand-scattered so no diagonal band forms */
    seed: [4, 11, 18, 29, 35, 44, 53, 62, 66, 75, 84, 93],
    position: "after-personas",
  },

  services: {
    eyebrow: "What We Run",
    title: "The work franchise growth actually needs.",
    support:
      "Every service below runs location by location, reported in the open. Start with one or run them together.",
    rows: [
      {
        slug: "seo",
        line: "Local pages, listings, and reviews for every location, so each market ranks on its own. Corporate pages carry the brand terms while location pages win the local ones.",
      },
      {
        slug: "paid-search",
        line: "Location-level budgets and geo-targeted campaigns, from national brand terms down to the neighborhoods each unit owns. No location pays for clicks in someone else's market.",
      },
      {
        slug: "google-local-services-ads",
        line: "The pay-per-lead spots at the top of local search, run per location. Built for service-trade systems, where the call is the sale.",
      },
      {
        slug: "paid-social",
        line: "Creative the brand approves once, spent where each franchisee needs leads this month. Offers stay on standard while the targeting stays local.",
      },
      {
        slug: "web-design",
        line: "One brand system with a fast page for every location, built to turn local searches into calls. New openings launch on the same system, not from scratch.",
      },
      {
        slug: "obsidion-portal",
        line: "Every lead, every dollar, every location in one login. Corporate and owners read the same numbers, so the monthly meeting starts from the same page.",
      },
    ],
  },

  spine: [
    {
      heading: "One system, two motions",
      paragraphs: [
        "Franchise marketing runs as one system with two motions inside it. The national motion sets the frame: the brand story, the approved creative, the offers, and the standards every location follows. The local motion does the winning: pages, listings, reviews, and ads tuned to each market, spending that market's budget.",
        "Both motions run on a weekly rhythm. Brand work ships on a calendar the whole system can see. Local work gets checked against its own market's numbers, not a national average. When a location falls behind, the plan for that location changes. The brand does not wait, and the location does not drown. One team runs both motions, so nothing gets lost in a handoff between vendors.",
      ],
    },
    {
      heading: "Franchise development is marketing too",
      paragraphs: [
        "Selling the next unit is a marketing job, and most systems treat it as a sales job with a landing page. Development campaigns need their own audience, their own story, and their own follow-up. The buyer is not looking for a haircut or a burger. They are deciding where to put their savings and their next decade.",
        "We build development marketing the way we build local marketing: real numbers in the story, tracking on every step, and a clean handoff to your sales team. Qualified people who already understand the brand, not a list of names who clicked once.",
      ],
    },
    {
      heading: "Money that knows its job",
      paragraphs: [
        "Franchise budgets fail when nobody can say whose dollar did what. We map the money at kickoff: what corporate funds, what the co-op covers, and what each franchisee puts in. Every dollar gets tagged to a location and a goal before it gets spent.",
        "That map is what makes the reporting honest. An owner who funds their own ads sees their own results. Corporate sees the whole board. Nobody argues about a blended number that describes everyone and no one.",
      ],
    },
    {
      heading: "Reports owners actually open",
      paragraphs: [
        "Obsidion is our client portal, and every franchise client gets it. Each location has its own dashboard: the leads it got, where they came from, what they cost, and what happened next. Corporate gets the same truth rolled up across the system.",
        "This is what we mean by showing our work. Franchisees stop asking corporate what the fee bought. Corporate stops chasing screenshots before board meetings. The numbers sit in one place, and everyone reads the same ones. When a number is bad, you see that too, along with what we are doing about it.",
      ],
    },
  ],

  spineMedia: {
    id: "franchise-method",
    note: "[PLACEHOLDER: Obsidion portal in use, over the shoulder, 16:9]",
    alt: "The Obsidion portal showing location-level results",
    afterBlock: 2,
  },

  /* the breadth section runs the SECTORS variant here (template rule:
     never repeat the hero strip; the franchise sub-markets already
     live there). The three sibling-industry chips got their hrefs when
     the gate opened (2026-08-26): the promised data change. */
  subMarkets: {
    eyebrow: "Sectors",
    line: "Franchise systems run in every sector, and the playbook holds across them. 3 of these are industries we run dedicated programs for.",
    chips: [
      { label: "Home Services", href: "/industries/home-services/" },
      { label: "Healthcare", href: "/industries/healthcare/" },
      { label: "Legal", href: "/industries/legal/" },
      { label: "Food & Beverage" },
      { label: "Fitness & Wellness" },
      { label: "Beauty & Personal Care" },
      { label: "Senior Care" },
      { label: "Education" },
    ],
  },

  process: {
    eyebrow: "The Plan",
    title: "The first 90 days, written down.",
    support:
      "No long onboarding and no mystery phase. The plan has dates, and you watch it run in the portal.",
    phaseBodies: [
      "10 days from yes to a locked plan. No long onboarding.",
      "Campaigns go live with tracking already fixed, so day one gets counted.",
      "The system tightens every week, and the numbers decide what grows.",
    ],
    payoff:
      "90 days in, you will know what every location spent and what it got back.",
    reassurance: [
      "Month to month, no long contract.",
      "You own your accounts and your site.",
      "A report for every location, not one blended number.",
    ],
  },

  faqTitle: "Franchise questions, straight answers.",
  faq: [
    {
      q: "Do you work with franchisors, franchisees, or both?",
      a: "Both. We run national brand work for franchisors, local programs for franchisee groups, and full systems that cover the two together. Budgets and reports stay separate for every location either way.",
    },
    {
      q: "Can each franchisee have their own budget?",
      a: "Yes. Corporate sets the frame, each owner funds their share, and every location gets its own spend and its own results. Nobody pays for another market's leads.",
    },
    {
      q: "How do you keep every location on brand?",
      a: "Brand rules load in first. Creative gets approved once, then rolls out per location with the right names, offers, and service areas. Franchisees move fast without going off standard.",
    },
    {
      q: "What is franchise development marketing?",
      a: "Marketing that finds your next franchise owners. We build campaigns that reach qualified buyers, tell the brand story with real numbers, and hand your sales team people worth calling.",
    },
    {
      q: "What happens when we open a new location?",
      a: "We plug it into the system the other locations already run: its own pages, listings, tracking, and ads. Openings follow a playbook, not a scramble.",
    },
    {
      q: "What does franchise marketing cost?",
      a: "It depends on your locations and your goals, so we will not invent a number here. The audit comes first: we look at your markets and your current spend, then map who funds what. You get the plan and the price before you commit to anything.",
    },
    {
      q: "If we ever leave, who keeps the accounts?",
      a: "You do. Ad accounts, sites, and data belong to your brand from day one. Nothing sits in our name, so nothing leaves when we do.",
    },
  ],
};
