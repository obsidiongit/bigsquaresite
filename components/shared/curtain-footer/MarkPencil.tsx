"use client";
/**
 * Footer wordmark D · Drawn in pencil (the designer's pick, 2026-09-28). BIG / SQUARE as outlines in the site's
 * wobbling pencil: the outline traces itself in, then light hatching is scribbled inside. Pointing at a
 * letter scribbles it in: a dense back-and-forth pencil stroke is drawn across it, clipped to the letter,
 * so it fills in like someone going over it hard, and it stays filled (the designer: "once it happens they should
 * stay filled in").
 * Letters are spaced by their real widths (measured from the font), both lines the same size.
 */
import { useEffect, useState } from "react";
import s from "./marks.module.css";

const FONT = `"Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif`;
const SIZE = 232; // picture px, both lines
const CAP = 0.716; // cap height of the face, per em
const LINES = [
  { text: "BIG", baseline: 262 },
  { text: "SQUARE", baseline: 468 },
];
const X0 = 232;
// rough advances (em) if the font can't be measured
const FALLBACK: Record<string, number> = { B: 0.78, I: 0.39, G: 0.83, S: 0.72, Q: 0.83, U: 0.78, A: 0.78, R: 0.78, E: 0.72 };

type L = { ch: string; x: number; w: number; top: number; base: number; k: number };

/** a quick back-and-forth scribble over a box, as one stroke */
function scribble(x: number, y: number, w: number, h: number, seed: number) {
  let r = seed;
  const rnd = () => ((r = (r * 16807) % 2147483647) / 2147483647 - 0.5) * 8;
  let d = `M ${x - 6} ${y + h + 4}`;
  const step = 15;
  for (let i = 0, cx = x - 6; cx < x + w + 10; i++, cx += step) {
    d += ` L ${cx + step * 0.5 + rnd()} ${y - 6 + rnd()} L ${cx + step + rnd()} ${y + h + 6 + rnd()}`;
  }
  return d;
}

export default function MarkPencil({ on }: { on: boolean }) {
  const [letters, setLetters] = useState<L[]>(() => layout(null));
  const [filled, setFilled] = useState<Set<number>>(() => new Set());
  useEffect(() => {
    const c = document.createElement("canvas").getContext("2d")!;
    c.font = `900 ${SIZE}px ${FONT}`;
    setLetters(layout(c));
  }, []);

  return (
    <svg className={`${s.stageBox} ${s.pencil}`} viewBox="0 0 1536 576" data-on={on || undefined} role="img" aria-label="BigSquare">
      <defs>
        <pattern id="mark-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2="14" stroke="rgba(225,235,255,0.5)" strokeWidth="3" />
        </pattern>
        {letters.map((l, i) => (
          <clipPath key={i} id={`mark-l${i}`}>
            <text x={l.x} y={l.base} fontSize={SIZE}>
              {l.ch}
            </text>
          </clipPath>
        ))}
      </defs>
      {letters.map((l, i) => (
        <g
          key={i}
          className={s.pl}
          style={{ ["--k" as string]: l.k }}
          data-filled={filled.has(i) || undefined}
          onPointerEnter={() => on && setFilled((f) => (f.has(i) ? f : new Set(f).add(i)))}
        >
          {/* a box to point at, so the gaps inside a letter count too */}
          <rect x={l.x} y={l.top - 10} width={l.w} height={l.base - l.top + 20} fill="transparent" />
          <text x={l.x} y={l.base} fontSize={SIZE} className={s.hatch}>
            {l.ch}
          </text>
          <path d={scribble(l.x, l.top, l.w, l.base - l.top, 11 + i * 7)} pathLength={1} clipPath={`url(#mark-l${i})`} className={s.fillIn} />
          <text x={l.x} y={l.base} fontSize={SIZE} className={s.outline}>
            {l.ch}
          </text>
        </g>
      ))}
    </svg>
  );
}

function layout(c: CanvasRenderingContext2D | null): L[] {
  const out: L[] = [];
  let k = 0;
  for (const line of LINES) {
    let x = X0;
    for (const ch of line.text) {
      const adv = c ? c.measureText(ch).width : FALLBACK[ch] * SIZE;
      const tight = adv - SIZE * 0.015; // Arial Black runs a little loose at this size
      out.push({ ch, x, w: tight, top: line.baseline - SIZE * CAP, base: line.baseline, k: k++ });
      x += tight;
    }
  }
  return out;
}
