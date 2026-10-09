"use client";
/**
 * The footer's button, "Contact us" (2026-09-28, the designer on the white block: "change how this button looks and
 * how it works"). Four takes, ?cta=<id> or the lab picker; all in the footer's pencil world:
 *   pencil  a hand-drawn outline (wobbling pencil); pointing at it scribbles it in and the words go blue;
 *           clicking draws a tick, then goes to the contact page
 *   grow    a small square beside the words grows to fill the whole button on hover, the words flip to blue
 *           and the arrow shoots off up and right
 *   field   the button opens in place into "your website" + "your email" and sends the message from
 *           the footer (to /api/contact, like the contact page); a pencil tick and "Got it" when it's in
 *   magnet  leans toward the pointer as it gets close, and a pencil loop draws itself round it
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import s from "./cta.module.css";

// the designer: not "Get a free audit", "just like contact us or somthing along those lines"
const LABEL = "Contact us";
const HREF = "/contact/";

function Arrow() {
  return (
    <svg className={s.arrow} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.5 13.5 C6 10 9 7 13 3" pathLength={1} />
      <path d="M6 2.6 C8.5 2.9 11 2.8 13.3 2.6 C13.2 5 13.4 7.4 13.5 9.8" pathLength={1} />
    </svg>
  );
}
function scribble(w: number, h: number) {
  let d = `M -6 ${h + 10}`;
  for (let x = -6, i = 0; x < w + 10; x += 10, i++) d += ` L ${x + 5 + ((i * 7) % 5) - 2} -10 L ${x + 10 + ((i * 3) % 5) - 2} ${h + 10}`;
  return d;
}

export default function FooterCta({ on }: { on: boolean }) {
  return <PencilCta on={on} />;
}

/** A · hand-drawn box, scribbled in on hover, ticked on click */
function PencilCta({ on }: { on: boolean }) {
  const [ticked, setTicked] = useState(false);
  return (
    <a
      href={HREF}
      className={`${s.cta} ${s.pencil}`}
      data-on={on || undefined}
      data-ticked={ticked || undefined}
      onClick={(e) => {
        if (ticked) return;
        e.preventDefault();
        setTicked(true);
        const to = e.currentTarget.href;
        setTimeout(() => (location.href = to), 520);
      }}
    >
      <svg className={s.box} viewBox="0 0 360 60" preserveAspectRatio="none" aria-hidden="true">
        <clipPath id="cta-inside">
          <rect x="2" y="2" width="356" height="56" rx="3" />
        </clipPath>
        <path className={s.fill} d={scribble(360, 60)} pathLength={1} clipPath="url(#cta-inside)" />
        <path className={s.line} d="M4 3 C90 1 250 4 357 2 C358 20 356 40 358 58 C250 56 120 59 2 57 C3 40 1 20 4 3 M10 1 C120 3 220 0 330 3" pathLength={1} />
        <path className={s.tick} d="M312 32 L324 44 L346 14" pathLength={1} />
      </svg>
      <span className={s.text}>{LABEL}</span>
      <Arrow />
    </a>
  );
}
