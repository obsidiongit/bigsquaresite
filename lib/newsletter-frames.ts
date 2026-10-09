/* The newsletter panel's cycling frames (9b.newsletter.md, decision 2).

   This module is the whole swap contract: the panel renders whatever is
   in this array, so the frame count, the order, and the move from
   placeholder to real photography never touch the section's layout.

   No photography exists in the repo yet, so every frame renders as a
   visible placeholder naming the shot it wants (copy-rules: never leave
   placeholder content looking finished). When Brad delivers cleared,
   square-cropped photos, add `src` and `alt` to each frame and the panel
   renders next/image instead. Nothing else changes. */

export type NewsletterFrame = {
  id: string;
  /** The shot this frame wants. Shown as the placeholder note until src lands. */
  note: string;
  /** Square-crop photo, once one is cleared for use. */
  src?: string;
  /** Required with src. Never decorative: these are people and places. */
  alt?: string;
};

export const NEWSLETTER_FRAMES: NewsletterFrame[] = [
  // stock photography (Unsplash License) until cleared team photos replace it
  { id: "team", note: "A team at work", src: "/media/stock/newsletter-team.webp", alt: "A marketing team talking around a table with laptops" },
  { id: "workshop", note: "A planning session", src: "/media/stock/newsletter-workshop.webp", alt: "Sticky notes being arranged on a planning board" },
  { id: "shoot", note: "A content shoot", src: "/media/stock/newsletter-shoot.webp", alt: "A camera operator filming a product shoot" },
  { id: "build", note: "Design in progress", src: "/media/stock/newsletter-build.webp", alt: "A designer drawing on a tablet in a studio" },
];

/** Milliseconds each frame holds before the crossfade (9b.newsletter.md). */
export const NEWSLETTER_FRAME_MS = 4500;
