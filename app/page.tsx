import type { Metadata } from "next";
import { Logo } from "@/components/shared/Logo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Phase 1 scaffold. Homepage sections build in Phase 2, one per session,
// in spec order (project-sections/home/).
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <Logo className="size-16" />
      <h1 className="font-display text-4xl text-ink md:text-6xl">
        BigSquare Marketing
      </h1>
      <p className="max-w-[60ch] text-lg text-mid">
        [PLACEHOLDER: homepage sections are built in Phase 2, starting with the
        hero]
      </p>
    </main>
  );
}
