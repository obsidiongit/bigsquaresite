"use client";

import { useEffect, type RefObject } from "react";
import { SketchFrame } from "@/lib/sketch-frame";
import { SketchTrain } from "@/lib/sketch-train";

/* The pencil that follows the cursor across the Featured work grid
   (STYLE_GUIDE 6.12, "the hand"). Hover a card and a boiling pencil
   outline rings its media; move to another card and the line unwinds
   off the old one, runs across the gap and winds round the new one
   like a train (lib/sketch-train). Leave the grid and it fades out.

   Restraint: it only exists while the pointer is over the grid, so it
   is the viewport's one hand-drawn mark, never a resting decoration.
   Ink is --sec-ink, which the grid already crossfades to on-accent
   white over the blue work panel. Fine pointers only; reduced motion
   gets nothing. */

const TRAVEL_MS = 900;

export function useWorkSketch(gridRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !enabled) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const ink = "var(--sec-ink)";
    const host = document.createElement("div");
    Object.assign(host.style, {
      position: "absolute",
      left: "0",
      top: "0",
      width: "0",
      height: "0",
      zIndex: "2",
      pointerEvents: "none",
      opacity: "0",
      transition: "opacity 0.25s",
    });
    grid.appendChild(host);
    const sketch = new SketchFrame(host, ink);
    const train = new SketchTrain(grid, ink);

    const aim = (el: HTMLElement) => {
      const g = grid.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { x: r.left - g.left, y: r.top - g.top, w: r.width, h: r.height };
    };

    let target: HTMLElement | null = null;
    let pending: HTMLElement | null = null;
    let inside = false;

    const place = () => {
      if (!target) return;
      const t = aim(target);
      host.style.transform = `translate3d(${t.x}px, ${t.y}px, 0)`;
      sketch.draw(t.w, t.h, 0.04, 1);
    };

    const go = (m: HTMLElement) => {
      const from = target!;
      target = m;
      host.style.visibility = "hidden";
      train.travel(aim(from), aim(m), TRAVEL_MS, () => {
        host.style.visibility = "";
        place();
        if (pending && pending !== target && inside) {
          const next = pending;
          pending = null;
          go(next);
        } else pending = null;
      });
    };

    const onEnter = (e: Event) => {
      const m = (e.currentTarget as HTMLElement).firstElementChild as HTMLElement | null;
      if (!m) return;
      if (!target || host.style.opacity === "0") {
        // first card (or back after leaving): the sketch simply appears round it
        target = m;
        place();
        host.style.opacity = "1";
      } else if (train.running) pending = m;
      else if (m !== target) go(m);
    };
    const onGridEnter = () => (inside = true);
    const onGridLeave = () => {
      inside = false;
      pending = null;
      host.style.opacity = "0";
    };

    const cards = [...grid.querySelectorAll<HTMLElement>('a[href^="/results/"]')];
    cards.forEach((c) => c.addEventListener("pointerenter", onEnter));
    grid.addEventListener("pointerenter", onGridEnter);
    grid.addEventListener("pointerleave", onGridLeave);

    // keep the resting sketch on its card through scroll, resize and the boil
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (host.style.opacity !== "0" && !train.running) place();
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      cards.forEach((c) => c.removeEventListener("pointerenter", onEnter));
      grid.removeEventListener("pointerenter", onGridEnter);
      grid.removeEventListener("pointerleave", onGridLeave);
      train.dispose();
      sketch.dispose();
      host.remove();
    };
  }, [gridRef, enabled]);
}
