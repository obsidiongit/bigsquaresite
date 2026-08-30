/* Blog authors (Brad, 2026-08-30: "have our team... use team headshots
   there... cycle through and have different team members be the ones
   to create the blog post").

   The frontmatter `author` key MUST match a key here exactly;
   lib/blog.ts fails the build otherwise, so the scheduled writer can
   never invent a person (copy-rules). To add a team member:

     1. add a row here (key = the byline, e.g. "Jane Smith")
     2. drop the headshot in public/media/ and map the slot id in
        lib/asset-files.ts (slot ids: blog-author-<first-name>)
     3. done: the author card, the rotation, and the Article JSON-LD
        (Person, worksFor BigSquare) pick it up

   The writer routine rotates: it picks the registered person with the
   fewest existing posts (routine-prompt.md step 6). "BigSquare Team"
   stays as the fallback byline and is never rotated once real people
   exist. */

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
  /* [PLACEHOLDER: real team members from Brad. One row each, like:
  "First Last": {
    role: "Head of Paid Media",
    slot: "blog-author-first",
    line: "Runs paid search and paid social at BigSquare.",
  },
  Names must be real people who are fine with the byline. */
};
