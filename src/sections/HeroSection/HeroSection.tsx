import styles from "./HeroSection.module.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Utensils,
  CalendarDays,
  LocateFixed,
  ChevronDown,
} from "lucide-react";
import { useRef } from "react";
import type { Variants } from "framer-motion";

/* ---------------- ANIMATION VARIANTS ---------------- */

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

const POPULAR_SEARCHES = [
  "Kerala",
  "Tamilnadu",
  "Pondicherry",
  "Bangalore",
];

/* ---------------- COMPONENT ---------------- */

export default function HeroSection() {
  const navigate = useNavigate();

  const locationInputRef = useRef<HTMLInputElement>(null);
  const mealSelectRef = useRef<HTMLSelectElement>(null);
  const planSelectRef = useRef<HTMLSelectElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/view-all-listings");
  };

  const focusLocation = () => {
    locationInputRef.current?.focus();
  };

  const openMealDropdown = () => {
    const select = mealSelectRef.current;

    if (!select) return;

    select.focus();

    // Opens the native dropdown where supported
    if ("showPicker" in HTMLSelectElement.prototype) {
      select.showPicker();
    }
  };

  const openPlanDropdown = () => {
    const select = planSelectRef.current;

    if (!select) return;

    select.focus();

    // Opens the native dropdown where supported
    if ("showPicker" in HTMLSelectElement.prototype) {
      select.showPicker();
    }
  };

  return (
    <section className={styles["hero-light"]}>
      <motion.div
        className={styles["hero-light-content"]}
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Title */}
        <motion.h1
          className={styles["hero-light-title"]}
          variants={fadeUp}
        >
          Find homely meals <br />
          from <span>trusted messes.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={styles["hero-light-subtitle"]}
          variants={fadeUp}
        >
          Search, compare and book the best mess plans
          <br />
          that suit your taste and budget.
        </motion.p>

        {/* SEARCH BAR */}
        <motion.form
          className={styles["hero-light-search"]}
          variants={fadeUp}
          onSubmit={handleSearch}
        >
          {/* LOCATION */}
          <div
            className={styles["hls-item"]}
            onClick={focusLocation}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                focusLocation();
              }
            }}
          >
            <div className={styles["hls-icon-wrapper"]}>
              <MapPin size={18} className={styles["hls-icon"]} />
            </div>

            <div className={styles["hls-field"]}>
              <label>Enter location</label>

              <input
                ref={locationInputRef}
                type="text"
                placeholder="e.g. Kochi, Kerala"
              />
            </div>

            <LocateFixed
              size={18}
              className={styles["hls-right-icon"]}
            />
          </div>

          {/* MEAL PREFERENCE */}
          <div
            className={`${styles["hls-item"]} ${styles["hls-select"]}`}
            onClick={openMealDropdown}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openMealDropdown();
              }
            }}
          >
            <div className={styles["hls-icon-wrapper"]}>
              <Utensils size={18} className={styles["hls-icon"]} />
            </div>

            <div className={styles["hls-field"]}>
              <label>Meal preference</label>

              <select ref={mealSelectRef} defaultValue="">
                <option value="">Any</option>
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>
            </div>

            <ChevronDown
              size={18}
              className={styles["hls-right-icon"]}
            />
          </div>

          {/* PLAN TYPE */}
          <div
            className={`${styles["hls-item"]} ${styles["hls-select"]}`}
            onClick={openPlanDropdown}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openPlanDropdown();
              }
            }}
          >
            <div className={styles["hls-icon-wrapper"]}>
              <CalendarDays
                size={18}
                className={styles["hls-icon"]}
              />
            </div>

            <div className={styles["hls-field"]}>
              <label>Plan type</label>

              <select ref={planSelectRef} defaultValue="">
                <option value="">Any</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <ChevronDown
              size={18}
              className={styles["hls-right-icon"]}
            />
          </div>

          {/* SEARCH BUTTON */}
          <button type="submit" className={styles["hls-btn"]}>
            Search Meals
            <Search size={17} />
          </button>
        </motion.form>

        {/* Popular Searches */}
        <motion.div
          className={styles["hero-light-tags"]}
          variants={fadeUp}
        >
          <span>Popular searches:</span>

          {POPULAR_SEARCHES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => navigate("/view-all-listings")}
            >
              {city}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}