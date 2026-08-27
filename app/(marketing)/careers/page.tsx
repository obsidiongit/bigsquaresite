import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { MediaSlot } from "@/components/shared/MediaSlot";
import { BracketIndex, Chip, Eyebrow } from "@/components/shared/mono";
import { OfficeCards } from "@/components/shared/OfficeCards";
import { Section } from "@/components/shared/Section";
import { OPEN_ROLES } from "@/lib/careers";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { EDGE } from "@/lib/layout";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Careers at BigSquare" },
  description:
    "Work at BigSquare Marketing. Offices in Denver and Tampa, clients across the country, and work you will want your name on.",
  alternates: { canonical: "/careers/" },
};

/* /careers/ (careers.md v2, Batch 2): a short light trust page. No
   invented roles, perks, or policies: lib/careers.ts holds the roles
   (empty until real), the pillars come from project-brief.md, and the
   closing ask is "send us your work" (no CtaBand: careers pages do not
   push Schedule a Call, v1 rule kept).

   Annotation budget: 1 of 3 (H1 underline). No registration marks. */

const THE_WORK = [
  {
    head: "Premium work, in house.",
    body: "Brand, design, film, and code made by our own team. The work is the pitch, so it has to be good.",
  },
  {
    head: "One team, every channel.",
    body: "Search, ads, sites, and creative in one room. You learn the whole system, not one silo.",
  },
  {
    head: "Proof before promises.",
    body: "Clients can check our numbers any day. Work here and your results are the kind you can point at.",
  },
];

export default function CareersPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers/" },
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
          <Eyebrow className="mt-4">Careers</Eyebrow>

          <div className="mt-6 flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-6">
            <Reveal className="md:col-span-8">
              <h1 className="max-w-[16ch] font-display text-h1 text-sec-ink">
                Do the{" "}
                <RoughAnnotation
                  variant="underline"
                  delay={0.7}
                  className="whitespace-nowrap"
                >
                  best work
                </RoughAnnotation>{" "}
                of your career
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-end">
              <p className="max-w-[40ch] text-body text-sec-mid">
                Offices in Denver and Tampa, clients across the country.
                [PLACEHOLDER: remote policy, from Brad]
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 2. The work: the three real pillars, candidate-side */}
      <Section theme="tint">
        <div className={EDGE}>
          <Eyebrow>The work</Eyebrow>
          <h2 className="mt-4 max-w-[24ch] font-display text-h2 text-sec-ink">
            What you would be part of
          </h2>
          <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-6">
            {THE_WORK.map((card, i) => (
              <Reveal key={card.head} delay={i * 0.08}>
                <div className="h-full rounded-[24px] border border-sec-line bg-paper p-6 md:p-8">
                  <BracketIndex n={i + 1} className="text-sec-acc" />
                  <h3 className="mt-5 text-h3 font-bold text-sec-ink">
                    {card.head}
                  </h3>
                  <p className="mt-3 text-body text-sec-mid">{card.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* 3. Open roles: real rows when lib/careers.ts has them; the
          designed empty state until then */}
      <Section theme="light">
        <div className={EDGE}>
          <div className="max-w-[880px]">
            <Eyebrow>Open roles</Eyebrow>
            {OPEN_ROLES.length > 0 ? (
              <div className="mt-8">
                {OPEN_ROLES.map((role) => (
                  <div
                    key={role.slug}
                    className="flex flex-col gap-2 border-t border-sec-line py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <h3 className="text-h3 font-bold text-sec-ink">
                      {role.title}
                    </h3>
                    <p className="font-mono text-mono-sm uppercase text-sec-mid">
                      {role.location} · {role.type}
                    </p>
                  </div>
                ))}
                <div className="border-t border-sec-line" />
              </div>
            ) : (
              <Reveal className="mt-8">
                <div className="rounded-[24px] border border-sec-line bg-surf p-6 md:p-8">
                  <Chip className="text-sec-mid">Roles</Chip>
                  <p className="mt-4 font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
                    [PLACEHOLDER: open roles from Brad. Rows land in
                    lib/careers.ts and render here]
                  </p>
                  <p className="mt-6 max-w-[52ch] text-body text-sec-ink">
                    Roles get posted here as they open. Send us your work
                    anyway and tell us what you do:
                  </p>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="mt-3 inline-block text-body font-medium text-sec-ink underline underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-sec-acc"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </Section>

      {/* 4. The offices + the team band (about-team: one real photo
          lights /about/ and this page) */}
      <Section theme="light" size="none" className="pb-section-y">
        <div className={EDGE}>
          <Eyebrow>Where we work</Eyebrow>
          <OfficeCards className="mt-6 max-w-[880px]" />
          <MediaSlot
            id="about-team"
            note="The whole team, one frame. Real photos only, no stock."
            alt="The BigSquare team"
            aspectClassName="aspect-video md:aspect-[21/9]"
            marks={false}
            className="mt-6"
          />
        </div>
      </Section>

      {/* 5. The close: the page's ask */}
      <Section theme="light" size="none" className="pb-section-y-lg">
        <div className={EDGE}>
          <Reveal>
            <p className="max-w-[24ch] font-display text-h2 text-sec-ink">
              Show us what you make.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-6 inline-block text-lead font-medium text-sec-ink underline underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-sec-acc"
            >
              {SUPPORT_EMAIL}
            </a>
          </Reveal>
        </div>
      </Section>
    </main>
  );
}
