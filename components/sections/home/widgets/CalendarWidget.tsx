"use client";

import { cn } from "@/lib/utils";
import { useWidgetLoop } from "./useWidgetLoop";

/* Calendar loop (5.solution.md v3; measured from Calendar-Week.mp4).
   4.5s, 3 beats of 1.5s: the month label swaps and the active cell
   moves (Sun 3, Mon 4, Fri 1), each transition a 300ms cross-fade of
   the whole face (wgt-cal-* keyframes drive three stacked faces; the
   chrome pixels are identical across faces, so only the label and the
   accent cell appear to change). Face 1 doubles as the settled frame:
   it is the only face visible at keyframe 0, under the reduced-motion
   CSS kill, and in the settled render below. Real month names and day
   numbers 1 to 5 are calendar furniture, not claims: no year, no fake
   dates (copy-rules). */

const BEATS = [
  { month: "January", active: 2 },
  { month: "February", active: 3 },
  { month: "March", active: 0 },
];

const DAYS = [
  ["Fri", "1"],
  ["Sat", "2"],
  ["Sun", "3"],
  ["Mon", "4"],
  ["Tue", "5"],
] as const;

function Chevron({ flip }: { flip?: boolean }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-[8px] border border-sec-line">
      <svg
        aria-hidden
        viewBox="0 0 8 12"
        fill="none"
        className={cn("h-2.5 w-auto text-sec-mid", flip && "rotate-180")}
      >
        <path
          d="M6.5 1 1.5 6l5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function CalendarFace({
  month,
  active,
  className,
}: {
  month: string;
  active: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2">
        <Chevron />
        <span className="text-[13px] font-medium text-sec-ink">{month}</span>
        <Chevron flip />
      </div>
      <div className="mt-3 h-px bg-sec-line" />
      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {DAYS.map(([day, num], i) => (
          <div
            key={day}
            className={cn(
              "rounded-[8px] py-2 text-center",
              i === active ? "bg-acc" : "bg-paper",
            )}
          >
            <span
              className={cn(
                "block text-[11px] leading-none",
                i === active ? "text-onacc/80" : "text-sec-mid",
              )}
            >
              {day}
            </span>
            <span
              className={cn(
                "mt-1 block text-[15px] font-medium leading-none tabular-nums",
                i === active ? "text-onacc" : "text-sec-ink",
              )}
            >
              {num}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalendarWidget() {
  const { ref, play, reduced } = useWidgetLoop();

  return (
    <div
      ref={ref}
      className="wgt w-full select-none"
      data-play={play ? "" : undefined}
    >
      {reduced ? (
        <CalendarFace {...BEATS[0]} />
      ) : (
        <div className="relative">
          <CalendarFace {...BEATS[0]} className="wgt-cal-l1" />
          <CalendarFace
            {...BEATS[1]}
            className="wgt-cal-l2 absolute inset-0 opacity-0"
          />
          <CalendarFace
            {...BEATS[2]}
            className="wgt-cal-l3 absolute inset-0 opacity-0"
          />
        </div>
      )}
    </div>
  );
}
