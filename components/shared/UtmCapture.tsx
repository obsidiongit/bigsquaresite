"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { rememberUtmParams } from "@/lib/utm";

/** Remembers UTM params for the session on every route change. Renders nothing. */
export function UtmCapture() {
  const pathname = usePathname();

  useEffect(() => {
    rememberUtmParams();
  }, [pathname]);

  return null;
}
