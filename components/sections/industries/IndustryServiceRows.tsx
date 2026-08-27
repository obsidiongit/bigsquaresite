import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { BracketIndex } from "@/components/shared/mono";
import { getService } from "@/lib/services";

/* The industry-to-service link rows (_industry-page-template.md v2
   section 4): the 6.10 ruled-row anatomy with the rule-link hover,
   where every row links to its T2 page and the one-liner is written
   for THIS industry (the anti-thin-content rule from D4, in
   miniature). Service names come from lib/services.ts (one source);
   the routes 404 until Lane 2 stamps them, the same known state as
   the nav and footer. */

export function IndustryServiceRows({
  rows,
  className,
}: {
  rows: { slug: string; line: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      {rows.map((row, i) => {
        const service = getService(row.slug);
        if (!service) return null;
        return (
          <div key={row.slug}>
            <SeparatorIn delay={i * 0.08} />
            <Reveal delay={i * 0.08}>
              <Link
                href={`/services/${row.slug}/`}
                className="group flex items-baseline gap-5 py-6 md:gap-8 md:py-7"
              >
                <BracketIndex n={i + 1} className="shrink-0 text-sec-acc" />
                <div className="min-w-0 flex-1">
                  <p className="text-h3 font-bold text-sec-ink">
                    {service.name}
                  </p>
                  <p className="mt-2 max-w-[56ch] text-body text-sec-mid">
                    {row.line}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="self-center text-[18px] text-sec-ink transition-transform duration-[250ms] ease-house group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                >
                  →
                </span>
              </Link>
            </Reveal>
          </div>
        );
      })}
      <SeparatorIn delay={rows.length * 0.08} />
    </div>
  );
}
