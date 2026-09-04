import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { CtaBand } from "@/components/shared/CtaBand";
import { MediaSlot } from "@/components/shared/MediaSlot";
import { Eyebrow } from "@/components/shared/mono";
import { Section } from "@/components/shared/Section";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { EDGE } from "@/lib/layout";
import { LOCATION_PAGES } from "@/lib/location-pages";
import { OFFICES } from "@/lib/offices";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Offices",
  description:
    "BigSquare Marketing works from Denver, Colorado and Tampa, Florida, with clients across the country. Visit an office or meet us on a call.",
  alternates: { canonical: "/locations/" },
};

/* /locations/ (locations-index.md v2): the short routing page. Two
   city panels built from lib/offices.ts (facts render the honest mono
   placeholder while null), each linking into its city page, then the
   not-near-an-office beat. LocalBusiness JSON-LD lives on the child
   pages only.

   Annotation budget: 2 of 3 (H1 circle, CtaBand bracket). No
   registration marks (new-page rule). */

export default function LocationsPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations/" },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero */}
      <Section theme="light" size="none" className="pt-32 pb-section-y md:pt-36">
        <div className={EDGE}>
          <SeparatorIn />
          <Eyebrow className="mt-4">Locations</Eyebrow>

          <div className="mt-6 flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-6">
            <Reveal className="md:col-span-8">
              <h1 className="max-w-[18ch] font-display text-h1 text-sec-ink">
                <RoughAnnotation
                  variant="circle"
                  delay={0.7}
                  className="whitespace-nowrap"
                >
                  Two offices.
                </RoughAnnotation>{" "}
                Brands across the country.
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-end">
              <p className="max-w-[40ch] text-body text-sec-mid">
                Come see us in Denver or Tampa, or meet us on a call. Most of
                our clients never visit an office, and their numbers do not
                care.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 2. The two city panels */}
      <Section theme="light" size="none" className="pb-section-y">
        <div className={EDGE}>
          <div className="grid gap-6 md:grid-cols-2">
            {OFFICES.map((office, i) => {
              const media = LOCATION_PAGES[office.slug].media;
              return (
                <Reveal key={office.slug} delay={i * 0.08}>
                  <Link
                    href={office.href}
                    aria-label={`${office.city}, ${office.state}`}
                    className="group block"
                  >
                    <MediaSlot
                      id={media.id}
                      note={media.note}
                      alt=""
                      aspect="3 / 2"
                    />
                    <div className="mt-5 flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-h2 text-sec-ink">
                        {office.city}
                      </h2>
                      <span
                        aria-hidden
                        className="text-[18px] text-sec-mid transition-transform duration-[250ms] ease-house group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                      >
                        →
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-mono-sm uppercase text-sec-mid">
                      {office.state}
                    </p>
                    <div className="mt-4 flex flex-col gap-1.5 border-t border-sec-line pt-4">
                      <p className="font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
                        {office.address ?? "[PLACEHOLDER: street address]"}
                      </p>
                      <p className="font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
                        {office.phone ?? "[PLACEHOLDER: phone]"}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      {/* 3. Not near an office */}
      <Section theme="light" size="none" className="pb-section-y-lg">
        <div className={EDGE}>
          <div className="max-w-[720px]">
            <Eyebrow>Not near an office?</Eyebrow>
            <p className="mt-4 text-lead text-sec-ink">
              Most of the work happens on video calls and in your dashboard.
              We serve brands in every state, from 1 location to hundreds.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-6 inline-block text-body font-medium text-sec-ink underline underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-sec-acc"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </Section>

      {/* 4. The closing ask */}
      <CtaBand />
    </main>
  );
}
