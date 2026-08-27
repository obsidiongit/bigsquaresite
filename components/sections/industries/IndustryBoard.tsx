"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { Chip, Eyebrow } from "@/components/shared/mono";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";
import { IN_VIEW_MARGIN } from "@/lib/motion";
import type { IndustryPageContent } from "@/lib/industry-pages/types";
import { cn } from "@/lib/utils";

/* THE BOARD (_industry-page-template.md v3 section 4): the template's
   interactive signature, the page's argument made touchable. One surf
   panel: copy + mono readout left, a grid of location-squares right.
   Painting any square shows the SAME readout with only the unit index
   changing, because every location gets the whole system; that
   constancy is the demo. Skin (unit noun, chips, grid, seed, copy) is
   per-industry data.

   Mechanics per the FooterPixelGrid recipe: direct style writes + CSS
   fade-out, one delegated pointer handler, deterministic SSR seed.
   Fine pointers paint on move; coarse pointers paint on tap only
   (touch-action pan-y, scrolling never fights). While in view a quiet
   ACTIVITY BLIP lights one square every ~2s on a fixed stride: the
   page's one live loop (section 0 budget), paused offscreen, absent
   under reduced motion. The board is aria-hidden decoration-plus-play:
   every claim lives in the copy beside it. Unit indexes are furniture
   (the calendar-furniture rule), never counts of real clients. */

const PAINT_MS = 900;
const BLIP_MS = 2000;
const BLIP_STRIDE = 37; /* coprime with 60 so the walk visits every cell */

export function IndustryBoard({
  board,
}: {
  board: IndustryPageContent["board"];
}) {
  const reduced = useReducedMotionSafe();
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { margin: IN_VIEW_MARGIN });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = board.cols * board.rows;
  const seed = new Set(board.seed);

  /* paint a cell: instant accent, CSS fades it back to the paper face
     (footer recipe; the fade target must be the base color, or the
     lingering inline style overrides the class after the fade) */
  const paint = (cell: HTMLElement, peak: string) => {
    cell.style.transition = "none";
    cell.style.backgroundColor = peak;
    requestAnimationFrame(() => {
      cell.style.transition = `background-color ${PAINT_MS}ms ease-out`;
      cell.style.backgroundColor = "var(--paper)";
    });
  };

  const cellFromEvent = (e: React.PointerEvent): HTMLElement | null => {
    const t = e.target as HTMLElement;
    return t.dataset.cell !== undefined ? t : null;
  };

  const onPaintEvent = (e: React.PointerEvent, moveOnly: boolean) => {
    if (reduced) return;
    if (moveOnly && e.pointerType !== "mouse") return;
    const cell = cellFromEvent(e);
    if (!cell) return;
    const i = Number(cell.dataset.cell);
    if (!seed.has(i)) paint(cell, "var(--sec-acc)");
    setActiveIndex(i);
  };

  /* the activity blip: a fixed-stride walk, skipping seeds, that only
     runs on screen. Never touches the readout: only the pointer does. */
  useEffect(() => {
    if (reduced || !inView) return;
    let at = 11; /* deterministic start, off the seed pattern */
    const tick = window.setInterval(() => {
      const grid = gridRef.current;
      if (!grid) return;
      do {
        at = (at + BLIP_STRIDE) % total;
      } while (seed.has(at));
      const cell = grid.children[at] as HTMLElement | undefined;
      if (cell) {
        cell.style.transition = "none";
        cell.style.backgroundColor =
          "color-mix(in srgb, var(--sec-acc) 45%, var(--paper))";
        requestAnimationFrame(() => {
          cell.style.transition = `background-color ${PAINT_MS * 1.4}ms ease-out`;
          cell.style.backgroundColor = "var(--paper)";
        });
      }
    }, BLIP_MS);
    return () => window.clearInterval(tick);
    // seed is rebuilt each render from stable data; total/inView gate the loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, inView, total]);

  const pad = (n: number) => String(n + 1).padStart(2, "0");

  return (
    <Section theme="light" size="none" className="pb-section-y">
      <div className={EDGE}>
        <Reveal className="relative z-10">
          <div className="rounded-[24px] bg-surf p-6 md:p-10 xl:p-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.55fr] lg:gap-14">
              <div>
                <Eyebrow>{board.eyebrow}</Eyebrow>
                <h2 className="mt-4 max-w-[16ch] font-display text-h2 text-sec-ink">
                  {board.title.map((seg, i) =>
                    seg.mark ? (
                      <RoughAnnotation
                        key={i}
                        variant="underline"
                        className="whitespace-nowrap"
                      >
                        {seg.text}
                      </RoughAnnotation>
                    ) : (
                      <span key={i}>{seg.text}</span>
                    ),
                  )}
                </h2>
                <p className="mt-5 max-w-[46ch] text-body text-sec-mid">
                  {board.body}
                </p>
                {/* the readout: the index moves, the chips never do */}
                <div aria-hidden className="mt-8">
                  <p className="font-mono text-mono-sm uppercase tabular-nums text-sec-acc">
                    {activeIndex === null
                      ? board.restLabel
                      : `${board.unitNoun} ${pad(activeIndex)}`}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {board.chips.map((chip) => (
                      <Chip key={chip}>{chip}</Chip>
                    ))}
                  </div>
                </div>
              </div>

              <div
                ref={gridRef}
                aria-hidden
                onPointerMove={(e) => onPaintEvent(e, true)}
                onPointerDown={(e) => onPaintEvent(e, false)}
                onPointerLeave={() => setActiveIndex(null)}
                className={cn(
                  "grid touch-pan-y content-center gap-1.5 self-center md:gap-2",
                  !reduced && "cursor-crosshair",
                )}
                style={{
                  gridTemplateColumns: `repeat(${board.cols}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: total }, (_, i) => (
                  <div
                    key={i}
                    data-cell={i}
                    className={cn(
                      "aspect-square rounded-[3px]",
                      seed.has(i)
                        ? "bg-sec-acc"
                        : "border border-sec-line bg-paper",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
