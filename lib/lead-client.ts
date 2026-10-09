// What every lead form adds to its submission besides its own fields
// (lead-funnel.md sections 3 and 8): one event id shared with the
// server-side Conversions API, the visitor's attribution, the Global
// Privacy Control signal, and the two spam signals (honeypot value and
// time on form) that submitForm checks.

import { useEffect, useRef } from "react";
import { getAttribution } from "@/lib/attribution";
import { hasGlobalPrivacyControl } from "@/lib/gpc";
import { newEventId } from "@/lib/lead-events";

export const HONEYPOT_FIELD = "company_website";

/** When the form became usable; read at submit for the fill-time check. */
export function useFormStartedAt() {
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  return startedAt;
}

export function leadMeta(form: HTMLFormElement | null, startedAt: number) {
  return {
    eventId: newEventId(),
    attribution: getAttribution(),
    gpc: hasGlobalPrivacyControl(),
    elapsedMs: startedAt ? Date.now() - startedAt : undefined,
    hp: form ? String(new FormData(form).get(HONEYPOT_FIELD) ?? "") : "",
  };
}
