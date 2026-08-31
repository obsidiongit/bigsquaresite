import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MediaSlot } from "@/components/shared/MediaSlot";
import { Chip } from "@/components/shared/mono";

/* Dev-only contact sheet for the asset fill workstream (asset-fill-plan.md,
   session 1). Walks project-guidelines/asset-manifest.md and shows, per slot:
   status, OWNER lane, the live placeholder (or filled image), and every
   candidate found in assets/generated/<slot-id>/. The review surface for the
   whole workstream; nothing here ships. notFound() outside development and
   not listed in sitemap.ts, same contract as /dev/styleguide. */

export const metadata: Metadata = {
  title: "Asset contact sheet",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ROOT = process.cwd();
const GENERATED = path.join(ROOT, "assets", "generated");
const MANIFEST = path.join(ROOT, "project-guidelines", "asset-manifest.md");

const MEDIA_EXT = /\.(webp|avif|png|jpe?g|gif|mp4|webm)$/i;
const VIDEO_EXT = /\.(mp4|webm)$/i;

type SlotRow = {
  id: string;
  pages: string;
  placement: string;
  note: string;
  aspect: string;
  owner: string;
  status: string;
};
type HomeRow = { item: string; where: string; needed: string; owner: string; status: string };

function cells(line: string): string[] {
  return line
    .replace(/^\|/, "")
    .replace(/\|\s*$/, "")
    .split("|")
    .map((c) => c.trim());
}

function parseManifest(): { slots: SlotRow[]; home: HomeRow[] } {
  const slots: SlotRow[] = [];
  const home: HomeRow[] = [];
  const lines = fs.readFileSync(MANIFEST, "utf8").split("\n");
  for (const line of lines) {
    if (!line.startsWith("|")) continue;
    const c = cells(line);
    if (c[0].startsWith("---") || c[0] === "Slot id" || c[0] === "Item") continue;
    if (c.length === 7 && c[0].startsWith("`")) {
      slots.push({
        id: c[0].replace(/`/g, ""),
        pages: c[1],
        placement: c[2],
        note: c[3],
        aspect: c[4],
        owner: c[5],
        status: c[6],
      });
    } else if (c.length === 5) {
      home.push({ item: c[0], where: c[1], needed: c[2], owner: c[3], status: c[4] });
    }
  }
  return { slots, home };
}

function cssAspect(aspect: string): string {
  const m = aspect.match(/(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)/);
  return m ? `${m[1]} / ${m[2]}` : "16 / 9";
}

function candidatesFor(id: string): { files: string[]; notes: string | null } {
  const dir = path.join(GENERATED, id);
  if (!fs.existsSync(dir)) return { files: [], notes: null };
  const files = fs
    .readdirSync(dir)
    .filter((f) => MEDIA_EXT.test(f))
    .sort();
  const notesPath = path.join(dir, "notes.md");
  const notes = fs.existsSync(notesPath) ? fs.readFileSync(notesPath, "utf8") : null;
  return { files, notes };
}

const OWNER_ORDER = ["LANE-1-CODE", "LANE-2-AI", "DESIGNER", "REAL-ONLY"] as const;

const OWNER_TONE: Record<string, string> = {
  "LANE-1-CODE": "text-acc border-acc/40",
  "LANE-2-AI": "text-acc2 border-acc2/40",
  DESIGNER: "text-mid border-line",
  "REAL-ONLY": "text-mid border-line",
};

export default function AssetContactSheet() {
  if (process.env.NODE_ENV !== "development") notFound();

  const { slots, home } = parseManifest();
  const withCandidates = slots.map((s) => ({ ...s, ...candidatesFor(s.id) }));
  const counts = OWNER_ORDER.map((o) => ({
    owner: o,
    empty: slots.filter((s) => s.owner === o && s.status.startsWith("EMPTY")).length,
    filled: slots.filter((s) => s.owner === o && s.status.startsWith("FILLED")).length,
  }));
  const candidateTotal = withCandidates.reduce((n, s) => n + s.files.length, 0);

  return (
    <main className="min-h-screen bg-paper px-6 py-12 text-ink md:px-12">
      <header className="mb-10 max-w-[72ch]">
        <p className="font-mono text-mono-sm uppercase text-mid">Dev / Asset contact sheet</p>
        <h1 className="mt-2 font-display text-3xl">Every slot, every candidate</h1>
        <p className="mt-3 text-sm text-mid">
          Reads project-guidelines/asset-manifest.md and assets/generated/ on every refresh.
          Candidates never ship from here: a winner is copied to public/media/ + one
          lib/asset-files.ts row, on Brad&apos;s OK only.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {counts.map((c) => (
            <Chip key={c.owner} className={OWNER_TONE[c.owner]}>
              {c.owner}: {c.empty} empty{c.filled ? ` / ${c.filled} filled` : ""}
            </Chip>
          ))}
          <Chip className="text-ink border-ink/30">{candidateTotal} candidates on disk</Chip>
        </div>
      </header>

      {OWNER_ORDER.map((owner) => {
        const group = withCandidates.filter((s) => s.owner === owner);
        if (group.length === 0) return null;
        return (
          <section key={owner} className="mb-14">
            <h2 className="mb-4 border-b border-line pb-2 font-mono text-mono-sm uppercase text-mid">
              {owner} ({group.length})
            </h2>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {group.map((s) => (
                <article key={s.id} className="rounded-[16px] border border-line bg-surf/50 p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <code className="font-mono text-xs font-semibold">{s.id}</code>
                    <Chip
                      className={
                        s.status.startsWith("FILLED")
                          ? "text-acc border-acc/40"
                          : "text-mid border-line"
                      }
                    >
                      {s.status.startsWith("FILLED") ? "FILLED" : "EMPTY"}
                    </Chip>
                  </div>
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-mid">
                    {s.pages}
                  </p>
                  <p className="mb-3 text-xs text-mid">
                    {s.note} <span className="text-ink/50">({s.aspect})</span>
                  </p>
                  <MediaSlot id={s.id} note={s.note} alt={s.note} aspect={cssAspect(s.aspect)} />
                  {s.files.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-2 font-mono text-[11px] uppercase text-mid">
                        Candidates ({s.files.length})
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {s.files.map((f) =>
                          VIDEO_EXT.test(f) ? (
                            <video
                              key={f}
                              src={`/dev/assets/file/${s.id}/${f}`}
                              controls
                              muted
                              className="w-full rounded-[8px] border border-line"
                            />
                          ) : (
                            <a
                              key={f}
                              href={`/dev/assets/file/${s.id}/${f}`}
                              target="_blank"
                              className="block"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`/dev/assets/file/${s.id}/${f}`}
                                alt={`${s.id} candidate ${f}`}
                                className="w-full rounded-[8px] border border-line"
                              />
                              <span className="mt-1 block truncate font-mono text-[10px] text-mid">
                                {f}
                              </span>
                            </a>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                  {s.notes && (
                    <details className="mt-3">
                      <summary className="cursor-pointer font-mono text-[11px] uppercase text-mid">
                        notes.md
                      </summary>
                      <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-[8px] border border-line bg-paper p-3 text-[11px] leading-relaxed">
                        {s.notes}
                      </pre>
                    </details>
                  )}
                </article>
              ))}
            </div>
          </section>
        );
      })}

      {home.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-4 border-b border-line pb-2 font-mono text-mono-sm uppercase text-mid">
            Homepage media (not MediaSlot ids; each fills via its own module)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="font-mono uppercase text-mid">
                <tr className="border-b border-line">
                  <th className="py-2 pr-4">Item</th>
                  <th className="py-2 pr-4">Lands in</th>
                  <th className="py-2 pr-4">Needed</th>
                  <th className="py-2 pr-4">Owner</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {home.map((h) => (
                  <tr key={h.item} className="border-b border-line/60 align-top">
                    <td className="py-2 pr-4 font-semibold">{h.item}</td>
                    <td className="py-2 pr-4 font-mono">{h.where.replace(/`/g, "")}</td>
                    <td className="py-2 pr-4 text-mid">{h.needed}</td>
                    <td className="py-2 pr-4 font-mono">{h.owner}</td>
                    <td className="py-2 font-mono">{h.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
