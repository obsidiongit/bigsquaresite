"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { Section } from "@/components/shared/Section";
import { Slab } from "@/components/shared/Slab";
import { SERVICE_GROUPS_HOME, SERVICES_FLAT, groupBase } from "@/lib/home-services";
import { EDGE } from "@/lib/layout";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ServicePhoto } from "./ServicePhoto";
import { ArrowIcon, ServicesHeader, runName } from "./shared";

/* Services, take "slab" (review toggle lib/lab "servicesLook",
   2026-10-09). The catalog moves onto the blue slab, the surface that
   carries the top of the page (featured work) and the bottom (the first
   90 days), so the middle of the page wears it too. Three group tabs in
   the 90-day slab's chip style (active inverted to white); under them
   one group at a time as big white rows with the menu slab's square
   bullet (55% white, solid and a quarter turn on hover). On the right a
   paper card shows the pointed-at service: its photo as blue squares
   (the photo comes through if you stay), the one-liner, and the link.

   Every group's links stay in the page (inactive panels are `hidden`),
   so crawlers and screen readers get all 15. Tabs follow the ARIA tab
   pattern (arrow keys move between them). Mobile: no card; each row
   carries its one-liner. No pencil underline (data-hand-off). */

export function ServicesSlab() {
  const reduced = useReducedMotionSafe();
  const [tab, setTab] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  /* the card shows the pointed-at service, else the tab's first */
  const shown = hover ?? groupBase(tab);
  const current = SERVICES_FLAT[shown];

  const pick = (t: number) => {
    setTab(t);
    setHover(null);
  };

  const onTabKey = (e: React.KeyboardEvent) => {
    const n = SERVICE_GROUPS_HOME.length;
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const t = (tab + d + n) % n;
    pick(t);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[t]?.focus();
  };

  return (
    <Section theme="light" anchor="services">
      <div className={cn(EDGE, "relative z-10")}>
        <ServicesHeader />

        <Slab className="mt-12 md:mt-16" contentClassName="p-[clamp(20px,4vw,56px)]">
          <div data-hand-off>
            <div ref={tabsRef} role="tablist" aria-label="Service groups" onKeyDown={onTabKey} className="flex flex-wrap gap-2">
              {SERVICE_GROUPS_HOME.map((group, g) => (
                <button
                  key={group.title}
                  type="button"
                  role="tab"
                  id={`svc-tab-${g}`}
                  aria-selected={tab === g}
                  aria-controls={`svc-panel-${g}`}
                  tabIndex={tab === g ? 0 : -1}
                  onClick={() => pick(g)}
                  data-sfx=""
                  className={cn(
                    "flex items-center gap-2.5 rounded-full px-4 py-2 font-mono text-mono-sm uppercase tabular-nums transition-colors duration-300",
                    tab === g ? "bg-onacc text-acc" : "border border-sec-line text-sec-mid hover:border-onacc hover:text-onacc",
                  )}
                >
                  {group.title}
                  <span className={cn(tab === g ? "text-acc/60" : "text-sec-mid/80")}>{group.items.length}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-10 md:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] xl:gap-20">
              {/* ---- the rows ---------------------------------------- */}
              <div onPointerLeave={() => setHover(null)}>
                {SERVICE_GROUPS_HOME.map((group, g) => {
                  const base = groupBase(g);
                  return (
                    <motion.ul
                      key={group.title}
                      id={`svc-panel-${g}`}
                      role="tabpanel"
                      aria-labelledby={`svc-tab-${g}`}
                      hidden={tab !== g}
                      initial={false}
                      animate={tab === g ? "show" : "hide"}
                      variants={{ show: { transition: { staggerChildren: reduced ? 0 : 0.045 } }, hide: {} }}
                      className="border-t border-sec-line"
                    >
                      {group.items.map((item, k) => {
                        const i = base + k;
                        const lit = hover === i;
                        return (
                          <motion.li
                            key={item.href}
                            variants={{
                              hide: reduced ? {} : { opacity: 0, y: 18 },
                              show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE.house } },
                            }}
                          >
                            <Link
                              href={item.href}
                              title={item.label}
                              onPointerEnter={() => setHover(i)}
                              onFocus={() => setHover(i)}
                              className="group/row flex items-center gap-4 border-b border-sec-line py-4 md:gap-5 md:py-5"
                            >
                              <span
                                aria-hidden
                                className={cn(
                                  "size-[10px] shrink-0 bg-onacc transition-[opacity,rotate] duration-[400ms] ease-house",
                                  lit ? "rotate-90 opacity-100" : "opacity-55",
                                )}
                              />
                              <span className="min-w-0 flex-1">
                                <span
                                  className={cn(
                                    "block font-display text-[clamp(24px,12px+1.9vw,40px)] leading-[1.12] tracking-[-0.02em] text-sec-ink transition-opacity duration-[250ms] alt-none",
                                    hover !== null && !lit && "lg:opacity-45",
                                  )}
                                >
                                  {runName(item.label)}
                                </span>
                                <span className="mt-1.5 block text-small text-sec-mid lg:hidden">{item.line}</span>
                              </span>
                              <ArrowIcon
                                className={cn(
                                  "shrink-0 text-[22px] transition-[transform,opacity] duration-[250ms]",
                                  lit ? "translate-x-1 opacity-100" : "opacity-60",
                                )}
                              />
                            </Link>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  );
                })}
                <Link
                  href={SERVICE_GROUPS_HOME[tab].href}
                  className="mt-6 inline-flex items-center gap-2 font-mono text-mono-sm uppercase text-sec-mid transition-colors hover:text-onacc"
                >
                  All of {SERVICE_GROUPS_HOME[tab].title}
                  <ArrowIcon />
                </Link>
              </div>

              {/* ---- the card (lg and up) ----------------------------- */}
              <div aria-hidden className="hidden lg:block">
                <div
                  data-theme="light"
                  className="overflow-hidden rounded-[24px] shadow-[0_24px_60px_rgba(11,15,23,.22)]"
                >
                  <div className="relative aspect-square">
                    {SERVICES_FLAT.map(({ item, i }) => (
                      <div
                        key={item.href}
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{ opacity: shown === i ? 1 : 0 }}
                      >
                        <ServicePhoto src={item.img} reveal={shown === i && hover !== null} revealDelay={0.8} sizes="420px" />
                      </div>
                    ))}
                    <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-2.5 py-1 font-mono text-[11px] tabular-nums text-ink">
                      {String(shown + 1).padStart(2, "0")} / 15
                    </span>
                  </div>
                  <div className="relative min-h-[150px] overflow-hidden border-t border-sec-line p-6">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={current.item.href}
                        initial={reduced ? false : { y: 18, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={reduced ? undefined : { y: -18, opacity: 0 }}
                        transition={{ duration: 0.26, ease: EASE.house }}
                      >
                        <p className="font-mono text-eyebrow uppercase tracking-[0.08em] text-sec-acc">
                          {SERVICE_GROUPS_HOME[current.g].title}
                        </p>
                        <p className="mt-2 text-h3 font-bold text-sec-ink">{current.item.label}</p>
                        <p className="mt-2 text-small text-sec-mid">{current.item.line}</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Slab>
      </div>
    </Section>
  );
}
