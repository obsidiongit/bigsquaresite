# SEO Requirements

The site has to rank for franchise marketing and multi-location marketing searches. Scorpion and Ignite both outrank us today because they have dedicated URLs for every industry and service and they publish constantly. We match the structure first, then beat them on quality.

## Technical (built into the framework)
- Next.js App Router, static generation for every marketing page.
- One H1 per page. H2 and H3 follow a logical outline.
- Unique title tag (under 60 characters) and meta description (under 155 characters) on every page. Defined per page in `sitemap.md`.
- Canonical URL on every page.
- Open Graph and Twitter card image per page. Brand default, page-specific for case studies and lead magnets.
- `sitemap.xml` and `robots.txt` generated at build.
- Clean URLs, lowercase, hyphens, trailing slash policy picked once and enforced with redirects.
- Images: Next Image, WebP or AVIF, descriptive alt text on every image, lazy loaded below the fold.
- Hero video: poster image, muted, autoplay, `playsinline`, loaded after first paint, static fallback on slow connections.
- Core Web Vitals: LCP under 2.5s, INP under 200ms, CLS under 0.1. Measure on every deploy.
- Fonts self-hosted (Bluu Next and Apfel Grotezk are OFL), preloaded, `font-display: swap`.

## Structured data (JSON-LD)
- Organization on every page (name, logo, offices, phone, social links).
- LocalBusiness on each location page.
- Service on each service page.
- FAQPage on any page with an FAQ block.
- Article on every blog post.
- BreadcrumbList on all interior pages.

## Page families that matter most for rankings
1. Industry pages: `/industries/franchise/`, `/industries/home-services/`, `/industries/legal/`, `/industries/healthcare/`. Long form, 1,500 words or more, one clear primary keyword each.
2. Service pages: one per service in `sitemap.md`. 800 words or more.
3. Location pages: `/locations/denver/` and `/locations/tampa/`. Real office info, local proof, local schema.
4. Blog: MDX in the repo. Target 2 posts per week once live. Topic clusters around franchise marketing, multi-location ads, and local lead generation.
5. Case studies: one URL each. Title pattern "[Result] for [Client type]."

## Keyword direction (starting point, confirm with a keyword tool before writing)
- franchise marketing agency
- multi-location marketing agency
- franchise digital marketing
- multi-location SEO
- franchise lead generation
- [industry] marketing agency, one per top industry
- marketing agency Denver, marketing agency Tampa

`[PLACEHOLDER: pull real volume and difficulty from Ahrefs before finalizing title tags]`

## Internal linking
- Every service page links to at least 2 industry pages and 1 case study.
- Every industry page links to the 3 or 4 most relevant service pages and 1 case study.
- Every blog post links to 1 service page and 1 industry page.
- Footer carries the full service and industry list on every page.

## Generative engine visibility
- A clear, quotable answer block near the top of service and industry pages (2 to 3 sentences that directly answer "what is X" or "how does X work").
- FAQ blocks with real questions phrased the way a buyer types them.
- Consistent brand name, offices, and phone everywhere so the entity is easy to resolve.
