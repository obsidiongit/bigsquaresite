// A dev server that can't take the machine down with it.
//   npm run dev:safe            webpack, 4 GB heap cap, below-normal CPU priority
//   npm run dev:safe -- --turbo Turbopack instead, evicting its cache from memory after every save
//   --heap=6144                 raise or lower the cap (MB); --port=3001 for another port
//
// Why: plain `next dev` hands its server process a heap ceiling of HALF the machine's RAM
// (next/dist/cli/next-dev.js), and Turbopack's native memory sits on top of that with no ceiling at
// all. Webpack lives entirely inside the Node heap, so the cap here is a real one: if it is hit, the
// dev server stops, not the computer. Below-normal priority (inherited by every process `next`
// spawns) keeps the desktop and the browser responsive while it compiles.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import os from "node:os";

const argv = process.argv.slice(2);
const flag = (name) => argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const turbo = argv.includes("--turbo");
const heap = Number(flag("heap")) || 4096;
const port = flag("port") || "3000";

try {
  os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
} catch {}

const nodeOptions = [process.env.NODE_OPTIONS, `--max-old-space-size=${heap}`].filter(Boolean).join(" ");
const next = createRequire(import.meta.url).resolve("next/dist/bin/next");
const args = [next, "dev", "-p", port, ...(turbo ? [] : ["--webpack"])];

console.log(`dev:safe  ${turbo ? "turbopack" : "webpack"}, heap cap ${heap} MB, below-normal priority, port ${port}`);

const child = spawn(process.execPath, args, {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_OPTIONS: nodeOptions,
    BIGSQUARE_SAFE_DEV: "1", // next.config.ts turns on the low-memory options when this is set
    NEXT_TELEMETRY_DISABLED: "1",
  },
});

for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
child.on("exit", (code) => process.exit(code ?? 0));
