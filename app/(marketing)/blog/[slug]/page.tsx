import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { CtaBand } from "@/components/shared/CtaBand";
import { Chip, Eyebrow } from "@/components/shared/mono";
import { Section } from "@/components/shared/Section";
import {
  articleJsonLd,
  formatDate,
  getAllPosts,
  getMorePosts,
  getPost,
} from "@/lib/blog";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { EDGE } from "@/lib/layout";
import { PostRow } from "../PostRow";

/* /blog/[slug]/ (Pane A, 2026-08-30): one post. Static params come
   from lib/blog.ts (drafts excluded; unknown slugs 404 via
   dynamicParams=false). The body is the MDX module imported by slug
   and rendered through mdx-components.tsx on the ~65ch spine (4.5).
   Title, date, reading time, and tags in the hero; author line under
   the body; a more-posts strip; one CtaBand to /audit/. Article
   JSON-LD with BigSquare Marketing as the Organization author.

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
    alternates: { canonical: `/blog/${post.slug}/` },
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

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { default: Body } = await import(`@/content/blog/${slug}.mdx`);
  const more = getMorePosts(slug, 3);
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

      {/* 1. Hero: breadcrumb row, title, description, meta */}
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
        </div>
      </Section>

      {/* 2. The body on the spine, then the author line */}
      <Section theme="light" size="none" className="pb-section-y">
        <div className={EDGE}>
          <article className="max-w-[65ch] [&>*:first-child]:mt-0">
            <Body />
          </article>
          <div className="mt-14 flex max-w-[65ch] items-center gap-4 border-t border-sec-line pt-6">
            <span aria-hidden className="block size-3 shrink-0 bg-acc" />
            <p className="font-mono text-mono-sm uppercase text-sec-mid">
              Written by <span className="text-sec-ink">{post.author}</span>
            </p>
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
