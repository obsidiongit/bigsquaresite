/* Review toggle definitions (no "use client": the root layout reads the
   defaults on the server so the first paint already wears them). The
   store and hooks live in lib/lab.ts. */

export const LAB = {
  hero: {
    group: "Homepage",
    label: "Hero",
    options: { tv: "Dotted TV + push into the dot (ours)", brad: "Glass cube (original)" },
    default: "tv",
  },
  heroText: {
    group: "Homepage",
    label: "Hero text on scroll",
    options: {
      lines: "Lines sink away (new)",
      squares: "Words turn to squares (new)",
      part: "Part, then fade (new)",
      deflect: "Pushed round the TV",
      lower: "Caption on the TV",
      fade: "Fade away",
      brad: "As now",
    },
    default: "squares",
  },
  reel: {
    group: "Homepage",
    label: "Film footage",
    options: { brad: "Placeholder loop", showreel: "BigSquare showreel" },
    default: "showreel",
  },
  film: {
    group: "Homepage",
    label: "Film look",
    options: { plain: "Plain video", dots: "Colour dots", blue: "Blue dots" },
    default: "dots",
  },
  cards: {
    group: "Homepage",
    label: "Work cards",
    options: { clips: "Reel clips", dots: "Reel clips, dots" },
    default: "clips",
  },
  footer: {
    group: "Pages",
    label: "Footer",
    options: { curtain: "Curtain footer (ours)", brad: "Original" },
    default: "curtain",
  },
  contact: {
    group: "Pages",
    label: "Contact page",
    options: { pencil: "Pencil form (ours)", brad: "Original" },
    default: "pencil",
  },
  workPencil: {
    group: "Homepage",
    label: "Work cards pencil",
    options: { off: "Off", on: "Travelling pencil" },
    default: "on",
  },
  portal: {
    group: "Homepage",
    label: "Portal screen",
    options: { brad: "As built", sketch: "Pencil sketch", short: "Shorter scroll", both: "Sketch + shorter" },
    default: "both",
  },
  launch: {
    group: "Launch",
    label: "Placeholders",
    options: { brad: "Show markers", safe: "Launch-safe (hide)" },
    default: "safe",
  },
  media: {
    group: "Pages",
    label: "Empty photo slots",
    options: { brad: "Grey ASSET panels", reel: "Reel clips", dots: "Reel clips, dots" },
    default: "reel",
  },
  arrows: {
    group: "Hand-drawn hovers",
    label: "Arrows on hover",
    options: { brad: "Slide", sketch: "Pencil arrow", scribble: "Curly arrow" },
    default: "sketch",
  },
  buttons: {
    group: "Hand-drawn hovers",
    label: "Buttons on hover",
    options: { brad: "As built", circle: "Pencil loop", box: "Pencil box", underline: "Underline" },
    default: "circle",
  },
  links: {
    group: "Hand-drawn hovers",
    label: "Links on hover",
    options: { brad: "As built", underline: "Pencil underline", marker: "Blue marker" },
    default: "underline",
  },
  strike: {
    group: "Homepage",
    label: "Problem list",
    options: { brad: "As built", strike: "Pencil strike-through on scroll" },
    default: "strike",
  },
  team: {
    group: "Pages",
    label: "Team wall",
    options: { brad: "With open slots", trim: "Only real people", dots: "Real people, dot portraits" },
    default: "dots",
  },
  squares: {
    group: "Homepage",
    label: "Floating squares",
    options: { on: "On", less: "Fewer", off: "Off" },
    default: "on",
  },
  /* the middle-of-page pass (2026-10-08): with the TV hero on, the cube
     that tied these sections together is off, so each gets its own
     moment in the page's pen-and-squares voice */
  middleDraft: {
    group: "Homepage middle",
    label: "Problem, Solution, Search",
    options: { brad: "As built", draft: "Drafted, like the footer" },
    default: "draft",
  },
  problemFix: {
    group: "Homepage middle",
    label: "Problem list",
    options: { brad: "Strike only", pen: "Pen writes the fix" },
    default: "pen",
  },
  servicesBay: {
    group: "Homepage middle",
    label: "Services panel",
    options: { brad: "Text only", squares: "15-square map" },
    default: "squares",
  },
  portalLive: {
    group: "Homepage middle",
    label: "Portal window",
    options: { brad: "Still skeleton", live: "Live: leads arrive" },
    default: "live",
  },
  newsletterLook: {
    group: "Homepage middle",
    label: "Newsletter photos",
    options: { brad: "Stock photos", dots: "Blue dots, photo on hover" },
    default: "dots",
  },
  /* the lower-page pass (2026-10-09 review: "the top half is a lot of
     motion... the bottom half up until the footer is a little dry").
     Services and Portal get new takes that speak the top half's
     language: the blue slab, the dots, the pen, the brand square. */
  servicesLook: {
    group: "Homepage lower",
    label: "Services",
    options: {
      brad: "As built: list + side panel",
      index: "Big type, photo follows the cursor",
      wall: "15 squares, dotted photos",
      slab: "Blue slab, tabs by group",
    },
    default: "index",
  },
  portalLook: {
    group: "Homepage lower",
    label: "Portal",
    options: {
      brad: "As built: grey window",
      stage: "Blue stage, leads pop out",
      markup: "Marked up in blue pen",
      squares: "Built from squares",
    },
    default: "stage",
  },
} as const;

export const LAB_GROUPS = ["Launch", "Homepage", "Homepage middle", "Homepage lower", "Pages", "Hand-drawn hovers"] as const;

/** The defaults as <html data-lab-*> attributes, for the server render. */
export function labDefaultAttrs(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.keys(LAB) as (keyof typeof LAB)[]) {
    out[`data-lab-${k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}`] = LAB[k].default;
  }
  return out;
}
