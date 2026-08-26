# BigSquare Marketing Sitemap

Every URL the site will have at launch, plus the ones planned right after. Title tags and meta descriptions are first drafts. `[PLACEHOLDER]` marks anything that needs a real value.

Trailing slash: ON for all pages. Enforce with redirects.

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
| URL | Title tag (draft) | Purpose |
|---|---|---|
| `/` | Franchise & Multi-Location Marketing Agency \| BigSquare | Homepage |
| `/about/` | About BigSquare Marketing | Who we are, how we work |
| `/leadership/` | Leadership Team \| BigSquare | Team page. `[PLACEHOLDER: who is listed]` |
| `/careers/` | Careers at BigSquare | Open roles |
| `/results/` | Client Results & Case Studies \| BigSquare | Case study index |
| `/results/[slug]/` | [Result] for [Client type] \| BigSquare | One per case study. 5 to 6 at launch. `[PLACEHOLDER: slugs]` |
| `/contact/` | Contact BigSquare Marketing | Form, phone, both offices |
| `/schedule/` | Schedule a Call \| BigSquare | Calendar embed. Primary conversion page |
| `/audit/` | Get a Free Marketing Audit \| BigSquare | Secondary conversion page |
| `/ad-credit/` | Claim Your Ad Credit \| BigSquare | Popup landing page |
| `/privacy-policy/` | Privacy Policy | Legal |
| `/terms/` | Terms of Service | Legal |

### Services hub (added 2026-08-25, interior-buildout-plan.md D2)
| URL | Title tag (draft) | Purpose |
|---|---|---|
| `/services/` | Marketing Services for Multi-Location Brands \| BigSquare | Services hub; target of the homepage's `/services/#<group>` anchors |

### Services: Organic Marketing
| URL | Title tag (draft) |
|---|---|
| `/services/seo/` | SEO for Multi-Location & Franchise Brands \| BigSquare |
| `/services/generative-engine-optimization/` | Generative Engine Optimization (GEO) \| BigSquare |
| `/services/social-media/` | Social Media Management for Franchises \| BigSquare |
| `/services/content-marketing/` | Content Marketing for Multi-Location Brands \| BigSquare |
| `/services/email/` | Email & Text Marketing \| BigSquare |
| `/services/obsidion-portal/` | Obsidion Portal: See Every Lead & Every Dollar \| BigSquare |

### Services: Paid Advertising
| URL | Title tag (draft) |
|---|---|
| `/services/paid-search/` | Paid Search Management for Franchises \| BigSquare |
| `/services/google-local-services-ads/` | Google Local Services Ads Management \| BigSquare |
| `/services/paid-social/` | Paid Social Ads for Multi-Location Brands \| BigSquare |
| `/services/amazon-ads/` | Amazon Ads Management \| BigSquare |
| `/services/creator-network/` | Creator Network: Content That Sells \| BigSquare |

### Services: Design & Development
| URL | Title tag (draft) |
|---|---|
| `/services/web-design/` | Web Design for Multi-Location Brands \| BigSquare |
| `/services/branding/` | Branding & Brand Positioning \| BigSquare |
| `/services/video-production/` | Video Production & Commercials \| BigSquare |
| `/services/custom-development/` | Custom Development \| BigSquare |

### Industries
| URL | Title tag (draft) |
|---|---|
| `/industries/` | Industries We Serve \| BigSquare |
| `/industries/franchise/` | Franchise Marketing Agency \| BigSquare |
| `/industries/home-services/` | Home Services Marketing Agency \| BigSquare |
| `/industries/legal/` | Law Firm Marketing Agency \| BigSquare |
| `/industries/healthcare/` | Healthcare Marketing Agency \| BigSquare |

### Locations
| URL | Title tag (draft) |
|---|---|
| `/locations/` | Our Offices \| BigSquare |
| `/locations/denver/` | Denver Marketing Agency \| BigSquare |
| `/locations/tampa/` | Tampa Marketing Agency \| BigSquare |

### Resources
| URL | Title tag (draft) |
|---|---|
| `/blog/` | BigSquare Blog: Franchise & Multi-Location Marketing |
| `/blog/[slug]/` | Per post |
| `/resources/` | Free Guides & Tools \| BigSquare |
| `/resources/[slug]/` | One per lead magnet. 5 at launch. See `project-sections/lead-magnets/` |

### Paid traffic pages (noindex)
These are ad destinations. No nav, no footer links, `noindex`.
| URL | Purpose |
|---|---|
| `/go/[slug]/` | VSL landing pages. See `project-sections/landing-pages/vsl-template.md` |
| `/apply/[slug]/` | Application funnels. See `project-sections/landing-pages/application-funnel-template.md` |
| `/thanks/[slug]/` | Thank-you pages with next step and calendar |

## Footer (copied from the Youtech structure)
Four columns on top, three plus a badge slot on the bottom. Full spec in `project-sections/shared/footer.md`.

Row 1: Company | Organic Marketing | Paid Advertising | Design & Development
Row 2: Socials | Locations | Contact Us | Badge slot (empty until a partner badge is earned)
Bottom bar: logo, "BigSquare Marketing © [year] All Rights Reserved."
