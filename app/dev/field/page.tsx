import type { Metadata } from "next";
import { FieldPage } from "@/components/sections/home/field/FieldPage";

export const metadata: Metadata = {
  title: "Field: direction A, full page",
  robots: { index: false, follow: false },
};

/* Direction A as a full homepage sketch (2026-09-23). */
export default function FieldPrototypePage() {
  return <FieldPage />;
}
