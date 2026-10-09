"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { PortalLiveBody } from "@/components/sections/home/PortalLiveBody";
import { PortalWindow } from "@/components/sections/home/PortalWindow";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { Slab } from "@/components/shared/Slab";
import { EDGE } from "@/lib/layout";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PORTAL_FEATURES, PortalBody, PortalHeading } from "./shared";

/* Portal, take "stage" (formerly review toggle "portalLook", 2026-10-09).
   The 2026-10-09 review called the portal section "particularly droll":
   a grey window on a grey ground under grey icons. Here it moves onto the blue slab, the
   page's signature surface: the copy and the five features in white on
   the left, the live window large on the right, running off the slab's
   edge so it reads as a real screen too big for the page rather than a
   thumbnail. The window arrives tilted back and settles flat as you
   scroll into it.

   While it is on screen, notifications pop out of the window's edge one
   after another: a lead, a call, a form, a task (UI fragments, 6.4).
   Labels are field names and channel names only: no numbers, no client
   names, no times (copy-rules claims, STYLE_GUIDE 6.12). The window
   body is the live mock in its `vivid` dress.

   Below lg the window drops under the copy at full width, no tilt, no
   notifications. Reduced motion: flat window, two notifications sitting
   still, nothing ticks. */

const TOASTS = [
  { title: "New lead", meta: "Google Ads" },
  { title: "Inbound call", meta: "Meta Ads" },
  { title: "New lead", meta: "Organic search" },
  { title: "Form filled", meta: "Your site" },
  { title: "Task done", meta: "Ads updated" },
  { title: "New lead", meta: "Email" },
] as const;
const TICK_MS = 2600;

function Toast({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex w-[244px] items-center gap-3 rounded-[14px] border border-line bg-paper px-3.5 py-3 shadow-[0_18px_44px_rgba(11,15,23,.22)]">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-acc">
        <span className="size-2.5 bg-onacc" />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-bold leading-tight text-ink">{title}</span>
        <span className="mt-1 block truncate font-mono text-[10px] uppercase tracking-[0.08em] text-mid">{meta}</span>
      </span>
    </div>
  );
}

export function PortalBlueStage() {
  const reduced = useReducedMotionSafe();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: "-20% 0px" });
  const [tick, setTick] = useState(0);
  const play = inView && !reduced;

  useEffect(() => {
    if (!play) return;
    const t = window.setInterval(() => setTick((n) => n + 1), TICK_MS);
    return () => window.clearInterval(t);
  }, [play]);

  /* the tilt: leaning back as the slab enters, flat by the time its
     middle reaches the middle of the screen */
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "center center"] });
  const rotX = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [14, 0]);
  const rotY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-16, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [80, 0]);

  /* the newest three notifications, newest on top */
  const shown = reduced ? [1, 0] : [tick, tick - 1, tick - 2].filter((n) => n >= 0);

  return (
    <Section theme="light" anchor="portal">
      <div className={cn(EDGE, "relative z-10")}>
        <Slab contentClassName="overflow-hidden rounded-[32px]">
          <div ref={stageRef} className="grid lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,29rem)_minmax(0,1fr)]">
            {/* ---- copy ---------------------------------------------- */}
            <div className="relative z-10 p-[clamp(24px,4vw,56px)] lg:pr-6">
              <p className="mb-6 flex items-center gap-2.5 font-mono text-eyebrow uppercase tracking-[0.08em] text-sec-mid">
                <span className="size-2 bg-onacc" />
                Obsidion, the client portal
              </p>
              <PortalHeading align="left" />
              <PortalBody className="mt-6 max-w-[44ch]" />
              <Reveal className="mt-9">
                <Pill href="/services/obsidion-portal/" variant="primary" className="max-md:w-full max-md:justify-center">
                  Tour the Portal
                </Pill>
              </Reveal>
            </div>

            {/* ---- the window: runs off the slab's right edge --------- */}
            <div className="relative px-[clamp(16px,4vw,56px)] lg:p-0" style={{ perspective: 1800 }}>
              <motion.div
                style={{ rotateX: rotX, rotateY: rotY, y: lift, transformOrigin: "0% 50%" }}
                className="lg:absolute lg:left-10 lg:top-[clamp(40px,5vw,72px)] lg:w-[min(1000px,72vw)]"
              >
                <div data-theme="light" className="rounded-[var(--radius-media)] shadow-[0_40px_90px_rgba(4,20,70,.45)]" style={{ background: "transparent" }}>
                  <PortalWindow>
                    <PortalLiveBody vivid />
                  </PortalWindow>
                </div>
              </motion.div>
              {/* the window is absolute on lg: this holds its height */}
              <div aria-hidden className="hidden lg:block lg:h-[clamp(700px,58vw,800px)]" />
            </div>
          </div>

          {/* notifications, popping out of the window's left edge into
              the room under the copy */}
          <div aria-hidden className="pointer-events-none absolute top-[clamp(500px,40vw,540px)] z-20 hidden w-[244px] lg:left-[calc(25rem-150px)] lg:block xl:left-[calc(29rem-150px)]">
            <AnimatePresence initial={false}>
              {shown.map((n, k) => {
                const t = TOASTS[n % TOASTS.length];
                return (
                  <motion.div
                    key={n}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, x: 80, scale: 0.85 }}
                    animate={{ opacity: k === 2 ? 0.45 : 1, x: 0, scale: k === 0 ? 1 : 0.96 - k * 0.02 }}
                    exit={{ opacity: 0, x: -20, scale: 0.9, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.55, ease: EASE.house }}
                    className="mb-3"
                  >
                    <Toast title={t.title} meta={t.meta} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* ---- the five features, across the slab -------------------- */}
          <Reveal
            stagger
            className="relative z-10 grid gap-x-8 gap-y-5 border-t border-sec-line px-[clamp(24px,4vw,56px)] py-[clamp(28px,3.5vw,48px)] sm:grid-cols-2 lg:grid-cols-5"
          >
            {PORTAL_FEATURES.map((f) => (
              <RevealItem key={f.title} className="flex gap-3 lg:block">
                <span aria-hidden className="mt-[7px] block size-2 shrink-0 bg-onacc lg:mt-0" />
                <span className="lg:mt-4 lg:block">
                  <span className="block text-[16px] font-bold leading-[1.3] text-sec-ink">{f.title}</span>
                  <span className="mt-1.5 block text-small text-sec-mid">{f.line}</span>
                </span>
              </RevealItem>
            ))}
          </Reveal>
        </Slab>
      </div>
    </Section>
  );
}
