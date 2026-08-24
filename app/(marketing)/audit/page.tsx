import type { Metadata } from "next";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a Free Marketing Audit",
  description:
    "Request a free marketing audit from BigSquare. See what is working, what is not, and what to fix first.",
  alternates: { canonical: "/audit/" },
};

// Phase 1 stub so every CTA resolves from day one. The real form page ships
// in Phase 7 (spec: project-sections/conversion/audit.md).
export default function AuditPage() {
  return (
    <main className="mx-auto max-w-[720px] px-[clamp(20px,4vw,48px)] pt-32 pb-16 text-center md:pt-40 md:pb-24">
      <h1 className="font-display text-[40px] leading-[1.05] tracking-[-0.015em] text-ink md:text-[64px]">
        Get a free marketing audit
      </h1>
      <p className="mx-auto mt-6 max-w-[60ch] text-lg leading-[1.6] text-mid">
        We look at your search rankings, your ads, and your site. You get a
        clear list of what to fix first.
      </p>
      <div className="mt-12 rounded-card border border-line bg-surf p-8 md:p-12">
        <p className="text-mid">
          [PLACEHOLDER: audit request form, built in Phase 7 on the shared form
          action]
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
