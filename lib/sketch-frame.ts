/**
 * A hand-drawn outline that "boils" (ported from the studio rebuild; there it ringed the hero TV): the sketch is redrawn a few times a second with
 * a fresh wobble, like a pencil line in a hand-drawn cartoon. It follows the TV's tube shape (the same
 * squircle as the shader's tube()) and its size, so it grows and shrinks with the TV.
 */
const SVG = "http://www.w3.org/2000/svg";
const PAD = 40; // px of room around the TV for the sketch
const BOIL_MS = 110;

export class SketchFrame {
  private svg: SVGSVGElement;
  private paths: SVGPathElement[] = [];
  private timer = 0;
  private seeds: number[][] = [];
  private last = { w: 0, h: 0, tvness: 1 };

  /** `color` defaults to the page ink (--ink). */
  constructor(host: HTMLElement, color = "var(--ink)") {
    this.svg = document.createElementNS(SVG, "svg");
    this.svg.setAttribute("aria-hidden", "true");
    Object.assign(this.svg.style, { position: "absolute", left: `${-PAD}px`, top: `${-PAD}px`, overflow: "visible", pointerEvents: "none", zIndex: "1", transition: "opacity 0.3s" });
    // Two strokes that don't quite agree, plus a faint third, like a quick pencil outline.
    [
      { w: 2.6, o: 0.95 },
      { w: 1.6, o: 0.7 },
      { w: 1.1, o: 0.45 },
    ].forEach(({ w, o }) => {
      const p = document.createElementNS(SVG, "path");
      p.setAttribute("fill", "none");
      p.style.stroke = color;
      p.setAttribute("stroke-width", String(w));
      p.setAttribute("stroke-opacity", String(o));
      p.setAttribute("stroke-linecap", "round");
      p.setAttribute("stroke-linejoin", "round");
      this.svg.appendChild(p);
      this.paths.push(p);
    });
    host.appendChild(this.svg);
    this.reseed();
    this.timer = window.setInterval(() => {
      this.reseed();
      this.draw(this.last.w, this.last.h, this.last.tvness);
    }, BOIL_MS);
  }

  private reseed() {
    // per stroke: a start angle, an overshoot, and wobble phases
    this.seeds = this.paths.map(() => [Math.random() * Math.PI * 2, 0.12 + Math.random() * 0.2, Math.random() * 99, Math.random() * 99, Math.random() * 99]);
  }

  /** w, h: the TV's size in px; tvness 1 = curved tube, 0 = flat full screen. */
  draw(w: number, h: number, tvness: number, opacity = 1) {
    this.last = { w, h, tvness };
    this.svg.style.opacity = String(opacity);
    if (!w || !h || opacity <= 0) return;
    this.svg.setAttribute("width", String(w + PAD * 2));
    this.svg.setAttribute("height", String(h + PAD * 2));
    const t = tvness;
    const bx = 1 + (0.93 - 1) * t + 0.035 * t;
    const byTop = 1 + (0.8 - 1) * t + 0.14 * t;
    const byBot = 1 + (0.8 - 1) * t + 0.15 * t;
    const n = 5 / Math.max(t, 0.01);
    const cx = w / 2 + PAD;
    const cy = h / 2 + PAD;
    const out = 11; // the sketch sits just outside the glass
    this.paths.forEach((path, k) => {
      const [a0, over, p1, p2, p3] = this.seeds[k];
      const steps = 120;
      let d = "";
      for (let i = 0; i <= steps; i++) {
        const a = a0 + (i / steps) * Math.PI * 2 * (1 + over);
        const c = Math.cos(a);
        const s = Math.sin(a);
        const ry = s < 0 ? byTop : byBot; // screen y grows downwards: top half uses the top bow
        const ex = Math.sign(c) * Math.pow(Math.abs(c), 2 / n) * (w / 2) * bx;
        const ey = Math.sign(s) * Math.pow(Math.abs(s), 2 / n) * (h / 2) * ry;
        // wobble: slow waves around the outline, each stroke drifting in/out along its length, and the
        // ends flicking outwards like a quick pencil stroke that overshoots
        const u = i / steps;
        const wob = Math.sin(a * 2 + p1) * 4.5 + Math.sin(a * 5 + p2) * 2.4 + Math.sin(a * 11 + p3) * 1.1 + (u - 0.5) * 7 * (k - 1);
        const tail = u < 0.06 ? (0.06 - u) * 260 : u > 0.94 ? (u - 0.94) * 260 : 0;
        const len = Math.hypot(ex, ey) || 1;
        const r = out + wob + tail;
        const x = cx + ex + (ex / len) * r;
        const y = cy + ey + (ey / len) * r;
        d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      path.setAttribute("d", d);
    });
  }

  dispose() {
    clearInterval(this.timer);
    this.svg.remove();
  }
}
