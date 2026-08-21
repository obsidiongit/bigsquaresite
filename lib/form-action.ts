"use server";

import { z } from "zod";
import type { UtmParams } from "@/lib/utm";

// The single submit path for every form on the site: contact, audit, popup,
// application funnel, and lead magnets (decisions.md). Posts one JSON payload
// to FORM_WEBHOOK_URL. Destination (GHL or the Obsidion dashboard) is decided
// later; only the env var changes.

const utmSchema = z.object({
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
});

const submissionSchema = z.object({
  /** Which form sent this: "contact" | "audit" | "popup" | "apply" | "lead-magnet" */
  formType: z.string().min(1),
  /** Page slug the visitor submitted from, e.g. "/audit/" */
  page: z.string().min(1),
  utm: utmSchema.default({}),
  /** The form's own fields (name, email, message, funnel answers, ...) */
  fields: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .default({}),
});

export type FormSubmission = z.input<typeof submissionSchema>;

export type FormResult = { ok: boolean; error?: string };

const GENERIC_ERROR =
  "Your message did not send. Please try again, or email support@bigsquaremarketing.com.";

export async function submitForm(
  submission: FormSubmission,
): Promise<FormResult> {
  const parsed = submissionSchema.safeParse(submission);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  const payload = {
    ...parsed.data,
    utm: parsed.data.utm satisfies UtmParams,
    submittedAt: new Date().toISOString(),
  };

  const webhookUrl = process.env.FORM_WEBHOOK_URL;
  if (!webhookUrl) {
    // Env vars are intentionally empty until launch config is set. Succeed so
    // the UI flow works, but make the missing config loud in server logs.
    console.warn(
      "[form-action] FORM_WEBHOOK_URL is not set; submission not delivered:",
      JSON.stringify(payload),
    );
    return { ok: true };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error(
        `[form-action] webhook responded ${response.status} for ${payload.formType} on ${payload.page}`,
      );
      return { ok: false, error: GENERIC_ERROR };
    }
    return { ok: true };
  } catch (error) {
    console.error("[form-action] webhook request failed:", error);
    return { ok: false, error: GENERIC_ERROR };
  }
}
