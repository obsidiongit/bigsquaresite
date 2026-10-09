/* The team roster (project-sections/company/team.md; Brad 2026-08-31:
   "/leadership/ was super small and lightweight... make it a team
   section, a lot more robust and a lot more fun", MySpace/Tumblr-era
   profile energy). /team/ renders straight from this array.

   Names and roles are REAL: registered members from
   lib/blog-authors.ts (Brad, 2026-08-30), sharing the same headshot
   slots so one photo drop lights the blog byline AND the team card.
   Everything personal (about, likes, photos, the rotation line) is a
   hidden until that person answers the questionnaire in
   project-sections/company/team.md; the profile window renders a
   designed empty state meanwhile, never fake personality.

   Open slots (Brad's pick, 2026-08-31: members plus extra open
   slots): unnamed cards signalling the fuller team; replace each with
   a real entry as Brad sends people. The hiring card at the grid's end
   is built into the page, not data. Sadie Pursell was removed 2026-09-04. */

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

/* Until a person answers the questionnaire (project-sections/company/
   team.md), "about" is one factual line about their role (brand file
   roles), and the empty fields simply do not render. */

function member(
  name: string,
  role: string,
  photoSlot: string,
  signature: string,
  photoKey: string,
  profile?: Partial<
    Pick<TeamMember, "about" | "likes" | "rotation" | "linkedin" | "photos">
  >,
): TeamMember {
  return {
    kind: "member",
    name,
    role,
    photoSlot,
    signature,
    about: profile?.about ?? "",
    likes: profile?.likes ?? [],
    // personal photos join when each person sends theirs (slots team-<key>-1..3)
    photos: profile?.photos ?? [],
    rotation: profile?.rotation ?? "",
    linkedin: profile?.linkedin ?? null,
  };
}

export const TEAM: TeamCard[] = [
  member("Brad Brown", "CEO", "blog-author-brad", "Brad", "brad", {
    about: "Brad is BigSquare's CEO and one of its two founders.",
  }),
  member("Mike Soden", "CTO", "blog-author-mike", "Mike", "mike", {
    about:
      "I run the technical side of BigSquare. I own the sites, the tracking, and the dashboards that turn spend into a report you can check. If the numbers are wrong, nothing else we do matters. The rest of my time goes to games, long drives, hiking, and the animals I keep at home.",
    likes: ["Video games", "Driving", "Hiking", "Animals"],
    rotation: "The Tim Dillon Show",
  }),
  member("Chaley Selsor", "Team Lead", "blog-author-chaley", "Chaley", "chaley", {
    about: "Chaley leads the client success team, the people clients talk to every week.",
  }),
  member("Levi Holley", "VP of Sales", "blog-author-levi", "Levi", "levi", {
    about: "Levi runs sales at BigSquare and is usually the first person a new client talks to.",
  }),
  member("Russel Spence", "Creative Director", "blog-author-russel", "Russel", "russel", {
    about: "Russel is BigSquare's Creative Director, leading the creative: the ads, the films, and the brands.",
  }),
  /* The rest of the team joins as Brad sends names: one member(...) call each. */
];
