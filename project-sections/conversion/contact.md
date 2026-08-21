# Contact Page Specifications

## Page
- URL: /contact/
- Title tag: Contact BigSquare Marketing
- Meta description: `[PLACEHOLDER]`

## Content
- Eyebrow "CONTACT", H1 "Talk to us".
- Sub: "Want to skip the form? Book a time that works: Schedule a Call" (linked).
- Form (single server action, UTM and slug fields): name, email, phone, company, how many locations, message. Button: "Send the Message".
- Offices (two cards):
  - Denver: `[PLACEHOLDER: street address]`, `[PLACEHOLDER: phone]`
  - Tampa: `[PLACEHOLDER: street address]`, `[PLACEHOLDER: phone]`
- Email: support@bigsquaremarketing.com
- Each office card links to its location page.

## Components to Use
- Two-column desktop: form left, offices and email right. Stack on mobile, form first.
- shadcn Field/FieldGroup pattern.

## Design Instructions
- `--paper` background. Office cards on `--surf`.
- Organization JSON-LD already sitewide; no extra schema here.
