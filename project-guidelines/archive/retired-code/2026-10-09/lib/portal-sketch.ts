import rough from "roughjs/bin/rough";

/* The portal window drawn in blue pencil before it builds (review
   toggle lib/lab "portal"). It traces the REAL window's boxes (frame,
   chrome bar, rail, metric cards, panels), which already have their
   layout while the window is still clipped away, so the sketch lines up
   exactly with the window that replaces it. Redrawn with a fresh seed a
   few times a second so the lines boil like the rest of the hand. */

const NS = "http://www.w3.org/2000/svg";
const BOIL_MS = 130;
const PAD = 24;

type Box = { x: number; y: number; w: number; h: number; r: number };

export class PortalSketch {
  private svg: SVGSVGElement;
  private gen = rough.generator();
  private boxes: Box[] = [];
  private lines: [number, number, number, number][] = [];
  private size = { w: 0, h: 0 };
  private timer = 0;
  private measuredAt = 0;
  private opacity = 0;

  constructor(host: HTMLElement, private frame: HTMLElement, private color = "var(--acc)") {
    this.svg = document.createElementNS(NS, "svg");
    this.svg.setAttribute("aria-hidden", "true");
    Object.assign(this.svg.style, {
      position: "absolute",
      left: `${-PAD}px`,
      top: `${-PAD}px`,
      overflow: "visible",
      pointerEvents: "none",
      opacity: "0",
    });
    host.appendChild(this.svg);
    this.timer = window.setInterval(() => this.render(), BOIL_MS);
  }

  private measure() {
    const f = this.frame.getBoundingClientRect();
    if (!f.width) return;
    const rel = (el: Element, r = 10): Box => {
      const b = el.getBoundingClientRect();
      return { x: b.left - f.left, y: b.top - f.top, w: b.width, h: b.height, r };
    };
    this.size = { w: f.width, h: f.height };
    this.boxes = [{ x: 0, y: 0, w: f.width, h: f.height, r: 24 }];
    this.lines = [];
    const bar = this.frame.querySelector("[data-portal-bar]");
    if (bar) {
      const b = rel(bar);
      this.lines.push([0, b.y + b.h, f.width, b.y + b.h]);
    }
    // the rail's divider, then every card and panel inside the body
    this.frame.querySelectorAll<HTMLElement>(".border-r").forEach((el) => {
      const b = rel(el);
      if (b.w > 0 && b.h > 40) this.lines.push([b.x + b.w, b.y, b.x + b.w, b.y + b.h]);
    });
    this.frame.querySelectorAll<HTMLElement>('[class*="rounded-[12px]"]').forEach((el) => {
      const b = rel(el);
      if (b.w > 24 && b.h > 24) this.boxes.push(b);
    });
    this.measuredAt = performance.now();
  }

  private roundRectPath({ x, y, w, h, r }: Box) {
    const k = Math.min(r, w / 2, h / 2);
    return `M${x + k} ${y} H${x + w - k} Q${x + w} ${y} ${x + w} ${y + k} V${y + h - k} Q${x + w} ${y + h} ${x + w - k} ${y + h} H${x + k} Q${x} ${y + h} ${x} ${y + h - k} V${y + k} Q${x} ${y} ${x + k} ${y} Z`;
  }

  private render() {
    if (this.opacity <= 0.001) return;
    if (performance.now() - this.measuredAt > 600) this.measure();
    const { w, h } = this.size;
    if (!w) return;
    this.svg.setAttribute("width", String(w + PAD * 2));
    this.svg.setAttribute("height", String(h + PAD * 2));
    const seed = Math.floor(Math.random() * 1e6);
    const opts = (i: number, weight: number) => ({
      seed: seed + i,
      roughness: 1.1,
      bowing: 1.2,
      stroke: "#000",
      strokeWidth: weight,
      disableMultiStroke: false,
    });
    const shapes = [
      ...this.boxes.map((b, i) =>
        this.gen.path(this.roundRectPath({ ...b, x: b.x + PAD, y: b.y + PAD }), opts(i, i === 0 ? 2 : 1.3)),
      ),
      ...this.lines.map(([x1, y1, x2, y2], i) =>
        this.gen.line(x1 + PAD, y1 + PAD, x2 + PAD, y2 + PAD, opts(100 + i, 1.5)),
      ),
    ];
    const frag = document.createDocumentFragment();
    for (const s of shapes) {
      for (const p of this.gen.toPaths(s)) {
        const el = document.createElementNS(NS, "path");
        el.setAttribute("d", p.d);
        el.setAttribute("fill", "none");
        el.setAttribute("stroke-width", String(p.strokeWidth));
        el.setAttribute("stroke-linecap", "round");
        el.style.stroke = this.color;
        frag.appendChild(el);
      }
    }
    this.svg.replaceChildren(frag);
  }

  /** 0 hides the sketch, 1 shows it; call every frame. */
  set(opacity: number) {
    const was = this.opacity;
    this.opacity = opacity;
    this.svg.style.opacity = String(opacity);
    if (was <= 0.001 && opacity > 0.001) this.render();
  }

  dispose() {
    clearInterval(this.timer);
    this.svg.remove();
  }
}
