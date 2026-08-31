Raw image drops for blog slots, named by slot id (blog-cover-<name>.png), uncropped.
npm run blog:assets crops (top-anchored 2:1), converts to webp, and wires lib/asset-files.ts.
Headshots go in assets/team/<first-name>.jpg the same way.

NOTE (2026-08-30): blog figures are no longer generated images. They are authored as HTML
in scripts/blog-figures/figures/ and rendered with npm run blog:figures. A slot with a
figure HTML there belongs to the renderer, and blog:assets skips any raw drop for it.
This folder is now for photos and screenshots only. See project-sections/blog/blog-plan.md 2c.
