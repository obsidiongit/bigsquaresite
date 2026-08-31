"use client";

import Image from "next/image";
import { useState } from "react";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { VSL_POSTER, VSL_VIDEO } from "@/lib/schedule-media";
import { cn } from "@/lib/utils";

/* The /schedule/ VSL player (conversion/schedule.md v2): the page's
   trust builder as a framed media object. Radius 24, dark interior,
   ClipReveal entry (registration marks retired sitewide 2026-08-30). Click-to-play WITH sound,
   native controls once playing, never autoplay (a VSL is watched, not
   ambient; distinct from FramedMediaPanel's muted loop contract).

   While lib/schedule-media.ts has no film, the player renders the
   honest placeholder state: poster, inert play square at reduced
   opacity, and a visible mono placeholder chip (the 6.12 honesty-gate
   pattern). Setting VSL_VIDEO makes it live with no layout change.

   The play button is the brand square: a rounded accent square with a
   white triangle. Reduced motion: settled frame, play only on user
   action (7.8). */

function PlaySquare({ inert = false }: { inert?: boolean }) {
  return (
    <span
      className={cn(
        "grid size-14 place-items-center rounded-[14px] bg-acc text-onacc",
        "shadow-[0_8px_24px_rgba(11,15,23,.28)] sm:size-16 sm:rounded-[16px]",
        inert && "opacity-60",
      )}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="ml-1 size-6">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

export function VslPlayer({ className }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const hasFilm = Boolean(VSL_VIDEO);

  return (
    <div className={cn("relative", className)}>
      <ClipReveal radius="var(--radius-media)">
        <div className="relative aspect-video w-full bg-darkpanel">
          {playing && VSL_VIDEO ? (
            <video
              src={VSL_VIDEO}
              poster={VSL_POSTER}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <>
              <Image
                src={VSL_POSTER}
                alt=""
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
              {hasFilm ? (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label="Play the film"
                  className="group absolute inset-0 grid place-items-center"
                >
                  <span className="transition-transform duration-[var(--dur-fast)] group-hover:scale-[1.04] group-active:scale-[0.98]">
                    <PlaySquare />
                  </span>
                </button>
              ) : (
                <>
                  <span aria-hidden className="absolute inset-0 grid place-items-center">
                    <PlaySquare inert />
                  </span>
                  <span className="absolute left-4 top-4 rounded-full border border-[rgba(233,236,241,.28)] px-3 py-1 font-mono text-mono-sm uppercase text-ondark">
                    [Placeholder: VSL film]
                  </span>
                </>
              )}
            </>
          )}
        </div>
      </ClipReveal>
    </div>
  );
}
