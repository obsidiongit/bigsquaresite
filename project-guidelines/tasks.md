# Build Tasks

Working rules: one section or page per session. Hero first on any new page. Check mobile (375 / 768 / 1280 / 1536) before checking anything off. Follow STYLE_GUIDE.md and the section spec. Update these checkboxes as work completes.

This is a living list. Phases get added or reordered as the build teaches us things; add new phases at the bottom with a dated note.

## Phase 1: Project setup
- [ ] Scaffold Next.js (App Router, TypeScript) in this repo; verify `public/fonts/` woff2 files survive
- [ ] Install dependencies from PROJECT_REQUIREMENTS.md, nothing else
- [ ] `globals.css`: @font-face rules, palette variables (all four, Graphite default), `@theme inline` mapping, shadcn token bridge (all per STYLE_GUIDE.md)
- [ ] Root layout: font preloads, metadata defaults (title template, canonical, OG image), trailing-slash redirects
- [ ] shadcn init; confirm semantic tokens resolve to the palette
- [ ] `<Logo />` placeholder component (square outline in `--acc`, "logo" inside); never hard-coded elsewhere
- [ ] Tracking components (Meta Pixel, Google tag, GA4) reading NEXT_PUBLIC_* env vars, values empty, loaded after hydration
- [ ] Single form server action posting to FORM_WEBHOOK_URL with UTM params + page slug on every submission
- [ ] `sitemap.ts` and `robots.ts` (noindex rules for /go/, /apply/, /thanks/)
- [ ] Legal skeletons: /privacy-policy/ and /terms/ (heading, last-updated, section headings, `[PLACEHOLDER: legal copy]`)
- [ ] Stub routes for /schedule/ and /audit/ so every CTA resolves from day one (real pages in Phase 7)
- [ ] Organization JSON-LD sitewide

## Phase 2: Homepage (sections in spec order)
Overrides from decisions.md: 3 metrics (three-up), 3 case study cards + "See All Results", 2 testimonials. All values `[PLACEHOLDER]` until real numbers exist.
- [ ] 1. Nav (desktop mega menu + mobile Sheet, scroll behavior)
- [ ] 2. Hero (video component with swappable file, dark abstract placeholder loop, overlay, staggered headline)
- [ ] 3. Trust logo marquee (CSS animation, grayscale hover, reduced-motion grid)
- [ ] 4. Problem (two-column, four pain points)
- [ ] 5. Solution (headline block + three differentiator cards)
- [ ] 6. Services overview (three linked columns)
- [ ] 7. Proof numbers (dark band, 3 metrics, count-up, `metrics` array)
- [ ] 8. Case studies (3 cards at launch, grid supports 6, uses shared card)
- [ ] 9. Obsidion portal (blurred "Portal preview" frame + five feature blocks)
- [ ] 10. How it works (90-day timeline, line draw on scroll)
- [ ] 11. Testimonials (carousel, 2 at launch, uses shared card)
- [ ] 12. FAQ (accordion + FAQPage JSON-LD from one data array)
- [ ] 13. Final CTA band (build as the shared component)
- [ ] Footer (build as the shared component; homepage ships with it)
- [ ] Homepage metadata, OG image, Lighthouse pass (CWV green)

## Phase 3: Shared components (whatever Phase 2 did not already produce)
- [ ] CTA band: extract/finalize as shared, props per spec
- [ ] Footer: finalize (accordion columns on mobile, badge slot renders nothing until earned)
- [ ] Ad credit popup (Dialog, exit intent + mobile triggers, 14-day localStorage, route exclusions, POPUP_DEADLINE)
- [ ] Case study card (props per spec, count-up metric)
- [ ] Testimonial card (props per spec)
- [ ] Metric block (shared count-up number + label)

## Phase 4: Service, industry, and location pages
Create the spec from the template before building each page; order matches sitemap.md.
- [ ] Service page layout from `_service-page-template.md` (one component, per-page content)
- [ ] Organic Marketing: seo, generative-engine-optimization, social-media, content-marketing, email, obsidion-portal (richer layout per services-index note)
- [ ] Paid Advertising: paid-search, google-local-services-ads, paid-social, amazon-ads, creator-network
- [ ] Design & Development: web-design, branding, video-production, custom-development
- [ ] Service JSON-LD + internal links (2 industries + 1 case study per page)
- [ ] /industries/ index
- [ ] Industry pages: franchise (most complete page after homepage), home-services, legal, healthcare (1,500+ words each)
- [ ] /locations/ index
- [ ] /locations/denver/ and /locations/tampa/ (LocalBusiness JSON-LD, `[PLACEHOLDER]` office info)

## Phase 5: Funnels, lead magnets, booking
- [ ] Custom GHL booking component (styled placeholder first, API integration behind GHL_* env vars)
- [ ] VSL landing template (/go/[slug]/, no nav/footer, noindex, video events)
- [ ] Application funnel template (/apply/[slug]/, multi-step form, qualify events)
- [ ] Thank-you template (/thanks/[slug]/, calendar/download/contact variants)
- [ ] Lead magnet template (/resources/[slug]/) + /resources/ index
- [ ] Lead magnets 1 through 5 (specs in project-sections/lead-magnets/)

## Phase 6: Blog
- [ ] MDX pipeline (@next/mdx), /blog/ index, /blog/[slug]/ layout
- [ ] Article JSON-LD, BreadcrumbList, per-post OG
- [ ] Post template with internal-link rule (1 service + 1 industry link per post)
- [ ] 2 launch posts `[PLACEHOLDER: topics from keyword research]`

## Phase 7: Company and conversion pages (added 2026-08-20)
The original six phases did not cover these routes; specs now exist in project-sections/company/, /results/, /conversion/. Pull any of these forward if priorities shift; /schedule/ and /audit/ run on Phase 1 stubs until then.
- [ ] /schedule/ (real page on the booking component; primary conversion)
- [ ] /audit/ (real form page)
- [ ] /contact/
- [ ] /ad-credit/
- [ ] /about/
- [ ] /leadership/ (blocked until real people/photos provided)
- [ ] /careers/
- [ ] /results/ index
- [ ] Case study pages (blocked until real data; template ready)
