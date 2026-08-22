"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/* Hydration-safe reduced-motion flag. useReducedMotion() reads the media
   query on the first client render, which diverges from the SSR tree and
   breaks hydration when the user prefers reduced motion. This always
   returns false on the server and the first client render, then flips
   after mount. Use in any primitive that swaps its rendered tree. */
export function useReducedMotionSafe() {
  const prefers = useReducedMotion();
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(Boolean(prefers));
  }, [prefers]);
  return reduced;
}
