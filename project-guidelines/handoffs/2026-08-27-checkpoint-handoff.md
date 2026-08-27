# Checkpoint handoff, 2026-08-27

Written at the major checkpoint commit `dd63ae5` (pushed to origin/main; prod build + typecheck verified green on exactly that tree). The three-lane parallel build is over; work continues single-agent from here. Read this, then CLAUDE.md's read-first list, then `tasks.md` for the live checkboxes.

## Where the site stands

**33 public endpoints resolve. 23 are real pages:**
- `/` homepage (~85%: all sections shipped, punch list remains)
- `/schedule/` v2 (VSL + 5-step application form, round 4)
- `/services/` hub + all 15 service pages (T2 stamped, 3 hero variants, 10 UI fragments)
- `/industries/` hub + franchise, home-services, legal, healthcare (T3 stamped, interactive boards, 1,500+ words each)

**10 are shells:** `/audit/` (Phase 1 stub), `/results/` (stub) + 6 noindex case-study skeletons, `/privacy-policy/` + `/terms/` (legal skeletons).

**10 launch URLs still 404** (8 linked from nav/footer today): /about/, /leadership/, /careers/, /contact/, /blog/, /resources/, /locations/ + denver + tampa, /ad-credit/. Plus unbuilt: 2 blog posts, 5 lead magnets, the /go/ /apply/ /thanks/ funnel templates.

Launch target per sitemap.md is ~55 endpoints: we are 23 real + 10 shells in, roughly **22 pages from route-complete**, and several of those are content-blocked, not build-blocked.

## Next, in order (revised 2026-08-27 after Brad's checkpoint review)

**The /schedule/ gate is APPROVED (Brad, 2026-08-27).** All three template gates are now open. Brad's process notes, binding from here: sessions and docs are getting too verbose, keep everything simple and plain; no more one-page-at-a-time builds, work in BATCHES now that the templates are proven; new template types (funnel, blog post, lead magnet, case study) still get one green-lit flagship before stamping, but that review rides inside the batch.

**Job 1, cleanup (do this FIRST, docs only, one session):** consolidate the project docs to a small source of truth. Create `project-guidelines/archive/` and MOVE (never delete) everything historical into it: build-log.md, old handoffs, competitor-sitemaps/, interior-buildout-plan.md (its decisions are already recorded in decisions.md), and the briefs of ALREADY-BUILT sections/pages. The living set that remains: CLAUDE.md, tasks.md, STYLE_GUIDE.md, copy-rules.md, decisions.md, sitemap.md, asset-manifest.md, plus specs for UNBUILT pages only. Give sitemap.md a STATUS column per URL (built / shell / 404 / blocked-on-content) so it becomes the single endpoint tracker; trim tasks.md to only what is left to do; update CLAUDE.md's read-first list to match. Touch nothing in app/, components/, or lib/; run `npm run build` after to prove it. Commit before and after.

**Job 2, batch builds:**
1. Batch 1: /audit/, /contact/, /about/ in one push (specs in conversion/ + company/; about needs its design-brief pass first). One review round with Brad for the batch, not per page.
2. Batch 2: /locations/ hub + denver + tampa, /results/ real index (case-study content stays gated on real data), /careers/.
3. Batch 3: funnel templates (/go/, /apply/, /thanks/ — one flagship each inside the batch; alternate palettes per D6) + /ad-credit/ when terms exist.
4. Batch 4: blog pipeline + 2 posts, lead magnets as assets land, then the D4 franchise family after the keyword pass.
5. Interleaved: homepage punch list, 2J metadata/OG/favicon/Lighthouse, 2K cube sessions, the registration-mark removal sweep, Brad's sitewide copy pass.

## Brad-owed content (blocks marked pages, nothing else)

Consolidated in tasks.md's homepage punch list plus: ~37 asset slots in `asset-manifest.md` (drop files in public/media/, one row each in `lib/asset-files.ts`), the schedule VSL film, real case studies + metrics + testimonials, leadership names/photos, office phones/addresses, socials, logo file, legal copy, ad-credit terms, lead-magnet assets, keyword pass, FORM_WEBHOOK_URL + tracking IDs. Mike: GHL API wiring.

## Standing rules that bite (recorded in STYLE_GUIDE/decisions.md/build-log)

- Open layout sitewide (D1); instrument layer retired; **no registration-mark plus signs on ANY newly built page** (Brad: "corny"); existing marks await his site-wide audit.
- **Audience rule**: conversion surfaces never read franchise-only (ecommerce + single-location serve too; step order and FAQ already fixed; project-brief.md's positioning line may still want his amendment).
- Copy: copy-rules.md governs; sitewide copy gets Brad's one large sweep later, so keep flagged drafts, never silent placeholders. End every session with a SIMPLE list of what was built (his standing note).
- Forms: single submitForm path, in-place confirmation, shared `Field`. NewsletterForm's migration to Field is a queued homepage-session follow-up.
- Verification per page before checkoff: 375/768/1280/1536 + reduced motion, no overflow, JSON-LD probe, typecheck; stop any dev server before `npm run build`.
- Known nit with ONE owner needed: the shared FAQ accordion has no open/close height animation (keyframes never defined). One-file fix in a quiet window.
- Unrecorded reviews to confirm with Brad: 2G1 (First 90 Days round 2), 2I (footer), cube reform round 14 — he may have already approved these verbally; record and check off if so.

Session history convention: build rounds and verdicts go in `build-log.md`, one-liners in `tasks.md`.
