"use client";

import { useLab } from "@/lib/lab";
import { PortalBlueStage } from "./PortalBlueStage";
import { PortalMarkup } from "./PortalMarkup";
import { PortalSquares } from "./PortalSquares";

/* Review toggle (lib/lab "portalLook", 2026-10-09): the original portal
   section (passed in, it is a server component) or one of the
   lower-page renditions. When one wins, mount it directly in
   app/(marketing)/page.tsx and delete the rest. */
export function PortalChoice({ original }: { original: React.ReactNode }) {
  const look = useLab("portalLook");
  if (look === "stage") return <PortalBlueStage />;
  if (look === "markup") return <PortalMarkup />;
  if (look === "squares") return <PortalSquares />;
  return <>{original}</>;
}
