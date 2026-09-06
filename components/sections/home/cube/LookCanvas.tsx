"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { createGlassLook } from "@/lib/cube/glass";
import { createInkLook } from "@/lib/cube/ink";
import { createFrameMeter } from "@/lib/cube/performance";
import type { FrameStats, LookId, StudyControls } from "@/lib/cube/types";

type Props = {
  look: LookId;
  controls: StudyControls;
  active: boolean;
  onStats: (look: LookId, stats: FrameStats) => void;
  onFailure: (look: LookId) => void;
};

function StudyScene({ look, controls, active, onStats }: Props) {
  const { gl, scene, camera, setDpr } = useThree();
  const resources = useMemo(() => {
    const geometry = new RoundedBoxGeometry(1, 1, 1, 4, 0.06);
    const study = look === "glass" ? createGlassLook(geometry) : createInkLook(geometry, look === "tracing");
    return { geometry, study };
  }, [look]);
  const meter = useMemo(() => createFrameMeter(gl.getContext() as WebGL2RenderingContext), [gl]);
  const timing = useRef({ slow: 0, lastReport: 0, steps: [] as FrameStats["steps"] });
  const tilt = useRef({ x: 0, y: 0 });
  const scratch = useMemo(() => ({ zero: new THREE.Vector3(), rotation: new THREE.Matrix4() }), []);

  useEffect(() => {
    camera.position.set(0, 1.3, 4.0);
    camera.lookAt(0, 0.05, 0);
    camera.updateMatrixWorld();
    return () => {
      resources.study.dispose();
      resources.geometry.dispose();
      meter.dispose();
    };
  }, [camera, resources, meter]);

  useEffect(() => { timing.current.slow = 0; }, [active]);

  // Positive priority owns the final render so GPU/CPU measurement includes all passes.
  useFrame((state, delta) => {
    const now = performance.now();
    const time = controls.time + (controls.playing ? (now - controls.epoch) / 1000 : 0);
    const flat = controls.flat;
    const object = resources.study.object;
    // Match HomeCanvas's rest pointer response (0.2 / 0.28 rad, 0.05 at 60Hz).
    const damp = 1 - Math.pow(0.95, Math.min(delta, 0.1) * 60);
    tilt.current.x += (controls.pointer.y * 0.2 - tilt.current.x) * damp;
    tilt.current.y += (controls.pointer.x * 0.28 - tilt.current.y) * damp;
    const rest = 1 - flat;
    object.rotation.set(
      (0.44 + tilt.current.x) * rest,
      (0.72 + time * 0.15 * Math.PI * 2 + tilt.current.y) * rest,
      -0.1 * rest,
    );
    object.scale.set(1 + 0.65 * flat, 1 + (1.65 * 9 / 16 - 1) * flat, 1 - 0.965 * flat);
    // Rounded-box support function: box half-edge .44 plus a radius-.06 sphere.
    scratch.rotation.compose(scratch.zero, object.quaternion, object.scale);
    const e = scratch.rotation.elements;
    const support = 0.44 * (Math.abs(e[1]) + Math.abs(e[5]) + Math.abs(e[9])) + 0.06 * Math.hypot(e[1], e[5], e[9]);
    object.position.y = -0.5 + support;
    object.updateMatrixWorld(true);
    resources.study.update({ time, flat, width: state.size.width, height: state.size.height, dpr: gl.getPixelRatio(), camera: camera as THREE.PerspectiveCamera });

    meter.begin();
    resources.study.beforeRender?.(gl, scene, camera as THREE.PerspectiveCamera);
    gl.render(scene, camera);
    meter.end(delta);

    const watch = timing.current;
    if (delta > 0.034) watch.slow++;
    else watch.slow = Math.max(0, watch.slow - 2);
    const dpr = gl.getPixelRatio();
    if (watch.slow > 45 && dpr > 1) {
      const next = Math.max(1, dpr - 0.25);
      const stats = meter.snapshot(dpr, watch.steps);
      watch.steps.push({ from: dpr, to: next, frameMs: stats.frameMs });
      console.info(`[cube:${look}] DPR ${dpr} -> ${next}; ${stats.frameMs.toFixed(2)} ms/frame`);
      watch.slow = 0;
      setDpr(next);
    }
    if (now - watch.lastReport > 1000) {
      watch.lastReport = now;
      onStats(look, meter.snapshot(gl.getPixelRatio(), watch.steps));
    }
  }, 1);

  return <>
    <primitive object={resources.study.object} dispose={null} />
    <primitive object={resources.study.ground} dispose={null} />
    {resources.study.lights.map((light) => <primitive key={light.uuid} object={light} dispose={null} />)}
  </>;
}

export default function LookCanvas(props: Props) {
  return <Canvas
    aria-label={`${props.look} cube material study`}
    flat
    shadows="basic"
    dpr={1.5}
    frameloop={props.active ? "always" : "never"}
    camera={{ fov: 30, position: [0, 1.3, 4], near: 0.1, far: 40 }}
    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    onCreated={({ gl }) => {
      gl.setClearColor(0xf5f6f8, 0);
      gl.transmissionResolutionScale = 0.5;
      const context = gl.getContext();
      const debug = context.getExtension("WEBGL_debug_renderer_info");
      gl.domElement.dataset.renderer = debug ? String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : String(context.getParameter(context.RENDERER));
      gl.domElement.addEventListener("webglcontextlost", () => props.onFailure(props.look), { once: true });
    }}
    fallback={<p>WebGL is unavailable in this browser.</p>}
  ><StudyScene {...props} /></Canvas>;
}
