"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { Field } from "@/components/shared/Field";
import { submitForm } from "@/lib/form-action";
import { EASE } from "@/lib/motion";
import { getUtmParams } from "@/lib/utm";
import { cn } from "@/lib/utils";

/* The /contact/ form (contact.md v2): one quiet card. Shared Field
   anatomy (6.13); the message is a textarea on the same anatomy (the
   one place the site needs one, so it lives here until a second
   consumer earns it a shared home). Locations is the pill radio row
   with "Online only" first (audience rule: never franchise-only).

   6.13 contract: single submit path (formType "contact"), no
   navigation, in-place confirmation with the measured height lock,
   focus to the confirmation. */

const LOCATION_RANGES = [
  "Online only",
  "1",
  "2 to 5",
  "6 to 20",
  "21 to 100",
  "100+",
] as const;

const TEXT_FIELDS = [
  { key: "name", label: "Your name", type: "text", autoComplete: "name", placeholder: "First and last" },
  { key: "email", label: "Your email", type: "email", autoComplete: "email", placeholder: "you@company.com" },
  { key: "phone", label: "Your phone", type: "tel", autoComplete: "tel", placeholder: "(000) 000-0000" },
  { key: "company", label: "Your company", type: "text", autoComplete: "organization", placeholder: "The brand name" },
] as const;

type Status = "idle" | "sending" | "done";

function Confirmation({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  /* Focus the confirmation as it arrives: the submit button that had
     focus just unmounted (6.13). role="status" announces the text. */
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <motion.div
      ref={ref}
      role="status"
      tabIndex={-1}
      className="absolute inset-0 flex flex-col items-start justify-center gap-4 outline-none"
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.45, ease: EASE.house }}
    >
      <motion.span
        aria-hidden
        className="grid size-10 place-items-center rounded-[10px] bg-acc text-onacc"
        initial={reduced ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: reduced ? 0 : 0.4,
          ease: EASE.house,
          delay: reduced ? 0 : 0.12,
        }}
      >
        <Check strokeWidth={2.5} className="size-5" />
      </motion.span>
      <p className="text-h3 font-bold text-sec-ink">
        Got it. We will get back to you.
      </p>
      <p className="text-small text-sec-mid">
        Want to talk sooner? <a href="/schedule/" className="underline">Schedule a Call</a>.
      </p>
    </motion.div>
  );
}

export function ContactForm() {
  const fieldId = useId();
  const reduced = useReducedMotionSafe();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState("");
  const [lockedHeight, setLockedHeight] = useState<number>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError(null);

    const result = await submitForm({
      formType: "contact",
      page: window.location.pathname,
      utm: getUtmParams(),
      fields: {
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        company: String(data.get("company") ?? ""),
        locations,
        message: String(data.get("message") ?? ""),
      },
    });

    if (result.ok) {
      setLockedHeight(form.offsetHeight);
      setStatus("done");
      return;
    }
    setStatus("idle");
    setError(result.error ?? "Please check the form and try again.");
  }

  return (
    <div
      className="relative"
      style={lockedHeight ? { minHeight: lockedHeight } : undefined}
    >
      {/* mode="wait": a mounted form behind the confirmation would
          still be in the tab order (6.13) */}
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <Confirmation key="done" reduced={reduced} />
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: EASE.house }}
            className="flex flex-col gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {TEXT_FIELDS.map((f) => (
                <Field
                  key={f.key}
                  id={`${fieldId}-${f.key}`}
                  label={f.label}
                  name={f.key}
                  type={f.type}
                  required
                  autoComplete={f.autoComplete}
                  inputMode={f.type === "tel" ? "tel" : undefined}
                  placeholder={f.placeholder}
                />
              ))}
            </div>

            <fieldset>
              <legend className="font-mono text-mono-sm uppercase text-sec-mid">
                How many locations?
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {LOCATION_RANGES.map((range) => {
                  const checked = locations === range;
                  return (
                    <label key={range} className="cursor-pointer">
                      <input
                        type="radio"
                        name="locations"
                        value={range}
                        required
                        checked={checked}
                        onChange={() => setLocations(range)}
                        className="peer sr-only"
                      />
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-3.5 py-2",
                          "text-small font-medium whitespace-nowrap",
                          "transition-colors duration-[var(--dur-fast)]",
                          "peer-focus-visible:outline-2 peer-focus-visible:outline-acc peer-focus-visible:outline-offset-2",
                          checked
                            ? "border-acc bg-acc text-onacc"
                            : "border-sec-line text-sec-ink hover:border-ink",
                        )}
                      >
                        {range}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label
                htmlFor={`${fieldId}-message`}
                className="block font-mono text-mono-sm uppercase text-sec-mid"
              >
                Your message
              </label>
              {/* The 6.13 field anatomy at textarea scale: paper face,
                  radius 16, sec-line border darkening on hover */}
              <textarea
                id={`${fieldId}-message`}
                name="message"
                required
                rows={5}
                placeholder="What do you want to grow?"
                className={cn(
                  "mt-2 w-full min-w-0 resize-y rounded-card border bg-paper px-5 py-4",
                  "text-body text-ink placeholder:text-mid",
                  "transition-colors duration-[var(--dur-fast)]",
                  "border-sec-line hover:border-ink",
                )}
              />
            </div>

            <div className="mt-1 flex flex-col gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="pill pill-primary w-full disabled:opacity-70"
              >
                <span className="pill-label">
                  {status === "sending" ? "Sending" : "Send the Message"}
                </span>
              </button>
              {error ? (
                <p role="alert" className="text-small text-destructive">
                  {error}
                </p>
              ) : null}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
