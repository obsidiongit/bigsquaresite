# Lead magnet brainstorm v2 (2026-08-30)

v1 (static checklists and PDF templates) was rejected by Brad same day: "extremely weak and outdated... research current effective and sought after lead magnets before committing to any." This is the researched rewrite. Nothing here is committed; Brad picks.

## What the 2026 research says

- Interactive beats static, and it is not close. Interactive assessments and quizzes convert 35 to 50% of landing page visitors; AI-adaptive quizzes average 47%; classic ebooks sit at 15 to 20% and generic PDFs as low as 3%. Interactive tools beat static PDFs 2.4x on like-for-like offers, and interactive forms beat static forms up to 16x.
- The winning formats do the work FOR the visitor: a tool that analyzes their stuff and hands back a personalized answer. The 2026 breakout is the AI audit / grader: the visitor drops in a URL or an ad account number and gets scored findings back. Perceived value is huge and it pre-qualifies.
- Free audits with a human touch still convert best of all when the promise is specific: a documented "free 7-point SEO audit with 3 findings in 5 days" case ran a 23% landing page conversion, 18% of recipients booked a call, 38% of calls closed into $3K+/mo retainers.
- Calculators convert a bit lower than quizzes (20 to 30% vs ~40%) but the leads are higher intent: they self-qualify on money questions.
- 81% of B2B buyers say they prefer interactive content over static content.

Translation for BigSquare: no gated PDFs as the headline offers. Build tools. We have a Next.js site, a design team, and Claude; an in-page tool costs us a build session, not a product team. The one static format that still earns a slot is a swipe file of REAL work, because it shows the creative muscle.

## Candidates (pick 5)

Instant tools (answer on the page, email gates the full report):
1. **The BigSquare Marketing Grader.** Enter your website URL. We score the fundamentals we can read from the outside (site speed, mobile, title/meta basics, local listings presence, pixel + analytics detection, review count) into one 0 to 100 score with the 3 biggest leaks. Score shows instantly; the full scored report goes to their email. This is the HubSpot Website Grader play, and it is the single strongest fit for "we find what leaks money." Build: a server route + a few public APIs (PageSpeed) + Claude-written findings copy.
2. **The Growth Leak Quiz.** 12 adaptive questions (what you sell, locations, spend, tracking, follow-up speed...) that end in a named diagnosis ("Your leak is follow-up, not traffic") plus the 3 moves for that diagnosis. Quizzes are the top-converting format class (~40 to 47%). Build: one in-page component, no backend beyond submitForm.
3. **What Should You Pay Per Lead?** calculator. Industry, ticket size, close rate in; the max CPL you can afford, target CAC, and break-even ROAS out, against ranges by channel. High-intent money math. Build: in-page, one screen.
4. **The Ad Budget Splitter.** Monthly budget + goal in; a recommended split across search, social, LSAs, and retargeting with the reasoning, emailed as a one-pager. Directly sets up the "want us to run it?" call.

Human-touch offers (small real work, big conversion):
5. **The 5-Day Teardown.** We record a 5 to 7 minute video tearing down YOUR site and one competitor: what leaks, what we would fix first. Delivered in 5 days. Capped ("we do 10 per week") so it stays honest and scarce. This is the highest-closing format in the research and it shows the team on camera. Note: /audit/ already exists as a conversion page; this either replaces the audit's deliverable or the teardown becomes the /audit/ offer and does not sit on /resources/ twice.

Static, but earns it (proof of craft, not a homework packet):
6. **The Swipe File: ads and pages that printed money.** Real creative from real accounts (anonymized where needed), with one line each on why it worked. Updated quarterly so it stays a reason to be on the list. Gated, PDF or private page.
7. **The Benchmarks Sheet.** CPL, CTR, and conversion ranges by industry from real accounts we manage, updated twice a year. Blocked until we have enough account data we are allowed to aggregate; flag it as a later add. (Original-data magnets also earn links and AI-search citations, which feeds the SEO goal.)

Deliberately NOT on the list: generic checklists, "ultimate guides," ebooks, template docs (v1's list). The research puts all of them at the bottom of the conversion table, and none of them show creative leverage.

## A suggested 5

1. The BigSquare Marketing Grader (the flagship; give it its own nav-worthy page)
2. The Growth Leak Quiz
3. What Should You Pay Per Lead? calculator
4. The Swipe File (the creative proof + list-nurture engine)
5. The 5-Day Teardown (merged with or replacing the /audit/ deliverable; Brad's call)

## Build notes

- Tools live at `/resources/[slug]/` like everything else, but each one is a small interactive page, not the PDF template page. The lead-magnet page template from the Pane C handoff still applies for the gated static ones (#6, #7).
- Instant tools show the headline result BEFORE asking for the email; the email unlocks the full report. Gating the whole result tanks completion.
- Every submission carries UTMs + slug through `submitForm`, tags the contact by magnet, and lands in the CRM (never named publicly).
- The Grader needs a session of its own (API keys, scoring rubric, report email). The quiz and both calculators are each a one-session build. The swipe file needs Brad/Mike to pull the creative.
- SMS: these forms collect email only. No phone field, no SMS checkbox needed here.

## Sources

- [Shno: lead magnet conversion statistics 2026](https://www.shno.co/marketing-statistics/lead-magnet-conversion-statistics)
- [DigitalApplied: lead magnet conversion benchmarks 2026 (B2B)](https://www.digitalapplied.com/blog/lead-magnet-conversion-benchmarks-2026-b2b-data-reference)
- [Interact: quiz conversion rate report 2026](https://www.tryinteract.com/blog/quiz-conversion-rate-report/)
- [Outgrow: quiz vs calculator for lead generation](https://outgrow.co/blog/quiz-vs-calculator-lead-generation)
- [Outgrow: interactive forms, 16x higher conversions](https://outgrow.co/blog/interactive-forms-lead-generation-2025/)
- [ManyRequests: lead magnet ideas for agencies 2026 (AI audit trend)](https://www.manyrequests.com/blog/lead-magnet-ideas)
- [Exposure Ninja: lead magnet guide 2026](https://exposureninja.com/blog/what-are-lead-magnets/)
- [SearchLab: lead magnets for service businesses 2026 (audit + calculator case numbers)](https://searchlab.nl/en/guides/lead-magnets-service-business)
