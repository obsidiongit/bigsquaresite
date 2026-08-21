# Agent Skills for This Project

Which skills are installed, where they came from, and when to invoke them. Researched August 2026. Read every SKILL.md before installing. Prefer official sources (Anthropic, Vercel, shadcn, GreenSock) and named authors with a track record.

All install commands use the skills CLI and work in Cursor and Claude Code:
`npx skills add <owner/repo> --skill <name>`

## Tier 1: installed on day one

| Skill | Source | Job | Install |
|---|---|---|---|
| frontend-design | Anthropic (official) | Design direction. Stops template output. | `npx skills add anthropics/skills --skill frontend-design` |
| impeccable | Paul Bakaus | Opinionated craft on top of frontend-design. Use brand mode. Commands: audit, polish, critique, animate, bolder, quieter. | `npx skills add pbakaus/impeccable` |
| web-design-guidelines | Vercel (official) | Review pass. Audits UI against Vercel's Web Interface Guidelines, fetched fresh each run. | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` |
| vercel-react-best-practices | Vercel (official) | Next.js performance rules, ordered by impact. Keeps Core Web Vitals green. | `npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices` |
| shadcn | shadcn (official) | Correct shadcn CLI workflow, registry search before custom UI, semantic tokens only. | `npx skills add shadcn/ui --skill shadcn` |
| tailwind-design-system | wshobson/agents | Tailwind v4 CSS-first config with @theme, design tokens, component variants. Required by decisions.md before setup. | `npx skills add wshobson/agents --skill tailwind-design-system` |

## Tier 2: copy

| Skill | Source | Job | Install |
|---|---|---|---|
| humanizer | blader | Rewrite pass. Removes 35 documented AI writing patterns. Never invents facts. Accepts a writing sample to match voice. | `npx skills add blader/humanizer` |
| avoid-ai-writing | conorbronsdon | Audit pass. Detect mode flags patterns without rewriting. Two-pass check. 112-entry word table. | `npx skills add conorbronsdon/avoid-ai-writing` |
| copywriting | coreyhaines31/marketingskills | Conversion copy frameworks. Reads a product-marketing context file first. | `npx skills add coreyhaines31/marketingskills --skill copywriting` |
| cro | coreyhaines31/marketingskills | Conversion review of a finished page. | `npx skills add coreyhaines31/marketingskills --skill cro` |
| seo-audit | coreyhaines31/marketingskills | Technical and on-page SEO audit with a prioritized fix list. | `npx skills add coreyhaines31/marketingskills --skill seo-audit` |

Setup for the copywriting skill: copy `project-brief.md` to `.agents/product-marketing.md` so the skill finds it automatically.

## Tier 3: situational

| Skill | Source | Job | Install |
|---|---|---|---|
| accessibility | Addy Osmani | WCAG 2.2 playbook with correct and incorrect code pairs. | `npx skills add addyosmani/web-quality-skills --skill accessibility` |
| gsap skills | GreenSock (official) | Only if Framer Motion is not enough for the hero or scroll work. SSR-safe React patterns. | `npx skills add greensock/gsap-skills` |
| animation-vocabulary | Emil Kowalski | Names the exact motion effect you want before you prompt for it. | `npx skills add emilkowalski/skills --skill animation-vocabulary` |
| react-three-fiber | anthemflynn/ccmp | Only if Three.js is used. Current R3F and drei version pins. | `npx skills add anthemflynn/ccmp --skill react-three-fiber` |
| webapp-testing / Playwright MCP | Anthropic / Microsoft | The agent screenshots its own work across breakpoints and fixes what it sees. Biggest single quality lever. | Install Playwright MCP in Cursor settings, or `npx skills add anthropics/skills --skill webapp-testing` |

## Not installing

- taste-skill (Leonxlnx): good, but it is a second direction skill and will fight frontend-design and the locked brand sheet.
- ui-ux-pro-max and similar catch-all bundles: superseded by the stack above.
- Any marketplace skill without a readable SKILL.md and a known author.

## When each skill runs

| Step | Skill(s) |
|---|---|
| Phase 2, generate STYLE_GUIDE.md | frontend-design, impeccable (brand mode), shadcn |
| Build a section | frontend-design, impeccable, shadcn, vercel-react-best-practices |
| Write or revise copy for a section | copywriting, then avoid-ai-writing (detect), then humanizer (rewrite with copy-rules.md and a writing sample) |
| Review a finished section | web-design-guidelines, accessibility, `impeccable critique`, Playwright screenshots at 375 / 768 / 1280 / 1536 |
| Before shipping a page | seo-audit, cro, vercel-react-best-practices |
| Any animation work | animation-vocabulary to name it, gsap skills only if Framer Motion falls short |
| Three.js section | react-three-fiber |

## Rules
- Copy skills never override `copy-rules.md`. If a skill suggests a banned word or an em dash, the rule file wins.
- Design skills never override `STYLE_GUIDE.md` or the palette and fonts in `0.design-moodboard.md`. Font bans inside frontend-design do not apply to Bluu Next or Apfel Grotezk.
- No skill may add a dependency without listing it in PROJECT_REQUIREMENTS.md.
