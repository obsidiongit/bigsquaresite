"use client";

import { useEffect, useRef, useState } from "react";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { Container } from "@/components/shared/Container";
import { REEL_VIDEO, REEL_VIDEO_SMALL } from "@/components/sections/home/media";
import { AsciiTv } from "@/lib/ascii-tv";
import { SketchFrame } from "@/lib/sketch-frame";
import { HeroText, type HeroTextMode } from "./heroText";
import s from "./TvHero.module.css";

/* The TV hero (ported 2026-10-08 from the studio rebuild; formerly review toggle
   "hero", default). The showreel plays on a curved TV drawn in
   BigSquare-blue rounded-square dots (lib/ascii-tv), with a boiling
   pencil sketch around it (lib/sketch-frame).

   The opening: the page starts inside one blue dot of the reel and the
   camera pulls back out through the grid, then the full-screen TV
   settles to its resting size under the headline. Scrolling grows the
   TV to fill the screen and irons out its curve; then the push: the
   camera dives into the dot nearest the middle, it turns solid blue and
   swallows the screen, and the blue breaks into squares that shrink
   away middle-first, uncovering the next section waiting underneath.

   The homepage runs no WebGL canvas behind this hero (the glass-cube
   hero and its companion were retired 2026-10-09). Copy is Brad's hero
   statement. */

/* the words break into blue squares on the way out (picked 2026-10-09; the
   other exits in ./heroText stay available to the class) */
const HERO_TEXT: HeroTextMode = "squares";
const GROW_END = 0.85; // share of the grow scroll at which the TV is full screen and flat
const NAV_CLEAR = 96; // px kept free under the nav bar
const TITLE_GAP = 36; // px between the resting TV and the statement
const TV_ASPECT = 16 / 10;
// the reel's light-burst shot is near-black for a few seconds: the TV skips it
const SKIP: [number, number] = [4.2, 7.4];
const PUSH = { zoom: [0, 0.68] as const, blue: [0.25, 0.6] as const, reveal: [0.7, 1] as const, overshoot: 1.3 };
const INTRO_MIN_MS = 1400; // the pull-out reads even when the reel is cached
const INTRO_EXIT_MS = 1500; // the full-screen TV settling to its resting size

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const span = (v: number, [a, b]: readonly [number, number]) => clamp01((v - a) / (b - a));
/** a string as one inline-block span per word, so the deflect mode can move each word */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span data-w="" className="inline-block will-change-transform">
            {w}
          </span>{" "}
        </span>
      ))}
    </>
  );
}

const viewportHeight = () => window.visualViewport?.height || document.documentElement.clientHeight || innerHeight;

export function TvHero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tvBox = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const growSpace = useRef<HTMLDivElement>(null);
  const pushSpace = useRef<HTMLDivElement>(null);
  const titleBox = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  const textRef = useRef<HeroText | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const video = document.createElement("video");
    Object.assign(video, { muted: true, loop: true, autoplay: true, playsInline: true });
    video.src = innerWidth < 768 ? REEL_VIDEO_SMALL : REEL_VIDEO;
    video.play().catch(() => {});
    const skipDark = () => {
      if (video.currentTime > SKIP[0] && video.currentTime < SKIP[1]) video.currentTime = SKIP[1];
    };
    video.addEventListener("timeupdate", skipDark);

    let tv: AsciiTv | null = null;
    try {
      tv = new AsciiTv(canvas.current!, video);
    } catch (err) {
      console.warn("TV unavailable:", err);
    }

    const intro = { active: !!tv && !reduced, g: !!tv && !reduced ? 1 : 0 };
    if (!intro.active) setRevealed(true);

    const box = tvBox.current!;
    const sketch = new SketchFrame(box);
    const text = new HeroText(titleBox.current!, caption.current!);
    /* measure first: squares mode builds its blue pieces on the measured
       words, and an unmeasured HeroText has none (the 2026-10-09 lock-in
       dropped the effect that used to re-measure and re-apply the mode) */
    text.measure();
    text.setMode(HERO_TEXT);
    textRef.current = text;
    const scope = section.current!;
    const next = scope.nextElementSibling as HTMLElement | null;
    // the resting TV fills the space between the nav and the statement (never overlapping it),
    // capped by the CSS max-width; `restY` is where its centre sits
    let base = { w: 0, h: 0 };
    let restY = 0;
    let lastSize = "";
    const measure = () => {
      lastSize = "";
      text.measure();
      box.style.cssText = "";
      const r = box.getBoundingClientRect();
      const vh = viewportHeight();
      const titleTop = titleBox.current!.getBoundingClientRect().top + window.scrollY;
      const room = Math.max(120, titleTop - TITLE_GAP - NAV_CLEAR);
      const h = Math.min(r.height, room);
      base = { w: h * TV_ASPECT, h };
      restY = NAV_CLEAR + room / 2 - vh / 2;
    };
    const update = () => {
      if (!base.w) measure();
      // every layout read happens up here, before any style write, so a frame never forces a reflow
      const vh = viewportHeight();
      const scrolled = -scope.getBoundingClientRect().top;
      const growTravel = growSpace.current!.offsetHeight;
      const pushTravel = pushSpace.current!.offsetHeight;
      const nextTop = next ? next.getBoundingClientRect().top - (parseFloat(next.dataset.lift ?? "0") || 0) : 0;
      const g = intro.active ? intro.g : clamp01(clamp01(scrolled / growTravel) / GROW_END);

      const bw = Math.round(lerp(base.w, innerWidth, g));
      const bh = Math.round(lerp(base.h, vh, g));
      const by = Math.round(lerp(restY, 0, g));
      const sizeKey = `${bw}|${bh}|${by}`;
      if (sizeKey !== lastSize) {
        lastSize = sizeKey;
        box.style.width = `${bw}px`;
        box.style.height = `${bh}px`;
        box.style.maxWidth = "none";
        box.style.aspectRatio = "auto";
        box.style.transform = `translateY(${by}px)`;
        sketch.draw(bw, bh, 1 - g, 1 - span(g, [0.75, 0.97]));
      }

      const pushStart = growTravel * GROW_END;
      const pushEnd = growTravel + pushTravel;
      const p = clamp01((scrolled - pushStart) / (pushEnd - pushStart));
      const pad = intro.active ? `${(2.5 * (1 - intro.g)).toFixed(3)}em` : p > 0 ? `${lerp(2.5, 0, span(p, [0, 0.3])).toFixed(3)}em` : "";
      if (stage.current!.style.padding !== pad) stage.current!.style.padding = pad;
      if (tv && !intro.active) {
        tv.tvness = 1 - g;
        const zMax = (Math.max(canvas.current!.width, canvas.current!.height) / (tv.cellPx * 0.96)) * PUSH.overshoot;
        tv.push.zoom = Math.exp(Math.log(zMax) * Math.pow(span(p, PUSH.zoom), 2.2));
        tv.push.blue = span(p, PUSH.blue);
        tv.push.reveal = span(p, PUSH.reveal);
      }

      // while the blue breaks up, the next section shows through, held at the top of the screen
      const revealing = p >= PUSH.reveal[0];
      scope.classList.toggle(s.see, revealing);
      // the section underneath is hidden until the reveal: its videos (WorkClip) stay paused till then
      const covering = scrolled < pushEnd && !revealing ? "1" : "";
      if (document.documentElement.dataset.heroCover !== covering) document.documentElement.dataset.heroCover = covering;
      if (next) {
        const lift = revealing && nextTop > 0 ? nextTop : 0;
        if (next.dataset.lift !== String(-lift)) {
          next.dataset.lift = String(-lift);
          next.style.transform = lift ? `translateY(${-lift}px)` : "";
        }
      }
      text.update(g, p, { cx: innerWidth / 2, cy: vh / 2 + by, w: bw, h: bh });
      const vis = p >= 1 ? "hidden" : "";
      if (stage.current!.style.visibility !== vis) stage.current!.style.visibility = vis;
      if (tv) tv.paused = p >= 1;
    };

    let raf = 0;
    const request = () => {
      if (!raf) raf = requestAnimationFrame(() => ((raf = 0), update()));
    };
    let lastWidth = innerWidth;
    const onResize = () => {
      if (innerWidth !== lastWidth) {
        lastWidth = innerWidth;
        base = { w: 0, h: 0 };
        update();
      } else request();
    };
    update();

    // the opening: out of the blue dot (time-based, held until the reel can draw), then the settle
    let introRaf = 0;
    const cv = canvas.current!;
    const zMax = () => (tv ? (Math.max(cv.width, cv.height) / (tv.cellPx * 0.96)) * PUSH.overshoot : 1);
    if (tv) tv.power = 1;
    const t0 = performance.now();
    let exitAt = 0;
    const loop = () => {
      const timeP = (performance.now() - t0) / INTRO_MIN_MS;
      const loadP = video.readyState >= 2 ? Math.min(1, timeP) : Math.min(0.85, timeP);
      if (tv && !exitAt) {
        tv.push.blue = 1 - span(loadP, [0.08, 0.5]);
        tv.push.zoom = Math.exp(Math.log(zMax()) * Math.pow(1 - span(loadP, [0.15, 1]), 2.2));
      }
      if (!exitAt && loadP >= 1) {
        exitAt = performance.now();
        setRevealed(true);
      }
      const e = exitAt ? clamp01((performance.now() - exitAt) / INTRO_EXIT_MS) : 0;
      intro.g = 1 - (e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2);
      update();
      if (e < 1) introRaf = requestAnimationFrame(loop);
      else {
        if (tv) Object.assign(tv.push, { zoom: 1, blue: 0 });
        intro.active = false;
        base = { w: 0, h: 0 };
        update();
      }
    };
    if (intro.active) introRaf = requestAnimationFrame(loop);

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", request);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(introRaf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", request);
      if (next) next.style.transform = "";
      delete document.documentElement.dataset.heroCover;
      video.removeEventListener("timeupdate", skipDark);
      sketch.dispose();
      text.dispose();
      textRef.current = null;
      tv?.dispose();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  return (
    <section ref={section} data-theme="light" data-cube-anchor="hero" data-intro={revealed ? undefined : ""} className={s.hero}>
      <Container className={s.header}>
        <div ref={titleBox} className={s.titleBox} data-shown={revealed || undefined}>
          <h1 className="font-display text-display text-sec-ink">
            <Words text="More customers." />
            <br />
            <Words text="More revenue you can" />
            <span data-w="" className="inline-block will-change-transform">
              <RoughAnnotation variant="circle" active={revealed} className="whitespace-nowrap font-accent">
                count.
              </RoughAnnotation>
            </span>
          </h1>
          <p className="mt-6 max-w-[44ch] text-lead text-sec-mid">
            <Words text="BigSquare is the growth partner for brands that want proof. One team runs your ads, your search, your site, and your creative." />
          </p>
        </div>
      </Container>
      <div ref={stage} className={s.stage}>
        <div className={s.frame}>
          <div ref={tvBox} className={s.tv}>
            <canvas ref={canvas} className={s.canvas} />
            {/* the "lower third" hero text mode: the statement as a caption on the TV */}
            <div ref={caption} className={s.caption} aria-hidden="true">
              <i />
              <p>
                <strong>More customers. More revenue you can count.</strong>
                <span>One team runs your ads, your search, your site, and your creative.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div ref={growSpace} className={s.spacer} />
      <div ref={pushSpace} className={s.pushSpacer} />
    </section>
  );
}
