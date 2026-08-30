# Lead magnet brainstorm (2026-08-31)

Brad: "I'm not sure what I'm gonna do for the five lead magnets yet. Need to brainstorm some ideas." Pick 5. The rule for a good one: it solves one real problem in under 20 minutes, it makes the reader want the call, and it costs us a day or less to make. Formats that work for an agency: checklist (1 page), calculator (a spreadsheet or a small web tool), template (a doc they copy), teardown (a short video or PDF), scorecard (score yourself, see where you fall).

The 5 working titles on /resources/ today (Pane A, 2026-08-30) are candidates 1 to 5. Keep, swap, or replace.

## Candidates

Works for every lane (ecommerce, software, services, franchise):
1. **The 7 numbers to ask your agency for** (checklist). Judge any report in 5 minutes. Cheapest to make; on the site already as a working title.
2. **Cost per lead and cost per customer calculator** (spreadsheet). Spend, leads, close rate in; CPL, CAC, and break-even in. Ecommerce version: ROAS and contribution margin.
3. **Ad account ownership template** (doc). What you should own, who has access, and the steps to take it back from a vendor. Hits a fear every business owner has.
4. **The marketing scorecard** (scorecard). 20 yes/no questions across search, ads, site, creative, tracking. Score out of 100. Ends with "book a call to walk through your score." Best converter of the list.
5. **Your first 90 days with an agency** (guide). What should happen week by week, and what it means when it does not. Mirrors the homepage 90-days section.
6. **Landing page teardown** (video + PDF). We tear down 3 real landing pages (ours or public ones), what works and what leaks.
7. **Creative brief template** (doc). The one-page brief we use for every ad, video, and page. Shows the creative side of the shop.
8. **Tracking setup checklist** (checklist). GA4, pixel, call tracking, form events, UTMs: the 15 things that must be on before you spend a dollar.

Multi-location and franchise lane:
9. **The multi-location SEO checklist** (checklist). Listings, location pages, reviews, tracking, in the order to fix them. On the site as a working title.
10. **Location page template** (doc + example). The page structure that ranks a city page, with the fields to fill per location.
11. **Franchisee marketing playbook** (guide). What corporate handles, what the local owner handles, and the monthly rhythm between them.

Ecommerce and software lane:
12. **25 things to check before you rebuild your website** (guide). On the site as a working title. Rename to "before you rebuild your site or store" to cover ecommerce.
13. **Email flows that pay for themselves** (template pack). Welcome, abandoned cart, post-purchase, win-back: the copy skeletons and timing.
14. **SaaS demo page teardown** (teardown). Three demo/pricing pages, what converts.

Home services, legal, healthcare lane:
15. **Google Local Services Ads setup guide** (guide). Step by step, for home services and legal.
16. **Review response templates** (doc). 12 replies for good, bad, and fake reviews, written to keep you out of trouble (healthcare and legal need this most).

## A suggested 5 (one per job)

- Judge your agency: #1 The 7 numbers (checklist)
- Do the math: #2 CPL/CAC calculator
- Protect yourself: #3 Ad account ownership template
- Score yourself: #4 The marketing scorecard
- Lane pick: #9 Multi-location SEO checklist (or #12 for ecommerce if Brad wants the lane mix on the page)

## What each one needs to ship

- A spec file: copy `_lead-magnet-template.md` to `N.<slug>.md`, fill title, slug, promise, what is inside, who it is for.
- The asset: PDF (designer) or spreadsheet (Claude can build the calculator as a Google Sheet or a small in-page tool).
- A cover mockup for the /resources/[slug]/ page.
- The row in `lib/resources.ts` updated to match. The page template gets built once, then each one is data.
