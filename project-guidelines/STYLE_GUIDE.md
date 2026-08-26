# BigSquare Style Guide

The authoritative design system for the BigSquare marketing site. Generated 2026-08-21 from `project-sections/0.design-moodboard.md` plus the 9 scraped reference analyses in `project-sections/reference-images/*/ANALYSIS.md`.

Governance (from CLAUDE.md):
- Follow this file for all design decisions when building any section or page.
- If a design choice is reusable, document it here. Section-specific choices stay in that section's spec.
- If your implementation looks better than what this file says: keep the better implementation, update this file to match, and add a changelog entry at the bottom. Never silently diverge.

Conflict order: `copy-rules.md` > moodboard hard rules (one blue `#0657F9`, light page, no em dashes, reduced-motion respect) > the E2VC-anchored decisions in this file > everything else.

Code status: sections 1 to 3 are already implemented in `app/globals.css` (Phase 1). Everything else in this file describes what Phase 2+ builds. The comments in globals.css that say "STYLE_GUIDE.md section N" refer to the numbered sections below.

---

## 0. Design DNA

One sentence: **a measured, engineered light page that a human has marked up in blue pen.**

Two voices, held in tension (voice 1 rewritten 2026-08-25, the open-layout decision):
1. **The editor.** Open compositions at EDGE width: display type, soft rounded panels, whitespace as structure, per-section theme grounds, and measured details in the margins (mono eyebrows, indexes, counters, tabular numerals, registration marks on framed media). Everything measured and accountable, nothing boxed. The original "instrument" voice (visible rails, info bars, numbered sections) shipped, lost every review it appeared in, and is retired; its measured character survives in the details (4.3).
2. **The hand.** One rough-drawn blue annotation per viewport at most: a bracket around a CTA, a circle around one word, an underline. The proof that people, not a template, made this. (From e2vc.)

Aesthetic keywords (moodboard): Clean. Measured. Premium. Technical. Confident. Airy.
Not: playful, loud, startup-gradient, neon, glassmorphism, stock-photo corporate, retro-CRT, art-project loose.

Restraint budgets (site-wide caps that keep the system quiet):
- Hand-drawn annotations: at most 1 per viewport, at most 3 per page.
- Full-accent surfaces: exactly 1 per page (the closing CTA band).
- Velocity-reactive elements: at most 1 per page (the logo marquee).
- Scroll-scrubbed elements: the homepage hero film takeover (7.4), wayfinding, and one editorial moment. Body copy is never scrubbed.
- Marquee motion: logos only. Headlines never marquee.
- Live/looping elements: at most 2 per viewport (one sanctioned exception: the solution widget row's three quiet loops read as one moment, 7.10).
- WebGL: only where a spec file asks, under 200KB, never hurting LCP.

---

## 1. Color

### 1.1 Graphite tokens (site default, implemented in globals.css)

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F5F6F8` | Page background |
| `--surf` | `#E9ECF1` | Cards, tinted sections |
| `--mid` | `#5A6373` | Secondary text |
| `--ink` | `#0B0F17` | Primary text |
| `--acc` | `#0657F9` | THE blue: primary buttons, links, metrics, annotations. Never changes. |
| `--acc2` | `#0A2A73` | Deep navy, secondary emphasis and depth. Not a second accent. |
| `--onacc` / `--onacc2` | `#FFFFFF` | Text on accent / navy |
| `--line` | `rgba(11,15,23,.12)` | Hairlines, borders, the visible grid |
| `--darkpanel` | `#0B0F17` | Dark sections: proof band, footer, hero media ground |
| `--ondark` / `--ondarkmid` | `#E9ECF1` / `#8D97A8` | Text on dark |

### 1.2 New tokens this guide adds (build in Phase 2 groundwork)

```css
:root {
  /* Accent for text and strokes on dark grounds. #0657F9 fails small-text
     contrast on #0B0F17; e2vc solves this by lightening the accent on dark
     (their #b8cbff). Ours stays in the logo blue family. */
  --accondark: #6E9BFF;   /* ~7:1 on --darkpanel */

  /* Hairlines on non-light grounds */
  --linedark: rgba(233, 236, 241, .14);
  --lineacc: rgba(255, 255, 255, .28);

  --radius-media: 24px;   /* framed media panels, full-bleed image cards */
}

::selection { background: var(--acc); color: var(--onacc); }
```

### 1.3 Usage rules

- `#0657F9` never changes and is the only accent. Navy `--acc2` is depth, not a second accent. No more than one accent color on screen at once.
- On light grounds, accent = `--acc`. On dark grounds, accent = `--accondark`, period (metrics, links, annotations, eyebrow numbers alike). On the accent ground, "accent" = white.
- Metrics and big numbers always `--acc` or `--acc2`, never `--ink` (moodboard rule). On dark: `--accondark`.
- Dark surfaces are for: the hero media panel's interior, the proof/stats band, and the footer. The closing CTA band is the one full-`--acc` surface (see section 5). The rest of the page is light.
- Annotations (brackets, circles, underlines) are always `--acc` (or `--accondark` on dark), never `--acc2`, never `--ink`.
- The logo mark is transparent and sits on any ground without a white box.
- Focus style everywhere (implemented): `:focus-visible { outline: 2px solid var(--acc); outline-offset: 3px; }`.
- `--destructive` (form validation red) is shadcn's default and appears only in form errors. The brand has not picked an error color.
- Never introduce a hue outside this table. The rainbow chip/tile palettes on e2vc, dropbox-brand, and readymag are explicitly not taken.

### 1.4 Alternate palettes

02 Signal (dark), 03 Blueprint, 04 Chalk are defined in the moodboard and implemented in globals.css behind `data-palette` on `<html>`. They exist for landing pages and ad creative only. Never mix palettes on one page. All four keep `--acc: #0657F9`.

---

## 2. shadcn/ui token bridge (implemented in globals.css)

- Stock shadcn components inherit the active palette through the semantic bridge (`--primary: var(--acc)`, `--border: var(--line)`, `--radius: 16px`, etc.).
- Semantic classes (`bg-primary`, `text-muted-foreground`) are for shadcn component internals only. Site code uses palette utilities: `bg-paper`, `bg-surf`, `text-ink`, `text-mid`, `text-acc`, `border-line`, `bg-darkpanel`, `text-ondark`.
- After every `shadcn init` or `add`, strip preset injections (Geist font, oklch palettes, `.dark` blocks). There is no `.dark` mode: dark panels are section themes, not a site mode.
- `--font-heading` maps to the UI face (Apfel), not the display serif. Bluu Next is applied deliberately, never through a shadcn default.

---

## 3. Typography

### 3.1 Families (behind CSS variables, implemented)

| Var | Family | Files in repo | Jobs |
|---|---|---|---|
| `--d` | Bluu Next Bold 700 (+ Italic) | `BluuNext-700.woff2`, `BluuNext-700-Italic.woff2` | H1, H2, statements, big metrics |
| `--dt` | Bluu Titling 400 | `BluuTitling-400.woff2` | Rare display alternates only |
| `--t` | Apfel Grotezk 400/500/700/900 | `Apfel-{400,500,700,900}.woff2` | Body 400, UI/nav 500 (Mittel), H3 + buttons 700 (Fett), rare heavy emphasis 900 (Satt) |
| `--m` | IBM Plex Mono (next/font, placeholder) | injected as `--font-plex-mono` | Eyebrows, Nº labels, chips, counters, meta |

Never hard-code font names outside the CSS variables: the display font is not fully locked and the mono is a placeholder (moodboard). Both display and body are SIL OFL, self-hosted.

Weight discipline (every reference agrees: Lusion ships 3 weights total, Metacci 3, Obys 2): each component uses exactly one weight per slot. Do not reach for 500 vs 400 ad hoc; the slots above are the whole vocabulary.

### 3.2 Type scale (fluid, clamp between 390px and 1440px)

Viewport-scaling lives on display classes only. Never scale `html` or `body` font-size (obys-aim and pxpush both do; it breaks user font-size preferences and zoom).

| Token | Value | Face / weight | Line height | Tracking |
|---|---|---|---|---|
| `--text-display` | `clamp(52px, 34px + 6.2vw, 124px)` | Bluu 700 | 1.02 | -0.015em | 
| `--text-menu` | `clamp(36px, 24px + 2.6vw, 64px)` | Bluu 700 | 1.1 | -0.01em |
| `--text-h1` | `clamp(40px, 31px + 2.3vw, 64px)` | Bluu 700 | 1.05 | -0.01em |
| `--text-h2` | `clamp(32px, 27.5px + 1.15vw, 44px)` | Bluu 700 | 1.1 | -0.01em |
| `--text-statement` | `clamp(28px, 17.6px + 2.67vw, 56px)` | Bluu 700 | 1.15 | -0.01em |
| `--text-metric` | `clamp(48px, 39px + 2.3vw, 72px)` | Bluu 700 | 1.0 | -0.01em |
| `--text-h3` | `clamp(20px, 18.5px + 0.38vw, 24px)` | Apfel 700 | 1.3 | 0 |
| `--text-lead` | `clamp(20px, 19.3px + 0.19vw, 22px)` | Apfel 400 | 1.5 | 0 |
| `--text-body` | `clamp(17px, 16.6px + 0.1vw, 18px)` | Apfel 400 | 1.6 | 0 |
| `--text-small` | `15px` | Apfel 400/500 | 1.5 | 0 |
| `--text-eyebrow` | `13px` | Plex Mono 400 | 1.2 | 0.08em, uppercase |
| `--text-mono-sm` | `12px` | Plex Mono 400/500 | 1.2 | 0.06em, uppercase |

Notes:
- The text-* utilities must be registered as font-size classes in the tailwind-merge config (`lib/utils.ts`), or `cn()` treats them as text colors and silently drops them next to any text-sec-* color class. Keep that list in sync with this scale.
- The -0.01em display tracking is a starting point. Metacci and Youtech run -0.02em on grotesks; Bluu is a serif and needs less. Test on real headlines before tightening further; never looser than 0.
- `--text-statement` is the positioning-statement size (obys-aim manifesto pattern): one per page maximum, usually directly under the hero.
- Body never goes below 17px. The 14px bodies on e2vc and dropbox-brand are explicitly not taken.

### 3.3 Typesetting rules

- One H1 per page. Every H2 on a page is the same size (`--text-h2`); section headers never drift per section (readymag's flat-H2 discipline).
- Sentence case for headlines, Title Case for nav and button labels, ALL CAPS only for mono eyebrow-family labels (copy-rules).
- Bluu Next Italic: single-word emphasis inside a display headline, at most once per page. Bluu Titling: reserved; do not use without a spec asking.
- All mono numerals set `font-variant-numeric: tabular-nums` (counters, metrics, chips) so cycling values never jitter.
- Counters read "1/6", never "1—6" (no em dashes anywhere, including mono labels). Nº labels read `Nº001 / INTRO` with a slash.
- Line length: body max ~65ch, support paragraphs in section headers max ~40ch.
- Big display type may crop at section edges only in the footer wordmark moment (section 6.8), nowhere else.

---

## 4. Spacing, layout, and the hairline grid

### 4.1 Spacing scale and section rhythm

8px base grid. Scale (Tailwind's default steps cover it): 4, 8, 16, 24, 32, 48, 64, 96, 128.

```css
--section-y:    clamp(64px, 52px + 3.05vw, 96px);   /* default section padding */
--section-y-lg: clamp(96px, 84px + 3.05vw, 128px);  /* hero, statement, CTA band */
--gutter-x:     clamp(20px, 5vw, 72px);             /* page edge padding */
```

Whitespace is a feature: whole quiet viewport moments are part of the rhythm (e2vc), but our default stays the moodboard's 96px, not Metacci's half-viewport gaps.

### 4.2 Page framing (rewritten 2026-08-25)

- Sections frame at `EDGE` (`px-[max(5vw,40px)]`, shared from `lib/layout.ts`): full-width compositions with generous edge padding. This is the width FeaturedWork introduced and the whole built homepage runs.
- Long-form copy (service, industry, blog, legal pages) never fills EDGE: body columns cap at the 3.3 measure (~65ch). A narrow centered column (conversion pages, forms) is the same rule applied to a whole page.
- Grids are per-composition (card rows, link tables, footer columns): 24px gaps desktop, 16px mobile, outer edges on EDGE. There is no page-level 12-column chrome.
- Mobile keeps everything. Patterns reflow to one or two columns; nothing is hidden below 390px (every reference survives 390px by stacking only).
- The 1200px `Container` survives in exactly one place, the footer (6.8). Do not introduce it on new pages.

### 4.3 Hairlines and marks (demoted 2026-08-25: accents, not architecture)

The v1 "visible hairline system" (full-height column rails, info bars, page-level grid chrome) is RETIRED sitewide: Brad rejected it in every build that shipped it (hero round 1, featured work build 1, footer round 1). What survives is the measured detail work, applied to components rather than pages, all 1px, all from the section theme's line token:

1. **Separators.** Horizontal 1px rules framing eyebrows, list rows, and link tables. They draw in on entry (`<SeparatorIn>`, section 7.3). The ruled-ROW family stays fully alive and approved: 6.10's numbered ruled list, `RuleLink`, `RuledLinkTable` (the services spotlight index is the proof).
2. **Registration marks.** Small "+" glyphs (12px, 1px stroke, theme line color at full strength) at the corners of framed media, exhibit windows, and the progress rail's caps (lusion, pear-no). Marks are `aria-hidden`.
3. **Tabular mono numerals** wherever numbers cycle or align (6.2).

`GridLines` and `InfoBar` stay in the repo for `/dev/styleguide` only; never mount them on a page. Skip e2vc's bending-line canvas rebuild: a detail nobody consciously sees, at canvas cost.

### 4.4 Radius, borders, shadow

| Token | Value | Used for |
|---|---|---|
| `--radius-card` | 16px | Cards, FAQ container, inputs (bridged to shadcn `--radius`) |
| `--radius-media` | 24px | Framed hero panel, full-bleed image cards, bento panels |
| `--radius-popup` | 24px | Dialogs, mega menu panel |
| nested media | 8px | Media inside a 16px card |
| pills | 999px | Buttons, chips, tags |

- Borders: 1px `--line` (theme-scoped) everywhere. No 2px borders.
- Shadows: none at rest. A soft shadow (`0 8px 24px rgba(11,15,23,.08)`) appears only on hover of interactive cards, and on floating chrome (mega menu, popup, UI-fragment chips).
- No gradient fills, no glassmorphism. Backdrop blur is allowed only on the scrolled nav bar.

### 4.5 The open layout (sitewide default, 2026-08-25)

Born as the homepage lower region's pivot (2026-08-24, Brad's call after the 2D rejection: Youtech's open flow instead of the instrument grid), promoted to the SITE'S layout system 2026-08-25 (Brad's interior-planning call, `interior-buildout-plan.md` decision D1). One system, no parallel interior dialect:

- Structure comes from soft panels (`bg-surf rounded-[24px]`), display type, whitespace, and per-section themes (5). Never from visible grid chrome.
- Edges: `EDGE` (4.2). No rails, no info bars, no Nº section labels on any page (the hero's `Nº001 / INTRO` film meta is grandfathered).
- Ruled ROWS are not chrome and stay legal everywhere (4.3): numbered ruled lists, rule links, ruled link tables.
- Interior pages take the open posture plus a CONTENT SPINE: section headers, media exhibits, card grids, and CTA bands frame at EDGE; long-form copy sits in the ~65ch measure (4.2). Huge-left, small-right (6.3) is the default section anatomy.
- Interior pages default to ZERO pinned runways; the homepage's set pieces are the exception, not the pattern. Interior character comes from the cheap signature moves (8): annotations within budget, mono meta, ruled rows, framed media as objects, theme alternation, the closing accent CTA + dark footer.
- Homepage-specific: content wrappers keep `relative z-10` (HomeStage layering contract). The cube companion passes BEHIND filled panels, not through reserved whitespace.

---

## 5. Per-section theming

Every section declares a theme scope; components written against the `sec-*` tokens work on every ground unchanged. This is the cleanest pattern in the reference set (e2vc's `--section-*`, pxpush's `.section__*`, third-confirmed by metacci) and is how one component system serves light, tint, dark, and accent sections.

```css
/* Attribute selector, not section[data-theme]: the footer (6.8) and other
   non-<section> elements carry themes too. :root holds light-value sec-*
   defaults so sec-* components resolve outside a themed scope. */
[data-theme] { background: var(--sec-bg); color: var(--sec-ink); }

[data-theme="light"] {
  --sec-bg: var(--paper);     --sec-ink: var(--ink);
  --sec-mid: var(--mid);      --sec-line: var(--line);
  --sec-acc: var(--acc);
}
[data-theme="tint"] {
  --sec-bg: var(--surf);      --sec-ink: var(--ink);
  --sec-mid: var(--mid);      --sec-line: var(--line);
  --sec-acc: var(--acc);
}
[data-theme="dark"] {
  --sec-bg: var(--darkpanel); --sec-ink: var(--ondark);
  --sec-mid: var(--ondarkmid); --sec-line: var(--linedark);
  --sec-acc: var(--accondark);
}
[data-theme="accent"] {
  --sec-bg: var(--acc);       --sec-ink: var(--onacc);
  --sec-mid: rgba(255,255,255,.72); --sec-line: var(--lineacc);
  --sec-acc: var(--onacc);
}
```

Expose as Tailwind utilities via `@theme inline` (`--color-sec-bg`, `--color-sec-ink`, `--color-sec-mid`, `--color-sec-line`, `--color-sec-acc`) so components write `bg-sec-bg text-sec-ink border-sec-line`.

Theme budget per page:
- `light` is the default; most sections.
- `tint` for alternating emphasis (cards read as `--paper` on `--surf` there).
- `dark`: the proof/stats band and the footer. That is the list.
- `accent`: the closing CTA band only. This is the one place the brand blue goes full bleed (e2vc's accent-footer move, translated). It sits directly above the dark footer.

The hero's dark moment is the media panel's interior (a framed object, not a section theme); the hero section itself is `light`.

---

## 6. Components

Format examples below never contain real numbers or clients. Real values come from spec files or render as `[PLACEHOLDER: what is needed]` (copy-rules).

### 6.1 Buttons

Labels: Title Case, 2 to 4 words, from the approved list (Schedule a Call, Get a Free Audit, See the Results, Download the Guide, Book a Meeting). Never Submit, Learn More, Click Here.

1. **Primary pill.** `--acc` bg, `--onacc` text, Apfel 700 at 16px, padding 16px 28px (14px 24px mobile), radius 999. Hover: scale 1.02 + soft shadow, 150ms `--ease-house`. Active: scale 0.98. On `accent` sections it inverts: white pill, `--acc` text.
2. **Secondary pill.** 1px `--sec-ink` outline, transparent bg, same metrics. Hover: **directional fill** (below), label flips to `--sec-bg`.
3. **Bracket CTA** (signature, e2vc). Mono uppercase 13px label wrapped by a rough.js-drawn `[ ]` bracket in `--sec-acc`. The editorial secondary CTA: report downloads, case study links, "in-page" asks. Full spec in 7.3 and 8.
4. **Rule link.** Full-width row on a 1px bottom hairline: label left, `→` or `↗` right (obys, pxpush). Hover: arrow slides 4px right, hairline darkens to `--sec-ink`, 250ms. For quiet in-section links and list rows.

**Directional fill mechanics** (pxpush, ported to pure CSS): a `::before` fill layer scales up from the bottom on hover and exits through the top on leave, because `transform-origin` swaps between states and is not transitionable:

```css
.btn-fill::before {
  content: ""; position: absolute; inset: 0; background: var(--sec-ink);
  transform: scaleY(0); transform-origin: top;
  transition: transform .3s var(--ease-swoop);
}
.btn-fill:hover::before { transform: scaleY(1); transform-origin: bottom; }
/* label sits above, transitions color 150ms */
```

Two-CTA repeat pattern (youtech): primary + secondary with identical labels wherever the pair repeats on a page. Repetition with consistency reads as a system, not nagging.

### 6.2 Eyebrows, Nº labels, chips

One mono meta family, four uses:

- **Eyebrow**: 13px mono uppercase 0.08em, `--sec-mid`. Sits above H2s.
- **Nº section label** (pxpush): `Nº001 / INTRO`. RETIRED as a page system 2026-08-25 with the instrument layer (4.5); the hero's `Nº001 / INTRO` film meta is the one grandfathered instance. Do not number sections on new pages.
- **Bracketed index** (obys): `[01]`, `[02]` prefixes for list items (services, process steps, featured lists), and `1/6` counters. Tabular nums.
- **Chips**: 12px mono uppercase in a pill. Two styles: outline chip (1px `--sec-line`, transparent) for tags and filters; solid chip (`rgba(11,15,23,.8)` bg, `--ondark` text) for the on-image metric lockup (6.4). Day-range chips on timeline cards are outline chips with the number in `--sec-acc`.

### 6.3 Section header

Slots: eyebrow row (mono eyebrow, optionally on a `<SeparatorIn>` hairline), H2 (baseline reveal), and a right column holding either a support paragraph (`--text-small`, `--sec-mid`, max 40ch, top-aligned to the H2) or the two-CTA pair. Huge-left, small-right (lusion). Stacks on mobile: eyebrow, H2, support, CTAs.

### 6.4 Cards

- **Base card**: `--surf` bg on light sections (`--paper` bg on tint), 1px `--sec-line`, radius 16, padding 24/32. Interactive cards hover: translateY(-2px) + soft shadow, 250ms `--ease-house`. Non-link cards do not move.
- **Case study card** (signature: metacci formula + e2vc lockup): full-bleed image card, radius 24, bottom scrim. Pinned on the image: mono solid chip with the client name top-left, metric chip top-right (format: `+000% [METRIC]`; value from spec files only). Bottom: the outcome IS the headline, number included ("000% more booked calls for [CLIENT]" pattern), Apfel 700 at H3 size, then a rule link "See the Results". Hover: image scales 1.03 over 600ms. Metric chip numbers use count-up on entry.
- **Testimonial card** (youtech lockup): photo left; quote set at H3 scale as the headline; name + company in `--text-small` `--sec-mid`; "See the Results" rule link; 1px vertical hairline; one oversized metric (`--text-metric`, `--sec-acc`, count-up) with a small mono label right.
- **Stat tile / metric block**: number at `--text-metric` in `--sec-acc`, mono uppercase label below in `--sec-mid`. Tiles in the dark proof band sit borderless on the panel; on light they are base cards. Count-up once on entry.
- **Process / timeline card** (metacci): outlined card, no fill. Mono chip holding `01` (digits in `--sec-acc`), one-word or short verb title in Apfel 700, short body, then a checklist with check glyphs in `--sec-acc`. Used for the 90-day timeline with day-range chips (youtech).
- **Bento panel** (readymag): self-contained rounded-24 panel: H3 corner, short body, one illustration. Widths vary (2/3 + 1/3, 1/2 + 1/2, full) but every edge snaps to the grid. Per bento grid: at most one `dark` panel and at most one `--acc` panel; everything else `--surf`.
- **UI-fragment illustration** (readymag): real product UI pieces (dashboard cards, report rows, metric chips from Obsidion or ad platforms) rendered as bare rounded cards with soft shadows floating inside panels. Never screenshots in fake browser chrome, never stock imagery.
- **Logo item** (youtech open strip; supersedes the metacci logo tile, 2026-08-24): FULL-COLOR partner logo floating directly on the ground, no tile, no border, no grayscale filter. Height-normalized to 32px (28px mobile) inside a fixed-height row; wide gaps (48/64px) carry the separation. Lives in the trust marquee.

### 6.5 Nav (rewritten 2026-08-23, direction pivot)

Quiet instrument bar, loud menu (lusion bar anatomy + e2vc editorial index; the v1 center-links bar and mega menu read as template chrome in build review and are retired).

- 72px bar (64px mobile). Logo + wordmark left. Right: exactly two pills: "Let's Talk" (primary sm, /schedule/) and "Menu" (secondary sm, small `--acc` square glyph). No center links.
- Over the page top: transparent, no border. After 40px scroll: `--paper` at 85% + backdrop blur + 1px `--line` bottom border (moodboard).
- The menu is a full-screen `--paper` overlay (Radix Dialog, focus trap, Escape): left, five index rows at `--text-menu` with mono `[01]` brackets (group rows toggle; leaf rows navigate); right on lg+, the active group's ruled mono link table (inline below lg); foot row with Login ↗, DEN/TPA mono, and the "Schedule a Call" pill. Row entrance staggers 55ms with the house ease.
- Active page marker: a static hand-drawn underline in `--acc` on the overlay's index row (annotation system, no boil, no draw-on).
- Luminance-sensing nav (pear-no) is catalogued in 7.4; candidate polish now that the homepage hero settles full-bleed dark under the light bar.

### 6.6 Info bar (RETIRED 2026-08-25)

Retired with the instrument layer (4.5): removed from the hero 2026-08-24, rejected with the footer's round 1. The component stays in the repo for `/dev/styleguide` only. Never mount it on a page.

### 6.7 FAQ

Metacci's "Before you book" objection pattern: eyebrow + H2, then one bordered container (radius 16, `divide-y` hairlines) of shadcn Accordion items. Question: Apfel 700 18px left, chevron right. Answer: body in `--sec-mid`. 5 to 7 questions, one honest "when we are not the right fit" style question if the spec's copy provides it. Emit FAQPage JSON-LD from the same data array.

### 6.8 Footer (rewritten 2026-08-25, round-1 rejection)

Theme `dark`. **Quiet information, one big gesture.** The v2 anatomy (info bar, ruled mono link tables, mono colophon, rails) was built and rejected live: on a page whose whole lower region is the open layout, footer chrome read as "weird grid lines only on this section", chaotic, and nearly a full viewport tall. The corrected model is Youtech's information design crossed with e2vc's playfulness, kept compact.

Anatomy top to bottom:
1. **Link columns**, four, mirroring the services IA exactly (Company, Organic Marketing, Paid Advertising, Design & Development), as PLAIN lists: header in Apfel 700 at 16px `--sec-ink`, links at 15px `--sec-mid` brightening to `--sec-ink` on hover. No rules, no arrows, no mono, no rails, no info bar. 4-up at `lg`, 2-up below.
2. **Locations and Contact** flow as the next row of the SAME grid, so they align to the same columns instead of opening a second block. Each location row is the e2vc clock move, translated: a 7px `--sec-acc` brand square, the city link, and its live local time in the body face with tabular nums. Contact spans both mobile columns (an email address is wider than a half column at 375 and the wordmark's `overflow-hidden` would clip it).
3. **Legal line**: 14px, `SITE_NAME © year All Rights Reserved.` left, Privacy and Terms right. No mark here: the wordmark below is the mark. Privacy and Terms live ONLY here, never also in a link column.
4. **Set piece**: the logo mark at cap height followed by the BigSquare wordmark in Bluu Next, sized together to the full viewport width and cropped by the page's bottom edge (obys), solid `--sec-ink`. Glyphs rise into the crop on the footer's own scroll progress with a per-glyph lag, and letters flood `--sec-acc` bottom-up on hover. Putting the mark INSIDE the crop row is how a footer carries a display-scale logo for free: it scales with the type and adds no height (e2vc sets its own glyph into its wordmark the same way). It is `aria-hidden`; the name exists as real text in the legal line. Nothing may sit below it: it is the page's last pixels.
5. **Paint layer** (optional, desktop): the 7.6 pixel trail scoped to the footer ground. See 7.6.

Rules this sets: **placeholders never ship in site chrome.** A `[PLACEHOLDER: ...]` string is right in a section under review and wrong in a footer that appears on every page, where it reads as debris. Unconfirmed content (socials, office phones, a partner badge) is OMITTED and tracked in tasks.md until the fact exists. The badge slot renders nothing, never an empty box.

Height budget: under one viewport at 1280 (measured 77vh; 73vh at 1536, 99vh at 768, 130vh at 375). A footer taller than the screen is a wall, not a close.

Scope note: the footer keeps the 1200px Container but NOT the hairline instrument (no GridLines, no ruled rows, no Nº labels, no mono meta). Since 4.5's 2026-08-25 rewrite this is no longer an exception, it is the rule everywhere; the footer's Container is the system's one surviving 1200px use.

The accent CTA sits directly above the footer on every page that uses it; together they are the closing brand moment.

### 6.9 Ad credit popup

Scorpion structure per moodboard: logo, one offer, one deadline, one button. shadcn Dialog, radius 24, `--paper` ground, primary pill, mono deadline line driven by `POPUP_DEADLINE`. Exit intent + mobile trigger, 14-day localStorage, route exclusions per spec.

### 6.10 Numbered ruled list

The editorial list pattern (e2vc impact 01-04 rows + pxpush benefits rows + obys rule discipline). A stack of full-width rows, each on a 1px `--sec-line` top hairline, with a closing hairline under the last row:

- Left: `[01]` bracketed mono index in `--sec-acc`, tabular nums (6.2 family).
- Then: the row's text in Apfel 700 (`--text-h3` scale for major lists, 18px for compact lists), optional one-liner in `--sec-mid` below, optional 16px lucide icon between index and text.
- Entry: each row's hairline draws via `<SeparatorIn>`, text uses `<Reveal>`, 80ms stagger between rows. Rows that link get the rule-link hover (arrow +4px, hairline darkens).

Uses: portal feature rows, service-page deliverable lists, and industry-page sections (the homepage problem section used this until the 2026-08-24 region pivot moved it to the open layout). Works on every ground via `sec-*` tokens. This pattern replaces icon-grid and card-row layouts for enumerations; reach for cards only when the content is truly card-shaped (media, metrics, self-contained compositions).

### 6.11 Widget card (solution pattern, 2026-08-24)

The Youtech "That's Where We Come In" card, rebuilt token-native: a 3-up equal grid of quiet cards, each topped by a looping product-UI vignette (7.10).

- Card: `bg-surf rounded-[24px] border border-sec-line p-6 md:p-8`, equal heights across the row. Cards never hover (they are not links).
- Vignette inset: `bg-paper rounded-[16px]` with a fixed min-height so the three title rows align; inner UI elements radius 8. The inset carries the one sanctioned soft RESTING shadow outside floating chrome (it is a UI-fragment illustration, 6.4 family). The inset is `aria-hidden`; the title and one-liner below carry the meaning.
- Below the inset: title at `--text-h3` Apfel 700, one-liner at `--text-body` in `--sec-mid`.
- Vignette content obeys copy-rules claims: no fake numbers, names, dates, or axis values, ever. Blurred value-bars and unlabeled ticks stand in for data; real month names and day numbers 1 to 5 are calendar furniture, not claims.

### 6.12 Product exhibit window (portal pattern, 2026-08-25)

How OUR OWN software is shown on the page. Distinct from the "depicted product UI" rule in the changelog, which governs depicting somebody else's product: that one hard-codes the other product's values, this one is fully token-native, because the product is ours.

- **The window is an object on a quiet ground**, never a screenshot pasted into a card and never full bleed (paper.design; the framed-panel half of signature move 3). Ground ladder: the section ground, the window's own `--paper` face, `--surf` panels inside it. `--radius-media` frame, 1px `--sec-line`, a wide soft resting shadow, inner panels at radius 12 and inner controls at radius 8 (the 6.11 ladder).
- **Air is the exhibit.** A large gap above and below is what makes a UI read as an exhibit rather than an illustration. Do not tuck it against its copy.
- **Structural mock, no numbers.** Until real assets exist, every value renders as a neutral skeleton bar whose width is a layout weight, never a quantity. Field names are fine because a field name is not a claim; digits, client names, dates, percentages, and axis labels are not. Charts are bars, never lines, so nothing can be read as a trend against an axis. This satisfies copy-rules "Claims" while still letting the mock look complete.
- **The preview chip is the honesty gate.** A mono outline chip inside the window's chrome at every width, removed only when the window shows the real product. Put it in the top bar rather than floating it on a corner, where it would collide with the mark inside the frame and the registration marks outside it.
- **One data module owns the content**, so a real screenshot, a recording, or a live embed replaces the mock as a data change, never a layout change.
- **Chrome must not lie about the product.** A web portal gets an app shell; macOS traffic lights say "desktop app". Pick the chrome the real thing has.
- **Progressive disclosure, not one fixed crop.** Drop the rail, the wide tables, and any secondary window at narrower widths so the remaining panels stay at full size. A shrunk-to-fit dashboard reads as broken; a narrower one reads as responsive.
- **A second, smaller window** overlapping the main one buys depth from one extra object and can carry a second story. Widest breakpoint only.
- `aria-hidden` throughout: the section's copy carries every claim.

### 6.13 Form field (2026-08-25)

The first real input on the site (the newsletter capture). Anatomy, from `NewsletterForm`:

- Field: 56px tall, `--radius-card` (16), `--paper` face on every ground, 1px `--sec-line`, 20px inline padding, body type in `--sec-ink`, placeholder in `--sec-mid`. Hover darkens the border to `--sec-ink` over `--dur-fast`; focus is the site-wide `:focus-visible` ring, never a custom one.
- Every field carries a real `<label>`, visually hidden when the composition has no room for it. Placeholder text is never the label.
- Submit is a primary pill sharing the field's height. Inline on `sm`+, full width stacked below on mobile. Never give the input `flex-1` in a column flex container: it zeroes the height basis and the field collapses.
- Error: `--destructive` border plus a `--text-small` message in `--destructive` under the field, wired with `aria-describedby` and `aria-invalid`, `role="alert"`.
- **A form never navigates on success** (Brad, 2026-08-25). No thank-you page, no route change: the visitor keeps their scroll position and the section carries on around them. The confirmation animates in where the form was (fade-up 450ms house, the check glyph scaling in 120ms behind it) and the wrapper LOCKS to the form's measured height at submit time, so the swap cannot shift anything below it at any width. Measure the form, never hard-code a min-height: most forms are one row on `sm`+ and a taller stacked block on mobile. Only the wrapper's own height is exempt from this; `/thanks/` pages remain for the application funnel, where a real page transition is the point.
- Success replaces the form in place, `role="status"` so it is announced, with a check glyph in `--sec-acc`. Use `AnimatePresence mode="wait"` so the form is genuinely unmounted: one left behind the confirmation is still in the tab order and still submittable. Move focus to the confirmation (`tabIndex={-1}`), because the submit button that had focus just left the DOM.
- Every form on the site posts through `submitForm` (`lib/form-action.ts`) with its own `formType`, the page slug, and UTM params. New endpoints are not a thing.

Extract to a shared `Field` primitive as soon as a second form needs it (Phase 3, the audit and contact forms). One use is not a pattern.

### 6.14 Cycling media panel (2026-08-25)

A framed media object that rotates through several images on a slow crossfade (Youtech's newsletter band, `youtech-home-desktop-10.png`). Distinct from a carousel: no controls, no swipe, nothing to operate. It is a picture that changes.

- **The frame is a square** by default, `--radius-media`, 1px `--sec-line`, registration marks at the corners on `lg`+. Square is the brand mark's shape and it is what makes the object read as ours rather than as the reference's tilted snapshot. No rotation: tilted photo cards are the playfulness the moodboard rules out.
- **One data module owns the frame list**, so the count, the order, and the swap from placeholder to real photography never touch the section (the 6.12 swap contract, applied to media).
- **A mono counter chip** (`01/04`, tabular nums, outline chip, inside the frame) is the one piece of chrome. It earns its place by telling the visitor the panel cycles, and it is the honest slot for a tag when there is no real fact to put there.
- **The crossfade stacks every frame and animates opacity**, rather than swapping through `AnimatePresence`: with the list coming from data, the stack keeps the transition deterministic and costs one absolutely positioned div per frame. Inactive frames are `aria-hidden`.
- **Loop discipline is 7.10's, in JS rather than CSS keyframes** (sanctioned deviation, see the changelog): the cycle pauses offscreen via `useInView`, the SSR frame is always frame 1, and reduced motion renders frame 1 alone with the counter reading it and nothing animating. CSS keyframes cannot express an N-frame list that has to swap to `next/image` later.
- **Below `lg` the frame is capped** (~26rem) rather than filling the column. A full-width square at 768 is nearly 700px tall and swallows the section.
- Counts against the 2-live-elements-per-viewport budget (section 0).

---

---

## 7. Motion

### 7.1 Principles and stack posture

- Expensive and calm. Motion confirms structure; it never performs. No bounce easings anywhere, ever.
- **Damped smooth scroll (revised 2026-08-24, Brad's call; supersedes the original "no Lenis" lock).** The marketing pages scroll through Lenis (`SmoothScroll` in the marketing layout): wheel input feeds a virtual target and the REAL scroll position eases toward it every frame, so scrub choreography reads fluid instead of stepping with raw wheel ticks (the Obsidion/lusion feel Brad asked for). What stays native, non-negotiable: the document keeps its real height and real `window.scrollY` (Lenis animates native scroll; no transform-based virtual scroller, so SEO, anchors, and `useScroll` bindings are untouched), touch scrolling stays native (`syncTouch` off), keyboard scrolling stays native, and reduced motion never mounts Lenis at all (plain native scroll, browser scrollbar back). While Lenis is active the browser scrollbar hides and the PROGRESS RAIL replaces it (v3 2026-08-24; v1's thumb read as a generic browser scrollbar, v2's full-height draggable rail was still too much chrome in Brad's reviews): a 1px hairline in the right margin, 62svh tall and vertically centered (clear of the nav by construction), capped top and bottom with "+" registration marks (4.3 signature); a 2px accent line fills it top-down with page progress; the leading edge carries a 7px accent BRAND SQUARE that completes one quarter turn over the page (square at top, diamond at half, square again at the end: the cube's tick in 2D, and this site's proprietary scroll mark). It dims to 45% at rest and wakes to full while scrolling. DISPLAY ONLY: `pointer-events: none`, no drag, no click, no cursor change; it is an indicator, not a control. Desktop fine pointers only, `aria-hidden` (the page stays natively keyboard-scrollable). Modal overlays pause the instrument (`getLenis()?.stop()`/`start()`; the nav overlay does) and scrollable regions inside them carry `data-lenis-prevent`. Programmatic scrolls must go through `getLenis()?.scrollTo` so Lenis's internal target stays in sync. The idle-settle scroll checkpoint (7.4) remains the one scroll assist on top: it acts only after scrolling has stopped and any input cancels it instantly. Reveals fire once (`whileInView`, `once: true`); the pxpush pattern of scrub-reversible body text is explicitly not taken.
- Framer Motion is the engine for everything in this section; each catalog entry below is the Framer Motion port of a reverse-engineered reference effect, with tested starting values.
- Stack tripwire: the analyses confirm Framer Motion + native scroll + rough.js reproduces every chosen pattern. If a future spec demands something it cannot do well (SplitText-grade type work, scrubbed slat wipes at pxpush fidelity), the path is: add `gsap` to PROJECT_REQUIREMENTS.md with a one-line reason first, per CLAUDE.md (`lenis` itself joined the stack 2026-08-24 for the smooth scroll instrument above). Do not reach for it before that spec exists.
- rough.js (~9KB) is the one motion dependency beyond Framer Motion, for the annotation system. It is listed in PROJECT_REQUIREMENTS.md.

### 7.2 Eases and durations (tokens)

```css
:root {
  --ease-house: cubic-bezier(.22, 1, .36, 1);  /* THE ease: reveals, UI, hovers (pear-no; metacci agrees) */
  --ease-soft:  cubic-bezier(.4, 0, .1, 1);    /* layout moves, panel slides, morphs (lusion; dropbox agrees) */
  --ease-swoop: cubic-bezier(.6, 0, 0, 1);     /* decisive arrivals: wipes, fills, tile assembly (dropbox) */

  --dur-fast: 150ms;   /* hovers, micro */
  --dur-base: 250ms;   /* UI state */
  --dur-slow: 400ms;   /* cards, panels */
  --dur-reveal: 700ms; /* text reveals (e2vc/pear) */
}
```

Framer Motion arrays: house `[0.22, 1, 0.36, 1]`, soft `[0.4, 0, 0.1, 1]`, swoop `[0.6, 0, 0, 1]`. Scrubbed values use no ease (linear); the scroll is the easing (pxpush lesson). Wipes and fills run 600ms swoop. Count-ups run 1.4s house.

### 7.3 Reveal catalog (one-shot, on entry)

Build as reusable components in `components/motion/`. All fire once at ~85% viewport, all respect reduced motion (7.8).

| Component | Recipe (Framer Motion) | Values | Use | Source |
|---|---|---|---|---|
| `<Reveal>` | fade-up: `y: 16 → 0`, `opacity: 0 → 1`, stagger children | 500ms, house, stagger 60ms | Default for cards, blocks, media | moodboard |
| `<BaselineReveal>` | line-split headline, each line `y: 110% → 0` inside `overflow: hidden` wrapper | 700ms, house, stagger 115ms/line | H1, H2, statements | lusion, pear |
| `<WordReveal>` | word-split, pure `y: 0.6em → 0` per word, no mask, no opacity | 700ms, house, stagger 45ms/word | Hero H1 alternative, short lines | e2vc |
| `<CountUp>` | animate number to value, tabular-nums | 1.4s, house, once | Metrics, stat tiles | moodboard, youtech |
| `<SeparatorIn>` | hairline `clip-path: inset(0 100% 0 0) → inset(0)` | 600ms, house | Rules above eyebrows and list rows | pxpush |
| `<ClipReveal>` | media frame `clip-path: inset(0 35% 0 35% round 24px) → inset(0 round 24px)`, inner image counter-scales 1.15 → 1 | 800ms, soft | Framed hero panel, featured media | pxpush |
| `<SectionWipe>` | 4 to 6 grid-aligned column blocks rise `y: 100% → 0` staggered over the incoming section | 600ms, swoop, stagger 40ms/column | Entering the dark proof band only | e2vc (stepped columns), pxpush (overlayIn) |
| `<TitleAssemble>` | per-word `opacity 0 → 1` in random order | 300ms, stagger 30ms, `from: "random"` | Mono eyebrows only, at most one per page | pxpush |
| `<TypeOn>` | per-character opacity stagger, telegraph feel | 20ms/char | Mono chips and annotation labels only, never body | pear, pxpush |
| `<RoughAnnotation>` | rough.js paths drawn via `pathLength: 0 → 1`, then 3-frame boil on an interval | draw 1.2s (circle and box 2s), house | Brackets, circles, underlines, box borders | e2vc |

`<RoughAnnotation>` implementation contract (from the e2vc probe): fixed seeds so shapes are stable; `strokeWidth` 3, roughness ~1.6 to 2.8 by variant; stroke from `var(--sec-acc)` read at draw time; 3 pre-rendered boil frames cycled by visibility toggle; the hero circle draws only after its headline reveal completes; after any masked reveal finishes, flip the line wrapper to `overflow: visible` so annotations can overflow the line box; redraw only on viewport WIDTH change (iOS Safari fires height-only resizes while scrolling). Measurement uses layout size (`offsetWidth/Height`), never `getBoundingClientRect`, so an annotation inside a transform-scaled ancestor (the work panel) still draws at full size. The `box` variant (a full-perimeter squiggle for panel-scale surfaces, strokeWidth 4.5, rounded corners matching the surface radius) rides ON the measured edge and takes a `stroke` override set to the surface's OWN fill: the inside half vanishes into the surface and only the wobble escaping onto the ground shows, so the box's edge itself reads hand-drawn (a contrasting line floating inside the box read as cheap: Brad, work panel round 6). Its edges are chopped into ~240px runs before rough.js sees them: one long rough line only bows, and at thousands of px that reads as ruled, not hand-drawn.

Hero exception: hero text animates on mount, not on view, and must not delay the LCP element (the hero media poster). Total hero choreography under 1s.

### 7.4 Scroll-linked catalog (progress-driven, no hijack)

The architecture is pear-no's fraction table done with Framer Motion: per section, `useScroll({ target, offset })` + `useTransform`, every effect a pure function of progress. Scrubbed transforms use linear mapping, no ease.

- **Hero film takeover + cube companion, "the glass square becomes the film, then the square again"** (homepage only; v6 2026-08-23: the canvas is now a PAGE-LEVEL fixed layer, lusion's architecture, hosted by `HomeStage`; layering nav z-50 > section content z-10 > canvas z-5 > grounds/rails). A 374/560vh wrapper drives a sticky 100svh stage; the v5.1 choreography fills the first 6/7 and the last 1/7 is the REFORM: the framed panel un-balloons back into the glass cube (film re-inks and quenches, glass re-frosts, smoke re-ignites) while the material crossfades from transmission glass to alpha glass and the in-canvas backdrop retires, so the real page composites through the cube from then on. Round 14 (2026-08-25) made the reform ONE CONTINUOUS CONTRACTION: the sub-beats overlap (never a parked flat slab), the dark film skin rides the exact same scale math as the thickening glass and melts off it as a canvas-topmost overlay (depthTest false: the transmission glass otherwise erases any transparent partner it covers), the cube winds into its companion pose plus a whole turn as it forms (R_SPIN_IN), and the companion handoff is stepless both directions at any dwell time (engage-epoch idle turn + whole-turn bias + wrapPi exit residual). Past the hero the cube is a scroll COMPANION on a waypoint journey keyed to `data-cube-anchor` sections (behind the ink, over the grounds): the featured work panel morph, past the problem strip, then the solution CARD SWEEP (the section PINS in full viewport — SolutionStage sticky child + 130svh runway spacer, measured sticky top — and the scrub sweeps the cube flat right-to-left under the frozen cards along a px path built from the grid's live column centers, each title drawing a boiling rough underline as the cube crosses beneath it; the path enters and exits below the frame so the waypoint handoffs are off-screen; the whole runway is a free-park zone, no checkpoint bands; `lib/solution-sweep` keeps canvas, ink, and stage on one rect clock), then a HIDDEN PASSAGE behind the search + proof-band grounds (those two sections lift themselves to z-[6], above the canvas: the sanctioned occluder exception to the layering contract) until the trust marquee releases it, up the services rail, then dissolving. Mobile gets a short drift-and-fade exit instead. Extend the waypoints when later sections want the object; one canvas, still never the LCP element. A glass cube with a solid `--acc` core (the brand mark as an object; transmission glass + RoomEnvironment) floats above the copy, drifts, and answers the pointer; on scroll it swoops behind the exiting headline, flattens into a glass pane the size of a 16:9 media card, the film develops over that footprint (ink-duotone `#0A2A73`→`#6E9BFF` resolving to true color), and the card balloons out with a per-vertex-lagged cloth bend into a framed panel at `max(6vw, 96px)` margins (round 4: 4vw ran the panel top under the 72px nav bar), radius `--radius-media` (media as an object, never full bleed), with mono meta and registration marks. DOM scrubs are pure functions of native scroll; canvas actors follow a time-damped follower of it (rate ~5.5/s) so fast flicks stay legible: still no hijack, no Lenis. The ink line is retired; the hero keeps only the circle annotation. Reduced motion: statement then settled framed panel, no canvas at all. Engineering contract in 2.hero.md v5 (r3f uniforms-clone trap, transmission-buffer exclusions, raw-sRGB pipeline, DPR watchdog, offscreen pause).
- **Scroll checkpoints (idle-settle)** (`useScrollCheckpoints`, 2026-08-24): the companion rule for any pinned scrub wrapper. The scrub itself stays a pure function of native scroll, but a pinned choreography must not be parkable mid-beat: the hook watches scroll go idle (160ms of quiet, no pointer or touch held) and, if the wrapper's progress stopped between two authored rest beats, glides the page (450 to 1100ms, distance-scaled, ease-in-out cubic) to the beat boundary the gesture was heading for, so every beat plays in whole. A stop less than 6% into a beat settles back instead of committing forward, so only a stray last wheel notch retreats; any deliberate gesture tips the beat over and plays it through (retuned twice on Brad's 2026-08-24 reviews: 22% and 15% both read as a hurdle you had to out-scroll in one go). The glide runs ~450ms per viewport, clamped 450 to 1500ms. The settle triggers as soon as Lenis velocity decays under ~2px/frame with no user input for 120ms: waiting for full scroll-event silence meant waiting out the whole lerp tail, which read as a hang at each beat's cusp; a 100ms event-silence timer remains as the no-Lenis fallback. Checkpoints must sit on frames where the choreography is genuinely at rest AND a band boundary: parking one short of a beat's start (the hero's old 0.98K panel rest, ahead of the reform at K) leaves a dead zone that makes the boundary feel sticky. Any input (wheel, touch, key, pointer) cancels the glide instantly; disabled under reduced motion. Glide writes go through `getLenis()?.scrollTo(..., { immediate: true })` when the smooth scroll instrument is mounted so its internal target stays in sync. This is NOT hijack in the input sense: input is never remapped or slowed beyond the sanctioned 7.1 damping. Every pinned scrub section ships with its rest beats declared as a checkpoint list (hero: statement 0, held card 0.60K, settled panel at K exactly, release 1); beats whose position depends on live layout use the `bands` option instead (absolute-scrollY ranges resolved at settle time; the featured work pin runway and exit window). HARD LESSON (work panel rounds 7-9): a checkpoint band must never span more scroll than its own beat. Round 7 merged film-rest-to-settled-panel (~100vh) into one band to read as "one animation"; the settle then committed a single wheel notch into a max-duration glide through the entire journey ("blasted past the cube spinning animation entirely"). Continuity comes from giving the choreography its own PINNED SCROLL RUNWAY scrubbed 1:1 (the hero's architecture), never from a glide that plays it for the visitor. Round 9 refined this INSIDE the runway too: the band must start where the choreography actually commits (the work morph's dive, MORPH_REST), not at the pin start; zones where the actor is alive at rest (float, spin) park freely with no band at all. And when a committed band IS long (a dive-to-settled morph, ~1.3 viewports), the default 450ms/vh glide reads as a jump cut: the hook now takes per-instance `glideMsPerVh` / `glideMaxMs` (work morph: 2600/5000) so a forced completion plays at the choreography's own tempo. Short beat hops keep the default; only a beat that IS the animation earns a slow glide. When one wrapper needs BOTH tempos (round 14: the hero's Act-1 rests at the default, the reform band [K, 1] at 2600/3000, because its 450ms default glide was the "white box zooms up" warp), mount two hook instances with disjoint checkpoint lists: each is inert outside its own range, and MIN_GLIDE_PX keeps both quiet at the shared rest.
- **Ambient square field** (`SquareField`, 2026-08-24, Brad's ask; retuned twice same day on his reviews): the page's quiet undercurrent. Ten hairline ink square outlines on a fixed page-level layer, in two registers: eight tumblers (64 to 270px, 3 to 5% opacity, 1px stroke) and two off-frame JELLYFISH (680/820px anchored past the viewport edges, 2.4 to 2.6% opacity, 0.75px stroke, near-zero spin, low parallax, drift and breathing clocks stretched ~1.75x) that billow across sections like something huge passing in deep water. Every square slow-spins (mixed directions), breathes in scale (±3.5 to 6.5%), wanders on two incommensurate sines per axis, and carries its own parallax depth (scrollY × 0.038 to 0.165, bigger = nearer = deeper), so every section arrives at a reshuffled composition; smoothed scroll velocity adds a tiny stir to the spin; squares recycle vertically through an offscreen band (wrap pad past the rotated diagonal) so the field never empties. LAYERING is a handoff across the cube canvas (`heroStage` prop, Brad's call: the field must be visible in the hero): through the statement and film beats the layer rides at z-6, above the canvas's opaque in-canvas paper backdrop and under all ink, indistinguishable from sitting in the paper; at the reform (progress >= HERO_K) it drops to z-1, dipping under the still-standing backdrop and resurfacing as it retires, so from the release on the cube companion passes OVER the field. No-canvas branches (reduced motion, no WebGL, pages without the hero wrapper) stay at z-1 over the DOM grounds. Engineering: one rAF loop writing transform strings, zero canvas, anchors SSR-rendered from a deterministic seed table (every animated term starts at zero, so hydration cannot pop); the layer SSRs at opacity 0 and materializes over 0.8s on mount; parallax ramps in over 1.6s. Homepage today (mounted by HomeStage); any page can host it. Budget: it must stay below conscious notice; if a screenshot draws the eye to it, opacity is too high; ink-on-dark means it deliberately vanishes into dark grounds. Reduced motion: static seed composition, no loop, no z handoff.
- **Chapter rail** (pear): fixed mono label + tick marks drawn by `pathLength` against page progress. For the method page and long industry pages. v2, not homepage.
- **Manifesto darkening** (e2vc talent page): statement paragraph's words scrub `--mid` → `--ink` over the section. About page only, one instance site-wide.
- **Marquee velocity coupling**: see 7.5.
- **Luminance-sensing nav** (pear): 8x5 offscreen canvas samples the media behind the header every ~160ms while a media section intersects; hysteresis thresholds toggle a `data-on-light` attribute consumed by nav CSS. Only for full-bleed media pages (VSL template).
- **Scroll-scrubbed frame sequence** (pear): WebP sequence + manifest + nearest-loaded-frame + max one decode per frame. Reserved for the Obsidion portal section IF its spec asks; cheaper and more robust than Three.js for one wow moment.

- **The portal window morph** (9.portal.md v3): the companion's ending. Pinned runway; the cube dives onto the preview window's logo mark, flattens to the shared slab square, floods `--acc`, and the DOM takes over to stretch the chrome bar out around it and unroll the body downward. Fourth instance of the pin-and-scrub pattern (hero film, work panel, solution sweep, this), and the standing rule now: reuse the mechanics, never the gesture.
### 7.5 Marquee and velocity rules

- Logo marquee: track at ~50px/s desktop, 35px/s mobile. Never pauses and never reverses (hover pause retired with the tiles, 2026-08-24, Brad's call); logos render full color at all times (grayscale-to-color hover also retired). Duplicate the track for the seamless loop; `aria-hidden` the duplicate.
- Velocity boost (pxpush, optional polish): add scroll velocity MAGNITUDE × ~0.5 to the track speed, clamped to +3× base, decayed by 0.9/frame; scroll in either direction only speeds the strip up. The logo marquee is the page's ONE velocity-reactive element.
- Headlines never marquee. Section titles sit still (pxpush's 12vw marquee H1s are not taken).
- Reduced motion: marquee renders as a static centered wrapped row of the same logo items.

### 7.6 The pixel cursor (signature, translated)

`<PixelTrail>`: pxpush's square-pixel trail, made quiet and blue.

- Fixed full-viewport `pointer-events: none` layer holding a 24-column grid of square cells (`100vw / 24`).
- On pointer move, the cell under the pointer sets `opacity: 1` and fades back to 0 over 250ms (CSS transition). Fill: `--acc` at 8% opacity (tuning range 6 to 12%; it should be felt, not watched).
- No blend modes, no gooey filter, no cursor replacement: the native cursor stays.
- Desktop pointer-fine only, min-width 1024px; initialized via `requestIdleCallback`; disabled entirely under reduced motion; suppressed over `[data-cursor-quiet]` zones (nav, forms, mega menu).
- Budget: ~40 lines, zero canvas.

**First instance shipped 2026-08-25 as the footer paint layer** (`FooterPixelGrid`, 6.8), scoped to one section rather than the viewport. Two corrections the build makes to the spec above, binding for the site-wide version: size cells by a TARGET EDGE (~34px) and derive the column count per width, because a fixed 24-column grid gives 53px rectangles at 1280 that read as blocks, not pixels; and on a dark ground the fill is `--accondark` at ~14% with a ~700ms fade (the 8%/250ms values are tuned for ink on paper and vanish on `--darkpanel`). `requestIdleCallback` must be bound to `window` before it is stored in a variable or Chrome throws on the call.

### 7.7 Hover micro-interactions

- Primary pill: scale 1.02 + soft shadow, 150ms (moodboard).
- Secondary pill and full-width rows: directional fill (6.1), 300ms swoop.
- Cards: translateY(-2px) + soft shadow, 250ms house. Card images: scale 1.03, 600ms house.
- Rule links: arrow +4px, hairline darkens, 250ms.
- Logo tiles: grayscale → color, 250ms.
- Everything interactive has a hover state (moodboard bar) and the focus-visible ring.
- Not taken: text scramble on hover, image-trail menus, letter-swap title hovers. Too loud for the brief.

### 7.8 Reduced motion (hard rule)

Wrap the app in `<MotionConfig reducedMotion="user">` and verify per component:

| Pattern | `prefers-reduced-motion` behavior |
|---|---|
| Reveal / BaselineReveal / WordReveal | Instant, fully visible; no transforms |
| CountUp | Renders final value immediately |
| Marquee | Static wrapped row |
| SectionWipe / ClipReveal / SeparatorIn | Content renders settled |
| RoughAnnotation | Renders drawn, no draw-on, no boil |
| PixelTrail | Off |
| TypeOn / TitleAssemble | Full text immediately |
| Hero video | Poster frame; play only on user action |
| SquareField | Static seed composition; no loop, no parallax, no spin |
| Widget loops (7.10) | Settled end frame (rows checked, bars grown, static month); zero looping |
| Hover motion | Color/opacity changes only, no transforms |
| Smooth scroll + scrollbar instrument | Never mounts; plain native scroll, browser scrollbar back |
| Scroll checkpoints (idle-settle) | Off; no automatic scrolling of any kind |
| Footer wordmark (6.8) | Settled in the crop; no rise, hover flood is a color change only |
| Footer paint layer (7.6) | Never mounts; zero cells in the DOM |

### 7.9 Performance rules

- Animate `transform` and `opacity` only. Never top/left/width/height.
- Any canvas (if a spec ships one): pause via IntersectionObserver when offscreen; max one texture upload per rAF; DPR watchdog stepping devicePixelRatio down after sustained slow frames (pear's two rules, ported verbatim); dispose everything on unmount.
- Three.js: only where a spec asks, under 200KB gzipped total, lazy-loaded, never the LCP element. The chrome-object recipe if a portal moment ships: `MeshPhysicalMaterial` metalness .92 / roughness .05 / clearcoat 1 + `RoomEnvironment` env map, duotoned to graphite/navy (pxpush).
- Hero choreography completes under 1s; LCP element is the hero media poster; CWV green on every page (LCP < 2.5s, INP < 200ms, CLS < 0.1).
- Reveal wrappers must reserve layout (no CLS from split text).

### 7.10 Looping widget vignettes (2026-08-24)

CSS `@keyframes` enter the stack for exactly one job: ambient product-UI loops (the solution widget cards; Youtech ships these as MP4s, ours are markup, a strict upgrade: crisp at any DPI, theme-aware, a few KB, pausable). Sanctioned pattern, binding for any future loop:

- Transform and opacity only, house/swoop eases, no bounce.
- One shared duration per widget. Every element sequences via percentage keyframes plus `animation-delay` for stagger, so the widget is a single synchronized timeline with a seamless repeat and a deterministic keyframe-0 first frame (SSR-safe, no random seeds).
- All keyframes and applying classes live in the `wgt-*` block in globals.css. Widget roots carry `.wgt` and play only while `data-play` is set (toggled by Framer `useInView`), so loops pause offscreen and the SSR frame is always static.
- Reduced motion is TWO layers, both required: the CSS kill (`.wgt * { animation: none !important }`) and the component rendering the settled end frame via `useReducedMotionSafe()`.
- No fake numbers, names, or dates inside a vignette, ever (copy-rules claims discipline).
- Budget: loops count against section 0's live-element line. The solution row's three quiet loops on one row read as one moment and are the region's whole live budget (sanctioned exception to the 2-per-viewport cap, Brad's brief).

---

## 8. Signature moves

The BigSquare identity kit. Each move names its source; together they are what makes the site ours. Anything on this list appears deliberately and within its budget; nothing else gets invented mid-build without updating this file.

1. **Hand-drawn annotation system** (e2vc, the anchor). One `<RoughAnnotation>` primitive with four variants: bracket (the Bracket CTA), circle (one word in the hero H1), underline (key links, nav active state), box (the featured work panel's edge treatment: stroked in the panel's own fill so the edge itself boils, see 7.3). Stroke defaults to `var(--sec-acc)` read at draw time; the box variant overrides it with its surface's fill. Fixed seeds, draw-on entry, gentle boil. Budget: 1 per viewport, 3 per page (a box taller than a viewport still counts as 1).
2. **Measured detail work** (e2vc, pear, lusion; demoted from page architecture 2026-08-25, see 4.3). Drawn-in separators, ruled rows and link tables, "+" registration marks around framed media, tabular numerals. The rails and info bars are retired; the measured feel lives in the details.
3. **The film takeover** (lusion, revised 2026-08-23). The homepage hero: viewport-scale type on paper, then the brand film rises on scroll from a rounded inset object into the full viewport and pins (7.4). The framed rounded-24 panel remains the pattern for every other media moment (portal preview, case media): media as an object on the page, full bleed only when it is the set piece.
4. **Per-section themes** (e2vc, pxpush). Every section a `data-theme` scope; the theme budget (5) is the page's dramatic structure. (The Nº-label half of this move retired 2026-08-25 with the instrument layer; the hero's 001 meta is grandfathered.)
5. **Tag-chip metric lockups + outcome-first case headlines** (e2vc + metacci). Client chip left, metric chip right, pinned on the image; the result with its number IS the card headline.
6. **Directional button fills** (pxpush). Secondary pills and rule rows fill from the bottom and exit through the top.
7. **Baseline and word reveals with the house ease** (lusion, pear, e2vc). Headlines rise from their baselines; `cubic-bezier(.22, 1, .36, 1)` everywhere.
8. **The quiet pixel cursor** (pxpush, translated). A sparse blue square trail on desktop: the company name, drawn by the pointer.
9. **Editorial mono meta** (obys-aim). Bracketed indexes, 1/6 counters, footnote-style qualifications on claims (mono markers resolved in a hairline row; only for claims with real sources).
10. **The closing set piece** (e2vc, obys, youtech). The accent CTA, then the dark footer: quiet plain link columns, live office times behind brand-square glyphs, and the viewport-scale wordmark cropped by the page's bottom edge (rewritten 2026-08-25; the ruled mono tables are retired, see 6.8).

## 9. Homepage effect map

Sequencing aid for Phase 2, rewritten 2026-08-24 to the region-pivot order (below FeaturedWork the page runs the open region, 4.5):

| Section | Theme | Patterns |
|---|---|---|
| 1. Nav | n/a | Two-pill instrument bar, scroll solidify, full-screen overlay index menu, static annotation active state |
| 2. Hero | light | The film takeover (7.4): display-scale H1 + circled word on mount, instrument strip on the fold, glass-cube set piece, mono film meta. No CTAs, no rails, no closing info bar (featured work rises into the release beat) |
| 2b. Featured work | light | The portfolio moment (2b.featured-work.md): display-scale headline rising into the hero's release rest beat, lusion-scale 2-col work grid at EDGE, 3:2 darkpanel media cards, `--text-menu` titles with the arrow-leads-title hover. Unnumbered, no rails |
| 3. ProblemStrip | light | Open region: one soft `--surf` panel, claim left, four x-marked lines right (x-glyphs `--sec-mid`, never red). Compact and quiet on purpose; one Reveal stagger |
| 4. Solution | light | Open region: the page's one `--text-statement` headline (BaselineReveal), intro + CTA pair, 3 widget cards (6.11) with looping vignettes (7.10) |
| 5. Search | tint | Open region: one-to-one ChatGPT composer mockup with the typewriter + camera loop (5b.search.md v2; a depicted product, see the "depicted product UI" changelog rule) |
| 6. Services | light | Open region: 3 pillar cards (6.services.md v3; the ruled-table build is superseded and stays in place until its session) |
| 7. Testimonial | — | RETIRED from the homepage (homepage-close restructure, 2026-08-25); the lockup pattern moves to interior pages once real testimonials exist |
| 8. Proof numbers | dark | Borderless stat tiles in `--accondark`, CountUp; sits directly under Search with the marquee beneath it, one extended trust block (7.proof-numbers.md v3.3; SectionWipe deferred) |
| 9. Trust marquee | light | Open full-color logo strip (6.4 logo item), marquee rules (7.5), the page's one velocity element; rides directly under the dark proof band as one extended trust block (3.trust.md v2.3) |
| 10. Obsidion portal | tint | Open region: centred two-tone headline, then the product exhibit window (6.12) as the section centrepiece, then a 5-up feature row and the CTA. Structural mock with a `PORTAL PREVIEW` chip until Brad's live portal code fills the slot. **The companion journey ENDS here**: the cube flattens onto the Obsidion mark in the window's chrome bar and the window grows out of it (7.4, pinned runway) |
| 11. First 90 days | light | THE PAGE'S CLOSING SET PIECE (10.how-it-works.md v3.1): the 90-square day grid on the returning blue slab, pinned over a 160svh runway. A 10x9 grid of day-cells (rows map to phases) fills 1:1 with the pin (~1svh/day), drag-to-scrub with a chasing clock (hover only highlights), real slider role; at day 90 the cells merge into ONE solid square that GROWS INTO THE CLOSING CTA: white panel in a blue ring, closing line with a hand-drawn circle on "day 90", Schedule a Call pill, boiling white edge squiggle, smiley doodle. Checkpoint band over merge-to-finale. Slab = the FeaturedWork treatment, its second and last appearance, bookending the region |
| 12. FAQ | — | RETIRED from the homepage (homepage-close restructure, 2026-08-25); the accordion + FAQPage JSON-LD move to interior pages |
| 13. Final CTA | — | SUPERSEDED by the First 90 days finale (homepage-close restructure, 2026-08-25): the day-90 merge morphs into the closing ask, and the footer lands directly under it. 13.final-cta.md stays as the pattern source for interior-page CTA bands |
| Footer | dark | Plain link columns (no rules, no mono, no rails), locations with live local times behind brand-square glyphs, legal line, then the viewport-wide BIGSQUARE cropped by the page's bottom edge with the per-letter rise and hover flood; desktop gets the footer paint layer (6.8, 7.6) |

Homepage annotation map (the 3-per-page budget, instantiated): the hero circle on "each one", the nav's static active-link underline, and the CTA band's bracket. Nothing else on the homepage is hand-drawn. The Nº narrative now ENDS at the hero: the hero keeps its 001 INTRO mono meta, and no section below it carries a Nº label (the numbered-section instrument is retired sitewide as of 2026-08-25, 4.5).

## 10. Accessibility and quality bar

- Semantic HTML, one H1, landmarks, alt text; decorative SVG/canvas `aria-hidden`; marquee duplicates hidden from AT.
- Contrast: AA minimum everywhere; `--accondark` exists so accent text on dark passes; `--mid` on `--surf` passes for `--text-small` and up, verify anything smaller.
- Keyboard: everything reachable, focus-visible ring (section 1), menus focus-trapped with Escape.
- Reduced motion table (7.8) is a ship gate, not a suggestion.
- Check 375 / 768 / 1280 / 1536 before any section is done; no horizontal scroll at any width.
- Copy renders server-side. No copy lives behind JS-only rendering or canvas.

---

## Changelog

- **2026-08-25 (the reform is one contraction; a crossfade must actually composite; two checkpoint tempos per wrapper)**: Brad's reform-transition session (hero round 14): the media player "shrinks down into this weird little box and then to the cube... an additional step that shouldn't be there", and scrolling up "turns into this white box... and zooms up" with no delay. Three rules out of the fix. (1) A morph's sub-beats OVERLAP unless a parked rest is authored: the old reform ran shrink, then crossfade, then unflatten, then settle in sequence, and the seams read as extra steps; now the object is always shrinking + thickening + crossfading + spinning at once (7.4 hero bullet updated). (2) A canvas crossfade must be verified to COMPOSITE: transmission glass writes depth and its transmission buffer excludes transparent materials, so the glass ERASED the film pane wherever they overlapped and the "crossfade" showed blurred backdrop (the white box). The overlay partner in a canvas crossfade gets `depthTest: false` + top renderOrder, and the two partners share one scale function so they cannot drift (FilmPane skinW/skinH mirrors GlassCube's sEff/flat math). (3) One pinned wrapper may carry TWO glide tempos by mounting two `useScrollCheckpoints` instances with disjoint checkpoint lists (7.4 updated): the hero's reform band now glides at 2600ms/vh (the work morph's tempo) while the Act-1 rests keep the default. Also: scrub-driven rotation handoffs must be STEPLESS AT ANY DWELL TIME: a companion idle turn is engage-epoch-relative, whole turns are carried as bias (a cube is identical every quarter turn: exploit the symmetry), and mode exits bank a wrapPi residual that decays instead of snapping. Verified frame-stepped both directions at 1536/375 plus 768/1280 spots, glide timing measured 1.4s, handoff deltas under 0.08 rad.
- **2026-08-25 (the open layout goes sitewide; the instrument layer retires)**: Brad's interior-planning decision (interior-buildout-plan.md, D1): "the grid rails, I totally hate them", and rather than keeping a parallel instrument dialect for interior pages, the guide takes the hard update to match the homepage's built reality. The evidence was already unanimous: every build that shipped the instrument at page scale was rejected (hero round 1 rails "boxy", featured work build 1 "compacted... too mechanical", footer round 1 "weird grid lines"), and everything approved since the region pivot is the open layout. RETIRED sitewide: GridLines column rails, InfoBar rows, the Nº section-label system (the hero's `Nº001 / INTRO` film meta is grandfathered), and the 1200px Container as page chrome (it survives only inside the footer). DEMOTED, not retired: the measured detail work now lives in components, not pages: drawn-in separators, the ruled-row family (numbered ruled lists, rule links, ruled link tables; the approved services spotlight index is the proof the pattern is loved), registration marks on framed media and exhibit windows, tabular mono numerals (4.3 rewritten). Interior pages get the open posture plus a ~65ch content spine for long-form copy, default to ZERO pinned runways, and carry character through the cheap signature moves (4.5 rewritten as the sitewide system; 0, 4.2, 6.2, 6.3, 6.6, 6.8, 7.3, 8, and 9 updated to match). This supersedes the 2026-08-24 region-pivot entry's "the 1200px + hairline system remains the default for interior pages" line and the handoff notes that repeat it.
- **2026-08-25 (the footer: quiet information, one big gesture)**: Brad's footer session, run alongside the 90-days session that closes the page above it. Direction chosen from a three-concept brainstorm: THE BACK COVER, an editorial magazine close (Youtech's information design crossed with e2vc's playfulness, minus e2vc's size). **Round 1 was rejected live**, so 6.8 is rewritten to the correction and the lesson is what gets recorded: a footer inherits the posture of the page ABOVE it. The v2 spec's instrument chrome (info bar, ruled mono link tables, GridLines rails, mono colophon) was written before the region pivot, and shipped under an open-layout page it read as "weird grid lines" belonging to no other section, chaotic, sloppy, and nearly a full viewport tall, with the mono meta reading as a font that did not match. Rules that generalise beyond this section: **placeholders never ship in site chrome** (a `[PLACEHOLDER]` string is honest inside a section under review and reads as debris in a footer that appears on every page, so unconfirmed content is OMITTED and tracked in tasks.md until the fact exists); **site chrome carries a height budget** (a footer taller than the viewport is a wall, not a close; ours measures 77vh at 1280, 73 at 1536, 99 at 768, 130 at 375); a link belongs in exactly ONE place in a footer (Privacy and Terms live in the legal line, not also in a column, which cost two rows of height for no new link); and a full-bleed cropped wordmark means nothing may sit below it, so the legal line moves ABOVE the set piece. Kept from round 1: the dark ground, the four-column services IA, the cropped viewport-scale wordmark with its per-letter rise and hover flood, and the paint layer, which is the first shipped instance of 7.6 (two tuning corrections recorded there: derive the column count from a ~34px target cell, and on dark grounds the trail needs `--accondark` at ~14% over ~700ms). 4.5's scope line is amended: the footer keeps the 1200px Container but drops the hairline instrument.
- **2026-08-25 (first 90 days round 2: the pin, the calm scrub, the CTA finale)**: Brad's review of the round-1 build ("very good, not great... clunky"), spec now v3.1, plus the homepage-close restructure from the parallel footer session (the page ends FirstNinetyDays -> footer; testimonial, FAQ, and the standalone CTA band retired from the homepage, section 9 rows 7 and 11 to 13 updated). Four corrections, each now a rule: (1) the fill got a pinned 160svh runway scrubbed 1:1 (~1svh/day), SUPERSEDING the previous entry's "plain progress map, never a pin" line: Brad's call, and the real rule is that a scroll-driven story must run at a pace the reader controls, pin when the beat needs room; (2) hover must never drive a scrubbed clock, only press-drag does (accidental mouse-over read as chaos), and a scrubbed value CHASES its target with a distance-scaled tween so distant jumps cascade in order instead of teleporting; (3) a state change that ends a choreography (the merge) fires only from the scroll beat, never from a value the pointer can reach (dragging to day 90 whited the board mid-play); (4) a set piece may not end on an empty frame: the merged square now grows into the closing CTA (measured clip-path from the grid's rect, white panel in a blue ring wearing its own white boiling box squiggle, circle on "day 90", Schedule a Call, smiley). New RoughAnnotation variant "smiley", the first DOODLE: decorates a surface instead of marking content, same seeds/draw/boil contract; Brad's direction overrides the moodboard's playful-out rule for this finale. Engineering: the accent-scope pill inversion ([data-theme="accent"] .pill-primary) makes a pill white-on-white on a paper panel nested inside an accent scope, force the standard fill back on; a pinned stage's sticky offset must clear the fixed nav (top: max(88px, 4svh)); framer never fires `animate` on motion elements mounted before the hydration-safe reduced-motion flag flips, so reduced-motion branches render plain elements (Reveal's pattern, now binding). Checkpoint band covers merge-to-finale only, fill stays free.
- **2026-08-25 (first 90 days: the 90-square day grid)**: The process section rebuilt from v2's three outlined cards (Brad's call: too flat for its place on the page) into the interactive day grid on the returning blue slab, and moved up to sit directly after Newsletter (10.how-it-works.md v3; the section 9 row is rewritten). Rules this build sets: the featured-work slab (accent fill, radius 32, boiling box squiggle in its own blue) is now a recurring OBJECT with a budget of two appearances per page, opening and closing the open region as bookends; a scrubbed element on the page must be a REAL control (role="slider", full keyboard range, valuetext) with its content also present as a static DOM list, never a decorative-only scrub; and a scroll-linked section that is not a set piece uses a plain progress map, never a pin (two pinned runways per page is the ceiling, both spent: featured work and portal). ProcessCard is retired unbuilt. NOTE, budget line stale: section 8.1 still says 3 annotations per page while the homepage now runs six live RoughAnnotation instances (hero, nav, problem strip, solution cards, trust marquee, two slab boxes); left inaccurate on purpose rather than silently rewritten mid-build, needs its own cleanup pass with Brad.
- **2026-08-25 (the companion's ending: cube becomes logo)**: The portal window morph, Brad's portal session part 2. The services-exit dissolve is retired and the companion cube's journey now ENDS by becoming the product: over the portal section's pinned runway it dives onto the Obsidion mark in the preview window's chrome bar, flattens, floods `--acc`, and hands a square to the DOM, which shrinks it onto the mark's own box and grows the window out from around it. New rule for repeat set pieces: when a second beat reuses proven mechanics (pin + runway, one shared clock, deterministic square handoff, clip-path with absolute-px radii), the GESTURE must differ or the page reads as repeating itself. The featured-work morph floods a panel; this one becomes an identity. Hard-won rules added by the build: a pin must not hold content that has nothing to show yet; a growing clip always paints something, so the revealed element needs its own handoff opacity gate; `clip-path` clips shadows, so a shadow must ride an outer element and arrive with the settle; a flood must COMPLETE before its handoff or the crossfade shows a colour step; a chrome bar sharing the section ground's colour disappears while it is the only thing on screen; and an object performing alone in an empty viewport must be scaled UP for it (0.58 here, against 0.4 to 0.46 everywhere else) or it reads as a loading spinner. Also: `window.scrollTo` cannot scrub a pinned runway in tests, because Lenis lerps it and the checkpoint band glides a programmatic park to its edge; drive `page.mouse.wheel` in small steps instead.
- **2026-08-25 (form field + cycling media panel)**: Brad's newsletter ask, run alongside the portal set-piece session. He sent Youtech's newsletter band (`youtech-home-desktop-10.png`) and asked for the same composition after the portal. Two new components fall out of it. New 6.13, the FORM FIELD: the site's first real input, with the label, error, success, and single-submit-path rules that every later form inherits; it stays local to `NewsletterForm` until a second form needs it. New 6.14, the CYCLING MEDIA PANEL: a framed square that rotates through data-driven frames on a crossfade, with a mono counter chip as its only chrome. Two deliberate deviations recorded here. (1) The section takes a LIGHT ground where the reference runs full dark: section 5's dark budget is the proof band and the footer, and a third dark block between the tint portal and the accent CTA band would spend the page's contrast on its quietest ask. Alternation carries the rhythm instead. (2) The panel's loop is JS, not the CSS keyframes 7.10 calls binding for future loops: 7.10's pattern cannot express an N-frame list from a data module that has to become `next/image` later. It keeps every one of 7.10's guarantees (pauses offscreen, deterministic SSR first frame, reduced motion renders the settled single frame, no fake data), so the rule now reads as "these guarantees, CSS keyframes where they fit". Also not taken from the reference: the tilt, the logo sticker in its white box (the mark never sits in a box), and the round client count presented without a source. The count on our version is Brad's real figure and traces to `9b.newsletter.md`.
- **2026-08-25 (product exhibit window)**: Brad's portal session. New 6.12: how our own software appears on the page, drawn from a targeted paper.design scrape (`project-sections/reference-images/paper-design/ANALYSIS.md`). The rules that generalise beyond the portal section: the UI is a bounded object on a quiet ground with real air around it, not a card and not full bleed; until real assets exist it is a STRUCTURAL MOCK whose every value is a neutral skeleton bar (field names are not claims, digits are, and charts are bars so nothing reads as a trend); a mono preview chip lives in the window's own chrome as the honesty gate; one data module owns the content so real assets swap in without a layout change; the chrome must match what the real product actually is (a web portal never gets macOS traffic lights); and narrow widths DROP panels rather than shrinking the whole dashboard. Distinct from the 2026-08-24 "depicted product UI" rule, which covers depicting someone else's product and hard-codes their values: this one is token-native because the product is ours. Section 9's portal row rewritten to the open-region composition.
- **2026-08-25 (scrub-driven rotation is a RATE, not a count; work turntable round 12)**: Brad, scrolling the homepage from load: the cube "rotates just quite a bit too much... it spins extremely fast, like dozens of times". The featured-work turntable was built at round 11 to his own brief of "slowly spin about four or five times", and WORK_TURNS = 4 delivered the count while missing the feel entirely. Measured live (Playwright probe on group.rotation.y against window.scrollY through a natural wheel scroll): the spin window is 0.38 of a ~2100px pin runway, so four turns climb across ~1400px of scroll once follower lag is counted, which is ~2.7 turns per viewport height and ~5.5 turns per second sustained at an ordinary wheel pace. Cut to WORK_TURNS = 1, which Brad then called too little ("it turns too little now... go for three turns"); SHIPPED AT 3, measured at 3.00 turns over ~1480px, ~1.75 turns per viewport height, ~4.6 turns per second sustained. Note what that last number says: dropping the count 4 to 3 bought only ~16 percent off the peak speed, because smooth() concentrates the motion in the middle third of the window. Count and peak speed are near-independent dials, and the ease is the third one. THE BINDING RULE, and it generalises past this section (7.4): a scroll-scrubbed rotation must be specified and reviewed as TURNS PER VIEWPORT HEIGHT OF SCROLL, never as turns per beat, because the same count reads as a slow turntable over a 240svh runway and as a blur over the 0.38 slice of it that a beat actually owns. Same for any other scrubbed rate (travel distance, counter speed, fill sweep): the beat window divides it, so state the rate, then measure it in the browser before calling it approved. Corollary on taking direction: when a client names a COUNT, translate it to the rate the runway will produce and check that; a number that is right on paper can still be wrong on screen, and "they asked for four" is not a defence.
- **2026-08-25 (featured work headline quotes, reverted)**: An attempt to add hand-drawn quotation marks around "Featured work" was reverted the same session. The new `quote` variant latched visible after the first draw (RoughAnnotation's one-shot `fired` flag does not track the section's two-way scroll gate), so the marks stayed on screen while the headline hid; the single-curve geometry read as parentheses, not double quotes; and the extra boil cycle during the pin runway interfered with the cube turntable. Revisit only with `rearm` tied to `shown` and paired quote ticks if Brad still wants this.
- **2026-08-24 (solution card sweep + companion occluders)**: Brad's card sweep session. The cube's route through the solution section became the CARD SWEEP: it descends the whitespace right of the card row and sweeps flat right-to-left under all three cards, and each title draws a `RoughAnnotation variant="underline"` as the cube crosses beneath it (his explicit call after a bespoke smooth sine underline: card ink uses the SAME rough scribble system as the hero circle and work panel box; nothing else). Three annotations share that viewport, a Brad-approved exception to the 1-per-viewport budget (they draw one at a time behind the cube). New sync pattern, binding for cube-triggers-ink beats: one shared beat module (`lib/solution-sweep`) keyed to the target's OWN `data-cube-anchor` rect, consumed by both the canvas waypoints and a DOM listener replaying the Tracker's frac math, so the object and the ink can never drift. New layering instrument, the OCCLUDER: a full-viewport section may lift its whole `<Section>` to `z-[6]` (above the cube canvas at z-5) so the companion passes BEHIND its ground; Search and ProofBand are the two occluders, hiding the cube from the sweep's end to its re-emergence under the proof band's bottom edge at the trust marquee. Use sparingly: an occluder swallows the square field too. SAME-SESSION ROUNDS 2-4 (Brad live): (1) `RoughAnnotation` gained `rearm` (two-way draw: no latch, active=false retracts the stroke at 0.5s and the annotation replays; the sweep underlines must "pop up one by one as the square slides under that actual card", never sit pre-drawn; rearm keeps the svg mounted, so undrawn paths snap opacity 0 — a zero-length round-cap path renders as a dot), `outset` (bracket variant draws ~10px OUTSIDE the measured box: the problem strip's [ ] pair, e2vc's Apply-button read at panel scale, drawing immediately on entry and persisting: his round-3 correction after a wait-for-the-cube gate), and `boilMs` (boil interval override; small-type annotations jitter at the 200ms default — the trust eyebrow circle runs 320). (2) The trust marquee eyebrow wears the hero-circle treatment on a PADDED box (px-4/py-2.5): a flat bare-text ellipse crosses the line ends ("too tight... clipping the words") — pad the measured box, don't stretch the variant. (3) The solution section carries a deep bottom runway (`pb-[max(220px,28svh)]`) so the sweep completes clear of the Search occluder, and the cube PRE-POSITIONS: it dives out of frame below the card row early and sweeps as the row rises, so every beat lands while the cards are front and center — an actor must be staged ahead of the scroll, not still traveling when its beat arrives. ROUND 4 (Brad: "stop the scroll with this in full viewport so we can see the cube animation... unfreeze after the cube gets all the way to the left side"): the sweep became a PINNED SCROLL RUNWAY per the standing rule (when a beat scrolls away too fast, pin and scrub 1:1 — never glides): `SolutionStage` pins the whole composition (sticky child + 130svh spacer; sticky top MEASURED as viewport minus composition minus lane, clamped [-180px, 88px], so short viewports shed the headline off the top instead of sinking the sweep lane below the fold) and the shared `sweepPin` rect clock (lib/solution-sweep) drives canvas, ink, and stage: rise from below frame right (p 0.02-0.2), under-card beats p 0.3/0.5/0.7, exit dive below frame left (0.7-0.97), release. The cube's pin path is computed in PX off the frozen grid's column centers (exact under-card alignment at any width), and it starts/ends below the frame so both handoffs to the waypoint journey are invisible. The runway is a FREE-PARK zone (round-9 rule: the cube is alive at rest everywhere in it) — no checkpoint bands. Fallbacks collapse the spacer to 0 and the sticky child, with no room, simply never pins.
- **2026-08-24 (extended trust block: proof band + open logo strip)**: Brad's proof-band session. The dark proof band (7.proof-numbers.md) now sits directly under Search with the trust marquee directly beneath it, one extended trust block (Youtech frame 05); Services follows the block. Section 9 rows 8/9 updated. The marquee dropped the metacci bordered tiles AND the grayscale filter on Brad's call: 6.4's logo tile became the LOGO ITEM (full-color logos floating on the ground, 32px normalized, wide gaps), 7.5's grayscale-to-color hover is retired, reduced motion is a static wrapped row. SVGs with heavy internal canvas padding get their viewBox cropped in-file to the measured content bounds (getBBox; done for the amazon-ads seeklogo file) so height normalization holds; per-logo height overrides stay a last resort. Also retired same session on Brad's notes: the hover pause (the strip never stops) and the signed velocity boost (now magnitude-based, so scroll-up speeds the strip forward instead of reversing it); 7.5 updated. Proof band ships with Brad's test copy + visual placeholder metrics (launch gate in lib/metrics.ts); MetricBlock built per 6.4's stat tile.
- **2026-08-24 (depicted product UI: the search mockup)**: Brad's direction for the search section's composer mockup: a one-to-one ChatGPT recreation, because a themed lookalike "looks weird" ("it can't be its own made-up version"). New rule, narrow by design: when a section DEPICTS a real product's UI as illustration, the depiction uses that product's own values, hard-coded inside the `aria-hidden` mockup (ChatGPT's whites, `#0d0d0d` ink, its radii, a neutral system sans), never our tokens or faces; everything AROUND the depiction stays token-native, and the depiction carries no claims (copy lives outside it). This is the only sanctioned exception to 1.3's token rule and 3.1's face rule. Also: `ChatInputWidget` is the first JS-driven widget loop (7.10's pure-CSS pattern stands for ambient loops; a typewriter over variable-length queries plus a camera move needs a state machine, sanctioned for this widget only), reusing the `.wgt`/`data-play` gate and the two-layer reduced-motion rule; only its caret blink lives in the `wgt-*` keyframe block.
- **2026-08-25 (work morph one-object + scroll-through, rounds 10-11)**: two Brad reviews in one session. ROUND 10 ("the div box and the squiggly line load separately... the rounded corners morph when it's being stretched... very not premium"): the DOM panel morph was rebuilt on clip-path. Binding rules from it: (1) NEVER animate a rounded surface's size with transform scale: non-uniform scale distorts corner radii into pills/squashed squares; animate `clip-path: inset(... round r)` on an unscaled element instead: absolute-px radii stay crisp at every size, and the radius itself may animate (slab bevel -> settled 32px). This includes the WebGL side: a RoundedBoxGeometry's bevel scales with the mesh, so the canvas now hands off a flooded SQUARE (uniform bevel, deterministic SLAB_VH edge both actors build independently) and the DOM plays the whole stretch. (2) Decoration that belongs to a morphing surface must ride the SAME live edge: the box squiggle is pre-drawn (`RoughAnnotation` gained `instant`: skip the draw-on, keep the boil) and revealed by a second clip-path on a 16px-padded wrapper reusing the fill's inset numbers: a constant 16px ink lead at the sweeping edge, doubled insets on the arriving edge so ink lands with it. One clipped stage = fill and ink waterfall down and back up as one object. ROUND 11 ("the text raises up without this square moving... the cube centers itself above the placeholders... slowly spin four or five times"): the pin choreography became a SCROLL-THROUGH SEQUENCE: sticky top moved to 30svh so the pin engages exactly at the release composition (zero dead travel: by construction 30svh = 100svh - (72 - 2)svh; Brad's raised-header `md:-translate-y-30` kept as the base), runway 240svh, and the beats play in strict order: header translates up and off (TEXT_EXIT 0.03-0.14, own checkpoint band), cube holds, travels to center stage above cards 01/02, turntables 4 full rotations (WORK_TURNS x 2pi on the scrub), then dives (MORPH_REST 0.56) into the round-10 morph. Verified: text band completes on park, turntable parks free, mid-morph completes ~1.9s, reverse park returns to the dive rest.
- **2026-08-25 (work morph pacing, round 9)**: Brad on round 8: the parked cube sat "down too low and too far to the right" of the featured work headline, and the panel morph felt "too clunky and too rushed", with the blue panel appearing "almost instantaneously". Three changes, all in 7.4's contract. (1) The hero reform gained an ASCENT tail (R_ASCEND 0.86-0.98, desktop only): after the slab thickens back into the cube at the low REFORM_END landing (which the film card still develops/quenches at, keeping the round-8 scroll-up story), the cube climbs to the float spot, so the RELEASE REST already parks it raised in the measured midpoint of the headline/support gap; WORK_FLOAT lifted (0.14, 0.22) -> (0.14, 0.24) and heroEnd plus the pre-pin waypoint mirror it (the set-piece-ends-where-the-waypoint-begins rule holds). The pin's former rise beat is now a HOLD blend. (2) The runway grew 110 -> 180svh (70 -> 100 mobile), the handoff moved 0.8 -> 0.7, and the ladder re-spaced (spin 0.02-0.44, dive 0.3-0.55, flatten 0.44-0.62, flood 0.48-0.66, stretch 0.62-0.7, sweep 0.72-1, captions 0.78-0.94) so the top-down waterfall sweep owns ~50svh. (3) Checkpoint refinement, binding: even a runway's own band must cover only the COMMITTED slice of the choreography (new `MORPH_REST` = dive start in lib/work-panel; float/spin zones park freely), and a long committed band glides at the choreography's own tempo via new per-instance `useScrollCheckpoints` options `glideMsPerVh`/`glideMaxMs` (work morph 2600/5000 vs default 450/1500), so a forced completion PLAYS instead of jump-cutting. Verified live: free-zone parks stay put; a mid-dive park completes in ~2.5s; an upward park returns to the float rest.
- **2026-08-24 (pin runway, round 8)**: Brad on round 7: "whatever we did didn't work... one tiny scroll... blasted past the cube spinning animation entirely... it was just better the way that it was before." Root cause: round 7's single film-to-panel checkpoint band auto-glided the whole ~100vh journey off one wheel notch (7.4 gained the hard lesson: a band must never span more than its own beat; continuity comes from pinned scroll, not glides). Round 7's hero checkpoint change reverted (release 1 is a rest again on every path). The real fix is the hero's own architecture applied to the section: the featured work header + grid PIN (`position: sticky` inside a stage wrapper) and a 110svh RUNWAY (70svh mobile) scrubs the whole morph 1:1: ascent to the float spot, spin (a dedicated showcase-turn beat), dive, flatten, flood, stretch, handoff, sweep, each owning tens of svh. The pin clock is pure rect math ((child.top - wrapper.top) / (wrapper.height - child.height)): no configured offsets, and it reads settled on fallback paths where the runway renders 0. Engineering gotchas, binding: sticky offsets are constrained to the containing block's CONTENT box, so a scroll runway must be a real spacer element, never wrapper padding (padding gives the pin zero room and it silently never sticks); and a pinned section's `data-cube-anchor` rect keeps moving during the pin (the section isn't the sticky element), so waypoint fracs advance mid-pin and pin-driven blends must own the choreography. REFORM_END moved back down to (0.2, 0.02) (the round-4 landing): round 5's high float spot dragged the reform's shrinking film card up-right with it, which is what made scroll-up read as "this awkward, shrunken-down media player box on the right"; the cube now lands low where the film card naturally sits and ASCENDS to the float spot (0.14, 0.22) via waypoints in the release-to-pin travel, so the reverse plays cube-sinks-film-develops-in-place.
- **2026-08-24 (one-band choreography, round 7)**: Brad on round 6: "very close... combine all of those into one animation with one checkpoint... just doesn't do it so fast", plus a "white frame" popping beside the cube when scrolling back up. (1) The release is no longer a rest on the canvas path: the hero's checkpoint array ends at the settled-film K rest, and the featured work morph's enter band now starts at that exact scrollY (workPanelBands gained `enterStart`), so film-settled and panel-settled are the only rests between the media player and the blue box: parking anywhere between glides the whole reform-float-morph through in one move (verified live: an idle park mid-morph after an up-scroll glided ~100vh back to the settled film). 7.4's checkpoint contract updated: two checkpoint scopes must share one boundary scrollY. (2) Slower: the morph window widened to 0.5vh with its start above the release position, the handoff moved 0.65 -> 0.75, and the sub-beats spread (drift 0-0.5, flatten 0.25-0.55, flood 0.3-0.6, stretch 0.55-0.75, sweep 0.78-1). (3) The white frame: the reform-side glass alpha now rides the slab's THICKNESS (x0.25 while flat, full only as it thickens into the cube), so scrolling up the cube melts toward the film instead of parking as a bright flat card beside it. Mobile (no cube by the grid) got back a DOM-led bar grow so the panel never pops in.
- **2026-08-24 (work panel morph v4, round 6)**: Brad's review of the round 5 morph: white inner border clashed with the panel, the DOM fade-in read as "the box just appears", and mid-morph parking needed a checkpoint. Three changes. (1) The box annotation became an EDGE treatment: it rides ON the panel edge with rounded corners, stroked in the panel's own `--acc` (new RoughAnnotation `stroke` prop), so only the wobble escaping onto the paper shows and the edge itself reads hand-drawn (7.3, section 8 updated). (2) The transition is CANVAS-LED to a geometry-matched handoff: the flattened slab now floods blue on the EMISSIVE channel (base color to black, env to zero: a lit PBR base can never match a CSS hex) and STRETCHES in-canvas into the exact full-width bar the DOM panel opacity-swaps over (PANEL_BAR_VH x panel width, follower damping ramps 4 to 28/s approaching the handoff so lag can't offset the swap), then the DOM side only sweeps scaleY. One continuous object, no fade-in. Unwind rounds to the nearest HALF turn: a quarter-turn landing shows the cube's side, which the z-flatten squashes to a sliver (found by screenshot). (3) `useScrollCheckpoints` gained a `bands` option: a resolver returning absolute-scrollY beat ranges re-measured at settle time, for beats positioned by live layout; the two morph bands settle idle parks to free-cube or settled-panel, so the morph always plays whole (7.4 contract: dynamic-layout scrub beats use bands, static pinned wrappers keep the checkpoints array).
- **2026-08-24 (work panel morph, featured work round 5)**: Brad's markup review of the featured work cube: the settled cube moved up-left (REFORM_END 0.24,0.03 → 0.14,0.22, into the whitespace between the headline and support column, clearing card 02), and the cube's grid passage was replaced with the WORK PANEL MORPH: the companion flattens into a brand-blue slab that a single DOM panel (`--acc`, radius 32, behind all six cards) grows out of as a bar-first wipe, wears a boiling `<RoughAnnotation variant="box">` white border while settled, then collapses back into the cube off the grid's far edge. New shared clock module `lib/work-panel.ts`: canvas Tracker and section DOM both measure the untransformed `[data-work-panel]` box per frame with the same math, so the two actors stay in sync with no shared state. Two rules from the build, binding: `<RoughAnnotation>` measures layout size, never the bounding rect (transform-scaled ancestors); caption ink inside a scroll-morphing ground crossfades its `--sec-ink`/`--sec-mid` tokens with the morph clock (color-mix over a motion-value CSS var) rather than hard-switching `data-theme`, so text is never white on bare paper mid-transition. RoughAnnotation gained the `box` variant (7.3, section 8; long edges chopped into ~240px runs so panel-scale borders squiggle instead of bow).

- **2026-08-24 (region pivot groundwork: the open region)**: Brad's call after the 2D rejection, locked in the pivot session: everything below FeaturedWork moves to Youtech's open flow (MORE Youtech, not less; his earlier dial-back read inverted). New 4.5 (open-region pattern: shared `EDGE` from `lib/layout.ts`, no rails, Container, Nº labels, or ruled rows below the hero on the homepage; the 1200px + hairline system remains the default for interior pages, nav, and footer), 6.11 (widget card), and 7.10 (looping widget vignettes: the project's first CSS `@keyframes`, sanctioned for ambient product-UI loops only; transform/opacity, one shared timeline per widget, offscreen pause via `data-play`, reduced motion = CSS kill AND settled frame; the solution row's three quiet loops are the region's whole live budget, a sanctioned exception to the 2-per-viewport line in section 0). §9 rewritten to the new region order (ProblemStrip, Solution, Search, Services, Testimonial, ProofBand, TrustMarquee at region bottom); the Nº narrative now ends at the hero. The page's statement-scale moment moved from the retired problem headline to the Solution headline. Companion waypoints re-mapped minimally to the new document order in HomeCanvas (Brad retunes the journey in 2K; the steps4 spin ease is untagged but kept).
- **2026-08-24 (featured work round 4: seamless hero handoff)**: Brad's transition notes on the release beat. The settled film panel's margin is now `max(6vw, 96px)` (was 4vw, which ran under the 72px nav bar; 7.4 updated). The reform no longer shrinks back to CARD_CENTER: its target slides right to REFORM_END where the cube forms at its companion settle scale, and the heroEnd waypoint mirrors it exactly, killing the left-then-right dogleg. New motion rule from this: when a set piece hands an object to the companion journey, the set piece must END where the first waypoint BEGINS; never let the follower fix a mismatch. Second rule: ink that overlaps a set piece's band must be gated on scroll position, not fire-once reveals: the featured work header hides through the film beats and plays a quick load-in once clear, re-arming on scroll-back (the one sanctioned two-way reveal; it exists so overlapped text can never sit over the film).
- **2026-08-24 (featured work: the portfolio moment)**: New section directly after the hero (2b.featured-work.md; Brad's ask, round 1 rejected live for instrument-framing the grid). Rules it sets: the featured work section is the page's one PORTFOLIO moment and deliberately sheds the instrument layer (no rails, no SeparatorIn, no Nº label, no bracketed indexes; it is unnumbered, so Problem keeps Nº002); its edges run at lusion's `max(5vw, 40px)` instead of the 1200px container; its H2 renders at `--text-display`, a sanctioned exemption from 3.3's flat-H2 rule (like the footer wordmark, it is a set-piece headline, not a section header drifting in size); card titles use `--text-menu` in Bluu with the arrow-leads-title hover (a new 7.7 micro-interaction: → slides in from the left, title shifts right ~1.15em, transform/opacity only). Placement rule, reusable for any pinned set piece with an empty exit viewport: the next section may pull itself up into the released stage band (here -35svh/-60svh) so its headline arrives WHILE the set piece resolves, but only on the path that has the empty tail (reduced-motion and no-WebGL fall back to normal rhythm). The hero's post-wrapper info bar is removed. The support paragraph runs 13px uppercase Apfel 500 (an extended-eyebrow reading; flagged to Brad against copy-rules' ALL-CAPS-labels-only line). 8.case-studies.md's homepage grid is superseded by this section pending Brad's confirm.
- **2026-08-24 (square field round 3: hero presence, jellyfish, wispier)**: Brad's review of the field: he wants the squares IN the hero (the round-2 reveal-at-reform gate was my call, overridden), a couple of viewport-scale squares that run off frame and float "like a giant jellyfish", and thinner, wispier strokes closer to the paper color. The field now hands off across the canvas instead of hiding under it: z-6 during the statement and film beats (above the canvas's opaque paper backdrop, still under all ink; visually identical to being in the paper, and the faint pass over the glass cube is below perception), z-1 from the reform on (the cube companion keeps passing over the field below the hero). The opacity veil is gone; the layer materializes once on mount. Field recomposed to ten squares: eight tumblers retuned to 3 to 5% opacity, plus two off-frame giants (680/820px, ~2.5% opacity, 0.75px stroke, near-still spin, stretched drift/breathe clocks, low parallax so they linger across sections). 7.4 entry rewritten; `heroReveal` prop renamed `heroStage`.
- **2026-08-24 (ambient square field)**: Brad asked for life in the flat stretches: faint outlined squares tumbling through the background like a screensaver slowed to ocean speed, reshuffling as you scroll between sections, never disruptive. Built as `SquareField` (components/motion) and added to the 7.4 catalog: nine 1px ink square outlines at 4 to 8% opacity on a fixed page-level layer, slow spin + scale breathing + two-sine wander + per-square parallax depth + a velocity stir, with vertical recycling so the field survives any page length. The HomeStage layering contract gains a rung: nav z-50 > ink z-10 > cube canvas z-5 > SQUARE FIELD z-1 > grounds/rails. It deliberately vanishes into dark grounds (ink-on-dark), so dark sections keep their drama. Zero canvas, one rAF, transform/opacity only (7.9 clean); reduced motion gets the static seed composition (7.8 row added). Loudness dial lives in the SQUARES table opacities; the rule of the instrument: felt, never watched. Same-day fix on Brad's catch: the field flashed at the hero on refresh (SSR painted it, then the loading canvas backdrop covered it); the layer now SSRs at opacity 0 and scrubs itself in over the reform band, synchronized with the backdrop's retirement (7.4 hero note).
- **2026-08-24 (scroll round 3: rail v3 + cusp latency)**: Brad approved the direction (the square, the fill animation) with three notes. The rail shrank to 62svh, vertically centered, and became DISPLAY ONLY: pointer-events none, no drag/click, no grab cursor (an indicator, not a control; 7.1 updated). The between-beat hang was diagnosed as the settle waiting for Lenis's full lerp tail to fall silent: it now fires as soon as Lenis velocity decays under ~2px/frame with 120ms input quiet (event-silence timer kept as no-Lenis fallback), and the glide quickened to ~450ms/viewport clamped 450 to 1500ms. Measured: wheel flick to parked-on-next-checkpoint ~1.1s at 1280 including the beat playing through, with no perceptible dead wait at the cusp.
- **2026-08-24 (progress rail + checkpoint feel, round 2 of the scroll session)**: Brad's review of the smooth scroll build: the checkpoints still read as hurdles (out-scroll an exact point or get pulled back, then a too-fast glide) and the thumb scrollbar looked like a basic browser part, overlapping the nav at page top. Checkpoint retune: commit 15% to 6% (any deliberate gesture tips the beat; only a stray notch retreats), idle 160 to 100ms, glide now ~550ms/viewport clamped 500 to 2200ms; the hero's settled-panel rest moved from 0.98K to exactly K, killing the dead zone ahead of the reform that made its boundary sticky. New 7.4 rule: checkpoints sit on frames that are both a visual rest and a band boundary. Scrollbar v2 is the PROGRESS RAIL (7.1 updated): right-margin hairline inset below the nav, "+" registration-mark caps, 2px accent fill growing with page progress, and a 7px brand square on the leading edge that quarter-turns over the page (square, diamond, square: the proprietary scroll mark). Dims to 45% at rest instead of vanishing; drag-to-scrub 1:1 anywhere on the strip, press-to-jump.
- **2026-08-24 (smooth scroll instrument)**: Brad reviewed the checkpoint build and asked for the Obsidion/lusion scroll feel: their pages do not step with raw wheel ticks, they run their own damped scroll with their own scrollbar. The 7.1 "no Lenis" lock is superseded on his call: `lenis` added to the stack (PROJECT_REQUIREMENTS.md) and mounted as `SmoothScroll` in the marketing layout; wheel input now eases the real scroll position every frame, which is what makes the hero scrub feel fluid rather than react-then-jump. Boundaries kept from the original analyses: real document height and real `window.scrollY` (no virtual scroller; SEO, anchors, and every `useScroll`/rect binding untouched), native touch and keyboard scrolling, and reduced motion never mounts it. The native scrollbar hides only while Lenis is active, replaced by the scrollbar instrument (right-edge 3px ink thumb, accent on hover/drag, drag + click-to-jump, fades when idle, desktop fine pointers only). New wiring rules: programmatic scrolls go through `getLenis()?.scrollTo`; modal overlays call `stop()`/`start()` and their scroll areas carry `data-lenis-prevent` (nav overlay wired). Checkpoints retuned to fit (commit 22% to 15%, glide clamp 450-1100 to 600-1400ms) and their glide writes route through Lenis. Stack tripwire updated: gsap remains the documented path for SplitText-grade needs.
- **2026-08-24 (hero card-beat headline)**: Brad flagged the hero's held-card beat as under-weighted (only the small right column of text). It gained a display-scale statement swinging in from the top left with per-line lag and a clearing blur, completing lusion's big-left/small-right card screen (2.hero.md v6.1; copy "Proof before promises." is DRAFT, and it spends the page's one Bluu-italic word on "promises."). The beat's rule link retargeted from /results/ to /about/ ("How We Work", label DRAFT) since featured work will sit directly below the hero. Section-specific; no system rules changed.
- **2026-08-24 (scroll checkpoints)**: Brad flagged that stopping a scroll mid-gesture parks the hero film sequence in a half-played state. Added `useScrollCheckpoints` (components/motion) and a 7.4 catalog entry: after scrolling goes idle inside a pinned scrub wrapper, the page glides to the rest beat the gesture was heading for (settling back when less than 22% into the beat), so every beat plays in whole and can never be left stuck. Any input cancels the glide on the spot; reduced motion disables it entirely. 7.1's native-scroll rule amended to name this the one sanctioned assist: it is idle-only and input-cancellable, not hijack. The hero declares its rest beats as statement 0, held card 0.60K, settled panel 0.98K, release 1; every future pinned scrub section must declare its own.
- **2026-08-23 (phases 2C/2D + hero v6, cube companion)**: Built trust marquee, problem, solution, and services. New shared components: `NumberedRuledList` (6.10 as specced), `RuleLink` and `RuledLinkTable` (6.1; the directional row fill lives in globals.css as `.row-fill`, same mechanics as the secondary pill), `BentoPanel` (6.4; theme-scoped via data-theme so the one dark panel is panel-scoped). Marquee ships the page's one velocity coupling (7.5 values as written). Hero v6: the set piece canvas was lifted to a page-level fixed layer (`HomeStage`/`HomeCanvas`) per the queued companion direction; 7.4's entry rewritten. New beat vocabulary: THE REFORM (the media panel un-balloons back into the cube before the hero releases) and THE COMPANION (waypoint journey through the sections, quarter-turn ticks on the problem rows, dissolve at services' end). New engineering rules, binding for canvas work: past its set piece a persistent object switches from transmission glass to ALPHA glass (transmission cannot show the page; canvas alpha compositing can) with the crossfade gated on RAW scroll so the opaque in-canvas backdrop is gone before any section scrolls under the fixed canvas; position:sticky creates a stacking context, so a stage that must beat a fixed canvas carries the z-index itself; companion mode must take over on raw scroll after the wrapper (never let the damped follower replay the film over the sections). Layering contract for all homepage sections: content wrappers get `relative z-10`, grounds and GridLines stay below the canvas so the cube passes over rails and behind ink. Trust logos are text wordmark tiles until real SVGs are delivered (tile treatment per 6.4 unchanged). Services links point at the sitemap.md slugs; those routes 404 until Phase 4 builds them.
- **2026-08-23 (hero v5.1, same-day live review)**: Brad's tweaks on the v5 canvas, all in 2.hero.md v5.1: the cube's solid core is now a smoke core (opaque hashed-discard wisp so it survives the transmission buffer; the frosted glass blurs the grain into smoke); refraction calmed (ior 1.25, thinner walls) so the core no longer multiplies through the bevels; spin roughly halved and the swoop stretched (follower rate 4.5/s); headline raised beside the cube with the statement in its own clear row (the bottom-anchored fold collided at wide viewports); and the held card beat gained a right-column side text block (eyebrow + lead + "See the Results" rule link) sliding in/out with the beat, lusion's card + paragraph screen. Side-text paragraph is DRAFT copy pending Brad. The card-beat rule link is a showcase link and does not break the hero's no-CTA rule; the annotation budget is untouched.
- **2026-08-23 (hero v5: WebGL set piece)**: The v4 CSS-transform film takeover was rebuilt on a WebGL canvas after Brad's review (execution below the bar) and his new direction: a Spline-grade glass cube as the hero's 3D brand object that seamlessly becomes the media player. 7.4's hero entry rewritten: glass cube (transmission + `--acc` core) swoops behind the text, flattens to a glass pane, the film develops over it in brand-ink duotone, and balloons with a cloth bend into a framed 4vw-margin panel (the full-bleed settle is retired; media stays an object). The scrubbed ink line is CUT (the hero keeps only the circled word; annotation budget returns to 3 with 1 spare). New motion rule: canvas actors may follow a time-damped follower of native scroll progress (~5.5/s) to keep fast scrubs legible; DOM scrubs stay pure functions of raw progress; native scroll remains locked. Glassmorphism note: section 4.4's "no glassmorphism" still bans frosted UI SURFACES; a 3D glass object in a sanctioned canvas is a different instrument and is allowed (this hero is its one use). BUDGET FLAG, needs Brad's call: the lazy 3D chunk (three 0.185 + r3f 9 + hero canvas) measures ~232KB gz against 7.9's 200KB line; it is lazy-loaded and never LCP (verified absent from the initial script set). Engineering rules added to 2.hero.md and binding for all future canvas work: build ShaderMaterials imperatively and attach via `<primitive>` (JSX `uniforms` props bind a clone; useFrame mutations never reach the GPU); transparent materials are excluded from three's transmission buffer (keep through-glass objects opaque, fade covers in above the glass); raw ShaderMaterial pipelines run NoColorSpace end to end with a `flat` Canvas or the brand blues wash out. Queued v6 direction from Brad: the cube as a persistent companion object following the visitor down the page (requires a page-level fixed canvas, lusion's architecture; not built inside the hero).
- **2026-08-23 (review 2 refinements)**: The v3 hero's straight bottom-up film rise was replaced with the pen-pull choreography (7.4 rewritten; lusion.co studied live for the rope-and-reel sequencing). Hairline rails removed from the hero section only (Brad found them boxy there; rails remain the system default elsewhere). The ink line joins the annotation system as scroll wayfinding: it extends the hero circle, so it does not spend an extra annotation-budget slot on the homepage. Engineering note for every future scrubbed section: use callback-form `useTransform` with explicit clamps; two-stop range arrays drift after re-renders in framer-motion 13.1.1.
- **2026-08-23 (direction pivot after 2A/2B build review)**: Brad rejected the built hero and nav as generic conversion-page design; the corrected posture is creative-first, showcase-led, with conversion quiet until the page bottom. Changes: hero is now the scroll-driven film takeover (7.4 entry added; signature move 3 revised; section 9 rows 1 to 2 updated); the hero's two-CTA pair, eyebrow row, and reassurance line are removed (no CTAs above the fold beyond the nav pill; the project-brief's "one clear primary CTA above the fold" rule is now satisfied by the nav pill alone on the homepage, per Brad); nav is a two-pill bar with a full-screen overlay index menu (6.5 rewritten; NavigationMenu mega menu and mobile Sheet retired); added `--text-display` and `--text-menu` viewport-scale tokens (3.2); scroll-scrub budget now includes the hero set piece (section 0). Pending Brad's sign-off: the bar pill label "Let's Talk" is not on copy-rules.md's approved button list (the overlay and CTA band keep "Schedule a Call"). TitleAssemble remains available but currently unused on the homepage.
- **2026-08-23 (Phase 2 direction lock)**: The 13 home specs and the shared CTA band and footer specs were rewritten into reference-grounded design briefs after Brad flagged them as generic; the old specs pre-dated the scrape and three contradicted this guide (full-bleed hero, dark CTA band, over-video nav rules). Decisions locked with Brad: hero composition is statement-over-panel (lusion structure, type on paper above the framed panel); problem uses the page's single `--text-statement` headline plus the new numbered ruled list; solution is an unequal bento (one dark panel, zero accent); services are ruled index tables mirroring the footer treatment; the one scroll-scrubbed set piece stays unspent until real Obsidion assets exist. Added 6.10 (numbered ruled list). Updated the section 9 effect map to match the briefs and added the homepage annotation map and Nº numbering. Nav pill label changed from "Get Started" to "Schedule a Call" in 6.5 for two-CTA consistency. Build order restructured in tasks.md into phases 2A to 2J, one session each, brief first.
- **2026-08-21 (groundwork build)**: Section 5 selectors changed from `section[data-theme]` to `[data-theme]` so themed non-`<section>` elements (the dark footer) work with one component; `:root` now carries light-value `sec-*` defaults so sec-* components resolve outside a themed scope. Section 3.2 gained the tailwind-merge note: without registering the custom text-* utilities as font-size classes, `cn()` classed them as text colors and dropped them (found when H2s rendered at body size). Implementation notes: reduced-motion branches use a hydration-safe hook (`useReducedMotionSafe`) because reading the media query on first client render breaks hydration; the annotation boil runs 3 frames at 200ms.
- **2026-08-21**: Initial version. Generated from `0.design-moodboard.md` plus the nine reference analyses (e2vc as primary identity anchor; lusion, pear-no, pxpush, obys-aim, dropbox-brand, youtech-agency, readymag, metacci contributing the specific elements credited inline). Direction changes vs the moodboard, agreed in the synthesis session: framed hero panel replaces the full-bleed video hero; the closing CTA band becomes the single full-accent surface (footer stays dark); named ease trio replaces the single fade-up spec (fade-up remains the block default); added `--accondark`, `--linedark`, `--lineacc`, `--radius-media`, selection color, per-section `data-theme` scopes, and the signature kit (annotations, hairline system, Nº labels, pixel cursor, directional fills).
