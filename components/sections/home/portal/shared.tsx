import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { CALL_LOG } from "@/lib/obsidion-preview";
import { cn } from "@/lib/utils";

/* Pieces every Portal take shares (formerly review toggle "portalLook",
   2026-10-09). The copy is the original section's (DRAFT for Brad's
   pass); `mark` ties each feature to the part of the window it
   describes (data-mark in PortalLiveBody), which the marked-up and
   square takes use to point at or light that part. */

export const PORTAL_FEATURES = [
  { mark: "channels", title: "Every channel in one place", line: "Google, Meta, search, email, and calls. One screen." },
  { mark: "locations", title: "Every location, side by side", line: "Compare stores. Spot the winners. Fix the laggards." },
  { mark: "leads", title: "Every lead, traced to its source", line: "Know which ad made the phone ring. Listen to the call." },
  { mark: "pacing", title: "Budget pacing", line: "See where every dollar is going before the month ends." },
  { mark: "tasks", title: "Task log", line: "See what we changed, when, and what happened after." },
] as const;

export const PORTAL_BODY =
  "Most agencies send a slide deck once a month. We give you a login. Obsidion shows every channel, every lead, and every call, for every location, the moment it happens.";

/** the ping: a solid dot with a ring that keeps leaving it */
export function LiveDot({ className, play = true }: { className?: string; play?: boolean }) {
  return (
    <span aria-hidden className={cn("relative inline-flex size-[0.32em] align-middle", className)}>
      {play && <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60" />}
      <span className="relative size-full rounded-full bg-current" />
    </span>
  );
}

/** the two-tone headline: the statement, then "Live." with its dot */
export function PortalHeading({ align = "center", dot = true }: { align?: "center" | "left"; dot?: boolean }) {
  return (
    <div className={cn(align === "center" && "text-center")}>
      <BaselineReveal as="h2" className="font-display text-h2 text-sec-ink">
        See every lead and every dollar.
      </BaselineReveal>
      <p className="font-display text-h2 text-sec-acc">
        <span className="inline-flex items-center gap-[0.3em]">
          Live.
          {dot && <LiveDot className="size-[0.26em]" />}
        </span>
      </p>
    </div>
  );
}

export function PortalBody({ className }: { className?: string }) {
  return (
    <Reveal className={className}>
      <p className="text-body text-sec-mid">{PORTAL_BODY}</p>
    </Reveal>
  );
}

/** the secondary window: three calls, the top one ringing */
export function CallLog({ ringing, className }: { ringing: boolean; className?: string }) {
  return (
    <div
      aria-hidden
      data-theme="light"
      data-mark="calls"
      className={cn(
        "w-[260px] overflow-hidden rounded-[16px] border border-line bg-paper shadow-[0_18px_50px_rgba(11,15,23,.16)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line px-3.5 py-2.5">
        <span className="size-[9px] rounded-[2px] border border-acc bg-acc/20" />
        <span className="text-[12px] font-bold text-ink">{CALL_LOG.title}</span>
      </div>
      <div className="space-y-3 px-3.5 py-3.5">
        {CALL_LOG.rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span
              className={cn(
                "relative flex size-6 shrink-0 items-center justify-center rounded-full border",
                i === 0 ? "border-acc bg-acc/10" : "border-line",
              )}
            >
              {i === 0 && ringing && <span className="absolute inset-0 animate-ping rounded-full border border-acc" />}
              <svg viewBox="0 0 12 12" className="size-2.5 text-acc">
                <path d="M3.5 2.2v7.6L9.8 6z" fill="currentColor" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11px] text-mid">{row.field}</span>
              <span style={{ width: `${row.weight * 100}%` }} className="mt-1.5 block h-1.5 rounded-full bg-ink/10" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
