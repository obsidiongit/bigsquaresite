import fs from "node:fs";
import path from "node:path";
import { BLOG_AUTHORS, TEAM_AUTHOR } from "@/lib/blog-authors";
import { extractHeadings, type Heading } from "@/lib/blog-toc";
import { RESOURCES } from "@/lib/resources";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/* The blog loader (Pane A, 2026-08-30). Publishing is one step: drop
   `content/blog/<slug>.mdx` in the folder. This module reads the
   folder at build time, parses the YAML frontmatter, sorts by date,
   and hides `draft: true` posts everywhere (index, sitemap, static
   params, the more-posts strip). Reading time is computed from the
   body, never stored. Bad frontmatter throws with the file name so
   `npm run build` fails loudly for the scheduled writer.

   Frontmatter contract (content/blog/TOPICS.md and
   project-sections/blog/routine-prompt.md mirror it):
     title        string, under 60 chars
     description  string, under 155 chars
     date         ISO date, YYYY-MM-DD
     author       string, "BigSquare Team" for now
     tags         2 to 4 strings, inline [a, b] or a block list
     draft        boolean, default false
   Blog v2 (2026-08-30), all optional:
     cover        MediaSlot id for the cover figure (blog-cover-<name>)
     coverAlt     alt text for the cover once the file lands
     takeaways    3 to 5 one-line strings (the "In short" panel)
     quote        one line pulled from the post (unused today: posts
                  place <Quote> inline; kept for the OG card later)
     resource     a /resources/ slug; renders the lead-magnet row
   The parser is deliberately small: flat key/value pairs, quoted or
   bare strings, booleans, and string lists. No nesting. */

export type Post = {
  slug: string;
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  author: string;
  tags: string[];
  draft: boolean;
  wordCount: number;
  readingMinutes: number;
  /** blog v2 */
  cover?: string;
  coverAlt?: string;
  takeaways: string[];
  quote?: string;
  resource?: string;
  headings: Heading[];
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const WORDS_PER_MINUTE = 225;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type Scalar = string | boolean | string[];

function stripQuotes(s: string): string {
  const t = s.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

function parseValue(raw: string): Scalar {
  const v = raw.trim();
  if (v === "true") return true;
  if (v === "false") return false;
  if (v.startsWith("[") && v.endsWith("]")) {
    return v
      .slice(1, -1)
      .split(",")
      .map((s) => stripQuotes(s))
      .filter(Boolean);
  }
  return stripQuotes(v);
}

/** Split a post source into its frontmatter data and the MDX body. */
export function parseFrontmatter(source: string): {
  data: Record<string, Scalar>;
  body: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) return { data: {}, body: source };

  const data: Record<string, Scalar> = {};
  let listKey: string | null = null;

  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const item = /^\s*-\s+(.*)$/.exec(line);
    if (item && listKey) {
      (data[listKey] as string[]).push(stripQuotes(item[1]));
      continue;
    }

    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    const [, key, rawValue] = kv;
    if (rawValue.trim() === "") {
      data[key] = [];
      listKey = key;
    } else {
      data[key] = parseValue(rawValue);
      listKey = null;
    }
  }

  return { data, body: source.slice(match[0].length) };
}

function countWords(body: string): number {
  const text = body
    .replace(/^(import|export)\s.*$/gm, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/[`*_#>[\]|]/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

function fail(file: string, message: string): never {
  throw new Error(`content/blog/${file}: ${message}`);
}

function optionalString(
  file: string,
  data: Record<string, Scalar>,
  key: string,
): string | undefined {
  const v = data[key];
  if (v === undefined) return undefined;
  if (typeof v !== "string" || !v.trim()) fail(file, `"${key}" must be a string`);
  return v.trim();
}

function readPost(file: string): Post {
  const slug = file.replace(/\.mdx$/, "");
  if (!SLUG_RE.test(slug)) {
    fail(file, "file name must be a lowercase slug (letters, numbers, hyphens)");
  }

  const source = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, body } = parseFrontmatter(source);

  const title = data.title;
  if (typeof title !== "string" || !title.trim()) fail(file, 'missing "title"');
  const description = data.description;
  if (typeof description !== "string" || !description.trim()) {
    fail(file, 'missing "description"');
  }
  const date = data.date;
  if (
    typeof date !== "string" ||
    !DATE_RE.test(date) ||
    Number.isNaN(Date.parse(date))
  ) {
    fail(file, '"date" must be an ISO date like 2026-08-30');
  }
  const tags = data.tags;
  if (!Array.isArray(tags) || tags.length === 0) {
    fail(file, '"tags" must be a list with at least 1 tag');
  }
  const draft = data.draft;
  if (draft !== undefined && typeof draft !== "boolean") {
    fail(file, '"draft" must be true or false');
  }
  const author =
    typeof data.author === "string" && data.author.trim()
      ? data.author.trim()
      : TEAM_AUTHOR;
  if (!BLOG_AUTHORS[author]) {
    fail(
      file,
      `"author" must be a name registered in lib/blog-authors.ts (got "${author}")`,
    );
  }

  /* blog v2 keys, all optional */
  const takeaways = data.takeaways ?? [];
  if (!Array.isArray(takeaways)) {
    fail(file, '"takeaways" must be a list of one-line strings');
  }
  const cover = optionalString(file, data, "cover");
  const coverAlt = optionalString(file, data, "coverAlt");
  if (cover && !coverAlt) fail(file, '"cover" needs a "coverAlt"');
  const quote = optionalString(file, data, "quote");
  const resource = optionalString(file, data, "resource");
  if (resource && !RESOURCES.some((r) => r.slug === resource)) {
    fail(
      file,
      `"resource" must be a slug from lib/resources.ts (got "${resource}")`,
    );
  }

  const wordCount = countWords(body);
  return {
    slug,
    title: title.trim(),
    description: description.trim(),
    date,
    author,
    tags: tags.map((t) => t.trim()).filter(Boolean),
    draft: draft === true,
    wordCount,
    readingMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
    cover,
    coverAlt,
    takeaways: takeaways.map((t) => t.trim()).filter(Boolean),
    quote,
    resource,
    headings: extractHeadings(body),
  };
}

let cache: Post[] | null = null;

/** Every published post, newest first. Drafts never leave this file. */
export function getAllPosts(): Post[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  if (!fs.existsSync(BLOG_DIR)) return [];
  const posts = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(readPost)
    .filter((p) => !p.draft)
    .sort((a, b) =>
      a.date === b.date
        ? a.title.localeCompare(b.title)
        : b.date.localeCompare(a.date),
    );
  cache = posts;
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** The newest posts other than `slug`, for the more-posts strip. */
export function getMorePosts(slug: string, count = 3): Post[] {
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, count);
}

/** "August 30, 2026". UTC so the day never shifts by time zone. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Article JSON-LD for a post. A registered team member becomes a
    Person author working for the sitewide Organization node; the
    "BigSquare Team" byline stays the Organization itself. Every value
    here is real, so nothing placeholder ever reaches structured data. */
export function articleJsonLd(post: Post) {
  const url = `${SITE_URL}/blog/${post.slug}/`;
  const orgId = `${SITE_URL}/#organization`;
  const person = post.author !== TEAM_AUTHOR ? BLOG_AUTHORS[post.author] : null;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: person
      ? {
          "@type": "Person",
          name: post.author,
          jobTitle: person.role,
          worksFor: { "@id": orgId },
        }
      : {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          "@id": orgId,
        },
    publisher: { "@id": `${SITE_URL}/#organization` },
    keywords: post.tags.join(", "),
    wordCount: post.wordCount,
    inLanguage: "en-US",
  };
}
