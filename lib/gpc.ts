/** Global Privacy Control. Browsers that send this signal are opting
    out of targeted advertising cookies (privacy-policy.mdx). */

export function hasGlobalPrivacyControl(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl === true
  );
}
