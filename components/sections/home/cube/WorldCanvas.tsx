"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createWorld } from "@/lib/cube/world";

/* WorldCanvas (cube-v2/brief.md section 6, round 1): the hero world at
   rest on a page-level fixed canvas. Round 1 has no scroll: the camera
   holds the rest composition and answers the pointer with a damped
   1.5 degree yaw / 1 degree pitch around its target. Objects never
   tilt. Round 2 adds the scroll-driven camera path. */

export type WorldStats = { frameMs: number; dpr: number };

type Props = {
  onStats?: (s: WorldStats) => void;
  /** pointer in -1..1, written by the host */
  pointer: { x: number; y: number };
};

/* Rest framing. The protagonist (1 unit at the origin) should fill
   about 40 percent of the viewport height at 1440 and sit right of the
   headline, its shadow running under the last line. The camera looks
   at the cube's foot; the view offset pushes the projection so the
   origin lands at (fx, fy) of the frame from center. Narrow viewports
   pull the camera back and center the cube higher, above the 5-line
   headline. */
function framing(width: number, height: number) {
  const narrow = width < 768;
  /* desktop: the lower-right open area, right of "you can count." and
     above the statement's row; mobile: the band above the 5-line
     headline, small */
  return {
    distance: narrow ? 12 : 7.2,
    elevation: narrow ? 0.42 : 0.34, /* radians above the ground plane */
    fx: narrow ? 0.2 : 0.37,
    fy: narrow ? 0.37 : -0.05,
    target: new THREE.Vector3(0, -0.1, 0),
  };
}

function WorldScene({ onStats, pointer }: Props) {
  const { gl, camera, size } = useThree();
  const world = useMemo(createWorld, []);
  const yaw = useRef({ x: 0, y: 0 });
  const meter = useRef({ acc: 0, n: 0, last: 0 });
  const basis = useMemo(() => ({ pos: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0) }), []);

  useEffect(() => () => world.dispose(), [world]);

  useFrame((state, delta) => {
    const cam = camera as THREE.PerspectiveCamera;
    const f = framing(size.width, size.height);
    const damp = 1 - Math.pow(0.9, Math.min(delta, 0.1) * 60);
    yaw.current.x += (pointer.x * 0.026 - yaw.current.x) * damp;
    yaw.current.y += (pointer.y * 0.017 - yaw.current.y) * damp;
    const az = 0.12 + yaw.current.x; /* a touch off-axis so the cube shows two faces */
    const el = f.elevation - yaw.current.y;
    basis.pos.set(
      Math.sin(az) * Math.cos(el) * f.distance,
      Math.sin(el) * f.distance,
      Math.cos(az) * Math.cos(el) * f.distance,
    ).add(f.target);
    cam.position.copy(basis.pos);
    cam.up.copy(basis.up);
    cam.lookAt(f.target);
    cam.setViewOffset(size.width, size.height, -f.fx * size.width, f.fy * size.height, size.width, size.height);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();

    world.update({
      time: state.clock.elapsedTime,
      dpr: gl.getPixelRatio(),
      width: size.width,
      height: size.height,
      camera: cam,
    });

    const m = meter.current;
    m.acc += delta * 1000;
    m.n++;
    const now = performance.now();
    if (now - m.last > 1000 && m.n > 0) {
      onStats?.({ frameMs: m.acc / m.n, dpr: gl.getPixelRatio() });
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
      shadows
      dpr={[1, 1.5]}
      camera={{ fov: 30, near: 0.1, far: 80, position: [0, 2, 5.6] }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <WorldScene {...props} />
    </Canvas>
  );
}
