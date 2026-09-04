import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { CtaBand } from "@/components/shared/CtaBand";
import { MediaSlot } from "@/components/shared/MediaSlot";
import { BracketIndex, Chip, Eyebrow } from "@/components/shared/mono";
import { Section } from "@/components/shared/Section";
import {
  articleJsonLd,
  formatDate,
  getAllPosts,
  getMorePosts,
  getPost,
  type Post,
} from "@/lib/blog";
import { BLOG_AUTHORS, TEAM_AUTHOR } from "@/lib/blog-authors";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { EDGE } from "@/lib/layout";
import { RESOURCES } from "@/lib/resources";
import { SITE_URL } from "@/lib/site";
import { PostRow } from "../PostRow";
import { ShareRow } from "../ShareRow";
import { Toc } from "../Toc";

/* /blog/[slug]/ (Pane A, 2026-08-30; v2 the same day after Brad's
   "bare bones" review, project-sections/blog/blog-plan.md section 2):
   one post. Static params come from lib/blog.ts (drafts excluded;
   unknown slugs 404 via dynamicParams=false).

   Anatomy: breadcrumb row, title, description, meta; the cover figure
   (MediaSlot, placeholder until the designer's cover lands; the share
   card is generated from the title meanwhile, opengraph-image.tsx);
   then the "In short" takeaways panel and the body on the ~65ch spine
   with a sticky table of contents beside it on lg+; the lead-magnet
   row when the post names a resource; the author card; share links;
   the more-posts strip; one CtaBand to /audit/. Article JSON-LD with
   BigSquare Marketing as the Organization author.

   Annotation budget: 1 of 3 (CtaBand bracket). No registration marks. */

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}/`,
      types: {
        "application/rss+xml": `${SITE_URL}/feed.xml`,
      },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

function Takeaways({ items }: { items: string[] }) {
  return (
    <aside
      aria-labelledby="takeaways-label"
      className="rounded-[24px] bg-surf px-6 py-6 md:px-8 md:py-7"
    >
      <Eyebrow>
        <span id="takeaways-label">In short</span>
      </Eyebrow>
      <ol className="mt-4">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-baseline gap-4 border-t border-sec-line py-4 first:border-t-0 first:pt-1"
          >
            <BracketIndex n={i + 1} className="shrink-0 text-sec-acc" />
            <p className="text-[17px] font-medium leading-[1.5] text-sec-ink">
              {item}
            </p>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function ResourceRow({ slug }: { slug: string }) {
  const resource = RESOURCES.find((r) => r.slug === slug);
  if (!resource) return null;
  return (
    <Link
      href={`/resources/#${resource.slug}`}
      className="group mt-14 flex items-center justify-between gap-6 border-y border-sec-line py-6 transition-colors duration-[250ms] ease-house hover:border-sec-ink"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <Chip className="w-fit">Free {resource.format}</Chip>
        <div>
          <p className="text-h3 font-bold text-sec-ink">{resource.title}</p>
          <p className="mt-1 text-small text-sec-mid">{resource.line}</p>
        </div>
      </div>
      <span
        aria-hidden
        className="shrink-0 text-[20px] text-sec-ink transition-transform duration-[250ms] ease-house group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      >
        →
      </span>
    </Link>
  );
}

function AuthorCard({ post }: { post: Post }) {
  const author = BLOG_AUTHORS[post.author] ?? BLOG_AUTHORS[TEAM_AUTHOR];
  return (
    <div className="mt-12 flex items-center gap-5">
      <MediaSlot
        id={author.slot}
        note="Headshot"
        alt={post.author}
        aspect="1 / 1"
        compact
        marks={false}
        sizes="72px"
        className="w-[72px] shrink-0"
      />
      <div>
        <p className="font-mono text-mono-sm uppercase text-sec-mid">
          Written by <span className="text-sec-acc">{author.role}</span>
        </p>
        <p className="mt-1 text-h3 font-bold text-sec-ink">{post.author}</p>
        <p className="mt-1 max-w-[48ch] text-small text-sec-mid">{author.line}</p>
      </div>
    </div>
  );
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { default: Body } = await import(`@/content/blog/${slug}.mdx`);
  const more = getMorePosts(slug, 3);
  const url = `${SITE_URL}/blog/${post.slug}/`;
  const showToc = post.headings.length >= 3;
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog/" },
      { name: post.title, path: `/blog/${post.slug}/` },
    ]),
    articleJsonLd(post),
  ];

  return (
    <main>
      {jsonLd.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}

      {/* 1. Hero: breadcrumb row, title, description, meta, cover */}
      <Section theme="light" size="none" className="pt-32 pb-12 md:pt-36 md:pb-16">
        <div className={EDGE}>
          <SeparatorIn />
          <nav
            aria-label="Breadcrumb"
            className="mt-4 font-mono text-eyebrow uppercase text-sec-mid"
          >
            <Link
              href="/blog/"
              className="transition-colors duration-[var(--dur-fast)] hover:text-sec-ink"
            >
              Blog
            </Link>
            <span aria-hidden> / </span>
            <span>{post.tags[0]}</span>
          </nav>

          <div className="mt-6 max-w-[960px]">
            <Reveal>
              <h1 className="max-w-[20ch] font-display text-h1 text-sec-ink">
                {post.title}
              </h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 max-w-[52ch] text-lead text-sec-mid">
                {post.description}
              </p>
            </Reveal>
            <Reveal
              delay={0.14}
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-mono-sm uppercase tabular-nums text-sec-mid"
            >
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
              <span className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </span>
            </Reveal>
          </div>

          {post.cover && post.coverAlt ? (
            <Reveal delay={0.2}>
              <MediaSlot
                id={post.cover}
                note="Cover figure from the blog cover template: blue-square system, big type, a figure number. No stock."
                alt={post.coverAlt}
                aspectClassName="aspect-[16/9] md:aspect-[2/1]"
                sizes="100vw"
                priority
                marks={false}
                className="mt-12"
              />
            </Reveal>
          ) : null}
        </div>
      </Section>

      {/* 2. Takeaways, the body on the spine with the TOC beside it,
          the resource row, the author, share */}
      <Section theme="light" size="none" className="pb-section-y">
        <div className={EDGE}>
          <div
            className={
              showToc
                ? "lg:grid lg:grid-cols-[minmax(0,720px)_1fr] lg:gap-16 xl:gap-24"
                : undefined
            }
          >
            <div className="max-w-[720px]">
              {post.takeaways.length > 0 ? (
                <Takeaways items={post.takeaways} />
              ) : null}
              <article
                className={`max-w-[65ch] [&>*:first-child]:mt-0 ${
                  post.takeaways.length > 0 ? "mt-12" : ""
                }`}
              >
                <Body />
              </article>
              {post.resource ? <ResourceRow slug={post.resource} /> : null}
              <AuthorCard post={post} />
              <ShareRow url={url} title={post.title} />
            </div>
            {showToc ? (
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <Toc headings={post.headings} />
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </Section>

      {/* 3. More posts */}
      {more.length > 0 && (
        <Section theme="tint">
          <div className={EDGE}>
            <Eyebrow>More posts</Eyebrow>
            <div className="mt-6">
              {more.map((p, i) => (
                <PostRow key={p.slug} post={p} index={i} compact />
              ))}
              <SeparatorIn delay={more.length * 0.08} />
            </div>
          </div>
        </Section>
      )}

      {/* 4. The closing ask: the audit */}
      <CtaBand
        headline="Want to know where your numbers stand?"
        body="Get a free audit. We look at your search, your ads, your site, and your tracking, and tell you what to fix first."
        primaryLabel="Get a Free Audit"
        primaryHref="/audit/"
        secondaryLabel="Schedule a Call"
        secondaryHref="/schedule/"
      />
    </main>
  );
}
