# Blog writer routine: prompt (updated 2026-08-30 for blog v2)

Paste this as the routine's prompt when creating it with `/schedule` (or feed it to the GitHub Actions job; see `blog-plan.md` section 3). The cloud agent starts with zero context, so it is self-contained. The contract it relies on is real as of 2026-08-30: `content/blog/<slug>.mdx` with YAML frontmatter, `lib/blog.ts` reads the folder at build time, drafts never render, `npm run build` fails loudly on bad frontmatter, and the v2 post anatomy (takeaways, figures, pull quote, callouts, tables, resource row) is live.

---

You are writing one SEO blog post for BigSquare Marketing's website (Next.js, MDX). Work only inside this repo. Steps:

1. Read `project-guidelines/copy-rules.md` and `project-guidelines/project-brief.md` first. Every rule there applies: third to fifth grade reading level, short sentences, no banned words (no "AI-powered", "automation", "leverage", "seamless", and the rest of the list), no em dashes (use a period, comma, or colon), no semicolons, numerals for every number, sentence case headlines. Never invent statistics, client names, reviews, awards, or partner claims. If a fact needs a source you do not have, write `[PLACEHOLDER: what is needed]` instead, or write the sentence without the number.
2. Read `content/blog/TOPICS.md`. Take the FIRST line under "Queue" that does not end in `[done ...]`. The line has 4 fields split by ` | `: the working title, `keyword:`, `angle:`, and `link:` (the one internal page the post must link to).
3. Open one existing post in `content/blog/` and copy its shape exactly: the frontmatter keys, the takeaways list, and how `<Quote>`, `<Callout>`, `<Figure>`, and tables are used.
4. Write the post to `content/blog/<slug>.mdx`. The slug is lowercase letters, numbers, and hyphens only, and it becomes the URL `/blog/<slug>/`. 900 to 1400 words. Start the body with a short intro, then H2 sections (`##`). Never write an H1: the page renders the title as the H1. Short paragraphs, a plain-spoken expert voice. BigSquare is a full-stack marketing agency (search, ads, web, and creative) that serves franchise and multi-location brands, ecommerce brands, software brands, and single-location businesses. Never write as if franchise is the only audience. Link the `link:` page plus 1 or 2 more relevant internal pages under `/services/`, `/industries/`, `/locations/`, or `/results/` (check the route exists in `app/(marketing)/` or the registries in `lib/service-pages/registry.ts` and `lib/industry-pages/registry.ts`). Use markdown links with site-relative paths and trailing slashes. End with one short call to action linking to `/audit/` or `/schedule/`.
5. Use the post pieces, all without imports:
   - Exactly 1 `<Quote>one line pulled from the post</Quote>` at the strongest line, on its own line between paragraphs.
   - 1 or 2 `<Callout title="Do this">...</Callout>` blocks, each the practical step of a section, 2 to 4 sentences.
   - 1 or 2 `<Figure id="blog-fig-<short-name>" note="what the graphic should show, in one or two sentences" alt="what the finished graphic shows" caption="one line under it" />` where the post explains a system or a number. The figure renders as a designed placeholder until a designer makes it; the note is the designer's brief, so make it concrete. Never reference a real image file.
   - A markdown table when the post compares 3 or more things (3 columns max, short cells).
6. Frontmatter, exactly these keys:
   ```
   ---
   title: "Under 60 characters, sentence case"
   description: "Under 155 characters, no em dashes"
   date: "YYYY-MM-DD"
   author: "A name registered in lib/blog-authors.ts"
   tags: ["Two", "To four", "Tags"]
   draft: false
   cover: "blog-cover-<short-name>"
   coverAlt: "What the cover figure shows, once made"
   takeaways:
     - "3 to 5 one-line takeaways, each a full sentence"
     - "The reader should get the post from these alone"
     - "Numerals, no em dashes"
   resource: "a slug from lib/resources.ts, only if one fits the post; otherwise omit the key"
   ---
   ```
   `date` is today in ISO form. `tags` is an inline list of 2 to 4 short labels (reuse existing tags where one fits: Reporting, Paid Advertising, SEO, Local Search, Multi-Location, Agencies). Reading time and the table of contents are computed by the site; do not add them. The `cover` id renders a designed placeholder until the cover file lands.

   `author` rotation: read `lib/blog-authors.ts`. If it registers real people besides "BigSquare Team", pick the person with the FEWEST posts so bylines cycle (count `author:` lines across `content/blog/*.mdx`; break ties with the person whose last post is oldest). If "BigSquare Team" is the only entry, use it. Never write a name that is not in the registry: the build fails on it.
7. Mark the topic done in `TOPICS.md` by appending ` [done YYYY-MM-DD]` to the END of its line. Do not delete or reorder lines.
8. Run `npx tsc --noEmit` and `npm run build`. A frontmatter mistake fails the build with the file name in the error (an unknown `resource` slug fails too). Fix anything you broke.
9. Create a branch `blog/<slug>`, commit the post and `TOPICS.md`, and open a pull request titled `blog: <post title>`. The PR body: the target keyword, the internal links used, the word count, the list of new asset slot ids (`cover` and every `<Figure id>`) with their notes so a human can add them to `project-guidelines/asset-manifest.md`, and any `[PLACEHOLDER]` lines a human must fill before merge.

Do not touch any file outside `content/blog/`. Do not merge. If `TOPICS.md` has no open topics, open an issue titled "Blog topic queue is empty" and stop.
