import type { IndustryPageContent } from "./types";

/* /industries/legal/ content (legal.md v1), stamped from the T3
   template v3 after the Lane 3 gate opened 2026-08-26. Own copy pass,
   plain and short. Practice areas from industries-index.md, split 3/3
   between the hero strip and the breadth band (the never-repeat rule).
   No invented numbers; "hold to account" is the page's one turn of
   phrase.

   Variance dials vs home-services: board = OFFICE skin 10x5 seated
   AFTER PERSONAS (the default); difference list runs 3 points; spine
   media after block 2; underline on "One standard."; services swap in
   content-marketing. */

export const LEGAL_PAGE: IndustryPageContent = {
  slug: "legal",
  name: "Legal",
  title: "Law Firm Marketing Agency",
  description:
    "BigSquare is a law firm marketing agency for multi-office firms. Search, ads, and content by office and practice area, tracked from click to case.",

  h1: [
    { text: "The " },
    { text: "law firm", mark: true },
    { text: " marketing agency you can hold to account." },
  ],
  answer:
    "BigSquare grows law firms. We run search, ads, and content for multi-office firms and growing practices, with a budget and a report for every office and every practice area. Every case inquiry shows up in Obsidion, our client portal.",
  heroMedia: {
    id: "legal-hero",
    note: "[PLACEHOLDER: attorneys in consult or office exterior, 4:3 crop]",
    alt: "A BigSquare law firm client office",
  },
  monoStrip: ["Personal Injury", "Family Law", "Criminal Defense"],

  difference: {
    eyebrow: "The Industry",
    title: "Legal marketing is a trust game.",
    support:
      "Nobody hires a lawyer casually. Every click happens under stress, and every page has to earn belief.",
    intro: [
      "People look for a lawyer on the worst week of their year. They search, read, compare, and call two or three firms. The firm that looks credible and answers first usually gets the case. Second place gets nothing.",
      "And the stakes per click are high. Legal keywords are among the most expensive on Google, so waste shows up fast. The plan has to be precise about practice areas, offices, and the cases you actually want.",
      "Most legal marketing also looks the same. The same stock columns, the same big promises, the same page everyone else has. A firm that shows real results, real people, and clear answers stands out quickly, and that is a content problem before it is an ad problem.",
    ],
    points: [
      {
        text: "Cost per case, not cost per click",
        sub: "Expensive clicks are fine when the cases are good. We track from the click to the signed case, so spend follows the matters you want instead of raw traffic. Cost per signed case is the number partners actually discuss, so it is the number we report.",
      },
      {
        text: "Every practice area is its own market",
        sub: "Personal injury and estate planning have different clients, different urgency, and different keywords. Each practice area gets its own pages, its own ads, and its own numbers. The budget splits the same way, so one area never quietly eats the others.",
      },
      {
        text: "Credibility is the conversion",
        sub: "Results, reviews, and real attorney pages do the selling. We build proof into every page and keep the attorney advertising rules in view while we do it. Your results and your attorneys do the convincing. We make sure people see them.",
      },
    ],
  },

  personas: {
    eyebrow: "Who We Work With",
    title: "Built for firms with more than one front door.",
    support: "Three shapes of firm, one system for intake.",
    cards: [
      {
        chip: "Multi-office",
        title: "Multi-office firms",
        body: "You have offices in more than one city. Each office gets its own local presence and its own report, under one firm brand. The managing partner sees the whole board in one place.",
      },
      {
        chip: "Growing practices",
        title: "Growing practices",
        body: "You are strong in one market and adding attorneys. We build the intake pipeline that keeps the new desks busy, in the practice areas you want to grow.",
      },
      {
        chip: "Firm groups",
        title: "Firm groups and networks",
        body: "You run a group of firms or offices under shared ownership. We keep the brand consistent while each firm wins its own market, with numbers you can compare side by side.",
      },
    ],
  },

  board: {
    eyebrow: "The System",
    title: [{ text: "Every office. " }, { text: "One standard.", mark: true }],
    body: "Every square is an office. Each one gets its own pages, its own ads, its own intake tracking, and its own report, all under one firm. Try a few. The readout never changes, because every office runs the same system, and a new office simply joins the board.",
    unitNoun: "Office",
    restLabel: "Every office",
    chips: ["Pages", "Ads", "Intakes", "Report"],
    cols: 10,
    rows: 5,
    seed: [2, 7, 13, 18, 21, 26, 34, 39, 42, 47],
    position: "after-personas",
  },

  services: {
    eyebrow: "What We Run",
    title: "The work that signs cases.",
    support:
      "Every service below runs by office and practice area, reported in the open.",
    rows: [
      {
        slug: "seo",
        line: "Practice area pages and local rankings for every office. When someone searches for a lawyer near them, you make the short list.",
      },
      {
        slug: "paid-search",
        line: "High-stakes keywords managed tightly: exact practice areas, exact geographies, and tracking through to the case. Waste gets cut weekly, not quarterly.",
      },
      {
        slug: "google-local-services-ads",
        line: "Screened-profile lead ads for law firms. You pay for the inquiry, not the click, and we track which inquiries become cases.",
      },
      {
        slug: "content-marketing",
        line: "Plain-language answers to the questions clients search before they call. Authority that ranks and reassures, written with your attorneys and signed with their names.",
      },
      {
        slug: "web-design",
        line: "Attorney pages, results, and reviews built to earn the call. Fast, credible, and easy to keep current as attorneys and offices change.",
      },
    ],
  },

  /* sub-markets variant: the other half of the practice-area list */
  subMarkets: {
    eyebrow: "Practice Areas",
    line: "Each practice area gets its own pages and its own numbers, so growth in one never hides trouble in another. More of the areas we run:",
    chips: [
      { label: "Immigration" },
      { label: "Estate Planning" },
      { label: "Employment Law" },
    ],
  },

  spine: [
    {
      heading: "From click to signed case",
      paragraphs: [
        "A law firm cannot manage marketing on clicks. The question is what a signed case costs, by practice area and by office. We wire tracking from the first search to the intake call to the engagement, so that question has an answer.",
        "That number changes decisions. Some expensive keywords earn their price. Some cheap ones fill the intake queue with matters you decline. The report shows which is which, and the budget follows it. It also settles the oldest argument in legal marketing, whether the spend is worth it, because cost per case stops being an opinion.",
      ],
    },
    {
      heading: "Offices compete. The firm wins.",
      paragraphs: [
        "Each office fights its own local fight: its own rankings, its own reviews, its own ads. But the firm needs one brand and one set of numbers. We run both layers on purpose, local campaigns under a firm-wide standard. The standard travels between offices. The numbers stay local to each one.",
        "Every office sees its own report. The managing partner sees them all side by side. Nobody argues about whose marketing worked, because it is written down. A new office joins the same board the week it opens.",
      ],
    },
    {
      heading: "Intake is part of marketing",
      paragraphs: [
        "The fastest firm usually wins the case. When an inquiry waits hours for a callback, that person has already talked to someone else. We treat intake speed as a marketing number: how long your firm takes to answer, and what happens when it does not. It is the cheapest improvement in the whole plan.",
        "So the report covers it. You see inquiries by hour and by office, and where they stall. Fixing intake is often worth more than another dollar of ads, and when that is true, we say so.",
      ],
    },
    {
      heading: "Content that sounds like counsel",
      paragraphs: [
        "Before people call a lawyer, they search their situation. The firm that answers those questions clearly, in plain language, earns the visit and often the case. We write that content with your attorneys, not instead of them. Their names go on it, because their names are the authority.",
        "It compounds. Good answers rank, get cited, and come up when people ask AI tools who to call. That is the long game, and it belongs to firms that start it. The piece a client reads today is the piece another lawyer forwards next month.",
      ],
    },
  ],
  spineMedia: {
    id: "legal-method",
    note: "[PLACEHOLDER: intake dashboard or attorney team, 16:9]",
    alt: "Intake results in the Obsidion portal",
    afterBlock: 2,
  },

  process: {
    eyebrow: "The Plan",
    title: "The first 90 days, in writing.",
    support:
      "No long onboarding and no mystery. The plan has dates, you watch it run in the portal, and the partners see the same calendar we do.",
    phaseBodies: [
      "Ten days to a plan per office and practice area.",
      "Campaigns live with intake tracking counting from day one.",
      "Spend shifts to the offices and practice areas that sign cases.",
    ],
    payoff:
      "Ninety days in, you will know what every office spent and what it signed.",
    reassurance: [
      "Month to month, no long engagement letter.",
      "Your accounts, your site, your data.",
      "A report per office, never one blended number.",
    ],
  },

  faqTitle: "Law firm questions, straight answers.",
  faq: [
    {
      q: "Which practice areas do you serve?",
      a: "Personal injury, family law, criminal defense, immigration, estate planning, and employment law, among others. Each gets its own pages, ads, and numbers, and the mix per office follows your caseload goals.",
    },
    {
      q: "How do you measure results for a law firm?",
      a: "By intakes and signed cases, not clicks. Calls and forms are tracked to the office and campaign that produced them, and you see it all in the portal. Partners read the same report, so the conversation is about cases, not traffic.",
    },
    {
      q: "Can you keep our ads inside the attorney advertising rules?",
      a: "We build campaigns with the rules in view, and your firm reviews and approves before anything runs. Nothing goes live without your sign-off.",
    },
    {
      q: "Can each office run its own marketing?",
      a: "Yes. Each office gets its own budget, pages, and ads for its market. The brand stays one firm. The marketing stays local, and each office answers for its own numbers.",
    },
    {
      q: "Do you work with solo attorneys?",
      a: "Our system fits firms with more than one office, or a practice growing toward one. For a solo practice it is usually more system than you need yet, and we will tell you so in the audit.",
    },
    {
      q: "Can you work alongside our marketing hire?",
      a: "Yes. Many firms have one marketing person carrying everything. We become the team around them: they keep the strategy seat, we bring the hands and the reporting. The handoff stays clean because everyone reads the same numbers.",
    },
    {
      q: "Who owns the website and the ad accounts?",
      a: "Your firm does, from day one. If we ever part ways, everything stays with you.",
    },
  ],
};
