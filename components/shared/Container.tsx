import { cn } from "@/lib/utils";

/* The content container (STYLE_GUIDE.md 4.2): max 1200px, centered,
   page-edge gutters from --gutter-x. */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-gutter-x", className)}>
      {children}
    </div>
  );
}
