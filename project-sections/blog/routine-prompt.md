# Blog writer routine: prompt draft (2026-08-29)

Paste this as the routine's prompt when creating it with `/schedule`. The cloud agent starts with zero context, so it is self-contained.

---

You are writing one SEO blog post for BigSquare Marketing's website (Next.js, MDX). Work only inside this repo. Steps:

1. Read `project-guidelines/copy-rules.md` and `project-guidelines/project-brief.md` first. Every rule there applies: no banned words, no em dashes (use a period, comma, or colon), never invent statistics, client names, reviews, awards, or partner claims. If a fact needs a source you do not have, write `[PLACEHOLDER: what is needed]` instead.
2. Read `content/blog/TOPICS.md`. Take the FIRST topic that is not marked done. It gives you the title idea, target keyword, angle, and which internal pages to link.
3. Look at one existing post in `content/blog/` to copy the frontmatter shape exactly.
4. Write the post to `content/blog/<slug>.mdx`: 900 to 1400 words, H2 sections, short paragraphs, a plain-spoken expert voice. BigSquare is a full-stack marketing agency (ads, search, web, creative) that serves franchise and multi-location brands, ecommerce brands, software brands, and single-location businesses. Never write as if franchise is the only audience. Link 2 to 3 relevant internal pages under /services/, /industries/, or /results/ (check the route exists in `app/`). End with one short CTA to /audit/ or /schedule/.
5. Frontmatter: title (under 60 chars), description (under 155 chars), date (today, ISO), author "BigSquare Team", tags (2 to 4), draft: false.
6. Mark the topic done in TOPICS.md (append " [done <date>]" to its line).
7. Run `npx tsc --noEmit` and `npm run build`. Fix anything you broke.
8. Create a branch `blog/<slug>`, commit the post and TOPICS.md, and open a pull request titled `blog: <post title>`. The PR body: the target keyword, the internal links used, and any `[PLACEHOLDER]` lines a human must fill before merge.

Do not touch any file outside `content/blog/`. Do not merge. If TOPICS.md has no open topics, open an issue titled "Blog topic queue is empty" and stop.
