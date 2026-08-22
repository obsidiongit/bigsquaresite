import { cn } from "@/lib/utils";

/* Registration marks (STYLE_GUIDE.md 4.3): small "+" glyphs, 12px, 1px
   stroke, theme line color at full strength (the section ink), placed at
   rail intersections around framed media and full-bleed moments.
   Decorative only: aria-hidden. Place inside a relative wrapper; the
   four marks center on its corners. */

function Mark({ className }: { className?: string }) {
  return (
    <span className={cn("absolute", className)}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1" />
      </svg>
    </span>
  );
}

export function RegistrationMarks({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 text-sec-ink", className)}
    >
      <Mark className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
      <Mark className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
      <Mark className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
      <Mark className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
    </div>
  );
}
