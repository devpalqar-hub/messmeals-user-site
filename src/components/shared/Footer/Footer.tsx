import styles from "./Footer.module.css";
import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-container"]}>
        {/* LEFT BRAND */}
        <div className={styles["footer-brand"]}>
          <div className={styles.brand}>
            <img src="/logo.png" alt="Mess Meals Logo" className={styles["logo-image"]} />
          </div>

          <p>
            Connecting you to authentic flavors and trustworthy kitchens.
            Taste the tradition, feel the home.
          </p>
        </div>

        {/* LINKS */}
        <div className={styles["footer-links"]}>
          <div className={styles["link-group"]}>
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Contact</a>
          </div>

          <div className={styles["link-group"]}>
            <h4>Cities</h4>
            <a href="#">Kochi</a>
            <a href="#">Thiruvananthapuram</a>
            <a href="#">Kozhikode</a>
            <a href="#">All Cities</a>
          </div>

          <div className={styles["link-group"]}>
            <h4>Partners</h4>
            <a href="#">List Your Mess</a>
            <a href="#">Safety Standards</a>
            <a href="#">Success Stories</a>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className={styles["footer-divider"]} />

      {/* BOTTOM */}
      <div className={styles["footer-bottom"]}>
        <span>© 2026 MESS MEALS. All rights reserved.</span>

        <div className={styles["legal-links"]}>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>

        <div className={styles.socials}>
          <Facebook size={20} />
          <Instagram size={20} />
        </div>
      </div>
    </footer>
  );
}
