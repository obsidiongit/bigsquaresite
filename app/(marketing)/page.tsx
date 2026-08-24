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

// Homepage sections build in Phase 2, one phase per session, in spec
// order (project-sections/home/). HomeStage hosts the page-level fixed
// WebGL canvas: the hero's glass cube reforms after the film beat and
// travels the sections below as a companion object (2.hero.md v6).
export default function HomePage() {
  return (
    <main>
      <HomeStage>
        <Hero />
        <FeaturedWork />
        <TrustMarquee />
        <Problem />
        <Solution />
        <Services />
      </HomeStage>
      <section className="py-section-y">
        <p className="mx-auto max-w-[1200px] px-gutter-x text-body text-mid">
          [PLACEHOLDER: sections 7 to 13 build in phases 2E to 2H]
        </p>
      </section>
    </main>
  );
}
