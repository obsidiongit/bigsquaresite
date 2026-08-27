import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { CtaBand } from "@/components/shared/CtaBand";
import { Faq } from "@/components/shared/Faq";
import { MediaSlot } from "@/components/shared/MediaSlot";
import { Eyebrow } from "@/components/shared/mono";
import { Pill } from "@/components/shared/Pill";
import { RuleLink } from "@/components/shared/RuleLink";
import { Section } from "@/components/shared/Section";
import { INDUSTRY_PAGES } from "@/lib/industry-pages/registry";
import { breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/jsonld";
import { EDGE } from "@/lib/layout";
import { LOCATION_PAGES } from "@/lib/location-pages";
import { getOffice, type Office } from "@/lib/offices";
import { SERVICE_GROUPS, SERVICES } from "@/lib/services";
import { SITE_NAME, SUPPORT_EMAIL } from "@/lib/site";

/* City pages (project-sections/locations/denver.md v2, the Batch 2
   template): one layout, per-city content from lib/location-pages.ts,
   office FACTS from lib/offices.ts only (address and phone render the
   honest mono placeholder while null; never invented). Quiet interior
   register: open layout, no canvas, no pinned runways.

   Annotation budget: 2 of 3 (H1 underline on the city name, CtaBand
   bracket). No registration marks (new-page rule). */

type Params = { params: Promise<{ city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LOCATION_PAGES).map((city) => ({ city }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city } = await params;
  const content = LOCATION_PAGES[city as Office["slug"]];
  if (!content) return {};
  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: `/locations/${city}/` },
  };
}

export default async function LocationPage({ params }: Params) {
  const { city } = await params;
  const content = LOCATION_PAGES[city as Office["slug"]];
  if (!content) notFound();
  const office = getOffice(content.slug);

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations/" },
    { name: office.city, path: office.href },
  ]);
  const localBusiness = localBusinessJsonLd({
    path: office.href,
    city: office.city,
    stateCode: office.stateCode,
    state: office.state,
    address: office.address,
    phone: office.phone,
    email: SUPPORT_EMAIL,
    siteName: SITE_NAME,
  });

  const industries = Object.values(INDUSTRY_PAGES).map((p) => ({
    slug: p.slug,
    name: p.name,
  }));

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />

      {/* 1. Hero: answer left, office facts card right */}
      <Section theme="light" size="none" className="pt-32 pb-section-y md:pt-36">
        <div className={EDGE}>
          <SeparatorIn />
          <nav
            aria-label="Breadcrumb"
            className="mt-4 font-mono text-eyebrow uppercase text-sec-mid"
          >
            <Link
              href="/locations/"
              className="transition-colors duration-[150ms] hover:text-sec-ink"
            >
              Locations
            </Link>
            <span aria-hidden> / </span>
            <span className="text-sec-ink">{office.city}</span>
          </nav>

          <div className="mt-8 flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <Reveal>
                <h1 className="max-w-[16ch] font-display text-h1 text-sec-ink">
                  BigSquare Marketing,{" "}
                  <RoughAnnotation
                    variant="underline"
                    delay={0.7}
                    className="whitespace-nowrap"
                  >
                    {office.city}
                  </RoughAnnotation>
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-[52ch] text-lead text-sec-mid">
                  {content.answer}
                </p>
                <p className="mt-4 max-w-[52ch] text-body text-sec-mid">
                  {content.answerSupport}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
              <div className="rounded-[24px] border border-sec-line bg-surf p-6 md:p-8">
                <Eyebrow>The office</Eyebrow>
                <p className="mt-4 text-h3 font-bold text-sec-ink">
                  {office.city}, {office.state}
                </p>
                <div className="mt-4 flex flex-col gap-1.5">
                  <p className="font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
                    {office.address ?? "[PLACEHOLDER: street address]"}
                  </p>
                  <p className="font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
                    {office.phone ?? "[PLACEHOLDER: phone]"}
                  </p>
                </div>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="mt-4 inline-block text-body font-medium text-sec-ink underline underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-sec-acc"
                >
                  {SUPPORT_EMAIL}
                </a>
                <div className="mt-8 flex flex-col gap-4">
                  <Pill href="/schedule/" className="w-full justify-center">
                    Schedule a Call
                  </Pill>
                  <Pill
                    href="/audit/"
                    variant="secondary"
                    className="w-full justify-center"
                  >
                    Get a Free Audit
                  </Pill>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 2. The office band */}
      <Section theme="light" size="none" className="pb-section-y">
        <div className={EDGE}>
          <MediaSlot
            id={content.media.id}
            note={content.media.note}
            alt={content.media.alt}
            aspectClassName="aspect-video md:aspect-[21/9]"
            marks={false}
          />
        </div>
      </Section>

      {/* 3. What we do from here: the internal-linking table */}
      <Section theme="tint">
        <div className={EDGE}>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-12 md:gap-6">
            <div className="md:col-span-7">
              <Eyebrow>Services</Eyebrow>
              <h2 className="mt-4 max-w-[24ch] font-display text-h2 text-sec-ink">
                What we do from {office.city}
              </h2>
            </div>
            <p className="max-w-[40ch] text-small text-sec-mid md:col-span-4 md:col-start-9 md:self-end">
              {content.whatWeDoLine}
            </p>
          </div>

          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
            {SERVICE_GROUPS.map((group, gi) => (
              <Reveal key={group.slug} delay={gi * 0.06}>
                <h3 className="text-[16px] font-bold text-sec-ink">
                  {group.name}
                </h3>
                <ul className="mt-3">
                  {SERVICES.filter((s) => s.group === group.slug).map(
                    (service) => (
                      <li key={service.slug}>
                        <RuleLink
                          href={`/services/${service.slug}/`}
                          size="sm"
                        >
                          {service.name}
                        </RuleLink>
                      </li>
                    ),
                  )}
                </ul>
              </Reveal>
            ))}
            <Reveal delay={0.18}>
              <h3 className="text-[16px] font-bold text-sec-ink">Industries</h3>
              <ul className="mt-3">
                {industries.map((industry) => (
                  <li key={industry.slug}>
                    <RuleLink href={`/industries/${industry.slug}/`} size="sm">
                      {industry.name}
                    </RuleLink>
                  </li>
                ))}
                <li>
                  <RuleLink href="/industries/" size="sm" arrow="→">
                    All industries
                  </RuleLink>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 4. Local FAQ (FAQPage JSON-LD from the same array) */}
      <Section theme="light">
        <div className="px-gutter-x">
          <Faq title="Common questions" items={content.faq} />
        </div>
      </Section>

      {/* 5. The closing ask */}
      <CtaBand />
    </main>
  );
}
