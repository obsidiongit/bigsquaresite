"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { Bar, PortalWindow } from "@/components/sections/home/PortalWindow";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { CHANNELS, PACING } from "@/lib/obsidion-preview";
import { EDGE } from "@/lib/layout";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { LiveDot, PORTAL_FEATURES, PortalBody, PortalHeading } from "./shared";

/* Portal, take "squares" (review toggle lib/lab "portalLook",
   2026-10-09). The window rebuilt out of the brand square, the language
   of the hero's dotted TV and the 90-day grid: every chart is a run of
   small squares, lit blue or empty, so the dashboard reads as BigSquare
   before a word of it is read. Five panels, one per feature, numbered
   to match the feature row under the window; pointing at either lights
   the other.

   It runs while on screen: leads stack into today's column square by
   square (a new day pushes the columns left), channel and location bars
   grow and shrink by a square, the month's pacing row fills, tasks tick
   off. Still the honesty rule (STYLE_GUIDE 6.12): no digits, no names,
   no axis; squares are layout, not counts, and the PORTAL PREVIEW chip
   stays in the chrome. Reduced motion: the first frame, still. */

const TICK_MS = 1400;
const ROWS = 6;

function hash(n: number) {
  const x = Math.sin(n * 91.3458 + 47.123) * 43758.5453;
  return x - Math.floor(x);
}
/** leads that land on day d: 1 to 6 */
const quota = (d: number) => 1 + Math.floor(hash(d) * ROWS);

/** where the lead feed stands after t ticks: today's index and how full it is */
function feedAt(t: number) {
  let day = 0;
  let filled = Math.min(quota(0), 2);
  for (let k = 0; k < t; k++) {
    if (filled >= quota(day)) {
      day++;
      filled = 1;
    } else filled++;
  }
  return { day, filled };
}

function Sq({ on, soft, className }: { on: boolean; soft?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "block aspect-square rounded-[2px] transition-colors duration-500",
        on ? (soft ? "bg-acc/35" : "bg-acc") : "bg-ink/[.07]",
        className,
      )}
    />
  );
}

function PanelBox({
  n,
  title,
  lit,
  onPoint,
  className,
  right,
  children,
}: {
  n: number;
  title: string;
  lit: boolean;
  onPoint: (on: boolean) => void;
  className?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      onPointerEnter={() => onPoint(true)}
      onPointerLeave={() => onPoint(false)}
      className={cn(
        "rounded-[14px] bg-surf p-4 outline outline-2 -outline-offset-2 transition-[outline-color] duration-300 md:p-5",
        lit ? "outline-acc" : "outline-transparent",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-mid">
          <span className="text-acc">[{String(n).padStart(2, "0")}]</span> {title}
        </p>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function SquaresBody({ tick, play, lit, setLit, wide }: {
  tick: number;
  play: boolean;
  lit: string | null;
  setLit: (m: string | null) => void;
  wide: boolean;
}) {
  const point = (m: string) => (on: boolean) => setLit(on ? m : null);
  const cols = wide ? 24 : 14;

  /* leads: the last `cols` days, today on the right */
  const { day, filled } = feedAt(tick);
  const days = Array.from({ length: cols }, (_, k) => day - (cols - 1) + k);

  return (
    <div aria-hidden className="p-4 md:p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="flex items-center gap-2.5 text-[15px] font-bold tracking-[-0.01em] text-ink">
          Overview
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-normal uppercase tracking-[0.08em] text-acc">
            <LiveDot className="size-1.5" play={play} />
            Live
          </span>
        </p>
        <span className="flex w-[112px] shrink-0 items-center gap-2 rounded-full border border-line px-3 py-1.5">
          <Bar w={1} className="h-1.5" />
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-12">
        {/* [03] leads: one column per day, a square per lead */}
        <PanelBox n={3} title="Leads" lit={lit === "leads"} onPoint={point("leads")} className="lg:col-span-7">
          <div className="grid gap-[4px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {days.map((d, c) => {
              const today = c === cols - 1;
              const count = today ? filled : quota(d);
              return (
                <motion.div key={d} layout={play} transition={{ duration: 0.5, ease: EASE.house }} className="flex flex-col-reverse gap-[4px]">
                  {Array.from({ length: ROWS }, (_, r) => {
                    const on = r < count;
                    const newest = today && r === count - 1 && tick > 0;
                    return newest && play ? (
                      <motion.span
                        key={`${d}-${r}`}
                        initial={{ scale: 0.2, opacity: 0.4 }}
                        animate={{ scale: [0.2, 1.3, 1], opacity: 1 }}
                        transition={{ duration: 0.55, ease: EASE.house }}
                        className="block aspect-square rounded-[2px] bg-acc shadow-[0_0_0_3px_rgba(6,87,249,.18)]"
                      />
                    ) : (
                      <Sq key={`${d}-${r}`} on={on} soft={on && !today && c < cols - 8} />
                    );
                  })}
                </motion.div>
              );
            })}
          </div>
        </PanelBox>

        {/* [01] channels: a run of squares per channel */}
        <PanelBox n={1} title="Channels" lit={lit === "channels"} onPoint={point("channels")} className="lg:col-span-5">
          <div className="space-y-2.5">
            {CHANNELS.map((ch, ci) => {
              const n = 16;
              const drift = tick === 0 ? 0 : Math.round((hash(tick * 5 + ci) - 0.5) * 3);
              const on = Math.max(1, Math.min(n, Math.round(ch.weight * n) + drift));
              return (
                <div key={ch.field} className="flex items-center gap-3">
                  <span className="w-[88px] shrink-0 truncate text-[11px] text-mid">{ch.field}</span>
                  <span className="grid min-w-0 flex-1 gap-[3px]" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                    {Array.from({ length: n }, (_, k) => (
                      <Sq key={k} on={k < on} soft={ci > 1} />
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
        </PanelBox>

        {/* [02] locations: one column per location, unnamed */}
        <PanelBox n={2} title="Locations" lit={lit === "locations"} onPoint={point("locations")} className="lg:col-span-4">
          <div className="flex items-end justify-between gap-3 px-1">
            {[0.7, 0.45, 0.9, 0.35, 0.6].map((w, li) => {
              const n = 6;
              const drift = tick === 0 ? 0 : Math.round((hash(tick * 3 + li * 11) - 0.5) * 2);
              const on = Math.max(1, Math.min(n, Math.round(w * n) + drift));
              return (
                <div key={li} className="flex w-[clamp(28px,3vw,40px)] flex-col items-center">
                  <div className="grid w-full grid-cols-2 gap-[3px]">
                    {Array.from({ length: n * 2 }, (_, k) => {
                      /* two squares a row, filled from the bottom */
                      const row = n - 1 - Math.floor(k / 2);
                      return <Sq key={k} on={row < on} soft={li !== 2} />;
                    })}
                  </div>
                  <Bar w={1} className="mt-2.5 h-1.5" />
                </div>
              );
            })}
          </div>
        </PanelBox>

        {/* [04] pacing: the month as squares, filling day by day */}
        <PanelBox n={4} title="Budget pacing" lit={lit === "pacing"} onPoint={point("pacing")} className="lg:col-span-4">
          <div className="grid grid-cols-15 gap-[3px]">
            {Array.from({ length: 30 }, (_, k) => {
              const today = Math.round(PACING.track * 30 + (tick % 12)) % 30;
              return (
                <span key={k} className="relative block">
                  <Sq on={k <= today} soft={k < today} />
                  {k === today && play && <span className="absolute inset-0 animate-ping rounded-[2px] bg-acc/50" />}
                </span>
              );
            })}
          </div>
          <div className="mt-4 space-y-2">
            {PACING.legend.map((l) => (
              <div key={l.field} className="flex items-center gap-3">
                <span className="w-[74px] shrink-0 truncate text-[11px] text-mid">{l.field}</span>
                <Bar w={l.weight} className="h-1.5" />
              </div>
            ))}
          </div>
        </PanelBox>

        {/* [05] tasks: rows that tick off */}
        <PanelBox n={5} title="Task log" lit={lit === "tasks"} onPoint={point("tasks")} className="lg:col-span-4">
          <div className="space-y-3">
            {[0.85, 0.6, 0.72, 0.5].map((w, k) => {
              const done = (tick + 1) % 6 > k;
              return (
                <div key={k} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors duration-500",
                      done ? "border-acc bg-acc" : "border-ink/20",
                    )}
                  >
                    <svg viewBox="0 0 12 12" className={cn("size-2.5 text-onacc transition-opacity duration-300", done ? "opacity-100" : "opacity-0")}>
                      <path d="M2.5 6.3l2.3 2.2 4.7-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <Bar w={w} className={cn("h-2 transition-colors duration-500", done && "bg-ink/20")} />
                </div>
              );
            })}
          </div>
        </PanelBox>
      </div>
    </div>
  );
}

export function PortalSquares() {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const play = inView && !reduced;
  const [tick, setTick] = useState(0);
  const [lit, setLit] = useState<string | null>(null);
  const [wide, setWide] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!play) return;
    const t = window.setInterval(() => setTick((n) => n + 1), TICK_MS);
    return () => window.clearInterval(t);
  }, [play]);

  return (
    <Section theme="tint" anchor="portal">
      <div className={cn(EDGE, "relative z-10")}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-16">
          <PortalHeading align="left" />
          <div>
            <PortalBody />
            <Reveal className="mt-7">
              <Pill href="/services/obsidion-portal/" variant="primary" className="max-md:w-full max-md:justify-center">
                Tour the Portal
              </Pill>
            </Reveal>
          </div>
        </div>

        <div ref={ref} className="mt-12 md:mt-16">
          <Reveal>
            <div data-theme="light" className="rounded-[var(--radius-media)] shadow-[0_24px_70px_rgba(11,15,23,.12)]" style={{ background: "transparent" }}>
              <PortalWindow>
                <SquaresBody tick={reduced ? 0 : tick} play={play} lit={lit} setLit={setLit} wide={wide} />
              </PortalWindow>
            </div>
          </Reveal>

          {/* the five features, numbered to their panels */}
          <Reveal stagger className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-5">
            {PORTAL_FEATURES.map((f, k) => (
              <RevealItem key={f.title}>
                <div
                  onPointerEnter={() => setLit(f.mark)}
                  onPointerLeave={() => setLit(null)}
                  className="group/feat cursor-default border-t pt-4 transition-colors duration-300"
                  style={{ borderColor: lit === f.mark ? "var(--acc)" : "var(--line)" }}
                >
                  <p className="font-mono text-eyebrow tabular-nums text-sec-acc">[{String(k + 1).padStart(2, "0")}]</p>
                  <p className="mt-2 text-[17px] font-bold leading-[1.3] text-sec-ink">{f.title}</p>
                  <p className="mt-1.5 text-small text-sec-mid">{f.line}</p>
                </div>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
