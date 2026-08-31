import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

/* Dev-only file server for the /dev/assets contact sheet: streams candidate
   files from assets/generated/<slot-id>/<file>, which lives outside public/
   on purpose (candidates never ship). 404 outside development. */

const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }
  const { path: parts } = await params;
  if (
    !parts ||
    parts.length !== 2 ||
    !/^[a-z0-9_-]+$/i.test(parts[0]) ||
    !/^[\w.-]+$/.test(parts[1]) ||
    parts[1].includes("..")
  ) {
    return new NextResponse(null, { status: 400 });
  }
  const file = path.join(process.cwd(), "assets", "generated", parts[0], parts[1]);
  const type = TYPES[path.extname(parts[1]).toLowerCase()];
  if (!type || !fs.existsSync(file)) return new NextResponse(null, { status: 404 });
  return new NextResponse(new Uint8Array(fs.readFileSync(file)), {
    headers: { "content-type": type, "cache-control": "no-store" },
  });
}
