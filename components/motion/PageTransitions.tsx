"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getLenis } from "@/components/motion/SmoothScroll";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { Logo } from "@/components/shared/Logo";
import { EASE } from "@/lib/motion";
import { sfx } from "@/lib/sfx";

/* Page load + route transitions (STYLE_GUIDE.md 7.12): the covered
   swap. A grid of brand squares assembles diagonally over the page
   (tile assembly, ease-swoop), the route changes behind the cover,
   the tiles dissolve out along the same diagonal. Hard loads get the
   same veil pre-assembled (server-rendered via framer's SSR of the
   animate pose, so the page is never seen mid-load) holding the
   lockup until fonts are ready.

   Internal navigations are intercepted at the document level: left
   clicks on same-origin, non-hash, non-download links preventDefault
   and run cover -> router.push -> reveal, with the page whoosh from
   lib/sfx.ts fired at cover start. Back/forward and reduced motion
   navigate instantly with no veil.

   Mounted in the marketing layout: if funnel routes with their own
   layout ever link back and forth with marketing pages, they need
   their own mount or the veil unmounts mid-swap. */

const COLS = 10;
const ROWS = 6;
const STEP = 0.018; /* per diagonal index */
const TILE_DUR = 0.28;
const MAX_DIAG = COLS - 1 + (ROWS - 1);
const SWEEP_MS = (MAX_DIAG * STEP + TILE_DUR) * 1000;
const INTRO_HOLD_MS = 400; /* min time the lockup is actually seen */
const FONTS_TIMEOUT_MS = 1000;
const ROUTE_TIMEOUT_MS = 4000;

type Phase = "intro" | "idle" | "cover" | "reveal";

function isInternalLink(a: HTMLAnchorElement): string | null {
  const href = a.getAttribute("href");
  if (!href || !href.startsWith("/") || href.startsWith("//")) return null;
  if (a.target === "_blank" || a.hasAttribute("download")) return null;
  if (href.includes("#")) return null;
  const strip = (p: string) => p.replace(/\/+$/, "") || "/";
  if (strip(new URL(href, location.href).pathname) === strip(location.pathname))
    return null;
  return href;
}

export function PageTransitions() {
  const [phase, setPhase] = useState<Phase>("intro");
  const phaseRef = useRef<Phase>("intro");
  phaseRef.current = phase;
  const reduced = useReducedMotionSafe();
  const router = useRouter();
  const pathname = usePathname();
  const pendingPath = useRef<string | null>(null);
  const [lockupGone, setLockupGone] = useState(false); /* intro only */

  /* Intro: hold the veil until fonts land (capped), then dissolve. */
  useEffect(() => {
    const started = performance.now();
    let cancelled = false;
    let t: ReturnType<typeof setTimeout>;
    const fonts: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
    const cap = new Promise((r) => setTimeout(r, FONTS_TIMEOUT_MS));
    Promise.race([fonts, cap]).then(() => {
      if (cancelled) return;
      const wait = Math.max(0, INTRO_HOLD_MS - (performance.now() - started));
      /* functional guard: reduced motion may have retired the veil */
      t = setTimeout(() => setPhase((p) => (p === "intro" ? "reveal" : p)), wait);
    });
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  /* Link interception. Capture phase: next/link's own click handler
     preventDefaults before running router.push, so by bubble time the
     event is spent; capturing first lets the veil own the navigation
     (Link sees defaultPrevented and stands down). */
  useEffect(() => {
    if (reduced) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a =
        e.target instanceof Element
          ? e.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (!a) return;
      const href = isInternalLink(a);
      if (!href) return;
      e.preventDefault();
      if (phaseRef.current !== "idle") return;
      pendingPath.current = href;
      sfx.play("page");
      setPhase("cover");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [reduced]);

  /* Cover assembled -> push the route (prefetched Links swap fast). */
  useEffect(() => {
    if (phase !== "cover") return;
    const push = setTimeout(() => {
      if (pendingPath.current) router.push(pendingPath.current);
    }, SWEEP_MS);
    /* if the route never lands (offline, error boundary), let go */
    const bail = setTimeout(() => {
      pendingPath.current = null;
      setPhase("reveal");
    }, ROUTE_TIMEOUT_MS);
    return () => {
      clearTimeout(push);
      clearTimeout(bail);
    };
  }, [phase, router]);

  /* New route mounted behind the cover: reset scroll, dissolve out. */
  useEffect(() => {
    if (phaseRef.current !== "cover") return;
    pendingPath.current = null;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    setPhase("reveal");
  }, [pathname]);

  /* Reveal finished -> idle (also retires the intro lockup). */
  useEffect(() => {
    if (phase !== "reveal") return;
    const t = setTimeout(() => {
      setLockupGone(true);
      setPhase("idle");
    }, SWEEP_MS + 100);
    return () => clearTimeout(t);
  }, [phase]);

  /* Reduced motion: no veil at all, the instant the preference is known. */
  useEffect(() => {
    if (reduced) {
      setLockupGone(true);
      setPhase("idle");
    }
  }, [reduced]);

  const covered = phase === "intro" || phase === "cover";

  /* The veil stays mounted (display none when idle) so the tiles keep
     their motion values: cover animates 0 -> 1 without remount games. */
  return (
    <div
      data-page-veil
      data-phase={phase}
      aria-hidden
      className="fixed inset-0 z-[90]"
      style={{
        display: phase === "idle" ? "none" : undefined,
        pointerEvents: covered ? "auto" : "none",
      }}
    >
      <noscript>
        <style>{`[data-page-veil]{display:none!important}`}</style>
      </noscript>
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const diag = (i % COLS) + Math.floor(i / COLS);
          return (
            <motion.div
              key={i}
              className="bg-darkpanel"
              /* 1.04: tiles overlap a hair so the assembled cover is
                 seamless; initial={false} SSRs the covered pose */
              initial={false}
              animate={{ scale: covered ? 1.04 : 0 }}
              transition={{
                duration: TILE_DUR,
                ease: EASE.swoop,
                delay: diag * STEP,
              }}
            />
          );
        })}
      </div>
      {!lockupGone && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center gap-4"
          initial={false}
          animate={{ opacity: phase === "intro" ? 1 : 0 }}
          transition={{ duration: 0.25, ease: EASE.house }}
        >
          <motion.span
            initial={false}
            animate={{ rotate: phase === "intro" ? 0 : 90 }}
            transition={{ duration: 0.5, ease: EASE.swoop }}
          >
            <Logo className="size-9" />
          </motion.span>
          <span className="text-[22px] font-bold text-ondark">BigSquare</span>
        </motion.div>
      )}
    </div>
  );
}
