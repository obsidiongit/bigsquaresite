import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { WordReveal } from "@/components/motion/WordReveal";
import { BracketCta } from "@/components/shared/BracketCta";
import { Container } from "@/components/shared/Container";
import { GridLines } from "@/components/shared/GridLines";
import { InfoBar } from "@/components/shared/InfoBar";
import { BracketIndex, Chip, Counter, Eyebrow, NoLabel } from "@/components/shared/mono";
import { RegistrationMarks } from "@/components/shared/RegistrationMarks";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";

/* Dev-only styleguide test bed for the Phase 2 groundwork primitives.
   Renders every primitive on all four data-theme grounds. Never ships:
   notFound() outside development, and it is not listed in sitemap.ts
   (the sitemap is an explicit allowlist). */

export const metadata: Metadata = {
  title: "Styleguide test bed",
  robots: { index: false, follow: false },
};

const THEMES = ["light", "tint", "dark", "accent"] as const;

const CARDS = [
  {
    title: "Grow",
    body: "Open more locations and get more revenue out of the ones you have.",
  },
  {
    title: "Proof",
    body: "Numbers, case studies, and a portal the client can log into.",
  },
  {
    title: "Report",
    body: "Performance you can audit, any day you want to check it.",
  },
];

function ThemeShowcase({
  theme,
  index,
}: {
  theme: (typeof THEMES)[number];
  index: number;
}) {
  return (
    <Section theme={theme}>
      <GridLines quarters={theme === "light"} />
      <Container className="relative">
        <SectionHeader
          no={index + 1}
          label={theme}
          title={`Every primitive on the ${theme} ground`}
          support={
            <p>
              Same components, no per-ground code. Everything below reads the
              section theme tokens.
            </p>
          }
          actions={<BracketCta href="/schedule/">See the Results</BracketCta>}
        />

        {/* mono meta family (6.2) */}
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Eyebrow>Eyebrow label</Eyebrow>
          <NoLabel n={index + 1} label="Intro" />
          <span>
            <BracketIndex n={1} /> <BracketIndex n={2} />
          </span>
          <Counter current={index + 1} total={THEMES.length} />
          <Chip>Organic Marketing</Chip>
          <Chip>
            <span className="text-sec-acc">Day 01 to 30</span>
          </Chip>
          <Chip variant="solid">+000% [Metric]</Chip>
        </div>

        {/* Reveal stagger over base cards (7.3) */}
        <Reveal stagger className="mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
          {CARDS.map((card, i) => (
            <RevealItem
              key={card.title}
              className="rounded-card border border-sec-line p-6"
            >
              <BracketIndex n={i + 1} />
              <h3 className="mt-4 font-sans text-h3 font-bold text-sec-ink">
                {card.title}
              </h3>
              <p className="mt-2 text-body text-sec-mid">{card.body}</p>
            </RevealItem>
          ))}
        </Reveal>

        {/* CountUp metric (7.3); sample value for the motion test only */}
        <div className="mt-12">
          <Eyebrow>Count up. Sample value, motion test only.</Eyebrow>
          <p className="mt-2 font-display text-metric text-sec-acc">
            <CountUp value={100} prefix="+" suffix="%" />
          </p>
        </div>

        {/* Annotations (6.1, 8): underline and circle variants */}
        <p className="mt-12 max-w-[65ch] text-lead text-sec-ink">
          We answer to your numbers. The plan is{" "}
          <RoughAnnotation variant="underline">
            <span>simple and clear</span>
          </RoughAnnotation>
          , and the report shows{" "}
          <RoughAnnotation variant="circle">
            <span>proof</span>
          </RoughAnnotation>
          , not promises.
        </p>

        {/* ClipReveal media frame with registration marks (4.3, 7.3) */}
        <div className="relative mt-16">
          <ClipReveal>
            <div className="flex aspect-video items-center justify-center bg-darkpanel">
              <p className="font-mono text-eyebrow uppercase text-ondarkmid">
                [Placeholder: framed media]
              </p>
            </div>
          </ClipReveal>
          <RegistrationMarks />
        </div>

        {/* standalone SeparatorIn rule rows (4.3) */}
        <div className="mt-16">
          {["Organic Marketing", "Paid Advertising", "Design & Development"].map(
            (label, i) => (
              <div key={label}>
                <SeparatorIn />
                <div className="flex items-center justify-between py-4">
                  <span className="text-body text-sec-ink">
                    <BracketIndex n={i + 1} className="mr-3" />
                    {label}
                  </span>
                  <span aria-hidden className="text-sec-mid">
                    →
                  </span>
                </div>
              </div>
            ),
          )}
          <SeparatorIn />
        </div>
      </Container>

      {/* InfoBar (6.6) */}
      <InfoBar
        className="mt-16"
        links={[
          { label: "Results", href: "/schedule/" },
          { label: "Audit", href: "/audit/" },
        ]}
      />
    </Section>
  );
}

export default function StyleguidePage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <main>
      <Section theme="light" size="lg">
        <GridLines />
        <Container className="relative">
          <Eyebrow>Dev only. Groundwork test bed.</Eyebrow>
          <BaselineReveal
            as="h1"
            onMount
            className="mt-4 max-w-[16ch] font-display text-h1 text-sec-ink"
          >
            The design system, on every ground it ships on
          </BaselineReveal>
          <WordReveal
            as="p"
            delay={0.4}
            onMount
            className="mt-8 max-w-[24ch] font-display text-statement text-sec-ink"
          >
            We don't guess. We report.
          </WordReveal>
          <p className="mt-6 max-w-[65ch] text-body text-sec-mid">
            Each section below repeats the full primitive kit on one of the 4
            theme grounds: light, tint, dark, and accent. Check 375, 768, 1280,
            and 1536, then again with reduced motion emulated.
          </p>
        </Container>
      </Section>
      {THEMES.map((theme, i) => (
        <ThemeShowcase key={theme} theme={theme} index={i} />
      ))}
    </main>
  );
}
