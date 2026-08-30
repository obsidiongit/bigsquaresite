"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { BracketCta } from "@/components/shared/BracketCta";
import { Pill } from "@/components/shared/Pill";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

/* The 404 stage (Pane A, 2026-08-30; Brad: "fun and unique, big font,
   portfolio / editorial style"). One giant piece of display type fills
   the viewport: "404" at viewport scale where the 0 IS the brand
   square (a 2D blue square that leans toward the pointer, quarter-
   turns with the scroll, and spins on click), "Not found." under it
   with the filled-O alternate, then a line that never repeats: the
   server renders line 0, and after mount the line backspaces itself
   and retypes a random other one with the square as the caret (a
   continuous morph, never a fade-in appear). Two links: home and
   contact. Reduced motion: static square, the random line swaps
   instantly, no typing. Under 30 lines of copy in total. */

type Segment = { text: string; accent?: boolean };

/* One accent word per line (font-accent, caps only). */
const LINES: Segment[][] = [
  [{ text: "Wrong turn. " }, { text: "Right", accent: true }, { text: " agency." }],
  [
    { text: "Zero traffic, zero leads. Our " },
    { text: "least", accent: true },
    { text: " favorite kind of page." },
  ],
  [
    { text: "We measure everything. This page measured " },
    { text: "nothing", accent: true },
    { text: "." },
  ],
  [
    { text: "Somewhere on this site is a page that ranks. This is " },
    { text: "not", accent: true },
    { text: " it." },
  ],
  [
    { text: "A page nobody can find is a " },
    { text: "fixable", accent: true },
    { text: " problem. Ask us how we know." },
  ],
  [
    { text: "You found the " },
    { text: "one", accent: true },
    { text: " page we did not optimize." },
  ],
];

const ERASE_MS = 14;
const TYPE_MS = 34;
const PAUSE_MS = 500;

type Char = { ch: string; accent: boolean };

function flatten(line: Segment[]): Char[] {
  return line.flatMap((seg) =>
    Array.from(seg.text, (ch) => ({ ch, accent: Boolean(seg.accent) })),
  );
}

/** Render a prefix of a line, accent runs wrapped in font-accent. */
function LineText({ chars, count }: { chars: Char[]; count: number }) {
  const runs: { text: string; accent: boolean }[] = [];
  for (const { ch, accent } of chars.slice(0, count)) {
    const last = runs[runs.length - 1];
    if (last && last.accent === accent) last.text += ch;
    else runs.push({ text: ch, accent });
  }
  return (
    <>
      {runs.map((run, i) =>
        run.accent ? (
          <span key={i} className="font-accent uppercase text-sec-acc">
            {run.text}
          </span>
        ) : (
          <span key={i}>{run.text}</span>
        ),
      )}
    </>
  );
}

function pickOther(current: number): number {
  const n = 1 + Math.floor(Math.random() * (LINES.length - 1));
  return (current + n) % LINES.length;
}

function TypedLine({ reduced }: { reduced: boolean }) {
  const [line, setLine] = useState(0);
  const [count, setCount] = useState(flatten(LINES[0]).length);
  const [typing, setTyping] = useState(false);
  const chars = flatten(LINES[line]);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((r) => timers.push(window.setTimeout(r, ms)));
    const next = pickOther(0);

    if (reduced) {
      /* no typing: the random line simply replaces line 0 */
      setLine(next);
      setCount(flatten(LINES[next]).length);
      return;
    }

    (async () => {
      await wait(PAUSE_MS);
      setTyping(true);
      const from = flatten(LINES[0]).length;
      for (let i = from - 1; i >= 0; i--) {
        if (cancelled) return;
        setCount(i);
        await wait(ERASE_MS);
      }
      setLine(next);
      const to = flatten(LINES[next]).length;
      for (let i = 1; i <= to; i++) {
        if (cancelled) return;
        setCount(i);
        await wait(TYPE_MS);
      }
      setTyping(false);
    })();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [reduced]);

  return (
    <p
      className="mt-8 min-h-[2.3em] max-w-[24ch] text-h2 font-bold text-sec-ink md:mt-10"
      aria-live="polite"
    >
      <LineText chars={chars} count={count} />
      {!reduced && (
        <span
          aria-hidden
          className={cn(
            "ml-[0.12em] inline-block size-[0.5em] translate-y-[0.02em] bg-acc align-baseline",
            !typing && "animate-[wgt-caret_1.06s_steps(1)_infinite]",
          )}
        />
      )}
    </p>
  );
}

/* The 0 in 404: the brand square. Leans toward the pointer (spring),
   quarter-turns over the page scroll, and adds a quarter turn per
   click. Reduced motion renders a plain square. */
function Zero({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 16, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 140, damping: 16, mass: 0.6 });
  const { scrollYProgress } = useScroll();
  const [turns, setTurns] = useState(0);
  const scrollTurn = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const rotate = useTransform(scrollTurn, (v) => v + turns * 90);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      /* lean up to 14% of the square toward the pointer, easing off
         with distance so far pointers barely move it */
      const reach = Math.min(1, 380 / dist);
      const max = r.width * 0.14;
      x.set((dx / dist) * max * reach);
      y.set((dy / dist) * max * reach);
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, x, y]);

  const base = "inline-block size-[0.72em] bg-acc rounded-[0.04em] align-baseline";

  if (reduced) {
    return <span aria-hidden className={cn(base, "mx-[0.06em]")} />;
  }

  return (
    <motion.span
      ref={ref}
      aria-hidden
      data-sfx=""
      onClick={() => setTurns((t) => t + 1)}
      className={cn(base, "mx-[0.06em] cursor-pointer will-change-transform")}
      style={{ x: sx, y: sy, rotate }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
  );
}

export function NotFoundStage() {
  const reduced = useReducedMotionSafe();
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    try {
      const p = decodeURIComponent(window.location.pathname);
      setPath(p.length > 40 ? `${p.slice(0, 39)}…` : p);
    } catch {
      setPath(window.location.pathname);
    }
  }, []);

  return (
    <main data-theme="light" className="relative">
      <section
        className={cn(
          EDGE,
          "flex min-h-[100svh] flex-col justify-between pt-28 pb-10 md:pt-32 md:pb-14",
        )}
      >
        <div>
          <div aria-hidden className="h-px w-full bg-sec-line" />
          <p className="mt-4 font-mono text-eyebrow uppercase tabular-nums text-sec-mid">
            <span className="text-sec-acc">Error 404</span>
            {path ? <span> / {path}</span> : null}
          </p>
        </div>

        <div className="py-8 md:py-10">
          <h1 className="font-display text-sec-ink">
            <span
              aria-hidden
              className="-ml-[0.05em] flex items-center leading-[0.88] tracking-[-0.04em]"
              style={{ fontSize: "clamp(112px, 30vw, 480px)" }}
            >
              4<Zero reduced={reduced} />4
            </span>
            <span className="mt-3 block text-display md:mt-5">Not found.</span>
            <span className="sr-only">404, page not found</span>
          </h1>
          <TypedLine reduced={reduced} />
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          <Pill href="/" className="max-sm:w-full max-sm:justify-center">
            Back to Home
          </Pill>
          <BracketCta href="/contact/">Contact Us</BracketCta>
        </div>
      </section>
    </main>
  );
}
