/* Type declaration for static .mdx imports (the legal pages import
   content/legal/*.mdx directly; the blog's dynamic template-string
   import never hit the type checker, so this file did not exist until
   2026-08-31). Matches what @next/mdx produces: a default component. */
declare module "*.mdx" {
  import type { JSX } from "react";
  import type { MDXProps } from "mdx/types";
  export default function MDXContent(props: MDXProps): JSX.Element;
}
