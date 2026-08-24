# Project Requirements

## Overview
Marketing site for BigSquare Marketing, the growth partner for multi-location and franchise brands. A sales system, not a brochure: rank for franchise/multi-location searches, land paid traffic on focused pages, and book calls. Primary conversion: Schedule a Call (/schedule/). Full context in [project-brief.md](project-brief.md); overrides in [decisions.md](decisions.md); design system in [STYLE_GUIDE.md](STYLE_GUIDE.md) (do not duplicate it, follow it).

## Tech stack
| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) | Static generation for all marketing pages |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS v4 | CSS-first `@theme` in globals.css. **No tailwind.config.ts** |
| UI components | shadcn/ui | Via CLI; semantic tokens mapped to palette per STYLE_GUIDE.md |
| Motion | Framer Motion | All scroll/entry/hover motion |
| 3D (optional) | Three.js (@react-three/fiber) | Only where a spec asks; under 200KB; never hurts LCP |
| Blog | MDX in the repo | v1; no CMS |
| Hosting | Vercel | Canonical domain https://www.bigsquaremarketing.com |

## Dependencies
Do not install anything not listed here. To add one: list it here first with a one-line reason.

| Package | Reason |
|---|---|
| next, react, react-dom | Framework |
| typescript, @types/react, @types/react-dom, @types/node | Types (@types/react-dom added: required for react-dom types under strict TS) |
| tailwindcss, @tailwindcss/postcss | Tailwind v4 CSS-first |
| class-variance-authority, clsx, tailwind-merge | shadcn/ui component variants and class merging |
| radix-ui primitives (per component) | Installed automatically by the shadcn CLI as components are added |
| shadcn | Added by shadcn CLI v4 init; provides the shadcn/tailwind.css variants and keyframes its components rely on |
| tw-animate-css | Added by shadcn CLI v4 init; animation utilities used by shadcn components |
| lucide-react | Line icons (nav mega menu, pain points, feature blocks) |
| framer-motion | Section reveals, staggers, count-ups, hover motion |
| roughjs | Hand-drawn annotation system (bracket CTA, circled word, underlines), a STYLE_GUIDE.md signature move; ~9KB |
| @next/mdx, @mdx-js/loader, @mdx-js/react | MDX blog posts in the repo |
| zod | Validate the single form server action payload |
| three, @react-three/fiber (+ @types/three dev) | Hero v5 WebGL film sheet (2.hero.md); lazy-loaded, under 200KB gz, never LCP per STYLE_GUIDE 7.9 |
| @react-three/drei | Sanctioned but NOT installed; add only when a spec needs one of its helpers (keeps the 3D chunk lean) |
| lenis | Damped smooth scroll (Brad's call 2026-08-24, STYLE_GUIDE 7.1 revised): wheel eases the real scroll position so the hero scrub reads fluid; native touch/keyboard kept; off under reduced motion |

## Environment variables (from decisions.md)
| Var | Use |
|---|---|
| FORM_WEBHOOK_URL | Single server action posts every form here (GHL or Obsidion, decided later) |
| GHL_API_KEY, GHL_CALENDAR_ID, GHL_LOCATION_ID | Custom booking component (placeholder until integration is built) |
| NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_GTAG_ID, NEXT_PUBLIC_GA4_ID | Tracking components built now, values empty, filled by a teammate; load after hydration |
| POPUP_DEADLINE | Rolling deadline for the ad credit popup (single config value) |

All forms carry UTM parameters and the page slug as fields. One submit path for every form.

## Page index (routes from [sitemap.md](sitemap.md) → spec)
| Route(s) | Spec |
|---|---|
| `/` | [project-sections/home/](../project-sections/home/) 1.nav through 13.final-cta, in order |
| `/about/`, `/leadership/`, `/careers/` | [company/](../project-sections/company/) about.md, leadership.md, careers.md |
| `/results/`, `/results/[slug]/` | [results/results-index.md](../project-sections/results/results-index.md), [results/_case-study-template.md](../project-sections/results/_case-study-template.md) |
| `/contact/`, `/schedule/`, `/audit/`, `/ad-credit/` | [conversion/](../project-sections/conversion/) contact.md, schedule.md, audit.md, ad-credit.md |
| `/privacy-policy/`, `/terms/` | Skeletons only per [decisions.md](decisions.md) |
| `/services/*` (15 pages) | [services/_service-page-template.md](../project-sections/services/_service-page-template.md), index: [services-index.md](../project-sections/services/services-index.md) |
| `/industries/` | [industries/industries-index.md](../project-sections/industries/industries-index.md) |
| `/industries/{franchise,home-services,legal,healthcare}/` | [industries/_industry-page-template.md](../project-sections/industries/_industry-page-template.md) |
| `/locations/` | [locations/locations-index.md](../project-sections/locations/locations-index.md) |
| `/locations/denver/`, `/locations/tampa/` | [locations/denver.md](../project-sections/locations/denver.md), [locations/tampa.md](../project-sections/locations/tampa.md) |
| `/blog/`, `/blog/[slug]/` | MDX; SEO rules in [seo-requirements.md](seo-requirements.md) |
| `/resources/`, `/resources/[slug]/` (5) | [lead-magnets/_lead-magnet-template.md](../project-sections/lead-magnets/_lead-magnet-template.md) + specs 1 to 5 |
| `/go/[slug]/` (noindex) | [landing-pages/vsl-template.md](../project-sections/landing-pages/vsl-template.md) |
| `/apply/[slug]/` (noindex) | [landing-pages/application-funnel-template.md](../project-sections/landing-pages/application-funnel-template.md) |
| `/thanks/[slug]/` (noindex) | [conversion/_thanks-template.md](../project-sections/conversion/_thanks-template.md) |
| Shared: footer, CTA band, popup, cards | [project-sections/shared/](../project-sections/shared/) |

## Folder structure
```
app/
  layout.tsx            # fonts, tracking, popup, nav, footer
  globals.css           # palettes, @theme, @font-face (see STYLE_GUIDE.md)
  page.tsx              # homepage
  (marketing)/          # about, results, contact, services/, industries/, locations/, resources/
  blog/[slug]/
  go/[slug]/  apply/[slug]/  thanks/[slug]/   # noindex, no nav/footer
  sitemap.ts  robots.ts
components/
  ui/                   # shadcn (CLI-managed)
  shared/               # Logo, CTABand, AdCreditPopup, CaseStudyCard, TestimonialCard, Nav, Footer, BookingCalendar
  sections/home/        # one component per home section spec
  tracking/             # Meta Pixel, gtag, GA4 (env-driven, after hydration)
lib/                    # form action, webhook, utils, metrics/case-study data arrays
content/blog/           # MDX
public/fonts/           # extracted woff2 (already in place)
```

## Responsive requirements
- Mobile first; most paid traffic is mobile. Check 375 / 768 / 1280 / 1536 before any section is done.
- Breakpoints, spacing, and type scale per [STYLE_GUIDE.md](STYLE_GUIDE.md). No horizontal scroll at any width.
- Core Web Vitals green on every page (LCP < 2.5s, INP < 200ms, CLS < 0.1); `prefers-reduced-motion` respected.
- SEO per [seo-requirements.md](seo-requirements.md): one H1, unique titles/descriptions, canonical, OG image, JSON-LD, trailing slashes enforced.
