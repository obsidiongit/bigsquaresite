"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";
import { rememberUtmParams } from "@/lib/utm";

/** Remembers UTM params for the session and records first/last touch
    (lib/attribution.ts) on every route change. Renders nothing. */
export function UtmCapture() {
  const pathname = usePathname();

  useEffect(() => {
    rememberUtmParams();
    captureAttribution();
  }, [pathname]);

  return null;
}
