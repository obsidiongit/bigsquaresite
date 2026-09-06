import type * as THREE from "three";

export type LookId = "glass" | "ink" | "tracing";

export type LookFrame = {
  time: number;
  flat: number;
  width: number;
  height: number;
  dpr: number;
  camera: THREE.PerspectiveCamera;
};

export type CubeLook = {
  object: THREE.Group;
  ground: THREE.Object3D;
  lights: THREE.Object3D[];
  update(frame: LookFrame): void;
  beforeRender?(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
  ): void;
  dispose(): void;
};

/** One epoch, pose and pointer shared by all three independent renderers. */
export type StudyControls = {
  flat: number;
  playing: boolean;
  time: number;
  epoch: number;
  pointer: { x: number; y: number };
};

export type FrameStats = {
  cpuMs: number;
  gpuMs: number | null;
  frameMs: number;
  p95Ms: number;
  dpr: number;
  frames: number;
  steps: { from: number; to: number; frameMs: number }[];
};
