"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/* HomeCanvas (2.hero.md v6): the glass square becomes the film, then
   becomes the square again and keeps the visitor company down the page.

   One page-level FIXED WebGL canvas (lusion's architecture, the v6
   direction queued in tasks.md). It sits at z-5: above the section
   grounds and rails, below every section's z-10 content layer, so the
   cube always moves BEHIND the page's ink. Two acts:

   ACT 1, THE HERO (the first K = 6/7 of the hero wrapper; the v5.1
   choreography unchanged): glass cube floats above the copy, swoops
   behind the exiting headline, flattens into the media card, the film
   develops over it and balloons into the framed panel, holds.

   ACT 2, THE REFORM (the last 1/7 of the wrapper, still pinned): the
   film re-inks and shrinks back into the card footprint, quenches
   under re-frosting glass, and the slab thickens back into the cube;
   the smoke core re-ignites. In the same beat the material crossfades
   from transmission glass (which needs the in-canvas paper backdrop)
   to true alpha glass, and the backdrop retires: from here the REAL
   PAGE shows through the cube via canvas compositing.

   THE COMPANION: past the hero the cube is driven by a waypoint
   journey keyed to the page sections (data-cube-anchor hooks read per
   frame): it glides through the trust strip, holds in the problem
   section's right whitespace and ticks a quarter turn as each numbered
   row passes, dives behind the solution bento and re-emerges across
   the viewport foot, climbs the services rail, then spins up and
   dissolves. Extend WAYPOINTS when later sections (proof band, portal)
   want the object back. Everything is a pure function of native
   scroll smoothed by damped followers: no hijack, no Lenis.

   Rendering contract (STYLE_GUIDE 7.9) and the three hard-won rules
   (r3f uniforms-clone trap, transmission-buffer exclusions, raw-sRGB
   NoColorSpace pipeline) carry over from the v5 build unchanged. */

type Props = {
  poster: string;
  video: string | null;
  /** page stage intersecting: drives the frameloop */
  active: boolean;
};

import { HERO_K } from "@/components/sections/home/media";

/* ---- timeline ------------------------------------------------------ */
/* Act 1 beats are authored in 0..1 of the OLD wrapper and remapped by
   HERO_K: the wrapper grew from 320/480vh to 374/560vh so the reform
   gets the last 1/7 without retiming the approved v5.1 choreography. */

const SWOOP: [number, number] = [0.08, 0.46];
const FLATTEN: [number, number] = [0.38, 0.48];
const CUBE_FADE: [number, number] = [0.52, 0.6];
const GATE: [number, number] = [0.5, 0.58];
const PANE_SETTLE: [number, number] = [0.62, 0.68];
const DEVELOP: [number, number] = [0.5, 0.7];
const BALLOON: [number, number] = [0.62, 0.92];
const MEDIA_SCALE: [number, number] = [0.62, 0.94];

/* Act 2 sub-beats, in 0..1 of the reform segment (hero progress K..1) */
const R_SHRINK: [number, number] = [0.02, 0.5]; /* panel -> card, re-ink */
const R_SOLID: [number, number] = [0.4, 0.58]; /* glass re-materializes */
const R_PANE_FADE: [number, number] = [0.52, 0.7]; /* film quenches under it */
const R_UNFLATTEN: [number, number] = [0.58, 0.88]; /* slab -> cube, smoke back */
const R_GLASS_MIX: [number, number] = [0.84, 0.97]; /* transmission -> alpha
   glass; driven by RAW scroll so the backdrop retires exactly when
   transmission is gone, before the page can scroll under the canvas */

const CARD_CENTER: [number, number] = [-0.24, -0.17];
const CARD_W = 0.34;
const CARD_CENTER_MOBILE: [number, number] = [-0.06, -0.16];
const CARD_W_MOBILE = 0.62;
const PANEL_MARGIN = 0.04;

const seg = (v: number, [a, b]: [number, number]) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

/* Brand tokens in raw sRGB for the raw-shader pipeline */
const INK_DEEP = new THREE.Color().setHex(0x0a2a73, THREE.NoColorSpace);
const INK_LIGHT = new THREE.Color().setHex(0x6e9bff, THREE.NoColorSpace);
const INK_ACC = new THREE.Color().setHex(0x0657f9, THREE.NoColorSpace);

/* Alpha-glass tint for the companion (managed-material pipeline, so a
   normal sRGB constructor is right here): without transmission the
   cube's ground is its own base color, and pure white reads as milky
   plastic over the paper. A faint blue in the brand family keeps it
   reading as glass. */
const GLASS_TINT = new THREE.Color("#D7E3FF");
const WHITE = new THREE.Color("#FFFFFF");

/* ---- the companion journey ------------------------------------------ */
/* Waypoints in viewport fractions from center (y up), keyed to the
   passage of an anchor section through the viewport (frac 0 = its top
   enters the bottom edge, 1 = its bottom leaves the top edge). scale
   is relative to the hero cube's rest scale; spin accumulates on top
   of the idle turn; ease "steps4" quantizes the spin into the four
   quarter-turn ticks (the problem section's row counter). */

type AnchorName = "heroEnd" | "trust" | "problem" | "solution" | "services";

type Waypoint = {
  anchor: AnchorName;
  frac: number;
  x: number;
  y: number;
  scale: number;
  spin: number;
  fade: number;
  ease?: "smooth" | "steps4";
};

const HALF_TURNS = Math.PI * 2; /* four quarter-turn ticks */

const WAYPOINTS: Waypoint[] = [
  { anchor: "heroEnd", frac: 0, x: CARD_CENTER[0], y: CARD_CENTER[1], scale: 1, spin: 0, fade: 1 },
  { anchor: "trust", frac: 0.55, x: 0.3, y: 0.04, scale: 0.62, spin: 0.7, fade: 1 },
  { anchor: "problem", frac: 0.2, x: 0.31, y: 0.07, scale: 0.55, spin: 1.0, fade: 1 },
  { anchor: "problem", frac: 0.78, x: 0.3, y: -0.08, scale: 0.5, spin: 1.0 + HALF_TURNS, fade: 1, ease: "steps4" },
  { anchor: "solution", frac: 0.32, x: 0.38, y: -0.33, scale: 0.42, spin: 1.6 + HALF_TURNS, fade: 1 },
  { anchor: "solution", frac: 0.85, x: -0.31, y: -0.31, scale: 0.46, spin: 2.4 + HALF_TURNS, fade: 1 },
  { anchor: "services", frac: 0.42, x: -0.34, y: -0.02, scale: 0.46, spin: 3.0 + HALF_TURNS, fade: 1 },
  { anchor: "services", frac: 0.88, x: -0.34, y: 0.3, scale: 0.22, spin: 5.4 + HALF_TURNS, fade: 0 },
];

/* Mobile: no whitespace to live in; one graceful exit over the trust
   strip instead of the full journey. */
const WAYPOINTS_MOBILE: Waypoint[] = [
  { anchor: "heroEnd", frac: 0, x: CARD_CENTER_MOBILE[0], y: CARD_CENTER_MOBILE[1], scale: 1, spin: 0, fade: 1 },
  { anchor: "trust", frac: 0.5, x: 0.28, y: 0.06, scale: 0.5, spin: 0.9, fade: 1 },
  { anchor: "problem", frac: 0.3, x: 0.34, y: 0.22, scale: 0.34, spin: 1.8, fade: 0 },
];

/* quantized quarter-turn easing for the row ticks */
const steps4 = (t: number) => {
  const q = Math.min(3.999, Math.max(0, t) * 4);
  const i = Math.floor(q);
  const f = q - i;
  const snap = f < 0.3 ? 0 : f > 0.7 ? 1 : smooth((f - 0.3) / 0.4);
  return Math.min(1, (i + snap) / 4);
};

/* ---- shared per-frame stage state ----------------------------------- */

type StageState = {
  raw: number; /* raw hero wrapper progress 0..1 */
  sp: number; /* damped follower of raw */
  companion: boolean; /* past the hero: waypoint control */
  wp: { x: number; y: number; scale: number; spin: number; fade: number };
  els: Partial<Record<AnchorName | "hero", HTMLElement | null>>;
};

const createStage = (): StageState => ({
  raw: 0,
  sp: 0,
  companion: false,
  wp: { x: CARD_CENTER[0], y: CARD_CENTER[1], scale: 1, spin: 0, fade: 1 },
  els: {},
});

const ANCHOR_NAMES: AnchorName[] = ["trust", "problem", "solution", "services"];

/* Reads the DOM once per frame (reads only, during rAF: no thrash),
   updates raw/damped hero progress and the companion waypoint target.
   Mounted first in the scene so it runs before the actors. */
function Tracker({ stage }: { stage: StageState }) {
  useFrame((state, delta) => {
    if (typeof document === "undefined") return;
    const els = stage.els;
    if (!els.hero) els.hero = document.querySelector<HTMLElement>('[data-cube-anchor="hero"]');
    for (const name of ANCHOR_NAMES) {
      if (!els[name]) els[name] = document.querySelector<HTMLElement>(`[data-cube-anchor="${name}"]`);
    }
    const hero = els.hero;
    if (!hero) return;

    const vh = window.innerHeight;
    const scrollY = window.scrollY;
    const hr = hero.getBoundingClientRect();
    const denom = hr.height - vh;
    stage.raw = denom > 0 ? Math.min(1, Math.max(0, -hr.top / denom)) : 0;

    /* damped follower (v5 contract, 4.5/s); once the page has scrolled
       past the hero the follower converges fast so a flicked scroll
       never replays the film sequence over the sections */
    const rate = stage.raw >= 1 ? 12 : 4.5;
    const k = 1 - Math.exp(-rate * Math.min(delta, 0.1));
    stage.sp += (stage.raw - stage.sp) * k;
    if (Math.abs(stage.raw - stage.sp) < 0.0005) stage.sp = stage.raw;

    stage.companion = stage.raw >= 0.9995;
    if (!stage.companion) return;

    /* companion target from the waypoint journey */
    const mobile = state.size.width < 768;
    const list = (mobile ? WAYPOINTS_MOBILE : WAYPOINTS).filter(
      (w) => w.anchor === "heroEnd" || els[w.anchor],
    );
    if (list.length === 0) return;

    const yOf = (w: Waypoint) => {
      if (w.anchor === "heroEnd") return hr.top + scrollY + hr.height - vh;
      const r = els[w.anchor]!.getBoundingClientRect();
      return r.top + scrollY - vh + w.frac * (vh + r.height);
    };

    let a = list[0];
    let b = list[0];
    let t = 0;
    if (scrollY <= yOf(list[0])) {
      t = 1;
    } else if (scrollY >= yOf(list[list.length - 1])) {
      a = b = list[list.length - 1];
      t = 1;
    } else {
      for (let i = 0; i < list.length - 1; i++) {
        const y0 = yOf(list[i]);
        const y1 = yOf(list[i + 1]);
        if (scrollY >= y0 && scrollY <= Math.max(y0 + 1, y1)) {
          a = list[i];
          b = list[i + 1];
          t = (scrollY - y0) / Math.max(1, y1 - y0);
          break;
        }
      }
    }
    const ts = smooth(Math.min(1, Math.max(0, t)));
    const tq = b.ease === "steps4" ? steps4(t) : ts;
    stage.wp.x = lerp(ts, a.x, b.x);
    stage.wp.y = lerp(ts, a.y, b.y);
    stage.wp.scale = lerp(ts, a.scale, b.scale);
    stage.wp.spin = lerp(tq, a.spin, b.spin);
    stage.wp.fade = lerp(ts, a.fade, b.fade);
  });
  return null;
}

/* ---- shared film media (poster-first, video cross-fade) ------------ */

type FilmMedia = {
  tex: { current: THREE.Texture | null };
  poster: { current: THREE.Texture | null };
  mix: { current: number };
  ready: { current: boolean };
  dims: { current: { w: number; h: number } };
};

function useFilmMedia(posterSrc: string, videoSrc: string | null, playing: boolean): FilmMedia {
  const media = useMemo<FilmMedia>(
    () => ({
      tex: { current: null },
      poster: { current: null },
      mix: { current: 0 },
      ready: { current: false },
      dims: { current: { w: 16, h: 9 } },
    }),
    [],
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const tex = new THREE.TextureLoader().load(posterSrc, (t) => {
      media.dims.current = { w: t.image.width, h: t.image.height };
    });
    tex.colorSpace = THREE.NoColorSpace;
    media.poster.current = tex;
    if (!media.tex.current) media.tex.current = tex;
    return () => tex.dispose();
  }, [posterSrc, media]);

  /* the film (decisions.md media contract): mounts after hydration,
     cross-fades over the poster once genuinely playing */
  useEffect(() => {
    if (!videoSrc) return;
    const el = document.createElement("video");
    el.src = videoSrc;
    el.muted = true;
    el.loop = true;
    el.playsInline = true;
    el.preload = "auto";
    el.crossOrigin = "anonymous";
    videoRef.current = el;
    let tex: THREE.VideoTexture | null = null;
    const onPlaying = () => {
      if (!tex) {
        tex = new THREE.VideoTexture(el);
        tex.colorSpace = THREE.NoColorSpace;
        media.tex.current = tex;
        media.dims.current = { w: el.videoWidth, h: el.videoHeight };
      }
      media.ready.current = true;
    };
    el.addEventListener("playing", onPlaying);
    el.play().catch(() => {});
    return () => {
      el.removeEventListener("playing", onPlaying);
      el.pause();
      el.removeAttribute("src");
      el.load();
      tex?.dispose();
      videoRef.current = null;
    };
  }, [videoSrc, media]);

  /* decode only while the hero region is near the viewport */
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (playing) el.play().catch(() => {});
    else el.pause();
  }, [playing]);

  return media;
}

/* cover-fit scale for a texture on a surface of the given aspect */
function coverScale(out: THREE.Vector2, texW: number, texH: number, aspect: number) {
  const texA = texW / texH;
  out.set(Math.min(1, aspect / texA), Math.min(1, texA / aspect));
}

function cardRect(w: number, h: number, mobile: boolean) {
  const cw = w * (mobile ? CARD_W_MOBILE : CARD_W);
  const center = mobile ? CARD_CENTER_MOBILE : CARD_CENTER;
  return { cx: center[0] * w, cy: center[1] * h, w: cw, h: (cw * 9) / 16 };
}
function panelRect(w: number, h: number) {
  const m = PANEL_MARGIN * w;
  return { cx: 0, cy: 0, w: w - 2 * m, h: h - 2 * m };
}

/* ---- environment (glass needs something to reflect) ---------------- */

function StudioEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new RoomEnvironment();
    const target = pmrem.fromScene(envScene, 0.04);
    scene.environment = target.texture;
    pmrem.dispose();
    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene]);
  return null;
}

/* Paper backdrop: the transmission pipeline's ground during the hero.
   It retires the moment the glass finishes crossfading to alpha mode
   (raw-scroll gated), before any section can scroll under the fixed
   canvas; from then on the page itself is the ground. */
function PaperBackdrop({ stage }: { stage: StageState }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    m.visible = seg(seg(stage.raw, [HERO_K, 1]), R_GLASS_MIX) < 1;
  });
  return (
    <mesh ref={mesh} position={[0, 0, -6]} scale={[80, 50, 1]}>
      <planeGeometry />
      <meshBasicMaterial color="#F5F6F8" />
    </mesh>
  );
}

/* ---- the glass square (GlassCube) ---------------------------------- */

const SWOOP_PATH: [number, number][] = [
  [0.3, 0.24],
  [0.1, -0.06],
  [-0.12, -0.3],
  [-0.3, -0.26],
  [-0.24, -0.17],
];
const SWOOP_PATH_MOBILE: [number, number][] = [
  [0.24, 0.3],
  [0.12, 0.02],
  [-0.14, -0.28],
  [-0.06, -0.16],
];

function GlassCube({ stage, active }: { stage: StageState; active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const smoke = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const tilt = useRef({ x: 0, y: 0 });
  /* companion follower state (position/rotation/scale eased toward the
     waypoint target; initialized from the group on mode entry) */
  const follow = useRef({ on: false, x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1 });

  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 4, 0.06), []);
  const smokeGeometry = useMemo(() => new THREE.SphereGeometry(1, 48, 32), []);

  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        transmission: 1,
        roughness: 0.09,
        metalness: 0,
        ior: 1.25,
        thickness: 0.6,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        attenuationColor: new THREE.Color("#BFD4FF"),
        attenuationDistance: 1.4,
        envMapIntensity: 1.0,
        transparent: true,
      }),
    [],
  );
  /* the smoke core: opaque hashed-discard wisp (v5.1); survives both
     the transmission buffer AND the alpha-glass companion mode */
  const smokeMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uDensity: { value: 1 },
          uColorA: { value: INK_ACC },
          uColorB: { value: INK_LIGHT },
        },
        vertexShader: /* glsl */ `
          uniform float uTime;
          varying vec3 vPos;
          varying vec3 vNormal;
          varying vec3 vView;

          float hash(vec3 p){ p = fract(p*0.3183099+.1); p*=17.0;
            return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
          float noise(vec3 x){ vec3 i=floor(x); vec3 f=fract(x);
            f=f*f*(3.-2.*f);
            return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
                           mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                       mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                           mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }

          void main() {
            /* slow-breathing amorphous form, never a sphere */
            float n = noise(position * 2.2 + vec3(0.0, uTime * 0.22, uTime * 0.15));
            float m = noise(position * 4.6 - vec3(uTime * 0.12, 0.0, uTime * 0.09));
            vec3 pos = position * (0.72 + 0.55 * n + 0.18 * m);
            vPos = pos;
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            vView = -mv.xyz;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          uniform float uTime;
          uniform float uDensity;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying vec3 vPos;
          varying vec3 vNormal;
          varying vec3 vView;

          float hash(vec3 p){ p = fract(p*0.3183099+.1); p*=17.0;
            return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
          float noise(vec3 x){ vec3 i=floor(x); vec3 f=fract(x);
            f=f*f*(3.-2.*f);
            return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
                           mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                       mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                           mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
          float fbm(vec3 p){ float v=0.0; float a=0.5;
            for(int k=0;k<3;k++){ v+=a*noise(p); p*=2.1; a*=0.5; } return v; }

          void main() {
            float d = fbm(vPos * 2.6 + vec3(0.0, uTime * 0.16, uTime * 0.1));
            float facing = pow(abs(dot(normalize(vNormal), normalize(vView))), 1.2);
            float density = clamp(smoothstep(0.28, 0.72, d) * facing * 1.6 * uDensity, 0.0, 0.85);
            if (hash(vec3(gl_FragCoord.xy, 0.7)) > density) discard;
            gl_FragColor = vec4(mix(uColorA, uColorB, d), 1.0);
          }
        `,
      }),
    [],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      smokeGeometry.dispose();
      glass.dispose();
      smokeMat.dispose();
    },
    [geometry, smokeGeometry, glass, smokeMat],
  );

  const curves = useMemo(
    () => ({
      desktop: new THREE.CatmullRomCurve3(
        SWOOP_PATH.map(([x, y]) => new THREE.Vector3(x, y, 0)),
      ),
      mobile: new THREE.CatmullRomCurve3(
        SWOOP_PATH_MOBILE.map(([x, y]) => new THREE.Vector3(x, y, 0)),
      ),
    }),
    [],
  );

  /* pointer interactivity: the canvas is pointer-events none (the page
     stays fully interactive), so listen on the window and damp */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const { width: w, height: h } = state.viewport;
    const mobile = state.size.width < 768;
    const t = state.clock.elapsedTime;
    const s = Math.min(w, h) * 0.2; /* hero rest scale */
    const sm = smoke.current;

    /* transmission -> alpha-glass crossfade, raw-scroll gated so it
       always completes before the page scrolls under the canvas */
    const mix = smooth(seg(seg(stage.raw, [HERO_K, 1]), R_GLASS_MIX));
    glass.transmission = 1 - mix;

    if (stage.companion) {
      /* ---- Act 3: the companion ---------------------------------- */
      const f = follow.current;
      if (!f.on) {
        f.on = true;
        f.x = g.position.x;
        f.y = g.position.y;
        f.z = g.position.z;
        f.rx = g.rotation.x;
        f.ry = g.rotation.y;
        f.rz = g.rotation.z;
        f.s = g.scale.x / s || 1;
      }
      const fade = stage.wp.fade;
      g.visible = active && fade > 0.002;
      if (!g.visible) return;

      /* damped pointer tilt, alive again as the object travels */
      tilt.current.x += (pointer.current.y * 0.12 - tilt.current.x) * 0.05;
      tilt.current.y += (pointer.current.x * 0.16 - tilt.current.y) * 0.05;

      const tx = stage.wp.x * w + Math.sin(t * 0.4) * 0.008 * w;
      const ty = stage.wp.y * h + Math.sin(t * 0.55 + 1.1) * 0.01 * h;
      const trx = 0.42 + tilt.current.x + Math.sin(t * 0.26) * 0.04;
      const try_ = 0.6 + stage.wp.spin + t * 0.1 + tilt.current.y;
      const trz = -0.08;

      const kd = 1 - Math.exp(-4 * Math.min(delta, 0.1));
      f.x += (tx - f.x) * kd;
      f.y += (ty - f.y) * kd;
      f.z += (0 - f.z) * kd;
      f.rx += (trx - f.rx) * kd;
      f.ry += (try_ - f.ry) * kd;
      f.rz += (trz - f.rz) * kd;
      f.s += (stage.wp.scale - f.s) * kd;

      g.position.set(f.x, f.y, f.z);
      g.rotation.set(f.rx, f.ry, f.rz);
      g.scale.setScalar(s * f.s);

      glass.transmission = 0;
      glass.opacity = 0.42 * fade;
      glass.thickness = 0;
      glass.roughness = 0.09;
      glass.envMapIntensity = 0.85;
      glass.color.copy(GLASS_TINT);

      if (sm) {
        sm.visible = fade > 0.01;
        smokeMat.uniforms.uTime.value = t;
        smokeMat.uniforms.uDensity.value = fade;
        sm.position.set(
          Math.sin(t * 0.14) * 0.08,
          Math.sin(t * 0.1 + 1.3) * 0.07,
          Math.cos(t * 0.12) * 0.06,
        );
        sm.rotation.y = t * 0.06;
        sm.scale.setScalar(0.3);
      }
      return;
    }
    follow.current.on = false;

    /* ---- Acts 1 and 2: the hero set piece + the reform ------------ */
    const p = Math.min(1, stage.sp / HERO_K);
    const c = seg(stage.sp, [HERO_K, 1]);
    const reform = smooth(seg(c, R_UNFLATTEN));
    const alpha = Math.max(1 - seg(p, CUBE_FADE), smooth(seg(c, R_SOLID)));
    g.visible = alpha > 0.001 && active;
    if (!g.visible) return;

    const flight = smooth(seg(p, SWOOP));
    const rest = 1 - seg(p, [SWOOP[0], SWOOP[0] + 0.1]);
    const flat = smooth(seg(p, FLATTEN)) * (1 - reform);

    const curve = mobile ? curves.mobile : curves.desktop;
    const pos = curve.getPoint(flight);
    const bobX = Math.sin(t * 0.5) * 0.012 * rest;
    const bobY = Math.sin(t * 0.75 + 1.3) * 0.02 * rest;
    g.position.set(
      (pos.x + bobX) * w,
      (pos.y + bobY) * h,
      Math.sin(Math.PI * flight) * h * 0.06,
    );

    tilt.current.x += (pointer.current.y * 0.2 * rest - tilt.current.x) * 0.05;
    tilt.current.y += (pointer.current.x * 0.28 * rest - tilt.current.y) * 0.05;
    const calm = 1 - flight;
    g.rotation.set(
      (0.44 + tilt.current.x + Math.sin(t * 0.3) * 0.05 * rest) * calm + Math.sin(Math.PI * flight) * 0.16,
      (0.72 + tilt.current.y + t * 0.05 * rest) * calm + flight * 0.5 * calm,
      -0.1 * calm,
    );

    /* scale: cube at rest; flattens into the card; the reform runs the
       same ramp backwards (flat returns to 0) */
    const card = cardRect(w, h, mobile);
    g.scale.set(
      s + (card.w - s) * flat,
      s + (card.h - s) * flat,
      s * (1 - 0.965 * flat),
    );
    glass.thickness = 0.6 * (1 - 0.9 * flat) * (1 - mix);
    glass.envMapIntensity = (1 - 0.8 * flat) * (1 - 0.15 * mix);
    glass.roughness = 0.09 * (1 - 0.7 * flat);
    glass.opacity = alpha * (1 - 0.58 * mix);
    glass.color.copy(WHITE).lerp(GLASS_TINT, mix);

    if (sm) {
      sm.visible = flat < 0.9;
      smokeMat.uniforms.uTime.value = t;
      smokeMat.uniforms.uDensity.value = 1 - flat;
      sm.position.set(
        Math.sin(t * 0.14) * 0.08,
        Math.sin(t * 0.1 + 1.3) * 0.07,
        Math.cos(t * 0.12) * 0.06,
      );
      sm.rotation.y = t * 0.06;
      sm.scale.setScalar(0.3 * (1 - flat));
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} frustumCulled={false}>
        <primitive object={glass} attach="material" />
      </mesh>
      <group ref={smoke}>
        <mesh geometry={smokeGeometry} frustumCulled={false}>
          <primitive object={smokeMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

/* ---- the film pane: card -> balloon -> framed panel -> reform ------ */

const sheetVertex = /* glsl */ `
  uniform vec4 uStart;   /* cx, cy, w, h (world) */
  uniform vec4 uEnd;
  uniform float uGrow;   /* balloon progress */
  uniform float uLag;
  uniform float uZArc;
  varying vec2 vUv;
  varying float vT;

  const float PI = 3.141592653589793;

  void main() {
    vUv = uv;

    vec2 dir = normalize(vec2(0.72, 0.7));
    float d = dot(uv - 0.5, dir);
    float ev = clamp(uGrow * (1.0 + 1.42 * uLag) - (0.5 - d) * uLag, 0.0, 1.0);
    ev = ev * ev * (3.0 - 2.0 * ev);
    vT = ev;

    vec2 center = mix(uStart.xy, uEnd.xy, ev);
    vec2 size = mix(uStart.zw, uEnd.zw, ev);
    vec3 pos = vec3(center + (uv - 0.5) * size, 0.0);

    pos.z += sin(PI * ev) * uZArc * step(0.0001, uGrow) * (1.0 - step(0.9999, uGrow));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const sheetFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform sampler2D uPoster;
  uniform float uTexMix;
  uniform vec4 uStart;
  uniform vec4 uEnd;
  uniform vec2 uCover;
  uniform float uMediaScale;
  uniform float uRadiusStart; /* world units */
  uniform float uRadiusEnd;
  uniform float uInk;
  uniform float uAlpha;
  uniform vec3 uInkDeep;
  uniform vec3 uInkLight;
  varying vec2 vUv;
  varying float vT;

  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec2 uv = (vUv - 0.5) / uMediaScale * uCover + 0.5;
    vec3 col = mix(texture2D(uPoster, uv).rgb, texture2D(uTex, uv).rgb, uTexMix);

    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 ink = mix(uInkDeep, uInkLight, smoothstep(0.0, 0.62, lum));
    col = mix(col, ink, uInk);

    vec2 size = mix(uStart.zw, uEnd.zw, vT);
    float radius = mix(uRadiusStart, uRadiusEnd, vT);
    vec2 p = (vUv - 0.5) * size;
    float sdf = sdRoundBox(p, 0.5 * size, radius);
    float aa = max(fwidth(sdf), 1e-4) * 1.2;
    float mask = 1.0 - smoothstep(-aa, aa, sdf);

    gl_FragColor = vec4(col, uAlpha * mask);
  }
`;

function FilmPane({ stage, media }: { stage: StageState; media: FilmMedia }) {
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: sheetVertex,
        fragmentShader: sheetFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uStart: { value: new THREE.Vector4(0, 0, 1, 1) },
          uEnd: { value: new THREE.Vector4(0, 0, 1, 1) },
          uGrow: { value: 0 },
          uLag: { value: 0.34 },
          uZArc: { value: 0 },
          uTex: { value: null },
          uPoster: { value: null },
          uTexMix: { value: 0 },
          uCover: { value: new THREE.Vector2(1, 1) },
          uMediaScale: { value: 1.16 },
          uRadiusStart: { value: 0 },
          uRadiusEnd: { value: 0 },
          uInk: { value: 1 },
          uAlpha: { value: 0 },
          uInkDeep: { value: INK_DEEP },
          uInkLight: { value: INK_LIGHT },
        },
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const u = material.uniforms;

    /* poster -> film crossfade, eased in time not scroll */
    const target = media.ready.current ? 1 : 0;
    media.mix.current += (target - media.mix.current) * 0.06;

    /* Act 1 progress + Act 2 (reform) sub-beats */
    const p = Math.min(1, stage.sp / HERO_K);
    const c = seg(stage.sp, [HERO_K, 1]);
    const sh = smooth(seg(c, R_SHRINK)); /* panel back to card */
    const alpha = seg(p, GATE) * (1 - smooth(seg(c, R_PANE_FADE)));
    m.visible = alpha > 0.001 && !stage.companion;
    if (!m.visible) return;

    const { width: w, height: h } = state.viewport;
    const mobile = state.size.width < 768;
    const pxToWorld = h / state.size.height;

    m.position.z = 0.08 * (1 - smooth(seg(p, PANE_SETTLE)));
    m.renderOrder = 10;

    const card = cardRect(w, h, mobile);
    const panel = panelRect(w, h);
    (u.uStart.value as THREE.Vector4).set(card.cx, card.cy, card.w, card.h);
    (u.uEnd.value as THREE.Vector4).set(panel.cx, panel.cy, panel.w, panel.h);

    const grow = seg(p, BALLOON) * (1 - sh);
    u.uGrow.value = grow;
    u.uZArc.value = h * 0.16;
    u.uAlpha.value = alpha;
    u.uRadiusStart.value = 24 * pxToWorld;
    u.uRadiusEnd.value = 24 * pxToWorld;
    u.uMediaScale.value = 1.16 + (1 - 1.16) * seg(p, MEDIA_SCALE) * (1 - sh);
    u.uInk.value = 1 - seg(p, DEVELOP) * (1 - sh);

    u.uTex.value = media.tex.current;
    u.uPoster.value = media.poster.current;
    u.uTexMix.value = media.mix.current;

    const midW = card.w + (panel.w - card.w) * smooth(grow);
    const midH = card.h + (panel.h - card.h) * smooth(grow);
    coverScale(u.uCover.value as THREE.Vector2, media.dims.current.w, media.dims.current.h, midW / midH);
  });

  return (
    <mesh ref={mesh} frustumCulled={false}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/* ---- watchdog: step DPR down on sustained slow frames (7.9) -------- */

function PerfGuard() {
  const setDpr = useThree((s) => s.setDpr);
  const dpr = useRef(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
  const slow = useRef(0);

  useFrame((_, delta) => {
    if (delta > 0.034) slow.current += 1;
    else slow.current = Math.max(0, slow.current - 2);
    if (slow.current > 45 && dpr.current > 1) {
      dpr.current = Math.max(1, dpr.current - 0.25);
      slow.current = 0;
      setDpr(dpr.current);
    }
  });
  return null;
}

/* ---- scene + canvas root ------------------------------------------- */

function Scene({ poster, video, active, heroNear }: Props & { heroNear: boolean }) {
  const stage = useMemo(createStage, []);
  const media = useFilmMedia(poster, video, active && heroNear);
  return (
    <>
      <Tracker stage={stage} />
      <PerfGuard />
      <StudioEnvironment />
      <PaperBackdrop stage={stage} />
      <GlassCube stage={stage} active={active} />
      <FilmPane stage={stage} media={media} />
    </>
  );
}

export default function HomeCanvas(props: Props) {
  const [dpr] = useState(() =>
    Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2),
  );

  /* the film only decodes while the hero region is near the viewport */
  const [heroNear, setHeroNear] = useState(true);
  useEffect(() => {
    const el = document.querySelector('[data-cube-anchor="hero"]');
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setHeroNear(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Canvas
      aria-hidden
      flat
      frameloop={props.active ? "always" : "never"}
      dpr={dpr}
      camera={{ fov: 30, position: [0, 0, 14], near: 0.1, far: 60 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      style={{ pointerEvents: "none" }}
    >
      <Scene {...props} heroNear={heroNear} />
    </Canvas>
  );
}
