"use client";

import { cn } from "@/lib/utils";
import { useWidgetLoop } from "./useWidgetLoop";

/* Channel bars loop (5.solution.md v3; measured from All-Channels.mp4).
   5.5s: 0.5s axes only, then the bars grow scaleX over 600ms swoop
   with a 120ms stagger (animation-delay + fill backwards) to fixed
   widths, hold grown, and retract 300ms at the loop tail. Labels are
   generic service words, not platform brands; the tick gridlines are
   unlabeled (no fake axis numbers). Base transform is scaleX(1), so
   the reduced-motion CSS kill lands on grown bars, the settled frame.

   The one multi-fill moment in the widget system: --acc, --acc2,
   --mid (brand family, never a traffic-light trio). */

const BARS = [
  { label: "Paid Search", width: "85%", color: "bg-acc", delay: "" },
  { label: "Calls", width: "60%", color: "bg-acc2", delay: "wgt-bar-d2" },
  { label: "Social", width: "35%", color: "bg-mid", delay: "wgt-bar-d3" },
];

/* label column width (74px) + the gap-3 (12px) between it and the bars */
const TICKS_LEFT = "left-[86px]";

function ChartGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 14 14"
      fill="none"
      className="size-3.5 text-sec-ink"
    >
      <path
        d="M2.5 12V8.5M7 12V3M11.5 12V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChannelBarsWidget() {
  const { ref, play, reduced } = useWidgetLoop();

  return (
    <div
      ref={ref}
      className="wgt w-full select-none"
      data-play={play ? "" : undefined}
    >
      <div className="flex items-center gap-2">
        <ChartGlyph />
        <span className="text-[13px] font-medium text-sec-ink">All Channels</span>
      </div>
      <div className="mt-3 h-px bg-sec-line" />
      <div className="relative mt-4">
        {/* faint unlabeled tick gridlines behind the bar area */}
        <div aria-hidden className={cn("absolute -inset-y-1 right-0", TICKS_LEFT)}>
          {[25, 50, 75, 100].map((p) => (
            <span
              key={p}
              className="absolute inset-y-0 w-px bg-sec-line/60"
              style={{ left: p === 100 ? "calc(100% - 1px)" : `${p}%` }}
            />
          ))}
        </div>
        <div className="relative space-y-3">
          {BARS.map((bar) => (
            <div key={bar.label} className="flex items-center gap-3">
              <span className="w-[74px] shrink-0 text-[11px] leading-none text-sec-mid">
                {bar.label}
              </span>
              <div className="h-2.5 flex-1">
                <span
                  className={cn(
                    "block h-full rounded-[4px]",
                    bar.color,
                    !reduced && cn("origin-left wgt-bar", bar.delay),
                  )}
                  style={{ width: bar.width }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
