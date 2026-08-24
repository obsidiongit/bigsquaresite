"use client";

import { cn } from "@/lib/utils";
import { useWidgetLoop } from "./useWidgetLoop";

/* Task list loop (5.solution.md v3; measured from Task-List.mp4). 5s:
   row 2 checks at 1.5s, row 1 at 3s (accent disc scales in 200ms,
   strike draws left-to-right 250ms, the text column dims to 45%), then
   one quick fade-reset near 4.5s (the wgt-task-reset wrapper dips
   while every element snaps back under cover). No person names, no
   dates (their video shows "Eric" and "Jul 29"): generic true-to-
   service tasks, mono chips, and a blurred value-bar where the
   reference put its fake date.

   Animated-branch base styles equal the SETTLED state (disc and strike
   visible when no animation applies), so the reduced-motion CSS kill
   lands on the same frame the settled render shows. While the loop is
   attached, keyframe values own opacity/transform on every frame. */

type Row = {
  title: string;
  sub: string;
  chip: string;
  /* keyframe suffix: -1 checks at 60% (3s), -2 at 30% (row 2 first) */
  k: "1" | "2";
};

const ROWS: Row[] = [
  {
    title: "Launch the search campaign",
    sub: "Set the budget and go live",
    chip: "Paid Search",
    k: "1",
  },
  {
    title: "Send the monthly report",
    sub: "Every location, one page",
    chip: "Reporting",
    k: "2",
  },
];

function ListGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 14 14"
      fill="none"
      className="size-3.5 text-sec-ink"
    >
      <path
        d="M2 3.5h10M2 7h10M2 10.5h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TaskRow({ row, settled }: { row: Row; settled: boolean }) {
  return (
    <div className="flex items-start gap-3">
      {/* checkbox: static ring under an accent disc that scales in */}
      <span className="relative mt-[2px] size-[18px] shrink-0">
        <span className="absolute inset-0 rounded-full border border-sec-mid/50" />
        <span
          className={cn(
            "absolute inset-0 grid place-items-center rounded-full bg-acc text-onacc",
            !settled && `wgt-task-check-${row.k}`,
          )}
        >
          <svg aria-hidden viewBox="0 0 10 8" fill="none" className="h-[7px] w-auto">
            <path
              d="M1 4.2 3.8 7 9 1"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
      <div
        className={cn(
          "min-w-0 flex-1",
          settled ? "opacity-45" : `opacity-45 wgt-task-dim-${row.k}`,
        )}
      >
        <span className="relative block w-fit">
          <span className="block text-[14px] font-medium leading-tight text-sec-ink">
            {row.title}
          </span>
          <span
            aria-hidden
            className={cn(
              "absolute left-0 top-1/2 h-px w-full bg-sec-mid",
              !settled && `origin-left wgt-task-strike-${row.k}`,
            )}
          />
        </span>
        <p className="mt-1 text-[12px] leading-tight text-sec-mid">{row.sub}</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="rounded-full bg-surf px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.06em] text-sec-mid">
            {row.chip}
          </span>
          <span aria-hidden className="h-2 w-10 rounded-full bg-ink/10 blur-[2px]" />
        </div>
      </div>
    </div>
  );
}

export function TaskListWidget() {
  const { ref, play, reduced } = useWidgetLoop();

  return (
    <div
      ref={ref}
      className="wgt w-full select-none"
      data-play={play ? "" : undefined}
    >
      <div className="flex items-center gap-2">
        <ListGlyph />
        <span className="text-[13px] font-medium text-sec-ink">Tasks</span>
      </div>
      <div className="mt-3 h-px bg-sec-line" />
      <div className={cn("mt-4 space-y-4", !reduced && "wgt-task-reset")}>
        {ROWS.map((row) => (
          <TaskRow key={row.title} row={row} settled={reduced} />
        ))}
      </div>
    </div>
  );
}
