"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useWebGLSupport } from "@/components/motion/useWebGLSupport";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { useLab } from "@/lib/lab";
import { EDGE } from "@/lib/layout";
import { SERVICE_GROUPS_HOME, type HomeService } from "@/lib/home-services";
import { EASE } from "@/lib/motion";
import { flickCube } from "@/lib/services-dock";
import { cn } from "@/lib/utils";

/* Services (6.services.md v4, Brad's spotlight session): the SPOTLIGHT
   INDEX. Left, the full 15-service catalog as big editorial link rows
   under mono group eyebrows. Right, a sticky hairline panel whose top
   half is the DOCK BAY: the companion cube's page-long journey ends
   here (HomeCanvas blends it into [data-services-dock], measured per
   frame), and every row hover flicks it with a spin impulse
   (lib/services-dock). The panel text morphs to the hovered service:
   a masked line-slide, and the last service persists on pointer leave.

   The bay MUST stay unfilled: the canvas rides at z-5 under this
   section's z-10 ink (HomeStage layering contract), so any opaque
   ground here would hide the docked cube. Hairlines only.

   Mobile: no panel, no bay (the mobile cube journey already exits at
   featured work); the rows are the interface. Reduced motion or no
   WebGL: text-only panel, instant swaps.

   Copy: group names locked (copy-rules). Headline, support, and the
   15 one-liners are DRAFT for Brad's copy pass. */

/* the catalog lives in lib/home-services (shared with the review
   renditions in ./services/) */
type Service = HomeService;
const GROUPS = SERVICE_GROUPS_HOME;

/* flat view for global row indexes (flick direction + active state) */
const FLAT: { g: number; item: Service }[] = GROUPS.flatMap((group, g) =>
  group.items.map((item) => ({ g, item })),
);

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("h-[0.9em] w-[0.9em]", className)}
    >
      <path
        d="M4 12h15m0 0-6.5-6.5M19 12l-6.5 6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* THE SQUARE MAP (review toggle lib/lab "servicesBay", 2026-10-08):
   what the bay holds when there is no cube to dock (the TV hero turns
   it off, as do reduced motion and no WebGL). The catalog as brand
   squares, one row per group, so the 6/5/4 split reads as a stepped
   shape; the hovered service's square fills blue and turns a quarter
   in the direction you moved, the cube's flick done flat. Squares are
   a pointer shortcut only (aria-hidden): the list is the interface. */
function SquareMap({
  active,
  dir,
  reduced,
  onPoint,
}: {
  active: number | null;
  dir: number;
  reduced: boolean;
  onPoint: (i: number) => void;
}) {
  const litGroup = active === null ? -1 : FLAT[active].g;
  return (
    <div aria-hidden className="space-y-4 border-b border-sec-line p-6 lg:p-7">
      {GROUPS.map((group, g) => {
        const base = GROUPS.slice(0, g).reduce((n, gr) => n + gr.items.length, 0);
        return (
          <div key={group.title}>
            <p
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.08em] transition-colors duration-[250ms]",
                litGroup === g ? "text-sec-acc" : "text-sec-mid",
              )}
            >
              {group.title}
            </p>
            <div className="mt-2 grid grid-cols-6 gap-2">
              {group.items.map((item, i) => {
                const idx = base + i;
                const lit = active === idx;
                return (
                  <motion.span
                    key={item.href}
                    onPointerEnter={() => onPoint(idx)}
                    initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    animate={{ rotate: lit && !reduced ? 90 * dir : 0 }}
                    transition={{
                      opacity: { duration: 0.35, delay: reduced ? 0 : idx * 0.035 },
                      scale: { duration: 0.35, delay: reduced ? 0 : idx * 0.035, ease: EASE.house },
                      rotate: { duration: 0.45, ease: EASE.house },
                    }}
                    className={cn(
                      "relative flex aspect-square items-start rounded-[8px] border p-1.5 font-mono text-[10px] tabular-nums transition-colors duration-[250ms]",
                      lit
                        ? "border-sec-acc bg-sec-acc text-onacc"
                        : litGroup === g
                          ? "border-sec-acc/40 bg-sec-acc/[.07] text-sec-acc"
                          : "border-sec-line text-sec-mid",
                    )}
                  >
                    {/* the box turns, the number stays upright */}
                    <motion.span
                      animate={{ rotate: lit && !reduced ? -90 * dir : 0 }}
                      transition={{ duration: 0.45, ease: EASE.house }}
                      className="absolute inset-0 p-1.5"
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </motion.span>
                  </motion.span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Services() {
  const reduced = useReducedMotionSafe();
  const webgl = useWebGLSupport();
  /* the cube exists on desktop motion paths only; the bay renders to
     match, and flicks are only worth firing when it is there */
  const cube = !reduced && webgl !== false;
  const bayLab = useLab("servicesBay");
  const squareMap = !cube && bayLab === "squares";

  const [active, setActive] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const prev = useRef(-1);

  const spotlight = (i: number) => {
    if (i === prev.current) return;
    const d = i >= prev.current ? 1 : -1;
    if (cube) flickCube(d);
    setDir(d);
    prev.current = i;
    setActive(i);
  };

  const current = active === null ? null : FLAT[active];

  return (
    <Section theme="light" anchor="services">
      <div className={cn(EDGE, "relative z-10")}>
        {/* header row: the two-CTA repeat pattern (Youtech), same
            labels as the Solution section, deliberately */}
        <BaselineReveal
          as="h2"
          className="max-w-[16ch] font-display text-h2 text-sec-ink"
        >
          Every channel, one team.
        </BaselineReveal>
        <Reveal className="mt-6 md:flex md:items-end md:justify-between md:gap-12">
          <p className="max-w-[44ch] text-lead text-sec-mid">
            3 groups, 15 services, one point of contact. No hand-offs
            between vendors, no gaps between channels.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
            <Pill
              href="/schedule/"
              variant="primary"
              className="max-md:w-full max-md:justify-center"
            >
              Schedule a Call
            </Pill>
            <Pill
              href="/audit/"
              variant="secondary"
              className="max-md:w-full max-md:justify-center"
            >
              Get a Free Audit
            </Pill>
          </div>
        </Reveal>

        {/* the split waits for lg: below 1024 the panel would starve
            the list (long service names wrap at editorial scale), so
            tablet runs the full-width list and the cube does a flyby
            instead of docking (no bay rendered = no dock engage) */}
        <div className="mt-12 md:mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-x-14 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-x-20">
          {/* ---- the index ------------------------------------------ */}
          <div>
            {GROUPS.map((group, g) => {
              /* global index of this group's first row */
              const base = GROUPS.slice(0, g).reduce(
                (n, gr) => n + gr.items.length,
                0,
              );
              return (
                <Reveal
                  key={group.title}
                  stagger
                  className={cn(g > 0 && "mt-12 md:mt-14")}
                >
                  <RevealItem>
                    <Link
                      href={group.href}
                      className="group/head flex items-baseline justify-between gap-4 border-b border-sec-line pb-3"
                    >
                      <span className="font-mono text-eyebrow uppercase tracking-[0.08em] text-sec-mid transition-colors duration-[250ms] group-hover/head:text-sec-acc">
                        {group.title}
                      </span>
                      <span className="font-mono text-eyebrow tabular-nums text-sec-mid">
                        {group.items.length}
                      </span>
                    </Link>
                  </RevealItem>
                  <ul>
                    {group.items.map((item, i) => {
                      const idx = base + i;
                      const lit = active === idx;
                      return (
                        <li key={item.href}>
                          <RevealItem>
                            <Link
                              href={item.href}
                              onPointerEnter={() => spotlight(idx)}
                              onFocus={() => spotlight(idx)}
                              className="group/row flex min-h-[52px] items-center justify-between gap-6 border-b border-sec-line py-3 md:py-3.5"
                            >
                              <span
                                className={cn(
                                  "text-[clamp(22px,19px+0.85vw,30px)] font-medium leading-[1.15] tracking-[-0.01em] transition-colors duration-[250ms]",
                                  lit
                                    ? "text-sec-acc"
                                    : "text-sec-ink group-hover/row:text-sec-acc",
                                )}
                              >
                                {item.label}
                              </span>
                              <span
                                className={cn(
                                  "shrink-0 text-[22px] transition-[transform,color] duration-[250ms]",
                                  lit
                                    ? "translate-x-1 text-sec-acc"
                                    : "text-sec-mid group-hover/row:translate-x-1 group-hover/row:text-sec-acc",
                                )}
                              >
                                <ArrowIcon />
                              </span>
                            </Link>
                          </RevealItem>
                        </li>
                      );
                    })}
                  </ul>
                </Reveal>
              );
            })}
          </div>

          {/* ---- the spotlight panel (lg and up) --------------------- */}
          <div className="hidden lg:block">
            <Reveal className="lg:sticky lg:top-24">
              <div className="rounded-[24px] border border-sec-line">
                {/* THE DOCK BAY: empty, unfilled ground the companion
                    cube parks in (HomeCanvas measures this element per
                    frame). Rendered only when the cube exists. */}
                {cube && (
                  <div
                    aria-hidden
                    data-services-dock
                    className="h-[clamp(240px,30vh,320px)] border-b border-sec-line"
                  />
                )}
                {squareMap && (
                  <SquareMap active={active} dir={dir} reduced={reduced} onPoint={spotlight} />
                )}
                <div className="relative min-h-[196px] overflow-hidden p-6 lg:p-7">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={current ? current.item.href : "rest"}
                      initial={reduced ? false : { y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={reduced ? undefined : { y: -20, opacity: 0 }}
                      transition={{
                        duration: reduced ? 0 : 0.26,
                        ease: EASE.house,
                      }}
                    >
                      {current ? (
                        <>
                          <p className="font-mono text-eyebrow uppercase tracking-[0.08em] text-sec-mid">
                            {GROUPS[current.g].title}
                          </p>
                          <p className="mt-3 text-h3 font-bold text-sec-ink">
                            {current.item.label}
                          </p>
                          <p className="mt-2 text-body text-sec-mid">
                            {current.item.line}
                          </p>
                          <Link
                            href={current.item.href}
                            className="mt-5 inline-flex items-center gap-2 text-body font-medium text-sec-acc"
                          >
                            See the Service
                            <ArrowIcon />
                          </Link>
                        </>
                      ) : (
                        <>
                          <p className="font-mono text-eyebrow uppercase tracking-[0.08em] text-sec-mid">
                            15 services
                          </p>
                          <p className="mt-3 max-w-[26ch] text-body text-sec-mid">
                            Point at any service to see what it covers. Open
                            one for the full page.
                          </p>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
