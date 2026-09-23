"use client";

/* Direction A, full page (sketch, 2026-09-23). The field of blue squares
   is the continuity device. The hero and the finale are full-screen
   fields made from the reel; everything in between arrives as squares
   and resolves into the real footage as it reaches the middle of the
   screen (blue halftone, then coloured squares, then the video), like
   a photo developing. Hover resolves a piece at once. */

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { SmoothScroll, getLenis } from "@/components/motion/SmoothScroll";
import s from "./field.module.css";

const REEL = "/media/reel/reel-loop-720.mp4";
const BLUE: [number, number, number] = [6, 87, 249];
const PAPER = "#F5F6F8";
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/* run a frame loop only while an element is on screen */
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

/* the source rectangle that fills a box of aspect ga (object-fit: cover) */
function coverRect(sw: number, sh: number, ga: number) {
  let w = sw, h = sh, x = 0, y = 0;
  if (sw / sh > ga) { w = sh * ga; x = (sw - w) / 2; } else { h = sw / ga; y = (sh - h) / 2; }
  return { x, y, w, h };
}

/* ---------- a full-screen field: the reel as a halftone, text carved out, a lens ---------- */
function FieldScreen({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const canvas = canvasRef.current!;
    const video = videoRef.current!;
    const ctx = canvas.getContext("2d")!;
    const sample = document.createElement("canvas");
    const sctx = sample.getContext("2d", { willReadFrequently: true })!;
    let mx = -9999, my = -9999, lx = -9999, ly = -9999;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => { mx = my = -9999; };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);

    // squares clear a soft margin around every line of text and every button
    const PAD = 14, FADE = 26;
    let mask = new Float32Array(0);
    let key = "";
    const buildMask = (cols: number, rows: number, cell: number) => {
      const c = canvas.getBoundingClientRect();
      const holes: { x0: number; y0: number; x1: number; y1: number }[] = [];
      root.querySelectorAll("[data-clear]").forEach((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = el.matches("a, button") ? [el.getBoundingClientRect()] : [...range.getClientRects()];
        for (const r of rects) if (r.width > 2) holes.push({ x0: r.left - c.left, y0: r.top - c.top, x1: r.right - c.left, y1: r.bottom - c.top });
      });
      mask = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const px = x * cell + cell / 2, py = y * cell + cell / 2;
          let k = 1;
          for (const h of holes) {
            const d = Math.hypot(Math.max(h.x0 - px, 0, px - h.x1), Math.max(h.y0 - py, 0, py - h.y1));
            if (d < PAD) { k = 0; break; }
            if (d < PAD + FADE) k = Math.min(k, (d - PAD) / FADE);
          }
          mask[y * cols + x] = k;
        }
    };

    const stopAll = whileVisible(root, () => {
      video.play().catch(() => {});
      let raf = 0, n = 0, last = performance.now();
      const frame = (t: number) => {
        raf = requestAnimationFrame(frame);
        if (t - last < 32) return; // 30 fps is plenty: the footage itself is 25
        const dt = Math.min(0.1, (t - last) / 1000);
        last = t;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const W = canvas.clientWidth, H = canvas.clientHeight;
        if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
          canvas.width = Math.round(W * dpr);
          canvas.height = Math.round(H * dpr);
        }
        const cell = W < 800 ? 10 : 14;
        const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
        if (sample.width !== cols || sample.height !== rows) { sample.width = cols; sample.height = rows; }
        const k2 = `${cols}x${rows}`;
        if (k2 !== key || n++ % 45 === 0) { buildMask(cols, rows, cell); key = k2; }
        if (video.readyState < 2) return;
        const cr = coverRect(video.videoWidth, video.videoHeight, cols / rows);
        sctx.drawImage(video, cr.x, cr.y, cr.w, cr.h, 0, 0, cols, rows);
        const px = sctx.getImageData(0, 0, cols, rows).data;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = PAPER;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = `rgb(${BLUE.join(",")})`;
        const follow = 1 - Math.exp(-dt * 16);
        if (lx < -9000 || mx < -9000) { lx = mx; ly = my; }
        lx += (mx - lx) * follow;
        ly += (my - ly) * follow;
        const wave = t * 0.0012;
        ctx.beginPath();
        for (let y = 0; y < rows; y++)
          for (let x = 0; x < cols; x++) {
            const i = (y * cols + x) * 4;
            const lum = (px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11) / 255;
            let size = (1 - lum) * cell * 0.92 * (0.85 + 0.15 * Math.sin(wave + x * 0.18 + y * 0.11)) * mask[y * cols + x];
            let ox = x * cell + cell / 2, oy = y * cell + cell / 2;
            const dx = ox - lx, dy = oy - ly, d = Math.hypot(dx, dy);
            if (d < 220) {
              const k = 1 - d / 220;
              ox += (dx / (d || 1)) * k * 26;
              oy += (dy / (d || 1)) * k * 26;
              size *= 1 + k * 0.6;
            }
            if (size < 0.6) continue;
            ctx.rect(ox - size / 2, oy - size / 2, size, size);
          }
        ctx.fill();
        if (mx > -9000) {
          const L = W < 800 ? 140 : 230;
          const bx = lx - L / 2, by = ly - L / 2;
          const fr = coverRect(video.videoWidth, video.videoHeight, W / H);
          ctx.drawImage(video, fr.x + (bx / W) * fr.w, fr.y + (by / H) * fr.h, (L / W) * fr.w, (L / H) * fr.h, bx, by, L, L);
          ctx.strokeStyle = "#0B0F17";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx, by, L, L);
        }
      };
      raf = requestAnimationFrame(frame);
      return () => {
        cancelAnimationFrame(raf);
        video.pause();
      };
    });
    return () => {
      stopAll();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={ref} className={`${s.field} ${className ?? ""}`}>
      <video ref={videoRef} className={s.offscreen} src={REEL} muted loop playsInline preload="auto" />
      <canvas ref={canvasRef} className={s.fill} />
      {children}
    </section>
  );
}

/* ---------- media that develops: blue halftone, coloured squares, then the footage ---------- */
function Resolve({ src, poster, ratio, delay = 0, className }: { src: string; poster: string; ratio: string; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = ref.current!;
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const sample = document.createElement("canvas");
    const sctx = sample.getContext("2d", { willReadFrequently: true })!;
    const img = new Image();
    img.src = poster;
    let hover = false;
    const on = () => (hover = true);
    const off = () => (hover = false);
    wrap.addEventListener("pointerenter", on);
    wrap.addEventListener("pointerleave", off);
    let cur = 0;

    const stopAll = whileVisible(wrap, () => {
      video.play().catch(() => {});
      let raf = 0, last = performance.now();
      const frame = (t: number) => {
        raf = requestAnimationFrame(frame);
        if (t - last < 32) return;
        const dt = Math.min(0.1, (t - last) / 1000);
        last = t;
        const vh = window.innerHeight;
        const r = wrap.getBoundingClientRect();
        // how close to the middle of the screen this piece is
        const near = 1 - clamp(Math.abs(r.top + r.height / 2 - vh * 0.5) / (vh * 0.62));
        const target = hover ? 1 : ease(clamp(near * 1.5 - delay));
        cur += (target - cur) * (1 - Math.exp(-dt * 5));
        const vA = clamp((cur - 0.6) / 0.32);
        if (vA >= 0.999) {
          canvas.style.opacity = "0";
          return;
        }
        canvas.style.opacity = "1";
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const W = canvas.clientWidth, H = canvas.clientHeight;
        if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
          canvas.width = Math.round(W * dpr);
          canvas.height = Math.round(H * dpr);
        }
        const cell = Math.max(7, Math.min(16, W / 40));
        const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
        if (sample.width !== cols || sample.height !== rows) { sample.width = cols; sample.height = rows; }
        const srcEl: CanvasImageSource | null = video.readyState >= 2 ? video : img.complete && img.naturalWidth ? img : null;
        if (!srcEl) return;
        const sw = srcEl instanceof HTMLVideoElement ? srcEl.videoWidth : (srcEl as HTMLImageElement).naturalWidth;
        const sh = srcEl instanceof HTMLVideoElement ? srcEl.videoHeight : (srcEl as HTMLImageElement).naturalHeight;
        const cr = coverRect(sw, sh, cols / rows);
        sctx.drawImage(srcEl, cr.x, cr.y, cr.w, cr.h, 0, 0, cols, rows);
        const px = sctx.getImageData(0, 0, cols, rows).data;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        ctx.globalAlpha = 1 - vA;
        ctx.fillStyle = PAPER;
        ctx.fillRect(0, 0, W, H);
        const a = clamp(cur / 0.62); // 0: blue halftone, 1: full-colour squares
        // colour stage: the sample itself, scaled up with hard edges
        if (a > 0.01) {
          ctx.globalAlpha = (1 - vA) * a;
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(sample, 0, 0, cols, rows, 0, 0, cols * cell, rows * cell);
          // hairline gaps so it still reads as squares
          ctx.fillStyle = PAPER;
          for (let x = 1; x < cols; x++) ctx.fillRect(x * cell - 0.75, 0, 1.5, H);
          for (let y = 1; y < rows; y++) ctx.fillRect(0, y * cell - 0.75, W, 1.5);
        }
        // halftone stage: blue squares sized by darkness, one path
        if (a < 0.99) {
          ctx.globalAlpha = (1 - vA) * (1 - a);
          ctx.fillStyle = `rgb(${BLUE.join(",")})`;
          ctx.beginPath();
          for (let y = 0; y < rows; y++)
            for (let x = 0; x < cols; x++) {
              const i = (y * cols + x) * 4;
              const lum = (px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11) / 255;
              const size = (1 - lum) * 0.92 * cell;
              if (size < 0.6) continue;
              ctx.rect(x * cell + (cell - size) / 2, y * cell + (cell - size) / 2, size, size);
            }
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      };
      raf = requestAnimationFrame(frame);
      return () => {
        cancelAnimationFrame(raf);
        video.pause();
      };
    });
    return () => {
      stopAll();
      wrap.removeEventListener("pointerenter", on);
      wrap.removeEventListener("pointerleave", off);
    };
  }, [poster, delay]);

  return (
    <div ref={ref} className={`${s.resolve} ${className ?? ""}`} style={{ aspectRatio: ratio }}>
      <video ref={videoRef} className={s.resolveVideo} src={src} poster={poster} muted loop playsInline preload="metadata" />
      <canvas ref={canvasRef} className={s.fill} />
    </div>
  );
}

const SERVICES = [
  {
    n: "01",
    group: "Paid Advertising",
    title: "Ads held to what they bring in.",
    body: "Google, Meta, Amazon and Local Services ads, aimed at the people ready to buy. We cut what only spends and push what books.",
    items: ["Paid search", "Paid social", "Amazon ads", "Local Services ads"],
    clip: "paid",
    caption: "BigSquare launch spot",
  },
  {
    n: "02",
    group: "Organic Marketing",
    title: "Content people stop for.",
    body: "We make the posts, run the social and keep people talking about you between the ads.",
    items: ["Content creation", "Social media", "Email and text", "Search engine optimization"],
    clip: "organic",
    caption: "Story animation",
  },
  {
    n: "03",
    group: "Design & Development",
    title: "Creative made in house.",
    body: "Brand films, ads and the pages they point to, made by the same team that runs them. Nothing gets lost between vendors.",
    items: ["Brand and creative", "Video and motion", "Websites and landing pages"],
    clip: "design",
    caption: "Signature animal",
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

export function FieldPage() {
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

      {/* 01 hero: the reel as a field of squares */}
      <FieldScreen className={s.hero}>
        <div className={s.heroText}>
          <p className={s.label} data-clear>Full-stack marketing · Denver and Tampa</p>
          <h1 className={s.h1} data-clear>
            More customers.
            <br />
            More revenue you
            <br />
            can <span className={s.blue}>count.</span>
          </h1>
          <p className={s.lede} data-clear>
            BigSquare is the growth partner for brands that want proof. One team runs your ads, your search, your site and your creative.
          </p>
          <div className={s.ctas}>
            <Link href="/schedule/" className={s.btnPrimary} data-clear>Schedule a Call</Link>
            <button type="button" className={s.btnGhost} data-clear onClick={() => setReelOpen(true)}>
              <span className={s.play} aria-hidden /> Watch the reel
            </button>
          </div>
        </div>
        <p className={s.hint} data-clear>Every square is our work. Move your cursor.</p>
      </FieldScreen>

      {/* 02 the reel develops as it reaches the middle */}
      <section className={s.reel}>
        <div className={s.reelHead}>
          <p className={`${s.label} ${s.reveal}`}>Showreel · 00:58</p>
          <h2 className={`${s.h2} ${s.reveal}`}>Made in house. Made to be seen.</h2>
        </div>
        <Resolve src={REEL} poster="/media/reel/reel-poster.jpg" ratio="16 / 9" />
        <div className={s.reelFoot}>
          <p className={s.body}>Commercials and social ads we made for our clients, shot and cut by our own team.</p>
          <button type="button" className={s.btnPrimary} onClick={() => setReelOpen(true)}>
            <span className={s.play} aria-hidden /> Watch with sound
          </button>
        </div>
      </section>

      {/* 03 services */}
      <div id="services">
        {SERVICES.map((sv, i) => (
          <section key={sv.n} className={`${s.service} ${i % 2 ? s.flip : ""}`}>
            <div className={s.serviceText}>
              <p className={`${s.label} ${s.reveal}`}>
                Nº {sv.n} · {sv.group}
              </p>
              <h2 className={`${s.h2} ${s.reveal}`}>{sv.title}</h2>
              <p className={`${s.body} ${s.reveal}`}>{sv.body}</p>
              <ul className={s.list}>
                {sv.items.map((it, j) => (
                  <li key={it} className={s.reveal} style={{ transitionDelay: `${j * 70}ms` }}>
                    <span className={s.listN}>0{j + 1}</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
            <figure className={s.serviceMedia}>
              <Resolve src={`/media/window/${sv.clip}.mp4`} poster={`/media/window/${sv.clip}.jpg`} ratio="1 / 1" />
              <figcaption className={s.caption}>
                <span>{sv.caption}</span>
                <span>Nº {sv.n}</span>
              </figcaption>
            </figure>
          </section>
        ))}
      </div>

      {/* 04 the work */}
      <section id="work" className={s.work}>
        <div className={s.workHead}>
          <p className={`${s.label} ${s.reveal}`}>Nº 04 · Selected work</p>
          <h2 className={`${s.h2} ${s.reveal}`}>Work that makes people look twice.</h2>
        </div>
        <div className={s.grid}>
          {WORK.map((wk, i) => (
            <figure key={wk.clip} className={`${s.tile} ${i % 4 === 1 || i % 4 === 3 ? s.tileLow : ""}`}>
              <Resolve src={`/media/window/${wk.clip}.mp4`} poster={`/media/window/${wk.clip}.jpg`} ratio="4 / 5" delay={(i % 4) * 0.08} />
              <figcaption className={s.caption}>
                <span className={s.tileTitle}>{wk.title}</span>
                <span>{wk.tag}</span>
              </figcaption>
              <p className={s.client}>[PLACEHOLDER: client]</p>
            </figure>
          ))}
        </div>
      </section>

      {/* 05 who it is for */}
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
              <span className={s.whoN}>0{i + 1}</span>
              <strong>{a}</strong>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 06 finale: the field again */}
      <FieldScreen className={s.finale}>
        <div className={s.finaleText}>
          <p className={s.label} data-clear>Let&rsquo;s talk</p>
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
