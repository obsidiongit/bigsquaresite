import type { Metadata } from "next";
import { TunnelPage } from "@/components/sections/home/tunnel/TunnelPage";

export const metadata: Metadata = {
  title: "Tunnel: direction C, full page",
  robots: { index: false, follow: false },
};

/* Direction C as a full homepage sketch (2026-09-23). */
export default function TunnelPrototypePage() {
  return <TunnelPage />;
}
