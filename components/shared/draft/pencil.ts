/* Pencil geometry for the drafted sections (components/shared/draft). Every
   stroke is a slightly bowed cubic that overshoots its ends a touch, the way
   a hand drafts a line; the live wobble comes from the #draft-pencil filter
   (DraftDefs), not from here. Deterministic: the same seed draws the same
   line on every render, so SSR and the client agree. */

const rnd = (s: number) => {
  const x = Math.sin(s * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const f = (n: number) => n.toFixed(1);

/** one drafted line from a to b */
export function pLine(x1: number, y1: number, x2: number, y2: number, seed = 1, bow = 1.4): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const o1 = (rnd(seed) - 0.5) * bow * 2;
  const o2 = (rnd(seed + 1) - 0.5) * bow * 2;
  // overshoot: up to ~4 units past each end, along the line
  const a = 1 + rnd(seed + 2) * 3;
  const b = 1 + rnd(seed + 3) * 3;
  const ux = dx / len;
  const uy = dy / len;
  return `M${f(x1 - ux * a)} ${f(y1 - uy * a)} C${f(x1 + dx / 3 + nx * o1)} ${f(y1 + dy / 3 + ny * o1)} ${f(x1 + (2 * dx) / 3 + nx * o2)} ${f(y1 + (2 * dy) / 3 + ny * o2)} ${f(x2 + ux * b)} ${f(y2 + uy * b)}`;
}

/** a drafted rectangle as its four sides (separate strokes, so they draw in one after another) */
export function pRect(x: number, y: number, w: number, h: number, seed = 1): string[] {
  return [
    pLine(x, y, x + w, y, seed),
    pLine(x + w, y, x + w, y + h, seed + 5),
    pLine(x + w, y + h, x, y + h, seed + 9),
    pLine(x, y + h, x, y, seed + 13),
  ];
}

/** a hand-drawn loop: a little past a full turn, radius wandering a few percent */
export function pCircle(cx: number, cy: number, r: number, seed = 1): string {
  return pLoop(cx, cy, r, r, seed);
}

/** the same loop round a wide or tall box: an oval, rx by ry */
export function pLoop(cx: number, cy: number, rx: number, ry: number, seed = 1): string {
  const start = rnd(seed) * Math.PI * 2;
  const turn = Math.PI * 2 * 1.08;
  const steps = 8;
  const pt = (i: number) => {
    const t = start + (turn * i) / steps;
    const k = 1 + (rnd(seed + i * 3) - 0.5) * 0.08;
    return [cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k] as const;
  };
  // Catmull-Rom through the points, as cubics
  const pts = Array.from({ length: steps + 1 }, (_, i) => pt(i));
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < steps; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(steps, i + 2)];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/** 45 degree hatching over a box (clip it to the shape it shades) */
export function hatch(x: number, y: number, w: number, h: number, gap = 7, seed = 1): string[] {
  const out: string[] = [];
  for (let k = -h, i = 0; k < w; k += gap, i++) out.push(pLine(x + k, y + h, x + k + h, y, seed + i * 7, 0.6));
  return out;
}

/** a small pencil arrowhead at (x, y) pointing along angle a (radians) */
export function pHead(x: number, y: number, a: number, size = 9, seed = 1): string {
  const l = a + Math.PI - 0.5;
  const r = a + Math.PI + 0.5;
  return `${pLine(x + Math.cos(l) * size, y + Math.sin(l) * size, x, y, seed, 0.5)} ${pLine(x, y, x + Math.cos(r) * size, y + Math.sin(r) * size, seed + 4, 0.5)}`;
}
