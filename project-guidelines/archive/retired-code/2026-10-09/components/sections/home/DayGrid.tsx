"use client";

import { useRef, useState } from "react";
import {
  GRID_COLS,
  GRID_ROWS,
  MILESTONE_DAYS,
  PHASES,
  PHASE_STOPS,
  TOTAL_DAYS,
  phaseIndexForDay,
} from "@/lib/ninety-days";
import { cn } from "@/lib/utils";

/* DayGrid (10.how-it-works.md v3.1): 90 day-cells on the blue slab,
   10 across and 9 down so rows map to phases. The grid is the
   section's scrubber and a REAL slider: role="slider" with the full
   keyboard range (arrows step a day, Page Up/Down jump phase stops,
   Home/End), announced as "Day 37, Launch" via valuetext.

   Round 2 (Brad: "if you accidentally mouse over, it's just all over
   the place... way too chaotic"): plain hover NO LONGER scrubs the
   clock. Hovering highlights the cell under the pointer (an
   invitation, cursor-grab); scrubbing requires holding the pointer
   down and dragging, mouse and touch alike, with pointer capture so
   a drag can leave the grid without dropping. The parent chases the
   drag target with a distance-scaled tween, so even a fast drag
   cascades in day order instead of teleporting. `touch-action: pan-y`
   stays as the mobile scroll guard: vertical swipes stay with the
   page, only horizontal drags feed the scrub.

   Cell states are pure CSS on a single span per day: future = 1px
   --sec-line outline; past = solid --onacc fill; current = filled +
   ring + scale; milestone = an inset square, outlined while future,
   punched out in the slab's own blue once filled. `complete` (the
   merge: gap and radius to 0, one solid square) is SCROLL-GATED by
   the parent's pin beat, never by the day value, so dragging to day
   90 can no longer white the board out mid-play (Brad's round 2
   screenshot). `inert` is the reduced-motion render: static, merged,
   aria-hidden. */

const SWOOP = "cubic-bezier(0.6, 0, 0, 1)";
const CELL_TRANSITION = `background-color 120ms ease, border-color 120ms ease, border-radius 400ms ${SWOOP}, transform 150ms ease`;

type Props = {
  /** integer 0..90; 0 = nothing filled yet */
  day: number;
  /** the merge beat, scroll-gated by the parent */
  complete: boolean;
  /** reduced-motion: static, merged, decorative */
  inert?: boolean;
  onScrub: (day: number, smooth?: boolean) => void;
  onScrubStart: () => void;
  onScrubEnd: () => void;
  onFocusChange: (focused: boolean) => void;
};

export function DayGrid({
  day,
  complete,
  inert = false,
  onScrub,
  onScrubStart,
  onScrubEnd,
  onFocusChange,
}: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [hoverDay, setHoverDay] = useState<number | null>(null);

  const dayFromEvent = (e: React.PointerEvent) => {
    const el = gridRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const col = Math.min(
      GRID_COLS - 1,
      Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * GRID_COLS)),
    );
    const row = Math.min(
      GRID_ROWS - 1,
      Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * GRID_ROWS)),
    );
    return row * GRID_COLS + col + 1;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next: number | null = null;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = Math.min(TOTAL_DAYS, day + 1);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = Math.max(1, day - 1);
        break;
      case "PageUp":
        next = PHASE_STOPS.find((s) => s > day) ?? TOTAL_DAYS;
        break;
      case "PageDown":
        next = [...PHASE_STOPS].reverse().find((s) => s < day) ?? 1;
        break;
      case "Home":
        next = 1;
        break;
      case "End":
        next = TOTAL_DAYS;
        break;
    }
    if (next !== null) {
      e.preventDefault();
      onScrub(next, true);
    }
  };

  const cells = [];
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    const filled = d <= day;
    const now = !complete && d === day;
    const hovered = !inert && !complete && !now && d === hoverDay;
    cells.push(
      <span
        key={d}
        className={cn(
          "relative aspect-square w-full border",
          complete ? "rounded-none" : "rounded-[3px]",
          filled ? "border-transparent bg-onacc" : "border-sec-line bg-transparent",
          now && "z-10 scale-[1.12]",
          hovered && "z-10 scale-110",
          hovered && !filled && "border-onacc/70",
        )}
        style={{
          transition: CELL_TRANSITION,
          /* the current-day ring: 3px of the slab's own blue as the
             offset gap, then the 1px white ring */
          boxShadow: now
            ? "0 0 0 3px var(--acc), 0 0 0 4px var(--onacc)"
            : undefined,
        }}
      >
        {MILESTONE_DAYS.has(d) && (
          <span
            className={cn(
              "absolute inset-[26%] rounded-[1px]",
              filled ? "bg-acc" : "border border-sec-line",
              complete && "opacity-0",
            )}
            style={{
              transition: `opacity 400ms ${SWOOP}, background-color 120ms ease, border-color 120ms ease`,
            }}
          />
        )}
      </span>,
    );
  }

  const shownDay = Math.max(1, day);

  return (
    <div
      ref={gridRef}
      role={inert ? undefined : "slider"}
      tabIndex={inert ? undefined : 0}
      aria-hidden={inert || undefined}
      aria-label={inert ? undefined : "The first 90 days, day by day"}
      aria-valuemin={inert ? undefined : 1}
      aria-valuemax={inert ? undefined : TOTAL_DAYS}
      aria-valuenow={inert ? undefined : shownDay}
      aria-valuetext={
        inert
          ? undefined
          : `Day ${shownDay}, ${PHASES[phaseIndexForDay(shownDay)].name}`
      }
      className={cn(
        "grid w-full max-w-[27rem] touch-pan-y select-none grid-cols-10 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-onacc/60 focus-visible:ring-offset-8 focus-visible:ring-offset-acc",
        !inert && "cursor-grab active:cursor-grabbing",
      )}
      style={{
        gap: complete ? "0px" : "min(0.8vw, 6px)",
        transition: `gap 400ms ${SWOOP}`,
      }}
      onPointerDown={
        inert
          ? undefined
          : (e) => {
              draggingRef.current = true;
              gridRef.current?.setPointerCapture(e.pointerId);
              setHoverDay(null);
              onScrubStart();
              const d = dayFromEvent(e);
              if (d !== null) onScrub(d);
            }
      }
      onPointerMove={
        inert
          ? undefined
          : (e) => {
              const d = dayFromEvent(e);
              if (d === null) return;
              if (draggingRef.current) onScrub(d);
              else if (e.pointerType === "mouse") setHoverDay(d);
            }
      }
      onPointerUp={
        inert
          ? undefined
          : () => {
              if (!draggingRef.current) return;
              draggingRef.current = false;
              onScrubEnd();
            }
      }
      onPointerCancel={
        inert
          ? undefined
          : () => {
              if (!draggingRef.current) return;
              draggingRef.current = false;
              onScrubEnd();
            }
      }
      onPointerLeave={inert ? undefined : () => setHoverDay(null)}
      onKeyDown={inert ? undefined : onKeyDown}
      onFocus={inert ? undefined : () => onFocusChange(true)}
      onBlur={inert ? undefined : () => onFocusChange(false)}
    >
      {cells}
    </div>
  );
}
