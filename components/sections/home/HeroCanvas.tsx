"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/* HeroCanvas (2.hero.md v5): the glass square becomes the film.

   One continuous set piece on one lazy WebGL canvas, driven by a
   TIME-DAMPED follower of native scroll progress (the scroll is never
   hijacked; the canvas just eases toward it, which throttles fast
   flicks into one legible motion):

   1. THE SQUARE (GlassCube): a glass cube with a solid accent core
      (the BigSquare mark inside glass), floating in the open area
      above the copy. Ambient drift + damped pointer tilt at rest.
   2. THE SWOOP: on scroll it dips down across the stage (passing
      BEHIND the exiting headline: the canvas sits under the text
      layer), sheds its spin, and flattens into a small rounded pane
      at the lower left: the media card.
   3. THE DEVELOP: the film fades up inside that exact footprint as
      the glass clears away: the pane becomes the picture. Ink-blue
      duotone first, true color as it grows.
   4. THE BALLOON: the card grows out to a framed near-viewport panel
      (NOT full bleed: 4vw margins, radius 24, lusion's settle) with a
      cloth bend mid-growth: per-vertex lagged expansion (leading edge
      ahead, trailing corner curling behind) plus a z arc toward the
      camera. At rest the pane is perfectly flat.

   Rendering contract (STYLE_GUIDE 7.9): frameloop "never" offscreen,
   DPR watchdog, dispose on unmount, lazy chunk, never the LCP element.
   Materials are built imperatively and attached via <primitive>:
   passing a `uniforms` object as a JSX prop leaves the material bound
   to a clone, so useFrame mutations never reach the GPU (found the
   hard way in this build; keep the pattern). Raw ShaderMaterials run
   in raw sRGB end to end (NoColorSpace textures + NoColorSpace token
   colors); built-in materials (glass, backdrop) use three's managed
   pipeline; Canvas is `flat` so no tone mapping shifts the tokens. */

type Props = {
  progress: MotionValue<number>;
  poster: string;
  video: string | null;
  active: boolean;
};

/* ---- timeline (fractions of the takeover, applied to the damped
   follower, not raw scroll). Stretched in review 2: slower swoop, and
   a real held beat at the card where the side text block lives. ------ */
const SWOOP: [number, number] = [0.08, 0.46]; /* cube travels + calms */
const FLATTEN: [number, number] = [0.38, 0.48]; /* cube -> glass pane */
const CUBE_FADE: [number, number] = [0.52, 0.6]; /* glass retired under the film */
const GATE: [number, number] = [0.5, 0.58]; /* film develops OVER the glass card */
const PANE_SETTLE: [number, number] = [0.62, 0.68]; /* pane eases from its
   handoff z (just in front of the slab) back onto the z=0 plane */
const DEVELOP: [number, number] = [0.5, 0.7]; /* ink -> true color */
const BALLOON: [number, number] = [0.62, 0.92]; /* card -> framed panel */
const MEDIA_SCALE: [number, number] = [0.62, 0.94]; /* 1.16 -> 1 */

/* the media card (fractions of stage from center, y up) */
const CARD_CENTER: [number, number] = [-0.24, -0.17];
const CARD_W = 0.34; /* of stage width; 16:9 */
const CARD_CENTER_MOBILE: [number, number] = [-0.06, -0.16];
const CARD_W_MOBILE = 0.62;
/* the settled panel: uniform margin as a fraction of stage width */
const PANEL_MARGIN = 0.04;

const seg = (v: number, [a, b]: [number, number]) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));
const smooth = (t: number) => t * t * (3 - 2 * t);

/* Brand tokens in raw sRGB for the raw-shader pipeline */
const INK_DEEP = new THREE.Color().setHex(0x0a2a73, THREE.NoColorSpace);
const INK_LIGHT = new THREE.Color().setHex(0x6e9bff, THREE.NoColorSpace);
const INK_ACC = new THREE.Color().setHex(0x0657f9, THREE.NoColorSpace);

/* ---- damped follower of scroll progress ---------------------------- */

function useSmoothProgress(progress: MotionValue<number>) {
  const sp = useRef(0);
  useFrame((_, delta) => {
    const target = progress.get();
    const k = 1 - Math.exp(-4.5 * Math.min(delta, 0.1));
    sp.current += (target - sp.current) * k;
    if (Math.abs(target - sp.current) < 0.0005) sp.current = target;
  });
  return sp;
}

/* ---- shared film media (poster-first, video cross-fade) ------------ */

type FilmMedia = {
  tex: { current: THREE.Texture | null };
  poster: { current: THREE.Texture | null };
  mix: { current: number };
  ready: { current: boolean };
  dims: { current: { w: number; h: number } };
};

function useFilmMedia(posterSrc: string, videoSrc: string | null, active: boolean): FilmMedia {
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

  /* offscreen: stop video decode along with the frameloop */
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) el.play().catch(() => {});
    else el.pause();
  }, [active]);

  return media;
}

/* cover-fit scale for a texture on a surface of the given aspect */
function coverScale(out: THREE.Vector2, texW: number, texH: number, aspect: number) {
  const texA = texW / texH;
  out.set(Math.min(1, aspect / texA), Math.min(1, texA / aspect));
}

/* stage helpers: the current card / panel rects in world units */
function cardRect(w: number, h: number, mobile: boolean) {
  const cw = w * (mobile ? CARD_W_MOBILE : CARD_W);
  const center = mobile ? CARD_CENTER_MOBILE : CARD_CENTER;
  return {
    cx: center[0] * w,
    cy: center[1] * h,
    w: cw,
    h: (cw * 9) / 16,
  };
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

/* paper backdrop inside the canvas: gives the glass something to
   refract and makes the stage ground exactly the page paper */
function PaperBackdrop() {
  return (
    <mesh position={[0, 0, -6]} scale={[80, 50, 1]}>
      <planeGeometry />
      <meshBasicMaterial color="#F5F6F8" />
    </mesh>
  );
}

/* ---- the glass square (GlassCube) ---------------------------------- */

/* swoop path: dips below the card line, then rises onto it. The rest
   anchor is path[0]; the last point must match the card center. */
const SWOOP_PATH: [number, number][] = [
  [0.3, 0.24],
  [0.1, -0.06],
  [-0.12, -0.3],
  [-0.3, -0.26],
  [-0.24, -0.17],
];
/* mobile: floats higher (clear of the 5-line headline), lands center */
const SWOOP_PATH_MOBILE: [number, number][] = [
  [0.24, 0.3],
  [0.12, 0.02],
  [-0.14, -0.28],
  [-0.06, -0.16],
];

function GlassCube({
  sp,
  active,
}: {
  sp: { current: number };
  active: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const smoke = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const tilt = useRef({ x: 0, y: 0 });

  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 4, 0.06), []);
  const smokeGeometry = useMemo(() => new THREE.SphereGeometry(1, 48, 32), []);

  /* review 2: lower ior + thinner walls + a touch more frost so the
     core doesn't refract into "multiple cubes" through the bevels */
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
  /* the smoke core: one amorphous blob, morphed by animated vertex
     noise and shaded by fbm density with stochastic coverage (manual
     alpha-hash via discard). Discard keeps the material in the OPAQUE
     queue: transparent materials are excluded from three's
     transmission buffer and would vanish behind the glass. The
     frosted glass blurs the hashed grain into real smoke. */
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
            /* drifting internal density */
            float d = fbm(vPos * 2.6 + vec3(0.0, uTime * 0.16, uTime * 0.1));
            /* denser toward the middle, wispy at the silhouette */
            float facing = pow(abs(dot(normalize(vNormal), normalize(vView))), 1.2);
            float density = clamp(smoothstep(0.28, 0.72, d) * facing * 1.6 * uDensity, 0.0, 0.85);
            /* stochastic coverage: spatial hash only (temporal shimmers) */
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

  /* pointer interactivity: the canvas is pointer-events none (text
     stays selectable), so listen on the window and damp toward it */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = sp.current;
    const alpha = 1 - seg(p, CUBE_FADE);
    g.visible = alpha > 0.001 && active;
    if (!g.visible) return;

    const { width: w, height: h } = state.viewport;
    const mobile = state.size.width < 768;
    const t = state.clock.elapsedTime;
    const flight = smooth(seg(p, SWOOP));
    const rest = 1 - seg(p, [SWOOP[0], SWOOP[0] + 0.1]);
    const flat = smooth(seg(p, FLATTEN));

    /* position: float anchor + ambient drift, then the swoop */
    const curve = mobile ? curves.mobile : curves.desktop;
    const pos = curve.getPoint(flight);
    const bobX = Math.sin(t * 0.5) * 0.012 * rest;
    const bobY = Math.sin(t * 0.75 + 1.3) * 0.02 * rest;
    g.position.set(
      (pos.x + bobX) * w,
      (pos.y + bobY) * h,
      Math.sin(Math.PI * flight) * h * 0.06,
    );

    /* rotation: slow idle turn + pointer tilt; the swoop adds only a
       gentle fraction of a turn and settles face-on at the card
       (review 2: halved again, it read as spinning too fast) */
    tilt.current.x += (pointer.current.y * 0.2 * rest - tilt.current.x) * 0.05;
    tilt.current.y += (pointer.current.x * 0.28 * rest - tilt.current.y) * 0.05;
    const calm = 1 - flight;
    g.rotation.set(
      (0.44 + tilt.current.x + Math.sin(t * 0.3) * 0.05 * rest) * calm + Math.sin(Math.PI * flight) * 0.16,
      (0.72 + tilt.current.y + t * 0.05 * rest) * calm + flight * 0.5 * calm,
      -0.1 * calm,
    );

    /* scale: cube at rest; flattens into the exact card footprint */
    const s = Math.min(w, h) * 0.2;
    const card = cardRect(w, h, mobile);
    g.scale.set(
      s + (card.w - s) * flat,
      s + (card.h - s) * flat,
      s * (1 - 0.965 * flat),
    );
    /* keep refraction sane as the slab thins, and shed the frost so
       the clearing veil reads as the develop, not a milky slab */
    glass.thickness = 0.6 * (1 - 0.9 * flat);
    glass.envMapIntensity = 1.0 * (1 - 0.8 * flat);
    glass.roughness = 0.09 * (1 - 0.7 * flat);
    glass.opacity = alpha;

    /* the smoke: one morphing wisp, drifting slowly, shrinking away
       through the flatten */
    const sm = smoke.current;
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
      /* max noise-displaced radius stays under the half-cube (0.5) so
         the smoke never pokes through a face and reads as a decal */
      sm.scale.setScalar(0.3 * (1 - flat));
    }
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geometry} frustumCulled={false}>
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

/* ---- the film pane: card -> balloon -> framed panel ---------------- */

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

    /* growth direction: card corner -> panel center (up and right);
       leading edge top-right, trailing corner bottom-left curls */
    vec2 dir = normalize(vec2(0.72, 0.7));
    float d = dot(uv - 0.5, dir);
    float ev = clamp(uGrow * (1.0 + 1.42 * uLag) - (0.5 - d) * uLag, 0.0, 1.0);
    ev = ev * ev * (3.0 - 2.0 * ev);
    vT = ev;

    vec2 center = mix(uStart.xy, uEnd.xy, ev);
    vec2 size = mix(uStart.zw, uEnd.zw, ev);
    vec3 pos = vec3(center + (uv - 0.5) * size, 0.0);

    /* the cloth: z arc toward the camera mid-growth; flat at rest */
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
    /* cover-fit + counter-scale media UVs */
    vec2 uv = (vUv - 0.5) / uMediaScale * uCover + 0.5;
    vec3 col = mix(texture2D(uPoster, uv).rgb, texture2D(uTex, uv).rgb, uTexMix);

    /* the ink develop: brand-blue duotone resolving to true color */
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 ink = mix(uInkDeep, uInkLight, smoothstep(0.0, 0.62, lum));
    col = mix(col, ink, uInk);

    /* rounded-rect clip in the pane's own space, AA'd via fwidth */
    vec2 size = mix(uStart.zw, uEnd.zw, vT);
    float radius = mix(uRadiusStart, uRadiusEnd, vT);
    vec2 p = (vUv - 0.5) * size;
    float sdf = sdRoundBox(p, 0.5 * size, radius);
    float aa = max(fwidth(sdf), 1e-4) * 1.2;
    float mask = 1.0 - smoothstep(-aa, aa, sdf);

    gl_FragColor = vec4(col, uAlpha * mask);
  }
`;

function FilmPane({
  sp,
  media,
}: {
  sp: { current: number };
  media: FilmMedia;
}) {
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
    const p = sp.current;
    const m = mesh.current;
    if (!m) return;
    const u = material.uniforms;

    /* poster -> film crossfade, eased in time not scroll */
    const target = media.ready.current ? 1 : 0;
    media.mix.current += (target - media.mix.current) * 0.06;

    const alpha = seg(p, GATE);
    m.visible = alpha > 0.001;
    if (!m.visible) return;

    const { width: w, height: h } = state.viewport;
    const mobile = state.size.width < 768;
    const pxToWorld = h / state.size.height;

    /* the film develops ON TOP of the glass card (renderOrder + a
       slight z lead): transmission materials don't composite reliably
       under an opacity fade, so the pane covers the glass and the
       glass is simply retired once hidden */
    m.position.z = 0.08 * (1 - smooth(seg(p, PANE_SETTLE)));
    m.renderOrder = 10;

    const card = cardRect(w, h, mobile);
    const panel = panelRect(w, h);
    (u.uStart.value as THREE.Vector4).set(card.cx, card.cy, card.w, card.h);
    (u.uEnd.value as THREE.Vector4).set(panel.cx, panel.cy, panel.w, panel.h);

    const grow = seg(p, BALLOON);
    u.uGrow.value = grow;
    u.uZArc.value = h * 0.16;
    u.uAlpha.value = alpha;
    u.uRadiusStart.value = 24 * pxToWorld;
    u.uRadiusEnd.value = 24 * pxToWorld;
    u.uMediaScale.value = 1.16 + (1 - 1.16) * seg(p, MEDIA_SCALE);
    u.uInk.value = 1 - seg(p, DEVELOP);

    u.uTex.value = media.tex.current;
    u.uPoster.value = media.poster.current;
    u.uTexMix.value = media.mix.current;

    /* cover for the current mid-growth aspect (center-vertex t) */
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

function Scene({ progress, poster, video, active }: Props) {
  const sp = useSmoothProgress(progress);
  const media = useFilmMedia(poster, video, active);
  return (
    <>
      <PerfGuard />
      <StudioEnvironment />
      <PaperBackdrop />
      <GlassCube sp={sp} active={active} />
      <FilmPane sp={sp} media={media} />
    </>
  );
}

export default function HeroCanvas(props: Props) {
  const [dpr] = useState(() =>
    Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2),
  );

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
      <Scene {...props} />
    </Canvas>
  );
}
