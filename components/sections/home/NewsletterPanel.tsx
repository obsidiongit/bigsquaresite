"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import {
  NEWSLETTER_FRAMES,
  NEWSLETTER_FRAME_MS,
  type NewsletterFrame,
} from "@/lib/newsletter-frames";
import { EASE, IN_VIEW_MARGIN } from "@/lib/motion";

/* The cycling media panel (9b.newsletter.md). Youtech's tilted photo
   card, rebuilt in our vocabulary: a SQUARE frame (the brand mark's own
   shape) with registration marks instead of their logo sticker, and a
   mono counter chip instead of their "SINCE 2012" tag. The tilt is
   their playfulness; the moodboard rules playful out.

   Every frame is stacked and cross-faded by opacity, rather than
   swapped through AnimatePresence: with the frame list coming from data
   the stack keeps the transition deterministic (no presence
   bookkeeping, no z-order race between the leaving and arriving frame)
   and it costs four absolutely positioned divs.

   Loop discipline (STYLE_GUIDE 7.10, which this panel follows in spirit
   while using JS rather than CSS keyframes: see the changelog entry):
   the cycle pauses offscreen, the SSR frame is always frame 1, and
   reduced motion renders frame 1 alone with nothing animating. */

function FrameBody({ frame, index }: { frame: NewsletterFrame; index: number }) {
  if (frame.src) {
    return (
      <Image
        src={frame.src}
        alt={frame.alt ?? ""}
        fill
        sizes="(min-width: 1024px) 40vw, 90vw"
        className="object-cover"
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-surf">
      {/* ghosted index numeral, the FeaturedWork placeholder treatment:
          the slot reads as composed rather than broken */}
      <span
        aria-hidden
        className="absolute -bottom-[0.14em] right-4 font-display text-[clamp(120px,13vw,220px)] leading-none text-ink opacity-[0.05]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <p className="max-w-[26ch] px-6 text-center font-mono text-mono-sm uppercase text-sec-mid">
        {frame.note}
      </p>
    </div>
  );
}

export function NewsletterPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: IN_VIEW_MARGIN });
  const reduced = useReducedMotionSafe();
  const [index, setIndex] = useState(0);

  const count = NEWSLETTER_FRAMES.length;
  const play = inView && !reduced && count > 1;

  useEffect(() => {
    if (!play) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % count),
      NEWSLETTER_FRAME_MS,
    );
    return () => window.clearInterval(timer);
  }, [play, count]);

  /* Reduced motion holds frame 1 and its counter, so the chip never
     claims a cycle that is not running. */
  const shown = reduced ? 0 : index;
  const frames = reduced ? NEWSLETTER_FRAMES.slice(0, 1) : NEWSLETTER_FRAMES;

  return (
    <div
      ref={ref}
      className="relative aspect-square overflow-hidden rounded-[var(--radius-media)] border border-sec-line bg-surf"
    >
      {frames.map((frame, frameIndex) => {
        const active = frameIndex === shown;
        return (
          <motion.div
            key={frame.id}
            aria-hidden={!active}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: active ? 1 : 0,
              scale: active ? 1 : 1.04,
            }}
            transition={{ duration: reduced ? 0 : 0.9, ease: EASE.soft }}
          >
            <FrameBody frame={frame} index={frameIndex} />
          </motion.div>
        );
      })}

      {/* counter chip: our answer to the reference's "SINCE 2012" tag.
          It earns its place by saying the panel cycles, and we do not
          know a founding year to put there (copy-rules claims). */}
      <span className="absolute bottom-4 right-4 rounded-full border border-sec-line bg-sec-bg/85 px-2.5 py-1 font-mono text-mono-sm uppercase tabular-nums text-sec-mid">
        {String(shown + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
      </span>
    </div>
  );
}
