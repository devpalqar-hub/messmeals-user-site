import type { BlogCategory } from "../../../types/blog";
import { BLOG_CATEGORIES } from "../../../data/blogData";
import styles from "./CategoryFilter.module.css";

interface CategoryFilterProps {
  selectedCategory: BlogCategory;
  onSelectCategory: (cat: BlogCategory) => void;
  categoryCounts: Record<BlogCategory, number>;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryFilterProps) {
  return (
    <div className={styles.filterContainer} role="region" aria-label="Article categories">
      <div className={styles.filterScroll} role="tablist">
        {BLOG_CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          const count = categoryCounts[category] ?? 0;

          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.filterButton} ${isActive ? styles.filterButtonActive : ""}`}
              onClick={() => onSelectCategory(category)}
            >
              <span>{category}</span>
              <span className={styles.countBadge} aria-label={`${count} items`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

