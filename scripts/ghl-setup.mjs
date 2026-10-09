// One-time GHL setup for the website lead funnel (lead-funnel.md section 6).
//
//   node scripts/ghl-setup.mjs           report: what exists, what is missing
//   node scripts/ghl-setup.mjs --apply   create the missing contact custom fields
//
// Reads GHL_API_KEY and GHL_LOCATION_ID from .env.local (the token is never
// printed). Field keys must match FIELD in lib/ghl-lead.ts; the report flags
// any field whose generated key differs. Also lists pipelines and calendars
// so their ids can go into config.

import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((line) => /^[A-Z0-9_]+=/.test(line))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);
const TOKEN = env.GHL_API_KEY;
const LOCATION = env.GHL_LOCATION_ID;
if (!TOKEN || !LOCATION) {
  console.error("Set GHL_API_KEY and GHL_LOCATION_ID in .env.local first.");
  process.exit(1);
}
const APPLY = process.argv.includes("--apply");

async function ghl(method, path, { version = "2021-07-28", query, body } = {}) {
  const url = new URL(`https://services.leadconnectorhq.com${path}`);
  for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, String(v));
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Version: version,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${text.slice(0, 300)}`);
  return data;
}

// [merge key, display name, GHL data type]
const FIELDS = [
  ["contact.lead_form", "Lead Form", "TEXT"],
  ["contact.landing_page", "Landing Page", "TEXT"],
  ["contact.referrer", "Referrer", "TEXT"],
  ["contact.lead_event_id", "Lead Event ID", "TEXT"],
  ["contact.qualified", "Qualified", "TEXT"],
  ["contact.locations", "Locations", "TEXT"],
  ["contact.industry", "Industry", "TEXT"],
  ["contact.monthly_ad_budget", "Monthly Ad Budget", "TEXT"],
  ["contact.growth_blocker", "Growth Blocker", "LARGE_TEXT"],
  ["contact.services_running", "Services Running", "TEXT"],
  ["contact.message", "Message", "LARGE_TEXT"],
  ["contact.resource_requested", "Resource Requested", "TEXT"],
  ["contact.first_touch_source", "First Touch Source", "TEXT"],
  ["contact.first_touch_medium", "First Touch Medium", "TEXT"],
  ["contact.first_touch_campaign", "First Touch Campaign", "TEXT"],
  ["contact.first_touch_content", "First Touch Content", "TEXT"],
  ["contact.first_touch_term", "First Touch Term", "TEXT"],
  ["contact.first_touch_landing_page", "First Touch Landing Page", "TEXT"],
  ["contact.first_touch_at", "First Touch At", "TEXT"],
  ["contact.last_touch_source", "Last Touch Source", "TEXT"],
  ["contact.last_touch_medium", "Last Touch Medium", "TEXT"],
  ["contact.last_touch_campaign", "Last Touch Campaign", "TEXT"],
  ["contact.last_touch_content", "Last Touch Content", "TEXT"],
  ["contact.last_touch_term", "Last Touch Term", "TEXT"],
  ["contact.gclid", "GCLID", "TEXT"],
  ["contact.gbraid", "GBRAID", "TEXT"],
  ["contact.wbraid", "WBRAID", "TEXT"],
  ["contact.fbclid", "FBCLID", "TEXT"],
  ["contact.msclkid", "MSCLKID", "TEXT"],
  ["contact.fbc", "FBC", "TEXT"],
  ["contact.fbp", "FBP", "TEXT"],
  ["contact.ga_client_id", "GA Client ID", "TEXT"],
  ["contact.sms_consent_text", "SMS Consent Text", "LARGE_TEXT"],
  ["contact.sms_consent_at", "SMS Consent At", "TEXT"],
];

const { customFields = [] } = await ghl("GET", `/locations/${LOCATION}/customFields`, {
  query: { model: "contact" },
});
const byKey = new Map(customFields.map((f) => [f.fieldKey, f]));
const missing = FIELDS.filter(([key]) => !byKey.has(key));

console.log(`Custom fields: ${FIELDS.length - missing.length} of ${FIELDS.length} present.`);
for (const [key, name, dataType] of missing) {
  if (!APPLY) {
    console.log(`  missing ${key} ("${name}", ${dataType})`);
    continue;
  }
  const created = await ghl("POST", `/locations/${LOCATION}/customFields`, {
    body: { name, dataType, model: "contact" },
  });
  const field = created.customField ?? created;
  const ok = field.fieldKey === key;
  console.log(`  created ${field.fieldKey}${ok ? "" : `  !! expected ${key}, update lib/ghl-lead.ts`}`);
}

const { pipelines = [] } = await ghl("GET", "/opportunities/pipelines", {
  query: { locationId: LOCATION },
});
console.log("\nPipelines:");
for (const p of pipelines) {
  console.log(`  ${p.name} (${p.id}): ${p.stages.map((s) => s.name).join(" > ")}`);
}
if (!pipelines.some((p) => p.name.trim().toLowerCase() === "website leads")) {
  console.log('  !! no "Website Leads" pipeline yet (create it in GHL: New Lead > Contacted > Call Booked > Showed > Proposal Sent > Won > Lost > Nurture)');
}

const { calendars = [] } = await ghl("GET", "/calendars/", {
  version: "2021-04-15",
  query: { locationId: LOCATION },
});
console.log("\nCalendars:");
for (const c of calendars) {
  console.log(`  ${c.name} (${c.id}) ${c.isActive === false ? "inactive" : "active"}`);
}

if (!APPLY && missing.length) console.log("\nRun with --apply to create the missing fields.");
