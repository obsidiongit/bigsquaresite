import { HEALTHCARE, LEGAL } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/web-design/. Variation picks: hero B statement-wide
   (a visual service leads with the work), band after spine. */

export const WEB_DESIGN_PAGE: ServicePageContent = {
  slug: "web-design",
  title: "Web Design for Multi-Location Brands",
  description:
    "Fast, clean websites for multi-location brands, built to turn visitors into booked calls and to rank in every city you serve.",
  heroVariant: "statement-wide",
  h1: [
    { text: "Web design", mark: true },
    { text: " for multi-location brands" },
  ],
  answer:
    "We design and build fast, clean websites that turn visitors into booked calls. For a multi-location brand that means a page for every location, one brand across all of them, and a site your team can update without calling a developer.",
  heroAsset: {
    id: "services-web-design-hero",
    alt: "A website designed and built for a multi-location brand",
    note: "Wide shot: a finished client site on desktop and phone together.",
  },
  workBand: {
    id: "services-web-design-band",
    alt: "Website design work in progress at BigSquare",
    note: "Wide shot: design files open, or a before-and-after of a client site.",
    href: "/results/",
  },
  bandPlacement: "after-spine",
  whoFor: [
    {
      text: "Your site looks fine and books nothing.",
      sub: "Pretty is not the job. The job is the call, the form, and the booking.",
    },
    {
      text: "Every location needs its own page.",
      sub: "One contact page cannot rank in 12 cities or route 12 phone numbers.",
    },
    {
      text: "Your site is slow, and Google noticed.",
      sub: "Slow pages lose visitors and rankings at the same time.",
    },
  ],
  deliverables: [
    {
      text: "A design that sells, not just shows",
      sub: "Every page built around the next step a visitor should take.",
    },
    {
      text: "A page for every location",
      sub: "Local proof and local details, in one brand voice.",
    },
    {
      text: "Speed you can measure",
      sub: "Fast on real phones, not just in a demo.",
    },
    {
      text: "Easy updates for your team",
      sub: "Change hours, photos, and offers without a developer.",
    },
    {
      text: "Search-ready from day 1",
      sub: "Clean structure, correct tags, and tracking wired before launch.",
    },
  ],
  process: [
    {
      title: "Plan",
      body: "Pages, journeys, and per-location needs mapped before design starts.",
      checklist: ["Page map", "Visitor journeys", "Location needs"],
    },
    {
      title: "Build",
      body: "Design and development together, with your content moved in.",
      checklist: ["Design system", "Build and content", "Your review"],
    },
    {
      title: "Launch",
      body: "Redirects protected, tracking live, and improvements after launch.",
      checklist: ["Redirect map", "Tracking checks", "Post-launch fixes"],
    },
  ],
  spine: [
    {
      heading: "A website is a salesperson",
      paragraphs: [
        "Your site talks to more buyers in a day than your best employee does in a month, and it works every hour you are closed. So we grade it like a salesperson: not on looks, but on conversations started. Design decisions follow that grade, from what the visitor sees first to how few taps it takes to book.",
        "Beauty still matters, because buyers judge competence by polish. But on every page, beauty reports to the booking.",
      ],
    },
    {
      heading: "Built for many locations from the start",
      mark: "from the start",
      paragraphs: [
        "A multi-location site has jobs a single-location site never faces: a page per location that can rank in its own city, phone routing per market, hours and details that differ, and a structure that welcomes location 30 without a redesign. Bolting that on later is expensive. We build it in from the first sketch.",
        "The payoff shows up twice: locations rank locally, and opening a new market becomes filling in a template instead of commissioning a project.",
      ],
    },
    {
      heading: "Fast, and staying fast",
      paragraphs: [
        "Speed is a feature buyers feel and Google measures. We build fast pages, then guard the speed: images sized properly, junk scripts kept out, and performance checked on real phones after every change, not just on launch day.",
        "Your team gets an editor that will not let everyday updates break the design or the speed. That is what keeps year 2 looking like launch week.",
        "Before launch we test the site the way visitors actually use it: on a phone, on cell service, mid-scroll. If it feels slow anywhere, it is not done.",
      ],
    },
  ],
  faqTitle: "Questions we get about web design",
  faq: [
    {
      q: "How long does a site take?",
      a: "It depends on size. A focused site moves in weeks, a large multi-location build takes longer. You see the plan with dates before we start, and you see progress weekly.",
    },
    {
      q: "Do we own the site?",
      a: "Yes. You do. Always. Domain, design, code, and content. If you ever leave, it all stays with you.",
    },
    {
      q: "Will a redesign hurt our rankings?",
      a: "Done carelessly, it can. We map every old page to its new home with redirects and keep the structure search engines already trust, so rankings carry over instead of resetting.",
    },
    {
      q: "Can you improve our current site instead of rebuilding?",
      a: "Often, yes. If the bones are good we fix speed, pages, and conversion where they stand, and we will tell you honestly which path is cheaper.",
    },
    {
      q: "Who writes the words?",
      a: "We do, with your review. Design and copy are built together, because a beautiful page with weak words still loses the call.",
    },
  ],
  related: ["seo", "custom-development", "branding"],
  industries: [LEGAL, HEALTHCARE],
};
