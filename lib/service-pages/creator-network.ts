import { FRANCHISE, HEALTHCARE } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/creator-network/. Variation picks: hero B statement-wide,
   band after spine. Never the word "UGC" (services-index.md). */

export const CREATOR_NETWORK_PAGE: ServicePageContent = {
  slug: "creator-network",
  title: "Creator Network: Content That Sells",
  description:
    "Real people making real content about your brand, run as ads that convert. Creators matched to your markets, and the content is yours to keep.",
  heroVariant: "statement-wide",
  h1: [
    { text: "Creator content that " },
    { text: "sells", mark: true },
  ],
  answer:
    "The Creator Network is real people making real content about your brand, which we then run as ads. A customer talking beats a logo talking. We match creators to your markets, brief them, and turn the best clips into the ads that fill your calendar.",
  heroAsset: {
    id: "services-creator-network-hero",
    alt: "A creator filming content for a multi-location brand",
    note: "Wide shot: a creator filming with a client product or at a client location.",
  },
  workBand: {
    id: "services-creator-network-band",
    alt: "Creator clips running as converting ads",
    note: "Wide shot: a creator clip mid-edit, or a wall of clip thumbnails.",
    href: "/results/",
  },
  bandPlacement: "after-spine",
  whoFor: [
    {
      text: "Your ads look like ads.",
      sub: "Feeds skip polish. A real person's phone video gets watched and believed.",
    },
    {
      text: "You need content for many markets.",
      sub: "Creators in each city show your locations the way locals actually see them.",
    },
    {
      text: "Your best fans already post about you.",
      sub: "We find them, brief them, and put budget behind the ones that convert.",
    },
  ],
  deliverables: [
    {
      text: "Creators matched to your brand",
      sub: "Vetted, briefed, and cleared to talk about you.",
    },
    {
      text: "Content made to convert",
      sub: "Real takes with strong hooks and a clear ask, cut for the feed.",
    },
    {
      text: "Full usage rights",
      sub: "The clips are yours to run, reuse, and keep.",
    },
    {
      text: "The best clips run as ads",
      sub: "Organic posts are the tryout. Ads are where a clip earns.",
    },
    {
      text: "Performance by clip",
      sub: "Which creators and angles actually sell, tracked in your portal.",
    },
  ],
  process: [
    {
      title: "Match",
      body: "We find creators who fit your brand and your markets.",
      checklist: ["Vetting", "Market fit", "Rights agreements"],
    },
    {
      title: "Brief",
      body: "Creators get the story, the honest limits, and room to be themselves.",
      checklist: ["What to show", "What to say", "What to skip"],
    },
    {
      title: "Run",
      body: "The clips that prove themselves become the ads that scale.",
      checklist: ["Clip testing", "Ad budgets", "Winners report"],
    },
  ],
  spine: [
    {
      heading: "Why real people outsell polished ads",
      paragraphs: [
        "People trust people. A clip of someone showing what they bought, filmed on their phone, gets watched to the end while a produced commercial gets skipped in a second. It does not feel like an ad, so it earns the attention an ad never gets, and then it does the ad's job anyway.",
        "The platforms know it too. Feeds are built for this kind of content, so it costs less to show and travels further when it lands.",
      ],
    },
    {
      heading: "Local faces, local trust",
      mark: "trust",
      paragraphs: [
        "For a brand with many locations, the network is the trick. A creator in each market shows the location their neighbors actually visit, in the accent and light of that city. That is proof no national campaign can fake, and it stacks: every market gets its own believable voice under one brand story.",
        "When a clip from one market converts, we test its angle everywhere else with local creators. The idea travels, the face stays local.",
      ],
    },
    {
      heading: "From one good clip to a campaign",
      paragraphs: [
        "Most creator content dies as a nice post. Ours auditions. Every clip gets tested with real budget, the winners scale into full campaigns, and the losers teach us what to brief next. Over a few months you build a library of proven ads and a bench of creators who know your brand.",
        "And because the rights are cleared up front, the library is yours, whatever comes next.",
      ],
    },
  ],
  faqTitle: "Questions we get about the Creator Network",
  faq: [
    {
      q: "Is this influencer marketing?",
      a: "Close, but the goal is different. We care what a clip sells, not how famous its maker is. Small local creators with real trust usually beat big names on cost per lead.",
    },
    {
      q: "Who owns the content?",
      a: "You do. Usage rights are cleared before filming, so every clip is yours to run, reuse, and keep.",
    },
    {
      q: "Do creators say whatever they want?",
      a: "They get a brief: the story, the honest limits, and the ask. Inside that, their own words. Scripted praise reads fake and converts worse, so we do not do it.",
    },
    {
      q: "We already have customers posting about us. Can you use that?",
      a: "Yes, happily. We reach out, clear the rights, and fold the best of it into the testing pipeline alongside the network's clips.",
    },
    {
      q: "Which platforms does this run on?",
      a: "TikTok, Instagram, and YouTube mostly, as both organic posts and paid ads. The clips also work on your site and in your email.",
    },
  ],
  related: ["paid-social", "video-production", "social-media"],
  industries: [FRANCHISE, HEALTHCARE],
};
