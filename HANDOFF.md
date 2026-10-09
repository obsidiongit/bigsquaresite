# BigSquare site: handoff (updated 2026-10-09)

This is Brad's BigSquare site (Next.js 16, the obsidiongit/bigsquaresite code) with a round of upgrades on
top. The Review toggles panel that used to switch between the upgrades and Brad's originals is gone
(2026-10-09): every choice is settled in the code. Retired code was moved, not deleted, to
`project-guidelines/archive/retired-code/2026-10-09/` (excluded from the build in `tsconfig.json`).

## Not in this zip

`project-sections/reference-images/` (Brad's 360 MB of reference-site screenshots) is left out to keep the
zip small. It is unchanged from Brad's repo: copy that folder over from the original if you need it.
`node_modules` and `.next` are left out too (`npm install` and `npm run build` recreate them).

## Run it

```
npm install
npm run dev            # http://localhost:3000
npm run dev:safe       # same, but can't take the machine down: webpack, 4 GB heap cap, low CPU priority
```

`dev:safe` (`scripts/dev-safe.mjs`): plain `next dev` gives its server a heap ceiling of half the machine's RAM
and Turbopack's native memory has no ceiling at all. Webpack lives inside the Node heap, so the cap is real: if
it's hit, the dev server stops, not the computer. Options: `npm run dev:safe -- --heap=6144`, `-- --port=3001`,
`-- --turbo` (Turbopack with full memory eviction instead of webpack).

Production check: `npm run build && npx next start -p 4801`, then
`node scripts/prod-check.mjs` (links, titles, descriptions) and `node scripts/launch-audit.mjs`
(real browser, desktop + phone; needs Playwright installed).

Placeholder markers: `[PLACEHOLDER]` text is always hidden on the page now (`LaunchSafe`). Add `?markers` to any
URL to see them again; `launch-audit.mjs` does that on every page.

Read `CLAUDE.md` and `project-guidelines/` first as before. What is still needed for launch (env vars, real
numbers, case studies) is in `project-guidelines/LAUNCH-CHECKLIST.md`.

## The homepage, top to bottom (2026-10-09)

1. **Hero**: the dotted showreel TV with a boiling pencil outline. It grows with the scroll, pushes into a dot
   that turns blue and breaks into squares onto Featured work; the headline's words turn into blue squares on
   the way out (`components/sections/home/tv/`, engine `lib/ascii-tv.ts`). No WebGL canvas on the homepage.
2. **Featured work**: a quiet 3 x 2 gallery of 4:5 pieces, four campaign posters and two reel films. The films
   rest on a frame and play only while pointed at (touch screens play them on screen). Entries live in
   `lib/featured-work.ts` (`HOME_WORK` picks the six); posters in `public/media/work/`, originals in
   `assets/work/`. Every piece has a page on `/results/`.
3. **The old way / the BigSquare way** (`ProblemSolution.tsx`): one section in two acts. "Let's circle back."
   (black and white) beside the four things most agencies do, struck through by the blue pen; then "Think inside
   the box." (colour) beside the three promises and the two asks.
4. **Search**: the AI search composer with its one handwritten note.
5. **Partner logos**: the marquee.
6. **Services** (`services/ServicesLanes.tsx`): three lanes, one per group, in grey, blue, and ink; a pixel mark
   in brand squares, the group intro, the services as rows. Pointing at a service swaps the lane's intro for
   its one-liner, in place.
7. **Portal** (`portal/PortalBlueStage.tsx`): the live Obsidion window on the blue slab, tilted back and settling
   flat, with lead and call notifications popping out of its edge. Still no numbers in the mock.
8. **Newsletter** (new copy): the last sheet of the page; its rounded edge peels up off the curtain footer.

Retired from the homepage 2026-10-09: the creator wall ("We stop thumbs"), the first 90 days section (and the
closing CTA it carried), the glass-cube hero and its companion, the original Problem, Solution, Services, and
Portal sections. All in the archive folder above.

## Every page

- Hand-drawn hovers (`components/shared/HandFx.tsx`): arrows redraw as pencil arrows, buttons get a pencil
  loop, text links get a pencil underline. Sections with display-size link names opt out with `data-hand-off`.
- Curtain footer with the pencil wordmark (`components/shared/curtain-footer/`), on every page and the 404.
- Contact page: the pencil form, posting through `submitForm` like every other form
  (`components/sections/contact/pencil/`).
- Team: only real people on the wall, blue dot portraits that show the photo on hover (`DotPortrait.tsx`).
- Shared pieces from this round: `components/shared/Slab.tsx` (the blue slab), `components/shared/WorkMedia.tsx`
  (a work entry's poster or film in any frame), `lib/home-services.ts` (the homepage service list).

## Content: no placeholders left

- Every media slot has an image: Unsplash stock (`public/media/stock/`, credits in `CREDITS.md`), the real
  team headshots composed for the team slots, and the Obsidion window for the portal slots. Swap any row in
  `lib/asset-files.ts` for real photography.
- Unknown facts (addresses, phones, socials, turnarounds, offer terms) render nothing until supplied; the
  stand-in proof numbers are `null` in `lib/metrics.ts`. Nothing was invented.
- Work: six campaign posters and six reel pieces (`lib/featured-work.ts`); adding a `caseStudy` to an entry
  turns its page into a full case study. Poster blurbs describe what each poster shows and name no clients.
- The showreel plays where the VSL goes until the real film exists.

## Safety

- `lib/form-action.ts`: on the live Vercel deployment a missing `FORM_WEBHOOK_URL` now shows the visitor an
  error (email us) instead of silently dropping the lead.
- `components/shared/LaunchSafe.tsx` hides any `[PLACEHOLDER]` marker that gets added later.

Every change is logged in the changelog at the bottom of `project-guidelines/STYLE_GUIDE.md`.
