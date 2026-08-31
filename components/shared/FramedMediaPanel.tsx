"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { cn } from "@/lib/utils";

/* <FramedMediaPanel> (STYLE_GUIDE.md 8.3, lusion; built for 2.hero.md,
   reused by 9.portal.md): media inside a rounded --radius-media dark
   panel inset from the page edges, with "+" registration marks where the
   panel meets the rails.

   Media contract (decisions.md "Brand video"):
   - The poster paints from the first frame and is the LCP element; the
     video mounts after hydration and fades in when it can play.
   - Swapping in the real film is a one-line change: pass its path as
     `videoSrc`. `videoSrc={null}` renders the poster alone.
   - Reduced motion: poster only; the loop never autoplays (7.8). */

type Props = {
  /** Poster image path (public/); the LCP element. Required. */
  poster: string;
  posterAlt?: string;
  /** The film. null = poster only (until the real asset is delivered). */
  videoSrc?: string | null;
  /** Preload the poster: hero only (Next 16: preload, not priority) */
  preloadPoster?: boolean;
  /** Hero exception (7.3): ClipReveal on mount instead of on view */
  onMount?: boolean;
  /** Aspect classes; brief default is 16:9 mobile, ~2.4:1 desktop */
  aspectClassName?: string;
  /** Optional pinned label, e.g. the portal's "PORTAL PREVIEW" chip */
  chip?: React.ReactNode;
  className?: string;
};

export function FramedMediaPanel({
  poster,
  posterAlt = "",
  videoSrc = null,
  preloadPoster = false,
  onMount = false,
  aspectClassName = "aspect-video md:aspect-[2.4/1]",
  chip,
  className,
}: Props) {
  const reduced = useReducedMotionSafe();
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Video loads after first paint so it never competes with the LCP.
  useEffect(() => setMounted(true), []);

  const showVideo = Boolean(videoSrc) && mounted && !reduced;

  return (
    <div className={cn("relative", className)}>
      <ClipReveal onMount={onMount} radius="var(--radius-media)">
        <div className={cn("relative w-full bg-darkpanel", aspectClassName)}>
          <Image
            src={poster}
            alt={posterAlt}
            fill
            preload={preloadPoster}
            loading={preloadPoster ? "eager" : "lazy"}
            sizes="(min-width: 1200px) 1200px, 100vw"
            className="object-cover"
          />
          {showVideo && (
            <video
              src={videoSrc ?? undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden
              onPlaying={() => setPlaying(true)}
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-[400ms]",
                playing ? "opacity-100" : "opacity-0",
              )}
            />
          )}
          {chip && <div className="absolute left-4 top-4">{chip}</div>}
        </div>
      </ClipReveal>
    </div>
  );
}
