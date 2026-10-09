// Launch check: crawls every internal page reachable from the homepage + sitemap.xml on a running
// server and reports status, title, meta description, canonical, h1 count, og:image, broken internal
// links and leftover [PLACEHOLDER] markers.  Usage: node scripts/prod-check.mjs [base]
const base = (process.argv[2] || "http://127.0.0.1:4801").replace(/\/$/, "");
const seen = new Map();
const queue = ["/"];

const sm = await fetch(base + "/sitemap.xml").then((r) => r.text()).catch(() => "");
for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  try {
    queue.push(new URL(m[1]).pathname);
  } catch {}
}

const pick = (re, html) => (html.match(re) || [])[1];
while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.set(path, null);
  const res = await fetch(base + path, { redirect: "manual" }).catch((e) => ({ status: 0, e }));
  const row = { path, status: res.status };
  if (res.status >= 300 && res.status < 400) {
    row.to = res.headers.get("location");
    const to = new URL(row.to, base).pathname;
    if (!seen.has(to)) queue.push(to);
  } else if (res.status === 200 && (res.headers.get("content-type") || "").includes("html")) {
    const html = await res.text();
    row.title = pick(/<title>([^<]*)<\/title>/, html);
    row.desc = pick(/<meta name="description" content="([^"]*)"/, html);
    row.canonical = pick(/<link rel="canonical" href="([^"]*)"/, html);
    row.og = !!pick(/<meta property="og:image" content="([^"]*)"/, html);
    row.robots = pick(/<meta name="robots" content="([^"]*)"/, html);
    row.h1 = (html.match(/<h1[\s>]/g) || []).length;
    row.placeholders = (html.match(/\[PLACEHOLDER/g) || []).length;
    for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
      const p = m[1];
      if (/\.(png|jpe?g|webp|svg|ico|xml|txt|mp4|woff2?|css|js)$/.test(p) || p.startsWith("/_next")) continue;
      if (!seen.has(p) && !queue.includes(p)) queue.push(p);
      (row.links ||= new Set()).add(p);
    }
  }
  seen.set(path, row);
}

const rows = [...seen.values()];
const bad = rows.filter((r) => r.status !== 200 && !(r.status >= 300 && r.status < 400));
const pages = rows.filter((r) => r.status === 200 && r.title !== undefined);
console.log(`pages: ${pages.length}, redirects: ${rows.filter((r) => r.to).length}, broken: ${bad.length}`);
for (const r of bad) {
  const from = rows.filter((x) => x.links?.has(r.path)).map((x) => x.path);
  console.log(`BROKEN ${r.status} ${r.path}  <- ${from.slice(0, 4).join(", ")}`);
}
const titles = new Map();
for (const r of pages) {
  const issues = [];
  if (!r.title) issues.push("no title");
  if (!r.desc) issues.push("no description");
  else if (r.desc.length > 165) issues.push(`desc ${r.desc.length} chars`);
  if (r.title && r.title.length > 65) issues.push(`title ${r.title.length} chars`);
  if (!r.canonical) issues.push("no canonical");
  if (!r.og) issues.push("no og:image");
  if (r.h1 !== 1) issues.push(`${r.h1} h1`);
  if (r.placeholders) issues.push(`${r.placeholders} placeholders`);
  if (r.robots?.includes("noindex")) issues.push("noindex");
  if (r.title) titles.set(r.title, [...(titles.get(r.title) || []), r.path]);
  if (issues.length) console.log(`${r.path}: ${issues.join("; ")}`);
}
for (const [t, ps] of titles) if (ps.length > 1) console.log(`DUP TITLE "${t}": ${ps.join(", ")}`);
console.log(`total placeholders: ${pages.reduce((s, r) => s + (r.placeholders || 0), 0)}`);
