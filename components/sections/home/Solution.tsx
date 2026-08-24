import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { BentoPanel } from "@/components/shared/BentoPanel";
import { Container } from "@/components/shared/Container";
import { GridLines } from "@/components/shared/GridLines";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Chip } from "@/components/shared/mono";
import { cn } from "@/lib/utils";

/* Solution (5.solution.md v2): the answer to the problem section. One
   roof, one plan, one dashboard, as an unequal bento (readymag
   structure, dropbox grid discipline): 8+4 then 6+6 on the 12-column
   grid, every edge snapped, 24px gaps (16 mobile). Exactly one dark
   panel, zero accent panels (STYLE_GUIDE 6.4 bento budget: blue stays
   scarce until the CTA band).

   UI fragments are brand-abstract: bare rounded chips with soft
   shadows and BLURRED BAR values only. decisions.md rule: never fake
   UI with fake numbers. */

/* a soft placeholder value bar (never a fake number) */
function ValueBar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block h-3 rounded-full bg-ink/10", className)}
    />
  );
}

function FragmentChip({
  label,
  children,
  className,
}: {
  label: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-line bg-paper px-4 py-3 shadow-[0_8px_24px_rgba(11,15,23,.08)]",
        className,
      )}
    >
      <p className="font-mono text-mono-sm uppercase text-mid">{label}</p>
      {children}
    </div>
  );
}

/* the "locations rolling up" motif: rows of small squares, a few in
   --acc (brand-abstract, no icons, no stock) */
function LocationGrid() {
  const accented = new Set([2, 9, 16, 21]);
  return (
    <div aria-hidden className="grid w-max grid-cols-8 gap-1.5">
      {Array.from({ length: 24 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "size-2 rounded-[2px]",
            accented.has(i) ? "bg-acc" : "bg-ink/10",
          )}
        />
      ))}
    </div>
  );
}

export function Solution() {
  return (
    <Section theme="tint" anchor="solution">
      <GridLines />
      <Container className="relative z-10">
        <SectionHeader
          no={3}
          label="SOLUTION"
          title="One team. Every channel. Every location."
          actions={
            <>
              <Pill href="/schedule/" variant="primary">
                Schedule a Call
              </Pill>
              <Pill href="/audit/" variant="secondary">
                Get a Free Audit
              </Pill>
            </>
          }
        />

        <Reveal stagger className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-12 md:gap-6">
          {/* Row 1, 8 columns: the lead panel with UI fragments */}
          <RevealItem className="md:col-span-8">
            <BentoPanel className="h-full">
              <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-2">
                <p className="max-w-[44ch] text-lead text-sec-ink">
                  BigSquare runs your search, your ads, your website, and your
                  creative under one roof. You get one plan, one point of
                  contact, and one dashboard that shows what is working at
                  every location.
                </p>
                {/* UI-fragment illustration (6.4): abstract report
                    fragments floating in the panel's right half */}
                <div aria-hidden className="relative min-h-[180px]">
                  <FragmentChip
                    label="Calls Booked"
                    className="absolute left-0 top-2 w-[52%] rotate-[-1.5deg]"
                  >
                    <ValueBar className="mt-3 w-3/4" />
                    <ValueBar className="mt-2 w-1/2" />
                  </FragmentChip>
                  <FragmentChip
                    label="Paid Search"
                    className="absolute right-0 top-[38%] w-[56%] rotate-[1deg]"
                  >
                    <div className="mt-3 flex items-center gap-2">
                      <span className="size-2 rounded-[2px] bg-acc" />
                      <ValueBar className="w-2/3" />
                    </div>
                  </FragmentChip>
                  <FragmentChip
                    label="Call Log"
                    className="absolute bottom-0 left-[8%] w-[48%] rotate-[-0.5deg]"
                  >
                    <ValueBar className="mt-3 w-full" />
                  </FragmentChip>
                </div>
              </div>
            </BentoPanel>
          </RevealItem>

          {/* Row 1, 4 columns: the one dark panel, teasing Nº007 */}
          <RevealItem className="md:col-span-4">
            <BentoPanel theme="dark" className="flex h-full flex-col">
              <h3 className="text-h3 font-bold text-sec-ink">
                You See Everything
              </h3>
              <p className="mt-3 text-body text-sec-mid">
                Every lead, every call, every dollar, live in the Obsidion
                portal.
              </p>
              {/* blurred portal-frame motif */}
              <div className="relative mt-8 flex-1">
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-[12px] border border-sec-line p-3 blur-[1.5px]"
                >
                  <span className="block h-2.5 w-1/2 rounded-full bg-ondark/15" />
                  <span className="mt-2 block h-2.5 w-3/4 rounded-full bg-ondark/10" />
                  <span className="mt-2 block h-2.5 w-2/3 rounded-full bg-sec-acc/25" />
                  <span className="mt-2 block h-2.5 w-1/3 rounded-full bg-ondark/10" />
                </div>
                <Chip className="absolute bottom-3 left-3 border-sec-line text-sec-ink">
                  Portal Preview
                </Chip>
              </div>
            </BentoPanel>
          </RevealItem>

          {/* Row 2, 6 + 6 columns */}
          <RevealItem className="md:col-span-6">
            <BentoPanel className="h-full">
              <h3 className="text-h3 font-bold text-sec-ink">
                No Long-Term Contracts
              </h3>
              <p className="mt-3 max-w-[44ch] text-body text-sec-mid">
                Month to month. We earn the next month by delivering this one.
              </p>
            </BentoPanel>
          </RevealItem>
          <RevealItem className="md:col-span-6">
            <BentoPanel className="h-full">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <h3 className="text-h3 font-bold text-sec-ink">
                    Built for Many Locations
                  </h3>
                  <p className="mt-3 max-w-[40ch] text-body text-sec-mid">
                    Location-level targeting, reporting, and budgets. Roll up
                    to the brand. Drill down to the store.
                  </p>
                </div>
                <LocationGrid />
              </div>
            </BentoPanel>
          </RevealItem>
        </Reveal>
      </Container>
    </Section>
  );
}
