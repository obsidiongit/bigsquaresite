"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useGpc } from "./useGpc";

const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

function present(id: string | undefined): id is string {
  return typeof id === "string" && id.length > 0;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google tag (Ads) and GA4. One gtag.js library, one config call per ID.
 * Renders nothing until NEXT_PUBLIC_GTAG_ID or NEXT_PUBLIC_GA4_ID has a
 * value. Loads after hydration. Google Ads is skipped when the browser
 * sends Global Privacy Control; GA4 still loads, with ad signals off.
 */
export function GoogleTag() {
  const pathname = usePathname();
  const gpc = useGpc();
  const isFirstRender = useRef(true);

  const gaId = present(GA4_ID) ? GA4_ID : undefined;
  const adsId = gpc === false && present(GTAG_ID) ? GTAG_ID : undefined;
  const primaryId = gaId ?? adsId;

  useEffect(() => {
    if (gpc === null || !primaryId) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (gaId) {
      window.gtag?.("config", gaId, {
        page_path: pathname,
        ...(gpc
          ? {
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
            }
          : {}),
      });
    }
    if (adsId) {
      window.gtag?.("config", adsId, { page_path: pathname });
    }
  }, [pathname, primaryId, gaId, adsId, gpc]);

  if (gpc === null || !primaryId) return null;

  const consent = gpc
    ? `gtag('consent', 'default', {ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});`
    : "";
  const gaConfig = gaId
    ? gpc
      ? `gtag('config', '${gaId}', {allow_google_signals:false,allow_ad_personalization_signals:false});`
      : `gtag('config', '${gaId}');`
    : "";
  const adsConfig = adsId ? `gtag('config', '${adsId}');` : "";

  return (
    <>
      <Script
        id="gtag-lib"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${consent}
${gaConfig}
${adsConfig}`}
      </Script>
    </>
  );
}
