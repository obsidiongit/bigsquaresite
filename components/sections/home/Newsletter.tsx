import { BaselineReveal } from "@/components/motion/BaselineReveal";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { NewsletterForm } from "@/components/sections/home/NewsletterForm";
import { NewsletterPanel } from "@/components/sections/home/NewsletterPanel";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

/* Newsletter capture (9b.newsletter.md v1, Brad's ask 2026-08-25): the
   brief's tertiary goal, join the email list. Youtech's composition
   (copy and form left, framed cycling image right), rebuilt in our
   system. It sits directly after the portal and stays deliberately
   quiet: it must not compete with "Schedule a Call".

   Four decisions with Brad, all recorded in the brief:
   1. LIGHT ground, not the reference's dark band. Portal above is tint,
      and the page's dark budget is already spent on the proof band and
      the footer (STYLE_GUIDE 5).
   2. The panel cycles stock frames (lib/newsletter-frames) until real photography
      lands (lib/newsletter-frames.ts owns the swap).
   3. The avatar cluster and client count stay, with Brad's real number:
      600+. The discs are placeholders until headshots are cleared.
   4. The offer is insights from the leadership team. No cadence is
      claimed until he picks one.

   Copy is DRAFT until Brad's single copy pass, like the rest of the
   region. The one number on screen traces to 9b.newsletter.md.

   2026-10-09: the newsletter CLOSES the homepage now (the first 90 days
   section and its closing CTA are retired), and the page lifts off the
   curtain footer from here. The section is the last sheet of paper: it
   overlaps the footer's reveal by its bottom radius, so as you scroll
   the rounded edge and its shadow peel up off the footer underneath.
   New copy (the review: the old headline "sounds insane"). */

export function Newsletter() {
  return (
    <Section
      theme="light"
      size="base"
      id="newsletter"
      className="z-10 -mb-[var(--sheet-r)] rounded-b-[var(--sheet-r)] pb-[calc(var(--section-y)+var(--sheet-r))] shadow-[0_28px_60px_-12px_rgba(0,6,31,.45)] [--sheet-r:clamp(24px,3vw,44px)]"
    >
      <div className={cn(EDGE, "relative z-10")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-x-16">
          {/* ---- copy, form, proof --------------------------------- */}
          <div className="lg:col-span-6">
            <div className="max-w-[36rem]">
              <BaselineReveal
                as="h2"
                className="font-display text-h2 text-sec-ink"
              >
                {"What's working right now."}
              </BaselineReveal>

              <Reveal stagger className="mt-6">
                <RevealItem>
                  <p className="max-w-[46ch] text-body text-sec-mid">
                    Short notes from our team on what is working across the
                    ads, search, and sites we run. Plain words. Leave any
                    time.
                  </p>
                </RevealItem>

                <RevealItem className="mt-8 md:mt-10">
                  <NewsletterForm />
                </RevealItem>

              </Reveal>
            </div>
          </div>

          {/* ---- the cycling panel --------------------------------- */}
          {/* registration marks retired here 2026-08-30 (Brad),
              extending the 2026-08-26 new-page rule to the home page */}
          <div className="relative max-w-[26rem] lg:col-span-5 lg:col-start-8 lg:max-w-none">
            <ClipReveal>
              <NewsletterPanel />
            </ClipReveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
