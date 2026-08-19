import "./HeroSection.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Utensils, CalendarDays } from "lucide-react";

/* ---------------- ANIMATION VARIANTS ---------------- */

import type { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const stagger: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const POPULAR_SEARCHES = ["Kochi", "Trivandrum", "Calicut", "Ernakulam", "Thrissur"];

/* ---------------- COMPONENT ---------------- */

export default function HeroSection() {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/view-all-listings");
  };

  return (
    <section className="hero-light">
      <motion.div
        className="hero-light-content"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Title */}
        <motion.h1 className="hero-light-title" variants={fadeUp}>
          Find homely meals <br />
          from <span>trusted messes.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p className="hero-light-subtitle" variants={fadeUp}>
          Search, compare and book the best mess plans
          <br />
          that suit your taste and budget.
        </motion.p>

        {/* SEARCH BAR */}
        <motion.form
          className="hero-light-search"
          variants={fadeUp}
          onSubmit={handleSearch}
        >
          {/* Location */}
          <div className="hls-item">
            <MapPin size={18} className="hls-icon" />
            <div className="hls-field">
              <label>Enter location</label>
              <input type="text" placeholder="e.g. Kochi, Kerala" />
            </div>
          </div>

          <div className="hls-divider" />

          {/* Meal preference */}
          <div className="hls-item hls-select">
            <Utensils size={18} className="hls-icon" />
            <div className="hls-field">
              <label>Meal preference</label>
              <select defaultValue="">
                <option value="">Any</option>
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>
            </div>
          </div>

          <div className="hls-divider" />

          {/* Plan type */}
          <div className="hls-item hls-select">
            <CalendarDays size={18} className="hls-icon" />
            <div className="hls-field">
              <label>Plan type</label>
              <select defaultValue="">
                <option value="">Any</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <button type="submit" className="hls-btn">
            Search Meals <Search size={17} />
          </button>
        </motion.form>

        {/* Popular Searches */}
        <motion.div className="hero-light-tags" variants={fadeUp}>
          <span>Popular searches:</span>
          {POPULAR_SEARCHES.map((city) => (
            <button key={city} onClick={() => navigate("/view-all-listings")}>
              {city}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
