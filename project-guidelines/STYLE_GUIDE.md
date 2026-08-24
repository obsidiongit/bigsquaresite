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

Two voices, held in tension:
1. **The instrument.** Visible hairline grid, mono labels, numbered sections, registration marks, tabular numerals, per-section theme tokens. Everything aligned, counted, and accountable. (From e2vc, dropbox-brand, obys-aim, pear-no.)
2. **The hand.** One rough-drawn blue annotation per viewport at most: a bracket around a CTA, a circle around one word, an underline. The proof that people, not a template, made this. (From e2vc.)

Aesthetic keywords (moodboard): Clean. Measured. Premium. Technical. Confident. Airy.
Not: playful, loud, startup-gradient, neon, glassmorphism, stock-photo corporate, retro-CRT, art-project loose.

Restraint budgets (site-wide caps that keep the system quiet):
- Hand-drawn annotations: at most 1 per viewport, at most 3 per page.
- Full-accent surfaces: exactly 1 per page (the closing CTA band).
- Velocity-reactive elements: at most 1 per page (the logo marquee).
- Scroll-scrubbed elements: the homepage hero film takeover (7.4), wayfinding, and one editorial moment. Body copy is never scrubbed.
- Marquee motion: logos only. Headlines never marquee.
- Live/looping elements: at most 2 per viewport.
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

### 4.2 Containers and grid

- Content max width 1200px, centered: `max-w-[1200px] mx-auto px-[var(--gutter-x)]`.
- Wide moments (framed hero panel, marquee, CTA band, footer) go full bleed; their inner content still aligns to the 1200px container.
- 12-column grid, 24px gaps desktop, 16px mobile. Bento and mosaic layouts snap every edge to these columns (dropbox-brand discipline: unequal tiles, shared grid lines).
- Mobile keeps everything. Patterns reflow to one or two columns; nothing is hidden below 390px (every reference survives 390px by stacking only).

### 4.3 The visible hairline system (signature)

The grid is not decoration, it is the layout made visible (dropbox-brand). Four instruments, all 1px, all from the section theme's line token:

1. **Column rails.** Full-height vertical hairlines at the content container's left and right edges, available per section via a `<GridLines />` component (absolutely positioned 1px divs, `pointer-events: none`). Interior rails at the 1/4, 1/2, 3/4 column edges are optional per section; quarters make square-ish cells, on brand. Rails persist across light, dark, and accent sections, recolored by the theme token (e2vc).
2. **Info bars.** Full-width 13px mono rows sitting on a 1px rule: brand line left, utility links, © right (obys-aim). Used under the hero region and at the top of the footer.
3. **Separators.** Horizontal 1px rules framing section titles and list rows. They draw in on entry (`<SeparatorIn>`, section 7.3).
4. **Registration marks.** Small "+" glyphs (12px, 1px stroke, theme line color at full strength) at rail intersections around framed media and full-bleed moments (lusion, pear-no). Marks are `aria-hidden`.

Skip e2vc's bending-line canvas rebuild: a detail nobody consciously sees, at canvas cost.

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
- **Nº section label** (pxpush): `Nº001 / INTRO`. The `Nº001` part in `--sec-acc`, the `/ LABEL` part in `--sec-mid`. Numbered narrative sections on the homepage and long pages get these; utility sections (FAQ, footer) do not. Numbering restarts per page, always three digits.
- **Bracketed index** (obys): `[01]`, `[02]` prefixes for list items (services, process steps, featured lists), and `1/6` counters. Tabular nums.
- **Chips**: 12px mono uppercase in a pill. Two styles: outline chip (1px `--sec-line`, transparent) for tags and filters; solid chip (`rgba(11,15,23,.8)` bg, `--ondark` text) for the on-image metric lockup (6.4). Day-range chips on timeline cards are outline chips with the number in `--sec-acc`.

### 6.3 Section header

Slots: eyebrow row (Nº label, with a `<SeparatorIn>` hairline above it), H2 (baseline reveal), and a right column holding either a support paragraph (`--text-small`, `--sec-mid`, max 40ch, top-aligned to the H2) or the two-CTA pair. Huge-left, small-right (lusion). Stacks on mobile: eyebrow, H2, support, CTAs.

### 6.4 Cards

- **Base card**: `--surf` bg on light sections (`--paper` bg on tint), 1px `--sec-line`, radius 16, padding 24/32. Interactive cards hover: translateY(-2px) + soft shadow, 250ms `--ease-house`. Non-link cards do not move.
- **Case study card** (signature: metacci formula + e2vc lockup): full-bleed image card, radius 24, bottom scrim. Pinned on the image: mono solid chip with the client name top-left, metric chip top-right (format: `+000% [METRIC]`; value from spec files only). Bottom: the outcome IS the headline, number included ("000% more booked calls for [CLIENT]" pattern), Apfel 700 at H3 size, then a rule link "See the Results". Hover: image scales 1.03 over 600ms. Metric chip numbers use count-up on entry.
- **Testimonial card** (youtech lockup): photo left; quote set at H3 scale as the headline; name + company in `--text-small` `--sec-mid`; "See the Results" rule link; 1px vertical hairline; one oversized metric (`--text-metric`, `--sec-acc`, count-up) with a small mono label right.
- **Stat tile / metric block**: number at `--text-metric` in `--sec-acc`, mono uppercase label below in `--sec-mid`. Tiles in the dark proof band sit borderless on the panel; on light they are base cards. Count-up once on entry.
- **Process / timeline card** (metacci): outlined card, no fill. Mono chip holding `01` (digits in `--sec-acc`), one-word or short verb title in Apfel 700, short body, then a checklist with check glyphs in `--sec-acc`. Used for the 90-day timeline with day-range chips (youtech).
- **Bento panel** (readymag): self-contained rounded-24 panel: H3 corner, short body, one illustration. Widths vary (2/3 + 1/3, 1/2 + 1/2, full) but every edge snaps to the grid. Per bento grid: at most one `dark` panel and at most one `--acc` panel; everything else `--surf`.
- **UI-fragment illustration** (readymag): real product UI pieces (dashboard cards, report rows, metric chips from Obsidion or ad platforms) rendered as bare rounded cards with soft shadows floating inside panels. Never screenshots in fake browser chrome, never stock imagery.
- **Logo tile** (metacci + moodboard): grayscale logo inside a bordered `--surf` tile, radius 16. Full color on hover. Lives in the trust marquee.

### 6.5 Nav (rewritten 2026-08-23, direction pivot)

Quiet instrument bar, loud menu (lusion bar anatomy + e2vc editorial index; the v1 center-links bar and mega menu read as template chrome in build review and are retired).

- 72px bar (64px mobile). Logo + wordmark left. Right: exactly two pills: "Let's Talk" (primary sm, /schedule/) and "Menu" (secondary sm, small `--acc` square glyph). No center links.
- Over the page top: transparent, no border. After 40px scroll: `--paper` at 85% + backdrop blur + 1px `--line` bottom border (moodboard).
- The menu is a full-screen `--paper` overlay (Radix Dialog, focus trap, Escape): left, five index rows at `--text-menu` with mono `[01]` brackets (group rows toggle; leaf rows navigate); right on lg+, the active group's ruled mono link table (inline below lg); foot row with Login ↗, DEN/TPA mono, and the "Schedule a Call" pill. Row entrance staggers 55ms with the house ease.
- Active page marker: a static hand-drawn underline in `--acc` on the overlay's index row (annotation system, no boil, no draw-on).
- Luminance-sensing nav (pear-no) is catalogued in 7.4; candidate polish now that the homepage hero settles full-bleed dark under the light bar.

### 6.6 Info bar

13px mono row on a 1px top rule spanning the container: brand line left ("BigSquare Marketing"), bracketed utility links center-right ("[Results]"), © right. One under the hero region, one opening the footer. No JS.

### 6.7 FAQ

Metacci's "Before you book" objection pattern: eyebrow + H2, then one bordered container (radius 16, `divide-y` hairlines) of shadcn Accordion items. Question: Apfel 700 18px left, chevron right. Answer: body in `--sec-mid`. 5 to 7 questions, one honest "when we are not the right fit" style question if the spec's copy provides it. Emit FAQPage JSON-LD from the same data array.

### 6.8 Footer

Theme `dark`. Anatomy top to bottom:
1. Info bar (mono, `--linedark` rule).
2. Four link columns mirroring the services IA exactly (Company, Organic Marketing, Paid Advertising, Design & Development), as ruled mono link tables: each link a full-width rule row with `↗` (pxpush). Mobile: accordion columns.
3. Locations / Socials / Contact row. Locations get a mono two-office clock lockup: `DEN 09:41 / TPA 11:41` (live, minutes precision). Badge slot renders nothing until a badge is earned.
4. Set piece: the BigSquare wordmark at viewport scale in Bluu Next, cropped by the page bottom edge (obys), `--ondark` at low opacity or outlined. One quiet scroll-settle on arrival (7.3 `<Reveal>`), not pxpush's triple echo.
5. Legal line: mono 12px, © year, privacy/terms links.

The accent CTA band (shared component) sits directly above the footer on every page that uses it; together they are the closing brand moment.

### 6.9 Ad credit popup

Scorpion structure per moodboard: logo, one offer, one deadline, one button. shadcn Dialog, radius 24, `--paper` ground, primary pill, mono deadline line driven by `POPUP_DEADLINE`. Exit intent + mobile trigger, 14-day localStorage, route exclusions per spec.

### 6.10 Numbered ruled list

The editorial list pattern (e2vc impact 01-04 rows + pxpush benefits rows + obys rule discipline). A stack of full-width rows, each on a 1px `--sec-line` top hairline, with a closing hairline under the last row:

- Left: `[01]` bracketed mono index in `--sec-acc`, tabular nums (6.2 family).
- Then: the row's text in Apfel 700 (`--text-h3` scale for major lists, 18px for compact lists), optional one-liner in `--sec-mid` below, optional 16px lucide icon between index and text.
- Entry: each row's hairline draws via `<SeparatorIn>`, text uses `<Reveal>`, 80ms stagger between rows. Rows that link get the rule-link hover (arrow +4px, hairline darkens).

Uses: homepage problem pain points and portal feature rows (built in Phase 2); service-page deliverable lists and industry-page sections later. Works on every ground via `sec-*` tokens. This pattern replaces icon-grid and card-row layouts for enumerations; reach for cards only when the content is truly card-shaped (media, metrics, self-contained compositions).

---

## 7. Motion

### 7.1 Principles and stack posture

- Expensive and calm. Motion confirms structure; it never performs. No bounce easings anywhere, ever.
- **Native scroll is locked.** No Lenis, no scroll hijack, no virtual scroller (every analysis reached this conclusion; SEO, accessibility, LCP). Reveals fire once (`whileInView`, `once: true`); the pxpush pattern of scrub-reversible body text is explicitly not taken.
- Framer Motion is the engine for everything in this section; each catalog entry below is the Framer Motion port of a reverse-engineered reference effect, with tested starting values.
- Stack tripwire: the analyses confirm Framer Motion + native scroll + rough.js reproduces every chosen pattern. If a future spec demands something it cannot do well (SplitText-grade type work, scrubbed slat wipes at pxpush fidelity), the path is: add `gsap` (and only then `lenis`) to PROJECT_REQUIREMENTS.md with a one-line reason first, per CLAUDE.md. Do not reach for it before that spec exists.
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
| `<SeparatorIn>` | hairline `clip-path: inset(0 100% 0 0) → inset(0)` | 600ms, house | Rules above eyebrows, info bars, list rows | pxpush |
| `<ClipReveal>` | media frame `clip-path: inset(0 35% 0 35% round 24px) → inset(0 round 24px)`, inner image counter-scales 1.15 → 1 | 800ms, soft | Framed hero panel, featured media | pxpush |
| `<SectionWipe>` | 4 to 6 grid-aligned column blocks rise `y: 100% → 0` staggered over the incoming section | 600ms, swoop, stagger 40ms/column | Entering the dark proof band only | e2vc (stepped columns), pxpush (overlayIn) |
| `<TitleAssemble>` | per-word `opacity 0 → 1` in random order | 300ms, stagger 30ms, `from: "random"` | Mono eyebrows only, at most one per page | pxpush |
| `<TypeOn>` | per-character opacity stagger, telegraph feel | 20ms/char | Mono chips and annotation labels only, never body | pear, pxpush |
| `<RoughAnnotation>` | rough.js paths drawn via `pathLength: 0 → 1`, then 3-frame boil on an interval | draw 1.2s (circle 2s), house | Brackets, circles, underlines | e2vc |

`<RoughAnnotation>` implementation contract (from the e2vc probe): fixed seeds so shapes are stable; `strokeWidth` 3, roughness ~1.6 to 2.8 by variant; stroke from `var(--sec-acc)` read at draw time; 3 pre-rendered boil frames cycled by visibility toggle; the hero circle draws only after its headline reveal completes; after any masked reveal finishes, flip the line wrapper to `overflow: visible` so annotations can overflow the line box; redraw only on viewport WIDTH change (iOS Safari fires height-only resizes while scrolling).

Hero exception: hero text animates on mount, not on view, and must not delay the LCP element (the hero media poster). Total hero choreography under 1s.

### 7.4 Scroll-linked catalog (progress-driven, no hijack)

The architecture is pear-no's fraction table done with Framer Motion: per section, `useScroll({ target, offset })` + `useTransform`, every effect a pure function of progress. Scrubbed transforms use linear mapping, no ease.

- **Hero film takeover, "the glass square becomes the film"** (homepage only; v5 2026-08-23, WebGL rebuild after the v4 CSS sheet was rejected): a 320/480vh wrapper drives a sticky 100svh stage with one lazy WebGL canvas UNDER the text layer. A glass cube with a solid `--acc` core (the brand mark as an object; transmission glass + RoomEnvironment) floats above the copy, drifts, and answers the pointer; on scroll it swoops behind the exiting headline, flattens into a glass pane the size of a 16:9 media card, the film develops over that footprint (ink-duotone `#0A2A73`→`#6E9BFF` resolving to true color), and the card balloons out with a per-vertex-lagged cloth bend into a framed panel at 4vw margins, radius `--radius-media` (media as an object, never full bleed), with mono meta and registration marks. DOM scrubs are pure functions of native scroll; canvas actors follow a time-damped follower of it (rate ~5.5/s) so fast flicks stay legible: still no hijack, no Lenis. The ink line is retired; the hero keeps only the circle annotation. Reduced motion: statement then settled framed panel, no canvas at all. Engineering contract in 2.hero.md v5 (r3f uniforms-clone trap, transmission-buffer exclusions, raw-sRGB pipeline, DPR watchdog, offscreen pause).
- **Chapter rail** (pear): fixed mono label + tick marks drawn by `pathLength` against page progress. For the method page and long industry pages. v2, not homepage.
- **Manifesto darkening** (e2vc talent page): statement paragraph's words scrub `--mid` → `--ink` over the section. About page only, one instance site-wide.
- **Marquee velocity coupling**: see 7.5.
- **Luminance-sensing nav** (pear): 8x5 offscreen canvas samples the media behind the header every ~160ms while a media section intersects; hysteresis thresholds toggle a `data-on-light` attribute consumed by nav CSS. Only for full-bleed media pages (VSL template).
- **Scroll-scrubbed frame sequence** (pear): WebP sequence + manifest + nearest-loaded-frame + max one decode per frame. Reserved for the Obsidion portal section IF its spec asks; cheaper and more robust than Three.js for one wow moment.

### 7.5 Marquee and velocity rules

- Logo marquee: CSS keyframe track at ~50px/s desktop, 35px/s mobile. Pauses on hover; logo tiles go grayscale → color on hover (moodboard). Duplicate the track for the seamless loop; `aria-hidden` the duplicate.
- Velocity boost (pxpush, optional polish): add scroll velocity × ~0.5 to the track speed, clamped to ±3× base, decayed by 0.9/frame. The logo marquee is the page's ONE velocity-reactive element.
- Headlines never marquee. Section titles sit still (pxpush's 12vw marquee H1s are not taken).
- Reduced motion: marquee renders as a static wrapped grid of logo tiles.

### 7.6 The pixel cursor (signature, translated)

`<PixelTrail>`: pxpush's square-pixel trail, made quiet and blue.

- Fixed full-viewport `pointer-events: none` layer holding a 24-column grid of square cells (`100vw / 24`).
- On pointer move, the cell under the pointer sets `opacity: 1` and fades back to 0 over 250ms (CSS transition). Fill: `--acc` at 8% opacity (tuning range 6 to 12%; it should be felt, not watched).
- No blend modes, no gooey filter, no cursor replacement: the native cursor stays.
- Desktop pointer-fine only, min-width 1024px; initialized via `requestIdleCallback`; disabled entirely under reduced motion; suppressed over `[data-cursor-quiet]` zones (nav, forms, mega menu).
- Budget: ~40 lines, zero canvas.

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
| Marquee | Static wrapped grid |
| SectionWipe / ClipReveal / SeparatorIn | Content renders settled |
| RoughAnnotation | Renders drawn, no draw-on, no boil |
| PixelTrail | Off |
| TypeOn / TitleAssemble | Full text immediately |
| Hero video | Poster frame; play only on user action |
| Hover motion | Color/opacity changes only, no transforms |

### 7.9 Performance rules

- Animate `transform` and `opacity` only. Never top/left/width/height.
- Any canvas (if a spec ships one): pause via IntersectionObserver when offscreen; max one texture upload per rAF; DPR watchdog stepping devicePixelRatio down after sustained slow frames (pear's two rules, ported verbatim); dispose everything on unmount.
- Three.js: only where a spec asks, under 200KB gzipped total, lazy-loaded, never the LCP element. The chrome-object recipe if a portal moment ships: `MeshPhysicalMaterial` metalness .92 / roughness .05 / clearcoat 1 + `RoomEnvironment` env map, duotoned to graphite/navy (pxpush).
- Hero choreography completes under 1s; LCP element is the hero media poster; CWV green on every page (LCP < 2.5s, INP < 200ms, CLS < 0.1).
- Reveal wrappers must reserve layout (no CLS from split text).

---

## 8. Signature moves

The BigSquare identity kit. Each move names its source; together they are what makes the site ours. Anything on this list appears deliberately and within its budget; nothing else gets invented mid-build without updating this file.

1. **Hand-drawn annotation system** (e2vc, the anchor). One `<RoughAnnotation>` primitive with three variants: bracket (the Bracket CTA), circle (one word in the hero H1), underline (key links, nav active state). Always accent-colored, fixed seeds, draw-on entry, gentle boil. Budget: 1 per viewport, 3 per page.
2. **Visible hairline grid + registration marks** (e2vc, dropbox-brand, pear, lusion). Column rails, info bars, drawn-in separators, "+" marks around framed media. The instrument half of the DNA.
3. **The film takeover** (lusion, revised 2026-08-23). The homepage hero: viewport-scale type on paper, then the brand film rises on scroll from a rounded inset object into the full viewport and pins (7.4). The framed rounded-24 panel remains the pattern for every other media moment (portal preview, case media): media as an object on the page, full bleed only when it is the set piece.
4. **Nº section labels + per-section themes** (pxpush, e2vc). `Nº001 / INTRO` mono labels on numbered narrative sections; every section a `data-theme` scope.
5. **Tag-chip metric lockups + outcome-first case headlines** (e2vc + metacci). Client chip left, metric chip right, pinned on the image; the result with its number IS the card headline.
6. **Directional button fills** (pxpush). Secondary pills and rule rows fill from the bottom and exit through the top.
7. **Baseline and word reveals with the house ease** (lusion, pear, e2vc). Headlines rise from their baselines; `cubic-bezier(.22, 1, .36, 1)` everywhere.
8. **The quiet pixel cursor** (pxpush, translated). A sparse blue square trail on desktop: the company name, drawn by the pointer.
9. **Editorial mono meta** (obys-aim). Bracketed indexes, 1/6 counters, footnote-style qualifications on claims (mono markers resolved in a hairline row; only for claims with real sources).
10. **The closing set piece** (e2vc, obys, pxpush, youtech). Accent CTA band, then the dark footer: ruled mono link tables, office clocks, cropped viewport-scale wordmark.

## 9. Homepage effect map

Sequencing aid for Phase 2 (sections from `project-sections/home/`, spec order wins):

| Section | Theme | Patterns |
|---|---|---|
| 1. Nav | n/a | Two-pill instrument bar, scroll solidify, full-screen overlay index menu, static annotation active state |
| 2. Hero | light | The film takeover (7.4): display-scale H1 + circled word on mount, instrument strip on the fold, scrubbed ink line pulling the tilted film sheet in from bottom-left to full viewport, mono film meta, info bar closes the region. No CTAs, no rails |
| 3. Trust marquee | light | Bordered logo tiles, marquee rules (7.5), the page's one velocity element |
| 4. Problem | light | The page's one `--text-statement` headline (BaselineReveal), numbered ruled list (6.10) |
| 5. Solution | tint | SectionHeader, unequal bento panels (one dark, zero accent), UI-fragment chips with no fake numbers |
| 6. Services | light | Ruled index tables (RuledLinkTable), directional fills, rule links |
| 7. Proof numbers | dark | SectionWipe entry, borderless stat tiles in `--accondark`, CountUp |
| 8. Case studies | light | Case study cards (chip lockup + outcome-first headline), CountUp |
| 9. Obsidion portal | tint | FramedMediaPanel preview with "PORTAL PREVIEW" chip, numbered ruled list features; scrubbed set piece deferred until real assets |
| 10. How it works | light | Outlined process cards, day-range chips, connecting SeparatorIn rule |
| 11. Testimonials | tint | Testimonial lockup, CountUp metric, mono 1/2 counter |
| 12. FAQ | light | Accordion container, FAQPage JSON-LD |
| 13. Final CTA | accent | The one accent surface; inverted primary pill, Bracket CTA secondary, `--lineacc` rails |
| Footer | dark | Info bar, ruled mono link tables, DEN/TPA clocks, cropped wordmark |

Homepage annotation map (the 3-per-page budget, instantiated): the hero circle on "each one", the nav's static active-link underline, and the CTA band's bracket. Nothing else on the homepage is hand-drawn. Nº labels run 001 INTRO through 008 PROCESS (hero, problem, solution, services, proof, results, portal, process); trust, testimonials, FAQ, CTA band, and footer carry none.

## 10. Accessibility and quality bar

- Semantic HTML, one H1, landmarks, alt text; decorative SVG/canvas `aria-hidden`; marquee duplicates hidden from AT.
- Contrast: AA minimum everywhere; `--accondark` exists so accent text on dark passes; `--mid` on `--surf` passes for `--text-small` and up, verify anything smaller.
- Keyboard: everything reachable, focus-visible ring (section 1), menus focus-trapped with Escape.
- Reduced motion table (7.8) is a ship gate, not a suggestion.
- Check 375 / 768 / 1280 / 1536 before any section is done; no horizontal scroll at any width.
- Copy renders server-side. No copy lives behind JS-only rendering or canvas.

---

## Changelog

- **2026-08-23 (hero v5.1, same-day live review)**: Brad's tweaks on the v5 canvas, all in 2.hero.md v5.1: the cube's solid core is now a smoke core (opaque hashed-discard wisp so it survives the transmission buffer; the frosted glass blurs the grain into smoke); refraction calmed (ior 1.25, thinner walls) so the core no longer multiplies through the bevels; spin roughly halved and the swoop stretched (follower rate 4.5/s); headline raised beside the cube with the statement in its own clear row (the bottom-anchored fold collided at wide viewports); and the held card beat gained a right-column side text block (eyebrow + lead + "See the Results" rule link) sliding in/out with the beat, lusion's card + paragraph screen. Side-text paragraph is DRAFT copy pending Brad. The card-beat rule link is a showcase link and does not break the hero's no-CTA rule; the annotation budget is untouched.
- **2026-08-23 (hero v5: WebGL set piece)**: The v4 CSS-transform film takeover was rebuilt on a WebGL canvas after Brad's review (execution below the bar) and his new direction: a Spline-grade glass cube as the hero's 3D brand object that seamlessly becomes the media player. 7.4's hero entry rewritten: glass cube (transmission + `--acc` core) swoops behind the text, flattens to a glass pane, the film develops over it in brand-ink duotone, and balloons with a cloth bend into a framed 4vw-margin panel (the full-bleed settle is retired; media stays an object). The scrubbed ink line is CUT (the hero keeps only the circled word; annotation budget returns to 3 with 1 spare). New motion rule: canvas actors may follow a time-damped follower of native scroll progress (~5.5/s) to keep fast scrubs legible; DOM scrubs stay pure functions of raw progress; native scroll remains locked. Glassmorphism note: section 4.4's "no glassmorphism" still bans frosted UI SURFACES; a 3D glass object in a sanctioned canvas is a different instrument and is allowed (this hero is its one use). BUDGET FLAG, needs Brad's call: the lazy 3D chunk (three 0.185 + r3f 9 + hero canvas) measures ~232KB gz against 7.9's 200KB line; it is lazy-loaded and never LCP (verified absent from the initial script set). Engineering rules added to 2.hero.md and binding for all future canvas work: build ShaderMaterials imperatively and attach via `<primitive>` (JSX `uniforms` props bind a clone; useFrame mutations never reach the GPU); transparent materials are excluded from three's transmission buffer (keep through-glass objects opaque, fade covers in above the glass); raw ShaderMaterial pipelines run NoColorSpace end to end with a `flat` Canvas or the brand blues wash out. Queued v6 direction from Brad: the cube as a persistent companion object following the visitor down the page (requires a page-level fixed canvas, lusion's architecture; not built inside the hero).
- **2026-08-23 (review 2 refinements)**: The v3 hero's straight bottom-up film rise was replaced with the pen-pull choreography (7.4 rewritten; lusion.co studied live for the rope-and-reel sequencing). Hairline rails removed from the hero section only (Brad found them boxy there; rails remain the system default elsewhere). The ink line joins the annotation system as scroll wayfinding: it extends the hero circle, so it does not spend an extra annotation-budget slot on the homepage. Engineering note for every future scrubbed section: use callback-form `useTransform` with explicit clamps; two-stop range arrays drift after re-renders in framer-motion 13.1.1.
- **2026-08-23 (direction pivot after 2A/2B build review)**: Brad rejected the built hero and nav as generic conversion-page design; the corrected posture is creative-first, showcase-led, with conversion quiet until the page bottom. Changes: hero is now the scroll-driven film takeover (7.4 entry added; signature move 3 revised; section 9 rows 1 to 2 updated); the hero's two-CTA pair, eyebrow row, and reassurance line are removed (no CTAs above the fold beyond the nav pill; the project-brief's "one clear primary CTA above the fold" rule is now satisfied by the nav pill alone on the homepage, per Brad); nav is a two-pill bar with a full-screen overlay index menu (6.5 rewritten; NavigationMenu mega menu and mobile Sheet retired); added `--text-display` and `--text-menu` viewport-scale tokens (3.2); scroll-scrub budget now includes the hero set piece (section 0). Pending Brad's sign-off: the bar pill label "Let's Talk" is not on copy-rules.md's approved button list (the overlay and CTA band keep "Schedule a Call"). TitleAssemble remains available but currently unused on the homepage.
- **2026-08-23 (Phase 2 direction lock)**: The 13 home specs and the shared CTA band and footer specs were rewritten into reference-grounded design briefs after Brad flagged them as generic; the old specs pre-dated the scrape and three contradicted this guide (full-bleed hero, dark CTA band, over-video nav rules). Decisions locked with Brad: hero composition is statement-over-panel (lusion structure, type on paper above the framed panel); problem uses the page's single `--text-statement` headline plus the new numbered ruled list; solution is an unequal bento (one dark panel, zero accent); services are ruled index tables mirroring the footer treatment; the one scroll-scrubbed set piece stays unspent until real Obsidion assets exist. Added 6.10 (numbered ruled list). Updated the section 9 effect map to match the briefs and added the homepage annotation map and Nº numbering. Nav pill label changed from "Get Started" to "Schedule a Call" in 6.5 for two-CTA consistency. Build order restructured in tasks.md into phases 2A to 2J, one session each, brief first.
- **2026-08-21 (groundwork build)**: Section 5 selectors changed from `section[data-theme]` to `[data-theme]` so themed non-`<section>` elements (the dark footer) work with one component; `:root` now carries light-value `sec-*` defaults so sec-* components resolve outside a themed scope. Section 3.2 gained the tailwind-merge note: without registering the custom text-* utilities as font-size classes, `cn()` classed them as text colors and dropped them (found when H2s rendered at body size). Implementation notes: reduced-motion branches use a hydration-safe hook (`useReducedMotionSafe`) because reading the media query on first client render breaks hydration; the annotation boil runs 3 frames at 200ms.
- **2026-08-21**: Initial version. Generated from `0.design-moodboard.md` plus the nine reference analyses (e2vc as primary identity anchor; lusion, pear-no, pxpush, obys-aim, dropbox-brand, youtech-agency, readymag, metacci contributing the specific elements credited inline). Direction changes vs the moodboard, agreed in the synthesis session: framed hero panel replaces the full-bleed video hero; the closing CTA band becomes the single full-accent surface (footer stays dark); named ease trio replaces the single fade-up spec (fade-up remains the block default); added `--accondark`, `--linedark`, `--lineacc`, `--radius-media`, selection color, per-section `data-theme` scopes, and the signature kit (annotations, hairline system, Nº labels, pixel cursor, directional fills).
