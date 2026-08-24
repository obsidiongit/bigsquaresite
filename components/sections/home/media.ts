/* The brand film (decisions.md): swap in the real 4K commercial by
   changing HERO_VIDEO when it is delivered. Shared by the Hero DOM
   (static/fallback compositions) and the page-level HomeCanvas. */
export const HERO_VIDEO: string | null = "/media/hero-loop.mp4";
export const HERO_POSTER = "/media/hero-poster.jpg";

/* The v5.1 hero choreography lives in the first K of the (now longer)
   hero wrapper; the reform beat (panel back into the cube, v6) takes
   the last 1-K. Shared by the Hero DOM scrubs and HomeCanvas so both
   read the same clock; kept out of HomeCanvas so importing it never
   pulls three into the DOM chunk. */
export const HERO_K = 6 / 7;
