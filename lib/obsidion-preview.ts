/* The Obsidion portal preview's content (9.portal.md v3).

   THE SWAP CONTRACT. Everything the preview window renders is declared
   here, so replacing the placeholder with real screenshots, a screen
   recording, or a live embed is a data change in this file, never a
   layout change in the section.

   THE HONESTY RULE (decisions.md, copy-rules "Claims"): this module
   holds FIELD NAMES ONLY. Not one value. No numbers, no client names,
   no dates, no percentages, no axis labels. Every value in the window
   renders as a neutral skeleton bar whose width is a layout weight,
   not a quantity. Weights are unitless 0..1 and mean "how wide is this
   grey bar", nothing else. If you ever want a real figure in here, it
   needs a source and it belongs in the copy, not in the mock. */

/** Top-bar tabs. The first is the lit one. */
export const TABS = ["Overview", "Leads", "Calls", "Spend", "Tasks"] as const;

/** Left rail. `lit` marks the current view. */
export const RAIL: { label: string; lit?: boolean }[] = [
  { label: "Overview", lit: true },
  { label: "Leads" },
  { label: "Calls" },
  { label: "Locations" },
  { label: "Budget" },
  { label: "Tasks" },
  { label: "Reports" },
];

/** Metric tiles: the field, plus bar weights for the value + sparkline. */
export const METRICS: { field: string; value: number; spark: number[] }[] = [
  { field: "Leads", value: 0.62, spark: [0.4, 0.55, 0.35, 0.7, 0.5, 0.85] },
  { field: "Cost per lead", value: 0.5, spark: [0.7, 0.55, 0.6, 0.4, 0.45, 0.3] },
  { field: "Calls", value: 0.55, spark: [0.3, 0.45, 0.6, 0.5, 0.75, 0.65] },
  { field: "Spend", value: 0.7, spark: [0.5, 0.6, 0.55, 0.65, 0.6, 0.7] },
];

/** Channel breakdown. Real channel names are fields, not claims; the
    bar is a weight. `acc` lifts the first rows into brand blue. */
export const CHANNELS: { field: string; weight: number; acc?: boolean }[] = [
  { field: "Google Ads", weight: 0.92, acc: true },
  { field: "Meta Ads", weight: 0.64, acc: true },
  { field: "Organic search", weight: 0.48 },
  { field: "Email", weight: 0.3 },
  { field: "Calls", weight: 0.22 },
];

/** Budget pacing: one track plus its legend fields. */
export const PACING = {
  track: 0.58,
  legend: [
    { field: "Committed", weight: 0.55 },
    { field: "Pending", weight: 0.35 },
    { field: "Remaining", weight: 0.28 },
  ],
};

/** Lead table: column fields, then per-row cell weights (last cell
    renders as a status pill, still a skeleton). */
export const LEAD_COLUMNS = ["Source", "Channel", "Location", "Status"];
export const LEAD_ROWS: number[][] = [
  [0.78, 0.5, 0.62, 0.44],
  [0.6, 0.66, 0.48, 0.44],
  [0.86, 0.42, 0.7, 0.44],
  [0.52, 0.58, 0.56, 0.44],
];

/** The secondary window overlapping the main one (desktop only). */
export const CALL_LOG = {
  title: "Call log",
  rows: [
    { field: "Inbound call", weight: 0.72 },
    { field: "Inbound call", weight: 0.55 },
    { field: "Inbound call", weight: 0.64 },
  ],
};

/** The honesty gate. Rendered inside the window's top bar at every
    width; it is what makes the mock a labelled placeholder rather than
    a claim. Remove it only when the window shows the real product. */
export const PREVIEW_CHIP = "Portal preview";
