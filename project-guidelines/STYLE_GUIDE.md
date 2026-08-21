# BigSquare Style Guide

The authoritative design system for the BigSquare marketing site. Generated from `project-sections/0.design-moodboard.md` and `project-sections/reference-images/bigsquare-style-sheet-v6.html` (brand sheet, source of truth for color, type, and logo).

Governance: follow this file for all design decisions. If an implementation improves on it, keep the better implementation, update this file, and add a changelog entry at the bottom. Never diverge silently. Section-specific choices stay in that section's spec file.

Aesthetic: clean, measured, premium, technical, confident, airy. Not playful, loud, startup-gradient, neon, or glassmorphism. Build quality bar is Framer/Webflow showcase level. Motion feels expensive and calm.

## 1. Color

`#0657F9` is the logo blue. It never changes. Every palette is built around it. The logo mark is transparent and sits on any ground without a white box.

Palettes are plain CSS variables switched by a `data-palette` attribute on `<html>`. **01 Graphite is the `:root` default.** Alternate palettes are for landing pages and ad creative only. Never mix palettes on one page.

```css
/* app/globals.css */
:root {
  /* 01 Graphite (site default) */
  --paper: #F5F6F8;        /* page background */
  --surf: #E9ECF1;         /* cards, alternating sections */
  --mid: #5A6373;          /* secondary text */
  --ink: #0B0F17;          /* primary text */
  --acc: #0657F9;          /* logo blue: primary buttons, links, metrics */
  --acc2: #0A2A73;         /* deep navy, secondary emphasis */
  --onacc: #FFFFFF;
  --onacc2: #FFFFFF;
  --line: rgba(11,15,23,.12);
  --darkpanel: #0B0F17;    /* dark sections: hero overlay, CTA band, footer */
  --ondark: #E9ECF1;
  --ondarkmid: #8D97A8;
}

[data-palette="signal"] {
  /* 02 Signal: dark */
  --paper: #080B12; --surf: #131926; --mid: #8A97AC; --ink: #EEF1F6;
  --acc: #0657F9; --acc2: #23C1E8; --onacc: #FFFFFF; --onacc2: #080B12;
  --line: rgba(238,241,246,.14); --darkpanel: #131926;
  --ondark: #EEF1F6; --ondarkmid: #8A97AC;
}

[data-palette="blueprint"] {
  /* 03 Blueprint: cool light with orange complement */
  --paper: #EEF2FB; --surf: #DCE5F6; --mid: #4C5C7A; --ink: #0B1220;
  --acc: #0657F9; --acc2: #FF6B2C; --onacc: #FFFFFF; --onacc2: #0B1220;
  --line: rgba(11,18,32,.14); --darkpanel: #14284B;
  --ondark: #EEF2FB; --ondarkmid: #93A6C6;
}

[data-palette="chalk"] {
  /* 04 Chalk: warm light */
  --paper: #F4F2ED; --surf: #E7E3D9; --mid: #6B6960; --ink: #15161A;
  --acc: #0657F9; --acc2: #17715F; --onacc: #FFFFFF; --onacc2: #FFFFFF;
  --line: rgba(21,22,26,.13); --darkpanel: #15161A;
  --ondark: #F4F2ED; --ondarkmid: #98958B;
}
```

Rules:
- Metrics and big numbers always use `--acc` or `--acc2`, never `--ink`.
- Dark panels (`--darkpanel`) are only for the hero overlay, the closing CTA band, the proof-numbers band, and the footer. The rest of the page is light.
- One accent color on screen at once (blue). Navy is depth, not a second accent.
- Focus style everywhere: `outline: 2px solid var(--acc); outline-offset: 3px` on `:focus-visible`.

## 2. Tailwind v4 setup (CSS-first)

No `tailwind.config.ts`. Everything lives in `app/globals.css` with `@theme inline` mapping the palette variables to utility names, so `bg-paper`, `text-ink`, `border-line`, `bg-darkpanel`, `text-ondark`, `font-display` all work and follow the active palette.

```css
@import "tailwindcss";

/* :root palettes from section 1 go here, before @theme */

@theme inline {
  --color-paper: var(--paper);
  --color-surf: var(--surf);
  --color-mid: var(--mid);
  --color-ink: var(--ink);
  --color-acc: var(--acc);
  --color-acc2: var(--acc2);
  --color-onacc: var(--onacc);
  --color-onacc2: var(--onacc2);
  --color-line: var(--line);
  --color-darkpanel: var(--darkpanel);
  --color-ondark: var(--ondark);
  --color-ondarkmid: var(--ondarkmid);

  --font-display: var(--d);
  --font-sans: var(--t);
  --font-mono: var(--m);

  --radius-card: 16px;
  --radius-popup: 24px;
}
```

shadcn/ui token mapping (so stock components inherit the palette; use semantic classes like `bg-primary` only inside shadcn internals, palette utilities everywhere else):

```css
:root {
  --background: var(--paper);
  --foreground: var(--ink);
  --card: var(--surf);
  --card-foreground: var(--ink);
  --popover: var(--paper);
  --popover-foreground: var(--ink);
  --primary: var(--acc);
  --primary-foreground: var(--onacc);
  --secondary: var(--surf);
  --secondary-foreground: var(--ink);
  --muted: var(--surf);
  --muted-foreground: var(--mid);
  --accent: var(--surf);
  --accent-foreground: var(--ink);
  /* Error red for form validation only; shadcn default, brand has not picked one */
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: #FFFFFF;
  --border: var(--line);
  --input: var(--line);
  --ring: var(--acc);
  --radius: 16px; /* aligns shadcn rounded-lg with the 16px card radius */
}
```

The shadcn v4 CLI also adds two imports next to `@import "tailwindcss"` in globals.css: `tw-animate-css` and `shadcn/tailwind.css` (variants and keyframes its components rely on). Keep them. The CLI's own oklch token blocks, `.dark` theme, and Geist font are removed on sight: palettes switch by `data-palette`, never a `.dark` class, and fonts are locked.

## 3. Typography

- Display (H1, H2, big numbers): **Bluu Next Bold**. Italic and Titling cuts for emphasis (Titling: the footer "Work With Us" mark).
- Everything else: **Apfel Grotezk**. Regular (400) body, Mittel (500) UI and nav, Fett (700) H3 and buttons, Satt (900) rare heavy emphasis.
- Mono (metric labels, eyebrows): **IBM Plex Mono** as placeholder. The third font is not locked. Never hard-code font names outside the CSS variables; the display font may also change after v1.

Font files are extracted from the brand sheet into `public/fonts/` (all woff2, SIL OFL):

| File | Family | Weight/Style |
|---|---|---|
| BluuNext-700.woff2 | BluuNext | 700 |
| BluuNext-700-Italic.woff2 | BluuNext | 700 italic |
| BluuTitling-400.woff2 | BluuTitling | 400 |
| Apfel-400.woff2 | Apfel | 400 (Regular) |
| Apfel-500.woff2 | Apfel | 500 (Mittel) |
| Apfel-700.woff2 | Apfel | 700 (Fett) |
| Apfel-900.woff2 | Apfel | 900 (Satt) |

```css
@font-face { font-family: 'BluuNext'; font-weight: 700; font-style: normal;
  font-display: swap; src: url('/fonts/BluuNext-700.woff2') format('woff2'); }
@font-face { font-family: 'BluuNext'; font-weight: 700; font-style: italic;
  font-display: swap; src: url('/fonts/BluuNext-700-Italic.woff2') format('woff2'); }
@font-face { font-family: 'BluuTitling'; font-weight: 400; font-style: normal;
  font-display: swap; src: url('/fonts/BluuTitling-400.woff2') format('woff2'); }
@font-face { font-family: 'Apfel'; font-weight: 400; font-style: normal;
  font-display: swap; src: url('/fonts/Apfel-400.woff2') format('woff2'); }
@font-face { font-family: 'Apfel'; font-weight: 500; font-style: normal;
  font-display: swap; src: url('/fonts/Apfel-500.woff2') format('woff2'); }
@font-face { font-family: 'Apfel'; font-weight: 700; font-style: normal;
  font-display: swap; src: url('/fonts/Apfel-700.woff2') format('woff2'); }
@font-face { font-family: 'Apfel'; font-weight: 900; font-style: normal;
  font-display: swap; src: url('/fonts/Apfel-900.woff2') format('woff2'); }

:root {
  --d: 'BluuNext', Georgia, serif;
  --dt: 'BluuTitling', Georgia, serif;
  --t: 'Apfel', 'Helvetica Neue', Arial, sans-serif;
  --m: 'IBM Plex Mono', ui-monospace, Menlo, monospace;
}
```

Preload `BluuNext-700.woff2`, `Apfel-400.woff2`, and `Apfel-500.woff2` in the root layout (the above-the-fold faces). `font-display: swap` per seo-requirements.md. IBM Plex Mono self-hosted or from Google Fonts, loaded non-blocking; it is below the fold on most pages.

### Type scale

| Role | Desktop | Mobile | Face | Notes |
|---|---|---|---|---|
| H1 | 64px | 40px | Bluu Next Bold | line-height 1.05, letter-spacing -0.015em |
| H2 | 44px | 32px | Bluu Next Bold | line-height 1.1 |
| H3 | 24px | 20px | Apfel Fett | line-height 1.2 |
| Body | 18px | 17px | Apfel Regular | line-height 1.6, `--ink`; secondary body `--mid` |
| UI / nav | 16px | 16px | Apfel Mittel | Title Case for nav and button labels |
| Eyebrow | 13px | 13px | Mono | uppercase, letter-spacing 0.08em, `--mid` |
| Big metric | 72px | 48px | Bluu Next Bold | `--acc` or `--acc2`, tabular-nums |
| Fine print | 12px | 12px | Apfel Regular | `--mid` |

Copy rules live in `project-guidelines/copy-rules.md`: sentence case headlines, Title Case only for nav and buttons, no em dashes, numerals for numbers, body text max width around 60ch.

## 4. Spacing and layout

- Max content width **1200px**, centered, side padding `clamp(20px, 4vw, 48px)`.
- Wide sections (hero, logo marquee, CTA band, footer) go full bleed; their content still aligns to the 1200px container.
- Section padding: **96px** top and bottom desktop, **64px** mobile. Trust marquee is the exception: 48px.
- **8px base grid** for all spacing. Tailwind's default 4px scale is fine; land on multiples of 8 for layout gaps.
- Alternate section backgrounds down the page: `--paper`, then `--surf` to separate adjacent sections when both are light.
- One clear primary CTA above the fold on every page.

## 5. Responsive breakpoints

Tailwind v4 defaults, mobile first:

| Token | Width | Use |
|---|---|---|
| (base) | < 640px | Single column, stacked everything |
| `sm` | 640px | — |
| `md` | 768px | 2-column grids, tablet nav still in Sheet |
| `lg` | 1024px | Full desktop nav with mega menu, 3-column grids |
| `xl` | 1280px | Full 1200px container |
| `2xl` | 1536px | No new layout, just breathing room |

Check every section at **375 / 768 / 1280 / 1536** before calling it done. No horizontal scroll at any width. Most paid traffic is mobile: design mobile first.

## 6. Component patterns

### Buttons
- Pill shape (`rounded-full`), padding 16px 28px, Apfel Fett, 16px label.
- Primary: `--acc` fill, `--onacc` text. Secondary: transparent, 1px border, `--ink` text on light, `--ondark` on dark. Tertiary (rare, brand sheet): `--acc2` fill.
- Both buttons in a pair are the same height. Labels say what happens next in 2 to 4 words, Title Case ("Schedule a Call", "Get a Free Audit"). Never Submit, Learn More, or Click Here.
- Hover: scale 1.02 + soft shadow, 150ms ease. No gradient buttons, ever.

### Cards
- `--surf` background on `--paper` sections; `--paper` background on `--surf` sections. Always 1px `--line` border, **16px radius**.
- No resting shadow. On hover: soft shadow + 4px lift, 200ms.
- Padding 24px to 32px.

### Nav
- Height 72px desktop, 64px mobile. Left: logo mark + "BigSquare" wordmark (Bluu Next Bold). Center: links, Apfel Mittel, Title Case. Right: Login (icon + text link, never a button) and Schedule a Call (the only button in the nav).
- Transparent over the hero (`--ondark` links). After 40px scroll: `--paper` background, 1px `--line` bottom border, 12px backdrop blur, `--ink` links. Transition 200ms.
- Mega menu panel: `--paper`, 16px radius, soft shadow, fade + 8px slide down, 180ms. Three columns with small line icons; column headers 13px Apfel Mittel `--mid`; items 16px `--ink`. Footer strip inside the panel: "Ready to grow? Schedule a Call" with arrow, `--acc`.
- Active link: 2px `--acc` underline.
- Mobile: shadcn Sheet from the right, accordion groups for Services and Industries, Schedule a Call pinned to the bottom.

### Eyebrow labels
- Mono, 13px, uppercase, letter-spacing 0.08em.
- `--mid` on light backgrounds. On dark panels or video: `--acc` at 90% opacity (navy is too dark on video).
- Sits 12px to 16px above its headline. ALL CAPS is allowed here only.

### Metric blocks
- Number: Bluu Next Bold, 72px desktop / 48px mobile, `--acc` (alternate `--acc2` for variety in a row), `font-variant-numeric: tabular-nums`.
- Label: one line under the number, Apfel Regular, `--mid` on light, `--ondarkmid` on dark.
- Count up on scroll entry, 1.2s ease-out; static under reduced motion.
- Values come from a single `metrics` array in code. No number ships without a source in a spec file.

### CTA band
- Shared component at the bottom of every marketing page above the footer. Full bleed `--darkpanel`, centered text, H2 in `--ondark`, padding 120px desktop / 80px mobile.
- Optional looping video background at 20% opacity behind a dark overlay.
- Default copy and buttons per `project-sections/shared/cta-band.md`.

### Popup (ad credit)
- shadcn Dialog. `--paper` background, **24px radius**, max width 720px, generous white space.
- Logo large and centered, headline Bluu Next Bold 32px, one `--acc` pill button, fine print 12px `--mid`.
- Behavior (triggers, frequency, excluded routes) per `project-sections/shared/popup-ad-credit.md`.

### Logo placeholder
- One shared `<Logo />` component: a square outline in `--acc` with the word "logo" inside (or a standard broken-image icon). Real file drops in later; never hard-code the placeholder outside this component.
- The real mark is transparent and sits on any ground: `--paper`, `--surf`, `--acc` (reversed), and `--darkpanel` all work without a white box.

## 7. Visual effects and motion

Framer Motion for everything below unless noted. Motion is smooth, purposeful, never busy.

- **Section entry:** fade-up, 0.5s, 16px travel, children stagger 60ms. Trigger once per section on scroll entry.
- **Hero:** full-bleed video, muted, autoplay, loop, `playsinline`, poster image, loaded after first paint. `--darkpanel` overlay at 55 to 65%. Headline words fade up with 40ms stagger on load; buttons fade in 200ms after. Slow Ken Burns on the poster if video fails.
- **Logo marquee:** continuous horizontal scroll via CSS animation (two duplicated tracks), 40s per loop, pauses on hover. Logos grayscale, full color on hover. Soft fade masks at both edges.
- **Count-ups:** 1.2s ease-out on entry.
- **Buttons:** scale 1.02 + shadow, 150ms. Cards: 4px lift + soft shadow, 200ms.
- **Nav:** background/border/blur transition at 40px scroll, 200ms.
- **Accordion (FAQ):** smooth height transition.
- **Carousel (testimonials):** 400ms crossfade, auto-advance 8s, pauses on hover.
- **Three.js:** optional only. One light element max per page (wireframe square or grid), under 200KB, never hurts LCP. Skip if in doubt.

### Reduced motion
`prefers-reduced-motion: reduce` disables: marquee movement (render a static centered grid), count-ups (show final values), Ken Burns, auto-advancing carousel, and Three.js elements. Entry animations become instant fades (opacity only, no travel). Hover color changes stay.

### Performance floor
Core Web Vitals green on every page: LCP under 2.5s, INP under 200ms, CLS under 0.1. Everything above the fold loads in under 2.5s. Analytics after hydration. Animations use `transform` and `opacity` only.

## 8. Imagery

- No stock photos of people shaking hands. Real team, real clients, or abstract brand shapes only.
- Next Image everywhere, WebP or AVIF, descriptive alt text, lazy loaded below the fold.
- Portal screenshots: real Obsidion UI only. Until it exists, a blurred frame with a "Portal preview" tag. Never a fake UI with fake numbers.

## 9. Do not

- No gradient buttons.
- No glassmorphism cards as a default pattern.
- No more than one accent color on screen at once.
- No heavy resting shadows.
- No condensed all-caps type, badge walls, or dense paragraphs (the Ignite look).
- No partner badges until earned. The trust row label is "Some of the partners we work with."
- No dark theme as the site default. Dark panels are accents, not the ground.

---

## Changelog

- **2026-08-20** — Phase 1 build. Extended the shadcn bridge with `--popover`, `--destructive` (shadcn default red, form errors only, until the brand picks one), and `--radius: 16px` so stock components land on the card radius. Added `--font-heading: var(--t)` in `@theme inline` so shadcn internals that use `font-heading` get Apfel, not the display face. Documented the two extra CSS imports the shadcn v4 CLI requires (`tw-animate-css`, `shadcn/tailwind.css`) and that its `.dark` theme and Geist font are always removed.
- **2026-08-20** — Initial version. Generated from the mood board and brand sheet v6. Fonts extracted from the brand sheet to `public/fonts/` (7 woff2 files). Button shape follows the mood board (pill), not the brand sheet's 3px radius: the sheet is a print-style artifact, the mood board is the site direction. `font-display: swap` chosen over the brand sheet's `block` per seo-requirements.md. Added `--dt` variable for Bluu Titling (footer "Work With Us" mark). Added shadcn semantic token mapping so stock components inherit the palette.
