# Reference: Paper (paper.design) — TARGETED

Captured 2026-08-25 with headed Chrome at 1440x900, 13 desktop frames plus the token dump. Added mid-Phase-2 at Brad's request, not part of the original 9-site set: this is a **single-purpose reference** pulled for the Obsidion portal section (`../../home/9.portal.md`), specifically for how they present a product UI as an object on the page.

Read it as "how to show software," not as a whole-site direction. Their type, their ground, and their brand personality are not ours.

## Screenshot index

| File | What it shows |
|---|---|
| `paper-home-desktop-01-top.png` | Hero: two-tone display headline (line 1 ink, lines 2-3 mid gray), support at mid, dark pill + naked arrow link, and the app window rising into the fold bottom with a second smaller terminal window overlapping it |
| `paper-home-desktop-02.png` | Logo row ("used in production by designers at") over the ground, then the next centered two-tone headline. Note the artboard construction lines: faint dashed guides, a diagonal fold, a ruler tick strip down the right |
| `paper-home-desktop-03.png` to `-05.png` | The window in its normal state: tab strip, sidebar tree, tool rail, canvas with a depicted app inside it |
| `paper-home-desktop-04.png` | **The frame Brad screenshotted.** Centered copy inside a soft arc, hollow-square selection handles on the artboard's bottom corners, then the window entering below with the terminal window overlapping its lower left |
| `paper-home-desktop-06.png` | **The most useful frame for us.** Same window rendered as a STRUCTURAL PLACEHOLDER: repeated "Album name" rows and "0:00" values. Proof that a UI can read as a real product with zero real data in it |
| `paper-home-desktop-07.png` to `-10.png` | Window with device artboards inside it, app dock strip, the second window's terminal log scrolling its own content |
| `paper-home-desktop-11.png` to `-13.png` | Lower page: pricing and closing |
| `paper-home-extracted-data.json` | Fonts (Matter, Paper Mono, Inter), the ground ramp (`#f5f5f2` paper, `#eaeae7`, `#fcfcf9`), their blue ramp (`#4c8eef` to `#81adec`), eases (`cubic-bezier(.16,1,.3,1)`, the same house curve we already run) |

## What we take (ranked)

1. **The window as a bounded object on a quiet ground.** The product is not a screenshot pasted into a card and it is not full bleed. It is a complete piece of chrome (top bar, tab strip, sidebar, content) with a hairline border, a soft resting shadow, and a large radius, floating on an off-white ground with generous margins. This is the same instinct as our `FramedMediaPanel` (STYLE_GUIDE 8.3), applied to software instead of film.
2. **Structural placeholder data, not fake data** (`-06.png`). Repeated neutral labels and zeroed values. The UI reads complete, claims nothing, and swaps to real content without a layout change. This settles the decisions.md tension for our portal preview: we can build a full, convincing UI and still keep every claim honest.
3. **A second, smaller window overlapping the first.** Depth from one extra object, and it tells a second story (their terminal, our alerts or call log). Cheap and effective. Watch the crop: theirs runs off the frame edge on purpose.
4. **Selection handles as the framing device.** Small hollow squares at the corners of the artboard region. Functionally identical to our `RegistrationMarks` "+" marks, so we get this move for free in our own vocabulary. Do not adopt their square handle glyph; ours is the plus.
5. **Two-tone centered display headline.** Statement line in full ink, continuation lines at mid gray, both at the same size. A quiet way to give a long headline a hierarchy without a size change. Cheap to steal for the portal H2.
6. **Generous vertical air around the window.** The copy block ends, then a large gap, then the window. The gap is what makes the window read as an exhibit rather than an illustration.

## What we do NOT take

- **Their ground and personality.** Warm paper `#f5f5f2` with a visible paper texture, a fold gradient, a diagonal crease, and a ruler tick strip. That is a design-tool brand doing design-tool cosplay. Our tint ground stays flat.
- **macOS traffic lights.** Three colored dots is a desktop-app signal. Obsidion is a web portal that a client logs into. Our window chrome should read browser or app shell, not Mac desktop, or it becomes a lie about the product.
- **Full mock realism.** Their canvas shows a fully art-directed fake app with photography. Ours stops at structure per the decisions.md placeholder rule.
- **The window cropped by the fold.** Their window bleeds off the bottom of every frame. Ours has a feature row and a CTA underneath it, so a cropped window would read as broken, not as continued.
- **Inter and their type ramp.** We have our own faces.
- **The arc.** The soft dome behind their copy is their artboard motif. We have no arc anywhere in the system and one section is not the place to introduce it.

## Notes for the build

- Their window sits at roughly 70 percent of viewport width with the copy centered above it, which maps cleanly to our `EDGE` width with the window inset a little further.
- Their radius on the window is large (visually ~14 to 16px at 1440) with a 1px hairline and a very soft, wide shadow. Ours goes to `--radius-media` (24) to stay in our own scale, with the STYLE_GUIDE 6.11 resting shadow.
- Their inner UI elements sit at radius 8, which matches the 6.11 widget-card rule we already wrote for the solution vignettes. Same ladder, no new tokens needed.
- Their house ease is `cubic-bezier(.16,1,.3,1)`. Ours is `cubic-bezier(.22,1,.36,1)`. Close enough that nothing needs to change.
