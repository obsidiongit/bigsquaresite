# Reference Images

Drop the screenshots here with these exact names so the mood board and section files resolve.

| File name | What it is | Referenced by |
|---|---|---|
| `youtech-nav-mega-menu.png` | Youtech Services mega menu (3 columns, light panel) | 0.design-moodboard.md, home/1.nav.md |
| `youtech-footer.png` | Youtech footer (4 columns + locations, contact, badge) | shared/footer.md |
| `scorpion-popup-ad-credit.png` | Scorpion exit popup ($1,000 ad credit) | shared/popup-ad-credit.md |
| `scorpion-services-menu.png` | Scorpion Marketing Solutions card menu | 0.design-moodboard.md (contrast reference) |
| `scorpion-partner-badges.png` | Google / Meta / Microsoft badge strip under hero | home/3.trust.md (target state) |
| `ignite-services-menu.png` | Ignite Services mega menu | 0.design-moodboard.md (negative reference) |
| `bigsquare-style-sheet-v6.html` | Brand sheet with fonts embedded | 0.design-moodboard.md |
| `bigsquare-logo.png` | Transparent logo mark | everywhere |

Add any new inspiration screenshot here and add a row to this table.

## Scraped reference sites

Each scraped site gets its own subfolder with desktop + mobile screenshots at multiple scroll depths, an `ANALYSIS.md` (what to take, what to skip, exact tokens), and an `*-extracted-data.json` (fonts, colors, easings, CSS variables pulled from the live site).

| Folder | Site | Role |
|---|---|---|
| `lusion/` | lusion.co | Creative ceiling: framed WebGL hero, mask text reveals, scroll-linked accent element, pill UI. Palette nearly matches our Graphite. |
| `obys-aim/` | aim.obys.agency | Typographic/editorial ceiling: hairline info bars, footnote annotations, bracketed index labels, viewport-scale statement type, pinned cycling showcase. Zero WebGL. Palette does not transfer (warm greige, no accent). |
| `dropbox-brand/` | brand.dropbox.com | Grid discipline reference: visible blueprint grid everything snaps to, accent-only statement typography, grid-snapped tile mosaic, scroll-assembled tiles with zero WebGL. Rainbow tile palette does not transfer. |
| `youtech-agency/` | youtechagency.com | Page architecture blueprint: the moodboard's Reference 1 captured in full. Homepage narrative arc (problem, positioning, proof, stats band, partners, services, success stories, 90-day timeline, CTA band), two-CTA repeat, testimonial + metric lockup. Skin, copy, and WordPress feel do not transfer. |
| `readymag/` | readymag.com | Product-marketing structure reference: feature bento of self-contained rounded panels, real product UI fragments as illustration, vertical verb carousel, one flat H2 size everywhere, cycling showcase cards, logo band inside a tinted panel, oversized closing CTA. Multi-accent rainbow palette does not transfer. |
| `e2vc/` | e2.vc | Primary reference, closest token match (cream/ink/one electric blue + hairline grid vs our Graphite). Hand-drawn rough.js annotation system (bracket CTA, circled hero word, underlines) fully reverse-engineered in `e2vc-annotation-probe.json`; tag-chip metric lockups on case cards, case study page template, filterable directory, per-section theme tokens, word-by-word Y text reveal. Homepage desktop + mobile plus all 8 section pages and one founder page in `pages/`. Lowercase voice, warm cream, rainbow chip colors, and physics footer do not transfer. |
| `metacci/` | metacci.com/en | Conversion narrative reference: single persuasion arc (promise, proof, stats, work, process, human, FAQ, one CTA), outcome-first case study headlines with the metric in the title, numbered process cards, "Before you book" objection-handling FAQ, textbook semantic token architecture. Full dark theme and zero-accent monochrome palette do not transfer. |
| `pxpush/` | pxpush.com | Personality ceiling + direct business analog (design subscription selling reliability through one totalizing camcorder/CRT metaphor). Deep dive: all 19 production bundles reverse-engineered in ANALYSIS.md. Declarative scroll-effect directive catalog (textFade/titleRandom/overlayIn/clipIn/separatorIn with exact GSAP configs), square-pixel difference cursor, numbered section system with per-section theme tokens, CSS-var directional button fills, velocity-reactive marquee/flipbook/3D spin, chrome material recipe, hero→nav logo morph, footer echo-logo set piece. Retro-CRT skin, scrubbed body text, multi-color grounds, and 565KB Three.js budget do not transfer. |
| `pear-no/` | pear.no | Narrative ceiling + closest business analog (SEO/software firm selling rigor with premium theater). Deep dive: full code reverse-engineering in ANALYSIS.md (they shipped commented shader source). Chapter rail system, fraction-table scroll architecture, serif/grotesk/mono triad, luminance-sensing nav, baseline reveals with exit motion, typewriter mono chips, scroll-scrubbed WebP sequences, house ease cubic-bezier(.22,1,.36,1). `journey/` covers the full 53-viewport road to the footer. Scroll hijack, single-shader film, AI period art, and loading gate do not transfer. |
