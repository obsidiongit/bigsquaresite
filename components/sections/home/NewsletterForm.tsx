"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { submitForm } from "@/lib/form-action";
import { EASE } from "@/lib/motion";
import { getUtmParams } from "@/lib/utm";
import { cn } from "@/lib/utils";

/* The newsletter capture form (9b.newsletter.md).

   This is the site's FIRST real input, so the field styling here is the
   candidate for a shared <Field> primitive in Phase 3, when the audit
   and contact forms need the same thing. Kept local until there is a
   second caller: one use is not a pattern yet.

   Everything posts through the site's single submit path
   (lib/form-action.ts) with formType "newsletter", the page slug, and
   whatever UTM params the visitor arrived with. No new endpoint.

   NO THANK-YOU PAGE (Brad, 2026-08-25): a newsletter signup must never
   navigate. The confirmation animates in where the form was, the
   visitor keeps their scroll position, and the section carries on. The
   wrapper LOCKS to the form's measured height at submit time, so the
   swap cannot shift the proof row (or anything below it) by a pixel at
   any width; measuring beats hard-coding a min-height, because the form
   is one row on sm+ and a stacked two-row block on mobile. */

type Status = "idle" | "sending" | "done";

function Confirmation({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);

  /* Focus the confirmation as it arrives: the submit button that had
     focus just unmounted, and without this the keyboard user lands back
     on the body. role="status" still announces the text. */
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <motion.p
      ref={ref}
      role="status"
      tabIndex={-1}
      className="absolute inset-0 flex items-center gap-3 text-body text-sec-ink outline-none"
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.45, ease: EASE.house }}
    >
      <motion.span
        aria-hidden
        className="flex size-5 shrink-0 items-center justify-center"
        initial={reduced ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: reduced ? 0 : 0.4,
          ease: EASE.house,
          delay: reduced ? 0 : 0.12,
        }}
      >
        <Check strokeWidth={2} className="size-5 text-sec-acc" />
      </motion.span>
      You are on the list. Watch your inbox.
    </motion.p>
  );
}

export function NewsletterForm() {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const reduced = useReducedMotionSafe();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lockedHeight, setLockedHeight] = useState<number>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();

    setStatus("sending");
    setError(null);

    const result = await submitForm({
      formType: "newsletter",
      page: window.location.pathname,
      utm: getUtmParams(),
      fields: { email },
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
      {/* mode="wait" so only one state is ever in the DOM: a form left
          mounted behind the confirmation would still be in the tab
          order and still be submittable */}
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <Confirmation key="done" reduced={reduced} />
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: EASE.house }}
          >
            <label htmlFor={fieldId} className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id={fieldId}
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Enter your email address"
                aria-describedby={error ? errorId : undefined}
                aria-invalid={error ? true : undefined}
                className={cn(
                  "h-14 w-full min-w-0 rounded-card border bg-paper px-5 sm:flex-1",
                  "text-body text-ink placeholder:text-mid",
                  "transition-colors duration-[var(--dur-fast)]",
                  error
                    ? "border-destructive"
                    : "border-sec-line hover:border-ink",
                )}
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="pill pill-primary h-14 shrink-0 disabled:opacity-70 max-sm:w-full"
              >
                <span className="pill-label">
                  {status === "sending" ? "Sending" : "Join the List"}
                </span>
              </button>
            </div>
            {error ? (
              <p
                id={errorId}
                role="alert"
                className="mt-3 text-small text-destructive"
              >
                {error}
              </p>
            ) : null}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
