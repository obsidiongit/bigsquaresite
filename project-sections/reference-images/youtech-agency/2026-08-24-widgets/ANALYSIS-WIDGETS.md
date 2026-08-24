# Youtech widget probe (2026-08-24)

Targeted follow-up to the 2026-08-21 full-page scrape. Probed the three "That's Where We Come In" card visuals and the "Search is splitting in two" mockup with Playwright (chrome channel), dumped card markup + computed animation styles, and pulled the source media.

## Headline finding: they are all videos

Every "animated widget" on Youtech's homepage is a looping MP4 in a WPBakery raw-HTML block (`<video loop autoplay muted playsinline>`). Zero CSS animation, zero JS. Files (downloaded here as timing references, filmstrips extracted with ffmpeg):

| Card | File | Loop length |
|---|---|---|
| No Long Term Contracts | `Calendar-Week.mp4` | 3.05s |
| Transparency | `Task-List.mp4` | 3.25s |
| Full Approach | `All-Channels.mp4` | 3.30s |
| Search section mockup | `claude-1.mp4` | 6.67s |

Implication for BigSquare: rebuilding these as real HTML/CSS loops is a strict upgrade. Crisp at any DPI, theme-aware (our tokens, light/dark grounds), a few KB instead of 160-500KB of video each, and pausable/reduced-motion-safe.

## Measured loop choreography (from filmstrips)

**Calendar-Week** (3.05s, 3 beats of ~1s):
- Card: month header ("January 2025") between chevron buttons, hairline, then a 5-cell week strip (Fri 1, Sat 2, Sun 3, Mon 4, Tue 5) with day-name above day-number, plus outer chevrons.
- Beat 1: January, "Sun 3" cell solid accent with white text. Beat 2: February, highlight moves to "Mon 4". Beat 3: March, highlight moves to "Fri 1". Cross-fade between beats ~250-300ms (whole strip fades, not a slide). Loops back to January.
- Day numbers stay 1-5 every month. The paging chevrons never visibly depress; the month label just swaps.

**Task-List** (3.25s, sequential check-off):
- Card: "Tasks" title row with glyph, hairline, two task rows. Each row: radio circle, bold title, gray subtitle, tag chip (blue "Creative" / red "High Priority"), calendar-glyph date ("Jul 29"/"Jul 28").
- 0-1s: both unchecked. ~1.0s: row 2's circle fills as a green check, title + subtitle get strikethrough and dim to ~40%, chip fades, over ~300ms. ~2.0s: row 1 checks the same way. Quick fade-reset, loop.
- Their content uses a fake person name ("Eric") and fake dates. Ours must not (copy rules): generic task titles, no names, dates as blurred value-bars or generic weekday labels.

**All-Channels** (3.30s, grow-and-hold):
- Card: title row ("All Channels" + chart glyph), hairline, 3 labeled rows (Google, CallRail, Social), x-axis ticks 0/2k/4k/6k/8k/10k with faint vertical gridlines.
- 0-0.5s: axes only. ~0.5s: bars grow left-to-right with ease-out over ~600ms, slight stagger (~100ms), to different widths (top bar longest). Hold ~2s fully grown. Reset, loop.
- Their bars are orange/blue/green with platform names and axis numbers. Ours: token colors only, generic channel labels ("Paid Search", "Calls", "Social"), unlabeled tick marks (no fake numbers).

**claude-1** (6.67s, zoom + type):
- 0-1s: full Claude composer at rest: placeholder "How can I help you today?", plus button, model picker ("Opus 4.8 · High"), mic + waveform icons, suggestion chips below (Write, Learn, Code, Life stuff, Claude's choice).
- ~1-1.5s: camera zooms into the input's top-left; placeholder fades; caret appears.
- ~1.5-5.5s: types "who is the best roofer for storm damage in tampa?" at roughly 45-60ms/char; the send arrow activates (accent fill) once text exists.
- ~5.5-6.7s: hold on the finished query, then loop.
- One query per loop. Our build cycles 3-4 queries per Brad's direction ("continues to search for different things") via a JS typewriter instead of a zoom reset.

## Files in this folder

- `card-*.html` — outerHTML of the three cards (WPBakery markup)
- `search-section.html`, `search-section-media.json` — the search section row
- `card-*-t*.png`, `search-section-t*.png` — element screenshots at staggered times
- `*-filmstrip.png` — ffmpeg frame grids (4fps cards, 3fps claude)
- `*.mp4` — the source videos (reference only, never shipped)
- `probe-report.json` — computed animation/transition dump (confirms: none)
