import type { IndustryPageContent } from "./types";

/* /industries/home-services/ content (home-services.md v1), stamped
   from the T3 template v3 after the Lane 3 gate opened 2026-08-26.
   Own copy pass under copy-rules: plain and short (Brad's round-2
   note: copy across the site is getting muddied; a sitewide sweep
   comes later, so keep every line simple). No invented numbers; the
   8 trades come from industries-index.md, split 4/4 between the hero
   strip and the breadth band (the never-repeat rule).

   Variance dials vs franchise: board = TERRITORY skin 14x6 seated
   AFTER SERVICES; spine = 3 blocks, media after block 1; underline on
   "fully covered."; persona chips are plain-words categories. */

export const HOME_SERVICES_PAGE: IndustryPageContent = {
  slug: "home-services",
  name: "Home Services",
  title: "Home Services Marketing Agency",
  description:
    "BigSquare is a home services marketing agency for HVAC, plumbing, roofing, and more. Local search, ads, and websites with a report per territory.",

  h1: [
    { text: "The " },
    { text: "home services", mark: true },
    { text: " marketing agency that counts every call." },
  ],
  answer:
    "BigSquare grows home service brands. We run local search, ads, and websites for HVAC, plumbing, roofing, and the other trades, with a budget and a report for every territory. Every call, lead, and dollar shows up in Obsidion, our client portal.",
  heroMedia: {
    id: "home-services-hero",
    note: "[PLACEHOLDER: tech at the door or branded truck, 4:3 crop]",
    alt: "A home services technician arriving at a job",
  },
  monoStrip: ["HVAC", "Plumbing", "Roofing", "Restoration"],

  difference: {
    eyebrow: "The Industry",
    title: "Home services marketing is won locally.",
    support:
      "The whole business is the phone ringing in the right ZIP code. That is a local game, block by block.",
    intro: [
      "A home services company lives on calls. Somebody's water heater breaks, they search, and they call whoever looks real and picks up. Most of that decision happens on Google in about a minute.",
      "So the work is local. Rankings, reviews, and ads have to win in each territory you serve, not on average. A lead in the wrong ZIP code costs you twice: the ad spend and the drive.",
      "Most agencies treat the trades like any other local business. They set a budget in January and report one blended number all year. By the time it looks wrong, the busy season is over and the quiet branch stayed quiet. The plan has to move faster than that.",
    ],
    points: [
      {
        text: "The map decides who gets the call",
        sub: "Most calls start in the map results. Listings, reviews, and location pages decide whether you show up there. We treat the map as its own campaign, per territory. Win the map in a territory and the calls follow.",
      },
      {
        text: "Season and weather move the budget",
        sub: "Storm season, cold snaps, and heat waves change what people search for overnight. Budgets have to move with the weather, not sit in a plan from January. We watch the demand, not the calendar.",
      },
      {
        text: "Reviews are the sales team",
        sub: "Before anyone calls, they read. A steady stream of real reviews at every location beats a clever ad. We build the review ask into how your team already works. The trucks earn the reviews. We make sure they get asked for and answered.",
      },
      {
        text: "Every truck is a territory",
        sub: "Your service area is a set of territories, each with its own demand and its own competition. We plan and report by territory, so you see where calls come from and where they do not. That map is also how you decide where the next branch goes.",
      },
    ],
  },

  personas: {
    eyebrow: "Who We Work With",
    title: "Built for the trades at scale.",
    support: "Three shapes of home service company, one local playbook.",
    cards: [
      {
        chip: "Multi-location",
        title: "Multi-location operators",
        body: "You run several branches under one name. We run each branch's local presence, with its own budget and its own report.",
      },
      {
        chip: "Franchise systems",
        title: "Home service franchises",
        body: "You are a franchise brand in the trades. We keep the brand on standard while every unit wins its own market.",
      },
      {
        chip: "Regional brands",
        title: "Regional brands",
        body: "You own one strong market and want the next one. We build the playbook where you are, then carry it to each new territory.",
      },
    ],
  },

  board: {
    eyebrow: "The System",
    title: [{ text: "Every territory, " }, { text: "fully covered.", mark: true }],
    body: "Every square is a territory. Each one gets its own pages, its own Local Services Ads, its own reviews, and its own report. Try a few. The readout stays the same, because every territory runs the whole playbook, and a new branch gets its own square the week it opens.",
    unitNoun: "Territory",
    restLabel: "Every territory",
    chips: ["Pages", "LSA", "Reviews", "Report"],
    cols: 14,
    rows: 6,
    seed: [3, 10, 16, 26, 33, 41, 44, 53, 60, 68, 73, 81],
    position: "after-services",
  },

  services: {
    eyebrow: "What We Run",
    title: "The work that makes the phone ring.",
    support:
      "Every service below runs territory by territory, reported in the open. Start with one or run them together.",
    rows: [
      {
        slug: "seo",
        line: "Location pages, listings, and the map results, territory by territory. When the water heater breaks, you are the company they find.",
      },
      {
        slug: "google-local-services-ads",
        line: "The pay-per-lead spots at the top of local search, run per location. The Google Guaranteed badge does the trusting for you.",
      },
      {
        slug: "paid-search",
        line: "Search ads tuned to each territory and each season. Spend moves to where the calls are, not where they were last quarter.",
      },
      {
        slug: "web-design",
        line: "Fast pages built to get the call: tap to call, book online, and proof up front. One system for every branch.",
      },
      {
        slug: "obsidion-portal",
        line: "Every call, every lead, every dollar by territory in one login. You see which trucks the marketing filled.",
      },
    ],
  },

  /* sub-markets variant: the other half of the trade list (the hero
     strip carries HVAC / plumbing / roofing / restoration) */
  subMarkets: {
    eyebrow: "Trades",
    line: "The playbook holds across the trades, because calls, reviews, and territories work the same way in each one. More of the work we run:",
    chips: [
      { label: "Electrical" },
      { label: "Pest Control" },
      { label: "Landscaping" },
      { label: "Garage Doors" },
    ],
  },

  spine: [
    {
      heading: "Win the minute that matters",
      paragraphs: [
        "Most home service customers decide in one search session. The winner shows up three times on that screen: in the Local Services Ads at the top, in the map results under them, and in the organic listings below. We build for all three at once, in every territory, because the company that owns that screen owns the week.",
        "Then the page has to close. A homeowner with a burst pipe does not read a brochure. They want a number to tap, a real review count, and proof you serve their street. Our pages are built around that minute.",
      ],
    },
    {
      heading: "Budgets that follow the season",
      paragraphs: [
        "Demand in the trades is not steady. Heat waves fill HVAC schedules, storms fill roofing ones, and January fills nobody's. We plan the year around your seasons, then move budgets weekly as the searches move.",
        "The same goes for territories. When one branch is booked out and another is quiet, spend shifts to the quiet one. The plan serves the schedule, not the other way around. When a storm hits, the plan for that week changes that day.",
      ],
    },
    {
      heading: "Reviews, every single week",
      paragraphs: [
        "Review growth is not a campaign. It is a habit. The ask goes out when the job closes, the response goes up when the review lands, and every location's profile stays alive. We build that loop into how your team already works, then keep it running.",
        "It pays twice. Reviews convince the next customer, and they power the map rankings and Local Services Ads that bring that customer in. Quiet compounding is the point, and it belongs to the companies that never skip a week.",
      ],
    },
    {
      heading: "Reports built for the morning huddle",
      paragraphs: [
        "Obsidion is our client portal, and every territory gets its own page in it: the calls, where they came from, what they cost, and what got booked. No spreadsheet stitching, no waiting for a monthly deck.",
        "That is the number your managers actually need at the morning huddle. Which territories rang yesterday, which did not, and what we are changing about it. When a number looks off, the note beside it says what we are doing next.",
      ],
    },
  ],
  spineMedia: {
    id: "home-services-method",
    note: "[PLACEHOLDER: dispatch board or portal on an office screen, 16:9]",
    alt: "Territory results in the Obsidion portal",
    afterBlock: 1,
  },

  process: {
    eyebrow: "The Plan",
    title: "The first 90 days, on the calendar.",
    support:
      "No long onboarding and no guessing. The plan has dates, and you watch it run in the portal.",
    phaseBodies: [
      "Ten days from the first call to a plan per territory, not a binder.",
      "Ads and listings go live with call tracking already counting.",
      "Budgets follow the calls, and quiet territories get their own fix.",
    ],
    payoff:
      "Ninety days in, you will know what every territory spent and what it booked.",
    reassurance: [
      "No long contracts, month to month.",
      "Your accounts and your site stay yours.",
      "A report per territory, not one blended number.",
    ],
  },

  faqTitle: "Home services questions, straight answers.",
  faq: [
    {
      q: "Which trades do you work with?",
      a: "HVAC, plumbing, electrical, roofing, pest control, landscaping, restoration, and garage doors, among others. The playbook is the same. The seasons and the search terms change. If your trade is not on the list, ask: if the work is local and the phone matters, it fits.",
    },
    {
      q: "Do you run Google Local Services Ads?",
      a: "Yes, per location. We handle the profile, the reviews that power it, and the budget, and we count every lead it sends. For most trades it is the first dollar we spend.",
    },
    {
      q: "Can you track calls, not just clicks?",
      a: "Yes. Calls are tracked to the territory and campaign that made the phone ring. In the trades, the call is the whole point.",
    },
    {
      q: "How do you handle the busy season and the slow season?",
      a: "Budgets move with demand. We plan the year around your seasons, then adjust weekly when the weather moves the searches. Slow months go to reviews, pages, and rankings, so the busy months start from higher ground.",
    },
    {
      q: "Do you work with single-location companies?",
      a: "The system is built for companies with more than one territory or branch. If you are one shop planning to expand, we can build the playbook you will grow into. The audit will tell you honestly whether we are the right size for you yet.",
    },
    {
      q: "How much should a company in the trades spend?",
      a: "Enough to win your territories, and not a dollar past what the schedule can serve. The audit comes first: we look at your markets and your capacity, then put a number to it before you commit to anything.",
    },
    {
      q: "Who owns the listings and the accounts?",
      a: "You do. Your Business Profiles, your ad accounts, your site. If we ever part ways, you keep everything, including the call history and the review profiles your trucks earned.",
    },
  ],
};
