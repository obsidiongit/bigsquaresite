"use client";

import { motion, type Variants } from "framer-motion";
import { HoldingHeadline } from "@/components/sections/holding/HoldingHeadline";
import { Jump } from "@/components/sections/holding/Jump";
import { LogoStage } from "@/components/sections/holding/LogoStage";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { TitleAssemble } from "@/components/motion/TitleAssemble";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { Section } from "@/components/shared/Section";
import { EASE } from "@/lib/motion";
import { EDGE } from "@/lib/layout";
import { cn } from "@/lib/utils";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE.house },
  },
};

export function HoldingHero() {
  const reduced = useReducedMotionSafe();

  return (
    <Section
      theme="light"
      size="none"
      className="relative flex min-h-[100svh] flex-col justify-center pt-24 pb-16 md:pt-28 md:pb-24"
    >
      <div
        className={cn(
          EDGE,
          "relative z-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-x-12",
        )}
      >
        <div className="lg:col-span-5">
          <SeparatorIn onMount className="mb-5 max-w-[7rem]" />
          <p className="font-mono text-eyebrow uppercase text-sec-mid">
            <TitleAssemble onMount delay={0.05}>
              Site coming soon
            </TitleAssemble>
          </p>
          <HoldingHeadline />
          {reduced ? (
            <>
              <p className="mt-6 max-w-[38ch] text-lead text-sec-mid">
                The new site is coming soon. Send a note. We will get back to
                you.
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
            </>
          ) : (
            <>
              <motion.p
                className="mt-6 max-w-[38ch] text-lead text-sec-mid"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE.house, delay: 0.42 }}
              >
                The new site is coming soon. Send a note. We will get back to
                you.
              </motion.p>
              <motion.div
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.08, delayChildren: 0.55 },
                  },
                }}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={fadeUp}>
                  <Jump to="contact" className="pill pill-primary max-sm:w-full">
                    <span className="pill-label">Talk to Us</span>
                  </Jump>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Jump
                    to="newsletter"
                    className="pill pill-secondary max-sm:w-full"
                  >
                    <span className="pill-label">Join the List</span>
                  </Jump>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
        <motion.div
          className="flex justify-center lg:col-span-7 lg:justify-end"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE.soft, delay: 0.16 }}
        >
          <LogoStage />
        </motion.div>
      </div>
    </Section>
  );
}
