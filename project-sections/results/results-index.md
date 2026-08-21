# Results Index Page Specifications

## Page
- URL: /results/
- Title tag: Client Results & Case Studies | BigSquare
- Meta description: `[PLACEHOLDER]`

## Content
- Eyebrow "RESULTS", H1 "Real brands. Real numbers." (same pairing as home/8.case-studies.md, this is the page that section links to).
- Sub: one line on how we measure. Draft: "Every number here comes from a real account. Ask us about any of them on a call."
- Grid of case study cards (shared component, `../shared/case-study-card.md`). 3 at launch per decisions.md; grid supports 6+.
- Filters (post-launch, build the data model for it now): by industry and by brand type (franchisor, franchisee group, regional brand). Ignite structures case studies this exact way (cs-industry and cs-category taxonomies); plan for the same two filters. Plain grid at launch, no filter UI.
- CTA band (shared).

## Components to Use
- Same card and grid as the homepage section. One `caseStudies` data array feeds both, filtered to featured for home.

## Animations / Effects
- Cards fade-up with stagger, metric counts up on entry, card lifts on hover.

## Design Instructions
- `--paper` background, cards on `--surf`. Three-by-two grid desktop, single column mobile.
- Every card links to /results/[slug]/. No card ships without real data.
