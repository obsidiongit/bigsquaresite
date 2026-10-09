"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { EASE } from "@/lib/motion";
import { BookedDetails, TimePicker } from "./TimePicker";

/* The /schedule/book/ card: the pick-a-time step on its own, opened from
   the follow-up and confirmation emails ({{contact.booking_link}}). With
   no call booked it is the picker; with one booked it shows the call and
   offers to change it, so rescheduling stays in the site's design
   instead of GHL's hosted page. The token was verified by the page. */

type Mode =
  | { kind: "pick" }
  | { kind: "booked"; start: string; moved?: boolean }
  | { kind: "change"; start: string }
  | { kind: "call" };

function Settled({
  children,
  reduced,
}: {
  children: React.ReactNode;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /* Focus follows the swap: the button that had it just unmounted (6.13) */
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <motion.div
      ref={ref}
      role="status"
      tabIndex={-1}
      className="flex flex-col items-start gap-4 outline-none"
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: reduced ? 0 : 0.35, ease: EASE.house }}
    >
      <span
        aria-hidden
        className="grid size-10 place-items-center rounded-[10px] bg-acc text-onacc"
      >
        <Check strokeWidth={2.5} className="size-5" />
      </span>
      {children}
    </motion.div>
  );
}

export function BookingPanel({ token }: { token: string }) {
  const reduced = useReducedMotionSafe();
  const [mode, setMode] = useState<Mode>({ kind: "pick" });

  const onBooked = useCallback(
    (start: string) => setMode({ kind: "booked", start }),
    [],
  );
  const onNoBooking = useCallback(() => setMode({ kind: "call" }), []);

  /* Changing: a new time, or back to the current one when nothing fits
     or the calendar fails (the existing call still stands). */
  const current = mode.kind === "change" ? mode.start : null;
  const onMoved = useCallback(
    (start: string) => setMode({ kind: "booked", start, moved: start !== current }),
    [current],
  );
  const onKeep = useCallback(() => {
    if (current) setMode({ kind: "booked", start: current });
  }, [current]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {mode.kind === "pick" ? (
        <motion.div key="pick" exit={reduced ? undefined : { opacity: 0, y: -8 }}>
          <TimePicker token={token} onBooked={onBooked} onNoBooking={onNoBooking} />
        </motion.div>
      ) : mode.kind === "change" ? (
        <motion.div
          key="change"
          initial={reduced ? false : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: reduced ? 0 : 0.28, ease: EASE.house }}
        >
          <TimePicker
            token={token}
            reschedule
            skipLabel="Keep my current time"
            onBooked={onMoved}
            onNoBooking={onKeep}
          />
        </motion.div>
      ) : mode.kind === "booked" ? (
        <Settled key={`booked-${mode.start}`} reduced={reduced}>
          <p className="text-h3 font-bold text-sec-ink">
            {mode.moved ? "Your call is moved." : "You are booked."}
          </p>
          <BookedDetails start={mode.start} />
          <button
            type="button"
            onClick={() => setMode({ kind: "change", start: mode.start })}
            className="pill pill-secondary mt-2"
          >
            <span className="pill-label">Change Time</span>
          </button>
        </Settled>
      ) : (
        <Settled key="call" reduced={reduced}>
          <p className="text-h3 font-bold text-sec-ink">
            Got it. We will call you to set a time.
          </p>
          <p className="text-small text-sec-mid">
            No long-term contracts. You own your accounts.
          </p>
        </Settled>
      )}
    </AnimatePresence>
  );
}
