# Privacy policy + terms: the plan (2026-08-31)

Brad: "strategize on how to put together a solid terms and privacy policy section... make sure our asses are covered." This file is the research, the clause list, the facts we need from Brad, and how the pages get built. Not legal advice; the last step is a lawyer reading the draft.

## The short version

1. Claude drafts both pages from the clause lists below, in plain English, using the facts Brad supplies (section "Facts we need from Brad").
2. The draft is cross-checked against a generator (Termly or TermsFeed, free tier) to catch anything the clause list missed.
3. A lawyer reviews once. A flat-fee review of two web policies is a small line item; it is the only step that actually makes it "covered."
4. The pages render from content files, so counsel's edits are a text change, not a code change.

## What applies to BigSquare (a Denver + Tampa agency with a US website)

- **Federal:** CAN-SPAM (email), TCPA + CTIA/10DLC rules (texting; BigSquare sells email + text marketing and the /apply/ form collects a phone number), FTC Act section 5 (no deceptive claims), FTC Endorsement Guides (testimonials and case studies), COPPA (a one-line "not for under 13" statement).
- **California CCPA/CPRA:** applies if BigSquare has $25M+ revenue OR handles data of 100k+ Californians OR earns 50%+ from selling data. Probably not today. Still write the policy CCPA-shaped (categories collected, purposes, sharing, retention, rights, "do not sell or share" statement, Global Privacy Control mention). It is the strictest US template, and clients and partners look for it.
- **Colorado Privacy Act:** threshold is 100k Colorado consumers a year (or 25k + selling data). BigSquare is under it. Same move: write to the standard anyway, because the Denver office means Colorado is the natural governing law and Colorado readers will look.
- **Florida Digital Bill of Rights:** $1B revenue threshold. Does not apply. No Florida clause needed beyond the office address.
- **GDPR:** only if BigSquare markets to or serves EU people. It does not. One sentence: "Our services are for businesses in the United States. We do not target people in the EU or UK." Skip the GDPR articles.
- **Google:** if GA4 Advertising Features, Google Signals, or Ads remarketing are on, Google's policy requires the privacy page to name the features, explain first-party + third-party cookies used together, and link the opt-outs (Google Ads Settings, the NAI opt-out). Google can suspend the ads account if the policy is missing this.
- **Meta:** the Pixel + Custom Audiences require a privacy policy that discloses the Pixel, what it collects, how to opt out (Meta ad settings, AdChoices).

## Privacy policy: the clause list

Plain English, one H2 per clause, short paragraphs, a bulleted list where a list is clearer. Reading level 6th to 8th grade is fine for legal pages (copy-rules' 3rd to 5th target is for marketing copy).

1. **Who we are and what this covers.** Legal entity name, both office addresses, the sites covered (www.bigsquaremarketing.com and the /go/, /apply/ funnel pages), effective date.
2. **What we collect.** Grouped by source: (a) what you give us in forms: name, email, phone, company, website, location count, budget range, free-text answers; (b) what we collect automatically: IP, device, browser, pages viewed, referrer, UTM parameters, approximate location; (c) cookies and similar tech; (d) info from partners (ad platforms, the CRM). CCPA-style category table optional but recommended.
3. **How we use it.** Reply to you, run the audit or call you booked, send marketing email and texts you asked for, measure ads and the site, improve the site, protect against fraud, meet legal duties.
4. **Cookies, analytics, and ads.** Name the tools: Google Analytics 4 (and which Advertising Features are on), Google Ads remarketing, Meta Pixel, any heatmap or session tool, Vercel Analytics if used. Explain first-party + third-party cookies used together. Opt-out links: Google Ads Settings, NAI opt-out, Meta ad preferences, browser controls, Global Privacy Control honored.
5. **Texting (SMS) program.** Consent is collected on the form, not here, but the policy must state: what texts we send, message frequency, "message and data rates may apply," STOP to cancel, HELP for help, and that **mobile opt-in data is never shared with third parties for their marketing** (the exact carrier-required sentence). Keep consent records: timestamp, IP, the consent text shown, the number.
6. **Email.** CAN-SPAM: every marketing email has an unsubscribe link and a postal address; we honor opt-outs within 10 business days.
7. **Who we share with.** Service providers only: CRM/automation (GoHighLevel), hosting (Vercel), email/SMS senders, ad platforms, analytics, the Obsidion portal. "We do not sell your personal information. We do not share it for cross-context behavioral advertising except through the ad cookies described above, which you can opt out of."
8. **How long we keep it.** Leads and client records: while the relationship lasts plus a stated period (suggest 3 to 7 years for contracts and billing; SMS consent records 4 years per the TCPA statute of limitations); analytics per the tool's retention setting (GA4 default 2 or 14 months).
9. **Your choices and rights.** Access, correct, delete, opt out of marketing, opt out of targeted ads, appeal a denied request. How to ask (support@bigsquaremarketing.com), how we verify, response time (45 days, the CCPA/CPA standard), no discrimination for asking. A "Do not sell or share my personal information" statement.
10. **Security.** Reasonable safeguards, no guarantee, what happens on a breach (notice per state law).
11. **Children.** Not for anyone under 13 (under 16 for targeted ads under CPRA); we delete such data if we learn of it.
12. **Where the data lives.** United States. Not aimed at EU/UK residents.
13. **Third-party links** (portal, socials): their policies govern there.
14. **Changes to this policy.** We post the new date; material changes get a notice.
15. **Contact.** Email + postal address. Name a privacy contact role (not a person's name).

## Terms of service (website terms, not the client contract)

These are the rules for using the website and its forms. The client engagement is a separate signed agreement (MSA/SOW) and these terms should say so.

1. **Agreement.** Using the site means accepting these terms; if you do not agree, do not use it. Effective date.
2. **Who may use the site.** 18+, business use.
3. **What the site is.** Information about BigSquare's services, forms to contact us, free resources, a blog. Booking a call or sending a form does not create a client relationship; work starts only under a signed agreement.
4. **No guarantee of results.** Critical for an agency: case studies, metrics, and testimonials describe specific clients in specific periods; results depend on many factors; nothing on the site promises a result. Per the FTC's 2023 Endorsement Guides update, "results not typical" alone does not cure an atypical claim, so every case study number must be real, sourced, and shown with its time window, and the terms should not pretend a disclaimer fixes an inflated number.
5. **Free resources and the blog.** General information, not professional advice; we may change or remove them.
6. **Your content and communications.** What you submit through forms must be accurate and yours; you consent to be contacted about your request (the SMS consent itself lives on the form, one-to-one, naming BigSquare).
7. **Intellectual property.** Site content, the brand, the cube, the code are ours; limited license to view; no scraping, copying, or framing; trademarks.
8. **Acceptable use.** No abuse, no interference, no automated access, no unlawful use.
9. **Third-party services and links.** The Obsidion portal, social links, embedded tools have their own terms.
10. **Disclaimers.** Site provided "as is"; no warranties (express or implied) to the extent the law allows.
11. **Limitation of liability.** Cap (no indirect or consequential damages; direct damages capped at a small fixed amount, commonly $100 or fees paid for site use, which is $0); carve-outs where state law forbids the cap.
12. **Indemnification.** You cover us for claims arising from your misuse of the site or your content.
13. **Governing law and venue.** Colorado law, Denver County courts (the HQ state; confirm with Brad). Optional: arbitration + class-action waiver (lawyer's call; it is standard but it also alarms some readers; skip on a website terms page unless counsel wants it).
14. **Termination.** We can block access for violations.
15. **Changes.** Posted with a new date.
16. **Misc.** Severability, entire agreement (for the site only), no waiver, assignment.
17. **Contact.**

## Also on the site, outside the two pages

- **Form consent lines.** Under every form's submit button, one sentence linking both pages. On forms with a phone field (`/apply/`, `/schedule/`, `/contact/` if it has one): an unchecked checkbox with the one-to-one SMS consent text naming BigSquare Marketing, frequency, rates, STOP/HELP, and links to the privacy policy and terms. The consent text, timestamp, IP, and number go through `submitForm` into the CRM.
- **Cookie notice.** Not legally required for a business under the state thresholds with US-only visitors, but Google and Meta want opt-outs to be findable. Cheapest honest answer: no banner; a "Cookies and ads" section in the privacy policy plus honoring Global Privacy Control in the tag loader (skip the ad tags when `navigator.globalPrivacyControl` is true). Add a banner only if counsel asks.
- **Case study pages.** Every metric shows its time window and source line; client named or described honestly; no composite or rounded-up numbers.
- **Footer.** Links to both pages, plus "Do not sell or share my personal information" pointing at the privacy page's rights section.

## Facts we need from Brad (nothing drafts without these)

- Legal entity name and type (LLC? Inc? which state)
- Both office street addresses
- Which state governs (Colorado is the assumption)
- The privacy contact email (support@bigsquaremarketing.com is the locked support address; confirm it is fine for privacy requests too)
- Which tools are actually on the site at launch: GA4 (with or without Advertising Features / Google Signals), Google Ads remarketing, Meta Pixel, any heatmap tool, Vercel Analytics, GoHighLevel, the Obsidion portal
- Whether BigSquare will text leads (yes if the email + text service is real and the /apply/ phone field feeds a text flow)
- Retention periods Brad is comfortable stating
- Whether he wants arbitration in the terms (recommend: ask the lawyer)

## Build plan (one session, after the facts land)

1. `content/legal/privacy-policy.mdx` and `content/legal/terms.mdx`: frontmatter `title`, `effectiveDate`; body is H2 sections. Reuse the blog's MDX pipeline and `mdx-components.tsx` so headings, lists, and links match the site.
2. The two shell pages in `app/(marketing)/` render the MDX on the 65ch spine with a sticky "On this page" list of H2s at lg+, the effective date under the H1, and a "Questions? support@..." line at the bottom. `alternates.canonical` stays. Index them (legal pages are fine to index).
3. Footer: add the "Do not sell or share" link. Forms: the consent line + SMS checkbox where a phone field exists; `submitForm` records the consent text and timestamp.
4. Tag loader: honor Global Privacy Control before loading ad tags.
5. Counsel reviews the two MDX files; their edits go straight into the files.

## Sources used for this plan

- [Cybernews: US website privacy laws in 2026](https://cybernews.com/privacy-compliance-tools/us-privacy-laws/)
- [PrivacyLawMap: CCPA privacy policy requirements](https://privacylawmap.com/blog/ccpa-privacy-policy-requirements)
- [PrivacyLawMap: Colorado Privacy Act compliance guide](https://privacylawmap.com/blog/colorado-privacy-act-compliance-guide)
- [Termly: CCPA privacy policy](https://termly.io/resources/articles/ccpa-privacy-policy/)
- [Transcend: Florida Digital Bill of Rights](https://transcend.io/blog/florida-digital-bill-of-rights)
- [TermsFeed: GDPR requirements for US businesses](https://www.termsfeed.com/blog/us-business-gdpr-requirements/)
- [Google: policy requirements for GA Advertising Features](https://support.google.com/analytics/answer/2700409?hl=en)
- [Consentik: Google Ads privacy policy remarketing requirement](https://consentik.com/google-ads-privacy-policy/)
- [TermsFeed: privacy policy for Google Ads remarketing](https://www.termsfeed.com/blog/privacy-policy-google-ads-remarketing/)
- [Salesmsg: SMS marketing compliance guide 2026](https://www.salesmessage.com/blog/sms-marketing-compliance)
- [IgniteSMS: TCPA compliance guide](https://ignitesms.com/compliance-guide.html)
- [Fransis: SMS compliance, 10DLC, TCPA and consent](https://www.fransis.ai/articles/sms-compliance)
- [eCFR: 16 CFR Part 255, Endorsement Guides](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255)
- [DLA Piper: FTC changes to the endorsement guidelines](https://www.dlapiper.com/en-us/insights/publications/2023/07/federal-trade-commission-announces-changes-to-the-endorsement-guidelines)
- [Sprintlaw: marketing agency MSA key terms](https://www.sprintlaw.com/articles/marketing-agency-master-services-agreement-customer-terms-and-compliance-points-to-check/)
- [Golden Proportions: agency legal terms example](https://www.goldenproportions.com/legal/)
