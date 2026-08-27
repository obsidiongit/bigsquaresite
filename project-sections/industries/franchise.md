# /industries/franchise/ (T3 flagship)

v2, 2026-08-26 (Brad's round-1 review: solid but too minimal/templated, wants asset slots + playful interactive + variance; template brief now v3). The Lane 3 flagship, stamped from `_industry-page-template.md` v3 (the design contract; read it first). Designated the most complete page on the site after the homepage (industries-index.md): franchise is both an industry and our core positioning. THE FLAGSHIP GATE: Brad reviews this page before any other industry page exists.

## Page

- URL: `/industries/franchise/`
- Title tag: `Franchise Marketing Agency | BigSquare` (sitemap.md)
- Meta description: "BigSquare is a franchise marketing agency for franchisors and franchisee groups. Search, ads, and creative with budgets and reports for every location."
- Primary keyword: franchise marketing agency
- Competitors this page must beat: Ignite `/services/franchise-marketing-company/` (captured, see the template brief), Scorpion `/franchises/`, Youtech `/franchises/` (captured).

All design decisions live in the template brief. This file is the content pass (copy-rules govern; fresh copy, nothing cloned from the homepage or other pages). SOURCE OF RECORD for the exact shipped copy is `lib/industry-pages/franchise.ts` (the ninety-days convention): this file records intent, structure, and the load-bearing lines; small wording refinements land in the data module without a spec edit.

## 1. Hero

- Breadcrumb row: `INDUSTRIES / FRANCHISE` ("INDUSTRIES" links to `/industries/`).
- H1: **"The franchise marketing agency that shows its work."**
  - Annotation: circle on "franchise" (the template's system move: the page's subject, circled).
- Answer lead: **"BigSquare grows franchise brands. We run search, ads, and creative for franchisors, franchisee groups, and emerging brands, with a budget and a report for every location. You see every lead and every dollar in Obsidion, our client portal."**
- CTAs: "Schedule a Call" (primary, /schedule/), "Get a Free Audit" (secondary, /audit/).
- Hero media object (right, v2): `MediaSlot id="franchise-hero"`, 4:3, note "[PLACEHOLDER: franchise client storefront or team on site, 4:3 crop]"; alt (once filled): "A BigSquare franchise client location". Designed placeholder until Brad drops the file (asset-manifest.md row).
- Mono strip under the CTAs (v2, replacing the v1 right-column index): FRANCHISE DEVELOPMENT / FRANCHISEE LOCAL MARKETING / EMERGING FRANCHISE BRANDS / FRANCHISE RESALE (sub-markets from industries-index.md; plain text until sub-pages exist).

## 2. The difference

- Eyebrow: `THE INDUSTRY`. H2: **"Franchise marketing is a different job."**
- Support (right, ~40ch): "Most agencies build for one brand in one place. A franchise is many owners in many markets, moving as one."
- Intro paragraphs (spine):

  "A franchise sells twice. The brand sells franchises to future owners. Each location sells to the customers down the street. Most marketing plans pick one of those jobs and quietly drop the other."

  "Then the plan meets the org chart. Corporate wants one brand and clean numbers. Franchisees want leads this month in their market. The agency in the middle needs a system that serves both without slowing either down. That system is what we build."

  "The cost of a generic plan shows up fast. Locations rank in some markets and not others. Ad money pools where it is easy to spend, not where it is needed. Every owner reads a different report, so nobody trusts any of them. The fix is not more effort. It is a plan built for the shape of a franchise."

- Numbered ruled list (4 rows):
  1. **Two customers, one brand.** "Franchise development finds your next owners. Local marketing fills each location's pipeline. They need different messages, different budgets, and different reports, running side by side under one brand."
  2. **Local rankings decide revenue.** "A franchise does not rank once. It ranks in every market it enters, or it does not. Each location needs its own pages, listings, and reviews, built and kept current at scale."
  3. **Budgets split across owners.** "Brand funds, co-op dollars, and franchisee spend all pull in different directions. The plan has to say who pays for what. The report has to show each owner what their share bought."
  4. **Brand standards meet local speed.** "Franchisees want to move now. The brand needs every ad on standard. Approved creative, clear rules, and shared templates let both happen without a fight."

## 3. Who we work with

- Eyebrow: `WHO WE WORK WITH`. H2: **"Built for every seat at the table."** Support: "Three shapes of franchise buyer, one system underneath them all."
- Card chips (v2, sourced facts only): Franchisors "20-500 UNITS" and Franchisee groups "5-50 LOCATIONS" trace to project-brief.md's segment definitions; Emerging brands "FIRST LOCATIONS" is plain words, no invented range.
- Cards (3):
  1. **Franchisors.** "You own the brand and sell the next unit. We run franchise development to find qualified owners, keep the national brand sharp, and hand every location a local program that works on day one."
  2. **Franchisee groups.** "You own 5 to 50 locations of a brand you believe in. We run local marketing for each one inside brand standards, with its own budget, its own numbers, and a report per store."
  3. **Emerging brands.** "You have your first locations open and more on the way. We build the playbook early, so every new opening starts with pages, tracking, and ads that already work."

## 3b. The board (v2, the template's interactive signature, franchise skin)

Placement dial: after personas (the default). Unit noun **LOCATION**; grid 16x6 (round-2 bump from 12x5: denser reads as many-locations; ~17px cells at 375 hold up, the day-grid precedent); readout chips **PAGES / ADS / BUDGET / REPORT**; deterministic seed scatter (2 per row, hand-placed so no diagonal band forms) in the data module.

- Eyebrow: `THE SYSTEM`. H2: **"Pick any location. Same system."** with the rough underline on "Same system." (annotation 2 of 3).
- Body: "Every square is a location. Each one gets its own pages, its own ads, its own budget, and its own report, all inside one brand. Try a few. The readout does not change, no matter which location you land on. That is the whole point."
- Readout rest line: `EVERY LOCATION` + the four chips; on paint: `LOCATION 23` (tabular index furniture) + the same chips. The constancy is the demo.
- Activity blips while in view (the page's one live loop); paint on pointer-move for fine pointers, tap-only on touch; static seed + no interactivity under reduced motion. `aria-hidden` throughout; the body copy carries the claim.

## 4. Services for this industry

- Eyebrow: `WHAT WE RUN`. H2: **"The work franchise growth actually needs."**
- Support: "Every service below runs location by location, reported in the open. Start with one or run them together."
- Ruled link rows (6, the template cap; each one-liner grew a second franchise-specific sentence in the word-count round): SEO, Paid Search, Google Local Services Ads, Paid Social, Web Design, Obsidion Portal, linking to their `/services/` pages. Exact copy in `lib/industry-pages/franchise.ts` (services.rows).
- Case study link slot: EMPTY (template gate; no real case studies yet).

## 5. The breadth band (SECTORS variant)

The template's never-repeat-the-hero-index rule: this page's sub-markets already live in the hero mono index, so the band runs the sectors variant instead (found in flagship build round 1, where both slots rendered the same four items).

- Eyebrow: `SECTORS`. Line: "Franchise systems run in every sector, and the playbook holds across them. 3 of these are industries we run dedicated programs for."
- Chips: Home Services, Healthcare, Legal, Food & Beverage, Fitness & Wellness, Beauty & Personal Care, Senior Care, Education. Home Services, Legal, and Healthcare become links to the sibling industry pages once the gate opens (a data change).

## 6. The method spine

Added with the template's section 7 when the round-1 build measured ~1,080 words against the 1,500 contract. FOUR blocks here (template allows 3 to 4; the development motion earns its own), H2 + 2 paragraphs each, in the 65ch spine. A `MediaSlot id="franchise-method"` band (16:9, spine width) sits between blocks 2 and 3 (the variance dial), note "[PLACEHOLDER: Obsidion portal in use, over the shoulder, 16:9]"; alt once filled: "The Obsidion portal showing location-level results". Spec order:

1. **"One system, two motions"**: the national motion sets the frame (brand story, approved creative, offers, standards); the local motion does the winning (pages, listings, reviews, ads per market, on that market's budget). Weekly rhythm, per-location correction, one team running both motions.
2. **"Franchise development is marketing too"**: selling the next unit is a marketing job, not a sales job with a landing page. Development campaigns get their own audience, story, and follow-up, with a clean handoff to the sales team. (The D4 keyword family's first prose footprint.)
3. **"Money that knows its job"**: budgets mapped at kickoff (corporate, co-op, franchisee), every dollar tagged to a location and a goal before it is spent. Owners who fund their own ads see their own results; corporate sees the whole board; nobody argues about a blended number.
4. **"Reports owners actually open"**: Obsidion, per-location dashboards (leads, sources, cost, what happened next), the same truth rolled up for corporate. Bad numbers show too, along with what we are doing about them.

Exact copy in `lib/industry-pages/franchise.ts`.

## 7. Proof slot

GATED OFF. No real franchise case study, metrics, or testimonial exists. Nothing renders. (Template section 7 holds the composition for when Brad supplies data.)

## 8. The first 90 days

- Eyebrow: `THE PLAN`. H2: **"The first 90 days, written down."**
- Support: "No long onboarding and no mystery phase. The plan has dates, and you watch it run in the portal."
- 3 phase cards from `lib/ninety-days.ts` (ranges on chips, milestone text without day numbers, per the template rule). Card bodies carry the phase's PROMISE, never a paraphrase of the checklist below them (build refinement):
  - **Days 1-10, Get set up.** "Ten days from yes to a locked plan. No long onboarding."
  - **Days 11-30, Launch.** "Campaigns go live with tracking already fixed, so day one gets counted."
  - **Days 31-90, Scale.** "The system tightens every week, and the numbers decide what grows."
  (Card bodies above are the copy; the checklists render the ninety-days.ts milestone lines.)
- Payoff line: **"Ninety days in, you will know what every location spent and what it got back."** (statement scale, no ink: the board owns annotation 2, the CTA bracket is 3.)
- Reassurance row (check glyphs): "Month to month, no long contract." / "You own your accounts and your site." / "A report for every location, not one blended number."

## 9. FAQ (FAQPage JSON-LD)

Eyebrow: `FAQ`. H2: **"Franchise questions, straight answers."**

1. **Do you work with franchisors, franchisees, or both?**
   "Both. We run national brand work for franchisors, local programs for franchisee groups, and full systems that cover the two together. Budgets and reports stay separate for every location either way."
2. **Can each franchisee have their own budget?**
   "Yes. Corporate sets the frame, each owner funds their share, and every location gets its own spend and its own results. Nobody pays for another market's leads."
3. **How do you keep every location on brand?**
   "Brand rules load in first. Creative gets approved once, then stamped out per location with the right names, offers, and areas. Franchisees move fast without going off standard."
4. **What is franchise development marketing?**
   "Marketing that finds your next franchise owners. We build campaigns that reach qualified buyers, tell the brand story with real numbers, and hand your sales team people worth calling."
5. **What happens when we open a new location?**
   "We plug it into the system the other locations already run: its own pages, listings, tracking, and ads. Openings follow a playbook, not a scramble."
6. **What does franchise marketing cost?**
   "It depends on your locations and your goals, so we will not invent a number here. The audit comes first: we look at your markets and your current spend, then map who funds what. You get the plan and the price before you commit to anything."
7. **If we ever leave, who keeps the accounts?**
   "You do. Ad accounts, sites, and data belong to your brand from day one. Nothing sits in our name, so nothing leaves when we do."

## Close

Shared `CtaBand` with its defaults ("Ready to grow every location?" + Schedule a Call / Get a Free Audit bracket). The default line was written for the multi-location buyer and lands hardest on this page; stamped pages may override via props.

## Word count

Hero through FAQ ≈ 1,050 in the sections above plus headers, list furniture, FAQ questions, process checklists, and the reassurance row ≈ 1,550+ rendered. Verify the real count in the build before checkoff (template Done-when line 1).

## Done when

The template brief's Done-when list, run against this page, plus:
- [ ] H1/lead/description carry "franchise marketing agency" naturally (no stuffing)
- [ ] "Franchise development" defined on-page (FAQ 4 + hero index + chips: the D4 keyword family gets its first on-page footprint)
- [ ] No proof, no numbers beyond 5-to-50 (project-brief sourced) and 90-day structure
- [ ] Brad review screenshots: 375 / 768 / 1280 / 1536 + reduced motion
