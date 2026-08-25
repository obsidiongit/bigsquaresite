"use client";

import { useEffect } from "react";
import { getLenis } from "@/components/motion/SmoothScroll";

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
   module-level constant: the array is an effect dep by reference.

   Alternatively pass `bands`: a resolver returning absolute scrollY
   [start, end] ranges, re-measured at settle time, for beats whose
   position depends on live layout (the featured work panel morph).
   Idle-parking inside a band glides to the edge the gesture was
   heading for; outside every band the hook is inert. The resolver is
   an effect dep by reference: pass a stable function (useCallback
   over refs). */

type Options = {
  /** sorted wrapper-progress rests (0..1) the page may settle on */
  checkpoints?: number[];
  /** dynamic alternative: absolute scrollY beat bands, sorted and
      non-overlapping, resolved fresh at each settle */
  bands?: () => [number, number][];
  /** gate for reduced motion / fallback branches */
  enabled?: boolean;
  /** glide pacing override, ms per viewport-height of distance
      (default 450). A long pinned choreography wants a much slower
      completion than a short beat hop: the work panel morph runs at
      ~2600 so the auto-completed dive-to-panel reads as the animation
      playing, not a jump cut (Brad round 9). Scalar on purpose: it is
      an effect dep. */
  glideMsPerVh?: number;
  /** glide duration ceiling in ms (default 1500) */
  glideMaxMs?: number;
};

/* quiet time after the last scroll event before we consider settling;
   long enough to outlast trackpad/momentum event gaps. This is the
   FALLBACK trigger: with Lenis mounted, the settle fires earlier, as
   soon as its velocity decays under VELOCITY_EPS (waiting for full
   event silence meant waiting out the whole lerp tail, which read as
   a long hang at each beat's cusp: Brad's 2026-08-24 round 3) */
const IDLE_MS = 100;

/* Lenis velocity (px/frame, smoothed) below which the gesture counts
   as over even though the lerp tail is still creeping */
const VELOCITY_EPS = 2;

/* the settle never fires within this window after real user input */
const INPUT_QUIET_MS = 120;

/* how far into a beat the stop must be to commit FORWARD (in the
   direction of travel). Kept tiny on purpose: any deliberate gesture
   should tip the beat over and play it through; only a stray last
   wheel notch settles back (Brad's 2026-08-24 review: the old 15%
   read as a hurdle you had to out-scroll in one go) */
const COMMIT = 0.06;

/* below this distance a glide is imperceptible; skip it */
const MIN_GLIDE_PX = 4;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function useScrollCheckpoints(
  target: { readonly current: HTMLElement | null },
  {
    checkpoints,
    bands,
    enabled = true,
    glideMsPerVh = 450,
    glideMaxMs = 1500,
  }: Options,
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
    let lastInput = 0; /* timestamp of the last real user input */
    let dir = 1;

    const cancelGlide = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      animating = false;
    };

    /* every glide write goes through Lenis when it is mounted, so its
       internal target stays in sync and the next wheel input continues
       from where the glide left off instead of lurching */
    const write = (y: number) => {
      const l = getLenis();
      if (l) l.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    };

    const glideTo = (destY: number) => {
      const fromY = window.scrollY;
      const dist = Math.abs(destY - fromY);
      if (dist < MIN_GLIDE_PX) return;
      /* duration scales with distance: glideMsPerVh per viewport
         (default 450; the 550/2200 tune read as sluggish once the
         settle started firing at the cusp instead of after the lerp
         tail), floored at 450ms, capped at glideMaxMs */
      const dur = Math.min(
        glideMaxMs,
        Math.max(450, (dist / window.innerHeight) * glideMsPerVh),
      );
      const t0 = performance.now();
      animating = true;
      const step = (now: number) => {
        if (!animating) return;
        const t = Math.min(1, (now - t0) / dur);
        write(fromY + (destY - fromY) * easeInOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(step);
        else cancelGlide();
      };
      raf = requestAnimationFrame(step);
    };

    const settle = () => {
      if (animating || pointerHeld || touching) return;

      /* dynamic bands: absolute-Y beats, re-measured now */
      if (bands) {
        const y = window.scrollY;
        for (const [a, b] of bands()) {
          if (!(b > a) || y <= a || y >= b) continue;
          const f = (y - a) / (b - a);
          glideTo(dir >= 0 ? (f >= COMMIT ? b : a) : (f <= 1 - COMMIT ? a : b));
          return;
        }
        return;
      }
      if (!checkpoints) return;

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
        /* fast path: Lenis is easing out and the hand is off the
           wheel; the beat's cusp is exactly where we should take over
           rather than waiting for its tail to fall fully silent */
        const l = getLenis();
        if (
          l &&
          performance.now() - lastInput > INPUT_QUIET_MS &&
          Math.abs(l.velocity) < VELOCITY_EPS
        ) {
          clearTimeout(idleTimer);
          settle();
        } else {
          armIdle();
        }
      }
      lastY = y;
    };

    /* the user speaks: whatever we were doing, stop immediately */
    const interrupt = () => {
      lastInput = performance.now();
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
      lastInput = performance.now();
      cancelGlide();
    };
    const onPointerUp = () => {
      pointerHeld = false;
      armIdle();
    };
    const onTouchStart = () => {
      touching = true;
      lastInput = performance.now();
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
  }, [enabled, target, checkpoints, bands, glideMsPerVh, glideMaxMs]);
}
