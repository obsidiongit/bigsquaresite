"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { getLenis } from "@/components/motion/SmoothScroll";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { MediaSlot } from "@/components/shared/MediaSlot";
import { Chip } from "@/components/shared/mono";
import { EASE } from "@/lib/motion";
import type { TeamCard, TeamMember } from "@/lib/team";
import { cn } from "@/lib/utils";

/* <TeamGrid> (project-sections/company/team.md; Brad 2026-08-31): the
   roster wall and the profile window. Early-social-web energy in the
   house grammar:

   - The wall: photo cards pinned at a readable sticker tilt (every
     width; they lift and square up on hover, grayscale-to-color once
     real photos land, the marquee rule). Open slots wear a designed
     "joining soon" face, never build-note brackets. The careers card
     is double-wide and always the wall's last occupied cell (open
     slots plus the 2-cell card fill to 12 cells: flush at 2, 3, and 4
     columns).
   - The window: clicking a card grows THE CARD'S RECT into a token-
     native profile window (the 6.5 slab move on the 6.12 exhibit
     window: measured rect to measured rect, one paper actor, content
     fades up as it lands; close runs it back). Chrome bar with the
     brand square, the profile counter, and PREV/NEXT: profiles flip
     in place, the Tumblr-era move the counter promises. Personal
     fields render designed [PLACEHOLDER] states until each member
     answers the questionnaire.

   Reduced motion: the tilt stays (static composition, not motion);
   travel, lifts, and flip slides are cut. Annotation budget: this
   component spends 0 (the page's H1 has 1). */

type Rect = { left: number; top: number; width: number; height: number };

const WINDOW_OPEN = { duration: 0.55, ease: EASE.soft };
const WINDOW_CLOSE = { duration: 0.38, ease: EASE.soft };
const CONTENT_IN = { duration: 0.3, ease: EASE.house };
const CONTENT_OUT = { duration: 0.12, ease: EASE.house };

/* The pinned-wall tilt: varied rotations wide enough to read at rest
   at every width, with small vertical drops from md up so the rows sit
   like pinned photos, not a database. Hover lifts and squares up. */
const TILT = [
  "-rotate-[1.6deg]",
  "rotate-[1.1deg]",
  "rotate-[1.8deg]",
  "-rotate-[0.9deg]",
  "rotate-[0.7deg]",
  "-rotate-[1.3deg]",
];
const DROP = ["md:translate-y-0", "md:translate-y-2", "md:-translate-y-1", "md:translate-y-1"];

const MONO_LABEL = "font-mono text-mono-sm uppercase text-sec-mid";

function ProfileSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-sec-line pt-4">
      <p className={MONO_LABEL}>{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/* One member's profile content (everything under the chrome bar);
   keyed by member so prev/next flips it in place. */
function ProfileBody({ member }: { member: TeamMember }) {
  return (
    <div className="grid gap-7 p-5 md:grid-cols-12 md:gap-8 md:p-7">
      {/* left: the headshot and the signature */}
      <div className="md:col-span-5">
        <MediaSlot
          id={member.photoSlot}
          note="Square headshot. Real person, no stock."
          alt={member.name}
          aspect="1 / 1"
          sizes="(min-width: 768px) 340px, 100vw"
        />
        {/* the signature: their name in the handwriting accent, the
            one accent moment in the window */}
        <p
          aria-hidden
          className="mt-4 -rotate-2 font-accent text-[28px] uppercase leading-none text-acc"
        >
          {member.signature}
        </p>
      </div>

      {/* right: who they are */}
      <div className="flex flex-col gap-5 md:col-span-7">
        <div>
          <h2 className="font-display text-h3 font-bold text-sec-ink md:text-[32px] md:leading-[1.1]">
            {member.name}
          </h2>
          <p className="mt-1.5 font-mono text-mono-sm uppercase text-sec-acc">
            {member.role}
          </p>
        </div>

        <ProfileSection label="About">
          <p className="max-w-[48ch] text-body text-sec-mid">{member.about}</p>
        </ProfileSection>

        <ProfileSection label="Into">
          {member.likes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {member.likes.map((like) => (
                <Chip key={like}>{like}</Chip>
              ))}
            </div>
          ) : (
            <p className={cn(MONO_LABEL, "leading-relaxed")}>
              [PLACEHOLDER: 3 to 6 things {member.signature} is into, as chips]
            </p>
          )}
        </ProfileSection>

        <ProfileSection label="On rotation">
          <p className="text-body text-sec-mid">{member.rotation}</p>
        </ProfileSection>

        {member.linkedin ? (
          <ProfileSection label="Find them">
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-body font-medium text-sec-ink underline underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-sec-acc"
            >
              LinkedIn
              <span
                aria-hidden
                className="transition-transform duration-[250ms] ease-house group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
              >
                ↗
              </span>
            </a>
          </ProfileSection>
        ) : null}
      </div>

      {/* the photo strip: their pictures, not ours */}
      <div className="md:col-span-12">
        <p className={MONO_LABEL}>Photos</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {member.photos.map((photo) => (
            <MediaSlot
              key={photo.slot}
              id={photo.slot}
              note={photo.note}
              alt={photo.alt}
              aspect="1 / 1"
              compact
              sizes="(min-width: 768px) 270px, 33vw"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* Below sm the labels go sr-only, so the buttons keep a 40px touch
   target there (centered glyph, negative margin so the bar stays the
   same height). */
const CHROME_BTN =
  "flex h-8 items-center gap-2 font-mono text-mono-sm uppercase text-sec-mid transition-colors duration-[var(--dur-fast)] hover:text-sec-ink disabled:opacity-40 max-sm:-my-1 max-sm:h-10 max-sm:min-w-10 max-sm:justify-center";

/* The window shell. Mounted only while open; measures its own final
   box and lets the paper actor travel from the clicked card's rect.
   Prev/next flip the body in place; the shell stays put. */
function ProfileWindow({
  member,
  index,
  total,
  dir,
  origin,
  reduced,
  step,
  close,
}: {
  member: TeamMember;
  index: number;
  total: number;
  /** flip direction of the last prev/next, for the slide */
  dir: number;
  origin: Rect;
  reduced: boolean;
  step: (delta: number) => void;
  close: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [to, setTo] = useState<Rect | null>(null);
  const [landed, setLanded] = useState(reduced);

  /* Measure the frame, not the copy. Prev/next used to shrink the
     body while the paper actor stayed at the first profile's height,
     which left a white gap above the chrome. The panel is a fixed
     viewport frame; ResizeObserver keeps the actor locked to it. */
  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const measure = () => {
      const p = el.getBoundingClientRect();
      setTo({ left: p.left, top: p.top, width: p.width, height: p.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const ready = Boolean(to);

  /* content joins as the actor settles (the 6.5 slab timing rule) */
  useEffect(() => {
    if (!ready || reduced) return;
    const id = window.setTimeout(() => setLanded(true), WINDOW_OPEN.duration * 1000 * 0.8);
    return () => window.clearTimeout(id);
  }, [ready, reduced]);

  const actorFrom = { ...origin, borderRadius: 24 };
  const actorTo = to ? { ...to, borderRadius: 24 } : undefined;

  return (
    <>
      {/* scrim: the wall stays visible behind the window */}
      <motion.div
        aria-hidden
        onClick={close}
        className="absolute inset-0 bg-ink/40"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduced ? undefined : { opacity: 0, transition: WINDOW_CLOSE }}
        transition={{ duration: 0.25, ease: EASE.house }}
      />

      {/* the paper actor: the card's rect grows into the window's rect */}
      {ready && (
        <motion.div
          aria-hidden
          className="absolute border border-sec-line bg-paper shadow-[0_24px_80px_-24px_rgba(10,16,28,0.35)]"
          initial={reduced ? actorTo : actorFrom}
          animate={actorTo}
          exit={reduced ? undefined : { ...actorFrom, transition: WINDOW_CLOSE }}
          transition={WINDOW_OPEN}
        />
      )}

      {/* the window: a fixed viewport frame so every profile is the
          same size. Chrome stays pinned; the body scrolls. */}
      <div className="pointer-events-none absolute inset-0 flex justify-center p-3 sm:p-6">
        <div
          ref={panelRef}
          className="pointer-events-auto relative flex h-full max-h-full w-full max-w-[880px] flex-col"
        >
          <motion.div
            className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[24px]"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: landed ? 1 : 0 }}
            exit={reduced ? undefined : { opacity: 0, transition: CONTENT_OUT }}
            transition={CONTENT_IN}
          >
            {/* chrome bar (6.12): the brand square, the counter earned
                by prev/next, close */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-sec-line bg-paper px-5 py-3 md:px-7">
              <div className="flex items-center gap-3">
                <span aria-hidden className="size-2.5 bg-acc" />
                <span className={cn(MONO_LABEL, "tabular-nums")}>
                  Team profile · {String(index + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-center gap-4 md:gap-5">
                <button
                  type="button"
                  data-sfx=""
                  aria-label="Previous profile"
                  onClick={() => step(-1)}
                  className={CHROME_BTN}
                >
                  <span aria-hidden>←</span>
                  <span className="max-sm:sr-only">Prev</span>
                </button>
                <button
                  type="button"
                  data-sfx=""
                  aria-label="Next profile"
                  onClick={() => step(1)}
                  className={CHROME_BTN}
                >
                  <span className="max-sm:sr-only">Next</span>
                  <span aria-hidden>→</span>
                </button>
                <Dialog.Close data-sfx="" className={cn(CHROME_BTN, "-mr-1")}>
                  <span className="max-sm:sr-only">Close</span>
                  <span aria-hidden className="relative block size-3.5">
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rotate-45 bg-current" />
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 -rotate-45 bg-current" />
                  </span>
                </Dialog.Close>
              </div>
            </div>

            {/* the flip: prev/next slide the body through in place */}
            <div
              data-lenis-prevent
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
            >
              <AnimatePresence mode="wait" initial={false} custom={dir}>
                <motion.div
                  key={member.name}
                  custom={dir}
                  variants={
                    reduced
                      ? undefined
                      : {
                          enter: (d: number) => ({ opacity: 0, x: 24 * d }),
                          center: { opacity: 1, x: 0 },
                          exit: (d: number) => ({ opacity: 0, x: -18 * d }),
                        }
                  }
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduced ? 0 : 0.22, ease: EASE.house }}
                >
                  <ProfileBody member={member} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

function MemberCard({
  member,
  index,
  onOpen,
}: {
  member: TeamMember;
  index: number;
  onOpen: (rect: Rect) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      type="button"
      data-sfx=""
      onClick={() => {
        const r = ref.current?.getBoundingClientRect();
        if (r) onOpen({ left: r.left, top: r.top, width: r.width, height: r.height });
      }}
      className={cn(
        "group/card block w-full rounded-[24px] border border-sec-line bg-paper p-3 text-left",
        "transition-[transform,border-color,box-shadow] duration-[350ms] ease-house",
        "hover:-translate-y-1 hover:rotate-0 hover:border-ink hover:shadow-[0_16px_40px_-20px_rgba(10,16,28,0.3)]",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        TILT[index % TILT.length],
        DROP[index % DROP.length],
      )}
    >
      <div className="[&_img]:grayscale [&_img]:transition-[filter] [&_img]:duration-[350ms] group-hover/card:[&_img]:grayscale-0 motion-reduce:[&_img]:transition-none">
        <MediaSlot
          id={member.photoSlot}
          note="Square headshot. Real person, no stock."
          alt={member.name}
          aspect="1 / 1"
          compact
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 46vw"
        />
      </div>
      <div className="flex items-start justify-between gap-3 px-2 pb-2 pt-4">
        <div>
          <p className="text-[17px] font-bold leading-snug text-sec-ink">
            {member.name}
          </p>
          <p className="mt-1 font-mono text-mono-sm uppercase text-sec-mid">
            {member.role}
          </p>
        </div>
        {/* the open affordance: the brand square, quarter-turning on
            hover (the nav trigger's own vocabulary) */}
        <span
          aria-hidden
          className="mt-1 block size-2.5 shrink-0 bg-acc transition-transform duration-[250ms] ease-house group-hover/card:rotate-45 motion-reduce:transition-none"
        />
      </div>
    </button>
  );
}

/* An open slot wears a designed face: the wall is still growing, and
   that is a feature, not an apology. (Real names land in lib/team.ts;
   the build note lives there, never on the card.) */
function OpenSlotCard({ index }: { index: number }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-[24px] border border-sec-line bg-surf p-3",
        TILT[index % TILT.length],
        DROP[index % DROP.length],
      )}
    >
      <div className="flex aspect-square flex-col items-center justify-center gap-4">
        <span aria-hidden className="block size-8 rounded-[4px] border-[1.5px] border-sec-acc/40" />
      </div>
      <div className="px-2 pb-2 pt-4">
        <p className="text-[17px] font-bold leading-snug text-sec-mid">
          Joining soon
        </p>
        <p className="mt-1 font-mono text-mono-sm uppercase text-sec-mid">
          New team member
        </p>
      </div>
    </div>
  );
}

/* The careers ask: double-wide, always the wall's last occupied cell. */
function HiringCard() {
  return (
    <Link
      href="/careers/"
      data-sfx=""
      data-theme="accent"
      className="group/hire col-span-2 flex flex-col justify-between rounded-[24px] p-6 transition-transform duration-[350ms] ease-house hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span
        aria-hidden
        className="block size-2.5 bg-onacc transition-transform duration-[250ms] ease-house group-hover/hire:rotate-45 motion-reduce:transition-none"
      />
      <span className="mt-10">
        <span className="block max-w-[16ch] font-display text-[24px] leading-[1.15] text-sec-ink md:text-[28px]">
          This could be you.
        </span>
        <span className="mt-3 inline-flex items-center gap-2 font-mono text-mono-sm uppercase text-sec-ink">
          Careers
          <span
            aria-hidden
            className="transition-transform duration-[250ms] ease-house group-hover/hire:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </span>
      </span>
    </Link>
  );
}

export function TeamGrid({ cards }: { cards: TeamCard[] }) {
  const reduced = useReducedMotionSafe();
  const [open, setOpen] = useState<{ index: number; dir: number; origin: Rect } | null>(
    null,
  );

  const members = cards.filter((c): c is TeamMember => c.kind === "member");
  const count = members.length;

  /* the window pauses the smooth scroll instrument (6.5 rule); its own
     scroll area carries data-lenis-prevent */
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    return () => lenis?.start();
  }, [open]);

  const step = (delta: number) =>
    setOpen((o) =>
      o ? { ...o, index: (o.index + delta + count) % count, dir: delta } : o,
    );

  const active = open ? members[open.index] : null;
  let memberIndex = -1;

  return (
    <Dialog.Root open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {cards.map((card, i) => {
          if (card.kind === "open") {
            return <OpenSlotCard key={card.id} index={i} />;
          }
          memberIndex += 1;
          const mi = memberIndex;
          return (
            <MemberCard
              key={card.name}
              member={card}
              index={i}
              onOpen={(origin) => setOpen({ index: mi, dir: 1, origin })}
            />
          );
        })}
        <HiringCard />
      </div>

      <AnimatePresence>
        {open && active && (
          <Dialog.Portal forceMount key="profile">
            <Dialog.Content
              forceMount
              className="fixed inset-0 z-[70] text-ink outline-none"
            >
              <Dialog.Title className="sr-only">{active.name}</Dialog.Title>
              <Dialog.Description className="sr-only">
                {active.role} at BigSquare
              </Dialog.Description>
              <ProfileWindow
                member={active}
                index={open.index}
                total={count}
                dir={open.dir}
                origin={open.origin}
                reduced={reduced}
                step={step}
                close={() => setOpen(null)}
              />
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
