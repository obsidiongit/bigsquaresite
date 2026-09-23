"use client";

/* The mix (sketch, 2026-09-23). No single effect carries the page:
   each section uses the technique that suits what it has to say, and
   the design system holds them together (paper, ink, one blue, the
   same type, Nº numbers and hairlines, and the square in a different
   form every time).
   01 hero: the tunnel of work, ending in the logo
   02 showreel: cut type that opens like blinds into the reel
   03 services: stacked cards, footage playing plainly
   04 work: a staggered grid; two tiles develop out of the squares, the rest play plainly
   05 who: a moving band of type
   06 finale: the field of squares with the call to action carved out */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SmoothScroll, getLenis } from "@/components/motion/SmoothScroll";
import { Tunnel } from "@/components/sections/home/directions/Directions";
import { Cut } from "@/components/sections/home/cut/CutPage";
import { FieldScreen, Resolve } from "@/components/sections/home/field/FieldPage";
import s from "./mix.module.css";

const REEL = "/media/reel/reel-loop-720.mp4";

const SERVICES = [
  {
    n: "01",
    group: "Paid Advertising",
    title: "Ads held to what they bring in.",
    body: "Google, Meta, Amazon and Local Services ads, aimed at the people ready to buy. We cut what only spends and push what books.",
    items: ["Paid search", "Paid social", "Amazon ads", "Local Services ads"],
    clip: "paid",
    caption: "BigSquare launch spot",
    tone: "paper",
  },
  {
    n: "02",
    group: "Organic Marketing",
    title: "Content people stop for.",
    body: "We make the posts, run the social and keep people talking about you between the ads.",
    items: ["Content creation", "Social media", "Email and text", "Search engine optimization"],
    clip: "organic",
    caption: "Story animation",
    tone: "ink",
  },
  {
    n: "03",
    group: "Design & Development",
    title: "Creative made in house.",
    body: "Brand films, ads and the pages they point to, made by the same team that runs them. Nothing gets lost between vendors.",
    items: ["Brand and creative", "Video and motion", "Websites and landing pages"],
    clip: "design",
    caption: "Signature animal",
    tone: "blue",
  },
];

/* working titles describe what each clip shows; client names are placeholders */
const WORK = [
  { clip: "w1", title: "Brand launch film", tag: "Motion" },
  { clip: "w2", title: "Soft drink teaser", tag: "Product" },
  { clip: "w3", title: "Candy VFX spot", tag: "VFX" },
  { clip: "w4", title: "Coffee can animation", tag: "3D" },
  { clip: "w5", title: "Food concept film", tag: "Film" },
  { clip: "w6", title: "Furniture concept", tag: "3D" },
  { clip: "w7", title: "Vinyl lifestyle spot", tag: "Film" },
  { clip: "w8", title: "BigSquare Tetris", tag: "Brand" },
];

/* which work tiles keep the develop effect: one per row, not side by side */
const DEVELOP = new Set([1, 6]);

const AUDIENCE = "Franchise systems ■ Multi-location groups ■ Ecommerce brands ■ Software companies ■ Single-location businesses ■ ";

export function MixPage() {
  const [reelOpen, setReelOpen] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add(s.in)),
      { rootMargin: "0px 0px -10% 0px" },
    );
    document.querySelectorAll(`.${s.reveal}`).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* stacked cards: each card shrinks back and dims as the next slides over it */
  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const cards = [...stack.querySelectorAll<HTMLElement>(`.${s.stackCard}`)];
    const videos = [...stack.querySelectorAll<HTMLVideoElement>("video")];
    const vio = new IntersectionObserver((entries) =>
      entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      }),
    );
    videos.forEach((v) => vio.observe(v));
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const vh = window.innerHeight;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const covered = Math.min(1, Math.max(0, (vh - next.getBoundingClientRect().top) / (vh * 0.85)));
        const inner = card.firstElementChild as HTMLElement | null;
        if (!inner) return;
        inner.style.transform = `scale(${(1 - covered * 0.07).toFixed(4)}) translateY(${(-covered * 18).toFixed(1)}px)`;
        inner.style.filter = `brightness(${(1 - covered * 0.35).toFixed(3)})`;
      });
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      vio.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!reelOpen) return;
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
    };
  }, [reelOpen]);

  return (
    <div className={s.page}>
      <SmoothScroll />
      <header className={s.header}>
        <Link href="/" className={s.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/brand/bigsquare-logo.png" alt="" className={s.logoImg} />
          BigSquare
        </Link>
        <nav className={s.nav}>
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <Link href="/schedule/" className={s.navCta}>Let&rsquo;s Talk</Link>
        </nav>
      </header>

      {/* 01 hero: the tunnel */}
      <Tunnel>
        <div className={s.heroCard}>
          <p className={s.label}>Full-stack marketing · Denver and Tampa</p>
          <h1 className={s.h1}>
            More customers.
            <br />
            More revenue you
            <br />
            can <span className={s.blue}>count.</span>
          </h1>
          <p className={s.body}>
            BigSquare is the growth partner for brands that want proof. One team runs your ads, your search, your site and your creative.
          </p>
          <div className={s.ctas}>
            <Link href="/schedule/" className={s.btnPrimary}>Schedule a Call</Link>
            <button type="button" className={s.btnGhost} onClick={() => setReelOpen(true)}>
              <span className={s.play} aria-hidden /> Watch the reel
            </button>
          </div>
        </div>
      </Tunnel>

      {/* 02 showreel: the cut opens like blinds */}
      <section className={s.reel} data-cut-host>
        <div className={s.sticky}>
          <h2 className={s.srOnly}>Showreel</h2>
          <Cut src={REEL} poster="/media/reel/reel-poster.jpg" lines={["Showreel"]} mode="scroll" className={s.fullCut} />
          <div className={s.reelCaption}>
            <p className={s.tag}>Nº 01 · Made in house · 00:58</p>
            <button type="button" className={s.btnPrimary} onClick={() => setReelOpen(true)}>
              <span className={s.play} aria-hidden /> Watch with sound
            </button>
          </div>
        </div>
      </section>

      {/* 03 services: stacked cards */}
      <section id="services" className={s.services}>
        <div className={s.servicesHead}>
          <p className={`${s.label} ${s.reveal}`}>Nº 02 · What we do</p>
          <h2 className={`${s.h2} ${s.reveal}`}>Three groups. One team.</h2>
        </div>
        <div ref={stackRef} className={s.stack}>
          {SERVICES.map((sv, i) => (
            <article key={sv.n} className={s.stackCard} style={{ top: `calc(12vh + ${i * 22}px)` }}>
              <div className={`${s.cardInner} ${sv.tone === "ink" ? s.toneInk : sv.tone === "blue" ? s.toneBlue : ""}`}>
                <div className={s.cardText}>
                  <p className={s.cardLabel}>
                    Nº {sv.n} · {sv.group}
                  </p>
                  <h3 className={s.cardTitle}>{sv.title}</h3>
                  <p className={s.cardBody}>{sv.body}</p>
                  <ul className={s.list}>
                    {sv.items.map((it, j) => (
                      <li key={it}>
                        <span className={s.listN}>0{j + 1}</span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <figure className={s.cardMedia}>
                  <video src={`/media/window/${sv.clip}.mp4`} poster={`/media/window/${sv.clip}.jpg`} muted loop playsInline preload="metadata" />
                  <figcaption>{sv.caption}</figcaption>
                </figure>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 04 work: tiles develop out of blue squares */}
      <section id="work" className={s.work}>
        <div className={s.workHead}>
          <p className={`${s.label} ${s.reveal}`}>Nº 03 · Selected work</p>
          <h2 className={`${s.h2} ${s.reveal}`}>Work that makes people look twice.</h2>
        </div>
        <div className={s.grid}>
          {WORK.map((wk, i) => (
            <figure
              key={wk.clip}
              className={`${s.tile} ${s.reveal} ${i % 4 === 1 || i % 4 === 3 ? s.tileLow : ""}`}
              style={{ transitionDelay: `${(i % 4) * 70}ms` }}
            >
              {/* only a couple develop out of the squares; the rest play plainly. Static case-study images replace these later */}
              {DEVELOP.has(i) ? (
                <Resolve src={`/media/window/${wk.clip}.mp4`} poster={`/media/window/${wk.clip}.jpg`} ratio="4 / 5" />
              ) : (
                <div className={s.tileMedia}>
                  <video src={`/media/window/${wk.clip}.mp4`} poster={`/media/window/${wk.clip}.jpg`} muted loop playsInline autoPlay preload="metadata" />
                </div>
              )}
              <figcaption className={s.caption}>
                <span className={s.tileTitle}>{wk.title}</span>
                <span>{wk.tag}</span>
              </figcaption>
              <p className={s.client}>[PLACEHOLDER: client]</p>
            </figure>
          ))}
        </div>
      </section>

      {/* 05 who: a moving band of type */}
      <section className={s.who}>
        <p className={`${s.label} ${s.whoLabel} ${s.reveal}`}>Nº 04 · Who we work with</p>
        <div className={s.band} aria-hidden>
          <div className={s.bandTrack}>
            <span>{AUDIENCE.repeat(2)}</span>
            <span>{AUDIENCE.repeat(2)}</span>
          </div>
        </div>
        <div className={`${s.band} ${s.bandOutline}`} aria-hidden>
          <div className={`${s.bandTrack} ${s.bandReverse}`}>
            <span>{AUDIENCE.repeat(2)}</span>
            <span>{AUDIENCE.repeat(2)}</span>
          </div>
        </div>
        <p className={`${s.whoLine} ${s.reveal}`}>
          Franchise systems, multi-location groups, ecommerce and software brands, and single locations that want to grow past one front door.
        </p>
      </section>

      {/* 06 finale: the field */}
      <FieldScreen>
        <div className={s.finaleText}>
          <p className={s.label} data-clear>Nº 05 · Let&rsquo;s talk</p>
          <h2 className={s.finaleTitle} data-clear>
            Let&rsquo;s make you the brand
            <br />
            people remember.
          </h2>
          <div className={s.ctas}>
            <Link href="/schedule/" className={s.btnPrimary} data-clear>Schedule a Call</Link>
            <Link href="/audit/" className={s.btnGhost} data-clear>Get a free audit</Link>
          </div>
        </div>
      </FieldScreen>

      <footer className={s.footer}>
        <span>© BigSquare Marketing</span>
        <span>Denver · Tampa</span>
      </footer>

      {reelOpen && (
        <div className={s.modal} role="dialog" aria-modal="true" aria-label="BigSquare showreel" onClick={() => setReelOpen(false)}>
          <video
            className={s.modalVideo}
            src="/media/reel/reel-1080.mp4"
            poster="/media/reel/reel-poster.jpg"
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
          />
          <button type="button" className={s.modalClose} onClick={() => setReelOpen(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
