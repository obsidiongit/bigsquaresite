import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/tracking/Analytics";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { OrganizationJsonLd } from "@/components/shared/OrganizationJsonLd";
import { UtmCapture } from "@/components/shared/UtmCapture";
import { SITE_URL } from "@/lib/site";

// Placeholder mono per STYLE_GUIDE.md: the third font is not locked.
// next/font self-hosts it and loads it non-blocking; it is below the fold
// on most pages, so no preload.
const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Franchise & Multi-Location Marketing Agency | BigSquare",
    template: "%s | BigSquare",
  },
  description:
    "BigSquare Marketing helps franchise and multi-location brands grow with SEO, paid ads, and reporting you can check any day.",
};

// Above-the-fold faces preloaded per STYLE_GUIDE.md section 3
const PRELOAD_FONTS = [
  "/fonts/BluuNext-700.woff2",
  "/fonts/Apfel-400.woff2",
  "/fonts/Apfel-500.woff2",
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plexMono.variable}>
      <head>
        {PRELOAD_FONTS.map((href) => (
          <link
            key={href}
            rel="preload"
            href={href}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <OrganizationJsonLd />
        <UtmCapture />
        <Analytics />
      </body>
    </html>
  );
}
