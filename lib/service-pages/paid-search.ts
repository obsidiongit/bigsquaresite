import { FRANCHISE, LEGAL } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/paid-search/. Variation picks: hero A media-right
   (bid-bars fragment), band after process. "First two weeks" claim
   traces to 12.faq.md's locked answer. */

export const PAID_SEARCH_PAGE: ServicePageContent = {
  slug: "paid-search",
  title: "Paid Search Management",
  description:
    "Paid search management: Google and Microsoft ads that reach buyers the moment they search, tuned every week and tied to cost per lead.",
  heroVariant: "media-right",
  heroVignette: "bid-bars",
  h1: [
    { text: "Paid search", mark: true },
    { text: " without the waste" },
  ],
  answer:
    "Paid search puts your ad at the top of Google the moment someone searches for what you sell. We build the campaigns, write the ads, and guard the budget so junk clicks never eat it. You see your true cost per lead, not one blurry total.",
  heroAsset: {
    id: "services-paid-search-hero",
    alt: "A client ad at the top of a Google search results page",
    note: "Square shot: a search results page with a client ad on top, or campaign structure on screen.",
  },
  workBand: {
    id: "services-paid-search-band",
    alt: "Paid search results reviewed by the BigSquare team",
    note: "Wide shot: a campaign review in progress, or a results screen.",
    href: "/results/",
  },
  whoFor: [
    {
      text: "You need leads this month, not this quarter.",
      sub: "Search ads start producing as soon as they run. No waiting on rankings.",
    },
    {
      text: "Locations fight over one shared budget.",
      sub: "Without location-level campaigns, the loud market eats the quiet one's spend.",
    },
    {
      text: "You tried ads and paid for junk clicks.",
      sub: "Loose match types and missing negative keywords burn budget fast. Structure fixes it.",
    },
  ],
  deliverables: [
    {
      text: "Campaigns built per market",
      sub: "Each location gets its own geography, budget, and keywords.",
    },
    {
      text: "Ads written to sell",
      sub: "Copy that says what you do, where, and why to pick you.",
    },
    {
      text: "Negative keywords guarding spend",
      sub: "The searches you never want to pay for, blocked and kept blocked.",
    },
    {
      text: "Landing pages that convert",
      sub: "Ads pointed at pages built to book the call, not at your homepage.",
    },
    {
      text: "Weekly tuning",
      sub: "Bids, budgets, and search terms reviewed every week, never set and forgotten.",
    },
    {
      text: "Cost per lead by location",
      sub: "In your portal, next to the recorded calls the ads produced.",
    },
  ],
  process: [
    {
      title: "Build",
      body: "Structure first: markets, keywords, and budgets that match your goals.",
      checklist: ["Location campaigns", "Keyword map", "Tracking proven"],
    },
    {
      title: "Launch",
      body: "Ads go live with every click and call tracked from day 1.",
      checklist: ["Ad copy", "Landing pages", "Call recording"],
    },
    {
      title: "Tune",
      body: "We cut waste weekly and feed the winners.",
      checklist: ["Search-term reviews", "Bid changes", "Budget shifts"],
    },
  ],
  spine: [
    {
      heading: "How paid search earns its keep",
      paragraphs: [
        "Paid search catches people at the exact moment of need. Someone types what you sell, your ad is the first thing they see, and the click costs money only when it happens. Done well, it is the most measurable channel there is: every dollar traces to a search, a click, and a call you can listen to.",
        "Done badly, it is the fastest way to burn a budget. The difference is structure and attention: tight keywords, honest ads, pages built to convert, and someone actually reviewing what the money bought every week.",
      ],
    },
    {
      heading: "Budgets that respect each market",
      mark: "each market",
      paragraphs: [
        "One shared campaign for 12 locations always feeds the biggest city and starves the rest. We build per-market campaigns instead, so each location's budget works its own ground and reports its own cost per lead. When a franchisee asks what their money did, the answer is their number, not a brand average.",
        "It also means we can push spend where it works. If one market's cost per lead is half the others', that is a signal to grow it, and the by-location view is what makes the signal visible.",
      ],
    },
    {
      heading: "What we watch every week",
      paragraphs: [
        "Search terms, first: the actual phrases your money bought. The junk gets blocked, the surprises become new keywords. Then bids and budgets against each market's results, and the ads themselves, where a small copy change can move the whole month.",
        "You do not have to watch any of it, but all of it sits in your portal if you want to.",
      ],
    },
  ],
  faqTitle: "Questions we get about paid search",
  faq: [
    {
      q: "How fast will we see leads?",
      a: "Paid ads can produce leads in the first 2 weeks. The first month is also when we learn which terms and markets convert, so results usually improve from there.",
    },
    {
      q: "Google or Microsoft?",
      a: "Google first, almost always. Microsoft ads can add cheap extra reach for some audiences, and we bring them in when the numbers say they will pay.",
    },
    {
      q: "Do we own the ad account?",
      a: "Yes. You do. Always. Your account, your history, your data. If you ever leave, everything stays with you.",
    },
    {
      q: "What budget do we need?",
      a: "Enough to compete in your markets, and that differs by industry and city. The audit shows what you are up against, and we scope the budget from there.",
    },
    {
      q: "Should we do this instead of SEO?",
      a: "They do different jobs. Ads buy leads now, search rankings earn leads over time. Most of our clients run both, and the portal shows each one's cost per lead honestly.",
    },
  ],
  related: ["google-local-services-ads", "paid-social", "seo"],
  industries: [FRANCHISE, LEGAL],
};
