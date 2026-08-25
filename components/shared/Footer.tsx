import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { FooterPixelGrid } from "@/components/shared/FooterPixelGrid";
import { FooterWordmark } from "@/components/shared/FooterWordmark";
import { OfficeTime } from "@/components/shared/OfficeClocks";
import { Section } from "@/components/shared/Section";
import { FOOTER_COLUMNS } from "@/lib/footer-links";
import { SITE_NAME, SUPPORT_EMAIL } from "@/lib/site";

/* The footer (shared/footer.md v3.1): Youtech's information design on
   the dark ground, E2VC's playfulness kept compact. Four plain link
   columns (no rules, no mono tables, no rails: the open-region calm,
   Brad's round-1 correction), then the locations row with live clocks
   behind a small brand-square glyph, contact, the legal line, and the
   set piece: the viewport-wide BIGSQUARE wordmark cropped by the page's
   bottom edge. The paint-the-footer pixel grid rides between the ground
   and the content (desktop fine pointers only). Socials and office
   phones are OMITTED until Brad confirms them (nothing fake, no visible
   placeholder debris in site chrome; tracked in tasks.md). Badge slot:
   renders nothing until a partner badge is earned, never an empty box.
   Mounts in the marketing layout; funnel routes stay outside it. */

const HEAD = "text-[16px] font-bold text-sec-ink";
const LINK =
  "text-[15px] text-sec-mid transition-colors duration-150 hover:text-sec-ink";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <Section as="footer" theme="dark" size="none" className="overflow-hidden">
      <FooterPixelGrid />

      <div className="relative z-10">
        <Container className="pt-12 md:pt-14">
          {/* Row 1: the four link columns, the services IA mirrored.
              Row 2 sits in the SAME grid so locations and contact align
              to the same columns instead of starting a new block. */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-8 lg:grid-cols-4"
          >
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <p className={HEAD}>{column.title}</p>
                <ul className="mt-3.5 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={LINK}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Locations with live local time. Socials and office phones
                join here once Brad confirms them; the badge slot renders
                nothing until a badge is earned. */}
            <div className="lg:col-start-1">
              <p className={HEAD}>Locations</p>
              <ul className="mt-3.5 space-y-2">
                {[
                  {
                    label: "Denver",
                    href: "/locations/denver/",
                    timeZone: "America/Denver",
                  },
                  {
                    label: "Tampa",
                    href: "/locations/tampa/",
                    timeZone: "America/New_York",
                  },
                ].map((office) => (
                  <li key={office.href} className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="size-[7px] shrink-0 bg-sec-acc"
                    />
                    <Link href={office.href} className={LINK}>
                      {office.label}
                    </Link>
                    <OfficeTime
                      timeZone={office.timeZone}
                      className="text-[15px] text-sec-ink"
                    />
                  </li>
                ))}
              </ul>
            </div>
            {/* spans both mobile columns: the support address is wider
                than a 155px half-column at 375 and the section's
                overflow-hidden (the wordmark crop) would clip it */}
            <div className="col-span-2 lg:col-span-1">
              <p className={HEAD}>Contact Us</p>
              <ul className="mt-3.5 space-y-2">
                <li>
                  <a href={`mailto:${SUPPORT_EMAIL}`} className={LINK}>
                    {SUPPORT_EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          {/* Legal line. No mark here: the wordmark below is the mark. */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[14px] md:mt-12">
            <span className="text-sec-mid">
              {SITE_NAME} © {year} All Rights Reserved.
            </span>
            <span className="flex items-center gap-x-5">
              <Link href="/privacy-policy/" className={LINK}>
                Privacy Policy
              </Link>
              <Link href="/terms/" className={LINK}>
                Terms
              </Link>
            </span>
          </div>
        </Container>
      </div>

      {/* The set piece: full bleed, cropped by the page's final pixels */}
      <div className="relative z-10 mt-8 md:mt-10">
        <FooterWordmark />
      </div>
    </Section>
  );
}
