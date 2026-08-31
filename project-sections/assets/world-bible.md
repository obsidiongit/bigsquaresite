# The BigSquare World Bible (draft 1, 2026-08-31; Brad reviews before volume production)

The blueprint every Lane-2 generation points back at, so 30 assets read as one world instead of 30 one-off generations. Brad's bar: "creating our own world," cohesive, fun, never reading as fake imagery. STYLE_GUIDE DNA translated to photography: a measured, engineered light world that someone has marked up in blue.

## The premise

BigSquare's world is the real world, art-directed. Every scene is ordinary working America (storefronts, vans, shops, studios, desks) that the brand has visibly touched: **the blue square exists as a physical object in every frame.** A painted square on a van panel. A square blade sign over a door. Blue tape squares on a planning wall. A blue cube on a desk. That one recurring object is the signature; it does the work a logo would do, without faking a brand lockup.

These are deliberately composed brand photographs, the kind a premium campaign shoots. They are NOT pretending to be candid phone photos, real client sites, or our real offices. Composed = honest here; candid-fake = slop.

## Hard rules (from asset-fill-plan.md, they bite)

1. **No readable text anywhere in a generation.** No signage words, no license plates, no posters with copy, no invented company names. The blue square is the only mark. (Manifest rule: no text baked into images; also kills the classic AI gibberish-text tell.)
2. **Screens are off, dim, or show only the blue square.** Never generate UI on a screen in a photo: generated dashboards read as fake product. Real portal exports or Lane-1 renders are the only UI we show, and they ship as their own assets.
3. **No people in v1.** Faces wait for the team-composite lane (real headshot references + Brad's consent confirmation). Hands/backs-of-heads at distance are fine when a scene truly needs a human trace.
4. **Never pose as**: a real client's business, real results, a real office (those four slots are REAL-ONLY), or a real photo of the team.
5. One blue only: `#0657F9` family. If a generation drifts teal or navy-neon, it is out.

## Palette

- Ground world: paper whites `#F5F6F8`, soft greys `#E9ECF1`, graphite ink `#0B0F17`, warm pale wood, matte concrete, brushed steel.
- The accent: brand blue `#0657F9` on exactly one to three physical objects per scene. It should feel painted-on, matte sign enamel or vinyl wrap, never glowing, never a lighting gel.
- Everything else stays muted and slightly desaturated so the blue carries the frame. No second accent color, ever. No sunset oranges, no neon, no gradient skies.

## Light and lens

- Light: soft, even, high-key daylight. Overcast or north-light studio quality. Shadows soft and open. No golden hour, no dramatic rim light, no HDR crunch, no lens flare.
- Lens: architectural and editorial. 35-50mm full-frame look, eye-level or straight-on elevation, verticals kept vertical. Generous negative space (airy is a brand keyword); subjects sit in the frame like objects on a page. Depth of field moderate: context stays legible, no swimming bokeh.
- Composition: frontal, measured, a little deadpan (the Wes-Anderson-adjacent elevation, restrained). Square subjects love square framing; leave crop room for each slot's aspect.

## Finish and grain

- Matte, film-like finish with fine visible grain (35mm feel). Slightly lifted blacks, no crushed contrast, no plastic smoothness, no beauty-retouch sheen.
- Target: looks printed, not rendered. If a frame looks like a 3D render or a stock composite, it is out.

## The world's places and props (what exists in it)

- **The shopfront row**: clean single-story storefronts, one unit marked by the blue square blade sign. For franchise/multi-location scenes: the SAME unit repeated down the row, each with its square. Repetition is the multi-location story told visually.
- **The van**: a white or graphite work van, one bold matte-blue square panel on the side. No lettering.
- **The workroom**: pale studio walls, big table, planning wall with blue tape squares and pinned blank cards, anglepoise lamps, a monitor showing only the blue square.
- **The set**: photo/video gear around a seamless paper backdrop, a blue apple box or cube in the middle.
- **The desk**: graphite desk, off screen, blue square object (cube paperweight), printed sheets with hairline grids (no readable words).
- **The door**: a customer's front door, morning light, a blue square door hanger or sample case waiting (home-services energy without a fake technician).

Grow this list as slots demand new places; every new place gets a line here first.

## Prompt kit (assemble per slot: BASE + PLACE + slot subject + NEGATIVE)

**BASE (every generation):**
> Editorial brand photograph, measured and airy composition, soft even overcast daylight, 35mm film grain, matte finish, slightly desaturated muted palette of paper white, soft grey, graphite and pale wood, with exactly one matte cobalt-blue painted square object (#0657F9) as the only color accent, straight-on architectural framing, generous negative space, premium campaign photography, no people

**NEGATIVE (every generation):**
> no text, no letters, no words, no logos, no watermarks, no readable signage, no faces, no UI on screens, no HDR, no lens flare, no golden hour, no neon, no gradients, no oversaturation, no glossy 3D render look, no stock photo feel, no bokeh portrait

**Reference images (attach both to every run):**
1. The brand mark (`app/icon.svg`, exported to PNG in `assets/generated/_world-refs/`) so the square's proportion and blue stay exact.
2. The current approved seed set in `assets/generated/_world-refs/` (starts empty; the first Brad-approved generation from each place becomes its seed, and later runs for that place attach it for image-to-image consistency).

## Output spec

Generate oversize and crop to the slot's aspect (manifest column). Landscape sources at 2x display: bands ~3360x1440 (21:9), heroes 4:3 at ~2000x1500, cards 3:2 at ~1800x1200, squares ~1600x1600. Deliver WebP into `assets/generated/<slot-id>/gen-v<N>.webp` with the exact prompt in `notes.md`.

## Later: the team composite lane (BLOCKED on consent)

Real headshots exist in `assets/team/`. Once Brad confirms the team is OK with stylized likenesses, composites use those as character references inside this same world (same light, grain, palette), styled clearly as brand art, never as fake candids. Rules TBD in draft 2 with Brad's notes.
