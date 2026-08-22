// Framer Motion mirror of the CSS motion tokens (STYLE_GUIDE.md 7.2).
// globals.css (--ease-*, --dur-*) is the single CSS source; this file is
// the single TS source. Change both together.

type Bezier = [number, number, number, number];

export const EASE: Record<"house" | "soft" | "swoop", Bezier> = {
  /* THE ease: reveals, UI, hovers */
  house: [0.22, 1, 0.36, 1],
  /* layout moves, panel slides, morphs */
  soft: [0.4, 0, 0.1, 1],
  /* decisive arrivals: wipes, fills, tile assembly */
  swoop: [0.6, 0, 0, 1],
};

/* Durations in seconds (CSS vars hold the same values in ms) */
export const DUR = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  reveal: 0.7,
} as const;

/* One-shot viewport trigger: fires once when the element crosses ~85%
   of the viewport height (STYLE_GUIDE.md 7.3). */
export const VIEWPORT_ONCE = {
  once: true,
  margin: "0px 0px -15% 0px",
} as const;

/* Same trigger line for useInView (which takes margin without once) */
export const IN_VIEW_MARGIN = "0px 0px -15% 0px";
