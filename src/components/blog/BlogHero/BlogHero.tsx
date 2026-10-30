import Image from "next/image";
import Link from "next/link";
import { BookOpen, MapPin, ChevronRight, ArrowRight, Compass } from "lucide-react";
import styles from "./BlogHero.module.css";

export default function BlogHero() {
  return (
    <section className={styles.hero} aria-labelledby="blog-hero-heading">
      <div className={styles.heroInner}>
        {/* Left: Content */}
        <div className={styles.heroContent}>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>
              Home
            </Link>
            <ChevronRight size={14} className={styles.breadcrumbSeparator} aria-hidden="true" />
            <span className={styles.breadcrumbCurrent} aria-current="page">
              Blog &amp; Guides
            </span>
          </nav>

          {/* Section Badge */}
          <div className={styles.heroBadge}>
            <BookOpen size={13} aria-hidden="true" />
            <span>MessMeals Blog &amp; Guides</span>
          </div>

          {/* Heading */}
          <h1 id="blog-hero-heading" className={styles.heroTitle}>
            Food, Mess &amp; Meal Guides in{" "}
            <span className={styles.heroTitleHighlight}>Kerala</span>
          </h1>

          {/* Description */}
          <p className={styles.heroDescription}>
            Explore useful food guides, discover mess options across Kerala, and
            learn more about everyday meals and meal plans with MessMeals.
          </p>

          {/* Actions */}
          <div className={styles.heroActions}>
            <a href="#location-guides" className={styles.primaryAction}>
              <MapPin size={16} aria-hidden="true" />
              Explore City Guides
              <ArrowRight size={15} aria-hidden="true" />
            </a>
            <a href="#articles-section" className={styles.secondaryAction}>
              <Compass size={16} aria-hidden="true" />
              Browse Topics
            </a>
          </div>
        </div>

        {/* Right: Thematic Visual */}
        <div className={styles.heroVisual}>
          <div className={styles.imageContainer}>
            <Image
              src="/whybg.png"
              alt="Authentic Kerala mess food with traditional rice, curries, and side dishes"
              width={540}
              height={400}
              priority
              className={styles.heroImage}
            />

            {/* Floating Info Badges */}
            <div className={styles.floatingBadgePrimary}>
              <MapPin size={14} color="#55C500" aria-hidden="true" />
              <span>5 Kerala Cities Live</span>
            </div>

            <div className={styles.floatingBadgeSecondary}>
              <BookOpen size={18} color="#A3E635" aria-hidden="true" />
              <div className={styles.floatingBadgeText}>
                <span className={styles.floatingBadgeLabel}>Mess Directory</span>
                <span className={styles.floatingBadgeTitle}>Homely Food Guides</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

