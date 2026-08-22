# Reference: Metacci (metacci.com/en)

Captured 2026-08-21 with headless Chrome at 1440x900 (desktop, 14 frames) and 390x844 (mobile, 18 frames). The site is a one-page portfolio for Simon, a Swedish fractional design leader (Klarna, Electrolux, Renault, Systembolaget). Built with Astro, 3 canvases: a hero particle cloud plus subtle background textures. Two tail-duplicate desktop frames were deleted after review.

Status: conversion narrative reference. This is the closest thing in our reference set to what BigSquare actually is: a services business selling expertise and measurable outcomes to skeptical buyers, not a creative studio showing off. Youtech gave us the multi-page architecture; Metacci shows how a single persuasion arc runs top to bottom. Its full dark theme does not transfer, but its structure, case-study formula, and token discipline transfer almost verbatim.

## Why this reference matters for BigSquare

1. Every "Selected work" card headline is an outcome claim with a number: "A 960% usage lift on Systembolaget's app", "230% conversion lift on BenifyDeals in three weeks". Client name sits above as a small letter-spaced uppercase tag. This is exactly the formula our success stories section needs, and it is the single best pattern on the page.
2. The page is one persuasion arc: promise (hero), proof (logo wall), positioning + stats, outcome-titled work, numbered process, the human, objection handling (FAQ), one CTA. Nothing decorative interrupts it.
3. Their CSS is a textbook token system worth copying structurally (see tokens below): semantic foreground/border tiers, a strict spacing scale, named motion durations, one media radius.

## Screenshot index

| File | What it shows |
|---|---|
| `metacci-home-desktop-01-top.png` | Hero: near-black page, tiny logo left, 3-link nav center, En/Sv toggle right. 72px white H1 left-aligned, muted subhead, one light "Book an intro call" button. Right half: 3D particle cloud where every particle is a design-token name (`--radius-md`, `--easing-emphasized`) |
| `metacci-home-desktop-02.png` | Hero tail with token cloud drifting; "Brands I've worked with" logo wall enters: logos inside rounded outline tiles, two offset rows (a marquee, rows slide opposite directions) |
| `metacci-home-desktop-03.png` | Logo wall in full: grayscale logos in bordered tiles, offset grid. Next H2 entering below |
| `metacci-home-desktop-04.png` | Statement section: centered 56px H2 "Growth comes from shipping faster than your competition", short centered body, then 4-across stats row (15+, 100+, 70+, 10+) with quiet labels. Faint smoke/burst texture behind |
| `metacci-home-desktop-05.png` | Stats row settled; "Selected work" section label (24px, left) and first work cards entering |
| `metacci-home-desktop-06.png` | Work cards: large rounded-24 media cards in a horizontal row, real product screenshots, uppercase client tag + 32px outcome headline overlaid at card bottom, "View case" link |
| `metacci-home-desktop-07.png` | Work cards tail; "HOW I WORK" eyebrow (letter-spaced uppercase, centered) + 56px H2 "Four phases, measurable outcomes" |
| `metacci-home-desktop-08.png` | Process: four outlined cards in a row, each with a small white chip holding "01".."04" + title (Read, Direct, Build, Hand over) + muted body. Borders only, no fills |
| `metacci-home-desktop-09.png` | Phase cards tail; centered two-line interstitial aside: "The hand over closes the engagement. It usually opens the next one." |
| `metacci-home-desktop-10.png` | About: rounded B&W portrait left, right column "I'm Simon. I've done this for 19 years." + body + underlined "More about me" text link |
| `metacci-home-desktop-11.png` | About settled; FAQ heading entering |
| `metacci-home-desktop-12.png` | FAQ: "FAQ" eyebrow, centered H2 "Before you book", accordion of 5 questions in one outlined container with hairline dividers, chevrons right |
| `metacci-home-desktop-13.png` | FAQ tail; "NEXT STEP" eyebrow entering |
| `metacci-home-desktop-14.png` | Closing CTA: eyebrow, viewport-scale centered headline "I take on one or two assignments at a time", 3-line muted body, one light button. Footer is one row: LinkedIn, Email, copyright. That is the entire footer |
| `metacci-home-mobile-01-top.png` to `-18.png` | Same arc at 390px: everything stacks to one column, H1 wraps to 4 lines and stays huge, logo tiles go 2-up, stats stack, work cards full-width, phase cards stack, FAQ questions wrap to two lines. Nothing is dropped on mobile |
| `metacci-home-extracted-data.json` | Fonts, colors, easings, full CSS variable set, headings with computed sizes, copy dump |

## Design tokens (exact, pulled from their live CSS)

- Palette (fully monochrome): `--color-page-bg #070808`, `--background-surface #121215`, `--background-raised #262828`, `--background-inverse #E9E9EB` (the button), text tiers `--foreground-strong/heading #E9E9EB`, `--foreground-default #B4B4B8`, `--foreground-muted #8C8C90`, `--foreground-subtle #7C7C80`, borders `--border-subtle #0F1010`, `--border-default #48484D`, `--border-strong #8F8F8F`. Their "accent" is literally off-white: `--accent-solid #E9E9EB`. Zero hue anywhere.
- The structure to steal is the semantic tiering: 4 foreground steps, 3 border steps, 3 background steps, each named by role not by color. Map ours: strong=`--ink`, default/muted=`--mid`, borders from `--line`. We add what they lack: a real accent (`--acc`).
- Fonts: **Silka 300/500/600 only.** One family, three weights, for everything including the eyebrows (letter-spaced uppercase Silka, not a mono). Same discipline as Lusion's two-family stack. We keep our three-family plan but this confirms weights should stay few.
- Type: H1 72px weight 500, letter-spacing -1.44px (-0.02em), line-height 0.95. Section H2 56px, -1.12px. Case titles H3 32px. Section labels ("Selected work") are H2s styled small at 24px. Eyebrows ~12px uppercase with wide tracking. Negative tracking on display + tight 0.95 leading is a large part of the premium feel.
- Font-size scale as tokens: 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 40, 48, 56, 72, 88, 96, 120, 128 (em-based). Line-height tokens: 150% normal, 130% tight, 110% display.
- Spacing scale: 4, 8, 16, 24, 32, 48, 64, 96, 128 (`--space-xs` to `--space-5xl`). Pure 8px-grid compatible, matches our moodboard.
- Containers: prose 800, standard 1024, wide 1280, xl 1440, page 1600. Gutter formula worth stealing verbatim: `--page-gutter: max(var(--space-3xl), calc((100vw - var(--container-page)) / 2))` keeps content centered with a guaranteed minimum edge padding.
- Radius: `--radius-media: 24px` on every media card and the portrait (vs Lusion's 20px). One radius token for all media, again.
- Motion: named durations `--motion-fast .15s`, `--motion-medium .25s`, `--motion-slow .4s`, `--motion-slower .6s`. Easings: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out, same workhorse as Lusion) and `cubic-bezier(0.22, 1, 0.36, 1)`. No bounce.
- Stack: Astro, one small script bundle, 3 canvases. Native scroll, no hijack.

## Patterns worth stealing (ranked for BigSquare)

1. **Outcome-first case study cards.** Uppercase client tag, then a headline that IS the result with the number in it, then one "View case" link over a real product screenshot in a rounded-24 card. Our success stories should use this formula exactly, with the metric set in `--acc` per moodboard. Only use numbers that exist in spec files.
2. **The single persuasion arc.** Promise, proof, positioning + stats, outcome-titled work, numbered process, the human, FAQ, one CTA. For our homepage this is a proven ordering of the sections we already have specced, and it repeats one CTA verbatim ("Book an intro call") instead of inventing new asks. Maps directly onto our two-CTA repeat pattern.
3. **Numbered process cards.** Chip with "01" + one-word verb title + short body, outlined cards with no fill. Clean fit for our 90-day timeline section: chip in `--surf` with `--acc` number, 1px `--line` border, verbs from our copy.
4. **"Before you book" FAQ accordion.** Objection handling as a section, one bordered container with hairline dividers. Including a "When is it not the right fit?" honesty question is a trust move a premium marketing firm can afford. shadcn Accordion covers this.
5. **Interstitial aside lines.** One quiet centered sentence between sections ("The hand over closes the engagement. It usually opens the next one."). Cheap, editorial, expensive-feeling pacing device.
6. **Logo wall as bordered tile marquee.** Grayscale logos inside rounded outline tiles in two offset rows. More structured than a bare floating-logo marquee; tiles read as "cataloged proof". Merge with our planned marquee: `--surf` tiles, 1px `--line`, grayscale-to-color hover.
7. **Semantic token architecture.** Their variable naming (foreground/background/border tiers, motion durations, one media radius, the gutter formula) is the skeleton our STYLE_GUIDE.md tokens should follow.
8. **The token-cloud hero concept, translated.** A 3D particle cloud made of design-token names is "our craft as the artifact". The literal version is designer navel-gazing for our audience, but the translated idea, a light particle/wireframe element built from the client's world (metrics, channel names) inside the hero, is a portal-section candidate under the 200KB Three.js budget. Low priority.

## What we do NOT take

- The full dark theme. Moodboard is explicit: dark panels are for hero overlay, CTA band, and footer only. Metacci proves dark-everything reads premium but ours proves competence on a light page.
- The zero-accent monochrome palette. Their stats and headlines are white on black; our metrics always use `--acc` or `--acc2`. A page with no accent has no place for the logo blue to live.
- First-person solo-consultant voice ("I embed with your team", "I'm Simon."). BigSquare is a firm; copy-rules.md governs voice.
- The smoke/burst background texture behind the stats. Moody and cinematic, not corporate. Our stats sit on clean `--paper` or `--surf`.
- The extreme vertical whitespace. Half-viewport gaps between sections suit a one-pager with 8 sections; our homepage carries more content and uses the moodboard's 96px rhythm.
- The one-row footer. Elegant for a solo operator, insufficient for a firm with locations, services, and legal links. Youtech's four-column footer remains the model.
- Silka itself (commercial license). Our stack is locked: Bluu Next + Apfel Grotezk + mono variable.

## Implementation notes for our stack

- Work cards: `rounded-3xl` overflow-hidden, Next/Image screenshot, gradient scrim at bottom, mono uppercase client tag + H3 headline. Framer Motion fade-up on entry.
- Process cards: plain bordered divs, no JS. Number chips are spans with `--surf` background and `--acc` mono digits.
- FAQ: shadcn Accordion, single bordered wrapper, `divide-y` hairlines. Also a schema.org FAQPage candidate for SEO.
- Their negative letter-spacing on display sizes (-0.02em) is worth testing on Bluu Next; serif displays may need less than grotesks.
- Adopt their duration tokens (`.15/.25/.4/.6s`) and `cubic-bezier(0.16, 1, 0.3, 1)` alongside the Lusion easing set; they agree with each other, which settles our motion defaults.
