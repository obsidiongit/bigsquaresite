import { FRANCHISE, HOME_SERVICES } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/amazon-ads/. Variation picks: hero A media-right
   (cart-rows fragment), band after process. */

export const AMAZON_ADS_PAGE: ServicePageContent = {
  slug: "amazon-ads",
  title: "Amazon Ads Management",
  description:
    "Amazon ads management for brands that sell products: campaigns built and tuned where people already shop, and tied to profit, not just sales.",
  heroVariant: "media-right",
  heroVignette: "cart-rows",
  h1: [{ text: "Amazon", mark: true }, { text: " ads management" }],
  answer:
    "Amazon ads put your products in front of people who came to buy. We build the campaigns, manage the bids, and defend your listings so shoppers pick you off the shelf. You see what you spent, what you sold, and what was left after fees.",
  heroAsset: {
    id: "services-amazon-ads-hero",
    alt: "Amazon advertising for a product brand",
    note: "Square shot: a product listing with sponsored placement, or the campaign console.",
  },
  workBand: {
    id: "services-amazon-ads-band",
    alt: "Amazon campaign performance being reviewed",
    note: "Wide shot: product photography in progress, or a campaign review.",
    href: "/results/",
  },
  whoFor: [
    {
      text: "People already search Amazon for what you sell.",
      sub: "The demand exists. The question is whose listing takes the sale.",
    },
    {
      text: "Competitors' ads sit on your own product pages.",
      sub: "Amazon sells that space. If you do not defend it, rivals will.",
    },
    {
      text: "Ad spend is up and profit is not.",
      sub: "Sales that lose money after fees are not wins. We tie the ads to margin.",
    },
  ],
  deliverables: [
    {
      text: "Campaigns across every ad type",
      sub: "Sponsored products, brands, and display, each doing its own job.",
    },
    {
      text: "Bids tied to profit",
      sub: "Targets set from your margins, not from spend for its own sake.",
    },
    {
      text: "Listings tuned to convert",
      sub: "Titles, images, and copy that earn the click they paid for.",
    },
    {
      text: "Your brand space defended",
      sub: "Your product pages carry your ads, not your competitors'.",
    },
    {
      text: "A clean monthly picture",
      sub: "Spend, sales, and what was left after fees, in plain numbers.",
    },
  ],
  process: [
    {
      title: "Audit",
      body: "We read your account, margins, and competition before touching a bid.",
      checklist: ["Account structure", "Margin math", "Competitor map"],
    },
    {
      title: "Build",
      body: "Campaigns rebuilt around profit targets and clean structure.",
      checklist: ["Campaign structure", "Bid targets", "Listing fixes"],
    },
    {
      title: "Tune",
      body: "Bids, terms, and seasons managed week by week.",
      checklist: ["Search terms", "Bid moves", "Seasonal plans"],
    },
  ],
  spine: [
    {
      heading: "The shelf people actually shop",
      paragraphs: [
        "Amazon is where buying intent lives. Nobody browses it for fun. The searches are products, the visitors carry payment details, and the winner is whoever holds the shelf space in that moment. Ads are how that space is won, and organic rank follows the products that sell.",
        "That loop rewards brands that manage it and quietly taxes brands that do not. Set-and-forget accounts drift into expensive terms and stale bids while sharper sellers take the top of the page.",
      ],
    },
    {
      heading: "Profit is the scoreboard",
      mark: "Profit",
      paragraphs: [
        "Amazon makes it easy to buy sales that lose money. Fees, ad costs, and returns all bite after the order, so a fat sales number can hide a thin or negative bottom line. We do the margin math first and set bid targets from it, so growth means money kept, not just moved.",
        "The monthly picture we send reads in those terms: what went in, what sold, and what was left. If a product cannot be advertised profitably, we say so and put the budget where it can.",
      ],
    },
    {
      heading: "Where Amazon fits for a multi-location brand",
      paragraphs: [
        "Plenty of multi-location brands have a product side: branded gear, consumables customers rebuy, product lines behind the service. Amazon gives that side national reach with none of the local footprint, and the revenue compounds alongside the location business.",
        "It runs in the same portal as everything else, so the product channel and the location channels get compared honestly.",
        "And if Amazon is your whole business, we act as the media arm inside your team: the same weekly tuning, the same profit math, the same plain reporting. If it is a side channel, we size the effort to what it earns.",
      ],
    },
  ],
  faqTitle: "Questions we get about Amazon ads",
  faq: [
    {
      q: "We sell services, not products. Is this for us?",
      a: "Only if some part of your business sells a product. If nothing ships in a box, skip this page, and we will tell you the same on a call.",
    },
    {
      q: "Do you manage the whole seller account?",
      a: "We manage the ads and tune the listings they land on. Inventory, pricing, and fulfillment stay with your team, and we coordinate where they meet.",
    },
    {
      q: "How do fees figure into the reporting?",
      a: "They are in the math from day 1. We report what was left after Amazon's cut, not just the sales line.",
    },
    {
      q: "Can this work alongside our own online store?",
      a: "Yes. Amazon reaches shoppers your store never sees, and plenty of brands run both. We watch that the channels feed you instead of fighting each other.",
    },
  ],
  related: ["paid-search", "creator-network", "video-production"],
  industries: [FRANCHISE, HOME_SERVICES],
};
