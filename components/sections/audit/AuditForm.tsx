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

/* The /audit/ request form (audit.md v2): ONE screen, all fields
   visible. Stepped is /schedule/'s signature; the secondary path keeps
   friction low instead. Shared Field anatomy (6.13), the pill option
   grammar from the /schedule/ picker: radios for the locations count
   ("Online only" first, audience rule), CHECKBOXES for what is running
   now. "None of these" is exclusive: picking it clears the channels,
   picking a channel clears it.

   6.13 contract: single submit path (formType "audit"), no navigation,
   in-place confirmation with the measured height lock, focus moves to
   the confirmation. */

const LOCATION_RANGES = [
  "Online only",
  "1",
  "2 to 5",
  "6 to 20",
  "21 to 100",
  "100+",
] as const;

const NONE = "None of these";
const CHANNELS = ["Search ads", "Social ads", "SEO", "Email", NONE] as const;

const TEXT_FIELDS = [
  { key: "name", label: "Your name", type: "text", autoComplete: "name", placeholder: "First and last" },
  { key: "email", label: "Your email", type: "email", autoComplete: "email", placeholder: "you@company.com" },
  { key: "phone", label: "Your phone", type: "tel", autoComplete: "tel", placeholder: "(000) 000-0000" },
  { key: "company", label: "Your company", type: "text", autoComplete: "organization", placeholder: "The brand name" },
] as const;

type Status = "idle" | "sending" | "done";

function OptionPill({
  checked,
  children,
}: {
  checked: boolean;
  children: React.ReactNode;
}) {
  return (
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
      {children}
    </span>
  );
}

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
        Got it. Your audit is in the queue.
      </p>
      <p className="text-small text-sec-mid">
        We will reach out at the email you gave us.
      </p>
    </motion.div>
  );
}

export function AuditForm() {
  const fieldId = useId();
  const reduced = useReducedMotionSafe();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState("");
  const [running, setRunning] = useState<string[]>([]);
  const [lockedHeight, setLockedHeight] = useState<number>();

  function toggleChannel(channel: string) {
    setRunning((prev) => {
      if (prev.includes(channel))
        return prev.filter((c) => c !== channel);
      /* "None of these" is exclusive both ways */
      if (channel === NONE) return [NONE];
      return [...prev.filter((c) => c !== NONE), channel];
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError(null);

    const result = await submitForm({
      formType: "audit",
      page: window.location.pathname,
      utm: getUtmParams(),
      fields: {
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        company: String(data.get("company") ?? ""),
        website: String(data.get("website") ?? ""),
        locations,
        running: running.join(", "),
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
            <Field
              id={`${fieldId}-website`}
              label="Your website"
              name="website"
              type="text"
              required
              autoComplete="url"
              inputMode="url"
              placeholder="yourcompany.com"
            />

            <fieldset>
              <legend className="font-mono text-mono-sm uppercase text-sec-mid">
                How many locations?
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {LOCATION_RANGES.map((range) => (
                  <label key={range} className="cursor-pointer">
                    <input
                      type="radio"
                      name="locations"
                      value={range}
                      required
                      checked={locations === range}
                      onChange={() => setLocations(range)}
                      className="peer sr-only"
                    />
                    <OptionPill checked={locations === range}>
                      {range}
                    </OptionPill>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-mono text-mono-sm uppercase text-sec-mid">
                What are you running now?
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {CHANNELS.map((channel) => {
                  const checked = running.includes(channel);
                  return (
                    <label key={channel} className="cursor-pointer">
                      <input
                        type="checkbox"
                        name="running"
                        value={channel}
                        checked={checked}
                        onChange={() => toggleChannel(channel)}
                        className="peer sr-only"
                      />
                      <OptionPill checked={checked}>{channel}</OptionPill>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-1 flex flex-col gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="pill pill-primary w-full disabled:opacity-70"
              >
                <span className="pill-label">
                  {status === "sending" ? "Sending" : "Get My Audit"}
                </span>
              </button>
              {error ? (
                <p role="alert" className="text-small text-destructive">
                  {error}
                </p>
              ) : null}
              <p className="text-small text-sec-mid">
                No long-term contracts. You own your accounts.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
