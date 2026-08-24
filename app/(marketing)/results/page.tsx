import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Results & Case Studies",
  description:
    "Case studies and numbers from multi-location and franchise brands BigSquare works with.",
  alternates: { canonical: "/results/" },
};

// Phase 2B stub so the nav's Results link resolves and the active-link
// annotation can be tested. The real index ships in Phase 7 (spec:
// project-sections/results/results-index.md).
export default function ResultsPage() {
  return (
    <main className="mx-auto max-w-[720px] px-[clamp(20px,4vw,48px)] pt-32 pb-16 text-center md:pt-40 md:pb-24">
      <h1 className="font-display text-[40px] leading-[1.05] tracking-[-0.015em] text-ink md:text-[64px]">
        Results
      </h1>
      <p className="mx-auto mt-6 max-w-[60ch] text-lg leading-[1.6] text-mid">
        Case studies with real numbers are on the way.
      </p>
      <div className="mt-12 rounded-card border border-line bg-surf p-8 md:p-12">
        <p className="text-mid">
          [PLACEHOLDER: case study index, built in Phase 7 once real client
          data exists]
        </p>
      </div>
    </main>
  );
}
