"use client";

import { Note, Sketch } from "@/components/shared/draft/Draft";
import { pHead } from "@/components/shared/draft/pencil";

/* The search section's margin note:
   one handwritten line and a pencil arrow curling into the composer, the
   footer's "Denver, Tampa" move. Desktop only, like the footer's notes:
   on a phone there is no margin to write in. */

const ARROW = [
  { d: "M6 8 C30 6 52 18 62 46", i: 0 },
  { d: pHead(62, 46, 1.2, 10, 3), i: 1 },
];

export function SearchNote() {
  return (
    <div aria-hidden className="pointer-events-none absolute -top-12 left-[4%] z-10 hidden md:block">
      <Note lines={["The new", "search bar"]} delay={0.3} className="-rotate-6" />
      <Sketch strokes={ARROW} viewBox="0 0 80 60" delay={0.8} className="absolute left-[9.5em] top-2 h-[60px] w-[80px] text-sec-acc" />
    </div>
  );
}
