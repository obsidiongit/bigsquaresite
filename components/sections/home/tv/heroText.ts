/* What the hero statement does while the TV grows over it (formerly review toggle "heroText"):

   deflect  the text parts round the TV line by line, like a curtain: on every line the TV crosses, the
            words left of it slide left as a group and the words right of it slide right, so nothing
            overlaps; each word trails its neighbour a touch (a ripple) and tilts with its speed, and the
            groups are pushed off screen once the TV fills it
   lower    the statement steps aside and comes back ON the TV as a caption bar (a lower third), so it
            stays readable over the video; it clears when the push into the dot begins
   fade     the statement lifts and fades as the TV grows
   brad     nothing: the TV simply grows over the text
   lines    each line slips down out of its own slot (a mask fixed where the line sits), top line
            first: the site's baseline reveal, played backwards and scrubbed by the scroll
   squares  each word breaks into blue squares the way the TV does at the end of the push: longer
            words split into two to four pieces, each fills in from its own side, pulls into a square,
            and drifts off its own way (mostly up, toward the TV) with a turn, shrinking or popping;
            line by line from the top, centre-out, with every piece on its own clock
   part     deflect, softened for wide screens: the words part a little way, then fade out instead of
            being pushed off the edge of the screen

   Driven by TvHero's scroll update: `update` gets the grow (g) and push (p) progress and the TV's box
   in viewport px. Layout is only read in `measure` (on start and resize), never per frame. */

export type HeroTextMode = "deflect" | "lower" | "fade" | "brad" | "lines" | "squares" | "part";
type Tv = { cx: number; cy: number; w: number; h: number };
type Word = {
  el: HTMLElement;
  x: number;
  y: number;
  w: number;
  h: number;
  tx: number;
  ty: number;
  cx: number;
  cy: number;
  vx: number;
  k: number;
  line: number;
  /** 0-based line order, top to bottom (lines mode) */
  li: number;
  /** 0..1 order of going, nearest the TV first (squares mode) */
  rank: number;
  /** opacity, current and target (part mode) */
  o: number;
  to: number;
  /** the blue pieces (squares mode) */
  sq?: Piece[];
  /** squares mode: this word's start jitter and length on the scroll */
  jit: number;
  dur: number;
};
/** one blue piece of a word in squares mode; every number is fixed per piece when the mode starts */
type Piece = {
  el: HTMLElement;
  /** the side it fills in from: 0 left, 1 right, 2 top, 3 bottom */
  dir: number;
  /** its own delay into the fill and into the pull (shares of the word's time) */
  dj: number;
  ej: number;
  /** final square side, as a share of the smaller of its segment's sides */
  side: number;
  /** where it drifts (in word heights) and how far it turns (deg) */
  dx: number;
  dy: number;
  rot: number;
  /** pops (swells, then vanishes) instead of shrinking away */
  pop: boolean;
  tone: number;
};

/* deterministic per (word, piece, use) so the break-up is the same every time you scroll it */
function rnd(...k: number[]) {
  const x = Math.sin(k.reduce((a, v, i) => a + v * (12.9898 + i * 78.233), 0)) * 43758.5453;
  return x - Math.floor(x);
}
const ORIGIN = ["left center", "right center", "center top", "center bottom"];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const MARGIN = 22; // px the words keep clear of the TV
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export class HeroText {
  private words: Word[] = [];
  private raf = 0;
  mode: HeroTextMode = "deflect";

  constructor(
    private header: HTMLElement,
    private caption: HTMLElement,
  ) {}

  /** rest positions of every word (document coords), read with no transforms applied */
  measure() {
    const els = [...this.header.querySelectorAll<HTMLElement>("[data-w]")];
    els.forEach((el) => (el.style.transform = ""));
    const sy = window.scrollY;
    const blocks = new Map(this.words.map((w) => [w.el, w.sq]));
    this.words = els.map((el) => {
      const r = el.getBoundingClientRect();
      return { el, x: r.left + r.width / 2, y: r.top + r.height / 2 + sy, w: r.width, h: r.height, tx: 0, ty: 0, cx: 0, cy: 0, vx: 0, k: 0.2, line: Math.round(r.top + sy), li: 0, rank: 0, o: 1, to: 1, sq: blocks.get(el), jit: 0, dur: 0.12 };
    });
    // line order, with a few px of slack: the circled word sits a hair off its line
    const tops = [...new Set(this.words.map((w) => w.line))].sort((a, b) => a - b);
    const lineOf: number[] = [];
    tops.forEach((t, i) => lineOf.push(i && t - tops[i - 1] < 8 ? lineOf[i - 1] : i ? lineOf[i - 1] + 1 : 0));
    this.words.forEach((w) => (w.li = lineOf[tops.indexOf(w.line)]));
    // squares sweep line by line from the top (the TV sits above), centre-out within a line
    const cx = innerWidth / 2;
    const key = (w: Word) => w.li + (0.8 * Math.abs(w.x - cx)) / (innerWidth / 2);
    const order = [...this.words].sort((a, b) => key(a) - key(b));
    order.forEach((w, i) => (w.rank = order.length > 1 ? i / (order.length - 1) : 0));
    this.words.forEach((w, i) => {
      w.jit = (rnd(i, 1) - 0.5) * 0.04;
      w.dur = 0.09 + rnd(i, 2) * 0.06;
    });
  }

  setMode(mode: HeroTextMode) {
    this.mode = mode;
    this.header.style.opacity = "";
    this.header.style.transform = "";
    this.caption.style.opacity = "0";
    this.words.forEach((w) => {
      w.tx = w.ty = w.cx = w.cy = 0;
      w.o = w.to = 1;
      Object.assign(w.el.style, { transform: "", opacity: "", clipPath: "", color: "" });
      w.el.querySelector("svg")?.style.removeProperty("opacity");
      w.sq?.forEach((q) => q.el.remove());
      w.sq = undefined;
    });
    if (mode !== "squares") return;
    this.words.forEach((w, i) => {
      // the pieces sit on the word's own box, so they follow the word wherever layout puts it
      w.el.style.position = "relative";
      const n = Math.max(1, Math.min(4, Math.round(w.w / (w.h * 1.15))));
      w.sq = Array.from({ length: n }, (_, j) => {
        const el = document.createElement("i");
        el.setAttribute("aria-hidden", "true");
        const r = (k: number) => rnd(i, j, k);
        const piece: Piece = {
          el,
          dir: Math.floor(r(3) * 4),
          dj: r(4) * 0.18,
          ej: r(5) * 0.12,
          side: 0.42 + r(6) * 0.42,
          dx: (r(7) - 0.5) * 1.8,
          dy: -0.25 - r(8) * 1.1,
          rot: (r(9) - 0.5) * 140,
          pop: r(10) < 0.38,
          tone: r(11) < 0.25 ? 0.55 + r(12) * 0.25 : 1,
        };
        Object.assign(el.style, {
          position: "absolute",
          left: `calc(${(j * 100) / n}% + ${j ? 1 : 0}px)`,
          top: "11%",
          width: `calc(${100 / n}% - ${j ? 1 : 0}px)`,
          height: "78%",
          background: "var(--acc)",
          borderRadius: "3px",
          opacity: "1",
          transformOrigin: ORIGIN[piece.dir],
          transform: piece.dir < 2 ? "scaleX(0)" : "scaleY(0)",
          pointerEvents: "none",
        });
        w.el.appendChild(el);
        return piece;
      });
    });
  }

  update(g: number, p: number, tv: Tv) {
    const h = this.header.style;
    if (this.mode === "fade") {
      const k = span(g, 0, 0.28);
      h.opacity = String(1 - k);
      h.transform = `translateY(${(-k * 48).toFixed(1)}px)`;
      return;
    }
    if (this.mode === "lower") {
      const out = span(g, 0.04, 0.2);
      h.opacity = String(1 - out);
      h.transform = `translateY(${(out * 24).toFixed(1)}px)`;
      this.caption.style.opacity = String(span(g, 0.14, 0.32) * (1 - span(p, 0, 0.18)));
      return;
    }
    if (this.mode === "lines") {
      for (const w of this.words) {
        const t = smooth(span(g, 0.01 + w.li * 0.045, 0.13 + w.li * 0.045));
        const d = t * w.h * 1.1;
        // the slot stays where the line sits: the clip's bottom edge rises as the word sinks. Room
        // above and to the sides for the pencil circle round "count."; almost none below, or a
        // sinking line would show over the line beneath it (the display leading is tight)
        const pad = w.h * 0.6;
        const below = w.h * 0.06;
        w.el.style.transform = t ? `translateY(${d.toFixed(1)}px)` : "";
        w.el.style.clipPath = t ? `inset(${-pad}px ${-pad}px ${(d - below).toFixed(1)}px ${-pad}px)` : "";
        w.el.style.opacity = t > 0.7 ? String(1 - span(t, 0.7, 1)) : "";
      }
      return;
    }
    if (this.mode === "squares") {
      for (const w of this.words) {
        const pieces = w.sq;
        if (!pieces) continue;
        const start = 0.01 + w.rank * 0.17 + w.jit;
        const t = span(g, start, start + w.dur);
        // 1. every piece fills its segment from its own side, on its own delay; once all are in,
        //    the word underneath is gone  2. each pulls into a square and starts to drift
        //    3. it keeps drifting and turning, and shrinks away or pops
        const covered = t >= 0.42;
        w.el.style.color = covered ? "transparent" : "";
        const circle = w.el.querySelector("svg");
        if (circle) circle.style.opacity = String(1 - smooth(span(t, 0, 0.3)));
        const segW = w.w / pieces.length;
        const bh = w.h * 0.78;
        for (const q of pieces) {
          const st = q.el.style;
          if (!covered) {
            const f = smooth(span(t, q.dj, q.dj + 0.24));
            st.transformOrigin = ORIGIN[q.dir];
            st.transform = q.dir < 2 ? `scaleX(${f.toFixed(3)})` : `scaleY(${f.toFixed(3)})`;
            // solid while it hides the word; the lighter tones only show once it lifts off
            st.opacity = "1";
            continue;
          }
          const pull = smooth(span(t, 0.42 + q.ej, 0.62 + q.ej));
          const gone = span(t, 0.62 + q.ej, 1);
          const m = smooth(span(t, 0.42 + q.ej, 1));
          const side = Math.min(segW, bh) * q.side;
          let k = 1;
          let o = lerp(1, q.tone, m);
          if (q.pop) {
            k = gone < 0.35 ? 1 + 0.35 * smooth(gone / 0.35) : 1.35 * (1 - smooth((gone - 0.35) / 0.65));
            o *= 1 - span(gone, 0.45, 1);
          } else k = 1 - smooth(gone);
          const sx = lerp(1, side / segW, pull) * k;
          const sy = lerp(1, side / bh, pull) * k;
          st.transformOrigin = "center";
          st.transform = `translate(${(q.dx * w.h * m).toFixed(1)}px, ${(q.dy * w.h * m).toFixed(1)}px) rotate(${(q.rot * m).toFixed(1)}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
          st.opacity = o.toFixed(3);
        }
      }
      return;
    }
    if (this.mode !== "deflect" && this.mode !== "part") return;
    const soft = this.mode === "part";
    // part: how far a group may travel before it has faded out instead
    const CAP = Math.min(110, innerWidth * 0.06);

    // per line: if the TV (plus a margin) spans the line's height, the words left of its centre move
    // left together just far enough to clear its left edge, the ones right of it move right
    const sy = window.scrollY;
    const left = tv.cx - tv.w / 2 - MARGIN;
    const right = tv.cx + tv.w / 2 + MARGIN;
    const top = tv.cy - tv.h / 2 - MARGIN;
    const bottom = tv.cy + tv.h / 2 + MARGIN;
    const lines = new Map<number, Word[]>();
    for (const w of this.words) (lines.get(w.line) ?? lines.set(w.line, []).get(w.line)!).push(w);
    for (const ws of lines.values()) {
      const y = ws[0].y - sy;
      const hit = y + ws[0].h / 2 > top && y - ws[0].h / 2 < bottom;
      const L = ws.filter((w) => w.x < tv.cx).sort((a, b) => b.x - a.x); // nearest the TV first
      const R = ws.filter((w) => w.x >= tv.cx).sort((a, b) => a.x - b.x);
      let shiftL = hit && L.length ? Math.min(0, left - (L[0].x + L[0].w / 2)) : 0;
      let shiftR = hit && R.length ? Math.max(0, right - (R[0].x - R[0].w / 2)) : 0;
      let fadeL = 1;
      let fadeR = 1;
      if (soft) {
        // travel a little, then fade: the further the TV would push them, the fainter they get
        fadeL = 1 - span(-shiftL, CAP * 0.35, CAP * 1.8);
        fadeR = 1 - span(shiftR, CAP * 0.35, CAP * 1.8);
        shiftL = Math.max(shiftL, -CAP);
        shiftR = Math.min(shiftR, CAP);
      }
      // the word touching the TV reacts fastest; the ones further out follow a beat later
      L.forEach((w, i) => ((w.tx = shiftL), (w.ty = soft ? (1 - fadeL) * -10 : 0), (w.to = fadeL), (w.k = 0.24 / (1 + i * 0.18))));
      R.forEach((w, i) => ((w.tx = shiftR), (w.ty = soft ? (1 - fadeR) * -10 : 0), (w.to = fadeR), (w.k = 0.24 / (1 + i * 0.18))));
    }
    if (!this.raf) this.raf = requestAnimationFrame(this.spring);
  }

  /** the words chase their targets with a little spring, tilting as they go */
  private spring = () => {
    this.raf = 0;
    let moving = false;
    for (const w of this.words) {
      const nx = w.cx + (w.tx - w.cx) * w.k;
      w.vx = nx - w.cx;
      w.cx = nx;
      w.cy += (w.ty - w.cy) * w.k;
      w.o += (w.to - w.o) * w.k;
      if (Math.abs(w.tx - w.cx) > 0.3 || Math.abs(w.ty - w.cy) > 0.3 || Math.abs(w.to - w.o) > 0.005) moving = true;
      w.el.style.opacity = w.o > 0.995 ? "" : w.o.toFixed(3);
      // tilt with the speed it is travelling, settling flat when it stops
      const rot = Math.max(-10, Math.min(10, w.vx * 0.35));
      w.el.style.transform =
        Math.abs(w.cx) < 0.2 && Math.abs(w.cy) < 0.2 ? "" : `translate(${w.cx.toFixed(1)}px, ${w.cy.toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`;
    }
    if (moving) this.raf = requestAnimationFrame(this.spring);
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.words.forEach((w) => w.sq?.forEach((q) => q.el.remove()));
  }
}
