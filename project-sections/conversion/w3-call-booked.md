# W3 Call booked: workflow spec + draft copy (for Brad's review)

Status 2026-10-09: spec and draft copy written; workflow to be built in GHL as a **Draft** in folder
"Website Funnel". Nothing prospect-facing publishes until Brad signs off on the copy below.
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
| 1 | Internal notification, Email | to team@bigsquaremarketing.com, from "BigSquare Marketing Website" support@ (copy A) |
| 2 | Create/update opportunity | Website Leads → Call Booked (the site already does this; this covers manual bookings) |
| 3 | Add tag | `booked` (same reason) |
| 4 | Send email to contact | Confirmation (copy B) |
| 5 | Wait | until 24 hours before the appointment start; skip if that time has passed |
| 6 | If/else | appointment status is still confirmed → Send email (copy C); else end |
| 7 | Wait | until 1 hour before the appointment start; skip if passed |
| 8 | If/else | still confirmed → Send email (copy D); else end |

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

### A. Team alert (internal)
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
> Need a different time? {{contact.booking_link}}
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

1. The Meet link only exists once Levi and Brad connect Google Calendar; until then
   `{{appointment.meeting_location}}` is empty. Another reason booking stays off in production.
