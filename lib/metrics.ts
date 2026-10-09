/* Home proof band metrics (7.proof-numbers.md v3.2): the single data
   source for the stat grid.

   VALUES ARE NULL until each figure is sourced (null renders nothing). Brad
   picked the metric IDEAS (2026-08-24 proof-band copy test) and asked
   for stand-in numbers to judge the composition; every VALUE below
   must be replaced with a real, sourced figure before launch.
   LAUNCH GATE: the band cannot go live until Brad or Mike confirms
   each number. The grid handles 3 or 4 entries; trim or add here, no
   layout change needed.

   `value: null` renders an honest mono placeholder and never counts
   up; real/stand-in values CountUp once on entry. */

export type Metric = {
  /** the number; null until sourced (see launch gate above) */
  value: number | null;
  prefix?: string;
  suffix?: string;
  /** what the slot is waiting on, rendered while value is null */
  placeholder?: string;
  /** plain-language caption: the number restated in words (Youtech style) */
  caption: string;
};

export const METRICS: Metric[] = [
  {
    value: null, // needs the real ad spend figure, sourced
    prefix: "$",
    suffix: "M+",
    caption: "in ad spend managed",
  },
  {
    value: null, // needs the real locations count, sourced
    suffix: "+",
    caption: "locations supported",
  },
  {
    value: null, // needs the real average growth figure, sourced
    suffix: "%",
    caption: "average growth",
  },
  {
    value: null, // needs the real years figure, sourced
    suffix: "+",
    caption: "years running paid media",
  },
];
