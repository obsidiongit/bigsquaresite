# Asset Manifest

Brad's end-of-build shopping list (started 2026-08-26, flagship round 2). Every interior media slot renders a designed placeholder until its file lands. **To fill a slot: drop the file into `public/media/`, then add one line to `lib/asset-files.ts` mapping the slot id to the path.** The placeholder and its mono ASSET chip drop automatically; alt text is already written in the page's content module.

Rules: append a row here in the SAME session any new slot ships. Photos beat stock; the portal and real work beat both. No text baked into images (copy lives in the page). Landscape sources at 2x display size; WebP or AVIF preferred, JPG fine (next/image re-encodes).

## Slots

| Slot id | Page(s) | Placement | What to drop | Aspect | Status |
|---|---|---|---|---|---|
| `services-seo-hero` | /services/seo/ | Hero, right framed object | Portal rankings view or map-grid rank tracker; anything with visible city-by-city structure | 1:1 | EMPTY |
| `services-seo-band` | /services/seo/ | Wide band between process and spine (links to /results/) | Team at work, strategy wall, or a portal report on a big screen | ~21:9 (16:9 mobile crop safe) | EMPTY |
| `industries-franchise-card` | /services/seo/ + every service page linking Franchise; later /industries/ | Linked industry card | Franchise-feel image (storefront row, multi-unit signage) | 3:2 | EMPTY |
| `industries-home-services-card` | /services/seo/ + every service page linking Home Services; later /industries/ | Linked industry card | Home-services-feel image (tech at a door, branded van) | 3:2 | EMPTY |
| `franchise-hero` | /industries/franchise/ | Hero, right framed object | Franchise client storefront or team on site; a real client beats anything staged | 4:3 | EMPTY |
| `franchise-method` | /industries/franchise/ | Band inside the method spine (between "Franchise development is marketing too" and "Money that knows its job") | Obsidion portal in use, over the shoulder, or a location walkthrough | 16:9 | EMPTY |
| `industries-legal-card` | Service pages linking Legal | Linked industry card | Legal-feel image (office, consultation) | 3:2 | EMPTY |
| `industries-healthcare-card` | Service pages linking Healthcare | Linked industry card | Healthcare-feel image (practice front desk, treatment room) | 3:2 | EMPTY |
| `services-social-media-hero` | /services/social-media/ | Hero, right framed object | Phone with a client feed open, or a content calendar wall | 1:1 | EMPTY |
| `services-social-media-band` | /services/social-media/ | Wide band (links /results/) | Content being made, a set, or a grid of client posts | ~21:9 | EMPTY |
| `services-generative-engine-optimization-band` | /services/generative-engine-optimization/ | Wide band after spine (links /results/) | An answer-engine response naming a client, or answer-log review | ~21:9 | EMPTY |
| `services-content-marketing-hero` | /services/content-marketing/ | Hero band under the statement | Writing in progress, an article on screen, or a plan board | ~2.4:1 | EMPTY |
| `services-content-marketing-band` | /services/content-marketing/ | Wide band after spine (links /results/) | Published pieces in a grid, or a reader-facing article | ~21:9 | EMPTY |
| `services-email-band` | /services/email/ | Wide band (links /results/) | A message thread with a customer, or the send calendar | ~21:9 | EMPTY |
| `services-obsidion-portal-exhibit` | /services/obsidion-portal/ | THE CENTERPIECE exhibit after "who it is for" | Wide clean screenshot or short recording of the real portal | ~2:1 | EMPTY |
| `services-obsidion-portal-band` | /services/obsidion-portal/ | Wide band after spine (links /results/) | Client + team walking through the portal together | ~21:9 | EMPTY |
| `services-paid-search-hero` | /services/paid-search/ | Hero, right framed object | Search results with a client ad on top, or campaign structure | 1:1 | EMPTY |
| `services-paid-search-band` | /services/paid-search/ | Wide band (links /results/) | Campaign review in progress, or a results screen | ~21:9 | EMPTY |
| `services-google-local-services-ads-band` | /services/google-local-services-ads/ | Wide band (links /results/) | Google Guaranteed badge in live results, or call log review | ~21:9 | EMPTY |
| `services-paid-social-hero` | /services/paid-social/ | Hero band under the statement | Ad creative variations, or a phone mid-scroll on a client ad | ~2.4:1 | EMPTY |
| `services-paid-social-band` | /services/paid-social/ | Wide band after spine (links /results/) | Performance review, or a wall of creative tests | ~21:9 | EMPTY |
| `services-amazon-ads-hero` | /services/amazon-ads/ | Hero, right framed object | Product listing with sponsored placement, or campaign console | 1:1 | EMPTY |
| `services-amazon-ads-band` | /services/amazon-ads/ | Wide band (links /results/) | Product photography, or a campaign review | ~21:9 | EMPTY |
| `services-creator-network-hero` | /services/creator-network/ | Hero band under the statement | A creator filming with a client product or location | ~2.4:1 | EMPTY |
| `services-creator-network-band` | /services/creator-network/ | Wide band after spine (links /results/) | A clip mid-edit, or a wall of clip thumbnails | ~21:9 | EMPTY |
| `services-web-design-hero` | /services/web-design/ | Hero band under the statement | A finished client site on desktop and phone together | ~2.4:1 | EMPTY |
| `services-web-design-band` | /services/web-design/ | Wide band after spine (links /results/) | Design files, or a before-and-after of a client site | ~21:9 | EMPTY |
| `services-branding-hero` | /services/branding/ | Hero, right framed object | Brand elements arranged together: mark, type, color | 1:1 | EMPTY |
| `services-branding-band` | /services/branding/ | Wide band (links /results/) | The brand applied on vehicles, signage, or uniforms | ~21:9 | EMPTY |
| `services-video-production-hero` | /services/video-production/ | Hero band under the statement | A shoot in progress at a real client location | ~2.4:1 | EMPTY |
| `services-video-production-band` | /services/video-production/ | Wide band after spine (links /results/) | Behind-the-scenes still from a real shoot | ~21:9 | EMPTY |
| `services-custom-development-band` | /services/custom-development/ | Wide band (links /results/) | A custom portal or internal tool on screen | ~21:9 | EMPTY |

| `home-services-hero` | /industries/home-services/ | Hero, right framed object | Tech at the door or a branded truck; a real crew beats stock | 4:3 | EMPTY |
| `home-services-method` | /industries/home-services/ | Band inside the method spine (after "Win the minute that matters") | Dispatch board or the portal on an office screen | 16:9 | EMPTY |
| `legal-hero` | /industries/legal/ | Hero, right framed object | Attorneys in consult or the office exterior | 4:3 | EMPTY |
| `legal-method` | /industries/legal/ | Band inside the method spine (after "Offices compete. The firm wins.") | Intake dashboard or the attorney team | 16:9 | EMPTY |
| `healthcare-hero` | /industries/healthcare/ | Hero, right framed object | Front desk or practice interior, people over equipment | 4:3 | EMPTY |
| `healthcare-method` | /industries/healthcare/ | Band inside the method spine (after "From search to booked visit") | Booking screen or the care team | 16:9 | EMPTY |
Shared industry-card assets are deliberate: one file serves every page that links that industry (service pages and, since 2026-08-26, the /industries/ hub's four cards).
