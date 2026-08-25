/* Home proof band metrics (7.proof-numbers.md v3.2): the single data
   source for the stat grid.

   CURRENT VALUES ARE VISUAL PLACEHOLDERS, not sourced numbers. Brad
   picked the metric IDEAS (2026-08-24 proof-band copy test) and asked
   for stand-in numbers to judge the composition; every VALUE below
   must be replaced with a real, sourced figure before launch.
   LAUNCH GATE: the band cannot go live until Brad or Mike confirms
   each number. The grid handles 3 or 4 entries; trim or add here, no
   layout change needed.

   `value: null` renders an honest mono placeholder and never counts
   up; real/stand-in values CountUp once on entry. */

export type Metric = {
  /** the number; VISUAL PLACEHOLDER until sourced (see launch gate above) */
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
    value: 75, // [PLACEHOLDER: real ad spend figure]
    prefix: "$",
    suffix: "M+",
    caption: "in ad spend managed",
  },
  {
    value: 400, // [PLACEHOLDER: real locations count]
    suffix: "+",
    caption: "locations supported",
  },
  {
    value: 47, // [PLACEHOLDER: real average growth figure]
    suffix: "%",
    caption: "average growth",
  },
  {
    value: 12, // [PLACEHOLDER: real years figure]
    suffix: "+",
    caption: "years running paid media",
  },
];
