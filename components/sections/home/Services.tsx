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
import { EDGE } from "@/lib/layout";
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

type Service = { label: string; href: string; line: string };
type Group = { title: string; href: string; items: Service[] };

const GROUPS: Group[] = [
  {
    title: "Organic Marketing",
    href: "/services/#organic-marketing",
    items: [
      {
        label: "Search Engine Optimization (SEO)",
        href: "/services/seo/",
        line: "Show up when people search for what you do, in every city you serve.",
      },
      {
        label: "Generative Engine Optimization (GEO)",
        href: "/services/generative-engine-optimization/",
        line: "Get named when tools like ChatGPT answer the question you solve.",
      },
      {
        label: "Social Media",
        href: "/services/social-media/",
        line: "Posts planned, made, and shipped. Your brand, active every week.",
      },
      {
        label: "Content Marketing",
        href: "/services/content-marketing/",
        line: "Pages that answer real questions and bring buyers to your site.",
      },
      {
        label: "Email",
        href: "/services/email/",
        line: "The list you own, working. Sends people open and act on.",
      },
      {
        label: "Obsidion Portal",
        href: "/services/obsidion-portal/",
        line: "One login for every number we report. Check our work any day.",
      },
    ],
  },
  {
    title: "Paid Advertising",
    href: "/services/#paid-advertising",
    items: [
      {
        label: "Paid Search",
        href: "/services/paid-search/",
        line: "Ads on Google when buyers type exactly what you sell.",
      },
      {
        label: "Google Local Services Ads",
        href: "/services/google-local-services-ads/",
        line: "Pay for leads, not clicks, at the very top of Google.",
      },
      {
        label: "Paid Social",
        href: "/services/paid-social/",
        line: "Ads on Meta, TikTok, and more that find your next customer.",
      },
      {
        label: "Amazon Ads",
        href: "/services/amazon-ads/",
        line: "Put your products in front of people already shopping on Amazon.",
      },
      {
        label: "Creator Network",
        href: "/services/creator-network/",
        line: "Creators your customers already follow, talking about your brand.",
      },
    ],
  },
  {
    title: "Design & Development",
    href: "/services/#design-development",
    items: [
      {
        label: "Web Design",
        href: "/services/web-design/",
        line: "A fast site that looks sharp and turns visits into calls.",
      },
      {
        label: "Branding",
        href: "/services/branding/",
        line: "A look and a voice your customers know on sight.",
      },
      {
        label: "Video Production",
        href: "/services/video-production/",
        line: "Video shot, cut, and sized for every channel you run.",
      },
      {
        label: "Custom Development",
        href: "/services/custom-development/",
        line: "The tools your team needs that off the shelf does not cover.",
      },
    ],
  },
];

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

export function Services() {
  const reduced = useReducedMotionSafe();
  const webgl = useWebGLSupport();
  /* the cube exists on desktop motion paths only; the bay renders to
     match, and flicks are only worth firing when it is there */
  const cube = !reduced && webgl !== false;

  const [active, setActive] = useState<number | null>(null);
  const prev = useRef(-1);

  const spotlight = (i: number) => {
    if (i === prev.current) return;
    if (cube) flickCube(i >= prev.current ? 1 : -1);
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
