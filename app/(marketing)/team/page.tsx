import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { TeamGrid } from "@/components/sections/team/TeamGrid";
import { CtaBand } from "@/components/shared/CtaBand";
import { Eyebrow } from "@/components/shared/mono";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";
import { TEAM } from "@/lib/team";

export const metadata: Metadata = {
  title: "Meet the Team",
  description:
    "The people behind BigSquare Marketing: who runs your search, your ads, and your sites.",
  alternates: { canonical: "/team/" },
  // Noindex until the profiles are real (headshots + each member's own
  // answers in lib/team.ts). Flip this and add /team/ to app/sitemap.ts
  // together.
  robots: { index: false },
};

/* /team/ (project-sections/company/team.md; replaces /leadership/,
   Brad 2026-08-31: "make it a team section, a lot more robust and a
   lot more fun... early MySpace vibe, Tumblr-era... people will land
   there"). The roster wall + the profile window live in TeamGrid;
   names and roles are the 6 real registered members, every personal
   field a designed [PLACEHOLDER] until the person fills the
   questionnaire in the spec file. Annotation budget: 1 of 3 (the H1
   underline). No registration marks. */

export default function TeamPage() {
  return (
    <main>
      {/* 1. Hero */}
      <Section theme="light" size="none" className="pt-32 pb-14 md:pt-36 md:pb-16">
        <div className={EDGE}>
          <SeparatorIn />
          <Eyebrow className="mt-4">The team</Eyebrow>

          <div className="mt-6 flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-6">
            <Reveal className="md:col-span-8">
              <h1 className="max-w-[18ch] font-display text-h1 text-sec-ink">
                The{" "}
                <RoughAnnotation
                  variant="underline"
                  delay={0.7}
                  className="whitespace-nowrap font-accent"
                >
                  humans
                </RoughAnnotation>{" "}
                behind the numbers
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-end">
              <p className="max-w-[40ch] text-body text-sec-mid">
                The people who run your search, your ads, and your sites. Click
                a card, meet a person.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 2. The wall */}
      <Section theme="light" size="none" className="pb-section-y-lg">
        <div className={EDGE}>
          <TeamGrid cards={TEAM} />
        </div>
      </Section>

      {/* 3. The close */}
      <CtaBand />
    </main>
  );
}
