import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

/* The BigSquare mark as a cast member (Brad's round 1 review: "a
   subtle 3D rendering of the logo somewhere in the world, the way
   illoca's mark sits in a few of its scenes"). The rounded square and
   the "b" from assets/logo.svg, extruded into two ink solids with
   three's SVGLoader + ExtrudeGeometry: no dependency, no fetch. The
   path data below is that file's, verbatim; the SVG itself lives
   outside the client bundle, so it is inlined here rather than loaded.
   Keep the two in sync if the mark ever changes. */
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 255 255">
  <rect width="255" height="255" rx="47.14" ry="47.14"/>
  <path d="M122.79,0l-16.87,90.49c17.61-10.13,36.56-13.89,55.74-9.14,28.69,7.11,48.2,31.52,49.31,61.09,1.17,48.04-36.23,86.39-84.7,83.51-16.88-1-31.54-7.18-43.45-18.85l-2.87,14.5-35.94.02L85.8.02l36.99-.02ZM172.5,161.13c3.95-14.57,1.14-29.33-9.57-39.48-10.84-10.27-26.31-12.85-40.61-8.1-20,6.63-32.7,26.61-30.96,47.57,1.4,16.8,12.87,29.64,29.21,33.03,23.38,4.85,45.55-9.56,51.92-33.03Z"/>
</svg>`;

const SVG_SIZE = 255;

export type LogoGeometries = {
  /** the rounded square, extruded `plaqueDepth` along +z from z = 0 */
  plaque: THREE.BufferGeometry;
  /** the "b", standing proud of the plaque's front by `markDepth` */
  mark: THREE.BufferGeometry;
};

/** Both solids centred on the origin in x/y, `width` world units
    across, facing +z (the SVG's y-down axis is corrected with a
    rotation, never a negative scale, so the winding survives). */
export function logoGeometries(width: number, plaqueDepth: number, markDepth: number): LogoGeometries {
  const { paths } = new SVGLoader().parse(LOGO_SVG);
  const k = width / SVG_SIZE;
  const build = (path: THREE.ShapePath, depth: number, zBack: number) => {
    const g = new THREE.ExtrudeGeometry(path.toShapes(), {
      depth: depth / k,
      bevelEnabled: false,
      curveSegments: 10,
    });
    g.scale(k, k, k);
    /* SVG y runs down and the extrusion ran along +z: half a turn about
       x flips both, then the translate stands the depth back on +z */
    g.rotateX(Math.PI);
    g.translate(-width / 2, width / 2, zBack + depth);
    return g;
  };
  return {
    plaque: build(paths[0], plaqueDepth, 0),
    mark: build(paths[1], markDepth, plaqueDepth),
  };
}
