"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { SquareField } from "@/components/motion/SquareField";
import type { FrameStats, LookId, StudyControls } from "@/lib/cube/types";
import styles from "./sandbox.module.css";

/* Material comparison on BigSquare paper. The specimens carry the visual work;
   Lenia labels and shared controls stay quiet. One common pose makes differences
   in surface, silhouette and shadow directly comparable. No homepage coupling. */
const LookCanvas = dynamic(() => import("./LookCanvas"), {
  ssr: false,
  loading: () => <p className={styles.fallback}>Loading material study…</p>,
});

const LOOKS: { id: LookId; name: string; description: string }[] = [
  { id: "glass", name: "Glass fixed", description: "Refracted glass. A blue volume within." },
  { id: "ink", name: "Two-tone ink", description: "Paper faces. Blue shadows. Drawn marks." },
  { id: "tracing", name: "Ink plus tracing paper", description: "The same ink, beneath a translucent sheet." },
];
type Selection = LookId | "all";
type StudyApi = {
  setFlat: (value: number) => void;
  setTime: (value: number) => void;
  setPlaying: (value: boolean) => void;
  setLook: (value: Selection) => void;
  stats: Partial<Record<LookId, FrameStats>>;
  controls: StudyControls;
};
declare global { interface Window { __cubeStudy?: StudyApi } }

function StudyView({ look, enabled, controls, onStats }: {
  look: typeof LOOKS[number]; enabled: boolean; controls: StudyControls;
  onStats: (look: LookId, stats: FrameStats) => void;
}) {
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [stats, setStats] = useState<FrameStats | null>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const report = useCallback((id: LookId, value: FrameStats) => {
    setStats(value);
    onStats(id, value);
  }, [onStats]);
  const failure = useCallback(() => setFailed(true), []);

  return <section ref={root} className={styles.study} aria-labelledby={`title-${look.id}`} data-look={look.id}>
    <h2 id={`title-${look.id}`}>{look.name}</h2>
    <p className={styles.description}>{look.description}</p>
    <div className={styles.canvas}>
      {failed ? <p className={styles.fallback}>The graphics context stopped. Reload to retry.</p> : enabled ?
        <LookCanvas look={look.id} controls={controls} active={visible && enabled} onStats={report} onFailure={failure} /> : null}
    </div>
    <div className={styles.metrics} aria-label={`${look.name} performance`} data-measured={Boolean(stats && stats.frames > 0)} data-stats={stats ? JSON.stringify(stats) : undefined}>
      <span>{stats && stats.frames > 0 ? `${stats.frameMs.toFixed(1)} ms/frame` : "Measuring…"}</span>
      <span>{stats?.gpuMs != null ? `GPU ${stats.gpuMs.toFixed(2)} ms` : stats && stats.frames > 0 ? `CPU ${stats.cpuMs.toFixed(2)} ms` : ""}</span>
      <span>DPR {stats?.dpr.toFixed(2) ?? "1.50"}</span>
    </div>
    {stats && stats.steps.length > 0 ? <p className={styles.step}>DPR stepped down at {stats.steps.at(-1)!.frameMs.toFixed(1)} ms/frame.</p> : null}
  </section>;
}

export default function CubeSandbox() {
  const controls = useRef<StudyControls>({ flat: 0, playing: true, time: 0, epoch: 0, pointer: { x: 0, y: 0 } }).current;
  const stats = useRef<Partial<Record<LookId, FrameStats>>>({});
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [flat, setFlatState] = useState(0);
  const [playing, setPlayingState] = useState(true);
  const [selection, setSelection] = useState<Selection>("all");

  const setFlat = useCallback((value: number) => {
    controls.flat = Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
    setFlatState(controls.flat);
  }, [controls]);
  const setTime = useCallback((value: number) => {
    controls.time = Number.isFinite(value) ? Math.max(0, value) : 0;
    controls.epoch = performance.now();
  }, [controls]);
  const setPlaying = useCallback((value: boolean) => {
    const now = performance.now();
    if (controls.playing) controls.time += (now - controls.epoch) / 1000;
    controls.epoch = now;
    controls.playing = value;
    setPlayingState(value);
  }, [controls]);
  const setLook = useCallback((value: Selection) => {
    if (value === "all" || LOOKS.some((look) => look.id === value)) setSelection(value);
  }, []);
  const onStats = useCallback((look: LookId, value: FrameStats) => { stats.current[look] = value; }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReduced(media.matches);
    const onVisibility = () => setPageVisible(!document.hidden);
    const onPointer = (event: PointerEvent) => {
      controls.pointer.x = event.clientX / window.innerWidth * 2 - 1;
      controls.pointer.y = event.clientY / window.innerHeight * 2 - 1;
    };
    controls.epoch = performance.now();
    if (params.has("flat")) setFlat(Number(params.get("flat")));
    if (params.has("t")) { setPlaying(false); setTime(Number(params.get("t"))); }
    if (params.has("look")) setLook(params.get("look") as Selection);
    onMotion(); onVisibility(); setReady(true);
    media.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    const api: StudyApi = { setFlat, setTime, setPlaying, setLook, stats: stats.current, controls };
    window.__cubeStudy = api;
    return () => {
      media.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      if (window.__cubeStudy === api) delete window.__cubeStudy;
    };
  }, [controls, setFlat, setLook, setPlaying, setTime]);

  const looks = selection === "all" ? LOOKS : LOOKS.filter((look) => look.id === selection);
  return <main className={styles.sandbox}>
    <SquareField />
    <header className={styles.header}>
      <a className={styles.brand} href="/">BigSquare<span aria-hidden className={styles.brandSquare} /></a>
      <div className={styles.actions}>
        <label className={styles.viewLabel}>View
          <select value={selection} onChange={(event) => setLook(event.target.value as Selection)}>
            <option value="all">All three looks</option>
            {LOOKS.map((look) => <option key={look.id} value={look.id}>{look.name}</option>)}
          </select>
        </label>
        <button onClick={() => setPlaying(!playing)} disabled={reduced} aria-pressed={!playing}>{playing ? "Pause turntable" : "Play turntable"}</button>
        <button onClick={() => { setTime(0); controls.pointer.x = 0; controls.pointer.y = 0; }} disabled={reduced}>Reset pose</button>
      </div>
    </header>
    <div className={styles.intro}>
      <h1>One square. Three surfaces.</h1>
      <p>Turn it. Flatten it. Choose from the object in motion.</p>
    </div>
    {reduced ? <p className={styles.reduced} role="status">Motion is reduced in your device settings. The 3D studies are off.</p> :
      <div className={`${styles.gallery} ${selection !== "all" ? styles.solo : ""}`}>
        {looks.map((look) => <StudyView key={look.id} look={look} enabled={ready && !reduced && pageVisible} controls={controls} onStats={onStats} />)}
      </div>}
    <footer className={styles.controls}>
      <div className={styles.sliderLabel}><label htmlFor="cube-flat">Flatten</label><output htmlFor="cube-flat">{flat.toFixed(2)}</output></div>
      <div className={styles.sliderRow}>
        <span>Cube</span>
        <input id="cube-flat" type="range" min="0" max="1" step="0.01" value={flat} disabled={reduced} onChange={(event) => setFlat(Number(event.target.value))} aria-valuetext={`${Math.round(flat * 100)} percent flat`} />
        <span>16:9 pane</span>
      </div>
      <div className={styles.footerMeta}>
        <p>Same geometry, camera and clock. 0.15 turns per second.</p>
        <div className={styles.presets} aria-label="Flatten presets">
          {[0, 0.5, 1].map((value) => <button key={value} disabled={reduced} aria-pressed={flat === value} onClick={() => setFlat(value)}>{value.toFixed(1)}</button>)}
        </div>
      </div>
    </footer>
  </main>;
}
