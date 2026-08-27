import { PageTransitions } from "@/components/motion/PageTransitions";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SoundProvider } from "@/components/sound/SoundProvider";
import { Footer } from "@/components/shared/Footer";
import { Nav } from "@/components/shared/Nav";

/* Marketing chrome: the fixed nav and the shared footer mount here, not
   in the root layout, so future /go/, /apply/, and /thanks/ funnel
   routes (no nav, no footer per their templates) stay outside them.
   SmoothScroll is the damped scroll instrument + scrollbar (STYLE_GUIDE
   7.1, revised 2026-08-24); funnel routes can adopt it later by
   mounting it in their own layouts. SoundProvider is the sitewide sfx
   wiring and PageTransitions the intro/route veil (STYLE_GUIDE 7.11 /
   7.12); both are marketing-scoped for the same funnel reason. */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SmoothScroll />
      <SoundProvider />
      <PageTransitions />
      <Nav />
      {children}
      <Footer />
    </>
  );
}
