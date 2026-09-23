import { ContactForm } from "@/components/sections/contact/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { Eyebrow } from "@/components/shared/mono";
import { Section } from "@/components/shared/Section";
import { SUPPORT_EMAIL } from "@/lib/site";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function HoldingContact() {
  return (
    <Section theme="tint" size="lg" id="contact" className="scroll-mt-24">
      <div className={cn(EDGE, "relative z-10")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-x-16">
          <div className="lg:col-span-5">
            <SeparatorIn className="mb-5 max-w-[7rem]" />
            <Eyebrow>Contact</Eyebrow>
            <Reveal>
              <h2 className="mt-5 font-display text-h2 text-sec-ink">
                Talk to us.
              </h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-5 max-w-[40ch] text-body text-sec-mid">
                Name, email, phone, company, and what you want to grow. We
                read every note.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-8 max-w-[36ch] text-small text-sec-mid">
                Prefer email?{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="underline underline-offset-2 transition-colors duration-[var(--dur-fast)] hover:text-sec-ink"
                >
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rounded-[24px] border border-sec-line bg-paper p-6 sm:p-8">
              <ContactForm confirmationFollowup={null} />
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
