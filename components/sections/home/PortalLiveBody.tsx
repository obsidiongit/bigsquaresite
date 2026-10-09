"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { Bar, Panel, PortalGlyph } from "@/components/sections/home/PortalWindow";
import { EASE } from "@/lib/motion";
import { CHANNELS, LEAD_COLUMNS, LEAD_ROWS, METRICS, PACING, RAIL } from "@/lib/obsidion-preview";
import { cn } from "@/lib/utils";

/* The portal window, live (formerly review toggle "portalLive",
   2026-10-08). Same layout as PortalPreviewBody and the same honesty
   rule: every value is still a skeleton bar whose width is a layout
   weight, never a number. What changes is that the window behaves the
   way the headline says, "Live.": a lead lands at the top of the table
   every few seconds (blue status pill, then it settles), the sparkline
   bars step left as a new one arrives, the channel bars and budget
   pacing drift. It only ticks while on screen; the first frame is the
   static mock exactly (SSR-safe), and reduced motion never leaves it. */

const TICK_MS = 2600;

/* deterministic per tick, so a given tick always draws the same frame */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}
const between = (seed: number, lo: number, hi: number) => lo + rand(seed) * (hi - lo);

const WIDTH = "transition-[width] duration-[1200ms] ease-house";

/* `vivid` (the lower-page renditions, 2026-10-09): the same mock with the
   brand blue carried further into the data, sparklines and channel bars
   in blue, so the window reads as alive at a glance. Still no numbers. */
export function PortalLiveBody({ vivid = false }: { vivid?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotionSafe();
  const play = inView && !reduced;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!play) return;
    const t = window.setInterval(() => setTick((n) => n + 1), TICK_MS);
    return () => window.clearInterval(t);
  }, [play]);

  /* a new lead every tick from the first one on; four rows on screen */
  const rows = Array.from({ length: LEAD_ROWS.length }, (_, k) => {
    const id = tick - k;
    const cells = id <= 0 ? LEAD_ROWS[(-id) % LEAD_ROWS.length] : [between(id, 0.5, 0.88), between(id + 0.3, 0.4, 0.7), between(id + 0.6, 0.45, 0.72), 0.44];
    return { id, cells };
  });

  return (
    <div ref={ref} aria-hidden className="flex">
      <div className="hidden w-[168px] shrink-0 border-r border-sec-line py-4 lg:block">
        {RAIL.map((item) => (
          <div
            key={item.label}
            data-mark={"rail-" + item.label.toLowerCase()}
            className={cn(
              "mx-2 flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[12px]",
              item.lit ? "bg-sec-ink/[.04] font-medium text-sec-ink" : "text-sec-mid",
            )}
          >
            <PortalGlyph lit={item.lit} />
            {item.label}
          </div>
        ))}
      </div>

      <div className="min-w-0 flex-1 p-4 md:p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="flex items-center gap-2.5 text-[15px] font-bold tracking-[-0.01em] text-sec-ink">
            Overview
            <span data-mark="live" className="flex items-center gap-1.5 font-mono text-[10px] font-normal uppercase tracking-[0.08em] text-sec-acc">
              <span className="relative flex size-1.5">
                {play && <span className="absolute inset-0 animate-ping rounded-full bg-sec-acc opacity-60" />}
                <span className="relative size-1.5 rounded-full bg-sec-acc" />
              </span>
              Live
            </span>
          </p>
          <span className="flex w-[112px] shrink-0 items-center gap-2 rounded-full border border-sec-line px-3 py-1.5">
            <Bar w={1} className="h-1.5" />
          </span>
        </div>

        {/* metric row: the value drifts, the bars step left and the
            newest arrives on the right in blue */}
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {METRICS.map((m, mi) => {
            /* a window over one long sequence: the static weights, then a
               new bar per tick */
            const L = m.spark.length;
            const shown = Array.from({ length: L }, (_, k) => {
              const id = tick - (L - 1 - k);
              return id <= 0 ? m.spark[id + L - 1] : between(id * 7 + mi, 0.3, 0.92);
            });
            return (
              <div key={m.field} className="rounded-[12px] bg-surf px-3.5 py-3.5">
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.08em] text-sec-mid">{m.field}</p>
                <Bar w={tick === 0 ? m.value : between(tick * 3 + mi, m.value - 0.08, m.value + 0.1)} className={cn("mt-2.5 h-3.5 rounded-[4px]", WIDTH)} />
                <span className="mt-3 flex h-6 items-end gap-[3px]">
                  {shown.map((s, i) => (
                    <span
                      key={i}
                      style={{ height: `${Math.round(s * 100)}%` }}
                      className={cn(
                        "w-full rounded-[2px] transition-[height,background-color] duration-700 ease-house",
                        tick > 0 && i === shown.length - 1
                          ? vivid
                            ? "bg-sec-acc"
                            : "bg-sec-acc/45"
                          : vivid
                            ? "bg-sec-acc/20"
                            : "bg-sec-ink/10",
                      )}
                    />
                  ))}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr_1fr]">
          <Panel field="Channels" mark="channels">
            <div className="space-y-3">
              {CHANNELS.map((c, ci) => (
                <div key={c.field} className="flex items-center gap-3">
                  <span className="w-[92px] shrink-0 truncate text-[11px] text-sec-mid md:w-[104px]">{c.field}</span>
                  <span className="flex h-2 min-w-0 flex-1 rounded-full bg-sec-ink/[.05]">
                    <Bar
                      w={tick === 0 ? c.weight : Math.min(0.98, between(tick * 5 + ci, c.weight - 0.06, c.weight + 0.05))}
                      acc={vivid || c.acc}
                      className={cn(WIDTH, vivid && (ci < 2 ? "bg-sec-acc/80" : "bg-sec-acc/35"))}
                    />
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel field="Budget pacing" mark="pacing" className="hidden lg:block">
            <span className="flex h-2.5 rounded-full bg-sec-ink/[.05]">
              {/* the month fills in, then a new one starts */}
              <Bar w={PACING.track + ((tick % 12) / 12) * 0.3} acc className={cn("h-2.5", tick % 12 === 0 ? "" : WIDTH, vivid && "bg-sec-acc")} />
            </span>
            <div className="mt-4 space-y-2.5">
              {PACING.legend.map((l) => (
                <div key={l.field} className="flex items-center gap-3">
                  <span className="w-[74px] shrink-0 truncate text-[11px] text-sec-mid">{l.field}</span>
                  <Bar w={l.weight} className="h-1.5" />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* lead table: the newest lead slides in on top, the oldest
            drops off the bottom */}
        <div data-mark="leads" className="mt-3 hidden rounded-[12px] bg-surf p-4 lg:block">
          <div className="flex items-center gap-4 border-b border-sec-line pb-2.5">
            {LEAD_COLUMNS.map((col, i) => (
              <span
                key={col}
                className={cn(
                  "font-mono text-[10px] uppercase tracking-[0.08em] text-sec-mid",
                  i === 3 ? "w-[76px] shrink-0" : "min-w-0 flex-1",
                )}
              >
                {col}
              </span>
            ))}
          </div>
          <AnimatePresence initial={false}>
            {rows.map(({ id, cells }, r) => (
              <motion.div
                key={id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE.house }}
                className="overflow-hidden"
              >
                <div
                  className={cn(
                    "flex items-center gap-4 py-3 transition-colors duration-1000",
                    r < rows.length - 1 && "border-b border-sec-line",
                    r === 0 && tick > 0 ? "bg-sec-acc/[.05]" : "bg-transparent",
                  )}
                >
                  {cells.map((cell, c) =>
                    c === 3 ? (
                      <span
                        key={c}
                        className={cn(
                          "flex h-5 w-[76px] shrink-0 items-center rounded-full px-2 transition-colors duration-700",
                          r === 0 && tick > 0 ? "bg-sec-acc" : "bg-sec-ink/[.06]",
                        )}
                      >
                        <Bar w={cell} className={cn("h-1.5", r === 0 && tick > 0 && "bg-white/60")} />
                      </span>
                    ) : (
                      <span key={c} className="min-w-0 flex-1">
                        <Bar w={cell} className="h-2" />
                      </span>
                    ),
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
