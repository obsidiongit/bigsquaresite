import Link from "next/link";
import { cn } from "@/lib/utils";

/* <ConsentLine> (legal-pages-plan.md "Also on the site"; 2026-08-31,
   Pane C): the one sentence under every form's submit button linking
   both legal pages. One shared component so the wording changes in one
   place if counsel edits it. This is notice, not a checkbox: it never
   gates submission. SMS consent is separate and lives as the checkbox
   on forms that text (ApplyForm). */

const LINK =
  "underline underline-offset-2 transition-colors duration-[var(--dur-fast)] hover:text-sec-ink";

export function ConsentLine({ className }: { className?: string }) {
  return (
    <p className={cn("text-small text-sec-mid", className)}>
      By sending this you agree to our{" "}
      <Link href="/terms/" className={LINK}>
        Terms
      </Link>{" "}
      and{" "}
      <Link href="/privacy-policy/" className={LINK}>
        Privacy Policy
      </Link>
      .
    </p>
  );
}
