import type { Metadata } from "next";
import { FeaturedWork } from "@/components/sections/home/FeaturedWork";
import { Hero } from "@/components/sections/home/Hero";
import { HomeStage } from "@/components/sections/home/HomeStage";
import { Problem } from "@/components/sections/home/Problem";
import { Services } from "@/components/sections/home/Services";
import { Solution } from "@/components/sections/home/Solution";
import { TrustMarquee } from "@/components/sections/home/TrustMarquee";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Homepage sections build in Phase 2, one phase per session. Below
// FeaturedWork the page runs the Youtech open layout in the region
// order locked 2026-08-24 (tasks.md region pivot): ProblemStrip,
// Solution, Search, Services, Testimonial, ProofBand, TrustMarquee.
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
        <Problem />
        <Solution />
        <Services />
        <TrustMarquee />
      </HomeStage>
      <section className="py-section-y">
        <p className="mx-auto max-w-[1200px] px-gutter-x text-body text-mid">
          [PLACEHOLDER: search, testimonial, and proof band sections build
          in the next region sessions (2D-R part 2, 2E-R); portal, process,
          FAQ, and CTA band follow in 2F to 2H]
        </p>
      </section>
    </main>
  );
}
