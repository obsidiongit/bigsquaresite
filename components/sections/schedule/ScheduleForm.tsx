"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { Field } from "@/components/shared/Field";
import { Counter } from "@/components/shared/mono";
import { submitForm } from "@/lib/form-action";
import { EASE } from "@/lib/motion";
import { getUtmParams } from "@/lib/utm";
import { cn } from "@/lib/utils";

/* The /schedule/ STEPPED application (conversion/schedule.md v2.1;
   Brad round 2: "an application that you click through and submit the
   info piece by piece... higher rate of converting"). Five steps, one
   question each: name -> company -> locations -> email -> phone.
   Locations never leads and carries an "Online only" option: we serve
   ecommerce and single-location businesses too (Brad, 2026-08-26).

   Mechanics: ONE <form>; only the current step's inputs are mounted,
   so native validation guards each Next automatically and Enter
   advances. Answers live in state so Back never loses a value. The
   locations step AUTO-ADVANCES on pointer selection (a beat after the
   square meter fills); keyboard arrow-key browsing never advances,
   Enter/Next does. Progress is a row of brand squares filling step by
   step + the mono counter. Focus moves to the new step's input on
   user-driven navigation only.

   Submission and the 6.13 contract are unchanged: single submit path
   (formType "schedule", page slug, UTM), no navigation, in-place
   confirmation, measured height lock, focus to the confirmation. */

/* "Online only" first: we serve ecommerce and single-location
   businesses too (Brad, 2026-08-26: the flow must not read
   franchise-only, which is also why this question sits mid-flow
   instead of leading). Squares are UI weight, not claims. */
const LOCATION_RANGES = [
  { value: "Online only", squares: 6 },
  { value: "1", squares: 1 },
  { value: "2 to 5", squares: 4 },
  { value: "6 to 20", squares: 9 },
  { value: "21 to 100", squares: 16 },
  { value: "100+", squares: 25 },
] as const;

const MAX_SQUARES = 25;

type Answers = {
  locations: string;
  name: string;
  company: string;
  email: string;
  phone: string;
};

const EMPTY_ANSWERS: Answers = {
  locations: "",
  name: "",
  company: "",
  email: "",
  phone: "",
};

type TextStep = {
  kind: "text";
  key: Exclude<keyof Answers, "locations">;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
};
type PickerStep = { kind: "picker" };
type Step = TextStep | PickerStep;

/* Name opens (universal, easy); the locations picker is the mid-flow
   delight beat, never the opener; contact details last. */
const STEPS: Step[] = [
  {
    kind: "text",
    key: "name",
    label: "Your name",
    type: "text",
    autoComplete: "name",
    placeholder: "First and last",
  },
  {
    kind: "text",
    key: "company",
    label: "Your company",
    type: "text",
    autoComplete: "organization",
    placeholder: "The brand name",
  },
  { kind: "picker" },
  {
    kind: "text",
    key: "email",
    label: "Your email",
    type: "email",
    autoComplete: "email",
    placeholder: "you@company.com",
  },
  {
    kind: "text",
    key: "phone",
    label: "Your phone",
    type: "tel",
    autoComplete: "tel",
    placeholder: "(000) 000-0000",
  },
];

const STEP_COUNT = STEPS.length;
const LAST_STEP = STEP_COUNT - 1;
const PICKER_STEP = STEPS.findIndex((s) => s.kind === "picker");

function SquareMeter({ filled, reduced }: { filled: number; reduced: boolean }) {
  return (
    <div aria-hidden className="flex flex-wrap gap-1">
      {Array.from({ length: MAX_SQUARES }, (_, i) => {
        const on = i < filled;
        const cls = cn(
          "size-1.5 rounded-[1px]",
          on ? "bg-acc" : "border border-sec-line",
        );
        if (reduced) return <span key={i} className={cls} />;
        return (
          <motion.span
            key={i}
            initial={false}
            animate={{ scale: on ? 1 : 0.6 }}
            transition={{
              duration: 0.25,
              ease: EASE.house,
              delay: on ? i * 0.012 : 0,
            }}
            className={cls}
          />
        );
      })}
    </div>
  );
}

function StepSquares({ step }: { step: number }) {
  return (
    <div aria-hidden className="flex items-center gap-1.5">
      {Array.from({ length: STEP_COUNT }, (_, i) => (
        <span
          key={i}
          className={cn(
            "size-2 rounded-[2px] transition-colors duration-[var(--dur-base)]",
            i < step && "bg-acc",
            i === step && "border border-acc bg-acc/20",
            i > step && "border border-sec-line",
          )}
        />
      ))}
    </div>
  );
}

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
        Got it. We will set up your call.
      </p>
      <p className="text-small text-sec-mid">
        No long-term contracts. You own your accounts.
      </p>
    </motion.div>
  );
}

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: 28 * dir }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: -20 * dir }),
};

export function ScheduleForm() {
  const fieldId = useId();
  const reduced = useReducedMotionSafe();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [nav, setNav] = useState({ step: 0, dir: 1 });
  const [lockedHeight, setLockedHeight] = useState<number>();
  const navigatedRef = useRef(false);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerRef = useRef(0);

  const { step, dir } = nav;

  const setAnswer = (key: keyof Answers, value: string) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const go = (next: number, direction: number) => {
    navigatedRef.current = true;
    setNav({ step: next, dir: direction });
  };

  useEffect(
    () => () => {
      if (autoRef.current) clearTimeout(autoRef.current);
    },
    [],
  );

  function pickLocations(value: string) {
    setAnswer("locations", value);
    /* Auto-advance only for pointer picks (recorded on pointerdown
       within the last second); arrow-key browsing stays put. The beat
       lets the square meter play before the slide. */
    if (Date.now() - pointerRef.current < 1000 && step === PICKER_STEP) {
      if (autoRef.current) clearTimeout(autoRef.current);
      autoRef.current = setTimeout(
        () => go(PICKER_STEP + 1, 1),
        reduced ? 150 : 550,
      );
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    /* Mid-flow submits (Enter or Next) validate only the mounted
       step's inputs; native validation already passed to get here. */
    if (step < LAST_STEP) {
      if (autoRef.current) clearTimeout(autoRef.current);
      go(step + 1, 1);
      return;
    }

    const form = event.currentTarget;
    setStatus("sending");
    setError(null);

    const result = await submitForm({
      formType: "schedule",
      page: window.location.pathname,
      utm: getUtmParams(),
      fields: { ...answers },
    });

    if (result.ok) {
      setLockedHeight(form.offsetHeight);
      setStatus("done");
      return;
    }
    setStatus("idle");
    setError(result.error ?? "Please check the form and try again.");
  }

  const meterFill =
    LOCATION_RANGES.find((r) => r.value === answers.locations)?.squares ?? 0;
  const current = STEPS[step];

  return (
    <div
      className="relative h-full"
      style={lockedHeight ? { minHeight: lockedHeight } : undefined}
    >
      {/* mode="wait": only one state in the DOM, a mounted form behind
          the confirmation would still be in the tab order (6.13) */}
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <Confirmation key="done" reduced={reduced} />
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: EASE.house }}
            className="flex h-full flex-col"
          >
            {/* Chrome: back, progress squares, counter */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex h-6 items-center">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => go(step - 1, -1)}
                    className="font-mono text-mono-sm uppercase text-sec-mid transition-colors duration-[var(--dur-fast)] hover:text-sec-ink"
                  >
                    &larr; Back
                  </button>
                ) : (
                  <StepSquares step={step} />
                )}
              </div>
              <div className="flex items-center gap-4">
                {step > 0 && <StepSquares step={step} />}
                <Counter current={step + 1} total={STEP_COUNT} />
              </div>
            </div>

            {/* The step viewport: fixed min height so the card never
                jumps between questions at any width */}
            <div className="relative mt-7 min-h-[184px] flex-1">
              <AnimatePresence mode="wait" initial={false} custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={reduced ? undefined : stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: EASE.house }}
                >
                  {current.kind === "picker" ? (
                    <fieldset>
                      <legend className="text-h3 font-bold text-sec-ink">
                        How many locations?
                      </legend>
                      <div className="mt-5">
                        <SquareMeter filled={meterFill} reduced={reduced} />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {LOCATION_RANGES.map((range, i) => {
                          const checked = answers.locations === range.value;
                          return (
                            <label
                              key={range.value}
                              className="cursor-pointer"
                              onPointerDown={() => {
                                pointerRef.current = Date.now();
                              }}
                            >
                              <input
                                type="radio"
                                name="locations"
                                value={range.value}
                                required
                                checked={checked}
                                onChange={() => pickLocations(range.value)}
                                /* keyboard arrival mid-flow: land on the
                                   first pill so arrow keys work at once
                                   (mount-time, never the initial render) */
                                autoFocus={navigatedRef.current && i === 0}
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
                                {range.value}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  ) : (
                    <Field
                      id={`${fieldId}-${current.key}`}
                      label={current.label}
                      labelVariant="question"
                      name={current.key}
                      type={current.type}
                      required
                      autoComplete={current.autoComplete}
                      inputMode={current.type === "tel" ? "tel" : undefined}
                      placeholder={current.placeholder}
                      value={answers[current.key]}
                      onChange={(e) => setAnswer(current.key, e.target.value)}
                      /* mount-time focus: the step mounts after the old
                         one's exit (mode="wait"); never true on the
                         page's initial render */
                      autoFocus={navigatedRef.current}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-2 flex flex-col gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="pill pill-primary w-full disabled:opacity-70"
              >
                <span className="pill-label">
                  {status === "sending"
                    ? "Sending"
                    : step === LAST_STEP
                      ? "Schedule a Call"
                      : "Next"}
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
