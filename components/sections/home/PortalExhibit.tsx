"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useScrollCheckpoints } from "@/components/motion/useScrollCheckpoints";
import { useWebGLSupport } from "@/components/motion/useWebGLSupport";
import { PortalGlyph, PortalWindow } from "@/components/sections/home/PortalWindow";
import { RegistrationMarks } from "@/components/shared/RegistrationMarks";
import { CALL_LOG } from "@/lib/obsidion-preview";
import {
  PORTAL_HANDOFF,
  PORTAL_SEED_FADE,
  PORTAL_SETTLE,
  PORTAL_STRETCH,
  PORTAL_UNROLL,
  portalBands,
  portalMorph,
  seedGeometry,
  seg,
  smooth,
  lerp,
} from "@/lib/portal-window";
import { cn } from "@/lib/utils";

/* PortalExhibit (9.portal.md v3): the DOM half of the portal window
   morph, and the exhibit treatment around the window on every path.

   THE MORPH, DOM side. The canvas plays cube -> flattened, flooded
   brand-blue SQUARE centred on the window's logo mark. At
   PORTAL_HANDOFF this component opacity-swaps an identical square (the
   SEED) over it, built from the same measured mark rect and the same
   PORTAL_SLAB_VH constant, then plays the rest itself:

     STRETCH  the chrome bar grows out of the seed to the frame's full
              width, while the seed shrinks onto the mark's own box
     SEED     the seed retires sitting exactly on top of the real mark,
              so the swap is invisible rather than a fade-out
     UNROLL   the body unrolls downward from under the bar
     SETTLE   the frame's shadow, the registration marks, and the
              second window arrive with it

   The reveal is ONE clip-path inset on the frame wrapper, with
   absolute-px radii (the work-panel round-10 rule: scaleX/scaleY
   squashes corners, clip-path never does). Everything is measured off
   the UNTRANSFORMED frame, bar, and mark, so nothing feeds back.
   clip-path also clips the frame's shadow, which is why the settled
   state drops the clip entirely instead of resting at inset(0).

   FALLBACK PATHS (mobile, reduced motion, no WebGL): PortalStage
   collapses the runway, portalMorph reads a settled 1, and the window
   simply arrives with a ClipReveal. No pin ever engages. */

export function PortalExhibit() {
  const reduced = useReducedMotionSafe();
  const webgl = useWebGLSupport();
  /* 768 is HomeCanvas's own mobile cutoff: below it the cube's journey
     already exited at featured work. Starts true so SSR and the first
     client render agree; the effect corrects it after hydration, and
     the corrected path is the fallback one, which needs no scrub. */
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* the cube exists on desktop motion paths only, and the morph is
     the cube's beat: without it the window is just a window */
  const morphing = !reduced && webgl !== false && wide;

  const stageRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const frameClip = useMotionValue<string>("none");
  const frameOpacity = useMotionValue(1);
  const frameShadow = useMotionValue(1);
  const seedOpacity = useMotionValue(0);
  const seedX = useMotionValue(0);
  const seedY = useMotionValue(0);
  const seedSize = useMotionValue(0);
  const seedRadius = useMotionValue(4);
  const asideOpacity = useMotionValue(1);

  /* the stage + pin live in PortalStage, one level up: find them once */
  useEffect(() => {
    stageRef.current = document.querySelector<HTMLDivElement>("[data-portal-stage]");
    pinRef.current = document.querySelector<HTMLDivElement>("[data-portal-pin]");
  }, []);

  useAnimationFrame(() => {
    if (!morphing) return;
    const stageEl = stageRef.current;
    const pinEl = pinRef.current;
    const frame = frameRef.current;
    if (!stageEl || !pinEl || !frame) return;

    const { p, runway } = portalMorph(
      stageEl.getBoundingClientRect(),
      pinEl.getBoundingClientRect(),
    );
    /* no runway means no pin (short viewport, fallback): settled */
    if (runway <= 1 || p >= 0.999) {
      frameClip.set("none");
      frameOpacity.set(1);
      frameShadow.set(1);
      seedOpacity.set(0);
      asideOpacity.set(1);
      return;
    }

    const fr = frame.getBoundingClientRect();
    const bar = frame.querySelector<HTMLElement>("[data-portal-bar]");
    const mark = frame.querySelector<HTMLElement>("[data-portal-mark]");
    if (!bar || !mark) return;
    const vh = window.innerHeight;
    const barH = bar.getBoundingClientRect().height;
    const mr = mark.getBoundingClientRect();
    const { slabPx, cx, cy, radius0 } = seedGeometry(mr, vh);

    const t1 = smooth(seg(p, PORTAL_STRETCH));
    const t2 = smooth(seg(p, PORTAL_UNROLL));

    /* ---- the seed: a pure shrink about the mark's centre ---------- */
    const size = lerp(t1, slabPx, mr.width);
    const fade = 1 - smooth(seg(p, PORTAL_SEED_FADE));
    seedOpacity.set(seg(p, [PORTAL_HANDOFF, PORTAL_HANDOFF + 0.02]) * fade);
    seedSize.set(size);
    /* positioned against the WRAPPER, which is the frame's own box */
    seedX.set(cx - fr.left - size / 2);
    seedY.set(cy - fr.top - size / 2);
    seedRadius.set(lerp(t1, radius0, 4));

    /* ---- the reveal ------------------------------------------------ */
    /* Phase 1: only the bar band paints, growing horizontally from the
       seed's own edges. Phase 2: the bottom inset walks home and the
       body unrolls. Radius grows from the slab's bevel to the frame's,
       so the object is always one rounded thing, never a pill. */
    const seedL = Math.max(0, cx - fr.left - slabPx / 2);
    const seedR = Math.max(0, fr.right - cx - slabPx / 2);
    const L = lerp(t1, seedL, 0);
    const R = lerp(t1, seedR, 0);
    const B = lerp(t2, Math.max(0, fr.height - barH), 0);
    const rad = lerp(t1, radius0, 24);
    frameClip.set(`inset(0px ${R}px ${B}px ${L}px round ${rad}px)`);
    /* the frame does not exist before the handoff. Without this the
       clip's phase-1 band still paints a sliver of chrome bar under
       the travelling cube, which reads as the window leaking early.
       It crossfades in UNDER the seed, which covers exactly that
       band at the swap, so the arrival is invisible. */
    frameOpacity.set(seg(p, [PORTAL_HANDOFF, PORTAL_HANDOFF + 0.02]));
    /* the shadow belongs to a finished object; it also cannot paint
       through the clip, so it rides the settle instead */
    frameShadow.set(smooth(seg(p, PORTAL_SETTLE)));
    asideOpacity.set(smooth(seg(p, PORTAL_SETTLE)));
  });

  /* the COMMITTED slice of the runway: a park mid-morph would leave a
     half-built window, which reads as broken rather than as an object
     at rest (unlike the solution sweep's free-park lane) */
  const bands = useCallback(() => {
    const stageEl = stageRef.current;
    const pinEl = pinRef.current;
    if (!stageEl || !pinEl) return [] as [number, number][];
    return portalBands(
      stageEl.getBoundingClientRect(),
      pinEl.getBoundingClientRect(),
      window.scrollY,
    );
  }, []);
  useScrollCheckpoints(frameRef, {
    bands,
    enabled: morphing,
    glideMsPerVh: 2400,
    glideMaxMs: 4500,
  });

  const frame = (
    <motion.div
      ref={wrapRef}
      style={
        morphing
          ? { clipPath: frameClip, opacity: frameOpacity }
          : { borderRadius: "var(--radius-media)" }
      }
      className="relative"
    >
      <PortalWindow />
    </motion.div>
  );

  return (
    <div className="relative">
      {/* the shadow rides an outer element: clip-path clips painting,
          shadows included, so a shadow cast from inside the clip would
          never show during the morph */}
      <motion.div
        aria-hidden
        style={morphing ? { opacity: frameShadow } : undefined}
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-media)] shadow-[0_18px_60px_rgba(11,15,23,.10)]"
      />

      <div ref={frameRef} className="relative">
        {morphing ? frame : <ClipReveal radius="var(--radius-media)">{frame}</ClipReveal>}

        {/* THE SEED: the DOM's copy of the flattened cube. Same square,
            same brand blue, same centre; it ends as the logo mark. */}
        {morphing && (
          <motion.div
            aria-hidden
            data-portal-seed
            style={{
              opacity: seedOpacity,
              x: seedX,
              y: seedY,
              width: seedSize,
              height: seedSize,
              borderRadius: seedRadius,
            }}
            className="pointer-events-none absolute left-0 top-0 bg-acc"
          />
        )}
      </div>

      {/* ---- the second window ------------------------------------- */}
      {/* Depth from one extra object (paper.design steal 3). Desktop
          only, and it overlaps the main window's lower left rather
          than sitting beside it, so the pair reads as one exhibit. */}
      <motion.div
        aria-hidden
        style={morphing ? { opacity: asideOpacity } : undefined}
        className="pointer-events-none absolute bottom-[-28px] left-[-24px] hidden w-[268px] overflow-hidden rounded-[16px] border border-sec-line bg-paper shadow-[0_18px_50px_rgba(11,15,23,.14)] xl:block"
      >
        <div className="flex items-center gap-2 border-b border-sec-line bg-paper px-3.5 py-2.5">
          <PortalGlyph lit />
          <span className="text-[12px] font-bold text-sec-ink">
            {CALL_LOG.title}
          </span>
        </div>
        <div className="space-y-3 px-3.5 py-3.5">
          {CALL_LOG.rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-sec-line">
                <svg viewBox="0 0 12 12" className="size-2.5 text-sec-acc">
                  <path d="M3 1.5 10 6l-7 4.5z" fill="currentColor" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11px] text-sec-mid">
                  {row.field}
                </span>
                <span
                  style={{ width: `${Math.round(row.weight * 100)}%` }}
                  className={cn("mt-1.5 block h-1.5 rounded-full bg-sec-ink/10")}
                />
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <RegistrationMarks className="hidden lg:block" />
    </div>
  );
}
