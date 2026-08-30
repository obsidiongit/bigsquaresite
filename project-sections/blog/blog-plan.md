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
| **Author card** | Photo + name + one line. "BigSquare Team" until Brad decides whether posts carry a person's name (a named author with a real bio helps E-E-A-T; BigSquare Team is honest and fine for launch) | Ghost square, mono chip | Brad: who is the author? |
| **Share + next** | Copy link, LinkedIn, X; then the more-posts strip that exists today | Built | Automatic |

Frontmatter additions for v2: `cover` (slot id), `coverAlt`, `takeaways` (list), `resource` (a `/resources/` slug, optional), `quote` (optional). All optional so the two launch posts and the routine keep working; the loader ignores keys it does not know.

MDX components to add in `mdx-components.tsx` (writer-facing, plain names): `<Takeaways>`, `<Figure id note alt aspect>`, `<Quote>`, `<Callout title>`, `<Table>` styling for GFM tables (needs the `remark-gfm` plugin, string-named like `remark-frontmatter`; add to PROJECT_REQUIREMENTS.md).

Estimated build: 1 session for the anatomy + components + retrofitting the 2 posts, half a session for the cover template with the designer, and 1 row per slot in `asset-manifest.md`.

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
