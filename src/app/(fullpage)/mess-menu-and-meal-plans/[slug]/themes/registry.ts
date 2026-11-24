/**
 * Landing page themes. Every theme renders the same `MessDetails` data, so a
 * mess can switch theme without changing its content.
 *
 * To add a theme: create `themes/<id>/<Name>Theme.tsx`, add its metadata here
 * and its component in `./index.ts`.
 */
export const THEME_META = {
  standard: {
    name: "Standard",
    tagline: "Clean, readable and professional",
    description:
      "A calm, business-style page. Sentence-case headings, soft cards, a top navigation bar and a full week menu that is easy to scan.",
    traits: ["Top navigation", "Soft cards", "Single typeface", "Gentle fade-ins"],
  },
  modern: {
    name: "Modern",
    tagline: "Bold, animated and image-led",
    description:
      "An expressive page with oversized headlines, tilted photo cards, curved overlapping sections and playful scroll animation.",
    traits: ["Intro animation", "Giant headlines", "Tilted cards", "Smooth scrolling"],
  },
  classic: {
    name: "Classic",
    tagline: "Elegant, timeless and refined",
    description:
      "A calm, printed-menu look. Cream paper, serif headlines, thin double rules and a framed menu card with dotted leaders, with very quiet motion.",
    traits: ["Serif headlines", "Printed menu card", "Thin rules", "Quiet motion"],
  },
  warm: {
    name: "Warm & Friendly",
    tagline: "Soft, homely and hand-drawn",
    description:
      "A gentle, playful look. Pastel bands with wavy edges, rounded cards, little hand-drawn doodles and a chalkboard-style weekly menu.",
    traits: ["Pastel colours", "Hand-drawn doodles", "Chalkboard menu", "Gentle motion"],
  },
} as const;

export type ThemeId = keyof typeof THEME_META;

export const THEME_IDS = Object.keys(THEME_META) as ThemeId[];

/** Theme every mess landing page uses unless the URL names another. */
export const DEFAULT_THEME: ThemeId = "warm";

/** Slug that renders the theme chooser and sample-data previews. */
export const PREVIEW_SLUG = "preview";

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && value in THEME_META;
}
