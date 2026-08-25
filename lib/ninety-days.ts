/* The first 90 days (10.how-it-works.md v3): the three phases and the
   twelve milestones the day grid scrubs through. The grid is 10 x 9 so
   ROWS MAP TO PHASES exactly: row 1 is days 1 to 10, rows 2 and 3 are
   days 11 to 30, rows 4 through 9 are days 31 to 90.

   EVERY DAY NUMBER HERE IS INVENTED until Brad or the delivery team
   confirms it (the section renders a visible placeholder flag until
   then). Confirming the real dates is a change to this file and
   nothing else: the section renders whatever this module holds.

   Ordering note from the brief: tracking is fixed before campaigns go
   live, on purpose. If the real process runs the other way, swap the
   days, not the copy. */

export type Milestone = { day: number; label: string };

export type Phase = {
  name: string;
  /** inclusive day range; also the grid-row mapping documented above */
  days: [number, number];
  milestones: Milestone[];
};

export const TOTAL_DAYS = 90;
export const GRID_COLS = 10;
export const GRID_ROWS = 9;

export const PHASES: Phase[] = [
  {
    name: "Get set up",
    days: [1, 10],
    milestones: [
      { day: 1, label: "Kickoff call with your team" },
      { day: 2, label: "Full audit of your site, search, ads, and tracking" },
      { day: 5, label: "Your Obsidion portal login" },
      { day: 10, label: "Location list, budgets, and goals locked" },
    ],
  },
  {
    name: "Launch",
    days: [11, 30],
    milestones: [
      { day: 14, label: "Tracking fixed so every lead is counted" },
      {
        day: 18,
        label: "First campaigns live, search, social, or both, based on your goals",
      },
      { day: 21, label: "Weekly check-in starts" },
      { day: 28, label: "Creative round one delivered" },
    ],
  },
  {
    name: "Scale",
    days: [31, 90],
    milestones: [
      { day: 35, label: "First landing page and ad tests go live" },
      { day: 45, label: "Cut what is not working, put more into what is" },
      { day: 60, label: "Add channels as the numbers support it" },
      { day: 90, label: "Location-by-location review" },
    ],
  },
];

/** the 12 marked cells: scrub targets on the grid */
export const MILESTONE_DAYS: ReadonlySet<number> = new Set(
  PHASES.flatMap((p) => p.milestones.map((m) => m.day)),
);

/** keyboard Page Up / Page Down stops: day 1 and each phase start, then the end */
export const PHASE_STOPS: readonly number[] = [1, 11, 31, TOTAL_DAYS];

export function phaseIndexForDay(day: number): number {
  if (day <= PHASES[0].days[1]) return 0;
  if (day <= PHASES[1].days[1]) return 1;
  return 2;
}
