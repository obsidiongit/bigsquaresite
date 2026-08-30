"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

/* The VSL slot (vsl-template.md, section 4): 16:9, radius 24, dark
   interior, poster frame, a big brand-square play button. A plain
   <video> for now (no third-party player yet); native controls once
   playing, never autoplay, click-to-play with sound. No registration
   marks (new pages carry none).

   Tracking (spec): video_play on the first play, video_50 once past
   the halfway mark, video_complete on ended, each once per page view,
   through lib/track.ts (a no-op until the tag IDs exist).

   While `src` is null the slot renders the honest placeholder state:
   poster, inert play square, visible mono placeholder chip. Setting
   the URL in the registry makes it live with no layout change.
   Reduced motion: settled frame, play only on user action (7.8). */

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

export function FunnelVideo({
  src,
  poster,
  funnel,
  className,
}: {
  src: string | null;
  poster: string;
  /** slug, passed as the event parameter */
  funnel: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const fired = useRef({ play: false, half: false, done: false });

  return (
    <div className={cn("relative", className)}>
      <ClipReveal radius="var(--radius-media)" onMount>
        <div className="relative aspect-video w-full bg-darkpanel">
          {playing && src ? (
            <video
              src={src}
              poster={poster}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 size-full object-cover"
              onPlay={() => {
                if (fired.current.play) return;
                fired.current.play = true;
                track("video_play", { funnel });
              }}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (fired.current.half || !v.duration) return;
                if (v.currentTime / v.duration >= 0.5) {
                  fired.current.half = true;
                  track("video_50", { funnel });
                }
              }}
              onEnded={() => {
                if (fired.current.done) return;
                fired.current.done = true;
                track("video_complete", { funnel });
              }}
            />
          ) : (
            <>
              <Image
                src={poster}
                alt=""
                fill
                priority
                sizes="(min-width: 900px) 900px, 100vw"
                className="object-cover"
              />
              {src ? (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label="Play the video"
                  data-sfx=""
                  className="group absolute inset-0 grid place-items-center"
                >
                  <span className="transition-transform duration-[var(--dur-fast)] group-hover:scale-[1.04] group-active:scale-[0.98] motion-reduce:transition-none">
                    <PlaySquare />
                  </span>
                </button>
              ) : (
                <>
                  <span aria-hidden className="absolute inset-0 grid place-items-center">
                    <PlaySquare inert />
                  </span>
                  <span className="absolute left-4 top-4 rounded-full border border-[rgba(233,236,241,.28)] px-3 py-1 font-mono text-mono-sm uppercase text-ondark">
                    [Placeholder: video URL]
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
