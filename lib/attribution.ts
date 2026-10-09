// Attribution, client side (project-sections/conversion/lead-funnel.md,
// section 8). UtmCapture runs captureAttribution() on every route; every
// lead form sends getAttribution() with its submission so GHL stores the
// source on the contact. First touch is kept 90 days (localStorage), last
// touch per browser session (sessionStorage). Only campaign data is
// stored: paths, never query strings, so nothing personal lands here.

import { readUtmFromLocation, type UtmParams } from "@/lib/utm";

export const CLICK_ID_KEYS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
] as const;

export type ClickIds = Partial<Record<(typeof CLICK_ID_KEYS)[number], string>>;

export type Touch = {
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  term?: string;
  /** path the visit landed on, no query string */
  landingPage: string;
  /** external referrer (origin + path) */
  referrer?: string;
  /** ISO timestamp */
  at: string;
};

export type Attribution = {
  firstTouch?: Touch;
  lastTouch?: Touch;
  clickIds: ClickIds;
  /** Meta click cookie, or one built from a stored fbclid */
  fbc?: string;
  /** Meta browser cookie */
  fbp?: string;
  /** GA4 client id from the _ga cookie */
  gaClientId?: string;
};

const FIRST_KEY = "bigsquare_first_touch";
const LAST_KEY = "bigsquare_last_touch";
const IDS_KEY = "bigsquare_click_ids";
const KEEP_MS = 90 * 24 * 60 * 60 * 1000;

type Stored<T> = { value: T; expires: number };
type StoredIds = { ids: ClickIds; fbclidAt?: number };

const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|brave|baidu|yandex)\./;
const SOCIAL =
  /(^|\.)(facebook|fb|instagram|linkedin|lnkd|t|x|twitter|youtube|tiktok|reddit|pinterest|threads)\.(com|co|in|net)$/;

function readClickIds(): ClickIds {
  const params = new URLSearchParams(window.location.search);
  const ids: ClickIds = {};
  for (const key of CLICK_ID_KEYS) {
    const value = params.get(key);
    if (value) ids[key] = value.slice(0, 500);
  }
  return ids;
}

function externalReferrer(): URL | null {
  if (!document.referrer) return null;
  try {
    const ref = new URL(document.referrer);
    return ref.hostname === window.location.hostname ? null : ref;
  } catch {
    return null;
  }
}

function deriveTouch(utm: UtmParams, ids: ClickIds, ref: URL | null): Touch {
  const base = {
    landingPage: window.location.pathname,
    referrer: ref ? `${ref.origin}${ref.pathname}` : undefined,
    at: new Date().toISOString(),
  };
  if (utm.utm_source) {
    return {
      ...base,
      source: utm.utm_source,
      medium: utm.utm_medium ?? "(not set)",
      campaign: utm.utm_campaign,
      content: utm.utm_content,
      term: utm.utm_term,
    };
  }
  if (ids.gclid || ids.gbraid || ids.wbraid) return { ...base, source: "google", medium: "cpc" };
  if (ids.msclkid) return { ...base, source: "bing", medium: "cpc" };
  if (ids.fbclid) return { ...base, source: "facebook", medium: "social" };
  if (ref) {
    const host = ref.hostname.replace(/^www\./, "");
    const medium = SEARCH.test(ref.hostname)
      ? "organic"
      : SOCIAL.test(host)
        ? "social"
        : "referral";
    return { ...base, source: host, medium };
  }
  return { ...base, source: "(direct)", medium: "(none)" };
}

function read<T>(storage: Storage, key: string): T | undefined {
  try {
    const raw = storage.getItem(key);
    if (!raw) return undefined;
    const stored = JSON.parse(raw) as Stored<T>;
    if (stored.expires && stored.expires < Date.now()) {
      storage.removeItem(key);
      return undefined;
    }
    return stored.value;
  } catch {
    return undefined;
  }
}

function write<T>(storage: Storage, key: string, value: T, keepMs = KEEP_MS) {
  try {
    storage.setItem(key, JSON.stringify({ value, expires: Date.now() + keepMs }));
  } catch {
    // storage unavailable (private mode): the current page still counts
  }
}

function cookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Record this page view's source. Safe to call on every route change. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const utm = readUtmFromLocation();
  const ids = readClickIds();
  const ref = externalReferrer();
  const campaign = Object.keys(utm).length > 0 || Object.keys(ids).length > 0;
  const touch = deriveTouch(utm, ids, ref);

  if (!read<Touch>(localStorage, FIRST_KEY)) write(localStorage, FIRST_KEY, touch);

  // A new campaign click or an outside referral restarts the last touch;
  // moving between our own pages keeps it.
  if (campaign || ref || !read<Touch>(sessionStorage, LAST_KEY)) {
    write(sessionStorage, LAST_KEY, touch);
  }

  if (Object.keys(ids).length > 0) {
    const stored = read<StoredIds>(localStorage, IDS_KEY);
    write<StoredIds>(localStorage, IDS_KEY, {
      ids: { ...stored?.ids, ...ids },
      fbclidAt: ids.fbclid ? Date.now() : stored?.fbclidAt,
    });
  }
}

/** Everything a lead submission carries about where the visitor came from. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return { clickIds: {} };
  const stored = read<StoredIds>(localStorage, IDS_KEY);
  const ids = { ...stored?.ids, ...readClickIds() };
  const fbclidAt = stored?.fbclidAt ?? Date.now();
  const ga = cookie("_ga")?.split(".");

  return {
    firstTouch: read<Touch>(localStorage, FIRST_KEY),
    lastTouch:
      read<Touch>(sessionStorage, LAST_KEY) ??
      deriveTouch(readUtmFromLocation(), ids, externalReferrer()),
    clickIds: ids,
    fbc: cookie("_fbc") ?? (ids.fbclid ? `fb.1.${fbclidAt}.${ids.fbclid}` : undefined),
    fbp: cookie("_fbp"),
    gaClientId: ga && ga.length >= 4 ? `${ga[2]}.${ga[3]}` : undefined,
  };
}
