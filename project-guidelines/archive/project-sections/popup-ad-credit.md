# Ad Credit Popup Specifications (shared)

Modeled on the Scorpion exit popup. One offer, one deadline, one button, the logo.

## Content
- Logo mark + wordmark, centered
- Headline: "Get a $1,000 Advertising Credit"  `[PLACEHOLDER: confirm the dollar amount and the terms]`
- Sub: "Limited time through [date]."  `[PLACEHOLDER: rolling date, set in one config value]`
- Button: "Schedule a Free Consultation" linking to /ad-credit/
- Close X top right

## Layout Reference
- Screenshot: `../reference-images/scorpion-popup-ad-credit.png`
- Source URL: https://www.scorpion.co/

## Behavior
- Trigger: exit intent on desktop (cursor leaves the viewport through the top). On mobile: 50 percent scroll depth or 30 seconds, whichever is first.
- Show once per visitor per 14 days. Store in localStorage.
- Never show on `/go/`, `/apply/`, `/thanks/`, `/schedule/`, `/audit/`, or `/ad-credit/`.
- Dimmed page behind it, click outside closes.

## Components to Use
- shadcn `Dialog`. Rounded 24px, `--paper` background, max width 720px.

## Design Instructions
- Lots of white space. Logo large. Headline Bluu Next Bold 32px. Button `--acc`, pill.
- Fine print under the button, 12px, `--mid`: `[PLACEHOLDER: credit terms in one line]`
