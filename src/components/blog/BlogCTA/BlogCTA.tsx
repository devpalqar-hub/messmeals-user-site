import Link from "next/link";
import { ArrowRight, Utensils } from "lucide-react";
import styles from "./BlogCTA.module.css";

export default function BlogCTA() {
  return (
    <section className={styles.ctaSection} aria-labelledby="blog-cta-heading">
      <div className={styles.ctaContainer}>
        <div className={styles.textContent}>
          <div className={styles.badge}>
            <Utensils size={13} aria-hidden="true" />
            <span>FIND YOUR MEAL PLAN</span>
          </div>
          <h2 id="blog-cta-heading" className={styles.heading}>
            Looking for a Mess Near You?
          </h2>
          <p className={styles.description}>
            Explore available mess options and meal plans around your location
            with MessMeals.
          </p>
        </div>

        <div className={styles.actionWrap}>
          <Link href="/messes" className={styles.ctaButton}>
            Explore Messes
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

