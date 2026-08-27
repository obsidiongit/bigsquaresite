# /industries/ hub

v1, 2026-08-26, specced from `_industry-page-template.md` v3 after the Lane 3 gate opened (the lane brief: the hub had no spec; spec it from the template brief). An INDEX page, not a T3 instance: its job is routing and indexing, so it stays lean (~250 words; the 1,500-word contract belongs to the leaf pages). Open layout, EDGE, no pins, no board (the board is a leaf-page signature; the hub stays quieter than its children).

- URL `/industries/`, title `Industries We Serve` (sitemap.md), meta description written fresh, BreadcrumbList (Home > Industries). SquareField ambient like the leaf pages.
- **Hero** (light): mono row `INDUSTRIES` on a drawn hairline, H1 "The industries we grow." (~keyword-adjacent; the leaf pages own the agency keywords), lead 2 sentences on why industry-specific programs beat generic ones, CTA pair.
- **The index** (light): 2x2 grid (stacks on mobile) of linked industry cards, each: `MediaSlot` (3:2, `href` to the industry page: the linkable-slot pattern from Lane 2's round; card asset ids `industries-*-card` shared sitewide per asset-manifest.md), industry name at `--text-h3` in Apfel 700 with the rule-link arrow hover, one fresh one-liner (never the leaf page's answer lead), and the leaf's primary keyword as a quiet mono tag. Whole card is the link (MediaSlot's own href stays unset inside it: no nested anchors; the hover scale rides the card link's group).
- **Close**: CtaBand + footer. No FAQ (D5 puts none here), no proof, no process.
- Done when: no overflow at 4 widths, reduced motion settled, breadcrumb JSON-LD valid, 4 industry links + 2 CTAs live, copy scan clean.
