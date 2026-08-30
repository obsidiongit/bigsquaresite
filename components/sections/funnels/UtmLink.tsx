"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { withUtm } from "@/lib/funnels/href";
import { track, type TrackParams } from "@/lib/track";
import { getUtmParams } from "@/lib/utm";

/* A link that carries the visitor's UTM params forward (decisions.md:
   UTMs pass through to the booking step and the CRM). The href is
   server-rendered plain and gains the params after mount, so the
   markup hydrates clean. Optional `event` fires through lib/track.ts
   on click (the veil's capture-phase intercept preventDefaults but
   does not stop propagation, so React's onClick still runs).
   `sfx` opts the surface into the hover pop: primary CTAs only. */
export function UtmLink({
  href,
  event,
  eventParams,
  sfx = false,
  className,
  children,
}: {
  href: string;
  event?: string;
  eventParams?: TrackParams;
  sfx?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [target, setTarget] = useState(href);

  useEffect(() => {
    setTarget(withUtm(href, getUtmParams()));
  }, [href]);

  return (
    <Link
      href={target}
      className={className}
      data-sfx={sfx ? "" : undefined}
      onClick={() => {
        if (event) track(event, eventParams);
      }}
    >
      {children}
    </Link>
  );
}
