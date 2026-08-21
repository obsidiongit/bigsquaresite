# Ad Credit Page Specifications

Destination for the exit-intent popup (shared/popup-ad-credit.md). One offer, one action.

## Page
- URL: /ad-credit/
- Title tag: Claim Your Ad Credit | BigSquare
- Meta description: `[PLACEHOLDER]`

## Content
- Logo, centered, large.
- H1: "Get a $1,000 Advertising Credit" `[PLACEHOLDER: confirm amount and terms per decisions.md]`
- Sub: "Limited time through [date]." Date comes from the single POPUP_DEADLINE config value, same as the popup.
- How it works (3 short bullets): `[PLACEHOLDER: terms not finalized. Do not invent mechanics.]`
- Button: "Schedule a Free Consultation" (routes to the booking calendar or /schedule/ with UTM carried).
- Fine print, 12px, `--mid`: `[PLACEHOLDER: credit terms in one line]`

## Components to Use
- Single centered column, max width 640px. Reuses the booking component or links to /schedule/.
- No popup on this page (per popup spec exclusions). Nav and footer stay.

## Design Instructions
- Mirrors the popup's look: lots of white space, `--paper`, headline Bluu Next Bold, one `--acc` pill button.
- This page ships with placeholders visible only if terms are final. If terms are not final by launch, the popup and this page hold together.
