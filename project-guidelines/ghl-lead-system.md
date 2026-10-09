# GHL lead system: how it works (as built)

The operating manual for website leads: what happens from the moment someone fills a form to the
moment the team hears about it, where every piece lives, and how to change it safely.

- **This doc** = what exists today. Update the Status table (section 12) whenever something changes.
- **The plan and roadmap** = `project-sections/conversion/lead-funnel.md` (booking step, confirmation
  and follow-up workflows, SMS, deliverability).
- Last verified end to end: 2026-10-09 (test lead from the site into GHL, W1 alert executed,
  opportunity opened).

---

## 1. The whole flow on one screen

```
VISITOR'S BROWSER                                   OUR SERVER (Vercel, Next.js)                 GHL (BigSquare Marketing sub-account)
─────────────────                                   ────────────────────────────                 ─────────────────────────────────────
every page view
  UtmCapture → captureAttribution()
  first touch (90 days), last touch (session),
  click IDs, kept in browser storage

form submit
  leadMeta(): event id, attribution,       ───────►  submitForm() server action
  GPC flag, honeypot value, time on form              1. validate (zod)
                                                      2. spam? honeypot filled or < 1.5 s
                                                         → answer "ok", deliver nothing
                                                      3. normalize contact (name, email,
                                                         phone, company)
                                                      4. deliver ──────────────────────────────►  upsert contact (email/phone dedupe)
                                                         GHL API (primary)                         34 custom fields, standard fields
                                                           │  on any error                         reset + add tags  ──► tag website-lead
                                                           ▼                                       plain-text note           │
                                                         FORM_WEBHOOK_URL (fallback) ─────────►    opportunity "Website Leads / New Lead"
                                                         → old "Website form inbound"              (sales forms only)        ▼
                                                           workflow (emails team@ itself)                              W1 Website lead alert
                                                      5. after the response:                                           → email team@
                                                         Meta Conversions API event
                                                         (same event id; needs META_CAPI_TOKEN;
                                                         skipped for GPC visitors)
on "ok"
  trackFormLead(): GA4 event + Meta pixel  ◄───────
  event with the same event id
  (skipped if the spam signals tripped)
```

---

## 2. Where everything lives

### GHL
| Thing | Value |
|---|---|
| Agency | Obsidion (app.gohighlevel.com) |
| Sub-account | BigSquare Marketing, location id `7VBUf1asBTeGlv6V2vtf` |
| Pipeline | **Website Leads** `FdeqZD1RbsHH8Ku4Z27i` |
| Stages | New Lead `9a0090a5-26a3-493d-8fcd-514037609840` · Contacted `297baf5c-fd59-472e-9457-974ae37adcd1` · Call Booked `105402d7-4cd4-42d9-80ef-c470f06769ad` · Showed `0f576f8e-9fe1-469c-b7c8-be9296f58d03` · Proposal Sent `c9748afb-8260-4d3b-b8aa-866131ba2d8e` · Nurture `c718d48a-71d1-44dd-8ab7-b00075bdeef3` |
| Calendar | **Strategy Call (website)** `K0Isp8DY5GPqcYqK1uia`, collective, widget slug `bigsquare-strategy-call`. Members: Levi Holley `QRdM3Hv1bCDtAN3M3S14` (primary, levi@bigsquaremarketing.com) and "BigSquare Support" `wuIM7XCLVHSe4vt8qnCu` (support@bigsquaremarketing.com, Brad's login in this sub-account). 30 min slots on a 30 min interval, Mon to Fri 11:00 to 21:00 Eastern (= 9 to 7 Mountain, copied from Obsidion's "Book a call with our team"), 14 days ahead, 1 per slot, 2 hours minimum notice (Mike, 2026-10-09), Google Meet, auto-confirm, reschedule/cancel allowed |
| Users in the sub-account | Levi Holley, BigSquare Support (Brad). Location timezone America/New_York |
| Workflow W1 | **W1 Website lead alert (team@)** `6c2c5907-395e-4ef8-8297-b9aa407bb933` (published) |
| Fallback workflow | **Website form inbound** `a45f495f-3f42-4f1e-b75c-2a5adbca7022` (published) |
| API access | Private Integration token "bigsquaremarketing.com website" (scopes in section 9) |
| Test contact | `qa+test@bigsquaremarketing.com`, tagged `test`; keep it for QA |

Won and lost are the opportunity **status**, not stages.

Snapshot leftovers, unused and safe to delete once nobody needs them: folder "Marketing Workflows"
(6 drafts) and pipeline "Marketing Pipeline". The 5 snapshot calendars (all empty) were deleted
2026-10-09; the sub-account has no calendar until the website booking calendar is built.

### Code (this repo)
| File | Job |
|---|---|
| `lib/attribution.ts` | Captures first/last touch + click IDs in the browser; `getAttribution()` for submissions |
| `components/shared/UtmCapture.tsx` | Runs the capture on every route (mounted in `app/layout.tsx`) |
| `lib/lead-client.ts` | `leadMeta()` (event id, attribution, GPC, spam signals) and `useFormStartedAt()` |
| `components/shared/Honeypot.tsx` | The hidden spam-trap field every lead form renders |
| `lib/lead-events.ts` | Which GA4/Meta event each form fires; `MIN_FILL_MS`; event ids |
| `lib/track.ts` | Browser tags: `trackFormLead()` plus the funnel `track()` events |
| `lib/form-action.ts` | `submitForm`: validation, spam drop, delivery, fallback, CAPI |
| `lib/ghl.ts` | GHL API v2 client (contacts, tags, notes, custom field ids, pipelines, opportunities, calendar free slots + appointments) |
| `lib/booking-token.ts` | `bookingEnabled()`, sign/verify the booking token (HMAC of the contact id) |
| `lib/booking-action.ts` | Pick-a-time server actions: `getSlots(token)`, `bookCall(...)` (appointment, deal to Call Booked, tag `booked`, CAPI `Schedule`) |
| `components/sections/schedule/TimePicker.tsx` | Step 6 of /schedule/: day + time pills in the visitor's timezone, add-to-calendar links; also the reschedule picker |
| `app/(marketing)/schedule/book/page.tsx` + `BookingPanel.tsx` | `/schedule/book/?t=<token>`: book, or see and change the booked call (moves the same appointment) |
| `lib/ghl-lead.ts` | Maps a submission onto the GHL contact: field keys, tags, note, opportunity |
| `lib/meta-capi.ts` | Meta Conversions API sender (hashing, dedupe id) |
| `scripts/ghl-setup.mjs` | Creates missing custom fields; lists pipelines and calendars |
| `scripts/ghl-check-contact.mjs` | Reads a contact back: fields, tags, note, opportunities |
| `components/tracking/*` | Pixel and Google tag loaders (GPC aware) |

### Meta / Google
| Thing | Value |
|---|---|
| Meta pixel (dataset) | `1382759246938072` "BigSquare Marketing" (business 1849146809585551). The other two datasets in Events Manager ("BigSquare Marketing API", "BigSquare Marketing Event Data") are not used |
| Meta ad account | BigSquare Marketing `1064601766579114` |
| GA4 | `NEXT_PUBLIC_GA4_ID` (live since 2026-09-04) |
| Google Ads | none yet |

---

## 3. The forms

| formType | Page | Fields sent | Tags (besides `website-lead`, `src:<formType>`) | Opportunity | Browser events |
|---|---|---|---|---|---|
| `schedule` | /schedule/ | name, company, locations, email, phone | | yes | GA4 `generate_lead` + Meta `Lead` |
| `apply` | /apply/growth-partner/ | business, website, industry, locations, budget, blocker, name, email, phone, funnel, qualified, SMS consent record | `qualified` (6+ locations and $15k+), `sms-consent` | yes | + `qualified_lead` / `QualifiedLead` when qualified |
| `audit` | /audit/ | name, email, phone, company, website, locations, running | | yes | GA4 `generate_lead` + Meta `Lead` |
| `contact` | /contact/ | name, email, phone, company, locations, message | | yes | GA4 `generate_lead` + Meta `Lead` |
| `lead-magnet` | /resources/ | name, email, resource, resourceTitle | `res:<slug>` | no | GA4 `generate_lead` + Meta `ResourceRequest` (custom) |
| `newsletter` | homepage | email | `newsletter` | no | GA4 `sign_up` + Meta `NewsletterSignup` (custom) |

Any email ending `+test@bigsquaremarketing.com` also gets the tag `test`.

---

## 4. What lands on the GHL contact

**Standard fields:** first/last name (split on the first space), email (lowercased), phone (GHL
stores E.164, e.g. +15550100123), company name (`company`, or `business` from the apply form),
website, source `Website: <formType>`.

**Custom fields** (34, all text; keys must match `FIELD` in `lib/ghl-lead.ts`):

| Group | Merge keys |
|---|---|
| Lead | `contact.lead_form`, `contact.landing_page`, `contact.referrer`, `contact.lead_event_id`, `contact.qualified` |
| Answers | `contact.locations`, `contact.industry`, `contact.monthly_ad_budget`, `contact.growth_blocker`, `contact.services_running`, `contact.message`, `contact.resource_requested` |
| First touch | `contact.first_touch_source`, `_medium`, `_campaign`, `_content`, `_term`, `_landing_page`, `_at` |
| Last touch | `contact.last_touch_source`, `_medium`, `_campaign`, `_content`, `_term` |
| Click IDs | `contact.click_gclid`, `contact.click_gbraid`, `contact.click_wbraid`, `contact.click_fbclid`, `contact.click_msclkid`, `contact.meta_fbc`, `contact.meta_fbp`, `contact.ga_client_id` |
| SMS consent | `contact.sms_consent_text`, `contact.sms_consent_at` (only when the box was checked) |
| Booking link | `contact.booking_link`: the contact's own `/schedule/book/?t=<token>` link, saved after submit for schedule, apply and audit leads while booking is on. Emails use `{{contact.booking_link}}` to book or reschedule in the site's design |

GHL reserves some names for standard fields (it refused a custom field called "GCLID"), which is why
click IDs carry the `click_` prefix. Empty values are skipped, so a later lead never blanks out an
earlier answer.

**Note:** one plain-text note per submission: form and page, every answer, last and first touch, click
IDs, SMS consent record, event id. It's the human-readable audit trail.

**Opportunity:** sales forms (schedule, apply, audit, contact) upsert one open opportunity per contact
in Website Leads at New Lead, named `<company or name or email> (<formType>)`.

**Merge tags for workflow emails:** custom fields read as `{{contact.lead_form}}`,
`{{contact.locations}}` and so on; standard ones as `{{contact.name}}`, `{{contact.email}}`,
`{{contact.phone}}`, `{{contact.company_name}}`, `{{contact.website}}`, `{{contact.id}}`.

---

## 5. Tags: the trigger language

| Tag | Added by | Meaning / use |
|---|---|---|
| `website-lead` | site, every submission | Triggers **W1**. Removed and re-added on every submission so repeat leads re-trigger |
| `src:<formType>` | site, every submission | Which form. Also reset per submission: safe trigger for per-form workflows (confirmations) |
| `qualified` | site (apply) | Met the qualifying bar. Added once; does not re-fire |
| `sms-consent` | site (apply) | Checked the SMS box; the only contacts that may be texted |
| `newsletter` | site | Newsletter list |
| `res:<slug>` | site | Requested that resource |
| `test` | site | QA submission; filter out of reports |
| `website-contact`, `website-lead-webhook` | fallback workflow | Lead arrived through the webhook fallback, not the API |

Rule of thumb: build new workflows on `src:<formType>` or `website-lead` (they fire every time).
Tags that are only added (`qualified`, `newsletter`, `res:*`) fire the first time a contact gets them.

---

## 6. Workflows

### W1 Website lead alert (team@): published
- **Trigger:** Contact tag, tag added = `website-lead`.
- **Action:** Internal notification, Email, from "BigSquare Marketing Website"
  <support@bigsquaremarketing.com>, to team@bigsquaremarketing.com.
  Subject: `New website lead ({{contact.lead_form}}): {{contact.name}}, {{contact.company_name}}`.
  Body: same-day reminder, every answer field, last and first touch, landing page, link to the contact.
- **Settings:** allow re-entry on.

### Website form inbound: published, fallback only
Runs only when the site posts to `FORM_WEBHOOK_URL`, which happens when the GHL API write fails or
`GHL_API_KEY` is not set (preview deployments, for example).
- Inbound Webhook → Create contact (email, name, phone, company only) → email team@ (with the
  payload's answers and UTMs) → if formType is `contact`: tag `website-contact`, note, in-app
  notification; otherwise tag `website-lead-webhook`.
- It does not add `website-lead`, so it never double-fires W1.
- Payload shape: `{ formType, page, utm, fields, contact, attribution, eventId, smsConsent, submittedAt }`.

### Planned (see lead-funnel.md section 7)
W2 lead confirmations per form · W3 call booked (confirmation, team alert, reminders, stage) · W4
didn't book · W5 no-show/cancel · W6 showed · W7 application review · W8 resource delivery · W9
newsletter welcome · W10 long-term nurture. Prospect-facing messages go through copy-rules.md and
Brad's review before publish.

---

## 7. Tracking and attribution

- **Attribution storage (browser):** `bigsquare_first_touch` (localStorage, 90 days, never
  overwritten), `bigsquare_last_touch` (sessionStorage; restarts on a new campaign click or an outside
  referrer), `bigsquare_click_ids` (localStorage, 90 days). Only paths are stored, never query strings.
- **Source rules without UTMs:** gclid/gbraid/wbraid → google/cpc, msclkid → bing/cpc, fbclid →
  facebook/social, search engine referrer → organic, social site → social, other site → referral,
  nothing → (direct)/(none).
- **Event dedupe:** each submission gets one `eventId`. The browser pixel sends it as `eventID`; the
  Conversions API sends it as `event_id`; Meta keeps one. Qualified applications add a second event
  with `<eventId>-q`.
- **Conversions API:** server-side, after the response, hashed email/phone/name + fbc/fbp + IP/user
  agent. Runs in production (`META_CAPI_TOKEN` set); off wherever the token is missing. Graph API
  version `v23.0` (override with `META_GRAPH_VERSION`).
- **Privacy:** visitors sending Global Privacy Control get no Meta pixel, no Google Ads tag, no CAPI.
  GA4 still runs with ad signals off.
- **Verify:** Meta Events Manager → Test events (set `META_TEST_EVENT_CODE` on a preview to route CAPI
  there), Meta Pixel Helper in a normal browser, GA4 DebugView.
- **Not counted as conversions:** the `booked` event on /thanks/ pages is a page-view event from the
  funnel spec, not a real booking. The real one is `book_call` (GA4) / `Schedule` (Meta, browser +
  CAPI, same event id) from the pick-a-time step, fired once per new appointment.

---

## 8. Spam protection
- Honeypot field `company_website` (off-screen, unfocusable, hidden from screen readers).
- Minimum time on form: 1.5 s (`MIN_FILL_MS` in `lib/lead-events.ts`).
- Either signal: the server logs `[form-action] dropped likely spam` and returns "ok" without
  delivering, and the browser fires no events.
- Next step if bots get through: Cloudflare Turnstile.

---

## 9. Environment variables

| Var | Where | Status (2026-10-09) |
|---|---|---|
| `GHL_API_KEY` | Vercel (Sensitive) + `.env.local` | set: Production + local. Not on Preview, so previews use the webhook fallback |
| `GHL_LOCATION_ID` | Vercel + `.env.local` | set |
| `FORM_WEBHOOK_URL` | Vercel (Sensitive) | set (the fallback workflow's inbound webhook) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Vercel | set (1382759246938072); not set locally on purpose |
| `META_CAPI_TOKEN` | Vercel (Sensitive) | set: Production (2026-10-09). Not on Preview |
| `META_TEST_EVENT_CODE` | Vercel preview only, temporary | unset |
| `NEXT_PUBLIC_GA4_ID` | Vercel + `.env.local` | set |
| `NEXT_PUBLIC_GTAG_ID` | Vercel | unset (no Google Ads yet) |
| `GHL_CALENDAR_ID` | Vercel + `.env.local` | set (`K0Isp8DY5GPqcYqK1uia`), used by the pick-a-time step |
| `BOOKING_ENABLED` | Vercel + `.env.local` | `1` locally only. Leave unset in Production until Levi and Brad connect Google Calendar. Read at build time (static page): flip it with a redeploy |
| `BOOKING_TOKEN_SECRET` | Vercel (Sensitive) + `.env.local` | set locally 2026-10-09; add to Production before turning booking on. Rotating it breaks booking links already emailed |

Private Integration token scopes: contacts, calendars, calendars/events, opportunities,
locations/customFields, locations/tags (view + edit each); locations, users (view).

---

## 10. How to...

**Test the whole path locally**
1. `.env.local` has `GHL_API_KEY` and `GHL_LOCATION_ID`.
2. Start the dev server with webpack (launch config `bigsquare-dev-webpack`, port 3001;
   Turbopack is too heavy for this machine).
3. Open a form with test UTMs, e.g. `/contact/?utm_source=qa-test&utm_medium=manual&gclid=TEST`, and
   submit with `qa+test@bigsquaremarketing.com`.
4. `node scripts/ghl-check-contact.mjs qa+test@bigsquaremarketing.com`: fields, tags, note,
   opportunity.
5. GHL → Automation → W1 → Execution logs: the email step should say Executed.

**Add a new form**
1. Post through `submitForm` with a new `formType`; render `<Honeypot />` inside the form; pass
   `...leadMeta(form, startedAt.current)`; on success call `trackFormLead(formType, meta)`.
2. Add the formType to `LEAD_EVENTS` in `lib/lead-events.ts` (pick the GA4/Meta event).
3. If it's a sales form, add it to `SALES_FORMS` in `lib/ghl-lead.ts`.
4. New answer fields? See the next recipe. W1 alerts on it automatically.

**Add a custom field**
1. Add `[key, name, type]` to `FIELDS` in `scripts/ghl-setup.mjs` and the key to `FIELD` + `values`
   in `lib/ghl-lead.ts`.
2. `node scripts/ghl-setup.mjs` (report), then `--apply`. If GHL generates a different key or refuses
   the name (reserved standard field), rename and rerun.
3. Add it to the W1 email body if the team should see it.

**Build a workflow on website leads**
Trigger on Contact tag added = `src:<formType>` (or `website-lead` for all forms). Use custom-field
merge tags from section 4. Build as Draft, test with the QA contact, then publish.

**Change who gets alerts:** W1 → the email action → "To Custom Email".

**Change the booking calendar through the API** (`PUT /calendars/{id}`, Version `2021-04-15`):
collective calendars reject any update that does not resend `teamMembers` with `isPrimary`
("isPrimary key is required with collective booking calendars"), so GET the calendar first and send
its members back with the change. `openHours` takes one entry per weekday (`daysOfTheWeek: [1]`),
not a multi-day array. Minimum notice is `allowBookingAfter` + `allowBookingAfterUnit: "hours"`.
Switching to round robin later: `calendarType: "round_robin"` plus an `eventType`, or do it in the UI.

**Turn the API path off (kill switch):** remove `GHL_API_KEY` from Vercel Production and redeploy;
every lead goes through the fallback workflow.

**Rotate the GHL token:** create a new Private Integration with the same scopes, replace
`GHL_API_KEY` in Vercel (Production, and Preview if wanted) and `.env.local`, redeploy, then delete the
old integration. (The current token was pasted in chat once on 2026-10-09; rotate it.)

---

## 11. Troubleshooting

| Symptom | Look at |
|---|---|
| Lead not in GHL | Vercel runtime logs for `[form-action]` (spam drop, GHL failure, webhook status) and `[ghl-lead]` |
| Lead in GHL but no alert | W1 execution logs. Confirm the contact got `website-lead` this time (the reset runs before the add). Check team@ spam: alerts send from GHL's shared domain and bigsquaremarketing.com has no SPF/DMARC yet |
| A custom field stays empty | `node scripts/ghl-setup.mjs` to confirm the key exists; keys must match `lib/ghl-lead.ts` exactly |
| Booking step shows "we will call you" instead of times | `[booking]` in Vercel logs. Check `BOOKING_ENABLED`, `BOOKING_TOKEN_SECRET`, `GHL_CALENDAR_ID` on that environment (a webhook-fallback lead never gets a token) |
| Booked time shows wrong after a revisit | `GET /contacts/{id}/appointments` returns times with NO offset, in the location timezone (`"2026-10-19 20:30:00"`, America/New_York). `ghlTimeToIso` in `lib/ghl.ts` converts; if the location timezone changes, change `LOCATION_TZ` there |
| No opportunity | Log line `[ghl-lead] pipeline "Website Leads" / "New Lead" not found`: a pipeline or stage was renamed |
| Lead arrived as `website-lead-webhook` | The API write failed and the fallback took it: read the `[form-action] GHL API write failed` log |
| Meta events missing | Pixel Helper in a normal browser; GPC on in that browser blocks it by design; `[meta-capi]` logs for server rejections |

---

## 12. Status (keep current)

| Piece | State |
|---|---|
| Attribution, events, spam check, GHL API write, W1 alert | live (2026-10-09) |
| Fallback webhook workflow | live, fallback only |
| Website Leads pipeline + 34 custom fields | live |
| Meta pixel (browser) | live |
| Meta Conversions API | live in production (token set 2026-10-09); confirm server events in Events Manager after the first real lead |
| Booking calendar | built 2026-10-09 (collective, Levi primary + Brad); waiting on Levi and Brad to connect Google Calendar in the BigSquare sub-account (conflicts + Meet links). Switch to round robin or Levi only when volume grows |
| Pick-a-time step on /schedule/ | built 2026-10-09 behind `BOOKING_ENABLED` (off in Production). Tested end to end locally: QA contact booked Oct 19 6:30 PM MT (appointment `AWA46s068mNPjuZ5DDq7`, tag `booked`, deal to Call Booked), then cancelled. Cancelling does not move the deal back or remove `booked` yet (a W3/cancel workflow job). Go live only after both Google connections exist |
| "Call booked" workflow (W3) | next; read the calendar's own Notifications tab first so the lead doesn't get two confirmations |
| Prospect confirmations and follow-ups (W2 to W10) | to build; copy goes to Brad |
| SPF / DKIM / DMARC + GHL dedicated sending domain | waiting on Namecheap access |
| SMS (LC phone + A2P) | not started |
| Google Ads | not running yet |
