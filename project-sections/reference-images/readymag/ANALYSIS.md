# Reference: Readymag (readymag.com)

Captured 2026-08-21 with a headless Chrome pass at 1440x900 (desktop) and 390x844 (mobile). The homepage is short (about 7 desktop viewports) and heavily animated: the hero mosaic and the six category cards cycle through live user-site thumbnails continuously, and the feature verbs rotate in a vertical carousel. Stills freeze one state of each; open readymag.com alongside when judging motion.

Status: product-marketing structure reference. Readymag is a design tool selling to designers, so it earns the right to be loud. BigSquare sells rigor to businesses. We take their section architecture and their "real product UI as illustration" trick, and leave the carnival palette behind.

## Why this reference matters for BigSquare

This is the only scraped reference so far that is a SaaS-style product homepage: hero, feature bento, proof categories, logo band, giant closing CTA, footer. That narrative arc maps almost one-to-one onto a services homepage. It also proves a strong page can be built from one grotesk at one weight (their headings are all weight 400; scale and tight letter-spacing do the work) and from rounded self-contained panels, both of which fit our system. The palette does not transfer at all.

## Screenshot index

| File | What it shows |
|---|---|
| `readymag-home-desktop-01-top.png` | Hero: full-bleed mosaic of user-made sites (each tile cycling), plain left-aligned H1 "Design and launch outstanding websites", one orange pill CTA, angled "DROP / Discounts up to 45%" sticker, nav as detached floating pills |
| `readymag-home-desktop-02.png` | Feature bento: orange workflow card with giant "Send" type, floating product-UI chips (comment bubble, Devices breakpoint panel), gray text panel, black video card, orange teamwork card with vertical verb carousel (Preview / Collaborate / ...) |
| `readymag-home-desktop-03.png` | Verb carousel detail (Connect domain sharp, Publish and Delete fading out), dark green "Expand functionality to infinity" panel with layered flat shapes |
| `readymag-home-desktop-04.png` | Black "Know your audience" panel with minimal bar-chart graphic, purple "Get the best support" panel with Hello! / ? / Ready speech-bubble type lockup |
| `readymag-home-desktop-05.png` | Six showcase category cards (Company websites, Editorials, Landing pages, Design studios, Presentations, Portfolios), each a live cycling thumbnail with a color-coded pill label |
| `readymag-home-desktop-06.png` | Yellow "Teams of all sizes" band with client logo marquee (Airbnb, IDEO.org, Conde Nast, Postmates, Sleeper), then a viewport-scale orange "Try for free" pill and a gray secondary pill |
| `readymag-home-desktop-07.png` | Giant CTA pills settled plus dark five-column lowercase footer |
| `readymag-home-mobile-01-top.png` to `-03.png` | Same flow at 390px: bento stacks to one column and two-up pairs, category grid goes 3x2, giant CTA keeps full width. 02 vs 03 shows the category thumbnails cycling between frames |
| `readymag-home-extracted-data.json` | Fonts, colors, heading metrics, page copy, script list pulled from the live DOM |

## Design tokens (exact, pulled from their live CSS)

From `readymag-home-extracted-data.json`:

- Base: white page `#FFFFFF`, ink `rgb(40,40,40)` body / `rgb(34,34,34)` text, gray panel `rgba(244,244,244,.96)`. Their neutral base is warmer-less than ours but the light-page-plus-near-black-ink skeleton matches Graphite.
- Accents: many, by design. Orange `rgb(255,80,0)` (primary CTA), purple `rgb(136,0,255)`, yellow `rgb(255,187,0)`, dark green `rgb(0,106,42)`, lime `rgb(178,204,0)`, blue `rgb(0,128,255)`, olive `rgb(141,113,40)`. Each category and feature panel gets its own color. This is the exact opposite of our one-accent rule; nothing here transfers.
- Fonts: one custom grotesk (`custom_37866`, Graphik-adjacent; Graphik 400 also ships) at regular and bold, plus Ohno Casual 500 for playful one-offs. Effectively one family carries the whole page.
- Type scale: H1 40px / letter-spacing -2px / weight 400; display moments 80px; every H2 on the page is an identical 30px / -0.8px / weight 400. A single flat H2 size across all sections keeps the bento calm even with wild panel colors. Body 16px system stack.
- Radius: large (roughly 24px panels, full pills for buttons, labels, and nav items). The pill is their entire UI chrome, pushed further than Lusion: nav items are individual detached pills floating over content, not a bar.
- Easings: none in CSS (`easings: []`); all motion is JS-driven. One canvas total. No CSS variables to steal (`--editor-border-color` only); the site is built in Readymag itself, styles are inlined per element.
- Footer: near-black panel, five columns, all-lowercase column headings, plain links, no logo repetition.

## Patterns worth stealing (ranked for BigSquare)

1. **Feature bento of self-contained rounded panels.** Each capability gets one rounded card that is its own mini-composition: H2 top-left or top-right, short body, one illustration. Cards vary in width (roughly 2/3 + 1/3, then 1/2 + 1/2, then full) so the grid never feels like a template. Direct fit for our services or "what you get" section using `--surf` and `--darkpanel` cards with the one blue accent, instead of their rainbow.
2. **Real product UI fragments as illustration.** Floating chips: a comment bubble, a breakpoint switcher, an animation panel, rendered as clean rounded cards with soft shadows inside the feature panels. Our version: fragments of dashboards, ad manager screenshots, metric cards. This satisfies the moodboard's "real work, no stock photos" rule while looking designed.
3. **Vertical verb carousel with opacity falloff.** "Preview / Collaborate / Connect domain / Publish" scrolls vertically, active word sharp, neighbors fading. Cheap Framer Motion pattern, strong for a process or capabilities moment. Corporate-safe.
4. **Flat identical H2s across all sections.** One size, one weight, tight tracking, every section. The discipline reads premium and makes the varied panels cohere. Reinforces our existing H2 system; do not let section headers drift in size.
5. **Showcase cards with cycling media and pill labels.** Category card = live thumbnail + full-width pill caption. Our case study cards could cycle 2-3 screenshots per client with a mono pill tag. The color-per-category coding stays behind; ours would be blue or neutral only.
6. **Logo band inside a tinted panel.** Client logos live inside the rounded statement band, not on bare page background, tying proof to the claim above it. Ours: `--surf` or `--darkpanel` band, grayscale logos per moodboard.
7. **Oversized closing CTA.** A near-viewport-wide pill as the final act before the footer. Theirs is comic-scale; a restrained version (full-width dark CTA band with one large blue pill) is already in our plan and this validates the "go big at the end" instinct.

## What we do NOT take

- The multi-accent palette. Seven-plus saturated hues, one per section, violates our one-accent rule and reads playful-creative, not measured-corporate.
- Color-coded category system. Our tags are mono, uppercase, neutral.
- The promo sticker (angled "DROP" discount badge over the hero). Fun for a tool, wrong for us.
- Ohno Casual moments and speech-bubble typography (Hello! / Ready). Too cute for the brief.
- User-content mosaic hero. We have no gallery of third-party work; our hero stays a framed brand/video moment per the Lusion pattern.
- Detached floating pill nav items. Distinctive but gimmick-adjacent; our nav is a clean bar that solidifies on scroll per the moodboard.
- Their motion volume. Every tile on screen cycling at once is sensory overload for a client evaluating a marketing firm. One or two live elements per viewport, maximum.

## Implementation notes for our stack

- Bento: CSS grid with 2-3 column spans, `rounded-2xl`/`rounded-3xl`, `--surf` default cards, at most one `--darkpanel` and one `--acc` card per grid so blue stays scarce.
- UI-fragment illustrations: build as small absolutely-positioned divs (shadcn Card + Tailwind shadow-sm) over the panel, entering with the standard fade-up stagger. No screenshots-in-browser-chrome frames; bare rounded fragments like theirs.
- Verb carousel: Framer Motion `animate` y-shift inside an `overflow-hidden` fixed-height wrapper, opacity by distance from center; pause under `prefers-reduced-motion` and show the full list statically.
- Their heading discipline is enforcement-free for us: it is exactly one H2 token in the style guide, used everywhere without exception.
