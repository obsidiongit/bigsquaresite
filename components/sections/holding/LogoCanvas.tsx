"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createLogoLook } from "@/lib/cube/logo";

type Pointer = { x: number; y: number };

function LogoScene({ pointer, active }: { pointer: Pointer; active: boolean }) {
  const { gl, camera, scene, setDpr } = useThree();
  const look = useMemo(() => createLogoLook(), []);
  const tilt = useRef({ x: 0, y: 0 });
  const slow = useRef(0);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    pmrem.dispose();
    return () => {
      if (scene.environment === env) scene.environment = null;
      env.dispose();
      look.dispose();
    };
  }, [gl, scene, look]);

  useFrame((state, delta) => {
    if (!active) return;
    const cam = camera as THREE.PerspectiveCamera;
    const damp = 1 - Math.pow(0.95, Math.min(delta, 0.1) * 60);
    tilt.current.x += (pointer.x * 0.16 - tilt.current.x) * damp;
    tilt.current.y += (pointer.y * 0.1 - tilt.current.y) * damp;

    const t = state.clock.elapsedTime;
    look.object.rotation.set(
      0.18 + tilt.current.y,
      t * 0.22 + 0.35 + tilt.current.x,
      0,
    );

    const az = THREE.MathUtils.degToRad(20);
    const el = THREE.MathUtils.degToRad(12);
    cam.position.set(
      Math.sin(az) * Math.cos(el) * 2.05,
      Math.sin(el) * 2.05 + 0.04,
      Math.cos(az) * Math.cos(el) * 2.05,
    );
    cam.lookAt(0, 0, 0);
    cam.updateMatrixWorld();

    look.update({
      time: t,
      flat: 0,
      width: state.size.width,
      height: state.size.height,
      dpr: gl.getPixelRatio(),
      camera: cam,
    });

    if (delta > 0.034) slow.current += 1;
    else slow.current = Math.max(0, slow.current - 2);
    const dpr = gl.getPixelRatio();
    if (slow.current > 45 && dpr > 1) {
      setDpr(Math.max(1, dpr - 0.25));
      slow.current = 0;
    }
  });

  return (
    <>
      <primitive object={look.object} dispose={null} />
      {look.lights.map((light) => (
        <primitive key={light.uuid} object={light} dispose={null} />
      ))}
    </>
  );
}

export default function LogoCanvas({
  pointer,
  active,
}: {
  pointer: Pointer;
  active: boolean;
}) {
  return (
    <Canvas
      aria-hidden
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 40, position: [0.7, 0.42, 1.9], near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      className="absolute inset-0"
      style={{ pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.72;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.setClearColor(0xf5f6f8, 0);
      }}
      fallback={null}
    >
      <LogoScene pointer={pointer} active={active} />
    </Canvas>
  );
}
