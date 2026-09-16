import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import rough from "roughjs/bin/rough";
import { BLUE } from "./ink";
import { logoGeometries } from "./logo";

/* Procedural props for the hero town (cube-v2/brief.md sections 9
   and 10, rounds 1 and 2). Every builder returns a THREE.Group whose solids
   share ONE two-tone ink material and ONE outline material (the cube's
   own, from lib/cube/ink.ts), so a box, a cone and a cylinder all read
   as the same illustration once the shader is flat. Nothing here is
   loaded; nothing here is a second cube. Ink on the paper (the road,
   footprints, chart lines) is flat geometry ribbons in the brand blue,
   built from a path table with a hand-drawn wobble: crisp at any
   distance where a canvas texture would blur next to the 1 unit cube.
   The one texture is the START label, because it is lettering. */

const BLUE_SRGB = "#0657F9";

type Disposable = { dispose(): void };

export type PropKit = ReturnType<typeof createPropKit>;

/** a storefront whose height scrubs (the massing move) */
export type Storefront = THREE.Group & { setBuild: (t: number) => void };
/** ink on the paper that draws itself */
export type Drawn = THREE.Group & { setDraw: (t: number) => void };

/* Seeded value noise (sum of sines) so a wobble is stable across loads. */
function wobble(t: number, seed: number, amp: number) {
  return (
    (Math.sin(t * 9.1 + seed * 1.7) * 0.5 +
      Math.sin(t * 23.7 + seed * 3.1) * 0.3 +
      Math.sin(t * 51.3 + seed * 5.9) * 0.2) *
    amp
  );
}

/* Ribbon accumulator. `prog`, when present, records each point's
   position along its stroke (0..1 over all passes) as a vertex
   attribute, so a stroke can draw itself on scroll. */
type Ribbon = { pos: number[]; idx: number[]; prog?: number[] };

/* A flat ribbon on the ground from an xz polyline: the ink stroke
   primitive. Appends into shared arrays so a road is one draw call. */
function appendRibbon(
  out: Ribbon,
  pts: THREE.Vector2[],
  width: number | number[],
  prog?: number[],
) {
  const base = out.pos.length / 3;
  const n = pts.length;
  if (n < 2) return;
  const dir = new THREE.Vector2();
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    dir.subVectors(b, a).normalize();
    const w = typeof width === "number" ? width : width[i];
    const nx = -dir.y * w * 0.5;
    const nz = dir.x * w * 0.5;
    out.pos.push(pts[i].x + nx, 0, pts[i].y + nz, pts[i].x - nx, 0, pts[i].y - nz);
    if (out.prog) {
      const t = prog ? prog[i] : 0;
      out.prog.push(t, t);
    }
    if (i < n - 1) {
      const k = base + i * 2;
      out.idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
}

function ribbonGeometry(out: Ribbon) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(out.pos, 3));
  if (out.prog) g.setAttribute("prog", new THREE.Float32BufferAttribute(out.prog, 1));
  g.setIndex(out.idx);
  return g;
}

type StrokeOpts = {
  /** 2 draws RoughAnnotation's double stroke, 1 a single pen line */
  passes?: number;
  from?: number;
  to?: number;
  /** world width grows by this per unit of -z, so a line drawn to the
      horizon keeps about two pixels under the rest camera */
  taper?: number;
};

/* One hand-drawn stroke along a curve. */
function strokeCurve(
  out: Ribbon,
  curve: THREE.Curve<THREE.Vector3>,
  width: number,
  seed: number,
  amp: number,
  { passes = 2, from = 0, to = 1, taper = 0 }: StrokeOpts = {},
) {
  const length = curve.getLength() * (to - from);
  const steps = Math.max(6, Math.ceil(length / 0.06));
  const normal = new THREE.Vector2();
  const tangent = new THREE.Vector3();
  for (let pass = 0; pass < passes; pass++) {
    const pts: THREE.Vector2[] = [];
    const widths: number[] = [];
    const prog: number[] = [];
    for (let i = 0; i <= steps; i++) {
      const u = from + ((to - from) * i) / steps;
      const p = curve.getPointAt(u);
      curve.getTangentAt(u, tangent);
      normal.set(-tangent.z, tangent.x).normalize();
      const w = wobble(u * length, seed + pass * 7.3, amp) + (pass === 1 ? width * 0.9 : 0);
      pts.push(new THREE.Vector2(p.x + normal.x * w, p.z + normal.y * w));
      widths.push((pass === 0 ? width : width * 0.6) * (1 + taper * Math.max(0, -p.z)));
      /* the second pass draws after the first, like a pen going round again */
      prog.push((pass + i / steps) / passes);
    }
    appendRibbon(out, pts, widths, prog);
  }
}

/* A closed rounded-rectangle path on the ground (local xz, centred),
   for strokes that draw themselves: the film station's frame. */
class RoundedLoop extends THREE.Curve<THREE.Vector3> {
  private pts: THREE.Vector3[] = [];
  constructor(hx: number, hz: number, r: number) {
    super();
    const rr = Math.min(r, hx, hz);
    const corner = (cx: number, cz: number, a0: number) => {
      for (let i = 0; i <= 8; i++) {
        const a = a0 + (i / 8) * (Math.PI / 2);
        this.pts.push(new THREE.Vector3(cx + Math.cos(a) * rr, 0, cz + Math.sin(a) * rr));
      }
    };
    /* start mid-way along the near edge (toward +z), go clockwise seen from above */
    this.pts.push(new THREE.Vector3(0, 0, hz));
    corner(-hx + rr, hz - rr, Math.PI / 2);
    corner(-hx + rr, -hz + rr, Math.PI);
    corner(hx - rr, -hz + rr, Math.PI * 1.5);
    corner(hx - rr, hz - rr, 0);
    this.pts.push(new THREE.Vector3(0, 0, hz));
    /* cumulative lengths for an arc-length parameter */
    let acc = 0;
    this.cum = [0];
    for (let i = 1; i < this.pts.length; i++) {
      acc += this.pts[i].distanceTo(this.pts[i - 1]);
      this.cum.push(acc);
    }
    this.total = acc;
  }
  private cum: number[] = [];
  private total = 1;
  getPoint(t: number, target = new THREE.Vector3()) {
    const s = THREE.MathUtils.clamp(t, 0, 1) * this.total;
    let i = 1;
    while (i < this.cum.length - 1 && this.cum[i] < s) i++;
    const a = this.pts[i - 1];
    const b = this.pts[i];
    const span = Math.max(1e-6, this.cum[i] - this.cum[i - 1]);
    return target.lerpVectors(a, b, (s - this.cum[i - 1]) / span);
  }
}

/* A hand-drawn closed rectangle on the ground (a plan footprint). */
function strokeRect(
  out: { pos: number[]; idx: number[] },
  cx: number,
  cz: number,
  w: number,
  d: number,
  width: number,
  seed: number,
) {
  const corners = [
    new THREE.Vector3(cx - w / 2, 0, cz - d / 2),
    new THREE.Vector3(cx + w / 2, 0, cz - d / 2),
    new THREE.Vector3(cx + w / 2, 0, cz + d / 2),
    new THREE.Vector3(cx - w / 2, 0, cz + d / 2),
    new THREE.Vector3(cx - w / 2, 0, cz - d / 2),
  ];
  for (let e = 0; e < 4; e++) {
    /* each edge overshoots its corner a little, the way a pen does */
    const a = corners[e].clone();
    const b = corners[e + 1].clone();
    const dir = b.clone().sub(a).normalize();
    a.addScaledVector(dir, -0.03);
    b.addScaledVector(dir, 0.035);
    strokeCurve(out, new THREE.LineCurve3(a, b), width, seed + e * 2.3, 0.006, { passes: 1 });
  }
}

/* Inverted-hull geometry: normals that stay continuous at corners so
   the screen-constant outline never opens at a box edge. Boxes get
   the corner diagonal (length 1.4 so the edge lines stay 1.5px: the
   shader scales its offset by normal length); curved solids get
   merged, area-weighted normals. */
function hullOf(geo: THREE.BufferGeometry, box: boolean): THREE.BufferGeometry {
  if (box) {
    const g = geo.clone();
    const p = g.attributes.position;
    const n = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) {
      const v = new THREE.Vector3(Math.sign(p.getX(i)), Math.sign(p.getY(i)), Math.sign(p.getZ(i)));
      v.normalize().multiplyScalar(1.4);
      n.set([v.x, v.y, v.z], i * 3);
    }
    g.setAttribute("normal", new THREE.BufferAttribute(n, 3));
    return g;
  }
  const g = geo.clone();
  g.deleteAttribute("normal");
  g.deleteAttribute("uv");
  const merged = mergeVertices(g, 1e-4);
  merged.computeVertexNormals();
  g.dispose();
  return merged;
}

/* Flat-shaded copy (low-poly illustration read on cones and drums). */
function faceted(geo: THREE.BufferGeometry) {
  const g = geo.toNonIndexed();
  g.computeVertexNormals();
  geo.dispose();
  return g;
}

export function createPropKit(
  ink: THREE.ShaderMaterial,
  outline: THREE.ShaderMaterial,
  groundY: number,
) {
  const trash: Disposable[] = [];
  const keep = <T extends Disposable>(x: T) => (trash.push(x), x);

  /* ink on the paper: a managed-pipeline material, so the normal sRGB
     constructor (the raw-shader NoColorSpace trap does not apply) */
  const inkFlat = keep(
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(BLUE_SRGB),
      side: THREE.DoubleSide,
      toneMapped: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    }),
  );

  /* contact shade: one soft rounded-rect texture, tinted blue at 18
     percent, scaled per solid; every base gets one so nothing floats */
  const shadeTexture = keep(
    (() => {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("The contact shade needs a 2D canvas.");
      ctx.filter = "blur(22px)";
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(58, 58, size - 116, size - 116, 26);
      ctx.fill();
      const t = new THREE.CanvasTexture(canvas);
      t.colorSpace = THREE.NoColorSpace;
      return t;
    })(),
  );
  const shadeMaterial = keep(
    new THREE.MeshBasicMaterial({
      map: shadeTexture,
      color: new THREE.Color(BLUE_SRGB),
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  const unitPlane = keep(new THREE.PlaneGeometry(1, 1));

  /* ink that draws itself: raw pipeline (NoColorSpace blue), a per-
     vertex stroke position against uDraw */
  const drawnMaterial = keep(
    new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `
        attribute float prog;
        varying float vProg;
        void main() {
          vProg = prog;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uDraw;
        varying float vProg;
        void main() {
          if (vProg > uDraw) discard;
          gl_FragColor = vec4(uColor, 1.0);
        }
      `,
      uniforms: { uColor: { value: BLUE.clone() }, uDraw: { value: 0 } },
      side: THREE.DoubleSide,
      toneMapped: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
    }),
  );

  function contactShade(w: number, d: number, x = 0, z = 0) {
    const m = new THREE.Mesh(unitPlane, shadeMaterial);
    m.rotation.x = -Math.PI / 2;
    m.scale.set(w + 0.34, d + 0.34, 1);
    m.position.set(x, 0.003, z);
    m.renderOrder = 0;
    return m;
  }

  /* a solid = ink mesh + hull mesh; local origin at the base */
  function solid(geo: THREE.BufferGeometry, box: boolean) {
    keep(geo);
    const hull = keep(hullOf(geo, box));
    const g = new THREE.Group();
    const mesh = new THREE.Mesh(geo, ink);
    mesh.castShadow = true;
    mesh.renderOrder = 1;
    const edge = new THREE.Mesh(hull, outline);
    g.add(mesh, edge);
    return g;
  }
  const box = (w: number, h: number, d: number) => solid(new THREE.BoxGeometry(w, h, d), true);
  const at = (o: THREE.Object3D, x: number, y: number, z: number) => (o.position.set(x, y, z), o);

  /* ---- the road ------------------------------------------------- */

  /** Two hand-drawn edge strokes and a dashed center line from a path
      table (xz waypoints, world units), Catmull-Rom between them. */
  function road(points: [number, number][], width = 1.3) {
    const curve = new THREE.CatmullRomCurve3(
      points.map(([x, z]) => new THREE.Vector3(x, 0, z)),
      false,
      "centripetal",
    );
    const out = { pos: [] as number[], idx: [] as number[] };
    const length = curve.getLength();
    /* edges: offset the centerline, then stroke each with its own wobble */
    for (const side of [-1, 1]) {
      const pts: THREE.Vector3[] = [];
      const steps = Math.ceil(length / 0.25);
      const tangent = new THREE.Vector3();
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const p = curve.getPointAt(u);
        curve.getTangentAt(u, tangent);
        pts.push(new THREE.Vector3(p.x - tangent.z * side * width * 0.5, 0, p.z + tangent.x * side * width * 0.5));
      }
      strokeCurve(out, new THREE.CatmullRomCurve3(pts, false, "centripetal"), 0.017, side * 3 + 11, 0.008, {
        passes: 1,
        taper: 0.06,
      });
    }
    /* center dashes, a pen lifted every stretch (none on a short approach) */
    const dash = 0.42;
    const period = 0.95;
    for (let s = 0.7; length > 2 && s + dash < length; s += period) {
      strokeCurve(out, curve, 0.013, s * 0.37, 0.005, {
        passes: 1,
        from: s / length,
        to: (s + dash) / length,
        taper: 0.06,
      });
    }
    const g = new THREE.Group();
    const mesh = new THREE.Mesh(keep(ribbonGeometry(out)), inkFlat);
    mesh.position.y = 0.004;
    mesh.renderOrder = 0;
    g.add(mesh);
    g.position.y = groundY;
    return g;
  }

  /** The START tick: a hand-drawn line across the road plus lettering
      in the site's accent face, laid flat beside it. `heading` is the
      road direction at the tick, radians from -z. */
  function startTick(x: number, z: number, heading: number, roadWidth = 1.3) {
    const g = new THREE.Group();
    const out = { pos: [] as number[], idx: [] as number[] };
    const half = roadWidth * 0.38;
    strokeCurve(
      out,
      new THREE.LineCurve3(new THREE.Vector3(-half, 0, 0), new THREE.Vector3(half, 0, 0)),
      0.03,
      41,
      0.012,
    );
    const tick = new THREE.Mesh(keep(ribbonGeometry(out)), inkFlat);
    tick.position.y = 0.0045;
    g.add(tick);

    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size / 2;
    const texture = keep(new THREE.CanvasTexture(canvas));
    texture.colorSpace = THREE.NoColorSpace;
    texture.anisotropy = 8;
    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size / 2);
      const family = getComputedStyle(document.documentElement).getPropertyValue("--a").trim() || "cursive";
      ctx.font = `700 150px ${family}`;
      ctx.fillStyle = "#FFFFFF";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.save();
      ctx.translate(size / 2, size / 4);
      ctx.rotate(-0.04);
      ctx.fillText("START", 0, 0);
      ctx.restore();
      texture.needsUpdate = true;
    };
    draw();
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(draw).catch(() => undefined);
    }
    const labelMaterial = keep(
      new THREE.MeshBasicMaterial({
        map: texture,
        color: new THREE.Color(BLUE_SRGB),
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    const label = new THREE.Mesh(unitPlane, labelMaterial);
    label.rotation.x = -Math.PI / 2;
    /* lettered on the paper just before the line, pre-stretched along
       the road so it survives the camera's 20 degree pitch */
    label.scale.set(0.62, 0.7, 1);
    label.position.set(-0.12, 0.0045, 0.5);
    label.renderOrder = 0;
    g.add(label);

    g.position.set(x, groundY, z);
    g.rotation.y = heading;
    return g;
  }

  /** The film station's frame: a hand-drawn rounded rectangle on the
      paper (RoughAnnotation's double pass), centred at the origin,
      `hx` across the road and `hz` along it, that draws itself with
      setDraw(0..1) and un-draws on the way back. */
  function frame(hx: number, hz: number, r: number): Drawn {
    const out: Ribbon = { pos: [], idx: [], prog: [] };
    strokeCurve(out, new RoundedLoop(hx, hz, r), 0.012, 29, 0.006, { passes: 2 });
    const material = keep(drawnMaterial.clone());
    const mesh = new THREE.Mesh(keep(ribbonGeometry(out)), material);
    mesh.position.y = 0.0045;
    mesh.renderOrder = 0;
    const g = new THREE.Group() as Drawn;
    g.add(mesh);
    g.position.y = groundY;
    g.setDraw = (t: number) => {
      material.uniforms.uDraw.value = t;
      g.visible = t > 0.001;
    };
    g.setDraw(0);
    return g;
  }

  /* ---- the cast ------------------------------------------------- */

  type StorefrontOpts = {
    w: number;
    h: number;
    d: number;
    awning: number;
    /** 0..1 of full height; below 1 the shell stands open, mid-build */
    build?: number;
    seed?: number;
  };

  /** A shell of walls with a step, a door recess, a display window, an
      awning on struts, and, once topped out, a roof, a parapet and a
      sign board: illoca's massing move. `build` is the height fraction
      at rest; setBuild(t) scrubs it (the walls rise from the plan, the
      awning and the top pop in with a small overshoot). */
  function storefront({ w, h, d, awning, build = 1, seed = 1 }: StorefrontOpts): Storefront {
    const g = new THREE.Group() as Storefront;
    const rd = Math.min(0.14, d * 0.3);
    const doorW = THREE.MathUtils.clamp(w * 0.22, 0.3, 0.44);
    const doorH = Math.min(0.66, h * 0.5);
    const dx = -w * 0.2;
    const frontZ = d / 2 - rd / 2;
    const t = 0.07;

    /* the shell: back and side walls plus the two front piers, full
       height, scaled about the plan as the building rises */
    const shell = new THREE.Group();
    shell.add(at(box(w, h, t), 0, h / 2, -d / 2 + t / 2));
    shell.add(at(box(t, h, d - rd - t), -w / 2 + t / 2, h / 2, (t - rd) / 2));
    shell.add(at(box(t, h, d - rd - t), w / 2 - t / 2, h / 2, (t - rd) / 2));
    const wl = dx - doorW / 2 + w / 2;
    const wr = w / 2 - (dx + doorW / 2);
    shell.add(at(box(wl, h, rd), -w / 2 + wl / 2, h / 2, frontZ));
    shell.add(at(box(wr, h, rd), w / 2 - wr / 2, h / 2, frontZ));
    g.add(shell);
    /* the door header rises with the walls once they clear the door */
    const header = at(box(doorW, h - doorH, rd), dx, doorH + (h - doorH) / 2, frontZ);
    g.add(header);
    /* door slab, proud of the recess so its hull draws the door */
    const dh = doorH * 0.94;
    g.add(at(box(doorW * 0.84, dh, 0.02), dx, dh / 2, d / 2 - rd + 0.014));
    /* display window on the wide pier */
    const wh = Math.min(0.5, h * 0.36);
    const wy = 0.16 + wh / 2;
    const window_ = at(box(wr * 0.68, wh, 0.012), w / 2 - wr / 2, wy, d / 2 + 0.008);
    g.add(window_);
    /* step */
    g.add(at(box(doorW * 1.5, 0.05, 0.16), dx, 0.025, d / 2 + 0.08));
    /* awning on two struts, hinged above the door */
    const aY = doorH + 0.1;
    const awningGroup = new THREE.Group();
    {
      const aw = Math.min(w * 0.72, doorW * 2.1);
      const tilt = 0.4;
      const hinge = new THREE.Vector3(dx, aY, d / 2);
      const slab = box(aw, 0.02, awning);
      slab.position.copy(hinge).add(new THREE.Vector3(0, -Math.sin(tilt) * awning * 0.5, Math.cos(tilt) * awning * 0.5));
      slab.rotation.x = tilt;
      awningGroup.add(slab);
      for (const s of [-1, 1]) {
        const front = new THREE.Vector3(dx + s * aw * 0.46, aY - Math.sin(tilt) * awning, d / 2 + Math.cos(tilt) * awning);
        const wall = new THREE.Vector3(dx + s * aw * 0.46, aY - 0.26, d / 2);
        const strut = box(0.014, 0.014, front.distanceTo(wall));
        strut.position.copy(front).add(wall).multiplyScalar(0.5);
        strut.lookAt(front);
        awningGroup.add(strut);
      }
      /* pops about the hinge */
      awningGroup.position.copy(hinge);
      awningGroup.children.forEach((c) => c.position.sub(hinge));
    }
    g.add(awningGroup);
    /* topping out: roof slab, parapet and the sign board, popping in
       about the roof line */
    const top = new THREE.Group();
    top.add(at(box(w - 0.02, 0.04, d - rd - 0.02), 0, h - 0.02, -rd / 2));
    top.add(at(box(w + 0.06, 0.035, d + 0.06), 0, h + 0.0175, 0));
    top.add(at(box(w * 0.62, h * 0.11, 0.03), 0, h * 0.84, d / 2 + 0.02));
    top.position.y = h;
    top.children.forEach((c) => (c.position.y -= h));
    g.add(top);
    /* the plan it rose from */
    const out: Ribbon = { pos: [], idx: [] };
    strokeRect(out, 0, 0, w + 0.22, d + 0.22, 0.014, seed * 13);
    const plan = new THREE.Mesh(keep(ribbonGeometry(out)), inkFlat);
    plan.position.y = 0.0045;
    g.add(plan);
    g.add(contactShade(w, d));
    g.position.y = groundY;

    const pop = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : u + 0.14 * Math.sin(Math.PI * u));
    const ramp = (v: number, a: number, b: number) => THREE.MathUtils.clamp((v - a) / (b - a), 0, 1);
    g.setBuild = (b: number) => {
      const H = h * THREE.MathUtils.clamp(b, 0.02, 1);
      shell.scale.y = H / h;
      const hd = Math.max(0, H - doorH);
      header.visible = hd > 0.02;
      header.scale.y = Math.max(0.001, hd / (h - doorH));
      header.position.y = doorH + hd / 2;
      window_.visible = H > wy + wh / 2 + 0.04;
      const a = pop(ramp(H, aY + 0.06, aY + 0.24));
      awningGroup.visible = a > 0.001;
      awningGroup.scale.setScalar(Math.max(0.001, a));
      const tt = pop(ramp(b, 0.94, 1));
      top.visible = tt > 0.001;
      top.scale.setScalar(Math.max(0.001, tt));
    };
    g.setBuild(build);
    return g;
  }

  /** The BigSquare mark as a roadside sign: a post and the rounded
      square with the "b" standing proud of it, both extruded from
      assets/logo.svg (lib/cube/logo.ts) into the same ink. Faces +z. */
  function logoSign(width = 0.72) {
    const g = new THREE.Group();
    const { plaque, mark } = logoGeometries(width, 0.05, 0.028);
    const postH = 0.42;
    g.add(at(box(0.05, postH + width * 0.5, 0.05), 0, (postH + width * 0.5) / 2, -0.035));
    const face = new THREE.Group();
    face.add(solid(plaque, false), solid(mark, false));
    face.position.set(0, postH + width / 2, 0);
    g.add(face);
    g.add(contactShade(0.16, 0.16));
    g.position.y = groundY;
    return g;
  }

  /** A trunk and two stacked cones, faceted. */
  function tree({ h }: { h: number }) {
    const g = new THREE.Group();
    const trunk = solid(new THREE.CylinderGeometry(0.04 * h, 0.05 * h, 0.3 * h, 7), false);
    g.add(at(trunk, 0, 0.15 * h, 0));
    const lower = solid(faceted(new THREE.ConeGeometry(0.3 * h, 0.5 * h, 7)), false);
    g.add(at(lower, 0, 0.24 * h + 0.25 * h, 0));
    const upper = solid(faceted(new THREE.ConeGeometry(0.21 * h, 0.42 * h, 7)), false);
    g.add(at(upper, 0, 0.58 * h + 0.21 * h, 0));
    upper.rotation.y = 0.45;
    g.add(contactShade(0.28 * h, 0.28 * h));
    g.position.y = groundY;
    return g;
  }

  /** A box van: cab, body, four drum wheels, windows drawn by hull.
      Local +z is forward. */
  function van() {
    const g = new THREE.Group();
    const floor = 0.15;
    g.add(at(box(0.66, 0.74, 1.05), 0, floor + 0.37, -0.03));
    g.add(at(box(0.64, 0.56, 0.5), 0, floor + 0.28, 0.72));
    g.add(at(box(0.5, 0.2, 0.012), 0, floor + 0.44, 0.976));
    for (const s of [-1, 1]) {
      g.add(at(box(0.012, 0.17, 0.3), s * 0.326, floor + 0.43, 0.7));
      /* a cargo door outline on each side */
      g.add(at(box(0.012, 0.5, 0.42), s * 0.336, floor + 0.36, -0.25));
    }
    /* bumper */
    g.add(at(box(0.6, 0.06, 0.05), 0, floor + 0.02, 0.985));
    const wheelGeo = (): THREE.BufferGeometry => new THREE.CylinderGeometry(0.135, 0.135, 0.075, 14);
    for (const [x, z] of [[-0.31, 0.62], [0.31, 0.62], [-0.31, -0.32], [0.31, -0.32]]) {
      const wheel = solid(wheelGeo(), false);
      wheel.rotation.z = Math.PI / 2;
      g.add(at(wheel, x, 0.135, z));
    }
    g.add(contactShade(0.7, 1.6, 0, 0.15));
    g.position.y = groundY;
    return g;
  }

  type SheetOpts = { w: number; h: number; draw?: "chart" | "plan" | "none"; seed?: number };

  /** A real thin box lying on the paper with an ink drawing on top. */
  function sheet({ w, h, draw = "none", seed = 1 }: SheetOpts) {
    const g = new THREE.Group();
    const t = 0.012;
    g.add(at(box(w, t, h), 0, t / 2, 0));
    if (draw !== "none") {
      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = Math.round((size * h) / w);
      const rc = rough.canvas(canvas);
      const W = canvas.width;
      const Hh = canvas.height;
      const opt = { stroke: "#FFFFFF", strokeWidth: 5, roughness: 1.4, bowing: 1.2 };
      if (draw === "chart") {
        rc.line(W * 0.14, Hh * 0.82, W * 0.88, Hh * 0.82, { ...opt, seed: seed + 1 });
        rc.line(W * 0.14, Hh * 0.82, W * 0.14, Hh * 0.16, { ...opt, seed: seed + 2 });
        const bars = [0.28, 0.42, 0.36, 0.55, 0.7];
        bars.forEach((v, i) => {
          const bw = W * 0.1;
          const x = W * 0.2 + i * W * 0.14;
          rc.rectangle(x, Hh * 0.82 - Hh * v * 0.75, bw, Hh * v * 0.75, {
            ...opt,
            seed: seed + 10 + i,
            fill: i === bars.length - 1 ? "#FFFFFF" : undefined,
            fillStyle: "hachure",
            hachureGap: 9,
            fillWeight: 2.5,
          });
        });
      } else {
        /* a plan: outline, a door notch, two interior walls, a circle */
        rc.rectangle(W * 0.14, Hh * 0.14, W * 0.72, Hh * 0.7, { ...opt, seed: seed + 1 });
        rc.line(W * 0.14, Hh * 0.5, W * 0.5, Hh * 0.5, { ...opt, seed: seed + 2 });
        rc.line(W * 0.5, Hh * 0.5, W * 0.5, Hh * 0.84, { ...opt, seed: seed + 3 });
        rc.line(W * 0.62, Hh * 0.14, W * 0.62, Hh * 0.42, { ...opt, seed: seed + 4 });
        rc.arc(W * 0.42, Hh * 0.84, W * 0.16, W * 0.16, Math.PI, Math.PI * 1.5, false, { ...opt, seed: seed + 5 });
        rc.circle(W * 0.72, Hh * 0.66, W * 0.1, { ...opt, seed: seed + 6 });
      }
      const texture = keep(new THREE.CanvasTexture(canvas));
      texture.colorSpace = THREE.NoColorSpace;
      texture.anisotropy = 8;
      const m = keep(
        new THREE.MeshBasicMaterial({
          map: texture,
          color: new THREE.Color(BLUE_SRGB),
          transparent: true,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      const decal = new THREE.Mesh(unitPlane, m);
      decal.rotation.x = -Math.PI / 2;
      decal.scale.set(w, h, 1);
      decal.position.y = t + 0.0015;
      decal.renderOrder = 2;
      g.add(decal);
    }
    g.add(contactShade(w * 0.9, h * 0.9));
    g.position.y = groundY;
    return g;
  }

  /** A map pin: a cone standing on its apex and a sphere on top. Built
      for the search station; round 1 does not place it. */
  function pin() {
    const g = new THREE.Group();
    const cone = solid(faceted(new THREE.ConeGeometry(0.13, 0.36, 9)), false);
    cone.rotation.x = Math.PI;
    g.add(at(cone, 0, 0.18, 0));
    g.add(at(solid(new THREE.SphereGeometry(0.17, 18, 12), false), 0, 0.46, 0));
    g.add(contactShade(0.1, 0.1));
    g.position.y = groundY;
    return g;
  }

  return {
    road,
    startTick,
    frame,
    storefront,
    logoSign,
    tree,
    van,
    sheet,
    pin,
    contactShade,
    dispose() {
      for (const t of trash) t.dispose();
      trash.length = 0;
    },
  };
}
