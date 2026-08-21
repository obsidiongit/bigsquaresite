import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service" },
  alternates: { canonical: "/terms/" },
};

// Skeleton per decisions.md: heading, last-updated date, and section
// headings only. No legal body text until counsel provides it.
const SECTIONS = [
  "Agreement to these terms",
  "Our services",
  "Payment and billing",
  "Intellectual property",
  "Limitation of liability",
  "Termination",
  "Governing law",
  "Contact us",
];

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-[720px] px-[clamp(20px,4vw,48px)] py-16 md:py-24">
      <h1 className="font-display text-[40px] leading-[1.05] tracking-[-0.015em] text-ink md:text-[64px]">
        Terms of service
      </h1>
      <p className="mt-4 text-sm text-mid">
        Last updated: [PLACEHOLDER: date]
      </p>
      <div className="mt-12 flex flex-col gap-10">
        {SECTIONS.map((section) => (
          <section key={section}>
            <h2 className="font-display text-2xl text-ink md:text-[32px] md:leading-[1.1]">
              {section}
            </h2>
            <p className="mt-3 text-mid">[PLACEHOLDER: legal copy]</p>
          </section>
        ))}
      </div>
    </main>
  );
}
