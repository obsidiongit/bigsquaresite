"use client";

import { useEffect, useState } from "react";

/* WebGL availability, checked once on the client. `null` means "not
   yet known" (SSR and first paint): callers treat null as "assume yes"
   so the canvas path never flashes in and out. */
export function useWebGLSupport() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}
