"use client";

import { useState, useMemo } from "react";
import { ArrowRight, BookOpen, Compass, MapPin } from "lucide-react";
import type { Article, BlogCategory, LocationGuide } from "../../../types/blog";
import CategoryFilter from "../CategoryFilter/CategoryFilter";
import FeaturedArticle from "../FeaturedArticle/FeaturedArticle";
import ArticleCard from "../ArticleCard/ArticleCard";
import styles from "./ArticlesSection.module.css";

interface ArticlesSectionProps {
  articles: Article[];
  locationGuides: LocationGuide[];
}

export default function ArticlesSection({
  articles,
  locationGuides,
}: ArticlesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("All");

  // Determine the featured article (if one exists with featured: true, or the first article)
  const featuredArticle = useMemo(() => {
    if (articles.length === 0) return undefined;
    return articles.find((a) => a.featured) || articles[0];
  }, [articles]);

  // Compute item counts for each category
  const categoryCounts = useMemo<Record<BlogCategory, number>>(() => {
    const counts: Record<BlogCategory, number> = {
      All: articles.length + locationGuides.length,
      "City Guides": locationGuides.length + articles.filter((a) => a.category === "City Guides").length,
      "Meal Plans & Budget": articles.filter((a) => a.category === "Meal Plans & Budget").length,
      "Kerala Food": articles.filter((a) => a.category === "Kerala Food").length,
      "Student Life": articles.filter((a) => a.category === "Student Life").length,
    };
    return counts;
  }, [articles, locationGuides]);

  // Filter articles for the grid
  const filteredArticles = useMemo(() => {
    if (selectedCategory === "All") {
      // Exclude featured article from the latest articles grid if it exists and there are more than 1
      if (featuredArticle && articles.length > 1) {
        return articles.filter((a) => a.slug !== featuredArticle.slug);
      }
      return articles;
    }
    return articles.filter((a) => a.category === selectedCategory);
  }, [articles, selectedCategory, featuredArticle]);

  return (
    <section
      id="articles-section"
      className={styles.section}
      aria-labelledby="articles-heading"
    >
      {/* Section 2: Prominent Featured Article */}
      <FeaturedArticle article={featuredArticle} />

      {/* Section 3: Article Categories */}
      <div className={styles.sectionHeader}>
        <h2 id="articles-heading" className={styles.sectionTitle}>
          Latest Articles &amp; Guides
        </h2>
        <p className={styles.sectionSubtitle}>
          Filter by topic to explore everyday food tips, student dining insights,
          meal plan recommendations, and local mess guides across Kerala.
        </p>
      </div>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* Special Contextual Notice when "City Guides" is selected */}
      {selectedCategory === "City Guides" && (
        <div className={styles.cityGuidesNotice}>
          <div className={styles.noticeContent}>
            <span className={styles.noticeBadge}>
              <MapPin size={12} aria-hidden="true" />
              5 Active Cities
            </span>
            <h3 className={styles.noticeTitle}>
              Looking for City-Specific Mess Guides?
            </h3>
            <p className={styles.noticeText}>
              MessMeals currently offers in-depth discovery guides for
              Thiruvananthapuram, Ernakulam (Kochi), Kozhikode, Kasaragod, and
              Thrissur. Explore full menus, food preferences, and verified mess
              listings in each location below.
            </p>
          </div>
          <a href="#location-guides" className={styles.noticeAction}>
            View City Guides
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      )}

      {/* Section 4: Latest Articles Grid or Graceful Empty State */}
      {filteredArticles.length > 0 ? (
        <div className={styles.articlesGrid}>
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIconWrap} aria-hidden="true">
            {selectedCategory === "City Guides" ? (
              <Compass size={28} />
            ) : (
              <BookOpen size={28} />
            )}
          </div>
          <h3 className={styles.emptyTitle}>
            {selectedCategory === "All"
              ? "Informational Articles in Preparation"
              : `No Articles in "${selectedCategory}" Yet`}
          </h3>
          <p className={styles.emptyText}>
            {selectedCategory === "City Guides"
              ? "Our city guides are live in the location directory section below. Additional editorial articles on local food spots are currently being written."
              : `We are researching and writing new articles covering ${selectedCategory.toLowerCase()}. In the meantime, explore our verified city mess guides or check back soon.`}
          </p>
          <div className={styles.emptyActions}>
            {selectedCategory !== "All" && (
              <button
                type="button"
                className={styles.resetButton}
                onClick={() => setSelectedCategory("All")}
              >
                View All Categories
              </button>
            )}
            <a href="#location-guides" className={styles.emptyLocationLink}>
              <MapPin size={14} aria-hidden="true" />
              Explore City Mess Guides
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

