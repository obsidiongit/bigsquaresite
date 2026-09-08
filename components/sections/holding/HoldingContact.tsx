import { ContactForm } from "@/components/sections/contact/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/shared/mono";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function HoldingContact() {
  return (
    <Section theme="tint" size="base" id="contact" className="scroll-mt-24">
      <div className={cn(EDGE, "relative z-10")}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-16">
          <div className="lg:col-span-5">
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
