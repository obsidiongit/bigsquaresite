# Footer Design Brief (shared)

v2, 2026-08-23. Content unchanged from v1 (all links stay, they are SEO-relevant internal links). Design layer rebuilt from the Youtech-clone columns into the STYLE_GUIDE 6.8 set piece: ruled mono link tables, office clocks, and the cropped viewport-scale wordmark. Build phase 2I, its own session. Appears on every page except /go/, /apply/, and /thanks/.

Change from v1: the "Work With Us" Bluu Titling block (a Youtech mirror) is dropped. The accent CTA band directly above already owns that job, and the cropped wordmark is the closing mark instead.

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

### Locations / Socials / Contact row

**Locations**: Denver, Tampa (each links to its location page), with the live clock lockup.
**Socials**: `[PLACEHOLDER: confirm which exist]` Instagram, Facebook, YouTube, TikTok, LinkedIn, X
**Contact Us**: Denver `[PLACEHOLDER: phone]`, Tampa `[PLACEHOLDER: phone]`, support@bigsquaremarketing.com

**Badge slot**: empty at launch. Reserved for a partner badge once earned. Render nothing until a badge exists, never an empty box.

### Legal line
Logo mark + "BigSquare Marketing © [current year] All Rights Reserved." Privacy and Terms links.

## Design direction

Theme `dark` (`--darkpanel` ground, `--linedark` hairlines, `--accondark` accents). Anatomy top to bottom (STYLE_GUIDE 6.8):

1. **Info bar**: 13px mono row on a 1px `--linedark` rule. Brand line left, "[Results]" utility link, © right.
2. **Four ruled mono link tables**: column headers as mono uppercase eyebrows in `--ondarkmid`; each link a full-width rule row (label in `--ondark` Apfel 400, `↗` right, 1px `--linedark` bottom rule). Hover: arrow slides 4px, rule brightens toward `--ondark`. Same `RuledLinkTable` component the services section built in phase 2D.
3. **Locations / Socials / Contact row**: locations carry the mono two-office clock lockup `DEN 09:41 / TPA 11:41` (live, minutes precision, tabular nums, hydration-safe: render after mount to avoid server-client mismatch). Badge slot logic per content section.
4. **Set piece**: the BigSquare wordmark at viewport scale in Bluu Next, cropped by the page bottom edge, `--ondark` at low opacity or as an outline. One quiet Reveal on arrival, nothing scrubbed, no echo copies.
5. **Legal line**: mono 12px.

GridLines rails persist in `--linedark`.

## Steal from

- Pxpush, ruled mono link tables with arrows and the giant footer wordmark: `../reference-images/pxpush/pxpush-home-desktop-22.png` and `pxpush-home-desktop-24.png`
- Obys, the wordmark cropped by a page edge: `../reference-images/obys-aim/obys-aim-desktop-01-top.png`
- E2VC, world-clock lockup in the closing surface: `../reference-images/e2vc/e2vc-home-desktop-24.png`
- Youtech, the four-column IA this keeps: `../reference-images/youtech-footer.png`

## Build with

Existing: `Section` (dark theme), `Container`, `GridLines`, `InfoBar`, mono meta, `RuledLinkTable` + `RuleLink` from phase 2D, `Logo`, `components/motion/Reveal.tsx`, shadcn `Accordion` (mobile columns).

New this phase: `components/shared/Footer.tsx`, `OfficeClocks` (America/Denver and America/New_York, minute tick).

## Motion

- Wordmark: one Reveal as the footer enters. Clocks tick minutes only.
- Link row hovers per the rule-link spec. Reduced motion: settled, clocks still update (content, not decoration).

## Mobile (375)

Link columns become accordion groups (shadcn Accordion, one open at a time). Locations/socials/contact stack. Clocks stack to two lines. The wordmark still crops at the bottom edge at a smaller scale. Legal line wraps.

## Done when

- [ ] Every link resolves; columns mirror the services IA exactly
- [ ] Clocks correct in both timezones, no hydration mismatch
- [ ] Badge slot renders nothing
- [ ] Wordmark crop reads at 375 and 1536 without horizontal scroll
- [ ] Mobile accordions keyboard-operable
- [ ] Screenshots at all four widths reviewed with Brad before checkoff
