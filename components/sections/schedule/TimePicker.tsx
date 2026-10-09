"use client";

import { Check } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Counter } from "@/components/shared/mono";
import { getAttribution } from "@/lib/attribution";
import { bookCall, getSlots } from "@/lib/booking-action";
import { hasGlobalPrivacyControl } from "@/lib/gpc";
import { newEventId } from "@/lib/lead-events";
import { trackBooking } from "@/lib/track";
import { cn } from "@/lib/utils";

/* Step 6 of the /schedule/ application: pick a time (lead-funnel.md
   section 5). The lead is already saved when this mounts; nothing here
   can lose it. Day pills, then time pills, in the visitor's own
   timezone, one button to book. The pills are native radios styled in
   the locations picker's pill language, so arrow keys and screen
   readers get real radio groups. Any dead end (no open times, the
   calendar down, the visitor skipping) hands back to the "we will call
   you to set a time" confirmation. */

const MAX_DAYS = 7;

const PILL =
  "inline-flex items-center justify-center rounded-full border px-3.5 py-2 text-small font-medium whitespace-nowrap tabular-nums transition-colors duration-[var(--dur-fast)] peer-focus-visible:outline-2 peer-focus-visible:outline-acc peer-focus-visible:outline-offset-2";
const PILL_ON = "border-acc bg-acc text-onacc";
const PILL_OFF = "border-sec-line text-sec-ink hover:border-ink";

/** "2026-10-12" for the slot's date as the visitor sees it */
const localDay = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(iso),
  );

const dayLabel = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(
    new Date(iso),
  );

const timeLabel = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(iso));

export function tzLabel(iso?: string): string {
  const part = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
    .formatToParts(iso ? new Date(iso) : new Date())
    .find((p) => p.type === "timeZoneName");
  return part?.value ?? "";
}

type Load = { state: "loading" } | { state: "ready"; days: [string, string[]][] };

export function TimePicker({
  token,
  stepTotal,
  reschedule = false,
  skipLabel = "None of these work? We will call you to set a time.",
  onBooked,
  onNoBooking,
}: {
  token: string;
  /** Step 6 of the application shows the saved check and the counter;
      the standalone /schedule/book/ page passes nothing */
  stepTotal?: number;
  /** Move the contact's existing call instead of booking a new one */
  reschedule?: boolean;
  skipLabel?: string;
  /** The booked start (ISO) */
  onBooked: (start: string) => void;
  /** Skipped, no open times, or the calendar failed: the lead stays saved */
  onNoBooking: () => void;
}) {
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const headingRef = useRef<HTMLLegendElement>(null);

  const fetchSlots = useCallback(async () => {
    const result = await getSlots(token).catch(() => ({ ok: false }) as const);
    if (!result.ok) return onNoBooking();
    if (result.booked && !reschedule) return onBooked(result.booked);
    const byDay = new Map<string, string[]>();
    for (const s of result.slots) {
      const key = localDay(s);
      if (!byDay.has(key) && byDay.size === MAX_DAYS) break;
      byDay.set(key, [...(byDay.get(key) ?? []), s]);
    }
    if (!byDay.size) return onNoBooking();
    const days = [...byDay.entries()];
    setLoad({ state: "ready", days });
    setDay((d) => (d && byDay.has(d) ? d : days[0][0]));
    setSlot((s) => (s && result.slots.includes(s) ? s : null));
  }, [token, reschedule, onBooked, onNoBooking]);

  useEffect(() => {
    void fetchSlots();
  }, [fetchSlots]);

  /* The submit button that had focus unmounted with the form: land on
     the step's heading so keyboard and screen reader users are here.
     Not on the standalone page load, where it would only jump the scroll;
     a reschedule there follows a button press, so it focuses too. */
  const takeFocus = Boolean(stepTotal) || reschedule;
  useEffect(() => {
    if (takeFocus) headingRef.current?.focus();
  }, [takeFocus]);

  const times = useMemo(
    () => (load.state === "ready" ? (load.days.find(([d]) => d === day)?.[1] ?? []) : []),
    [load, day],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!slot || busy) return;
    setBusy(true);
    setNotice(null);
    const eventId = newEventId();
    const attribution = getAttribution();
    const result = await bookCall({
      token,
      start: slot,
      eventId,
      fbc: attribution.fbc,
      fbp: attribution.fbp,
      gpc: hasGlobalPrivacyControl(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      reschedule,
    }).catch(() => ({ ok: false, reason: "failed" }) as const);
    if (result.ok) {
      if (!result.existing && !result.rescheduled) trackBooking(eventId);
      return onBooked(result.start);
    }
    setBusy(false);
    if (result.reason === "taken") {
      setNotice("That time was just taken. Please pick another one.");
      setSlot(null);
      void fetchSlots();
      return;
    }
    onNoBooking();
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      {stepTotal ? (
        <div className="mb-7 flex items-center justify-between gap-4">
          <p className="flex h-6 items-center gap-2 font-mono text-mono-sm uppercase text-sec-mid">
            <Check aria-hidden strokeWidth={2.5} className="size-3.5 text-acc" />
            Details saved
          </p>
          <Counter current={stepTotal} total={stepTotal} />
        </div>
      ) : null}

      <fieldset className="flex-1" aria-busy={load.state === "loading"}>
        <legend ref={headingRef} tabIndex={-1} className="text-h3 font-bold text-sec-ink outline-none">
          {reschedule ? "Pick a new time" : "Pick a time for your call"}
        </legend>
        <p className="mt-2 text-small text-sec-mid">
          30 minutes on Google Meet. Times shown in {tzLabel()}.
        </p>

        {load.state === "loading" ? (
          <div aria-hidden className="mt-5 flex flex-wrap gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="h-9 w-24 animate-pulse rounded-full border border-sec-line" />
            ))}
            <span className="sr-only">Loading open times</span>
          </div>
        ) : (
          <>
            <div role="radiogroup" aria-label="Day" className="mt-5 flex flex-wrap gap-2">
              {load.days.map(([d, slots]) => (
                <label key={d} className="cursor-pointer">
                  <input
                    type="radio"
                    name="day"
                    value={d}
                    checked={day === d}
                    onChange={() => {
                      setDay(d);
                      setSlot(null);
                    }}
                    className="peer sr-only"
                  />
                  <span className={cn(PILL, day === d ? PILL_ON : PILL_OFF)}>{dayLabel(slots[0])}</span>
                </label>
              ))}
            </div>

            <div
              role="radiogroup"
              aria-label="Time"
              className="mt-5 grid grid-cols-3 gap-2 border-t border-sec-line pt-5 sm:grid-cols-4"
            >
              {times.map((s) => (
                <label key={s} className="cursor-pointer">
                  <input
                    type="radio"
                    name="time"
                    value={s}
                    checked={slot === s}
                    onChange={() => setSlot(s)}
                    className="peer sr-only"
                  />
                  <span className={cn(PILL, "w-full px-2", slot === s ? PILL_ON : PILL_OFF)}>
                    {timeLabel(s)}
                  </span>
                </label>
              ))}
            </div>
          </>
        )}
      </fieldset>

      <div className="mt-6 flex flex-col gap-4">
        <button
          type="submit"
          disabled={!slot || busy}
          className="pill pill-primary w-full disabled:opacity-70"
        >
          <span className="pill-label">
            {busy
              ? reschedule
                ? "Changing"
                : "Booking"
              : slot
                ? `${reschedule ? "Change to" : "Book"} ${timeLabel(slot)}`
                : reschedule
                  ? "Change my call"
                  : "Book my call"}
          </span>
        </button>
        {notice ? (
          <p role="alert" className="text-small text-destructive">
            {notice}
          </p>
        ) : null}
        <button
          type="button"
          onClick={onNoBooking}
          className="self-start text-left text-small text-sec-mid underline underline-offset-2 transition-colors duration-[var(--dur-fast)] hover:text-sec-ink"
        >
          {skipLabel}
        </button>
      </div>
    </form>
  );
}

/* Add-to-calendar for the confirmation: a Google Calendar link and an
   .ics file. The Meet link itself only lives in GHL's confirmation
   email, so the event says where to find it. */
const CALL_MINUTES = 30;
const EVENT_TITLE = "BigSquare strategy call";
const EVENT_DETAILS = "30 minutes with BigSquare. The Google Meet link is in your confirmation email.";

const utcStamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function calendarLinks(start: string): { google: string; ics: string } {
  const from = Date.parse(start);
  const to = from + CALL_MINUTES * 60e3;
  const google = new URL("https://calendar.google.com/calendar/render");
  google.searchParams.set("action", "TEMPLATE");
  google.searchParams.set("text", EVENT_TITLE);
  google.searchParams.set("dates", `${utcStamp(from)}/${utcStamp(to)}`);
  google.searchParams.set("details", EVENT_DETAILS);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BigSquare Marketing//Strategy call//EN",
    "BEGIN:VEVENT",
    `UID:${utcStamp(from)}-strategy-call@bigsquaremarketing.com`,
    `DTSTAMP:${utcStamp(Date.now())}`,
    `DTSTART:${utcStamp(from)}`,
    `DTEND:${utcStamp(to)}`,
    `SUMMARY:${EVENT_TITLE}`,
    `DESCRIPTION:${EVENT_DETAILS}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return { google: google.toString(), ics: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}` };
}

export function bookedLabel(start: string): string {
  const d = new Date(start);
  const day = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(d);
  return `${day} at ${timeLabel(start)} ${tzLabel(start)}`;
}

const CAL_LINK =
  "font-mono text-mono-sm uppercase text-sec-ink underline underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-acc";

/** The booked call: time, where the Meet link is, add-to-calendar.
    Shared by the application's confirmation and /schedule/book/. */
export function BookedDetails({ start }: { start: string }) {
  const links = calendarLinks(start);
  return (
    <>
      <p className="text-body text-sec-ink">{bookedLabel(start)}</p>
      <p className="text-small text-sec-mid">The Google Meet link is in your inbox.</p>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <a href={links.google} target="_blank" rel="noopener noreferrer" className={CAL_LINK}>
          Add to Google Calendar
        </a>
        <a href={links.ics} download="bigsquare-strategy-call.ics" className={CAL_LINK}>
          Download .ics
        </a>
      </div>
    </>
  );
}
