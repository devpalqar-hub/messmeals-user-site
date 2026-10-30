import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { Article } from "../../../types/blog";
import styles from "./ArticleCard.module.css";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const destination = article.href || `/blog/${article.slug}`;

  return (
    <article className={styles.card}>
      <div className={styles.thumbnailWrap}>
        <Image
          src={article.image || "/food-placeholder.png"}
          alt={article.imageAlt || article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.thumbnail}
        />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <span className={styles.categoryTag}>{article.category}</span>
        </div>

        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.excerpt}>{article.excerpt}</p>

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

        <Link href={destination} className={styles.readLink}>
          Read Article
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

