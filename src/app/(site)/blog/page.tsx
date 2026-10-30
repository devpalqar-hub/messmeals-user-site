import type { Metadata } from "next";
import { articles, locationGuides } from "../../../data/blogData";
import BlogHero from "../../../components/blog/BlogHero/BlogHero";
import ArticlesSection from "../../../components/blog/ArticlesSection/ArticlesSection";
import LocationGuides from "../../../components/blog/LocationGuides/LocationGuides";
import BlogCTA from "../../../components/blog/BlogCTA/BlogCTA";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Food & Mess Guides in Kerala | MessMeals Blog",
  description:
    "Explore MessMeals guides to discover local messes, homely food options, meal plans, budget tips, and useful food-related information across Kerala.",
  alternates: {
    canonical: "https://messmeals.com/blog/",
  },
  openGraph: {
    title: "Food & Mess Guides in Kerala | MessMeals Blog",
    description:
      "Explore MessMeals guides to discover local messes, homely food options, meal plans, budget tips, and useful food-related information across Kerala.",
    url: "https://messmeals.com/blog/",
    type: "website",
    images: ["/seo/og-default.png"],
  },
};

export default function BlogPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://messmeals.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://messmeals.com/blog/",
      },
    ],
  };

  const collectionPageLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Food & Mess Guides in Kerala | MessMeals Blog",
    description:
      "Explore MessMeals guides to discover local messes, homely food options, meal plans, budget tips, and useful food-related information across Kerala.",
    url: "https://messmeals.com/blog/",
  };

  return (
    <>
      {/* ── Structured Data (JSON-LD) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageLd) }}
      />

      <main className={styles.main}>
        {/* Section 1: Hero */}
        <BlogHero />

        {/* Section 2, 3, 4: Featured Article, Categories & Latest Articles */}
        <ArticlesSection articles={articles} locationGuides={locationGuides} />

        {/* Section 5: Explore Mess Guides by Location */}
        <LocationGuides locations={locationGuides} />

        {/* Section 6: Final CTA */}
        <BlogCTA />
      </main>
    </>
  );
}

