import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { CtaBand } from "@/components/shared/CtaBand";
import { Eyebrow } from "@/components/shared/mono";
import { Section } from "@/components/shared/Section";
import { getAllPosts } from "@/lib/blog";
import { blogJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/site";
import { EDGE } from "@/lib/layout";
import { PostRow } from "./PostRow";

export const metadata: Metadata = {
  title: "Marketing Blog",
  description:
    "Plain notes on search, ads, websites, and creative from the BigSquare team. Written so you can use them on your own accounts.",
  alternates: {
    canonical: "/blog/",
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
};

/* /blog/ (Pane A, 2026-08-30): the index. A hero with a statement
   headline and one line of what the blog is for, then an editorial
   ruled list, not a card grid. Posts come from lib/blog.ts, so a new
   .mdx file in content/blog/ is the whole publishing step. Wide
   positioning: the blog is for every lane, never franchise-only.

   Annotation budget: 2 of 3 (H1 underline, CtaBand bracket). No
   registration marks (new-page rule). */

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog/" },
  ]);
  const blog = blogJsonLd(posts);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blog) }}
      />

      {/* 1. Hero */}
      <Section theme="light" size="none" className="pt-32 pb-section-y md:pt-36">
        <div className={EDGE}>
          <SeparatorIn />
          <Eyebrow className="mt-4">Blog</Eyebrow>

          <div className="mt-6 flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-6">
            <Reveal className="md:col-span-8">
              <h1 className="max-w-[14ch] font-display text-h1 text-sec-ink">
                Notes from the{" "}
                <RoughAnnotation
                  variant="underline"
                  delay={0.7}
                  className="whitespace-nowrap"
                >
                  work.
                </RoughAnnotation>
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-end">
              <p className="max-w-[40ch] text-body text-sec-mid">
                What we learn running search, ads, sites, and creative for
                real brands. Short, plain, and useful on your own accounts.
              </p>
              <p className="mt-4 max-w-[40ch] text-body text-sec-mid">
                <a
                  href="/feed.xml"
                  className="font-medium text-sec-ink underline underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-sec-acc"
                >
                  RSS feed of new posts
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 2. The list */}
      <Section theme="light" size="none" className="pb-section-y-lg">
        <div className={EDGE}>
          {posts.length > 0 ? (
            <div>
              {posts.map((post, i) => (
                <PostRow key={post.slug} post={post} index={i} />
              ))}
              <SeparatorIn delay={posts.length * 0.08} />
            </div>
          ) : (
            <p className="font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
              [PLACEHOLDER: no published posts yet. Drop a .mdx file in
              content/blog/ with draft: false]
            </p>
          )}
        </div>
      </Section>

      {/* 3. The closing ask */}
      <CtaBand
        headline="Want this done for you?"
        body="Book a call. We will look at your numbers together and tell you exactly what we would do first."
      />
    </main>
  );
}
