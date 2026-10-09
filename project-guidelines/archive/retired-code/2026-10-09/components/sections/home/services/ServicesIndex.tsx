"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useInView, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { Section } from "@/components/shared/Section";
import { SERVICE_GROUPS_HOME, SERVICES_FLAT, groupBase } from "@/lib/home-services";
import { EDGE } from "@/lib/layout";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ServicePhoto } from "./ServicePhoto";
import { ServicesHeader, runName } from "./shared";

/* Services, take "index" (formerly review toggle "servicesLook",
   2026-10-09). The catalog as three lines of running display type, one
   per group, each on a ruled row with its bracketed index: the whole
   15-service menu reads in one glance instead of a 1,600px list. The
   names are the links; small brand squares sit between them.

   Pointing at a name dims the rest and brings in a PREVIEW CARD that
   follows the pointer on a spring: the service's photo as blue squares
   (it swings in from the pointer with a small turn), its group
   and one-liner under it. Stay on one name and the squares fade to show
   the photo. The card leans with the pointer's speed.

   Fine pointers only for the card (portal to <body>, so no transformed
   ancestor can break its fixed positioning); touch and keyboard get the
   plain links, and focus shows the card next to the focused name.
   Reduced motion: no follow, no lean, no turn; the card still appears.
   data-hand-off: HandFx draws no pencil underline under these names
   (2026-10-09 review: at this size the underline read as a scrawl
   under the name, not a mark). */

const CARD_W = 272;
/* photo square + caption block */
const CARD_H = 385;

export function ServicesIndex() {
  const reduced = useReducedMotionSafe();
  const [active, setActive] = useState<number | null>(null);
  const [fine, setFine] = useState(false);
  const [mounted, setMounted] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  /* mount the 15 previews (images + halftone) only once the list is near */
  const near = useInView(listRef, { once: true, margin: "400px 0px" });

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* pointer follow: the card's top-left, sprung */
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = reduced ? { stiffness: 2000, damping: 100 } : { stiffness: 320, damping: 30, mass: 0.7 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const vx = useVelocity(sx);
  const lean = useTransform(vx, [-2400, 2400], reduced ? [0, 0] : [-9, 9], { clamp: true });

  const place = (cx: number, cy: number) => {
    /* hangs below and right of the pointer so it never covers the line
       being read (the dimmed lines under it are fair game); flips left
       near the right edge and above the pointer near the bottom */
    const flipX = cx + 24 + CARD_W > window.innerWidth - 16;
    const flipY = cy + 40 + CARD_H > window.innerHeight - 16;
    x.set(flipX ? cx - 24 - CARD_W : cx + 24);
    y.set(flipY ? Math.max(16, cy - 40 - CARD_H) : cy + 40);
  };

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    place(e.clientX, e.clientY);
  };

  const onFocusName = (i: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    place(r.right, r.top + r.height / 2);
    setActive(i);
  };

  const current = active === null ? null : SERVICES_FLAT[active];

  return (
    <Section theme="light" anchor="services">
      <div className={cn(EDGE, "relative z-10")}>
        <ServicesHeader />

        <div
          ref={listRef}
          data-hand-off
          onPointerMove={onMove}
          onPointerLeave={() => setActive(null)}
          className="mt-12 border-b border-sec-line md:mt-16"
        >
          {SERVICE_GROUPS_HOME.map((group, g) => {
            const base = groupBase(g);
            return (
              <Reveal
                key={group.title}
                className="grid gap-4 border-t border-sec-line py-7 md:py-9 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-x-12"
              >
                <div className="flex items-baseline gap-3 lg:block">
                  <span className="font-mono text-eyebrow tabular-nums text-sec-acc">[{String(g + 1).padStart(2, "0")}]</span>
                  <Link
                    href={group.href}
                    className="font-mono text-eyebrow uppercase tracking-[0.08em] text-sec-mid transition-colors duration-[250ms] hover:text-sec-acc lg:mt-3 lg:block"
                  >
                    {group.title}
                  </Link>
                  <span className="ml-auto font-mono text-eyebrow tabular-nums text-sec-mid lg:ml-0 lg:mt-1 lg:block">
                    {group.items.length} services
                  </span>
                </div>
                <p className="font-display text-[clamp(26px,14px+2.3vw,46px)] leading-[1.22] tracking-[-0.02em] alt-none">
                  {group.items.map((item, k) => {
                    const i = base + k;
                    const lit = active === i;
                    const name = runName(item.label);
                    const cut = name.lastIndexOf(" ");
                    const sep = k < group.items.length - 1;
                    return (
                      <Fragment key={item.href}>
                        <Link
                          href={item.href}
                          title={item.label}
                          onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                          onFocus={(e) => onFocusName(i, e.currentTarget)}
                          onBlur={() => setActive(null)}
                          className={cn(
                            "transition-[color,opacity] duration-[250ms] ease-house",
                            lit ? "text-sec-acc" : "text-sec-ink",
                            active !== null && !lit && "opacity-25",
                          )}
                        >
                          {/* the last word and its square never part, so a
                              line never starts with a square */}
                          {cut > 0 && name.slice(0, cut + 1)}
                          <span className="whitespace-nowrap">
                            {name.slice(cut + 1)}
                            {sep && (
                              <span
                                aria-hidden
                                className="ml-[0.32em] inline-block size-[0.28em] -translate-y-[0.12em] bg-sec-acc align-middle"
                              />
                            )}
                          </span>
                        </Link>{" "}
                      </Fragment>
                    );
                  })}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* ---- the preview card ------------------------------------- */}
      {mounted &&
        fine &&
        near &&
        createPortal(
          <motion.div
            aria-hidden
            data-theme="light"
            style={{ x: sx, y: sy, rotate: lean, background: "transparent" }}
            className="pointer-events-none fixed left-0 top-0 z-[45]"
          >
            <motion.div
              initial={false}
              animate={
                current
                  ? { opacity: 1, scale: 1, rotate: 0 }
                  : { opacity: 0, scale: reduced ? 1 : 0.6, rotate: reduced ? 0 : -14 }
              }
              transition={{ duration: reduced ? 0.15 : 0.45, ease: EASE.house }}
              style={{ width: CARD_W }}
              className="origin-top-left overflow-hidden rounded-[20px] border border-line bg-paper shadow-[0_24px_60px_rgba(11,15,23,.18)]"
            >
              {/* every photo stays mounted (each draws its squares once);
                  only the active one shows */}
              <div className="relative aspect-square">
                {SERVICES_FLAT.map(({ item, i }) => (
                  <div
                    key={item.href}
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{ opacity: active === i ? 1 : 0 }}
                  >
                    <ServicePhoto src={item.img} reveal={active === i} revealDelay={0.9} sizes={`${CARD_W}px`} />
                  </div>
                ))}
              </div>
              <div className="relative min-h-[118px] overflow-hidden border-t border-line px-5 py-4">
                <AnimatePresence mode="popLayout" initial={false}>
                  {current && (
                    <motion.div
                      key={current.item.href}
                      initial={reduced ? false : { y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={reduced ? undefined : { y: -16, opacity: 0 }}
                      transition={{ duration: 0.24, ease: EASE.house }}
                    >
                      <p className="font-mono text-mono-sm uppercase text-acc">{SERVICE_GROUPS_HOME[current.g].title}</p>
                      <p className="mt-2 text-small text-ink">{current.item.line}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>,
          document.body,
        )}
    </Section>
  );
}
