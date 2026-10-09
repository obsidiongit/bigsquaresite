// Launch audit in a real browser: every page from sitemap.xml + the funnels, with the shipped toggle
// defaults. Reports [PLACEHOLDER] text a visitor can SEE, unsourced stat blocks still showing, console
// errors, and horizontal overflow at phone width.  Usage: node scripts/launch-audit.mjs [base]
// Needs playwright resolvable (run from a folder that has it, or set PW_FROM to a package.json).
import { createRequire } from "module";
const require = createRequire(process.env.PW_FROM || import.meta.url);
const { chromium } = require("playwright");

const base = (process.argv[2] || "http://127.0.0.1:4801").replace(/\/$/, "");
const sm = await fetch(base + "/sitemap.xml").then((r) => r.text());
const paths = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
paths.push("/go/audit/", "/team/", "/results/on-location/");

const browser = await chromium.launch();
let problems = 0;
for (const view of [{ width: 1440, height: 900 }, { width: 390, height: 844, mobile: true }]) {
  const ctx = await browser.newContext({ viewport: { width: view.width, height: view.height }, isMobile: !!view.mobile, hasTouch: !!view.mobile });
  // strict: launch-safe hiding OFF (?markers on every URL), so any marker left in the source shows up here
  const page = await ctx.newPage();
  for (const p of [...new Set(paths)]) {
    const errs = [];
    page.removeAllListeners("pageerror");
    page.removeAllListeners("console");
    page.on("pageerror", (e) => errs.push(e.message.slice(0, 160)));
    page.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));
    await page.goto(base + p + "?markers", { waitUntil: "load", timeout: 60000 }).catch((e) => errs.push("load: " + e.message));
    await page.waitForTimeout(2500);
    const r = await page.evaluate(() => {
      const seen = [];
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const n = w.currentNode;
        if (!n.nodeValue.includes("[PLACEHOLDER")) continue;
        const el = n.parentElement;
        if (el.closest("script, style, [data-lab-panel]")) continue;
        const cs = el.checkVisibility?.({ checkOpacity: false, checkVisibilityCSS: true });
        if (cs) seen.push(n.nodeValue.trim().slice(0, 70));
      }
      const gates = [...document.querySelectorAll("[data-launch-gate]")].filter((e) => e.checkVisibility()).length;
      // an empty MediaSlot shows its ghost square + "Asset" chip
      const assets = [...document.querySelectorAll("span, p")].filter((e) => e.children.length === 0 && e.textContent.trim() === "Asset" && e.checkVisibility()).length;
      return { seen, gates, assets, overflow: document.documentElement.scrollWidth - window.innerWidth };
    });
    const issues = [];
    if (r.seen.length) issues.push(`visible placeholders: ${r.seen.join(" | ")}`);
    if (r.assets) issues.push(`${r.assets} empty ASSET photo slot(s)`);
    if (r.gates) issues.push(`${r.gates} unsourced stat block(s) visible`);
    if (r.overflow > 1) issues.push(`horizontal overflow ${r.overflow}px`);
    if (errs.length) issues.push(`errors: ${[...new Set(errs)].join(" | ")}`);
    if (issues.length) {
      problems++;
      console.log(`[${view.width}] ${p}\n   ${issues.join("\n   ")}`);
    }
  }
  await ctx.close();
}
console.log(problems ? `${problems} page/view combos with issues` : "clean: no visible placeholders, gates, overflow or errors");
await browser.close();
