/* Funnel content registry (Batch 3, project-sections/landing-pages).
   One typed map per template: /go/[slug]/ (VSL), /apply/[slug]/
   (application), /thanks/[slug]/ (next step). Pages read these maps
   with dynamicParams = false, so an unknown slug 404s at build time.

   Palette: D6 allows one alternate ground per ad page. The value is a
   [data-theme] ground from globals.css; the whole page sits inside it.

   Copy is real draft copy in the wide positioning (a full-stack agency
   with strong creative; franchise is one lane). Facts we do not have
   are flagged [PLACEHOLDER]. No invented numbers, clients, or reviews. */

export type FunnelPalette = "light" | "tint" | "dark" | "accent";

export type FunnelStep = { text: string; sub?: string };

export type VslFunnel = {
  palette: FunnelPalette;
  /** <title>; the page is noindex, the title is for the tab and the ad reports */
  title: string;
  headline: string;
  sub: string;
  /** [PLACEHOLDER: video URL] while src is null: poster + inert play square */
  video: { src: string | null; poster: string };
  cta: { label: string; href: string };
  proof: string[];
  /** Visible placeholder line under the proof bullets until a sourced result exists */
  proofNote?: string;
  steps: FunnelStep[];
  stepsNote?: string;
  finePrint: string;
};

export type ApplyFunnel = {
  palette: FunnelPalette;
  title: string;
  headline: string;
  sub: string;
  proof: string[];
  submitLabel: string;
  /** /thanks/[thanksSlug]/ after a successful post */
  thanksSlug: string;
  finePrint: string;
};

export type ThanksFunnel = {
  palette: FunnelPalette;
  title: string;
  headline: string;
  lead: string;
  /** What happens next, in order. Short lines. */
  next: string[];
  secondary: { label: string; href: string };
};

const PROOF = [
  "You own your accounts. Always.",
  "One team runs every channel. No handoffs.",
  "A dashboard you can check any day.",
];

const FINE_PRINT =
  "No long-term contracts. We never sell your information. [PLACEHOLDER: offer terms]";

export const VSL_PAGES: Record<string, VslFunnel> = {
  audit: {
    palette: "dark",
    title: "Your Marketing, Audited. Free.",
    headline: "Your marketing, audited. Free.",
    sub: "A short video for owners and marketing leads who want proof, not promises. Then a free audit of your accounts, on a call with us. [PLACEHOLDER: video length]",
    video: {
      src: null, // [PLACEHOLDER: video URL]
      poster: "/media/hero-poster.jpg", // [PLACEHOLDER: VSL poster frame]
    },
    cta: { label: "Get a Free Audit", href: "/schedule/" },
    proof: PROOF,
    proofNote: "[PLACEHOLDER: one sourced result or a case study card]",
    steps: [
      { text: "You pick a time. The call is 30 minutes." },
      { text: "We look at your accounts together and show you where the money goes." },
      { text: "You leave with a plan for what we would do first. You decide what happens next." },
    ],
    stepsNote: "[PLACEHOLDER: confirm the real steps with Brad or Mike]",
    finePrint: FINE_PRINT,
  },
};

export const APPLY_PAGES: Record<string, ApplyFunnel> = {
  "growth-partner": {
    palette: "tint",
    title: "Apply to Work With BigSquare",
    headline: "Apply to work with us.",
    sub: "For brands that are ready to spend on growth and want a team that reports every dollar. 6 quick questions.",
    proof: PROOF,
    submitLabel: "Apply",
    thanksSlug: "growth-partner",
    finePrint: FINE_PRINT,
  },
};

export const THANKS_PAGES: Record<string, ThanksFunnel> = {
  audit: {
    palette: "accent",
    title: "You're In",
    headline: "You're in.",
    lead: "Check your email. Your audit is in the queue.",
    next: [
      "Look for an email from BigSquare. Check spam if it is not there.",
      "Expect a call within [PLACEHOLDER: turnaround].",
      "Have your ad accounts and site access ready. We look at them together.",
    ],
    secondary: { label: "See the Results", href: "/results/" },
  },
  "growth-partner": {
    palette: "accent",
    title: "Application Sent",
    headline: "Sent.",
    lead: "Your application is in. We read every one. Here is what happens next.",
    next: [
      "We review your answers within [PLACEHOLDER: turnaround].",
      "If it is a fit, we call the number you gave us to set up a 30-minute call.",
      "Not a fit right now? We tell you that too, by email.",
    ],
    secondary: { label: "See the Results", href: "/results/" },
  },
};
