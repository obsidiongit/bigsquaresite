/* The team roster (project-sections/company/team.md; Brad 2026-08-31:
   "/leadership/ was super small and lightweight... make it a team
   section, a lot more robust and a lot more fun", MySpace/Tumblr-era
   profile energy). /team/ renders straight from this array.

   Names and roles are REAL: the 6 registered members from
   lib/blog-authors.ts (Brad, 2026-08-30), sharing the same headshot
   slots so one photo drop lights the blog byline AND the team card.
   Everything personal (about, likes, photos, the rotation line) is a
   visible [PLACEHOLDER] until that person answers the questionnaire in
   project-sections/company/team.md; the profile window renders a
   designed empty state meanwhile, never fake personality.

   Open slots (Brad's pick, 2026-08-31: "6 members + extra open
   slots"): unnamed cards signalling the fuller team; replace each with
   a real entry as Brad sends people. The hiring card at the grid's end
   is built into the page, not data. */

export type TeamPhoto = {
  /** MediaSlot id (public/media/ via lib/asset-files.ts) */
  slot: string;
  /** what shot this slot wants, shown on the placeholder */
  note: string;
  /** alt text once the file lands */
  alt: string;
};

export type TeamMember = {
  kind: "member";
  name: string;
  /** short real role, from lib/blog-authors.ts */
  role: string;
  /** headshot MediaSlot id, SHARED with the blog author card */
  photoSlot: string;
  /** first name for the signature moment (Casual Human accent) */
  signature: string;
  /** 2 to 4 sentences in their own words; placeholder until supplied */
  about: string;
  /** 3 to 6 short things they are into; empty = designed empty state */
  likes: string[];
  /** up to 3 personal photos for the strip */
  photos: TeamPhoto[];
  /** one line: what they have on rotation (song, show, podcast) */
  rotation: string;
  /** full profile URL, or null to hide the link */
  linkedin: string | null;
};

export type OpenSlot = {
  kind: "open";
  /** stable key for the card */
  id: string;
};

export type TeamCard = TeamMember | OpenSlot;

const PLACEHOLDER_ABOUT =
  "[PLACEHOLDER: 2 to 4 sentences in their own words, from the questionnaire in project-sections/company/team.md]";
const PLACEHOLDER_ROTATION = "[PLACEHOLDER: song, show, or podcast]";

function member(
  name: string,
  role: string,
  photoSlot: string,
  signature: string,
  photoKey: string,
): TeamMember {
  return {
    kind: "member",
    name,
    role,
    photoSlot,
    signature,
    about: PLACEHOLDER_ABOUT,
    likes: [],
    photos: [1, 2, 3].map((n) => ({
      slot: `team-${photoKey}-${n}`,
      note: `Personal photo ${n} of 3. Their pick, not stock.`,
      alt: `[PLACEHOLDER: what the photo shows, from ${signature}]`,
    })),
    rotation: PLACEHOLDER_ROTATION,
    linkedin: null,
  };
}

export const TEAM: TeamCard[] = [
  member("Brad Brown", "CEO", "blog-author-brad", "Brad", "brad"),
  member("Mike Soden", "CTO", "blog-author-mike", "Mike", "mike"),
  member("Chaley Selsor", "Team Lead", "blog-author-chaley", "Chaley", "chaley"),
  member("Levi Holley", "VP of Sales", "blog-author-levi", "Levi", "levi"),
  member("Russel Spence", "Creative Director", "blog-author-russel", "Russel", "russel"),
  member("Sadie Pursell", "Brand Ambassador", "blog-author-sadie", "Sadie", "sadie"),
  /* The rest of the team joins as Brad sends names; each open slot
     becomes one member(...) call. */
  { kind: "open", id: "open-1" },
  { kind: "open", id: "open-2" },
  { kind: "open", id: "open-3" },
  /* 4 open slots + the double-wide careers card = 12 grid cells, so
     the wall closes flush at 2, 3, and 4 columns with the careers card
     as the last occupied cell. */
  { kind: "open", id: "open-4" },
];
