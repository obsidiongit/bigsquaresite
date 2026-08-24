"use client";

import { useEffect } from "react";

/* useScrollCheckpoints (STYLE_GUIDE 7.4, scroll checkpoints): idle-
   settle for a pinned scrub wrapper. Native scroll stays locked:
   nothing here intercepts, remaps, or slows the user's input. The
   hook acts only AFTER scrolling goes idle: if the wrapper's progress
   parked between two checkpoints (mid-beat), the page glides to the
   boundary the gesture was heading for, so a half-played beat always
   completes and can never be left stuck. Any input (wheel, touch,
   key, pointer) cancels the glide on the spot and hands scroll back.

   Checkpoints are wrapper-progress values (0 = wrapper top pinned,
   1 = wrapper released) and must be sorted ascending, normally with
   0 and 1 included so every beat has a rest on both sides. Pass a
   module-level constant: the array is an effect dep by reference. */

type Options = {
  /** sorted wrapper-progress rests (0..1) the page may settle on */
  checkpoints: number[];
  /** gate for reduced motion / fallback branches */
  enabled?: boolean;
};

/* quiet time after the last scroll event before we consider settling;
   long enough to outlast trackpad/momentum event gaps */
const IDLE_MS = 160;

/* how far into a beat the stop must be to commit FORWARD (in the
   direction of travel); anything shorter settles back to the rest the
   gesture came from, so a stray nudge never plays a whole beat */
const COMMIT = 0.22;

/* below this distance a glide is imperceptible; skip it */
const MIN_GLIDE_PX = 4;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function useScrollCheckpoints(
  target: { readonly current: HTMLElement | null },
  { checkpoints, enabled = true }: Options,
) {
  useEffect(() => {
    if (!enabled) return;
    const el = target.current;
    if (!el) return;

    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let raf = 0;
    let animating = false;
    let pointerHeld = false; /* mouse down: could be a scrollbar drag */
    let touching = false;
    let lastY = window.scrollY;
    let dir = 1;

    const cancelGlide = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      animating = false;
    };

    const glideTo = (destY: number) => {
      const fromY = window.scrollY;
      const dist = Math.abs(destY - fromY);
      if (dist < MIN_GLIDE_PX) return;
      /* duration scales with distance so short settles feel snappy and
         long ones stay legible under the canvas's damped follower */
      const dur = Math.min(1100, Math.max(450, (dist / window.innerHeight) * 380));
      const t0 = performance.now();
      animating = true;
      const step = (now: number) => {
        if (!animating) return;
        const t = Math.min(1, (now - t0) / dur);
        window.scrollTo(0, fromY + (destY - fromY) * easeInOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(step);
        else cancelGlide();
      };
      raf = requestAnimationFrame(step);
    };

    const settle = () => {
      if (animating || pointerHeld || touching) return;
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const span = rect.height - vh;
      if (span <= 0) return;
      const p = -rect.top / span;
      /* outside the pin (or exactly on its ends): native scroll only */
      if (p <= 0 || p >= 1) return;

      let i = 0;
      while (i < checkpoints.length - 2 && p >= checkpoints[i + 1]) i++;
      const a = checkpoints[i];
      const b = checkpoints[i + 1];
      if (!(b > a) || p < a || p > b) return;
      const f = (p - a) / (b - a);

      const targetP =
        dir >= 0 ? (f >= COMMIT ? b : a) : (f <= 1 - COMMIT ? a : b);
      glideTo(rect.top + window.scrollY + targetP * span);
    };

    const armIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(settle, IDLE_MS);
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (!animating) {
        if (y !== lastY) dir = y > lastY ? 1 : -1;
        armIdle();
      }
      lastY = y;
    };

    /* the user speaks: whatever we were doing, stop immediately */
    const interrupt = () => {
      cancelGlide();
      armIdle();
    };
    const onWheel = () => interrupt();
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)
      )
        interrupt();
    };
    const onPointerDown = () => {
      pointerHeld = true;
      cancelGlide();
    };
    const onPointerUp = () => {
      pointerHeld = false;
      armIdle();
    };
    const onTouchStart = () => {
      touching = true;
      cancelGlide();
    };
    const onTouchEnd = () => {
      touching = false;
      armIdle();
    };

    const opts = { passive: true } as const;
    window.addEventListener("scroll", onScroll, opts);
    window.addEventListener("wheel", onWheel, opts);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown, opts);
    window.addEventListener("pointerup", onPointerUp, opts);
    window.addEventListener("pointercancel", onPointerUp, opts);
    window.addEventListener("touchstart", onTouchStart, opts);
    window.addEventListener("touchend", onTouchEnd, opts);
    window.addEventListener("touchcancel", onTouchEnd, opts);

    return () => {
      clearTimeout(idleTimer);
      cancelGlide();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [enabled, target, checkpoints]);
}
