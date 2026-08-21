# Footer Specifications (shared)

Copied from the Youtech footer structure. Appears on every page except `/go/`, `/apply/`, and `/thanks/` pages.

## Content

### Row 1 (four columns)

**Company**
About, Leadership, Careers, Blog, Results, Resources, Privacy Policy, Terms

**Organic Marketing**
Search Engine Optimization (SEO), Generative Engine Optimization (GEO), Social Media, Content Marketing, Email, Obsidion Portal

**Paid Advertising**
Paid Search, Google Local Services Ads, Paid Social, Amazon Ads, Creator Network

**Design & Development**
Web Design, Branding, Video Production, Custom Development

### Row 2 (three columns + badge slot)

**Socials**
`[PLACEHOLDER: confirm which exist]` Instagram, Facebook, YouTube, TikTok, LinkedIn, X

**Locations**
Denver, Tampa (each links to its location page)

**Contact Us**
Denver: `[PLACEHOLDER: phone]`
Tampa: `[PLACEHOLDER: phone]`
`[PLACEHOLDER: email]`

**Badge slot**
Empty at launch. Reserved for a partner badge once earned. Do not render an empty box. Render nothing until a badge exists.

### Bottom bar
Left: logo mark + "BigSquare" wordmark. "BigSquare Marketing © [current year] All Rights Reserved."
Right: "Work With Us" in Bluu Next Titling, stacked two lines, links to /schedule/ (mirrors the Youtech "WORK WITH US" mark).

## Layout Reference
- Screenshot: `../reference-images/youtech-footer.png`
- Source URL: https://www.youtechagency.com/

## Design Instructions
- `--darkpanel` background. Column headers Apfel Fett, `--ondark`. Links Apfel Regular, `--ondarkmid`, turn `--ondark` on hover.
- Four columns desktop, two columns tablet, one column mobile with accordion groups.
- Padding 80px top, 40px bottom.
- Every link here is an internal link for SEO. Keep all of them.
