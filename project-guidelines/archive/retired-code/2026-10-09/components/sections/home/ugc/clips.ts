/**
 * Shots cut from Brad's showreel (D:\Clients\BRAD\Showreel Bigsquare.mp4) into public/media/ugc/: each is an
 * .mp4 (no sound) with a .webp poster. "tall" = a 9:16 phone panel from the reel, "wide" = a 16:9 shot.
 * `kind` says what sort of work it is. No client names or results: none are cleared (brand file).
 */
export type Clip = { id: string; shape: "tall" | "wide"; kind: string };

export const CLIPS: Clip[] = [
  { id: "ugc-1", shape: "tall", kind: "Creator ad" },
  { id: "ugc-2", shape: "tall", kind: "Creator ad" },
  { id: "ugc-3", shape: "tall", kind: "Creator ad" },
  { id: "creator-street", shape: "tall", kind: "Creator ad" },
  { id: "couple", shape: "tall", kind: "Creator ad" },
  { id: "talk-1", shape: "tall", kind: "Interview" },
  { id: "talk-2", shape: "tall", kind: "Interview" },
  { id: "buzz", shape: "tall", kind: "Social ad" },
  { id: "side", shape: "tall", kind: "Social ad" },
  { id: "main", shape: "tall", kind: "Social ad" },
  { id: "hero", shape: "tall", kind: "Social ad" },
  { id: "trousers", shape: "tall", kind: "Product film" },
  { id: "city-1", shape: "tall", kind: "Brand film" },
  { id: "city-2", shape: "tall", kind: "Brand film" },
  { id: "city-3", shape: "tall", kind: "Brand film" },
  { id: "thumbs", shape: "wide", kind: "Brand film" },
  { id: "scientist", shape: "wide", kind: "Commercial" },
  { id: "shopper", shape: "wide", kind: "Commercial" },
  { id: "grandma", shape: "wide", kind: "Commercial" },
  { id: "helmet", shape: "wide", kind: "Commercial" },
  { id: "reacting", shape: "wide", kind: "Commercial" },
  { id: "yellow", shape: "wide", kind: "Commercial" },
  { id: "peek", shape: "wide", kind: "Commercial" },
  { id: "pooch", shape: "wide", kind: "Commercial" },
  { id: "cat", shape: "wide", kind: "Commercial" },
  { id: "matcha", shape: "wide", kind: "Product film" },
  { id: "couch", shape: "wide", kind: "Brand film" },
];

export const clip = (id: string) => CLIPS.find((c) => c.id === id)!;
export const src = (id: string) => `/media/ugc/${id}.mp4`;
export const poster = (id: string) => `/media/ugc/${id}.webp`;
export const pick = (ids: string[]) => ids.map(clip);

/** Draft copy, from the reel's own lines; Mike reviews copy before launch. */
export const COPY = {
  ugcTitle: "We stop thumbs.",
  ugcText: "Creator ads, commercials and product films with real people in them, made by the same team that runs the media.",
  facesTitle: "Make it memorable.",
  facesText: "Real people in front of the camera, from a creator's kitchen to a full commercial set.",
};

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Where `p` sits between a and b, 0..1. */
export const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
