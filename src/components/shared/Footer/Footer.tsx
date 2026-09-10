import styles from "./Footer.module.css";
import { Facebook, Instagram, Building2, Linkedin, Compass, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles["footer-wrap"]}>
      <div className={styles.footer}>
        <div className={styles["footer-container"]}>
          {/* LEFT BRAND */}
          <div className={styles["footer-brand"]}>
            <Link href="/" className={styles.brand}>
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
                <a href="#" aria-label="Linkedin" className={styles["social-btn"]}>
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* LINKS */}
          <div className={styles["footer-links"]}>
            <div className={styles["link-group"]}>
              <h4>
                <span className={styles["link-icon"]}>
                  <Compass size={16} />
                </span>
                Explore
              </h4>
              <Link href="/messes">Messes</Link>
              <Link href="/#popular-plans">Popular Plans</Link>
              <Link href="/mess-manager">List Your Mess</Link>
            </div>

            <div className={styles["link-group"]}>
              <h4>
                <span className={styles["link-icon"]}>
                  <Building2 size={16} />
                </span>
                Company
              </h4>
              <Link href="/about">About Us</Link>
              <Link href="#">Blog</Link>
            </div>

            <div className={styles["link-group"]}>
              <h4>
                <span className={styles["link-icon"]}>
                  <ShieldCheck size={16} />
                </span>
                Legal
              </h4>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms &amp; Conditions</Link>
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


          <span className={styles["powered-by"]}>
            Powered by <a href="https://palqar.com/" target="_blank" rel="noopener noreferrer" className={styles["powered-brand"]} style={{ textDecoration: 'none' }}>Palqar</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
