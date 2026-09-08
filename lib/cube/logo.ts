import * as THREE from "three";
import { GLYPH_HOLE, GLYPH_OUTER } from "@/lib/cube/glyphContours";
import type { CubeLook, LookFrame } from "@/lib/cube/types";

/* Holding mark: the img2threejs-showcase badge. Solid brand-blue plaque
   with the traced B raised on the face (not punched through). Glossy
   clearcoat plaque, satin white glyph. No ground shadow. */

const PLAQUE = 1;
const RADIUS = 47.14 / 255;
const PLAQUE_DEPTH = 0.12;
const GLYPH_DEPTH = 0.03;
const GLYPH_INSET = 0.05;
const BRAND = "#0657F9";

const HUE_STOPS = [0x0657f9, 0x7a5cff, 0x00c2ff].map(
  (hex) => new THREE.Color().setHex(hex, THREE.SRGBColorSpace),
);
const tmpHue = new THREE.Color();

export type LogoLook = CubeLook & {
  glyphMaterial: THREE.MeshPhysicalMaterial;
};

function roundedRect(cx: number, cy: number, w: number, h: number, r: number) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  const s = new THREE.Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  s.closePath();
  return s;
}

function fitToPlaque(points: [number, number][]): [number, number][] {
  const xs = GLYPH_OUTER.map((p) => p[0]);
  const ys = GLYPH_OUTER.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const cx = (minX + maxX) / 2;
  const scale = (PLAQUE - GLYPH_INSET * 2) / (maxY - minY);
  const top = PLAQUE / 2 - GLYPH_INSET;
  return points.map(([x, y]) => [(x - cx) * scale, (y - maxY) * scale + top]);
}

function fromLoops(outer: [number, number][], hole: [number, number][]) {
  const shape = new THREE.Shape();
  shape.moveTo(outer[0][0], outer[0][1]);
  for (let i = 1; i < outer.length; i++) shape.lineTo(outer[i][0], outer[i][1]);
  shape.closePath();
  const path = new THREE.Path();
  path.moveTo(hole[0][0], hole[0][1]);
  for (let i = 1; i < hole.length; i++) path.lineTo(hole[i][0], hole[i][1]);
  path.closePath();
  shape.holes.push(path);
  return shape;
}

function extrude(shape: THREE.Shape, depth: number) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    steps: 1,
    curveSegments: 24,
  });
  geometry.computeVertexNormals();
  return geometry;
}

function brandColor(hex: string) {
  return new THREE.Color().setStyle(hex, THREE.SRGBColorSpace);
}

function sampleHue(t: number) {
  const scaled = (((t % 1) + 1) % 1) * (HUE_STOPS.length - 1);
  const index = Math.min(HUE_STOPS.length - 2, Math.floor(scaled));
  const mix = scaled - index;
  return tmpHue.copy(HUE_STOPS[index]).lerp(HUE_STOPS[index + 1], mix);
}

export function createLogoLook(): LogoLook {
  const plaqueGeometry = extrude(
    roundedRect(0, 0, PLAQUE, PLAQUE, RADIUS),
    PLAQUE_DEPTH,
  );
  const glyphGeometry = extrude(
    fromLoops(fitToPlaque(GLYPH_OUTER), fitToPlaque(GLYPH_HOLE)),
    GLYPH_DEPTH,
  );

  const plaqueMaterial = new THREE.MeshPhysicalMaterial({
    color: brandColor(BRAND),
    metalness: 0,
    roughness: 0.18,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08,
    envMapIntensity: 0.35,
  });
  const glyphMaterial = new THREE.MeshPhysicalMaterial({
    color: brandColor("#FFFFFF"),
    metalness: 0,
    roughness: 0.35,
    clearcoat: 0.4,
    clearcoatRoughness: 0.15,
    emissive: brandColor(BRAND),
    emissiveIntensity: 0.15,
    envMapIntensity: 0.25,
  });

  const plaque = new THREE.Mesh(plaqueGeometry, plaqueMaterial);
  const glyph = new THREE.Mesh(glyphGeometry, glyphMaterial);
  glyph.position.z = PLAQUE_DEPTH;

  const badge = new THREE.Group();
  badge.add(plaque, glyph);
  badge.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(badge);
  const center = box.getCenter(new THREE.Vector3());
  badge.position.sub(center);

  const object = new THREE.Group();
  object.add(badge);

  const lights = new THREE.Group();
  const hemi = new THREE.HemisphereLight(0xf2f4ff, 0x363b42, 0.7);
  const key = new THREE.DirectionalLight(0xfff4e8, 1.7);
  key.position.set(-4, 6, 5.5);
  const fill = new THREE.DirectionalLight(0xa8c4ff, 0.38);
  fill.position.set(4, 3, 3.5);
  const rim = new THREE.DirectionalLight(0xfff1c4, 0.55);
  rim.position.set(0.5, 4.5, -6);
  lights.add(hemi, key, fill, rim);

  return {
    object,
    ground: new THREE.Group(),
    lights: [lights],
    glyphMaterial,
    update(_frame: LookFrame) {
      const rotationY = object.rotation.y;
      const t = rotationY / (Math.PI * 2);
      const peak = (Math.sin(rotationY * 2) + 1) / 2;
      glyphMaterial.emissive.copy(sampleHue(t));
      glyphMaterial.emissiveIntensity = THREE.MathUtils.lerp(
        0.12,
        0.55,
        peak ** 3,
      );
    },
    dispose() {
      plaqueGeometry.dispose();
      glyphGeometry.dispose();
      plaqueMaterial.dispose();
      glyphMaterial.dispose();
    },
  };
}
