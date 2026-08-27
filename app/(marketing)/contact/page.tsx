import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { Faq } from "@/components/shared/Faq";
import { Eyebrow } from "@/components/shared/mono";
import { OfficeCards } from "@/components/shared/OfficeCards";
import { Section } from "@/components/shared/Section";
import { BUYER_PROCESS_FAQ } from "@/lib/faq";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { EDGE } from "@/lib/layout";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Contact BigSquare Marketing" },
  description:
    "Reach BigSquare Marketing. Send a message, call an office in Denver or Tampa, or book a time that works for you.",
  alternates: { canonical: "/contact/" },
};

/* /contact/ (contact.md v2): the quiet utility conversion page. Form
   left, offices right, the D5 buyer-process FAQ below. No SquareField,
   no CtaBand: a person here wants to reach us, so the page gets out
   of the way.

   Annotation budget: 1 of 3 (H1 underline). */

export default function ContactPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact/" },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero + the split: form left, offices right */}
      <Section theme="light" size="none" className="pt-32 pb-section-y md:pt-36">
        <div className={EDGE}>
          <SeparatorIn />
          <Eyebrow className="mt-4">Contact</Eyebrow>

          <div className="mt-6 flex flex-col gap-6 md:grid md:grid-cols-12 md:items-end md:gap-6">
            <Reveal className="md:col-span-7">
              <h1 className="font-display text-h1 text-sec-ink">
                <RoughAnnotation
                  variant="underline"
                  delay={0.7}
                  className="whitespace-nowrap"
                >
                  Talk to us.
                </RoughAnnotation>
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-5 md:col-start-8">
              <p className="max-w-[40ch] text-body text-sec-mid">
                Want to skip the form? Book a time that works:{" "}
                <Link
                  href="/schedule/"
                  className="font-medium text-sec-ink underline underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-sec-acc"
                >
                  Schedule a Call
                </Link>
              </p>
            </Reveal>
          </div>

          <div className="mt-10 flex flex-col gap-10 md:mt-12 lg:grid lg:grid-cols-12 lg:gap-6">
            <Reveal delay={0.15} className="lg:col-span-7">
              <div className="rounded-[24px] border border-sec-line bg-surf p-6 sm:p-8">
                <ContactForm />
              </div>
            </Reveal>
            <div className="lg:col-span-5">
              <p className="font-mono text-eyebrow uppercase text-sec-mid">
                The offices
              </p>
              <OfficeCards layout="stack" className="mt-4" />
              <div className="mt-6">
                <p className="font-mono text-eyebrow uppercase text-sec-mid">
                  Email
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="mt-2 inline-block text-body font-medium text-sec-ink underline underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-sec-acc"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 2. Common questions (D5: the buyer-process set) */}
      <Section theme="light" size="none" className="pb-section-y-lg">
        <div className="px-gutter-x">
          <Faq title="Common questions" items={BUYER_PROCESS_FAQ} />
        </div>
      </Section>
    </main>
  );
}
