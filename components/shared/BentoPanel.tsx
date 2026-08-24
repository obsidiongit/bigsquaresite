import { cn } from "@/lib/utils";

/* <BentoPanel> (STYLE_GUIDE.md 6.4, readymag): a self-contained
   rounded-24 panel that snaps to the 12-column grid. Theme-scoped via
   data-theme, so a dark panel inside a tint section is a panel-scoped
   theme, not a section theme. Budget per bento grid: at most one dark
   panel and at most one accent panel; everything else stays on paper.
   Panels are not links: no hover motion. */

type Props = {
  /** panel ground; "light" renders --paper (the default panel ground) */
  theme?: "light" | "tint" | "dark" | "accent";
  className?: string;
  children: React.ReactNode;
};

export function BentoPanel({ theme = "light", className, children }: Props) {
  return (
    <div
      data-theme={theme}
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-sec-line p-6 md:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
