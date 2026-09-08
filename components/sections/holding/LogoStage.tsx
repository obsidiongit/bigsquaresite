"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useWebGLSupport } from "@/components/motion/useWebGLSupport";
import { Logo } from "@/components/shared/Logo";

const LogoCanvas = dynamic(() => import("./LogoCanvas"), {
  ssr: false,
  loading: () => null,
});

export function LogoStage() {
  const reduced = useReducedMotionSafe();
  const webgl = useWebGLSupport();
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onVisibility = () => setPageVisible(!document.hidden);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const live = mounted && !reduced && webgl !== false;

  return (
    <div
      ref={root}
      className="relative aspect-square w-full max-w-[560px] lg:max-w-none"
    >
      {live ? (
        <LogoCanvas
          pointer={pointer.current}
          active={visible && pageVisible}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <Logo className="size-32 md:size-40" />
        </div>
      )}
    </div>
  );
}
