import { Chip } from "@/components/shared/mono";
import { cn } from "@/lib/utils";

/* <ProcessCard> (STYLE_GUIDE.md 6.4, metacci): the process / timeline
   card. Outlined, no fill: mono chip holding the step number (digits
   in --sec-acc), a short verb title in Apfel 700, a 1 to 2 sentence
   body, then a checklist with check glyphs in --sec-acc. Not a link;
   never hovers. First shipped on the T2 service template
   (_service-page-template.md v2); industry pages reuse it for the
   interior-grade timeline (day-range chips stay a caller variant). */

function CheckGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="mt-[5px] h-3.5 w-3.5 shrink-0 text-sec-acc"
    >
      <path
        d="M2.5 8.5 6 12l7.5-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProcessCard({
  index,
  title,
  body,
  checklist,
  className,
}: {
  index: number;
  title: string;
  body: string;
  checklist: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-sec-line p-6 md:p-8",
        className,
      )}
    >
      <Chip>
        <span className="text-sec-acc">{String(index).padStart(2, "0")}</span>
      </Chip>
      <p className="mt-5 text-h3 font-bold text-sec-ink">{title}</p>
      <p className="mt-2 text-body text-sec-mid">{body}</p>
      <ul className="mt-5 space-y-2">
        {checklist.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <CheckGlyph />
            <span className="text-small text-sec-ink">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
