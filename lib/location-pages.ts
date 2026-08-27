import type { FaqItem } from "@/components/shared/Faq";
import type { Office } from "@/lib/offices";

/* City page content (project-sections/locations/denver.md v2, the
   Batch 2 city template): one module per office, keyed by the office
   slug. Pages exist exactly when registered here (the services and
   industries registry pattern at 2-page scale).

   COPY ONLY. Office facts (address, phone) live in lib/offices.ts and
   render as honest placeholders while null; nothing in this file may
   state a fact that is not already in project-brief.md. Never name
   the planned third office. */

export type LocationPageContent = {
  slug: Office["slug"];
  /** metadata title; the root template appends "| BigSquare" */
  title: string;
  description: string;
  /** hero answer paragraph (SEO); audience rule: never franchise-only */
  answer: string;
  /** second hero line, the audience beat */
  answerSupport: string;
  /** the wide office band's MediaSlot */
  media: { id: string; note: string; alt: string };
  /** support line under the what-we-do link table */
  whatWeDoLine: string;
  /** 3 honest local questions; FAQPage JSON-LD renders from the same
      array, so no answer may lean on the unconfirmed address */
  faq: FaqItem[];
};

export const LOCATION_PAGES: Record<Office["slug"], LocationPageContent> = {
  denver: {
    slug: "denver",
    title: "Denver Marketing Agency",
    description:
      "BigSquare is a Denver marketing agency for brands of every size. Search, ads, websites, and creative, run from our Denver office for clients across Colorado and the country.",
    answer:
      "BigSquare is a Denver marketing agency for brands that want more customers in every location. We run search, ads, websites, and creative from our office in Denver, for brands across Colorado and the country.",
    answerSupport:
      "Single locations, multi-location groups, franchise systems, and ecommerce brands all grow here.",
    media: {
      id: "locations-denver-office",
      note: "The Denver office, or the team in it. Real photo only.",
      alt: "The BigSquare office in Denver, Colorado",
    },
    whatWeDoLine:
      "Every service runs from both offices. Your account gets the whole team, wherever you are.",
    faq: [
      {
        q: "Can we meet in person in Denver?",
        a: "Yes. Book a call first and we will set it up at the Denver office. Most clients meet us on video, and that works from anywhere.",
      },
      {
        q: "What areas does the Denver office serve?",
        a: "All of Colorado and the whole country. You do not need to be near the office. The work and the numbers show up in your dashboard either way.",
      },
      {
        q: "Do you only work with big multi-location brands?",
        a: "No. We work with brands of every size: single locations, multi-location groups, franchise systems, and ecommerce brands.",
      },
    ],
  },
  tampa: {
    slug: "tampa",
    title: "Tampa Marketing Agency",
    description:
      "BigSquare is a Tampa marketing agency for brands of every size. Search, ads, websites, and creative, run from our Tampa office for clients across Florida and the country.",
    answer:
      "BigSquare is a Tampa marketing agency for brands that want more customers in every location. We run search, ads, websites, and creative from our office in Tampa, for brands across Florida and the country.",
    answerSupport:
      "Single locations, multi-location groups, franchise systems, and ecommerce brands all grow here.",
    media: {
      id: "locations-tampa-office",
      note: "The Tampa office, or the team in it. Real photo only.",
      alt: "The BigSquare office in Tampa, Florida",
    },
    whatWeDoLine:
      "Every service runs from both offices. Your account gets the whole team, wherever you are.",
    faq: [
      {
        q: "Can we meet in person in Tampa?",
        a: "Yes. Book a call first and we will set it up at the Tampa office. Most clients meet us on video, and that works from anywhere.",
      },
      {
        q: "What areas does the Tampa office serve?",
        a: "All of Florida and the whole country. You do not need to be near the office. The work and the numbers show up in your dashboard either way.",
      },
      {
        q: "Do you only work with big multi-location brands?",
        a: "No. We work with brands of every size: single locations, multi-location groups, franchise systems, and ecommerce brands.",
      },
    ],
  },
};
