"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  K,
  cameraPose,
  computeLayout,
  seg,
  type Pose,
} from "@/lib/cube/path";
import { createWorld, type WorldMedia } from "@/lib/cube/world";

/* WorldCanvas (cube-v2/brief.md section 6, rounds 1 and 2): the hero
   world on a page-level fixed canvas. Round 2: the runway's progress
   (read off [data-world-runway] each frame, damped by HomeCanvas's
   follower: 4.5/s, 12/s once past the hero) drives lib/cube/path.ts.
   The camera does the moving; the world rolls the cube and lights the
   film. The pointer adds a damped 1.5 degree yaw / 1 degree pitch that
   fades out as the camera goes over the top, so the framed panel's
   edges stay dead straight. Objects never tilt. */

export type WorldStats = { frameMs: number; dpr: number; raw: number; sp: number };

type Props = {
  onStats?: (s: WorldStats) => void;
  /** pointer in -1..1, written by the host */
  pointer: { x: number; y: number };
  poster: string;
  video: string | null;
};

/* ---- the brand film (HomeCanvas useFilmMedia, copied: poster first,
   the video cross-fades in once genuinely playing) ------------------- */

type FilmMedia = {
  tex: { current: THREE.Texture | null };
  poster: { current: THREE.Texture | null };
  mix: { current: number };
  ready: { current: boolean };
  dims: { current: { w: number; h: number } };
};

function useFilmMedia(posterSrc: string, videoSrc: string | null, playing: boolean): FilmMedia {
  const media = useMemo<FilmMedia>(
    () => ({
      tex: { current: null },
      poster: { current: null },
      mix: { current: 0 },
      ready: { current: false },
      dims: { current: { w: 16, h: 9 } },
    }),
    [],
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const tex = new THREE.TextureLoader().load(posterSrc, (t) => {
      media.dims.current = { w: t.image.width, h: t.image.height };
    });
    tex.colorSpace = THREE.NoColorSpace;
    media.poster.current = tex;
    if (!media.tex.current) media.tex.current = tex;
    return () => tex.dispose();
  }, [posterSrc, media]);

  useEffect(() => {
    if (!videoSrc) return;
    const el = document.createElement("video");
    el.src = videoSrc;
    el.muted = true;
    el.loop = true;
    el.playsInline = true;
    el.preload = "auto";
    el.crossOrigin = "anonymous";
    videoRef.current = el;
    let tex: THREE.VideoTexture | null = null;
    const onPlaying = () => {
      if (!tex) {
        tex = new THREE.VideoTexture(el);
        tex.colorSpace = THREE.NoColorSpace;
        media.tex.current = tex;
        media.dims.current = { w: el.videoWidth, h: el.videoHeight };
      }
      media.ready.current = true;
    };
    el.addEventListener("playing", onPlaying);
    el.play().catch(() => {});
    return () => {
      el.removeEventListener("playing", onPlaying);
      el.pause();
      el.removeAttribute("src");
      el.load();
      tex?.dispose();
      videoRef.current = null;
    };
  }, [videoSrc, media]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (playing) el.play().catch(() => {});
    else el.pause();
  }, [playing]);

  return media;
}

function WorldScene({ onStats, pointer, poster, video }: Props) {
  const { gl, camera, size } = useThree();
  const world = useMemo(createWorld, []);
  const media = useFilmMedia(poster, video, true);
  const layout = useMemo(() => computeLayout(size.width, size.height), [size.width, size.height]);
  const scroll = useRef({ raw: 0, sp: 0 });
  const yaw = useRef({ x: 0, y: 0 });
  const meter = useRef({ acc: 0, n: 0, last: 0 });
  const runway = useRef<HTMLElement | null>(null);
  const pose = useMemo<Pose>(
    () => ({ target: new THREE.Vector3(), dist: 7, el: 0.3, az: 0, fx: 0, fy: 0 }),
    [],
  );
  const basis = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      right: new THREE.Vector3(),
      forward: new THREE.Vector3(),
      up: new THREE.Vector3(),
      media: { tex: null, poster: null, mix: 0, dims: { w: 16, h: 9 } } as WorldMedia,
    }),
    [],
  );

  useEffect(() => () => world.dispose(), [world]);

  useFrame((state, delta) => {
    const cam = camera as THREE.PerspectiveCamera;

    /* runway progress: 0 with the wrapper's top pinned, 1 released
       (Hero.tsx's wrapper contract); reads only, during rAF */
    if (!runway.current) runway.current = document.querySelector<HTMLElement>("[data-world-runway]");
    const s = scroll.current;
    const el = runway.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const denom = r.height - window.innerHeight;
      s.raw = denom > 0 ? Math.min(1, Math.max(0, -r.top / denom)) : 0;
    }
    /* damped follower (HomeCanvas Tracker, copied): 4.5/s, converging
       fast once the page is past the hero so a flicked scroll never
       replays the film over the sections */
    const rate = s.raw >= 1 ? 12 : 4.5;
    const k = 1 - Math.exp(-rate * Math.min(delta, 0.1));
    s.sp += (s.raw - s.sp) * k;
    if (Math.abs(s.raw - s.sp) < 0.0005) s.sp = s.raw;
    const p = Math.min(1, s.sp / K);
    const c = seg(s.sp, [K, 1]);

    cameraPose(p, c, layout, pose);

    /* pointer parallax on the camera, gone once it is over the top */
    const damp = 1 - Math.pow(0.9, Math.min(delta, 0.1) * 60);
    yaw.current.x += (pointer.x * 0.026 - yaw.current.x) * damp;
    yaw.current.y += (pointer.y * 0.017 - yaw.current.y) * damp;
    const flat = 1 - Math.min(1, Math.max(0, (pose.el - 1.1) / 0.4));
    const az = pose.az + yaw.current.x * flat;
    const elev = pose.el - yaw.current.y * flat;
    basis.pos
      .set(Math.sin(az) * Math.cos(elev), Math.sin(elev), Math.cos(az) * Math.cos(elev))
      .multiplyScalar(pose.dist)
      .add(pose.target);
    /* an explicit basis so the top-down shot has a defined screen-up
       (the road runs up the frame) where lookAt's world-up would fail */
    basis.right.set(Math.cos(az), 0, -Math.sin(az));
    basis.forward.subVectors(pose.target, basis.pos).normalize();
    basis.up.crossVectors(basis.right, basis.forward).normalize();
    cam.position.copy(basis.pos);
    cam.up.copy(basis.up);
    cam.lookAt(pose.target);
    cam.setViewOffset(size.width, size.height, -pose.fx * size.width, pose.fy * size.height, size.width, size.height);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();

    /* poster -> film crossfade, eased in time not scroll */
    media.mix.current += ((media.ready.current ? 1 : 0) - media.mix.current) * 0.06;
    basis.media.tex = media.tex.current;
    basis.media.poster = media.poster.current;
    basis.media.mix = media.mix.current;
    basis.media.dims = media.dims.current;

    world.update({
      time: state.clock.elapsedTime,
      dpr: gl.getPixelRatio(),
      width: size.width,
      height: size.height,
      camera: cam,
      p,
      c,
      el: elev,
      layout,
      media: basis.media,
    });

    const m = meter.current;
    m.acc += delta * 1000;
    m.n++;
    const now = performance.now();
    if (now - m.last > 500 && m.n > 0) {
      onStats?.({ frameMs: m.acc / m.n, dpr: gl.getPixelRatio(), raw: s.raw, sp: s.sp });
      m.acc = 0;
      m.n = 0;
      m.last = now;
    }
  });

  return <primitive object={world.group} />;
}

export default function WorldCanvas(props: Props) {
  return (
    <Canvas
      aria-hidden
      flat
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 1.5]}
      camera={{ fov: 30, near: 0.1, far: 80, position: [0, 2, 5.6] }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <WorldScene {...props} />
    </Canvas>
  );
}
