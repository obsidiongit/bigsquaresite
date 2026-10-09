"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { pLine } from "./pencil";
import s from "./draft.module.css";

/* The drafted kit (formerly review toggle "middleDraft", 2026-10-08): the
   curtain footer's pencil world, made reusable for the homepage middle.
   Strokes draw in once when they scroll into view (data-in), one after
   another (--i); a single shared wobble filter (#draft-pencil) boils
   them the way the footer's lines boil; notes are Casual Human, written
   on line by line. Static once drawn: the character is in the drawing,
   not in looping motion. Reduced motion: everything simply sits there
   drawn, no wobble. */

/** the shared wobble. Mount once per page. */
export function DraftDefs() {
  const turb = useRef<SVGFETurbulenceElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      turb.current?.parentElement?.querySelector("feDisplacementMap")?.setAttribute("scale", "0");
      return;
    }
    const t = window.setInterval(() => turb.current?.setAttribute("seed", String(Math.floor(Math.random() * 90))), 120);
    return () => window.clearInterval(t);
  }, []);
  return (
    <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
      <filter id="draft-pencil" x="-10%" y="-20%" width="120%" height="140%">
        <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
      </filter>
    </svg>
  );
}

/** sets data-in on the element the first time a good part of it is on screen */
export function useDrawIn<T extends HTMLElement | SVGSVGElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.setAttribute("data-in", "");
        io.disconnect();
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

export type Stroke = { d: string; i: number; hatch?: boolean; /** id of a <clipPath> passed as children */ clip?: string };

/** a useId value made safe for url(#...) */
export const svgId = (id: string) => "dp" + id.replace(/[^a-zA-Z0-9_-]/g, "");

/** a drawing: strokes in a viewBox, drawn in order of `i` */
export function Sketch({
  strokes,
  viewBox,
  className,
  delay = 0,
  children,
}: {
  strokes: Stroke[];
  viewBox: string;
  className?: string;
  /** seconds before the first stroke */
  delay?: number;
  /** extra SVG content (clip paths, labels) */
  children?: ReactNode;
}) {
  const ref = useDrawIn<SVGSVGElement>();
  return (
    <svg ref={ref} viewBox={viewBox} aria-hidden className={cn(s.sketch, className)} style={{ ["--d" as string]: `${delay}s` } as CSSProperties}>
      {children}
      {strokes.map((st, k) => (
        <path
          key={k}
          d={st.d}
          pathLength={1}
          clipPath={st.clip ? `url(#${st.clip})` : undefined}
          className={cn(s.stroke, st.hatch && s.hatch)}
          style={{ ["--i" as string]: st.i } as CSSProperties}
        />
      ))}
    </svg>
  );
}

/** a handwritten margin note, written on line by line */
export function Note({ lines, className, delay = 0 }: { lines: string[]; className?: string; delay?: number }) {
  const ref = useDrawIn<HTMLParagraphElement>(0.6);
  return (
    <p ref={ref} aria-hidden className={cn(s.note, className)} style={{ ["--d" as string]: `${delay}s` } as CSSProperties}>
      {lines.map((l, i) => (
        <span key={l} style={{ ["--i" as string]: i } as CSSProperties}>
          {l}
        </span>
      ))}
    </p>
  );
}

/** a hand-drafted frame round its children: four overshooting sides plus a second, lighter pass on
    the top and left (the footer's button box), drawn at the box's real size so it never stretches */
export function DraftFrame({ children, className }: { children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = box.current!;
    const ro = new ResizeObserver(() => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      setSize((o) => (o && o.w === w && o.h === h ? o : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const strokes: Stroke[] = size
    ? [
        { d: pLine(0, 0, size.w, 0, 11, 3), i: 0 },
        { d: pLine(size.w, 0, size.w, size.h, 17, 3), i: 1 },
        { d: pLine(size.w, size.h, 0, size.h, 23, 3), i: 2 },
        { d: pLine(0, size.h, 0, 0, 29, 3), i: 3 },
        { d: pLine(14, -5, size.w * 0.82, -3, 31, 4), i: 4, hatch: true },
        { d: pLine(-5, size.h * 0.9, -3, 18, 37, 4), i: 5, hatch: true },
      ]
    : [];
  return (
    <div ref={box} className={cn("relative", className)}>
      {size && (
        <Sketch
          strokes={strokes}
          viewBox={`0 0 ${size.w} ${size.h}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      )}
      {children}
    </div>
  );
}
