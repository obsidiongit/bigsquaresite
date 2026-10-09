/**
 * The hero TV: a video drawn inside a curved tube, cell by cell, with a power-on flash. Two styles:
 * - "dots" (BigSquare's, the default): each cell is one rounded square sized by the pixel's brightness, in
 *   its own colour on black; cells near the cursor swell like a lens passing over.
 * - "glyphs" (Revelatio's): each cell is a character picked by brightness, with a mouse trail that drags
 *   and splits the picture. `tvness` 1 is the old-TV look (curved tube,
 * fisheye, colour fringe); 0 is a flat full-bleed picture. `power` 0..1 opens the picture from a line.
 *
 * The push (BigSquare's way from the reel into the site): `zoom` dives into the character cell nearest the
 * middle of the screen; `blue` turns that cell into a solid BigSquare-blue square; `reveal` breaks the
 * blue screen into squares that shrink away middle-first, leaving transparent holes onto the page below.
 */

const TRAIL_MAX = 24;
const GLYPHS = "@#W$9876543210?!abc;:+=-,._  ";
const BLUE: [number, number, number] = [6 / 255, 87 / 255, 249 / 255]; // #0657F9

export type TvLook = {
  cell: number; // character cell in CSS px
  glyphScale: number;
  contrast: number;
  brightness: number;
  fisheye: number;
  mouseRadius: number; // CSS px
  mouseStrength: number;
  warp: number;
  chroma: number;
  bloom: number;
  trailDecay: number;
  tailWidth: number;
  tailLength: number;
  // Dots style: size = (lum - 0.5) * dotContrast + 0.5 + dotLift; colour x (dotGain + dotGainSize * size).
  // Tuned on the reel (scripts/dots-preview.py) so darker footage stays readable.
  dotContrast: number;
  dotLift: number;
  dotGain: number;
  dotGainSize: number;
};

export const DEFAULT_LOOK: TvLook = {
  cell: 6,
  glyphScale: 1.6,
  contrast: 0.5,
  brightness: 0.5,
  fisheye: 0.28,
  mouseRadius: 108,
  mouseStrength: 0.12,
  warp: 46.5,
  chroma: 2,
  bloom: 0.75,
  trailDecay: 0.839,
  tailWidth: 0.85,
  tailLength: 3.44,
  dotContrast: 1.1,
  dotLift: 0.18,
  dotGain: 1.05,
  dotGainSize: 0.35,
};

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = (a_pos + 1.0) * 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_video;
uniform sampler2D u_glyphs;
uniform vec2 u_res;
uniform vec2 u_videoRes;
uniform float u_cell;
uniform float u_glyphScale;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_fisheye;
uniform float u_mouseRadius;
uniform float u_mouseStrength;
uniform float u_warp;
uniform float u_chroma;
uniform float u_bloom;
uniform float u_tailWidth;
uniform float u_tailLength;
uniform float u_tvness;
uniform float u_power;
uniform float u_flash;
uniform float u_glyphCount;
uniform float u_time;
uniform float u_trailCount;
uniform vec4 u_trail[${TRAIL_MAX}];
uniform float u_style; // 0 glyphs, 1 dots
uniform vec4 u_lens;    // dots: x, y, radius (device px), strength
uniform vec4 u_dot;     // dots: contrast, lift, gain, gain per size
uniform float u_zoom;
uniform float u_blue;
uniform float u_reveal;
uniform vec3 u_blueCol;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Fill the frame with the video, cropping the overflow (object-fit: cover).
vec2 cover(vec2 uv, vec2 src, vec2 dst) {
  float s = src.x / src.y, d = dst.x / dst.y;
  if (d > s) { float k = s / d; uv.y = uv.y * k + (1.0 - k) * 0.5; }
  else { float k = d / s; uv.x = uv.x * k + (1.0 - k) * 0.5; }
  return uv;
}

vec2 fisheye(vec2 uv, float k) {
  vec2 p = uv * 2.0 - 1.0;
  float aspect = u_res.x / max(u_res.y, 1.0);
  p.x *= aspect;
  p *= 1.0 + k * dot(p, p);
  p.x /= aspect;
  return p * 0.5 + 0.5;
}

// Roughly the distance outside the tube: one smooth, convex outline (a squircle) whose sides bow out
// by the given amounts. u_tvness 0 sharpens it into the plain full-screen rectangle.
// (A rectangle with a separate bulge per side, as before, left notches at the corners that read as a
// second outline.)
float tube(vec2 p, vec2 b, float bow, float bowTop, float bowBottom) {
  vec2 r = vec2(b.x + bow, b.y + (p.y < 0.0 ? bowBottom : bowTop));
  float n = 5.0 / max(u_tvness, 0.01); // 500 at full screen: corners square to within a pixel
  vec2 q = abs(p) / r;
  return (pow(pow(q.x, n) + pow(q.y, n), 1.0 / n) - 1.0) * min(r.x, r.y);
}

float roundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// Video sample, pixelated and colour-split where the mouse trail is.
vec3 sampleVideo(vec2 uv, vec2 dir, float heat) {
  float grid = mix(260.0, 70.0, clamp(heat, 0.0, 1.0));
  vec2 base = floor(uv * grid) / grid;
  vec2 split = normalize(dir + vec2(0.0001)) * u_chroma * 0.0022 * heat * (0.8 + heat * 2.2);
  return vec3(
    texture2D(u_video, base + split).r,
    texture2D(u_video, base).g,
    texture2D(u_video, base - split).b
  );
}

void main() {
  vec2 screen = v_uv * u_res;

  // Reveal: the blue screen splits into big squares that shrink away, middle first.
  if (u_reveal > 0.0) {
    float rc = u_res.y / 9.0;
    vec2 rid = floor((screen - u_res * 0.5) / rc);
    vec2 rcen = (rid + 0.5) * rc + u_res * 0.5;
    float dist = length(rcen - u_res * 0.5) / length(u_res * 0.5);
    float k = clamp(u_reveal * 1.5 - dist * 0.5, 0.0, 1.0);
    float half_ = 0.5 * rc * (1.0 - k * k);
    float inside = step(max(abs(screen.x - rcen.x), abs(screen.y - rcen.y)), half_);
    gl_FragColor = vec4(u_blueCol * inside, inside);
    return;
  }

  // Push: look at the screen through a zoom centred on the middle cell.
  vec2 target = (floor(u_res * 0.5 / u_cell) + 0.5) * u_cell;
  vec2 frag = target + (screen - target) / u_zoom;
  vec2 cell = floor(frag / u_cell);
  bool isTarget = all(equal(cell, floor(target / u_cell)));
  vec2 center = (cell + 0.5) * u_cell;
  vec2 uv = center / u_res;

  // How strongly, and which way, the mouse trail pulls this cell.
  vec2 drag = vec2(0.0);
  float pull = 0.0;
  if (u_trailCount > 0.5) {
    float m = 1.0 - smoothstep(u_mouseRadius * 0.20, u_mouseRadius * 0.95, distance(center, u_trail[0].xy * u_res));
    drag += normalize(u_trail[0].zw + vec2(0.0001)) * m * 0.55;
    pull += m * 0.55;
  }
  for (int i = 0; i < ${TRAIL_MAX - 1}; i++) {
    if (float(i + 1) >= u_trailCount) break;
    vec2 a = u_trail[i].xy * u_res;
    vec2 seg = u_trail[i + 1].xy * u_res - a;
    float len = length(seg);
    if (len < 0.0001) continue;
    float h = clamp(dot(center - a, seg) / max(dot(seg, seg), 0.0001), 0.0, 1.0);
    vec2 closest = a + seg * h;
    float width = u_mouseRadius * (0.16 + u_tailWidth * 0.28);
    float m = 1.0 - smoothstep(width, width * 2.35, distance(center, closest));
    m *= mix(1.0, 0.65, h);
    m *= exp(-float(i) / max(u_tailLength, 0.2));
    m *= mix(0.24, 1.0, smoothstep(0.00025, 0.010, length(u_trail[i].zw) + length(u_trail[i + 1].zw)));
    m *= smoothstep(0.08, 0.96, hash(cell + closest * 0.012 + vec2(float(i) * 11.7, u_time * 19.0)));
    drag += seg / len * m;
    pull += m;
  }
  float heat = clamp(pull * u_mouseStrength * 1.25, 0.0, 1.0);
  vec2 dir = normalize(drag + vec2(0.0001));

  // Displace whole cells along the drag, plus a scanline tear and a wobble.
  vec2 step = vec2(u_cell) / u_res;
  vec2 shove = drag * (u_warp * 0.9 / u_res) * heat;
  uv += floor(shove / max(step, vec2(0.00001))) * step;
  uv.x += ((sin(center.y * 0.34 + u_time * 70.0) * 0.5 + 0.5) - 0.5) * 0.14 * heat;
  uv += vec2(sin((center.y + u_time * 180.0) * 0.03), cos((center.x - u_time * 140.0) * 0.028)) * (u_warp * 0.12 / u_res) * heat;

  vec2 fish = fisheye(uv, u_fisheye * u_tvness);
  uv = clamp(fish, vec2(0.001), vec2(0.999));
  vec2 vuv = mix(vec2(0.5), cover(uv, u_videoRes, u_res), 0.82);

  float edge = u_cell * 0.8 * (2.0 / min(u_res.x, u_res.y));
  float inTube = 1.0 - smoothstep(0.0, edge, tube(
    v_uv * 2.0 - 1.0,
    mix(vec2(1.0), vec2(0.93, 0.80), u_tvness),
    0.035 * u_tvness, 0.14 * u_tvness, 0.15 * u_tvness
  ));

  if (u_style > 0.5) {
    // BigSquare dots: one rounded square per cell, its area following the pixel's brightness.
    // Sampled a little zoomed in (like the characters), so the curved tube never reaches past the
    // picture's edge; clamping there smeared the edge pixels into a second, flat outline.
    vec2 duv = clamp(mix(vec2(0.5), cover(fish, u_videoRes, u_res), 0.82), vec2(0.001), vec2(0.999));
    vec3 dcol = texture2D(u_video, duv).rgb;
    float lum = dot(dcol, vec3(0.299, 0.587, 0.114));
    float size = clamp((lum - 0.5) * u_dot.x + 0.5 + u_dot.y, 0.0, 1.0);
    float near = u_lens.z > 0.0 ? smoothstep(u_lens.z, 0.0, length(target + (center - target) * u_zoom - u_lens.xy)) : 0.0;
    size = sqrt(clamp(size + near * u_lens.w, 0.0, 1.0));
    if (isTarget) size = mix(size, 1.0, u_blue);
    float hs = 0.5 * u_cell * mix(0.12, 0.96, size);
    if (isTarget) hs = mix(hs, u_cell * 0.5, u_blue);
    float rad = hs * 0.35;
    if (isTarget) rad *= 1.0 - u_blue * 0.9; // the big square has near-square corners
    float aa = 0.6 / u_zoom;
    float da = 1.0 - smoothstep(-aa, aa, roundBox(frag - center, vec2(hs), rad));
    if (size < 0.03) da = 0.0;
    vec3 shade = dcol * (u_dot.z + u_dot.w * size) * (1.0 + near * 0.4);
    if (isTarget) shade = mix(shade, u_blueCol, u_blue);
    vec3 dotOut = shade * da;

    float dStartup = 1.0 - smoothstep(0.0, 1.0, u_power);
    float dAperture = mix(0.001, 1.0, smoothstep(0.0, 1.0, u_power));
    float dOpen = 1.0 - smoothstep(dAperture, dAperture + edge * 1.15, abs(v_uv.y - 0.5));
    float dBand = hash(vec2(v_uv.y * 140.0, floor(u_time * 80.0))) - 0.5;
    float dGrain = hash(vec2(v_uv.x * 300.0 + u_time * 30.0, v_uv.y * 120.0)) - 0.5;
    dotOut += vec3((dBand * 0.35 + dGrain * 0.2) * dStartup * (0.006 + 0.010 * u_flash));
    float dBeam = exp(-abs(v_uv.y - 0.5) / max(0.0012, 0.016 + u_flash * 0.09));
    float dOrb = exp(-length((v_uv - 0.5) * vec2(1.75, 1.0)) / max(0.008, 0.03 + u_flash * 0.16));
    float dFlare = (dBeam * 1.35 + dOrb * 1.05) * u_flash;
    float dAlpha = clamp(inTube * max(dOpen, dFlare * 0.5), 0.0, 1.0);
    gl_FragColor = vec4(clamp(dotOut * dOpen + vec3(dFlare), 0.0, 1.0) * dAlpha, dAlpha);
    return;
  }

  // One character per cell, picked by brightness.
  vec3 color = sampleVideo(vuv, dir, heat);
  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  luma = clamp((luma - 0.5) * u_contrast + 0.5 + u_brightness, 0.0, 1.0);
  luma = clamp(luma + (hash(cell + floor(u_time * 55.0)) - 0.5) * 0.5 * heat, 0.0, 1.0);
  float glyph = floor((1.0 - luma) * (u_glyphCount - 1.0) + 0.5);
  vec2 local = (mod(frag, u_cell) - u_cell * 0.5) / (u_cell * 0.5 * max(u_glyphScale, 0.1));
  vec2 g = clamp(local * 0.5 + 0.5, 0.0, 1.0);
  float ink = texture2D(u_glyphs, vec2((glyph + g.x) / u_glyphCount, g.y)).r;
  if (isTarget && u_blue > 0.0) {
    // The chosen cell becomes a solid blue square, corners nearly square.
    float hs = u_cell * 0.5 * mix(0.96, 1.0, u_blue);
    float aa = 0.6 / u_zoom;
    float square = 1.0 - smoothstep(-aa, aa, roundBox(frag - center, vec2(hs), hs * 0.35 * (1.0 - u_blue * 0.9)));
    ink = mix(ink, square, u_blue);
    color = mix(color, u_blueCol, u_blue);
  }
  vec3 outColor = color * ink;

  // Bloom from a small blur of the neighbours' brightest parts.
  vec2 px = 2.0 / u_res;
  vec3 blur = (
    sampleVideo(vuv + vec2(px.x, 0.0), dir, heat) + sampleVideo(vuv - vec2(px.x, 0.0), dir, heat) +
    sampleVideo(vuv + vec2(0.0, px.y), dir, heat) + sampleVideo(vuv - vec2(0.0, px.y), dir, heat)
  ) * 0.25;
  outColor += blur * smoothstep(0.58, 1.0, max(max(blur.r, blur.g), blur.b)) * u_bloom * (isTarget ? 1.0 - u_blue : 1.0);

  // Power-on: the picture opens from a thin line with a flare, and static while it steadies.
  float startup = 1.0 - smoothstep(0.0, 1.0, u_power);
  float aperture = mix(0.001, 1.0, smoothstep(0.0, 1.0, u_power));
  float open = 1.0 - smoothstep(aperture, aperture + edge * 1.15, abs(v_uv.y - 0.5));
  float band = hash(vec2(v_uv.y * 140.0, floor(u_time * 80.0))) - 0.5;
  float grain = hash(vec2(v_uv.x * 300.0 + u_time * 30.0, v_uv.y * 120.0)) - 0.5;
  outColor += vec3((band * 0.35 + grain * 0.2) * startup * (0.006 + 0.010 * u_flash));
  float beam = exp(-abs(v_uv.y - 0.5) / max(0.0012, 0.016 + u_flash * 0.09));
  float orb = exp(-length((v_uv - 0.5) * vec2(1.75, 1.0)) / max(0.008, 0.03 + u_flash * 0.16));
  float flare = (beam * 1.35 + orb * 1.05) * u_flash;

  float alpha = clamp(inTube * max(open, flare * 0.5), 0.0, 1.0);
  gl_FragColor = vec4(clamp(outColor * open + vec3(flare), 0.0, 1.0) * alpha, alpha);
}`;

function glyphAtlas(chars: string, size = 52) {
  const c = document.createElement("canvas");
  c.width = chars.length * size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.floor(size * 0.78)}px Menlo, Monaco, "Courier New", monospace`;
  for (let i = 0; i < chars.length; i++) ctx.fillText(chars[i], i * size + size / 2, size * 0.54);
  return c;
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

type Point = { x: number; y: number; dx: number; dy: number };

export type TvStyle = "dots" | "glyphs";

const LENS = { radius: 120, strength: 0.4, follow: 0.18 };

export class AsciiTv {
  look: TvLook;
  style: TvStyle = "dots";
  private lens = { x: -9999, y: -9999, on: false, tx: -9999, ty: -9999 };
  tvness = 1;
  power = 1;
  /** The push into one cell: zoom (1 = none), blue (0..1), reveal (0..1). */
  push = { zoom: 1, blue: 0, reveal: 0 };
  private flash = 0;
  private gl: WebGLRenderingContext;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private videoTex: WebGLTexture;
  private glyphTex: WebGLTexture;
  private glyphTexHi: WebGLTexture; // sharper characters for when the push zooms in
  private trail: Point[] = [];
  private trailData = new Float32Array(TRAIL_MAX * 4);
  private mouse = { x: 0.5, y: 0.5, inside: false, lastMove: 0 };
  private energy = 0;
  private dpr = 1;
  private raf = 0;
  private powerRaf = 0;
  private off: (() => void)[] = [];
  /** Set by the owner when the TV cannot be seen (e.g. after the push); skips all drawing. */
  paused = false;
  private sizeChangedAt = 0;
  private lastCss = "";
  private onScreen = true;
  private lastVideoTime = -1;
  private lastKey = "";
  /** A decoded frame is waiting to be uploaded (from requestVideoFrameCallback where supported). */
  private freshFrame = true;
  private hasFrameCallback = "requestVideoFrameCallback" in HTMLVideoElement.prototype;

  constructor(private canvas: HTMLCanvasElement, private video: HTMLVideoElement, look: Partial<TvLook> = {}, style: TvStyle = "dots") {
    this.look = { ...DEFAULT_LOOK, ...look };
    this.style = style;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const names = ["style", "lens", "dot", "video", "glyphs", "res", "videoRes", "cell", "glyphScale", "brightness", "contrast", "fisheye", "mouseRadius", "mouseStrength", "warp", "chroma", "bloom", "tailWidth", "tailLength", "tvness", "power", "flash", "glyphCount", "time", "trailCount", "zoom", "blue", "reveal", "blueCol"];
    for (const n of names) this.u[n] = gl.getUniformLocation(prog, `u_${n}`);
    this.u.trail = gl.getUniformLocation(prog, "u_trail[0]");

    this.videoTex = this.texture();
    this.glyphTex = this.texture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glyphAtlas(GLYPHS));
    this.glyphTexHi = this.texture();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glyphAtlas(GLYPHS, 160));

    const move = (e: PointerEvent | MouseEvent) => {
      this.pointer(e.clientX, e.clientY);
      Object.assign(this.lens, { tx: e.clientX, ty: e.clientY, on: true });
    };
    const leave = () => (this.lens.on = false);
    document.addEventListener("pointerleave", leave);
    this.off.push(() => document.removeEventListener("pointerleave", leave));
    const touch = (e: TouchEvent) => e.touches[0] && this.pointer(e.touches[0].clientX, e.touches[0].clientY);
    const blur = () => (this.mouse.inside = false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("touchmove", touch, { passive: true });
    window.addEventListener("blur", blur);
    this.off.push(
      () => window.removeEventListener("pointermove", move),
      () => window.removeEventListener("touchmove", touch),
      () => window.removeEventListener("blur", blur),
    );

    const io = new IntersectionObserver(([e]) => (this.onScreen = e.isIntersecting));
    io.observe(canvas);
    this.off.push(() => io.disconnect());

    // Upload exactly the frames the decoder hands over, not a guess from the clock.
    if (this.hasFrameCallback) {
      let id = 0;
      const onFrame = () => {
        this.freshFrame = true;
        id = video.requestVideoFrameCallback(onFrame);
      };
      id = video.requestVideoFrameCallback(onFrame);
      this.off.push(() => video.cancelVideoFrameCallback(id));
    }
    // The reel lives off the page, so the browser may pause it as "not visible" to save power;
    // keep it playing (the owner pauses it only after dispose).
    const resume = () => video.play().catch(() => {});
    video.addEventListener("pause", resume);
    this.off.push(() => video.removeEventListener("pause", resume));

    this.raf = requestAnimationFrame(this.frame);
  }

  /** Switch off, then open the picture from a line with a flare over `ms`. */
  powerOn(ms = 980) {
    cancelAnimationFrame(this.powerRaf);
    this.power = 0;
    const start = performance.now();
    const step = () => {
      const t = Math.min(1, (performance.now() - start) / ms);
      this.power = t < 0.35 ? Math.pow(t / 0.35, 0.58) * 0.28 : 0.28 + Math.pow((t - 0.35) / 0.65, 1.3) * 0.72;
      this.flash = Math.exp(-(((t - 0.12) / 0.08) ** 2)) * 1.55 + Math.exp(-(((t - 0.32) / 0.14) ** 2)) * 0.55;
      if (t < 1) this.powerRaf = requestAnimationFrame(step);
      else {
        this.power = 1;
        this.flash = 0;
      }
    };
    this.powerRaf = requestAnimationFrame(step);
  }

  /** One character cell, in canvas (device) pixels. */
  get cellPx() {
    return this.look.cell * this.dpr;
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    cancelAnimationFrame(this.powerRaf);
    this.off.forEach((f) => f());
    // The context is left alone (the browser frees it with the canvas). Losing it here on purpose breaks a
    // remount on the same canvas: React mounts twice in development, and the second TV got a dead context.
  }

  private texture() {
    const gl = this.gl;
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return t;
  }

  private pointer(cx: number, cy: number) {
    const r = this.canvas.getBoundingClientRect();
    if (!r.width || cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) {
      this.mouse.inside = false;
      return;
    }
    const x = (cx - r.left) / r.width;
    const y = 1 - (cy - r.top) / r.height;
    this.trail.unshift({ x, y, dx: x - this.mouse.x, dy: y - this.mouse.y });
    if (this.trail.length > TRAIL_MAX) this.trail.length = TRAIL_MAX;
    Object.assign(this.mouse, { x, y, inside: true, lastMove: performance.now() });
  }

  private frame = () => {
    this.raf = requestAnimationFrame(this.frame);
    const { gl, u, look, canvas, video } = this;

    if (this.paused || !this.onScreen || document.hidden) return;
    // Dots are simple shapes; 1.5x is sharp enough and a lot cheaper on big screens. On top of that a
    // pixel budget: a full-screen TV on a big high-DPR monitor would otherwise shade 4M+ pixels a frame.
    const cssW = canvas.clientWidth, cssH = canvas.clientHeight;
    const budget = this.style === "dots" ? 1.6e6 : 2.4e6;
    const maxDpr = this.style === "dots" ? 1.5 : 2;
    this.dpr = Math.max(0.6, Math.min(window.devicePixelRatio || 1, maxDpr, Math.sqrt(budget / Math.max(1, cssW * cssH))));
    const w = Math.max(1, Math.floor(cssW * this.dpr));
    const h = Math.max(1, Math.floor(cssH * this.dpr));
    // Resizing the drawing buffer reallocates it on the GPU; while the TV grows with the scroll the CSS
    // size changes every frame, so the buffer follows in steps (the canvas stretches in between) and
    // snaps to the exact size once the size holds still for a moment.
    if (canvas.width !== w || canvas.height !== h) {
      const now = performance.now();
      const off = Math.max(Math.abs(w - canvas.width) / canvas.width, Math.abs(h - canvas.height) / canvas.height);
      if (off > 0.12 || now - this.sizeChangedAt > 140) {
        canvas.width = w;
        canvas.height = h;
      }
      if (this.lastCss !== `${cssW}x${cssH}`) this.sizeChangedAt = now;
    }
    this.lastCss = `${cssW}x${cssH}`;
    // draw at the buffer's real size; its scale against the CSS box is the effective dpr
    const bw = canvas.width, bh = canvas.height;
    this.dpr = bw / Math.max(1, cssW);
    // The trail drifts on and fades; points that stop moving drop off.
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const p = this.trail[i];
      p.dx *= look.trailDecay;
      p.dy *= look.trailDecay;
      p.x += p.dx * 0.15;
      p.y += p.dy * 0.15;
      if (Math.abs(p.dx) + Math.abs(p.dy) < 0.00006) this.trail.splice(i, 1);
    }
    this.trailData.fill(0);
    this.trail.forEach((p, i) => this.trailData.set([p.x, p.y, p.dx, p.dy], i * 4));

    const moving = this.mouse.inside || performance.now() - this.mouse.lastMove < 260;
    this.energy += ((moving ? 1 : 0) - this.energy) * 0.09;

    if (video.readyState < 2) return;

    // The lens trails the cursor a little (dots style).
    if (this.lens.x < -9000) Object.assign(this.lens, { x: this.lens.tx, y: this.lens.ty });
    this.lens.x += (this.lens.tx - this.lens.x) * LENS.follow;
    this.lens.y += (this.lens.ty - this.lens.y) * LENS.follow;

    // Only redraw when something on screen would change: a new video frame, the size, the scroll-driven
    // settings, the power-on, the cursor lens or the mouse trail.
    const newFrame = this.hasFrameCallback ? this.freshFrame : video.currentTime !== this.lastVideoTime;
    const key = [bw, bh, cssW, cssH, this.tvness, this.power, this.flash, this.push.zoom, this.push.blue, this.push.reveal, Math.round(this.lens.x), Math.round(this.lens.y), this.lens.on, this.trail.length, this.energy.toFixed(2), this.style].join("|");
    if (!newFrame && key === this.lastKey) return;
    this.lastKey = key;
    gl.viewport(0, 0, bw, bh);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.videoTex);
    if (newFrame) {
      this.lastVideoTime = video.currentTime;
      this.freshFrame = false;
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    }
    gl.uniform1i(u.video, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.push.zoom > 2 ? this.glyphTexHi : this.glyphTex);
    gl.uniform1i(u.glyphs, 1);

    gl.uniform2f(u.res, bw, bh);
    gl.uniform2f(u.videoRes, video.videoWidth || bw, video.videoHeight || bh);
    gl.uniform1f(u.cell, look.cell * this.dpr);
    gl.uniform1f(u.glyphScale, look.glyphScale);
    gl.uniform1f(u.brightness, look.brightness);
    gl.uniform1f(u.contrast, look.contrast);
    gl.uniform1f(u.fisheye, look.fisheye);
    gl.uniform1f(u.mouseRadius, look.mouseRadius * this.dpr);
    gl.uniform1f(u.mouseStrength, look.mouseStrength * (0.15 + this.energy * 0.85));
    gl.uniform1f(u.warp, look.warp * this.dpr);
    gl.uniform1f(u.chroma, look.chroma * this.tvness);
    gl.uniform1f(u.bloom, look.bloom);
    gl.uniform1f(u.tailWidth, look.tailWidth);
    gl.uniform1f(u.tailLength, look.tailLength);
    gl.uniform1f(u.tvness, this.tvness);
    gl.uniform1f(u.power, this.power);
    gl.uniform1f(u.flash, this.flash);
    gl.uniform1f(u.glyphCount, GLYPHS.length);
    gl.uniform1f(u.time, performance.now() * 0.001);
    gl.uniform1f(u.trailCount, this.style === "dots" ? 0 : Math.min(this.trail.length, TRAIL_MAX)); // dots use the lens instead
    gl.uniform4fv(u.trail, this.trailData);
    const rect = canvas.getBoundingClientRect();
    gl.uniform1f(u.style, this.style === "dots" ? 1 : 0);
    gl.uniform4f(u.dot, look.dotContrast, look.dotLift, look.dotGain, look.dotGainSize);
    gl.uniform4f(u.lens, (this.lens.x - rect.left) * this.dpr, (rect.bottom - this.lens.y) * this.dpr, this.lens.on ? LENS.radius * this.dpr : 0, LENS.strength);
    gl.uniform1f(u.zoom, this.push.zoom);
    gl.uniform1f(u.blue, this.push.blue);
    gl.uniform1f(u.reveal, this.push.reveal);
    gl.uniform3f(u.blueCol, ...BLUE);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
}
