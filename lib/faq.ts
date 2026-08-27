import type { FaqItem } from "@/components/shared/Faq";

/* The buyer-process FAQ set (decision D5, interior-buildout-plan.md):
   the homepage FAQ section was retired 2026-08-25 and its questions
   land on the conversion pages. /schedule/ and /contact/ render these
   through the shared <Faq> block, which emits FAQPage JSON-LD from the
   same array.

   Copy is the locked spec copy from project-sections/home/12.faq.md.
   One deviation: "first two weeks" is set in numerals per copy-rules
   ("Numerals for all numbers"), which wins over spec files. */
export const BUYER_PROCESS_FAQ: FaqItem[] = [
  {
    /* Answer widened 2026-08-26 (Brad: "we serve ecommerce clients and
       single location businesses as well"); supersedes 12.faq.md's
       multi-location-only wording. */
    q: "Do you only work with franchises?",
    a: "No. We work with brands of every size: single locations, multi-location groups, franchise systems, and ecommerce brands.",
  },
  {
    q: "Do I have to sign a long contract?",
    a: "No. We work month to month. We keep you by getting results, not by locking you in.",
  },
  {
    q: "Who owns the ad accounts and the website?",
    a: "You do. Always. If you ever leave, everything stays with you.",
  },
  {
    q: "How fast will I see results?",
    a: "Paid ads can produce leads in the first 2 weeks. Search takes longer, usually 3 to 6 months to move. We show you both in the portal from day one.",
  },
  {
    q: "Do you work with every location or just the brand?",
    a: "Both. We can run the national brand, the local stores, or the whole thing together with location-level budgets and reports.",
  },
  {
    q: "Where are you located?",
    a: "Denver, Colorado and Tampa, Florida. We work with brands across the country.",
  },
];
