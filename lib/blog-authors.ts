/* Blog authors (Brad, 2026-08-30: team members take the byline with
   real headshots, cycled per post; names supplied by Brad the same
   day).

   The frontmatter `author` key MUST match a key here exactly;
   lib/blog.ts fails the build otherwise, so the scheduled writer can
   never invent a person (copy-rules). Headshot source files arrive in
   assets/team/ (Brad's drop folder); to light a card up, export a
   square crop to public/media/ and map the slot id in
   lib/asset-files.ts. Until then the card shows the designed
   placeholder.

   The writer routine rotates: it picks the person with the fewest
   existing posts (routine-prompt.md). "BigSquare Team" stays as the
   fallback byline and is never rotated now that real people exist.
   The one-liners are derived from the roles only; richer bios are
   Brad's call (they should match /leadership/ when that page gets
   names). */

export type BlogAuthor = {
  /** short role line under the name, e.g. "Head of SEO" */
  role: string;
  /** MediaSlot id for the headshot (1:1); placeholder until the file lands */
  slot: string;
  /** one line for the author card */
  line: string;
};

export const TEAM_AUTHOR = "BigSquare Team";

export const BLOG_AUTHORS: Record<string, BlogAuthor> = {
  [TEAM_AUTHOR]: {
    role: "The team",
    slot: "blog-author-bigsquare-team",
    line: "One team that runs search, ads, sites, and creative for real brands.",
  },
  "Brad Brown": {
    role: "CEO",
    slot: "blog-author-brad",
    line: "Runs BigSquare Marketing.",
  },
  "Mike Soden": {
    role: "CTO",
    slot: "blog-author-mike",
    line: "Builds the tech behind the accounts and the reporting.",
  },
  "Chaley Selsor": {
    role: "Team Lead",
    slot: "blog-author-chaley",
    line: "Leads the account team day to day.",
  },
  "Levi Holley": {
    role: "VP of Sales",
    slot: "blog-author-levi",
    line: "Runs sales: the first call and the plan that follows.",
  },
  "Russel Spence": {
    role: "Creative Director",
    slot: "blog-author-russel",
    line: "Leads brand, design, and film at BigSquare.",
  },
};
