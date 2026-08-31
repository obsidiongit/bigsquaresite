import Image from "next/image";
import Link from "next/link";
import { Chip } from "@/components/shared/mono";
import { ASSET_FILES } from "@/lib/asset-files";
import { cn } from "@/lib/utils";

/* <MediaSlot> (lib/asset-files.ts contract, Brad's fill-at-the-end
   workflow, 2026-08-26): every media moment on interior pages renders
   through one of these. While the id has no file in ASSET_FILES the
   slot shows its DESIGNED placeholder: a soft --surf panel at
   --radius-media, a centered ghost brand square, and a mono ASSET
   chip naming the wanted shot (copy-rules:
   never leave placeholder content looking finished, but it can look
   composed). Dropping a file into public/media/ and adding one
   ASSET_FILES row swaps in next/image; alt text ships with the slot
   definition in the page's content module. List every slot in
   project-guidelines/asset-manifest.md.

   The placeholder is aria-hidden decoration; the filled image is real
   content with real alt. Framed-media grammar per STYLE_GUIDE 4.3 /
   6.14: radius 24, 1px line, marks on lg+. */

export function MediaSlot({
  id,
  note,
  alt,
  aspect = "4 / 3",
  aspectClassName,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  priority = false,
  href,
  marks = true,
  compact = false,
  className,
}: {
  /** key into ASSET_FILES (lib/asset-files.ts) */
  id: string;
  /** the shot this slot wants; shown on the placeholder until src lands */
  note: string;
  /** required alongside the real file; unused while empty */
  alt: string;
  /** CSS aspect-ratio value, e.g. "4 / 3", "16 / 9", "1 / 1" */
  aspect?: string;
  /** responsive alternative to `aspect` (e.g. "aspect-video
      md:aspect-[21/9]"); wins over `aspect` when set */
  aspectClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** internal link target: the whole framed object becomes the link
      (image internal-linking, Brad 2026-08-26) and a real image gets
      the 6.4 hover scale. Do NOT set when a parent element is already
      a link (no nested anchors). */
  href?: string;
  /** DEAD 2026-08-30: registration marks retired sitewide; accepted so
      the two dozen marks={false} call sites keep compiling, rendered
      never. Strip the prop + call sites in a quiet window. */
  marks?: boolean;
  /** compact placeholder (ghost square + chip, no note) for slots too
      short to hold the note column, e.g. small 3:2 cards */
  compact?: boolean;
  className?: string;
}) {
  const file = ASSET_FILES[id];

  const framed = (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[24px] border border-sec-line bg-surf",
          aspectClassName,
        )}
        style={aspectClassName ? undefined : { aspectRatio: aspect }}
      >
        {file ? (
          <Image
            src={file.src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={cn(
              "object-cover",
              href &&
                "transition-transform duration-[600ms] ease-house group-hover/slot:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/slot:scale-100",
            )}
          />
        ) : (
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center p-6 text-center",
              compact ? "gap-3" : "gap-5",
            )}
          >
            {/* the ghost mark: a quiet brand square holding the frame */}
            <span className="block size-8 shrink-0 rounded-[4px] border-[1.5px] border-sec-acc/40" />
            <Chip className="text-sec-mid">Asset</Chip>
            {!compact && (
              <p className="max-w-[30ch] font-mono text-mono-sm uppercase leading-[1.5] text-sec-mid">
                {note}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (!href) return framed;
  return (
    <Link href={href} aria-label={alt} className="group/slot block">
      {framed}
    </Link>
  );
}
