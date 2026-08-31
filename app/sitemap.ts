import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { INDUSTRY_PAGES } from "@/lib/industry-pages/registry";
import { LOCATION_PAGES } from "@/lib/location-pages";
import { SERVICE_PAGES } from "@/lib/service-pages/registry";
import { SITE_URL } from "@/lib/site";

// Only routes that exist are listed. Add each route here as its page ships
// (Phases 2 through 7); /go/, /apply/, and /thanks/ never appear (noindex),
// and neither do the /results/[slug]/ skeletons (noindex until real data)
// or /resources/[slug]/ (404 until the lead-magnet assets land).
// /team/ stays out (and noindex) until the profiles are real in
// lib/team.ts (photos + answers); add it here when they are.
// Service, industry, location, and blog pages join automatically as their
// content modules register (blog: any non-draft .mdx in content/blog/).
const ROUTES = [
  "/",
  "/about/",
  "/contact/",
  "/schedule/",
  "/audit/",
  "/careers/",
  "/results/",
  "/blog/",
  "/resources/",
  "/privacy-policy/",
  "/terms/",
  "/industries/",
  "/locations/",
  ...Object.keys(SERVICE_PAGES).map((slug) => `/services/${slug}/`),
  ...Object.keys(INDUSTRY_PAGES).map((slug) => `/industries/${slug}/`),
  ...Object.keys(LOCATION_PAGES).map((slug) => `/locations/${slug}/`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...ROUTES.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: now,
    })),
    ...getAllPosts().map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}/`,
      lastModified: new Date(`${post.date}T00:00:00Z`),
    })),
  ];
}
