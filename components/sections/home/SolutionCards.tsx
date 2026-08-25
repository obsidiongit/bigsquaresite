"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { SWEEP_UNDER, sweepPin } from "@/lib/solution-sweep";

/* SolutionCards (5.solution.md v3.2): the three widget cards plus the
   CARD SWEEP ink. Desktop: the section PINS (SolutionStage) and the
   runway scrubs the companion cube right-to-left flat under the
   frozen cards; as it crosses under each title, that title's ROUGH
   UNDERLINE draws in behind it — the same
   hand-drawn annotation system as the hero circle and the featured
   work box squiggle (RoughAnnotation, Brad's call over a bespoke sine
   underline: "the animated kind of scribble lines"). TWO-WAY via the
   `rearm` prop (Brad's round 2: the lines must "pop up one by one as
   the square slides under that actual card", never sit pre-drawn):
   each underline draws as the cube crosses under its card, boils
   while lit, and retracts when the cube scrubs back past it, so the
   beat replays on every pass. Three underlines share one viewport
   here, a deliberate exception to the 1-per-viewport annotation
   budget (Brad's ask; they draw one at a time behind the cube).

   The triggers replay the canvas Tracker's pin-clock math on the
   same stage/pin rects (lib/solution-sweep sweepPin), so cube and
   ink cannot drift apart. Collapsed-runway paths (mobile, where the
   cube's journey exits back at featured work; desktop with no cube)
   light each card on its own position instead, top-down. Reduced
   motion: RoughAnnotation renders the underlines settled, nothing
   draws.

   The grid wrapper carries data-cube-anchor="solutionCards": the
   canvas positions the sweep off this rect's live column geometry;
   the widgets stay server-rendered and arrive as ReactNodes. */

type Card = { title: string; line: string; widget: React.ReactNode };

/* mobile: a card lights when its top clears 78% of the viewport */
const MOBILE_TRIGGER = 0.78;

export function SolutionCards({ cards }: { cards: Card[] }) {
  const reduced = useReducedMotionSafe();
  const gridRef = useRef<HTMLDivElement>(null);
  /* bitmask of lit underlines by card index (document order); bits
     drop again on scroll-back and the rearm annotations retract */
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const grid = gridRef.current;
    if (!grid) return;
    const stageEl = grid.closest<HTMLElement>("[data-solution-stage]");
    const pinEl = stageEl?.querySelector<HTMLElement>("[data-solution-pin]");
    let raf = 0;
    const measure = () => {
      raf = 0;
      const vh = window.innerHeight;
      let mask = 0;
      const pin =
        window.innerWidth >= 768 && stageEl && pinEl
          ? sweepPin(
              stageEl.getBoundingClientRect(),
              pinEl.getBoundingClientRect(),
            )
          : { room: 0, p: 0 };
      if (pin.room > 1) {
        /* the pinned sweep: runway progress p is the clock, shared
           with the canvas cube. Right to left, so stage 1 lights
           column 2 (Full Approach), stage 3 column 0. */
        const stage = SWEEP_UNDER.filter((beat) => pin.p >= beat).length;
        for (let i = 0; i < cards.length; i++)
          if (stage >= cards.length - i) mask |= 1 << i;
      } else {
        /* collapsed runway (mobile, or a desktop fallback with no
           cube): each card lights on its own position, top-down */
        const els = grid.querySelectorAll<HTMLElement>("[data-sweep-card]");
        els.forEach((el, i) => {
          if (el.getBoundingClientRect().top < vh * MOBILE_TRIGGER)
            mask |= 1 << i;
        });
      }
      setLit((m) => (m === mask ? m : mask));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, cards.length]);

  return (
    <div
      ref={gridRef}
      data-cube-anchor="solutionCards"
      className="mt-12 md:mt-16"
    >
      <Reveal stagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card, i) => (
          <RevealItem key={card.title} className="h-full">
            <div
              data-sweep-card
              className="flex h-full flex-col rounded-[24px] border border-sec-line bg-surf p-5 lg:p-8"
            >
              {/* the vignette is illustration; title + line carry meaning */}
              <div
                aria-hidden
                className="flex min-h-[224px] flex-1 items-center rounded-[16px] bg-paper px-4 py-5 shadow-[0_8px_24px_rgba(11,15,23,.05)] lg:px-7 lg:py-6"
              >
                {card.widget}
              </div>
              <h3 className="mt-6 text-h3 font-bold text-sec-ink">
                <RoughAnnotation
                  variant="underline"
                  active={(lit & (1 << i)) !== 0}
                  rearm
                >
                  {card.title}
                </RoughAnnotation>
              </h3>
              <p className="mt-2 text-body text-sec-mid">{card.line}</p>
            </div>
          </RevealItem>
        ))}
      </Reveal>
    </div>
  );
}
