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

## Next build order (interior-buildout-plan.md governs)

1. **Confirm the Lane 1 gate with Brad**: /schedule/ round 4 awaits his green-light (tasks.md Phase 7 GATE box). Its own opens: VSL film + poster (`lib/schedule-media.ts` one-line swap), his copy pass, Mike's GHL API wiring (server-side only).
2. After the gate: **/audit/** (real form on the shared `Field` primitive; a round-3 handoff for it was already issued in the Lane 1 session), then **/contact/** (form + FAQ block per D5), then **/about/** (company/about.md needs its design-brief pass first).
3. **/results/ index + case-study template polish** (HARD-GATED on real client data; the "1 case study link" SEO rule on every T2/T3 page waits with it).
4. **/locations/** hub + denver + tampa (LocalBusiness JSON-LD; office facts pending).
5. Phase 5 funnels (/go/, /apply/, /thanks/; alternate palettes sanctioned, D6), /ad-credit/ (blocked on terms), lead magnets (blocked on assets).
6. Phase 6 blog (MDX pipeline + 2 posts), then the D4 franchise URL family (~10 T2 variants, needs the Ahrefs keyword pass).
7. Homepage punch list + 2J (metadata/OG/favicon/Lighthouse) + 2K cube sessions interleaved.

New templates (case study, funnel, lead magnet, blog post) each get the FLAGSHIP GATE: build one, Brad green-lights, then stamp.

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
