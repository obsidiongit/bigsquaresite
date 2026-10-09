"use client";

import { useEffect, useRef } from "react";

/* A photo redrawn as BigSquare-blue halftone squares (the studio
   rebuild's TV-wall portraits), laid over the real image. Darker
   pixels give bigger squares. The parent decides when it fades (the
   team card shows the real photo on hover). Draws once per size. */

const CELL = 5;

/* `cut` is the lightness above which a cell stays paper, `fill` the
   largest share of the cell a square may cover: the defaults suit the
   team headshots; busier, darker photos want a lower cut so they keep
   some paper and stay readable. `levels` first stretches the photo's
   own 5th to 95th percentile lightness to the full range and maps
   darkness to square size linearly, so a dim photo keeps its midtones
   and still separates faces from the room. */
export function DotPortrait({
  className = "",
  cell = CELL,
  cut = 0.8,
  fill = 1,
  levels = false,
}: {
  className?: string;
  cell?: number;
  cut?: number;
  fill?: number;
  levels?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    const host = cvs?.parentElement;
    // the photo sits beside the overlay: look up from the overlay's wrapper
    const img = host?.querySelector("img") ?? host?.parentElement?.querySelector("img");
    if (!cvs || !host || !img) return;
    const draw = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cvs.width = Math.round(w * dpr);
      cvs.height = Math.round(h * dpr);
      const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
      const s = document.createElement("canvas");
      s.width = cols;
      s.height = rows;
      const sc = s.getContext("2d", { willReadFrequently: true })!;
      // cover-fit like object-cover
      const ia = img.naturalWidth / img.naturalHeight, ca = cols / rows;
      let sw = img.naturalWidth, sh = img.naturalHeight;
      if (ia > ca) sw = sh * ca;
      else sh = sw / ca;
      sc.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, cols, rows);
      const px = sc.getImageData(0, 0, cols, rows).data;
      const lum = new Float32Array(cols * rows);
      for (let k = 0; k < lum.length; k++) lum[k] = (0.299 * px[k * 4] + 0.587 * px[k * 4 + 1] + 0.114 * px[k * 4 + 2]) / 255;
      let lo = 0, hi = 1;
      if (levels) {
        const sorted = Float32Array.from(lum).sort();
        lo = sorted[Math.floor(sorted.length * 0.05)];
        hi = Math.max(lo + 0.05, sorted[Math.floor(sorted.length * 0.95)]);
      }
      const ctx = cvs.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#F5F6F8";
      ctx.fillRect(0, 0, w, h);
      ctx.beginPath();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const l = Math.min(1, Math.max(0, (lum[y * cols + x] - lo) / (hi - lo)));
          // levels mode is a straight halftone ramp: photos keep their midtones
          const size = levels
            ? Math.pow(Math.max(0, (cut - l) / cut), 0.9)
            : Math.sqrt(Math.min(1, Math.max(0, ((cut - l) / cut) * 1.44)));
          if (size < 0.06) continue;
          const hs = 0.5 * cell * fill * (0.15 + 0.85 * size);
          ctx.roundRect(x * cell + cell / 2 - hs, y * cell + cell / 2 - hs, hs * 2, hs * 2, hs * 0.35);
        }
      }
      ctx.fillStyle = "#0657F9";
      ctx.fill();
    };
    if (img.complete) draw();
    img.addEventListener("load", draw);
    const ro = new ResizeObserver(draw);
    ro.observe(host);
    return () => {
      img.removeEventListener("load", draw);
      ro.disconnect();
    };
  }, [cell, cut, fill, levels]);

  return <canvas ref={ref} aria-hidden className={"pointer-events-none absolute inset-0 h-full w-full " + className} />;
}
