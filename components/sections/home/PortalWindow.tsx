import {
  CHANNELS,
  LEAD_COLUMNS,
  LEAD_ROWS,
  METRICS,
  PACING,
  PREVIEW_CHIP,
  RAIL,
  TABS,
} from "@/lib/obsidion-preview";
import { cn } from "@/lib/utils";

/* The Obsidion preview window (9.portal.md v3): the portal section's
   exhibit, and the object the companion cube becomes.

   THE SHELL / SLOT SPLIT (Brad 2026-08-25: "we're gonna drop live
   code"). `PortalWindow` is the SHELL: the frame, the chrome bar, the
   Obsidion mark, and the preview chip. Everything below the bar is a
   SLOT, and `PortalPreviewBody` is only its default filling. When the
   real dashboard code arrives it renders as `children` and nothing
   else in this section changes: not the exhibit treatment, not the
   layout, and not the cube's morph, which targets the shell's own bar
   and mark. Drop the chip at the same time and the exhibit stops being
   a placeholder.

   STRUCTURAL MOCK, NO NUMBERS, while the placeholder body stands. Every
   value is a <Bar>: a neutral skeleton whose width is a layout weight
   from lib/obsidion-preview, never a quantity. Field names are real
   because a field name is not a claim; nothing else in the window is.
   Charts are bars and never lines, so nothing can be read as a trend
   against an axis. See STYLE_GUIDE 6.12.

   NO macOS TRAFFIC LIGHTS: Obsidion is a portal a client logs into,
   not a desktop app, and three coloured dots would be a lie about the
   product (paper-design/ANALYSIS.md, "what we do not take").

   Server components. The placeholder body is aria-hidden: the
   section's copy carries every claim, so assistive tech loses nothing
   by skipping it. Live code will want its own a11y treatment, which is
   why the hidden-ness lives on the body and not on the shell. */

/** A value. Never a number: `w` is a layout weight, 0..1. */
function Bar({
  w,
  className,
  acc = false,
}: {
  w: number;
  className?: string;
  acc?: boolean;
}) {
  return (
    <span
      style={{ width: `${Math.round(w * 100)}%` }}
      className={cn(
        "block h-2 rounded-full",
        acc ? "bg-sec-acc/30" : "bg-sec-ink/10",
        className,
      )}
    />
  );
}

/** The rail glyph: our own square, at UI scale. */
export function PortalGlyph({ lit = false }: { lit?: boolean }) {
  return (
    <span
      className={cn(
        "size-[9px] shrink-0 rounded-[2px] border",
        lit ? "border-sec-acc bg-sec-acc/20" : "border-sec-ink/25",
      )}
    />
  );
}

function Panel({
  field,
  children,
  className,
}: {
  field: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[12px] bg-surf p-4", className)}>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-sec-mid">
        {field}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

/* ---- the slot's default filling ------------------------------------- */

export function PortalPreviewBody() {
  return (
    <div aria-hidden className="flex">
      {/* left rail: desktop only. The window narrows to its content on
          small screens rather than shrinking the rail to a strip. */}
      <div className="hidden w-[168px] shrink-0 border-r border-sec-line py-4 lg:block">
        {RAIL.map((item) => (
          <div
            key={item.label}
            className={cn(
              "mx-2 flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[12px]",
              item.lit
                ? "bg-sec-ink/[.04] font-medium text-sec-ink"
                : "text-sec-mid",
            )}
          >
            <PortalGlyph lit={item.lit} />
            {item.label}
          </div>
        ))}
      </div>

      <div className="min-w-0 flex-1 p-4 md:p-5">
        {/* view header: title + a range control that is itself a
            skeleton, so the window never states a date range */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-[15px] font-bold tracking-[-0.01em] text-sec-ink">
            Overview
          </p>
          <span className="flex w-[112px] shrink-0 items-center gap-2 rounded-full border border-sec-line px-3 py-1.5">
            <Bar w={1} className="h-1.5" />
          </span>
        </div>

        {/* metric row */}
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.field} className="rounded-[12px] bg-surf px-3.5 py-3.5">
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.08em] text-sec-mid">
                {m.field}
              </p>
              <Bar w={m.value} className="mt-2.5 h-3.5 rounded-[4px]" />
              {/* bars, not a line: a line against no axis still reads
                  as a trend claim */}
              <span className="mt-3 flex h-6 items-end gap-[3px]">
                {m.spark.map((s, i) => (
                  <span
                    key={i}
                    style={{ height: `${Math.round(s * 100)}%` }}
                    className="w-full rounded-[2px] bg-sec-ink/10"
                  />
                ))}
              </span>
            </div>
          ))}
        </div>

        {/* channels + pacing */}
        <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr_1fr]">
          <Panel field="Channels">
            <div className="space-y-3">
              {CHANNELS.map((c) => (
                <div key={c.field} className="flex items-center gap-3">
                  <span className="w-[92px] shrink-0 truncate text-[11px] text-sec-mid md:w-[104px]">
                    {c.field}
                  </span>
                  <span className="flex h-2 min-w-0 flex-1 rounded-full bg-sec-ink/[.05]">
                    <Bar w={c.weight} acc={c.acc} />
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel field="Budget pacing" className="hidden lg:block">
            <span className="flex h-2.5 rounded-full bg-sec-ink/[.05]">
              <Bar w={PACING.track} acc className="h-2.5" />
            </span>
            <div className="mt-4 space-y-2.5">
              {PACING.legend.map((l) => (
                <div key={l.field} className="flex items-center gap-3">
                  <span className="w-[74px] shrink-0 truncate text-[11px] text-sec-mid">
                    {l.field}
                  </span>
                  <Bar w={l.weight} className="h-1.5" />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* lead table: desktop only. Below lg the window keeps the
            metric row and channels, which is enough to read as the
            product without squeezing a 4-column table into 375. */}
        <div className="mt-3 hidden rounded-[12px] bg-surf p-4 lg:block">
          <div className="flex items-center gap-4 border-b border-sec-line pb-2.5">
            {LEAD_COLUMNS.map((col, i) => (
              <span
                key={col}
                className={cn(
                  "font-mono text-[10px] uppercase tracking-[0.08em] text-sec-mid",
                  i === 3 ? "w-[76px] shrink-0" : "min-w-0 flex-1",
                )}
              >
                {col}
              </span>
            ))}
          </div>
          {LEAD_ROWS.map((row, r) => (
            <div
              key={r}
              className="flex items-center gap-4 border-b border-sec-line py-3 last:border-b-0 last:pb-0"
            >
              {row.map((cell, c) =>
                c === 3 ? (
                  <span
                    key={c}
                    className="flex h-5 w-[76px] shrink-0 items-center rounded-full bg-sec-ink/[.06] px-2"
                  >
                    <Bar w={cell} className="h-1.5" />
                  </span>
                ) : (
                  <span key={c} className="min-w-0 flex-1">
                    <Bar w={cell} className="h-2" />
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- the shell ------------------------------------------------------ */

export function PortalWindow({
  children,
  className,
}: {
  /** the live dashboard, when it lands; defaults to the placeholder */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-portal-frame
      className={cn(
        "overflow-hidden rounded-[var(--radius-media)] border border-sec-line bg-paper",
        className,
      )}
    >
      {/* ---- chrome bar: the morph's target ------------------------ */}
      {/* bg-paper, not bg-surf: on a tint section the ground IS surf, so
          a surf bar is invisible for the whole stretch beat, when the
          bar is the only thing on screen. Paper lifts it off the ground
          at every moment of the morph, and the bottom hairline still
          separates chrome from content. */}
      <div
        data-portal-bar
        className="flex items-center gap-4 border-b border-sec-line bg-paper px-4 py-3 md:px-5"
      >
        <div className="flex shrink-0 items-center gap-2">
          {/* THE MARK. The companion cube flattens onto this exact box
              (lib/portal-window seedGeometry measures it), so its size
              and position are choreography, not decoration. */}
          <span
            data-portal-mark
            className="size-[18px] rounded-[4px] bg-acc"
          />
          <span className="text-[13px] font-bold tracking-[-0.01em] text-sec-ink">
            Obsidion
          </span>
        </div>

        {/* tabs: the lit one keeps a paper chip, the rest are quiet */}
        <div
          aria-hidden
          className="hidden min-w-0 flex-1 items-center gap-1 sm:flex"
        >
          {TABS.map((tab, i) => (
            <span
              key={tab}
              className={cn(
                "truncate rounded-[6px] px-2.5 py-1 text-[12px]",
                i === 0
                  ? "bg-sec-ink/[.06] font-medium text-sec-ink"
                  : "text-sec-mid",
              )}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* THE HONESTY GATE: visible at every width, removed only when
            the slot holds the real product */}
        <span className="ml-auto shrink-0 rounded-full border border-sec-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-sec-mid">
          {PREVIEW_CHIP}
        </span>
      </div>

      {children ?? <PortalPreviewBody />}
    </div>
  );
}
