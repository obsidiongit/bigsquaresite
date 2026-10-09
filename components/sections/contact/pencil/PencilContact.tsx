"use client";
/**
 * The pencil contact page (ported 2026-10-08 from the studio rebuild; formerly review toggle "contact").
 *   left   the offices (Denver, Tampa), the support email and the Obsidion login for clients
 *   right  the form: name, email, company, website, what they need, a monthly budget, a message. Picking a
 *          chip draws a pencil loop round it; the field you're in gets a pencil underline; Send is a pencil
 *          box that scribbles in. It posts through the site's one submit path (lib/form-action, UTMs on).
 */
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { ConsentLine } from "@/components/shared/ConsentLine";
import { Honeypot } from "@/components/shared/Honeypot";
import { submitForm } from "@/lib/form-action";
import { leadMeta, useFormStartedAt } from "@/lib/lead-client";
import { PORTAL_URL, SUPPORT_EMAIL } from "@/lib/site";
import { trackFormLead } from "@/lib/track";
import { getUtmParams } from "@/lib/utm";
import s from "./PencilContact.module.css";

const NEEDS = ["Search & SEO", "Paid ads", "A new website", "Creative & video", "Tracking & reporting", "Not sure yet"];
const BUDGETS = ["Under $5k / mo", "$5k–15k / mo", "$15k–50k / mo", "$50k+ / mo", "Not sure"];

function Loop() {
  return (
    <svg className={s.loop} viewBox="0 0 120 44" preserveAspectRatio="none" aria-hidden="true">
      <path d="M22 6 C60 -2 108 2 115 18 C121 34 84 42 52 41 C22 40 3 34 4 22 C5 12 20 7 44 5" pathLength={1} />
    </svg>
  );
}
function Arrow() {
  return (
    <svg className={s.arrow} viewBox="0 0 32 12" aria-hidden="true">
      <path d="M1 6.6 C9 5.4 18 7.2 29 5.8" pathLength={1} />
      <path d="M22.5 1.2 C25 3 27 4.4 29.4 5.9 C27 7.4 25 8.8 22.8 10.8" pathLength={1} />
    </svg>
  );
}

function Chips({ name, options, multi }: { name: string; options: string[]; multi: boolean }) {
  const [on, setOn] = useState<string[]>([]);
  return (
    <div className={s.chips} role="group">
      {options.map((o) => {
        const picked = on.includes(o);
        return (
          <label key={o} className={s.chip} data-on={picked || undefined}>
            <input
              type={multi ? "checkbox" : "radio"}
              name={name}
              value={o}
              checked={picked}
              onChange={() => setOn((cur) => (multi ? (picked ? cur.filter((x) => x !== o) : [...cur, o]) : [o]))}
            />
            <span>{o}</span>
            <Loop />
          </label>
        );
      })}
    </div>
  );
}

export function PencilContact() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "fail">("idle");
  const startedAt = useFormStartedAt();

  const send = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "sending") return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const meta = leadMeta(form, startedAt.current);
    // lowercase keys: lib/form-action and lib/ghl-lead read these names
    const field = (k: string) => fd.getAll(k).map(String).filter(Boolean).join(", ");
    setState("sending");
    try {
      const res = await submitForm({
        formType: "contact",
        page: window.location.pathname,
        utm: getUtmParams(),
        fields: {
          name: field("name"),
          email: field("email"),
          company: field("company"),
          website: field("website"),
          needs: field("needs"),
          budget: field("budget"),
          message: field("message"),
        },
        ...meta,
      });
      if (res.ok) trackFormLead("contact", meta);
      setState(res.ok ? "done" : "fail");
    } catch {
      setState("fail");
    }
  };

  return (
    <section data-theme="light" className={s.page}>
      <div className="px-gutter-x">
        <div className={`mx-auto max-w-[1200px] ${s.wrap}`}>
          <header className={s.head}>
            <p className={s.kicker}>
              <i /> Contact
            </p>
            <h1 className={s.title}>
              <RoughAnnotation variant="underline" delay={0.5} className="whitespace-nowrap">
                Let&apos;s talk.
              </RoughAnnotation>
            </h1>
            <p className={s.lede}>Tell us about the business and what you want it to do next. A real person on the team reads every message and writes back.</p>
          </header>

          <aside className={s.side}>
            <div className={s.block}>
              <span className={s.label}>Offices</span>
              <p className={s.city}>
                Denver, <span>Colorado</span>
              </p>
              <p className={s.city}>
                Tampa, <span>Florida</span>
              </p>
            </div>
            <div className={s.block}>
              <span className={s.label}>Email</span>
              <a href={`mailto:${SUPPORT_EMAIL}`} className={s.portal}>
                {SUPPORT_EMAIL}
              </a>
              <p className={s.small}>
                Rather talk now? <Link href="/schedule/">Book a call</Link>
              </p>
            </div>
            <div className={s.block}>
              <span className={s.label}>Already a client?</span>
              <a href={PORTAL_URL} target="_blank" rel="noopener" className={s.portal}>
                Log in to Obsidion <Arrow />
              </a>
              <p className={s.small}>Your numbers, any day.</p>
            </div>
          </aside>

          {state === "done" ? (
            <div className={s.done} role="status">
              <svg className={s.tick} viewBox="0 0 40 30" aria-hidden="true">
                <path d="M3 16 L14 26 L37 3" pathLength={1} />
              </svg>
              <h2>Got it.</h2>
              <p>Thanks. We&apos;ll read it and get back to you.</p>
            </div>
          ) : (
            <form className={s.form} onSubmit={send}>
              <Honeypot />
              <div className={s.row}>
                <label className={s.field}>
                  <span>Your name</span>
                  <input name="name" required autoComplete="name" />
                  <i />
                </label>
                <label className={s.field}>
                  <span>Email</span>
                  <input name="email" type="email" required autoComplete="email" />
                  <i />
                </label>
              </div>
              <div className={s.row}>
                <label className={s.field}>
                  <span>Company</span>
                  <input name="company" autoComplete="organization" />
                  <i />
                </label>
                <label className={s.field}>
                  <span>Website</span>
                  <input name="website" placeholder="yourbusiness.com" autoComplete="url" />
                  <i />
                </label>
              </div>
              <fieldset className={s.set}>
                <legend>What do you need?</legend>
                <Chips name="needs" options={NEEDS} multi />
              </fieldset>
              <fieldset className={s.set}>
                <legend>Monthly budget</legend>
                <Chips name="budget" options={BUDGETS} multi={false} />
              </fieldset>
              <label className={`${s.field} ${s.area}`}>
                <span>Anything else?</span>
                <textarea name="message" rows={4} placeholder="Where things are now, what's working, what isn't." />
                <i />
              </label>
              <div className={s.send}>
                <button type="submit" className={s.button} disabled={state === "sending"}>
                  <svg className={s.box} viewBox="0 0 300 64" preserveAspectRatio="none" aria-hidden="true">
                    <clipPath id="send-inside">
                      <rect x="2" y="2" width="296" height="60" rx="3" />
                    </clipPath>
                    <path className={s.boxFill} d={Array.from({ length: 38 }, (_, i) => `${i ? "L" : "M"} ${-10 + i * 8.6} ${i % 2 ? -26 : 90}`).join(" ")} pathLength={1} clipPath="url(#send-inside)" />
                    <path className={s.boxLine} d="M4 3 C80 1 200 4 297 2 C298 22 296 42 298 62 C200 60 100 63 2 61 C3 42 1 22 4 3 M10 1 C100 3 190 0 280 3" pathLength={1} />
                  </svg>
                  <span>{state === "sending" ? "Sending…" : "Send it"}</span>
                  <Arrow />
                </button>
                {state === "fail" && <p className={s.fail}>That didn&apos;t send. Try again, or email {SUPPORT_EMAIL}.</p>}
              </div>
              <ConsentLine />
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
