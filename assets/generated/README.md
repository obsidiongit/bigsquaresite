# assets/generated/: the candidate archive

Every asset the in-house pipeline makes lands here first, one folder per manifest slot id:

```
assets/generated/<slot-id>/
  code-v1.webp     candidates; code-v* from scripts/asset-studio/, gen-v* from Codex/Higgsfield
  gen-v1.webp
  notes.md         sidecar: per version, the prompt or source HTML + date + lane
```

Rules (from `project-sections/assets/asset-fill-plan.md`):

- NOTHING moves from here to `public/media/` until Brad approves it on `/dev/assets` (the contact sheet walks this folder automatically).
- Promoting a winner: copy the file to `public/media/<slot-id>.<ext>`, add its `lib/asset-files.ts` row, flip the manifest row to FILLED + date + lane, same session.
- This folder is the archive Brad asked for: keep every candidate, culled ones included. Never `git add -A`; stage candidates by path.
- Codex stills are free: generate wide, cull hard, keep the keepers here.
