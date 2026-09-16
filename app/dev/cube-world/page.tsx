import type { Metadata } from "next";
import { WorldStage } from "@/components/sections/home/cube/WorldStage";

export const metadata: Metadata = {
  title: "Cube world: the hero moves",
  robots: { index: false, follow: false },
};

/* The hero world (project-guidelines/cube-v2/brief.md, sections 6, 9
   and 10). Round 1: the town at rest. Round 2: the camera path, the
   roll onto the film station, the film on the face, the reform. A
   standalone route so the world can be judged as the real fold, and
   the team's option board while the site's animation is pieced
   together (Brad, round 1 review): it does not replace HomeCanvas. */
export default function CubeWorldPage() {
  return <WorldStage />;
}
