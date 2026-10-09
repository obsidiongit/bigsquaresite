"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { PortalLiveBody } from "@/components/sections/home/PortalLiveBody";
import { PortalWindow } from "@/components/sections/home/PortalWindow";
import { Note, Sketch, type Stroke } from "@/components/shared/draft/Draft";
import { pHead } from "@/components/shared/draft/pencil";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { CallLog, PORTAL_FEATURES, PortalBody, PortalHeading } from "./shared";

/* Portal, take "markup" (review toggle lib/lab "portalLook", 2026-10-09).
   The site's own design sentence, played straight: "a measured,
   engineered page that a human has marked up in blue pen" (STYLE_GUIDE
   0). The live window sits on the paper as the exhibit, and the five
   features stop being a row of grey icons under it: each is written in
   the margin in the pen's hand with an arrow drawn to the part of the
   window it describes (the rail's Locations and Tasks, the channel
   panel, budget pacing, the lead table), and "Live" gets circled.
   Notes write on one after another as the window comes into view, the
   arrows follow, then only the shared pencil wobble moves.

   This is the drafted kit (components/shared/draft) at exhibit scale.
   It goes past the "one note per drafted section" rule on purpose: here
   the notes ARE the content (the feature list), not decoration. If this
   take wins, record that exception in STYLE_GUIDE.

   Targets are measured off the window (data-mark hooks in
   PortalLiveBody) at the window's real size, redrawn on width change.
   xl and up only: below it the margins are too narrow, so the notes
   stack under the window as a handwritten list. Reduced motion: drawn,
   still (the kit's own rule). */

type Side = "left" | "right" | "top";
type Spec = { mark: string; side: Side; y: number; lines: string[] };

/* y: the note's vertical centre as a share of the window's height (top
   notes sit above the frame and use y as a share of its width) */
const NOTES: Spec[] = [
  { mark: "live", side: "top", y: 0.16, lines: ["Live,", "not once a month"] },
  { mark: "rail-locations", side: "left", y: 0.22, lines: ["Every location,", "side by side"] },
  { mark: "rail-tasks", side: "left", y: 0.42, lines: ["What we changed,", "and when"] },
  { mark: "channels", side: "left", y: 0.64, lines: ["Every channel,", "one screen"] },
  { mark: "pacing", side: "right", y: 0.38, lines: ["Where every", "dollar is going"] },
  { mark: "leads", side: "right", y: 0.76, lines: ["Every lead,", "traced to", "its source"] },
];

/** a hand-drawn loop squashed to an ellipse round a small target */
function pEllipse(cx: number, cy: number, rx: number, ry: number, seed: number) {
  const r = (s: number) => {
    const x = Math.sin(s * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const start = -2.2 + r(seed) * 0.4;
  const steps = 10;
  const turn = Math.PI * 2 * 1.1;
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const t = start + (turn * i) / steps;
    const k = 1 + (r(seed + i) - 0.5) * 0.1;
    return [cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k] as const;
  });
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < steps; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(steps, i + 2)];
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** a bowed pencil arrow from s to e, with its head */
function arrow(sx: number, sy: number, ex: number, ey: number, bend: number, seed: number) {
  const dx = ex - sx, dy = ey - sy;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const b = len * 0.16 * bend;
  const c1x = sx + dx * 0.3 + nx * b, c1y = sy + dy * 0.3 + ny * b;
  const c2x = sx + dx * 0.72 + nx * b * 0.7, c2y = sy + dy * 0.72 + ny * b * 0.7;
  const shaft = `M${sx.toFixed(1)} ${sy.toFixed(1)} C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  return { shaft, head: pHead(ex, ey, Math.atan2(ey - c2y, ex - c2x), 11, seed) };
}

const GAP = 30; // note to window edge
const NOTE_W = 168;

export function PortalMarkup() {
  const reduced = useReducedMotionSafe();
  const winRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<{ w: number; h: number; strokes: Stroke[] } | null>(null);
  const [wide, setWide] = useState(false);
  const ringing = useInView(winRef) && !reduced;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* measure the window and every target, build the arrows */
  useEffect(() => {
    const el = winRef.current;
    if (!el || !wide) return;
    let lastW = 0;
    const build = () => {
      const w = el.offsetWidth, h = el.offsetHeight;
      if (!w || w === lastW) return;
      lastW = w;
      const box = el.getBoundingClientRect();
      const st: Stroke[] = [];
      NOTES.forEach((n, k) => {
        const t = el.querySelector<HTMLElement>(`[data-mark="${n.mark}"]`);
        if (!t) return;
        const r = t.getBoundingClientRect();
        const tx = r.left - box.left, ty = r.top - box.top;
        const i = k * 4 + 3;
        if (n.side === "top") {
          /* circle the chip, then an arrow down from the note to it */
          st.push({ d: pEllipse(tx + r.width / 2, ty + r.height / 2, r.width / 2 + 14, r.height / 2 + 9, 7), i });
          const sx = w * n.y + NOTE_W * 0.55, sy = -GAP + 6;
          const a = arrow(sx, sy, tx + r.width / 2 + 4, ty - 10, -1, 11);
          st.push({ d: a.shaft, i: i + 1 }, { d: a.head, i: i + 2 });
          return;
        }
        const sy = h * n.y;
        if (n.side === "left") {
          /* rail rows: point at the row's glyph; panels: just inside the left edge */
          const ex = n.mark === "channels" ? tx + 26 : tx + 16;
          const ey = n.mark === "channels" ? ty + r.height * 0.42 : ty + r.height / 2;
          const a = arrow(-GAP + 4, sy, ex, ey, n.mark === "channels" ? 1 : -0.6, 20 + k);
          st.push({ d: a.shaft, i }, { d: a.head, i: i + 1 });
        } else {
          const ex = tx + r.width - 22;
          const ey = n.mark === "leads" ? ty + 58 : ty + r.height * 0.32;
          const a = arrow(w + GAP - 4, sy, ex, ey, 0.8, 30 + k);
          st.push({ d: a.shaft, i }, { d: a.head, i: i + 1 });
        }
      });
      setGeo({ w, h, strokes: st });
    };
    /* the window's body settles after fonts and its first tick */
    const t = window.setTimeout(build, 300);
    const ro = new ResizeObserver(build);
    ro.observe(el);
    return () => {
      window.clearTimeout(t);
      ro.disconnect();
    };
  }, [wide]);

  return (
    <Section theme="light" anchor="portal">
      <div className={cn(EDGE, "relative z-10")}>
        <div className="mx-auto max-w-[52rem]">
          <PortalHeading />
          <PortalBody className="mx-auto mt-6 max-w-[60ch] text-center" />
        </div>

        {/* ---- the exhibit ------------------------------------------ */}
        <div className="relative mx-auto mt-16 max-w-[1000px] md:mt-20 xl:mt-28 xl:max-w-[820px] 2xl:max-w-[900px]">
          <div ref={winRef} className="relative">
            <div data-theme="light" className="rounded-[var(--radius-media)] shadow-[0_24px_70px_rgba(11,15,23,.14)]" style={{ background: "transparent" }}>
              <PortalWindow>
                <PortalLiveBody vivid />
              </PortalWindow>
            </div>
            <CallLog ringing={ringing} className="absolute -bottom-10 -left-14 hidden xl:block" />

            {/* the pen: notes in the margins, arrows into the window */}
            {wide && (
              <>
                {NOTES.map((n, k) => (
                  <div
                    key={n.mark}
                    className="absolute text-[18px] 2xl:text-[20px]"
                    style={
                      (n.side === "top"
                        ? { left: `${n.y * 100}%`, bottom: `calc(100% + ${GAP}px)`, width: NOTE_W + 60 }
                        : n.side === "left"
                          ? { right: `calc(100% + ${GAP}px)`, top: `${n.y * 100}%`, width: NOTE_W, transform: "translateY(-50%)", textAlign: "right" }
                          : { left: `calc(100% + ${GAP}px)`, top: `${n.y * 100}%`, width: NOTE_W, transform: "translateY(-50%)" }) as CSSProperties
                    }
                  >
                    <Note lines={n.lines} delay={0.2 + k * 0.44} className={cn(n.side === "left" && "items-end")} />
                  </div>
                ))}
                {geo && (
                  <Sketch
                    strokes={geo.strokes}
                    viewBox={`0 0 ${geo.w} ${geo.h}`}
                    delay={0.35}
                    className="pointer-events-none absolute inset-0 h-full w-full text-acc [stroke-width:2]!"
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* ---- below xl: the notes as a handwritten list ------------- */}
        <div className="mx-auto mt-14 grid max-w-[900px] gap-x-10 gap-y-6 sm:grid-cols-2 xl:hidden">
          {PORTAL_FEATURES.map((f, k) => (
            <div key={f.title} className="flex gap-3">
              <span aria-hidden className="mt-1 font-mono text-eyebrow tabular-nums text-sec-acc">[{String(k + 1).padStart(2, "0")}]</span>
              <div>
                <p className="text-[17px] font-bold leading-[1.3] text-sec-ink">{f.title}</p>
                <p className="mt-1 text-small text-sec-mid">{f.line}</p>
              </div>
            </div>
          ))}
        </div>
        {/* xl: the notes carry the features visually; keep the words for
            screen readers in one place */}
        <ul className="sr-only max-xl:hidden">
          {PORTAL_FEATURES.map((f) => (
            <li key={f.title}>
              {f.title}. {f.line}
            </li>
          ))}
        </ul>

        <Reveal className="mt-14 flex justify-center md:mt-24">
          <Pill href="/services/obsidion-portal/" variant="primary" className="max-md:w-full max-md:justify-center">
            Tour the Portal
          </Pill>
        </Reveal>
      </div>
    </Section>
  );
}
