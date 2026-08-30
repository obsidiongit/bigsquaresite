"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { ConsentLine } from "@/components/shared/ConsentLine";
import { Field } from "@/components/shared/Field";
import { Counter } from "@/components/shared/mono";
import { submitForm } from "@/lib/form-action";
import { withUtm } from "@/lib/funnels/href";
import type { ApplyFunnel } from "@/lib/funnels/registry";
import { EASE } from "@/lib/motion";
import { track, trackLead } from "@/lib/track";
import { getUtmParams } from "@/lib/utm";
import { cn } from "@/lib/utils";

/* The application funnel form (application-funnel-template.md): one
   question per step, a progress bar, keyboard friendly. The question
   set is the spec's, reworded so single-location and online-only
   businesses read as equals (Brad, 2026-08-26): "Online only" is an
   industry answer and a locations answer, and "1" is a fine answer.

   Mechanics mirror the /schedule/ stepped form: ONE <form>, only the
   current step's inputs mounted, so native validation guards each
   Next and Enter advances. Answers live in state so Back never loses
   a value. Picker steps auto-advance on a pointer pick (a beat later);
   keyboard arrow browsing never advances, Enter/Next does.

   Submit posts through the single submitForm path (formType "apply",
   the page slug, UTMs, every answer as a field plus `qualified`), fires
   the lead events, then routes to /thanks/[slug]/ with the UTMs on the
   URL. This is the one form on the site that navigates on success
   (6.13: the funnel's page transition is the point).

   Reduced motion: no step slide, just the swap. */

const INDUSTRIES = [
  "Franchise",
  "Home services",
  "Legal",
  "Healthcare",
  "Online only",
  "Other",
] as const;

const LOCATIONS = ["1", "2 to 5", "6 to 20", "21 to 100", "100+", "Online only"] as const;

/* [PLACEHOLDER: confirm the budget ranges and the qualifying floor] */
const BUDGETS = [
  "Nothing yet",
  "Under $5,000",
  "$5,000 to $15,000",
  "$15,000 to $50,000",
  "$50,000+",
] as const;

/* Spec: qualified = 6+ locations AND budget above the floor. */
const QUALIFIED_LOCATIONS = new Set<string>(["6 to 20", "21 to 100", "100+"]);
const BUDGET_FLOOR_INDEX = 3; // "$15,000 to $50,000" and up

type Answers = {
  business: string;
  website: string;
  industry: string;
  locations: string;
  budget: string;
  blocker: string;
  name: string;
  email: string;
  phone: string;
};

const EMPTY: Answers = {
  business: "",
  website: "",
  industry: "",
  locations: "",
  budget: "",
  blocker: "",
  name: "",
  email: "",
  phone: "",
};

type FieldDef = {
  key: keyof Answers;
  label: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  hideLabel?: boolean;
};

type Step =
  | { kind: "fields"; question: string; hint?: string; fields: FieldDef[] }
  | {
      kind: "picker";
      key: keyof Answers;
      question: string;
      hint?: string;
      options: readonly string[];
      note?: string;
    };

const STEPS: Step[] = [
  {
    kind: "fields",
    question: "Tell us about the business.",
    fields: [
      { key: "business", label: "Business name", autoComplete: "organization", placeholder: "The brand name" },
      { key: "website", label: "Website", inputMode: "url", autoComplete: "url", placeholder: "yourbrand.com" },
    ],
  },
  {
    kind: "picker",
    key: "industry",
    question: "What kind of business is it?",
    options: INDUSTRIES,
  },
  {
    kind: "picker",
    key: "locations",
    question: "How many locations?",
    hint: "One counts. Online only counts too.",
    options: LOCATIONS,
  },
  {
    kind: "picker",
    key: "budget",
    question: "What do you spend on ads each month?",
    hint: "A rough number is fine.",
    options: BUDGETS,
    note: "[PLACEHOLDER: confirm budget ranges]",
  },
  {
    kind: "fields",
    question: "What is the biggest thing holding growth back?",
    fields: [
      { key: "blocker", label: "Your answer", hideLabel: true, placeholder: "One sentence is fine" },
    ],
  },
  {
    kind: "fields",
    question: "Where do we reach you?",
    fields: [
      { key: "name", label: "Your name", autoComplete: "name", placeholder: "First and last" },
      { key: "email", label: "Your email", type: "email", autoComplete: "email", placeholder: "you@company.com" },
      { key: "phone", label: "Your phone", type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "(000) 000-0000" },
    ],
  },
];

const STEP_COUNT = STEPS.length;
const LAST_STEP = STEP_COUNT - 1;

/* One-to-one SMS consent (TCPA/CTIA, legal-pages-plan.md): shown next
   to an UNCHECKED checkbox on the contact step. The recorded string
   must equal the rendered sentence exactly, so the JSX below renders
   these two parts with the legal-page links swapped into the tail. The
   box never gates submission; it gates whether we may text. */
const SMS_CONSENT_BODY =
  "I agree to get text messages from BigSquare Marketing about this request at the number I gave. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.";
const SMS_CONSENT_TEXT = `${SMS_CONSENT_BODY} See our Privacy Policy and Terms.`;

type Status = "idle" | "sending";

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: 28 * dir }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: -20 * dir }),
};

function ProgressBar({ step }: { step: number }) {
  return (
    <div
      role="progressbar"
      aria-label="Application progress"
      aria-valuemin={1}
      aria-valuemax={STEP_COUNT}
      aria-valuenow={step + 1}
      className="h-0.5 w-full overflow-hidden rounded-full bg-sec-line"
    >
      <div
        className="h-full origin-left bg-sec-acc transition-transform duration-[var(--dur-slow)] ease-house motion-reduce:transition-none"
        style={{ transform: `scaleX(${(step + 1) / STEP_COUNT})` }}
      />
    </div>
  );
}

export function ApplyForm({
  slug,
  funnel,
}: {
  slug: string;
  funnel: ApplyFunnel;
}) {
  const fieldId = useId();
  const router = useRouter();
  const reduced = useReducedMotionSafe();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [sms, setSms] = useState<{ checked: boolean; at: string | null }>({
    checked: false,
    at: null,
  });
  const [nav, setNav] = useState({ step: 0, dir: 1 });
  const navigatedRef = useRef(false);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerRef = useRef(0);

  const { step, dir } = nav;
  const current = STEPS[step];

  const setAnswer = (key: keyof Answers, value: string) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const go = (next: number, direction: number) => {
    navigatedRef.current = true;
    setError(null);
    setNav({ step: next, dir: direction });
  };

  useEffect(
    () => () => {
      if (autoRef.current) clearTimeout(autoRef.current);
    },
    [],
  );

  function pick(key: keyof Answers, value: string) {
    setAnswer(key, value);
    /* Auto-advance only for pointer picks (the change lands within a
       few ms of pointerdown; 500ms is the window); arrow-key browsing
       stays put. The beat lets the pill fill read before the swap. */
    if (Date.now() - pointerRef.current < 500 && step < LAST_STEP) {
      if (autoRef.current) clearTimeout(autoRef.current);
      autoRef.current = setTimeout(() => go(step + 1, 1), reduced ? 120 : 380);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    if (step < LAST_STEP) {
      if (autoRef.current) clearTimeout(autoRef.current);
      go(step + 1, 1);
      return;
    }

    setStatus("sending");
    setError(null);

    const utm = getUtmParams();
    const qualified =
      QUALIFIED_LOCATIONS.has(answers.locations) &&
      BUDGETS.indexOf(answers.budget as (typeof BUDGETS)[number]) >= BUDGET_FLOOR_INDEX;

    const result = await submitForm({
      formType: "apply",
      page: window.location.pathname,
      utm,
      fields: { ...answers, funnel: slug, qualified },
      smsConsent: {
        checked: sms.checked,
        text: SMS_CONSENT_TEXT,
        ...(sms.checked && sms.at ? { checkedAt: sms.at } : {}),
      },
    });

    if (!result.ok) {
      setStatus("idle");
      setError(result.error ?? "Please check the form and try again.");
      return;
    }

    trackLead({ funnel: slug, qualified });
    if (qualified) track("qualified_lead", { funnel: slug });
    router.push(withUtm(`/thanks/${funnel.thanksSlug}/`, utm));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {/* Chrome: back, counter, then the progress bar */}
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
            <span className="font-mono text-mono-sm uppercase text-sec-mid">
              Start here
            </span>
          )}
        </div>
        <Counter current={step + 1} total={STEP_COUNT} />
      </div>
      <ProgressBar step={step} />

      {/* The step viewport */}
      <div className="relative mt-8 min-h-[236px]">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={reduced ? undefined : stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduced ? 0 : 0.28, ease: EASE.house }}
          >
            {current.kind === "picker" ? (
              <fieldset>
                <legend className="text-h3 font-bold text-sec-ink">
                  {current.question}
                </legend>
                {current.hint ? (
                  <p className="mt-2 text-small text-sec-mid">{current.hint}</p>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  {current.options.map((option, i) => {
                    const checked = answers[current.key] === option;
                    return (
                      <label
                        key={option}
                        className="cursor-pointer"
                        onPointerDown={() => {
                          pointerRef.current = Date.now();
                        }}
                      >
                        <input
                          type="radio"
                          name={current.key}
                          value={option}
                          required
                          checked={checked}
                          onChange={() => pick(current.key, option)}
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
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {current.note ? (
                  <p className="mt-4 font-mono text-mono-sm uppercase text-sec-mid">
                    {current.note}
                  </p>
                ) : null}
              </fieldset>
            ) : (
              <div>
                <h2 className="text-h3 font-bold text-sec-ink">{current.question}</h2>
                {current.hint ? (
                  <p className="mt-2 text-small text-sec-mid">{current.hint}</p>
                ) : null}
                <div className="mt-5 flex flex-col gap-4">
                  {current.fields.map((f, i) => (
                    <Field
                      key={f.key}
                      id={`${fieldId}-${f.key}`}
                      name={f.key}
                      label={f.label}
                      hideLabel={f.hideLabel}
                      type={f.type ?? "text"}
                      required
                      autoComplete={f.autoComplete}
                      inputMode={f.inputMode}
                      placeholder={f.placeholder}
                      value={answers[f.key]}
                      onChange={(e) => setAnswer(f.key, e.target.value)}
                      /* mount-time focus after user-driven navigation
                         only; never on the page's initial render */
                      autoFocus={navigatedRef.current && i === 0}
                    />
                  ))}
                </div>

                {/* SMS consent on the contact step only: unchecked by
                    default, never required. Checking it stamps the
                    timestamp that rides with the submission. */}
                {step === LAST_STEP ? (
                  <label className="mt-5 flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      name="smsConsent"
                      checked={sms.checked}
                      onChange={(e) =>
                        setSms(
                          e.target.checked
                            ? { checked: true, at: new Date().toISOString() }
                            : { checked: false, at: null },
                        )
                      }
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-[4px] border",
                        "transition-colors duration-[var(--dur-fast)]",
                        "peer-focus-visible:outline-2 peer-focus-visible:outline-acc peer-focus-visible:outline-offset-2",
                        sms.checked
                          ? "border-acc bg-acc text-onacc"
                          : "border-sec-line bg-paper",
                      )}
                    >
                      {sms.checked ? (
                        <Check strokeWidth={3} className="size-3.5" />
                      ) : null}
                    </span>
                    <span className="text-small text-sec-mid">
                      {SMS_CONSENT_BODY} See our{" "}
                      <Link
                        href="/privacy-policy/"
                        className="underline underline-offset-2 transition-colors duration-[var(--dur-fast)] hover:text-sec-ink"
                      >
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/terms/"
                        className="underline underline-offset-2 transition-colors duration-[var(--dur-fast)] hover:text-sec-ink"
                      >
                        Terms
                      </Link>
                      .
                    </span>
                  </label>
                ) : null}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          data-sfx={step === LAST_STEP ? "" : undefined}
          className="pill pill-primary w-full disabled:opacity-70"
        >
          <span className="pill-label">
            {status === "sending"
              ? "Sending"
              : step === LAST_STEP
                ? funnel.submitLabel
                : "Next"}
          </span>
        </button>
        {error ? (
          <p role="alert" className="text-small text-destructive">
            {error}
          </p>
        ) : null}
        {step === LAST_STEP ? <ConsentLine /> : null}
      </div>
    </form>
  );
}
