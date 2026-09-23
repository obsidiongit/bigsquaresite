import type { Metadata } from "next";
import { BlocksFilm } from "@/components/sections/home/blocks/BlocksFilm";

export const metadata: Metadata = {
  title: "Blocks: one team, every channel",
  robots: { index: false, follow: false },
};

/* Prototype (2026-09-23): one set of blocks rebuilds into each thing we
   make as you scroll. Judged here before it goes anywhere near the homepage. */
export default function BlocksPage() {
  return <BlocksFilm />;
}
