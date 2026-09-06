import type { Metadata } from "next";
import CubeSandbox from "@/components/sections/home/cube/CubeSandbox";

export const metadata: Metadata = {
  title: "Cube material studies",
  robots: { index: false, follow: false },
};

export default function CubePage() {
  return <CubeSandbox />;
}
