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
   2. The panel cycles honest PLACEHOLDER frames until real photography
      lands (lib/newsletter-frames.ts owns the swap).
   3. The avatar cluster and client count stay, with Brad's real number:
      600+. The discs are placeholders until headshots are cleared.
   4. The offer is insights from the leadership team. No cadence is
      claimed until he picks one.

   Copy is DRAFT until Brad's single copy pass, like the rest of the
   region. The one number on screen traces to 9b.newsletter.md. */

/* Five overlapping discs plus the count chip: the reference's proof
   cluster. Decoration only, aria-hidden; the sentence beside it carries
   every claim. The discs stay empty on purpose. Putting invented faces
   here would be exactly the fake the copy rules ban, and the mono note
   under the line keeps the placeholder visible instead of finished. */
function AvatarCluster() {
  return (
    <div aria-hidden className="flex items-center">
      <div className="flex -space-x-2">
        {[0, 1, 2, 3, 4].map((disc) => (
          <span
            key={disc}
            className="size-8 rounded-full border border-sec-line bg-surf ring-2 ring-sec-bg"
          />
        ))}
      </div>
      <span className="ml-2 flex h-8 items-center rounded-full bg-sec-acc px-2.5 font-mono text-mono-sm uppercase tabular-nums text-onacc">
        600+
      </span>
    </div>
  );
}

export function Newsletter() {
  return (
    <Section theme="light" size="base" id="newsletter">
      <div className={cn(EDGE, "relative z-10")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-x-16">
          {/* ---- copy, form, proof --------------------------------- */}
          <div className="lg:col-span-6">
            <div className="max-w-[36rem]">
              <BaselineReveal
                as="h2"
                className="font-display text-h2 text-sec-ink"
              >
                Sleep soundly. You are in good company.
              </BaselineReveal>

              <Reveal stagger className="mt-6">
                <RevealItem>
                  <p className="max-w-[46ch] text-body text-sec-mid">
                    Most marketing advice is a guess. Ours is not. Subscribe
                    to get what our team is seeing across real client
                    accounts, in plain words.
                  </p>
                </RevealItem>

                <RevealItem className="mt-8 md:mt-10">
                  <NewsletterForm />
                </RevealItem>

                <RevealItem className="mt-6">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                    <AvatarCluster />
                    <p className="text-small text-sec-mid">
                      Join the 600+ clients who trust BigSquare.
                    </p>
                  </div>
                  <p className="mt-3 font-mono text-mono-sm uppercase text-sec-mid">
                    [PLACEHOLDER: client headshots]
                  </p>
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
