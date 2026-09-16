import * as THREE from "three";
import type { PropKit, Storefront } from "./props";
import { GROUND_Y, ROAD_DIR, ROAD_HEADING } from "./path";

export { ROAD_HEADING };

/* The town (cube-v2/brief.md 10.3 rounds 1 and 2). One seeded layout
   in world units; the protagonist is 1 unit at the origin and the
   camera looks from +z. Placement is projected against the fold's DOM
   at 1440x900: the headline's first line runs to 86 percent of the
   width and the cube sits at 87, so the only ground clear of the text
   at rest is the band above the headline (z of -9 and beyond), the
   strip right of the statement, and the bottom left corner. The road
   leaves under the cube along ROAD_DIR (its first straight passes
   through the origin, so round 2's two quarter turns run on it and
   land on the film station at FILM_S), disappears behind the cube and
   its shadow, and comes back into view above the cube's shoulder on
   its way to the town. Foreground pieces (the sheets) are hidden below
   768px, where the headline owns everything under the cube.

   Round 2 (Brad's round 1 review): the START lettering is gone (the
   road is drawn at rest, so it has no first stroke to be); the van is
   out of the rest frame and staged on the road's problem stretch,
   beyond the town, for round 4's beat; the BigSquare mark stands as a
   roadside sign where the road bends into the town. */

const along = (s: number): [number, number] => [ROAD_DIR.x * s, ROAD_DIR.z * s];

/** the road's centerline, xz waypoints, from behind the cube to the horizon */
export const ROAD: [number, number][] = [
  along(-0.8),
  along(1.0),
  along(2.0),
  along(2.8),
  [-1.05, -3.7],
  [-0.05, -4.9],
  [0.3, -7.2],
  [0.0, -9.4],
  [-1.8, -10.9],
  [-4.6, -12.4],
  [-7.6, -14.0],
  [-10.0, -16.6],
  [-12.0, -21.0],
  [-13.0, -28.0],
  [-13.6, -40.0],
];

export type Placed = {
  object: THREE.Object3D;
  /** foreground pieces are hidden on narrow viewports, where the DOM
      headline owns everything below the cube */
  foreground?: boolean;
};

export type Town = {
  placed: Placed[];
  /** the storefront still going up at rest; it tops out on the approach */
  rising: Storefront;
};

export function composeTown(kit: PropKit): Town {
  const placed: Placed[] = [];
  const put = <T extends THREE.Object3D>(object: T, x: number, z: number, rot = 0, foreground = false): T => {
    object.position.x = x;
    object.position.z = z;
    object.rotation.y = rot;
    placed.push({ object, foreground });
    return object;
  };

  /* the road */
  placed.push({ object: kit.road(ROAD) });

  /* three storefronts on the far side of the road's leftward sweep,
     fronts turned toward the road; the nearest is still going up */
  const rising = put(kit.storefront({ w: 2.0, h: 1.7, d: 1.7, awning: 0.34, build: 0.6, seed: 1 }), -1.3, -12.3, 0.16);
  put(kit.storefront({ w: 2.4, h: 1.2, d: 1.9, awning: 0.4, seed: 2 }), -4.9, -14.4, -0.08);
  put(kit.storefront({ w: 2.7, h: 1.25, d: 2.0, awning: 0.36, seed: 3 }), -8.4, -16.6, 0.22);

  /* four trees along the street */
  put(kit.tree({ h: 1.2 }), -10.5, -17.6, 0.3);
  put(kit.tree({ h: 0.95 }), -3.1, -10.6, 1.2);
  put(kit.tree({ h: 0.85 }), -6.6, -12.5, 2.4);
  put(kit.tree({ h: 1.1 }), 0.6, -14.5, 0.8);

  /* the mark: a small pavement sign on the left verge, four units in
     front of the first storefront so parallax keeps it off the shop's
     wall, turned a little toward the key so its face is lit and the
     "b" shades on its own walls. At rest it stands in the band above
     the headline, just right of "customers." (projected: 88%, 13 to
     29% of the frame at 1440) */
  put(kit.logoSign(0.5), -0.85, -7.0, 0.35);

  /* the van, staged on the problem stretch beyond the town (10.1: it
     drives the road ahead of the cube through problem and solution),
     nose down the road; out of every hero frame on purpose */
  put(kit.van(), -12.4, -23.5, Math.atan2(-1, -7));

  /* two sheets in the bottom left corner, one a chart, one a plan */
  put(kit.sheet({ w: 0.8, h: 1.05, draw: "chart", seed: 7 }), -3.05, 1.85, 0.28, true);
  put(kit.sheet({ w: 0.72, h: 0.95, draw: "plan", seed: 19 }), -1.7, 2.45, -0.18, true);

  return { placed, rising };
}

/** y of the paper, for callers that place their own ink */
export const PAPER_Y = GROUND_Y;
