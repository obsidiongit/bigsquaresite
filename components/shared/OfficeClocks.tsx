"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/* Live office time (shared/footer.md v3.1): one city's local time in
   the body face, tabular nums, minutes precision. Hydration-safe: the
   server renders --:-- and the value fills on mount, ticking on the
   minute boundary. Clocks are content, not decoration: they keep
   updating under reduced motion (7.8). */

function timeIn(timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

export function OfficeTime({
  timeZone,
  className,
}: {
  timeZone: string;
  className?: string;
}) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(timeIn(timeZone));
    update();
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      update();
      interval = setInterval(update, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [timeZone]);

  return (
    <span className={cn("tabular-nums", className)}>{time ?? "--:--"}</span>
  );
}
