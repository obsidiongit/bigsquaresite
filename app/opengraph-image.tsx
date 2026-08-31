import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/* Brand-default OG image, inherited by every route until a page-specific
   image exists (blog posts already carry their own typographic card).
   Same system as the blog card: dark ground, the blue square, Lenia
   Mono 700. Satori needs a TTF, so the licensed source file in
   assets/font/ is read at build time (woff2 in public/ will not do).
   Swap for a designed asset when brand imagery is delivered. */

export const alt = "BigSquare Marketing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const font = await readFile(
    join(process.cwd(), "assets", "font", "lenia-mono", "LeniaMono-Bold.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          backgroundColor: "#0B0F17",
          fontFamily: "LeniaMono",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            border: "6px solid #0657F9",
          }}
        />
        <div
          style={{
            fontSize: 84,
            letterSpacing: -2,
            color: "#E9ECF1",
          }}
        >
          BigSquare
        </div>
        <div
          style={{
            fontSize: 28,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#8D97A8",
          }}
        >
          Full-Stack Marketing Agency
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "LeniaMono", data: font, weight: 700, style: "normal" }],
    },
  );
}
