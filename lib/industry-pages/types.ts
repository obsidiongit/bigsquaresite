import type { FaqItem } from "@/components/shared/Faq";

/* T3 industry page content (_industry-page-template.md v2): one layout
   (components/sections/industries/IndustryPage.tsx), per-page content
   modules. Mirrors lib/service-pages/types.ts so the two template
   families stay one system. */

export type H1Segment = {
  text: string;
  /** wraps this segment in the hand-drawn circle (the template's
      system move: the page's subject, circled) */
  mark?: boolean;
};

export type IndustryPageContent = {
  slug: string;
  /** display name, also the breadcrumb leaf ("Franchise") */
  name: string;
  /** metadata title; the root layout appends "| BigSquare" */
  title: string;
  /** meta description, under 155 chars */
  description: string;

  h1: H1Segment[];
  /** the GEO answer block: 2 to 3 plain sentences that stand alone */
  answer: string;
  /** the hero media object (template v3 asset slot): id keys into
      lib/asset-files.ts; note names the wanted shot while empty; alt
      ships with the real file */
  heroMedia: { id: string; note: string; alt: string };
  /** the sub-market mono strip under the CTAs (v3; " / "-joined) */
  monoStrip: string[];

  difference: {
    eyebrow: string;
    title: string;
    support: string;
    /** intro paragraphs in the ~65ch spine */
    intro: string[];
    /** the numbered ruled list of structural differences */
    points: { text: string; sub: string }[];
  };

  personas: {
    eyebrow: string;
    title: string;
    support?: string;
    /** chip: a SOURCED segment fact or plain words, never an invented range */
    cards: { chip: string; title: string; body: string }[];
  };

  /** the board (template v3 section 4): the interactive signature.
      Skin is data so stamping restyles it without touching the
      component. seed = indexes of pre-filled squares (deterministic,
      SSR-rendered); readout chips never change with the index: the
      constancy is the demo. */
  board: {
    eyebrow: string;
    /** mark on the segment that wears the rough underline */
    title: H1Segment[];
    body: string;
    /** singular unit noun for the readout ("Location") */
    unitNoun: string;
    /** rest-state readout label ("Every location") */
    restLabel: string;
    chips: string[];
    cols: number;
    rows: number;
    seed: number[];
    /** variance dial 5: where the board sits in the page order
        (adjacent industry pages must differ) */
    position: "after-personas" | "after-services";
  };

  services: {
    eyebrow: string;
    title: string;
    support: string;
    /** slug into lib/services.ts + the industry-specific one-liner
        (the anti-thin-content rule: never the generic service pitch) */
    rows: { slug: string; line: string }[];
  };

  subMarkets: {
    eyebrow: string;
    line: string;
    /** chips link when their page exists (href set), plain text until
        then; sub-vertical chips gain hrefs as those pages ship */
    chips: { label: string; href?: string }[];
  };

  /** the long-form backbone (~65ch spine): how the work actually runs
      for this industry. The biggest share of the 1,500-word contract
      lives here and in `difference`; mirrors ServicePageContent.spine */
  spine: { heading: string; paragraphs: string[] }[];

  /** the mid-spine media band (template v3 asset slot); afterBlock is
      1-based: the band renders after that spine block (a variance dial) */
  spineMedia: { id: string; note: string; alt: string; afterBlock: number };

  process: {
    eyebrow: string;
    title: string;
    support: string;
    /** one card body per lib/ninety-days.ts phase, same order; the
        phase name, day range, and milestone checklist come from that
        module (day NUMBERS stay off interior cards: they are invented
        pending confirmation) */
    phaseBodies: [string, string, string];
    payoff: string;
    /** the quiet check row under the payoff: established true facts only */
    reassurance: string[];
  };

  faqTitle: string;
  faq: FaqItem[];
};
