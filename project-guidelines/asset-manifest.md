# Asset Manifest

Brad's end-of-build shopping list (started 2026-08-26, flagship round 2). Every interior media slot renders a designed placeholder until its file lands. **To fill a slot: drop the file into `public/media/`, then add one line to `lib/asset-files.ts` mapping the slot id to the path.** The placeholder and its mono ASSET chip drop automatically; alt text is already written in the page's content module.

Rules: append a row here in the SAME session any new slot ships. Photos beat stock; the portal and real work beat both. No text baked into images (copy lives in the page; small mono labels in the blog-figure language are the exception). Landscape sources at 2x display size; WebP or AVIF preferred, JPG fine (next/image re-encodes).

## OWNER column (asset fill triage, 2026-08-31; lanes in `project-sections/assets/asset-fill-plan.md`)

- `LANE-1-CODE`: built in HTML/CSS at brand tokens and captured (`scripts/asset-studio/`), the ChatGPT-section precedent
- `LANE-2-AI`: generated on the world bible (`project-sections/assets/world-bible.md`), Codex stills / Higgsfield video
- `DESIGNER`: Brad's designer's core deliverable (video especially). Stills overlap with in-house lanes is fine (Brad, 2026-08-31): more candidates, Brad picks
- `REAL-ONLY`: never AI-filled, never mocked; waits for the real photo/file

OWNER is a tracking device, not a prohibition. Candidates land in `assets/generated/<slot-id>/`; review on `/dev/assets`; nothing is wired into `public/media/` without Brad's OK. Triage counts (61 empty slots): 16 LANE-1-CODE, 23 LANE-2-AI, 22 REAL-ONLY.

## Slots

| Slot id | Page(s) | Placement | What to drop | Aspect | OWNER | Status |
|---|---|---|---|---|---|---|
| `services-seo-hero` | /services/seo/ | Hero, right framed object | Portal rankings view or map-grid rank tracker; anything with visible city-by-city structure | 1:1 | LANE-1-CODE | EMPTY |
| `services-seo-band` | /services/seo/ | Wide band between process and spine (links to /results/) | Team at work, strategy wall, or a portal report on a big screen | ~21:9 (16:9 mobile crop safe) | LANE-2-AI | EMPTY |
| `industries-franchise-card` | /services/seo/ + every service page linking Franchise; later /industries/ | Linked industry card | Franchise-feel image (storefront row, multi-unit signage) | 3:2 | LANE-2-AI | EMPTY |
| `industries-home-services-card` | /services/seo/ + every service page linking Home Services; later /industries/ | Linked industry card | Home-services-feel image (tech at a door, branded van) | 3:2 | LANE-2-AI | EMPTY |
| `franchise-hero` | /industries/franchise/ | Hero, right framed object | Franchise client storefront or team on site; a real client beats anything staged | 4:3 | LANE-2-AI | EMPTY |
| `franchise-method` | /industries/franchise/ | Band inside the method spine (between "Franchise development is marketing too" and "Money that knows its job") | Obsidion portal in use, over the shoulder, or a location walkthrough | 16:9 | LANE-2-AI | EMPTY |
| `industries-legal-card` | Service pages linking Legal | Linked industry card | Legal-feel image (office, consultation) | 3:2 | LANE-2-AI | EMPTY |
| `industries-healthcare-card` | Service pages linking Healthcare | Linked industry card | Healthcare-feel image (practice front desk, treatment room) | 3:2 | LANE-2-AI | EMPTY |
| `services-social-media-hero` | /services/social-media/ | Hero, right framed object | Phone with a client feed open, or a content calendar wall | 1:1 | LANE-2-AI | EMPTY |
| `services-social-media-band` | /services/social-media/ | Wide band (links /results/) | Content being made, a set, or a grid of client posts | ~21:9 | LANE-2-AI | EMPTY |
| `services-generative-engine-optimization-band` | /services/generative-engine-optimization/ | Wide band after spine (links /results/) | An answer-engine response naming a client, or answer-log review | ~21:9 | LANE-1-CODE | EMPTY |
| `services-content-marketing-hero` | /services/content-marketing/ | Hero band under the statement | Writing in progress, an article on screen, or a plan board | ~2.4:1 | LANE-2-AI | EMPTY |
| `services-content-marketing-band` | /services/content-marketing/ | Wide band after spine (links /results/) | Published pieces in a grid, or a reader-facing article | ~21:9 | LANE-1-CODE | EMPTY |
| `services-email-band` | /services/email/ | Wide band (links /results/) | A message thread with a customer, or the send calendar | ~21:9 | LANE-1-CODE | EMPTY |
| `services-obsidion-portal-exhibit` | /services/obsidion-portal/ | THE CENTERPIECE exhibit after "who it is for" | Wide clean screenshot or short recording of the real portal | ~2:1 | LANE-1-CODE | EMPTY |
| `services-obsidion-portal-band` | /services/obsidion-portal/ | Wide band after spine (links /results/) | Client + team walking through the portal together | ~21:9 | LANE-2-AI | EMPTY |
| `services-paid-search-hero` | /services/paid-search/ | Hero, right framed object | Search results with a client ad on top, or campaign structure | 1:1 | LANE-1-CODE | EMPTY |
| `services-paid-search-band` | /services/paid-search/ | Wide band (links /results/) | Campaign review in progress, or a results screen | ~21:9 | LANE-2-AI | EMPTY |
| `services-google-local-services-ads-band` | /services/google-local-services-ads/ | Wide band (links /results/) | Google Guaranteed badge in live results, or call log review | ~21:9 | LANE-1-CODE | EMPTY |
| `services-paid-social-hero` | /services/paid-social/ | Hero band under the statement | Ad creative variations, or a phone mid-scroll on a client ad | ~2.4:1 | LANE-2-AI | EMPTY |
| `services-paid-social-band` | /services/paid-social/ | Wide band after spine (links /results/) | Performance review, or a wall of creative tests | ~21:9 | LANE-2-AI | EMPTY |
| `services-amazon-ads-hero` | /services/amazon-ads/ | Hero, right framed object | Product listing with sponsored placement, or campaign console | 1:1 | LANE-1-CODE | EMPTY |
| `services-amazon-ads-band` | /services/amazon-ads/ | Wide band (links /results/) | Product photography, or a campaign review | ~21:9 | LANE-2-AI | EMPTY |
| `services-creator-network-hero` | /services/creator-network/ | Hero band under the statement | A creator filming with a client product or location | ~2.4:1 | LANE-2-AI | EMPTY |
| `services-creator-network-band` | /services/creator-network/ | Wide band after spine (links /results/) | A clip mid-edit, or a wall of clip thumbnails | ~21:9 | LANE-2-AI | EMPTY |
| `services-web-design-hero` | /services/web-design/ | Hero band under the statement | A finished client site on desktop and phone together | ~2.4:1 | LANE-1-CODE | EMPTY |
| `services-web-design-band` | /services/web-design/ | Wide band after spine (links /results/) | Design files, or a before-and-after of a client site | ~21:9 | LANE-1-CODE | EMPTY |
| `services-branding-hero` | /services/branding/ | Hero, right framed object | Brand elements arranged together: mark, type, color | 1:1 | LANE-1-CODE | EMPTY |
| `services-branding-band` | /services/branding/ | Wide band (links /results/) | The brand applied on vehicles, signage, or uniforms | ~21:9 | LANE-2-AI | EMPTY |
| `services-video-production-hero` | /services/video-production/ | Hero band under the statement | A shoot in progress at a real client location | ~2.4:1 | LANE-2-AI | EMPTY |
| `services-video-production-band` | /services/video-production/ | Wide band after spine (links /results/) | Behind-the-scenes still from a real shoot | ~21:9 | LANE-2-AI | EMPTY |
| `services-custom-development-band` | /services/custom-development/ | Wide band (links /results/) | A custom portal or internal tool on screen | ~21:9 | LANE-1-CODE | EMPTY |

| Slot id | Page(s) | Placement | What to drop | Aspect | OWNER | Status |
|---|---|---|---|---|---|---|
| `home-services-hero` | /industries/home-services/ | Hero, right framed object | Tech at the door or a branded truck; a real crew beats stock | 4:3 | LANE-2-AI | EMPTY |
| `home-services-method` | /industries/home-services/ | Band inside the method spine (after "Win the minute that matters") | Dispatch board or the portal on an office screen | 16:9 | LANE-1-CODE | EMPTY |
| `legal-hero` | /industries/legal/ | Hero, right framed object | Attorneys in consult or the office exterior | 4:3 | LANE-2-AI | EMPTY |
| `legal-method` | /industries/legal/ | Band inside the method spine (after "Offices compete. The firm wins.") | Intake dashboard or the attorney team | 16:9 | LANE-1-CODE | EMPTY |
| `healthcare-hero` | /industries/healthcare/ | Hero, right framed object | Front desk or practice interior, people over equipment | 4:3 | LANE-2-AI | EMPTY |
| `healthcare-method` | /industries/healthcare/ | Band inside the method spine (after "From search to booked visit") | Booking screen or the care team | 16:9 | LANE-1-CODE | EMPTY |
| `about-founders` | /about/ | Story section, right framed object | The founders, or the first office. Real photo only | 4:3 | REAL-ONLY | EMPTY |
| `about-team` | /about/ + /careers/ | Wide team band (about: above the CTA; careers: under the offices) | The whole team, one frame. Real photos only, no stock | ~21:9 (16:9 mobile crop safe) | REAL-ONLY | EMPTY |
| `locations-denver-office` | /locations/ + /locations/denver/ | Hub city panel (3:2 crop) + the city page's wide band | The Denver office, or the team in it. Real photo only | ~21:9 source (3:2 and 16:9 crops safe) | REAL-ONLY | EMPTY |
| `locations-tampa-office` | /locations/ + /locations/tampa/ | Hub city panel (3:2 crop) + the city page's wide band | The Tampa office, or the team in it. Real photo only | ~21:9 source (3:2 and 16:9 crops safe) | REAL-ONLY | EMPTY |
| `blog-cover-agency-7-numbers` | /blog/is-your-marketing-agency-working-7-numbers/ | Cover figure under the hero meta; also the model for the OG card | Rendered by `npm run blog:figures` from `scripts/blog-figures/figures/` (FIG. 001: 7 squares on a baseline, the 7th outlined under a bracket). Edit the HTML, re-run to change | 2:1 (16:9 mobile crop safe) | LANE-1-CODE | FILLED 2026-08-30 (replaced the GPT test render) |
| `blog-cover-local-seo-scale` | /blog/local-seo-with-more-than-one-location/ | Cover figure | Rendered by `npm run blog:figures` (FIG. 002, dark ground: 1 big square next to a 4x5 grid) | 2:1 | LANE-1-CODE | FILLED 2026-08-30 |
| `blog-fig-spend-by-channel` | /blog/is-your-marketing-agency-working-7-numbers/ | Inline figure, section 5 | Rendered by `npm run blog:figures` (FIG. 001.1: the sample spend table, 4 channels, both months, cost per lead in blue). A real portal screenshot may replace it later via `assets/blog-covers/` after deleting the figure HTML | 16:9 | LANE-1-CODE | FILLED 2026-08-30 |
| `blog-fig-local-seo-system` | /blog/local-seo-with-more-than-one-location/ | Inline figure after the system table | Rendered by `npm run blog:figures` (FIG. 002.1: 1 square next to the 4x5 grid over the 3 shared system bars) | 16:9 | LANE-1-CODE | FILLED 2026-08-30 |
| `blog-fig-cost-per-customer` | /blog/is-your-marketing-agency-working-7-numbers/ | Inline figure, section 3 | Rendered by `npm run blog:figures` (FIG. 001.2: 5 lead squares at $50, 1 in 5 filled, = 1 customer square at $250; SAMPLE NUMBERS label) | 16:9 | LANE-1-CODE | FILLED 2026-08-30 |
| `blog-fig-gbp-ownership` | /blog/local-seo-with-more-than-one-location/ | Inline figure, ownership section | Rendered by `npm run blog:figures` (FIG. 002.2: 1 owner-account square, hairline tree to 20 manager locations) | 16:9 | LANE-1-CODE | FILLED 2026-08-30 |
| `blog-author-bigsquare-team` | every /blog/[slug]/ | Author card, 72px square | Team photo or a headshot once posts carry a named author; until then a brand-square mark tile in the figure language | 1:1 | LANE-1-CODE | EMPTY |
| `blog-author-brad` | posts bylined by Brad Brown (CEO) | Author card, 72px square | Square headshot crop; source arrives in `assets/team/`, `npm run blog:assets` exports + wires it | 1:1 | REAL-ONLY | FILLED 2026-08-30 |
| `blog-author-mike` | posts bylined by Mike Soden (CTO) | Author card | Same | 1:1 | REAL-ONLY | FILLED 2026-08-30 |
| `blog-author-chaley` | posts bylined by Chaley Selsor (Team Lead) | Author card | Same | 1:1 | REAL-ONLY | FILLED 2026-08-30 |
| `blog-author-levi` | posts bylined by Levi Holley (VP of Sales) | Author card | Same | 1:1 | REAL-ONLY | FILLED 2026-08-30 |
| `blog-author-russel` | posts bylined by Russel Spence (Creative Director) | Author card | Same | 1:1 | REAL-ONLY | FILLED 2026-08-30 |
| `blog-author-sadie` | posts bylined by Sadie Pursell (Brand Ambassador) | Author card | Same | 1:1 | REAL-ONLY | FILLED 2026-08-30 |
| `team-brad-1` | /team/ | Brad's profile, personal photo 1 of 3 | A personal photo (his own pick; not a headshot) | 1:1 | REAL-ONLY | EMPTY |
| `team-brad-2` | /team/ | Brad's profile, personal photo 2 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-brad-3` | /team/ | Brad's profile, personal photo 3 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-mike-1` | /team/ | Mike's profile, personal photo 1 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-mike-2` | /team/ | Mike's profile, personal photo 2 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-mike-3` | /team/ | Mike's profile, personal photo 3 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-chaley-1` | /team/ | Chaley's profile, personal photo 1 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-chaley-2` | /team/ | Chaley's profile, personal photo 2 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-chaley-3` | /team/ | Chaley's profile, personal photo 3 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-levi-1` | /team/ | Levi's profile, personal photo 1 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-levi-2` | /team/ | Levi's profile, personal photo 2 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-levi-3` | /team/ | Levi's profile, personal photo 3 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-russel-1` | /team/ | Russel's profile, personal photo 1 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-russel-2` | /team/ | Russel's profile, personal photo 2 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-russel-3` | /team/ | Russel's profile, personal photo 3 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-sadie-1` | /team/ | Sadie's profile, personal photo 1 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-sadie-2` | /team/ | Sadie's profile, personal photo 2 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
| `team-sadie-3` | /team/ | Sadie's profile, personal photo 3 of 3 | Same | 1:1 | REAL-ONLY | EMPTY |
Shared industry-card assets are deliberate: one file serves every page that links that industry (service pages and, since 2026-08-26, the /industries/ hub's four cards). The /team/ profile wall reuses the `blog-author-*` headshots and adds the 18 `team-<first>-1..3` personal slots (Pane C handoff, 2026-08-31); the old `leadership-01..03` slot ids are dead, never add them.

## Homepage media (triage 2026-08-31; not MediaSlot ids — each fills via its own lib module, listed per row)

| Item | Where it lands | What is needed | OWNER | Status |
|---|---|---|---|---|
| Hero film | `HERO_VIDEO` in `components/sections/home/Hero.tsx` | The real 4K brand film, one-line swap | DESIGNER | EMPTY |
| /schedule/ VSL + poster | `lib/schedule-media.ts` | The VSL film + poster frame | DESIGNER | EMPTY |
| Funnel video + poster | `lib/funnels/registry.ts` | The /go/ funnel video URL + poster | DESIGNER | EMPTY |
| 6 featured-work tiles | `lib/featured-work.ts` | Real client work media; blocked on the real case studies | REAL-ONLY | EMPTY |
| ProofBand panel media | ProofBand section (with the sourced metrics in `lib/metrics.ts`) | Real media beside real numbers, nothing staged near claims | REAL-ONLY | EMPTY |
| Newsletter: 5 client headshots | `lib/newsletter-frames.ts` | Real client faces + the "600+ clients" wording confirm | REAL-ONLY | EMPTY |
| Newsletter: 4 cycle photos | `lib/newsletter-frames.ts` | Brand-world photos for the cycling panel; real photos beat, world-bible candidates welcome | LANE-2-AI | EMPTY |
| Obsidion portal window | Live portal code drop (6.12 exhibit) | Brad's live portal embed; the preview chip drops with it | REAL-ONLY | EMPTY |
