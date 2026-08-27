/* Open roles (careers.md v2): roles are FACTS and are never invented,
   so this array is empty until Brad provides real openings. The
   /careers/ page renders the designed empty state while it is; adding
   a row here lights up the roles list with no layout change.

   When applications get a real destination, role cards link there
   (submitForm with the role slug, or the destination URL). Until
   then the page's ask is the support email. */

export type Role = {
  slug: string;
  title: string;
  /** "Denver", "Tampa", or "Remote" once policy is confirmed */
  location: string;
  /** "Full time", "Part time", "Contract" */
  type: string;
};

export const OPEN_ROLES: Role[] = [];
