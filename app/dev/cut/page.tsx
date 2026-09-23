import type { Metadata } from "next";
import { CutPage } from "@/components/sections/home/cut/CutPage";

export const metadata: Metadata = {
  title: "Cut type: direction B, full page",
  robots: { index: false, follow: false },
};

/* Direction B as a full homepage sketch (2026-09-23). */
export default function CutPrototypePage() {
  return <CutPage />;
}
