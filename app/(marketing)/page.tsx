import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/Hero";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Homepage sections build in Phase 2, one phase per session, in spec
// order (project-sections/home/). 2A hero is live; trust marquee and
// the rest follow.
export default function HomePage() {
  return (
    <main>
      <Hero />
      <section className="py-section-y">
        <p className="mx-auto max-w-[1200px] px-gutter-x text-body text-mid">
          [PLACEHOLDER: sections 3 to 13 build in phases 2C to 2H]
        </p>
      </section>
    </main>
  );
}
