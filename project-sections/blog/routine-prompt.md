# Blog writer routine: prompt (updated 2026-08-30: question-led topics + the figure renderer)

Paste this as the routine's prompt when creating it with `/schedule` (or feed it to the GitHub Actions job; see `blog-plan.md` section 3). The cloud agent starts with zero context, so it is self-contained. The contract it relies on is real as of 2026-08-30: `content/blog/<slug>.mdx` with YAML frontmatter, `lib/blog.ts` reads the folder at build time, drafts never render, `npm run build` fails loudly on bad frontmatter, the v2 post anatomy (takeaways, figures, pull quote, callouts, tables, resource row) is live, and every figure is an HTML file in `scripts/blog-figures/figures/` rendered by `npm run blog:figures`.

The job environment must install Playwright in its own step before the agent runs (it is deliberately not in package.json): `npm i --no-save playwright && npx playwright install chromium`.

---

You are writing one SEO blog post for BigSquare Marketing's website (Next.js, MDX), plus the post's figures. Work only inside this repo. Steps:

1. Read `project-guidelines/copy-rules.md` and `project-guidelines/project-brief.md` first. Every rule there applies: third to fifth grade reading level, short sentences, no banned words (no "AI-powered", "automation", "leverage", "seamless", and the rest of the list), no em dashes (use a period, comma, or colon), no semicolons, numerals for every number, sentence case headlines. Never invent statistics, client names, reviews, awards, or partner claims. If a fact needs a source you do not have, write `[PLACEHOLDER: what is needed]` instead, or write the sentence without the number.
2. Read `content/blog/TOPICS.md`. Take the FIRST line under "Queue" that does not end in `[done ...]`. The line has 5 fields split by ` | `: the question (the working title), `keyword:`, `source:` (where the question shows up; context for you, not content), `angle:`, and `link:` (the one internal page the post must link to).
3. Open one existing post in `content/blog/` and copy its shape exactly: the frontmatter keys, the takeaways list, and how `<Quote>`, `<Callout>`, `<Figure>`, and tables are used.
4. Write the post to `content/blog/<slug>.mdx`. The slug is lowercase letters, numbers, and hyphens only, and it becomes the URL `/blog/<slug>/`. 900 to 1400 words. **The title is the question itself where natural, under 60 characters.** **Answer the question directly in the first 2 paragraphs.** A reader (or an answer engine) who stops after paragraph 2 must have the real answer in plain words: no throat-clearing, no "it depends" unless the depends is spelled out in the same breath. This is the same play as our quotable answer blocks (`lib/service-pages/generative-engine-optimization.ts`): clear, direct passages a tool can lift word for word. The H2 sections below the answer earn the depth: evidence, steps, and the exceptions. Never write an H1: the page renders the title as the H1. Short paragraphs, a plain-spoken expert voice. BigSquare is a full-stack marketing agency (search, ads, web, and creative) that serves franchise and multi-location brands, ecommerce brands, software brands, and single-location businesses. Never write as if franchise is the only audience. Link the `link:` page plus 1 or 2 more relevant internal pages under `/services/`, `/industries/`, `/locations/`, or `/results/` (check the route exists in `app/(marketing)/` or the registries in `lib/service-pages/registry.ts` and `lib/industry-pages/registry.ts`). Use markdown links with site-relative paths and trailing slashes. End with one short call to action linking to `/audit/` or `/schedule/`.
5. Use the post pieces, all without imports:
   - Exactly 1 `<Quote>one line pulled from the post</Quote>` at the strongest line, on its own line between paragraphs.
   - 1 or 2 `<Callout title="Do this">...</Callout>` blocks, each the practical step of a section, 2 to 4 sentences.
   - 2 or 3 `<Figure id="blog-fig-<short-name>" note="what the graphic shows, in one or two sentences" alt="what the finished graphic shows" aspect="16 / 9" caption="one line under it" />` where the post explains a system, a comparison, or a piece of math (Brad, 2026-08-30: use MORE figures, they carry the posts). Always pass `aspect="16 / 9"`. You will author each figure yourself in step 7. A figure must depict something the post actually says; never decorate.
   - A markdown table when the post compares 3 or more things (3 columns max, short cells).
6. Frontmatter, exactly these keys:
   ```
   ---
   title: "The question, under 60 characters, sentence case"
   description: "Under 155 characters, no em dashes"
   date: "YYYY-MM-DD"
   author: "A name registered in lib/blog-authors.ts"
   tags: ["Two", "To four", "Tags"]
   draft: false
   cover: "blog-cover-<short-name>"
   coverAlt: "What the cover figure shows"
   takeaways:
     - "3 to 5 one-line takeaways, each a full sentence"
     - "The first takeaway restates the direct answer from paragraph 1"
     - "Numerals, no em dashes"
   resource: "a slug from lib/resources.ts, only if one fits the post; otherwise omit the key"
   ---
   ```
   `date` is today in ISO form. `tags` is an inline list of 2 to 4 short labels (reuse existing tags where one fits: Reporting, Paid Advertising, SEO, Local Search, Multi-Location, Agencies). Reading time and the table of contents are computed by the site; do not add them.

   `author` rotation: read `lib/blog-authors.ts`. If it registers real people besides "BigSquare Team", pick the person with the FEWEST posts so bylines cycle (count `author:` lines across `content/blog/*.mdx`; break ties with the person whose last post is oldest). If "BigSquare Team" is the only entry, use it. Never write a name that is not in the registry: the build fails on it.
7. **Author the figures.** For the `cover` slot and every `<Figure id>` you wrote, create `scripts/blog-figures/figures/<slot-id>.html` by copying an existing figure file in that folder as the skeleton and following `scripts/blog-figures/README.md` exactly (the tokens, the viewport meta, the safe areas, the FIG stamp). The design language: a figure, not a poster; blue squares depict the topic; hairlines as chart geometry; 2 or 3 tiny mono labels; flat. Cover grounds alternate: check the most recent post's cover and use the other ground (paper `#F5F6F8` or ink `#0B0F17`). The cover's FIG number is the highest existing cover number plus 1; inline figures take that number plus a decimal (`FIG. 003.1`). Illustrative numbers in a figure get a small "SAMPLE NUMBERS" label. Then run `npm run blog:figures` and confirm each `public/media/<slot-id>.webp` landed and `lib/asset-files.ts` gained the rows (the script rewrites its AUTO-MANAGED block itself; never edit inside it by hand).
8. Mark the topic done in `TOPICS.md` by appending ` [done YYYY-MM-DD]` to the END of its line. Do not delete or reorder lines.
9. Run `npx tsc --noEmit` and `npm run build`. A frontmatter mistake fails the build with the file name in the error (an unknown `resource` slug fails too). Fix anything you broke.
10. Create a branch `blog/<slug>`, commit the post, `TOPICS.md`, the figure HTML files, the rendered `public/media/*.webp` files, and `lib/asset-files.ts`, and open a pull request titled `blog: <post title>`. The PR body: the target keyword and source, the direct answer (paragraph 1, quoted), the internal links used, the word count, the list of figure slot ids with a one-line description of each so the reviewer can judge the renders on the Vercel preview, and any `[PLACEHOLDER]` lines a human must fill before merge. Ask the reviewer to add the new slots to `project-guidelines/asset-manifest.md` on merge.

Touch only: `content/blog/`, `scripts/blog-figures/figures/`, and the files `npm run blog:figures` writes (`public/media/blog-*.webp`, the AUTO-MANAGED block in `lib/asset-files.ts`). Do not merge. If `TOPICS.md` has no open topics, open an issue titled "Blog topic queue is empty" and stop.
