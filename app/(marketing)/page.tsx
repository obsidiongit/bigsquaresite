import type { Metadata } from "next";
import { DraftDefs } from "@/components/shared/draft/Draft";
import { FeaturedWork } from "@/components/sections/home/FeaturedWork";
import { HomeStage } from "@/components/sections/home/HomeStage";
import { Newsletter } from "@/components/sections/home/Newsletter";
import { PortalBlueStage } from "@/components/sections/home/portal/PortalBlueStage";
import { ProblemSolution } from "@/components/sections/home/ProblemSolution";
import { Search } from "@/components/sections/home/Search";
import { ServicesLanes } from "@/components/sections/home/services/ServicesLanes";
import { TrustMarquee } from "@/components/sections/home/TrustMarquee";
import { TvHero } from "@/components/sections/home/tv/TvHero";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Homepage order (2026-10-09, the review that retired the review toggles):
// the TV hero breaks into squares onto Featured work (now a quiet gallery
// of statics with two films); the old way and the BigSquare way as one
// two-act section with a poster each; Search; the partner logos;
// Services as three lanes, one per group; the Obsidion portal on the blue slab; and
// the newsletter, which closes the page and lifts off the curtain
// footer. Retired from the homepage the same day: the creator wall ("we
// stop thumbs"), the first 90 days (and the closing CTA it carried), the
// glass-cube hero and its canvas companion. Their code is in
// project-guidelines/archive/retired-code/2026-10-09/.
export default function HomePage() {
  return (
    <main>
      {/* the pencil wobble the drafted pieces share (the search section's pen) */}
      <DraftDefs />
      <HomeStage>
        <TvHero />
        <FeaturedWork />
        <ProblemSolution />
        <Search />
        <TrustMarquee />
        <ServicesLanes />
        <PortalBlueStage />
        <Newsletter />
      </HomeStage>
      {/* The curtain footer follows from the marketing layout. */}
    </main>
  );
}
