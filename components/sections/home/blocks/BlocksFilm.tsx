"use client";

/* Blocks prototype (2026-09-23). One fixed canvas, a tall empty spine to
   scroll, and a time value t (0..END) that drives everything. The look is
   the two-tone toon method: white where the sun hits, brand blue in shade,
   navy ink outlines, grain on top. See lib/blocks/formations.ts. */

import { useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import { FORMATIONS, N, clamp, ease, type Slot } from "@/lib/blocks/formations";
import s from "./blocks.module.css";

const HOLD = 0.55; // share of each beat spent holding a formation
const LAST = FORMATIONS.length - 1;
const END = LAST + HOLD;
const BLUE = "#0657F9";
const INK = "#0A2A73";

type Cam = { t: [number, number, number]; az: number; el: number; d: number };
const CAM: Cam[] = [
  { t: [0, 2.6, 0], az: 0.62, el: 0.46, d: 33 },
  { t: [0, 5.4, 0], az: 0.85, el: 0.34, d: 41 },
  { t: [0, 7, 0.5], az: -0.34, el: 0.2, d: 48 },
  { t: [0, 3.6, 0], az: 0.22, el: 0.3, d: 52 },
  { t: [0, 6.2, 0], az: 0.3, el: 0.2, d: 46 },
  { t: [0, 5, 0], az: 0.55, el: 0.32, d: 47 },
  { t: [0, 1, 0], az: 0.7, el: 0.85, d: 62 },
  { t: [0, 2.6, 0], az: 0.62, el: 0.46, d: 35 },
];

type Panel = { eyebrow: string; title: string; body: string; rows?: [string, string][]; foot?: string; cta?: boolean };
const PANELS: Panel[] = [
  {
    eyebrow: "BigSquare · Full-stack marketing",
    title: "One team. Every channel.",
    body: "Search, ads and creative, run by one team under one roof. You can check the numbers any day.",
    foot: "Scroll. Watch the blocks go to work.",
  },
  {
    eyebrow: "01 · One team",
    title: "Three groups. One team.",
    body: "Every block you just saw is the same team. We split it three ways, then put it back to work.",
    rows: [
      ["Organic Marketing", "SEO, content, social and email."],
      ["Paid Advertising", "Google, Meta, Amazon and Local Services ads."],
      ["Design & Development", "The creative behind the ads, made in house."],
    ],
  },
  {
    eyebrow: "02 · Paid Advertising",
    title: "Ads held to what they bring in.",
    body: "Paid search, paid social and Amazon ads, aimed at the people ready to buy. We cut what only spends and push what books.",
    rows: [["Paid search", ""], ["Paid social", ""], ["Amazon ads", ""]],
  },
  {
    eyebrow: "03 · Design & Development",
    title: "Creative, tested until one wins.",
    body: "We make the ads in house, run versions side by side, and keep the one that pulls.",
  },
  {
    eyebrow: "04 · Organic Marketing",
    title: "Content people stop for.",
    body: "We make the posts, run the social and keep people talking about you between the ads.",
    rows: [["Content creation", ""], ["Social media", ""], ["Email and text", ""]],
  },
  {
    eyebrow: "05 · Proof",
    title: "Numbers you can check.",
    body: "Every lead and every dollar lands in the Obsidion portal. Log in any day and see what each channel brought in.",
    foot: "Illustration. Not client data.",
  },
  {
    eyebrow: "06 · Every location",
    title: "One playbook. Every location.",
    body: "Built for franchise systems and multi-location brands. What works at one location rolls out to the next, and the next.",
  },
  {
    eyebrow: "Let's talk",
    title: "Ready when you are.",
    body: "Book a call. We will look at what you run today and show you where the next dollar should go.",
    cta: true,
  },
];

export function BlocksFilm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let mobile = window.innerWidth < 800;

    /* renderer + the two-tone rig */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping; // tone mapping would grey the clipped white
    renderer.setClearColor(0xffffff, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 400);

    const grad = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255, 255, 255, 255, 255]), 2, 1, THREE.RGBAFormat);
    grad.minFilter = THREE.NearestFilter;
    grad.magFilter = THREE.NearestFilter;
    grad.generateMipmaps = false;
    grad.needsUpdate = true;
    const toon = () =>
      new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: grad, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });

    scene.add(new THREE.AmbientLight(BLUE, Math.PI)); // the shadow colour
    const sun = new THREE.DirectionalLight(0xffffff, Math.PI);
    sun.castShadow = true;
    sun.shadow.mapSize.set(mobile ? 2048 : 4096, mobile ? 2048 : 4096);
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.015;
    const sc = sun.shadow.camera;
    sc.left = -34; sc.right = 34; sc.top = 34; sc.bottom = -34; sc.near = 1; sc.far = 150;
    sc.updateProjectionMatrix();
    scene.add(sun, sun.target);

    const groundMat = toon();
    const groundGeo = new THREE.PlaneGeometry(600, 600);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    /* the blocks: one instanced mesh, plus an inverted hull for the ink line */
    const PAL = [new THREE.Color("#ffffff"), new THREE.Color(BLUE), new THREE.Color(INK)];
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const blockMat = toon();
    const blocks = new THREE.InstancedMesh(boxGeo, blockMat, N);
    blocks.castShadow = true;
    blocks.receiveShadow = true;
    blocks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    for (let i = 0; i < N; i++) blocks.setColorAt(i, PAL[0]);
    const hullGeo = new THREE.BoxGeometry(1.09, 1.09, 1.09);
    const hullMat = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
    const hull = new THREE.InstancedMesh(hullGeo, hullMat, N);
    hull.instanceMatrix = blocks.instanceMatrix;
    blocks.frustumCulled = false;
    hull.frustumCulled = false;
    scene.add(blocks, hull);

    /* formations, sorted once so each block keeps a sensible partner */
    const key = (q: Slot) => q.y * 1000 + q.x * 10 + q.z * 0.1;
    const perms = FORMATIONS.map((F) => {
      const b = F.build(0);
      return b.map((_, i) => i).sort((a, c) => key(b[a]) - key(b[c]));
    });
    const permute = (k: number, raw: Slot[]) => perms[k].map((j) => raw[j]);
    const starts = FORMATIONS.map((F, k) => permute(k, F.build(0)));
    const ends = FORMATIONS.map((F, k) => permute(k, F.build(1)));
    const isTop = starts[0].map((q) => q.y > 5.4);

    let seed = 7;
    const rnd = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
    const AXES = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
    const delay = new Float32Array(N);
    const arc = new Float32Array(N);
    const turns = new Uint8Array(N);
    const axis: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) {
      delay[i] = 0.4 * (0.55 * (i / N) + 0.45 * rnd());
      arc[i] = 1.5 + rnd() * 4.5;
      turns[i] = 1 + Math.floor(rnd() * 2);
      axis.push(AXES[Math.floor(rnd() * 3)]);
    }
    const colorIdx = new Int8Array(N).fill(0);
    const lift = new Float32Array(N);

    /* input */
    let target = 0;
    let t = 0;
    let px = 0, py = 0, spx = 0, spy = 0, pointerIn = false;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? clamp(window.scrollY / max) * END : 0;
    };
    const onPointer = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth) * 2 - 1;
      py = -((e.clientY / window.innerHeight) * 2 - 1);
      pointerIn = true;
    };
    const onLeave = () => (pointerIn = false);

    const resize = () => {
      mobile = window.innerWidth < 800;
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // push the subject right of the panel on desktop, up above it on phones
      if (mobile) camera.setViewOffset(w, h, 0, h * 0.2, w, h);
      else camera.setViewOffset(w, h, -w * 0.15, 0, w, h);
      camera.updateProjectionMatrix();
    };
    resize();
    onScroll();
    t = target;
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer);
    document.addEventListener("pointerleave", onLeave);

    /* camera from the keyed orbit */
    const drift = (c: Cam, p: number): Cam => ({ ...c, az: c.az + 0.14 * (p - 0.5) });
    const mix = (a: Cam, b: Cam, e: number): Cam => ({
      t: [a.t[0] + (b.t[0] - a.t[0]) * e, a.t[1] + (b.t[1] - a.t[1]) * e, a.t[2] + (b.t[2] - a.t[2]) * e],
      az: a.az + (b.az - a.az) * e,
      el: a.el + (b.el - a.el) * e,
      d: a.d + (b.d - a.d) * e,
    });

    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const pos = new THREE.Vector3();
    const scl = new THREE.Vector3();
    const look = new THREE.Vector3();
    const v3 = new THREE.Vector3();
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const topPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -6);
    const hit = new THREE.Vector3();
    const sunDir = new THREE.Vector3();
    let lastK = -1;
    let raf = 0;
    let prev = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      t = reduced ? target : t + (target - t) * (1 - Math.exp(-6 * dt));
      spx += (px - spx) * (1 - Math.exp(-4 * dt));
      spy += (py - spy) * (1 - Math.exp(-4 * dt));

      const k = Math.min(LAST, Math.floor(t));
      const u = t - k;
      const hold = k === LAST || u < HOLD;
      const p = clamp(u / HOLD);
      const v = (u - HOLD) / (1 - HOLD);

      /* camera */
      const c = hold ? drift(CAM[k], p) : mix(drift(CAM[k], 1), drift(CAM[k + 1], 0), ease(v));
      const az = c.az + spx * 0.06;
      const el = c.el + spy * 0.03;
      const d = c.d * (mobile ? 1.45 : 1);
      look.set(c.t[0], c.t[1], c.t[2]);
      camera.position.set(look.x + d * Math.sin(az) * Math.cos(el), look.y + d * Math.sin(el), look.z + d * Math.cos(az) * Math.cos(el));
      camera.lookAt(look);
      camera.updateMatrixWorld();

      /* sun: the cursor swings it, most of all in the hero */
      const heroW = Math.max(1 - clamp((t - 0.3) / 0.25), clamp((t - LAST + 0.05) / 0.2));
      const sa = spx * (0.25 + 0.45 * heroW);
      sunDir.set(-0.55, 0.8, 0.45).normalize().applyAxisAngle(AXES[1], sa);
      sun.target.position.copy(look).setY(0);
      sun.position.copy(sun.target.position).addScaledVector(sunDir, 60);

      /* hero: blocks on the top face lift toward the cursor */
      let hx = 1e9, hz = 1e9;
      if (heroW > 0 && pointerIn) {
        ndc.set(px, py);
        ray.setFromCamera(ndc, camera);
        if (ray.ray.intersectPlane(topPlane, hit)) { hx = hit.x; hz = hit.z; }
      }

      const cur = hold ? permute(k, FORMATIONS[k].build(p)) : null;
      let colorsDirty = false;
      for (let i = 0; i < N; i++) {
        let a: Slot;
        let f: number;
        let col: 0 | 1 | 2;
        if (cur) {
          a = cur[i];
          pos.set(a.x, a.y, a.z);
          f = a.f;
          col = a.c;
          q.identity();
        } else {
          a = ends[k][i];
          const b = starts[k + 1][i];
          const e = ease((v - delay[i]) / 0.6);
          pos.set(a.x + (b.x - a.x) * e, a.y + (b.y - a.y) * e + Math.sin(Math.PI * e) * arc[i], a.z + (b.z - a.z) * e);
          f = a.f + (b.f - a.f) * e;
          col = e < 0.5 ? a.c : b.c;
          q.setFromAxisAngle(axis[i], (e * turns[i] * Math.PI) / 2);
        }
        let want = 0;
        if (isTop[i] && hx < 1e8) {
          const dd = Math.hypot(starts[0][i].x - hx, starts[0][i].z - hz);
          want = heroW * 1.3 * Math.pow(Math.max(0, 1 - dd / 3.2), 1.5);
        }
        lift[i] += (want - lift[i]) * (reduced ? 1 : 0.12);
        pos.y = pos.y - 0.5 + 0.43 * f + lift[i];
        scl.set(0.86, 0.86 * f, 0.86);
        m.compose(pos, q, scl);
        blocks.setMatrixAt(i, m);
        if (colorIdx[i] !== col) {
          colorIdx[i] = col;
          blocks.setColorAt(i, PAL[col]);
          colorsDirty = true;
        }
      }
      blocks.instanceMatrix.needsUpdate = true;
      if (colorsDirty && blocks.instanceColor) blocks.instanceColor.needsUpdate = true;

      renderer.render(scene, camera);

      /* markers pinned to the world */
      const marks = cur && FORMATIONS[k].markers ? FORMATIONS[k].markers!(p) : [];
      const edge = clamp(Math.min(p, 1 - p) * 6);
      const w = window.innerWidth;
      const h = window.innerHeight;
      markerRefs.current.forEach((el, j) => {
        if (!el) return;
        const mk = marks[j];
        const a = mk ? mk.a * (k === LAST ? 1 : edge) : 0;
        if (!mk || a < 0.01) { el.style.opacity = "0"; return; }
        v3.set(mk.x, mk.y - 0.5 + 0.43, mk.z).project(camera);
        el.textContent = mk.text;
        el.style.opacity = String(a);
        el.style.transform = `translate(${(v3.x * 0.5 + 0.5) * w}px, ${(-v3.y * 0.5 + 0.5) * h}px) translateY(-50%)`;
      });

      /* panels */
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        const fin = i === 0 ? 1 : clamp((t - (i - 0.25)) / 0.15);
        const fout = i === LAST ? 1 : 1 - clamp((t - (i + 0.5)) / 0.12);
        const o = Math.min(fin, fout);
        el.style.opacity = String(o);
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
        el.style.pointerEvents = o > 0.5 ? "auto" : "none";
        el.style.setProperty("--shift", `${(1 - o) * 22}px`);
      });

      if (k !== lastK && labelRef.current) {
        lastK = k;
        labelRef.current.textContent = `${String(k).padStart(2, "0")} / ${String(LAST).padStart(2, "0")} · ${FORMATIONS[k].label}`;
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${t / END})`;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      [boxGeo, hullGeo, groundGeo].forEach((g) => g.dispose());
      [blockMat, hullMat, groundMat].forEach((mt) => mt.dispose());
      grad.dispose();
      blocks.dispose();
      hull.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={s.root}>
      <canvas ref={canvasRef} className={s.stage} aria-hidden />
      <div className={s.grain} aria-hidden />
      <header className={s.header}>
        <Link href="/" className={s.logo}>
          <span className={s.logoMark} aria-hidden />
          BigSquare
        </Link>
        <Link href="/schedule/" className={s.headerCta}>
          Let&rsquo;s Talk
        </Link>
      </header>

      {PANELS.map((p, i) => (
        <section key={p.title} ref={(el) => { panelRefs.current[i] = el; }} className={s.panel}>
          <p className={s.eyebrow}>{p.eyebrow}</p>
          {i === 0 ? <h1 className={s.title}>{p.title}</h1> : <h2 className={s.title}>{p.title}</h2>}
          <p className={s.body}>{p.body}</p>
          {p.rows && (
            <ul className={s.rows}>
              {p.rows.map(([a, b]) => (
                <li key={a}>
                  <strong>{a}</strong>
                  {b && <span>{b}</span>}
                </li>
              ))}
            </ul>
          )}
          {p.cta && (
            <div className={s.ctas}>
              <Link href="/schedule/" className={s.primary}>Schedule a Call</Link>
              <Link href="/audit/" className={s.secondary}>Get a free audit</Link>
            </div>
          )}
          {p.foot && <p className={s.foot}>{p.foot}</p>}
        </section>
      ))}

      {[0, 1, 2].map((i) => (
        <div key={i} ref={(el) => { markerRefs.current[i] = el; }} className={s.marker} aria-hidden />
      ))}

      <div className={s.progress} aria-hidden>
        <span ref={labelRef} className={s.progLabel} />
        <div className={s.track}>
          <div ref={barRef} className={s.bar} />
        </div>
      </div>

      <div className={s.spine} style={{ height: `${Math.round(END * 115 + 100)}vh` }} aria-hidden />
    </div>
  );
}
