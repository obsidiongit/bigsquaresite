"use client";

import { useEffect } from "react";
import { sfx } from "@/lib/sfx";

/* Sitewide sound wiring (STYLE_GUIDE.md 7.11). One delegated listener
   set on document instead of per-component props: every link, button,
   and [data-sfx] element pops on hover (fine pointers only) and clicks
   sitewide, keyboard focus gets the quiet swell. Opt out any element
   with data-sfx="none". The first gesture unlocks the AudioContext
   (autoplay policy), so the very first pointerdown both unlocks and
   plays. Mounted once in the marketing layout. */

const INTERACTIVE = 'a,button,[role="button"],summary,[data-sfx]';

function target(e: Event): Element | null {
  const el = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null;
  return el && el.getAttribute("data-sfx") !== "none" ? el : null;
}

export function SoundProvider() {
  useEffect(() => {
    const unlock = () => sfx.unlock();
    /* not {once} on pointerdown: iOS suspends the context on interruptions,
       and resume() must come from a gesture; unlock() is idempotent */
    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    const onOver = (e: PointerEvent) => {
      if (!finePointer.matches) return;
      const el = target(e);
      if (!el) return;
      /* entering a child of the element we're already in is not a new hover */
      if (e.relatedTarget instanceof Node && el.contains(e.relatedTarget)) return;
      sfx.play("hover");
    };

    const onDown = (e: PointerEvent) => {
      if (target(e)) sfx.play("click");
    };

    const onFocus = (e: FocusEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      /* keyboard-modality focus only; mouse clicks already popped */
      if (el?.matches(":focus-visible")) sfx.play("focus");
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("focusin", onFocus);
    return () => {
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("focusin", onFocus);
    };
  }, []);

  return null;
}
