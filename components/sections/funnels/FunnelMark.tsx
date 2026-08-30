import { Logo } from "@/components/shared/Logo";
import type { FunnelPalette } from "@/lib/funnels/registry";

/* The funnel top bar (landing-pages specs, section 1): the mark,
   centered, small, unlinked. An ad destination has no exits except
   its CTA, so the lockup is a signature, not a nav.

   On the accent ground the logo asset (logo blue on transparent)
   would vanish, so the brand square stands in for the mark there in
   --onacc; every other ground gets the shared <Logo /> (decisions.md:
   the placeholder mark lives in that component only). */
export function FunnelMark({
  palette,
  className,
}: {
  palette: FunnelPalette;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="flex items-center justify-center gap-3">
        {palette === "accent" ? (
          <span aria-hidden className="size-9 rounded-[9px] bg-onacc" />
        ) : (
          <Logo className="size-9" />
        )}
        <span className="text-[18px] font-bold text-sec-ink">BigSquare</span>
      </p>
    </div>
  );
}
