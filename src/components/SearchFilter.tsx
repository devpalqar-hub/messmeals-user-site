import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, UtensilsCrossed, X } from "lucide-react";
import { searchLocations } from "../services/location.service";
import type { GeoLocation } from "../types/location";
import { getAllMess } from "../services/messApi";
import "./SearchFilter.css";

type FilterType = "location" | "dates" | "foodType" | null;

interface SearchData {
  location: string;
  startDate: string | null;
  endDate: string | null;
  foodType: string;
  weekDays: string[];
}

export default function SearchFilter() {
  const [locationResults, setLocationResults] = useState<GeoLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [searchData, setSearchData] = useState<SearchData>({
    location: "",
    startDate: null,
    endDate: null,
    foodType: "",
    weekDays: [],
  });

  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setActiveFilter(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFoodTypeSelect = (type: string) => {
    setSearchData((prev) => ({ ...prev, foodType: type }));
    setActiveFilter(null);
  };

  const handleSearch = async () => {
    const filters = {
      location: searchData.location,
      foodType:
        searchData.foodType === "Veg"
          ? "VEG"
          : searchData.foodType === "Non-Veg"
          ? "NON_VEG"
          : searchData.foodType === "Both"
          ? "MIXED"
          : "",
    };
    const res = await getAllMess(1, 10, filters);
    console.log("Messes:", res);
  };

  const formatDateRange = (): string => {
    if (!searchData.startDate && !searchData.endDate) return "Add dates";
    if (searchData.startDate && !searchData.endDate) {
      return new Date(searchData.startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    if (searchData.startDate && searchData.endDate) {
      const start = new Date(searchData.startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const end = new Date(searchData.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${start} - ${end}`;
    }
    return "Add dates";
  };

  const clearFilter = (filterName: "location" | "dates" | "foodType") => {
    setSearchData((prev) => {
      if (filterName === "location") return { ...prev, location: "" };
      if (filterName === "dates")
        return { ...prev, startDate: null, endDate: null, weekDays: [] };
      if (filterName === "foodType") return { ...prev, foodType: "" };
      return prev;
    });
  };

  return (
    <div className="search-filter-container" ref={filterRef}>
      <motion.div
        className={`search-filter-bar ${activeFilter ? "expanded" : ""}`}
        layout
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Location Filter */}
        <motion.div
          className={`filter-section ${activeFilter === "location" ? "active" : ""}`}
          data-filter="location"
          onClick={() => setActiveFilter("location")}
          layout
        >
          <div className="filter-content">
            <label>Where</label>
            <div className="filter-value">
              {searchData.location || "Search location"}
            </div>
          </div>
          {searchData.location && activeFilter !== "location" && (
            <button
              className="clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                clearFilter("location");
              }}
            >
              <X size={14} />
            </button>
          )}
        </motion.div>

        <div className="divider" />

        {/* Date Filter */}
        <motion.div
          className={`filter-section ${activeFilter === "dates" ? "active" : ""}`}
          data-filter="dates"
          onClick={() => setActiveFilter("dates")}
          layout
        >
          <div className="filter-content">
            <label>When</label>
            <div className="filter-value">{formatDateRange()}</div>
          </div>
          {searchData.startDate && activeFilter !== "dates" && (
            <button
              className="clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                clearFilter("dates");
              }}
            >
              <X size={14} />
            </button>
          )}
        </motion.div>

        <div className="divider" />

        {/* Food Type Filter */}
        <motion.div
          className={`filter-section ${activeFilter === "foodType" ? "active" : ""}`}
          data-filter="foodType"
          onClick={() => setActiveFilter("foodType")}
          layout
        >
          <div className="filter-content">
            <label>Food Type</label>
            <div className="filter-value">
              {searchData.foodType || "Any preference"}
            </div>
          </div>
          {searchData.foodType && activeFilter !== "foodType" && (
            <button
              className="clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                clearFilter("foodType");
              }}
            >
              <X size={14} />
            </button>
          )}
        </motion.div>

        {/* Search Button */}
        <motion.button
          className="search-btn"
          onClick={handleSearch}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search size={18} />
          <span>Search</span>
        </motion.button>
      </motion.div>

      {/* Dropdowns */}
      <AnimatePresence mode="wait">
        {activeFilter === "location" && (
          <motion.div
            className="dropdown-container location-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="dropdown-content">
              <h3>Search by location</h3>
              <div className="location-search-input">
                <MapPin size={20} />
                <input
                  type="text"
                  placeholder="Try 'Kochi' or 'Technopark'"
                  value={searchData.location}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchData((prev) => ({
                      ...prev,
                      location: value,
                    }));

                    if (debounceRef.current) clearTimeout(debounceRef.current);

                    debounceRef.current = window.setTimeout(async () => {
                      if (value.length < 2) {
                        setLocationResults([]);
                        return;
                      }

                      try {
                        setLoadingLocations(true);
                        const results = await searchLocations(value);
                        setLocationResults(results);
                      } finally {
                        setLoadingLocations(false);
                      }
                    }, 400);
                  }}
                  autoFocus
                />
              </div>

              <div className="location-results">
                {loadingLocations && <div className="loc-loading">Searching...</div>}

                {!loadingLocations && locationResults.length > 0 && (
                  <div className="location-suggestions">
                    {locationResults.map((loc) => (
                      <button
                        key={loc.id}
                        className="location-suggestion-item"
                        onClick={() => {
                          setSearchData((prev) => ({
                            ...prev,
                            location: loc.placeName,
                          }));
                          setLocationResults([]);
                          setActiveFilter(null);
                        }}
                      >
                        <MapPin size={16} />
                        <div>
                          <div className="place">{loc.placeName}</div>
                          <div className="zip">{loc.zipcode}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        
        {activeFilter === "foodType" && (
          <motion.div
            className="dropdown-container foodtype-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="dropdown-content">
              <h3>Select your preference</h3>
              <div className="foodtype-grid">
                {["Veg", "Non-Veg", "Both"].map((type) => (
                  <motion.button
                    key={type}
                    className={`foodtype-card ${
                      searchData.foodType === type ? "selected" : ""
                    }`}
                    onClick={() => handleFoodTypeSelect(type)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UtensilsCrossed size={24} />
                    <span>{type}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
