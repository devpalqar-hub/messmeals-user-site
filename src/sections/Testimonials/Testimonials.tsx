import styles from "./Testimonials.module.css";
import { useRef, useState, useEffect } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Update active dot based on scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.scrollWidth / REVIEWS.length;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(index, REVIEWS.length - 1));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to card when dot is clicked
  const scrollToCard = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / REVIEWS.length;
    el.scrollTo({ left: cardWidth * index, behavior: "smooth" });
    setActiveIndex(index);
  };

  return (
    <section className={styles.testimonials}>
      <h2 className={styles["testi-title"]}>What our customers say</h2>

      <div className={styles["testi-grid"]} ref={scrollRef}>
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
          <button
            key={i}
            className={`${styles.dot} ${i === activeIndex ? styles.active : ""}`}
            onClick={() => scrollToCard(i)}
            aria-label={`Go to review ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
