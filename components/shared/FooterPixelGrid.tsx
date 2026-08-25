"use client";

import { useEffect, useRef, useState } from "react";

/* Paint-the-footer pixel grid (shared/footer.md v3): the 7.6 pixel-trail
   signature debuts here, footer-scoped. A 24-column grid of square cells
   sits between the dark ground and the content; the cell under the
   pointer lights --accondark and fades back over ~700ms, so the cursor
   paints the footer. The layer is inert (pointer-events none,
   aria-hidden): one pointermove listener on the footer element maps the
   position to a cell and JS only flips opacity on; CSS fades it out.
   Desktop fine pointers >= 1024px only, idle-initialized, never under
   reduced motion. Zero canvas. */

/* Target cell edge in px, not a fixed column count: a 24-column grid
   gives 53px blocks at 1280, which read as rectangles rather than as a
   pixel trail. The count is derived per width so the cell stays the
   same size everywhere. */
const TARGET_CELL = 34;
const PEAK = 0.14;

type Grid = { cell: number; cols: number; rows: number };

export function FooterPixelGrid() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<Grid | null>(null);

  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.innerWidth < 1024 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let disposed = false;
    const build = () => {
      const layer = layerRef.current;
      if (!layer || disposed) return;
      const width = layer.clientWidth;
      if (width <= 0) return;
      const cols = Math.max(1, Math.round(width / TARGET_CELL));
      const cell = width / cols;
      setGrid({ cell, cols, rows: Math.ceil(layer.clientHeight / cell) });
    };

    const idle: (cb: () => void) => number = window.requestIdleCallback
      ? window.requestIdleCallback.bind(window)
      : (cb) => window.setTimeout(cb, 200);
    idle(build);

    let width = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== width) {
        width = window.innerWidth;
        build();
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!grid) return;
    const layer = layerRef.current;
    const host = layer?.parentElement;
    if (!layer || !host) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = layer.getBoundingClientRect();
        const col = Math.floor((e.clientX - rect.left) / grid.cell);
        const row = Math.floor((e.clientY - rect.top) / grid.cell);
        if (col < 0 || col >= grid.cols || row < 0 || row >= grid.rows) return;
        const cell = layer.children[row * grid.cols + col] as
          | HTMLElement
          | undefined;
        if (!cell) return;
        cell.style.transition = "none";
        cell.style.opacity = String(PEAK);
        requestAnimationFrame(() => {
          cell.style.transition = "opacity 700ms ease-out";
          cell.style.opacity = "0";
        });
      });
    };

    host.addEventListener("pointermove", onMove);
    return () => {
      host.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [grid]);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {grid &&
        Array.from({ length: grid.rows * grid.cols }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (i % grid.cols) * grid.cell,
              top: Math.floor(i / grid.cols) * grid.cell,
              width: grid.cell,
              height: grid.cell,
              background: "var(--accondark)",
              opacity: 0,
            }}
          />
        ))}
    </div>
  );
}
