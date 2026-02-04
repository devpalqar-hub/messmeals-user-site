import "./HeroSection.css";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Utensils,
  ShieldCheck,
  CookingPot,
  IndianRupee,
  Phone,
} from "lucide-react";

/* ---------------- ANIMATION VARIANTS ---------------- */

import type { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], 
    },
  },
};

const stagger: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};


/* ---------------- COMPONENT ---------------- */

export default function HeroSection() {
  return (
    <section className="hero">
      {/* Background Overlay */}
      <div className="hero-overlay" />

      {/* HERO CONTENT */}
      <motion.div
        className="hero-content"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Badge */}
        <motion.span className="hero-badge" variants={fadeUp}>
          <span className="badge-dot" />
          #1 Food Network in Kerala
        </motion.span>

        {/* Title */}
        <motion.h1 className="hero-title" variants={fadeUp}>
          Discover Homely & <br />
          <span>Verified Mess Services</span> in <br />
          Kerala
        </motion.h1>

        {/* Subtitle */}
        <motion.p className="hero-subtitle" variants={fadeUp}>
          Experience the warmth of homemade food away from home.
          <br />
          <span>
            Connect directly with trusted kitchens from Kasaragod to
            <br />
            Trivandrum.
          </span>
        </motion.p>

        {/* SEARCH BAR */}
        <motion.div
          className="hero-search"
          variants={fadeUp}
          whileHover={{ scale: 1.01 }}
        >
          {/* Location */}
          <div className="search-item">
            <MapPin size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search location (e.g. Infopark, Kochi)"
            />
          </div>

          <div className="search-divider" />

          {/* Preference */}
          <div className="search-item select">
            <Utensils size={20} className="search-icon" />
            <select defaultValue="">
              <option value="" disabled>
                Any Preference
              </option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
            </select>
          </div>

          {/* Search Button */}
          <button type="button" className="search-btn">
            Search <Search size={18} />
          </button>
        </motion.div>

        {/* Popular Locations */}
        <motion.div className="hero-tags" variants={fadeUp}>
          <span>Popular now:</span>
          <button>Kochi</button>
          <button>Trivandrum</button>
          <button>Calicut</button>
          <button>Technopark</button>
        </motion.div>
      </motion.div>

      {/* FEATURES */}
      <motion.div
        className="hero-features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="features-card">
          {/* Feature 1 */}
          <motion.div
            className="feature-item"
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="feature-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4>100% Verified</h4>
              <p>Every kitchen physically inspected.</p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="feature-item"
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="feature-icon">
              <CookingPot size={20} />
            </div>
            <div>
              <h4>Homely Taste</h4>
              <p>Authentic recipes, zero preservatives.</p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="feature-item"
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="feature-icon">
              <IndianRupee size={20} />
            </div>
            <div>
              <h4>Transparent Pricing</h4>
              <p>No hidden fees or commissions.</p>
            </div>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            className="feature-item"
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="feature-icon">
              <Phone size={20} />
            </div>
            <div>
              <h4>Direct Contact</h4>
              <p>Connect directly with owners.</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
