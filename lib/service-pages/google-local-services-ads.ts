import { HOME_SERVICES, LEGAL } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/google-local-services-ads/. Variation picks: hero C
   fragment-led (lead-calls), band after process. */

export const GLSA_PAGE: ServicePageContent = {
  slug: "google-local-services-ads",
  title: "Google Local Services Ads Management",
  description:
    "Google Local Services Ads management: the Google Guaranteed spots at the top of local search, where you pay per lead instead of per click.",
  heroVariant: "fragment-led",
  heroVignette: "lead-calls",
  h1: [
    { text: "Google " },
    { text: "Local", mark: true },
    { text: " Services Ads" },
  ],
  answer:
    "Local Services Ads are the Google Guaranteed spots above everything else in local search. You pay per lead, not per click, and the green badge tells buyers Google checked you out. We get every location verified, run the ads, and dispute the junk leads so you never pay for them.",
  workBand: {
    id: "services-google-local-services-ads-band",
    alt: "Google Local Services Ads producing recorded calls for a home services brand",
    note: "Wide shot: the Google Guaranteed badge in live results, or a call log review.",
    href: "/results/",
  },
  whoFor: [
    {
      text: "You want the very top of local search.",
      sub: "These spots sit above the regular ads and the map. In many trades they get the first call.",
    },
    {
      text: "You would rather pay for leads than clicks.",
      sub: "No charge for lookers. You pay when a real customer calls or messages.",
    },
    {
      text: "Verification paperwork is stalling you.",
      sub: "Licenses, insurance, and background checks, per location. We push it all through.",
    },
  ],
  deliverables: [
    {
      text: "Verification for every location",
      sub: "The badge earned market by market, with the paperwork handled.",
    },
    {
      text: "Profiles built to win the call",
      sub: "Services, hours, photos, and reviews arranged to convert.",
    },
    {
      text: "Junk leads disputed",
      sub: "Wrong number, wrong service, spam: we flag them so you do not pay.",
    },
    {
      text: "A review flow that feeds ranking",
      sub: "These ads rank partly on reviews, so we keep them coming in.",
    },
    {
      text: "Cost per lead by location",
      sub: "Tracked in your portal next to your other channels.",
    },
  ],
  process: [
    {
      title: "Verify",
      body: "We collect what Google needs and get each location approved.",
      checklist: ["Licenses and insurance", "Background checks", "Profile setup"],
    },
    {
      title: "Launch",
      body: "Budgets and targeting set per market, with every call recorded.",
      checklist: ["Service areas", "Budget by location", "Call tracking"],
    },
    {
      title: "Defend",
      body: "We dispute junk leads, keep reviews flowing, and check in weekly.",
      checklist: ["Lead disputes", "Review pace", "Weekly checks"],
    },
  ],
  spine: [
    {
      heading: "What makes these ads different",
      paragraphs: [
        "Regular search ads sell clicks. Local Services Ads sell leads: you are charged when a customer actually calls or messages through the ad, not when someone wanders onto your site. The listings also carry the Google Guaranteed badge, which tells nervous buyers that Google verified your license and insurance and backs the work.",
        "The catch is that the program has rules, paperwork, and its own ranking logic. Getting in is a process, and doing well inside it is a habit.",
      ],
    },
    {
      heading: "Reviews decide who wins",
      mark: "Reviews",
      paragraphs: [
        "Inside Local Services Ads, your review count and rating are a huge part of who shows first and who gets the call. Answering fast matters too: Google watches how quickly you pick up and marks the slow responders down. So the work is not just running the ads. It is keeping the reviews coming and the phones answered.",
        "We build the review ask into your normal job flow and watch response rates by location, because 1 slow market can drag its own results down while the others thrive.",
      ],
    },
    {
      heading: "The multi-location paperwork problem",
      paragraphs: [
        "Every location needs its own verification: licenses, insurance, background checks, and a profile. For a brand with 15 locations, that is 15 rounds of paperwork with Google, and any lapse can pause a market's ads. We carry that load, keep renewals ahead of deadlines, and get new locations verified before they open.",
        "It is boring work. It is also why our clients' badges stay green while competitors lapse.",
      ],
    },
  ],
  faqTitle: "Questions we get about Local Services Ads",
  faq: [
    {
      q: "What does Google Guaranteed actually mean?",
      a: "Google verified the business's license and insurance, and backs qualifying work with a customer guarantee. Buyers see the green badge and trust the listing more.",
    },
    {
      q: "Which businesses can use these ads?",
      a: "Google supports a growing list of trades and professional services: home services, legal, real estate, and more. We check your categories and markets in the audit.",
    },
    {
      q: "Do we really not pay per click?",
      a: "Right. You pay when a lead calls or messages through the ad. And when a lead is junk, wrong service, or spam, we dispute it so you are not charged.",
    },
    {
      q: "Can this run alongside our other ads?",
      a: "Yes, and it should. These spots, regular search ads, and your rankings each catch different buyers. The portal shows each channel's cost per lead so nothing hides.",
    },
    {
      q: "Why do we need help with it?",
      a: "The setup paperwork multiplies per location, junk leads need disputing every week, and reviews plus response speed decide your rank. Unmanaged accounts drift down and pay for bad leads.",
    },
  ],
  related: ["paid-search", "seo", "obsidion-portal"],
  industries: [HOME_SERVICES, LEGAL],
};
