# /about/ Design Brief (v2, 2026-08-27: the design-brief pass)

v1 was the Phase 1 spec; the section order survives. This v2 grounds it in the built system: open layout (4.5), the ~65ch spine for long-form, MediaSlot for every media moment, theme rhythm with one dark band, CtaBand close. The about page is a TRUST page: its job is to make the claims on the conversion pages believable.

## Page
- URL: /about/
- Title: "About BigSquare Marketing" (absolute, no template suffix)
- Meta description: real draft, Brad's sweep covers it

## Posture
- Open layout at EDGE, calm page, no video, no pinned runways, no canvas.
- Theme rhythm: light hero, light story, tint how-we-work, light what-we-are-not, DARK proof band, light offices + team, accent CtaBand, dark footer.
- Annotation budget: 3 of 3 (H1 circle on "growth", spine underline in what-we-are-not, CtaBand bracket).
- No registration marks anywhere (Brad's standing rule for new pages): every MediaSlot takes marks={false}.

## Section order
1. **Hero** (short, no media): SeparatorIn + eyebrow "Who we are". H1 "The growth partner for multi-location brands" (circle on "growth"). Answer paragraph built from project-brief.md's positioning line, widened per the audience rule (single locations and ecommerce serve too; positioning amendment still Brad's call, so the widening rides the body copy, not the H1). CTAs: Schedule a Call pill + Get a Free Audit secondary.
2. **Story** (65ch spine): eyebrow "The story". Body is `[PLACEHOLDER: founding story, 2 to 3 short paragraphs from Brad]` rendered as the honest mono placeholder block; alongside it one MediaSlot (`about-founders`, 4:3): the founders or the first office, real photo only.
3. **How we work** (tint, three cards on paper): the locked v1 copy. Proof before promises / One team, every channel / Premium work, in house. Each card: mono index, Apfel 700 head, body line.
4. **What we are not** (light, 65ch spine): short declaration + the three nots from project-brief.md as x-marked ruled rows (the ProblemStrip x-glyph grammar: --sec-mid, never red). Underline annotation on the payoff line.
5. **Proof numbers** (dark band): the homepage metrics array (lib/metrics.ts, same launch gate; values are stand-ins until sourced) on borderless MetricBlocks. Eyebrow "The numbers".
6. **Offices**: shared OfficeCards (same two cards as /contact/, linking to /locations/ pages; addresses stay placeholder).
7. **Team**: one wide MediaSlot (`about-team`, ~21:9): the real team, one frame. `[PLACEHOLDER: real photos only, no stock]` rides the slot note. No grid until real photos exist.
8. **CtaBand** (shared, default copy), flush above the dark footer.

## JSON-LD
BreadcrumbList (Home > About). Organization is sitewide.

## Asset slots (add to asset-manifest.md)
- `about-founders`: story section, 4:3, founders or first office.
- `about-team`: team band, ~21:9 (16:9 mobile crop safe), the whole team, real photo.
