"use client";

import { useEffect } from "react";
import rough from "roughjs/bin/rough";
import type { Drawable } from "roughjs/bin/core";

/* HandFx: the site-wide "hand" on hover (STYLE_GUIDE 0, voice 2). One
   fixed SVG layer
   over the page; pointer events are delegated from the document, so no
   component has to opt in:

   - arrows   any → / ↗ that sits in its own element inside a link: the
              glyph steps aside and a pencil arrow draws itself in its
              place, a different arrow every hover (fresh rough.js seed,
              random bend and head)
   - buttons  every .pill: a pencil loop, box or underline drawn round it
   - links    text links (menus, footer, rows, body copy): a pencil
              underline or a blue marker swipe under the words

   Marks draw on with a dash reveal, follow their element while it
   moves (scroll, hover transforms) and fade when the pointer leaves.
   Ink is the element's own text colour, so blue grounds get white
   pencil and paper gets ink. Fine pointers only; nothing under reduced
   motion. */

const NS = "http://www.w3.org/2000/svg";
const gen = rough.generator();
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

type Mark = { el: Element; anchor: Element; g: SVGGElement; dx: number; dy: number; dead: boolean; timers: number[] };

function pathsOf(d: Drawable, color: string, width: number, fill?: string) {
  const out: SVGPathElement[] = [];
  for (const p of gen.toPaths(d)) {
    const el = document.createElementNS(NS, "path");
    el.setAttribute("d", p.d);
    el.setAttribute("fill", fill && p.fill && p.fill !== "none" ? fill : "none");
    el.setAttribute("stroke", fill && p.fill && p.fill !== "none" ? "none" : color);
    el.setAttribute("stroke-width", String(width));
    el.setAttribute("stroke-linecap", "round");
    el.setAttribute("stroke-linejoin", "round");
    out.push(el);
  }
  return out;
}

/** dash-reveal each path one after another over `ms` */
/** dash-reveal the paths over `ms`: one after another, or (parallel) all at once with a small lag
    each; `done` runs once every stroke is fully drawn */
function drawOn(paths: SVGPathElement[], ms: number, parallel = false, done?: () => void) {
  const lens = paths.map((p) => {
    try {
      return p.getTotalLength();
    } catch {
      return 0;
    }
  });
  const total = lens.reduce((a, b) => a + b, 0) || 1;
  let t = 0;
  paths.forEach((p, i) => {
    if (p.getAttribute("stroke") === "none") {
      p.style.opacity = "0";
      p.style.transition = `opacity ${ms * 0.6}ms ease ${ms * 0.2}ms`;
      requestAnimationFrame(() => (p.style.opacity = "1"));
      return;
    }
    const L = lens[i] + 1;
    const dur = parallel ? ms : (lens[i] / total) * ms;
    const delay = parallel ? i * ms * 0.18 : t;
    p.style.strokeDasharray = `${L} ${L}`;
    p.style.strokeDashoffset = String(L);
    p.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(.45,.1,.25,1) ${delay}ms`;
    t += dur * 0.85;
    requestAnimationFrame(() => requestAnimationFrame(() => (p.style.strokeDashoffset = "0")));
  });
  if (done) {
    const end = parallel ? ms * (1 + (paths.length - 1) * 0.18) : t + ms * 0.15;
    return window.setTimeout(() => {
      // fully drawn: drop the dash so the line can change shape freely (the boil)
      paths.forEach((p) => {
        p.style.transition = "none";
        p.style.strokeDasharray = "none";
      });
      done();
    }, end + 30);
  }
  return 0;
}

/* ---- the marks (coordinates relative to the anchor's top-left) ---- */

function arrowMark(w: number, h: number, diag: boolean, style: string, color: string) {
  const seed = Math.floor(Math.random() * 1e6);
  const o = { seed, roughness: 0.9, bowing: 1.4, disableMultiStroke: true };
  const len = Math.max(18, w * 1.55);
  const cy = h / 2;
  const x0 = w / 2 - len / 2;
  const x1 = w / 2 + len / 2;
  const bend = rnd(-3.5, 3.5);
  let pts: [number, number][];
  if (style === "scribble") {
    // a little curl in the shaft before it shoots off
    const mx = x0 + len * 0.42;
    const r = rnd(3.5, 5.5);
    pts = [
      [x0, cy + bend],
      [mx - r, cy + bend * 0.4],
      [mx, cy - r * 1.6],
      [mx + r * 0.9, cy - r * 0.2],
      [mx - r * 0.4, cy + r * 0.6],
      [mx + r * 1.4, cy],
      [x1, cy + rnd(-1, 1)],
    ];
  } else {
    pts = [
      [x0, cy + bend],
      [(x0 + x1) / 2, cy - bend * 0.6],
      [x1, cy + rnd(-0.8, 0.8)],
    ];
  }
  const head = rnd(5, 7.5);
  const a1 = rnd(0.45, 0.65), a2 = rnd(0.45, 0.65);
  const tip = pts[pts.length - 1];
  const shapes: Drawable[] = [
    gen.curve(pts, o),
    gen.linearPath([[tip[0] - head * Math.cos(a1), tip[1] - head * Math.sin(a1)], tip, [tip[0] - head * Math.cos(a2), tip[1] + head * Math.sin(a2)]], o),
  ];
  const g = document.createElementNS(NS, "g");
  const paths = shapes.flatMap((s) => pathsOf(s, color, 1.6));
  paths.forEach((p) => g.appendChild(p));
  if (diag) g.setAttribute("transform", `rotate(-45 ${w / 2} ${h / 2})`);
  return { g, paths };
}

/* A point on a rounded rectangle (0,0)-(w,h) with corner radius r, at fraction t of its perimeter
   (clockwise from the top-left end of the top edge), with its outward normal. */
function onRoundRect(t: number, w: number, h: number, r: number): [number, number, number, number] {
  const sw = Math.max(0, w - 2 * r), sh = Math.max(0, h - 2 * r), arc = (Math.PI / 2) * r;
  const L = 2 * sw + 2 * sh + 4 * arc;
  let d = (((t % 1) + 1) % 1) * L;
  const corner = (cx: number, cy: number, a0: number, dd: number): [number, number, number, number] => {
    const a = a0 + (r ? dd / r : 0);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, Math.cos(a), Math.sin(a)];
  };
  if (d < sw) return [r + d, 0, 0, -1];
  d -= sw;
  if (d < arc) return corner(w - r, r, -Math.PI / 2, d);
  d -= arc;
  if (d < sh) return [w, r + d, 1, 0];
  d -= sh;
  if (d < arc) return corner(w - r, h - r, 0, d);
  d -= arc;
  if (d < sw) return [w - r - d, h, 0, 1];
  d -= sw;
  if (d < arc) return corner(r, h - r, Math.PI / 2, d);
  d -= arc;
  if (d < sh) return [0, h - r - d, -1, 0];
  d -= sh;
  return corner(r, r, Math.PI, d);
}

/* The hand loop: a pencil line that follows the element's own outline (its real corner radius), a few
   px outside it, starting anywhere and running past its start like a quick hand circle. `boil` gives
   the same loop a fresh wobble, so it can be redrawn a few times a second while it stays up. */
function shapeLoop(w: number, h: number, radius: number) {
  // a hair of radius even on square corners, so the line wraps the corner instead of cutting across
  const r = Math.max(3, Math.min(radius, w / 2, h / 2));
  const pad = rnd(7, 10);
  const t0 = Math.random();
  const over = rnd(0.12, 0.22); // how far past the start the hand carries on
  const drift = rnd(3, 6); // the overshoot lands a little outside the first pass
  const N = 240;
  return (seedA = Math.random() * 99, seedB = Math.random() * 99) => {
    let d = "";
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const t = t0 + u * (1 + over);
      const [x, y, nx, ny] = onRoundRect(t, w, h, r);
      const tail = u > 1 / (1 + over) ? ((u - 1 / (1 + over)) / (over / (1 + over))) * drift : 0;
      const wob = Math.sin(u * 13 + seedA) * 1.6 + Math.sin(u * 29 + seedB) * 0.8;
      const o = pad + wob + tail;
      d += `${i ? "L" : "M"}${(x + nx * o).toFixed(1)} ${(y + ny * o).toFixed(1)}`;
    }
    return d;
  };
}

function buttonMark(w: number, h: number, style: string, color: string, radius = 0) {
  const seed = Math.floor(Math.random() * 1e6);
  const g = document.createElementNS(NS, "g");
  let shapes: Drawable[] = [];
  if (style === "circle") {
    // the loop takes the button's own shape (square corners stay square, pills stay round): a firm
    // stroke plus a fainter second pass, both re-wobbling while the mark is up
    const loop = shapeLoop(w, h, radius);
    const paths = [
      { width: 2, opacity: 1 },
      { width: 1.2, opacity: 0.5 },
    ].map(({ width, opacity }) => {
      const el = document.createElementNS(NS, "path");
      el.setAttribute("d", loop());
      el.setAttribute("fill", "none");
      el.setAttribute("stroke", color);
      el.setAttribute("stroke-width", String(width));
      el.setAttribute("stroke-opacity", String(opacity));
      el.setAttribute("stroke-linecap", "round");
      el.setAttribute("stroke-linejoin", "round");
      g.appendChild(el);
      return el;
    });
    const boil = () => paths.forEach((el) => el.setAttribute("d", loop()));
    return { g, paths, boil, sequential: false };
  } else if (style === "box") {
    const p = rnd(5, 8);
    shapes = [gen.rectangle(-p, -p, w + p * 2, h + p * 2, { seed, roughness: 1.3, bowing: 1.5 })];
  } else {
    const y = h + rnd(5, 8);
    shapes = [
      gen.curve([[-4, y], [w * 0.5, y + rnd(-2, 2)], [w + 6, y - rnd(0, 3)]], { seed, roughness: 0.8, bowing: 1.5, disableMultiStroke: true }),
      gen.curve([[w * 0.1, y + 4], [w * 0.6, y + 3 + rnd(-1.5, 1.5)], [w * 0.95, y + 2]], { seed: seed + 1, roughness: 0.8, bowing: 1.5, disableMultiStroke: true }),
    ];
  }
  const paths = shapes.flatMap((s) => pathsOf(s, color, 1.8));
  paths.forEach((p) => g.appendChild(p));
  return { g, paths, boil: undefined as (() => void) | undefined, sequential: true };
}

function linkMark(w: number, h: number, style: string, color: string) {
  const seed = Math.floor(Math.random() * 1e6);
  const g = document.createElementNS(NS, "g");
  let paths: SVGPathElement[];
  if (style === "marker") {
    const shape = gen.polygon(
      [[-3, h * 0.55 + rnd(-1, 1)], [w + 3, h * 0.5 + rnd(-1, 1)], [w + 2, h * 0.98], [-2, h * 1.02]],
      { seed, roughness: 1.4, fill: "#0657F9", fillStyle: "zigzag", hachureGap: 2.6, fillWeight: 2.2, hachureAngle: rnd(-50, -30), stroke: "none" },
    );
    // keep only the zigzag fill strokes (the outline is stroke "none")
    paths = gen
      .toPaths(shape)
      .filter((p) => p.stroke !== "none")
      .map((p) => {
        const el = document.createElementNS(NS, "path");
        el.setAttribute("d", p.d);
        el.setAttribute("fill", "none");
        el.setAttribute("stroke", "#0657F9");
        el.setAttribute("stroke-width", "2.2");
        el.setAttribute("stroke-linecap", "round");
        el.setAttribute("opacity", "0.3");
        return el;
      });
  } else {
    const y = h + rnd(1, 3);
    paths = pathsOf(
      gen.curve([[-2, y + rnd(-1, 1)], [w * 0.45, y + rnd(-1.5, 1.5)], [w + 3, y + rnd(-2, 1)]], { seed, roughness: 0.7, bowing: 1.2, disableMultiStroke: true }),
      color,
      1.5,
    );
  }
  paths.forEach((p) => g.appendChild(p));
  return { g, paths };
}

/* ---- the layer ---------------------------------------------------- */

function isArrow(el: Element) {
  const t = el.textContent?.trim();
  return el.children.length === 0 && (t === "→" || t === "↗");
}

export function HandFx() {
  /* the looks, settled 2026-10-09 when the review toggles were retired:
     pencil arrows, a pencil loop round buttons, a pencil underline under
     text links (sections with display-size link names opt out with
     data-hand-off) */
  const arrows: string = "sketch";
  const buttons: string = "circle";
  const links: string = "underline";

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("aria-hidden", "true");
    Object.assign(svg.style, { position: "fixed", inset: "0", width: "100vw", height: "100vh", pointerEvents: "none", zIndex: "85", overflow: "visible" });
    document.body.appendChild(svg);

    const marks = new Map<Element, Mark[]>();
    const hidden = new Set<HTMLElement>();

    const add = (
      host: Element,
      anchor: Element,
      made: { g: SVGGElement; paths: SVGPathElement[]; boil?: () => void; sequential?: boolean },
      ms: number,
    ) => {
      const r = anchor.getBoundingClientRect();
      const m: Mark = { el: host, anchor, g: made.g, dx: 0, dy: 0, dead: false, timers: [] };
      made.g.style.transition = "opacity 220ms ease";
      made.g.setAttribute("transform", `translate(${r.left} ${r.top}) ${made.g.getAttribute("transform") ?? ""}`);
      m.dx = r.left;
      m.dy = r.top;
      const wrap = document.createElementNS(NS, "g");
      wrap.appendChild(made.g);
      m.g = wrap;
      svg.appendChild(wrap);
      if (made.boil) {
        // draw the loop on, then keep it boiling (a fresh wobble ~8 times a second) while it is up
        const boil = made.boil;
        m.timers.push(
          drawOn(made.paths, ms, true, () => {
            if (!m.dead) m.timers.push(window.setInterval(boil, 120));
          }),
        );
      } else drawOn(made.paths, ms);
      const list = marks.get(host) ?? [];
      list.push(m);
      marks.set(host, list);
    };

    const enter = (host: HTMLElement) => {
      if (marks.has(host)) return;
      const color = getComputedStyle(host).color;
      // arrows inside this link
      if (arrows !== "brad") {
        host.querySelectorAll<HTMLElement>("span, div, i").forEach((a) => {
          if (!isArrow(a)) return;
          const r = a.getBoundingClientRect();
          if (!r.width) return;
          const diag = a.textContent!.trim() === "↗";
          const made = arrowMark(r.width, r.height, diag, arrows, getComputedStyle(a).color);
          a.style.transition = "opacity 120ms";
          a.style.opacity = "0";
          hidden.add(a);
          add(host, a, made, 300);
        });
      }
      if (host.classList.contains("pill")) {
        if (buttons !== "brad") {
          const r = host.getBoundingClientRect();
          const ink = getComputedStyle(host.parentElement ?? host).color;
          const radius = parseFloat(getComputedStyle(host).borderTopLeftRadius) || 0;
          add(host, host, buttonMark(r.width, r.height, buttons, ink, radius), buttons === "circle" ? 760 : 420);
        }
        return;
      }
      if (links !== "brad") {
        // underline the words, not the whole row: the first text-bearing child
        const words =
          [...host.querySelectorAll<HTMLElement>("span, h3, p")].find((c) => !isArrow(c) && c.textContent!.trim().length > 1 && c.children.length === 0) ??
          host;
        const r = words.getBoundingClientRect();
        if (r.width > 4 && r.width < window.innerWidth * 0.9) add(host, words, linkMark(r.width, r.height, links, color), 320);
      }
    };

    const leave = (host: HTMLElement) => {
      const list = marks.get(host);
      if (!list) return;
      marks.delete(host);
      host.querySelectorAll<HTMLElement>("span, div, i").forEach((a) => {
        if (hidden.has(a)) {
          a.style.opacity = "";
          hidden.delete(a);
        }
      });
      list.forEach((m) => {
        m.dead = true;
        m.timers.forEach((t) => (clearTimeout(t), clearInterval(t)));
        m.g.style.transition = "opacity 220ms ease";
        m.g.style.opacity = "0";
        setTimeout(() => m.g.remove(), 260);
      });
    };

    const target = (e: Event) => (e.target as Element | null)?.closest?.("a, button.pill, [role='button']") as HTMLElement | null;
    const skip = (el: HTMLElement) => !!el.closest("[data-hand-off]");
    const onOver = (e: PointerEvent) => {
      const t = target(e);
      if (t && !skip(t)) enter(t);
    };
    const onOut = (e: PointerEvent) => {
      const t = target(e);
      if (!t) return;
      const to = e.relatedTarget as Node | null;
      if (to && t.contains(to)) return;
      leave(t);
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);

    // marks ride their anchors (scroll, hover transforms)
    let raf = 0;
    const follow = () => {
      raf = requestAnimationFrame(follow);
      marks.forEach((list) =>
        list.forEach((m) => {
          if (m.dead) return;
          const r = m.anchor.getBoundingClientRect();
          m.g.setAttribute("transform", `translate(${r.left - m.dx} ${r.top - m.dy})`);
        }),
      );
    };
    follow();
    const clear = () => [...marks.keys()].forEach((k) => leave(k as HTMLElement));
    window.addEventListener("blur", clear);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", clear);
      clear();
      hidden.forEach((a) => (a.style.opacity = ""));
      svg.remove();
    };
  }, [arrows, buttons, links]);

  return null;
}
