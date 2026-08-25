# Footer Design Brief (shared)

v3.1, 2026-08-25, Brad's footer session. Direction picked by Brad from a three-concept brainstorm (Back Cover / 3x3 letter Monument / physics Toybox): **THE BACK COVER**, the editorial magazine close, with the tactile-composed interaction dial and the paint-the-footer pixel grid as its one fun surprise. Content (links, IA) unchanged from v2: they are SEO-relevant internal links. Build phase 2I. Appears on every page except /go/, /apply/, and /thanks/ (mounts in the marketing layout).

**Round 1 REJECTED live by Brad, v3.1 is the correction.** His verdict on the v3 build: weird grid lines that exist only on this section, way too much info, chaotic, sloppy, nearly a full viewport tall, fonts that do not match the page. His references: Youtech's footer (the simplicity and the information layout) crossed with e2vc's (the playfulness), minus e2vc's size. What changed:
- NO GridLines rails, NO info bar, NO ruled link tables, NO per-row hairlines. The homepage's whole lower region is the open layout; the footer joining it with instrument chrome read alien. The footer now runs Youtech's plain columns: Apfel 700 16px headers, Apfel 15px links in `--ondarkmid` brightening to `--ondark` on hover, generous row spacing, zero rules. (Supersedes 4.5's "the footer keeps the 1200px + hairline system" for the hairline half; the 1200 Container stays.)
- Mono nearly eliminated: no mono eyebrows, no mono colophon. The clocks render in the body face with tabular nums. This was the "font doesn't match" complaint.
- The locations row is the e2vc playfulness, translated: each city row is a 7px brand-square glyph in `--accondark`, the city link, and its live local time (12h). Compact, two rows, inside the normal column grid.
- Socials and office phones are OMITTED from the page until Brad confirms them. Visible `[PLACEHOLDER]` strings in site chrome read as debris (his "placeholder nonsense" note); nothing fake ships, and the open items live in tasks.md instead of on the page.
- Mobile: plain stacked columns (Youtech), no accordions. Simplicity beats collapse.
- Total height target: comfortably under one viewport at 1280. Measured after the tightening pass: **77vh at 1280, 73vh at 1536, 99vh at 768, 130vh at 375** (was ~94vh at 1280 and 181vh at 375).
- Kept from v3: the dark ground, the four-column IA, the cropped viewport-wide wordmark with per-letter rise and hover flood, the paint-the-footer pixel grid, the empty badge slot, the legal line.

Height came out of four places, all worth keeping as rules: Privacy Policy and Terms left the Company column (the legal line already links both, so the column paid two rows for nothing); Locations and Contact moved into the SAME grid as the link columns rather than opening a second block; the small logo left the legal line (the giant wordmark is the mark, and two marks in 200px is one too many); and the link groups run 2-up at 375 instead of stacking, which is what took mobile from 181vh to 130vh. Contact spans both mobile columns because an email address is wider than a 155px half column, and the section's `overflow-hidden` (the wordmark crop needs it) would clip it rather than wrap it.

Position: directly under the closing CTA (the First 90 Days morph ending, homepage-close restructure 2026-08-25). The blue accent surface above, the dark footer below: the closing brand moment (STYLE_GUIDE signature move 10).

Changes from v2:
- The legal line moves ABOVE the wordmark, folded into the colophon row. v2 listed it below the set piece, which contradicts a wordmark cropped by the page's bottom edge: nothing can sit under a true edge crop. The wordmark is the final element on every page.
- The wordmark is no longer "low opacity or outline": it is solid `--ondark`, magazine-confident (obys's AIM read), with a per-letter accent flood on hover.
- New: the paint-the-footer pixel grid (the 7.6 pixel-trail pattern debuts here, footer-scoped and livelier than the eventual site-wide version).
- The "Work With Us" Bluu Titling block stays dropped (v2 call; the CTA above owns that job).

## Content

### Link columns (four, mirroring the services IA exactly)

**Company**
About, Leadership, Careers, Blog, Results, Resources, Privacy Policy, Terms

**Organic Marketing**
Search Engine Optimization (SEO), Generative Engine Optimization (GEO), Social Media, Content Marketing, Email, Obsidion Portal

**Paid Advertising**
Paid Search, Google Local Services Ads, Paid Social, Amazon Ads, Creator Network

**Design & Development**
Web Design, Branding, Video Production, Custom Development

Slugs from sitemap.md (the same hrefs the nav overlay uses). Blog and Resources 404 until Phases 5/6, same known state as the service links.

### Locations / Contact / Legal

- **Locations**: Denver, Tampa (each links to its location page). Each row is a 7px `--sec-acc` brand square, the city link, then its live local time (12h, tabular nums, hydration-safe: SSR renders `--:--` and the value fills on mount, then ticks on the minute boundary). This is e2vc's clock move translated to our mark.
- **Contact**: support@bigsquaremarketing.com (real, from lib/site.ts).
- **Legal**: `BigSquare Marketing © year All Rights Reserved.` left, Privacy Policy and Terms right. The name here is the real text the wordmark cannot be (the wordmark is aria-hidden). Privacy and Terms appear ONLY here, not also in the Company column.
- **NOT on the page until Brad confirms them**: socials, the two office phone numbers, and any partner badge. Site chrome renders no placeholder strings (round-1 lesson: `[PLACEHOLDER]` reads as debris on a footer that appears on every page). They live in tasks.md as open items; adding each is a few lines in `Footer.tsx` once the facts exist.

## Design direction

Theme `dark` (`--darkpanel` ground, `--accondark` accents). The footer keeps the 1200px Container but NOT the hairline instrument: no GridLines, no info bar, no ruled rows, no mono meta (round-1 correction; STYLE_GUIDE 4.5's scope line is amended to match). Only the wordmark goes full bleed. Anatomy top to bottom:

1. **Four link columns**, one grid: header in Apfel 700 at 16px `--sec-ink`, links at 15px `--sec-mid` brightening to `--sec-ink` on hover, 8px row rhythm. 4-up at `lg`, 2-up below. No rules, no arrows, no eyebrows.
2. **Locations and Contact** flow as the next row of the SAME grid, so they align to the same columns instead of opening a second block. Contact spans both columns below `lg`.
3. **Legal line**: 14px, split left and right. Nothing sits below the wordmark, so the legal line sits above it (a change from v2, which is impossible against a true edge crop).
4. **Set piece: the cropped lockup.** The logo mark at cap height, then BIGSQUARE in Bluu Next 700, one line, sized to the full viewport width and cropped by the page's bottom edge (the top ~44% visible; the page ends inside the letters, obys). Solid `--sec-ink`. The MARK LEADS the lockup, which is how the large-logo half of Brad's original ask is served: e2vc sets its own glyph into its giant wordmark, and putting ours inside the same crop row costs the footer no height at all (it scales with the type through the same fit pass). Per-letter hover: the letter floods `--sec-acc` bottom-up (a clip-path overlay twin, 300ms swoop). Entry: mark and letters RISE INTO THE CROP together on the footer's own scroll progress with a per-glyph lag left to right, so the lockup assembles as the page bottoms out. No fade-in anywhere.
5. **Paint-the-footer pixel grid**: a footer-scoped layer between the ground and the content. Cells sized to a ~34px target edge with the column count derived per width (a fixed 24-column grid gives 53px rectangles at 1280 that read as blocks); the cell under the pointer lights `--accondark` at 14% and fades back over 700ms (CSS transition; JS only flips opacity on). Desktop fine pointers >= 1024px only, idle-initialized, `pointer-events: none` (one pointermove listener on the footer maps position to cell), `aria-hidden`, OFF under reduced motion. The 7.6 signature's first shipped instance and the footer's one live element. Zero canvas.

## Motion

- Wordmark rise: a plain scroll progress map over the footer's entry (no pin: the two-pinned-runways-per-page ceiling is spent on featured work and the portal). Reduced motion and fallback paths render it settled in the crop.
- Letter flood on hover, link color changes: house and swoop tokens.
- Clocks tick minutes only (content, not decoration: they update under reduced motion too).
- Nothing else moves. No entry staggers on the link columns: 21 links rippling in was part of what read as chaotic.

## Mobile (375)

Link groups run 2-up (stacking all six blocks ran the footer to 181vh; two columns brings it to 130vh). Contact spans both columns so the email address is not clipped by the wordmark's `overflow-hidden`. The wordmark still runs viewport-wide and crops at the bottom edge. Pixel grid does not mount. No horizontal overflow at any width.

## Steal from

- **Youtech**, the whole information layer: plain columns, the header/link type relationship, the row rhythm, the second row of locations and contact. Brad's round-1 reference, sent live: `../reference-images/youtech-footer.png` (his fresh capture shows Company / Earned & Owned Media / Paid Media / Design & Development, then Socials / Locations / Contact Us / badge). NOT taken: the partner badge (not earned), the rotated "WORK WITH US" corner mark.
- **E2VC**, the playfulness: the giant cropped wordmark closing the page and the live city times as an editorial element. NOT taken: its size (a full viewport of footer), its four-column link block set in caps.
- **Obys**, the wordmark cropped by a page edge: `../reference-images/obys-aim/obys-aim-desktop-01-top.png`.
- **Pxpush**, the giant footer wordmark precedent only: `../reference-images/pxpush/pxpush-home-desktop-22.png`. NOT taken: the ruled mono link rows (they are what round 1 got wrong), the triple echo copies, the CRT texture.

## Build with

Existing: `Section` (as="footer", theme dark, size none), `Container`, `useReducedMotionSafe`, `SITE_NAME`/`SUPPORT_EMAIL` from lib/site.ts. Deliberately NOT used: `GridLines`, `InfoBar`, `RuleLink`, `RuledLinkTable`, the mono family, `Reveal`, shadcn `Accordion`. That list is the round-1 build.

New this phase:
- `components/shared/Footer.tsx` (server shell: columns, locations, contact, legal)
- `components/shared/OfficeClocks.tsx` (`OfficeTime`, one city per instance, hydration-safe minute tick)
- `components/shared/FooterWordmark.tsx` (client: measure-and-fit sizing, the mark, scroll-linked rise, per-letter flood). The mark renders through `next/image` from the raw SVG import rather than the shared `Logo`, because `Logo` hard-codes `priority` and a preloaded below-the-fold image at display scale is an LCP cost. Its offset uses margin, never a Tailwind `translate-y`: framer writes `transform` inline on the same element and would silently drop the class.
- `components/shared/FooterPixelGrid.tsx` (client, the paint layer)
- `lib/footer-links.ts` (the four columns as data; one source)

Wordmark sizing note: Bluu's metrics make pure vw sizing drift across viewports, so the component renders at a vw estimate and corrects with a measure-and-scale pass on mount, again once `document.fonts.ready` resolves (the first pass measures the fallback face), and on viewport WIDTH change only (the RoughAnnotation resize rule). The crop is the wrapper: `overflow: hidden`, height `fontSize * 0.44`, letters overflowing below it, `marginTop` trimming the font's internal leading so the wrapper's top hugs the caps. The wrapper's bottom edge IS the page's last pixel (verified: 0px between it and the document end at every width).

## Done when

- [x] Every link resolves to its sitemap slug; columns mirror the services IA exactly
- [x] Clocks correct in both timezones, no hydration mismatch (verified live at 375 to 1536)
- [x] Badge slot renders nothing; no placeholder strings anywhere in the footer
- [x] Wordmark spans the viewport and crops at the bottom edge with zero horizontal scroll at 375 / 768 / 1280 / 1536 (0px between the crop and the document end at every width)
- [x] Letters rise into the crop on entry; hover floods per letter; reduced motion renders settled with zero pixel cells and zero running animations
- [x] Under one viewport at 1280 (77vh; 73 at 1536, 99 at 768, 130 at 375)
- [x] The giant wordmark is aria-hidden; the brand name exists as real text in the legal line
- [ ] Screenshots at 375 / 768 / 1280 / 1536 plus reduced motion reviewed with Brad before checkoff

## Open with Brad

- Socials: which accounts exist, so the column can be added.
- The two office phone numbers (Denver, Tampa).
- Whether the wordmark should read BIGSQUARE (current) or BIGSQUARE MARKETING. The longer lockup sets smaller at the same width, which makes the crop shallower and the gesture quieter.
- Whether the paint layer stays. It is the one purely-for-fun element in the footer and the easiest thing to cut if it reads as noise.
