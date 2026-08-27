/* Office facts, one source (contact.md v2): /contact/ and /about/
   render these through <OfficeCards>; the /locations/ pages consume
   the same rows in Batch 2. Address and phone stay null until Brad
   provides them (never invented); null renders the honest mono
   placeholder, real values drop in here only. */

export type Office = {
  city: string;
  state: string;
  href: string;
  /** null until Brad provides it; renders a flagged placeholder */
  address: string | null;
  /** null until Brad provides it; renders a flagged placeholder */
  phone: string | null;
};

export const OFFICES: Office[] = [
  {
    city: "Denver",
    state: "Colorado",
    href: "/locations/denver/",
    address: null,
    phone: null,
  },
  {
    city: "Tampa",
    state: "Florida",
    href: "/locations/tampa/",
    address: null,
    phone: null,
  },
];
