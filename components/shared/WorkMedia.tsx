import Image from "next/image";
import { WorkClip } from "@/components/sections/home/WorkClip";
import type { WorkEntry } from "@/lib/featured-work";

/* A work entry's media in any frame (2026-10-09): a still renders through
   next/image, a reel piece plays its clip window (WorkClip). Fill the
   parent: the caller owns the frame and its aspect.

   fit="cover"  the still fills the frame (frames already at 4:5)
   fit="frame"  for frames whose aspect is not the still's (the 3:2
                results cards): the still sits whole and centred over a
                blurred, scaled copy of itself, so a poster is never
                cropped down to a strip of its headline.

   `play` passes through to WorkClip: undefined plays while on screen,
   a boolean plays only while true (hover-to-play cards). */
export function WorkMedia({
  work,
  index = 0,
  fit = "cover",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  decorative = false,
  play,
}: {
  work: WorkEntry;
  index?: number;
  fit?: "cover" | "frame";
  sizes?: string;
  /** alt="" where a caption beside the frame already names the piece */
  decorative?: boolean;
  play?: boolean;
}) {
  if (!work.media) return <WorkClip index={work.reel ?? index} dots={false} play={play} />;
  const alt = decorative ? "" : (work.alt ?? "");
  if (fit === "cover") return <Image src={work.media} alt={alt} fill sizes={sizes} className="object-cover" />;
  return (
    <>
      <Image src={work.media} alt="" aria-hidden fill sizes="160px" className="scale-125 object-cover blur-2xl" />
      <Image src={work.media} alt={alt} fill sizes={sizes} className="object-contain" />
    </>
  );
}
