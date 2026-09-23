"use client";

/* Direction B, full page (sketch, 2026-09-23). Every section is a giant
   word with its footage playing inside the letters. The type is cut
   into horizontal slices that shear with the cursor; as a section is
   reached the slices slide apart like blinds and the full footage is
   revealed. The type is the reveal: the work always ends up in full. */

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { SmoothScroll, getLenis } from "@/components/motion/SmoothScroll";
import s from "./cut.module.css";

const REEL = "/media/reel/reel-loop-720.mp4";
const SLICES = 10;
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/* shared pointer speed, so every cut shears from the same gesture */
const pointer = { x: 0.5, vx: 0 };
if (typeof window !== "undefined") {
  let last = 0.5;
  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX / window.innerWidth;
    pointer.vx = pointer.x - last;
    last = pointer.x;
  });
}

function whileVisible(el: Element, start: () => () => void) {
  let stop: (() => void) | null = null;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !stop) stop = start();
    else if (!e.isIntersecting && stop) {
      stop();
      stop = null;
    }
  });
  io.observe(el);
  return () => {
    io.disconnect();
    stop?.();
  };
}

/* a giant word with footage inside it; opens by scroll ("scroll"), by hover ("hover"), or never ("none") */
function Cut({
  src,
  poster,
  lines,
  mode,
  tone = "paper",
  className,
}: {
  src: string;
  poster?: string;
  lines: string[];
  mode: "scroll" | "hover" | "none";
  tone?: "paper" | "blue";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const longest = Math.max(...lines.map((l) => l.length));
  const fs = Math.min(34, 100 / (longest * 0.64)); // cqw: the longest line fills the width

  useEffect(() => {
    const root = ref.current!;
    const video = root.querySelector("video")!;
    let hover = false;
    const on = () => (hover = true);
    const off = () => (hover = false);
    root.addEventListener("pointerenter", on);
    root.addEventListener("pointerleave", off);
    let cur = 0, energy = 0;
    const stopAll = whileVisible(root, () => {
      video.play().catch(() => {});
      let raf = 0, last = performance.now();
      const frame = (t: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.1, (t - last) / 1000);
        last = t;
        let target = 0;
        if (mode === "hover") target = hover ? 1 : 0;
        if (mode === "scroll") {
          const host = (root.closest("[data-cut-host]") as HTMLElement | null) ?? root;
          const r = host.getBoundingClientRect();
          const p = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
          target = ease(clamp((p - 0.18) / 0.5));
        }
        cur += (target - cur) * (1 - Math.exp(-dt * (mode === "hover" ? 7 : 9)));
        energy += (Math.min(1, Math.abs(pointer.vx) * 40) - energy) * (1 - Math.exp(-dt * 5));
        pointer.vx *= 0.85;
        const W = root.clientWidth;
        const time = t * 0.001;
        sliceRefs.current.forEach((el, i) => {
          if (!el) return;
          const k = i / (SLICES - 1);
          const dir = i % 2 ? 1 : -1;
          const shear = (Math.sin(time * 1.3 + i * 0.55) * (3 + energy * 50) + (pointer.x - 0.5) * 36 * (k - 0.5)) * (1 - cur);
          const openX = dir * ease(clamp(cur * 1.25 - k * 0.25)) * W * 1.35;
          el.style.transform = `translate3d(${(shear + openX).toFixed(1)}px,0,0)`;
        });
      };
      raf = requestAnimationFrame(frame);
      return () => {
        cancelAnimationFrame(raf);
        video.pause();
      };
    });
    return () => {
      stopAll();
      root.removeEventListener("pointerenter", on);
      root.removeEventListener("pointerleave", off);
    };
  }, [mode]);

  return (
    <div ref={ref} className={`${s.cut} ${tone === "blue" ? s.cutBlue : ""} ${className ?? ""}`} style={{ ["--fs" as string]: `${fs}cqw` }}>
      <video className={s.cutVideo} src={src} poster={poster} muted loop playsInline preload="metadata" />
      {Array.from({ length: SLICES }, (_, i) => (
        <div
          key={i}
          ref={(el) => { sliceRefs.current[i] = el; }}
          className={s.slice}
          style={{ clipPath: `inset(${(i / SLICES) * 100}% -20% ${100 - ((i + 1) / SLICES) * 100}% -20%)` }}
          aria-hidden
        >
          <div className={s.words}>
            {lines.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const SERVICES = [
  {
    word: "Paid.",
    clip: "paid",
    n: "01",
    group: "Paid Advertising",
    title: "Ads held to what they bring in.",
    body: "Google, Meta, Amazon and Local Services ads, aimed at the people ready to buy. We cut what only spends and push what books.",
    items: ["Paid search", "Paid social", "Amazon ads", "Local Services ads"],
  },
  {
    word: "Organic.",
    clip: "organic",
    n: "02",
    group: "Organic Marketing",
    title: "Content people stop for.",
    body: "We make the posts, run the social and keep people talking about you between the ads.",
    items: ["Content creation", "Social media", "Email and text", "Search engine optimization"],
  },
  {
    word: "Design.",
    clip: "design",
    n: "03",
    group: "Design & Development",
    title: "Creative made in house.",
    body: "Brand films, ads and the pages they point to, made by the same team that runs them. Nothing gets lost between vendors.",
    items: ["Brand and creative", "Video and motion", "Websites and landing pages"],
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

function Section({ children, className, host }: { children: ReactNode; className?: string; host?: boolean }) {
  return (
    <section className={className} {...(host ? { "data-cut-host": "" } : {})}>
      {children}
    </section>
  );
}

export function CutPage() {
  const [reelOpen, setReelOpen] = useState(false);

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

      {/* 01 hero */}
      <Section className={s.hero}>
        <h1 className={s.srOnly}>More customers. More revenue you can count.</h1>
        <Cut src={REEL} poster="/media/reel/reel-poster.jpg" lines={["Seen.", "Chosen.", "Remembered."]} mode="none" className={s.heroCut} />
        <div className={s.heroFoot}>
          <p className={s.lede}>
            <strong>More customers. More revenue you can count.</strong> One team runs your ads, your search, your site and your creative.
          </p>
          <div className={s.ctas}>
            <Link href="/schedule/" className={s.btnPrimary}>Schedule a Call</Link>
            <button type="button" className={s.btnGhost} onClick={() => setReelOpen(true)}>
              <span className={s.play} aria-hidden /> Watch the reel
            </button>
          </div>
        </div>
      </Section>

      {/* 02 the reel: the word opens into the full reel */}
      <Section className={s.pin} host>
        <div className={s.sticky}>
          <h2 className={s.srOnly}>Showreel</h2>
          <Cut src={REEL} poster="/media/reel/reel-poster.jpg" lines={["Showreel"]} mode="scroll" className={s.full} />
          <div className={s.pinCaption}>
            <p className={s.label}>Made in house · 00:58</p>
            <button type="button" className={s.btnPrimary} onClick={() => setReelOpen(true)}>
              <span className={s.play} aria-hidden /> Watch with sound
            </button>
          </div>
        </div>
      </Section>

      {/* 03 services: each word opens into its clip */}
      <div id="services">
        {SERVICES.map((sv, i) => (
          <Section key={sv.word} className={`${s.pin} ${s.pinService}`} host>
            <div className={`${s.sticky} ${s.serviceGrid} ${i % 2 ? s.flip : ""}`}>
              <Cut src={`/media/window/${sv.clip}.mp4`} poster={`/media/window/${sv.clip}.jpg`} lines={[sv.word]} mode="scroll" className={s.serviceCut} />
              <div className={s.serviceText}>
                <p className={s.label}>
                  Nº {sv.n} · {sv.group}
                </p>
                <h2 className={s.h2}>{sv.title}</h2>
                <p className={s.body}>{sv.body}</p>
                <ul className={s.list}>
                  {sv.items.map((it, j) => (
                    <li key={it}>
                      <span className={s.listN}>0{j + 1}</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        ))}
      </div>

      {/* 04 the work: every title is a window; hover opens it */}
      <section id="work" className={s.work}>
        <div className={s.workHead}>
          <p className={`${s.label} ${s.reveal}`}>Nº 04 · Selected work</p>
          <h2 className={`${s.h2} ${s.reveal}`}>Work that makes people look twice.</h2>
          <p className={`${s.body} ${s.reveal}`}>Hover a title to open it.</p>
        </div>
        <div className={s.grid}>
          {WORK.map((wk, i) => (
            <figure key={wk.clip} className={`${s.tile} ${s.reveal} ${i % 4 === 1 || i % 4 === 3 ? s.tileLow : ""}`}>
              <Cut src={`/media/window/${wk.clip}.mp4`} poster={`/media/window/${wk.clip}.jpg`} lines={wk.title.split(" ")} mode="hover" className={s.tileCut} />
              <figcaption className={s.caption}>
                <span>[PLACEHOLDER: client]</span>
                <span>{wk.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 05 who */}
      <section className={s.who}>
        <h2 className={`${s.whoTitle} ${s.reveal}`}>Built for brands with more than one front door.</h2>
        <ul className={s.whoList}>
          {[
            ["Franchise and multi-location", "Open more locations and get more out of the ones you have."],
            ["Ecommerce", "One team across your ads, search, site and creative."],
            ["Software", "Demand that shows up in the pipeline, not just the dashboard."],
            ["Single location", "Grow where you are, then grow past it."],
          ].map(([a, b], i) => (
            <li key={a} className={s.reveal} style={{ transitionDelay: `${i * 80}ms` }}>
              <span className={s.listN}>0{i + 1}</span>
              <strong>{a}</strong>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 06 finale */}
      <section className={s.finale}>
        <h2 className={s.srOnly}>Let&rsquo;s make you the brand people remember.</h2>
        <Cut src={REEL} poster="/media/reel/reel-poster.jpg" lines={["Let’s", "talk."]} mode="none" tone="blue" className={s.finaleCut} />
        <div className={s.finaleFoot}>
          <p className={s.finaleLede}>Let&rsquo;s make you the brand people remember.</p>
          <div className={s.ctas}>
            <Link href="/schedule/" className={s.btnWhite}>Schedule a Call</Link>
            <Link href="/audit/" className={s.btnLight}>Get a free audit</Link>
          </div>
        </div>
      </section>

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
