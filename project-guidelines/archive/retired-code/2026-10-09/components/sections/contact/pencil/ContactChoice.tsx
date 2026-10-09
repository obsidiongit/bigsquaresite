"use client";

import { useLab } from "@/lib/lab";
import { PencilContact } from "./PencilContact";

/* Review toggle (lib/lab "contact"): the pencil contact page (default) or the original split. */
export function ContactChoice({ original }: { original: React.ReactNode }) {
  return useLab("contact") === "pencil" ? <PencilContact /> : <>{original}</>;
}
