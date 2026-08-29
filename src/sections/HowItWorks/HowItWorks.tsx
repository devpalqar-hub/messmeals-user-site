import styles from "./HowItWorks.module.css";
import { Search, ListChecks, CalendarCheck, UtensilsCrossed } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "1. Search",
    desc: "Find messes near your location",
  },
  {
    icon: ListChecks,
    title: "2. Compare",
    desc: "Compare plans, ratings and amenities",
  },
  {
    icon: CalendarCheck,
    title: "3. Book",
    desc: "Select a plan & book instantly",
  },
  {
    icon: UtensilsCrossed,
    title: "4. Enjoy",
    desc: "Enjoy homely, healthy meals every day",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles["how-it-works"]} id="how-it-works">
      <h2 className={styles["hiw-title"]}>How it works</h2>

      <div className={styles["hiw-steps"]}>
        {STEPS.map(({ icon: Icon, title, desc }, i) => (
          <div className={styles["hiw-step"]} key={title}>
            <div className={styles["hiw-icon"]}>
              <Icon size={22} />
            </div>
            <div className={styles["hiw-text"]}>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
            {i < STEPS.length - 1 && <span className={styles["hiw-connector"]} />}
          </div>
        ))}
      </div>
    </section>
  );
}
