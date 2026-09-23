"use client";

import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { RoughAnnotation } from "@/components/motion/RoughAnnotation";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { DUR, EASE } from "@/lib/motion";

const REST = ["Search,", "ads,", "sites,", "creative."] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.12 } },
};

const word: Variants = {
  hidden: { y: "0.6em" },
  show: { y: "0em", transition: { duration: DUR.reveal, ease: EASE.house } },
};

export function HoldingHeadline() {
  const reduced = useReducedMotionSafe();
  const [ready, setReady] = useState(reduced);

  if (reduced) {
    return (
      <h1 className="mt-5 max-w-[14ch] font-display text-h1 text-sec-ink md:text-display">
        <RoughAnnotation variant="circle" active className="whitespace-nowrap">
          One team.
        </RoughAnnotation>{" "}
        Search, ads, sites, creative.
      </h1>
    );
  }

  return (
    <motion.h1
      className="mt-5 max-w-[14ch] font-display text-h1 text-sec-ink md:text-display"
      variants={container}
      initial="hidden"
      animate="show"
      onAnimationComplete={() => setReady(true)}
    >
      <RoughAnnotation
        variant="circle"
        active={ready}
        className="whitespace-nowrap"
      >
        <motion.span className="inline-block" variants={word}>
          One
        </motion.span>{" "}
        <motion.span className="inline-block" variants={word}>
          team.
        </motion.span>
      </RoughAnnotation>{" "}
      {REST.map((item) => (
        <span key={item}>
          <motion.span className="inline-block" variants={word}>
            {item}
          </motion.span>{" "}
        </span>
      ))}
    </motion.h1>
  );
}
