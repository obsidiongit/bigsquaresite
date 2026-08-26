# Interior Buildout Plan

**Status: v1.2, 2026-08-25. LOCKED. All six decisions are made (D1-D6, Brad, same day); this plan is the working spec for the interior buildout.** The D1 style-guide hard update is DONE; the doc-hygiene queue (section 7) is DONE (decisions.md Amendments 2026-08-25). Lane briefs for the three parallel agents are in the appendix. Sources: full project audit run 2026-08-25 (homepage link map, competitor sitemap synthesis, spec inventory, design-vocabulary handoff, constraints sweep).

The goal: a template system of 5 to 10 page templates that covers every URL in sitemap.md, lets us build multiple pages in tandem without AI-slop sameness, and gives every page a real SEO or conversion job. Youtech remains the structural model; Scorpion and Ignite tell us which URL families rank.

---

## 1. Where every path points today

8 routes exist. Everything else a visitor can click 404s.

**Real:** `/` only.

**Stubs (Phase 1 placeholder cards):** `/schedule/`, `/audit/`, `/results/`. Every CTA on the homepage funnels into the first two: nav "Let's Talk", Solution's pair, Search's "Find Out Where You Show Up", Services' pair, First 90 Days' "Schedule a Call", ProofBand and Featured Work point at `/results/`.

**Skeletons:** `/results/case-study-01..06/` (noindex, placeholder content, reached from the 6 featured-work cards), `/privacy-policy/`, `/terms/` (legal headings, placeholder copy).

**404s reachable from nav, footer, or homepage sections (27 distinct URLs):**
- All 15 `/services/<slug>/` pages (nav overlay, Services spotlight index, footer, portal "Tour the Portal" → obsidion-portal)
- `/services/#organic-marketing` + 2 more group-head anchors. **sitemap.md has no `/services/` page at all**, so these links have no planned target (decision D2)
- All 4 `/industries/<slug>/` pages (nav overlay)
- `/about/` (nav, footer, and the hero card-beat "How We Work" link), `/leadership/`, `/careers/` (nav + footer)
- `/contact/` (nav row 05), `/blog/` and `/resources/` (footer Company column)
- `/locations/denver/`, `/locations/tampa/` (footer)

Planned in sitemap.md but linked from nowhere: `/industries/`, `/locations/`, `/ad-credit/` (popup-only by design). Nav/footer IA otherwise matches sitemap.md column for column; deliberate deviations are recorded in the footer brief.

## 2. What the competitor sitemaps teach

Full analysis lives with the audit; the numbers that matter:

| | Scorpion | Youtech | Ignite |
|---|---|---|---|
| Total URLs | 1,518 | 209 | 1,510 |
| Engine | Industry hubs as mini-sites, each with its own blog subtree | 75 templated case studies + industry pages | 1,273-post blog + 39 services + franchise URL family |
| Template evidence | Identical service-slug sets stamped per vertical | WordPress custom post types (jobs sitemap), mechanical city-page naming | One child sitemap per custom post type = one template each |

Convergent findings:
- **Industry pages are the SEO engine in all three.** Sub-verticals (HVAC under home services, family law under legal) are the named expansion path in all three "what we are missing" notes.
- **Ignite's franchise family is our biggest keyword gap**: `/franchise-seo/`, `/franchise-marketing-company/`, `/multi-location-marketing-agency/`, `/multi-location-seo/` and 6 more. We are the franchise agency and own none of these URLs (decision D4).
- **Case studies at volume**: Youtech runs 75 on one template with a grid that scales; Ignite adds two filter axes (industry, brand type). Our `/results/` index should plan for both filters.
- **Blog volume is the moat** for the two big sites (333 and 1,273 posts); Youtech's near-empty blog is the gap we exploit at 2 MDX posts/week.
- **Anti-patterns to skip**: Scorpion's 5-to-6-level URL nesting and per-industry duplicated blogs (one canonical blog with topic filters instead); Ignite's no-office city-page spam (we hold to Denver and Tampa); campaign one-offs and thank-you pages left in the public XML sitemap.

## 3. The template system (proposal: 9 templates)

Every sitemap.md URL maps to exactly one. "Posture" is the design register pending decision D1.

| # | Template | URLs at launch | Scales to | SEO contract | Spec status |
|---|---|---|---|---|---|
| T1 | **Conversion page** | /schedule/, /audit/, /contact/, /ad-credit/ | rarely grows | Indexable, thin by design; form/booking is the hero | conversion/* specs USABLE AS-IS |
| T2 | **Service page** | 15 /services/ + /services/ hub (D2) | +10 franchise/multi-location variants (D4) | 800+ words, Service JSON-LD, answer block, FAQ block, links 2 industries + 1 case study | template NEEDS light rewrite (zero design direction; process card variant to spec) |
| T3 | **Industry page** | /industries/ hub + franchise, home-services, legal, healthcare | sub-verticals (30+, post-launch) | 1,500+ words, answer block, FAQ, links 3-4 services + 1 case study | template NEEDS rewrite (leans on the retired homepage 90-day set piece); hub page has NO spec |
| T4 | **Location page** | /locations/ hub + denver, tampa | third office someday (do not name it) | LocalBusiness JSON-LD, real office info only | NEEDS light rewrite (grid-era styling) |
| T5 | **Case study + results index** | /results/ + 5-6 studies | Youtech runs 75 | Title "[Result] for [Client type]", per-page OG, two-filter index | templates NEED light rewrite; HARD-GATED on real client data |
| T6 | **Company editorial** | /about/, /leadership/, /careers/ | stays 3 | Modest; about carries the brand story + E-E-A-T | NEEDS rewrite (all pre-pivot); /leadership/ gated on real people |
| T7 | **Funnel kit** | /go/[slug], /apply/[slug], /thanks/[slug] | unlimited ad pages | noindex (already enforced in robots.ts), no nav/footer, alternate palettes sanctioned here only | vsl + application + thanks templates USABLE AS-IS |
| T8 | **Lead magnet** | /resources/ hub + 5 pages | grows with assets | Indexable, per-page OG | template USABLE; all 5 magnets are empty stubs, HARD-GATED on assets |
| T9 | **Blog** | /blog/ + 2 launch posts | 2/week, the long moat | Article + BreadcrumbList JSON-LD, links 1 service + 1 industry per post | NO spec exists; MDX stack locked |

Not templated (bespoke one-offs): legal pages (skeletons exist), /dev/styleguide.

Nine templates, and T2/T3 carry nearly all future URL growth: the franchise variants ride T2, sub-verticals ride T3, every new ad campaign rides T7.

### The endpoint count, now and at the end

| Milestone | Endpoints | What's in it |
|---|---|---|
| **Built today** | **13** | /, /schedule/, /audit/, /results/, 6 case-study skeletons, /privacy-policy/, /terms/, /dev/styleguide (dev-only). Only 5 are in the XML sitemap |
| **Launch (all 9 templates stamped)** | **~55** | Core 11 + 5-6 case studies + 16 services (15 + hub) + 5 industries + 3 locations + 3 blog (index + 2 posts) + 6 resources (index + 5 magnets) + 3-6 noindex funnel pages |
| **+ D4 franchise family and first sub-vertical wave** | **~75-85** | ~10 franchise/multi-location T2 variants + 15-25 T3 sub-verticals (HVAC, plumbing, roofing, family law, personal injury, med spas...) |
| **12 months of the content engine** | **150-250** | Blog at 2/week is ~100 posts/year; case studies grow toward Youtech's 75; funnels and magnets accumulate per campaign |

So the 150+ intuition is right, with one important framing: only ~55 of those are *designed* pages, and only 9 are designed *templates*. Everything past launch is content stamped into T2/T3/T5/T7/T9 with zero new design work. For calibration, this launch set already out-structures Youtech per family (they run 9 core services to our 15; their blog is empty), and the competitors' 1,500-URL counts are ~80% blog and duplicated subtrees we deliberately are not copying.

## 4. Decisions (status as of 2026-08-25, Brad's review)

**D1. The interior design language. LOCKED: the open layout goes sitewide.**
Brad's call: "the grid rails, I totally hate them... make a hard update to the style guide based on the decisions we've made on the homepage." Done same day: STYLE_GUIDE 4.5 is now the sitewide open-layout system (EDGE framing, soft panels, display type, ~65ch content spine for long-form, zero pinned runways by default on interior pages), the instrument layer (GridLines rails, InfoBar, Nº section labels, 1200px Container as page chrome) is retired, and the ruled-row family plus mono meta plus registration marks survive as component-level accents. Sections 0, 4.2, 4.3, 6.2, 6.3, 6.6, 6.8, 7.3, 8, 9 updated; changelog entry "the open layout goes sitewide". There is no separate `_interior-system.md`: the style guide is the single source, per Brad. Per-template design briefs still get written per flagship, as in Phase 2.

**D2. `/services/` hub page. LOCKED: yes.** Added to sitemap.md 2026-08-25. The homepage's three `/services/#<group>` anchors now have a planned target; the hub builds in wave 2 alongside the service template.

**D3. Build order. LOCKED: conversion-first.** /schedule/, /audit/, /contact/, /about/ before the SEO families. Wave plan in section 5 stands.

**D4. The franchise/multi-location URL family. LOCKED (Brad, 2026-08-25): approved as wave 2 of T2, built after the 15 core service pages.** Slugs and the exact ~10 pages come from the Ahrefs keyword pass; amend sitemap.md then. The write-up below stays as the rationale.
What it is: Ignite Visibility runs ten dedicated service pages aimed specifically at the franchise/multi-location buyer, SEPARATE from their generic service pages: /franchise-seo/, /franchise-advertising/, /franchise-email-marketing/, /franchise-social-media/, /franchise-web-design/, /franchise-development/, /franchise-marketing-company/, /multi-location-marketing-agency/, /multi-location-seo/, /national-to-local/. Their own sitemap analysis calls this family "the single biggest URL-family gap for our target keywords."
Why a separate page and not just /services/seo/: someone searching "franchise SEO agency" is our exact buyer with buying intent, and Google wants to show them a page ABOUT franchise SEO. Our generic SEO page targets "SEO for multi-location brands" broadly; our /industries/franchise/ page targets "franchise marketing agency" broadly. Neither can rank for all ten service-flavored franchise queries at once: one URL generally ranks for one primary keyword. The family closes that grid: each service x the franchise audience = one page.
What it costs: nothing new in design. These are T2 service-template instances with audience-specific copy (multi-location rank tracking, location pages at scale, franchisor vs franchisee budget splits, brand consistency across units). The trap to avoid is thin near-duplicates of the generic service pages: each needs its own real angle, which our positioning actually has.
What it needs: the Ahrefs keyword pass to pick which ~10 and the slug shape (/services/franchise-seo/ vs flat /franchise-seo/), then a sitemap.md amendment.
**Recommendation: approve as wave 2 of T2, built immediately after the 15 core service pages.**

**D5. FAQ content. LOCKED:** buyer-process questions to /contact/ and /schedule/, service-specific questions to their T2 pages, each block with FAQPage JSON-LD.

**D6. Landing-page palettes. LOCKED (Brad, 2026-08-25): yes.** T7 funnel pages may use the alternate palettes (Signal dark, Blueprint, Chalk), one palette per page per STYLE_GUIDE 1.4, and we experiment there. Marketing pages stay on graphite.

## 5. Proposed build order

Same protocol as Phase 2: brief before build, hero first on each new template's flagship, review with Brad, then stamp. Once a template's flagship is approved, remaining instances are content work and CAN run several per session or in parallel sessions. That is the "divvy up and build in tandem" move, and it stays slop-safe because the design is settled once and each instance gets its own copy pass under copy-rules.

| Wave | What | Sessions (est.) | Blocked by |
|---|---|---|---|
| 0 | Lock this plan (DONE except D4/D6) + the D1 style-guide hard update (DONE 2026-08-25) + doc hygiene (section 7) | done / 1 | D4, D6 |
| 1 | T1 conversion set: /schedule/ (booking component, styled placeholder first), /audit/, /contact/; plus /about/ (the hero already links to it) | 2-3 | nothing hard |
| 2 | T2 services: brief + flagship (/services/seo/), review, then stamp the other 14 in tandem batches; /services/ hub (D2); obsidion-portal richer variant | 4-6 | nothing hard |
| 3 | T3 industries: brief + flagship (/industries/franchise/, "most complete page after homepage"), then home-services, legal, healthcare + hub | 3-4 | keyword pass helps |
| 4 | T4 locations (hub + 2) and T5 /results/ index shell | 2 | office info; case studies need real data |
| 5 | T7 funnel kit + T8 lead magnets + /ad-credit/ + popup | 3-4 | magnet assets, credit terms, tracking IDs |
| 6 | T9 blog pipeline + 2 launch posts; D4 franchise URL family | 2-3 | keyword research |
| ongoing | Homepage punch list + 2K cube sessions interleaved | few | Brad's assets/reviews |

### Splitting across three parallel agents

Brad plans to run three Claude agents in tandem. The split that keeps build quality up:

- **Wave 0 is the one thing that cannot be parallelized, and it is DONE** (2026-08-25): STYLE_GUIDE 4.5's sitewide open-layout rewrite is the shared design contract every lane builds against. Three agents designing to three private readings of "the homepage's direction" is how sameness-with-inconsistency happens; now they all read one file.
- **Lane 1, conversion + company (T1/T6):** /schedule/, /audit/, /contact/, then /about/. Spec-ready, form + booking patterns exist, no flagship review needed beyond the normal screenshot pass.
- **Lane 2, services (T2):** template brief + flagship /services/seo/, Brad reviews the flagship, THEN this lane fans out and stamps the other 14 in batches (that stamping can itself run as parallel sub-batches).
- **Lane 3, industries (T3):** template brief + flagship /industries/franchise/, Brad reviews, then home-services, legal, healthcare + the hub.
- Rules that hold across all lanes: each template's flagship gets the brief-first, hero-first, Brad-review loop before any stamping; every stamped instance gets its own copy pass under copy-rules (no copy cloning between pages); mobile + reduced-motion checks per page before checkoff; one lane owns a file (no two agents editing shared components at once — new shared primitives get built in the flagship session, consumed read-only by stampers).
- Waves 4-6 slot into whichever lane frees up first.

## 6. What Brad owes, mapped to what it blocks

Nothing in waves 0 to 3 is hard-blocked on content. The gates:

| Content | Blocks |
|---|---|
| Real case studies (clients, numbers, story) | T5 entirely; the "1 case study link" SEO rule on every T2/T3 page (build with the link slot empty until then) |
| Real proof metrics | ProofBand launch gate; any interior proof band |
| Testimonials (real names) | interior testimonial lockups (pattern is specced and waiting) |
| Office phones + addresses | /contact/, /locations/, footer facts, LocalBusiness + Organization JSON-LD |
| GHL calendar link, then API creds | /schedule/ booking component (styled placeholder ships without it) |
| Leadership names, bios, photos | /leadership/ (page does not ship without them) |
| 5 lead-magnet assets | T8 instances (template can ship empty) |
| Ad credit terms + deadline | /ad-credit/ + popup (do not ship unless final) |
| Legal copy | finishing /privacy-policy/, /terms/ |
| Ahrefs keyword pass | final title tags sitewide; D4 slugs |
| Socials, logo file, tracking IDs | footer/schema completeness; funnel measurement |

## 7. Doc hygiene queue (from the audit)

1. DONE 2026-08-25: decisions.md "Amendments" section (AI-naming exception mirrored, open-layout pointer, proof-density reconciled, portal presentation superseded, trailing-slash + funnel-noindex recorded, D1-D6 recorded).
2. sitemap.md: /services/ hub added (D2, done 2026-08-25). D4's ~10 franchise slugs get added after the Ahrefs keyword pass.
3. project-brief.md: palette pointer should name STYLE_GUIDE.md, not the moodboard (open, cosmetic).
4. DONE 2026-08-25: the D1 STYLE_GUIDE hard update + changelog entry.

## Appendix: lane briefs (paste one per agent)

**THE FLAGSHIP GATE (Brad, 2026-08-25, hard rule):** every lane builds exactly ONE page first and then STOPS for Brad's green light. Approval is recorded by Brad checking that lane's GATE checkbox in tasks.md; while the gate is unchecked, building any further page in the lane is OUT OF SCOPE for the agent, no exceptions, regardless of how finished the flagship looks. Expect the flagship to take 1 to 2+ iteration rounds with Brad before the gate opens, exactly like every homepage section did; the whole point is to spend the iteration on ONE page so the stamped pages inherit an approved design instead of multiplying an unreviewed one. The same gate applies to every later template (case study, funnel kit, lead magnet, blog): first instance green-lit, then stamp.

Other ground rules baked into each brief: read the docs first; brief-before-build for each template's flagship; one page or template round per session; screenshot 375/768/1280/1536 + reduced motion before checkoff; per-page copy pass under copy-rules.md (no copy cloning between pages); no placeholders in site chrome; update tasks.md checkboxes and log session detail in build-log.md. File ownership: a lane touches only its own files; shared primitives (components/shared, components/motion, globals.css, STYLE_GUIDE.md) change only in a flagship session with a changelog entry, and stampers consume them read-only. Nobody touches Nav, Footer, or the homepage sections.

### Lane 1: conversion + company (T1/T6)

> Read project-guidelines/interior-buildout-plan.md, STYLE_GUIDE.md (4.2, 4.3, 4.5, 6.13, and the top changelog entry), copy-rules.md, seo-requirements.md, decisions.md (Amendments), then the spec for the page you are building. Build the conversion set as real pages, one per session, in this order: /schedule/ (conversion/schedule.md; custom booking component as a styled placeholder linking to [PLACEHOLDER: GHL calendar link], per decisions.md), then STOP: /schedule/ is this lane's flagship, and the GATE checkbox in tasks.md Phase 7 must be checked by Brad before any further page. After the gate opens: /audit/ (conversion/audit.md; real form), /contact/ (conversion/contact.md; form, both offices, office info placeholders per spec), then /about/ (company/about.md, which needs a design-brief pass first: rewrite it reference-grounded under the open layout before building). Forms post through submitForm (lib/form-action.ts) with their own formType; a form never navigates on success (STYLE_GUIDE 6.13). Building the first form, extract the shared Field primitive from NewsletterForm (Phase 3 item, this lane owns it). Per D5, /contact/ and /schedule/ carry FAQ blocks with FAQPage JSON-LD, seeded from project-sections/home/12.faq.md's buyer-process questions. BreadcrumbList JSON-LD on every page. These pages are deliberately quiet: content spine width, no set pieces.

### Lane 2: services (T2)

> Read project-guidelines/interior-buildout-plan.md, STYLE_GUIDE.md in full (the top changelog entry and 4.5 govern layout), copy-rules.md, seo-requirements.md, decisions.md (Amendments), project-sections/services/services-index.md, and project-sections/services/_service-page-template.md. Session 1: rewrite _service-page-template.md into a reference-grounded design brief under the sitewide open layout (the current template has zero design direction; its SEO contract holds: 800+ words, answer-first paragraph near the top, Service JSON-LD, FAQ block per D5, BreadcrumbList, internal links to 2 industry pages + 1 case study slot left empty until real case studies exist). Session 2: build the flagship /services/seo/ against the brief, hero first. STOP: the GATE checkbox in tasks.md Phase 4 must be checked by Brad before any other service page exists; expect 1 to 2+ iteration rounds first. After the gate opens: build the /services/ hub page (added to sitemap.md 2026-08-25; it must carry the #organic-marketing, #paid-advertising, #design-development anchor ids the homepage Services group heads already target), then stamp the remaining 14 service pages in batches, each with its own copy pass; /services/obsidion-portal/ is the sanctioned richer variant (services-index.md note; reuse the 6.12 exhibit-window pattern, never the homepage's portal morph). Wave 2 of this lane (approved, D4): the ~10 franchise/multi-location service pages once the keyword pass picks slugs.

### Lane 3: industries (T3)

> Read project-guidelines/interior-buildout-plan.md, STYLE_GUIDE.md in full (the top changelog entry and 4.5 govern layout), copy-rules.md, seo-requirements.md, decisions.md (Amendments), project-sections/industries/industries-index.md, and project-sections/industries/_industry-page-template.md. Session 1: rewrite _industry-page-template.md into a reference-grounded design brief under the open layout. Known staleness to fix in the rewrite: its section 6 lifts the homepage's 90-day set piece, which is now a pinned homepage-only finale; spec an interior-grade variant instead (the process/timeline card, STYLE_GUIDE 6.4, is the intended pattern). Industry pages are the site's SEO engine: 1,500+ words, one clear primary keyword, answer block near the top, FAQ block with FAQPage JSON-LD, BreadcrumbList, links to the 3-4 most relevant service pages + 1 case study slot left empty, testimonial slot gated on real testimonials (pattern: 11.testimonials.md + shared/testimonial-card.md). Session 2: build the flagship /industries/franchise/, hero first: industries-index.md designates it the most complete page on the site after the homepage. STOP: the GATE checkbox in tasks.md Phase 4 must be checked by Brad before any other industry page exists; expect 1 to 2+ iteration rounds first. After the gate opens: /industries/ hub (no spec exists; spec it from the template brief), then home-services, legal, healthcare, each with its own copy pass.
