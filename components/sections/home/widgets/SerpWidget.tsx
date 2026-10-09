"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { pLoop } from "@/components/shared/draft/pencil";
import { cn } from "@/lib/utils";
import { useWidgetLoop } from "./useWidgetLoop";

/* Google results page mockup (the search section, rebuilt 2026-10-09: ads
   first). A depicted product, like the ChatGPT composer it replaces: every
   value inside the page is Google's own, hard-coded (white page, Arial,
   #1a0dab titles, the bold "Sponsored" label, the four-colour mic), never
   our tokens or faces (STYLE_GUIDE changelog "depicted product UI"). No
   Google wordmark: the search box, the tabs, and the Sponsored block read
   as Google without it.

   The only readable business on the page is "Your Business": the reader's
   own. Every other result is a skeleton bar, so the page invents no
   competitor, no rating, and no digit (the portal mock's rule, 6.12). It
   holds the Sponsored slot at the top, the map profile on the right, and
   the first result under the ads, the section's argument in one picture.

   Loop, per search (~8.5s, 3 searches): rest, zoomed into the empty box
   (the old composer's camera move) / the query types with Google's
   suggestions open under it / enter: the camera eases out and the page
   fills top-down / the blue pen circles the ad and writes "That's you" /
   hold / the page fades, the camera goes back in, next search.

   The zoom is measured, not fixed: it fills the panel's width with the box
   and never crops it (the composer's zoomed rest ran off the panel's
   right edge). On a phone the box already fills the width, so the camera
   holds still. Narrow panels drop the right column and run the profile
   in the flow, as Google's own mobile page does (container queries, so
   the widget only knows its own width). Timers run only in view
   (useWidgetLoop); reduced motion gets the settled page: first search,
   results in, the ink drawn, no caret, no camera. Ad copy and searches
   are DRAFT for Brad's copy pass. */

type Search = {
  q: string;
  /** autocomplete rows; each starts with the query */
  suggest: string[];
  ad: { title: string; text: string };
  /** the profile's category line */
  kind: string;
  result: { title: string; text: string };
};

const SEARCHES: Search[] = [
  {
    q: "roof repair tampa",
    suggest: ["roof repair tampa", "roof repair tampa fl", "roof repair tampa storm damage"],
    ad: {
      title: "Storm Damage Roof Repair in Tampa",
      text: "Local crews and fast inspections. Call today to get on the schedule this week.",
    },
    kind: "Roofing contractor in Tampa, Florida",
    result: {
      title: "Roof Repair and Replacement in Tampa",
      text: "Leaks, lost shingles, and storm damage. See our work and book an inspection.",
    },
  },
  {
    q: "ac repair denver",
    suggest: ["ac repair denver", "ac repair denver same day", "ac repair denver co"],
    ad: {
      title: "Same Day AC Repair in Denver",
      text: "Techs near you today. Book online in a minute or call to talk to a person.",
    },
    kind: "HVAC contractor in Denver, Colorado",
    result: {
      title: "AC Repair, Installs, and Tune Ups in Denver",
      text: "Cooling, heating, and air quality for homes across the metro. Book a visit.",
    },
  },
  {
    q: "injury lawyer near me",
    suggest: ["injury lawyer near me", "injury lawyer near me free consultation", "injury lawyer near me car accident"],
    ad: {
      title: "Injury Lawyer Near You | Free Consultation",
      text: "Hurt in an accident? Talk to a lawyer today about your case.",
    },
    kind: "Personal injury attorney",
    result: {
      title: "Personal Injury Lawyers Near You",
      text: "Car crashes, falls, and work injuries. Tell us what happened and get answers.",
    },
  },
];

type Phase = "rest" | "type" | "open" | "hold" | "clear";

/* the page's side padding, shared by the header and the results */
const PAD = "px-5 @2xl:px-8 @5xl:px-11";
/* the pen's ease, the drafted kit's */
const PEN = "cubic-bezier(0.5, 0, 0.3, 1)";
/* the camera never zooms past this */
const MAX_ZOOM = 1.7;

/* ---- Google's icons -------------------------------------------------- */

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 text-[#70757a]">
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6">
      <rect x="9" y="3" width="6" height="11.5" rx="3" fill="#4285F4" />
      <path d="M6 11.5a6 6 0 0 0 6 6" stroke="#34A853" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 11.5a6 6 0 0 1-6 6" stroke="#FBBC04" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17.5V21" stroke="#EA4335" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M15 15l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-[18px] text-[#5f6368]">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.5 12h17M12 3.5c2.5 2.4 3.8 5.2 3.8 8.5s-1.3 6.1-3.8 8.5M12 3.5C9.5 5.9 8.2 8.7 8.2 12s1.3 6.1 3.8 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* ---- the page's parts ------------------------------------------------ */

/** the site line every result opens with */
function Site() {
  return (
    <span className="flex items-center gap-3">
      <span className="grid size-[28px] shrink-0 place-items-center rounded-full border border-[#dadce0] bg-[#f1f3f4]">
        <GlobeIcon />
      </span>
      <span className="flex flex-col whitespace-nowrap leading-[1.3]">
        <span className="text-[14px] text-[#202124]">Your Business</span>
        <span className="text-[12px] text-[#4d5156]">www.yourbusiness.com</span>
      </span>
    </span>
  );
}

/** a result nobody can read: everyone who is not the reader */
function Ghost({ title = "62%" }: { title?: string }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="size-[28px] shrink-0 rounded-full bg-[#f1f3f4]" />
        <span className="flex flex-col gap-[7px]">
          <span className="block h-[9px] w-[96px] rounded-full bg-[#e8eaed]" />
          <span className="block h-[7px] w-[150px] rounded-full bg-[#eef0f2]" />
        </span>
      </div>
      <span className="mt-[14px] block h-[13px] rounded-full bg-[#1a0dab]/15" style={{ width: title }} />
      <span className="mt-[12px] block h-[9px] w-full rounded-full bg-[#eceef1]" />
      <span className="mt-[8px] block h-[9px] w-[78%] rounded-full bg-[#eceef1]" />
    </div>
  );
}

/** Google's light basemap: land, parks, the water, roads, the red pin. Drawn
    twice as wide as it is shown, centred on the pin, so the column card and
    the full-width card each crop a sensible slice at the same scale */
function MapTile() {
  return (
    <svg viewBox="0 0 720 150" preserveAspectRatio="xMidYMid slice" className="block h-full w-full">
      <rect width="720" height="150" fill="#f8f9fa" />
      <path d="M0 116 C110 98 210 132 330 118 S520 92 600 108 S690 118 720 112 V150 H0Z" fill="#aecbfa" />
      <rect x="64" y="22" width="92" height="40" rx="6" fill="#ceead6" />
      <rect x="202" y="18" width="78" height="46" rx="6" fill="#ceead6" />
      <rect x="442" y="26" width="64" height="38" rx="6" fill="#ceead6" />
      <rect x="590" y="30" width="86" height="34" rx="6" fill="#ceead6" />
      <g stroke="#ffffff" strokeLinecap="round">
        <path d="M-10 86 L730 66" strokeWidth="9" />
        <path d="M312 -10 L328 160 M120 -10 L104 120 M560 -10 L548 110" strokeWidth="7" />
        <path d="M412 -10 L402 120" strokeWidth="5" />
        <path d="M-10 40 L310 44 M330 30 L730 22" strokeWidth="4" />
        <path d="M240 72 L232 160 M480 72 L492 110 M650 70 L664 104" strokeWidth="4" />
      </g>
      <path d="M-10 86 L730 66" stroke="#fde293" strokeWidth="4" strokeLinecap="round" />
      <g transform="translate(366 74)">
        <path d="M0 0C-6 -9 -11 -14 -11 -21A11 11 0 1 1 11 -21C11 -14 6 -9 0 0Z" fill="#ea4335" />
        <circle cx="0" cy="-21" r="4" fill="#b31412" />
      </g>
    </svg>
  );
}

/** the business profile: right column on a wide page, in the flow on a narrow one */
function Profile({ kind }: { kind: string }) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#dadce0]">
      <div className="h-[96px] @4xl:h-[148px]">
        <MapTile />
      </div>
      <div className="px-4 pb-4 pt-3">
        <p className="text-[22px] leading-[1.3] text-[#202124]">Your Business</p>
        <p className="mt-[2px] text-[14px] leading-[1.4] text-[#70757a]">{kind}</p>
        <div className="mt-3 flex gap-2">
          {["Website", "Directions", "Call"].map((b) => (
            <span key={b} className="rounded-full border border-[#dadce0] px-[14px] py-[8px] text-[14px] leading-none text-[#0b57d0]">
              {b}
            </span>
          ))}
        </div>
        <div className="mt-4 hidden space-y-[11px] border-t border-[#ebebeb] pt-4 @4xl:block">
          {[
            ["Address:", "68%"],
            ["Hours:", "44%"],
            ["Phone:", "38%"],
          ].map(([label, w]) => (
            <p key={label} className="flex items-center gap-2 text-[14px] leading-none text-[#202124]">
              <b className="font-bold">{label}</b>
              <span className="block h-[9px] rounded-full bg-[#eceef1]" style={{ width: w }} />
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/** the blue pen: a loop drawn round its children, and a note written beside it */
function Inked({ on, reduced, children }: { on: boolean; reduced: boolean; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = ref.current!;
    const ro = new ResizeObserver(() => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      setSize((o) => (o && o.w === w && o.h === h ? o : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const B = 40; // bleed round the box for the loop
  const motion = on && !reduced;
  return (
    <span ref={ref} className="relative inline-flex">
      {children}
      {size && (
        <svg
          aria-hidden
          className="pointer-events-none absolute overflow-visible"
          style={{ left: -B, top: -B, width: size.w + B * 2, height: size.h + B * 2, filter: "url(#draft-pencil)" }}
          viewBox={`${-B} ${-B} ${size.w + B * 2} ${size.h + B * 2}`}
        >
          {/* wide and shallow: round the favicon and the URL's end, clear of
              "Sponsored" above and just kissing the title below. Centred a
              touch right, so on a phone-width page the left swing stays
              inside the page's padding instead of the frame's edge */}
          <path
            d={pLoop(size.w / 2 + 8, size.h / 2, size.w * 0.58 + 6, size.h / 2 + 9, 7)}
            pathLength={1}
            fill="none"
            stroke="var(--acc)"
            strokeWidth={2.4}
            strokeLinecap="round"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: on ? 0 : 1,
              opacity: on ? 1 : 0,
              transition: motion ? `stroke-dashoffset 0.9s ${PEN}` : "none",
            }}
          />
        </svg>
      )}
      {/* the note needs margin to write in: none on a phone-width page */}
      <span
        className="absolute left-[calc(100%+40px)] top-1/2 hidden whitespace-nowrap font-accent text-[24px] uppercase leading-none tracking-[0.08em] text-[var(--acc)] @lg:block"
        style={{
          filter: "url(#draft-pencil)",
          transform: "translateY(-50%) rotate(-5deg)",
          clipPath: on ? "inset(-30% -5% -30% 0)" : "inset(0 100% 0 0)",
          transition: motion ? `clip-path 0.55s ${PEN} 0.7s` : "none",
        }}
      >
        {"That’s you"}
      </span>
    </span>
  );
}

/** a block of the results page that fills in on enter, top-down */
function Fill({ shown, delay, className, children }: { shown: boolean; delay: number; className?: string; children: ReactNode }) {
  const style: CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? "none" : "translateY(10px)",
    transition: `opacity 0.45s ease ${shown ? delay : 0}ms, transform 0.6s var(--ease-house) ${shown ? delay : 0}ms`,
  };
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

/* ---- the widget ------------------------------------------------------ */

export function SerpWidget() {
  const { ref, play, reduced } = useWidgetLoop();
  const box = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("rest");
  const [len, setLen] = useState(0);
  const [qi, setQi] = useState(0);
  /* the camera: zoom and its origin (the box's top-left), measured */
  const [cam, setCam] = useState<{ s: number; x: number; y: number } | null>(null);

  const search = SEARCHES[reduced ? 0 : qi];
  const q = search.q;

  useEffect(() => {
    const panel = ref.current!;
    const b = box.current!;
    const measure = () => {
      const x = b.offsetLeft;
      const y = b.offsetTop;
      const s = Math.max(1, Math.min(MAX_ZOOM, (panel.clientWidth - 2 * x) / b.offsetWidth));
      setCam((c) => (c && c.s === s && c.x === x && c.y === y ? c : { s, x, y }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(panel);
    return () => ro.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!play) return;
    let t = 0;
    const after = (ms: number, fn: () => void) => (t = window.setTimeout(fn, ms));
    if (phase === "rest") after(900, () => setPhase("type"));
    else if (phase === "type") {
      if (len >= q.length) after(520, () => setPhase("open"));
      else after(55 + Math.random() * 45 + (q[len - 1] === " " ? 70 : 0), () => setLen((n) => n + 1));
    } else if (phase === "open") after(1250, () => setPhase("hold"));
    else if (phase === "hold") after(3600, () => setPhase("clear"));
    else
      after(950, () => {
        setLen(0);
        setQi((i) => (i + 1) % SEARCHES.length);
        setPhase("rest");
      });
    return () => window.clearTimeout(t);
  }, [play, phase, len, q]);

  const typed = reduced ? q : q.slice(0, len);
  const caret = !reduced && (phase === "rest" || phase === "type");
  const suggesting = !reduced && phase === "type" && len >= 2;
  const shown = reduced || phase === "open" || phase === "hold";
  /* the ink stays through the clear and fades with the page; it resets at rest, unseen */
  const inked = reduced || phase === "hold" || phase === "clear";
  const zoomed = !reduced && (phase === "rest" || phase === "type" || phase === "clear");
  const s = cam && zoomed ? cam.s : 1;

  return (
    <div
      ref={ref}
      aria-hidden
      data-play={play ? "" : undefined}
      className="wgt @container pointer-events-none relative h-[460px] select-none overflow-hidden rounded-[24px] bg-white md:h-[480px] lg:h-[500px]"
      style={{ fontFamily: "arial, sans-serif" }}
    >
      <div
        className="relative h-full"
        style={{
          transform: `scale(${s})`,
          transformOrigin: cam ? `${cam.x}px ${cam.y}px` : "0 0",
          transition: cam && !reduced ? "transform 1.1s var(--ease-house)" : undefined,
        }}
      >
        {/* header: the search box and the tabs */}
        <div className={cn(PAD, "border-b border-[#ebebeb] pt-5")}>
          <div ref={box} className="relative h-[46px] max-w-[692px]">
            <div
              className={cn(
                "absolute inset-x-0 top-0 z-10 overflow-hidden bg-white",
                suggesting ? "rounded-[24px] shadow-[0_4px_6px_rgba(32,33,36,0.28)]" : "rounded-[24px] shadow-[0_2px_5px_1px_rgba(64,60,67,0.16)]",
              )}
            >
              <div className="flex h-[46px] items-center gap-3 pl-5 pr-4">
                <span className="min-w-0 flex-1 truncate text-[16px] text-[#202124]">
                  {typed}
                  {caret && <span className="wgt-caret ml-px inline-block h-[20px] w-[1.5px] translate-y-[4px] bg-[#202124]" />}
                </span>
                <span className="hidden items-center gap-3 @lg:flex">
                  <span className={cn("transition-opacity duration-200", typed ? "opacity-100" : "opacity-0")}>
                    <ClearIcon />
                  </span>
                  <span className="h-6 w-px bg-[#dadce0]" />
                </span>
                <MicIcon />
                <SearchIcon className="size-6 text-[#4285F4]" />
              </div>
              {suggesting && (
                <div className="pb-2">
                  <div className="mx-5 border-t border-[#e8eaed]" />
                  {search.suggest.map((row) => (
                    <div key={row} className="flex h-[36px] items-center gap-[14px] px-5 text-[16px] text-[#202124]">
                      <SearchIcon className="size-[18px] shrink-0 text-[#9aa0a6]" />
                      <span className="truncate">
                        {typed}
                        <b className="font-bold">{row.slice(typed.length)}</b>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-[14px] flex gap-[22px] overflow-hidden whitespace-nowrap text-[14px] text-[#4d5156]">
            {["All", "Maps", "Images", "News", "Shopping", "Videos", "More"].map((tab, i) => (
              <span key={tab} className={cn("pb-[10px]", i === 0 && "border-b-[3px] border-[#1f1f1f] pb-[7px] text-[#1f1f1f]")}>
                {tab}
              </span>
            ))}
          </div>
        </div>

        {/* results: the ad, the first result, a stranger; the profile beside them */}
        <div className={cn(PAD, "grid grid-cols-[minmax(0,1fr)] items-start gap-y-7 pt-5 @4xl:grid-cols-[minmax(0,652px)_minmax(0,360px)] @4xl:gap-x-14")}>
          <Fill shown={shown} delay={150} className="@4xl:col-start-1 @4xl:row-start-1">
            <p className="text-[14px] font-bold leading-none text-[#202124]">Sponsored</p>
            <div className="mt-[14px]">
              <Inked on={inked} reduced={reduced}>
                <Site />
              </Inked>
              <p className="mt-2 text-[20px] leading-[1.3] text-[#1a0dab]">{search.ad.title}</p>
              <p className="mt-1 text-[14px] leading-[1.58] text-[#4d5156]">{search.ad.text}</p>
            </div>
          </Fill>
          <Fill shown={shown} delay={330} className="@4xl:col-start-2 @4xl:row-span-3 @4xl:row-start-1">
            <Profile kind={search.kind} />
          </Fill>
          <Fill shown={shown} delay={260} className="@4xl:col-start-1 @4xl:row-start-2">
            <Site />
            <p className="mt-[6px] text-[20px] leading-[1.3] text-[#1a0dab]">{search.result.title}</p>
            <p className="mt-1 text-[14px] leading-[1.58] text-[#4d5156]">{search.result.text}</p>
          </Fill>
          <Fill shown={shown} delay={380} className="@4xl:col-start-1 @4xl:row-start-3">
            <Ghost />
          </Fill>
        </div>
      </div>

      {/* the page runs on below the frame */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16" style={{ background: "linear-gradient(to top, #fff, rgba(255,255,255,0))" }} />
    </div>
  );
}
