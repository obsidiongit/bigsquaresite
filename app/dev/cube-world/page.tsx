import type { Metadata } from "next";
import { WorldStage } from "@/components/sections/home/cube/WorldStage";

export const metadata: Metadata = {
  title: "Cube world: the town at rest",
  robots: { index: false, follow: false },
};

/* Round 1 of the hero world (project-guidelines/cube-v2/brief.md,
   sections 6, 9 and 10: the town at rest). A standalone route so the
   world can be judged as the real fold before it replaces HomeCanvas. */
export default function CubeWorldPage() {
  return <WorldStage />;
}
