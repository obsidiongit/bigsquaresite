import type { Metadata } from "next";
import { FeaturedWork } from "@/components/sections/home/FeaturedWork";
import { FirstNinetyDays } from "@/components/sections/home/FirstNinetyDays";
import { Hero } from "@/components/sections/home/Hero";
import { HomeStage } from "@/components/sections/home/HomeStage";
import { Newsletter } from "@/components/sections/home/Newsletter";
import { Portal } from "@/components/sections/home/Portal";
import { ProblemStrip } from "@/components/sections/home/ProblemStrip";
import { ProofBand } from "@/components/sections/home/ProofBand";
import { Search } from "@/components/sections/home/Search";
import { Services } from "@/components/sections/home/Services";
import { Solution } from "@/components/sections/home/Solution";
import { TrustMarquee } from "@/components/sections/home/TrustMarquee";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Homepage sections build in Phase 2, one phase per session. Below
// FeaturedWork the page runs the Youtech open layout. Region order
// updated 2026-08-24 (Brad, proof band session; supersedes the pivot
// order): ProblemStrip, Solution, Search, then the extended trust
// block (ProofBand directly under Search with TrustMarquee riding
// beneath it, Youtech frame 05), then Services, Testimonial.
// Unbuilt sections keep their old components until their session
// replaces them (Services shipped as the spotlight index, 2026-08-25).
// Portal (2F) follows Services directly, per Brad 2026-08-25.
// Newsletter (2F2, 9b.newsletter.md) follows Portal: the brief's
// tertiary goal, on a light ground so the tint portal alternates and
// the page's dark budget stays with the proof band and the footer.
// FirstNinetyDays (2G1, 10.how-it-works.md v3.1) follows Newsletter
// and CLOSES the page: the 90-square day grid on the returning blue
// slab, whose day-90 merge morphs into the site's closing CTA
// (homepage-close restructure, Brad 2026-08-25: testimonial, FAQ,
// and the standalone CTA band are retired from the homepage; the
// footer lands directly under this section in 2I).
// HomeStage hosts the page-level fixed WebGL canvas: the hero's glass
// cube reforms after the film beat and travels the sections below as a
// companion object (2.hero.md v6).
export default function HomePage() {
  return (
    <main>
      <HomeStage>
        <Hero />
        <FeaturedWork />
        <ProblemStrip />
        <Solution />
        <Search />
        <ProofBand />
        <TrustMarquee />
        <Services />
        <Portal />
        <Newsletter />
        <FirstNinetyDays />
      </HomeStage>
      {/* The shared footer follows from the marketing layout (2I). */}
    </main>
  );
}
