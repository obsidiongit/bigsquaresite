import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { BLUE, INK, PAPER, createInkMaterial, createOutlineMaterial } from "./ink";
import { coverScale, createFilmDecalMaterial, createFilmUniforms } from "./film";
import { createPropKit, type Drawn } from "./props";
import { composeTown, type Town } from "./town";
import {
  FILM_CENTER,
  GROUND_Y,
  NARROW,
  ROAD_HEADING,
  cubePose,
  filmState,
  type FilmState,
  type Layout,
} from "./path";

export { GROUND_Y, NARROW };

/* The hero world (cube-v2/brief.md sections 6, 9 and 10). One paper
   ground with the hairline grid, one raking key light with long hard
   shadows, the protagonist cube with plain faces, and the town from
   lib/cube/town.ts: the ink road, storefronts, trees, the mark, two
   sheets, all procedural, all in the cube's own two-tone ink material.
   Never a second cube.

   Round 2: the world takes the two clocks (p, c) each frame and
   applies lib/cube/path.ts: the cube rolls two quarter turns down the
   road onto the film station; the station's frame draws itself ahead
   of it; the top face lights up with the brand film, which spreads to
   the frame and develops; the mid-build storefront tops out. The
   camera is the canvas's; the world only needs its elevation to know
   when the protagonist's silhouette is all film. */

/* Key light direction (from the scene toward the light): front-right
   and low (about 30 degrees elevation). The faces that face the camera
   split lit/shadow (paper right, blue left), and the shadow runs long
   to the back-left, under the headline. Shared by the shadow-casting
   light and the ink terminator so both agree. */
export const KEY_DIR = new THREE.Vector3(0.78, 0.52, 0.42).normalize();

export const GRID_CELL = 0.25;
/** viewports narrower than this hide the foreground props (town.ts) */
export const FOREGROUND_MIN = 1024;

const grain = /* glsl */ `
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float paperGrain(vec2 p, float tick) {
    return hash(floor(p) + vec2(tick * 17.0, tick * 31.0));
  }
`;

const groundVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/* Paper with the hairline grid: 1.2px lines every GRID_CELL, ink at
   6 percent, fading with distance (fwidth) so the horizon never
   moires; 4 percent grain stepped at 12fps like the cube faces. */
const groundFragment = /* glsl */ `
  uniform vec3 uPaper;
  uniform vec3 uInk;
  uniform float uCell;
  uniform float uGrainFrame;
  uniform float uDpr;
  varying vec3 vWorld;
  ${grain}
  void main() {
    vec2 g = vWorld.xz / uCell;
    vec2 fw = fwidth(g);
    vec2 d = abs(fract(g - 0.5) - 0.5) / max(fw, vec2(0.0001));
    float line = 1.0 - min(min(d.x, d.y), 1.0);
    /* graph paper: a heavier rule every four cells (one cube edge) */
    vec2 G = g / 4.0;
    vec2 FW = fw / 4.0;
    vec2 D = abs(fract(G - 0.5) - 0.5) / max(FW, vec2(0.0001));
    float major = 1.0 - min(min(D.x, D.y), 1.0);
    float fade = 1.0 - smoothstep(0.12, 0.5, max(fw.x, fw.y));
    vec3 color = mix(uPaper, uInk, max(line * 0.07, major * 0.13) * fade);
    color = mix(color, uInk, paperGrain(gl_FragCoord.xy / uDpr, uGrainFrame) * 0.04);
    gl_FragColor = vec4(color, 1.0);
  }
`;

/* A hand-drawn ink ring on the paper around the protagonist's rest
   spot, in the RoughAnnotation circle's character: two wobbly passes,
   open ends. It stays behind when the cube rolls: the start mark. */
function createRing(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("The ink ring needs a 2D canvas.");
  ctx.translate(size / 2, size / 2);
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let pass = 0; pass < 2; pass++) {
    ctx.beginPath();
    ctx.lineWidth = pass === 0 ? 14 : 9;
    const rx = 400 + pass * 9;
    const ry = 392 - pass * 7;
    const start = -0.6 + pass * 0.9;
    const end = start + Math.PI * 2 * 1.02;
    for (let i = 0; i <= 140; i++) {
      const t = start + ((end - start) * i) / 140;
      const w = Math.sin(t * 7.3 + pass * 1.7) * 7 + Math.sin(t * 2.9 + pass) * 11;
      const x = Math.cos(t) * (rx + w);
      const y = Math.sin(t) * (ry + w * 0.8);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/* Plain faces: the ink shader still samples a mark atlas (the sandbox
   uses it), so the world passes one transparent texel. */
function createNoMarks(): THREE.DataTexture {
  const texture = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/** the brand film, poster first (HomeCanvas useFilmMedia contract) */
export type WorldMedia = {
  tex: THREE.Texture | null;
  poster: THREE.Texture | null;
  mix: number;
  dims: { w: number; h: number };
};

export type WorldFrame = {
  time: number;
  dpr: number;
  width: number;
  height: number;
  camera: THREE.Camera;
  /** the hero clock, damped */
  p: number;
  /** the reform clock, damped */
  c: number;
  /** the camera's elevation, radians */
  el: number;
  layout: Layout;
  media: WorldMedia;
};

export type World = {
  group: THREE.Group;
  protagonist: THREE.Group;
  light: THREE.DirectionalLight;
  update(frame: WorldFrame): void;
  dispose(): void;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function createWorld(): World {
  const group = new THREE.Group();
  const geometry = new RoundedBoxGeometry(1, 1, 1, 4, 0.06);
  const marks = createNoMarks();
  const ink = createInkMaterial(marks);
  const outline = createOutlineMaterial();
  const kit = createPropKit(ink, outline, GROUND_Y);

  /* the film: uniforms shared by the paper decal and the protagonist's
     own ink material (the only material in the world with the film
     branch), so the face and the frame are one picture */
  const filmU = createFilmUniforms(GROUND_Y);
  const cubeInk = createInkMaterial(marks, filmU);
  const cubeHull = createOutlineMaterial();

  /* the protagonist: 1 unit, resting on the paper at the origin with
     its -z face down the road (path.ts BASE_Q); cubePose moves it */
  const protagonist = new THREE.Group();
  const cube = new THREE.Mesh(geometry, cubeInk);
  cube.castShadow = true;
  cube.renderOrder = 1;
  const hull = new THREE.Mesh(geometry, cubeHull);
  protagonist.add(cube, hull);
  group.add(protagonist);
  const cubeShade = kit.contactShade(1, 1);
  const cubeShadeMaterial = (cubeShade.material as THREE.MeshBasicMaterial).clone();
  cubeShade.material = cubeShadeMaterial;
  cubeShade.renderOrder = 2;
  group.add(cubeShade);

  /* the film station: the drawn frame (rebuilt per layout, since its
     aspect follows the viewport's panel) and the decal that carries
     the film on the paper, both centred FILM_S down the road */
  const station = new THREE.Group();
  station.position.set(FILM_CENTER.x, 0, FILM_CENTER.z);
  station.rotation.y = ROAD_HEADING;
  group.add(station);
  const decalMaterial = createFilmDecalMaterial(filmU);
  const decalGeometry = new THREE.PlaneGeometry(1, 1);
  const decal = new THREE.Mesh(decalGeometry, decalMaterial);
  decal.rotation.x = -Math.PI / 2;
  decal.position.y = GROUND_Y + 0.006;
  decal.renderOrder = 1;
  decal.visible = false;
  station.add(decal);
  let frameStroke: Drawn | null = null;
  let layoutSeen: Layout | null = null;
  const decalMask = decalMaterial.uniforms.uFilmMaskHalf.value as THREE.Vector2;
  const cubeMask = cubeInk.uniforms.uFilmMaskHalf.value as THREE.Vector2;
  filmU.uFilmFrame.value.set(FILM_CENTER.x, FILM_CENTER.z, Math.cos(ROAD_HEADING), Math.sin(ROAD_HEADING));

  /* the town */
  const town: Town = composeTown(kit);
  for (const p of town.placed) group.add(p.object);
  let narrow: boolean | null = null;

  /* ground: paper + grid (opaque), then the blue shadow plane over it */
  const groundMaterial = new THREE.ShaderMaterial({
    vertexShader: groundVertex,
    fragmentShader: groundFragment,
    toneMapped: false,
    uniforms: {
      uPaper: { value: PAPER.clone() },
      uInk: { value: INK.clone() },
      uCell: { value: GRID_CELL },
      uGrainFrame: { value: 0 },
      uDpr: { value: 1 },
    },
  });
  const groundGeometry = new THREE.PlaneGeometry(120, 120);
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = GROUND_Y;
  ground.renderOrder = -2;
  group.add(ground);

  const shadowMaterial = new THREE.ShaderMaterial({
    vertexShader: THREE.ShaderLib.shadow.vertexShader,
    fragmentShader: THREE.ShaderLib.shadow.fragmentShader.replace("#include <colorspace_fragment>", ""),
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.lights,
      { color: { value: BLUE.clone() }, opacity: { value: 1 } },
    ]),
    lights: true,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  const shadowPlane = new THREE.Mesh(groundGeometry, shadowMaterial);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = GROUND_Y + 0.002;
  shadowPlane.receiveShadow = true;
  shadowPlane.renderOrder = -1;
  group.add(shadowPlane);

  const ring = createRing();
  /* built-in material: the managed pipeline converts to linear and back,
     so this one takes the normal sRGB constructor (raw BLUE reads washed
     out here, the inverse of the raw-shader trap) */
  const ringMaterial = new THREE.MeshBasicMaterial({
    map: ring,
    color: new THREE.Color("#0657F9"),
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  const ringGeometry = new THREE.PlaneGeometry(2.0, 2.0);
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
  ringMesh.rotation.x = -Math.PI / 2;
  ringMesh.rotation.z = 1.9; /* the open end faces away from the headline */
  ringMesh.position.set(0.08, GROUND_Y + 0.004, 0.05);
  ringMesh.renderOrder = 0;
  group.add(ringMesh);

  /* the key: one directional light, long throw, resolved hard edge. The
     shadow box is centred between the cube and the town so every
     solid in the frame casts. */
  const light = new THREE.DirectionalLight(0xffffff, 1);
  const shadowTarget = new THREE.Vector3(-3, GROUND_Y, -6);
  light.position.copy(shadowTarget).addScaledVector(KEY_DIR, 24);
  light.target.position.copy(shadowTarget);
  light.castShadow = true;
  light.shadow.mapSize.set(4096, 4096);
  light.shadow.camera.left = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;
  light.shadow.camera.bottom = -10;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 60;
  light.shadow.bias = -0.0004;
  light.shadow.normalBias = 0.02;
  light.shadow.radius = 1;
  group.add(light, light.target);

  const lightView = new THREE.Vector3();
  const state: FilmState = { alpha: 0, spread: 0, ink: 1, mediaScale: 1.12, draw: 0, build: 0.6 };

  function applyLayout(L: Layout) {
    if (frameStroke) {
      station.remove(frameStroke);
      frameStroke.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (o.material as THREE.Material).dispose();
        }
      });
    }
    frameStroke = kit.frame(L.frameHalf.x, L.frameHalf.y, L.radius + 0.03);
    station.add(frameStroke);
    decal.scale.set(L.frameHalf.x * 2, L.frameHalf.y * 2, 1);
    filmU.uFilmHalf.value.copy(L.frameHalf);
    filmU.uFilmRadius.value = L.radius;
    layoutSeen = L;
  }

  return {
    group,
    protagonist,
    light,
    update(frame) {
      const tick = Math.floor(frame.time * 12);
      for (const m of [ink, cubeInk]) {
        m.uniforms.uGrainFrame.value = tick;
        m.uniforms.uDpr.value = frame.dpr;
      }
      groundMaterial.uniforms.uGrainFrame.value = tick;
      groundMaterial.uniforms.uDpr.value = frame.dpr;
      decalMaterial.uniforms.uGrainFrame.value = tick;
      decalMaterial.uniforms.uDpr.value = frame.dpr;
      outline.uniforms.uResolution.value.set(frame.width, frame.height);
      cubeHull.uniforms.uResolution.value.set(frame.width, frame.height);
      lightView.copy(KEY_DIR).transformDirection(frame.camera.matrixWorldInverse);
      ink.uniforms.uLight.value.copy(lightView);
      cubeInk.uniforms.uLight.value.copy(lightView);
      /* the foreground sheets need the desktop fold's bottom-left
         corner; below 1024 the headline runs down into it */
      const isNarrow = frame.width < FOREGROUND_MIN;
      if (isNarrow !== narrow) {
        narrow = isNarrow;
        for (const p of town.placed) if (p.foreground) p.object.visible = !isNarrow;
      }
      if (frame.layout !== layoutSeen) applyLayout(frame.layout);

      /* the protagonist rolls; its contact shade follows its foot and
         thins while it is up on an edge (the cast shadow does the work) */
      const phase = cubePose(frame.p, protagonist.position, protagonist.quaternion);
      cubeShade.position.set(protagonist.position.x, GROUND_Y + 0.003, protagonist.position.z);
      cubeShadeMaterial.opacity = 0.18 * (1 - phase);

      /* the film station */
      filmState(frame.p, frame.c, state);
      const L = frame.layout;
      const hx = L.frameHalf.x - 0.03;
      const hy = L.frameHalf.y - 0.03;
      decalMask.set(lerp(0.5, hx, state.spread), lerp(0.5, hy, state.spread));
      /* the cube's own mask always covers its footprint: the face is
         film from the first light, the paper joins as it spreads */
      cubeMask.set(Math.max(decalMask.x, 1.2), Math.max(decalMask.y, 1.2));
      filmU.uFilmAlpha.value = state.alpha;
      filmU.uFilmInk.value = state.ink;
      filmU.uFilmMediaScale.value = state.mediaScale;
      filmU.uFilmTex.value = frame.media.tex;
      filmU.uFilmPoster.value = frame.media.poster;
      filmU.uFilmTexMix.value = frame.media.mix;
      coverScale(filmU.uFilmCover.value, frame.media.dims.w, frame.media.dims.h, L.frameHalf.x / L.frameHalf.y);
      decal.visible = state.alpha > 0.001;
      frameStroke?.setDraw(state.draw);
      /* the lit screen kills the cast shadow beside it (a two-unit
         blue wedge would otherwise poke past the panel at the hold);
         nothing else is in frame while the film is up, and it returns
         as the film dies on the reform */
      shadowMaterial.uniforms.opacity.value = 1 - state.alpha;
      cubeShadeMaterial.opacity *= 1 - state.alpha;
      /* the hull would draw a square inside the film once the camera is
         over the top and the silhouette is all face: fade it there */
      cubeHull.uniforms.uWidth.value = 1 - state.alpha * smoothstep(1.1, 1.5, frame.el);

      town.rising.setBuild(state.build);
    },
    dispose() {
      geometry.dispose();
      marks.dispose();
      ink.dispose();
      cubeInk.dispose();
      outline.dispose();
      cubeHull.dispose();
      cubeShadeMaterial.dispose();
      kit.dispose();
      decalMaterial.dispose();
      decalGeometry.dispose();
      groundMaterial.dispose();
      groundGeometry.dispose();
      shadowMaterial.dispose();
      ring.dispose();
      ringMaterial.dispose();
      ringGeometry.dispose();
      light.shadow.dispose();
    },
  };
}
