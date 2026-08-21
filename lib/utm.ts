// UTM helpers, client side. Every form submission carries these plus the
// page slug (decisions.md). Params are remembered for the session so a
// visitor who lands on an ad URL and converts on another page keeps them.

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const STORAGE_KEY = "bigsquare_utm";

export function readUtmFromLocation(): UtmParams {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

/** Store UTM params from the current URL. New params overwrite stored ones. */
export function rememberUtmParams(): void {
  if (typeof window === "undefined") return;
  const utm = readUtmFromLocation();
  if (Object.keys(utm).length === 0) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
  } catch {
    // storage unavailable (private mode); current-URL params still work
  }
}

/** UTM params for a submission: current URL first, then session storage. */
export function getUtmParams(): UtmParams {
  const current = readUtmFromLocation();
  if (Object.keys(current).length > 0) return current;
  if (typeof window === "undefined") return {};
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as UtmParams) : {};
  } catch {
    return {};
  }
}
