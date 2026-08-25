import { Gauge, LayoutGrid, ListChecks, MapPin, Route } from "lucide-react";
import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { PortalExhibit } from "@/components/sections/home/PortalExhibit";
import { PortalStage } from "@/components/sections/home/PortalStage";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

/* Obsidion portal (9.portal.md v3, Brad's portal session): the
   transparency pitch. Most agencies send a slide deck once a month; we
   give you a login. The section hands the visitor the instrument.

   Composition locked with Brad: copy, WINDOW, features, CTA. The
   window is the centerpiece, not a closing illustration, so it gets
   the section's centre and real air on both sides of it
   (paper.design's treatment, see that reference's ANALYSIS.md: the gap
   is what makes a product UI read as an exhibit).

   The window is a SHELL with a swappable body slot (PortalWindow),
   filled for now by a structural mock with no numbers in it
   (lib/obsidion-preview). Brad's call 2026-08-25: the real thing
   arrives as LIVE CODE, not screenshots, so the slot has to take a
   component, and the exhibit treatment plus the cube's morph target
   both live on the shell, where live code never disturbs them.

   THE SET PIECE lives in PortalStage + PortalExhibit + HomeCanvas,
   sharing one clock in lib/portal-window: the companion cube's journey
   ends here by flattening onto the Obsidion mark in the window's
   chrome bar, and the window grows out of it.

   Copy is v2's, carried forward and still DRAFT for Brad's single
   later pass, like the rest of the region. */

const FEATURES = [
  {
    icon: LayoutGrid,
    title: "Every channel in one place",
    line: "Google, Meta, search, email, and calls. One screen.",
  },
  {
    icon: MapPin,
    title: "Every location, side by side",
    line: "Compare stores. Spot the winners. Fix the laggards.",
  },
  {
    icon: Route,
    title: "Every lead, traced to its source",
    line: "Know which ad made the phone ring. Listen to the call.",
  },
  {
    icon: Gauge,
    title: "Budget pacing",
    line: "See where every dollar is going before the month ends.",
  },
  {
    icon: ListChecks,
    title: "Task log",
    line: "See what we changed, when, and what happened after.",
  },
];

export function Portal() {
  return (
    <Section theme="tint" anchor="portal">
      <div className={cn(EDGE, "relative z-10")}>
        {/* ---- copy ------------------------------------------------- */}
        <div className="mx-auto max-w-[52rem] text-center">
          {/* two-tone headline (paper.design steal 5): the statement in
              full ink, the qualifier carried at mid on its own line at
              the same size. Two BaselineReveals rather than one styled
              string: the primitive splits plain text by design, and an
              h2 wrapping block children would be invalid markup. */}
          <BaselineReveal as="h2" className="font-display text-h2 text-sec-ink">
            See every lead and every dollar.
          </BaselineReveal>
          <BaselineReveal
            as="p"
            delay={0.115}
            className="font-display text-h2 text-sec-mid"
          >
            Live.
          </BaselineReveal>
          <Reveal className="mt-6">
            <p className="mx-auto max-w-[60ch] text-body text-sec-mid">
              Most agencies send a slide deck once a month. We give you a
              login. Obsidion shows every channel, every lead, and every
              call, for every location, the moment it happens.
            </p>
          </Reveal>
        </div>

        {/* ---- the exhibit ------------------------------------------ */}
        {/* Inset a further step inside EDGE so the window reads as an
            object sitting ON the page, not as the page's own width.

            The EXHIBIT ALONE pins, not the copy with it. At a 900px
            viewport the copy and a full-height window cannot both
            clear the nav, and the window is what the beat is about;
            pinning both parked a clipped line of support text over a
            void, because the window does not exist yet for the first
            two thirds of the runway. Pinned alone it centres, the copy
            scrolls away above it like any section's would, and the
            cube gets the window's whole empty footprint to travel and
            turn in before it dives onto the mark. */}
        <div className="mt-12 md:mt-16">
        <PortalStage>
          <div className="relative mx-auto max-w-[1180px] lg:px-6">
            <PortalExhibit />
          </div>
        </PortalStage>
        </div>

        {/* ---- features -------------------------------------------- */}
        {/* xl top margin clears the call-log window, which hangs 28px
            below the main frame's bottom-left corner */}
        <Reveal
          stagger
          className="mx-auto mt-14 grid max-w-[1180px] gap-8 sm:grid-cols-2 md:mt-20 md:grid-cols-3 md:gap-x-10 lg:grid-cols-5 lg:gap-x-8 xl:mt-24"
        >
          {FEATURES.map(({ icon: Icon, title, line }) => (
            <RevealItem key={title}>
              <Icon
                aria-hidden
                strokeWidth={1.5}
                className="size-4 text-sec-acc"
              />
              <p className="mt-3 text-[18px] font-bold leading-[1.25] tracking-[-0.01em] text-sec-ink">
                {title}
              </p>
              <p className="mt-2 text-small text-sec-mid">{line}</p>
            </RevealItem>
          ))}
        </Reveal>

        <Reveal className="mt-12 flex justify-center md:mt-14">
          <Pill
            href="/services/obsidion-portal/"
            variant="primary"
            className="max-md:w-full max-md:justify-center"
          >
            Tour the Portal
          </Pill>
        </Reveal>
      </div>
    </Section>
  );
}
