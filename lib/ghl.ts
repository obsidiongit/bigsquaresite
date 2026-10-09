// Thin GHL (LeadConnector) API v2 client for the BigSquare Marketing
// sub-account, server only. Ported from the UDT booking service
// (Desktop/UDT LPs/booking/lib/ghl.js), whose endpoints and Version
// headers were checked against GoHighLevel/highlevel-api-docs. Dormant
// until GHL_API_KEY (Private Integration token) and GHL_LOCATION_ID are
// set; the token lives only in Vercel env and .env.local.

const BASE = "https://services.leadconnectorhq.com";
const V_CONTACTS = "2021-07-28";

const TOKEN = process.env.GHL_API_KEY;
const LOCATION_ID = process.env.GHL_LOCATION_ID;

export function ghlEnabled(): boolean {
  return Boolean(TOKEN && LOCATION_ID);
}

export class GhlError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`GHL ${status}: ${typeof body === "string" ? body : JSON.stringify(body)}`);
  }
}

type CallOptions = {
  version?: string;
  query?: Record<string, string | number | undefined>;
  body?: unknown;
};

async function call<T = Record<string, unknown>>(
  method: string,
  path: string,
  { version = V_CONTACTS, query, body }: CallOptions = {},
): Promise<T> {
  if (!TOKEN || !LOCATION_ID) throw new Error("GHL_API_KEY / GHL_LOCATION_ID not set");
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(query ?? {})) {
    if (v !== undefined) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Version: version,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }
  if (!res.ok) throw new GhlError(res.status, data);
  return data as T;
}

/* Custom fields are configured by merge key ("contact.lead_form"); the
   API wants field ids. Looked up once per warm instance, retried on the
   next request if the lookup fails. */
let fieldIds: Promise<Record<string, string>> | null = null;

export function customFieldIds(): Promise<Record<string, string>> {
  if (!fieldIds) {
    fieldIds = call<{ customFields?: { id: string; fieldKey: string }[] }>(
      "GET",
      `/locations/${LOCATION_ID}/customFields`,
      { query: { model: "contact" } },
    ).then((data) => {
      const map: Record<string, string> = {};
      for (const f of data.customFields ?? []) map[f.fieldKey] = f.id;
      return map;
    });
    fieldIds.catch(() => {
      fieldIds = null;
    });
  }
  return fieldIds;
}

export type ContactInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  website?: string;
  source?: string;
  customFields?: { id: string; field_value: string }[];
};

/** Create or update by email/phone (GHL's duplicate rules). */
export async function upsertContact(contact: ContactInput): Promise<{ id: string }> {
  const data = await call<{ contact: { id: string } }>("POST", "/contacts/upsert", {
    body: { locationId: LOCATION_ID, ...contact },
  });
  return data.contact;
}

/** Adds tags without touching the contact's existing ones. */
export function addTags(contactId: string, tags: string[]) {
  return call("POST", `/contacts/${contactId}/tags`, { body: { tags } });
}

export function removeTags(contactId: string, tags: string[]) {
  return call("DELETE", `/contacts/${contactId}/tags`, { body: { tags } });
}

export function addNote(contactId: string, body: string) {
  return call("POST", `/contacts/${contactId}/notes`, { body: { body } });
}

type Pipeline = { id: string; name: string; stages: { id: string; name: string }[] };
let pipelines: Promise<Pipeline[]> | null = null;

/** Pipeline + stage ids by name, cached per warm instance. */
export async function findStage(
  pipelineName: string,
  stageName: string,
): Promise<{ pipelineId: string; stageId: string } | null> {
  if (!pipelines) {
    pipelines = call<{ pipelines?: Pipeline[] }>("GET", "/opportunities/pipelines", {
      query: { locationId: LOCATION_ID },
    }).then((data) => data.pipelines ?? []);
    pipelines.catch(() => {
      pipelines = null;
    });
  }
  const norm = (s: string) => s.trim().toLowerCase();
  const pipeline = (await pipelines).find((p) => norm(p.name) === norm(pipelineName));
  const stage = pipeline?.stages.find((s) => norm(s.name) === norm(stageName));
  return pipeline && stage ? { pipelineId: pipeline.id, stageId: stage.id } : null;
}

/** One open opportunity per contact per pipeline (GHL upsert). */
export function upsertOpportunity(input: {
  pipelineId: string;
  stageId: string;
  contactId: string;
  name: string;
  source?: string;
}) {
  return call("POST", "/opportunities/upsert", {
    body: {
      locationId: LOCATION_ID,
      pipelineId: input.pipelineId,
      pipelineStageId: input.stageId,
      contactId: input.contactId,
      name: input.name,
      status: "open",
      source: input.source,
    },
  });
}

/* Opportunity lookups for the booking step: the contact's open deal in a
   pipeline, and moving it to another stage. */
export async function findOpportunity(
  contactId: string,
  pipelineId: string,
): Promise<{ id: string } | null> {
  const data = await call<{ opportunities?: { id: string }[] }>("GET", "/opportunities/search", {
    query: { location_id: LOCATION_ID, contact_id: contactId, pipeline_id: pipelineId, status: "open", limit: 1 },
  });
  return data.opportunities?.[0] ?? null;
}

export function moveOpportunity(opportunityId: string, pipelineId: string, stageId: string) {
  return call("PUT", `/opportunities/${opportunityId}`, {
    body: { pipelineId, pipelineStageId: stageId },
  });
}

export async function getContact(contactId: string): Promise<{
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}> {
  const data = await call<{ contact: { id: string } }>("GET", `/contacts/${contactId}`);
  return data.contact;
}

/* Calendars (the pick-a-time step, lead-funnel.md section 5). The
   calendar is GHL_CALENDAR_ID; GHL applies its hours, notice and
   conflicts to the free slots. */
const V_CALENDARS = "2021-04-15";
const CALENDAR_ID = process.env.GHL_CALENDAR_ID;
/** Only names the date keys GHL groups by; each slot carries its own offset. */
const CALENDAR_TZ = "America/Denver";

/** Every free slot start between two instants, as ISO strings with offset. */
export async function freeSlots(startMs: number, endMs: number): Promise<string[]> {
  const data = await call<Record<string, unknown>>("GET", `/calendars/${CALENDAR_ID}/free-slots`, {
    version: V_CALENDARS,
    query: { startDate: startMs, endDate: endMs, timezone: CALENDAR_TZ },
  });
  const out: string[] = [];
  for (const [date, v] of Object.entries(data)) {
    const slots = (v as { slots?: unknown })?.slots;
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && Array.isArray(slots)) {
      out.push(...slots.filter((s): s is string => typeof s === "string"));
    }
  }
  return out.sort((a, b) => Date.parse(a) - Date.parse(b));
}

export async function createAppointment(input: {
  contactId: string;
  startTime: string;
  title: string;
}): Promise<{ id: string; startTime?: string; endTime?: string }> {
  return call("POST", "/calendars/events/appointments", {
    version: V_CALENDARS,
    body: {
      calendarId: CALENDAR_ID,
      locationId: LOCATION_ID,
      contactId: input.contactId,
      startTime: input.startTime,
      title: input.title,
      appointmentStatus: "confirmed",
      toNotify: true, // false would skip GHL's own notifications and workflows
      ignoreFreeSlotValidation: false, // GHL rejects a slot that was just taken
    },
  });
}

/* The contact appointments endpoint returns wall-clock times in the
   location's timezone with no offset ("2026-10-19 20:30:00"); the
   BigSquare location runs on America/New_York (ghl-lead-system.md). */
const LOCATION_TZ = "America/New_York";

function tzOffsetMinutes(ms: number, tz: string): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(new Date(ms))
      .map((p) => [p.type, Number(p.value)]),
  );
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return Math.round((asUtc - ms) / 60e3);
}

/** A GHL time to ISO UTC; offset-less values are read in the location's timezone. */
export function ghlTimeToIso(value: string, tz = LOCATION_TZ): string | null {
  if (/(?:[zZ]|[+-]\d{2}:?\d{2})$/.test(value)) {
    const ms = Date.parse(value);
    return Number.isNaN(ms) ? null : new Date(ms).toISOString();
  }
  const m = value.trim().match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2})?)$/);
  if (!m) return null;
  const guess = Date.parse(`${m[1]}T${m[2]}Z`);
  // Twice, so a DST change between the guess and the real instant is corrected.
  const first = guess - tzOffsetMinutes(guess, tz) * 60e3;
  return new Date(guess - tzOffsetMinutes(first, tz) * 60e3).toISOString();
}

/** The contact's next confirmed appointment on the booking calendar, if any. */
export async function upcomingAppointment(contactId: string): Promise<{ startTime: string } | null> {
  const data = await call<{
    events?: { calendarId?: string; startTime?: string; appointmentStatus?: string; deleted?: boolean }[];
  }>("GET", `/contacts/${contactId}/appointments`);
  const now = Date.now();
  const next = (data.events ?? [])
    .filter((e) => e.calendarId === CALENDAR_ID && !e.deleted && e.appointmentStatus !== "cancelled")
    .map((e) => (e.startTime ? ghlTimeToIso(e.startTime) : null))
    .filter((iso): iso is string => iso !== null && Date.parse(iso) > now)
    .sort()[0];
  return next ? { startTime: next } : null;
}
