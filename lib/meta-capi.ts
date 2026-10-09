import { createHash } from "node:crypto";
import type { LeadEvent } from "@/lib/lead-events";

// Meta Conversions API, server side (lead-funnel.md section 8). Sends the
// same event the browser pixel fires, with the same event_id, so Meta
// deduplicates the pair and still gets the conversion when the pixel is
// blocked. Dormant until NEXT_PUBLIC_META_PIXEL_ID and META_CAPI_TOKEN are
// set. Personal fields are normalized and SHA-256 hashed per Meta's spec;
// raw values never leave this server. Never call it for visitors who send
// Global Privacy Control (form-action checks).

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TOKEN = process.env.META_CAPI_TOKEN;
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v23.0";
/** Events Manager > Test events code, for QA only; unset in production. */
const TEST_CODE = process.env.META_TEST_EVENT_CODE;

export function capiEnabled(): boolean {
  return Boolean(PIXEL_ID && TOKEN);
}

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

function hashed(value: string | undefined): string[] | undefined {
  const v = value?.trim().toLowerCase();
  return v ? [sha256(v)] : undefined;
}

/** Digits only, US country code added to a bare 10-digit number. */
function normalizePhone(phone: string | undefined): string | undefined {
  const digits = phone?.replace(/\D/g, "");
  if (!digits) return undefined;
  return digits.length === 10 ? `1${digits}` : digits;
}

export type CapiLead = {
  event: LeadEvent;
  eventId: string;
  /** full URL of the page the form was on */
  sourceUrl: string;
  email?: string;
  phone?: string;
  name?: string;
  fbc?: string;
  fbp?: string;
  ip?: string;
  userAgent?: string;
  customData?: Record<string, string | number | boolean>;
};

export async function sendCapiEvent(lead: CapiLead): Promise<void> {
  if (!capiEnabled()) return;
  const [first, ...rest] = (lead.name ?? "").trim().split(/\s+/);
  const phone = normalizePhone(lead.phone);

  const userData = Object.fromEntries(
    Object.entries({
      em: hashed(lead.email),
      ph: phone ? [sha256(phone)] : undefined,
      fn: hashed(first),
      ln: hashed(rest.join(" ")),
      external_id: hashed(lead.email),
      fbc: lead.fbc,
      fbp: lead.fbp,
      client_ip_address: lead.ip,
      client_user_agent: lead.userAgent,
    }).filter(([, v]) => v !== undefined && v !== ""),
  );

  const body = {
    data: [
      {
        event_name: lead.event.meta,
        event_time: Math.floor(Date.now() / 1000),
        event_id: lead.eventId,
        action_source: "website",
        event_source_url: lead.sourceUrl,
        user_data: userData,
        custom_data: lead.customData ?? {},
      },
    ],
    ...(TEST_CODE ? { test_event_code: TEST_CODE } : {}),
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN!)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    if (!response.ok) {
      console.error(
        `[meta-capi] ${lead.event.meta} ${lead.eventId} rejected ${response.status}:`,
        (await response.text()).slice(0, 500),
      );
    }
  } catch (error) {
    console.error(`[meta-capi] ${lead.event.meta} ${lead.eventId} failed:`, error);
  }
}
