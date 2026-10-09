"use client";

import { WorkClip } from "@/components/sections/home/WorkClip";

/* An empty <MediaSlot> plays a short window of the BigSquare showreel
   instead of its grey ASSET panel, until the real photo lands in
   lib/asset-files. The window is picked from the slot id, so a slot
   always shows the same shot. */
export function SlotFill({ id }: { id: string }) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (
    <div aria-hidden className="absolute inset-0 bg-darkpanel">
      <WorkClip index={h % 12} />
    </div>
  );
}
