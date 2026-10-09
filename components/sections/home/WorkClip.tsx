"use client";

import { useEffect, useRef } from "react";
import { REEL_VIDEO_SMALL } from "@/components/sections/home/media";

/* A short loop cut from the BigSquare showreel, filling a Featured work
   card until its real case film lands (formerly review toggle "cards").
   Each card plays its own window of the reel; only cards on screen
   decode. `dots` draws the clip as the film's rounded-square dots
   (2D canvas: one square per 8px cell, sized by brightness). */

/* [start, end] seconds in showreel-540.mp4, picked off a contact sheet */
const WINDOWS: [number, number][] = [
  [16, 19.5], // camera in the woods
  [24.6, 27.1], // supermarket car park (cut-tight 2026-10-09: the old window opened on the spray-bottle shot)
  [30, 33.5], // burger posters
  [36, 39.5], // three friends
  [42, 45.5], // spoon close-up
  [45.35, 47.2], // the cat and the glass (cut-tight 2026-10-09: the old window ran dog, cat, title card)
  // extra windows for the interior media slots (the interior media slots, SlotFill)
  [12, 15], // street + sitting
  [22, 25.5], // laptop and apps
  [34, 36.5], // the surprised face
  [46, 49], // the cat
  [56, 58], // portrait at home
  [1, 3.5], // "we stop thumbs"
];

const CELL = 8;

/* `play` (2026-10-09, the calmer featured work grid): undefined plays the
   clip whenever it is on screen; a boolean plays it only while true
   (hover to play), resting on its first frame otherwise. */
export function WorkClip({ index, dots = false, play }: { index: number; dots?: boolean; play?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playRef = useRef(play);
  const checkRef = useRef<() => void>(() => {});
  const [from, to] = WINDOWS[index % WINDOWS.length];

  useEffect(() => {
    playRef.current = play;
    checkRef.current();
  }, [play]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let visible = false;
    const seekStart = () => {
      if (v.currentTime < from || v.currentTime > to) v.currentTime = from;
    };
    const onTime = () => {
      if (v.currentTime >= to) v.currentTime = from;
    };
    /* the #t= fragment can land on the keyframe before `from` (a frame of
       the previous shot); one exact seek once data is in fixes the rest
       frame for cards that wait to be pointed at */
    const settle = () => {
      if (v.paused) v.currentTime = from + 0.04;
    };
    v.addEventListener("loadedmetadata", seekStart);
    v.addEventListener("loadeddata", settle);
    v.addEventListener("timeupdate", onTime);
    /* on-screen check by polling the rect: an IntersectionObserver
       misses re-entries inside the section's sticky pin */
    const check = () => {
      const r = v.getBoundingClientRect();
      // the TV hero covers the section under it until its reveal (data-hero-cover on <html>)
      const covered = document.documentElement.dataset.heroCover === "1";
      const now = !covered && playRef.current !== false && r.width > 0 && r.bottom > -120 && r.top < window.innerHeight + 120;
      if (now && (!visible || v.paused)) {
        seekStart();
        v.play().catch(() => {});
      } else if (!now && visible) v.pause();
      visible = now;
    };
    checkRef.current = check;
    const poll = window.setInterval(check, 250);
    check();

    // dots: redraw from the video every frame while it is on screen
    let raf = 0;
    const cvs = canvasRef.current;
    const small = document.createElement("canvas");
    const sctx = small.getContext("2d", { willReadFrequently: true });
    let lastT = -1;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (v.currentTime === lastT && cvs?.width) return; // no new frame yet
      lastT = v.currentTime;
      if (!dots || !cvs || !sctx || !visible || v.readyState < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = cvs.clientWidth, h = cvs.clientHeight;
      if (!w || !h) return;
      if (cvs.width !== Math.round(w * dpr)) {
        cvs.width = Math.round(w * dpr);
        cvs.height = Math.round(h * dpr);
      }
      const cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL);
      small.width = cols;
      small.height = rows;
      // cover-fit the video into the cell grid
      const va = v.videoWidth / v.videoHeight, ca = cols / rows;
      let sw = v.videoWidth, sh = v.videoHeight;
      if (va > ca) sw = sh * ca;
      else sh = sw / ca;
      sctx.drawImage(v, (v.videoWidth - sw) / 2, (v.videoHeight - sh) / 2, sw, sh, 0, 0, cols, rows);
      const px = sctx.getImageData(0, 0, cols, rows).data;
      const ctx = cvs.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // 1) every dot as one path (sizes from brightness), 2) the cell
      // colours painted into it as a pixelated video, 3) dark ground under
      ctx.beginPath();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const l = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
          const size = Math.sqrt(Math.min(1, Math.max(0, (l - 0.5) * 1.1 + 0.68)));
          if (size < 0.03) continue;
          const hs = 0.5 * CELL * (0.12 + 0.84 * size);
          ctx.roundRect(x * CELL + CELL / 2 - hs, y * CELL + CELL / 2 - hs, hs * 2, hs * 2, hs * 0.35);
        }
      }
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.globalCompositeOperation = "source-in";
      ctx.imageSmoothingEnabled = false;
      ctx.filter = "brightness(1.2)";
      ctx.drawImage(small, 0, 0, cols * CELL, rows * CELL);
      ctx.filter = "none";
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#06080c";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    };
    if (dots) draw();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(poll);
      v.removeEventListener("loadedmetadata", seekStart);
      v.removeEventListener("loadeddata", settle);
      v.removeEventListener("timeupdate", onTime);
      v.pause();
    };
  }, [from, to, dots]);

  return (
    <>
      <video
        ref={videoRef}
        src={`${REEL_VIDEO_SMALL}#t=${from}`}
        muted
        playsInline
        preload={play === undefined ? "metadata" : "auto"}
        aria-hidden
        className={"absolute inset-0 h-full w-full object-cover" + (dots ? " opacity-0" : "")}
      />
      {dots && <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />}
    </>
  );
}
