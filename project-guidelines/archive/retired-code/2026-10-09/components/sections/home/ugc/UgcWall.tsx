"use client";
/**
 * The creator wall (ported 2026-10-08 from the studio rebuild, where it was the pick; replaces the
 * proof band, whose film and stand-in stats were placeholders). Real work from the BigSquare showreel.
 * The story it tells, in three beats as you scroll:
 *   1. everyone's scrolling: a wall of phones, every one playing real ads from Brad's reel, and the columns
 *      running upward like feeds, each at its own speed. Only the middle column stands still: our ad.
 *   2. the stop: the feeds slow down and stop dead, and "We stop thumbs." lands the moment they do.
 *   3. push in: the camera goes into the one phone in the middle (the push-into-one-dot move from the
 *      intro, done with the work) until it's a full-height phone, playing; the line and its tag come up.
 *
 * The wall is one canvas drawing small pre-cropped copies of the clips (public/media/ugc/small, 270 × 480,
 * so two dozen playing videos stay light); the phone in the middle is the full-quality clip on top of it.
 */
import { useEffect, useRef } from "react";
import { COPY, CLIPS, ease, span } from "./clips";
import { Section } from "@/components/shared/Section";
import s from "./UgcWall.module.css";

const HERO = "ugc-2";
const OTHERS = CLIPS.filter((c) => c.id !== HERO).map((c) => c.id);
const small = (id: string) => `/media/ugc/small/${id}.mp4`;

export function UgcWall() {
  const pin = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const heroVideo = useRef<HTMLVideoElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const side = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = canvas.current!;
    const g = c.getContext("2d")!;
    const vids = OTHERS.map((id) => {
      const v = document.createElement("video");
      Object.assign(v, { src: small(id), muted: true, loop: true, playsInline: true, preload: "auto" });
      return v;
    });
    const offsets: number[] = [];
    let raf = 0;
    let visible = false;
    let last = performance.now();

    const frame = (now: number) => {
      // a frame already queued when the wall unmounts (route change, hot reload) has nothing to draw
      if (!pin.current || !hero.current) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const W = c.clientWidth;
      const H = c.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      if (c.width !== Math.round(W * dpr)) (c.width = Math.round(W * dpr)), (c.height = Math.round(H * dpr));
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);

      const r = pin.current!.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      const phone = W < 768;
      const cols = phone ? 5 : 9;
      const tw = W * (phone ? 0.26 : 0.11);
      const gap = W * (phone ? 0.02 : 0.008);
      const th = (tw * 16) / 9;
      const step = th + gap;
      const mid = (cols - 1) / 2;

      // beat 2: the feeds stop; beat 3: the push into the middle phone
      const stop = ease(span(p, 0.1, 0.24));
      const z = ease(span(p, 0.3, 0.66));
      const K = (H * 0.86) / th;
      const k = 1 + (K - 1) * z;
      const others = 1 - span(p, 0.36, 0.6);
      const dim = 0.5 * span(p, 0.08, 0.2) * (1 - span(p, 0.3, 0.4)); // darker while the title is up
      const X = (x: number) => W / 2 + (x - W / 2) * k;
      const Y = (y: number) => H / 2 + (y - H / 2) * k;

      // beat 1: every column but the middle one runs upward like a feed, each at its own pace
      for (let col = 0; col < cols; col++) {
        const speed = col === mid ? 0 : (0.55 + ((col * 37) % 10) / 16) * (W / 1440) * 90;
        offsets[col] = (offsets[col] ?? (col === mid ? 0 : col * 131)) + speed * dt * (1 - stop);
      }
      if (others > 0) {
        g.globalAlpha = others;
        for (let col = 0; col < cols; col++) {
          const x = W / 2 + (col - mid) * (tw + gap) - tw / 2;
          const stagger = col === mid ? 0 : (col % 2 ? step * 0.5 : 0);
          const off = offsets[col] - stagger;
          // tile j sits at y = top0 + j·step − off; draw the ones between just above and just below the screen
          const top0 = H / 2 - th / 2;
          const jMin = Math.floor((off - top0 - th) / step);
          const jMax = Math.ceil((off + H - top0) / step);
          for (let j = jMin; j <= jMax; j++) {
            const y = top0 + j * step - off;
            if (col === mid && j === 0) continue; // the middle phone is the real video
            const sx = X(x);
            const sy = Y(y);
            const w = tw * k;
            const h = th * k;
            if (sy > H || sy + h < 0 || sx > W || sx + w < 0) continue;
            const v = vids[(((col * 7 + j * 3) % vids.length) + vids.length) % vids.length];
            g.save();
            g.beginPath();
            g.roundRect(sx, sy, w, h, w * 0.07);
            g.clip();
            g.fillStyle = "#16181e";
            g.fillRect(sx, sy, w, h);
            if (v.readyState >= 2) g.drawImage(v, sx, sy, w, h);
            g.restore();
          }
        }
        g.globalAlpha = 1;
      }
      if (dim > 0) {
        g.fillStyle = `rgba(5,5,5,${dim})`;
        g.fillRect(0, 0, W, H);
      }

      // the middle phone, our ad, always on top and at full quality
      const hw = tw * k;
      const hh = th * k;
      const hs = hero.current!.style;
      hs.width = `${hw}px`;
      hs.height = `${hh}px`;
      hs.left = `${W / 2 - hw / 2}px`;
      hs.top = `${H / 2 - hh / 2}px`;
      hs.borderRadius = `${hw * 0.07}px`;

      // the words
      label.current!.style.opacity = String(1 - span(p, 0.06, 0.14));
      const t = span(p, 0.2, 0.25); // lands as the feeds come to a stop
      const out = span(p, 0.3, 0.38);
      title.current!.style.opacity = String(t * (1 - out));
      title.current!.style.transform = `translate(-50%, -50%) scale(${1.25 - 0.25 * ease(t)}) translateY(${-out * 2}em)`;
      const sd = span(p, 0.62, 0.78);
      side.current!.style.opacity = String(sd);
      side.current!.style.transform = `translateY(${(1 - sd) * 1.5}em)`;

      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      for (const v of [...vids, heroVideo.current!]) (visible ? v.play().catch(() => {}) : v.pause());
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(stage.current!);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      vids.forEach((v) => (v.pause(), v.removeAttribute("src"), v.load()));
    };
  }, []);

  return (
    // keeps the proof band's anchor + layer: the companion cube's journey steers by it (HomeCanvas)
    <Section theme="dark" size="none" anchor="proof" className={`z-[6] ${s.section}`}>
      <div ref={pin} className={s.pin}>
        <div ref={stage} className={s.stage}>
          <canvas ref={canvas} className={s.canvas} />
          <div ref={hero} className={s.hero}>
            <video ref={heroVideo} className={s.media} src={`/media/ugc/${HERO}.mp4`} muted loop playsInline preload="auto" />
            <span className={s.ours}>
              <i /> BigSquare
            </span>
          </div>
          <p ref={label} className={s.label}>
            Everyone&apos;s scrolling.
          </p>
          <h2 ref={title} className={s.title}>
            {COPY.ugcTitle}
          </h2>
          <div ref={side} className={s.side}>
            <span className={s.kind}>
              <i />
              Creator ad
            </span>
            <p>{COPY.ugcText}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
