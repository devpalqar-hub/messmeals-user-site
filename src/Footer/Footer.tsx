import "./Footer.css";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LEFT BRAND */}
        <div className="footer-brand">
          <div className="brand">
            <div className="brand-icon">🍽️</div>
            <h3>Kerala Mess Finder</h3>
          </div>

          <p>
            Connecting you to authentic flavors and trustworthy kitchens.
            Taste the tradition, feel the home.
          </p>
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <div className="link-group">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Contact</a>
          </div>

          <div className="link-group">
            <h4>Cities</h4>
            <a href="#">Kochi</a>
            <a href="#">Thiruvananthapuram</a>
            <a href="#">Kozhikode</a>
            <a href="#">All Cities</a>
          </div>

          <div className="link-group">
            <h4>Partners</h4>
            <a href="#">List Your Mess</a>
            <a href="#">Safety Standards</a>
            <a href="#">Success Stories</a>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="footer-divider" />

      {/* BOTTOM */}
      <div className="footer-bottom">
        <span>© 2023 Kerala Mess Finder. All rights reserved.</span>

        <div className="socials">
          <Facebook size={20} />
          <Instagram size={20} />
        </div>
      </div>
    </footer>
  );
}
