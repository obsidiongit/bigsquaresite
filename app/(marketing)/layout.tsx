import { Nav } from "@/components/shared/Nav";

/* Marketing chrome: the fixed nav mounts here, not in the root layout,
   so future /go/, /apply/, and /thanks/ funnel routes (no nav, no
   footer per their templates) stay outside it. The footer joins in
   Phase 2I. */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
