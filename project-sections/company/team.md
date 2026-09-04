# Team Page Specifications (replaces leadership.md, archived 2026-08-31)

Brad, 2026-08-31: the leadership page was "super small and super lightweight" and he does not like the term leadership. This is a TEAM page: a larger roster with profile popups, "early MySpace vibe, Tumblr-era", fun on purpose, because people land here to see who we are. Roster seeding per Brad's pick the same day: the 6 registered members plus extra open slots.

## Page

- URL: /team/ (the /leadership/ route is deleted; it never shipped publicly)
- Title tag: Meet the Team | BigSquare
- Noindex and out of sitemap.xml until profiles are real (photos + answers). Flip `robots` in `app/(marketing)/team/page.tsx` and add the route to `app/sitemap.ts` together.

## Anatomy (built 2026-08-31)

1. Hero: eyebrow "THE TEAM", H1 "The humans behind the numbers" ("humans" in the Casual Human accent with the scribble underline; the page's 1 annotation).
2. The wall: `TeamGrid` (components/sections/team/), 2-up phone / 3-up sm / 4-up lg. Member cards carry the headshot (shared slot with the blog author card), name, role, and the brand-square open affordance; a light sticker tilt squares up on hover; photos run grayscale-to-color on hover once real (the marquee rule). Open slots render as designed placeholders. The last card is the careers ask ("This could be you.") on the accent ground.
3. The profile window: clicking a card grows the card's rect into a token-native window (the 6.5 slab move on the 6.12 exhibit window). Chrome bar with the brand square + mono counter + Close; inside: the headshot, the first-name signature in Casual Human, About / Into / On rotation sections, optional LinkedIn, and a 3-photo personal strip. Reduced motion: no travel, window is simply there.
4. CtaBand (shared).

## Data

Everything renders from `lib/team.ts`. A new member is one `member(...)` call; an open slot becomes a member by replacing it. Headshot slots are the `blog-author-*` ids (one photo drop lights the blog byline and the team card). Personal photo slots: `team-<first>-1..3`.

## The questionnaire (what each team member fills in)

Send this to each person; their answers drop into their `lib/team.ts` entry verbatim (light copy edit for reading level is fine; no em dashes). Real answers only, nothing invented on their behalf.

1. **About you**, 2 to 4 sentences, first person, plain words. What you do at BigSquare and what you are about outside it.
2. **Into**: 3 to 6 short things you like (2 or 3 words each). Hobbies, teams, foods, games, whatever is true.
3. **On rotation**: one song, show, or podcast you have on repeat right now.
4. **Photos**: 3 personal photos (square crops work best). You in the wild, not stock, nothing you would not want a client to see.
5. **LinkedIn** (optional): your profile URL, or skip it.
6. A **headshot** if Brad does not already have one in `assets/team/`.

## Content owed

- `[PLACEHOLDER]` questionnaire answers for: Brad, Chaley, Levi, Russel. Mike DONE 2026-09-04 (about, into, rotation; personal photos still owed). Sadie Pursell left the team (removed 2026-09-04).
- Headshots (the same `assets/team/` drop the blog authors need)
- Names + roles for the open slots (the rest of the team)
