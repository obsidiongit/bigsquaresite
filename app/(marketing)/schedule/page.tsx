import type { Metadata } from "next";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Schedule a Call",
  description:
    "Book a call with BigSquare Marketing. Pick a time that works and talk through your growth plan.",
  alternates: { canonical: "/schedule/" },
};

// Phase 1 stub so every CTA resolves from day one. The real page, built on
// the custom GHL booking component, ships in Phase 7 (spec:
// project-sections/conversion/schedule.md).
export default function SchedulePage() {
  return (
    <main className="mx-auto max-w-[720px] px-[clamp(20px,4vw,48px)] py-16 text-center md:py-24">
      <h1 className="font-display text-[40px] leading-[1.05] tracking-[-0.015em] text-ink md:text-[64px]">
        Schedule a call
      </h1>
      <p className="mx-auto mt-6 max-w-[60ch] text-lg leading-[1.6] text-mid">
        Pick a time and we will walk through your locations, your numbers, and
        what we would do first.
      </p>
      <div className="mt-12 rounded-card border border-line bg-surf p-8 md:p-12">
        <p className="text-mid">
          [PLACEHOLDER: booking calendar, built in Phase 5 on GHL. Links to
          [PLACEHOLDER: GHL calendar link] until then]
        </p>
      </div>
      <p className="mt-8 text-mid">
        Prefer email? Write to{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-acc underline">
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    </main>
  );
}
