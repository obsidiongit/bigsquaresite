import type { Metadata } from "next";
import { PencilContact } from "@/components/sections/contact/pencil/PencilContact";
import { Faq } from "@/components/shared/Faq";
import { Section } from "@/components/shared/Section";
import { BUYER_PROCESS_FAQ } from "@/lib/faq";
import { breadcrumbJsonLd } from "@/lib/jsonld";

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

      {/* 1. The pencil contact page (the original split layout is archived in
          project-guidelines/archive/retired-code/2026-10-09/) */}
      <PencilContact />

      {/* 2. Common questions (D5: the buyer-process set) */}
      <Section theme="light" size="none" className="pb-section-y-lg">
        <div className="px-gutter-x">
          <Faq title="Common questions" items={BUYER_PROCESS_FAQ} />
        </div>
      </Section>
    </main>
  );
}
