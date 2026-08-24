"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import { motion, type Variants } from "framer-motion";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { GridLines } from "@/components/shared/GridLines";
import { Logo } from "@/components/shared/Logo";
import { Pill } from "@/components/shared/Pill";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* Nav (1.nav.md v3, direction pivot 2026-08-23): quiet instrument bar,
   loud menu. The bar carries only the mark and two pills (lusion); the
   IA lives in a full-screen paper overlay: display-scale index rows on
   the left, a ruled mono link table on the right, everything on the
   hairline grid. The active page keeps the hand-drawn underline
   (annotation budget: 1 of 3). data-cursor-quiet for Phase 3. */

const PORTAL_URL = "https://www.obsidion.ai/"; // decisions.md, locked

type MenuLeaf = { label: string; href: string };
type MenuGroup = {
  key: string;
  label: string;
  match: string[];
  sections: { eyebrow?: string; links: MenuLeaf[] }[];
};
type MenuRow =
  | { kind: "group"; group: MenuGroup }
  | { kind: "link"; label: string; href: string; match: string[] };

const GROUPS: MenuGroup[] = [
  {
    key: "who",
    label: "Who We Are",
    match: ["/about", "/leadership", "/careers"],
    sections: [
      {
        links: [
          { label: "About BigSquare", href: "/about/" },
          { label: "Leadership", href: "/leadership/" },
          { label: "Careers", href: "/careers/" },
        ],
      },
    ],
  },
  {
    key: "services",
    label: "Services",
    match: ["/services"],
    sections: [
      {
        eyebrow: "Organic Marketing",
        links: [
          { label: "Search Engine Optimization (SEO)", href: "/services/seo/" },
          { label: "Generative Engine Optimization (GEO)", href: "/services/generative-engine-optimization/" },
          { label: "Social Media", href: "/services/social-media/" },
          { label: "Content Marketing", href: "/services/content-marketing/" },
          { label: "Email", href: "/services/email/" },
          { label: "Obsidion Portal", href: "/services/obsidion-portal/" },
        ],
      },
      {
        eyebrow: "Paid Advertising",
        links: [
          { label: "Paid Search", href: "/services/paid-search/" },
          { label: "Google Local Services Ads", href: "/services/google-local-services-ads/" },
          { label: "Paid Social", href: "/services/paid-social/" },
          { label: "Amazon Ads", href: "/services/amazon-ads/" },
          { label: "Creator Network", href: "/services/creator-network/" },
        ],
      },
      {
        eyebrow: "Design & Development",
        links: [
          { label: "Web Design", href: "/services/web-design/" },
          { label: "Branding", href: "/services/branding/" },
          { label: "Video Production", href: "/services/video-production/" },
          { label: "Custom Development", href: "/services/custom-development/" },
        ],
      },
    ],
  },
  {
    key: "industries",
    label: "Industries",
    match: ["/industries"],
    sections: [
      {
        links: [
          { label: "Franchise", href: "/industries/franchise/" },
          { label: "Home Services", href: "/industries/home-services/" },
          { label: "Legal", href: "/industries/legal/" },
          { label: "Healthcare", href: "/industries/healthcare/" },
        ],
      },
    ],
  },
];

const ROWS: MenuRow[] = [
  { kind: "group", group: GROUPS[0] },
  { kind: "group", group: GROUPS[1] },
  { kind: "group", group: GROUPS[2] },
  { kind: "link", label: "Results", href: "/results/", match: ["/results"] },
  { kind: "link", label: "Contact", href: "/contact/", match: ["/contact"] },
];

const rowsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const rowIn: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE.house } },
};

function RuleRow({ link, onNavigate }: { link: MenuLeaf; onNavigate: () => void }) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className="group flex items-center justify-between border-t border-line py-2.5 text-[15px] font-medium text-ink transition-colors duration-150 hover:text-acc"
    >
      {link.label}
      <span
        aria-hidden
        className="text-mid transition-transform duration-[250ms] ease-house group-hover:translate-x-1 group-hover:text-acc motion-reduce:transition-none"
      >
        ↗
      </span>
    </Link>
  );
}

function GroupPanel({
  group,
  onNavigate,
  className,
}: {
  group: MenuGroup;
  onNavigate: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      {group.sections.map((section, i) => (
        <div key={i} className={i > 0 ? "mt-7" : undefined}>
          {section.eyebrow && (
            <p className="mb-2 font-mono text-eyebrow uppercase text-mid">
              {section.eyebrow}
            </p>
          )}
          <div className="border-b border-line">
            {section.links.map((link) => (
              <RuleRow key={link.href} link={link} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("services");

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isCurrent = (match: string[]) =>
    match.some((m) => pathname === m || pathname.startsWith(m));
  const close = () => setOpen(false);

  return (
    <header data-cursor-quiet>
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-200 ease-house",
          solid
            ? "border-line bg-paper/85 backdrop-blur-[12px]"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-gutter-x md:h-[72px]">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="size-8 shrink-0" />
            <span className="hidden text-[18px] font-bold text-ink sm:inline">
              BigSquare
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Pill href="/schedule/" size="sm" className="max-sm:hidden">
              Let&apos;s Talk
            </Pill>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger className="group pill pill-secondary pill-sm gap-2.5">
                <span aria-hidden className="size-2 bg-acc transition-transform duration-[250ms] ease-house group-hover:rotate-45" />
                Menu
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Content
                  data-slot="menu-overlay"
                  className="fixed inset-0 z-[70] flex flex-col bg-paper text-ink outline-none duration-[250ms] ease-house data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-4 data-closed:animate-out data-closed:fade-out-0"
                >
                  <Dialog.Title className="sr-only">Menu</Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Site navigation
                  </Dialog.Description>
                  <GridLines className="z-0" />

                  {/* Overlay top bar mirrors the page bar */}
                  <div className="relative z-10 shrink-0 border-b border-line">
                    <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-gutter-x md:h-[72px]">
                      <Link href="/" onClick={close} className="flex items-center gap-3">
                        <Logo className="size-8 shrink-0" />
                        <span className="hidden text-[18px] font-bold text-ink sm:inline">
                          BigSquare
                        </span>
                      </Link>
                      <Dialog.Close className="pill pill-secondary pill-sm gap-2.5">
                        <span aria-hidden className="size-2 rotate-45 bg-acc" />
                        Close
                      </Dialog.Close>
                    </div>
                  </div>

                  {/* The index */}
                  <div className="relative z-10 flex-1 overflow-y-auto">
                    <div className="mx-auto grid h-full max-w-[1200px] gap-x-16 px-gutter-x py-10 md:py-14 lg:grid-cols-[7fr_5fr]">
                      <motion.nav
                        variants={rowsContainer}
                        initial="hidden"
                        animate="show"
                        aria-label="Primary"
                      >
                        {ROWS.map((row, i) => {
                          const index = (
                            <span className="w-10 shrink-0 font-mono text-mono-sm uppercase tabular-nums text-mid">
                              [{String(i + 1).padStart(2, "0")}]
                            </span>
                          );
                          if (row.kind === "link") {
                            const current = isCurrent(row.match);
                            return (
                              <motion.div key={row.href} variants={rowIn}>
                                <Link
                                  href={row.href}
                                  onClick={close}
                                  className="group flex items-baseline gap-4 py-2.5 md:py-3"
                                >
                                  {index}
                                  <span className="font-display text-menu leading-none text-ink transition-colors duration-150 group-hover:text-acc">
                                    {current ? (
                                      <RoughAnnotation variant="underline" staticRender>
                                        {row.label}
                                      </RoughAnnotation>
                                    ) : (
                                      row.label
                                    )}
                                  </span>
                                </Link>
                              </motion.div>
                            );
                          }
                          const group = row.group;
                          const current = isCurrent(group.match);
                          const isActive = active === group.key;
                          return (
                            <motion.div key={group.key} variants={rowIn}>
                              <button
                                type="button"
                                onClick={() => setActive(group.key)}
                                aria-expanded={isActive}
                                className="group flex w-full items-baseline gap-4 py-2.5 text-left md:py-3"
                              >
                                {index}
                                <span
                                  className={cn(
                                    "font-display text-menu leading-none transition-colors duration-150 group-hover:text-acc",
                                    isActive ? "text-acc" : "text-ink",
                                  )}
                                >
                                  {current ? (
                                    <RoughAnnotation variant="underline" staticRender>
                                      {group.label}
                                    </RoughAnnotation>
                                  ) : (
                                    group.label
                                  )}
                                </span>
                                <span
                                  aria-hidden
                                  className={cn(
                                    "ml-auto size-2.5 self-center bg-acc transition-all duration-[250ms] ease-house",
                                    isActive ? "opacity-100" : "opacity-0 -translate-x-2",
                                  )}
                                />
                              </button>
                              {/* Mobile: the group's links open in place */}
                              {isActive && (
                                <GroupPanel
                                  group={group}
                                  onNavigate={close}
                                  className="mb-4 ml-14 lg:hidden"
                                />
                              )}
                            </motion.div>
                          );
                        })}
                      </motion.nav>

                      {/* Desktop: the active group's ruled link table */}
                      <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: EASE.house }}
                        className="hidden lg:block"
                      >
                        {GROUPS.filter((g) => g.key === active).map((g) => (
                          <GroupPanel key={g.key} group={g} onNavigate={close} />
                        ))}
                      </motion.div>
                    </div>
                  </div>

                  {/* Overlay foot: portal login left, the one direct ask right */}
                  <div className="relative z-10 shrink-0 border-t border-line">
                    <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between gap-4 px-gutter-x">
                      <div className="flex items-center gap-6">
                        <a
                          href={PORTAL_URL}
                          target="_blank"
                          rel="noopener"
                          className="group flex items-center gap-2 text-[15px] font-medium text-ink transition-colors duration-150 hover:text-acc"
                        >
                          Login
                          <span aria-hidden className="text-mid group-hover:text-acc">
                            ↗
                          </span>
                        </a>
                        <span className="hidden font-mono text-mono-sm uppercase text-mid md:inline">
                          Denver / Tampa
                        </span>
                      </div>
                      <Pill href="/schedule/" size="sm" className="shrink-0">
                        Schedule a Call
                      </Pill>
                    </div>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>
    </header>
  );
}
