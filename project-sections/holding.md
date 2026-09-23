# Holding page (temporary production)

Production branch is `holding`. The full site lives on `main` and the snapshot `full-site`. When the real site is ready, point Vercel Production back to `main`.

## What ships
- `/` is a one-page capture: 3D two-tone BigSquare mark, full contact form, newsletter email as the accent close.
- `/privacy-policy/` and `/terms/` stay up (forms need them).
- Every other public URL 302s to `/` and keeps its query string (old UTMs still attach).

## Copy
- Eyebrow: Site coming soon
- H1: One team. Search, ads, sites, creative. (circle annotation on "One team.")
- Support: The new site is coming soon. Send a note. We will get back to you.
- Contact H2: Talk to us.
- Contact body: Name, email, phone, company, and what you want to grow. We read every note.
- Newsletter H2: Notes from real accounts, in plain words.

## Motion
One entrance, on mount (7.3 hero exception). Hairline draws, eyebrow assembles, H1 words rise, then the circle draws on "One team." Support and pills fade up after. The 3D mark fades in and finishes a short settle-spin into its idle turn. Contact hairline draws on scroll. Reduced motion: settled copy, settled 2D mark, no circle boil.

## 3D
The mark is the img2threejs-showcase badge, rebuilt in `lib/cube/logo.ts`: solid brand-blue plaque (logo.svg rounded square), traced B raised on the face (`lib/cube/glyphContours.ts`), MeshPhysicalMaterial + RoomEnvironment, no ground shadow. Reduced motion and no-WebGL fall back to the 2D `Logo`.

## Leads
Both forms still post through `submitForm` (`formType` `contact` and `newsletter`). Destination is GoHighLevel via `FORM_WEBHOOK_URL`.

In GHL: Automation → Webhook (inbound) → paste the URL into the Vercel project env as `FORM_WEBHOOK_URL`. Payload is JSON: `formType`, `page`, `utm`, `fields`, `submittedAt`. Map `fields.email`, `fields.name`, `fields.phone`, `fields.company`, `fields.message` in the GHL workflow.

Until that env is set, the UI still confirms and the server only logs the payload.

Do not add Resend for this. Resend sends mail. It does not put a lead in a pipeline.
