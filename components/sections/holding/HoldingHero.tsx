import { Jump } from "@/components/sections/holding/Jump";
import { LogoStage } from "@/components/sections/holding/LogoStage";
import { Eyebrow } from "@/components/shared/mono";
import { Section } from "@/components/shared/Section";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function HoldingHero() {
  return (
    <Section
      theme="light"
      size="none"
      className="relative flex min-h-[100svh] flex-col justify-center pt-24 pb-16 md:pt-28 md:pb-20"
    >
      <div
        className={cn(
          EDGE,
          "relative z-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-x-10",
        )}
      >
        <div className="lg:col-span-5">
          <Eyebrow>Site coming soon</Eyebrow>
          <h1 className="mt-5 max-w-[12ch] font-display text-h1 text-sec-ink md:text-display">
            Marketing you can count.
          </h1>
          <p className="mt-6 max-w-[38ch] text-lead text-sec-mid">
            One team for search, ads, sites, and creative. The new site is
            coming soon. Send a note. We will get back to you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Jump to="contact" className="pill pill-primary max-sm:w-full">
              <span className="pill-label">Talk to Us</span>
            </Jump>
            <Jump
              to="newsletter"
              className="pill pill-secondary max-sm:w-full"
            >
              <span className="pill-label">Join the List</span>
            </Jump>
          </div>
        </div>
        <div className="flex justify-center lg:col-span-7 lg:justify-end">
          <LogoStage />
        </div>
      </div>
    </Section>
  );
}
