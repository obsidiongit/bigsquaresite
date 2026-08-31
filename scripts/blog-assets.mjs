/* Blog asset wiring, zero manual steps (Brad, 2026-08-30: "I'm not
   gonna manually crop any of this").

   Drop RAW files, run `npm run blog:assets`, done:

   - assets/blog-covers/<slot-id>.png|jpg|webp
       A cover generation exactly as downloaded (any size, uncropped).
       File name = the slot id from the post frontmatter, e.g.
       blog-cover-agency-7-numbers.png. The script crops to 2:1
       ANCHORED TO THE TOP (GPT Image puts the FIG stamp at the top
       edge; a center crop cuts it off, blog-plan.md 2c), resizes to
       max 1600px wide, and writes public/media/<slot-id>.webp.

   - assets/team/<first-name>.jpg|png|webp
       A headshot as shot (any size). First name maps to the
       blog-author-<first> slot in lib/blog-authors.ts; unknown names
       are skipped with a warning so a stray file can never invent an
       author. Square smart crop (sharp "attention"), 480px,
       public/media/blog-author-<first>.webp.

   Then it rewrites the AUTO-MANAGED block in lib/asset-files.ts from
   whatever blog-* files exist in public/media/, so the MediaSlot
   placeholders swap to real images with no hand edits. Idempotent:
   unchanged sources are skipped, the block always mirrors disk.

   Uses the sharp copy Next already ships (PROJECT_REQUIREMENTS.md);
   no separate install.

   PRECEDENCE (2026-08-30, the HTML/CSS figure pivot): if a slot has a
   figure source in scripts/blog-figures/figures/<slot-id>.html, the
   renderer (`npm run blog:figures`) OWNS that slot. A raw drop in
   assets/blog-covers/ for the same slot is skipped with a warning so
   the two pipelines never fight over public/media/<slot-id>.webp.
   Raw drops remain the path for photos and screenshots only. */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error("blog-assets: sharp not found in node_modules; run npm install");
  process.exit(1);
}

const ROOT = process.cwd();
const COVERS_SRC = path.join(ROOT, "assets", "blog-covers");
const FIGURES_SRC = path.join(ROOT, "scripts", "blog-figures", "figures");
const TEAM_SRC = path.join(ROOT, "assets", "team");
const OUT_DIR = path.join(ROOT, "public", "media");
const ASSET_TS = path.join(ROOT, "lib", "asset-files.ts");
const AUTHORS_TS = path.join(ROOT, "lib", "blog-authors.ts");
const EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const BEGIN = "  // AUTO-MANAGED by scripts/blog-assets.mjs (blog covers + headshots); do not edit inside";
const END = "  // END AUTO-MANAGED";

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => EXTS.has(path.extname(f).toLowerCase()))
    .map((f) => path.join(dir, f));
}

function fresh(src, out) {
  return fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs;
}

async function processCover(src) {
  const slot = path.basename(src, path.extname(src)).toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slot)) {
    console.warn(`covers: skipping "${path.basename(src)}" (name must be the slot id, lowercase letters/numbers/hyphens)`);
    return;
  }
  if (!slot.startsWith("blog-cover-") && !slot.startsWith("blog-fig-")) {
    console.warn(`covers: "${slot}" does not start with blog-cover-/blog-fig-; wiring it anyway, check the frontmatter matches`);
  }
  if (fs.existsSync(path.join(FIGURES_SRC, `${slot}.html`))) {
    console.warn(`covers: skipping "${path.basename(src)}": the figure renderer owns ${slot} (scripts/blog-figures/figures/${slot}.html exists; delete one source or the other)`);
    return;
  }
  const out = path.join(OUT_DIR, `${slot}.webp`);
  if (fresh(src, out)) {
    console.log(`covers: ${slot} up to date`);
    return;
  }
  const img = sharp(src);
  const meta = await img.metadata();
  const { width, height } = meta;
  let extract;
  if (width / height >= 2) {
    const w = Math.floor(height * 2);
    extract = { left: Math.floor((width - w) / 2), top: 0, width: w, height };
  } else {
    /* top-anchored: keep the FIG stamp (blog-plan 2c crop rule) */
    const h = Math.floor(width / 2);
    extract = { left: 0, top: 0, width, height: h };
  }
  await img
    .extract(extract)
    .resize({ width: Math.min(extract.width, 1600), withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(out);
  console.log(`covers: wrote public/media/${slot}.webp (${extract.width}x${extract.height} -> 2:1)`);
}

async function processHeadshot(src, authorsSource) {
  const base = path.basename(src, path.extname(src)).toLowerCase();
  const first = base.split(/[^a-z]/)[0];
  const slot = `blog-author-${first}`;
  if (!authorsSource.includes(`"${slot}"`)) {
    console.warn(`team: skipping "${path.basename(src)}" (no "${slot}" slot in lib/blog-authors.ts)`);
    return;
  }
  const out = path.join(OUT_DIR, `${slot}.webp`);
  if (fresh(src, out)) {
    console.log(`team: ${slot} up to date`);
    return;
  }
  await sharp(src)
    .resize(480, 480, { fit: "cover", position: "attention" })
    .webp({ quality: 82 })
    .toFile(out);
  console.log(`team: wrote public/media/${slot}.webp`);
}

/* Shared with scripts/blog-figures/render.mjs, which imports this so
   the AUTO-MANAGED block has exactly one writer. */
export function rewriteAssetFiles() {
  const rows = fs
    .readdirSync(OUT_DIR)
    .filter((f) => /^blog-(cover|fig|author)-[a-z0-9-]+\.(webp|jpg|jpeg|png)$/.test(f))
    .sort()
    .map((f) => `  "${f.replace(/\.[a-z]+$/, "")}": { src: "/media/${f}" },`);
  const block = [BEGIN, ...rows, END].join("\n");

  let ts = fs.readFileSync(ASSET_TS, "utf8");
  const begin = ts.indexOf(BEGIN);
  if (begin !== -1) {
    const end = ts.indexOf(END, begin);
    if (end === -1) throw new Error("asset-files: BEGIN marker without END");
    ts = ts.slice(0, begin) + block + ts.slice(end + END.length);
  } else {
    const close = ts.lastIndexOf("};");
    if (close === -1) throw new Error("asset-files: could not find the ASSET_FILES closing brace");
    ts = `${ts.slice(0, close)}${block}\n${ts.slice(close)}`;
  }
  fs.writeFileSync(ASSET_TS, ts);
  console.log(`asset-files: managed block now has ${rows.length} row(s)`);
}

const invokedDirectly =
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href.toLowerCase() ===
    import.meta.url.toLowerCase();

if (invokedDirectly) {
  const covers = listImages(COVERS_SRC);
  const heads = listImages(TEAM_SRC);
  if (covers.length === 0 && heads.length === 0) {
    console.log("blog-assets: nothing in assets/blog-covers/ or assets/team/ yet");
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const authorsSource = fs.readFileSync(AUTHORS_TS, "utf8");
  for (const src of covers) await processCover(src);
  for (const src of heads) await processHeadshot(src, authorsSource);
  rewriteAssetFiles();
  console.log("blog-assets: done");
}
