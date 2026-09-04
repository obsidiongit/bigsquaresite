"use client";

import { useEffect, useState } from "react";
import { hasGlobalPrivacyControl } from "@/lib/gpc";

/** null until mount, so SSR and the first client render match. */
export function useGpc(): boolean | null {
  const [gpc, setGpc] = useState<boolean | null>(null);

  useEffect(() => {
    setGpc(hasGlobalPrivacyControl());
  }, []);

  return gpc;
}
