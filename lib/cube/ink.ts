import * as THREE from "three";
import type { CubeLook, LookFrame } from "./types";

const raw = (hex: number) => new THREE.Color().setHex(hex, THREE.NoColorSpace);
/* brand tokens in raw sRGB for the raw-shader pipeline (shared with world.ts) */
export const BLUE = raw(0x0657f9);
export const PAPER = raw(0xf5f6f8);
export const NAVY = raw(0x0a2a73);
export const INK = raw(0x0b0f17);
export const LIT = PAPER.clone().lerp(BLUE, 0.08);
const LIGHT = new THREE.Vector3(-3, 5, 4).normalize();

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

const inkVertex = /* glsl */ `
  varying vec3 vPosition;
  varying vec3 vObjectNormal;
  varying vec3 vViewNormal;
  void main() {
    vPosition = position;
    vObjectNormal = normal;
    vViewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const inkFragment = /* glsl */ `
  uniform vec3 uLit;
  uniform vec3 uBlue;
  uniform vec3 uNavy;
  uniform vec3 uLight;
  uniform sampler2D uMarks;
  uniform float uGrainFrame;
  uniform float uDpr;
  varying vec3 vPosition;
  varying vec3 vObjectNormal;
  varying vec3 vViewNormal;
  ${grain}

  // One independent mark in each of the six cells of a 512px atlas.
  vec2 markUv() {
    vec3 n = normalize(vObjectNormal);
    vec3 a = abs(n);
    vec2 uv;
    float face;
    if (a.x > a.y && a.x > a.z) {
      face = n.x > 0.0 ? 0.0 : 1.0;
      uv = vec2(n.x > 0.0 ? -vPosition.z : vPosition.z, vPosition.y);
    } else if (a.y > a.z) {
      face = n.y > 0.0 ? 2.0 : 3.0;
      uv = vec2(vPosition.x, n.y > 0.0 ? -vPosition.z : vPosition.z);
    } else {
      face = n.z > 0.0 ? 4.0 : 5.0;
      uv = vec2(n.z > 0.0 ? vPosition.x : -vPosition.x, vPosition.y);
    }
    return (clamp(uv + 0.5, 0.005, 0.995) + vec2(mod(face, 3.0), floor(face / 3.0))) / vec2(3.0, 2.0);
  }

  void main() {
    float ndl = dot(normalize(vViewNormal), normalize(uLight));
    float lit = smoothstep(0.49, 0.51, ndl);
    vec3 color = mix(uBlue, uLit, lit);
    float mark = texture2D(uMarks, markUv()).a;
    color = mix(color, uNavy, mark);
    color = mix(color, uNavy, paperGrain(gl_FragCoord.xy / uDpr, uGrainFrame) * 0.04);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const outlineVertex = /* glsl */ `
  uniform vec2 uResolution;
  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 clip = projectionMatrix * viewPosition;
    vec3 viewNormal = normalize(normalMatrix * normal);
    vec4 projectedNormal = projectionMatrix * vec4(viewNormal, 0.0);
    // Perspective derivative of NDC along the transformed normal.
    vec2 derivative = projectedNormal.xy * clip.w - clip.xy * projectedNormal.w;
    vec2 pixelDirection = derivative * uResolution;
    pixelDirection /= max(length(pixelDirection), 0.00001);
    // Hull geometries may carry a normal length above 1 to widen the
    // offset (box corners push along a diagonal, which thins the edge).
    float boost = max(length(normal), 1.0);
    clip.xy += pixelDirection * (3.0 * boost / uResolution) * clip.w;
    gl_Position = clip;
  }
`;

const sheetVertex = /* glsl */ `
  uniform mat4 uWorldToCube;
  varying vec3 vCubePosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vCubePosition = (uWorldToCube * worldPosition).xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const sheetFragment = /* glsl */ `
  uniform vec3 uPaper;
  uniform vec3 uBlue;
  uniform vec3 uNavy;
  uniform vec3 uCameraCube;
  uniform vec3 uLightWorld;
  uniform mat3 uCubeNormalWorld;
  uniform float uGrainFrame;
  uniform float uDpr;
  varying vec3 vCubePosition;
  ${grain}

  float shadowSideOverlap() {
    vec3 ray = normalize(vCubePosition - uCameraCube);
    vec3 safeRay = mix(vec3(-1.0), vec3(1.0), step(vec3(0.0), ray)) * max(abs(ray), vec3(0.00001));
    vec3 a = (-vec3(0.5) - uCameraCube) / safeRay;
    vec3 b = (vec3(0.5) - uCameraCube) / safeRay;
    vec3 nearPlane = min(a, b);
    vec3 farPlane = max(a, b);
    float entry = max(max(nearPlane.x, nearPlane.y), nearPlane.z);
    float leave = min(min(farPlane.x, farPlane.y), farPlane.z);
    if (leave < max(entry, 0.0) || entry < length(vCubePosition - uCameraCube) - 0.015) return 0.0;
    vec3 hit = uCameraCube + ray * entry;
    vec3 axis = abs(hit);
    vec3 normal = axis.x > axis.y && axis.x > axis.z
      ? vec3(sign(hit.x), 0.0, 0.0)
      : axis.y > axis.z ? vec3(0.0, sign(hit.y), 0.0) : vec3(0.0, 0.0, sign(hit.z));
    float ndl = dot(normalize(uCubeNormalWorld * normal), uLightWorld);
    return 1.0 - smoothstep(0.49, 0.51, ndl);
  }

  void main() {
    vec3 color = mix(uPaper, uBlue, shadowSideOverlap() * 0.12);
    color = mix(color, uNavy, paperGrain(gl_FragCoord.xy / uDpr, uGrainFrame) * 0.025);
    gl_FragColor = vec4(color, 0.55);
  }
`;

export function createMarks(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("The cube ink atlas needs a 2D canvas.");
  const centers = [[0.37, 0.6], [0.62, 0.37], [0.57, 0.62], [0.4, 0.4], [0.43, 0.51], [0.62, 0.59]];
  for (let face = 0; face < 6; face++) {
    const cellX = (face % 3) * 512 / 3;
    // CanvasTexture's default flipY means atlas row 0 is the bottom.
    const cellY = (1 - Math.floor(face / 3)) * 256;
    ctx.save();
    ctx.translate(cellX, cellY);
    ctx.scale(512 / 3, 256);
    ctx.translate(centers[face][0], centers[face][1]);
    ctx.rotate((face - 2.5) * 0.045);
    const half = 0.115 + face * 0.007;
    ctx.beginPath();
    for (let point = 0; point <= 64; point++) {
      const edge = Math.min(3, Math.floor(point / 16));
      const t = (point - edge * 16) / 16;
      const wobble = Math.sin(point * 0.86 + face * 2.1) * 0.0038 + Math.sin(point * 0.31 + face) * 0.002;
      const x = edge === 0 ? -half + 2 * half * t : edge === 1 ? half + wobble : edge === 2 ? half - 2 * half * t : -half + wobble;
      const y = edge === 0 ? -half + wobble : edge === 1 ? -half + 2 * half * t : edge === 2 ? half + wobble : half - 2 * half * t;
      if (point === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 0.011;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/** The two-tone ink surface. uLight is a VIEW-space direction: callers
    update it per frame from their world light. Shared by the sandbox
    look and by every solid in the hero world. */
export function createInkMaterial(marks: THREE.Texture): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: inkVertex,
    fragmentShader: inkFragment,
    toneMapped: false,
    uniforms: {
      uLit: { value: LIT.clone() },
      uBlue: { value: BLUE.clone() },
      uNavy: { value: NAVY.clone() },
      uLight: { value: LIGHT.clone() },
      uMarks: { value: marks },
      uGrainFrame: { value: 0 },
      uDpr: { value: 1 },
    },
  });
}

/** The 1.5px screen-constant navy hull. uResolution is CSS pixels. */
export function createOutlineMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: outlineVertex,
    fragmentShader: "uniform vec3 uColor; void main() { gl_FragColor = vec4(uColor, 1.0); }",
    uniforms: { uResolution: { value: new THREE.Vector2(1, 1) }, uColor: { value: NAVY.clone() } },
    side: THREE.BackSide,
    toneMapped: false,
  });
}

/** The caller owns the shared cube geometry and the object's pose. */
export function createInkLook(geometry: THREE.BufferGeometry, tracing: boolean): CubeLook {
  const object = new THREE.Group();
  const marks = createMarks();
  const material = createInkMaterial(marks);
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  cube.renderOrder = 1;
  object.add(cube);

  const outlineMaterial = createOutlineMaterial();
  const outline = new THREE.Mesh(geometry, outlineMaterial);
  object.add(outline);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.copy(LIGHT).multiplyScalar(7);
  light.castShadow = true;
  light.shadow.camera.left = -2.6;
  light.shadow.camera.right = 2.6;
  light.shadow.camera.top = 2.6;
  light.shadow.camera.bottom = -2.6;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 14;
  light.shadow.bias = -0.0001;
  light.shadow.normalBias = 0.005;
  light.shadow.radius = 0;
  light.shadow.mapSize.set(256, 256);

  // Reuse r185's real light-shadow plumbing, retaining the raw-sRGB pipeline.
  const groundMaterial = new THREE.ShaderMaterial({
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
  const groundGeometry = new THREE.PlaneGeometry(12, 12);
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.5;
  ground.receiveShadow = true;
  ground.renderOrder = -1;

  const sheetGeometry = tracing ? new THREE.PlaneGeometry(1.4, 1) : null;
  const sheetMaterial = tracing ? new THREE.ShaderMaterial({
    vertexShader: sheetVertex,
    fragmentShader: sheetFragment,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      uPaper: { value: PAPER.clone() },
      uBlue: { value: BLUE.clone() },
      uNavy: { value: NAVY.clone() },
      uCameraCube: { value: new THREE.Vector3() },
      uWorldToCube: { value: new THREE.Matrix4() },
      uCubeNormalWorld: { value: new THREE.Matrix3() },
      uLightWorld: { value: LIGHT.clone() },
      uGrainFrame: { value: 0 },
      uDpr: { value: 1 },
    },
  }) : null;
  const sheet = sheetGeometry && sheetMaterial ? new THREE.Mesh(sheetGeometry, sheetMaterial) : null;
  if (sheet) {
    sheet.renderOrder = 3;
    object.add(sheet);
  }

  const inverseCube = new THREE.Matrix4();
  const cameraCube = new THREE.Vector3();
  const lightView = new THREE.Vector3();

  return {
    object,
    ground,
    lights: [light, light.target],
    update(frame: LookFrame) {
      material.uniforms.uGrainFrame.value = Math.floor(frame.time * 12);
      material.uniforms.uDpr.value = frame.dpr;
      lightView.copy(LIGHT).transformDirection(frame.camera.matrixWorldInverse);
      material.uniforms.uLight.value.copy(lightView);
      outlineMaterial.uniforms.uResolution.value.set(frame.width, frame.height);

      // Shadow maps follow the same half-resolution budget as the volume pass.
      const shadowWidth = Math.max(1, Math.ceil(frame.width * frame.dpr / 2));
      const shadowHeight = Math.max(1, Math.ceil(frame.height * frame.dpr / 2));
      if (light.shadow.mapSize.x !== shadowWidth || light.shadow.mapSize.y !== shadowHeight) {
        light.shadow.mapSize.set(shadowWidth, shadowHeight);
        light.shadow.map?.dispose();
        light.shadow.map = null;
      }

      if (sheet && sheetMaterial) {
        const angle = frame.flat * Math.PI / 2;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        // The support of the cube along this normal keeps the sheet outside
        // the object for the entire top-to-front transition.
        const support = (c + s) * 0.5 + 0.05 * (1 - frame.flat) + 0.003 * frame.flat;
        sheet.position.set(0, c * support, s * support);
        sheet.rotation.x = -(1 - frame.flat) * Math.PI / 2;
        sheet.scale.x = 1 + (1 / 1.4 - 1) * frame.flat;
        object.updateMatrixWorld(true);
        inverseCube.copy(object.matrixWorld).invert();
        cameraCube.copy(frame.camera.position).applyMatrix4(inverseCube);
        sheetMaterial.uniforms.uWorldToCube.value.copy(inverseCube);
        sheetMaterial.uniforms.uCubeNormalWorld.value.getNormalMatrix(object.matrixWorld);
        sheetMaterial.uniforms.uCameraCube.value.copy(cameraCube);
        sheetMaterial.uniforms.uGrainFrame.value = Math.floor(frame.time * 12);
        sheetMaterial.uniforms.uDpr.value = frame.dpr;
      }
    },
    dispose() {
      marks.dispose();
      material.dispose();
      outlineMaterial.dispose();
      groundMaterial.dispose();
      groundGeometry.dispose();
      sheetMaterial?.dispose();
      sheetGeometry?.dispose();
      light.shadow.dispose();
    },
  };
}
