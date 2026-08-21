import { MetaPixel } from "./MetaPixel";
import { GoogleTag } from "./GoogleTag";

/** All tracking in one place. Rendered once from the root layout. */
export function Analytics() {
  return (
    <>
      <MetaPixel />
      <GoogleTag />
    </>
  );
}
