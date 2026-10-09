"use client";
/**
 * The curtain footer, ported 2026-10-08 from the studio rebuild (the designer's pick there: "the footer i want
 * it EXACTLY LIKE THIS"). Fits one screen; the page slides up off it like a curtain; the pencil wordmark
 * draws itself in and scribbles a letter in where you point; every arrow and note is drawn in pencil.
 * Fonts are BigSquare's own: Lenia Mono (--m) and Casual Human (--a). Legal links + the Obsidion login stay.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PORTAL_URL } from "@/lib/site";
import FooterCta from "./FooterCta";
import MarkPencil from "./MarkPencil";
import s from "./CurtainFooter.module.css";

const PARTS: [string, string][] = [
  ["Creative", "/services/video-production/"],
  ["Media", "/services/paid-search/"],
  ["Conversion", "/services/web-design/"],
  ["Reporting", "/services/obsidion-portal/"],
];
const PAGES: [string, string][] = [
  ["Work", "/results/"],
  ["About", "/about/"],
  ["Careers", "/careers/"],
  ["Contact", "/contact/"],
];

/** a small pencil arrow (→, or ↗ with `up`): draws in with the footer, redraws itself on hover */
function PArrow({ up = false, i = 0 }: { up?: boolean; i?: number }) {
  return up ? (
    <svg className={`${s.parrow} ${s.up}`} viewBox="0 0 16 16" aria-hidden="true" style={{ ["--i" as string]: i }}>
      <path d="M2.5 13.5 C6 10 9 7 13 3" pathLength={1} />
      <path d="M6 2.6 C8.5 2.9 11 2.8 13.3 2.6 C13.2 5 13.4 7.4 13.5 9.8" pathLength={1} />
    </svg>
  ) : (
    <svg className={s.parrow} viewBox="0 0 32 12" aria-hidden="true" style={{ ["--i" as string]: i }}>
      <path d="M1 6.6 C9 5.4 18 7.2 29 5.8" pathLength={1} />
      <path d="M22.5 1.2 C25 3 27 4.4 29.4 5.9 C27 7.4 25 8.8 22.8 10.8" pathLength={1} />
    </svg>
  );
}

/** a pencil line: draws itself in (in order, `i`) once the footer has arrived */
function Pencil({ d, i = 0 }: { d: string; i?: number }) {
  return <path d={d} pathLength={1} className={s.draw} style={{ ["--i" as string]: i }} />;
}

export function CurtainFooter({ wordmark = true, audit = true }: { wordmark?: boolean; audit?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const boil = useRef<SVGFETurbulenceElement>(null);
  const [inView, setInView] = useState(false);

  // the way in: the footer waits underneath, pinned to the screen, and the page above slides up off it
  // (a curtain). --rv runs 0 → 1 as it's uncovered: the footer rises out of the shade into place, and past
  // 55% the pencil starts drawing and the wordmark arrives. (Phones and the no-wordmark footer just scroll.)
  useEffect(() => {
    const wrap = shell.current!;
    const el = root.current!;
    let raf = 0;
    let started = false;
    const frame = () => {
      raf = 0;
      const top = wrap.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (innerHeight - top) / Math.min(innerHeight, wrap.offsetHeight || innerHeight)));
      el.style.setProperty("--rv", p.toFixed(3));
      if (!started && p > 0.55) {
        started = true;
        setInView(true);
      }
    };
    const on = () => (raf ||= requestAnimationFrame(frame));
    frame();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => (removeEventListener("scroll", on), removeEventListener("resize", on), cancelAnimationFrame(raf));
  }, []);

  // the out-of-focus squares shift with the mouse (the nearer, the more)
  useEffect(() => {
    const el = root.current!;
    let raf = 0;
    const on = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty("--py", ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
      });
    };
    addEventListener("pointermove", on, { passive: true });
    return () => (removeEventListener("pointermove", on), cancelAnimationFrame(raf));
  }, []);

  // the pencil wobble
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      const seed = String(Math.floor(Math.random() * 90));
      boil.current?.setAttribute("seed", seed);
      boil.current?.closest("svg")?.querySelectorAll("feTurbulence").forEach((f) => f.setAttribute("seed", seed));
    }, 110);
    return () => clearInterval(t);
  }, []);

  return (
    <div ref={shell} className={s.reveal} data-reveal={wordmark || undefined}>
    <footer
      ref={root}
      className={s.footer}
      data-theme="dark"
      data-tone="blue"
      data-wordmark={wordmark || undefined}
      data-in={inView || undefined}
    >
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="foot-pencil" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence ref={boil} type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" />
        </filter>
        {/* the same wobble, scaled for the little arrows (their drawings are only ~16 units across) */}
        <filter id="foot-pencil-sm" x="-20%" y="-40%" width="140%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.3" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.1" />
        </filter>
      </svg>

      <div className={s.stage} data-stage="">
        {/* out-of-focus squares at the edges */}
        <i className={`${s.blur} ${s.b1}`} aria-hidden="true" />
        <i className={`${s.blur} ${s.b2}`} aria-hidden="true" />
        <i className={`${s.blur} ${s.b3}`} aria-hidden="true" />
        <i className={`${s.blur} ${s.b4}`} aria-hidden="true" />
        <i className={`${s.blur} ${s.b5}`} aria-hidden="true" />

        {wordmark && (
          <div className={s.markWrap}>
            <MarkPencil on={inView} />
            <p className={`${s.note} ${s.noteLeft}`} aria-hidden="true">
              {["Denver", "Tampa", "Everywhere", "else."].map((l, i) => (
                <span key={l} style={{ ["--i" as string]: i }}>
                  {l}
                </span>
              ))}
            </p>
            <svg className={`${s.pencil} ${s.arrowLeft}`} viewBox="0 0 60 30" aria-hidden="true">
              <Pencil d="M2 27 C18 20 34 12 55 4" i={0} />
              <Pencil d="M42 3 L56 3 L50 15" i={1} />
            </svg>
          </div>
        )}

        <div className={s.mid}>
          <nav className={s.links} aria-label="Footer">
            <ul>
              {PARTS.map(([l, h], i) => (
                <li key={l}>
                  <Link href={h}>
                    {l}
                    <PArrow i={i} />
                  </Link>
                </li>
              ))}
            </ul>
            <ul>
              {PAGES.map(([l, h], i) => (
                <li key={l}>
                  <Link href={h}>
                    {l}
                    <PArrow i={i + 2} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <i className={s.rule} aria-hidden="true" />
          <div className={s.info}>
            <div className={s.block}>
              <span className={s.label}>Offices</span>
              <span className={s.big}>Denver, CO</span>
              <span className={s.big}>Tampa, FL</span>
            </div>
            <div className={s.block}>
              <span className={s.label}>Clients</span>
              <a href={PORTAL_URL} target="_blank" rel="noopener" className={s.big}>
                Obsidion <PArrow up i={5} />
              </a>
              <span className={s.small}>Log in and check the numbers, any day.</span>
            </div>
          </div>
        </div>

        {audit && (
          <div className={s.ask}>
            <h2 className={s.q}>
              Have something
              <br />
              worth growing?
            </h2>
            <svg className={`${s.pencil} ${s.under}`} viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true">
              <Pencil d="M2 9 C80 5 190 4 300 5 S380 6 398 4" i={2} />
              <Pencil d="M40 11 C140 8 250 8 360 9" i={3} />
            </svg>
            <div className={s.cta}>
              <FooterCta on={inView} />
            </div>
            <p className={`${s.note} ${s.noteRight}`} aria-hidden="true">
              {["Full stack", "growth partner", "for brands", "that want proof."].map((l, i) => (
                <span key={l} style={{ ["--i" as string]: i + 4 }}>
                  {l}
                </span>
              ))}
            </p>
            {/* from the note, curling down and round to point at the audit */}
            <svg className={`${s.pencil} ${s.arrowRight}`} viewBox="0 0 90 70" aria-hidden="true">
              <Pencil d="M84 6 C66 2 46 10 42 26 C38 42 28 52 8 50" i={4} />
              <Pencil d="M17 42 L6 50 L16 59" i={5} />
            </svg>
          </div>
        )}

        <div className={s.legal}>
          <span>BigSquare Marketing © {new Date().getFullYear()}</span>
          <span className={s.legalLinks}>
            <Link href="/services/">Services</Link>
            <Link href="/blog/">Blog</Link>
            <Link href="/privacy-policy/">Privacy Policy</Link>
            <Link href="/terms/">Terms</Link>
          </span>
        </div>
      </div>
      <i className={s.shade} aria-hidden="true" />
    </footer>
    </div>
  );
}
