"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import rough from "roughjs/bin/rough";

/* Every [data-strike] line (the
   homepage's "most agencies" list) gets a blue pencil strike-through
   when it scrolls into view, one line after another: the page crossing
   out what the agency refuses to do. One stroke per wrapped text line,
   a fresh rough.js seed each, drawn on with a dash reveal. */

const NS = "http://www.w3.org/2000/svg";
const gen = rough.generator();

function strike(el: HTMLElement, delay: number) {
  if (el.querySelector(":scope > svg[data-strike-svg]")) return;
  const box = el.getBoundingClientRect();
  const range = document.createRange();
  range.selectNodeContents(el);
  const lines = [...range.getClientRects()].filter((r) => r.width > 4);
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("data-strike-svg", "");
  svg.setAttribute("aria-hidden", "true");
  Object.assign(svg.style, { position: "absolute", left: "0", top: "0", width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" });
  if (getComputedStyle(el).position === "static") el.style.position = "relative";
  let t = delay;
  lines.forEach((r, i) => {
    const y = r.top - box.top + r.height * (0.52 + (Math.random() - 0.5) * 0.08);
    const x0 = r.left - box.left - 4, x1 = r.right - box.left + 6;
    const d = gen.curve(
      [[x0, y + (Math.random() - 0.5) * 3], [(x0 + x1) / 2, y + (Math.random() - 0.5) * 3], [x1, y + (Math.random() - 0.5) * 4]],
      { seed: Math.floor(Math.random() * 1e6) + i, roughness: 0.8, bowing: 1.3, disableMultiStroke: true },
    );
    for (const p of gen.toPaths(d)) {
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", p.d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "var(--acc)");
      path.setAttribute("stroke-width", "2.2");
      path.setAttribute("stroke-linecap", "round");
      svg.appendChild(path);
      const L = path.getTotalLength?.() ?? 400;
      const ms = Math.max(260, L * 1.4);
      path.style.strokeDasharray = `${L + 1} ${L + 1}`;
      path.style.strokeDashoffset = String(L + 1);
      path.style.transition = `stroke-dashoffset ${ms}ms cubic-bezier(.4,.1,.3,1) ${t}ms`;
      requestAnimationFrame(() => requestAnimationFrame(() => (path.style.strokeDashoffset = "0")));
      t += ms * 0.8;
    }
  });
  el.appendChild(svg);
  // the line is crossed out: anything waiting on it (ProblemStrip's pen fix) can follow
  window.setTimeout(() => el.setAttribute("data-struck", ""), t);
}

export function ScrollStrike() {
  const pathname = usePathname();

  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("[data-strike]")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let order = 0;
    const io = new IntersectionObserver(
      (entries) => {
        const hits = entries.filter((e) => e.isIntersecting);
        hits.forEach((e, i) => {
          io.unobserve(e.target);
          strike(e.target as HTMLElement, 350 + i * 420 + (order++ % 2) * 0);
        });
      },
      { rootMargin: "0px 0px -25% 0px" },
    );
    // the list exists twice (mobile + desktop layouts): only watch the visible copy
    els.filter((e) => e.offsetParent !== null).forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
