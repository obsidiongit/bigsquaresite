# Holding page (temporary production)

Production branch is `holding`. The full site lives on `main` and the snapshot `full-site`. When the real site is ready, point Vercel Production back to `main`.

## What ships
- `/` is a one-page capture: 3D two-tone BigSquare mark, full contact form, newsletter email.
- `/privacy-policy/` and `/terms/` stay up (forms need them).
- Every other public URL 302s to `/` and keeps its query string (old UTMs still attach).

## Copy
- Eyebrow: Site coming soon
- H1: Marketing you can count.
- Support: One team for search, ads, sites, and creative. The new site is coming soon. Send a note. We will get back to you.
- Contact H2: Talk to us.
- Newsletter H2: Get what we are seeing.

## 3D
The mark is the img2threejs-showcase badge, rebuilt in `lib/cube/logo.ts`: solid brand-blue plaque (logo.svg rounded square), traced B raised on the face (`lib/cube/glyphContours.ts`), MeshPhysicalMaterial + RoomEnvironment, no ground shadow. Reduced motion and no-WebGL fall back to the 2D `Logo`.

## Leads
Both forms still post through `submitForm` (`formType` `contact` and `newsletter`). Destination is GoHighLevel via `FORM_WEBHOOK_URL`.

In GHL: Automation → Webhook (inbound) → paste the URL into the Vercel project env as `FORM_WEBHOOK_URL`. Payload is JSON: `formType`, `page`, `utm`, `fields`, `submittedAt`. Map `fields.email`, `fields.name`, `fields.phone`, `fields.company`, `fields.message` in the GHL workflow.

Until that env is set, the UI still confirms and the server only logs the payload.

Do not add Resend for this. Resend sends mail. It does not put a lead in a pipeline.
