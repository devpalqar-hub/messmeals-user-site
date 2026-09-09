"use client";

import styles from "./HeroSection.module.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  Utensils,
  CalendarDays,
  ChevronDown,
  ArrowRight,
  MapPin,
  Store,
  Loader2,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import type { Variants } from "framer-motion";
import { getSearchSuggestions } from "../../services/messApi";
import type { SearchSuggestionResponse } from "../../services/messApi";
import { useToast } from "../../context/ToastContext";

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

// const POPULAR_SEARCHES = [
//   "Kerala",
//   "Tamilnadu",
//   "Pondicherry",
//   "Bangalore",
// ];

/* ---------------- COMPONENT ---------------- */

export default function HeroSection() {
  const router = useRouter();
  const { error } = useToast();

  const locationInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mealSelectRef = useRef<HTMLSelectElement>(null);
  const planSelectRef = useRef<HTMLSelectElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestionResponse | null>(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<
    | { type: "mess"; id: string; name: string }
    | { type: "location"; name: string; latitude: number; longitude: number }
    | null
  >(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions(null);
      setIsLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const data = await getSearchSuggestions(debouncedQuery, 50);
        setSuggestions(data);
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isSuggestionsOpen) {
        setIsSuggestionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSuggestionsOpen]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedItem(null);
    setIsSuggestionsOpen(true);
  };

  const handleSelectMess = (mess: any) => {
    setSearchQuery(mess.name);
    setSelectedItem({ type: "mess", id: mess.id, name: mess.name });
    setIsSuggestionsOpen(false);
  };

  const handleSelectLocation = (loc: any) => {
    setSearchQuery(loc.name);
    setSelectedItem({ type: "location", name: loc.name, latitude: loc.latitude, longitude: loc.longitude });
    setIsSuggestionsOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim().length > 0 && !selectedItem) {
      error("Please select a suggestion from the dropdown.");
      setIsSuggestionsOpen(true);
      locationInputRef.current?.focus();
      return;
    }

    const foodType = mealSelectRef.current?.value || "";
    const planType = planSelectRef.current?.value || "";

    const params = new URLSearchParams();

    if (selectedItem?.type === "mess") {
      params.append("name", selectedItem.name);
    } else if (selectedItem?.type === "location") {
      params.append("latitude", selectedItem.latitude.toString());
      params.append("longitude", selectedItem.longitude.toString());
    }

    if (foodType) params.append("foodType", foodType);
    if (planType) params.append("planType", planType);

    router.push(`/view-all-listings?${params.toString()}`);
  };

  const focusLocation = () => {
    locationInputRef.current?.focus();
    setIsSuggestionsOpen(true);
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
          {/* SEARCH INPUT */}
          <div
            className={`${styles["hls-item"]} ${styles["hls-search-item"]}`}
            ref={searchContainerRef}
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
            <div className={`${styles["hls-icon-wrapper"]} ${styles["hls-search-icon-wrapper"]}`}>
              <Search size={18} className={styles["hls-icon"]} />
            </div>

            <div className={`${styles["hls-field"]} ${styles["hls-field-center"]}`}>
              <input
                ref={locationInputRef}
                type="text"
                value={searchQuery}
                onChange={handleQueryChange}
                onFocus={() => setIsSuggestionsOpen(true)}
                placeholder="Mess or location search"
              />
            </div>
            
            {/* AUTOCOMPLETE DROPDOWN */}
            {isSuggestionsOpen && (searchQuery.trim().length > 0 || isLoading) && (
              <div className={styles["hls-dropdown"]}>
                {isLoading ? (
                  <div className={styles["hls-dropdown-loading"]}>
                    <Loader2 className={styles["hls-spinner"]} size={20} />
                    <span>Loading suggestions...</span>
                  </div>
                ) : (
                  <>
                    {suggestions?.messes && suggestions.messes.length > 0 && (
                      <div className={styles["hls-dropdown-group"]}>
                        <div className={styles["hls-dropdown-header"]}>Messes</div>
                        {suggestions.messes.map((mess) => (
                          <div
                            key={`mess-${mess.id}`}
                            className={styles["hls-dropdown-item"]}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectMess(mess);
                            }}
                          >
                            <Store size={16} className={styles["hls-dropdown-icon"]} />
                            <span className={styles["hls-dropdown-text"]}>{mess.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {suggestions?.locations && suggestions.locations.length > 0 && (
                      <div className={styles["hls-dropdown-group"]}>
                        <div className={styles["hls-dropdown-header"]}>Locations</div>
                        {suggestions.locations.map((loc, idx) => (
                          <div
                            key={`loc-${idx}`}
                            className={styles["hls-dropdown-item"]}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectLocation(loc);
                            }}
                          >
                            <MapPin size={16} className={styles["hls-dropdown-icon"]} />
                            <span className={styles["hls-dropdown-text"]}>{loc.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {!isLoading && (!suggestions?.messes || suggestions.messes.length === 0) && (!suggestions?.locations || suggestions.locations.length === 0) && (
                      <div className={styles["hls-dropdown-empty"]}>
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
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
                <option value="VEG">Veg</option>
                <option value="NON_VEG">Non-Veg</option>
                <option value="MIXED">Mixed</option>
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
                <option value="DAILY">Daily</option>
                <option value="MONTHLY">Monthly</option>
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
            <ArrowRight size={17} />
          </button>
        </motion.form>

        {/* Popular Searches */}
        {/* <motion.div
          className={styles["hero-light-tags"]}
          variants={fadeUp}
        >
          <span>Popular searches:</span>

          {POPULAR_SEARCHES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => router.push("/view-all-listings")}
            >
              {city}
            </button>
          ))}
        </motion.div> */}
      </motion.div>
    </section>
  );
}