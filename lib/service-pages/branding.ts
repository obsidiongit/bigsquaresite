import { FRANCHISE, HOME_SERVICES } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/branding/. Variation picks: hero A media-right
   (type-specimen fragment), band after process. */

export const BRANDING_PAGE: ServicePageContent = {
  slug: "branding",
  title: "Branding & Brand Positioning",
  description:
    "Branding and positioning that make you the obvious choice in every market: one look, one voice, carried well by every location.",
  heroVariant: "media-right",
  heroVignette: "type-specimen",
  h1: [
    { text: "Branding", mark: true },
    { text: " and brand positioning" },
  ],
  answer:
    "Branding is the look, the voice, and the promise that make people pick you before they compare prices. We build it, write it down, and make it easy for every location to carry. One brand, recognized in every market you enter.",
  heroAsset: {
    id: "services-branding-hero",
    alt: "A brand identity system for a multi-location company",
    note: "Square shot: brand elements arranged together, mark, type, and color.",
  },
  workBand: {
    id: "services-branding-band",
    alt: "A brand identity applied across real touchpoints",
    note: "Wide shot: the brand applied on vehicles, signage, or uniforms.",
    href: "/results/",
  },
  whoFor: [
    {
      text: "You look like everyone else in your industry.",
      sub: "Same stock photos, same lines, same blue shield logo. Buyers cannot tell you apart.",
    },
    {
      text: "Every location presents differently.",
      sub: "Old logo on one van, new colors on another. Trust leaks at every mismatch.",
    },
    {
      text: "You are growing into new markets.",
      sub: "New cities meet you cold. A sharp brand shortens the introduction.",
    },
  ],
  deliverables: [
    {
      text: "Positioning you can defend",
      sub: "What you stand for, who you serve, and why you, in plain words.",
    },
    {
      text: "A visual identity that carries",
      sub: "Logo, color, and type that work on a van, a sign, and a screen.",
    },
    {
      text: "A voice everyone can write in",
      sub: "Rules and examples that keep 50 locations sounding like one company.",
    },
    {
      text: "Brand rules made usable",
      sub: "A short guide your team actually opens, not a 90-page PDF.",
    },
    {
      text: "Rollout support",
      sub: "The templates and files every location needs to show up right.",
    },
  ],
  process: [
    {
      title: "Dig",
      body: "We learn the business before we touch the look.",
      checklist: ["Team interviews", "Customer views", "Competitor scan"],
    },
    {
      title: "Define",
      body: "Positioning, identity, and voice, decided together.",
      checklist: ["Positioning", "Identity system", "Voice rules"],
    },
    {
      title: "Deliver",
      body: "The guide, the files, and the rollout every location can follow.",
      checklist: ["Brand guide", "Templates", "Rollout plan"],
    },
  ],
  spine: [
    {
      heading: "Positioning before polish",
      paragraphs: [
        "A new logo on a fuzzy promise is a paint job. Positioning comes first: who you serve, what you actually do better, and why a stranger should care. Once that is said in plain words, design has something true to express, and the brand stops being decoration and starts being an argument.",
        "The test we hold ourselves to: could a buyer read your positioning line and know why to call you instead of the next result? If not, we keep digging.",
        "Sharp positioning also makes every later channel cheaper. Ads convert better when the promise is clear, and content writes itself faster when the brand knows what it thinks.",
      ],
    },
    {
      heading: "Consistency is what buyers feel",
      mark: "Consistency",
      paragraphs: [
        "Nobody consciously notices matching vans, signs, and invoices. They just feel that a company has its act together, and they extend that feeling to the work. For a multi-location brand, that feeling is fragile: every location that drifts off-brand spends a little of everyone's trust.",
        "That is why we deliver systems, not just designs. Rules simple enough to follow, templates that make the right thing the easy thing, and files organized so location 30 launches looking like location 1.",
      ],
    },
    {
      heading: "A brand your locations can actually use",
      paragraphs: [
        "Brand guides fail when they are written for designers instead of the people running locations. Ours are short, visual, and practical: what the sign looks like, how the phone gets answered, which words we use and which we do not. A manager should find any answer in a minute.",
        "When the guide is usable, enforcement mostly stops being needed. People follow rules that make their job easier.",
      ],
    },
  ],
  faqTitle: "Questions we get about branding",
  faq: [
    {
      q: "Do we need a full rebrand?",
      a: "Often no. If your name and mark carry real equity, we tighten and systemize what works instead of erasing it. The dig phase tells us which path you are on, and we tell you straight.",
    },
    {
      q: "What do we actually get at the end?",
      a: "Positioning in plain words, the visual identity files, the voice rules, a short usable brand guide, and the templates your locations need day to day.",
    },
    {
      q: "Will this disrupt our locations mid-stream?",
      a: "No. The rollout is planned in waves, with signage, vehicles, and materials switched on a schedule that fits budgets. Nobody closes for a rebrand.",
    },
    {
      q: "Can you just refresh the logo?",
      a: "We can, but a logo lives inside a system, so we at least check the whole picture first. A crisp mark on top of muddy positioning does not move buyers.",
    },
  ],
  related: ["web-design", "video-production", "social-media"],
  industries: [FRANCHISE, HOME_SERVICES],
};
