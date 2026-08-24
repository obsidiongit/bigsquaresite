import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy" },
  alternates: { canonical: "/privacy-policy/" },
};

// Skeleton per decisions.md: heading, last-updated date, and section
// headings only. No legal body text until counsel provides it.
const SECTIONS = [
  "Information we collect",
  "How we use information",
  "Cookies and tracking",
  "How we share information",
  "Data retention",
  "Your rights and choices",
  "Contact us",
];

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-[720px] px-[clamp(20px,4vw,48px)] pt-32 pb-16 md:pt-40 md:pb-24">
      <h1 className="font-display text-[40px] leading-[1.05] tracking-[-0.015em] text-ink md:text-[64px]">
        Privacy policy
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
