import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { SquareField } from "@/components/motion/SquareField";
import { TrustMarquee } from "@/components/sections/home/TrustMarquee";
import { ScheduleForm } from "@/components/sections/schedule/ScheduleForm";
import { VslPlayer } from "@/components/sections/schedule/VslPlayer";
import { Faq } from "@/components/shared/Faq";
import { Eyebrow } from "@/components/shared/mono";
import { NumberedRuledList } from "@/components/shared/NumberedRuledList";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { BUYER_PROCESS_FAQ } from "@/lib/faq";
import { EDGE } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Schedule a Call",
  description:
    "Book a 30-minute call with BigSquare. We look at your accounts together and tell you what we would do first. No long-term contracts.",
  alternates: { canonical: "/schedule/" },
};

/* /schedule/ v2 (conversion/schedule.md v2): the primary conversion
   page, rebuilt after Brad's round-1 review ("bland, weak... this is
   where all of our organic traffic is gonna go"). The conversion
   stage: VSL left (the trust builder), the short application form
   right (in place of the retired booking calendar; executes fully on
   this page), what-happens rows under the film. Then the partner
   strip, the buyer-process FAQ (D5), and the closing statement that
   anchors back to the form. Still no competing CTA: every ask on this
   page IS the form.

   Layering: SquareField ambient layer at z-1 (the homepage's quiet
   life); every content wrapper carries relative z-10 so squares pass
   behind panels and ink (the HomeStage contract).

   Annotation budget: 2 of 3 (H1 underline, closing circle). */

const CALL_STEPS = [
  { text: "We look at your accounts together." },
  { text: "We tell you what we would do first." },
  { text: "You decide what happens next." },
];

export default function SchedulePage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Schedule a Call", path: "/schedule/" },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SquareField />

      {/* 1. The conversion stage: H1, VSL, application form, steps */}
      <Section theme="light" size="none" className="pt-32 pb-16 md:pt-36 md:pb-20">
        <div className={`${EDGE} relative z-10`}>
          <SeparatorIn />
          <Eyebrow className="mt-4">Schedule a Call</Eyebrow>

          <div className="mt-6 flex flex-col gap-6 md:grid md:grid-cols-12 md:items-end md:gap-6">
            <Reveal className="md:col-span-8">
              <h1 className="max-w-[16ch] font-display text-h1 text-sec-ink">
                Book a call. We bring{" "}
                <RoughAnnotation
                  variant="underline"
                  delay={0.7}
                  className="whitespace-nowrap"
                >
                  the numbers.
                </RoughAnnotation>
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
              <p className="max-w-[40ch] text-body text-sec-mid">
                30 minutes. We look at your accounts together and tell you
                exactly what we would do first.
              </p>
            </Reveal>
          </div>

          <div className="mt-10 flex flex-col gap-6 md:mt-12 lg:grid lg:grid-cols-12">
            <Reveal delay={0.15} className="lg:col-span-7">
              <VslPlayer />
            </Reveal>
            <Reveal
              delay={0.22}
              className="lg:col-span-5 lg:row-span-2"
            >
              <div
                id="book"
                className="h-full scroll-mt-28 rounded-[24px] border border-sec-line bg-surf p-6 sm:p-8"
              >
                <ScheduleForm />
              </div>
            </Reveal>
            <div className="lg:col-span-7">
              <p className="font-mono text-eyebrow uppercase text-sec-mid">
                What happens on the call
              </p>
              <NumberedRuledList
                items={CALL_STEPS}
                size="compact"
                className="mt-4"
              />
              <p className="mt-4 font-mono text-mono-sm uppercase text-sec-mid">
                [PLACEHOLDER: confirm the real steps with Brad or Mike]
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 2. Partner strip: the homepage trust marquee, mirrored here
          (Brad round 2: "taking what we have from the other trust
          section on the home page and mirroring it over here").
          Self-contained, consumed read-only; the page's one velocity
          element, and its circled eyebrow is the page's third
          annotation (budget 3/3 with the H1 underline + closing
          circle). */}
      <div className="pb-section-y">
        <TrustMarquee />
      </div>

      {/* 3. Before you book: buyer-process objections (D5) */}
      <Section theme="light" size="none" className="pb-section-y">
        <div className="px-gutter-x relative z-10">
          <Faq title="Before you book" items={BUYER_PROCESS_FAQ} />
        </div>
      </Section>

      {/* 4. Closing moment: same ask, back to the form */}
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
                  Ready
                </RoughAnnotation>{" "}
                when you are.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-9 flex justify-center">
                <Pill href="#book">Schedule a Call</Pill>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </main>
  );
}
