# BigSquare Marketing Sitemap

**This is the single endpoint tracker.** Every URL the site will have at launch, with its current status. Update the STATUS column whenever a page changes state; session detail goes nowhere else (history is archived in `archive/build-log.md`).

STATUS values:
- **built**: real page, shipped and verified
- **shell**: resolves, but only a stub or skeleton
- **404**: does not resolve yet; build when its batch comes up
- **blocked-on-content**: cannot become a real page until Brad (or Mike) provides content; noted in parentheses

Trailing slash: ON for all pages. Enforce with redirects. Title tags and meta descriptions are first drafts. `[PLACEHOLDER]` marks anything that needs a real value.

## Primary navigation
Order matches Youtech's proven structure, renamed for BigSquare.

| Nav label | Type | Links to |
|---|---|---|
| Who We Are | Dropdown | About, Leadership, Careers |
| Services | Mega menu | 3 columns, see below |
| Industries | Dropdown | Franchise, Home Services, Legal, Healthcare |
| Results | Link | /results/ |
| Contact | Link | /contact/ |
| Login | Link (icon) | Obsidion portal `[PLACEHOLDER: portal URL]` |
| Schedule a Call | Button (accent) | /schedule/ |

## Services mega menu (3 columns)

**Organic Marketing**
- Search Engine Optimization (SEO)
- Generative Engine Optimization (GEO)
- Social Media
- Content Marketing
- Email
- Obsidion Portal

**Paid Advertising**
- Paid Search
- Google Local Services Ads
- Paid Social
- Amazon Ads
- Creator Network

**Design & Development**
- Web Design
- Branding
- Video Production
- Custom Development

Menu footer strip: "Ready to grow? Schedule a Call" linking to /schedule/.

## Full URL list

### Core
| URL | STATUS | Title tag (draft) | Purpose |
|---|---|---|---|
| `/` | built | Franchise & Multi-Location Marketing Agency \| BigSquare | Homepage, ~85%; punch list in tasks.md |
| `/about/` | built (Batch 1 reviewed 2026-08-27) | About BigSquare Marketing | Owed: founding story, team + founders photos, sourced metrics |
| `/leadership/` | blocked-on-content (names + photos) | Leadership Team \| BigSquare | Team page. `[PLACEHOLDER: who is listed]` |
| `/careers/` | built (Batch 2, 2026-08-27, awaiting batch review) | Careers at BigSquare | Owed: remote policy, open roles, application destination |
| `/results/` | built (Batch 2, 2026-08-27, awaiting batch review) | Client Results & Case Studies \| BigSquare | Real index; card grid stays flagged placeholder until real case studies land |
| `/results/[slug]/` | blocked-on-content (real case-study data) | [Result] for [Client type] \| BigSquare | 6 noindex skeletons live; template ready |
| `/contact/` | built (Batch 1 reviewed 2026-08-27) | Contact BigSquare Marketing | Form + offices + FAQ (D5). Owed: office addresses + phones |
| `/schedule/` | built | Schedule a Call \| BigSquare | Primary conversion page, v2. Owed: VSL film, copy pass, GHL wiring |
| `/audit/` | built (Batch 1 reviewed 2026-08-27) | Get a Free Marketing Audit \| BigSquare | Secondary conversion page. Owed: audit deliverables + turnaround |
| `/ad-credit/` | blocked-on-content (offer terms) | Claim Your Ad Credit \| BigSquare | Popup landing page, Batch 3 |
| `/privacy-policy/` | shell (legal copy owed) | Privacy Policy | Legal |
| `/terms/` | shell (legal copy owed) | Terms of Service | Legal |

### Services hub
| URL | STATUS | Title tag (draft) | Purpose |
|---|---|---|---|
| `/services/` | built | Marketing Services for Multi-Location Brands \| BigSquare | Hub; target of the homepage's `/services/#<group>` anchors |

### Services: Organic Marketing
| URL | STATUS | Title tag (draft) |
|---|---|---|
| `/services/seo/` | built | SEO for Multi-Location & Franchise Brands \| BigSquare |
| `/services/generative-engine-optimization/` | built | Generative Engine Optimization (GEO) \| BigSquare |
| `/services/social-media/` | built | Social Media Management for Franchises \| BigSquare |
| `/services/content-marketing/` | built | Content Marketing for Multi-Location Brands \| BigSquare |
| `/services/email/` | built | Email & Text Marketing \| BigSquare |
| `/services/obsidion-portal/` | built | Obsidion Portal: See Every Lead & Every Dollar \| BigSquare |

### Services: Paid Advertising
| URL | STATUS | Title tag (draft) |
|---|---|---|
| `/services/paid-search/` | built | Paid Search Management for Franchises \| BigSquare |
| `/services/google-local-services-ads/` | built | Google Local Services Ads Management \| BigSquare |
| `/services/paid-social/` | built | Paid Social Ads for Multi-Location Brands \| BigSquare |
| `/services/amazon-ads/` | built | Amazon Ads Management \| BigSquare |
| `/services/creator-network/` | built | Creator Network: Content That Sells \| BigSquare |

### Services: Design & Development
| URL | STATUS | Title tag (draft) |
|---|---|---|
| `/services/web-design/` | built | Web Design for Multi-Location Brands \| BigSquare |
| `/services/branding/` | built | Branding & Brand Positioning \| BigSquare |
| `/services/video-production/` | built | Video Production & Commercials \| BigSquare |
| `/services/custom-development/` | built | Custom Development \| BigSquare |

Planned wave 2: ~10 franchise/multi-location service-template variants (D4). Slugs come from the Ahrefs keyword pass; amend this file when they exist.

### Industries
| URL | STATUS | Title tag (draft) |
|---|---|---|
| `/industries/` | built | Industries We Serve \| BigSquare |
| `/industries/franchise/` | built | Franchise Marketing Agency \| BigSquare |
| `/industries/home-services/` | built | Home Services Marketing Agency \| BigSquare |
| `/industries/legal/` | built | Law Firm Marketing Agency \| BigSquare |
| `/industries/healthcare/` | built | Healthcare Marketing Agency \| BigSquare |

### Locations
| URL | STATUS | Title tag (draft) |
|---|---|---|
| `/locations/` | built (Batch 2, 2026-08-27, awaiting batch review) | Our Offices \| BigSquare |
| `/locations/denver/` | built (Batch 2, 2026-08-27, awaiting batch review; address + phone + photo owed) | Denver Marketing Agency \| BigSquare |
| `/locations/tampa/` | built (Batch 2, 2026-08-27, awaiting batch review; address + phone + photo owed) | Tampa Marketing Agency \| BigSquare |

### Resources
| URL | STATUS | Title tag (draft) |
|---|---|---|
| `/blog/` | 404 (Batch 4, MDX pipeline) | BigSquare Blog: Franchise & Multi-Location Marketing |
| `/blog/[slug]/` | blocked-on-content (topics from keyword pass) | Per post. 2 at launch |
| `/resources/` | 404 (Batch 4) | Free Guides & Tools \| BigSquare |
| `/resources/[slug]/` | blocked-on-content (lead-magnet assets) | One per lead magnet. 5 at launch. See `project-sections/lead-magnets/` |

### Paid traffic pages (noindex)
Ad destinations. No nav, no footer links, `noindex`. Templates are Batch 3; one flagship each gets green-lit inside the batch. Alternate palettes per D6.
| URL | STATUS | Purpose |
|---|---|---|
| `/go/[slug]/` | built (Batch 3, 2026-08-30, awaiting batch review; flagship `/go/audit/`) | VSL landing pages. Dark ground, `lib/funnels/registry.ts`. Owed: video URL + poster, one sourced result, video length, offer terms. Spec archived |
| `/apply/[slug]/` | built (Batch 3, 2026-08-30, awaiting batch review; flagship `/apply/growth-partner/`) | Application funnels. Tint ground, 6-step form posts via `submitForm` then routes to `/thanks/`. Owed: budget ranges + qualifying floor, offer terms. Spec archived |
| `/thanks/[slug]/` | built (Batch 3, 2026-08-30, awaiting batch review; `/thanks/audit/`, `/thanks/growth-partner/`) | Thank-you pages with next step. Accent ground, UTMs kept on the URL, fires `booked`. Owed: turnaround |

## Footer (copied from the Youtech structure)
Four columns on top, three plus a badge slot on the bottom. Built; spec archived (`archive/project-sections/footer.md`).

Row 1: Company | Organic Marketing | Paid Advertising | Design & Development
Row 2: Socials | Locations | Contact Us | Badge slot (empty until a partner badge is earned)
Bottom bar: logo, "BigSquare Marketing © [year] All Rights Reserved."
