# Lead funnel: capture, booking, follow-up, attribution

Spec, drafted 2026-10-09 (Mike + Claude). Status: building in the order in section 9. How the built parts work: `project-guidelines/ghl-lead-system.md`.
Supersedes the "GHL API capture" line in tasks.md and the retired calendar note in decisions.md: the
booking step below is the replacement (native step, GHL calendar behind it, no iframe).

Reference implementation: the UDT booking service (`Desktop/UDT LPs/booking/`, `lib/ghl.js`), which
already does contact upsert, free slots, and booking against GHL API v2. Port its client, do not share
the service.

## 1. What exists today (audited 2026-10-09)

- Every form posts through `submitForm` (`lib/form-action.ts`) to `FORM_WEBHOOK_URL`, which is the GHL
  workflow "Website form inbound" (Inbound Webhook trigger) in the BigSquare Marketing sub-account
  (location `7VBUf1asBTeGlv6V2vtf`).
- That workflow saves only name, email, phone, company; emails support@ (not team@); and tags every
  form except `contact` as `website-newsletter`. Schedule, audit, and apply leads are mislabeled.
- No calendar on the site. `/schedule/` is a 5-step form that ends with "We will set up your call."
- No confirmation email to the lead, no follow-up, no booking workflow, no pipeline in use.
- Tracking: GA4 live. Meta Pixel and Google Ads components exist but have no IDs. Only the apply funnel
  fires a lead event. UTMs are kept for the session only; no click IDs, no first touch.
- GHL: no sub-account users, no phone number or A2P, email on the shared mg.msgsndr.biz domain.
  Snapshot leftovers (6 draft workflows, 5 calendars, "Marketing Pipeline") are unused.
- DNS (Namecheap, Google Workspace mail): no SPF, no DMARC.

## 2. The shape

```
visit ─ attribution captured (first touch kept 90 days, last touch per session)
  │
form submit ─ spam check ─ GHL contact upsert (answers, attribution, tags, consent note)
  │                        + opportunity "New Lead" (sales forms)
  │                        + Lead event (browser pixel + server CAPI, one event_id)
  │
  ├─ sales forms (schedule, qualified apply, audit) ─ PICK A TIME step on the site
  │       │                                              (GHL calendar free slots)
  │       ├─ booked ─ Schedule event ─ confirmation + reminders ─ call ─ showed / no-show
  │       │                                                         └─ proposal ─ won / lost
  │       └─ not booked ─ follow-up sequence (email, call tasks) ─ nurture
  │
  ├─ contact ─ reply within the promised window (task + internal email)
  ├─ resource ─ deliver when the file exists ─ nurture
  └─ newsletter ─ welcome ─ monthly send
```

Every lead notifies team@bigsquaremarketing.com with the full answers and the source.

## 3. Capture: the site writes to GHL directly

Decision: `submitForm` upserts the contact through the GHL API (server side, Private Integration
token), and keeps `FORM_WEBHOOK_URL` only as a fallback when the API call fails, so a lead is never
dropped.

Why the API instead of the inbound webhook:
- Booking needs the API anyway (free slots, create appointment, the contact id to book onto).
- Field mapping, tags, notes, and the opportunity live in versioned code, not in a GHL mapping screen
  that silently breaks when a field name changes (the current `business` vs `company` bug).
- The visitor gets a real error if the write fails, instead of a fire-and-forget POST.
- GHL workflows then trigger on ordinary events (tag added, appointment booked), which are free and
  easy to test.

What each submission writes:
- Standard: first/last name, email, phone, company name, source ("Website: <form>").
- Tags: `website-lead`, `src:<formType>`, plus `qualified`, `sms-consent`, `res:<slug>`, `newsletter`
  as they apply. Test submissions (email ending `@bigsquaremarketing.com` with `+test`) get `test`.
- Custom fields (section 6) for the answers and the attribution.
- A note with every answer in plain text and the SMS consent record (exact text, checked, timestamp,
  page, IP) when present.
- Opportunity in "Website Leads" at "New Lead" for schedule, apply, audit, contact.

Spam: hidden honeypot field + minimum fill time (3 s) checked on the server; silent drop. Cloudflare
Turnstile only if bots keep getting through (one already did, 2026-10-07).

## 4. The forms and what happens next

| Form | Page | On the site after submit | GHL |
|---|---|---|---|
| schedule | /schedule/ | NEW step 6: pick a time, then "You're booked" in place | src:schedule, opp New Lead → Call Booked |
| apply | /apply/growth-partner/ | qualified: pick a time on the thank-you page. Not qualified: "we review your answers" | src:apply (+qualified), review task |
| audit | /audit/ | "Your audit is in the queue" + optional "pick a time now" | src:audit, opp New Lead |
| contact | /contact/ | in-place confirmation (unchanged) | src:contact, reply task |
| resource | /resources/ | "goes out by email the moment it is ready" (unchanged) | res:<slug>, waits for the file |
| newsletter | homepage | "Watch your inbox" (unchanged) | newsletter |

## 5. Booking (native step, GHL calendar behind it)

GHL calendar "Strategy Call (website)": 30 minutes, owner = whoever takes the calls, their Google
Calendar connected (conflicts + Google Meet link), 15 min buffer, 14 days ahead, minimum notice
[DECIDE: same day with 2 h notice, or next business day].

On the site (server actions in this app, no separate service):
- `getSlots()` reads GHL free slots, returns the next 7 open days in the calendar's timezone; the UI
  shows them in the visitor's timezone.
- `book(token, start)` re-checks the slot, creates the appointment, moves the opportunity to
  Call Booked, tags `booked`. `token` is an HMAC-signed contact id returned by the submit, so nobody can
  book onto someone else's contact (the UDT pattern).
- UI: the same stepped card. Day pills, then time pills, tap to choose, one button "Book my call".
  Success: in-place confirmation with the time, an add-to-calendar link, and "the Meet link is in your
  inbox".
- Edge states keep the lead: slot just taken (refresh slots), no open times or API down ("We will call
  you to set a time", plus a call task).
- Optional SMS consent checkbox (unchecked, optional) on this step, for text reminders once A2P is live.

Email follow-ups link back to `/schedule/book/?t=<token>` (opaque token, never personal data in the
URL), which opens the same picker for that contact.

## 6. GHL objects

Pipeline "Website Leads" (created 2026-10-09; the snapshot "Marketing Pipeline" is unused):
New Lead → Contacted → Call Booked → Showed → Proposal Sent → Nurture. Won and lost are the
opportunity status, not stages. The site opens one opportunity per contact at New Lead (upsert).

Contact custom fields (folder "Website"):
- Lead: Lead Form, Landing Page, Referrer, Lead Event ID, Qualified
- Answers: Locations, Industry, Monthly Ad Budget, Website, Growth Blocker, Services Running,
  Message, Resource Requested
- First touch: Source, Medium, Campaign, Content, Term, Landed At
- Last touch: Source, Medium, Campaign, Content, Term
- Click IDs: Click GCLID / GBRAID / WBRAID / FBCLID / MSCLKID, Meta FBC, Meta FBP, GA Client ID
  (GHL reserves the plain "gclid" name for a standard field)
- SMS consent: Consent Text, Consent At

All 34 created 2026-10-09 by `scripts/ghl-setup.mjs --apply`; keys match `FIELD` in `lib/ghl-lead.ts`.

Users: the call owner(s) added to the sub-account (needed for the calendar and tasks). Team inbox for
notifications: team@bigsquaremarketing.com.

## 7. Workflows (GHL folder "Website Funnel", built as Drafts, published after an end-to-end test)

| # | Workflow | Trigger | What it does |
|---|---|---|---|
| W1 | New lead alert | tag `website-lead` | Email team@ with form, answers, source, contact link. Task "Reach out" due 15 min (business hours) for apply, audit, contact |
| W2 | Lead confirmation | tag `src:*` | One email per form type, matching what that page promised |
| W3 | Call booked | appointment booked, Strategy Call calendar | Opp → Call Booked. Confirmation email (time, Meet link, what to have ready). Email team@ "Call booked". Reminders 24 h and 1 h before (SMS too once A2P is live, consented contacts only) |
| W4 | Didn't book | tag `src:schedule` / `qualified` / `src:audit` | Wait 1 h. If booked, stop. Email "pick a time" → day 1 call task → day 3 email → day 7 last email → tag `nurture`, opp → Nurture |
| W5 | No-show / cancelled | appointment status | Reschedule email with the picker link, call task, opp stage |
| W6 | Showed | appointment status showed | Opp → Showed, task "Send proposal" due 24 h |
| W7 | Application review | tag `src:apply` without `qualified` | Review task due 1 business day. Rep tags `apply-fit` (booking email) or `apply-not-fit` (decline email, as the thank-you page promises) |
| W8 | Resource requested | tag `res:*` | Holds until the file exists, then sends it. Then nurture |
| W9 | Newsletter welcome | tag `newsletter` | Welcome email, monthly list |
| W10 | Long-term nurture | tag `nurture` | Monthly email from the blog, stops on reply or booking |

Every message gets written under copy-rules.md (no em dashes, no banned words, nothing the page did
not promise) and goes to Brad for one review round before publish.

Status 2026-10-09: W1 is built and published ("W1 Website lead alert (team@)", trigger: tag
`website-lead` added; email to team@ with every custom field). GHL only fires "tag added" for a tag the
contact does not have, so `deliverToGhl` removes `website-lead` and `src:<form>` before re-adding them:
repeat leads alert again. The old "Website form inbound" workflow stays published as the fallback path
(it still emails team@ itself) and now tags `website-lead-webhook`, so W1 never double-alerts.

## 8. Tracking and attribution

Capture (first script, every page): utm_source/medium/campaign/content/term, gclid, gbraid, wbraid,
fbclid, msclkid, landing URL, referrer. First touch kept 90 days (localStorage), last touch per
session. `fbc` built from fbclid when the `_fbc` cookie is missing; `fbp` and GA client id read at
submit. All of it rides every submission into the custom fields above.

Events, browser and server sharing one `event_id` so Meta deduplicates:

| Moment | GA4 | Meta | Google Ads |
|---|---|---|---|
| Lead (schedule step 5, apply, audit, contact) | `generate_lead` {form_type} | `Lead` | Lead conversion + enhanced conversions |
| Qualified apply | `qualified_lead` | `QualifiedLead` (custom) | optional |
| Resource request | `generate_lead` {form_type: resource} | `ResourceRequest` (custom) | none |
| Newsletter | `sign_up` | `Subscribe` (custom) | none |
| Call booked | `book_call` (key event) | `Schedule` | Booked conversion |

- Meta Conversions API from the server for Lead and Schedule: hashed email, phone, name, plus fbc, fbp,
  IP, user agent, page URL.
- Global Privacy Control (existing rule): no Meta, no Google Ads, no CAPI for GPC visitors; GA4 runs
  with ad signals off.
- Later: Showed and Won sent back to Meta and Google Ads (offline conversions by gclid) so ads optimize
  on calls that happen, not just forms. Microsoft Clarity for session replay.

## 9. Build order

A. Unblock (Mike, in parallel with B): items in section 10.
B. Site, no decisions needed: attribution capture, spam check, event_id, lead events on every form,
   pixel + CAPI wiring (dormant until IDs land), GHL API client with webhook fallback.
C. GHL: users, pipeline, custom fields, calendar, W1 + W2 + W3. Fix the old inbound workflow in the
   meantime (route by form type, notify team@) so leads are labeled right this week.
D. Site: booking step on /schedule/, apply thank-you, audit confirmation, `/schedule/book/` link.
E. GHL: W4 to W10 and every message, Brad's review, publish.
F. Deliverability and SMS (DNS can start now; A2P takes weeks), CRM-stage conversions, weekly report.

## 10. Needed from Mike / Brad

1. Who takes the calls (calendar owner), days and hours, minimum notice, Google Meet or Zoom.
2. GHL Private Integration token (Settings > Private Integrations; scopes: contacts, calendars,
   calendars/events, opportunities, locations/customFields, users read) pasted into Vercel env as
   `GHL_API_KEY`. Never in chat or files.
3. Meta pixel ID (Events Manager, BigSquare business) and a Conversions API access token, into Vercel
   env as `NEXT_PUBLIC_META_PIXEL_ID` and `META_CAPI_TOKEN`.
4. Google Ads conversion ID and labels, if Google Ads runs for BigSquare.
5. Namecheap DNS access for SPF, DKIM, DMARC, and the GHL sending domain.
6. The response time we promise (contact, audit, apply) and the sender name on prospect emails.
