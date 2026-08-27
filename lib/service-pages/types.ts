/* The T2 per-page content contract
   (project-sections/services/_service-page-template.md v2).
   Stamping a new service page = one of these, with its own copy pass
   under copy-rules.md. The layout (ServicePage.tsx) never changes. */

export type H1Segment = {
  text: string;
  /** true = this segment gets the hand-drawn underline (T2 signature) */
  mark?: boolean;
};

/** A media slot rendered through <MediaSlot>: shows its designed
    placeholder until Brad maps the id in lib/asset-files.ts. Every
    slot also gets a row in project-guidelines/asset-manifest.md. */
export type AssetSlotDef = {
  id: string;
  /** real, descriptive alt text; ships the moment the asset lands */
  alt: string;
  /** what Brad should drop here (for the manifest) */
  note: string;
};

export type ServicePageContent = {
  /** must match a lib/services.ts slug */
  slug: string;
  /** title tag from sitemap.md, WITHOUT the "| BigSquare" suffix
      (the root layout template appends it) */
  title: string;
  /** meta description, under 155 chars */
  description: string;
  h1: H1Segment[];
  /** the answer block: 2 to 3 sentences, quotable, doubles as the
      Service JSON-LD description */
  answer: string;
  /** variation-kit pick (brief v2.1): A media-right (framed square
      media + fragment overlay), B statement-wide (full-width open +
      the hero media as a wide band beneath), C fragment-led (the UI
      fragment composition carries the hero's right column; no hero
      photo slot) */
  heroVariant: "media-right" | "statement-wide" | "fragment-led";
  /** hero media object; required for A (right square) and B (wide
      band under the statement); omitted on C pages */
  heroAsset?: AssetSlotDef;
  /** the page's token-native UI fragment (per-page, anti-sameness
      kit); overlays the media corner on A, carries the right column
      on C, absent on B. Implemented in ServicePage.tsx */
  heroVignette?:
    | "local-rank"
    | "chat-answer"
    | "review-stars"
    | "send-queue"
    | "portal-window"
    | "bid-bars"
    | "lead-calls"
    | "cart-rows"
    | "type-specimen"
    | "code-lines";
  /** full-width media band; href makes it an internal image link */
  workBand?: AssetSlotDef & { href?: string };
  /** variation-kit pick: where the work band sits (default
      after-process) */
  bandPlacement?: "after-process" | "after-spine";
  /** the obsidion-portal richer variant only: a large exhibit-style
      media moment after "who it is for" (6.12 air rules, no chrome) */
  exhibit?: AssetSlotDef;
  /** 3 situations where this service is the right call */
  whoFor: { text: string; sub?: string }[];
  /** 4 to 6 deliverables */
  deliverables: { text: string; sub: string }[];
  /** exactly 3 steps: the multi-location method */
  process: { title: string; body: string; checklist: string[] }[];
  /** 2 to 3 long-form H2 sections (the word-count backbone).
      `mark` circles a substring of the heading with the hand-drawn
      circle (the page's third annotation; pick a different heading
      or phrase per page) */
  spine: { heading: string; mark?: string; paragraphs: string[] }[];
  /** H2 over the FAQ container */
  faqTitle: string;
  /** 4 to 6 service-specific Q&As, answers under 60 words */
  faq: { q: string; a: string }[];
  /** 3 service slugs for the related links */
  related: string[];
  /** 2 industry links, rendered as linked image cards (image
      internal-linking; the card asset is shared across every service
      page that links the same industry) */
  industries: { label: string; href: string; asset: AssetSlotDef }[];
  /** HARD-GATED proof slot: stays null until real case studies exist
      (Phase 7); filling it is a data change, not a layout change */
  caseStudy?: null;
};
