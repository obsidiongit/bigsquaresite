# Blog writer routine: prompt (updated 2026-08-30 to match the built pipeline)

Paste this as the routine's prompt when creating it with `/schedule`. The cloud agent starts with zero context, so it is self-contained. The contract it relies on is real as of 2026-08-30: `content/blog/<slug>.mdx` with YAML frontmatter, `lib/blog.ts` reads the folder at build time, drafts never render, `npm run build` fails loudly on bad frontmatter.

---

You are writing one SEO blog post for BigSquare Marketing's website (Next.js, MDX). Work only inside this repo. Steps:

1. Read `project-guidelines/copy-rules.md` and `project-guidelines/project-brief.md` first. Every rule there applies: third to fifth grade reading level, short sentences, no banned words (no "AI-powered", "automation", "leverage", "seamless", and the rest of the list), no em dashes (use a period, comma, or colon), no semicolons, numerals for every number, sentence case headlines. Never invent statistics, client names, reviews, awards, or partner claims. If a fact needs a source you do not have, write `[PLACEHOLDER: what is needed]` instead, or write the sentence without the number.
2. Read `content/blog/TOPICS.md`. Take the FIRST line under "Queue" that does not end in `[done ...]`. The line has 4 fields split by ` | `: the working title, `keyword:`, `angle:`, and `link:` (the one internal page the post must link to).
3. Open one existing post in `content/blog/` and copy its frontmatter shape exactly.
4. Write the post to `content/blog/<slug>.mdx`. The slug is lowercase letters, numbers, and hyphens only, and it becomes the URL `/blog/<slug>/`. 900 to 1400 words. Start the body with a short intro, then H2 sections (`##`). Never write an H1: the page renders the title as the H1. Short paragraphs, a plain-spoken expert voice. BigSquare is a full-stack marketing agency (search, ads, web, and creative) that serves franchise and multi-location brands, ecommerce brands, software brands, and single-location businesses. Never write as if franchise is the only audience. Link the `link:` page plus 1 or 2 more relevant internal pages under `/services/`, `/industries/`, `/locations/`, or `/results/` (check the route exists in `app/(marketing)/` or the registries in `lib/service-pages/registry.ts` and `lib/industry-pages/registry.ts`). Use markdown links with site-relative paths and trailing slashes. End with one short call to action linking to `/audit/` or `/schedule/`.
5. Frontmatter, exactly these keys:
   ```
   ---
   title: "Under 60 characters, sentence case"
   description: "Under 155 characters, no em dashes"
   date: "YYYY-MM-DD"
   author: "BigSquare Team"
   tags: ["Two", "To four", "Tags"]
   draft: false
   ---
   ```
   `date` is today in ISO form. `tags` is an inline list of 2 to 4 short labels (reuse existing tags where one fits: Reporting, Paid Advertising, SEO, Local Search, Multi-Location, Agencies). Reading time is computed by the site; do not add it.
6. Mark the topic done in `TOPICS.md` by appending ` [done YYYY-MM-DD]` to the END of its line. Do not delete or reorder lines.
7. Run `npx tsc --noEmit` and `npm run build`. A frontmatter mistake fails the build with the file name in the error. Fix anything you broke.
8. Create a branch `blog/<slug>`, commit the post and `TOPICS.md`, and open a pull request titled `blog: <post title>`. The PR body: the target keyword, the internal links used, the word count, and any `[PLACEHOLDER]` lines a human must fill before merge.

Do not touch any file outside `content/blog/`. Do not merge. If `TOPICS.md` has no open topics, open an issue titled "Blog topic queue is empty" and stop.
