"use client";

/* The window (prototype, 2026-09-23). A native-scrolling editorial page
   with one continuity device: the square from the logo, always playing
   real work. One fixed 2D canvas draws up to four "panes" of video.
   Sections place empty anchor boxes ([data-station]); every frame the
   panes glide between the two stations nearest the middle of the
   viewport, docking on each. A single-window station splits its box
   into four quadrants that together show one video, so the window can
   break into four squares (the logo animation) and land on the work. */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SmoothScroll, getLenis } from "@/components/motion/SmoothScroll";
import s from "./window.module.css";

const BLUE = "#0657F9";

/* every clip the window can play: silent, small, looping */
const CLIPS: Record<string, { src: string; poster: string }> = {
  reel: { src: "/media/reel/reel-loop-720.mp4", poster: "/media/reel/reel-poster.jpg" },
  paid: { src: "/media/window/paid.mp4", poster: "/media/window/paid.jpg" },
  organic: { src: "/media/window/organic.mp4", poster: "/media/window/organic.jpg" },
  design: { src: "/media/window/design.mp4", poster: "/media/window/design.jpg" },
  ...Object.fromEntries(
    [1, 2, 3, 4, 5, 6, 7, 8].map((n) => [`w${n}`, { src: `/media/window/w${n}.mp4`, poster: `/media/window/w${n}.jpg` }]),
  ),
};

const WORK = [
  { clip: "w1", tag: "Brand · Motion" },
  { clip: "w2", tag: "Product teaser" },
  { clip: "w3", tag: "VFX · Social" },
  { clip: "w4", tag: "Product animation" },
  { clip: "w5", tag: "Concept film" },
  { clip: "w6", tag: "Concept · 3D" },
  { clip: "w7", tag: "Concept film" },
  { clip: "w8", tag: "Brand animation" },
];

type Rect = { x: number; y: number; w: number; h: number };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const rectOf = (el: Element): Rect => {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
};

export function WindowPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reelOpen, setReelOpen] = useState(false);

  /* reveal-on-enter for type and tiles */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add(s.in)),
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll(`.${s.reveal}`).forEach((el) => io.observe(el));
    // DOM work tiles play only while on screen
    const vio = new IntersectionObserver((entries) =>
      entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      }),
    );
    document.querySelectorAll(`video.${s.tileVideo}`).forEach((v) => vio.observe(v));
    return () => {
      io.disconnect();
      vio.disconnect();
    };
  }, []);

  /* the reel with sound pauses the page scroll */
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

  /* always open at the top: the page is a journey, not a place to resume */
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => getLenis()?.scrollTo(0, { immediate: true }));
    return () => cancelAnimationFrame(id);
  }, []);

  /* the compositor */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const media = new Map<string, { v: HTMLVideoElement; img: HTMLImageElement; lastUsed: number }>();
    const get = (key: string) => {
      let m = media.get(key);
      if (!m) {
        const v = document.createElement("video");
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.preload = "auto";
        v.src = CLIPS[key].src;
        const img = new Image();
        img.src = CLIPS[key].poster;
        m = { v, img, lastUsed: 0 };
        media.set(key, m);
      }
      return m;
    };

    type Station = { els: HTMLElement[]; clips: string[]; fill: number; dim: number };
    let stations: Station[] = [];
    const collect = () => {
      stations = [...document.querySelectorAll<HTMLElement>("[data-station]")].map((el) => {
        const clips = (el.dataset.clips ?? "reel").split(",");
        const els = clips.length === 4 ? [...el.querySelectorAll<HTMLElement>("[data-pane]")] : [el];
        return { els, clips, fill: Number(el.dataset.fill ?? 0), dim: Number(el.dataset.dim ?? 0) };
      });
      stations.forEach((st) => st.clips.forEach((c) => get(c)));
    };
    collect();

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    /* pane i of a station: its box, and the box its video is framed to */
    const paneOf = (st: Station, i: number) => {
      if (st.els.length === 4) {
        const r = rectOf(st.els[i]);
        return { r, g: r, clip: st.clips[i] };
      }
      const g = rectOf(st.els[0]);
      const qx = i % 2;
      const qy = Math.floor(i / 2);
      return { r: { x: g.x + (qx * g.w) / 2, y: g.y + (qy * g.h) / 2, w: g.w / 2, h: g.h / 2 }, g, clip: st.clips[0] };
    };
    const centerY = (st: Station) => {
      const rs = st.els.map(rectOf);
      const top = Math.min(...rs.map((r) => r.y));
      const bot = Math.max(...rs.map((r) => r.y + r.h));
      return (top + bot) / 2;
    };

    /* device-pixel box with rounded edges, so neighbouring quarters meet exactly */
    const snap = (r: Rect) => {
      const x0 = Math.round(r.x * dpr);
      const y0 = Math.round(r.y * dpr);
      return { x: x0, y: y0, w: Math.round((r.x + r.w) * dpr) - x0, h: Math.round((r.y + r.h) * dpr) - y0 };
    };

    /* draw one clip into pane r, framed (object-fit: cover) to box g */
    const draw = (key: string, r: Rect, g: Rect, alpha: number, now: number) => {
      if (alpha <= 0.002 || r.w < 1 || r.h < 1) return;
      const m = get(key);
      m.lastUsed = now;
      if (m.v.paused) m.v.play().catch(() => {});
      const src: CanvasImageSource | null = m.v.readyState >= 2 ? m.v : m.img.complete && m.img.naturalWidth ? m.img : null;
      if (!src) return;
      const sw0 = src instanceof HTMLVideoElement ? src.videoWidth : (src as HTMLImageElement).naturalWidth;
      const sh0 = src instanceof HTMLVideoElement ? src.videoHeight : (src as HTMLImageElement).naturalHeight;
      const ga = g.w / g.h;
      let sw = sw0, sh = sh0, sx = 0, sy = 0;
      if (sw0 / sh0 > ga) { sw = sh0 * ga; sx = (sw0 - sw) / 2; } else { sh = sw0 / ga; sy = (sh0 - sh) / 2; }
      const fx = (r.x - g.x) / g.w;
      const fy = (r.y - g.y) / g.h;
      const d = snap(r);
      ctx.globalAlpha = alpha;
      ctx.drawImage(src, sx + fx * sw, sy + fy * sh, (r.w / g.w) * sw, (r.h / g.h) * sh, d.x, d.y, d.w, d.h);
      ctx.globalAlpha = 1;
    };

    const growEls = [...document.querySelectorAll<HTMLElement>("[data-grow]")];
    const darkEls = [...document.querySelectorAll<HTMLElement>("[data-dark]")];
    const header = document.querySelector<HTMLElement>(`.${s.header}`);
    let headerDark = false;
    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!stations.length) return;
      growEls.forEach((el) => {
        const sec = el.closest("section");
        if (!sec) return;
        const r = sec.getBoundingClientRect();
        const prog = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
        const k = 1 - ease(clamp(prog / 0.7));
        el.style.inset = `${(k * 9).toFixed(3)}vh ${(k * 7).toFixed(3)}vw`;
      });
      const mid = window.innerHeight / 2;
      const cys = stations.map(centerY);
      let a = 0;
      for (let i = 0; i < stations.length; i++) if (cys[i] <= mid) a = i;
      const b = Math.min(stations.length - 1, cys[0] > mid ? 0 : a + 1);
      const w = a === b ? 0 : clamp((mid - cys[a]) / (cys[b] - cys[a]));
      const e = ease(clamp((w - 0.1) / 0.8)); // dock on each station, glide between
      const A = stations[a];
      const B = stations[b];

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 4; i++) {
        const pa = paneOf(A, i);
        const pb = paneOf(B, i);
        const r = lerpRect(pa.r, pb.r, e);
        const g = lerpRect(pa.g, pb.g, e);
        if (pa.clip === pb.clip) draw(pa.clip, r, g, 1, now);
        else {
          draw(pa.clip, r, g, 1, now);
          draw(pb.clip, r, g, e, now);
        }
        const dim = lerp(A.dim, B.dim, e);
        if (dim > 0.002) {
          const d = snap(r);
          ctx.fillStyle = `rgba(11,15,23,${dim})`;
          ctx.fillRect(d.x, d.y, d.w, d.h);
        }
        const fill = lerp(A.fill, B.fill, e);
        if (fill > 0.002) {
          ctx.globalAlpha = fill;
          const d = snap(r);
          ctx.fillStyle = BLUE;
          ctx.fillRect(d.x, d.y, d.w, d.h);
          ctx.globalAlpha = 1;
        }
      }
      // the header turns white while the reel or the blue finale is under it
      let dark = false;
      darkEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= 40 && r.bottom >= 40) dark = true;
      });
      if (dark !== headerDark) {
        headerDark = dark;
        header?.classList.toggle(s.headerDark, dark);
      }
      // clips nobody has drawn for a second stop decoding
      media.forEach((m) => {
        if (!m.v.paused && now - m.lastUsed > 1000) m.v.pause();
      });
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      media.forEach((m) => {
        m.v.pause();
        m.v.removeAttribute("src");
        m.v.load();
      });
    };
  }, []);

  return (
    <div className={s.page}>
      <SmoothScroll />
      <canvas ref={canvasRef} className={s.canvas} aria-hidden />

      <header className={s.header}>
        <Link href="/" className={s.logo}>
          <span className={s.logoMark} aria-hidden />
          BigSquare
        </Link>
        <nav className={s.nav}>
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <Link href="/schedule/" className={s.navCta}>Let&rsquo;s Talk</Link>
        </nav>
      </header>

      {/* 01 hero */}
      <section className={s.hero}>
        <div className={s.heroText}>
          <p className={`${s.label} ${s.reveal}`}>Full-stack marketing · Denver and Tampa</p>
          <h1 className={s.h1}>
            <span className={s.line}><span>More customers.</span></span>
            <span className={s.line}><span>More revenue</span></span>
            <span className={s.line}><span>you can <em className={s.count}>count.</em></span></span>
          </h1>
          <div className={`${s.heroFoot} ${s.reveal}`}>
            <p className={s.lede}>
              BigSquare is the growth partner for brands that want proof. One team runs your ads, your search, your site and your
              creative.
            </p>
            <div className={s.ctas}>
              <Link href="/schedule/" className={s.btnPrimary}>Schedule a Call</Link>
              <button type="button" className={s.btnGhost} onClick={() => setReelOpen(true)}>
                <span className={s.play} aria-hidden /> Watch the reel
              </button>
            </div>
          </div>
        </div>
        <div className={s.heroWindowWrap}>
          <div className={s.heroWindow} data-station data-clips="reel" />
          <p className={s.caption}>
            <span>Showreel</span>
            <span>00:58</span>
          </p>
        </div>
      </section>

      {/* 02 the reel takes the screen */}
      <section className={s.reel}>
        <div className={s.sticky}>
          <div className={s.full} data-station data-clips="reel" data-dim="0.38" data-dark data-grow />
          <div className={s.reelText}>
            <p className={`${s.label} ${s.labelLight}`}>Showreel · Made in house</p>
            <h2 className={s.reelTitle}>
              Search, ads, sites and creative.
              <br />
              One team. No handoffs.
            </h2>
            <button type="button" className={s.btnLight} onClick={() => setReelOpen(true)}>
              <span className={s.play} aria-hidden /> Watch with sound
            </button>
          </div>
        </div>
      </section>

      {/* 03 services: the window docks beside each one */}
      <div id="services">
        {[
          {
            n: "01",
            group: "Paid Advertising",
            title: "Ads held to what they bring in.",
            body: "Google, Meta, Amazon and Local Services ads, aimed at the people ready to buy. We cut what only spends and push what books.",
            items: ["Paid search", "Paid social", "Amazon ads", "Local Services ads"],
            clip: "paid",
            caption: "BigSquare launch spot",
            flip: false,
          },
          {
            n: "02",
            group: "Organic Marketing",
            title: "Content people stop for.",
            body: "We make the posts, run the social and keep people talking about you between the ads.",
            items: ["Content creation", "Social media", "Email and text", "Search engine optimization"],
            clip: "organic",
            caption: "Story animation",
            flip: true,
          },
          {
            n: "03",
            group: "Design & Development",
            title: "Creative made in house.",
            body: "Brand films, ads and the pages they point to, made by the same team that runs them. Nothing gets lost between vendors.",
            items: ["Brand and creative", "Video and motion", "Websites and landing pages"],
            clip: "design",
            caption: "Signature animal",
            flip: false,
          },
        ].map((sv) => (
          <section key={sv.n} className={`${s.service} ${sv.flip ? s.flip : ""}`}>
            <div className={s.serviceText}>
              <p className={`${s.label} ${s.reveal}`}>
                Nº {sv.n} · {sv.group}
              </p>
              <h2 className={`${s.h2} ${s.reveal}`}>{sv.title}</h2>
              <p className={`${s.body} ${s.reveal}`}>{sv.body}</p>
              <ul className={`${s.list} ${s.reveal}`}>
                {sv.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
            <div className={s.serviceWindowWrap}>
              <div className={s.serviceWindow} data-station data-clips={sv.clip} />
              <p className={s.caption}>
                <span>{sv.caption}</span>
                <span>Nº {sv.n}</span>
              </p>
            </div>
          </section>
        ))}
      </div>

      {/* 04 one square becomes four */}
      <section className={s.split}>
        <div className={s.sticky}>
          <p className={`${s.label} ${s.reveal}`}>Nº 04 · Selected work</p>
          <div className={s.row} data-station data-clips="w1,w2,w3,w4" data-fill="1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={s.rowSquare} data-pane />
            ))}
          </div>
          <h2 className={`${s.splitTitle} ${s.reveal}`}>Work that makes people look twice.</h2>
        </div>
      </section>

      {/* 05 the work */}
      <section id="work" className={s.work}>
        <div className={s.workHead}>
          <h2 className={`${s.h2} ${s.reveal}`}>Selected work</h2>
          <p className={`${s.body} ${s.reveal}`}>Ads, films and brand pieces our team made. Every one of them ran.</p>
        </div>
        <div className={s.grid} data-station data-clips="w1,w2,w3,w4">
          {WORK.map((wk, i) => (
            <figure key={wk.clip} className={`${s.tile} ${s.reveal}`} style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
              {i < 4 ? (
                <div className={s.tileMedia} data-pane style={{ backgroundImage: `url(${CLIPS[wk.clip].poster})` }} />
              ) : (
                <div className={s.tileMedia}>
                  <video className={s.tileVideo} src={CLIPS[wk.clip].src} poster={CLIPS[wk.clip].poster} muted loop playsInline preload="metadata" />
                </div>
              )}
              <figcaption className={s.tileCap}>
                <span>[PLACEHOLDER: client name]</span>
                <span>{wk.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 06 who it is for */}
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

      {/* 07 everything folds back into one big square */}
      <section className={s.finale}>
        <div className={s.sticky}>
          <div className={s.full} data-station data-clips="reel" data-fill="1" data-dark data-grow />
          <div className={s.finaleText}>
            <p className={`${s.label} ${s.labelLight}`}>Let&rsquo;s talk</p>
            <h2 className={s.finaleTitle}>
              Let&rsquo;s make you the brand
              <br />
              people remember.
            </h2>
            <div className={s.ctas}>
              <Link href="/schedule/" className={s.btnWhite}>Schedule a Call</Link>
              <Link href="/audit/" className={s.btnLight}>Get a free audit</Link>
            </div>
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
