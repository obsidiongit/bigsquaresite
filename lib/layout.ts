/* Shared layout tokens (STYLE_GUIDE.md 4.5, the open layout).

   EDGE is the sitewide page margin: the near-full-bleed edge the
   featured work section introduced (lusion scale), promoted to the
   whole site 2026-08-25 (D1, interior-buildout-plan.md; the older
   "interior pages keep the 1200px Container + hairline system" note
   here is superseded). EDGE sections use no Container, no GridLines,
   no No labels; the footer's Container is the one surviving 1200px
   use. Long-form copy inside an EDGE section caps at the ~65ch spine. */

export const EDGE = "px-[max(5vw,40px)]";
