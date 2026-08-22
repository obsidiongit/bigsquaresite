import { cn } from "@/lib/utils";

/* <Section> (STYLE_GUIDE.md 5): every section declares a theme scope.
   Components written against the sec-* tokens work on every ground
   unchanged. Background and text color come from the [data-theme] CSS
   in globals.css. `size` maps to the section rhythm tokens (4.1);
   "lg" is for the hero, statement, and CTA band. */

type Theme = "light" | "tint" | "dark" | "accent";

type Props = {
  theme?: Theme;
  /** Semantic element; the theme CSS is attribute-based, so any works */
  as?: "section" | "footer" | "header" | "div";
  size?: "base" | "lg" | "none";
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export function Section({
  theme = "light",
  as: Tag = "section",
  size = "base",
  id,
  className,
  children,
}: Props) {
  return (
    <Tag
      id={id}
      data-theme={theme}
      className={cn(
        "relative",
        size === "base" && "py-section-y",
        size === "lg" && "py-section-y-lg",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
