import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { FooterWordmark } from "@/components/shared/FooterWordmark";
import { OfficeTime } from "@/components/shared/OfficeClocks";
import { Section } from "@/components/shared/Section";
import { FOOTER_COLUMNS } from "@/lib/footer-links";
import { PORTAL_URL, SITE_NAME, SUPPORT_EMAIL } from "@/lib/site";

/* The footer (6.8, rebuilt 2026-08-30: "good, not great, too much
   chaos"). One calm composition on the dark ground, three rows, one
   hairline between each, nothing boxed:
   1. the wordmark at container width, the footer's one big move;
   2. the four link columns (Company / Organic / Paid / Design & Dev)
      as plain lists at md+, a ruled accordion below md (native
      <details>, so it works with no JS and under reduced motion);
   3. the offices with their live clocks, contact, and the client
      login, then the legal line on the last hairline.
   The pixel-grid paint layer is cut. Footer links stay silent on
   hover (no data-sfx). Socials and office phones are still unconfirmed:
   they render as visible [PLACEHOLDER] tags per the 2026-08-30 handoff
   so nobody forgets them. Mounts in the marketing layout; funnel
   routes stay outside it. */

const HEAD = "text-[16px] font-bold text-sec-ink";
const LINK =
  "text-[15px] text-sec-mid transition-colors duration-150 hover:text-sec-ink";
const NOTE = "font-mono text-mono-sm uppercase text-sec-mid";

const OFFICES = [
  { label: "Denver", href: "/locations/denver/", timeZone: "America/Denver" },
  { label: "Tampa", href: "/locations/tampa/", timeZone: "America/New_York" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <Section as="footer" theme="dark" size="none" className="overflow-hidden">
      <Container className="pb-8 pt-12 md:pb-8 md:pt-14">
        {/* Row 1: the wordmark */}
        <FooterWordmark />

        {/* Row 2: link columns. md+: four plain lists on one hairline. */}
        <nav
          aria-label="Footer"
          className="mt-8 hidden grid-cols-4 gap-x-8 border-t border-sec-line pt-6 md:grid md:mt-10"
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
        </nav>

        {/* Row 2, below md: the same columns as a ruled accordion. The
            open marker is the brand square, quarter-turned when open. */}
        <nav
          aria-label="Footer"
          className="mt-8 border-t border-sec-line md:hidden"
        >
          {FOOTER_COLUMNS.map((column) => (
            <details key={column.title} className="group border-b border-sec-line">
              <summary
                className={`flex cursor-pointer list-none items-center justify-between py-4 ${HEAD} [&::-webkit-details-marker]:hidden`}
              >
                {column.title}
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 bg-sec-acc transition-transform duration-[250ms] ease-house group-open:rotate-45 motion-reduce:transition-none"
                />
              </summary>
              <ul className="space-y-3 pb-5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={LINK}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </nav>

        {/* Row 3: offices with clocks, contact, client login */}
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-sec-line pt-6 md:mt-10 md:grid-cols-4 md:gap-x-8">
          {OFFICES.map((office) => (
            <div key={office.href}>
              <Link href={office.href} className={`${HEAD} hover:text-sec-acc transition-colors duration-150`}>
                {office.label}
              </Link>
              <p className="mt-2 flex items-center gap-2 text-[15px] text-sec-mid">
                <span aria-hidden className="size-[7px] shrink-0 bg-sec-acc" />
                <OfficeTime timeZone={office.timeZone} className="text-sec-ink" />
                local
              </p>
              <p className={`mt-2 ${NOTE}`}>[PLACEHOLDER: office phone]</p>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <p className={HEAD}>Contact</p>
            <p className="mt-2">
              <a href={`mailto:${SUPPORT_EMAIL}`} className={LINK}>
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p className={`mt-2 ${NOTE}`}>[PLACEHOLDER: social links]</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className={HEAD}>Clients</p>
            <p className="mt-2">
              <a
                href={PORTAL_URL}
                target="_blank"
                rel="noopener"
                className={`group inline-flex items-center gap-2 ${LINK}`}
              >
                Login
                <span
                  aria-hidden
                  className="transition-transform duration-[250ms] ease-house group-hover:translate-x-1 motion-reduce:transition-none"
                >
                  ↗
                </span>
              </a>
            </p>
          </div>
        </div>

        {/* Legal line on the last hairline */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-sec-line pt-5 text-[14px] md:mt-10">
          <span className="text-sec-mid">
            {SITE_NAME} © {year} All Rights Reserved.
          </span>
          <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy-policy/" className={LINK}>
              Privacy Policy
            </Link>
            <Link href="/terms/" className={LINK}>
              Terms
            </Link>
            {/* CCPA/CPRA-shaped link (legal-pages-plan.md): targets the
                privacy page's rights H2 (id from mdx-components' slugify) */}
            <Link
              href="/privacy-policy/#your-choices-and-rights"
              className={LINK}
            >
              Do not sell or share my personal information
            </Link>
          </span>
        </div>
      </Container>
    </Section>
  );
}
