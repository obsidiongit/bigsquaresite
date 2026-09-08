import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SquareField } from "@/components/motion/SquareField";
import {
  HoldingChrome,
  HoldingFooter,
} from "@/components/sections/holding/HoldingChrome";

/* Holding deploy: the full marketing chrome (nav, footer, sound,
   page veil) stays on the full-site branch. This layout is a quiet
   bar, the ambient square field, and a thin footer so the 3D mark
   and the two forms own the page. */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SmoothScroll />
      <SquareField />
      <HoldingChrome />
      {children}
      <HoldingFooter />
    </>
  );
}
