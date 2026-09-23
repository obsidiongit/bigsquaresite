/* Blocks prototype (2026-09-23): one set of N blocks that rebuilds itself
   into each thing BigSquare makes. Pure data, no three.js.

   Every formation returns exactly N slots for a hold progress p (0..1).
   p animates the formation while it holds (a row climbs, bars rise).
   Slot units: x/z in block spacing, y in "layer" units where a block
   resting on the ground has y = 0.5. f is the block's height factor:
   1 = full cube, FLAT = a square lying on the floor. */

export type Slot = { x: number; y: number; z: number; c: 0 | 1 | 2; f: number; r?: number }; // r: turn about y
export type Marker = { x: number; y: number; z: number; text: string; a: number };
export type Formation = {
  id: string;
  label: string;
  build: (p: number) => Slot[];
  markers?: (p: number) => Marker[];
  span?: number; // scroll length of this beat, in beats (default 1)
  hold?: number; // share of the beat spent holding (default 0.55)
};

export const N = 384; // 8 x 8 x 6
export const FLAT = 0.18;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = (x: number) => {
  x = clamp(x);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

const W = 0 as const; // white (lit paper, blue in shade)
const B = 1 as const; // brand blue
const K = 2 as const; // navy ink
const S = (x: number, y: number, z: number, c: 0 | 1 | 2 = W, f = 1): Slot => ({ x, y, z, c, f });

/* Whatever a formation does not use lies on the floor as flat squares,
   the site's field of outlined squares. Nothing is ever thrown away. */
function fillFloor(out: Slot[], cols = 22, z0 = 2.4, gap = 1.15) {
  let i = 0;
  while (out.length < N) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    out.push(S((col - (cols - 1) / 2) * gap, 0.5, z0 + row * gap, W, FLAT));
    i++;
  }
  return out;
}

/* A block on an upright wall facing the camera (+z). r counts from the top. */
const wallY = (r: number, rows: number) => 0.5 + (rows - 1 - r);

/* 0 · The big square ----------------------------------------------------- */
function cube(topBlue: boolean) {
  return () => {
    const out: Slot[] = [];
    for (let i = 0; i < N; i++) {
      const gx = i % 8;
      const gz = Math.floor(i / 8) % 8;
      const gy = Math.floor(i / 64);
      out.push(S(gx - 3.5, 0.5 + gy, gz - 3.5, topBlue && gy === 5 ? B : W));
    }
    return out;
  };
}

/* 1 · Three slabs, one per service group ------------------------------------ */
const SLAB_NAMES = ["Organic Marketing", "Paid Advertising", "Design & Development"];
const slabOffset = (s: number, p: number) => ({
  x: (s - 1) * (1.6 + 0.8 * p),
  y: s * (1.9 + 0.8 * p),
  z: (1 - s) * 0.9,
});
function slabs(p: number) {
  const out: Slot[] = [];
  for (let i = 0; i < N; i++) {
    const gx = i % 8;
    const gz = Math.floor(i / 8) % 8;
    const gy = Math.floor(i / 64);
    const s = Math.floor(gy / 2);
    const o = slabOffset(s, p);
    out.push(S(gx - 3.5 + o.x, 0.5 + gy + o.y, gz - 3.5 + o.z, s === 1 ? B : W));
  }
  return out;
}
function slabMarkers(p: number): Marker[] {
  return SLAB_NAMES.map((text, s) => {
    const o = slabOffset(s, p);
    return { x: 4.4 + o.x, y: 1 + 2 * s + o.y, z: o.z, text, a: 1 };
  });
}

/* Paid: a target of square rings; a block cursor flies in and clicks -- */
const RINGS = [15, 11, 7, 3]; // outline sizes, outermost first
const RING_COL: (0 | 1 | 2)[] = [W, B, W, B];
const CURSOR: [number, number][] = [
  [0, 0], [0, 1], [1, 1], [0, 2], [1, 2], [2, 2], [0, 3], [1, 3], [2, 3], [3, 3],
  [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5],
  [0, 6], [1, 6], [2, 6], [2, 7], [3, 7], [3, 8], [4, 8],
];
const TARGET_Y = 7.5; // centre of the 15-block board
const aim = (p: number) => ease((p - 0.05) / 0.45);
const clickAt = (p: number, delay = 0) => Math.sin(Math.PI * clamp((p - 0.55 - delay) / 0.22));
export function paidCard(p: number) {
  const e = ease((p - 0.62) / 0.22);
  return { x: -6.5 * e, y: TARGET_Y + 4 * e, z: 0.5 + 3.5 * e, s: e };
}
function target(p: number) {
  const out: Slot[] = [];
  const clicked = p > 0.6;
  RINGS.forEach((n, ri) => {
    const h = (n - 1) / 2;
    const pop = 0.9 * clickAt(p, (RINGS.length - 1 - ri) * 0.05); // ripple outward from the centre
    for (let c = 0; c < n; c++)
      for (let r = 0; r < n; r++) {
        if (c !== 0 && r !== 0 && c !== n - 1 && r !== n - 1) continue;
        out.push(S(c - h, TARGET_Y + (r - h), pop, RING_COL[ri]));
      }
  });
  out.push(S(0, TARGET_Y, 0.9 * clickAt(p), clicked ? B : K)); // bullseye
  // the cursor: tip starts up and to the right, lands on the bullseye, presses in
  const e = aim(p);
  const tipX = 9 * (1 - e);
  const tipY = TARGET_Y + 6.5 * (1 - e);
  const press = 1.1 * clickAt(p, -0.02);
  for (const [c, r] of CURSOR) out.push(S(tipX + c, tipY - r, 2.4 - press, K));
  return fillFloor(out, 22);
}

/* Organic: a video frame whose play button becomes a beating heart ------- */
const PLAY: [number, number][] = [];
[1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].forEach((w, r) => {
  for (let c = 0; c < w; c++) PLAY.push([c - 2.5, 5 - r]);
});
const HEART: [number, number][] = [];
[".XX...XX.", "XXXX.XXXX", "XXXXXXXXX", "XXXXXXXXX", ".XXXXXXX.", "..XXXXX..", "...XXX...", "....X...."].forEach(
  (row, r) => [...row].forEach((ch, c) => ch === "X" && HEART.push([c - 4, 3.5 - r])),
);
export const FRAME_W = 19;
export const FRAME_H = 13;
export const FRAME_Y = 0.5 + (FRAME_H - 1) / 2;
const morph = (p: number) => ease((p - 0.3) / 0.35);
function content(p: number) {
  const out: Slot[] = [];
  const hw = (FRAME_W - 1) / 2;
  const hh = (FRAME_H - 1) / 2;
  for (let c = 0; c < FRAME_W; c++)
    for (let r = 0; r < FRAME_H; r++) {
      if (c !== 0 && r !== 0 && c !== FRAME_W - 1 && r !== FRAME_H - 1) continue;
      out.push(S(c - hw, FRAME_Y + r - hh, 0));
    }
  const m = morph(p);
  const beat = m * 0.7 * Math.max(0, Math.sin(2 * Math.PI * (p * 3.2))); // the heart pulses forward
  HEART.forEach(([hx, hy], j) => {
    const from = PLAY[j]; // the 10 extra heart blocks rise from the floor
    const fx = from ? from[0] : hx;
    const fy = from ? FRAME_Y + from[1] : 0.5;
    const fz = from ? 0 : 3;
    out.push(
      S(fx + (hx - fx) * m, fy + (FRAME_Y + hy - fy) * m + Math.sin(Math.PI * m) * 1.2, fz + (0 - fz) * m + Math.sin(Math.PI * m) * 1.5 + beat, B, from ? 1 : FLAT + (1 - FLAT) * m),
    );
  });
  return fillFloor(out, 22);
}
function contentMarkers(p: number): Marker[] {
  return [{ x: 5.4, y: FRAME_Y + 3.4, z: 1, text: "Saved. Shared. Followed.", a: clamp((morph(p) - 0.85) / 0.15) }];
}

/* 4 · Design: four versions of one ad; three fall, one wins ----------------- */
export const DESIGN_N = 4;
const WINNER = 1;
const win = (p: number) => ease((p - 0.5) / 0.35);
const topple = (f: number, p: number) => {
  if (f === WINNER) return 0;
  const order = f < WINNER ? f : f - 1;
  return ease((p - 0.1 - order * 0.1) / 0.35);
};
/* where frame f's picture sits: centre, and its tilt back about the base */
export function creativeFrame(f: number, p: number) {
  const fx = (f - 1.5) * 9;
  const e2 = f === WINNER ? win(p) : 0;
  const d = topple(f, p);
  const th = (d * Math.PI) / 2;
  return { x: fx - fx * e2, y: 0.5 + 3 * Math.cos(th), z: 2.2 * e2 - 3 * Math.sin(th) - 0.6 * d, rx: -th, win: e2 };
}
function creative(p: number) {
  const out: Slot[] = [];
  for (let f = 0; f < DESIGN_N; f++) {
    const fr = creativeFrame(f, p);
    const d = topple(f, p);
    const th = (d * Math.PI) / 2;
    for (let c = 0; c < 7; c++)
      for (let r = 0; r < 7; r++) {
        if (c !== 0 && r !== 0 && c !== 6 && r !== 6) continue;
        const h = 6 - r; // height above the frame's base row
        const x = fr.x + c - 3;
        const col: 0 | 1 | 2 = f === WINNER && fr.win > 0.5 ? B : W;
        out.push(S(x, 0.5 + h * Math.cos(th), fr.z + 3 * Math.sin(th) - h * Math.sin(th), col, 1 - (1 - FLAT) * d));
      }
  }
  return fillFloor(out, 24, 2.6);
}
function creativeMarkers(p: number): Marker[] {
  return [{ x: 0, y: 8.2, z: 2.2, text: "The one that pulls", a: clamp((win(p) - 0.8) / 0.2) }];
}

/* 5 · Proof: the blocks rise into a chart ----------------------------------- */
const BARS = [3, 4, 5, 7, 9, 12];
function chart(p: number) {
  const out: Slot[] = [];
  BARS.forEach((h, b) => {
    const bx = (b - 2.5) * 3.4;
    const g = ease((p * 1.35 - b * 0.07) / 0.55);
    for (let l = 0; l < h; l++)
      for (let dx = 0; dx < 2; dx++)
        for (let dz = 0; dz < 2; dz++)
          out.push(S(bx + dx - 0.5, 0.5 + l * g, dz - 0.5, b === BARS.length - 1 ? B : W));
  });
  return fillFloor(out, 22, 2.6);
}

/* 6 · Every location: one unit, copied across the map ---------------------- */
const UNITS = 24; // 6 x 4, 16 blocks each = N
const START_UNIT = 8;
const unitPos = (u: number) => ({ x: ((u % 6) - 2.5) * 3.6, z: (Math.floor(u / 6) - 1.5) * 3.6 });
const RANK = (() => {
  const o = unitPos(START_UNIT);
  const ids = Array.from({ length: UNITS }, (_, u) => u);
  ids.sort((a, b) => {
    const pa = unitPos(a);
    const pb = unitPos(b);
    return Math.hypot(pa.x - o.x, pa.z - o.z) - Math.hypot(pb.x - o.x, pb.z - o.z);
  });
  const rank: number[] = [];
  ids.forEach((u, r) => (rank[u] = r));
  return rank;
})();
function locations(p: number) {
  const out: Slot[] = [];
  for (let u = 0; u < UNITS; u++) {
    const { x, z } = unitPos(u);
    const g = u === START_UNIT ? 1 : ease((p * 1.5 - 0.1 - RANK[u] * 0.04) / 0.3);
    for (let l = 0; l < 4; l++)
      for (let dx = 0; dx < 2; dx++)
        for (let dz = 0; dz < 2; dz++)
          out.push(S(x + dx - 0.5, 0.5 + l * g, z + dz - 0.5, l === 3 && g > 0.9 ? B : W, FLAT + (1 - FLAT) * g));
  }
  return out;
}

/* The work: a ring of five screens; scroll turns the ring ---------------- */
export const WORK_N = 5;
const WR = 11; // ring radius
const FW = 11;
const FH = 7;
const WORK_Y = 5;
export const WORK_PLANE = { w: 9.15, h: 5.15 };
const STEP = (Math.PI * 2) / WORK_N;
/* which item is in front: holds on each, turns in the last quarter of its window */
export const workIndex = (p: number) => {
  const q = clamp(p) * WORK_N;
  const i = Math.min(WORK_N - 1, Math.floor(q));
  return i + (i < WORK_N - 1 ? ease((q - i - 0.75) / 0.25) : 0);
};
export function workFrame(i: number, p: number) {
  let th = i * STEP - workIndex(p) * STEP;
  th = Math.atan2(Math.sin(th), Math.cos(th));
  const act = clamp(1 - Math.abs(th) / STEP);
  const R = WR + 2.6 * act * act;
  return { x: R * Math.sin(th), y: WORK_Y, z: R * Math.cos(th), r: th, act };
}
function work(p: number) {
  const out: Slot[] = [];
  for (let i = 0; i < WORK_N; i++) {
    const f = workFrame(i, p);
    const cx = Math.cos(f.r);
    const sz = -Math.sin(f.r);
    for (let c = 0; c < FW; c++)
      for (let r = 0; r < FH; r++) {
        if (c !== 0 && r !== 0 && c !== FW - 1 && r !== FH - 1) continue;
        const lx = c - (FW - 1) / 2;
        const slot = S(f.x + lx * cx, f.y + r - (FH - 1) / 2, f.z + lx * sz, f.act > 0.6 ? B : W);
        slot.r = f.r;
        out.push(slot);
      }
  }
  return fillFloor(out, 30, -14);
}

/* the hero cube's front face (+z), in render units */
export const CUBE_FACE = { w: 7.6, h: 5.6, y: 2.93, z: 3.95 };

export const FORMATIONS: Formation[] = [
  { id: "square", label: "The big square", build: cube(false) },
  { id: "team", label: "One team", build: slabs, markers: slabMarkers },
  { id: "paid", label: "Paid Advertising", build: target },
  { id: "design", label: "Design & Development", build: creative, markers: creativeMarkers },
  { id: "organic", label: "Organic Marketing", build: content, markers: contentMarkers },
  { id: "work", label: "Selected work", build: work, span: 2.6, hold: 0.82 },
  { id: "proof", label: "Proof", build: chart },
  { id: "locations", label: "Every location", build: locations },
  { id: "talk", label: "Let's talk", build: cube(true) },
];
export const WORK_BEAT = FORMATIONS.findIndex((f) => f.id === "work");
export const DESIGN_BEAT = FORMATIONS.findIndex((f) => f.id === "design");
export const ORGANIC_BEAT = FORMATIONS.findIndex((f) => f.id === "organic");
export const PAID_BEAT = FORMATIONS.findIndex((f) => f.id === "paid");
