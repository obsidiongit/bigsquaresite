import { CountUp } from "@/components/motion/CountUp";
import type { Metric } from "@/lib/metrics";
import { cn } from "@/lib/utils";

/* <MetricBlock> (STYLE_GUIDE.md 6.4, stat tile): number at
   --text-metric in --sec-acc, plain-language mono caption below in
   --sec-mid. Borderless in the dark proof band; testimonial and case
   study pages reuse it on their own grounds via the sec-* tokens.
   Real values CountUp once on entry (1.4s house); a null value
   renders an honest mono placeholder and never counts up. */

export function MetricBlock({
  metric,
  className,
}: {
  metric: Metric;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      {metric.value === null ? (
        <p className="font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
          [PLACEHOLDER: {metric.placeholder}]
        </p>
      ) : (
        <p className="font-display text-metric font-bold text-sec-acc">
          <CountUp
            value={metric.value}
            prefix={metric.prefix}
            suffix={metric.suffix}
          />
        </p>
      )}
      <p className="mt-2 max-w-[36ch] font-mono text-mono-sm uppercase leading-relaxed text-sec-mid">
        {metric.caption}
      </p>
    </div>
  );
}
