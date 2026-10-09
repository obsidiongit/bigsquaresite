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
