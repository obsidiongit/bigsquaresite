/* Leadership entries (project-sections/company/leadership.md; laid out
   2026-08-31 per handoffs-2026-08-31.md Pane C). The /leadership/ page
   renders straight from this array, so the content drop is data, not
   code: replace the 3 placeholder entries with real people, drop the
   square headshots into public/media/ + lib/asset-files.ts under the
   photoSlot ids, and the page lights up.

   [PLACEHOLDER: real people only. Names, roles, bios, photos, and
   LinkedIn URLs all come from Brad. The page stays noindex and out of
   sitemap.xml until these are real (flip robots in
   app/(marketing)/leadership/page.tsx and add the route in
   app/sitemap.ts when they land).] */

export type Leader = {
  name: string;
  /** Rendered as the card's mono eyebrow */
  role: string;
  /** 2 to 3 short sentences */
  bio: string;
  /** MediaSlot id for the square headshot (public/media/ via lib/asset-files.ts) */
  photoSlot: string;
  /** Full profile URL, or null to hide the link */
  linkedin: string | null;
};

export const LEADERS: Leader[] = [
  {
    name: "[PLACEHOLDER: name]",
    role: "[PLACEHOLDER: role]",
    bio: "[PLACEHOLDER: 2 to 3 sentences on what this person owns for clients]",
    photoSlot: "leadership-01",
    linkedin: null,
  },
  {
    name: "[PLACEHOLDER: name]",
    role: "[PLACEHOLDER: role]",
    bio: "[PLACEHOLDER: 2 to 3 sentences on what this person owns for clients]",
    photoSlot: "leadership-02",
    linkedin: null,
  },
  {
    name: "[PLACEHOLDER: name]",
    role: "[PLACEHOLDER: role]",
    bio: "[PLACEHOLDER: 2 to 3 sentences on what this person owns for clients]",
    photoSlot: "leadership-03",
    linkedin: null,
  },
];
