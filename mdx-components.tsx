import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef, JSX } from "react";

/* Global MDX element map (required by @next/mdx under the App Router).
   Blog bodies render through these so long-form copy sits on the
   site's type scale and palette (STYLE_GUIDE 3.2) inside the ~65ch
   spine the page provides (4.5). Posts start at H2: the page owns the
   H1, so a stray `#` in a post is demoted to H2 rather than making a
   second H1. font-display on H2 carries the ss01 filled O by default
   (used lightly: headings only, never body). */

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

const components: MDXComponents = {
  h1: (props: P<"h1">) => (
    <h2 className="mt-14 font-display text-h2 text-sec-ink" {...props} />
  ),
  h2: (props: P<"h2">) => (
    <h2 className="mt-14 font-display text-h2 text-sec-ink" {...props} />
  ),
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
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-small" {...props} />
    </div>
  ),
  th: (props: P<"th">) => (
    <th
      className="border-b border-sec-ink py-2 pr-4 text-left font-mono text-mono-sm uppercase text-sec-mid"
      {...props}
    />
  ),
  td: (props: P<"td">) => (
    <td className="border-b border-sec-line py-3 pr-4 align-top" {...props} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
