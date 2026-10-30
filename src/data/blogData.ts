import type { Article, BlogCategory, LocationGuide } from "../types/blog";

export const BLOG_CATEGORIES: BlogCategory[] = [
  "All",
  "City Guides",
  "Meal Plans & Budget",
  "Kerala Food",
  "Student Life",
];

/**
 * Published articles list.
 * Currently empty as there are no published standalone articles yet.
 * When publishing new articles, add an entry to this array with:
 * {
 *   slug: "my-article-slug",
 *   title: "Article Title",
 *   category: "Meal Plans & Budget",
 *   excerpt: "A brief summary...",
 *   image: "/images/blog/article-thumbnail.png",
 *   imageAlt: "Descriptive alt text",
 *   publishedAt: "November 2026",
 *   readingTime: "4 min read",
 *   featured: true, // optional: sets as featured hero article
 *   href: "/blog/my-article-slug"
 * }
 */
export const articles: Article[] = [];

/**
 * Existing Kerala Location Guides.
 * Links directly to the active mess discovery pages for each city.
 */
export const locationGuides: LocationGuide[] = [
  {
    name: "Thiruvananthapuram",
    altName: "Trivandrum",
    slug: "thiruvananthapuram",
    href: "/messes/thiruvananthapuram/",
    tag: "Capital & Tech Hub",
    description:
      "Explore messes and homely food providers across Trivandrum, from Kazhakkoottam and Technopark to Palayam and Nalanchira. Compare daily menus and monthly meal plans.",
    popularAreas: ["Kazhakkoottam", "Technopark", "Palayam", "Nalanchira", "Karamana"],
  },
  {
    name: "Ernakulam",
    altName: "Kochi",
    slug: "ernakulam",
    href: "/messes/ernakulam/",
    tag: "Commercial & IT Hub",
    description:
      "Discover messes and food providers across Kochi and Ernakulam, including Kakkanad, Edappally, Aluva, and Vyttila. Ideal for working professionals and students.",
    popularAreas: ["Kakkanad", "Edappally", "Aluva", "Vyttila", "Tripunithura"],
  },
  {
    name: "Kozhikode",
    altName: "Calicut",
    slug: "kozhikode",
    href: "/messes/kozhikode/",
    tag: "Culinary Capital",
    description:
      "Browse authentic Malabar messes and regular dining services in Calicut. Find homely vegetarian and non-vegetarian food options near colleges and offices.",
    popularAreas: ["Mavoor Road", "Palayam", "Kallai", "Nadakkavu", "Medical College"],
  },
  {
    name: "Kasaragod",
    altName: "Kasargod",
    slug: "kasaragod",
    href: "/messes/kasaragod/",
    tag: "Campus & Coastal Hub",
    description:
      "Explore dependable local messes and everyday food arrangements in Kasaragod. Find budget-friendly daily and monthly meal plans for students and residents.",
    popularAreas: ["Kasaragod Town", "Kanhangad", "Vidyanagar", "Cheruvathur", "Nileshwar"],
  },
  {
    name: "Thrissur",
    altName: "Trichur",
    slug: "thrissur",
    href: "/messes/thrissur/",
    tag: "Cultural Capital",
    description:
      "Find homely mess services and catering providers across Thrissur town and educational institutions. Check meal timings, food categories, and monthly options.",
    popularAreas: ["Swaraj Round", "East Fort", "Ollur", "Ayyanthole", "Mannuthy"],
  },
];

