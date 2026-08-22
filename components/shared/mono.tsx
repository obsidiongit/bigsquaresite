import { cn } from "@/lib/utils";

/* The mono meta family (STYLE_GUIDE.md 6.2): one family, four uses.
   Eyebrows, Nº section labels, bracketed indexes / counters, chips.
   All numerals tabular so cycling values never jitter (3.3). */

/* Eyebrow: 13px mono uppercase, sits above H2s. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("font-mono text-eyebrow uppercase text-sec-mid", className)}>
      {children}
    </p>
  );
}

/* Nº section label (pxpush): reads "Nº001 / INTRO". Numbering restarts
   per page, always three digits. Numbered narrative sections only;
   utility sections (FAQ, footer) do not get one. */
export function NoLabel({
  n,
  label,
  className,
}: {
  n: number;
  label: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-eyebrow uppercase tabular-nums",
        className,
      )}
    >
      <span className="text-sec-acc">{`Nº${String(n).padStart(3, "0")}`}</span>
      <span className="text-sec-mid">{` / ${label}`}</span>
    </p>
  );
}

/* Bracketed index (obys): "[01]" prefixes for list items. */
export function BracketIndex({
  n,
  className,
}: {
  n: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-mono-sm uppercase tabular-nums text-sec-mid",
        className,
      )}
    >
      [{String(n).padStart(2, "0")}]
    </span>
  );
}

/* Counter: reads "1/6", never with a dash (3.3). */
export function Counter({
  current,
  total,
  className,
}: {
  current: number;
  total: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-mono-sm tabular-nums text-sec-mid",
        className,
      )}
    >
      {current}/{total}
    </span>
  );
}

/* Chips: 12px mono uppercase in a pill. Outline for tags and filters;
   solid for the on-image metric lockup (6.4). Day-range chips are
   outline chips with the number wrapped in text-sec-acc by the caller. */
export function Chip({
  variant = "outline",
  children,
  className,
}: {
  variant?: "outline" | "solid";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 font-mono text-mono-sm uppercase tabular-nums",
        variant === "outline" && "border border-sec-line text-sec-ink",
        variant === "solid" && "bg-[rgba(11,15,23,.8)] text-ondark",
        className,
      )}
    >
      {children}
    </span>
  );
}
