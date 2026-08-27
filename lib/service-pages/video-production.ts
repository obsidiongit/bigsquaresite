import { FRANCHISE, LEGAL } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/video-production/. Variation picks: hero B statement-wide
   (the reel leads), band after spine. Denver/Tampa + "across the
   country" trace to 12.faq.md's locked answer. */

export const VIDEO_PRODUCTION_PAGE: ServicePageContent = {
  slug: "video-production",
  title: "Video Production & Commercials",
  description:
    "Commercials, ads, and brand films shot and edited in house. One planned shoot becomes a year of content for every location and channel.",
  heroVariant: "statement-wide",
  h1: [
    { text: "Video", mark: true },
    { text: " production and commercials" },
  ],
  answer:
    "We shoot and edit commercials, ads, and brand films in house. One well-planned shoot becomes a year of content: the brand film, the cutdowns, the vertical clips, the ads. Made once, sized for every channel and every location.",
  heroAsset: {
    id: "services-video-production-hero",
    alt: "A commercial shoot for a multi-location brand",
    note: "Wide shot: a shoot in progress, camera and lights at a real client location.",
  },
  workBand: {
    id: "services-video-production-band",
    alt: "Behind the scenes of a BigSquare brand film shoot",
    note: "Wide shot: a behind-the-scenes still from a real shoot.",
    href: "/results/",
  },
  bandPlacement: "after-spine",
  whoFor: [
    {
      text: "Your ads need footage that does not exist.",
      sub: "Stock clips sell nobody. Real crews, real customers, and real locations do.",
    },
    {
      text: "You are buying videos one at a time.",
      sub: "One-off videos cost more and match less. Plan the year, shoot it in days.",
    },
    {
      text: "TV, feeds, and your site all need different cuts.",
      sub: "One story, many shapes. We shoot with every size in mind.",
    },
  ],
  deliverables: [
    {
      text: "A film plan before a camera moves",
      sub: "Scripts, shot lists, and the full list of cuts we will deliver.",
    },
    {
      text: "Shoot days that earn their cost",
      sub: "Crew, gear, and direction planned to capture a year in days.",
    },
    {
      text: "The brand film and the cutdowns",
      sub: "The full story plus the 30-second, 15-second, and vertical versions.",
    },
    {
      text: "Ads built for the feed",
      sub: "Hooks up front, captions on, sized for each platform.",
    },
    {
      text: "A footage library you own",
      sub: "Everything we shoot stays yours, ready for next year's edits.",
    },
  ],
  process: [
    {
      title: "Plan",
      body: "The story, the shots, and every deliverable agreed before shoot day.",
      checklist: ["Scripts", "Shot lists", "Deliverables list"],
    },
    {
      title: "Shoot",
      body: "Real locations, real people, directed to feel like neither is acting.",
      checklist: ["Crew and gear", "Locations and talent", "Extra coverage"],
    },
    {
      title: "Cut",
      body: "Every version edited, captioned, and delivered ready to run.",
      checklist: ["Brand film", "Cutdowns and verticals", "Ad versions"],
    },
  ],
  spine: [
    {
      heading: "One shoot, a year of content",
      mark: "a year",
      paragraphs: [
        "The expensive part of video is the day the cameras roll. The waste is rolling them for one video. We plan shoots to feed everything downstream: the brand film for the site, the TV and streaming cuts, the vertical clips for feeds, and the raw library your future edits will pull from.",
        "Planned that way, the cost per finished piece drops fast, and every channel you run stays fed between shoots.",
        "Your calendar drives the plan. Seasonal pushes, opening dates, and campaign launches all get their shots captured on the same shoot days, so nothing needs a rush order in month 8.",
      ],
    },
    {
      heading: "Real beats stock",
      paragraphs: [
        "Buyers can smell stock footage, and what it tells them is that you could not be bothered to show the real thing. Your actual crews, your actual locations, your actual customers carry a credibility no library clip can fake, and for a multi-location brand they double as proof of scale: many doors, one standard.",
        "We direct real people lightly, so they stay themselves on camera. That is the difference between a testimonial and a hostage video.",
        "Keeping production in house matters too. The people who plan your shoot also cut your ads, so nothing gets lost in a handoff and a change is a conversation, not a change order.",
      ],
    },
    {
      heading: "Where the videos go to work",
      paragraphs: [
        "A film that lives on your homepage works once. The same story cut for search ads, social ads, and your locations' pages works everywhere at the same time. We deliver with the destinations already decided, and the ad cuts go straight into the campaigns our media team runs.",
        "We shoot from our Denver and Tampa bases and film across the country wherever your locations are. And when a cut stops pulling, we reshuffle new versions from the library instead of booking a new shoot.",
      ],
    },
  ],
  faqTitle: "Questions we get about video production",
  faq: [
    {
      q: "Do you travel to our locations?",
      a: "Yes. We are based in Denver and Tampa and shoot across the country. Multi-location shoots get planned as a route so travel cost stays sane.",
    },
    {
      q: "What does a shoot cost?",
      a: "It depends on days, crew, and deliverables, so we scope it with you up front. You see the full plan and the full list of what you get before anything is booked.",
    },
    {
      q: "Do we own the footage?",
      a: "Yes. The finished pieces and the raw library are yours to keep and reuse.",
    },
    {
      q: "Can you work with footage we already have?",
      a: "Yes. Edit-only projects are common: we cut new ads and clips from your existing library and fill gaps on a small pickup shoot if needed.",
    },
  ],
  related: ["creator-network", "paid-social", "branding"],
  industries: [FRANCHISE, LEGAL],
};
