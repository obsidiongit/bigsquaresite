// Which ad/analytics event each form fires (lead-funnel.md, section 8).
// Shared by the browser tags (lib/track.ts) and the server-side Meta
// Conversions API (lib/meta-capi.ts) so both send the same event name with
// the same event_id and Meta can deduplicate them.

export type FormType =
  | "schedule"
  | "apply"
  | "audit"
  | "contact"
  | "lead-magnet"
  | "newsletter";

export type LeadEvent = {
  /** Meta event name */
  meta: string;
  /** true for a custom event (fbq trackCustom), false for a standard one */
  metaCustom: boolean;
  /** GA4 event name */
  ga4: string;
};

const SALES_LEAD: LeadEvent = { meta: "Lead", metaCustom: false, ga4: "generate_lead" };

export const LEAD_EVENTS: Record<FormType, LeadEvent> = {
  schedule: SALES_LEAD,
  apply: SALES_LEAD,
  audit: SALES_LEAD,
  contact: SALES_LEAD,
  "lead-magnet": { meta: "ResourceRequest", metaCustom: true, ga4: "generate_lead" },
  newsletter: { meta: "NewsletterSignup", metaCustom: true, ga4: "sign_up" },
};

/** Extra event for an application that meets the qualifying bar. */
export const QUALIFIED_EVENT: LeadEvent = {
  meta: "QualifiedLead",
  metaCustom: true,
  ga4: "qualified_lead",
};

export function leadEventFor(formType: string): LeadEvent | undefined {
  return LEAD_EVENTS[formType as FormType];
}

/** Spam floor: faster than a person can fill any of our forms, autofill
    included. The server drops these; the browser skips their events. */
export const MIN_FILL_MS = 1500;

/** Collision-safe id for one conversion, shared by browser and server. */
export function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}
