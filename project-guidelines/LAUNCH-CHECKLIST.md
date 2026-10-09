# Launch checklist (2026-10-08)

The build is production-ready: `next build` passes (62 pages, TypeScript clean), every page has a title,
description, canonical and share image, there are 0 broken internal links, and no console errors.
Re-check any time:

```
npm run build && npx next start -p 4801
node scripts/prod-check.mjs            # status, titles, descriptions, canonicals, broken links
node scripts/launch-audit.mjs          # real browser, desktop + phone: visible placeholders, overflow, errors
```

## No placeholders left (2026-10-08)

Every `[PLACEHOLDER]` is gone from the source, not just hidden:
- every media slot has a photo: Unsplash stock (credits in `public/media/stock/CREDITS.md`) or, for the
  team slots, a grid of the real headshots; swap any row in `lib/asset-files.ts` for real photography
- the six "case studies" are pieces from the BigSquare showreel, titled by what the footage shows, no client
  names or numbers (`lib/featured-work.ts`); add a `caseStudy` to an entry and its page becomes a case study
- unknown facts (addresses, phones, socials, turnarounds, offer terms) render nothing until supplied; the
  stand-in proof numbers are `null` in `lib/metrics.ts`; the "600+ clients" line is gone
- the About story is written from the brand file only; team bios are one factual line about each role
- the showreel plays where the VSL goes (/go/audit/, /schedule/) until the real film is cut

Ported from the studio rebuild (each behind a review toggle, original kept): the dotted TV hero with the push
into the dot (turns the glass-cube companion off), the creator wall (replaces the proof band), the curtain
footer with the pencil wordmark, the pencil contact page (posts through `submitForm`).

## Must be set before or at launch (Vercel env vars)

- [ ] `FORM_WEBHOOK_URL`: where every form posts (GHL or Obsidion). Until it is set, the LIVE
      deployment shows visitors "did not send, email support@..." instead of silently dropping the lead
      (`lib/form-action.ts`). Preview and local builds still fake success for testing.
- [ ] `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GTAG_ID`, `NEXT_PUBLIC_GA4_ID`: tracking renders nothing while empty
- [ ] `GHL_API_KEY`, `GHL_CALENDAR_ID`, `GHL_LOCATION_ID`: /schedule/ booking (until then it links out)
- [ ] Domain `www.bigsquaremarketing.com` on the Vercel project + apex redirect

## Content only Brad / Mike can supply (each one un-hides itself when filled)

- [ ] The 4 proof numbers in `lib/metrics.ts` (ad spend, locations, average growth, years), sourced
- [ ] Real case studies in `lib/featured-work.ts` (until then: reel pieces)
- [ ] Denver + Tampa street addresses and phone numbers
- [ ] Social links (or "none")
- [ ] Founding story (/about/), remote policy + open roles (/careers/)
- [ ] Team: questionnaires, 5 open slots (launch-safe shows only real people)
- [ ] Funnel: VSL film + length, audit turnaround, offer terms, one sourced result
- [ ] Legal: counsel review of `content/legal/*.mdx`
- [ ] Real photos to replace the stock in `lib/asset-files.ts` where BigSquare has its own

## Decide the review toggles, then lock them

Open any page with `?lab=1` for the panel (bottom right; "All ours" / "All Brad's original").
For each final choice: hard-code it, delete its entry in `lib/lab-config.ts`, remove the losing
branch. When all are decided, delete `LabPanel` from the layouts.
