"use client";

import { CurtainFooter } from "@/components/shared/curtain-footer/CurtainFooter";
import { useLab } from "@/lib/lab";

/* Review toggle (lib/lab "footer"): the curtain footer (default) or the
   original. The original is a server component, so it arrives as a prop. */
export function FooterChoice({ original }: { original: React.ReactNode }) {
  return useLab("footer") === "curtain" ? <CurtainFooter /> : <>{original}</>;
}
