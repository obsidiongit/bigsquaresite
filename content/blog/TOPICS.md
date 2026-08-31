# Blog topic queue

The scheduled writer (`project-sections/blog/routine-prompt.md`) takes the FIRST open line under "Queue" and writes it. Brad or Mike keep this list topped up.

Reworked 2026-08-30 (Brad's call): working titles are now literal questions people ask, because answering the question directly is the stronger search play. Questions were collected from Reddit, Quora, and People-Also-Ask phrasings; only the question and the pain were taken, never quotes or usernames. Nothing scraped goes into a post.

One topic per line, 5 fields split by ` | `:

```
- The question, as people ask it? | keyword: the target keyword | source: where the question shows up | angle: the angle in ten words or fewer | link: /the/internal/page/
```

Rules:
- Mark a topic done by appending ` [done YYYY-MM-DD]` to its line. Never delete a line.
- `source:` is the demand evidence: a subreddit (r/smallbusiness), "PAA" (People-Also-Ask), "Quora", a named community, or "house" for topics we picked ourselves. A human can sanity-check demand against it before the post is written.
- Add new topics at the bottom. Keep the lanes mixed: ecommerce, software, home services, legal, healthcare, franchise, and general.
- The link is the ONE internal page the post must link to. The writer adds 1 or 2 more on its own.
- Working titles are starting points. The writer may sharpen them: under 60 characters, sentence case, no em dashes. Keep the question a question where natural.
- Posts publish to `content/blog/<slug>.mdx`. Frontmatter: title, description, date, author, tags, draft. Copy the shape from any existing post.

## Queue

- Should I hire a marketing agency or do it myself? | keyword: hire a marketing agency | source: PAA | angle: what an agency must beat, and a 5-check scorecard | link: /services/obsidion-portal/
- Why is my Google Ads cost per lead so high? | keyword: google ads cost per lead | source: Quora | angle: the 5 leaks in an ad account, checked in order | link: /services/paid-search/
- How much should a small business spend on marketing? | keyword: small business marketing budget | source: PAA | angle: budget from the numbers you have, not a percent rule | link: /services/paid-search/
- How long does SEO take to work? | keyword: how long does seo take | source: PAA | angle: a checkpoint schedule, so patience has a deadline | link: /services/seo/
- Is Google Guaranteed worth it for plumbers? | keyword: google guaranteed worth it | source: PAA | angle: the lead fee, disputes, and when the badge pays | link: /services/google-local-services-ads/
- When is it time to fire my marketing agency? | keyword: when to fire marketing agency | source: Quora | angle: signals from your own numbers, not their report | link: /services/obsidion-portal/
- Who should own our Google Business Profiles? | keyword: google business profile multiple locations | source: PAA | angle: ownership, access levels, and the cleanup order | link: /industries/franchise/
- Which email flows should my store set up first? | keyword: ecommerce email flows | source: Shopify Community | angle: welcome, cart, browse, and win-back, in that order | link: /services/email/
- How do I get ChatGPT to recommend my business? | keyword: get recommended by chatgpt | source: PAA | angle: what AI answers cite, and how to be that source | link: /services/generative-engine-optimization/
- Why is my website not generating leads? | keyword: website not generating leads | source: Quora | angle: 6 checks before you pay for a redesign | link: /services/web-design/
- Do Google Ads work for personal injury lawyers? | keyword: google ads for lawyers | source: PAA | angle: what a signed case costs when clicks run $100 plus | link: /services/paid-search/
- Are Angi leads worth it, or a waste of money? | keyword: angi leads worth it | source: Trustpilot contractor reviews | angle: shared leads vs owning your own pipeline | link: /industries/home-services/
- Can my practice run ads without violating HIPAA? | keyword: hipaa compliant marketing | source: PAA | angle: what to track, what to leave alone, in plain words | link: /industries/healthcare/
- Are Facebook ads still worth it for my store? | keyword: facebook ads for ecommerce | source: Shopify Community | angle: what changed since iOS 14, and what still works | link: /services/paid-social/
- Is SEO worth it for a small business? | keyword: is seo worth it | source: PAA | angle: when it pays, when it does not, with the math | link: /services/seo/
- What does our franchise marketing fund actually pay for? | keyword: franchise marketing fund | source: PAA | angle: split brand spend from local spend, report both | link: /industries/franchise/
- How much should a law firm spend on marketing? | keyword: law firm marketing budget | source: PAA | angle: budget per signed case, not per office tradition | link: /industries/legal/
- Should I sell on Amazon or my own website? | keyword: amazon vs own website | source: PAA | angle: margin, ownership, and repeat buyers decide it | link: /services/amazon-ads/
- Is social media actually worth it for my business? | keyword: social media marketing worth it | source: PAA | angle: what it can and cannot do, and how to tell | link: /services/social-media/
- Do Google reviews really bring in new patients? | keyword: google reviews for doctors | source: PAA | angle: reviews as ranking and trust, with a simple ask flow | link: /industries/healthcare/
- Can I run my own local ads as a franchisee? | keyword: franchisee local advertising | source: PAA | angle: brand rules, approvals, and what to run first | link: /industries/franchise/
- Why did our demo requests dry up? | keyword: b2b saas lead generation | source: SaaStr community | angle: buyers ask AI and peers first now; rebuild the sources | link: /services/content-marketing/
- What should a law firm's marketing report show? | keyword: law firm marketing report | source: house | angle: signed cases, not clicks, and how to track them | link: /industries/legal/
- Do influencer partnerships work for a local business? | keyword: creator marketing local business | source: house | angle: brief, rights, and measurement, with no vanity numbers | link: /services/creator-network/
- What video should a home services company make first? | keyword: home services video marketing | source: house | angle: 1 shoot, 3 uses: ads, site, and social | link: /services/video-production/

## Replaced 2026-08-30 (kept for the record; do not write these)

The original 12 statement-style topics were re-angled into the questions above when the queue pivoted to question-led titles. Their keywords and links carried over where they survived.

- Why your cost per lead keeps going up | now "Why is my Google Ads cost per lead so high?"
- Google Local Services Ads for home services: how the lead fee works | now "Is Google Guaranteed worth it for plumbers?"
- Ecommerce email that pays for itself: 4 flows to build first | now "Which email flows should my store set up first?"
- Amazon ads or your own store: where the next dollar should go | now "Should I sell on Amazon or my own website?"
- How a law firm should read its marketing report | now "What should a law firm's marketing report show?"
- What a clinic can measure without touching patient data | now "Can my practice run ads without violating HIPAA?"
- Franchise marketing funds: spend the national budget so local units feel it | now "What does our franchise marketing fund actually pay for?"
- 1 brand, 50 Google Business Profiles: who owns what | now "Who should own our Google Business Profiles?"
- How software companies get found when buyers ask ChatGPT first | now "How do I get ChatGPT to recommend my business?"
- Redesign the site, or fix what converts? | now "Why is my website not generating leads?"
- What a good creator partnership looks like for a local brand | now "Do influencer partnerships work for a local business?"
- Video that sells for home services: 3 cuts from 1 shoot day | now "What video should a home services company make first?"
