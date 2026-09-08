import type { Metadata } from "next";
import { HoldingContact } from "@/components/sections/holding/HoldingContact";
import { HoldingHero } from "@/components/sections/holding/HoldingHero";
import { HoldingNewsletter } from "@/components/sections/holding/HoldingNewsletter";

export const metadata: Metadata = {
  title: { absolute: "Site Coming Soon | BigSquare" },
  description:
    "The new BigSquare site is coming soon. One team runs your search, ads, site, and creative. Send a note and we will get back to you.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main>
      <HoldingHero />
      <HoldingContact />
      <HoldingNewsletter />
    </main>
  );
}
