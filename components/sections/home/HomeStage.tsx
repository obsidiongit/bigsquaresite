"use client";

import { SquareField } from "@/components/motion/SquareField";

/* HomeStage: the homepage's ambient layer, the floating square outlines
   (SquareField, STYLE_GUIDE 7.4) on a fixed layer under every section's
   ink. Sections keep their content in a `relative z-10` layer and may
   carry a data-cube-anchor attribute (the TV hero and a few sections
   still read them as plain hooks).

   2026-10-09: the page-level WebGL canvas (the glass-cube hero and its
   companion journey, HomeCanvas) is no longer mounted here; the TV hero
   replaced it. HomeCanvas stays in the repo for /dev/cube-world. */
export function HomeStage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SquareField heroStage={false} />
      <div>{children}</div>
    </>
  );
}
