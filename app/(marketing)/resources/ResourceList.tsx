"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { Field } from "@/components/shared/Field";
import { BracketIndex, Chip } from "@/components/shared/mono";
import { submitForm } from "@/lib/form-action";
import { EASE } from "@/lib/motion";
import type { Resource } from "@/lib/resources";
import { getUtmParams } from "@/lib/utm";
import { cn } from "@/lib/utils";

/* <ResourceList>: the ruled list of lead magnets (6.10 family) with
   the request form INSIDE the row. "Get It" opens name + email under
   that row (height morph, no fade-in appear; reduced motion swaps
   instantly). Submit goes through the single submitForm path
   (formType "lead-magnet", the resource slug in fields) and the
   confirmation replaces the form in place with the 6.13 height lock.
   The assets do not exist yet, so the state says so out loud: a
   visible [PLACEHOLDER] line, never a fake download. */

type Status = "idle" | "sending" | "done";

function Confirmation({
  resource,
  reduced,
}: {
  resource: Resource;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <motion.div
      ref={ref}
      role="status"
      tabIndex={-1}
      className="absolute inset-0 flex flex-col items-start justify-center gap-3 outline-none"
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
        Got it. {resource.title} is on its way.
      </p>
      <p className="max-w-[52ch] font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
        [PLACEHOLDER: this file is still in production. The request is
        logged and the file goes out by email when it is ready]
      </p>
    </motion.div>
  );
}

function RequestForm({
  resource,
  reduced,
}: {
  resource: Resource;
  reduced: boolean;
}) {
  const fieldId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lockedHeight, setLockedHeight] = useState<number>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError(null);

    const result = await submitForm({
      formType: "lead-magnet",
      page: window.location.pathname,
      utm: getUtmParams(),
      fields: {
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        resource: resource.slug,
        resourceTitle: resource.title,
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
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <Confirmation key="done" resource={resource} reduced={reduced} />
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: EASE.house }}
            className="flex flex-col gap-5"
          >
            <p className="max-w-[52ch] font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
              [PLACEHOLDER: asset not built yet. Leave your email and we
              send the {resource.format.toLowerCase()} when it is ready]
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id={`${fieldId}-name`}
                label="Your name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="First and last"
                autoFocus
              />
              <Field
                id={`${fieldId}-email`}
                label="Your email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
              />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={status === "sending"}
                className="pill pill-primary disabled:opacity-70 max-sm:w-full"
              >
                <span className="pill-label">
                  {status === "sending" ? "Sending" : "Send It to Me"}
                </span>
              </button>
              {error ? (
                <p role="alert" className="text-small text-destructive">
                  {error}
                </p>
              ) : (
                <p className="text-small text-sec-mid">
                  No spam. One email with the file.
                </p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ResourceList({ resources }: { resources: Resource[] }) {
  const reduced = useReducedMotionSafe();
  const [open, setOpen] = useState<string | null>(null);
  const panelId = useId();

  /* Deep link from a blog post's resource row (/resources/#slug):
     open that row's form on arrival. */
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && resources.some((r) => r.slug === hash)) setOpen(hash);
  }, [resources]);

  return (
    <div>
      {resources.map((resource, i) => {
        const isOpen = open === resource.slug;
        const id = `${panelId}-${resource.slug}`;
        return (
          <div key={resource.slug} id={resource.slug} className="scroll-mt-28">
            <SeparatorIn delay={i * 0.08} />
            <Reveal delay={i * 0.08}>
              <div className="grid gap-4 py-6 md:grid-cols-12 md:gap-6 md:py-7">
                <div className="flex items-center gap-4 md:col-span-3 md:flex-col md:items-start md:gap-3">
                  <BracketIndex n={i + 1} className="text-sec-acc" />
                  <Chip>{resource.format}</Chip>
                </div>
                <div className="md:col-span-6">
                  <h2 className="max-w-[24ch] text-h3 font-bold text-sec-ink">
                    {resource.title}
                  </h2>
                  <p className="mt-2 max-w-[56ch] text-body text-sec-mid">
                    {resource.line}
                  </p>
                  <p className="mt-3 font-mono text-mono-sm uppercase text-sec-mid">
                    For: {resource.audience}
                  </p>
                </div>
                <div className="md:col-span-3 md:flex md:items-start md:justify-end">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? null : resource.slug)}
                    className={cn(
                      "pill pill-sm",
                      isOpen ? "pill-primary" : "pill-secondary",
                    )}
                  >
                    <span className="pill-label">{isOpen ? "Close" : "Get It"}</span>
                  </button>
                </div>
              </div>

              {reduced ? (
                isOpen && (
                  <div id={id} className="pb-8 md:pl-[calc(25%+12px)]">
                    <RequestForm resource={resource} reduced />
                  </div>
                )
              ) : (
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={id}
                      key="panel"
                      className="overflow-hidden md:pl-[calc(25%+12px)]"
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.4, ease: EASE.soft }}
                    >
                      <div className="pb-8">
                        <RequestForm resource={resource} reduced={false} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </Reveal>
          </div>
        );
      })}
      <SeparatorIn delay={resources.length * 0.08} />
    </div>
  );
}
