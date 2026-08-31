import { FRANCHISE, HOME_SERVICES } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/social-media/. Variation picks: hero A media-right
   (review-stars fragment), band after process. */

export const SOCIAL_MEDIA_PAGE: ServicePageContent = {
  slug: "social-media",
  title: "Social Media Management",
  description:
    "Social media management done for you. Posts planned, made, and shipped in your brand voice, with comments and messages answered the same day.",
  heroVariant: "media-right",
  heroVignette: "review-stars",
  h1: [
    { text: "Social media that says " },
    { text: "someone is home", mark: true },
  ],
  answer:
    "We plan, make, and post your social content. One calendar, one voice, real photos over stock. Your brand looks alive and trusted, and your team never has to think about what to post.",
  heroAsset: {
    id: "services-social-media-hero",
    alt: "A social media content calendar managed by BigSquare",
    note: "Square shot: a phone with a client feed open, or a content calendar wall.",
  },
  workBand: {
    id: "services-social-media-band",
    alt: "Social content produced by BigSquare",
    note: "Wide shot: content being made, a set, or a grid of client posts.",
    href: "/results/",
  },
  whoFor: [
    {
      text: "Your locations post rarely, or never.",
      sub: "An empty feed reads like a closed store. Buyers check social before they call.",
    },
    {
      text: "Every location sounds like a different company.",
      sub: "One franchisee posts memes, another posts nothing. The brand pays for both.",
    },
    {
      text: "Your managers have no time for content.",
      sub: "They run the business. Posting is a second job nobody hired them for.",
    },
  ],
  deliverables: [
    {
      text: "A content calendar per location",
      sub: "Planned a month ahead, local where it matters, on brand everywhere.",
    },
    {
      text: "Posts made for you",
      sub: "Written, designed, and scheduled. Photos and video cut for each platform.",
    },
    {
      text: "One voice across every market",
      sub: "Brand rules every post follows, so 50 pages read as one company.",
    },
    {
      text: "Comments and messages watched",
      sub: "Questions get answers and leads get passed along, not left on read.",
    },
    {
      text: "A report by location",
      sub: "What went out, what grew, and which locations need attention.",
    },
  ],
  process: [
    {
      title: "Plan",
      body: "One calendar covers the brand and leaves room for local moments.",
      checklist: ["Brand themes", "Local slots", "Platform mix"],
    },
    {
      title: "Make",
      body: "We produce the posts and route them through your approval once a month.",
      checklist: ["Copy and design", "Video cuts", "Approval flow"],
    },
    {
      title: "Ship",
      body: "Posts go out on schedule and the numbers come back to one report.",
      checklist: ["Scheduled publishing", "Inbox coverage", "Report by location"],
    },
  ],
  spine: [
    {
      heading: "Social is your storefront window",
      paragraphs: [
        "Before a customer calls a location, they look at it online. The feed is part of that look. A page with recent posts, real photos, and answered comments says someone is home and proud of the place. A page last updated 8 months ago says the opposite, even if the store is thriving.",
        "This matters more for a brand with many locations, because buyers judge the location in front of them, not your best one. Every feed is making an impression in its own market, good or bad, right now.",
      ],
    },
    {
      heading: "One engine, many feeds",
      mark: "many feeds",
      paragraphs: [
        "The trap for multi-location brands is choosing between corporate sameness and local chaos. The fix is one content engine with local slots. The brand sets the voice, the themes, and the quality bar. Each location gets moments that are actually theirs: the team, the town, the season, the win.",
        "Managers can send photos from the field, and the good ones make the calendar. But nobody at a location is required to create anything. That is the whole point.",
      ],
    },
    {
      heading: "What you will see",
      paragraphs: [
        "A steady cadence on every feed, set together and kept. Comments and messages answered instead of aging. And a monthly report that shows every location's activity and growth side by side, so a quiet market gets noticed and helped instead of forgotten.",
        "Followers are nice. We care more that the feeds make people comfortable calling.",
      ],
    },
  ],
  faqTitle: "Questions we get about social media",
  faq: [
    {
      q: "Which platforms do you run?",
      a: "The ones your buyers use. For most local brands that is Facebook and Instagram first, then TikTok, LinkedIn, and YouTube where they fit. We pick by audience, not by package.",
    },
    {
      q: "Do you make the content or do we?",
      a: "We do. Managers can send photos and moments from the field, and the best ones make the calendar, but nobody at a location has to create anything.",
    },
    {
      q: "Can each franchisee have their own page?",
      a: "Yes. We can run one brand page, per-location pages, or both. Location pages get local content in the same brand voice.",
    },
    {
      q: "Who approves the posts?",
      a: "You do, in a simple monthly review. Most clients end up approving themes instead of every single post once trust builds.",
    },
    {
      q: "What about angry comments and bad reviews?",
      a: "We watch the inboxes and comments, answer the easy ones, and flag the hard ones to your team the same day. Nothing sits unanswered over a weekend.",
    },
  ],
  related: ["creator-network", "paid-social", "branding"],
  industries: [FRANCHISE, HOME_SERVICES],
};
