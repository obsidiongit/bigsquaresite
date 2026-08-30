"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { getLenis } from "@/components/motion/SmoothScroll";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { Logo } from "@/components/shared/Logo";
import { Pill } from "@/components/shared/Pill";
import { SoundToggle } from "@/components/sound/SoundToggle";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* Nav (6.5). The bar (rebuilt 2026-08-30 on Brad's answers): logo
   lockup left; right, the one ask as a SQUARE button, the menu trigger
   which is the brand square itself ("Menu" beside it at md+, a
   quarter-turn on hover, morphs into the close X while open), and the
   sound control as three bare level bars at the far edge.

   The open menu (rebuilt 2026-08-31, Brad: "the way it takes the whole
   frame is not my favorite", "outdated grid lines"): a blue SLAB that
   hangs from the bar over the dimmed page, the same hand-drawn-edge box
   as the homepage work panel. Services lead, all three lanes open at
   once with square bullets; Who We Are, Industries, Results, Contact
   sit in a quieter row under a hairline; Login and Schedule a Call in
   the foot. One move: the brand square in the bar grows into the slab
   (measured rect to measured rect, corners rounding as it grows), the
   squiggle edge draws on as it lands, the links fade up inside; close
   runs it back into the square. Phone: full height under the bar,
   scrolls inside. Reduced motion: settled, no choreography. */

const PORTAL_URL = "https://www.obsidion.ai/"; // decisions.md, locked

type MenuLeaf = { label: string; href: string };
type MenuGroup = { label: string; links: MenuLeaf[] };

/* Same destination set as sitemap.md and lib/footer-links.ts. */
const LANES: MenuGroup[] = [
  {
    label: "Organic Marketing",
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
    label: "Paid Advertising",
    links: [
      { label: "Paid Search", href: "/services/paid-search/" },
      { label: "Google Local Services Ads", href: "/services/google-local-services-ads/" },
      { label: "Paid Social", href: "/services/paid-social/" },
      { label: "Amazon Ads", href: "/services/amazon-ads/" },
      { label: "Creator Network", href: "/services/creator-network/" },
    ],
  },
  {
    label: "Design & Development",
    links: [
      { label: "Web Design", href: "/services/web-design/" },
      { label: "Branding", href: "/services/branding/" },
      { label: "Video Production", href: "/services/video-production/" },
      { label: "Custom Development", href: "/services/custom-development/" },
    ],
  },
];

const WHO: MenuGroup = {
  label: "Who We Are",
  links: [
    { label: "About BigSquare", href: "/about/" },
    { label: "Leadership", href: "/leadership/" },
    { label: "Careers", href: "/careers/" },
  ],
};

const INDUSTRIES: MenuGroup = {
  label: "Industries",
  links: [
    { label: "Franchise", href: "/industries/franchise/" },
    { label: "Home Services", href: "/industries/home-services/" },
    { label: "Legal", href: "/industries/legal/" },
    { label: "Healthcare", href: "/industries/healthcare/" },
  ],
};

const RESULTS: MenuLeaf = { label: "Results", href: "/results/" };
const CONTACT: MenuLeaf = { label: "Contact", href: "/contact/" };

function scrollToTop() {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo(0, 0);
}

/* The brand square as the menu trigger (6.5). Closed: the square, a
   quarter-turn on hover. Open: the square leaves on its diagonal and
   two bars grow into the X (mechanics in globals.css .menu-mark). The
   parent carries `group` for the hover turn. */
function MenuMark({ open = false }: { open?: boolean }) {
  return (
    <span aria-hidden className="menu-mark" data-open={open ? "" : undefined}>
      <span className="menu-mark-square" />
      <span className="menu-mark-bar" />
      <span className="menu-mark-bar" />
    </span>
  );
}

const TRIGGER =
  "group flex h-10 items-center gap-3 text-[15px] font-medium text-ink transition-colors duration-150 ease-house hover:text-acc";

type Rect = { left: number; top: number; width: number; height: number };

/* soft ease, not house: house spends its travel in the first third and
   the square is already the slab before the eye catches it */
const SLAB_OPEN = { duration: 0.7, ease: EASE.soft };
const SLAB_CLOSE = { duration: 0.45, ease: EASE.soft };
const FADE_IN = (i: number) => ({ duration: 0.4, ease: EASE.house, delay: 0.42 + i * 0.06 });
const FADE_OUT = { duration: 0.15, ease: EASE.house };

/* A service lane: heading + square-bullet rows. The bullet is the brand
   square again: 55% white at rest, solid on the current page, and a
   quarter-turn plus solid on hover (the bar's own hover vocabulary). */
function Lane({
  group,
  isCurrent,
  onNavigate,
}: {
  group: MenuGroup;
  isCurrent: (href: string) => boolean;
  onNavigate: () => void;
}) {
  return (
    <div>
      <h3 className="mb-3 font-display text-[20px] leading-tight text-sec-ink md:text-[22px]">
        {group.label}
      </h3>
      <ul>
        {group.links.map((link) => {
          const current = isCurrent(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={current ? "page" : undefined}
                data-sfx=""
                className="group flex items-center gap-3 py-1.5 text-[17px] font-medium leading-snug text-sec-ink"
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 bg-sec-ink transition-[opacity,rotate] duration-[250ms] ease-house group-hover:rotate-45 group-hover:opacity-100 motion-reduce:transition-none",
                    current ? "opacity-100" : "opacity-55",
                  )}
                />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* The quieter second tier: eyebrow + small links. */
function SmallGroup({
  label,
  links,
  isCurrent,
  onNavigate,
}: MenuGroup & { isCurrent: (href: string) => boolean; onNavigate: () => void }) {
  return (
    <div>
      {label && (
        <p className="mb-2 font-mono text-mono-sm uppercase text-sec-mid">{label}</p>
      )}
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <SmallLink link={link} current={isCurrent(link.href)} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SmallLink({
  link,
  current,
  onNavigate,
}: {
  link: MenuLeaf;
  current: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      data-sfx=""
      className={cn(
        "block py-[3px] text-[15px] font-medium leading-snug text-sec-ink transition-opacity duration-150 hover:opacity-100",
        current ? "underline decoration-1 underline-offset-4" : "opacity-85",
      )}
    >
      {link.label}
    </Link>
  );
}

/* The open menu body. Mounted only while open (AnimatePresence keeps it
   through the exit), so its effects run on every open: measure the
   mirrored mark (the square's spot) and the panel's final box, then let
   the slab travel between them. */
function MenuPanel({
  pathname,
  reduced,
  close,
  onLogoClick,
}: {
  pathname: string;
  reduced: boolean;
  close: () => void;
  onLogoClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const markRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [from, setFrom] = useState<Rect | null>(null);
  const [to, setTo] = useState<Rect | null>(null);
  const [landed, setLanded] = useState(reduced);

  useLayoutEffect(() => {
    const measure = () => {
      const p = panelRef.current?.getBoundingClientRect();
      if (p) setTo({ left: p.left, top: p.top, width: p.width, height: p.height });
    };
    /* the origin is captured once: the square's spot in the bar. The
       mirrored mark's square is 14px inside a 40px hit area, so read
       the inner square's box, not the button's */
    const m = markRef.current?.querySelector(".menu-mark")?.getBoundingClientRect();
    if (m) setFrom({ left: m.left, top: m.top, width: m.width, height: m.height });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const isCurrent = (href: string) => {
    const base = href.replace(/\/$/, "");
    return pathname === href || pathname === base || pathname.startsWith(base + "/");
  };

  const radius = to && to.width < 700 ? 24 : 32;
  const slabTo = to ? { ...to, borderRadius: radius } : undefined;
  const slabFrom = from ? { ...from, borderRadius: 0 } : undefined;
  const ready = Boolean(slabTo && slabFrom);

  /* the squiggle edge goes live as the slab settles: the soft ease is
     within a couple of px of the target by ~85% of its run, so the
     boil starts there instead of after the full 700ms (Brad: the
     moving lines must start "right when the square fully expands") */
  useEffect(() => {
    if (!ready || reduced) return;
    const id = window.setTimeout(() => setLanded(true), SLAB_OPEN.duration * 1000 * 0.85);
    return () => window.clearTimeout(id);
  }, [ready, reduced]);

  return (
    <>
      {/* scrim: the page stays visible, dimmed and inert */}
      <motion.div
        aria-hidden
        onClick={close}
        className="absolute inset-0 bg-ink/40"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduced ? undefined : { opacity: 0, transition: SLAB_CLOSE }}
        transition={{ duration: 0.3, ease: EASE.house }}
      />

      {/* the bar, mirrored so the X sits exactly where the square was */}
      <div className="absolute inset-x-0 top-0 border-b border-line bg-paper">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-gutter-x md:h-[72px]">
          <Link
            href="/"
            onClick={(e) => {
              close();
              onLogoClick(e);
            }}
            className="flex items-center gap-3"
          >
            <Logo className="size-8 shrink-0" />
            <span className="hidden text-[18px] font-bold text-ink sm:inline">BigSquare</span>
          </Link>
          <div className="flex items-center gap-4 md:gap-6">
            <Pill href="/schedule/" variant="square" size="sm" className="max-md:hidden">
              Let&apos;s Talk
            </Pill>
            <Dialog.Close data-sfx="" className={TRIGGER}>
              <span className="max-md:sr-only">Close</span>
              <span ref={markRef} className="contents">
                <MenuMark open />
              </span>
            </Dialog.Close>
            <SoundToggle className="-mr-3" />
          </div>
        </div>
      </div>

      {/* the slab: one blue actor, the square's rect to the panel's rect */}
      {ready && (
        <motion.div
          aria-hidden
          className="absolute bg-acc"
          initial={reduced ? slabTo : slabFrom}
          animate={slabTo}
          exit={reduced ? undefined : { ...slabFrom, transition: SLAB_CLOSE }}
          transition={SLAB_OPEN}
        />
      )}

      {/* the panel: laid out at its final size from the first frame; the
          slab paints its ground, the squiggle rides its edge */}
      <div className="pointer-events-none absolute inset-x-0 top-16 bottom-2 flex justify-center px-2 md:top-[84px] md:bottom-4 md:items-start md:px-gutter-x">
        {/* data-theme="accent" scopes the sec-* tokens and the square
            action's inversion; its ground is painted by the slab, so the
            theme's own background is switched off inline (the [data-theme]
            rule is unlayered and would beat a utility) */}
        <div
          ref={panelRef}
          data-theme="accent"
          style={{ background: "transparent" }}
          className="pointer-events-auto relative flex h-full w-full max-w-[1056px] md:h-auto md:max-h-full"
        >
          <motion.div
            className="absolute inset-0"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: landed ? 1 : 0 }}
            exit={reduced ? undefined : { opacity: 0, transition: FADE_OUT }}
            transition={{ duration: 0.15, ease: EASE.house }}
          >
            {/* hand-drawn edge in the slab's own blue: the inside half
                vanishes into the fill, only the wobble that escapes
                onto the dimmed page shows (6.12 / work panel rule).
                Pre-drawn (instant) like the work panel, so the boil
                runs from the moment the slab lands instead of after
                a 2s draw-on; same blue as the slab, so its arrival
                reads as the edge roughening, not a line appearing. */}
            <RoughAnnotation
              variant="box"
              stroke="var(--acc)"
              instant
              active={landed}
              staticRender={reduced}
              className="absolute inset-0 block"
            >
              {null}
            </RoughAnnotation>
          </motion.div>

          <div
            data-lenis-prevent
            className={cn(
              "relative w-full overflow-y-auto overscroll-contain px-6 pt-7 pb-6 md:px-11 md:pt-10 md:pb-8",
              radius === 24 ? "rounded-[24px]" : "rounded-[32px]",
            )}
          >
            <div className="grid gap-7 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
              {LANES.map((lane, i) => (
                <motion.div
                  key={lane.label}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, transition: FADE_OUT }}
                  transition={FADE_IN(i)}
                >
                  <Lane group={lane} isCurrent={isCurrent} onNavigate={close} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, transition: FADE_OUT }}
              transition={FADE_IN(3)}
            >
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-sec-line pt-6 md:gap-x-10 lg:grid-cols-4">
                <SmallGroup {...WHO} isCurrent={isCurrent} onNavigate={close} />
                <SmallGroup {...INDUSTRIES} isCurrent={isCurrent} onNavigate={close} />
                {/* Results and Contact: single links; on the four-column
                    row they sit on the first link line (eyebrow + gap) */}
                <div className="lg:pt-[22px]">
                  <SmallLink link={RESULTS} current={isCurrent(RESULTS.href)} onNavigate={close} />
                </div>
                <div className="lg:pt-[22px]">
                  <SmallLink link={CONTACT} current={isCurrent(CONTACT.href)} onNavigate={close} />
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between gap-4 border-t border-sec-line pt-6">
                <div className="flex items-center gap-6">
                  <a
                    href={PORTAL_URL}
                    target="_blank"
                    rel="noopener"
                    data-sfx=""
                    className="group flex items-center gap-2 text-[15px] font-medium text-sec-ink"
                  >
                    Login
                    <span
                      aria-hidden
                      className="text-sec-mid transition-transform duration-[250ms] ease-house group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                    >
                      ↗
                    </span>
                  </a>
                  <span className="hidden font-mono text-mono-sm uppercase text-sec-mid sm:inline">
                    Denver / Tampa
                  </span>
                </div>
                <Pill href="/schedule/" variant="square" size="sm" className="shrink-0">
                  Schedule a Call
                </Pill>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Nav() {
  const pathname = usePathname();
  const reduced = useReducedMotionSafe();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* the menu pauses the smooth scroll instrument; the panel's own
     scroll area carries data-lenis-prevent so it keeps scrolling */
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    return () => lenis?.start();
  }, [open]);

  const close = () => setOpen(false);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    e.preventDefault();
    scrollToTop();
  };

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
          <Link href="/" onClick={handleLogoClick} className="flex items-center gap-3">
            <Logo className="size-8 shrink-0" />
            <span className="hidden text-[18px] font-bold text-ink sm:inline">
              BigSquare
            </span>
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <Pill href="/schedule/" variant="square" size="sm">
              Let&apos;s Talk
            </Pill>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger data-sfx="" className={TRIGGER}>
                <span className="max-md:sr-only">Menu</span>
                <MenuMark />
              </Dialog.Trigger>
              <AnimatePresence>
                {open && (
                  <Dialog.Portal forceMount key="menu">
                    <Dialog.Content
                      forceMount
                      data-slot="menu-overlay"
                      className="fixed inset-0 z-[70] text-ink outline-none"
                    >
                      <Dialog.Title className="sr-only">Menu</Dialog.Title>
                      <Dialog.Description className="sr-only">
                        Site navigation
                      </Dialog.Description>
                      <MenuPanel
                        pathname={pathname}
                        reduced={reduced}
                        close={close}
                        onLogoClick={handleLogoClick}
                      />
                    </Dialog.Content>
                  </Dialog.Portal>
                )}
              </AnimatePresence>
            </Dialog.Root>
            <SoundToggle className="-mr-3" />
          </div>
        </div>
      </div>
    </header>
  );
}
