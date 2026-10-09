"use client";

import Image from "next/image";
import { DotPortrait } from "@/components/shared/DotPortrait";
import { cn } from "@/lib/utils";

/* A service's stock photo in the site's voice: drawn as blue halftone
   squares (DotPortrait, the newsletter's settings) over the real image.
   `reveal` lets the photo through: the squares fade out after
   `revealDelay`, so a pointer passing over many services sees squares
   and one that stays sees the picture; they come back at once.
   Decorative (alt ""): the service name beside it carries the meaning. */
export function ServicePhoto({
  src,
  reveal = false,
  revealDelay = 0,
  sizes = "320px",
  cell = 5,
  cut = 0.95,
  className,
}: {
  src: string;
  reveal?: boolean;
  revealDelay?: number;
  sizes?: string;
  /** halftone cell (px) and paper cut-off, DotPortrait's knobs */
  cell?: number;
  cut?: number;
  className?: string;
}) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-paper", className)}>
      <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
      {/* DotPortrait measures its parent and finds the photo one level up */}
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-house"
        style={{ opacity: reveal ? 0 : 1, transitionDelay: reveal ? `${revealDelay}s` : "0s" }}
      >
        <DotPortrait cell={cell} cut={cut} fill={0.95} levels />
      </div>
    </div>
  );
}
