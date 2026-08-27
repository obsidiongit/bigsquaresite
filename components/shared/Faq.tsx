import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/shared/mono";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqJsonLd } from "@/lib/jsonld";

/* <Faq> (STYLE_GUIDE.md 6.7, metacci's "Before you book" objection
   pattern): eyebrow + H2 centered, then ONE bordered container
   (radius 16, divide-y hairlines) of accordion items. Question in
   Apfel 700 at 18px left, chevron right; answer in body text at
   --sec-mid. One item open at a time. FAQPage JSON-LD is emitted from
   the SAME array that renders the accordion (one source,
   seo-requirements.md). First shipped on the T2 service template;
   /contact/ and /schedule/ reuse it for the buyer-process set (D5). */

export type FaqItem = { q: string; a: string };

export function Faq({
  eyebrow = "FAQ",
  title,
  items,
}: {
  eyebrow?: string;
  title: string;
  items: FaqItem[];
}) {
  return (
    <div className="mx-auto max-w-[800px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(items)) }}
      />
      <Eyebrow className="text-center">{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-center font-display text-h2 text-sec-ink">
        {title}
      </h2>
      <Reveal className="mt-10 md:mt-12">
        <Accordion
          type="single"
          collapsible
          className="rounded-[16px] border border-sec-line px-6 md:px-8"
        >
          {items.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="gap-4 rounded-none border-0 py-5 text-[18px] font-bold text-sec-ink hover:no-underline focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-acc **:data-[slot=accordion-trigger-icon]:text-sec-mid">
                {item.q}
              </AccordionTrigger>
              {/* forceMount (Lane 3 flagship fix, 2026-08-25): without it
                  Radix unmounts closed answers, so none of the FAQ copy
                  was in the served HTML (probed by curl: the text existed
                  only inside the JSON-LD script). STYLE_GUIDE 10 requires
                  copy to render server-side. Radix drops its `hidden`
                  attribute after hydration under forceMount, so the
                  data-state variant does the hiding (probed: without it
                  every answer rendered open). */}
              <AccordionContent
                forceMount
                className="pb-5 text-body text-sec-mid [[data-state=closed]_&]:hidden"
              >
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </div>
  );
}
