import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef, JSX, ReactNode } from "react";
import { MediaSlot } from "@/components/shared/MediaSlot";
import { Eyebrow } from "@/components/shared/mono";
import { childrenToText, slugify } from "@/lib/blog-toc";

/* Global MDX element map (required by @next/mdx under the App Router).
   Blog bodies render through these so long-form copy sits on the
   site's type scale and palette (STYLE_GUIDE 3.2) inside the ~65ch
   spine the page provides (4.5). Posts start at H2: the page owns the
   H1, so a stray `#` in a post is demoted to H2 rather than making a
   second H1. font-display on H2 carries the ss01 filled O by default
   (used lightly: headings only, never body). H2s get an id from the
   same slugify the table of contents uses (lib/blog-toc.ts).

   Blog v2 (2026-08-30) writer-facing components, usable in any post
   without an import: <Figure>, <Quote>, <Callout>. GFM tables style
   through table/th/td. See project-sections/blog/blog-plan.md. */

type P<T extends keyof JSX.IntrinsicElements> = ComponentPropsWithoutRef<T>;

const LINK =
  "font-medium text-acc underline decoration-acc/40 underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:decoration-acc";

function Anchor({ href = "", children, ...rest }: P<"a">) {
  const internal = href.startsWith("/") || href.startsWith("#");
  if (internal) {
    return (
      <Link href={href} className={LINK} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={LINK} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function H2({ children, ...rest }: P<"h2">) {
  return (
    <h2
      id={slugify(childrenToText(children))}
      className="mt-14 scroll-mt-28 font-display text-h2 text-sec-ink"
      {...rest}
    >
      {children}
    </h2>
  );
}

/* <Figure id="blog-fig-..." note="what the graphic shows" alt="..."
   aspect="16 / 9" caption="..." />: an inline figure through the
   MediaSlot workflow. Until the file lands in lib/asset-files.ts the
   designed placeholder shows with the note; add the slot to
   asset-manifest.md. */
function Figure({
  id,
  note,
  alt,
  aspect,
  caption,
}: {
  id: string;
  note: string;
  alt: string;
  /** CSS aspect-ratio; default is 4:3 on phones (room for the note)
      and 16:9 from md up */
  aspect?: string;
  caption?: string;
}) {
  return (
    <figure className="mt-10">
      <MediaSlot
        id={id}
        note={note}
        alt={alt}
        aspect={aspect}
        aspectClassName={aspect ? undefined : "aspect-[4/3] md:aspect-video"}
        sizes="(min-width: 1024px) 720px, 100vw"
      />
      {caption ? (
        <figcaption className="mt-3 font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* <Quote>One line pulled from the post.</Quote>: the pull quote, at
   statement scale between two hairlines. Works with inline text or a
   wrapped paragraph. */
function Quote({ children }: { children?: ReactNode }) {
  return (
    <blockquote className="my-12 border-y border-sec-line py-8 [&>p]:mt-0 [&>p]:text-statement [&>p]:text-sec-ink">
      <span className="block max-w-[26ch] font-display text-statement text-sec-ink">
        {children}
      </span>
    </blockquote>
  );
}

/* <Callout title="Do this">...</Callout>: the practical step in a
   section, on a soft panel with a mono eyebrow. */
function Callout({
  title = "Do this",
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <aside className="mt-8 rounded-[24px] bg-surf p-6 md:p-8">
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-3 text-body text-sec-ink [&>p]:mt-4 [&>p:first-child]:mt-0 [&>ul]:mt-4 [&>ol]:mt-4">
        {children}
      </div>
    </aside>
  );
}

const components: MDXComponents = {
  h1: (props: P<"h1">) => <H2 {...props} />,
  h2: H2,
  h3: (props: P<"h3">) => (
    <h3 className="mt-10 text-h3 font-bold text-sec-ink" {...props} />
  ),
  h4: (props: P<"h4">) => (
    <h4 className="mt-8 text-body font-bold text-sec-ink" {...props} />
  ),
  p: (props: P<"p">) => <p className="mt-6 text-body text-sec-ink" {...props} />,
  ul: (props: P<"ul">) => (
    <ul
      className="mt-6 list-disc space-y-3 pl-6 text-body text-sec-ink marker:text-sec-acc"
      {...props}
    />
  ),
  ol: (props: P<"ol">) => (
    <ol
      className="mt-6 list-decimal space-y-3 pl-6 text-body text-sec-ink marker:font-mono marker:text-sec-acc"
      {...props}
    />
  ),
  li: (props: P<"li">) => <li className="pl-1" {...props} />,
  a: Anchor,
  blockquote: (props: P<"blockquote">) => (
    <blockquote
      className="mt-8 border-l-2 border-acc pl-6 text-lead text-sec-ink [&>p]:mt-0"
      {...props}
    />
  ),
  strong: (props: P<"strong">) => <strong className="font-bold" {...props} />,
  code: (props: P<"code">) => (
    <code className="rounded-[6px] bg-surf px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />
  ),
  pre: (props: P<"pre">) => (
    <pre
      className="mt-6 overflow-x-auto rounded-card bg-surf p-5 font-mono text-small leading-relaxed [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-sec-line" />,
  table: (props: P<"table">) => (
    <div className="mt-8 overflow-x-auto rounded-[24px] border border-sec-line bg-paper">
      <table className="w-full border-collapse text-small" {...props} />
    </div>
  ),
  thead: (props: P<"thead">) => <thead className="bg-surf" {...props} />,
  th: (props: P<"th">) => (
    <th
      className="border-b border-sec-line px-5 py-3 text-left font-mono text-mono-sm uppercase text-sec-mid"
      {...props}
    />
  ),
  td: (props: P<"td">) => (
    <td
      className="border-b border-sec-line px-5 py-4 align-top text-small text-sec-ink last:border-b-0 [tr:last-child_&]:border-b-0"
      {...props}
    />
  ),
  Figure,
  Quote,
  Callout,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
