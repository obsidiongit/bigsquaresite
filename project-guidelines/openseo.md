# OpenSEO on this site

Copied into the repo so any local checkout (Mike, Brad, an agent) has the same SEO workflows. Source: `Desktop/Projects/open-seo` (every-app/open-seo).

The skills tell the agent *how* to do keyword research, audits, clustering, local SEO, and the rest. Live data still needs an OpenSEO login.

## What is in the repo

Nine skills, copied into both skill folders so Claude Code and Cursor both see them:

- `seo-project-setup`
- `seo-coach`
- `seo-audit`
- `keyword-research`
- `keyword-clustering`
- `competitive-landscape`
- `competitor-analysis`
- `local-seo`
- `link-prospecting`

Folders: `.agents/skills/<name>/` and `.claude/skills/<name>/`.

Project MCP pointer: `.cursor/mcp.json` (hosted URL `https://app.openseo.so/mcp`). First use asks you to sign in. No API key lives in the repo.

## First session on a new machine

1. Open this repo in Cursor or Claude Code.
2. Approve the OpenSEO MCP login when prompted (Cursor: Settings → Tools → MCP).
3. Create or pick the OpenSEO project for `www.bigsquaremarketing.com`.
4. Run **SEO Project Setup**. That stores goals, positioning, competitors, and key pages so later skills reuse them.
5. After DNS is live, connect Google Search Console on that OpenSEO project.

## Which skill to run

| Need | Skill |
|---|---|
| Unsure what to do next | `seo-coach` |
| One-page “fix this first” report | `seo-audit` (after www DNS works) |
| Volumes and difficulty for titles | `keyword-research` |
| Which URL owns which term; Wave 2 slugs | `keyword-clustering` |
| Who wins the market | `competitive-landscape` |
| Deep look at Youtech, Scorpion, or Ignite | `competitor-analysis` |
| Denver / Tampa Maps | `local-seo` (after office addresses exist) |
| Sites that might link to a case study or guide | `link-prospecting` |

Seed keywords and page families: `seo-requirements.md`. Copy still follows `copy-rules.md`. OpenSEO can name a keyword. It cannot invent a client, a number, or a badge.

Project memory lives in OpenSEO, not a second file in this repo. Do not duplicate goals or competitor lists here.
