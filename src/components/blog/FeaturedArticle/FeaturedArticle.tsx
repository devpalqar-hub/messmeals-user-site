import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Sparkles, BookOpen } from "lucide-react";
import type { Article } from "../../../types/blog";
import styles from "./FeaturedArticle.module.css";

interface FeaturedArticleProps {
  article?: Article;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  if (article && article.href) {
    const destination = article.href;

    return (
      <section className={styles.featuredSection} aria-labelledby="featured-heading">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>
            <Sparkles size={13} aria-hidden="true" />
            Featured Article
          </span>
        </div>

        <article className={styles.featuredCard}>
          {article.image && (
            <div className={styles.imageWrap}>
              <Image
                src={article.image}
                alt={article.imageAlt || article.title}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className={styles.featuredImage}
              />
            </div>
          )}

          <div className={styles.contentWrap}>
            <span className={styles.categoryBadge}>{article.category}</span>
            <h2 id="featured-heading" className={styles.articleTitle}>
              {article.title}
            </h2>
            <p className={styles.articleExcerpt}>{article.excerpt}</p>

            {(article.publishedAt || article.readingTime) && (
              <div className={styles.metaRow}>
                {article.publishedAt && (
                  <span className={styles.metaItem}>
                    <Calendar size={13} aria-hidden="true" />
                    <time dateTime={article.publishedAt}>{article.publishedAt}</time>
                  </span>
                )}
                {article.readingTime && (
                  <span className={styles.metaItem}>
                    <Clock size={13} aria-hidden="true" />
                    <span>{article.readingTime}</span>
                  </span>
                )}
              </div>
            )}

            <Link href={destination} className={styles.readButton}>
              Read Article
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </article>
      </section>
    );
  }

  // Graceful empty state when no article is published yet
  return (
    <section className={styles.featuredSection} aria-labelledby="featured-guides-notice">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>
          <Sparkles size={13} aria-hidden="true" />
          Editorial Guides
        </span>
      </div>

      <div className={styles.emptyFeaturedCard}>
        <div className={styles.emptyTextWrap}>
          <span className={styles.emptyBadge}>
            <BookOpen size={12} aria-hidden="true" />
            Articles In Progress
          </span>
          <h2 id="featured-guides-notice" className={styles.emptyTitle}>
            In-Depth Food &amp; Mess Guides Coming Soon
          </h2>
          <p className={styles.emptyDescription}>
            We are preparing comprehensive guides on Kerala food culture, student mess
            budgeting, and meal plan comparisons. In the meantime, explore our 5 verified
            location directories below to find active messes near you.
          </p>
          <a href="#location-guides" className={styles.emptyAction}>
            Explore City Mess Guides
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>

        <div className={styles.emptyVisual} aria-hidden="true">
          <BookOpen size={42} strokeWidth={1.5} />
        </div>
      </div>
    </section>
  );
}

