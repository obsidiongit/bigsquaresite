import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Nav } from "@/components/shared/Nav";

/* Marketing chrome: the fixed nav mounts here, not in the root layout,
   so future /go/, /apply/, and /thanks/ funnel routes (no nav, no
   footer per their templates) stay outside it. The footer joins in
   Phase 2I. SmoothScroll is the damped scroll instrument + scrollbar
   (STYLE_GUIDE 7.1, revised 2026-08-24); funnel routes can adopt it
   later by mounting it in their own layouts. */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SmoothScroll />
      <Nav />
      {children}
    </>
  );
}
