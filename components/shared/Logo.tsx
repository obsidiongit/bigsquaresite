import { cn } from "@/lib/utils";

/**
 * Placeholder logo per decisions.md: a square outline in --acc with the
 * word "logo" inside. The real transparent mark drops in here later.
 * Never hard-code the placeholder outside this component.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      aria-label="BigSquare Marketing"
      role="img"
      className={cn(
        "inline-flex size-10 items-center justify-center border-2 border-acc font-mono text-[10px] uppercase tracking-[0.08em] text-acc select-none",
        className,
      )}
    >
      logo
    </span>
  );
}
