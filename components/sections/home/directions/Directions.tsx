"use client";

/* Three abstract directions for the homepage (2026-09-23), one live
   screen each, stacked so they can be compared by scrolling. Each
   scene only runs while it is on screen.
   A · Field: the reel rendered as a halftone of blue squares; a square
       lens shows the real footage under the cursor.
   B · Cut type: giant words with the reel playing inside the letters;
       the type is sliced and the slices shear with the cursor.
   C · Tunnel: an endless spiral of the work flying past the camera
       toward one blue square. */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import s from "./directions.module.css";

const REEL = "/media/reel/reel-loop-720.mp4";
const POSTERS = [
  "/media/reel/reel-poster.jpg",
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/media/window/w${n}.jpg`),
  "/media/window/paid.jpg",
  "/media/window/design.jpg",
];
const BLUE = "#0657F9";

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

/* ---------------- A · Field ---------------- */
function Field() {
  const ref = useRef<HTMLDivElement>(null);
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

    /* the boxes of every line of text in the overlay, relative to the canvas */
    let holes: { x0: number; y0: number; x1: number; y1: number }[] = [];
    const measure = () => {
      const c = canvas.getBoundingClientRect();
      holes = [];
      root.querySelectorAll("[data-clear]").forEach((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        for (const r of range.getClientRects()) {
          if (r.width < 2) continue;
          holes.push({ x0: r.left - c.left, y0: r.top - c.top, x1: r.right - c.left, y1: r.bottom - c.top });
        }
      });
    };
    const PAD = 14;
    const FADE = 26;
    let mask = new Float32Array(0);
    let maskCols = 0, maskRows = 0, maskCell = 0;
    const buildMask = (cols: number, rows: number, cell: number) => {
      measure();
      mask = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) mask[y * cols + x] = clearance(x * cell + cell / 2, y * cell + cell / 2);
      maskCols = cols; maskRows = rows; maskCell = cell;
    };
    const clearance = (x: number, y: number) => {
      let k = 1;
      for (const h of holes) {
        const dx = Math.max(h.x0 - x, 0, x - h.x1);
        const dy = Math.max(h.y0 - y, 0, y - h.y1);
        const d = Math.hypot(dx, dy);
        if (d < PAD) return 0;
        if (d < PAD + FADE) k = Math.min(k, (d - PAD) / FADE);
      }
      return k;
    };

    const stopAll = whileVisible(root, () => {
      video.play().catch(() => {});
      let raf = 0;
      let n = 0;
      let last = performance.now();
      const frame = (t: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.1, (t - last) / 1000);
        last = t;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const W = canvas.clientWidth;
        const H = canvas.clientHeight;
        if (canvas.width !== Math.round(W * dpr)) { canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); }
        const cell = W < 800 ? 9 : 13;
        const cols = Math.ceil(W / cell);
        const rows = Math.ceil(H / cell);
        if (sample.width !== cols) { sample.width = cols; sample.height = rows; }
        if (maskCols !== cols || maskRows !== rows || maskCell !== cell || n++ % 60 === 0) buildMask(cols, rows, cell);
        if (video.readyState < 2) return;
        // cover-crop the frame into the sample grid
        const va = video.videoWidth / video.videoHeight;
        const ga = cols / rows;
        let sw = video.videoWidth, sh = video.videoHeight, sx = 0, sy = 0;
        if (va > ga) { sw = sh * ga; sx = (video.videoWidth - sw) / 2; } else { sh = sw / ga; sy = (video.videoHeight - sh) / 2; }
        sctx.drawImage(video, sx, sy, sw, sh, 0, 0, cols, rows);
        const px = sctx.getImageData(0, 0, cols, rows).data;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = "#F5F6F8";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = BLUE;
        const follow = 1 - Math.exp(-dt * 16);
        if (lx < -9000 || mx < -9000) { lx = mx; ly = my; }
        lx += (mx - lx) * follow;
        ly += (my - ly) * follow;
        const wave = t * 0.0012;
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const i = (y * cols + x) * 4;
            const lum = (px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11) / 255;
            let size = (1 - lum) * cell * 0.92;
            let ox = x * cell + cell / 2;
            let oy = y * cell + cell / 2;
            // the cursor pushes squares aside and swells them
            const dx = ox - lx, dy = oy - ly;
            const d = Math.hypot(dx, dy);
            if (d < 220) {
              const k = 1 - d / 220;
              ox += (dx / (d || 1)) * k * 26;
              oy += (dy / (d || 1)) * k * 26;
              size *= 1 + k * 0.6;
            }
            size *= 0.85 + 0.15 * Math.sin(wave + x * 0.18 + y * 0.11);
            size *= mask[y * cols + x] ?? 1;
            if (size < 0.6) continue;
            ctx.fillRect(ox - size / 2, oy - size / 2, size, size);
          }
        }
        // the lens: the real footage, in a square, under the cursor
        if (mx > -9000) {
          const L = W < 800 ? 140 : 230;
          const bx = lx - L / 2, by = ly - L / 2;
          const fsx = sx + (bx / W) * sw, fsy = sy + (by / H) * sh;
          ctx.drawImage(video, fsx, fsy, (L / W) * sw, (L / H) * sh, bx, by, L, L);
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
    <section ref={ref} className={s.scene}>
      <video ref={videoRef} className={s.hidden} src={REEL} muted loop playsInline preload="auto" />
      <canvas ref={canvasRef} className={s.fill} />
      <div className={s.overlay}>
        <p className={s.tag} data-clear>A · Field</p>
        <h2 className={s.fieldTitle} data-clear>
          Every square
          <br />
          is our work.
        </h2>
        <p className={s.note} data-clear>The reel, rendered as a halftone of the logo square. Move the cursor: the lens shows the real footage.</p>
      </div>
    </section>
  );
}

/* ---------------- B · Cut type ---------------- */
const SLICES = 12;
function CutType() {
  const ref = useRef<HTMLDivElement>(null);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = ref.current!;
    const video = root.querySelector("video")!;
    let mx = 0.5, vx = 0, lastX = 0.5, energy = 0;
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
    };
    root.addEventListener("pointermove", onMove);
    const stopAll = whileVisible(root, () => {
      video.play().catch(() => {});
      let raf = 0;
      const frame = (t: number) => {
        raf = requestAnimationFrame(frame);
        vx += ((mx - lastX) * 60 - vx) * 0.2;
        lastX = mx;
        energy += (Math.min(1, Math.abs(vx)) - energy) * 0.08;
        const time = t * 0.001;
        sliceRefs.current.forEach((el, i) => {
          if (!el) return;
          const k = i / (SLICES - 1);
          const x = Math.sin(time * 1.4 + i * 0.55) * (4 + energy * 60) + vx * 90 * (k - 0.5) + (mx - 0.5) * 40 * (k - 0.5);
          el.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
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
      root.removeEventListener("pointermove", onMove);
    };
  }, []);

  const words = (
    <div className={s.words}>
      <span>Seen.</span>
      <span>Chosen.</span>
      <span>Remembered.</span>
    </div>
  );
  return (
    <section ref={ref} className={`${s.scene} ${s.cut}`}>
      <video className={s.fillVideo} src={REEL} muted loop playsInline preload="auto" />
      {Array.from({ length: SLICES }, (_, i) => (
        <div
          key={i}
          ref={(el) => { sliceRefs.current[i] = el; }}
          className={s.slice}
          style={{ clipPath: `inset(${(i / SLICES) * 100}% -10% ${100 - ((i + 1) / SLICES) * 100}% -10%)` }}
          aria-hidden={i > 0}
        >
          {words}
        </div>
      ))}
      <div className={`${s.overlay} ${s.overlayBottom}`}>
        <p className={s.tag}>B · Cut type</p>
        <p className={s.note}>The reel plays inside the letters. The type is sliced; move the cursor and the slices shear.</p>
      </div>
    </section>
  );
}

/* ---------------- C · Tunnel ---------------- */
function Tunnel() {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const canvas = canvasRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setClearColor(0xf5f6f8, 1);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf5f6f8, 18, 70);
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
    const loader = new THREE.TextureLoader();
    const textures = POSTERS.map((u) => {
      const tx = loader.load(u);
      tx.colorSpace = THREE.SRGBColorSpace;
      return tx;
    });
    const geo = new THREE.PlaneGeometry(4, 5);
    const N = 44;
    const DEPTH = 88;
    const cards = Array.from({ length: N }, (_, i) => {
      const mat = new THREE.MeshBasicMaterial({
        map: textures[i % textures.length],
        side: THREE.DoubleSide,
        fog: true,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      return { mesh, mat, a: i * 2.4, z: -(i / N) * DEPTH, r: 7 + (i % 3) * 1.6 };
    });
    // the blue square at the end of the tunnel
    const logoTex = loader.load("/media/brand/bigsquare-logo.png");
    logoTex.colorSpace = THREE.SRGBColorSpace;
    const coreMat = new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, fog: false });
    const core = new THREE.Mesh(new THREE.PlaneGeometry(6, 6 * (855 / 809)), coreMat);
    core.position.z = -DEPTH + 4;
    core.renderOrder = -1;
    scene.add(core);

    let mx = 0, my = 0, cx = 0, cy = 0;
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      my = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    root.addEventListener("pointermove", onMove);

    const stopAll = whileVisible(root, () => {
      let raf = 0;
      let last = performance.now();
      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const W = canvas.clientWidth;
        const H = canvas.clientHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(W, H, false);
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        cx += (mx - cx) * 0.05;
        cy += (my - cy) * 0.05;
        camera.position.set(cx * 2.2, -cy * 1.6, 6);
        camera.lookAt(cx * 4, -cy * 3, -30);
        const speed = 5.5;
        cards.forEach((c) => {
          c.z += speed * dt;
          c.a += dt * 0.18;
          if (c.z > 6) c.z -= DEPTH;
          c.mesh.position.set(Math.cos(c.a) * c.r, Math.sin(c.a) * c.r * 0.72, c.z);
          c.mesh.rotation.set(0, 0, 0);
          c.mesh.lookAt(0, 0, c.z + 12);
          // invisible in the distance, fully there by the middle of the tunnel
          const k = Math.min(1, Math.max(0, (c.z + DEPTH * 0.92) / (DEPTH * 0.45)));
          c.mat.opacity = k * k;
        });
        core.rotation.z = Math.sin(now * 0.0006) * 0.12;
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(frame);
      return () => cancelAnimationFrame(raf);
    });
    return () => {
      stopAll();
      root.removeEventListener("pointermove", onMove);
      cards.forEach((c) => c.mat.dispose());
      textures.forEach((t) => t.dispose());
      geo.dispose();
      coreMat.dispose();
      logoTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section ref={ref} className={s.scene}>
      <canvas ref={canvasRef} className={s.fill} />
      <div className={s.overlay}>
        <p className={s.tag}>C · Tunnel</p>
        <h2 className={s.tunnelTitle}>
          One team.
          <br />
          Every channel.
        </h2>
        <p className={s.note}>An endless spiral of the work flying toward one blue square. Move the cursor to steer.</p>
      </div>
    </section>
  );
}

export function Directions() {
  return (
    <main className={s.page}>
      <header className={s.header}>
        <span className={s.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/brand/bigsquare-logo.png" alt="" className={s.logoImg} />
          BigSquare
        </span>
        <span className={s.headerNote}>Three directions · scroll to compare</span>
      </header>
      <Field />
      <CutType />
      <Tunnel />
    </main>
  );
}
