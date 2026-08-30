import type { Metadata } from "next";
import { Footer } from "@/components/shared/Footer";
import { Nav } from "@/components/shared/Nav";
import { SoundProvider } from "@/components/sound/SoundProvider";
import { NotFoundStage } from "./NotFoundStage";

/* The 404 (Pane A, 2026-08-30). Lives at the app root so it catches
   every unmatched URL and every notFound() thrown below it, which
   also means it renders OUTSIDE the marketing layout: the Nav, the
   Footer, and the sound wiring mount here directly so the page still
   looks like the site. The stage itself is app/NotFoundStage.tsx. */

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "That page is not here. Head home or get in touch.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SoundProvider />
      <Nav />
      <NotFoundStage />
      <Footer />
    </>
  );
}
