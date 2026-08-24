import styles from "./Testimonials.module.css";
import { useState } from "react";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    text: "The food is just like home. Very tasty and hygienic. Totally worth the price.",
    name: "Arjun M.",
    location: "Kochi",
  },
  {
    text: "Easy booking and reliable service. I found the best mess near my office.",
    name: "Sneha P.",
    location: "Ernakulam",
  },
  {
    text: "Affordable plans with awesome food. Highly recommended!",
    name: "Vishnu S.",
    location: "Kalamassery",
  },
];

export default function Testimonials() {
  const [active] = useState(0);

  return (
    <section className={styles.testimonials}>
      <h2 className={styles["testi-title"]}>What our customers say</h2>

      <div className={styles["testi-grid"]}>
        {REVIEWS.map((r) => (
          <div className={styles["testi-card"]} key={r.name}>
            <Quote size={28} className={styles["testi-quote"]} />
            <p className={styles["testi-text"]}>{r.text}</p>
            <div className={styles["testi-footer"]}>
              <div className={styles["testi-avatar"]}>{r.name.charAt(0)}</div>
              <div className={styles["testi-person"]}>
                <strong>{r.name}</strong>
                <span>{r.location}</span>
              </div>
              <div className={styles["testi-stars"]}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="#f5a623" color="#f5a623" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles["testi-dots"]}>
        {REVIEWS.map((_, i) => (
          <span key={i} className={i === active ? `${styles.dot} ${styles.active}` : styles.dot} />
        ))}
      </div>
    </section>
  );
}
