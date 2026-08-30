import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";

/* Per-post share card (blog v2, 2026-08-30). Until the designer's
   cover figures land, every post gets a typographic card in the brand
   system: dark ground, the blue square, the post's lead tag as a mono
   eyebrow, the title in Lenia Mono 700, date + reading time at the
   foot. Satori needs a TTF, so the licensed source file in
   assets/font/ is read at build time (woff2 in public/ will not do).
   When covers exist, swap this for the cover asset per post. */

export const alt = "BigSquare Marketing blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const font = await readFile(
    join(process.cwd(), "assets", "font", "lenia-mono", "LeniaMono-Bold.ttf"),
  );
  const title = post?.title ?? "BigSquare Marketing";
  const titleSize = title.length > 48 ? 56 : 64;
  /* satori wants one child per non-flex div: build the strings first */
  const eyebrow = post ? `BigSquare / Blog / ${post.tags[0]}` : "BigSquare / Blog";
  const foot = post ? `${formatDate(post.date)} · ${post.readingMinutes} min read` : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          backgroundColor: "#0B0F17",
          color: "#E9ECF1",
          fontFamily: "LeniaMono",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 28, height: 28, backgroundColor: "#0657F9" }} />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#8D97A8",
            }}
          >
            {eyebrow}
          </div>
        </div>
        <div
          style={{
            fontSize: titleSize,
            lineHeight: 1.08,
            letterSpacing: -1,
            maxWidth: 1040,
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#8D97A8",
          }}
        >
          <div>{foot}</div>
          <div>bigsquaremarketing.com</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "LeniaMono", data: font, weight: 700, style: "normal" }],
    },
  );
}
