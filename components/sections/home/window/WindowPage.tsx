"use client";

/* The window (prototype, 2026-09-23, round 2). A native-scrolling
   editorial page with one continuity device: the square from the logo,
   always playing real work. A fixed WebGL layer draws up to four panes
   of video that glide between anchor boxes ([data-station]) placed in
   ordinary sections and dock on each. The panes are liquid: they bend
   with scroll speed, split colour slightly at speed and zoom under the
   cursor. Around them the page moves too: velocity marquees, drifting
   headlines, a cursor that names what it is over, and a closing wall
   of work the panes fly into. */

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

const SERVICES = [
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

  /* reveal-on-enter for type and tiles; DOM videos play only on screen */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add(s.in)),
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll(`.${s.reveal}`).forEach((el) => io.observe(el));
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

  /* the compositor, the cursor and the scroll-linked type */
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
        v.crossOrigin = "anonymous";
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
    /* the texture to show for a clip, and its pixel size */
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
      return { mesh, mat, u, hover: 0, rect: { x: 0, y: 0, w: 0, h: 0 } as Rect, clip: "" };
    });

    type Station = { els: HTMLElement[]; clips: string[]; fill: number; dim: number };
    const stations: Station[] = [...document.querySelectorAll<HTMLElement>("[data-station]")].map((el) => {
      const clips = (el.dataset.clips ?? "reel").split(",");
      const els = clips.length === 4 ? [...el.querySelectorAll<HTMLElement>("[data-pane]")] : [el];
      return { els, clips, fill: Number(el.dataset.fill ?? 0), dim: Number(el.dataset.dim ?? 0) };
    });
    stations.forEach((st) => st.clips.forEach((c) => get(c)));
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
      return (Math.min(...rs.map((r) => r.y)) + Math.max(...rs.map((r) => r.y + r.h))) / 2;
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

    /* scroll-linked type */
    const tracks = [...document.querySelectorAll<HTMLElement>("[data-marquee]")];
    const drifts = [...document.querySelectorAll<HTMLElement>("[data-speed]")];
    const growEls = [...document.querySelectorAll<HTMLElement>("[data-grow]")];
    const darkEls = [...document.querySelectorAll<HTMLElement>("[data-dark]")];
    const tiles = [...document.querySelectorAll<HTMLElement>(`.${s.tileMedia}`)];
    const header = document.querySelector<HTMLElement>(`.${s.header}`);
    let headerDark = false;
    let lastY = window.scrollY;
    let vel = 0;
    let marq = 0;

    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
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
      // headlines drift at their own pace
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

      // the window: glide between the two stations around the middle, dock on each
      const mid = vh / 2;
      const cys = stations.map(centerY);
      let a = 0;
      for (let i = 0; i < stations.length; i++) if (cys[i] <= mid) a = i;
      const b = Math.min(stations.length - 1, cys[0] > mid ? 0 : a + 1);
      const w = a === b ? 0 : clamp((mid - cys[a]) / (cys[b] - cys[a]));
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
        const sa = source(pa.clip, now);
        p.u.uA.value = sa.tex;
        crop(p.u.uCropA.value, sa.w, sa.h, r, g, zoom);
        if (pa.clip !== pb.clip && e > 0.001) {
          const sb = source(pb.clip, now);
          p.u.uB.value = sb.tex;
          crop(p.u.uCropB.value, sb.w, sb.h, r, g, zoom);
          p.u.uMix.value = e;
        } else p.u.uMix.value = 0;
        p.u.uRect.value.set(r.x, r.y, r.w, r.h);
        p.u.uVel.value = v;
        p.u.uShift.value = Math.min(0.012, Math.abs(v) * 0.00022);
        p.u.uFill.value = lerp(A.fill, B.fill, e);
        p.u.uDim.value = lerp(A.dim, B.dim, e);
        p.mesh.visible = r.w > 1 && r.h > 1 && r.y < vh + 200 && r.y + r.h > -200;
      });
      renderer.render(scene, camera);

      // the cursor: a small square that opens into a label over media
      if (!overLabel) for (const el of tiles) if (inside(rectOf(el), mx, my)) { overLabel = "View"; break; }
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

      // the header turns white over the reel and the blue finale
      let dark = false;
      darkEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= 40 && r.bottom >= 40) dark = true;
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
            <span>Showreel · click to play</span>
            <span>00:58</span>
          </p>
        </div>
      </section>

      {/* 02 the reel takes the screen */}
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

      {/* 03 services: the window docks beside each one */}
      <div id="services">
        {SERVICES.map((sv) => (
          <section key={sv.n} className={`${s.service} ${sv.flip ? s.flip : ""}`}>
            <div className={s.serviceText}>
              <p className={`${s.label} ${s.reveal}`}>
                Nº {sv.n} · {sv.group}
              </p>
              <h2 className={`${s.h2} ${s.reveal}`} data-speed="-0.08">
                {sv.title}
              </h2>
              <p className={`${s.body} ${s.reveal}`}>{sv.body}</p>
              <ul className={s.list}>
                {sv.items.map((it, i) => (
                  <li key={it} className={s.reveal} style={{ transitionDelay: `${i * 70}ms` }}>
                    <span className={s.listN}>0{i + 1}</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.serviceWindowWrap}>
              <span className={s.bigN} data-speed="0.18" aria-hidden>
                {sv.n}
              </span>
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

      {/* 07 the closing wall: the panes fly in among the work */}
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
