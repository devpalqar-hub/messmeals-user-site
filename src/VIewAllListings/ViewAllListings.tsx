import { useEffect, useState } from "react";
import { getAllMess } from "../services/messApi";
import type { Mess, MessMeta } from "../types/mess";
import {
  MapPin,
  Star,
  Heart,
  Search,
  Filter,
  X,
  Utensils,
  Building2,
  ShieldCheck,
  CircleDot,
  Sprout,
  CalendarDays,
  Headphones,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ViewAllListings.css";

const TRUST_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Messes",
    desc: "All messes are verified for quality & hygiene",
  },
  {
    icon: Sprout,
    title: "Hygienic Food",
    desc: "Fresh, homely and hygienic meals",
  },
  {
    icon: CalendarDays,
    title: "Flexible Plans",
    desc: "Daily, monthly or custom plans",
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    desc: "We're here to help you anytime",
  },
];

type Filters = {
  search?: string;
  categoryId?: string;
  ratings?: string;
  is_active?: string;
  is_verified?: string;
  location?: string;
  variationId?: string;
  foodType?: string;
  districtName?: string;
  date1?: string;
  date2?: string;
};

export default function ViewAllListings() {
  const [messList, setMessList] = useState<Mess[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<MessMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchMess();
  }, [page, filters]);

  const fetchMess = async () => {
    setLoading(true);
    try {
      const res = await getAllMess(page, 6, filters);
      setMessList(Array.isArray(res) ? res : res?.data ?? []);
      setMeta(Array.isArray(res) ? null : res?.meta ?? null);
    } catch (err) {
      console.error("Failed to fetch mess", err);
      setMessList([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearAllFilters = () => {
    setFilters({});
    setPage(1);
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => key !== "search" && filters[key as keyof Filters]
  );

  function MessImage({ src, alt }: { src?: string; alt: string }) {
    const [imgSrc, setImgSrc] = useState(src || "/food-placeholder.png");

    return (
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onError={() => setImgSrc("/food-placeholder.png")}
      />
    );
  }

  return (
    <section className="view-all-page">
      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <span>All Listings</span>
      </div>

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>All Mess Listings</h1>
          <p className="page-subtitle">
            Discover verified messes offering homely and hygienic meals near you.
          </p>
        </div>
        {meta && (
          <div className="results-count">
            <Utensils size={15} />
            {meta.total} results found
          </div>
        )}
      </div>

      {/* SEARCH BAR */}
      <div className="top-search">
        <Search size={20} />
        <input
          placeholder="Search mess name or keyword..."
          value={filters.search || ""}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
        {filters.search && (
          <button
            className="clear-search-btn"
            onClick={() => updateFilter("search", "")}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* MOBILE FILTER TOGGLE */}
      <button
        className="mobile-filter-toggle"
        onClick={() => setShowMobileFilters(!showMobileFilters)}
      >
        <Filter size={18} />
        Filters
        {hasActiveFilters && <span className="filter-badge" />}
      </button>

      <div className="layout">
        {/* FILTER SIDEBAR */}
        <aside className={`filters ${showMobileFilters ? "show" : ""}`}>
          <div className="filter-header">
            <h3>
              <Filter size={18} />
              Filters
            </h3>
            {hasActiveFilters && (
              <button className="clear-all-btn" onClick={clearAllFilters}>
                Clear All
              </button>
            )}
            <button
              className="close-filters-btn"
              onClick={() => setShowMobileFilters(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="filter-group">
            <label>
              <MapPin size={15} />
              Location
            </label>
            <input
              placeholder="Enter your location"
              value={filters.location || ""}
              onChange={(e) => updateFilter("location", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>
              <Building2 size={15} />
              District
            </label>
            <input
              placeholder="Enter district name"
              value={filters.districtName || ""}
              onChange={(e) => updateFilter("districtName", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>
              <Utensils size={15} />
              Food Type
            </label>
            <select
              value={filters.foodType || ""}
              onChange={(e) => updateFilter("foodType", e.target.value)}
            >
              <option value="">All</option>
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
              <option value="both">Mixed (Veg & Non-Veg)</option>
            </select>
          </div>

          <div className="filter-group">
            <label>
              <ShieldCheck size={15} />
              Verification Status
            </label>
            <select
              value={filters.is_verified || ""}
              onChange={(e) => updateFilter("is_verified", e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified</option>
            </select>
          </div>

          <div className="filter-group">
            <label>
              <CircleDot size={15} />
              Status
            </label>
            <select
              value={filters.is_active || ""}
              onChange={(e) => updateFilter("is_active", e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="filter-group">
            <label>
              <Star size={15} />
              Minimum Rating
            </label>
            <select
              value={filters.ratings || ""}
              onChange={(e) => updateFilter("ratings", e.target.value)}
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>

          {/* <div className="filter-group">
            <label>Category ID</label>
            <input
              placeholder="Enter category ID"
              value={filters.categoryId || ""}
              onChange={(e) => updateFilter("categoryId", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Variation ID</label>
            <input
              placeholder="Enter variation ID"
              value={filters.variationId || ""}
              onChange={(e) => updateFilter("variationId", e.target.value)}
            />
          </div> */}

          {/* <div className="filter-group">
            <label>From Date</label>
            <input
              type="date"
              value={filters.date1 || ""}
              onChange={(e) => updateFilter("date1", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>To Date</label>
            <input
              type="date"
              value={filters.date2 || ""}
              onChange={(e) => updateFilter("date2", e.target.value)}
            />
          </div> */}

          <button
            className="apply-filters-btn"
            onClick={() => setShowMobileFilters(false)}
          >
            <Filter size={16} />
            Apply Filters
          </button>
        </aside>

        {/* LISTINGS */}
        <div className="listing-container">
          {loading ? (
            <div className="loading-state">
              <p>Loading messes...</p>
            </div>
          ) : messList.length === 0 ? (
            <div className="empty-state">
              <p>No mess found matching your criteria.</p>
              {hasActiveFilters && (
                <button className="clear-filters-btn" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="listing-grid">
                {messList.map((mess) => {
                  const imageUrl = mess.images
                    ?.slice()
                    .sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url;

                  return (
                    <div className="listing-card" key={mess.id}>
                      <div className="image-wrap">
                        <MessImage
                          src={imageUrl}
                          alt={`${mess.name} in ${mess.location || "Kerala"}`}
                        />

                        {mess.is_verified && (
                          <span className="badge verified">
                            <span className="check-mark">✓</span> Verified
                          </span>
                        )}

                        <button className="wishlist" aria-label="Add to wishlist">
                          <Heart size={14} />
                        </button>

                        <div className="image-overlay">
                          <div className="location-badge">
                            <MapPin size={14} />
                            <span>{mess.location || "Kerala"}</span>
                          </div>
                          <h3 className="mess-name">{mess.name}</h3>
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="rating-badge">
                          <Star size={14} fill="#ffa500" stroke="#ffa500" />
                          <span>{mess.ratings ?? 4.5}</span>
                        </div>

                        <div className="tags">
                          <span className="tag">Homely</span>
                          <span className="tag">Monthly Plan</span>
                        </div>

                        <div className="card-divider" />

                        <div className="card-footer">
                          <div className="price-info">
                            <small>STARTING FROM</small>
                            <strong>
                              ₹{mess.plans?.[0]?.price ?? "N/A"}
                              <span>/mo</span>
                            </strong>
                          </div>

                          <button
                            className="view-btn"
                            onClick={() => navigate(`/mess/${mess.id}`)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION */}
              {meta && meta.totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    aria-label="Previous page"
                  >
                    ‹
                  </button>

                  {Array.from({ length: meta.totalPages }).map((_, i) => (
                    <button
                      key={i}
                      className={page === i + 1 ? "active" : ""}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={page === meta.totalPages}
                    onClick={() => setPage(page + 1)}
                    aria-label="Next page"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* TRUST STRIP */}
      <div className="trust-strip">
        {TRUST_FEATURES.map(({ icon: Icon, title, desc }) => (
          <div className="trust-item" key={title}>
            <div className="trust-icon">
              <Icon size={22} />
            </div>
            <div>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}