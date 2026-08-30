# Blog: what it is for, what v2 looks like, and how the scheduled writer gets set up

Written 2026-08-30 after Brad's review of the first two posts ("looks very bare bones, formatting is very basic, probably should be some placeholders for image assets"). This file is the plan. The pipeline itself is documented in `lib/blog.ts` and `routine-prompt.md`.

## 1. What the blog is for (and what it is not)

The blog has 2 jobs, in this order:

1. **Search.** Service and industry pages rank for "what we sell" searches. The blog ranks for the questions people ask before they know what to buy ("why is my cost per lead going up", "how many Google Business Profiles do I need"). Every post links 2 to 3 money pages, so the ranking flows to the pages that book calls. This is why the pipeline was built SEO-first: Article JSON-LD, canonical, sitemap, one H1, internal links, a topic queue keyed to keywords.
2. **Proof of thinking.** A prospect who reads 2 posts should feel "these people know the work." Sales can send a post instead of a pitch. This is the part that is bare today: the posts read like a text file.

What the blog is NOT: the place to "get published." Forbes, Entrepreneur, and the trade press are a separate motion (section 4). The blog feeds that motion with original takes, but a placement lives on their site, not ours.

## 2. Why the posts look bare, and the v2 post anatomy

Today a post is a title, a description, and paragraphs with H2s. That is fine for Google and thin for a human. The fix is not stock photos. Stock photos would make the site look like every agency site the brand is built to not look like. The fix is a designed post anatomy with a few reusable pieces, each with a placeholder that looks composed until the asset lands (the same MediaSlot workflow as the rest of the site).

Post anatomy v2, top to bottom:

| Piece | What it is | Placeholder today | Who fills it |
|---|---|---|---|
| **Cover figure** | One wide (2:1) editorial graphic per post: the blue-square system, big type, a figure number, no stock. Also becomes the post's OG image, so shares look designed | A `MediaSlot` with the designed placeholder (soft panel, ghost square, ASSET chip naming the shot) | Designer, from one cover template so each cover takes minutes |
| **Key takeaways** | 3 to 5 bullets in a soft panel right under the intro, mono eyebrow "In short" | None needed; the writer supplies the bullets | Writer (the routine prompt gets a step for it) |
| **Table of contents** | Auto-built from the H2s, shown for posts over ~900 words, sticky on desktop beside the spine | Built from headings | Automatic |
| **Inline figures** | 1 or 2 per post where the post explains a number or a system: a table (the "7 numbers" post), a simple diagram (the local-SEO "system" list wants one), or a screenshot of a real report | `<Figure>` MDX component wrapping MediaSlot, with the note describing the wanted graphic | Writer requests with a note; designer or Mike fills |
| **Pull quote** | One line from the post at `text-statement`, blue rule, mid-post | None needed | Writer picks the line |
| **Callout** | A short "do this" box for the practical step in each section | None needed | Writer |
| **Mid-post CTA** | One quiet ruled row: "Get the checklist" to the matching `/resources/` item, or the audit | Points at /resources/ (assets still owed) | Automatic, from a `resource:` frontmatter key |
| **Author card** | Photo + name + role + one line. DECIDED 2026-08-30: team members take the byline with real headshots, cycled per post. Registry: `lib/blog-authors.ts` (frontmatter `author` must match a registered name or the build fails, so nobody can be invented) | Ghost square, mono chip until headshots land | Brad: names + roles into `lib/blog-authors.ts`, headshots into `public/media/` |
| **Share + next** | Copy link, LinkedIn, X; then the more-posts strip that exists today | Built | Automatic |

Frontmatter additions for v2: `cover` (slot id), `coverAlt`, `takeaways` (list), `resource` (a `/resources/` slug, optional), `quote` (optional). All optional so the two launch posts and the routine keep working; the loader ignores keys it does not know.

MDX components to add in `mdx-components.tsx` (writer-facing, plain names): `<Takeaways>`, `<Figure id note alt aspect>`, `<Quote>`, `<Callout title>`, `<Table>` styling for GFM tables (needs the `remark-gfm` plugin, string-named like `remark-frontmatter`; add to PROJECT_REQUIREMENTS.md).

Estimated build: 1 session for the anatomy + components + retrofitting the 2 posts, half a session for the cover template with the designer, and 1 row per slot in `asset-manifest.md`.

## 2b. The cover template, exactly (for Brad or the designer)

BUILT-side contract is already live; this is the design side. One master frame, then every cover is a 10-minute duplicate-and-swap.

**Format and size**
- Canvas: **2400 x 1200 px (2:1)**. Export **WebP or JPG, under ~250KB** (next/image re-encodes, so JPG is fine).
- File name = the slot id: `blog-cover-<short-name>.webp` (the id is in the post's frontmatter and in `asset-manifest.md`). Drop it in `public/media/`, add one line in `lib/asset-files.ts`, done.
- On the page it shows full-width under the title: 2:1 on desktop, CSS-cropped to 16:9 on phones (a center crop that trims about 6% off each side). **Safe area: keep anything that matters inside the middle 88% of the width.**
- The social share card is generated separately from the title (dark typographic card, automatic), so the cover does NOT need to work at 1200x630 and does NOT need the title on it.

**Direction: a figure, not a poster**
The post title sits directly above the cover on the page, so the cover never repeats the headline, and the no-copy-baked-into-images rule stands. The cover is a diagram in the brand system, like a chart from a beautiful annual report:
1. Ground: paper `#F5F6F8` or ink `#0B0F17`. Alternate between posts. One blue only, `#0657F9`.
2. **The blue square is the protagonist, and it depicts the topic.** 7 squares in a row for the 7-numbers post. 1 big square next to a 4x5 grid of small ones for the local SEO post. The reader should get the idea before reading a word.
3. Hairlines as chart geometry: 1px rules, axes, brackets (`rgba(11,15,23,.12)` on paper, `rgba(233,236,241,.14)` on ink).
4. Lenia Mono for tiny labels, uppercase, 2 or 3 max ("FIG. 001", "COST PER LEAD", "N = 20"). Tiny diagram labels are the one text exception. Never a sentence, never the headline.
5. A **"FIG. 001" stamp** in a corner, incrementing with every post. That stamp is the series signature people start to recognize.
6. Flat. No gradients, no shadows, no photos, no stock, no 3D.

**Workflow**: one Figma (or Canva) file, a 2400x1200 master frame with the margins, the hairline grid, the FIG stamp, and a small library of square arrangements. Per post: duplicate, arrange the squares for the topic, swap 2 labels, bump the FIG number, export with the slot-id file name. The writer's `note` on each cover slot in `asset-manifest.md` is the brief.

## 2c. Cover + figure generation (history; superseded 2026-08-30, same day)

**PIVOT (Brad, 2026-08-30 evening): image-model generation is REJECTED** ("low quality, can't get the resolution or the size we need"; the Codex hand-off "too clunky"). The pipeline is now: **Claude authors each figure as an HTML/CSS element with the site's real fonts and tokens, Playwright screenshots it at 2x, and that render is the asset.** One agent end to end, covers AND inline figures (short videos of CSS-animated figures are the stretch goal). Build handoff: `project-guidelines/handoff-blog-engine.md`. The GPT prompt experiment below stays for the record only.

### The rejected image-gen path (for the record)

Brad's idea: instead of a hand-made cover per post, have an image model (GPT Image via Codex, or similar) generate the figure, using the template rules above as the prompt. Worth testing; the risks are mangled small text, gradients sneaking in, and off-brand geometry, so the human merge review must also approve the cover.

**Size gotcha**: GPT Image does not output 2:1. Generate landscape **1536 x 1024 (3:2)** with everything important in the central horizontal band, then **crop the middle to 2:1** (1536 x 768) and export WebP/JPG under 250KB with the slot-id file name. The prompt below bakes that in.

**The prompt template** (fill the 2 bracketed parts per post; the composition comes from the cover slot's note in `asset-manifest.md`):

> A minimalist flat geometric editorial figure for a premium marketing blog, landscape. Solid off-white background, hex F5F6F8, filling the entire frame. The only accent color is one saturated blue, hex 0657F9. Composition: [WHAT THE SQUARES DEPICT, e.g. "7 solid blue squares of equal size in a horizontal row sitting on a thin 1px light gray baseline rule, with the 3rd square drawn as an outline only"]. Add 1 or 2 hairline-thin 1px rules in very light gray (12 percent black) as chart geometry: a baseline, one small measurement bracket. Exactly 2 small text labels in a plain monospaced font, uppercase, dark charcoal, hex 0B0F17: "FIG. [NNN]" in the top left corner, and "[ONE SHORT LABEL, e.g. COST PER LEAD]" near the composition. The style is a precise data diagram from a high-end annual report: absolutely flat, no gradients, no shadows, no 3D, no texture, no photographs, no people, no illustrations, no decorative shapes beyond the squares and rules. Generous empty background margins on all sides. Keep the whole composition inside the central horizontal band of the frame so the image survives a center crop to a 2:1 strip.

Dark variant: swap the ground to "solid near-black, hex 0B0F17", the hairlines to "14 percent white", and the labels to "pale gray, hex E9ECF1". Alternate light and dark between posts.

Filled example, the 7-numbers post: composition = "7 solid blue squares of equal size in one horizontal row on a thin baseline rule, the last square slightly separated with a small bracket over it", labels = "FIG. 001" and "N = 7". The local SEO post: composition = "1 large solid blue square on the left, and to its right a 4 by 5 grid of 20 small blue squares connected by a single thin baseline rule", labels = "FIG. 002" and "N = 20".

**Judging the output**: reject anything with a gradient, a shadow, more than 1 blue, mangled or extra text, or a composition that fights the 2:1 crop. If 1 in 2 generations passes, this works.

**TEST PASSED 2026-08-30.** Brad's first GPT Image generation of the 7-numbers cover came back on-spec: 1 blue, clean squares on a baseline, the bracket, exactly 2 uncorrupted mono labels, flat ground. One lesson: the model puts the FIG stamp at the very top edge, so a blind CENTER 2:1 crop cuts it off. Crop rule, amended: pick the 2:1 window that keeps both the stamp and the composition (from a 1536x1024 output that is usually the TOP 1536x768). Green light to wire generation into the writer job per the paragraph below.

**No manual cropping or wiring (Brad, 2026-08-30, and the script is built)**: save the RAW generation as `assets/blog-covers/<slot-id>.png` exactly as downloaded, and headshot sources as `assets/team/<first-name>.jpg`. `npm run blog:assets` (`scripts/blog-assets.mjs`) does everything: top-anchored 2:1 crop for covers (keeps the FIG stamp), smart square crop for headshots, webp under the size cap into `public/media/`, and the AUTO-MANAGED block in `lib/asset-files.ts`. Idempotent; unknown names are skipped so a stray file can never invent an author. Any Claude session runs it on request, and the writer job runs it as its last step once generation is wired.

**Weaving into the cron job (later, after the manual test passes)**: the writer routine already outputs a cover slot id + a composition note per post. A second step (in the same routine or a follow-up job) calls the image API with this template + the note, saves the crop to `public/media/<slot-id>.webp`, adds the `lib/asset-files.ts` row, and pushes to the same PR, so the reviewer sees the finished post WITH its cover on the Vercel preview and can reject either. Needs an OPENAI_API_KEY (or whichever model wins the test) as a repo secret; the developer wires it when Brad's manual test looks good. Until then the cover stays a designed placeholder and merges are never blocked on it.

## 3. How the scheduled writer gets set up (for the developer)

Goal: a post lands as a pull request on a schedule, a human merges, Vercel deploys. Nothing publishes without a merge. Two ways to run the writer; pick one, both use the same prompt file (`project-sections/blog/routine-prompt.md`) and the same contract (`content/blog/TOPICS.md`, `lib/blog.ts`).

### Option A: Claude Code cloud routine (no code, fastest)

1. Install the Claude GitHub App on `obsidiongit/bigsquaresite`: https://claude.ai/code/onboarding?magic=github-app-setup (needs a repo admin; this is what blocked the `/schedule` check on 2026-08-29).
2. In Claude Code run `/schedule`, pick environment "Default" (`env_01Fx9mjBD667qMn9xcsXLP9G`), paste `routine-prompt.md` as the prompt, model `claude-sonnet-5`, cron `0 12 1,15 * *` (1st and 15th, 6:00am Denver) to start; `0 12 * * 1` (weekly) once the queue is deep.
3. Run it once by hand ("run now"), review the PR, fix the prompt if the post misses on voice or format, then let it ride.
4. Nothing else to build. The routine clones the repo, writes the post, runs the build, opens the PR.

Good when: the team is already on Claude Code cloud and does not want to own infrastructure. Cost is the Claude plan.

### Option B: GitHub Actions cron + Claude Code (owned in the repo)

Everything lives in `.github/workflows/blog-writer.yml`, versioned with the site, visible in the Actions tab.

1. Secrets: `ANTHROPIC_API_KEY` in the repo settings. The default `GITHUB_TOKEN` can open PRs once "Allow GitHub Actions to create and approve pull requests" is on (Settings, Actions, General).
2. Workflow shape:
   ```yaml
   name: blog-writer
   on:
     schedule: [{ cron: "0 12 1,15 * *" }]
     workflow_dispatch: {}
   jobs:
     write:
       runs-on: ubuntu-latest
       permissions: { contents: write, pull-requests: write, issues: write }
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with: { node-version: 22, cache: npm }
         - run: npm ci
         - run: npm i -g @anthropic-ai/claude-code
         - run: claude -p "$(cat project-sections/blog/routine-prompt.md)" --allowedTools "Read,Write,Edit,Bash(npm run build),Bash(npx tsc --noEmit),Bash(git *),Bash(gh *)" --max-turns 60
           env: { ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}, GH_TOKEN: ${{ github.token }} }
   ```
   The prompt already tells the agent to branch, commit, and open the PR with `gh`. Alternative to the CLI: the official `anthropics/claude-code-action`, or a 40-line Claude Agent SDK script if the developer wants a typed harness.
3. Cost is API tokens per run (one post is a few dollars at most).

Good when: the team wants the writer in the repo next to the site, with logs, retries, and no dependency on a hosted scheduler.

### Either way: the guard rails

- **Branch protection on `main`**: require a PR, require the Vercel build check to pass. `lib/blog.ts` throws with the file name on a bad slug, date, tags, or missing title, so a malformed post cannot merge.
- **Vercel preview on every PR**: the reviewer reads the post on the real design at the preview URL, not in a diff.
- **A copy lint in CI** (small, worth it): a script that fails the build if a post contains an em dash, a banned word from `copy-rules.md`, a semicolon in body copy, or fewer than 900 / more than 1400 words. Half a day; it also keeps human-written posts honest.
- **Topic supply**: `TOPICS.md` has 12 lines. The Ahrefs keyword pass should feed it 20 to 30 more, mixed across the lanes. When it runs dry the routine opens an issue instead of inventing a topic.
- **Review rhythm**: whoever merges reads for facts, not grammar. The writer is told to write `[PLACEHOLDER: needs source]` rather than invent a number; the reviewer's job is to fill or cut those lines before merge.

### SEO plumbing still worth adding (small, any session)

- `app/feed.xml/route.ts`: an RSS feed from `getAllPosts()`. Cheap, and the trade press and newsletter tools pull from it.
- Per-post OG image from the cover figure (`app/(marketing)/blog/[slug]/opengraph-image.tsx`) once covers exist; until then the brand OG image is inherited.
- Google Search Console: verify the domain, submit `/sitemap.xml` at launch. Bing Webmaster Tools imports from GSC in one click.
- A `/blog/tag/[tag]/` index only once there are 15+ posts; before that it is thin pages.

## 4. Publications (Forbes and the trade press) vs the blog

Getting BigSquare's name into Forbes is a PR motion, not a blog feature. What the blog does for it: it gives an editor proof that the person pitching has a point of view. Where to actually get placed, in rough order of effort:

- **Trade press first.** Franchise Update, Franchising.com, Search Engine Land, Search Engine Journal, Modern Restaurant Management, Home Service industry pubs. They take contributed articles with a real angle and a bio link. One placement a quarter is a realistic start.
- **Expert-quote services.** Qwoted, Featured.com, Help a B2B Writer: journalists post asks, you answer in a paragraph, you get a quote and a link. Cheap, steady, good for E-E-A-T.
- **Forbes.** Two doors: an editor picks up a story (rare, needs news), or the Forbes Agency Council (paid membership, contributor posts under your name). The Council is legitimate but it is pay-to-play; decide with eyes open.
- **Podcasts** in the franchise and home-services space are easier than any of the above and produce clips for social.

On the site: no "As seen in" logo row until there are real placements (copy-rules: never invent partner or press status). When there are 3 or more, add a `/press/` page (placements, a short boilerplate, a logo file, a contact) and a small logo row on /about/. Track this in tasks.md under Brad-owed content.

Recommendation: keep the blog as the thinking engine, aim the first 6 posts at topics that can double as pitches (the "7 numbers" post is already a trade-press pitch with a different headline), and start the quote services now because they cost nothing but attention.

## 5. Lead magnets (Brad, 2026-08-30: "not sure exactly what the lead magnets are going to be quite yet")

The 5 rows on `/resources/` are WORKING TITLES in `lib/resources.ts`, written to fit the wide positioning. They are placeholders in the honest sense: the page says so in a mono line, and every "Get It" logs a request instead of pretending to download. When Brad's whiteboard turns into a list, the change is 5 rows in `lib/resources.ts`, the 5 spec files in `project-sections/lead-magnets/`, then the assets themselves. Suggestion for picking them: each lead magnet should be the natural "next step" from one blog topic cluster, so the mid-post CTA (section 2) has something real to point at.
