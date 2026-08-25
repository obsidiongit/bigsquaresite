import type { Metadata } from "next";
import { FeaturedWork } from "@/components/sections/home/FeaturedWork";
import { Hero } from "@/components/sections/home/Hero";
import { HomeStage } from "@/components/sections/home/HomeStage";
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
// replaces them (Services is the rejected 2D build; accepted for now).
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
      </HomeStage>
      <section className="py-section-y">
        <p className="mx-auto max-w-[1200px] px-gutter-x text-body text-mid">
          [PLACEHOLDER: testimonial and proof band sections build in the
          next region session (2E-R); portal, process, FAQ, and CTA band
          follow in 2F to 2H]
        </p>
      </section>
    </main>
  );
}
