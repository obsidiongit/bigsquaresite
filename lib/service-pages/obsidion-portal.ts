import { FRANCHISE, HOME_SERVICES } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/obsidion-portal/. The sanctioned richer T2 variant
   (services-index.md: really a product page). Variation picks: hero C
   fragment-led (portal-window), plus the EXHIBIT section (the page's
   centerpiece media moment, 6.12 air rules), band after spine. */

export const OBSIDION_PORTAL_PAGE: ServicePageContent = {
  slug: "obsidion-portal",
  title: "Obsidion Portal: See Every Lead & Every Dollar",
  description:
    "The Obsidion Portal is one login that shows every lead, every call, and every dollar, by location. Check our work any day, not just report day.",
  heroVariant: "fragment-led",
  heroVignette: "portal-window",
  h1: [
    { text: "One login for every lead and " },
    { text: "every dollar", mark: true },
  ],
  answer:
    "The Obsidion Portal is the dashboard every BigSquare client gets. One login shows every lead, every call, and every dollar of ad spend, broken out by location. It is how you check our work any day you want, not just on report day.",
  exhibit: {
    id: "services-obsidion-portal-exhibit",
    alt: "The Obsidion Portal dashboard showing leads, calls, and spend by location",
    note: "THE CENTERPIECE: a wide, clean screenshot or short screen recording of the real portal dashboard.",
  },
  workBand: {
    id: "services-obsidion-portal-band",
    alt: "Reviewing Obsidion Portal results with a client",
    note: "Wide shot: a client and our team walking through the portal together.",
    href: "/results/",
  },
  bandPlacement: "after-spine",
  whoFor: [
    {
      text: "You never know what your agency actually did.",
      sub: "Invoices arrive, reports arrive late, and the numbers never quite connect.",
    },
    {
      text: "You run many locations and see one blurry total.",
      sub: "A brand total hides which markets carry the rest. By-location numbers end the guessing.",
    },
    {
      text: "Your data lives in 6 different tools.",
      sub: "Ads here, calls there, bookings somewhere else. One screen beats 6 logins.",
    },
  ],
  deliverables: [
    {
      text: "Every lead in one place",
      sub: "Calls, forms, and messages, tagged by source and location.",
    },
    {
      text: "Spend next to results",
      sub: "What went in and what came out, side by side.",
    },
    {
      text: "By-location breakdowns",
      sub: "See each market on its own, or the whole brand at once.",
    },
    {
      text: "Call recordings and lead detail",
      sub: "Listen to the calls your ads produced and see what happened next.",
    },
    {
      text: "Access for your whole team",
      sub: "Franchisees see their location. You see everything.",
    },
  ],
  process: [
    {
      title: "Connect",
      body: "We wire in your ad accounts, phone tracking, and forms.",
      checklist: ["Ad accounts", "Call tracking", "Forms and bookings"],
    },
    {
      title: "Organize",
      body: "Every lead gets a source and a location, so the numbers mean something.",
      checklist: ["Location tagging", "Source rules", "Team access"],
    },
    {
      title: "Watch",
      body: "You log in and see what we see, every day.",
      checklist: ["Live dashboards", "Recordings", "Monthly walkthrough"],
    },
  ],
  spine: [
    {
      heading: "Why we built our own portal",
      paragraphs: [
        "Most agency reports are a PDF of good news, sent monthly, built by the people being graded. We did not want to be graded that way. The portal shows the same live numbers we look at, which means when something dips, you see it when we do, and you also see what we did about it.",
        "That transparency is the product. An agency that shows its work every day has to do work worth showing.",
        "There is still a monthly walkthrough, because numbers sometimes need a narrator. But it is a conversation about what to do next, not the first time you see your results. You already saw them.",
      ],
    },
    {
      heading: "Performance you can audit",
      mark: "audit",
      paragraphs: [
        "Every lead in the portal traces back to a source: this campaign, this keyword, this location, this call recording. When we say a channel is working, you can click down to the actual calls and decide for yourself. When something is not working, the same trail shows why we are changing it.",
        "For a multi-location brand, the by-location view is the part that changes meetings. Budget conversations stop being arguments about feelings and start being 5 minutes with the same screen open.",
      ],
    },
    {
      heading: "What franchisees see",
      paragraphs: [
        "Each franchisee or manager can get a login scoped to their own location: their leads, their calls, their numbers. The brand sees the whole board. Everyone argues less, because everyone is looking at the same truth at their own level.",
        "Access is yours to grant and revoke, and the data stays yours. When a location changes hands, access moves with a click and the history stays with the brand.",
      ],
    },
  ],
  faqTitle: "Questions we get about the portal",
  faq: [
    {
      q: "Is the portal an extra product we buy?",
      a: "The portal is part of working with us. It is how we report, so every BigSquare client gets it.",
    },
    {
      q: "Whose data is it?",
      a: "Yours. Your accounts, your numbers, your recordings. You own your accounts, and that does not change by working with us.",
    },
    {
      q: "Can franchisees have their own logins?",
      a: "Yes. Each login can be scoped to one location or a group, while the brand sees everything. You control who sees what.",
    },
    {
      q: "How current are the numbers?",
      a: "The portal is live. Leads, calls, and spend show up as they happen, not in next month's PDF.",
    },
    {
      q: "Does it replace the tools we already use?",
      a: "No. It connects to your ad platforms, phones, and forms, and puts what they know on one screen. Your tools keep doing their jobs.",
    },
  ],
  related: ["seo", "paid-search", "email"],
  industries: [FRANCHISE, HOME_SERVICES],
};
