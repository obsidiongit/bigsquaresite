import type { Metadata } from "next";
import { WindowPage } from "@/components/sections/home/window/WindowPage";

export const metadata: Metadata = {
  title: "Window: the square that carries the work",
  robots: { index: false, follow: false },
};

/* Prototype (2026-09-23): a native-scrolling homepage where the logo's
   square is a window that always plays real work and changes shape to
   fit each section. Judged here before it goes near the homepage. */
export default function WindowPrototypePage() {
  return <WindowPage />;
}
