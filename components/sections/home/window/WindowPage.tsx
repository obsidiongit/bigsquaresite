"use client";

/* The window (prototype, 2026-09-23, round 3). One continuity device:
   the square from the logo, always playing real work. It starts as the
   full stop of the headline, opens into the full-screen reel, rides a
   sideways film strip of the three service groups, stays pinned beside
   an index of the work (scroll picks the project), and lands in a
   closing wall of work.

   A fixed WebGL layer draws up to four panes of video. Sections place
   anchor boxes ([data-station]); every frame the panes glide between
   the two stations either side of the middle of the screen and dock on
   each. Stations inside the sideways strip (data-axis="x") are ordered
   by their horizontal position, so the window rides the strip. Panes
   bend with scroll speed, split colour slightly at speed and push in
   under the cursor. */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { SmoothScroll, getLenis } from "@/components/motion/SmoothScroll";
import s from "./window.module.css";

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

const SERVICES = [
  {
    n: "01",
    group: "Paid Advertising",
    title: "Ads held to what they bring in.",
    body: "Google, Meta, Amazon and Local Services ads, aimed at the people ready to buy. We cut what only spends and push what books.",
    items: ["Paid search", "Paid social", "Amazon ads", "Local Services ads"],
    clip: "paid",
    caption: "BigSquare launch spot",
    dark: false,
  },
  {
    n: "02",
    group: "Organic Marketing",
    title: "Content people stop for.",
    body: "We make the posts, run the social and keep people talking about you between the ads.",
    items: ["Content creation", "Social media", "Email and text", "Search engine optimization"],
    clip: "organic",
    caption: "Story animation",
    dark: true,
  },
  {
    n: "03",
    group: "Design & Development",
    title: "Creative made in house.",
    body: "Brand films, ads and the pages they point to, made by the same team that runs them. Nothing gets lost between vendors.",
    items: ["Brand and creative", "Video and motion", "Websites and landing pages"],
    clip: "design",
    caption: "Signature animal",
    dark: false,
  },
];

/* the closing wall: two columns drifting past each other; data-pane tiles are where the window lands */
const WALL_L = ["w5", "w1", "w7", "w2"];
const WALL_R = ["w6", "w3", "w8", "w4"];

type Rect = { x: number; y: number; w: number; h: number };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const rectOf = (el: Element): Rect => {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
};
const inside = (r: Rect, x: number, y: number) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

/* one pane: a screen-space quad that bends with scroll speed */
const VERT = /* glsl */ `
  uniform vec4 uRect;   // x, y, w, h in CSS px, y down
  uniform vec2 uView;
  uniform float uVel;   // smoothed scroll speed, px per frame
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec2 p = uRect.xy + vec2(uv.x, 1.0 - uv.y) * uRect.zw;
    float bend = sin(uv.x * 3.14159265);
    p.y += bend * uVel * 0.55;               // the middle lags behind the edges
    p.x += (uv.y - 0.5) * uVel * 0.12;       // a slight shear
    gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, 0.0, 1.0);
  }
`;
const FRAG = /* glsl */ `
  uniform sampler2D uA;
  uniform sampler2D uB;
  uniform vec4 uCropA;  // x, y, w, h of the source, 0..1, image space (y down)
  uniform vec4 uCropB;
  uniform float uMix;
  uniform float uFill;
  uniform float uDim;
  uniform float uShift;
  uniform vec3 uBlue;
  varying vec2 vUv;
  vec3 look(sampler2D t, vec4 c) {
    vec2 ip = c.xy + vec2(vUv.x, 1.0 - vUv.y) * c.zw;
    vec2 u = vec2(ip.x, 1.0 - ip.y);
    return vec3(
      texture2D(t, u + vec2(uShift, 0.0)).r,
      texture2D(t, u).g,
      texture2D(t, u - vec2(uShift, 0.0)).b
    );
  }
  void main() {
    vec3 col = look(uA, uCropA);
    if (uMix > 0.001) col = mix(col, look(uB, uCropB), uMix);
    col = mix(col, vec3(0.043, 0.059, 0.09), uDim);
    col = mix(col, uBlue, uFill);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function WindowPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [reelOpen, setReelOpen] = useState(false);

  /* always open at the top: the page is a journey, not a place to resume */
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => getLenis()?.scrollTo(0, { immediate: true }));
    return () => cancelAnimationFrame(id);
  }, []);

  /* reveal-on-enter for type and tiles */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add(s.in)),
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll(`.${s.reveal}`).forEach((el) => io.observe(el));
    return () => io.disconnect();
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

  /* the compositor, the cursor and everything scroll-linked */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const quad = new THREE.PlaneGeometry(1, 1, 32, 32);
    const blank = new THREE.DataTexture(new Uint8Array([245, 246, 248, 255]), 1, 1);
    blank.needsUpdate = true;

    /* clip media: a video, its texture, and a poster until the video has frames */
    type Media = { v: HTMLVideoElement; vt: THREE.VideoTexture; img: HTMLImageElement; it: THREE.Texture; lastUsed: number };
    const media = new Map<string, Media>();
    const get = (key: string): Media => {
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
        const it = new THREE.Texture(img);
        img.onload = () => (it.needsUpdate = true);
        const vt = new THREE.VideoTexture(v);
        m = { v, vt, img, it, lastUsed: 0 };
        media.set(key, m);
      }
      return m;
    };
    const source = (key: string, now: number) => {
      const m = get(key);
      m.lastUsed = now;
      if (m.v.paused) m.v.play().catch(() => {});
      if (m.v.readyState >= 2 && m.v.videoWidth) return { tex: m.vt as THREE.Texture, w: m.v.videoWidth, h: m.v.videoHeight };
      if (m.img.complete && m.img.naturalWidth) return { tex: m.it, w: m.img.naturalWidth, h: m.img.naturalHeight };
      return { tex: blank as THREE.Texture, w: 1, h: 1 };
    };
    /* object-fit: cover for box g, then the part of it that pane r shows; zoom < 1 pushes in */
    const crop = (out: THREE.Vector4, sw: number, sh: number, r: Rect, g: Rect, zoom: number) => {
      const ga = g.w / g.h;
      let cw = 1, ch = 1;
      if (sw / sh > ga) cw = (sh * ga) / sw;
      else ch = sw / ga / sh;
      cw *= zoom;
      ch *= zoom;
      const cx = (1 - cw) / 2;
      const cy = (1 - ch) / 2;
      out.set(cx + ((r.x - g.x) / g.w) * cw, cy + ((r.y - g.y) / g.h) * ch, (r.w / g.w) * cw, (r.h / g.h) * ch);
    };

    const panes = [0, 1, 2, 3].map(() => {
      const u = {
        uRect: { value: new THREE.Vector4() },
        uView: { value: new THREE.Vector2(1, 1) },
        uVel: { value: 0 },
        uA: { value: blank as THREE.Texture },
        uB: { value: blank as THREE.Texture },
        uCropA: { value: new THREE.Vector4(0, 0, 1, 1) },
        uCropB: { value: new THREE.Vector4(0, 0, 1, 1) },
        uMix: { value: 0 },
        uFill: { value: 0 },
        uDim: { value: 0 },
        uShift: { value: 0 },
        uBlue: { value: new THREE.Vector3(6 / 255, 87 / 255, 249 / 255) },
      };
      const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: VERT, fragmentShader: FRAG, depthTest: false, depthWrite: false });
      const mesh = new THREE.Mesh(quad, mat);
      mesh.frustumCulled = false;
      scene.add(mesh);
      // cur/prev/fade: a soft cut when the clip changes inside one station (the work index)
      return { mesh, mat, u, hover: 0, rect: { x: 0, y: 0, w: 0, h: 0 } as Rect, clip: "", cur: "", prev: "", fade: 1 };
    });

    type Station = { el: HTMLElement; els: HTMLElement[]; multi: boolean; axisX: boolean; fill: number; dim: number };
    const stations: Station[] = [...document.querySelectorAll<HTMLElement>("[data-station]")].map((el) => {
      const multi = (el.dataset.clips ?? "").split(",").length === 4;
      return {
        el,
        els: multi ? [...el.querySelectorAll<HTMLElement>("[data-pane]")] : [el],
        multi,
        axisX: el.dataset.axis === "x",
        fill: Number(el.dataset.fill ?? 0),
        dim: Number(el.dataset.dim ?? 0),
      };
    });
    const clipsOf = (st: Station) => (st.el.dataset.clips ?? "reel").split(",");
    stations.forEach((st) => clipsOf(st).forEach((c) => get(c)));
    const paneOf = (st: Station, i: number) => {
      const clips = clipsOf(st);
      if (st.multi) {
        const r = rectOf(st.els[i]);
        return { r, g: r, clip: clips[i] };
      }
      const g = rectOf(st.el);
      const qx = i % 2;
      const qy = Math.floor(i / 2);
      return { r: { x: g.x + (qx * g.w) / 2, y: g.y + (qy * g.h) / 2, w: g.w / 2, h: g.h / 2 }, g, clip: clips[0] };
    };
    /* where a station sits relative to the middle of the screen: below/right is positive */
    const posOf = (st: Station, vw: number, vh: number) => {
      const rs = st.els.map(rectOf);
      const cy = (Math.min(...rs.map((r) => r.y)) + Math.max(...rs.map((r) => r.y + r.h))) / 2 - vh / 2;
      if (!st.axisX) return cy;
      const cx = (Math.min(...rs.map((r) => r.x)) + Math.max(...rs.map((r) => r.x + r.w))) / 2 - vw / 2;
      return cy + cx;
    };

    const resize = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      panes.forEach((p) => p.u.uView.value.set(window.innerWidth, window.innerHeight));
    };
    resize();
    window.addEventListener("resize", resize);

    /* pointer: a cursor that names what it is over; clicking the reel plays it */
    let mx = -100, my = -100, cx = -100, cy = -100, cs = 0;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button")) return;
      if (panes.some((p) => p.clip === "reel" && inside(p.rect, e.clientX, e.clientY))) setReelOpen(true);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("click", onClick);

    /* scroll-linked parts */
    const tracks = [...document.querySelectorAll<HTMLElement>("[data-marquee]")];
    const drifts = [...document.querySelectorAll<HTMLElement>("[data-speed]")];
    const growEls = [...document.querySelectorAll<HTMLElement>("[data-grow]")];
    const darkEls = [...document.querySelectorAll<HTMLElement>("[data-dark]")];
    const strip = document.querySelector<HTMLElement>("[data-strip]");
    const follow = document.querySelector<HTMLElement>("[data-follow]");
    const rows = [...document.querySelectorAll<HTMLElement>("[data-row]")];
    const header = document.querySelector<HTMLElement>(`.${s.header}`);
    let headerDark = false;
    let lastY = window.scrollY;
    let vel = 0;
    let marq = 0;
    let activeRow = -1;

    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const raw = clamp(y - lastY, -90, 90);
      lastY = y;
      vel += (raw - vel) * 0.12;
      const v = reduced ? 0 : vel;

      // marquees run on their own and lean into the scroll speed
      marq += reduced ? 0 : 0.35 + Math.abs(v) * 0.6;
      tracks.forEach((el) => {
        const dir = Number(el.dataset.marquee);
        const half = el.scrollWidth / 2 || 1;
        const x = -((((marq * dir) % half) + half) % half);
        el.style.transform = `translate3d(${x.toFixed(1)}px,0,0) skewX(${(-v * 0.25 * dir).toFixed(2)}deg)`;
      });
      // headlines and big numbers drift at their own pace
      drifts.forEach((el) => {
        const r = el.getBoundingClientRect();
        const off = (r.top + r.height / 2 - vh / 2) * Number(el.dataset.speed);
        el.style.translate = `0 ${reduced ? 0 : off.toFixed(1)}px`;
      });
      // the held reel keeps opening through its hold
      growEls.forEach((el) => {
        const sec = el.closest("section");
        if (!sec) return;
        const r = sec.getBoundingClientRect();
        const k = 1 - ease(clamp(-r.top / Math.max(1, r.height - vh) / 0.7));
        el.style.inset = `${(k * 9).toFixed(3)}vh ${(k * 7).toFixed(3)}vw`;
      });
      // the sideways strip: vertical scroll drives it across
      if (strip) {
        const sec = strip.closest("section");
        if (sec) {
          const r = sec.getBoundingClientRect();
          const prog = clamp(-r.top / Math.max(1, r.height - vh));
          strip.style.transform = `translate3d(${(-prog * (strip.scrollWidth - vw)).toFixed(1)}px,0,0)`;
        }
      }
      // the work index: scroll alone picks the project; the window stays pinned on the right
      if (follow && rows.length) {
        let next = 0;
        let best = Infinity;
        rows.forEach((row, i) => {
          const rr = row.getBoundingClientRect();
          const d = Math.abs(rr.top + rr.height / 2 - vh / 2);
          if (d < best) { best = d; next = i; }
        });
        if (next !== activeRow) {
          rows[activeRow]?.classList.remove(s.rowOn);
          rows[next].classList.add(s.rowOn);
          activeRow = next;
          follow.dataset.clips = rows[next].dataset.clip;
        }
        const box = (follow.offsetParent as HTMLElement | null)?.getBoundingClientRect();
        if (box) {
          const fh = follow.offsetHeight;
          const tx = box.width - follow.offsetWidth - vw * 0.04;
          const ty = Math.min(box.height - fh, Math.max(0, vh / 2 - fh / 2 - box.top));
          follow.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
        }
      }

      // the window: glide between the stations either side of the middle, dock on each
      const ps = stations.map((st) => posOf(st, vw, vh));
      let a = 0;
      for (let i = 0; i < stations.length; i++) if (ps[i] <= 0) a = i;
      const b = Math.min(stations.length - 1, ps[0] > 0 ? 0 : a + 1);
      const w = a === b ? 0 : clamp(-ps[a] / Math.max(1, ps[b] - ps[a]));
      const e = ease(clamp((w - 0.1) / 0.8));
      const A = stations[a];
      const B = stations[b];
      let overLabel = "";
      panes.forEach((p, i) => {
        const pa = paneOf(A, i);
        const pb = paneOf(B, i);
        const r = lerpRect(pa.r, pb.r, e);
        const g = lerpRect(pa.g, pb.g, e);
        p.rect = g;
        p.clip = e < 0.5 ? pa.clip : pb.clip;
        const over = inside(g, mx, my);
        if (over) overLabel = p.clip === "reel" ? "Play" : "View";
        p.hover += ((over ? 1 : 0) - p.hover) * 0.08;
        const zoom = 1 - 0.07 * p.hover;
        let clipA = pa.clip;
        let clipB = pb.clip;
        let mixv = pa.clip !== pb.clip ? e : 0;
        if (pa.clip === pb.clip) {
          // same station, new clip (the index): cross-fade from the last one
          if (p.cur !== pa.clip) {
            p.prev = p.cur || pa.clip;
            p.cur = pa.clip;
            p.fade = 0;
          }
          p.fade = Math.min(1, p.fade + 0.07);
          if (p.fade < 1) {
            clipA = p.prev;
            clipB = p.cur;
            mixv = ease(p.fade);
          }
        } else p.cur = e < 0.5 ? pa.clip : pb.clip;
        const sa = source(clipA, now);
        p.u.uA.value = sa.tex;
        crop(p.u.uCropA.value, sa.w, sa.h, r, g, zoom);
        if (mixv > 0.001) {
          const sb = source(clipB, now);
          p.u.uB.value = sb.tex;
          crop(p.u.uCropB.value, sb.w, sb.h, r, g, zoom);
        }
        p.u.uMix.value = mixv;
        p.u.uRect.value.set(r.x, r.y, r.w, r.h);
        p.u.uVel.value = v;
        p.u.uShift.value = Math.min(0.012, Math.abs(v) * 0.00022);
        p.u.uFill.value = lerp(A.fill, B.fill, e);
        p.u.uDim.value = lerp(A.dim, B.dim, e);
        p.mesh.visible = r.w > 1 && r.h > 1 && r.y < vh + 200 && r.y + r.h > -200;
      });
      renderer.render(scene, camera);

      // the cursor: a small square that opens into a label over media and the index
      const c = cursorRef.current;
      if (c) {
        cx += (mx - cx) * 0.2;
        cy += (my - cy) * 0.2;
        cs += ((overLabel ? 1 : 0) - cs) * 0.15;
        c.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) translate(-50%, -50%) scale(${(0.16 + 0.84 * cs).toFixed(3)})`;
        if (overLabel && c.dataset.label !== overLabel) {
          c.dataset.label = overLabel;
          c.textContent = overLabel;
        }
        c.style.color = cs > 0.6 ? "#fff" : "transparent";
      }

      // the header turns white over dark ground
      let dark = false;
      darkEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= 40 && r.bottom >= 40 && r.left <= vw / 2 && r.right >= vw / 2) dark = true;
      });
      if (dark !== headerDark) {
        headerDark = dark;
        header?.classList.toggle(s.headerDark, dark);
      }
      // clips nobody has shown for a second stop decoding
      media.forEach((m) => {
        if (!m.v.paused && now - m.lastUsed > 1000) m.v.pause();
      });
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
      media.forEach((m) => {
        m.v.pause();
        m.v.removeAttribute("src");
        m.v.load();
        m.vt.dispose();
        m.it.dispose();
      });
      panes.forEach((p) => p.mat.dispose());
      quad.dispose();
      blank.dispose();
      renderer.dispose();
    };
  }, []);

  const marqueeText = "Paid Advertising ■ Organic Marketing ■ Design & Development ■ ";

  return (
    <div className={s.page}>
      <SmoothScroll />
      <canvas ref={canvasRef} className={s.canvas} aria-hidden />
      <div className={s.grain} aria-hidden />
      <div ref={cursorRef} className={s.cursor} aria-hidden />

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

      {/* 01 hero: pure type; the full stop is the window */}
      <section className={s.hero}>
        <p className={`${s.label} ${s.reveal}`}>Full-stack marketing · Denver and Tampa</p>
        <h1 className={s.h1}>
          <span className={s.line}><span>More customers.</span></span>
          <span className={s.line}><span>More revenue</span></span>
          <span className={s.line}>
            <span>
              you can <em className={s.count}>count</em>
              <span className={s.period} data-station data-clips="reel" aria-hidden />
            </span>
          </span>
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
          <p className={s.scrollHint}>
            <span className={s.hintSquare} aria-hidden /> Scroll to open the reel
          </p>
        </div>
      </section>

      {/* 02 the full stop opens into the reel */}
      <section className={s.reel}>
        <div className={s.sticky}>
          <div className={s.full} data-station data-clips="reel" data-dim="0.34" data-dark data-grow />
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

      {/* velocity marquees */}
      <section className={s.marquees} aria-hidden>
        <div className={s.marqueeRow}>
          <div className={s.track} data-marquee="1">
            <span>{marqueeText.repeat(3)}</span>
            <span>{marqueeText.repeat(3)}</span>
          </div>
        </div>
        <div className={`${s.marqueeRow} ${s.outline}`}>
          <div className={s.track} data-marquee="-1">
            <span>{marqueeText.repeat(3)}</span>
            <span>{marqueeText.repeat(3)}</span>
          </div>
        </div>
      </section>

      {/* 03 services: a sideways film strip; the window rides along */}
      <section id="services" className={s.hscroll}>
        <div className={s.sticky}>
          <div className={s.strip} data-strip>
            {SERVICES.map((sv) => (
              <article key={sv.n} className={`${s.panel} ${sv.dark ? s.panelDark : ""}`} {...(sv.dark ? { "data-dark": "" } : {})}>
                <span className={s.panelN} aria-hidden>
                  {sv.n}
                </span>
                <div className={s.panelText}>
                  <p className={`${s.label} ${sv.dark ? s.labelLight : ""}`}>
                    Nº {sv.n} · {sv.group}
                  </p>
                  <h2 className={s.h2}>{sv.title}</h2>
                  <p className={s.body}>{sv.body}</p>
                  <ul className={s.list}>
                    {sv.items.map((it, i) => (
                      <li key={it}>
                        <span className={s.listN}>0{i + 1}</span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={s.panelWindowWrap}>
                  <div className={s.panelWindow} data-station data-axis="x" data-clips={sv.clip} />
                  <p className={s.caption}>
                    <span>{sv.caption}</span>
                    <span>Nº {sv.n} / 03</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 04 the work: an index; the window follows the cursor */}
      <section id="work" className={s.work}>
        <div className={s.workHead}>
          <p className={`${s.label} ${s.reveal}`}>Nº 04 · Selected work</p>
          <h2 className={`${s.workTitle} ${s.reveal}`}>Work that makes people look twice.</h2>
        </div>
        <ol className={s.index}>
          {WORK.map((wk, i) => (
            <li key={wk.clip} className={`${s.row} ${s.reveal}`} data-row data-clip={wk.clip} style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
              <span className={s.rowN}>{String(i + 1).padStart(2, "0")}</span>
              <span className={s.rowTitle}>{wk.title}</span>
              <span className={s.rowClient}>[PLACEHOLDER: client]</span>
              <span className={s.rowTag}>{wk.tag}</span>
            </li>
          ))}
        </ol>
        <div className={s.follow} data-follow data-station data-clips="w1" aria-hidden />
      </section>

      {/* 05 who it is for */}
      <section className={s.who}>
        <h2 className={`${s.whoTitle} ${s.reveal}`} data-speed="-0.06">
          Built for brands with more than one front door.
        </h2>
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

      {/* 06 the closing wall: the window splits into four and lands among the work */}
      <section className={s.finale} data-dark>
        <div className={s.wall} data-station data-clips="w1,w2,w3,w4">
          <div className={s.wallCol} data-speed="0.22">
            {WALL_L.map((c) => (
              <div
                key={c}
                className={s.wallTile}
                {...(c === "w1" || c === "w2" ? { "data-pane": "" } : {})}
                style={{ backgroundImage: `url(${CLIPS[c].poster})` }}
              />
            ))}
          </div>
          <div className={s.finaleText}>
            <p className={`${s.label} ${s.labelLight}`}>Let&rsquo;s talk</p>
            <h2 className={`${s.finaleTitle} ${s.reveal}`}>Let&rsquo;s make you the brand people remember.</h2>
            <div className={`${s.ctas} ${s.reveal}`}>
              <Link href="/schedule/" className={s.btnWhite}>Schedule a Call</Link>
              <Link href="/audit/" className={s.btnLight}>Get a free audit</Link>
            </div>
          </div>
          <div className={s.wallCol} data-speed="-0.22">
            {WALL_R.map((c) => (
              <div
                key={c}
                className={s.wallTile}
                {...(c === "w3" || c === "w4" ? { "data-pane": "" } : {})}
                style={{ backgroundImage: `url(${CLIPS[c].poster})` }}
              />
            ))}
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
