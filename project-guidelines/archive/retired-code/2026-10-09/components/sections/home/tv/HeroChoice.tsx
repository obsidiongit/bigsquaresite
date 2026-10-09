"use client";

import { useLab } from "@/lib/lab";
import { TvHero } from "./TvHero";

/* Review toggle (lib/lab "hero"): the TV hero (default) or the original glass-cube hero. */
export function HeroChoice({ original }: { original: React.ReactNode }) {
  return useLab("hero") === "tv" ? <TvHero /> : <>{original}</>;
}
