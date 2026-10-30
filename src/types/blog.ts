export type BlogCategory =
  | "All"
  | "City Guides"
  | "Meal Plans & Budget"
  | "Kerala Food"
  | "Student Life";

export interface Article {
  slug: string;
  title: string;
  category: Exclude<BlogCategory, "All">;
  excerpt: string;
  image?: string;
  imageAlt?: string;
  publishedAt?: string; // Formatted date e.g. "October 2026" or ISO
  readingTime?: string; // e.g. "5 min read"
  featured?: boolean;
  href?: string;
}

export interface LocationGuide {
  name: string;
  altName?: string;
  slug: string;
  href: string;
  tag: string;
  description: string;
  image?: string;
  imageAlt?: string;
  popularAreas: string[];
}

