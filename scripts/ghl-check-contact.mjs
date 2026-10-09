// Read one contact back from GHL, the way the site wrote it.
//
//   node scripts/ghl-check-contact.mjs qa+test@bigsquaremarketing.com
//
// Prints standard fields, tags, every custom field by merge key, the latest
// note, and the contact's opportunities. Reads GHL_API_KEY and
// GHL_LOCATION_ID from .env.local; the token is never printed.

import { readFileSync } from "node:fs";

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/ghl-check-contact.mjs <email>");
  process.exit(1);
}
const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z0-9_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);
const LOC = env.GHL_LOCATION_ID;
const H = {
  Authorization: `Bearer ${env.GHL_API_KEY}`,
  Version: "2021-07-28",
  Accept: "application/json",
};
const get = async (path) => {
  const r = await fetch(`https://services.leadconnectorhq.com${path}`, { headers: H });
  if (!r.ok) throw new Error(`${path} -> ${r.status} ${(await r.text()).slice(0, 200)}`);
  return r.json();
};

const { contact } = await get(
  `/contacts/search/duplicate?locationId=${LOC}&email=${encodeURIComponent(email)}`,
);
if (!contact) {
  console.log(`No contact for ${email}`);
  process.exit(0);
}
const full = (await get(`/contacts/${contact.id}`)).contact;
const { customFields = [] } = await get(`/locations/${LOC}/customFields?model=contact`);
const keyById = Object.fromEntries(customFields.map((f) => [f.id, f.fieldKey]));

console.log({
  id: full.id,
  name: [full.firstName, full.lastName].filter(Boolean).join(" "),
  email: full.email,
  phone: full.phone,
  companyName: full.companyName,
  website: full.website,
  source: full.source,
  tags: full.tags,
});
console.log("\nCustom fields:");
for (const cf of full.customFields ?? []) console.log(`  ${keyById[cf.id] ?? cf.id} = ${cf.value}`);

const { notes = [] } = await get(`/contacts/${contact.id}/notes`);
console.log(`\nNotes: ${notes.length}. Latest:\n${notes[0]?.body ?? "(none)"}`);

const { pipelines = [] } = await get(`/opportunities/pipelines?locationId=${LOC}`);
const stageName = Object.fromEntries(pipelines.flatMap((p) => p.stages.map((s) => [s.id, `${p.name} / ${s.name}`])));
const { opportunities = [] } = await get(
  `/opportunities/search?location_id=${LOC}&contact_id=${contact.id}`,
);
console.log("\nOpportunities:");
for (const o of opportunities) console.log(`  ${o.name} | ${stageName[o.pipelineStageId] ?? o.pipelineStageId} | ${o.status}`);
