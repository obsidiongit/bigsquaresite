import { cn } from "@/lib/utils";

/* <Field> (STYLE_GUIDE 6.13): the shared form field primitive,
   extracted from NewsletterForm's anatomy for the /schedule/
   application form (the 6.13 Phase 3 item, Lane 1). The audit and
   contact forms consume this next.

   Contract: 56px tall, --radius-card, --paper face on every ground,
   1px sec-line border darkening to ink on hover; focus is the
   site-wide :focus-visible ring, never a custom one. Every field
   carries a real label: visible by default (mono uppercase, the
   measured instrument voice), sr-only when the composition has no
   room (hideLabel). Errors wire aria-describedby + aria-invalid and
   announce via role="alert" in --destructive.

   NewsletterForm itself migrates to this primitive in its next
   homepage session (tracked in tasks.md; its file is homepage-owned,
   so no cross-lane edit here). Until then the anatomy deliberately
   lives in both places. */

type Props = {
  id: string;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  error?: string | null;
  hideLabel?: boolean;
  /** "mono": the compact uppercase meta label (default, dense forms).
      "question": the label IS the step's question (stepped flows,
      /schedule/): Apfel 700 at h3 scale, ink. */
  labelVariant?: "mono" | "question";
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Focus on mount: stepped flows focus the arriving step's input
      (mount happens after the old step's exit under AnimatePresence
      mode="wait", so an external effect fires too early). Never set on
      a page's initial render. */
  autoFocus?: boolean;
  className?: string;
};

export function Field({
  id,
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
  inputMode,
  error,
  hideLabel = false,
  labelVariant = "mono",
  value,
  onChange,
  autoFocus,
  className,
}: Props) {
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={
          hideLabel
            ? "sr-only"
            : labelVariant === "question"
              ? "block text-h3 font-bold text-sec-ink"
              : "block font-mono text-mono-sm uppercase text-sec-mid"
        }
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          "h-14 w-full min-w-0 rounded-card border bg-paper px-5",
          !hideLabel && (labelVariant === "question" ? "mt-5" : "mt-2"),
          "text-body text-ink placeholder:text-mid",
          "transition-colors duration-[var(--dur-fast)]",
          error ? "border-destructive" : "border-sec-line hover:border-ink",
        )}
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-small text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
