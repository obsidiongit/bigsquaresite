import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { formatDate, type Post } from "@/lib/blog";
import { cn } from "@/lib/utils";

/* <PostRow>: one post in the editorial list (the RuledLinkTable /
   NumberedRuledList family, STYLE_GUIDE 6.10). Full-width ruled row:
   date and lead tag in mono on the left, the title as the big link,
   one line of description, reading time, and the arrow. The whole row
   is the link; hover turns the title accent and slides the arrow. The
   index runs it at h2 scale; the more-posts strip runs `compact` at
   h3 with h3 headings. */

export function PostRow({
  post,
  index,
  compact = false,
}: {
  post: Post;
  index: number;
  compact?: boolean;
}) {
  const Heading = compact ? "h3" : "h2";
  return (
    <div>
      <SeparatorIn delay={index * 0.08} />
      <Reveal delay={index * 0.08}>
        <Link
          href={`/blog/${post.slug}/`}
          className={cn(
            "group grid gap-3 md:grid-cols-12 md:gap-6",
            compact ? "py-5 md:py-6" : "py-7 md:py-9",
          )}
        >
          <div className="flex items-center gap-4 font-mono text-mono-sm uppercase tabular-nums md:col-span-3 md:flex-col md:items-start md:gap-2">
            <time dateTime={post.date} className="text-sec-mid">
              {formatDate(post.date)}
            </time>
            <span className="text-sec-acc">{post.tags[0]}</span>
          </div>
          <div className="flex items-start justify-between gap-6 md:col-span-9">
            <div>
              <Heading
                className={cn(
                  "max-w-[26ch] font-bold text-sec-ink transition-colors duration-[var(--dur-fast)] group-hover:text-sec-acc",
                  compact ? "text-h3" : "text-h2",
                )}
              >
                {post.title}
              </Heading>
              {!compact && (
                <p className="mt-3 max-w-[60ch] text-body text-sec-mid">
                  {post.description}
                </p>
              )}
              <p
                className={cn(
                  "font-mono text-mono-sm uppercase tabular-nums text-sec-mid",
                  compact ? "mt-2" : "mt-4",
                )}
              >
                {post.readingMinutes} min read
              </p>
            </div>
            <span
              aria-hidden
              className="mt-1 shrink-0 text-[20px] text-sec-ink transition-transform duration-[250ms] ease-house group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            >
              →
            </span>
          </div>
        </Link>
      </Reveal>
    </div>
  );
}
