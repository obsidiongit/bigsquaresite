# CTA Band Component (shared)

v2, 2026-08-23. Rewritten: the band is the accent surface now (`data-theme="accent"`), not a dark panel. Full design brief in `../home/13.final-cta.md`; this file is the component contract. Built in build phase 2H.

Used at the bottom of every marketing page, directly above the footer. Excluded on /go/, /apply/, and /thanks/ routes.

## Props
- `headline` (default: "Ready to grow every location?")
- `body` (default: "Book a call. We will look at your numbers together and tell you exactly what we would do first.")
- `primaryLabel` / `primaryHref` (default: "Schedule a Call" to /schedule/)
- `secondaryLabel` / `secondaryHref` (default: "Get a Free Audit" to /audit/), rendered as the Bracket CTA
- `showMark` (optional corner logo mark, default off)

## Design (see the full brief)
- Full bleed `--acc`, `data-theme="accent"`, `--section-y-lg` padding, centered content.
- GridLines in `--lineacc`, registration marks at corners.
- H2 white Bluu, body white at 72% max 44ch, primary as inverted white pill, secondary as white Bracket CTA (one annotation: pages using this band spend one slot of their 3-annotation budget here).
- No background video, no texture.

## Rules
- This is the ONE full-accent surface allowed per page (STYLE_GUIDE 5). Pages using the band cannot paint `--acc` full bleed anywhere else.
- Always sits flush above the dark footer; together they are the closing set piece.
- Per-page copy overrides go through props; labels stay in the approved button list from copy-rules.md.
