import { cn } from "@/lib/utils";

/* <GridLines> (STYLE_GUIDE.md 4.3): the visible hairline system's column
   rails. Full-height 1px verticals at the content container's edges,
   optional interior rails at the 1/4, 1/2, 3/4 column edges. Colors come
   from the section theme's line token, so rails persist across light,
   dark, and accent sections. Place inside a relative <Section>. */

export function GridLines({
  quarters = false,
  className,
}: {
  /** Interior rails at 25/50/75%; quarters make square-ish cells */
  quarters?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <div className="mx-auto h-full w-full max-w-[1200px] px-gutter-x">
        <div className="relative h-full border-x border-sec-line">
          {quarters && (
            <>
              <div className="absolute inset-y-0 left-1/4 w-px bg-sec-line" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-sec-line" />
              <div className="absolute inset-y-0 left-3/4 w-px bg-sec-line" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
