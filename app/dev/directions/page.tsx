import type { Metadata } from "next";
import { Directions } from "@/components/sections/home/directions/Directions";

export const metadata: Metadata = {
  title: "Directions: three abstract takes",
  robots: { index: false, follow: false },
};

/* Three one-screen directions to react to (2026-09-23). */
export default function DirectionsPage() {
  return <Directions />;
}
