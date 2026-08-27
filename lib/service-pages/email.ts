import { HEALTHCARE, HOME_SERVICES } from "./industries";
import type { ServicePageContent } from "./types";

/* /services/email/. Variation picks: hero C fragment-led (send-queue),
   band after process. Per services-index.md: describe outcomes, never
   the word "automation" (copy-rules ban). */

export const EMAIL_PAGE: ServicePageContent = {
  slug: "email",
  title: "Email & Text Marketing",
  description:
    "Email and text that follow up with every lead and bring old customers back. Written, scheduled, and reported by one team, location by location.",
  heroVariant: "fragment-led",
  heroVignette: "send-queue",
  h1: [{ text: "Email and " }, { text: "text", mark: true }, { text: " marketing" }],
  answer:
    "Email and text marketing is the follow-up your leads and past customers actually read. We write the messages, set the sending schedule, and keep your list clean. Every lead hears back fast, and old customers get a real reason to come back.",
  workBand: {
    id: "services-email-band",
    alt: "Email and text follow-up for a multi-location brand",
    note: "Wide shot: a message thread with a customer, or the send calendar.",
    href: "/results/",
  },
  whoFor: [
    {
      text: "Leads go cold before anyone follows up.",
      sub: "A lead that waits a day feels forgotten. A text back in the first minutes keeps the door open.",
    },
    {
      text: "Your customer list just sits there.",
      sub: "Past customers already trust you. Most brands never send them a single reason to return.",
    },
    {
      text: "Every location follows up differently.",
      sub: "One location calls twice, another never writes back. The brand cannot see the difference.",
    },
  ],
  deliverables: [
    {
      text: "Follow-up for every lead",
      sub: "Email and text that go out on a schedule you set, day or night.",
    },
    {
      text: "Campaigns that bring customers back",
      sub: "Offers, reminders, and news for the people who already bought.",
    },
    {
      text: "Messages written like a human",
      sub: "Short, warm, and easy to answer. Nothing that reads like a robot.",
    },
    {
      text: "A clean list you own",
      sub: "Sign-ups collected properly, dead addresses pruned, consent respected.",
    },
    {
      text: "Results by location",
      sub: "Opens, replies, and booked jobs, market by market, in your portal.",
    },
  ],
  process: [
    {
      title: "Set up",
      body: "We map every way a lead reaches you and decide what should happen next.",
      checklist: ["Lead sources", "Reply timing", "List cleanup"],
    },
    {
      title: "Write",
      body: "We draft every message and you approve the voice once.",
      checklist: ["Follow-up series", "Comeback campaigns", "Your sign-off"],
    },
    {
      title: "Send and tune",
      body: "Messages go out on schedule and the weak ones get rewritten.",
      checklist: ["Scheduled sends", "Message tests", "Location report"],
    },
  ],
  spine: [
    {
      heading: "Follow-up is where leads are won",
      paragraphs: [
        "Most businesses do not lose leads to competitors. They lose them to silence. Someone fills out a form, nobody answers for a day, and the moment passes. The fix is unglamorous: a fast, friendly reply every single time, then a gentle series that keeps the conversation open until they book or say no.",
        "We build that series once, in your voice, and it runs for every location the same way. The manager who always forgot to follow up does not have to remember anymore.",
      ],
    },
    {
      heading: "The list you own",
      mark: "own",
      paragraphs: [
        "Ad platforms rent you their audience and raise the rent every year. Your email and text list is the audience you own. Every customer who opts in is a person you can reach next month for free, and for a brand with thousands of past customers across many locations, that list quietly becomes the cheapest revenue channel you have.",
        "That only works if the list is treated well. Real consent, easy opt-out, and messages worth reading. Burn the list and it stops being an asset.",
      ],
    },
    {
      heading: "Why text earns its place",
      paragraphs: [
        "Texts get read, usually within minutes. That power comes with a rule: use it sparingly and only for things the customer actually wants, like appointment reminders, a fast reply to their inquiry, or an offer they signed up for. We hold that line, because the moment texts feel like spam, people leave.",
        "The mix differs by industry. A med spa lives on reminders, a law firm barely texts at all. We set the mix to fit how your customers want to hear from you.",
      ],
    },
  ],
  faqTitle: "Questions we get about email and text",
  faq: [
    {
      q: "Is this spam?",
      a: "No. Everyone we message asked to hear from you, and every message has a working opt-out. Spam burns your list and your name. We protect both.",
    },
    {
      q: "Do you write everything?",
      a: "Yes. You approve the voice up front and review campaigns before they send. Your time cost is a quick read, not writing.",
    },
    {
      q: "Can messages differ by location?",
      a: "Yes. Offers, names, and details can change per market while the voice stays the brand's. Reports come back by location too.",
    },
    {
      q: "What about text message rules?",
      a: "Texting has real rules about consent and opt-outs, and carriers enforce them. We set it up properly from the start so your number stays clean.",
    },
    {
      q: "What will we see in the report?",
      a: "Opens, clicks, replies, and the bookings that came from each send, by location, in your portal. If a series stops earning its place, we rewrite it.",
    },
  ],
  related: ["obsidion-portal", "content-marketing", "paid-social"],
  industries: [HOME_SERVICES, HEALTHCARE],
};
