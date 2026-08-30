import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { CtaBand } from "@/components/shared/CtaBand";
import { MediaSlot } from "@/components/shared/MediaSlot";
import { Eyebrow } from "@/components/shared/mono";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";
import { LEADERS } from "@/lib/leadership";

export const metadata: Metadata = {
  title: "Leadership Team",
  description:
    "The people who run BigSquare accounts: who they are and what they own.",
  alternates: { canonical: "/leadership/" },
  // Noindex until real people land in lib/leadership.ts (spec rule: this
  // page does not ship until real people are provided). Flip this and add
  // the route to app/sitemap.ts together.
  robots: { index: false },
};

/* /leadership/ (project-sections/company/leadership.md; laid out
   2026-08-31, Pane C). The spec predates the pivots: names render in
   Lenia Mono 700 (the one family), the open layout applies, no
   registration marks. Every card field is a visible [PLACEHOLDER] from
   lib/leadership.ts until Brad supplies real people; no JSON-LD while
   the content is placeholder (structured data never carries
   placeholders). Annotation budget: 0 of 3. */

export default function LeadershipPage() {
  return (
    <main>
      {/* 1. Hero */}
      <Section theme="light" size="none" className="pt-32 pb-section-y md:pt-36">
        <div className={EDGE}>
          <SeparatorIn />
          <Eyebrow className="mt-4">Leadership</Eyebrow>

          <div className="mt-6 flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-6">
            <Reveal className="md:col-span-8">
              <h1 className="max-w-[16ch] font-display text-h1 text-sec-ink">
                The people running your account
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-end">
              <p className="max-w-[40ch] text-body text-sec-mid">
                [PLACEHOLDER: intro line, confirm wording with Brad. Draft: The
                people on this page are the ones in your account, not a sales
                layer.]
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 2. The cards: 3-up desktop, 1-up mobile, square photo slots */}
      <Section theme="light" size="none" className="pb-section-y-lg">
        <div className={EDGE}>
          <div className="grid gap-12 md:grid-cols-3 md:gap-6">
            {LEADERS.map((leader, i) => (
              <Reveal key={leader.photoSlot} delay={i * 0.08}>
                <MediaSlot
                  id={leader.photoSlot}
                  note="Square headshot. Real person, no stock."
                  alt={leader.name}
                  aspect="1 / 1"
                  marks={false}
                  sizes="(min-width: 768px) 30vw, 100vw"
                />
                <p className="mt-5 font-mono text-mono-sm uppercase text-sec-acc">
                  {leader.role}
                </p>
                <h2 className="mt-2 text-h3 font-bold text-sec-ink">
                  {leader.name}
                </h2>
                <p className="mt-3 max-w-[44ch] text-body text-sec-mid">
                  {leader.bio}
                </p>
                {leader.linkedin ? (
                  <a
                    href={leader.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-4 inline-flex items-center gap-2 font-mono text-mono-sm uppercase text-sec-mid transition-colors duration-[var(--dur-fast)] hover:text-sec-ink"
                  >
                    LinkedIn
                    <span
                      aria-hidden
                      className="transition-transform duration-[250ms] ease-house group-hover:translate-x-1 motion-reduce:transition-none"
                    >
                      ↗
                    </span>
                  </a>
                ) : null}
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* 3. The close */}
      <CtaBand />
    </main>
  );
}
