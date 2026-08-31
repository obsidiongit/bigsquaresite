/* Lane 2 stills through the Codex CLI (asset-fill-plan.md; hookup proven
   session 1, 2026-08-31). Non-interactive: the prompt is piped on stdin
   (the npm ps1 shim mangles multi-line arguments, so ALWAYS stdin), the
   world-bible reference images ride -i, and the agent saves the PNG into
   the slot's candidate folder itself (workspace-write sandbox; outputs
   also archive under ~/.codex/generated_images/<session>/, scanned as a
   fallback). Post-process: center-crop to the slot aspect -> gen-v<N>.webp
   beside the full frame, notes.md stamped. Nothing touches public/media/.

   Usage:
     node scripts/asset-studio/codex-still.mjs <slot-id> <prompt-file>
          [--aspect W:H] [--ref path ...]
   The prompt file holds ONLY the image direction (world-bible BASE +
   PLACE + subject + NEGATIVE); the save instruction is appended here so
   every run lands in the right folder. Default ref: the brand mark.
   Codex stills are free on Brad's plan: generate wide, cull hard. */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const OUT_ROOT = path.join(ROOT, "assets", "generated");

let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error("codex-still: sharp not found in node_modules; run npm install");
  process.exit(1);
}

const args = process.argv.slice(2);
const positional = [];
const refs = [];
let aspect = "21:9";
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--aspect") aspect = args[++i];
  else if (args[i] === "--ref") refs.push(args[++i]);
  else positional.push(args[i]);
}
const [slot, promptFile] = positional;
if (!slot || !promptFile) {
  console.error("usage: node scripts/asset-studio/codex-still.mjs <slot-id> <prompt-file> [--aspect W:H] [--ref path ...]");
  process.exit(1);
}
if (refs.length === 0) refs.push("assets/generated/_world-refs/bigsquare-mark.png");
const ratio = (() => {
  const m = aspect.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (!m) {
    console.error(`codex-still: bad --aspect ${aspect}`);
    process.exit(1);
  }
  return Number(m[1]) / Number(m[2]);
})();

const dir = path.join(OUT_ROOT, slot);
fs.mkdirSync(dir, { recursive: true });
const version =
  1 +
  Math.max(
    0,
    ...fs
      .readdirSync(dir)
      .map((f) => f.match(/^gen-v(\d+)/))
      .filter(Boolean)
      .map((m) => Number(m[1])),
  );
const fullRel = `assets/generated/${slot}/gen-v${version}-full.png`;

const prompt =
  fs.readFileSync(promptFile, "utf8").trim() +
  `\n\nTHEN: save the generated image in this workspace as ${fullRel} (the folder exists). Do not modify any other file, do not run git commands. Reply with only the absolute path of the saved file.`;

const before = Date.now();
const cli = os.platform() === "win32" ? "codex.cmd" : "codex";
const run = spawnSync(
  cli,
  ["exec", "-s", "workspace-write", ...refs.flatMap((r) => ["-i", r]), "-"],
  { input: prompt, encoding: "utf8", cwd: ROOT, shell: false, timeout: 15 * 60 * 1000 },
);
if (run.error) {
  console.error("codex-still: failed to run codex:", run.error.message);
  process.exit(1);
}
process.stdout.write((run.stdout || "").split("\n").slice(-6).join("\n") + "\n");

const fullAbs = path.join(ROOT, fullRel);
if (!fs.existsSync(fullAbs)) {
  /* fallback: newest png in ~/.codex/generated_images newer than the run start */
  const genRoot = path.join(os.homedir(), ".codex", "generated_images");
  let newest = null;
  if (fs.existsSync(genRoot)) {
    for (const sess of fs.readdirSync(genRoot)) {
      const sdir = path.join(genRoot, sess);
      if (!fs.statSync(sdir).isDirectory()) continue;
      for (const f of fs.readdirSync(sdir).filter((f) => f.endsWith(".png"))) {
        const p = path.join(sdir, f);
        const t = fs.statSync(p).mtimeMs;
        if (t >= before && (!newest || t > newest.t)) newest = { p, t };
      }
    }
  }
  if (!newest) {
    console.error(`codex-still: no output at ${fullRel} and nothing new in generated_images`);
    process.exit(1);
  }
  fs.copyFileSync(newest.p, fullAbs);
  console.log(`codex-still: recovered from ${newest.p}`);
}

const meta = await sharp(fullAbs).metadata();
const cropH = Math.min(meta.height, Math.round(meta.width / ratio));
const cropW = Math.min(meta.width, Math.round(cropH * ratio));
const out = path.join(dir, `gen-v${version}.webp`);
await sharp(fullAbs)
  .extract({
    left: Math.floor((meta.width - cropW) / 2),
    top: Math.floor((meta.height - cropH) / 2),
    width: cropW,
    height: cropH,
  })
  .webp({ quality: 92 })
  .toFile(out);

const notesPath = path.join(dir, "notes.md");
const stamp = `- gen-v${version}: Codex still ${new Date().toISOString().slice(0, 10)}, prompt in ${path.relative(ROOT, promptFile).replace(/\\/g, "/")}, refs: ${refs.join(", ")}, ${cropW}x${cropH} ${aspect} crop of ${meta.width}x${meta.height} (LANE-2-AI)`;
const body = fs.existsSync(notesPath) ? fs.readFileSync(notesPath, "utf8") : `# ${slot}: candidates\n\n`;
fs.writeFileSync(notesPath, body.trimEnd() + "\n" + stamp + "\n");
console.log(`codex-still: wrote ${path.relative(ROOT, out).replace(/\\/g, "/")} (${Math.round(fs.statSync(out).size / 1024)}KB)`);
