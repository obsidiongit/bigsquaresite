import type { Metadata } from "next";
import { PageTransitions } from "@/components/motion/PageTransitions";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SoundProvider } from "@/components/sound/SoundProvider";

/* Funnel chrome (Batch 3): /go/, /apply/, and /thanks/ are ad
   destinations. No marketing Nav, no Footer, no sound toggle; the
   pages carry their own logo mark and fine print. The route group
   keeps the URLs (/go/[slug]/ ...) while giving them this layout
   instead of app/(marketing)/layout.tsx. What still mounts: the
   damped scroll instrument, the sitewide click/hover sfx wiring, and
   the intro/route veil (7.12 is marketing-scoped by default; without
   its own mount here the veil would unmount mid-swap on the way to
   /schedule/). UtmCapture and Analytics live in the root layout.

   Every route here is noindex, nofollow (decisions.md: funnel
   indexability) and never enters app/sitemap.ts; robots.ts disallows
   the three prefixes as well. Pages restate robots in their own
   metadata so a future title-only override cannot drop it. */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function FunnelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SmoothScroll />
      <SoundProvider />
      <PageTransitions />
      {children}
    </>
  );
}
