"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { sfx } from "@/lib/sfx";

/* Nav sound toggle (STYLE_GUIDE.md 7.11): sound ships ON, this is the
   off switch, in the bar's pill vocabulary. The indicator is three tiny
   level bars in the brand square's footprint: animated while sound is
   on, flattened to a baseline when muted. Persisted via the engine. */

const BARS = [
  /* height pairs [muted, playing-max] and stagger, tuned to read at 10px */
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
      type="button"
      aria-pressed={enabled}
      aria-label={enabled ? "Turn sound off" : "Turn sound on"}
      onClick={() => sfx.toggle()}
      className={cn("group pill pill-secondary pill-sm gap-2.5", className)}
    >
      <span aria-hidden className="flex h-2.5 items-end gap-[2px]">
        {BARS.map((bar, i) => (
          <span
            key={i}
            className={cn(
              "w-[2px] origin-bottom bg-acc transition-[height] duration-[250ms] ease-house",
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
      <span className="max-md:sr-only">Sound</span>
    </button>
  );
}
