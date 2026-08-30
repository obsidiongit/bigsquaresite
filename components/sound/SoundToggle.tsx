"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { sfx } from "@/lib/sfx";

/* Nav sound mark (STYLE_GUIDE.md 7.11, rebuilt 2026-08-30): sound ships
   ON, this is the off switch. No pill, no label: three tiny level bars
   in the brand square's footprint at the bar's far right edge. Bars
   pulse in --ink while sound is on (hover: --acc) and flatten to a
   --mid baseline when muted. A mono tooltip appears under the mark on
   hover and keyboard focus; the accessible name is always present.
   Persisted via the engine. */

const BARS = [
  /* playing-max heights and stagger, tuned to read at 12px */
  { max: "60%", delay: "0ms" },
  { max: "100%", delay: "180ms" },
  { max: "40%", delay: "340ms" },
];

export function SoundToggle({ className }: { className?: string }) {
  const enabled = useSyncExternalStore(
    sfx.subscribe,
    sfx.getSnapshot,
    sfx.getServerSnapshot,
  );

  return (
    <button
      data-sfx=""
      type="button"
      aria-pressed={enabled}
      aria-label={enabled ? "Turn sound off" : "Turn sound on"}
      onClick={() => sfx.toggle()}
      className={cn(
        "group relative flex size-10 items-center justify-center transition-colors duration-150 ease-house hover:text-acc focus-visible:text-acc",
        enabled ? "text-ink" : "text-mid",
        className,
      )}
    >
      <span aria-hidden className="flex h-3 items-end gap-[3px]">
        {BARS.map((bar, i) => (
          <span
            key={i}
            className={cn(
              "w-[2px] origin-bottom bg-current transition-[height] duration-[250ms] ease-house",
              enabled && "animate-sound-bar motion-reduce:animate-none",
            )}
            style={
              enabled
                ? { height: bar.max, animationDelay: bar.delay }
                : { height: "3px" }
            }
          />
        ))}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-full -mt-0.5 whitespace-nowrap font-mono text-mono-sm uppercase text-mid opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {enabled ? "Sound on" : "Sound off"}
      </span>
    </button>
  );
}
