import { Container } from "@/components/shared/Container";
import { GridLines } from "@/components/shared/GridLines";
import { RuleLink } from "@/components/shared/RuleLink";
import { RuledLinkTable } from "@/components/shared/RuledLinkTable";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

/* Services (6.services.md v2): the full catalog, filed. Fifteen
   services as ruled mono index tables (RuledLinkTable), the same
   treatment the footer's link tables use so the two read as one
   system. Every item links to its real slug from sitemap.md (the
   service pages themselves build in Phase 4). No icons: the mono
   indexes and rules are the iconography. */

const GROUPS = [
  {
    title: "Organic Marketing",
    href: "/services/#organic-marketing",
    items: [
      { label: "Search Engine Optimization (SEO)", href: "/services/seo/" },
      { label: "Generative Engine Optimization (GEO)", href: "/services/generative-engine-optimization/" },
      { label: "Social Media", href: "/services/social-media/" },
      { label: "Content Marketing", href: "/services/content-marketing/" },
      { label: "Email", href: "/services/email/" },
      { label: "Obsidion Portal", href: "/services/obsidion-portal/" },
    ],
  },
  {
    title: "Paid Advertising",
    href: "/services/#paid-advertising",
    items: [
      { label: "Paid Search", href: "/services/paid-search/" },
      { label: "Google Local Services Ads", href: "/services/google-local-services-ads/" },
      { label: "Paid Social", href: "/services/paid-social/" },
      { label: "Amazon Ads", href: "/services/amazon-ads/" },
      { label: "Creator Network", href: "/services/creator-network/" },
    ],
  },
  {
    title: "Design & Development",
    href: "/services/#design-development",
    items: [
      { label: "Web Design", href: "/services/web-design/" },
      { label: "Branding", href: "/services/branding/" },
      { label: "Video Production", href: "/services/video-production/" },
      { label: "Custom Development", href: "/services/custom-development/" },
    ],
  },
];

export function Services() {
  return (
    <Section theme="light" anchor="services">
      <GridLines />
      <Container className="relative z-10">
        <SectionHeader
          no={4}
          label="SERVICES"
          title="Everything a growing brand needs, in one place."
          support="No descriptions here. Each service page carries the detail."
        />

        <div className="mt-12 space-y-12 md:mt-16">
          {GROUPS.map((group, i) => (
            <RuledLinkTable
              key={group.title}
              index={i + 1}
              title={group.title}
              href={group.href}
              items={group.items}
            />
          ))}
        </div>

        <Reveal className="mt-12 md:flex md:justify-end">
          <RuleLink href="/audit/" className="md:w-[38%]">
            Not sure where to start? Get a Free Audit
          </RuleLink>
        </Reveal>
      </Container>
    </Section>
  );
}
