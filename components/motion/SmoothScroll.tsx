"use client";

import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

/* SmoothScroll (STYLE_GUIDE 7.1, revised 2026-08-24 on Brad's call):
   the damped scroll instrument. Wheel input feeds a virtual target and
   Lenis eases the REAL scroll position toward it every frame, so the
   scrub choreography reads fluid instead of stepping with raw wheel
   ticks (the Obsidion/lusion feel). What stays native: the document
   height and window.scrollY (Lenis animates native scroll, this is not
   a transform-based virtual scroller), touch scrolling (syncTouch
   off), keyboard and anchor scrolling, and everything under reduced
   motion (Lenis never mounts there; the browser scrollbar returns).

   While Lenis is active the native scrollbar hides (html.lenis CSS)
   and the progress rail renders instead: a centered ~2/3-height
   right-margin hairline that fills with accent as the page
   progresses, a quarter-turning brand square on the leading edge,
   registration-mark caps. Display only, desktop fine-pointer only,
   aria-hidden (the page stays natively keyboard-scrollable).

   Modal overlays must pause the instrument (getLenis()?.stop() /
   start(); the nav overlay does) and scrollable regions inside them
   carry data-lenis-prevent so they keep scrolling while it is paused. */

let lenis: Lenis | null = null;

/** The live instance, or null (reduced motion, SSR, unmounted).
    Programmatic scrolls must go through this so Lenis's internal
    target stays in sync: lenis.scrollTo(y, { immediate: true }). */
export const getLenis = () => lenis;

export function SmoothScroll() {
  const reduced = useReducedMotionSafe();
  const [instance, setInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const l = new Lenis({ anchors: true });
    lenis = l;
    setInstance(l);
    let raf = requestAnimationFrame(function loop(time) {
      l.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
      lenis = null;
      setInstance(null);
    };
  }, [reduced]);

  return instance ? <ScrollbarInstrument lenis={instance} /> : null;
}

/* The progress rail (STYLE_GUIDE 7.1): the site's own scroll
   instrument, in the signature kit's vocabulary rather than a browser
   thumb. A vertical hairline holds ~2/3 of the viewport height,
   centered in the right margin; an accent line fills it top-down with
   page progress; the leading edge carries a small brand square that
   completes a quarter turn over the page (the cube's tick, in 2D);
   "+" registration marks cap both ends. It dims when scrolling rests
   and wakes on scroll. DISPLAY ONLY (Brad, 2026-08-24 round 3): no
   drag, no click, pointer-events none in CSS, so it never grows a
   cursor. Visibility below lg / on coarse pointers is also cut in
   CSS (.scroll-instrument), not here. */
function ScrollbarInstrument({ lenis: l }: { lenis: Lenis }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLSpanElement>(null);
  const dimTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const root = rootRef.current;
    const fill = fillRef.current;
    const marker = markerRef.current;
    const square = squareRef.current;
    if (!root || !fill || !marker || !square) return;

    const paint = () => {
      const f = l.limit > 0 ? l.scroll / l.limit : 0;
      fill.style.transform = `scaleY(${f})`;
      marker.style.top = `${f * 100}%`;
      square.style.transform = `rotate(${f * 90}deg)`;
    };

    const wake = () => {
      root.dataset.visible = "true";
      clearTimeout(dimTimer.current);
      dimTimer.current = setTimeout(() => delete root.dataset.visible, 1400);
    };

    const onScroll = () => {
      paint();
      wake();
    };
    l.on("scroll", onScroll);
    window.addEventListener("resize", paint);
    paint();

    return () => {
      l.off("scroll", onScroll);
      window.removeEventListener("resize", paint);
      clearTimeout(dimTimer.current);
    };
  }, [l]);

  return (
    <div ref={rootRef} aria-hidden className="scroll-instrument">
      <span className="scroll-instrument-cap" data-cap="top">
        +
      </span>
      <span className="scroll-instrument-cap" data-cap="bottom">
        +
      </span>
      <div className="scroll-instrument-rail" />
      <div ref={fillRef} className="scroll-instrument-fill" />
      <div ref={markerRef} className="scroll-instrument-marker">
        <span ref={squareRef} className="scroll-instrument-square" />
      </div>
    </div>
  );
}
