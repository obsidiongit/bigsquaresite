import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// The custom type scale (STYLE_GUIDE.md 3.2) must be registered as
// font-size classes, or tailwind-merge treats text-h2 etc. as text
// COLORS and silently drops them whenever a text-sec-* color is in the
// same cn() call. Keep in sync with the @theme static block in
// app/globals.css.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "h1",
            "h2",
            "h3",
            "statement",
            "metric",
            "lead",
            "body",
            "small",
            "eyebrow",
            "mono-sm",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
