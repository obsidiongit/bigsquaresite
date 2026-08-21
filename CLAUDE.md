# BigSquare Marketing Website: Project Rules

These rules apply to every agent session in this repo (Claude, Composer, or any other agent in Cursor).

## Read first, every session
1. `project-guidelines/project-brief.md` (what we are building and for whom)
2. `project-guidelines/copy-rules.md` (how every word on the site must read)
3. `project-guidelines/STYLE_GUIDE.md` if it exists (the design system; created in Phase 2)
4. The section spec file for whatever you are building in `project-sections/`

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
- Build one section or page per session. Start a new chat for each.
- Hero first on any new page. It sets the visual tone for everything below it.
- Check mobile after every section before marking the task done.
- Update `project-guidelines/tasks.md` checkboxes as you complete work.
- Do not install a dependency that is not listed in PROJECT_REQUIREMENTS.md without adding it there first with a one-line reason.

## Stack (locked for v1)
Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Three.js (only where a spec file asks for it), MDX for blog content, hosted on Vercel.
