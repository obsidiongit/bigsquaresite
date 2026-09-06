import * as THREE from "three";
import type { PropKit } from "./props";

/* The town at rest (cube-v2/brief.md 10.3 round 1, prompt 10.4). One
   seeded layout in world units; the protagonist is 1 unit at the
   origin and the camera looks from +z. Placement is projected against
   the fold's DOM at 1440x900: the headline's first line runs to 86
   percent of the width and the cube sits at 87, so the only ground
   that is clear of the text at rest is the band above the headline
   (z of -9 and beyond), the strip right of the statement, and the
   bottom left corner. The road leaves under the cube along its face
   direction (rotation.y 0.62, so round 2's quarter turns run on it),
   disappears behind the cube and its shadow, and comes back into view
   above the cube's shoulder on its way to the town. Foreground pieces
   (the START tick, the sheets) are hidden below 768px, where the
   headline owns everything under the cube. */

/** the road's centerline, xz waypoints, from the START tick to the horizon */
export const ROAD: [number, number][] = [
  [0.35, 0.6],
  [-0.35, -0.4],
  [-0.85, -1.25],
  [-0.6, -2.8],
  [0.05, -4.8],
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


/** heading of the road's first straight, radians from -z (left is positive) */
export const ROAD_HEADING = Math.atan2(0.58, 0.81);

export type Placed = {
  object: THREE.Object3D;
  /** foreground pieces are hidden on narrow viewports, where the DOM
      headline owns everything below the cube */
  foreground?: boolean;
};

export function composeTown(kit: PropKit): Placed[] {
  const placed: Placed[] = [];
  const put = (object: THREE.Object3D, x: number, z: number, rot = 0, foreground = false) => {
    object.position.x = x;
    object.position.z = z;
    object.rotation.y = rot;
    placed.push({ object, foreground });
    return object;
  };

  /* the road and the START tick where the cube rests */
  placed.push({ object: kit.road(ROAD) });
  placed.push({ object: kit.startTick(0.35, 0.6, ROAD_HEADING), foreground: true });

  /* three storefronts on the far side of the road's leftward sweep,
     fronts turned toward the road; the nearest is still going up */
  put(kit.storefront({ w: 2.0, h: 1.7, d: 1.7, awning: 0.34, build: 0.6, seed: 1 }), -1.3, -12.3, 0.16);
  put(kit.storefront({ w: 2.4, h: 1.2, d: 1.9, awning: 0.4, seed: 2 }), -4.9, -14.4, -0.08);
  put(kit.storefront({ w: 2.7, h: 1.25, d: 2.0, awning: 0.36, seed: 3 }), -8.4, -16.6, 0.22);

  /* four trees along the street */
  put(kit.tree({ h: 1.2 }), -10.5, -17.6, 0.3);
  put(kit.tree({ h: 0.95 }), -3.1, -10.6, 1.2);
  put(kit.tree({ h: 0.85 }), -6.6, -12.5, 2.4);
  put(kit.tree({ h: 1.1 }), 0.6, -14.5, 0.8);

  /* the van, parked at the roadside where the road reaches the town,
     nose toward the camera, cropped by the right edge of the frame.
     (10.4 asks for the foreground right; at this framing the cube
     leaves 13 percent of the width to its right, so a van there hides
     the cube's corner and its shadow buries the START line.) */
  put(kit.van(), 0.05, -9.95, 0.74);

  /* two sheets in the bottom left corner, one a chart, one a plan */
  put(kit.sheet({ w: 0.8, h: 1.05, draw: "chart", seed: 7 }), -3.05, 1.85, 0.28, true);
  put(kit.sheet({ w: 0.72, h: 0.95, draw: "plan", seed: 19 }), -1.7, 2.45, -0.18, true);

  return placed;
}
