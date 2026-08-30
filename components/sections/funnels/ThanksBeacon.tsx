"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/* The thank-you page is the conversion URL the ad platforms hook onto.
   Fires the spec's `booked` event once per view with the funnel slug;
   the UTMs stay on the URL for the tags themselves. Renders nothing. */
export function ThanksBeacon({ funnel }: { funnel: string }) {
  useEffect(() => {
    track("booked", { funnel });
  }, [funnel]);
  return null;
}
