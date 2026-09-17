"use client";

import styles from "./OwnAMess.module.css";
import { Store } from "lucide-react";

export default function OwnAMess() {
  return (
    <section className={styles["own-a-mess"]}>
      <div className={styles["oam-inner"]}>
        <div className={styles["oam-icon"]}>
          <Store size={30} />
        </div>

        <div className={styles["oam-text"]}>
          <h2>Own a mess?</h2>
          <p>Join our platform and reach thousands of hungry people in your area.</p>
        </div>

        <div className={styles["store-btns"]}>
          <a href="#" className={styles["store-btn"]} aria-label="Get it on Google Play">
            <img src="/Playstore.svg" alt="Google Play" className={styles["store-btn-icon"]} />
            <div className={styles["store-btn-text"]}>
              <span className={styles["store-btn-label"]}>GET IT ON</span>
              <span className={styles["store-btn-name"]}>Google Play</span>
            </div>
          </a>
          <a href="#" className={styles["store-btn"]} aria-label="Download on the App Store">
            <img src="/Apple.svg" alt="App Store" className={`${styles["store-btn-icon"]} ${styles["store-btn-icon--invert"]}`} />
            <div className={styles["store-btn-text"]}>
              <span className={styles["store-btn-label"]}>Download on the</span>
              <span className={styles["store-btn-name"]}>App Store</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
