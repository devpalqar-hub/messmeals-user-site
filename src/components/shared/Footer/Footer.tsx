import styles from "./Footer.module.css";
import { Facebook, Instagram, Twitter, Youtube, Building2, MapPin, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className={styles["footer-wrap"]}>
      <div className={styles.footer}>
        <div className={styles["footer-container"]}>
          {/* LEFT BRAND */}
          <div className={styles["footer-brand"]}>
            <Link to="/" className={styles.brand}>
              <span className={styles["logo-text"]}>
                <span className={styles["logo-m"]}>M</span>essmeals
              </span>
            </Link>

            <p>
              Connecting you to authentic flavors and trustworthy kitchens.
              Taste the tradition, feel the home.
            </p>

            <div className={styles["follow-us"]}>
              <h4>Follow Us</h4>
              <div className={styles.socials}>
                <a href="#" aria-label="Facebook" className={styles["social-btn"]}>
                  <Facebook size={18} />
                </a>
                <a href="#" aria-label="Instagram" className={styles["social-btn"]}>
                  <Instagram size={18} />
                </a>
                <a href="#" aria-label="Twitter" className={styles["social-btn"]}>
                  <Twitter size={18} />
                </a>
                <a href="#" aria-label="YouTube" className={styles["social-btn"]}>
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* LINKS */}
          <div className={styles["footer-links"]}>
            <div className={styles["link-group"]}>
              <h4>
                <span className={styles["link-icon"]}>
                  <Building2 size={16} />
                </span>
                Company
              </h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
              <a href="#">Contact Us</a>
            </div>

            <div className={styles["link-group"]}>
              <h4>
                <span className={styles["link-icon"]}>
                  <MapPin size={16} />
                </span>
                Cities
              </h4>
              <a href="#">Kochi</a>
              <a href="#">Thiruvananthapuram</a>
              <a href="#">Kozhikode</a>
              <a href="#">All Cities</a>
            </div>

            <div className={styles["link-group"]}>
              <h4>
                <span className={styles["link-icon"]}>
                  <Handshake size={16} />
                </span>
                Partners
              </h4>
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
          <span className={styles.copyright}>
            © 2026 <span className={styles["brand-accent"]}>Messmeals</span>. All rights reserved.
          </span>

          <div className={styles["legal-links"]}>
            <Link to="/privacy">Privacy Policy</Link>
            <span className={styles.dot} />
            <Link to="/terms">Terms &amp; Conditions</Link>
          </div>

          <span className={styles["powered-by"]}>
            Powered by <a href="https://palqar.com/" target="_blank" rel="noopener noreferrer" className={styles["powered-brand"]} style={{ textDecoration: 'none' }}>Palqar</a>
          </span>
        </div>
      </div>
    </footer>
  );
}