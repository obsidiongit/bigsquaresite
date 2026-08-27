import type { IndustryPageContent } from "./types";

/* /industries/healthcare/ content (healthcare.md v1), stamped from the
   T3 template v3 after the Lane 3 gate opened 2026-08-26. Own copy
   pass, plain and short. Practice types from industries-index.md,
   split 4/3 between the hero strip and the breadth band. Privacy
   language stays an approach description, never a compliance
   guarantee.

   Variance dials vs legal: board = PRACTICE skin 12x5 seated AFTER
   SERVICES; difference list runs 4 points; spine media after block 1;
   underline on "every practice."; services swap in paid-social +
   social-media. */

export const HEALTHCARE_PAGE: IndustryPageContent = {
  slug: "healthcare",
  name: "Healthcare",
  title: "Healthcare Marketing Agency",
  description:
    "BigSquare is a healthcare marketing agency for dental, med spa, and urgent care groups. Search, ads, and websites with a report for every practice.",

  h1: [
    { text: "The " },
    { text: "healthcare", mark: true },
    { text: " marketing agency that fills the schedule." },
  ],
  answer:
    "BigSquare grows healthcare groups. We run search, ads, and websites for dental, med spa, urgent care, and other practice groups, with a budget and a report for every practice. Every booking shows up in Obsidion, our client portal.",
  heroMedia: {
    id: "healthcare-hero",
    note: "[PLACEHOLDER: front desk or practice interior, 4:3 crop]",
    alt: "A BigSquare healthcare client practice",
  },
  monoStrip: ["Dental", "Med Spas", "Urgent Care", "Physical Therapy"],

  difference: {
    eyebrow: "The Industry",
    title: "Healthcare marketing runs on trust and timing.",
    support:
      "Patients choose fast, judge hard, and book with whoever makes it easy.",
    intro: [
      "Patients pick providers the way they pick everything now. They search, read the reviews, look at the photos, and try to book. If booking takes a phone tree and a callback, they move to the next name on the list.",
      "Health is also personal. Ads and pages have to respect privacy rules and still feel human. Getting easy and careful to work together is the whole job.",
      "And no two practices in a group behave the same. One is new, one is full, one just lost an associate. A single plan spread across all of them wastes money at both ends. The work is practice by practice, or it does not work.",
    ],
    points: [
      {
        text: "Reviews carry the decision",
        sub: "New patients read reviews before they read anything else. Every practice needs a steady stream of real reviews and pages that show actual people, not stock smiles. We build the ask into checkout, so the stream never dries up.",
      },
      {
        text: "Booking friction kills demand",
        sub: "Every extra step between the ad and the appointment loses patients. Online booking, fast pages, and quick follow-up turn interest into visits. We measure every step and remove the ones that lose people.",
      },
      {
        text: "Privacy rules shape the ads",
        sub: "Health advertising limits how you target and what you track. We plan around those limits from the start, so campaigns get measured without crossing lines. Your team approves the setup before anything runs.",
      },
      {
        text: "Each practice has its own capacity",
        sub: "Marketing has to match the schedule. A practice with two open chairs needs different spend than one booked out for weeks. Budgets follow capacity, and the schedule tells the marketing what to do next.",
      },
    ],
  },

  personas: {
    eyebrow: "Who We Work With",
    title: "Built for groups, not one-off clinics.",
    support: "Three shapes of healthcare group, one booking machine.",
    cards: [
      {
        chip: "Multi-practice",
        title: "Practice groups",
        body: "You run several practices under one brand. Each gets its own local presence, its own budget, and its own report, so the group can compare them honestly.",
      },
      {
        chip: "Franchise systems",
        title: "Healthcare franchises",
        body: "You franchise a health brand. We keep the brand consistent while every unit fills its own schedule. Our franchise program covers the development side too.",
      },
      {
        chip: "Opening locations",
        title: "Expanding practices",
        body: "You are adding your next location. We launch it with pages, listings, and ads ready before the doors open, running the playbook your other practices already proved.",
      },
    ],
  },

  board: {
    eyebrow: "The System",
    title: [{ text: "One system, " }, { text: "every practice.", mark: true }],
    body: "Every square is a practice. Each one gets its own pages, its own ads, its own booking tracking, and its own report, inside one brand. Try a few. The readout stays put, because every practice runs the same system.",
    unitNoun: "Practice",
    restLabel: "Every practice",
    chips: ["Pages", "Ads", "Bookings", "Report"],
    cols: 12,
    rows: 5,
    seed: [3, 9, 14, 22, 28, 35, 37, 44, 51, 58],
    position: "after-services",
  },

  services: {
    eyebrow: "What We Run",
    title: "The work that books the visit.",
    support:
      "Every service below runs practice by practice, reported in the open.",
    rows: [
      {
        slug: "seo",
        line: "Local rankings and practice pages for every location. When someone searches near them, your practice shows up with proof. Profiles stay current, because a wrong hour or an old address costs bookings.",
      },
      {
        slug: "paid-search",
        line: "Search ads for the visits and treatments you want more of, budgeted per practice and measured to the booking. Offers change by practice and season, and the ads keep up.",
      },
      {
        slug: "paid-social",
        line: "Meta and TikTok ads for the visual side of care. Med spa, dental, and wellness offers that actually book, kept honest and on brand at every practice.",
      },
      {
        slug: "social-media",
        line: "Real posts from real practices: the team, the space, the results. Kept on brand and on schedule, and nothing posts without the practice's sign-off.",
      },
      {
        slug: "web-design",
        line: "Fast sites with online booking front and center. Fewer steps between the search and the chair. Every practice gets its own page with real photos and real reviews.",
      },
    ],
  },

  /* sub-markets variant: the rest of the practice-type list */
  subMarkets: {
    eyebrow: "Practice Types",
    line: "The playbook carries across care, because trust, reviews, and booking work the same way in each corner of it. More practice types we run:",
    chips: [
      { label: "Chiropractic" },
      { label: "Mental Health" },
      { label: "Veterinary" },
    ],
  },

  spine: [
    {
      heading: "From search to booked visit",
      paragraphs: [
        "A patient's path is short: search, read, book. Our job is to remove everything that interrupts it. Pages load fast, reviews sit up front, and the booking button works on the first tap. Every practice page shows its own team, its own space, and its own reviews, because that is what a patient is actually choosing.",
        "Follow-up matters just as much. An inquiry that waits a day goes elsewhere. We wire forms and calls so your front desk sees every new patient request the moment it lands. Speed there is worth more than any headline.",
      ],
    },
    {
      heading: "Growth that respects the rules",
      paragraphs: [
        "Health advertising is not like selling shoes. Platforms limit targeting, and privacy rules limit tracking. We build campaigns that work inside those limits instead of pretending they do not exist. The practices that respect the rules keep running while others stop to clean up.",
        "Measurement stays honest too. We count bookings and calls per practice without reaching for data you should not be collecting. Your team approves the setup before anything runs.",
        "That discipline is not a limit on growth. Clean targeting and clean tracking mean the numbers you act on are real, and nobody has to walk anything back later.",
      ],
    },
    {
      heading: "Reviews patients believe",
      paragraphs: [
        "Patients trust other patients. A practice with recent, specific, answered reviews wins against a bigger name with a silent profile. We make the ask part of checkout, help the team respond, and keep every location's profile current across the maps and the review sites that matter in care.",
        "No shortcuts. No bought reviews, no filtering out unhappy patients, no scripts that sound like scripts. Real feedback, asked for well, at every practice.",
      ],
    },
    {
      heading: "One brand, many schedules",
      paragraphs: [
        "A group's hardest problem is unevenness. One practice is booked out for weeks while another has open chairs all afternoon. Spend and offers shift toward the open schedule, practice by practice. A new-patient special belongs at the practice with room, not everywhere at once.",
        "Obsidion, our client portal, shows each practice its own numbers: bookings, calls, spend, and what changed this week. The group sees the whole board. Every manager sees their own. Openings get the same treatment: pages, listings, tracking, and ads ready before the first patient walks in.",
      ],
    },
  ],
  spineMedia: {
    id: "healthcare-method",
    note: "[PLACEHOLDER: booking screen or care team, 16:9]",
    alt: "Booking results in the Obsidion portal",
    afterBlock: 1,
  },

  process: {
    eyebrow: "The Plan",
    title: "The first 90 days, scheduled.",
    support:
      "No long onboarding and no guessing. The plan has dates, you see it in the portal, and every practice knows what week it is.",
    phaseBodies: [
      "Ten days to a plan for every practice.",
      "Campaigns live with booking tracking already on.",
      "Spend follows the schedule: full practices ease off, open ones push.",
    ],
    payoff:
      "Ninety days in, you will know what every practice spent and what it booked.",
    reassurance: [
      "Month to month, no long contracts.",
      "Accounts and site belong to you.",
      "A report per practice, not an average.",
    ],
  },

  faqTitle: "Healthcare questions, straight answers.",
  faq: [
    {
      q: "Which types of practices do you work with?",
      a: "Dental, med spa, physical therapy, urgent care, chiropractic, mental health, and veterinary, among others. If you run more than one practice, the system fits, and the plan bends to how your type of care gets chosen.",
    },
    {
      q: "How do you handle patient privacy in advertising?",
      a: "We plan campaigns with health privacy rules in view: careful targeting, careful tracking, and your team's approval before anything runs. The goal is growth your compliance folks do not have to worry about.",
    },
    {
      q: "Can patients book online from the ads?",
      a: "Yes. Ads and pages connect to your booking flow, so a patient can go from search to a booked visit in one sitting. If your booking tool changes, the flow changes with it.",
    },
    {
      q: "How do you report results?",
      a: "By practice. Bookings, calls, and spend per location in Obsidion, our client portal, so every practice manager sees their own numbers, and the group sees the whole board in one view.",
    },
    {
      q: "Do you work with a single practice?",
      a: "The system is built for groups with more than one practice, or one practice about to become two. A solo practice usually needs less than we build, and we will say so in the audit rather than sell you a system you do not need.",
    },
    {
      q: "What do you do before a new practice opens?",
      a: "We build its page, claim its listings, set up tracking, and prepare local ads, so patients can find and book it from the start. Openings run on a playbook, not a scramble, and day one sits on the marketing calendar like the lease sits on the legal one.",
    },
    {
      q: "Who owns our accounts and our site?",
      a: "You do, always. Ad accounts, profiles, and the site stay with your group if we ever part ways. That includes your review profiles and your booking connections.",
    },
  ],
};
