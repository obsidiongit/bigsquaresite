"use client";

import { Services } from "@/components/sections/home/Services";
import { useLab } from "@/lib/lab";
import { ServicesIndex } from "./ServicesIndex";
import { ServicesSlab } from "./ServicesSlab";
import { ServicesWall } from "./ServicesWall";

/* Review toggle (lib/lab "servicesLook", 2026-10-09): the original
   spotlight index or one of the lower-page renditions. When one wins,
   mount it directly in app/(marketing)/page.tsx and delete the rest. */
export function ServicesChoice() {
  const look = useLab("servicesLook");
  if (look === "index") return <ServicesIndex />;
  if (look === "wall") return <ServicesWall />;
  if (look === "slab") return <ServicesSlab />;
  return <Services />;
}
