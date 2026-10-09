"use client";

import { useId } from "react";
import { Sketch, svgId, type Stroke } from "@/components/shared/draft/Draft";
import s from "@/components/shared/draft/draft.module.css";
import { hatch, pCircle, pHead, pLine, pRect } from "@/components/shared/draft/pencil";

/* The Solution cards' blueprint drawings (review toggle lib/lab
   "middleDraft"): white pencil on the blue card, the curtain footer's
   look, one drawing per promise. Each draws itself in once, stroke by
   stroke; nothing loops but the shared pencil wobble. Illustration only
   (aria-hidden): the card's title and line carry the meaning. No numbers
   anywhere in them (copy-rules claims). */

const VB = "0 0 320 200";

/** No Long Term Contracts: this month's page, next month already peeking out behind it */
function Calendar() {
  const id = svgId(useId());
  const st: Stroke[] = [];
  let i = 0;
  // next month, behind
  pRect(96, 46, 168, 128, 3).forEach((d) => st.push({ d, i: i++, hatch: true }));
  // this month
  pRect(64, 30, 168, 132, 7).forEach((d) => st.push({ d, i: i++ }));
  st.push({ d: pLine(64, 56, 232, 56, 41), i: i++ });
  hatch(64, 30, 168, 26, 7, 5).forEach((d) => st.push({ d, i, hatch: true, clip: id }));
  i++;
  // binder rings
  st.push({ d: pCircle(104, 30, 6, 9), i: i++ });
  st.push({ d: pCircle(192, 30, 6, 13), i: i++ });
  // the grid: 7 days across, 4 weeks down, as ruled lines
  for (let k = 0; k <= 7; k++) st.push({ d: pLine(76 + k * 20.6, 68, 76 + k * 20.6, 150, 60 + k, 0.8), i: i + Math.floor(k / 2) });
  for (let k = 0; k <= 4; k++) st.push({ d: pLine(76, 68 + k * 20.5, 220, 68 + k * 20.5, 80 + k, 0.8), i: i + k });
  i += 5;
  // today, circled
  st.push({ d: pCircle(117, 99, 14, 21), i: i++ });
  // and the turn to next month
  st.push({ d: "M236 152 C252 160 268 158 278 144", i: i++ });
  st.push({ d: pHead(278, 144, -0.95, 9, 27), i: i++ });
  return (
    <Sketch strokes={st} viewBox={VB}>
      <clipPath id={id}>
        <rect x="64" y="30" width="168" height="26" />
      </clipPath>
    </Sketch>
  );
}

/** Transparency: the account, open, with a magnifier over the numbers */
function Window() {
  const id = svgId(useId());
  const st: Stroke[] = [];
  let i = 0;
  pRect(36, 34, 208, 134, 5).forEach((d) => st.push({ d, i: i++ }));
  st.push({ d: pLine(36, 54, 244, 54, 33), i: i++ });
  pRect(46, 40, 8, 8, 17).forEach((d) => st.push({ d, i }));
  i++;
  // bars, outlined, the tallest hatched
  const bars: [number, number][] = [
    [62, 52],
    [92, 78],
    [122, 64],
    [152, 96],
  ];
  bars.forEach(([x, h], k) => {
    pRect(x, 154 - h, 18, h, 50 + k * 9).forEach((d) => st.push({ d, i }));
    i++;
  });
  hatch(152, 58, 18, 96, 6, 71).forEach((d) => st.push({ d, i, hatch: true, clip: id }));
  i++;
  st.push({ d: pLine(52, 154, 186, 154, 91), i: i++ });
  // the magnifier
  st.push({ d: pCircle(214, 112, 36, 23), i: i++ });
  st.push({ d: "M194 98 C198 90 206 85 214 84", i: i++, hatch: true });
  st.push({ d: pLine(240, 138, 276, 176, 97, 0.6), i: i });
  st.push({ d: pLine(248, 132, 284, 168, 99, 0.6), i: i++ });
  st.push({ d: pLine(276, 176, 284, 168, 101, 0.4), i: i++ });
  return (
    <Sketch strokes={st} viewBox={VB}>
      <clipPath id={id}>
        <rect x="152" y="58" width="18" height="96" />
      </clipPath>
    </Sketch>
  );
}

/** Full Approach: one square in the middle, wired to every channel */
const NODES: [number, number, string][] = [
  [52, 40, "Search"],
  [268, 40, "Ads"],
  [36, 150, "Site"],
  [284, 150, "Email"],
  [160, 186, "Creative"],
];
function Hub() {
  const id = svgId(useId());
  const st: Stroke[] = [];
  let i = 0;
  pRect(136, 76, 48, 48, 9).forEach((d) => st.push({ d, i: i++ }));
  hatch(136, 76, 48, 48, 6, 13).forEach((d) => st.push({ d, i, hatch: true, clip: id }));
  i++;
  NODES.forEach(([x, y], k) => {
    // from the square's nearest edge to the node
    const sx = x < 140 ? 136 : x > 180 ? 184 : 160;
    const sy = y < 76 ? 76 : y > 124 ? 124 : 100;
    st.push({ d: pLine(sx, sy, x, y, 30 + k * 5, 2), i: i + k });
    pRect(x - 6, y - 6, 12, 12, 40 + k * 4).forEach((d) => st.push({ d, i: i + k + 1 }));
  });
  i += NODES.length + 1;
  return (
    <Sketch strokes={st} viewBox={VB}>
      <clipPath id={id}>
        <rect x="136" y="76" width="48" height="48" />
      </clipPath>
      {NODES.map(([x, y, label], k) => (
        <text
          key={label}
          x={x}
          y={y < 100 ? y - 14 : y + 22}
          textAnchor="middle"
          className={s.label}
          style={{ ["--i" as string]: i + k }}
        >
          {label}
        </text>
      ))}
    </Sketch>
  );
}

export const BLUEPRINTS = { calendar: Calendar, window: Window, hub: Hub } as const;
export type BlueprintKey = keyof typeof BLUEPRINTS;
