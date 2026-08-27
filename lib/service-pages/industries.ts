import type { ServicePageContent } from "./types";

/* Shared industry links for T2 pages. One card asset per industry,
   reused by every service page that links it (asset-manifest.md). */

type IndustryLink = ServicePageContent["industries"][number];

export const FRANCHISE: IndustryLink = {
  label: "Franchise",
  href: "/industries/franchise/",
  asset: {
    id: "industries-franchise-card",
    alt: "Franchise marketing for multi-unit brands",
    note: "3:2 card image for the franchise industry (reused by every service page that links it).",
  },
};

export const HOME_SERVICES: IndustryLink = {
  label: "Home Services",
  href: "/industries/home-services/",
  asset: {
    id: "industries-home-services-card",
    alt: "Marketing for home services companies with many locations",
    note: "3:2 card image for the home services industry (reused across service pages).",
  },
};

export const LEGAL: IndustryLink = {
  label: "Legal",
  href: "/industries/legal/",
  asset: {
    id: "industries-legal-card",
    alt: "Marketing for law firms with multiple offices",
    note: "3:2 card image for the legal industry (reused across service pages).",
  },
};

export const HEALTHCARE: IndustryLink = {
  label: "Healthcare",
  href: "/industries/healthcare/",
  asset: {
    id: "industries-healthcare-card",
    alt: "Marketing for healthcare practices with many locations",
    note: "3:2 card image for the healthcare industry (reused across service pages).",
  },
};
