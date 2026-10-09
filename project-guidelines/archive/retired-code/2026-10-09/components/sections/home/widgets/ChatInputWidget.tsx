"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useWidgetLoop } from "./useWidgetLoop";

/* ChatGPT composer mockup (5b.search.md v2). A depicted product, not a
   designed component: everything inside the stage uses ChatGPT's own
   values, hard-coded, never our tokens or faces (the one sanctioned
   exception; STYLE_GUIDE changelog "depicted product UI"). Camera
   choreography measured from Youtech's claude-1.mp4: zoomed into the
   input while the query types, easing out as it nears completion,
   holding on the full composer, then back in for the next query. Ours
   cycles 3 queries per loop; the video cuts after 1.

   JS state machine because variable-length queries and a camera move
   rule out pure CSS; the caret blink is the only keyframe (wgt-caret,
   shared block). SSR renders the zoomed-in rest state so the first
   paint is deterministic; timers only run in view (useWidgetLoop). */

const QUERIES = [
  "who is the best roofer for storm damage in tampa?",
  "which hvac company in denver can come out today?",
  "best injury lawyer near me with free consults?",
];

/* camera eases out once this share of the query is typed */
const ZOOM_OUT_AT = 0.6;

type Phase = "rest" | "type" | "hold" | "clear";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 text-[#5d5d5d]">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-[22px] text-[#5d5d5d]">
      <rect
        x="9"
        y="3.5"
        width="6"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WaveformIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-[22px] text-white">
      <path
        d="M5 10v4M9 7v10M13 9v6M17 6v12M21 10v4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-[22px] text-white">
      <path
        d="M12 19V5m0 0-6 6m6-6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Composer({
  text,
  placeholder,
  caret,
  sent,
}: {
  text: string;
  /** placeholder layer visible */
  placeholder: boolean;
  caret: boolean;
  /** send arrow lit (text exists) */
  sent: boolean;
}) {
  return (
    <div className="w-[min(820px,92%)] rounded-[28px] border border-[#e3e3e3] bg-white px-5 pb-4 pt-[18px] shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
      {/* input line: typed text and the placeholder stacked, cross-fading */}
      <div className="relative min-h-[56px] px-1">
        <span
          className={cn(
            "absolute inset-x-1 top-0 text-[18px] leading-[1.55] text-[#8f8f8f] transition-opacity duration-300",
            placeholder ? "opacity-100 delay-150" : "opacity-0 delay-0",
          )}
        >
          Ask anything
        </span>
        <span
          className={cn(
            "text-[18px] leading-[1.55] text-[#0d0d0d] transition-opacity duration-300",
            text && !placeholder ? "opacity-100" : "opacity-0",
          )}
        >
          {text}
          {caret && (
            <span className="wgt-caret ml-px inline-block h-[1.1em] w-[2px] translate-y-[0.18em] bg-[#0d0d0d]" />
          )}
        </span>
      </div>
      {/* control row */}
      <div className="mt-2 flex items-center justify-between">
        <span className="grid size-9 place-items-center rounded-full border border-[#e3e3e3]">
          <PlusIcon />
        </span>
        <span className="flex items-center gap-4">
          <MicIcon />
          <span className="relative grid size-9 place-items-center rounded-full bg-[#0d0d0d]">
            <span
              className={cn(
                "absolute transition-opacity duration-200",
                sent ? "opacity-0" : "opacity-100",
              )}
            >
              <WaveformIcon />
            </span>
            <span
              className={cn(
                "absolute transition-opacity duration-200",
                sent ? "opacity-100" : "opacity-0",
              )}
            >
              <ArrowUpIcon />
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}

export function ChatInputWidget() {
  const { ref, play, reduced } = useWidgetLoop();
  const [phase, setPhase] = useState<Phase>("rest");
  const [len, setLen] = useState(0);
  const [qi, setQi] = useState(0);

  const query = QUERIES[qi];

  useEffect(() => {
    if (!play) return;
    let t: number;
    if (phase === "rest") {
      t = window.setTimeout(() => setPhase("type"), 1100);
    } else if (phase === "type") {
      if (len >= query.length) {
        t = window.setTimeout(() => setPhase("hold"), 350);
      } else {
        const prev = query[len - 1] ?? "";
        const pause = ",?.".includes(prev) ? 220 : 0;
        t = window.setTimeout(
          () => setLen((n) => n + 1),
          40 + Math.random() * 32 + pause,
        );
      }
    } else if (phase === "hold") {
      t = window.setTimeout(() => setPhase("clear"), 1900);
    } else {
      t = window.setTimeout(() => {
        setLen(0);
        setQi((i) => (i + 1) % QUERIES.length);
        setPhase("rest");
      }, 1000);
    }
    return () => window.clearTimeout(t);
  }, [play, phase, len, qi, query]);

  /* camera: in for rest/early typing and the reset, out once the query
     is ~60% typed and through the hold. Reduced motion parks it out. */
  const zoomedIn =
    !reduced &&
    (phase === "rest" ||
      phase === "clear" ||
      (phase === "type" && len < query.length * ZOOM_OUT_AT));

  return (
    <div
      ref={ref}
      aria-hidden
      data-play={play ? "" : undefined}
      className="wgt pointer-events-none select-none overflow-hidden rounded-[24px] bg-paper"
      style={{
        fontFamily:
          "ui-sans-serif, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
      }}
    >
      <div
        className="flex h-[240px] items-center justify-center sm:h-[300px] md:h-[360px] lg:h-[380px]"
        style={{
          transform: zoomedIn ? "scale(1.9)" : "scale(1)",
          transformOrigin: "23% 40%",
          transition: reduced
            ? undefined
            : "transform 1.15s var(--ease-house)",
        }}
      >
        {reduced ? (
          <Composer text={QUERIES[0]} placeholder={false} caret={false} sent />
        ) : (
          <Composer
            text={query.slice(0, len)}
            placeholder={phase === "rest" || phase === "clear"}
            caret={phase === "type"}
            sent={len > 0 && phase !== "clear"}
          />
        )}
      </div>
    </div>
  );
}
