/* The blog figure renderer (Brad's pivot, 2026-08-30: "Claude builds
   each figure as an HTML/CSS element, screenshots it, and that render
   IS the asset"). One agent end to end: the writer authors a small
   self-contained HTML file per figure with the site's real fonts and
   tokens, this script screenshots it at 2x, and the existing MediaSlot
   wiring picks it up. No image model, no manual cropping.

   Usage: `npm run blog:figures` (all figures) or
          `npm run blog:figures -- <slot-id> [...]` (just those).

   For each scripts/blog-figures/figures/<slot-id>.html:
     1. open it as file:// at the viewport its
        `<meta name="figure-viewport" content="WxH">` declares
        (defaults: 1600x800 for blog-cover-*, 1200x675 for blog-fig-*),
        deviceScaleFactor 2, wait for fonts;
     2. screenshot PNG -> sharp -> webp at public/media/<slot-id>.webp
        (exact-size render, nothing to crop);
     3. rewrite the AUTO-MANAGED block in lib/asset-files.ts via
        blog-assets.mjs so the block has exactly one writer.
   Skips figures whose webp is newer than their HTML; delete the webp
   or touch the HTML to force a re-render.

   PRECEDENCE: a slot with a figure HTML here belongs to this renderer;
   blog-assets.mjs skips raw drops for it (see the note there). Raw
   drops in assets/blog-covers/ stay the path for photos/screenshots.

   Playwright is deliberately NOT in package.json (dependency rule,
   PROJECT_REQUIREMENTS.md). Resolution order:
     1. BLOG_FIGURES_PW env var: a path to the playwright package dir,
        or to a directory whose node_modules contains it (a Claude
        session points this at its scratchpad install);
     2. a normal require("playwright") from this file upward (the cron
        job installs it with `npm i --no-save playwright` +
        `npx playwright install chromium` in its own step, so it lands
        in the repo's node_modules without touching package.json).
   Browser: PW_CHANNEL (e.g. "chrome") when set; otherwise Playwright's
   own chromium, falling back to channel "chrome" if none is
   downloaded. Fonts load from public/fonts/ via relative file://
   paths, so no server and no network are needed. */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { rewriteAssetFiles } from "../blog-assets.mjs";

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const FIGURES_DIR = path.join(ROOT, "scripts", "blog-figures", "figures");
const OUT_DIR = path.join(ROOT, "public", "media");

let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error("blog-figures: sharp not found in node_modules; run npm install");
  process.exit(1);
}

function resolvePlaywright() {
  const hint = process.env.BLOG_FIGURES_PW;
  const candidates = [];
  if (hint) {
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
    "blog-figures: playwright not found. Either set BLOG_FIGURES_PW to a directory " +
      "containing a playwright install (a session scratchpad works), or install it " +
      "without saving: npm i --no-save playwright && npx playwright install chromium",
  );
  process.exit(1);
}

async function launchBrowser(chromium) {
  if (process.env.PW_CHANNEL) {
    return chromium.launch({ channel: process.env.PW_CHANNEL });
  }
  try {
    return await chromium.launch();
  } catch {
    /* no downloaded chromium; use the installed Chrome */
    return chromium.launch({ channel: "chrome" });
  }
}

function viewportFor(file, html) {
  const meta = html.match(/name="figure-viewport"\s+content="(\d+)x(\d+)"/);
  if (meta) return { width: Number(meta[1]), height: Number(meta[2]) };
  const slot = path.basename(file, ".html");
  if (slot.startsWith("blog-cover-")) return { width: 1600, height: 800 };
  return { width: 1200, height: 675 };
}

const only = process.argv.slice(2).map((s) => s.replace(/\.html$/, ""));
const all = fs.existsSync(FIGURES_DIR)
  ? fs.readdirSync(FIGURES_DIR).filter((f) => f.endsWith(".html"))
  : [];
const files = only.length ? all.filter((f) => only.includes(f.replace(/\.html$/, ""))) : all;

if (files.length === 0) {
  console.log("blog-figures: no figure HTML files matched in scripts/blog-figures/figures/");
  process.exit(only.length ? 1 : 0);
}
for (const name of only) {
  if (!all.includes(`${name}.html`)) {
    console.error(`blog-figures: no figures/${name}.html`);
    process.exit(1);
  }
}

const stale = files.filter((f) => {
  const out = path.join(OUT_DIR, `${f.replace(/\.html$/, "")}.webp`);
  return !(
    fs.existsSync(out) &&
    fs.statSync(out).mtimeMs >= fs.statSync(path.join(FIGURES_DIR, f)).mtimeMs
  );
});
for (const f of files) {
  if (!stale.includes(f)) console.log(`figures: ${f.replace(/\.html$/, "")} up to date`);
}

if (stale.length > 0) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const { chromium } = resolvePlaywright();
  const browser = await launchBrowser(chromium);
  try {
    for (const file of stale) {
      const slot = file.replace(/\.html$/, "");
      const src = path.join(FIGURES_DIR, file);
      const html = fs.readFileSync(src, "utf8");
      const viewport = viewportFor(file, html);
      const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
      await page.goto(pathToFileURL(src).href);
      await page.evaluate(() => document.fonts.ready);
      const png = await page.screenshot({ type: "png" });
      await page.close();
      const out = path.join(OUT_DIR, `${slot}.webp`);
      await sharp(png).webp({ quality: 90 }).toFile(out);
      const kb = Math.round(fs.statSync(out).size / 1024);
      console.log(
        `figures: wrote public/media/${slot}.webp (${viewport.width * 2}x${viewport.height * 2}, ${kb}KB)`,
      );
      if (kb > 250) {
        console.warn(`figures: ${slot}.webp is over the ~250KB budget; simplify the figure`);
      }
    }
  } finally {
    await browser.close();
  }
}

rewriteAssetFiles();
console.log("blog-figures: done");
