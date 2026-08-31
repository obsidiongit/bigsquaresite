"use client";

import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

/* SolutionCards (5.solution.md v3.2; unpinned 2026-08-30, Brad killed
   the scroll lock; underlines decoupled same day, round 2 of his
   review): the three widget cards with their ROUGH UNDERLINES, the
   same hand-drawn annotation system as the hero circle and the
   featured work box squiggle.

   The underlines are PRE-DRAWN AND ALIVE (`instant`: no draw-on, boil
   only), Brad's 2026-08-30 reversal of the round-2 draw-one-by-one
   rule: "by the time you scroll off the page, they're done drawing...
   have them all be drawn already and just already animating". The
   cube still sweeps flat under the cards (HomeCanvas reads the
   sweepFrac clock off this grid's rect), but the ink no longer waits
   for it, so there is no scroll listener here at all. Three boiling
   underlines share one viewport, the standing Brad-approved exception
   to the annotation budget.

   Reduced motion: staticRender, settled strokes, no boil.

   The grid wrapper carries data-cube-anchor="solutionCards": the
   canvas positions the sweep off this rect's live column geometry;
   the widgets stay server-rendered and arrive as ReactNodes. */

type Card = { title: string; line: string; widget: React.ReactNode };

export function SolutionCards({ cards }: { cards: Card[] }) {
  const reduced = useReducedMotionSafe();

  return (
    <div data-cube-anchor="solutionCards" className="mt-12 md:mt-16">
      <Reveal stagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <RevealItem key={card.title} className="h-full">
            <div className="flex h-full flex-col rounded-[24px] border border-sec-line bg-surf p-5 lg:p-8">
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
                  instant
                  staticRender={reduced}
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
