# Reference: Youtech (youtechagency.com)

Captured 2026-08-21 with a headless Chrome pass at 1440x900 (desktop) and 390x844 (mobile). Zero WebGL on the page (canvasCount: 0), so stills represent the site accurately. The only motion on the live site is the success-stories carousel, the partner logo marquee, and simple fades.

Status: page architecture blueprint. This is the moodboard's Reference 1, previously covered only by two cropped screenshots (`youtech-nav-mega-menu.png`, `youtech-footer.png`). This scrape captures the full homepage flow. Youtech proves the right section order and conversion structure for a performance marketing agency. It does not set our visual bar: the build quality is WordPress-tier, and everything visual gets re-skinned into Graphite at Framer-showcase quality.

## Why this reference matters for BigSquare

BigSquare and Youtech sell the same thing: multi-channel performance marketing to businesses burned by bad agencies. Their homepage is a complete, proven conversion narrative: problem, positioning, proof, credibility stats, partners, services, case studies, transparency tooling, a 90-day onboarding timeline, closing CTA. We take that skeleton nearly whole. We do not take their skin (white + near-black + orange, Readex Pro/DM Sans, static WordPress sections).

## Screenshot index

| File | What it shows |
|---|---|
| `youtech-home-desktop-01-top.png` | Hero: full-bleed mosaic of client work under a heavy dark overlay, centered H1 "Meet Your Potential", one-line subhead, orange solid + white outline CTA pair. White nav: logo left, 4 items, Login, orange pill "Get Started". Persistent round black "WORK WITH US" badge bottom right |
| `youtech-home-desktop-02.png` | Problem card: bold claim left, 4 agency pain points with red x-circle icons. Then "That's Where We Come In": huge H2 + origin copy left, CTA pair right, 3 light cards with product-UI vignettes (calendar, tasks, analytics) + H3 + one-liner |
| `youtech-home-desktop-03.png` | Statement section: centered H2 "Search is splitting in two. We optimize for both.", stat-heavy body copy, mock AI chat input as illustration, single orange CTA |
| `youtech-home-desktop-04.png` | Testimonial pattern: client photo left, large quote as H3, name + company, "View Case Study" link, vertical hairline, one big metric (+14.38%) with small label right |
| `youtech-home-desktop-05.png` | Dark stats band: "Anti-Agency Business Model" H2 + support copy left, 2x2 metric grid (93%, 9x, 3, $10B) with descriptions, video player right. Below: light partner logo marquee "Some of our partners we work with" |
| `youtech-home-desktop-06.png` | Section header pattern: H2 + short body left, CTA pair right. 3-column card row: icon chip, H3, divider, gray body panel |
| `youtech-home-desktop-07.png` | "Eliminate the Black Box" + green check bullet row. 3 service pillar cards (Earned & Owned Media, Paid Media, Design) each holding a chevron link list of services |
| `youtech-home-desktop-08.png` | "Success Stories" horizontal carousel: full-bleed image cards with dark overlay, big metric + label top left, circle-arrow top right, client name + one-liner bottom |
| `youtech-home-desktop-09.png` | Dark Youlytics portal section: centered question H2, transparency copy, 5-column icon feature row, one orange CTA |
| `youtech-home-desktop-10.png` | Dark newsletter section: "Sleep Soundly Knowing You're in Good Company", email input + Subscribe, avatar cluster + "Join the 2,000+ clients", tilted photo with logo sticker and "SINCE 2012" tag |
| `youtech-home-desktop-11.png` | Second testimonial (same pattern, +149.55%). "Your First 90 Days with Youtech": intro + bolded "No long onboarding. No guesswork. Just results." + CTA pair, 3 timeline cards with day-range chips (Day 1-10, Day 11-30, Day 31-90) |
| `youtech-home-desktop-12.png` | Timeline card bodies: green check task lists per phase. "By day 90, you'll be wondering why you didn't hire us sooner." + 3 reassurance bullets |
| `youtech-home-desktop-13.png` | Closing CTA band: dark ground with thin blueprint grid lines, framed client-site screenshot with blue blur overlay, "Ready to Get Started?" + copy + CTA pair |
| `youtech-home-desktop-14.png` | Footer: 4 link columns (Company, Earned & Owned Media, Paid Media, Design & Development), then Socials / Locations / Contact Us rows, Google Partner Premier 2026 badge |
| `youtech-home-desktop-15.png` | Same footer with the client-website carousel strip visible above it |
| `youtech-home-mobile-*.png` | 390px flow: everything stacks to one column, CTAs go full width, hero collage persists, metric grids stack, service pillar cards become tall stacked lists |
| `youtech-home-extracted-data.json` | Fonts, colors, easings, headings with computed styles, full page copy, script list from the live DOM |

## Design tokens (pulled from their live CSS)

From `youtech-home-extracted-data.json`:

- Body: `DM Sans` 16px, color `#444` on `#fff`. Primary ink is `rgb(35, 40, 47)` (#23282F), a softer near-black than our `--ink #0B0F17`. Dark sections sit around `rgb(18-23, ...)` near-black, close to our `--darkpanel`.
- The orange accent is not in the extracted stylesheet colors (it ships via theme builder inline styles). Treat it as "one warm accent used for every primary CTA and the logo"; the structural lesson (single accent, used only for actions and the mark) matches our blue rule exactly.
- Fonts: display is **Readex Pro 600**, everything else **DM Sans 400/500/700**. The Lato, Montserrat, and Anton families in the dump are plugin leakage, a WordPress tell. Two working families total, same discipline we planned with Bluu Next + Apfel.
- Type scale: hero H1 and flagship H2s are 80px/88px with -1.6px tracking (tight, -2%). Section H2s 40px/56px. Metric headings are DM Sans 600 at 64px (stats grid) and 48px (testimonial metric). H3s run small: 16px card titles, 24px quote-as-headline. Our Bluu Next scale (H1 64, H2 44, metric 72) is already in this ballpark.
- Easings: workhorse is `cubic-bezier(0.4, 0, 0.2, 1)` (standard Material), plus expo-out `cubic-bezier(0.23, 1, 0.32, 1)` and one back/bounce `cubic-bezier(0.175, 0.885, 0.32, 1.275)`. Nothing distinctive worth stealing; Lusion's easing pair remains our source.
- Stack: WordPress (Fortuna theme) + jQuery + a very heavy tracker payload (GTM, Clarity, HubSpot, Klaviyo, LinkedIn, Meta, StackAdapt, TVSquared). This is the "WordPress feel" the moodboard says to skip, and a performance cautionary tale: we ship none of that weight.
- Zero canvases, zero WebGL. All credibility is carried by content structure, not spectacle.

## Patterns worth stealing (ranked for BigSquare)

1. **The full-page narrative arc.** Problem (agency pain points with x icons) > positioning ("That's Where We Come In") > differentiator trio > proof (testimonial + metric) > dark stats band > partner marquee > services > success stories > transparency/reporting > 90-day timeline > closing CTA band > deep footer. This is the skeleton for our homepage section specs. It sells rigor to skeptical buyers, exactly our audience.
2. **Two-CTA repeat pattern** (moodboard already names it). Primary solid + secondary outline, identical labels, repeated at hero, positioning, services, timeline, and CTA band. Consistent labels make the repeat feel like a system, not nagging. Ours: `--acc` pill + outlined `--ink` pill.
3. **Testimonial + metric lockup.** Photo left, quote set large as a headline, attribution, "View Case Study" text link, vertical hairline, then one oversized metric with a small label. Metrics-as-proof is the most BigSquare-compatible pattern on the page. Our metric sits in `--acc` per moodboard rule.
4. **90-day timeline cards.** Day-range chip, phase title, checklist of concrete deliverables, then a confident payoff line with 3 reassurance bullets ("You own everything", "Month-to-month"). Maps one-to-one to the 90-day timeline our moodboard requires.
5. **Dark stats band.** 2x2 grid of huge numbers with plain-language captions inside a `--darkpanel` section. Big-number count-up on entry is already in our motion spec.
6. **Success story cards.** Full-bleed client image, dark overlay, metric + one-word label top left, title + one-line outcome bottom. Metric-first, work-second. Good template for our case study cards; ours get the 16px radius, `--line` border, and calmer overlay.
7. **Problem framing with icon semantics.** Red x-circles for agency failures, green checks for the Youtech way, used consistently across sections. Cheap, scannable, honest. Ours in `--mid`/`--acc` rather than red/green traffic lights, or keep semantic colors only inside the comparison moment.
8. **CTA band with blueprint grid lines.** Thin rule lines dividing the dark ground behind the framed screenshot read technical and match our blueprint vibe. The framed-screenshot-in-a-band idea also echoes Lusion's framed-panel hero at smaller stakes.
9. **Footer architecture** (already a moodboard target, now captured in full context): 4 service-taxonomy columns, then Socials / Locations / Contact rows, one partner badge. Note their footer link columns mirror the services mega menu taxonomy exactly. Ours should mirror our services IA the same way.

## What we do NOT take

- The visual skin. White + orange + near-black, Readex Pro, DM Sans. Everything gets rebuilt in Graphite: `--paper` page, `--darkpanel` bands, blue `--acc` CTAs, Bluu Next display.
- The hero background collage. A mosaic of client sites under a 75%+ overlay is busy and reads WordPress. Moodboard already commits us to a single full-bleed video with a 55 to 65 percent `--darkpanel` overlay.
- The static, motionless build. Sections just sit there; only the carousels move. Our bar is scroll-triggered reveals, hover states on everything, expensive-and-calm motion.
- The floating circular "WORK WITH US" badge and the stacked accessibility/cookie widgets. They occlude content in nearly every frame and read as sticker clutter.
- Density hot spots: the 5-column icon row in the portal section, service cards holding 6+ link rows, three body paragraphs in one statement section. We cut copy and give everything more air.
- Their numbers and claims (93%, $10B, 2,000+ clients, Inc. 5000, Google Premier badge). Copy-rules: no invented statistics, no invented partner status. Only numbers from our spec files go on our site.
- The tracker payload and jQuery-era stack. Performance is part of the premium feel.
- The back/bounce easing in their CSS. No bounce anywhere, per our motion direction.

## Implementation notes for our stack

- Use this scrape as the section-order source when writing or revising `project-sections/home/*` specs; every major homepage section here has a counterpart in our planned IA (trust strip, services, case studies, timeline, CTA band, footer).
- Testimonial + metric lockup is a straight two-column grid with a 1px `--line` divider; metric gets the count-up entry and `--acc` color. No special tooling.
- Timeline cards: shadcn Card + chip, Framer Motion stagger on the checklist rows.
- Success stories: keep it a native-scroll snap carousel (scroll-snap-x), not a JS carousel; theirs loops with cloned DOM nodes.
- The mega menu and footer from the original two reference screenshots remain the target for nav/footer; this capture adds the surrounding context those crops lacked.
