import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { BLUE, INK, PAPER, createInkMaterial, createOutlineMaterial } from "./ink";
import { createPropKit } from "./props";
import { composeTown, type Placed } from "./town";

/* The hero world (cube-v2/brief.md sections 6, 9 and 10; round 1: the
   town at rest). One paper ground with the hairline grid, one raking
   key light with long hard shadows, the protagonist cube at the origin
   with plain faces, and the town from lib/cube/town.ts: the ink road,
   storefronts, trees, the van and two sheets, all procedural, all in
   the cube's own two-tone ink material. Never a second cube. */

/* Key light direction (from the scene toward the light): front-right
   and low (about 30 degrees elevation). The faces that face the camera
   split lit/shadow (paper right, blue left), and the shadow runs long
   to the back-left, under the headline. Round 1a had it back-left,
   which put every visible face in shadow: an all-blue cube. Shared by
   the shadow-casting light and the ink terminator so both agree. */
export const KEY_DIR = new THREE.Vector3(0.78, 0.52, 0.42).normalize();

export const GROUND_Y = -0.5;
export const GRID_CELL = 0.25;
/** viewports narrower than this hide the foreground props (town.ts) */
export const NARROW = 768;

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

/* A hand-drawn ink ring on the paper around the protagonist, in the
   RoughAnnotation circle's character: two wobbly passes, open ends. */
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

export type World = {
  group: THREE.Group;
  protagonist: THREE.Group;
  light: THREE.DirectionalLight;
  update(frame: { time: number; dpr: number; width: number; height: number; camera: THREE.Camera }): void;
  dispose(): void;
};

export function createWorld(): World {
  const group = new THREE.Group();
  const geometry = new RoundedBoxGeometry(1, 1, 1, 4, 0.06);
  const marks = createNoMarks();
  const ink = createInkMaterial(marks);
  const outline = createOutlineMaterial();
  const kit = createPropKit(ink, outline, GROUND_Y);

  /* the protagonist: 1 unit at the origin, resting on the paper, turned
     off-axis so two faces and the top read at once; its -z face points
     down the road (town.ts ROAD_HEADING) */
  const protagonist = new THREE.Group();
  const cube = new THREE.Mesh(geometry, ink);
  cube.castShadow = true;
  cube.renderOrder = 1;
  const hull = new THREE.Mesh(geometry, outline);
  protagonist.add(cube, hull);
  protagonist.position.set(0, GROUND_Y + 0.5, 0);
  protagonist.rotation.y = 0.62;
  group.add(protagonist);
  const cubeShade = kit.contactShade(1, 1);
  cubeShade.position.y = GROUND_Y + 0.003;
  group.add(cubeShade);

  /* the town */
  const town: Placed[] = composeTown(kit);
  for (const p of town) group.add(p.object);
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

  return {
    group,
    protagonist,
    light,
    update(frame) {
      const tick = Math.floor(frame.time * 12);
      ink.uniforms.uGrainFrame.value = tick;
      ink.uniforms.uDpr.value = frame.dpr;
      groundMaterial.uniforms.uGrainFrame.value = tick;
      groundMaterial.uniforms.uDpr.value = frame.dpr;
      outline.uniforms.uResolution.value.set(frame.width, frame.height);
      lightView.copy(KEY_DIR).transformDirection(frame.camera.matrixWorldInverse);
      ink.uniforms.uLight.value.copy(lightView);
      const isNarrow = frame.width < NARROW;
      if (isNarrow !== narrow) {
        narrow = isNarrow;
        for (const p of town) if (p.foreground) p.object.visible = !isNarrow;
      }
    },
    dispose() {
      geometry.dispose();
      marks.dispose();
      ink.dispose();
      outline.dispose();
      kit.dispose();
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
