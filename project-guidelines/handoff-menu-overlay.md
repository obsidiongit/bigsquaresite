# Handoff: the open menu (fresh conversation, after 2026-08-30)

You own: the overlay half of `components/shared/Nav.tsx` (everything inside `Dialog.Portal`), the `.menu-mark*` block in `app/globals.css` plus any menu CSS you add, `project-guidelines/STYLE_GUIDE.md` 6.5 and a changelog entry. Do not touch the bar itself (logo, square Let's Talk button, square menu mark, sound bars): Brad approved it 2026-08-30.

Read first: CLAUDE.md, project-brief.md, copy-rules.md, STYLE_GUIDE.md (6.5 for the bar as built, 3.x for Lenia Mono and the O alternates, 7.11 for sound), decisions.md, the "2026-08-30 (nav rebuild + footer redo)" changelog entry.

## What Brad said

The bar is good. The menu that opens when you click the square is not:
- "The way the data is organized is not my favorite." (Today: five numbered index rows on the left, the active group's ruled link table on the right, group rows toggle, leaf rows navigate.)
- "The way it takes the whole frame is not my favorite either." (Today: a full-screen paper overlay.)
- "It still has these outdated grid lines and layout." (Today: `GridLines` hairline rails, the `[01]` mono brackets, the ruled mono table. That instrument-layer look was retired sitewide on 2026-08-25 and the menu never caught up.)
- "We moved in a different direction after we built that nav bar." The new direction is the square-button vocabulary, Lenia Mono everywhere, open layout, one big move per surface.

He wants to be prompted: talk back and forth, agree on a plan, then build. Do not build first.

## How to run the conversation

1. Open with two screenshots of the current open menu (1280 and 375; the scratchpad Playwright recipe from the visual-check memory, chrome channel, click `button:has(.menu-mark)`) and three or four short questions, one message, plain language, no internal jargon:
   - Shape: a panel that drops from the bar (leaves the page visible and dimmed below), a side drawer from the right, or a compact card anchored under the square?
   - Organization: services grouped by the three lanes (Organic / Paid / Design & Dev) as the main event with Company, Industries, Results, Contact as a quieter second tier; or the five top-level rows only, with services one tap deeper; or something else he has in mind?
   - Size: big display type (the current `text-menu` scale) or mid-size type with more of the site visible?
   - One playful move: the brand square doing something (a square that grows into the panel from the trigger, rows that slide in as squares, the filled-O alternates on the headings), or keep it dead simple?
2. From his answers, propose two or three directions as quick mockups he can look at (static screenshots of throwaway HTML in the scratchpad are fine; do not build in Nav.tsx yet). Ask which one, and what to change.
3. Write the plan as a short list (what the panel is, what it contains, what happens at 375, the motion in one sentence, what stays for keyboard users). Get a yes.
4. Build it. Then screenshots at 375 / 768 / 1280 / 1536, reduced motion, keyboard (Tab through, Escape closes, focus returns to the square), `npx tsc --noEmit`.

## Hard constraints that survive any direction

- The links stay the same set (GROUPS and ROWS in Nav.tsx match sitemap.md and `lib/footer-links.ts`). Reorganize freely, do not add or drop destinations.
- Keep Radix Dialog (focus trap, Escape, aria) and the Lenis stop/start on open/close. A non-full-screen panel still needs an overlay/backdrop so the page behind is inert.
- The square-to-X close mark stays (it is the bar's signature). If the panel no longer mirrors the bar, the X must still sit exactly where the square was.
- No `GridLines`, no `[01]` brackets, no mono ruled tables unless Brad asks for them back.
- Lenia Mono only; Casual Human at most one word. No em dashes. Approved button labels only (Schedule a Call in the panel foot; "Let's Talk" is Brad's bar label and stays pending on the approved list).
- Hover pops opt-in via `data-sfx` on rows that earn it; `sfx.duckMusic` hook can wait until the music loop lands.
- Reduced motion: the panel appears settled, no slide choreography.
- 375: whatever the desktop shape is, the phone version is probably full-height; confirm with Brad rather than assuming.

Wrap up with before/after screenshots at 1280 and 375 and a short plain list of what changed. Commit only Nav.tsx, globals.css (menu block), STYLE_GUIDE.md; another pane may have tasks.md staged, so commit via a temporary index if `git status` shows staged work that is not yours.
