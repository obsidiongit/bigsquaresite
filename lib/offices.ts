/* Office facts, one source (contact.md v2): /contact/ and /about/
   render these through <OfficeCards>; the /locations/ pages consume
   the same rows in Batch 2. Address and phone stay null until Brad
   provides them (never invented); null renders the honest mono
   placeholder, real values drop in here only. */

export type Office = {
  /** the /locations/[city]/ route segment; keys lib/location-pages.ts */
  slug: "denver" | "tampa";
  city: string;
  state: string;
  /** USPS two-letter code, for LocalBusiness addressRegion */
  stateCode: string;
  href: string;
  /** null until Brad provides it; renders a flagged placeholder */
  address: string | null;
  /** null until Brad provides it; renders a flagged placeholder */
  phone: string | null;
};

export const OFFICES: Office[] = [
  {
    slug: "denver",
    city: "Denver",
    state: "Colorado",
    stateCode: "CO",
    href: "/locations/denver/",
    address: null,
    phone: null,
  },
  {
    slug: "tampa",
    city: "Tampa",
    state: "Florida",
    stateCode: "FL",
    href: "/locations/tampa/",
    address: null,
    phone: null,
  },
];

export function getOffice(slug: Office["slug"]): Office {
  return OFFICES.find((o) => o.slug === slug)!;
}
