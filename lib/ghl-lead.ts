import type { Attribution, Touch } from "@/lib/attribution";
import {
  addNote,
  addTags,
  customFieldIds,
  findStage,
  upsertContact,
  upsertOpportunity,
} from "@/lib/ghl";
import type { UtmParams } from "@/lib/utm";

// A website lead into GHL (lead-funnel.md sections 3 and 6): upsert the
// contact with every answer and the attribution in custom fields, tag it
// (the tags start the GHL workflows), write one plain-text note a person
// can read at a glance, and open an opportunity for sales forms.

export type LeadPayload = {
  formType: string;
  page: string;
  utm: UtmParams;
  fields: Record<string, string | number | boolean>;
  contact: { name: string; email: string; phone: string; company: string };
  smsConsent?: { checked: boolean; text: string; checkedAt?: string };
  eventId?: string;
  attribution?: Attribution;
  submittedAt: string;
};

/** Forms that open a deal in the pipeline */
const SALES_FORMS = new Set(["schedule", "apply", "audit", "contact"]);
const PIPELINE = "Website Leads";
const FIRST_STAGE = "New Lead";

/* Merge keys of the custom fields (created by scripts/ghl-setup.mjs,
   folder "Website"). Unknown or missing keys are skipped, never fatal. */
const FIELD = {
  leadForm: "contact.lead_form",
  landingPage: "contact.landing_page",
  referrer: "contact.referrer",
  leadEventId: "contact.lead_event_id",
  qualified: "contact.qualified",
  locations: "contact.locations",
  industry: "contact.industry",
  budget: "contact.monthly_ad_budget",
  blocker: "contact.growth_blocker",
  running: "contact.services_running",
  message: "contact.message",
  resource: "contact.resource_requested",
  firstSource: "contact.first_touch_source",
  firstMedium: "contact.first_touch_medium",
  firstCampaign: "contact.first_touch_campaign",
  firstContent: "contact.first_touch_content",
  firstTerm: "contact.first_touch_term",
  firstLanding: "contact.first_touch_landing_page",
  firstAt: "contact.first_touch_at",
  lastSource: "contact.last_touch_source",
  lastMedium: "contact.last_touch_medium",
  lastCampaign: "contact.last_touch_campaign",
  lastContent: "contact.last_touch_content",
  lastTerm: "contact.last_touch_term",
  gclid: "contact.gclid",
  gbraid: "contact.gbraid",
  wbraid: "contact.wbraid",
  fbclid: "contact.fbclid",
  msclkid: "contact.msclkid",
  fbc: "contact.fbc",
  fbp: "contact.fbp",
  gaClientId: "contact.ga_client_id",
  smsConsentText: "contact.sms_consent_text",
  smsConsentAt: "contact.sms_consent_at",
} as const;

const str = (v: unknown) => (v === undefined || v === null ? "" : String(v).trim());

function splitName(name: string): { firstName?: string; lastName?: string } {
  const [first, ...rest] = name.trim().split(/\s+/);
  return { firstName: first || undefined, lastName: rest.join(" ") || undefined };
}

function touchLine(t: Touch | undefined): string {
  if (!t) return "unknown";
  return [t.source, t.medium, t.campaign, t.content, t.term].filter(Boolean).join(" / ") +
    ` (landed ${t.landingPage}${t.referrer ? ` from ${t.referrer}` : ""}, ${t.at})`;
}

const ANSWER_LABELS: Record<string, string> = {
  company: "Company",
  business: "Company",
  website: "Website",
  industry: "Industry",
  locations: "Locations",
  budget: "Monthly ad budget",
  blocker: "What holds growth back",
  running: "Running now",
  message: "Message",
  resourceTitle: "Resource",
  qualified: "Qualified",
  funnel: "Funnel",
};

function noteFor(p: LeadPayload): string {
  const answers = Object.entries(p.fields)
    .filter(([k, v]) => ANSWER_LABELS[k] && str(v))
    .map(([k, v]) => `- ${ANSWER_LABELS[k]}: ${str(v)}`);
  const a = p.attribution;
  const ids = Object.entries(a?.clickIds ?? {}).map(([k, v]) => `${k}=${v}`);
  const lines = [
    `Website lead: ${p.formType} (${p.page})`,
    `Submitted ${p.submittedAt}`,
    "",
    ...(answers.length ? ["Answers:", ...answers, ""] : []),
    `Last touch: ${touchLine(a?.lastTouch)}`,
    `First touch: ${touchLine(a?.firstTouch)}`,
    ...(ids.length ? [`Click IDs: ${ids.join(", ")}`] : []),
  ];
  if (p.smsConsent) {
    lines.push(
      "",
      `SMS consent: ${p.smsConsent.checked ? `checked ${p.smsConsent.checkedAt ?? ""}` : "not checked"}`,
      `Consent text shown: "${p.smsConsent.text}"`,
    );
  }
  if (p.eventId) lines.push("", `Event ID: ${p.eventId}`);
  return lines.join("\n");
}

function tagsFor(p: LeadPayload): string[] {
  const tags = ["website-lead", `src:${p.formType}`];
  if (p.fields.qualified === true) tags.push("qualified");
  if (p.smsConsent?.checked) tags.push("sms-consent");
  if (p.formType === "newsletter") tags.push("newsletter");
  if (p.formType === "lead-magnet" && str(p.fields.resource)) tags.push(`res:${str(p.fields.resource)}`);
  if (/\+test@bigsquaremarketing\.com$/i.test(p.contact.email)) tags.push("test");
  return tags;
}

export async function deliverToGhl(p: LeadPayload): Promise<{ contactId: string }> {
  const a = p.attribution;
  const f = p.fields;
  const values: Record<string, string> = {
    [FIELD.leadForm]: p.formType,
    [FIELD.landingPage]: a?.lastTouch?.landingPage ?? p.page,
    [FIELD.referrer]: str(a?.lastTouch?.referrer),
    [FIELD.leadEventId]: str(p.eventId),
    [FIELD.qualified]: f.qualified === undefined ? "" : f.qualified ? "Yes" : "No",
    [FIELD.locations]: str(f.locations),
    [FIELD.industry]: str(f.industry),
    [FIELD.budget]: str(f.budget),
    [FIELD.blocker]: str(f.blocker),
    [FIELD.running]: str(f.running),
    [FIELD.message]: str(f.message),
    [FIELD.resource]: str(f.resourceTitle),
    [FIELD.firstSource]: str(a?.firstTouch?.source),
    [FIELD.firstMedium]: str(a?.firstTouch?.medium),
    [FIELD.firstCampaign]: str(a?.firstTouch?.campaign),
    [FIELD.firstContent]: str(a?.firstTouch?.content),
    [FIELD.firstTerm]: str(a?.firstTouch?.term),
    [FIELD.firstLanding]: str(a?.firstTouch?.landingPage),
    [FIELD.firstAt]: str(a?.firstTouch?.at),
    [FIELD.lastSource]: str(a?.lastTouch?.source),
    [FIELD.lastMedium]: str(a?.lastTouch?.medium),
    [FIELD.lastCampaign]: str(a?.lastTouch?.campaign),
    [FIELD.lastContent]: str(a?.lastTouch?.content),
    [FIELD.lastTerm]: str(a?.lastTouch?.term),
    [FIELD.gclid]: str(a?.clickIds.gclid),
    [FIELD.gbraid]: str(a?.clickIds.gbraid),
    [FIELD.wbraid]: str(a?.clickIds.wbraid),
    [FIELD.fbclid]: str(a?.clickIds.fbclid),
    [FIELD.msclkid]: str(a?.clickIds.msclkid),
    [FIELD.fbc]: str(a?.fbc),
    [FIELD.fbp]: str(a?.fbp),
    [FIELD.gaClientId]: str(a?.gaClientId),
    [FIELD.smsConsentText]: p.smsConsent?.checked ? p.smsConsent.text : "",
    [FIELD.smsConsentAt]: p.smsConsent?.checked ? str(p.smsConsent.checkedAt) : "",
  };

  let ids: Record<string, string> = {};
  try {
    ids = await customFieldIds();
  } catch (error) {
    console.error("[ghl-lead] custom field lookup failed; saving without custom fields", error);
  }
  const customFields = Object.entries(values)
    .filter(([key, value]) => value && ids[key])
    .map(([key, value]) => ({ id: ids[key], field_value: value }));

  const contact = await upsertContact({
    ...splitName(p.contact.name),
    email: p.contact.email || undefined,
    phone: p.contact.phone || undefined,
    companyName: p.contact.company || undefined,
    website: str(f.website) || undefined,
    source: `Website: ${p.formType}`,
    customFields,
  });

  // Tags start the workflows; the note and the deal are best effort.
  await addTags(contact.id, tagsFor(p));
  const extras: Promise<unknown>[] = [addNote(contact.id, noteFor(p))];
  if (SALES_FORMS.has(p.formType)) {
    extras.push(
      (async () => {
        const stage = await findStage(PIPELINE, FIRST_STAGE);
        if (!stage) {
          console.warn(`[ghl-lead] pipeline "${PIPELINE}" / "${FIRST_STAGE}" not found`);
          return;
        }
        await upsertOpportunity({
          ...stage,
          contactId: contact.id,
          name: `${p.contact.company || p.contact.name || p.contact.email} (${p.formType})`,
          source: `Website: ${p.formType}`,
        });
      })(),
    );
  }
  for (const r of await Promise.allSettled(extras)) {
    if (r.status === "rejected") console.error("[ghl-lead] follow-up write failed:", r.reason);
  }
  return { contactId: contact.id };
}
