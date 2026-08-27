import type { Metadata } from "next";
import { IndustriesHub } from "@/components/sections/industries/IndustriesHub";
import { breadcrumbJsonLd } from "@/lib/jsonld";

/* The /industries/ hub (industries-hub.md v1): the index over the T3
   family. Static route beside the [slug] leaf pages. */

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "BigSquare builds marketing systems for franchise, home services, legal, and healthcare brands. Pick your industry and see how the work runs.",
  alternates: { canonical: "/industries/" },
};

export default function IndustriesPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries/" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IndustriesHub />
    </>
  );
}
