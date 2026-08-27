import { FRANCHISE, HEALTHCARE } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/custom-development/. Variation picks: hero C fragment-led
   (code-lines), band after process. */

export const CUSTOM_DEVELOPMENT_PAGE: ServicePageContent = {
  slug: "custom-development",
  title: "Custom Development",
  description:
    "Custom development for how your business actually runs: tools, portals, and integrations that connect your systems and save your team hours.",
  heroVariant: "fragment-led",
  heroVignette: "code-lines",
  h1: [{ text: "Custom", mark: true }, { text: " development" }],
  answer:
    "Custom development is building the tools your business needs that off the shelf does not cover. Portals, calculators, booking flows, and the connections between systems that should already talk to each other. Built for how your company actually runs.",
  workBand: {
    id: "services-custom-development-band",
    alt: "A custom tool built for a client's workflow",
    note: "Wide shot: a custom portal or internal tool on screen.",
    href: "/results/",
  },
  whoFor: [
    {
      text: "Your team re-types the same data in 3 systems.",
      sub: "Software should hand work to software. Those lost hours multiply across locations.",
    },
    {
      text: "Off-the-shelf tools almost fit.",
      sub: "Almost is expensive. A small custom piece often closes the gap for good.",
    },
    {
      text: "You have an idea your industry does not have.",
      sub: "A booking flow, a quoting tool, a customer portal. We can build it.",
    },
  ],
  deliverables: [
    {
      text: "Tools built to your workflow",
      sub: "Software shaped around how your team already works, not the other way around.",
    },
    {
      text: "Systems that talk to each other",
      sub: "Booking, billing, and marketing data flowing without re-typing.",
    },
    {
      text: "Customer-facing pieces",
      sub: "Portals, calculators, and flows your customers actually enjoy using.",
    },
    {
      text: "A clean handoff",
      sub: "Documentation and training, so your team owns what we built.",
    },
    {
      text: "Support after launch",
      sub: "Fixes and improvements without spinning up a new project every time.",
    },
  ],
  process: [
    {
      title: "Scope",
      body: "We map the workflow and define the smallest version worth shipping.",
      checklist: ["Workflow map", "First version", "Plain-words plan"],
    },
    {
      title: "Build",
      body: "Short cycles, working software you can click every week.",
      checklist: ["Weekly progress", "Your feedback", "Real data early"],
    },
    {
      title: "Ship",
      body: "Launch, handoff, and support that keeps it improving.",
      checklist: ["Launch and training", "Documentation", "Ongoing support"],
    },
  ],
  spine: [
    {
      heading: "Software shaped to the business",
      paragraphs: [
        "Most companies bend their process around whatever their software insists on. It works, but it costs hours everywhere, forever. Custom development turns that around: the software learns your process. The quoting math you actually use, the approval steps you actually follow, the report your Monday meeting actually needs.",
        "The trick is restraint. We build the smallest version that removes real pain, ship it, and grow it from there. Big-bang builds are where budgets go to die.",
        "That small first version also protects you from us. You find out fast whether the tool earns its keep, with the smallest possible check written.",
      ],
    },
    {
      heading: "Integrations end the re-typing",
      mark: "re-typing",
      paragraphs: [
        "The quiet waste in a multi-location business is the same fact entered 3 times: once in the booking system, once in billing, once in a spreadsheet nobody trusts. Each entry is minutes, and minutes times locations times every workday is a real salary spent on typing.",
        "Connecting the systems removes it. Data lands once at the source and flows everywhere it belongs, and your reports finally agree with each other because they come from one truth.",
        "The first integration usually reveals the next 2 worth doing. We keep that list with you and take them in order of hours saved.",
      ],
    },
    {
      heading: "Built, shipped, and supported",
      paragraphs: [
        "Custom software has a bad reputation because so much of it launches once and rots. We hand off clean: documentation your team can read, training that sticks, and code built with proven tools rather than clever ones. Then we stay available for the small fixes and next steps.",
        "This is the same team behind our own Obsidion Portal, which is to say: we ship software we then have to live with. It shows in how we build.",
        "And when a project should not be built at all, we say that too. Sometimes a spreadsheet is the right tool, and we would rather tell you than bill you.",
      ],
    },
  ],
  faqTitle: "Questions we get about custom development",
  faq: [
    {
      q: "What do you build with?",
      a: "Proven, widely used tools chosen per project, so any competent developer could maintain what we ship. No exotic choices you would be stuck with.",
    },
    {
      q: "Do we own the code?",
      a: "Yes. You do. Always. Code, accounts, and documentation are yours, and the handoff makes sure your team can actually run it.",
    },
    {
      q: "How does a project start?",
      a: "With a scoped first version: the smallest build that removes real pain. You see the plan and cost in plain words before anything starts, and working software within weeks, not months.",
    },
    {
      q: "Can you fix or extend a tool we already have?",
      a: "Usually, yes. If the foundation is sound we build on it, and if it is not, we say so before you spend more on it.",
    },
  ],
  related: ["web-design", "obsidion-portal", "email"],
  industries: [FRANCHISE, HEALTHCARE],
};
