# W3 Call booked: workflow spec + draft copy (for Brad's review)

Status 2026-10-09: **built in GHL as a Draft** ("W3 Call booked", workflow
`9b919378-3306-4afc-8bcc-b17d0fa8c50c`, top level next to W1). Not published: Brad reviews the copy
below first, and the "still booked?" checks need the cancel workflow (below) before publishing.

As built: trigger Customer Booked Appointment, filter calendar Strategy Call (website), contact only →
Create/update opportunity (Website Leads → Call Booked, status open, may move back a stage; name left
blank so site-made deals keep their name; GHL marks this action "soon deprecated", existing workflows
keep working) → Add tag `booked` → email B (from "BigSquare Marketing" support@, preview text "Your time,
the Google Meet link, and how to change it.") → Wait until 1 day before the appointment (if already
passed: skip messages until the next wait) → If tags include `booked` → email C → Wait until 1 hour
before → If tags include `booked` → email D. Settings: re-entry on, stop on response off.

**Why a tag check, not appointment status:** GHL's If/else has no appointment-status condition (only
rescheduled / start / end). So `booked` is the "call is still on" signal, and a cancel workflow must
remove it: trigger Appointment status = cancelled, calendar Strategy Call → remove tag `booked` (plus
W5's later steps: deal stage, reschedule email). Not built yet: Mike to approve. A Draft named "W5 Call
cancelled" exists with no saved trigger or actions.

Merge keys confirmed in the builder: `appointment.only_start_date`, `appointment.only_start_time`,
`appointment.meeting_location`, `appointment.add_to_google_calendar`. Used by GHL's documented names,
to confirm in the first test send: `appointment.day_of_week`, `appointment.timezone`,
`appointment.add_to_ical_outlook`.
Plan of record: `lead-funnel.md` section 7. As-built details go in `ghl-lead-system.md` once built.

## What the calendar already sends (checked 2026-10-09)

`GET /calendars/K0Isp8DY5GPqcYqK1uia/notifications`: two defaults, both **in-app only, to the
assigned users** (Levi, Brad): "booked" and "confirmation". Nothing goes to the lead, so W3's
confirmation is the only one they get. Leave the calendar notifications as they are.

## Workflow

- **Name:** `W3 Call booked`
- **Trigger:** Customer Booked Appointment, filter calendar = "Strategy Call (website)".
  Covers bookings from the site's picker and any booked in GHL by hand.
- **Settings:** allow re-entry on (a lead can book again after a cancel). Stop on response: off.

| # | Action | Detail |
|---|---|---|
| 1 | Create/update opportunity | Website Leads → Call Booked (the site already does this; this covers manual bookings) |
| 2 | Add tag | `booked` (same reason) |
| 3 | Send email to contact | Confirmation (copy B) |
| 4 | Wait | until 24 hours before the appointment start; skip if that time has passed |
| 5 | If/else | appointment status is still confirmed → Send email (copy C); else end |
| 6 | Wait | until 1 hour before the appointment start; skip if passed |
| 7 | If/else | still confirmed → Send email (copy D); else end |

**Staff alerts are not in W3** (Mike, 2026-10-09: Levi owns the calendar, support@ gets the
notifications alongside him). They are the calendar's own email notifications, created by API:
booked, reschedule and cancellation, each to the assigned user (Levi) + support@, using copy A's
content. GHL sends those natively on a move or a cancel, so staff always hear about a change
whether or not W3 re-fires.

SMS reminders come later, only for contacts tagged `sms-consent`, once A2P is approved.
Cancels and no-shows are W5 (move the deal off Call Booked, remove `booked`, reschedule email).

Links: every "book" or "change time" link is `{{contact.booking_link}}`, our own
`/schedule/book/?t=<token>` page (Brad/Mike 2026-10-09: keep rescheduling in the site's design, not
GHL's hosted page). The site saves it on the contact at submit. Changing a time there moves the same
appointment (PUT), it never books a second one.

**Verify while building:** whether a reschedule re-fires "Customer Booked Appointment" (or only
"Appointment Status"), and that the 24 h / 1 h waits follow the moved time. If a reschedule does not
re-enter W3, add an "appointment rescheduled" branch that emails team@ the new time.

Times: GHL formats `{{appointment.*}}` in the contact's timezone. The booking step saves the visitor's
browser timezone on the contact before booking (`lib/booking-action.ts`), so emails match the time
the visitor picked. Merge field names below are GHL's standard appointment values; confirm each in
the builder's merge-field picker while building.

## Draft copy (copy-rules.md: no em dashes, no banned words, nothing the page did not promise)

### A. Staff alert (internal; live as the calendar's booked / reschedule / cancellation emails)
**Subject:** Call booked: {{contact.name}}, {{contact.company_name}}, {{appointment.start_time}}

> Call booked from the website.
>
> When: {{appointment.day_of_week}}, {{appointment.only_start_date}} at {{appointment.only_start_time}} {{appointment.timezone}}
> Who: {{contact.name}}, {{contact.company_name}}
> Email: {{contact.email}} · Phone: {{contact.phone}}
> Locations: {{contact.locations}}
> Source: {{contact.last_touch_source}} / {{contact.last_touch_medium}} / {{contact.last_touch_campaign}}
>
> Open the contact in GHL to see their answers before the call.

### B. Confirmation (to the lead, right away)
**Subject:** Your call with BigSquare is booked

> Hi {{contact.first_name}},
>
> You are booked for {{appointment.day_of_week}}, {{appointment.only_start_date}} at
> {{appointment.only_start_time}} {{appointment.timezone}}.
>
> Join on Google Meet: {{appointment.meeting_location}}
>
> It is 30 minutes. We look at your accounts together and tell you exactly what we would do first.
>
> Add it to your calendar: Google or Apple and Outlook (GHL's add-to-calendar links)
>
> Need a different time? Pick a new one here ({{contact.booking_link}})
>
> Talk soon,
> The BigSquare team

### C. Reminder, 24 hours before
**Subject:** Tomorrow: your call with BigSquare

> Hi {{contact.first_name}},
>
> A reminder that we are talking tomorrow at {{appointment.only_start_time}} {{appointment.timezone}}.
>
> Google Meet: {{appointment.meeting_location}}
>
> Need a different time? {{contact.booking_link}}

### D. Reminder, 1 hour before
**Subject:** In one hour: your call with BigSquare

> Hi {{contact.first_name}},
>
> We are on at {{appointment.only_start_time}} {{appointment.timezone}}.
> Here is the link: {{appointment.meeting_location}}

## Decisions (Mike, 2026-10-09)

1. Sign-off is "The BigSquare team". Only emails Levi writes himself carry his name.
2. The "have your logins handy" line is cut.
3. Rescheduling stays in our design: `{{contact.booking_link}}`, never GHL's reschedule page.

## Open

1. The Meet link only exists once Levi connects Google Calendar + Google Meet; until then
   `{{appointment.meeting_location}}` is empty. Another reason booking stays off in production.
