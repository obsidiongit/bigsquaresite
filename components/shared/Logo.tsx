import Image from "next/image";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/logo.svg";

/**
 * BigSquare logo mark. The nav bar uses this component today; other
 * surfaces (marquee tiles, footer mark) wire up when their assets land.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn("relative inline-block size-10 shrink-0", className)}
    >
      <Image
        src={logoMark}
        alt="BigSquare Marketing"
        fill
        className="object-contain"
        sizes="40px"
        priority
      />
    </span>
  );
}
