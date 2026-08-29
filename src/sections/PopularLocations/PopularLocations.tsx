import styles from "./PopularLocations.module.css";
export default function PopularLocations() {
  return (
    <section className={styles["popular-locations"]}>
      <h2 className={styles["section-title"]}>Popular Locations</h2>

      <div className={styles["locations-grid"]}>
        <div className={styles["location-card"]}>
          <img src="/kochi.png" alt="Kochi" />
          <div className={styles["location-overlay"]}>
            <h3>Kochi</h3>
            <span>120+ Listings</span>
          </div>
        </div>

        <div className={styles["location-card"]}>
          <img src="/trivandrum.png" alt="Trivandrum" />
          <div className={styles["location-overlay"]}>
            <h3>Trivandrum</h3>
            <span>95+ Listings</span>
          </div>
        </div>

        <div className={styles["location-card"]}>
          <img src="/kozikode.png" alt="Kozhikode" />
          <div className={styles["location-overlay"]}>
            <h3>Kozhikode</h3>
            <span>80+ Listings</span>
          </div>
        </div>

        <div className={styles["location-card"]}>
          <img src="/thrissur.png" alt="Thrissur" />
          <div className={styles["location-overlay"]}>
            <h3>Thrissur</h3>
            <span>65+ Listings</span>
          </div>
        </div>
      </div>
    </section>
  );
};
