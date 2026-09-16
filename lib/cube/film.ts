import * as THREE from "three";

/* The film on the paper (cube-v2/brief.md 9.3 step 2, round 2). The
   cube rolls onto a drawn frame; the camera cranes down; the top face
   lights up with the brand film and the film spreads out to the drawn
   frame, so the framed panel at the hold is the frame itself and the
   face is its centre. One image, two surfaces: the paper decal and the
   cube's upper faces both sample the SAME film through this block, and
   both reproject their fragment along the view ray onto the paper
   plane before looking it up, so the face is optically flush with the
   picture (no zoom step at the face's edge, no parallax seam) from any
   camera angle. Duotone-to-colour is HomeCanvas's FilmPane math on the
   same DEVELOP timing. Raw-shader pipeline: token colours are
   NoColorSpace (r3f-shader-gotchas). */

const raw = (hex: number) => new THREE.Color().setHex(hex, THREE.NoColorSpace);
export const FILM_INK_DEEP = raw(0x0a2a73);
export const FILM_INK_LIGHT = raw(0x6e9bff);

/** Uniform objects shared by reference between the decal and the cube
    material, so one write per frame reaches both. uFilmMaskHalf is
    per material (the cube's mask always covers its own footprint). */
export type FilmUniforms = {
  uFilmTex: { value: THREE.Texture | null };
  uFilmPoster: { value: THREE.Texture | null };
  uFilmTexMix: { value: number };
  uFilmCover: { value: THREE.Vector2 };
  uFilmMediaScale: { value: number };
  uFilmInk: { value: number };
  uFilmAlpha: { value: number };
  /** centre.x, centre.z, cos(heading), sin(heading) */
  uFilmFrame: { value: THREE.Vector4 };
  /** half size of the drawn frame: across the road, along it */
  uFilmHalf: { value: THREE.Vector2 };
  uFilmRadius: { value: number };
  uFilmPaperY: { value: number };
  uFilmInkDeep: { value: THREE.Color };
  uFilmInkLight: { value: THREE.Color };
};

export function createFilmUniforms(paperY: number): FilmUniforms {
  return {
    uFilmTex: { value: null },
    uFilmPoster: { value: null },
    uFilmTexMix: { value: 0 },
    uFilmCover: { value: new THREE.Vector2(1, 1) },
    uFilmMediaScale: { value: 1.12 },
    uFilmInk: { value: 1 },
    uFilmAlpha: { value: 0 },
    uFilmFrame: { value: new THREE.Vector4(0, 0, 1, 0) },
    uFilmHalf: { value: new THREE.Vector2(1, 1) },
    uFilmRadius: { value: 0.05 },
    uFilmPaperY: { value: paperY },
    uFilmInkDeep: { value: FILM_INK_DEEP.clone() },
    uFilmInkLight: { value: FILM_INK_LIGHT.clone() },
  };
}

/** GLSL for a fragment shader: declares the shared uniforms plus the
    per-material uFilmMaskHalf, and filmSample(world) -> rgba. */
export const filmGlsl = /* glsl */ `
  uniform sampler2D uFilmTex;
  uniform sampler2D uFilmPoster;
  uniform float uFilmTexMix;
  uniform vec2 uFilmCover;
  uniform float uFilmMediaScale;
  uniform float uFilmInk;
  uniform float uFilmAlpha;
  uniform vec4 uFilmFrame;
  uniform vec2 uFilmHalf;
  uniform vec2 uFilmMaskHalf;
  uniform float uFilmRadius;
  uniform float uFilmPaperY;
  uniform vec3 uFilmInkDeep;
  uniform vec3 uFilmInkLight;

  /* frame-local coordinates of the point where the view ray through
     this fragment meets the paper plane: x across the road (screen
     right at the top-down), y along it (screen up) */
  vec2 filmLocal(vec3 world) {
    vec3 cam = cameraPosition;
    float denom = world.y - cam.y;
    float t = abs(denom) < 1e-5 ? 1.0 : (uFilmPaperY - cam.y) / denom;
    vec3 hit = cam + (world - cam) * t;
    vec2 d = hit.xz - uFilmFrame.xy;
    float c = uFilmFrame.z;
    float s = uFilmFrame.w;
    return vec2(d.x * c - d.y * s, -d.x * s - d.y * c);
  }

  float filmRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  vec4 filmSample(vec3 world) {
    vec2 l = filmLocal(world);
    vec2 uv = l / (2.0 * uFilmHalf);
    uv = uv / uFilmMediaScale * uFilmCover + 0.5;
    vec3 col = mix(texture2D(uFilmPoster, uv).rgb, texture2D(uFilmTex, uv).rgb, uFilmTexMix);
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 ink = mix(uFilmInkDeep, uFilmInkLight, smoothstep(0.0, 0.62, lum));
    col = mix(col, ink, uFilmInk);
    float r = min(uFilmRadius, min(uFilmMaskHalf.x, uFilmMaskHalf.y));
    float sdf = filmRoundBox(l, uFilmMaskHalf, r);
    float aa = max(fwidth(sdf), 1e-4) * 1.2;
    float mask = 1.0 - smoothstep(-aa, aa, sdf);
    return vec4(col, mask * uFilmAlpha);
  }
`;

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

const decalVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const decalFragment = /* glsl */ `
  uniform float uGrainFrame;
  uniform float uDpr;
  varying vec3 vWorld;
  ${filmGlsl}
  ${grain}
  void main() {
    vec4 film = filmSample(vWorld);
    if (film.a < 0.002) discard;
    vec3 color = mix(film.rgb, uFilmInkDeep, paperGrain(gl_FragCoord.xy / uDpr, uGrainFrame) * 0.04);
    gl_FragColor = vec4(color, film.a);
  }
`;

/** The film decal lying on the paper inside the drawn frame. Sits a
    hair above the road ink; polygon offset keeps it in front of the
    road's own offset. Transparent, so it composites over the blue
    shadow inside the frame as the film spreads. */
export function createFilmDecalMaterial(shared: FilmUniforms): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: decalVertex,
    fragmentShader: decalFragment,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
    uniforms: {
      ...shared,
      uFilmMaskHalf: { value: new THREE.Vector2(0.5, 0.5) },
      uGrainFrame: { value: 0 },
      uDpr: { value: 1 },
    },
  });
}

/* cover-fit scale for a texture on a surface of the given aspect
   (HomeCanvas coverScale, copied) */
export function coverScale(out: THREE.Vector2, texW: number, texH: number, aspect: number) {
  const texA = texW / texH;
  out.set(Math.min(1, aspect / texA), Math.min(1, texA / aspect));
}
