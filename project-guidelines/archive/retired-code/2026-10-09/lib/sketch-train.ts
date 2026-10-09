/**
 * The pencil sketch travelling from one work card to another like a train (or a snake): the line unwinds
 * off the old card, runs along a curve across the gap, and winds itself round the new card, its tail
 * following its head the whole way. Drawn as three loose pencil strokes (like lib/sketch-frame.ts) that
 * keep "boiling" while they travel.
 *
 * How: one route is built (a loop round the old card that starts and ends where the line leaves it, a
 * curve over to the new card, a loop round the new card that starts where the line arrives), and a
 * window of line the length of a card's outline slides along it with stroke-dasharray.
 * Coordinates are the grid's own px (the SVG covers the grid), so scrolling doesn't move anything.
 */
type Rect = { x: number; y: number; w: number; h: number };
type Pt = { x: number; y: number };

const NS = "http://www.w3.org/2000/svg";
const OUT = 11; // the sketch sits this far outside the card, like SketchFrame
const STROKES = [
  { w: 2.6, o: 0.95 },
  { w: 1.6, o: 0.7 },
  { w: 1.1, o: 0.45 },
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Points round a rounded rectangle, clockwise, starting at the point nearest `toward`. */
function loop(r: Rect, toward: Pt, step = 6): Pt[] {
  const x0 = r.x - OUT, y0 = r.y - OUT, x1 = r.x + r.w + OUT, y1 = r.y + r.h + OUT;
  const rad = Math.min(26, (x1 - x0) / 4, (y1 - y0) / 4);
  const pts: Pt[] = [];
  const edge = (ax: number, ay: number, bx: number, by: number) => {
    const n = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / step));
    for (let i = 0; i < n; i++) pts.push({ x: ax + ((bx - ax) * i) / n, y: ay + ((by - ay) * i) / n });
  };
  const corner = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i < 8; i++) {
      const a = a0 + (i / 8) * (Math.PI / 2);
      pts.push({ x: cx + Math.cos(a) * rad, y: cy + Math.sin(a) * rad });
    }
  };
  edge(x0 + rad, y0, x1 - rad, y0);
  corner(x1 - rad, y0 + rad, -Math.PI / 2);
  edge(x1, y0 + rad, x1, y1 - rad);
  corner(x1 - rad, y1 - rad, 0);
  edge(x1 - rad, y1, x0 + rad, y1);
  corner(x0 + rad, y1 - rad, Math.PI / 2);
  edge(x0, y1 - rad, x0, y0 + rad);
  corner(x0 + rad, y0 + rad, Math.PI);
  let best = 0, bd = Infinity;
  pts.forEach((p, i) => {
    const d = Math.hypot(p.x - toward.x, p.y - toward.y);
    if (d < bd) (bd = d), (best = i);
  });
  const out = [...pts.slice(best), ...pts.slice(0, best)];
  out.push({ ...out[0] });
  return out;
}

const centre = (r: Rect): Pt => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
const length = (pts: Pt[]) => pts.reduce((s, p, i) => (i ? s + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y) : 0), 0);

export class SketchTrain {
  readonly svg: SVGSVGElement;
  private paths: SVGPathElement[] = [];
  private route: Pt[] = [];
  private lens = { old: 0, bridge: 0, next: 0, total: 0 };
  private seeds: number[] = [];
  private raf = 0;
  private boilAt = 0;

  constructor(host: HTMLElement, color = "var(--ink)") {
    this.svg = document.createElementNS(NS, "svg");
    this.svg.setAttribute("aria-hidden", "true");
    Object.assign(this.svg.style, { position: "absolute", left: "0", top: "0", width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: "2", display: "none" });
    for (const { w, o } of STROKES) {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("fill", "none");
      p.style.stroke = color;
      p.setAttribute("stroke-width", String(w));
      p.setAttribute("stroke-opacity", String(o));
      p.setAttribute("stroke-linecap", "round");
      p.setAttribute("stroke-linejoin", "round");
      this.svg.appendChild(p);
      this.paths.push(p);
    }
    host.appendChild(this.svg);
    this.reseed();
  }

  get running() {
    return this.raf !== 0;
  }

  private reseed() {
    this.seeds = this.paths.map(() => Math.random() * 100);
  }

  /** Run from card `a` to card `b` over `ms`, then call `done`. */
  travel(a: Rect, b: Rect, ms: number, done: () => void) {
    cancelAnimationFrame(this.raf);
    const ca = centre(a), cb = centre(b);
    const oldLoop = loop(a, cb);
    const newLoop = loop(b, ca);
    const exit = oldLoop[0], entry = newLoop[0];
    // the curve across: out of the old card and into the new one, bowing a little so it reads as a path
    const out = { x: exit.x - ca.x, y: exit.y - ca.y };
    const inn = { x: entry.x - cb.x, y: entry.y - cb.y };
    const nOut = Math.hypot(out.x, out.y) || 1, nIn = Math.hypot(inn.x, inn.y) || 1;
    const d = Math.hypot(entry.x - exit.x, entry.y - exit.y) * 0.45 + 40;
    const c1 = { x: exit.x + (out.x / nOut) * d, y: exit.y + (out.y / nOut) * d };
    const c2 = { x: entry.x + (inn.x / nIn) * d, y: entry.y + (inn.y / nIn) * d };
    const bridge: Pt[] = [];
    const n = Math.max(12, Math.round(d / 5));
    for (let i = 1; i < n; i++) {
      const t = i / n, u = 1 - t;
      bridge.push({
        x: u * u * u * exit.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * entry.x,
        y: u * u * u * exit.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * entry.y,
      });
    }
    this.route = [...oldLoop, ...bridge, ...newLoop];
    this.lens.old = length(oldLoop);
    this.lens.next = length(newLoop);
    this.lens.total = length(this.route);
    this.lens.bridge = this.lens.total - this.lens.old - this.lens.next;
    this.svg.style.display = "";
    const t0 = performance.now();
    const frame = () => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      this.draw(ease(k));
      if (k < 1) this.raf = requestAnimationFrame(frame);
      else {
        this.raf = 0;
        this.svg.style.display = "none";
        done();
      }
    };
    this.raf = requestAnimationFrame(frame);
  }

  /** e = 0: the line is the old card's outline; 1: the new card's outline. */
  private draw(e: number) {
    const now = performance.now();
    if (now - this.boilAt > 110) {
      this.boilAt = now;
      this.reseed();
    }
    const { old, next, total } = this.lens;
    const win = old + (next - old) * e; // the train's length: from one outline's to the other's
    const head = win + (total - win) * e; // where the front of the train is along the route
    this.paths.forEach((p, k) => {
      const seed = this.seeds[k];
      let s = 0;
      let d = "";
      this.route.forEach((pt, i) => {
        if (i) s += Math.hypot(pt.x - this.route[i - 1].x, pt.y - this.route[i - 1].y);
        // a pencil wobble across the line, different for each stroke and fresh each boil
        const w = Math.sin(s * 0.021 + seed) * 2.4 + Math.sin(s * 0.057 + seed * 1.7) * 1.1;
        const prev = this.route[Math.max(0, i - 1)], nxt = this.route[Math.min(this.route.length - 1, i + 1)];
        const tx = nxt.x - prev.x, ty = nxt.y - prev.y, tl = Math.hypot(tx, ty) || 1;
        d += `${i ? "L" : "M"}${(pt.x - (ty / tl) * w).toFixed(1)} ${(pt.y + (tx / tl) * w).toFixed(1)}`;
      });
      p.setAttribute("d", d);
      p.setAttribute("pathLength", String(total));
      p.setAttribute("stroke-dasharray", `${win} ${total * 2}`);
      p.setAttribute("stroke-dashoffset", String(-(head - win) - k * 3));
    });
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.svg.remove();
  }
}
