import type { Metadata } from "next";
import { MixPage } from "@/components/sections/home/mix/MixPage";

export const metadata: Metadata = {
  title: "Mix: one system, a different technique per section",
  robots: { index: false, follow: false },
};

/* The mix sketch (2026-09-23): no single effect carries the page. */
export default function MixPrototypePage() {
  return <MixPage />;
}
