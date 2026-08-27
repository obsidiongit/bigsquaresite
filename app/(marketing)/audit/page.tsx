import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { SquareField } from "@/components/motion/SquareField";
import { AuditForm } from "@/components/sections/audit/AuditForm";
import { Eyebrow } from "@/components/shared/mono";
import { NumberedRuledList } from "@/components/shared/NumberedRuledList";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { EDGE } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Get a Free Marketing Audit",
  description:
    "Request a free marketing audit from BigSquare. We look at your search, your ads, your site, and your tracking, and tell you what to fix first.",
  alternates: { canonical: "/audit/" },
};

/* /audit/ (audit.md v2): the secondary conversion page in the T1
   posture proven on /schedule/. The form is the hero and the only
   ask; no CtaBand, no popup. One screen, all fields visible: the
   secondary path keeps friction low instead of staging steps.

   Layering: SquareField ambient at z-1, content wrappers relative
   z-10 (the HomeStage contract, as mounted on /schedule/).

   Annotation budget: 2 of 3 (H1 underline, closing circle). */

const LOOK_AT = [
  {
    text: "Your search",
    sub: "Where you rank, and what is holding you back.",
  },
  {
    text: "Your ads",
    sub: "What a lead costs you, and where the spend leaks.",
  },
  {
    text: "Your site",
    sub: "What stops a visitor from becoming a lead.",
  },
  {
    text: "Your tracking",
    sub: "What you can see today, and what you are missing.",
  },
];

const AFTER_STEPS = [
  { text: "Your request lands with the team." },
  { text: "We go through your accounts." },
  { text: "You get the report, walked through on a short call." },
];

export default function AuditPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Get a Free Audit", path: "/audit/" },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SquareField />

      {/* 1. The audit stage: H1, supporting column, the form */}
      <Section theme="light" size="none" className="pt-32 pb-16 md:pt-36 md:pb-20">
        <div className={`${EDGE} relative z-10`}>
          <SeparatorIn />
          <Eyebrow className="mt-4">Free audit</Eyebrow>

          <div className="mt-6 flex flex-col gap-6 md:grid md:grid-cols-12 md:items-end md:gap-6">
            <Reveal className="md:col-span-8">
              <h1 className="max-w-[18ch] font-display text-h1 text-sec-ink">
                Get a free{" "}
                <RoughAnnotation
                  variant="underline"
                  delay={0.7}
                  className="whitespace-nowrap"
                >
                  marketing audit
                </RoughAnnotation>
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
              <p className="max-w-[40ch] text-body text-sec-mid">
                A short report on what is working, what is broken, and what
                we would fix first.
              </p>
            </Reveal>
          </div>

          <div className="mt-10 flex flex-col gap-10 md:mt-12 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="order-2 lg:order-none lg:col-span-6">
              <p className="font-mono text-eyebrow uppercase text-sec-mid">
                What we look at
              </p>
              <NumberedRuledList
                items={LOOK_AT}
                size="compact"
                className="mt-4"
              />
              <p className="mt-6 font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
                [PLACEHOLDER: confirm the real audit deliverables and
                turnaround time]
              </p>
            </div>
            <Reveal
              delay={0.15}
              className="order-1 lg:order-none lg:col-span-6"
            >
              <div
                id="audit-form"
                className="scroll-mt-28 rounded-[24px] border border-sec-line bg-surf p-6 sm:p-8"
              >
                <AuditForm />
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 2. What happens after */}
      <Section theme="light" size="none" className="pb-section-y">
        <div className={`${EDGE} relative z-10`}>
          <div className="max-w-[720px]">
            <p className="font-mono text-eyebrow uppercase text-sec-mid">
              What happens after
            </p>
            <NumberedRuledList
              items={AFTER_STEPS}
              size="compact"
              className="mt-4"
            />
          </div>
        </div>
      </Section>

      {/* 3. Closing moment: same ask, back to the form */}
      <Section theme="light" size="none" className="pb-section-y-lg">
        <div className="px-gutter-x relative z-10">
          <div className="mx-auto max-w-[800px] text-center">
            <Reveal>
              <p className="font-display text-statement text-sec-ink">
                <RoughAnnotation
                  variant="circle"
                  delay={0.5}
                  className="whitespace-nowrap"
                >
                  Know
                </RoughAnnotation>{" "}
                where you stand.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-9 flex justify-center">
                <Pill href="#audit-form">Get My Audit</Pill>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </main>
  );
}
