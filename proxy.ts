import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* Holding deploy: every public URL except the holding page and the
   two legal pages 302s home. Query strings stay so old ad UTMs still
   attach to the capture. 302, not 301, so the full site can return.

   The matcher export MUST be named `config` (Next.js 16 proxy.ts).
   `proxyConfig` is ignored, which 302s CSS/JS/fonts and paints the
   page as raw HTML. The runtime skip is a second line of defense. */

const ALLOW = new Set([
  "/",
  "/privacy-policy",
  "/privacy-policy/",
  "/terms",
  "/terms/",
]);

function isAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image") ||
    pathname.includes(".")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (ALLOW.has(pathname) || isAsset(pathname)) {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url, 302);
}

export const config = {
  matcher: [
    "/((?!_next/|fonts/|favicon.ico|icon.svg|apple-icon.png|robots.txt|sitemap.xml|feed.xml|.*\\..*).*)",
  ],
};
