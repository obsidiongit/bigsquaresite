# Handoff: lead funnel, GHL, tracking (2026-10-09)

Session with Mike (Claude Code). Picks up where this left off: the pick-a-time booking step.

**Read these first, in order:**
1. This file (state + next steps)
2. `project-guidelines/ghl-lead-system.md`: the as-built manual (IDs, fields, tags, workflows, env vars, recipes, troubleshooting)
3. `project-sections/conversion/lead-funnel.md`: the plan and roadmap (sections 5 and 7 cover what's next)

---

## 1. What shipped today (all on `main`, live on bigsquaremarketing.com)

| Commit | What |
|---|---|
| `5761ad8` | Launch fix: interior pages no longer show `[PLACEHOLDER]` text (footer phone/socials, office cards, About story + stand-in stats, careers/audit/schedule/blog/resources notes, funnel copy, team questionnaire fields, media slot notes outside `next dev`). Homepage and `/results/` deliberately untouched |
| `42ff2c5` | Lead capture + tracking: attribution (first/last touch, click IDs), event ids, GA4 + Meta events on every form, honeypot + fill-time spam check, GHL API write with webhook fallback, Meta Conversions API, stepped-form double-Enter guard |
| `fc4ade9` | Click-ID custom fields renamed (`click_*`, `meta_fbc/fbp`): GHL reserves "GCLID" |
| `83d4ca3` | Repeat leads re-trigger workflows (tag reset before add) |
| `523d68e` | `ghl-lead-system.md` manual, `scripts/ghl-check-contact.mjs`, CLAUDE.md pointer |
| `bd9624e` `d161af9` `c637373` | Docs: booking calendar plan, built, 2 h notice |

Verified in production: Meta pixel 1382759246938072 loads and fires PageView; honeypot and attribution
present on live forms. Verified locally against real GHL: contact, 34 custom fields, tags, note,
Website Leads opportunity, W1 alert executed.

## 2. What exists in GHL now (BigSquare Marketing, location `7VBUf1asBTeGlv6V2vtf`)

- **34 contact custom fields** (folder-less; keys in `lib/ghl-lead.ts`)
- **Pipeline "Website Leads"** `FdeqZD1RbsHH8Ku4Z27i`: New Lead > Contacted > Call Booked > Showed > Proposal Sent > Nurture
- **W1 Website lead alert (team@)** `6c2c5907-…` published: tag `website-lead` → email team@
- **Website form inbound** `a45f495f-…` published: webhook fallback only; tags `website-lead-webhook` (never `website-lead`)
- **Calendar "Strategy Call (website)"** `K0Isp8DY5GPqcYqK1uia`: collective, Levi Holley (primary) + "BigSquare Support" support@bigsquaremarketing.com (Brad's login here), 30 min, weekdays 9 to 7 Mountain (stored as 11 to 21 Eastern), 14 days ahead, 2 h notice, Google Meet
- **Users:** Levi Holley (levi@bigsquaremarketing.com), BigSquare Support (support@, Brad). Location timezone America/New_York
- **Deleted:** the 5 empty snapshot calendars (one was a live gym-snapshot booking page)
- **Test contact:** `qa+test@bigsquaremarketing.com` (tag `test`); read it with `node scripts/ghl-check-contact.mjs qa+test@bigsquaremarketing.com`

Vercel env (Production): `GHL_API_KEY`, `GHL_LOCATION_ID`, `GHL_CALENDAR_ID`, `FORM_WEBHOOK_URL`,
`NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_TOKEN`, `NEXT_PUBLIC_GA4_ID`. Preview lacks the GHL key and
CAPI token on purpose (previews use the webhook fallback). `.env.local` has the GHL key, location,
calendar, GA4 (no pixel locally, on purpose).

## 3. Next build: the pick-a-time step (lead-funnel.md section 5)

Goal: after the 5 questions on /schedule/, the visitor picks a slot from the GHL calendar in the
site's own design. Lead is already saved before this step.

1. **Token:** `submitForm` returns `{ ok, bookingToken }` when the GHL API path ran:
   HMAC-SHA256 of the contactId (new secret env `BOOKING_TOKEN_SECRET`, add to PROJECT_REQUIREMENTS +
   `.env.example`). `deliverToGhl` already returns `contactId`. Webhook fallback = no token = show the
   "we will call you to set a time" state.
2. **Server actions** (new `lib/booking-action.ts`, reuse `lib/ghl.ts` `call()`; add calendar
   functions ported from `Desktop/UDT LPs/booking/lib/ghl.js`: `freeSlots`, `createAppointment`):
   - `getSlots()`: free slots now → +14 days for `GHL_CALENDAR_ID` (GHL applies the 2 h notice and
     hours), returned as ISO strings grouped by date.
   - `book(token, start)`: verify token, create appointment (`toNotify: true`,
     `ignoreFreeSlotValidation: false`), move the opportunity to Call Booked, reset+add tag `booked`,
     send Meta CAPI `Schedule` (new event id). Slot taken → error code so the UI refreshes slots.
3. **UI** (ScheduleForm step 6, follow STYLE_GUIDE 6.13 + the existing pill/square language): day
   pills (next open days) → time pills in the visitor's timezone (`Intl`), one button "Book my call",
   success state with the time, add-to-calendar (Google link + .ics), "the Meet link is in your inbox".
   Empty / error states keep the lead and promise a same-day call. Reduced motion respected.
4. **Events:** browser `fbq('track','Schedule',{},{eventID})` + GA4 `book_call`, paired with the
   CAPI event. Add `book_call` as a GA4 key event later.
5. **Gate:** ship behind an env flag (e.g. `BOOKING_ENABLED=1`) and keep it off in production until
   Levi and Brad have connected Google Calendar (otherwise no conflict checking, no Meet links).
6. **W3 "call booked" workflow** in GHL: trigger Customer Booked Appointment (Strategy Call
   calendar) → email team@ → opportunity Call Booked → confirmation + 24 h / 1 h reminders to the lead.
   Read the calendar's own Notifications tab first so the lead doesn't get two confirmations.
   Prospect-facing copy follows copy-rules.md and goes to Brad for review before publishing.
7. Test: dev server with webpack (launch config `bigsquare-dev-webpack`, port 3001), book a slot as
   the QA contact, confirm the appointment in GHL, then cancel it.

After that, per lead-funnel.md section 9: W2 confirmations per form, W4 didn't-book sequence (needs
`/schedule/book/?t=<token>` for email links), W5 to W10, deliverability, SMS.

## 4. Waiting on people

| Who | What |
|---|---|
| Levi | Connect Google Calendar in the BigSquare sub-account (Settings > Calendars > Connections), linked + conflict calendar |
| Brad (logged in as support@) | Same, connecting the Google account his meetings live in |
| Mike | Namecheap DNS access: SPF, Google DKIM, DMARC, GHL dedicated sending domain (no SPF/DMARC today; alerts may land in spam) |
| Mike | Rotate the GHL Private Integration token (pasted in chat once) and update Vercel + `.env.local` |
| Mike | Agency "failed payments" banner in GHL (premium workflow features bill per run) |
| Mike | Check team@ got the W1 test alert (from support@ via GHL's shared domain); after the first real lead, confirm Meta Events Manager shows Lead from Browser + Server, deduplicated |
| Brad | Copy review for every prospect-facing message (W2 to W10) |

## 5. Gotchas learned today

- **GHL:** custom field names that collide with standard fields are refused ("GCLID"). "Tag added"
  only fires for a tag the contact lacks, hence the reset. Collective calendar updates must resend
  `teamMembers` with `isPrimary`; `openHours` is one entry per weekday. User emails are unique across
  the whole platform (support@ was taken by Mike's MBA Wausau user; that user was deleted and
  recreated as "BigSquare Support"). The workflow builder lives in an iframe: read it with
  screenshots/zoom, not page text.
- **Next.js 16 here:** `tsc` with the incremental cache can report clean while broken; use
  `npx tsc --noEmit -p . --incremental false`. Stale `.next/dev/types` from other branches break
  `next build` locally (moved aside today).
- **Machine:** use webpack for dev (`bigsquare-dev-webpack`); Turbopack overloads Mike's PC. Port
  3000 is usually Mike's lab dev server. The in-app browser pane pauses animations when hidden,
  which stalls multi-step form transitions in automated tests (not a real bug).
- **Lead events:** `ThanksBeacon` fires a `booked` event on /thanks/ page views; it is not a real
  booking and shouldn't be used as a conversion.

## 6. Out of scope here (handled elsewhere)

- **Homepage + `/results/`** (fake "Client 0N" cards, stand-in stats in `lib/metrics.ts`): Mike is
  rebuilding the homepage in `Downloads/bigsquaresite-lab` (not a git repo) in another chat. Before
  porting, diff file by file: the lab also changed form-action, ApplyForm, ResourceList, registry,
  Footer, layout and more, and main now has new lead code in those areas. Suggestion standing: put the
  lab on a git branch first.
- **Snapshot leftovers still in GHL:** "Marketing Workflows" folder (6 drafts), "Marketing Pipeline",
  empty "Affiliate Marketing" calendar group. Two unused Meta datasets ("BigSquare Marketing API",
  "…Event Data").
