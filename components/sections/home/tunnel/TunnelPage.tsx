"use client";

/* Direction C, full page (sketch, 2026-09-23). The whole page is one
   flight down a tunnel of the work. Scrolling moves the camera forward;
   the work orbits past on the walls. Each section is a stop: a screen
   playing that section's footage hangs in the tunnel on the right while
   the copy sits on the left. The BigSquare mark waits at the far end
   the whole way down; at the finale the camera flies into it and the
   screen turns blue. */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { SmoothScroll, getLenis } from "@/components/motion/SmoothScroll";
import s from "./tunnel.module.css";

const BLUE = 0x0657f9;
const PAPER = 0xf5f6f8;
const K = 0.022; // world units per pixel of scroll
const D = 9; // how far ahead a stop's screen hangs when its section is centred

/* the work on the walls: poster, and the title shown as it passes */
const CARDS = [
  { src: "/media/window/w1.jpg", title: "Brand launch film" },
  { src: "/media/window/w2.jpg", title: "Soft drink teaser" },
  { src: "/media/window/w3.jpg", title: "Candy VFX spot" },
  { src: "/media/window/w4.jpg", title: "Coffee can animation" },
  { src: "/media/window/w5.jpg", title: "Food concept film" },
  { src: "/media/window/w6.jpg", title: "Furniture concept" },
  { src: "/media/window/w7.jpg", title: "Vinyl lifestyle spot" },
  { src: "/media/window/w8.jpg", title: "BigSquare Tetris" },
  { src: "/media/window/paid.jpg", title: "BigSquare launch spot" },
  { src: "/media/window/organic.jpg", title: "Story animation" },
  { src: "/media/window/design.jpg", title: "Signature animal" },
  { src: "/media/reel/reel-poster.jpg", title: "Showreel" },
];

/* the screens at each stop */
const STOPS = [
  { stop: "reel", src: "/media/reel/reel-loop-720.mp4", w: 12.4, h: 6.975, x: 2.4 },
  { stop: "paid", src: "/media/window/paid.mp4", w: 6.2, h: 6.2, x: -3.6 },
  { stop: "organic", src: "/media/window/organic.mp4", w: 6.2, h: 6.2, x: 3.6 },
  { stop: "design", src: "/media/window/design.mp4", w: 6.2, h: 6.2, x: -3.6 },
];

/* where each card sits: opposite its screen, at a different height every stop */
const PLACE: Record<string, { side: "left" | "right"; v: "top" | "mid" | "low" }> = {
  reel: { side: "left", v: "low" },
  paid: { side: "right", v: "top" },
  organic: { side: "left", v: "mid" },
  design: { side: "right", v: "low" },
  who: { side: "left", v: "mid" },
};

const SERVICES = [
  {
    stop: "paid",
    n: "01",
    group: "Paid Advertising",
    title: "Ads held to what they bring in.",
    body: "Google, Meta, Amazon and Local Services ads, aimed at the people ready to buy. We cut what only spends and push what books.",
    items: ["Paid search", "Paid social", "Amazon ads", "Local Services ads"],
  },
  {
    stop: "organic",
    n: "02",
    group: "Organic Marketing",
    title: "Content people stop for.",
    body: "We make the posts, run the social and keep people talking about you between the ads.",
    items: ["Content creation", "Social media", "Email and text", "Search engine optimization"],
  },
  {
    stop: "design",
    n: "03",
    group: "Design & Development",
    title: "Creative made in house.",
    body: "Brand films, ads and the pages they point to, made by the same team that runs them. Nothing gets lost between vendors.",
    items: ["Brand and creative", "Video and motion", "Websites and landing pages"],
  },
];

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/* object-fit: cover for a texture on a plane of aspect planeA */
function cover(tx: THREE.Texture, planeA: number, imgA: number) {
  if (imgA > planeA) {
    tx.repeat.set(planeA / imgA, 1);
    tx.offset.set((1 - planeA / imgA) / 2, 0);
  } else {
    tx.repeat.set(1, imgA / planeA);
    tx.offset.set(0, (1 - imgA / planeA) / 2);
  }
}

function stopClass(stop: string) {
  const pl = PLACE[stop];
  if (!pl) return s.stop;
  return `${s.stop} ${pl.side === "right" ? s.right : ""} ${pl.v === "top" ? s.top : pl.v === "low" ? s.low : ""}`;
}

export function TunnelPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const finaleTextRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const canvas = canvasRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setClearColor(PAPER, 1);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(PAPER, 20, 72);
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 300);
    const loader = new THREE.TextureLoader();
    const plane = new THREE.PlaneGeometry(1, 1);

    /* the work on the walls */
    const cardTex = CARDS.map((c) => {
      const tx = loader.load(c.src, (t) => {
        const img = t.image as HTMLImageElement;
        cover(t, 4 / 5, img.naturalWidth / img.naturalHeight);
      });
      tx.colorSpace = THREE.SRGBColorSpace;
      return tx;
    });
    type Card = { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; z: number; a: number; r: number; title: string };
    let cards: Card[] = [];
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    /* the screens at each stop */
    type Stop = { def: (typeof STOPS)[number]; mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; video: HTMLVideoElement | null; tex: THREE.VideoTexture | null; z: number };
    const stops: Stop[] = STOPS.map((def) => {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
      const mesh = new THREE.Mesh(plane, mat);
      mesh.scale.set(def.w, def.h, 1);
      mesh.renderOrder = 2;
      scene.add(mesh);
      return { def, mesh, mat, video: null, tex: null, z: 0 };
    });
    const wake = (st: Stop) => {
      if (st.video) return;
      const v = document.createElement("video");
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = "auto";
      v.src = st.def.src;
      const tex = new THREE.VideoTexture(v);
      tex.colorSpace = THREE.SRGBColorSpace;
      v.addEventListener("loadedmetadata", () => cover(tex, st.def.w / st.def.h, v.videoWidth / v.videoHeight));
      st.mat.map = tex;
      st.mat.needsUpdate = true;
      st.video = v;
      st.tex = tex;
    };

    /* the destination: the mark at the end, and the blue it opens into */
    const logoTex = loader.load("/media/brand/bigsquare-logo.png");
    logoTex.colorSpace = THREE.SRGBColorSpace;
    const logoMat = new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, fog: false });
    const logo = new THREE.Mesh(plane, logoMat);
    logo.renderOrder = -2; // far away: drawn first so everything nearer covers it
    const blueMat = new THREE.MeshBasicMaterial({ color: BLUE, fog: false });
    const blue = new THREE.Mesh(plane, blueMat);
    blue.renderOrder = -3;
    scene.add(blue, logo);
    let endZ = -200;

    /* lay the route out from the page: every stop sits D ahead of the camera when its section is centred */
    const layout = () => {
      const vh = window.innerHeight;
      const zAt = (el: HTMLElement) => -(el.offsetTop + el.offsetHeight / 2 - vh / 2) * K;
      stops.forEach((st) => {
        const sec = document.querySelector<HTMLElement>(`[data-stop="${st.def.stop}"]`);
        if (!sec) return;
        st.z = zAt(sec) - D;
        st.mesh.position.set(st.def.x, 0, st.z);
      });
      const fin = document.querySelector<HTMLElement>('[data-stop="finale"]');
      // arrive (blue fills the screen) as the finale reaches the top of the screen
      endZ = fin ? -fin.offsetTop * K - 4.5 : -200;
      // cards all the way down the tunnel, on a golden-angle spiral
      cards.forEach((c) => {
        cardGroup.remove(c.mesh);
        c.mat.dispose();
      });
      const n = Math.min(160, Math.ceil(-endZ / 1.7));
      cards = Array.from({ length: n }, (_, i) => {
        const def = CARDS[i % CARDS.length];
        const mat = new THREE.MeshBasicMaterial({ map: cardTex[i % CARDS.length], transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(plane, mat);
        mesh.scale.set(3.2, 4, 1);
        cardGroup.add(mesh);
        return { mesh, mat, z: 4 - i * 1.7, a: i * 2.39996, r: 7.6 + (i % 3) * 1.5, title: def.title };
      });
    };

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      layout();
    };
    resize();
    window.addEventListener("resize", resize);
    const relayout = window.setTimeout(layout, 800); // after fonts settle

    let mx = 0, my = 0, cx = 0, cy = 0, camZ = 0;
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    const finale = document.querySelector<HTMLElement>('[data-stop="finale"]');
    const copyCards = [...document.querySelectorAll<HTMLElement>(`.${s.card}`)];
    const v3 = new THREE.Vector3();

    let raf = 0, last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const time = reduced ? 0 : now * 0.001;
      const target = Math.max(-window.scrollY * K, endZ + 4.5); // stop at the blue, never fly through it
      camZ += (target - camZ) * (reduced ? 1 : 1 - Math.exp(-dt * 7));
      cx += (mx - cx) * (1 - Math.exp(-dt * 3));
      cy += (my - cy) * (1 - Math.exp(-dt * 3));
      camera.position.set(cx * 1.2, -cy * 0.9, camZ);
      camera.lookAt(cx * 3, -cy * 2.2, camZ - 30);

      // cards: fade in from the fog, fade out as they pass, clear space around each stop
      let best: Card | null = null;
      let bestScore = 0;
      cards.forEach((c) => {
        const rel = c.z - camZ; // negative is ahead
        const a = c.a + time * 0.05;
        c.mesh.position.set(Math.cos(a) * c.r, Math.sin(a) * c.r * 0.72, c.z);
        c.mesh.lookAt(0, 0, c.z + 12);
        let o = clamp((rel + 62) / 26) * (1 - clamp((rel + 1.5) / 2.5));
        for (const st of stops) o *= clamp(Math.abs(c.z - st.z) / 5 + 0.15);
        c.mat.opacity = o * o;
        c.mesh.visible = o > 0.01;
        if (o > 0.85 && rel < -6 && rel > -15) {
          const score = o / -rel;
          if (score > bestScore) { bestScore = score; best = c; }
        }
      });

      // the screens at each stop
      stops.forEach((st) => {
        const rel = st.z - camZ;
        if (rel > -70) wake(st);
        const o = clamp((rel + 46) / 18) * (1 - clamp((rel + 2) / 3));
        st.mat.opacity = o;
        st.mesh.visible = o > 0.01;
        if (st.video) {
          if (o > 0.05 && st.video.paused) st.video.play().catch(() => {});
          if (o <= 0.05 && !st.video.paused) st.video.pause();
        }
      });

      // the destination: small mark at the end of the tunnel, blue opening as you arrive
      const dist = camZ - endZ;
      const arrive = ease(clamp((16 - dist) / 11));
      logo.position.set(0, 0, endZ + 0.05);
      logo.scale.set(3.2, 3.2 * (855 / 809), 1);
      logoMat.opacity = 1 - arrive;
      blue.position.set(0, 0, endZ);
      const bs = 0.001 + arrive * 80;
      blue.scale.set(bs, bs, 1);

      renderer.render(scene, camera);

      // the copy cards ride the flight: ease in from depth, lean with the steering, tilt away as you pass
      const vh = window.innerHeight;
      copyCards.forEach((el) => {
        const host = el.closest("section") ?? el;
        const r = el.getBoundingClientRect();
        const hr = host.getBoundingClientRect();
        // sticky cards (the work list) are judged by their section, the rest by themselves
        const mid = el.classList.contains(s.pinned) ? hr.top + hr.height / 2 : r.top + r.height / 2;
        const p = reduced ? 0 : Math.max(-1.4, Math.min(1.4, (mid - vh / 2) / vh));
        const ap = Math.abs(p);
        const o = 1 - clamp((ap - 0.45) / 0.5);
        el.style.opacity = o.toFixed(3);
        const sd = (el.closest("[data-side]") as HTMLElement | null)?.dataset.side === "right" ? 1 : -1;
        // outward toward its own edge when away from its stop; turned slightly toward the screen it belongs to
        el.style.transform =
          `perspective(1400px) translate3d(${(sd * ap * 90 + cx * -10).toFixed(1)}px, ${(p * -36).toFixed(1)}px, ${(-ap * 160).toFixed(1)}px) ` +
          `rotateX(${(p * 9).toFixed(2)}deg) rotateY(${(-sd * (4 + ap * 10) + cx * 5).toFixed(2)}deg) rotateZ(${(sd * p * 1.2).toFixed(2)}deg)`;
        if (ap < 0.38) el.classList.add(s.live);
        else if (ap > 0.9) el.classList.remove(s.live);
      });

      // a tag names the work flying past
      const tag = tagRef.current;
      if (tag) {
        const b = best as Card | null;
        if (b) {
          v3.copy(b.mesh.position).project(camera);
          const x = (v3.x * 0.5 + 0.5) * window.innerWidth;
          const y = (-v3.y * 0.5 + 0.5) * window.innerHeight;
          tag.style.opacity = "1";
          tag.style.transform = `translate3d(${x.toFixed(0)}px, ${y.toFixed(0)}px, 0) translate(-50%, -50%)`;
          if (tag.textContent !== b.title) tag.textContent = b.title;
        } else tag.style.opacity = "0";
      }
      // header turns white over the blue
      if (finale && headerRef.current) {
        const r = finale.getBoundingClientRect();
        headerRef.current.classList.toggle(s.headerLight, arrive > 0.6 && r.top < window.innerHeight * 0.6);
      }
      if (finaleTextRef.current) finaleTextRef.current.style.opacity = String(clamp((arrive - 0.55) / 0.35));
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(relayout);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      stops.forEach((st) => {
        st.video?.pause();
        st.video?.removeAttribute("src");
        st.video?.load();
        st.tex?.dispose();
        st.mat.dispose();
      });
      cards.forEach((c) => c.mat.dispose());
      cardTex.forEach((t) => t.dispose());
      [logoMat, blueMat].forEach((m) => m.dispose());
      logoTex.dispose();
      plane.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={s.page}>
      <SmoothScroll />
      <canvas ref={canvasRef} className={s.canvas} aria-hidden />
      <div ref={tagRef} className={s.tag} aria-hidden />

      <header ref={headerRef} className={s.header}>
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
      <section className={s.hero}>
        <div className={s.card}>
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
        <p className={s.hint}>Scroll to fly in · move the cursor to steer</p>
      </section>

      {/* 02 the reel */}
      <section className={stopClass("reel")} data-stop="reel" data-side="left">
        <div className={s.card}>
          <p className={s.label}>Showreel · 00:58</p>
          <h2 className={s.h2}>Made in house. Made to be seen.</h2>
          <p className={s.body}>Commercials and social ads we made for our clients, shot and cut by our own team.</p>
          <div className={s.ctas}>
            <button type="button" className={s.btnPrimary} onClick={() => setReelOpen(true)}>
              <span className={s.play} aria-hidden /> Watch with sound
            </button>
          </div>
        </div>
      </section>

      {/* 03 services */}
      <div id="services">
        {SERVICES.map((sv) => (
          <section key={sv.stop} className={stopClass(sv.stop)} data-stop={sv.stop} data-side={PLACE[sv.stop].side}>
            <div className={s.card}>
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
          </section>
        ))}
      </div>

      {/* 04 the work flies past */}
      <section id="work" className={s.work} data-stop="work">
        <div className={`${s.card} ${s.pinned}`}>
          <p className={s.label}>Nº 04 · Selected work</p>
          <h2 className={s.h2}>Work that makes people look twice.</h2>
          <p className={s.body}>Everything on these walls is ours. Keep scrolling and watch the names go by.</p>
          <ol className={s.index}>
            {CARDS.slice(0, 8).map((c, i) => (
              <li key={c.title}>
                <span className={s.listN}>{String(i + 1).padStart(2, "0")}</span>
                {c.title}
                <em>[PLACEHOLDER: client]</em>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 05 who it is for */}
      <section className={stopClass("who")} data-stop="who" data-side="left">
        <div className={`${s.card} ${s.cardWide}`}>
          <h2 className={s.h2}>Built for brands with more than one front door.</h2>
          <ul className={s.whoList}>
            {[
              ["Franchise and multi-location", "Open more locations and get more out of the ones you have."],
              ["Ecommerce", "One team across your ads, search, site and creative."],
              ["Software", "Demand that shows up in the pipeline, not just the dashboard."],
              ["Single location", "Grow where you are, then grow past it."],
            ].map(([a, b], i) => (
              <li key={a}>
                <span className={s.listN}>0{i + 1}</span>
                <strong>{a}</strong>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 06 the destination */}
      <section className={s.finale} data-stop="finale">
        <div ref={finaleTextRef} className={s.finaleText} style={{ opacity: 0 }}>
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
