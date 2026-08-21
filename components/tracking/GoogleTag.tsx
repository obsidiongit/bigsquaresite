"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

const TAG_IDS = [GTAG_ID, GA4_ID].filter(
  (id): id is string => typeof id === "string" && id.length > 0,
);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google tag (Ads) and GA4. One gtag.js library, one config call per ID.
 * Renders nothing until NEXT_PUBLIC_GTAG_ID or NEXT_PUBLIC_GA4_ID has a
 * value (a teammate fills them in on a separate pass). Loads after hydration.
 */
export function GoogleTag() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // The inline config fires the first page_view; track client-side navigations.
  useEffect(() => {
    if (TAG_IDS.length === 0) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    for (const id of TAG_IDS) {
      window.gtag?.("config", id, { page_path: pathname });
    }
  }, [pathname]);

  if (TAG_IDS.length === 0) return null;

  return (
    <>
      <Script
        id="gtag-lib"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${TAG_IDS[0]}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${TAG_IDS.map((id) => `gtag('config', '${id}');`).join("\n")}`}
      </Script>
    </>
  );
}
