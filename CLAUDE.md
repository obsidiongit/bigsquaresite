# BigSquare Marketing Website: Project Rules

These rules apply to every agent session in this repo (Claude, Composer, or any other agent in Cursor).

## Read first, every session
1. `project-guidelines/project-brief.md` (what we are building and for whom)
2. `project-guidelines/copy-rules.md` (how every word on the site must read)
3. `project-guidelines/STYLE_GUIDE.md` (the authoritative design system)
4. `project-guidelines/tasks.md` (what is left) and `project-guidelines/sitemap.md` (the single endpoint status tracker)
5. `project-guidelines/decisions.md` (locked decisions D1 to D6 and amendments)
6. The spec file for whatever you are building in `project-sections/` (specs exist for unbuilt pages only)

History, old handoffs, the build log, and briefs of already-built pages live in `project-guidelines/archive/`. Move things there when they go stale; never delete from it.

## Style guide governance
`project-guidelines/STYLE_GUIDE.md` is the authoritative design system once it exists.

When building any section or page:
- Follow the style guide for all design decisions.
- If a design choice is reusable (spacing, color pairing, component pattern), document it in STYLE_GUIDE.md.
- If it is specific to one section, keep it in that section's spec file only.

If your implementation looks better than what the style guide says:
1. Keep the better implementation.
2. Update STYLE_GUIDE.md to match.
3. Add a changelog entry at the bottom of STYLE_GUIDE.md noting what changed and why.

Never silently diverge from the style guide.

## Copy governance
`project-guidelines/copy-rules.md` is authoritative for all text on the site.
- Never write placeholder copy and leave it looking finished. Wrap anything you are unsure about in `[PLACEHOLDER: what is needed]`.
- Never invent statistics, client names, reviews, awards, or partner status. If a number is not in a spec file, it does not go on the site.
- Never use the banned words list in copy-rules.md.
- No em dashes anywhere in user-facing text. Use a period, a comma, or a colon.

## Build protocol
- Work in batches per the batch plan in tasks.md (Brad, 2026-08-27); one review round with Brad per batch, not per page. A new template type still gets one green-lit flagship, reviewed inside the batch, and only Brad checks a gate box.
- Hero first on any new page. It sets the visual tone for everything below it.
- Check mobile after every section before marking the task done.
- Update `project-guidelines/tasks.md` checkboxes and the STATUS column in `project-guidelines/sitemap.md` as you complete work.
- Do not install a dependency that is not listed in PROJECT_REQUIREMENTS.md without adding it there first with a one-line reason.

## Stack (locked for v1)
Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Three.js (only where a spec file asks for it), MDX for blog content, hosted on Vercel.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
