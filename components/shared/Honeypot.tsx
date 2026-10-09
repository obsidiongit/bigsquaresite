import { HONEYPOT_FIELD } from "@/lib/lead-client";

/* <Honeypot>: one off-screen text field inside every lead form. People
   never see or reach it (aria-hidden, tabIndex -1, no autofill); form
   bots fill every input they find, and submitForm drops any submission
   where it has a value (lead-funnel.md section 3). Must render inside
   the <form>. */
export function Honeypot() {
  return (
    <div aria-hidden className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );
}
