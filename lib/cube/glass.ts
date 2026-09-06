import * as THREE from "three";
import type { CubeLook, LookFrame } from "./types";

const rawColor = (hex: number) => new THREE.Color().setHex(hex, THREE.NoColorSpace);

const screenVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const volumeFragment = /* glsl */ `
  precision highp float;
  uniform mat4 uInverseViewProjection;
  uniform mat4 uInverseModel;
  uniform vec3 uCamera;
  uniform vec3 uBlue;
  uniform vec3 uPaper;
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x),
          mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
          mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
  }

  float fbm(vec3 p) {
    float density = 0.57 * noise(p);
    p = p * 2.03 + vec3(7.1, 3.4, 5.7);
    density += 0.28 * noise(p);
    p = p * 2.01 + vec3(1.3, 8.2, 2.8);
    return density + 0.15 * noise(p);
  }

  float roundedCube(vec3 p) {
    vec3 q = abs(p) - vec3(0.44);
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - 0.06;
  }

  void main() {
    vec4 worldFar = uInverseViewProjection * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
    worldFar /= worldFar.w;
    vec3 worldDirection = normalize(worldFar.xyz - uCamera);
    vec3 origin = (uInverseModel * vec4(uCamera, 1.0)).xyz;
    // Keeping the local direction unnormalized makes t a world-space distance.
    // Optical density then diminishes naturally as the cube becomes a thin pane.
    vec3 direction = (uInverseModel * vec4(worldDirection, 0.0)).xyz;
    vec3 safeDirection = sign(direction + vec3(0.0000001)) * max(abs(direction), vec3(0.00001));
    vec3 nearPlane = (-vec3(0.5) - origin) / safeDirection;
    vec3 farPlane = (vec3(0.5) - origin) / safeDirection;
    vec3 entry = min(nearPlane, farPlane);
    vec3 leave = max(nearPlane, farPlane);
    float start = max(max(entry.x, max(entry.y, entry.z)), 0.0);
    float end = min(leave.x, min(leave.y, leave.z));
    if (end <= start) { gl_FragColor = vec4(0.0); return; }

    float stepLength = (end - start) / 24.0;
    float transmittance = 1.0;
    vec3 scatter = vec3(0.0);
    vec3 drift = vec3(uTime * 0.075, -uTime * 0.052, uTime * 0.028);
    // Fixed midpoint samples avoid temporal dithering and the old pixel-noise core.
    for (int stepIndex = 0; stepIndex < 24; stepIndex++) {
      vec3 p = origin + direction * (start + (float(stepIndex) + 0.5) * stepLength);
      float boundary = 1.0 - smoothstep(-0.055, -0.012, roundedCube(p));
      float envelope = 1.0 - smoothstep(0.12, 0.48, length(p * vec3(1.05, 0.88, 1.05)));
      float cloud = smoothstep(0.24, 0.72, fbm(p * 6.0 + drift));
      float density = boundary * envelope * cloud * 11.0;
      float absorbed = 1.0 - exp(-density * stepLength);
      float lighting = clamp(0.13 + (p.y + 0.4) * 0.22 + cloud * 0.08, 0.08, 0.39);
      vec3 tint = mix(uBlue, uPaper, lighting);
      scatter += transmittance * absorbed * tint;
      transmittance *= 1.0 - absorbed;
    }
    float alpha = 1.0 - transmittance;
    gl_FragColor = vec4(scatter / max(alpha, 0.0001), alpha);
  }
`;

const compositeVertex = /* glsl */ `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const compositeFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uVolume;
  uniform vec2 uViewport;
  void main() {
    vec4 volume = texture2D(uVolume, gl_FragCoord.xy / uViewport);
    gl_FragColor = volume;
  }
`;

const contactFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uBlue;
  uniform float uFlat;
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - 0.5) * vec2(3.8 - uFlat * 0.7, 4.6);
    float broad = exp(-dot(p, p) * 3.2) * 0.13;
    float contact = exp(-dot(p * vec2(1.0, 1.9), p * vec2(1.0, 1.9)) * 7.0) * 0.22;
    gl_FragColor = vec4(uBlue, (broad + contact) * (1.0 - uFlat * 0.58));
  }
`;

/** Dependency-free physical transmission with a half-resolution volume pass. */
export function createGlassLook(geometry: THREE.BufferGeometry): CubeLook {
  const object = new THREE.Group();
  object.name = "glass-fixed";

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xf5f6f8,
    transmission: 1,
    roughness: 0.12,
    thickness: 0.8,
    ior: 1.4,
    dispersion: 0.03,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    side: THREE.DoubleSide,
    envMapIntensity: 0,
    attenuationColor: 0xf5f6f8,
    attenuationDistance: 3,
  });
  // r185 performs a backside transmission pass for DoubleSide physical materials.
  // Replace only the sampling function, retaining Three's physical lighting,
  // attenuation, Fresnel, and native transmission-buffer lifecycle.
  glass.onBeforeCompile = (shader) => {
    shader.uniforms.cubeChromaticAberration = { value: 0.03 };
    let transmission = THREE.ShaderChunk.transmission_pars_fragment;
    transmission = transmission.replace(
      "uniform float transmission;",
      "uniform float transmission;\n uniform float cubeChromaticAberration;",
    );
    transmission = transmission.replace(
      "float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;",
      "float halfSpread = ( ior - 1.0 ) * cubeChromaticAberration;",
    );
    transmission = transmission.replace(
      /vec4 getTransmissionSample\([\s\S]*?\n\t\}/,
      /* glsl */ `vec4 getTransmissionSample(const in vec2 fragCoord, const in float roughness, const in float ior) {
        float lod = log2(transmissionSamplerSize.x) * applyIorToRoughness(roughness, ior);
        vec2 radius = vec2(0.6 + roughness * 9.0) / transmissionSamplerSize;
        vec4 result = vec4(0.0);
        for (int sampleIndex = 0; sampleIndex < 8; sampleIndex++) {
          float angle = float(sampleIndex) * 2.39996323;
          float ring = sqrt((float(sampleIndex) + 0.5) / 8.0);
          result += textureLod(transmissionSamplerMap, fragCoord + vec2(cos(angle), sin(angle)) * radius * ring, lod);
        }
        return result / 8.0;
      }`,
    );
    // The stock dispersion branch leaves this alpha accumulator uninitialized.
    transmission = transmission.replace("vec4 transmittedLight;", "vec4 transmittedLight = vec4(0.0);");
    shader.fragmentShader = shader.fragmentShader.replace("#include <transmission_pars_fragment>", transmission);
  };
  glass.customProgramCacheKey = () => "cube-glass-eight-samples-ca-003-v1";

  const shell = new THREE.Mesh(geometry, glass);
  shell.name = "glass-shell";
  object.add(shell);

  const volumeTarget = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: false,
    stencilBuffer: false,
    generateMipmaps: false,
    type: THREE.UnsignedByteType,
  });
  volumeTarget.texture.name = "cube-volume-half-resolution";
  volumeTarget.texture.colorSpace = THREE.NoColorSpace;

  const inverseModel = new THREE.Matrix4();
  const inverseViewProjection = new THREE.Matrix4();
  const cameraPosition = new THREE.Vector3();
  const volumeMaterial = new THREE.ShaderMaterial({
    vertexShader: screenVertex,
    fragmentShader: volumeFragment,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uInverseViewProjection: { value: inverseViewProjection },
      uInverseModel: { value: inverseModel },
      uCamera: { value: cameraPosition },
      uBlue: { value: rawColor(0x0657f9) },
      uPaper: { value: rawColor(0xf5f6f8) },
      uTime: { value: 0 },
    },
  });
  const quadGeometry = new THREE.PlaneGeometry(2, 2);
  const volumeQuad = new THREE.Mesh(quadGeometry, volumeMaterial);
  volumeQuad.frustumCulled = false;
  const volumeScene = new THREE.Scene();
  volumeScene.add(volumeQuad);
  const volumeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const compositeMaterial = new THREE.ShaderMaterial({
    vertexShader: compositeVertex,
    fragmentShader: compositeFragment,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uVolume: { value: volumeTarget.texture },
      uViewport: { value: new THREE.Vector2(1, 1) },
    },
  });
  // The actual rounded geometry clips the screen-space composite, including
  // edge-on views and mid-morph silhouettes. Transmission writes depth, so this
  // transparent partner deliberately composites after the physical shell.
  const composite = new THREE.Mesh(geometry, compositeMaterial);
  composite.name = "rounded-silhouette-volume-composite";
  composite.renderOrder = 20;
  composite.frustumCulled = false;
  object.add(composite);

  const contactGeometry = new THREE.PlaneGeometry(3.5, 3.5);
  const contactMaterial = new THREE.ShaderMaterial({
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: contactFragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uBlue: { value: rawColor(0x0657f9) },
      uFlat: { value: 0 },
    },
  });
  const ground = new THREE.Mesh(contactGeometry, contactMaterial);
  ground.name = "soft-contact-shadow";
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.498;

  const key = new THREE.DirectionalLight(0xffffff, 4.2);
  key.position.set(-3, 5, 4);
  const fill = new THREE.DirectionalLight(0xffffff, 2.1);
  fill.position.set(3, 1, -2);

  const drawingBuffer = new THREE.Vector2();
  const previousClear = new THREE.Color();
  const projectedCorner = new THREE.Vector3();

  return {
    object,
    ground,
    lights: [key, fill],
    update(frame: LookFrame) {
      volumeMaterial.uniforms.uTime.value = frame.time;
      contactMaterial.uniforms.uFlat.value = frame.flat;
    },
    beforeRender(renderer, _scene, camera) {
      renderer.getDrawingBufferSize(drawingBuffer);
      const width = Math.max(1, Math.floor(drawingBuffer.x / 2));
      const height = Math.max(1, Math.floor(drawingBuffer.y / 2));
      if (volumeTarget.width !== width || volumeTarget.height !== height) {
        volumeTarget.setSize(width, height);
      }
      compositeMaterial.uniforms.uViewport.value.copy(drawingBuffer);
      object.updateWorldMatrix(true, true);
      camera.updateMatrixWorld();
      inverseModel.copy(object.matrixWorld).invert();
      inverseViewProjection.multiplyMatrices(camera.matrixWorld, camera.projectionMatrixInverse);
      camera.getWorldPosition(cameraPosition);

      // Limit the 24-step pass to the cube's projected screen rectangle.
      let minX = 1;
      let minY = 1;
      let maxX = -1;
      let maxY = -1;
      for (let corner = 0; corner < 8; corner++) {
        projectedCorner.set(corner & 1 ? 0.5 : -0.5, corner & 2 ? 0.5 : -0.5, corner & 4 ? 0.5 : -0.5);
        projectedCorner.applyMatrix4(object.matrixWorld).project(camera);
        minX = Math.min(minX, projectedCorner.x);
        maxX = Math.max(maxX, projectedCorner.x);
        minY = Math.min(minY, projectedCorner.y);
        maxY = Math.max(maxY, projectedCorner.y);
      }
      const left = Math.max(0, Math.floor((minX + 1) * width / 2) - 2);
      const bottom = Math.max(0, Math.floor((minY + 1) * height / 2) - 2);
      const right = Math.min(width, Math.ceil((maxX + 1) * width / 2) + 2);
      const top = Math.min(height, Math.ceil((maxY + 1) * height / 2) + 2);

      const oldTarget = renderer.getRenderTarget();
      const oldCubeFace = renderer.getActiveCubeFace();
      const oldMipLevel = renderer.getActiveMipmapLevel();
      const oldAutoClear = renderer.autoClear;
      const oldClearAlpha = renderer.getClearAlpha();
      renderer.getClearColor(previousClear);
      try {
        // Target viewport/scissor values use physical pixels. Renderer setters
        // use CSS pixels even with a render target bound, so avoid DPR scaling
        // this already half-resolution pass a second time.
        volumeTarget.viewport.set(0, 0, width, height);
        volumeTarget.scissorTest = false;
        renderer.setRenderTarget(volumeTarget);
        renderer.setClearColor(0x000000, 0);
        renderer.clear(true, false, false);
        renderer.autoClear = false;
        volumeTarget.scissor.set(left, bottom, Math.max(0, right - left), Math.max(0, top - bottom));
        volumeTarget.scissorTest = true;
        renderer.setRenderTarget(volumeTarget);
        if (right > left && top > bottom) renderer.render(volumeScene, volumeCamera);
      } finally {
        renderer.setRenderTarget(oldTarget, oldCubeFace, oldMipLevel);
        renderer.setClearColor(previousClear, oldClearAlpha);
        renderer.autoClear = oldAutoClear;
      }
    },
    dispose() {
      glass.dispose();
      volumeMaterial.dispose();
      compositeMaterial.dispose();
      contactMaterial.dispose();
      contactGeometry.dispose();
      quadGeometry.dispose();
      volumeTarget.dispose();
      key.dispose();
      fill.dispose();
      object.clear();
      volumeScene.clear();
    },
  };
}
