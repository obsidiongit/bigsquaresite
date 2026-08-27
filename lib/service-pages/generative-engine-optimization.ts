import { FRANCHISE, HEALTHCARE } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/generative-engine-optimization/. Variation picks: hero C
   fragment-led (chat-answer), band after spine. "AI" appears under the
   copy-rules exception: AI tools are the subject of this page. */

export const GEO_PAGE: ServicePageContent = {
  slug: "generative-engine-optimization",
  title: "Generative Engine Optimization (GEO)",
  description:
    "GEO gets your brand named when people ask ChatGPT, Gemini, or Perplexity who to call. One team makes your locations the answer in every market.",
  heroVariant: "fragment-led",
  heroVignette: "chat-answer",
  h1: [{ text: "Generative", mark: true }, { text: " engine optimization" }],
  answer:
    "Generative engine optimization, or GEO, is the work of getting your brand named when someone asks a tool like ChatGPT or Gemini who to call. These tools read the open web and repeat sources they trust. We build the pages, facts, and mentions that make your locations the answer.",
  workBand: {
    id: "services-generative-engine-optimization-band",
    alt: "Reviewing which brands AI answer tools name for buyer questions",
    note: "Wide shot: an answer-engine response naming a client, or the team reviewing an answer log.",
    href: "/results/",
  },
  bandPlacement: "after-spine",
  whoFor: [
    {
      text: "Your buyers ask AI tools before they search.",
      sub: "More customers start with a question in ChatGPT or Perplexity. If you are not in the answer, the call goes to whoever is.",
    },
    {
      text: "You rank on Google but never get named.",
      sub: "Ranking and being quoted are different jobs. A page can sit on page 1 and still never appear in an answer.",
    },
    {
      text: "The tools describe your locations wrong.",
      sub: "Old addresses, missing services, wrong hours. Answer tools repeat whatever the web says about you.",
    },
  ],
  deliverables: [
    {
      text: "An answer audit",
      sub: "What ChatGPT, Gemini, and Perplexity say about you today, market by market.",
    },
    {
      text: "Quotable answer blocks on key pages",
      sub: "Clear, direct passages these tools can lift word for word.",
    },
    {
      text: "Your facts made consistent everywhere",
      sub: "Name, locations, services, and hours matching across the whole web.",
    },
    {
      text: "Mentions where the tools read",
      sub: "Coverage in the directories, lists, and articles answer engines cite.",
    },
    {
      text: "A share-of-answer log",
      sub: "We ask the tools your buyers' questions and record who gets named, over time.",
    },
  ],
  process: [
    {
      title: "Audit",
      body: "We ask the tools your buyers' questions and record every answer.",
      checklist: ["Answers by market", "Wrong or missing facts", "Sources the tools cite"],
    },
    {
      title: "Fix",
      body: "We correct the facts and build the pages the tools want to quote.",
      checklist: ["Answer blocks", "Consistent listings", "Source pages"],
    },
    {
      title: "Earn",
      body: "We win mentions in the places answer engines trust.",
      checklist: ["Citations and lists", "Fresh content", "Answer log updates"],
    },
  ],
  spine: [
    {
      heading: "What GEO actually is",
      paragraphs: [
        "When someone asks ChatGPT for a med spa in Denver or a franchise consultant worth calling, the tool does not show 10 links. It gives a short answer with a few names in it. GEO is the work of being one of those names. The tools build answers from pages they can read and trust: your site, directories, reviews, and articles that mention you.",
        "That means the raw material is content and facts. A clear page that answers a question in plain words gets quoted. A vague page does not. Consistent facts about your locations get repeated. Conflicting facts get you skipped, because the tool cannot tell which version is true.",
      ],
    },
    {
      heading: "Why multi-location brands win here",
      mark: "win",
      paragraphs: [
        "Answer tools think in brands first and locations second. Every fact we clean and every mention we earn strengthens the whole brand, and then every location borrows that strength. A single shop cleans up 1 listing. You clean up 30, and the picture of your brand sharpens everywhere at once.",
        "The reverse is also true. 1 location with wrong hours or a dead page muddies the answer for all of them. Keeping the whole set clean is exactly the kind of work a single team with one checklist does well.",
      ],
    },
    {
      heading: "GEO and SEO are one foundation",
      paragraphs: [
        "The same clean site, honest content, and earned mentions feed both. SEO wins you the spot in the list of links. GEO wins you the sentence in the answer. We run them together, and the work never fights itself.",
        "You watch both in the same report: rankings by market on one side, the answer log on the other.",
      ],
    },
  ],
  faqTitle: "Questions we get about GEO",
  faq: [
    {
      q: "Is GEO different from SEO?",
      a: "They share a foundation but aim at different results. SEO wins a spot in a list of links. GEO gets your brand named inside the answer itself. We run them together, and the same clean site helps both.",
    },
    {
      q: "Which tools does this cover?",
      a: "ChatGPT, Gemini, Perplexity, and the AI answers at the top of Google and Bing. The same work helps in all of them, because they read the same web.",
    },
    {
      q: "How do you measure it?",
      a: "We ask the tools the questions your buyers ask, market by market, and log who gets named. You watch your share of answers move in your report.",
    },
    {
      q: "How long does it take?",
      a: "Fixing wrong facts can show up in weeks. Earning trusted mentions builds over months, like SEO. The answer log makes the progress visible either way.",
    },
    {
      q: "Can one location do this alone?",
      a: "It can start, but the brand wins as a whole. Answer tools talk about brands first and locations second, so the work pays off everywhere at once.",
    },
  ],
  related: ["seo", "content-marketing", "obsidion-portal"],
  industries: [FRANCHISE, HEALTHCARE],
};
