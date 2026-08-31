/* The asset studio renderer (asset-fill-plan.md Lane 1, session 1
   2026-08-31): the blog-figures pattern grown into a general interior
   asset renderer. A slot asset is authored as a self-contained HTML
   file at the site's real tokens and fonts, screenshotted at 2x, and
   the render lands as a CANDIDATE in assets/generated/<slot-id>/,
   never in public/media/ (promotion is Brad's call on /dev/assets).

   Usage: node scripts/asset-studio/render.mjs [slot-id ...] [--new]
          (npm run assets:studio)

   For each scripts/asset-studio/slots/<slot-id>.html:
     1. open as file:// at the viewport its
        `<meta name="figure-viewport" content="WxH">` declares
        (default 1680x720, the ~21:9 band), deviceScaleFactor 2,
        wait for fonts;
     2. screenshot PNG -> sharp -> webp at
        assets/generated/<slot-id>/code-v<N>.webp. Default N: the
        highest existing code-v (iterate in place), or 1. With --new:
        highest + 1 (archive the old, start a fresh candidate);
     3. stamp/refresh the version's line in the folder's notes.md.

   lib/asset-files.ts is NOT touched here. Playwright is deliberately
   NOT in package.json (PROJECT_REQUIREMENTS.md rule): resolution and
   browser channel follow scripts/blog-figures/render.mjs exactly
   (ASSET_STUDIO_PW or BLOG_FIGURES_PW env hint, then a normal
   require; PW_CHANNEL=chrome uses installed Chrome). */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const SLOTS_DIR = path.join(ROOT, "scripts", "asset-studio", "slots");
const OUT_ROOT = path.join(ROOT, "assets", "generated");

let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error("asset-studio: sharp not found in node_modules; run npm install");
  process.exit(1);
}

function resolvePlaywright() {
  const hints = [process.env.ASSET_STUDIO_PW, process.env.BLOG_FIGURES_PW].filter(Boolean);
  const candidates = [];
  for (const hint of hints) {
    candidates.push(
      hint,
      path.join(hint, "node_modules", "playwright"),
      path.join(hint, "playwright"),
    );
  }
  candidates.push("playwright");
  for (const c of candidates) {
    try {
      return require(c);
    } catch {}
  }
  console.error(
    "asset-studio: playwright not found. Set ASSET_STUDIO_PW (or BLOG_FIGURES_PW) to a " +
      "directory containing a playwright install, or: npm i --no-save playwright",
  );
  process.exit(1);
}

async function launchBrowser(chromium) {
  if (process.env.PW_CHANNEL) return chromium.launch({ channel: process.env.PW_CHANNEL });
  try {
    return await chromium.launch();
  } catch {
    return chromium.launch({ channel: "chrome" });
  }
}

function viewportFor(html) {
  const meta = html.match(/name="figure-viewport"\s+content="(\d+)x(\d+)"/);
  if (meta) return { width: Number(meta[1]), height: Number(meta[2]) };
  return { width: 1680, height: 720 };
}

function nextVersion(dir, bump) {
  if (!fs.existsSync(dir)) return 1;
  const versions = fs
    .readdirSync(dir)
    .map((f) => f.match(/^code-v(\d+)\.webp$/))
    .filter(Boolean)
    .map((m) => Number(m[1]));
  if (versions.length === 0) return 1;
  const top = Math.max(...versions);
  return bump ? top + 1 : top;
}

function stampNotes(dir, slot, version, viewport) {
  const notesPath = path.join(dir, "notes.md");
  const line = `- code-v${version}: rendered ${new Date().toISOString().slice(0, 10)} from scripts/asset-studio/slots/${slot}.html at ${viewport.width * 2}x${viewport.height * 2} (LANE-1-CODE)`;
  let body = fs.existsSync(notesPath)
    ? fs.readFileSync(notesPath, "utf8")
    : `# ${slot}: candidates\n\n`;
  const marker = new RegExp(`^- code-v${version}:.*$`, "m");
  body = marker.test(body) ? body.replace(marker, line) : body.trimEnd() + "\n" + line + "\n";
  fs.writeFileSync(notesPath, body);
}

const args = process.argv.slice(2);
const bump = args.includes("--new");
const only = args.filter((a) => a !== "--new").map((s) => s.replace(/\.html$/, ""));

const all = fs.existsSync(SLOTS_DIR)
  ? fs.readdirSync(SLOTS_DIR).filter((f) => f.endsWith(".html"))
  : [];
const files = only.length ? all.filter((f) => only.includes(f.replace(/\.html$/, ""))) : all;

for (const name of only) {
  if (!all.includes(`${name}.html`)) {
    console.error(`asset-studio: no slots/${name}.html`);
    process.exit(1);
  }
}
if (files.length === 0) {
  console.log("asset-studio: no slot HTML files in scripts/asset-studio/slots/");
  process.exit(0);
}

const { chromium } = resolvePlaywright();
const browser = await launchBrowser(chromium);
try {
  for (const file of files) {
    const slot = file.replace(/\.html$/, "");
    const src = path.join(SLOTS_DIR, file);
    const html = fs.readFileSync(src, "utf8");
    const viewport = viewportFor(html);
    const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
    await page.goto(pathToFileURL(src).href);
    await page.evaluate(() => document.fonts.ready);
    const png = await page.screenshot({ type: "png" });
    await page.close();
    const dir = path.join(OUT_ROOT, slot);
    fs.mkdirSync(dir, { recursive: true });
    const version = nextVersion(dir, bump);
    const out = path.join(dir, `code-v${version}.webp`);
    await sharp(png).webp({ quality: 90 }).toFile(out);
    stampNotes(dir, slot, version, viewport);
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(
      `asset-studio: wrote assets/generated/${slot}/code-v${version}.webp (${viewport.width * 2}x${viewport.height * 2}, ${kb}KB)`,
    );
    if (kb > 500) console.warn(`asset-studio: ${slot} over the ~500KB budget; simplify`);
  }
} finally {
  await browser.close();
}
console.log("asset-studio: done");
