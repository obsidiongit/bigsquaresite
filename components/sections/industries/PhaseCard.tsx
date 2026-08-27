import { Check } from "lucide-react";
import { Chip } from "@/components/shared/mono";
import { cn } from "@/lib/utils";
import type { Phase } from "@/lib/ninety-days";

/* The day-range variant of the shared ProcessCard (STYLE_GUIDE 6.4;
   ProcessCard's own contract says day-range chips stay a caller
   variant, so this stays lane-local rather than widening the shared
   prop surface). Same anatomy and classes: outlined card, no fill,
   mono chip with the numbers in --sec-acc, verb title, short body,
   check-glyph list. Content comes from lib/ninety-days.ts; milestone
   DAY numbers stay off interior cards because they are invented
   pending confirmation (the ranges are approved structure). */

const pad = (n: number) => String(n).padStart(2, "0");

export function PhaseCard({
  phase,
  body,
  className,
}: {
  phase: Phase;
  body: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-sec-line p-6 md:p-8",
        className,
      )}
    >
      <Chip>
        Days{" "}
        <span className="ml-1 text-sec-acc">
          {pad(phase.days[0])}-{pad(phase.days[1])}
        </span>
      </Chip>
      <p className="mt-5 text-h3 font-bold text-sec-ink">{phase.name}</p>
      <p className="mt-2 text-body text-sec-mid">{body}</p>
      <ul className="mt-5 space-y-2">
        {phase.milestones.map((m) => (
          <li key={m.label} className="flex items-start gap-2.5">
            <Check
              aria-hidden
              className="mt-[3px] h-4 w-4 shrink-0 text-sec-acc"
              strokeWidth={2}
            />
            <span className="text-small text-sec-ink">{m.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
