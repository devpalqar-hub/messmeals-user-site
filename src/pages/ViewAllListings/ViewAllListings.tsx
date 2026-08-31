import { useEffect, useState, useRef, useCallback } from "react";
import { getAllMess, type MessListFilters } from "../../services/messApi";
import type { MessListing, MessMeta } from "../../types/mess";
import {
  MapPin,
  // Star, // commented out — new API does not return ratings
  Heart,
  Search,
  Filter,
  X,
  Utensils,
  ShieldCheck,
  Check,
  ArrowRight,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./ViewAllListings.module.css";

const LIMIT = 6;

type Filters = MessListFilters;

function SkeletonCard() {
  return (
    <div className={styles["skeleton-card"]}>
      <div className={styles["skeleton-image"]} />
      <div className={styles["skeleton-body"]}>
        <div className={styles["skeleton-line"]} style={{ width: "60%" }} />
        <div className={styles["skeleton-line"]} style={{ width: "40%" }} />
        <div className={styles["skeleton-divider"]} />
        <div className={styles["skeleton-line"]} style={{ width: "80%" }} />
        <div className={styles["skeleton-btn"]} />
      </div>
    </div>
  );
}

function MessImage({ src, alt }: { src?: string | null; alt: string }) {
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

export default function ViewAllListings() {
  const [messList, setMessList] = useState<MessListing[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<MessMeta | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({});

  const sentinelRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const navigate = useNavigate();

  // Initial / filter-reset load
  const fetchInitial = useCallback(async (activeFilters: Filters) => {
    setInitialLoading(true);
    try {
      const res = await getAllMess(1, LIMIT, activeFilters);
      const data = Array.isArray(res) ? res : res?.data ?? [];
      const metaData = Array.isArray(res) ? null : res?.meta ?? null;
      setMessList(data);
      setMeta(metaData);
      setPage(1);
    } catch (err) {
      console.error("Failed to fetch mess", err);
      setMessList([]);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  // Load next page and append
  const fetchMore = useCallback(async (nextPage: number, activeFilters: Filters) => {
    setLoadingMore(true);
    try {
      const res = await getAllMess(nextPage, LIMIT, activeFilters);
      const data = Array.isArray(res) ? res : res?.data ?? [];
      const metaData = Array.isArray(res) ? null : res?.meta ?? null;
      setMessList((prev) => [...prev, ...data]);
      setMeta(metaData);
    } catch (err) {
      console.error("Failed to fetch more mess", err);
    } finally {
      setLoadingMore(false);
    }
  }, []);

  // Re-fetch from page 1 when filters change
  useEffect(() => {
    fetchInitial(filters);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // IntersectionObserver — fires when sentinel enters viewport
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (loadingMore || initialLoading) return;

        setMeta((currentMeta) => {
          if (!currentMeta) return currentMeta;
          const hasMore = page < currentMeta.totalPages;
          if (hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMore(nextPage, filtersRef.current);
          }
          return currentMeta;
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadingMore, initialLoading, page, fetchMore]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => key !== "search" && filters[key as keyof Filters]
  );

  const hasMore = meta ? page < meta.totalPages : false;

  return (
    <section className={styles["view-all-page"]}>
      {/* PAGE HEADER */}
      <div className={styles["page-header"]}>
        <div>
          <h1>All Mess Listings</h1>
          <p className={styles["page-subtitle"]}>
            Discover verified messes offering homely and hygienic meals near you.
          </p>
        </div>
        {meta && (
          <div className={styles["results-count"]}>
            <Utensils size={15} />
            {meta.total} results found
          </div>
        )}
      </div>

      {/* SEARCH BAR */}
      <div className={styles["top-search"]}>
        <Search size={20} />
        <input
          placeholder="Search mess name or keyword..."
          value={filters.search || ""}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
        {filters.search && (
          <button
            className={styles["clear-search-btn"]}
            onClick={() => updateFilter("search", "")}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* MOBILE FILTER TOGGLE */}
      <button
        className={styles["mobile-filter-toggle"]}
        onClick={() => setShowMobileFilters(!showMobileFilters)}
      >
        <Filter size={18} />
        Filters
        {hasActiveFilters && <span className={styles["filter-badge"]} />}
      </button>

      <div className={styles.layout}>
        {/* FILTER SIDEBAR */}
        <aside className={`${styles.filters} ${showMobileFilters ? styles.show : ""}`}>
          <div className={styles["filter-header"]}>
            <h3>
              <Filter size={18} />
              Filters
            </h3>
            {hasActiveFilters && (
              <button className={styles["clear-all-btn"]} onClick={clearAllFilters}>
                Clear All
              </button>
            )}
            <button
              className={styles["close-filters-btn"]}
              onClick={() => setShowMobileFilters(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Food Type */}
          <div className={styles["filter-group"]}>
            <label>
              <Utensils size={15} />
              Food Type
            </label>
            <select
              value={filters.foodType || ""}
              onChange={(e) => updateFilter("foodType", e.target.value)}
            >
              <option value="">All</option>
              <option value="VEG">Vegetarian</option>
              <option value="NON_VEG">Non-Vegetarian</option>
              <option value="MIXED">Mixed (Veg &amp; Non-Veg)</option>
            </select>
          </div>

          {/* Plan Type */}
          <div className={styles["filter-group"]}>
            <label>
              <Star size={15} />
              Plan Type
            </label>
            <select
              value={filters.planType || ""}
              onChange={(e) => updateFilter("planType", e.target.value)}
            >
              <option value="">All</option>
              <option value="DAILY">Daily Plans</option>
              <option value="MONTHLY">Monthly Plans</option>
            </select>
          </div>

          {/* Verified */}
          <div className={styles["filter-group"]}>
            <label>
              <ShieldCheck size={15} />
              Verification
            </label>
            <select
              value={filters.isVerified || ""}
              onChange={(e) => updateFilter("isVerified", e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified</option>
            </select>
          </div>

          {/* Featured */}
          <div className={styles["filter-group"]}>
            <label>
              <Star size={15} />
              Featured
            </label>
            <select
              value={filters.featured || ""}
              onChange={(e) => updateFilter("featured", e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Featured Only</option>
            </select>
          </div>

          <button
            className={styles["apply-filters-btn"]}
            onClick={() => setShowMobileFilters(false)}
          >
            <Filter size={16} />
            Apply Filters
          </button>
        </aside>

        {/* LISTINGS */}
        <div className={styles["listing-container"]}>
          {initialLoading ? (
            <div className={styles["listing-grid"]}>
              {Array.from({ length: LIMIT }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : messList.length === 0 ? (
            <div className={styles["empty-state"]}>
              <p>No mess found matching your criteria.</p>
              {hasActiveFilters && (
                <button className={styles["clear-filters-btn"]} onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={styles["listing-grid"]}>
                {messList.map((mess) => {
                  return (
                    <div className={styles["listing-card"]} key={mess.id}>
                      <div className={styles["image-wrap"]}>
                        <MessImage
                          src={mess.coverImage}
                          alt={`${mess.messName} at ${mess.address.address}`}
                        />

                        {mess.status.isVerified && (
                          <span className={`${styles.badge} ${styles.verified}`}>
                            <span className={styles["badge-icon"]}>
                              <Check size={11} />
                            </span>
                            Verified
                          </span>
                        )}

                        <button className={styles.wishlist} aria-label="Add to wishlist">
                          <Heart size={14} />
                        </button>
                      </div>

                      <div className={styles["card-body"]}>
                        <div className={styles["card-name-block"]}>
                          <div className={styles["card-location"]}>
                            <MapPin size={12} />
                            <span>{mess.address.address || mess.address.location || "Location not set"}</span>
                          </div>
                          <h3 className={styles["card-title"]}>{mess.messName}</h3>
                        </div>

                        {/* Star ratings commented out — new API does not return ratings/reviews */}
                        {/* <div className={styles["rating-badge"]}>
                          <Star size={14} fill="#ffa500" stroke="#ffa500" />
                          <span>{mess.ratings ?? 4.5}</span>
                          <span className={styles["rating-divider"]}>|</span>
                          <span className={styles["review-count"]}>
                            {mess.Testimonials?.length ?? 0} Reviews
                          </span>
                        </div> */}

                        <div className={styles["card-divider"]} />

                        <div className={styles["card-footer"]}>
                          <div className={styles["price-info"]}>
                            <small>STARTING FROM</small>
                            <strong>
                              {mess.startingPlanPrice != null
                                ? <>₹{mess.startingPlanPrice}<span>/month</span></>
                                : <span>Contact for price</span>
                              }
                            </strong>
                          </div>

                          <button
                            className={styles["view-btn"]}
                            onClick={() => navigate(`/mess/${mess.slug}`)}
                          >
                            View Details
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Skeleton rows appended while loading more */}
                {loadingMore &&
                  Array.from({ length: LIMIT }).map((_, i) => (
                    <SkeletonCard key={`skel-${i}`} />
                  ))}
              </div>

              {/* Sentinel — watched by IntersectionObserver */}
              <div ref={sentinelRef} className={styles.sentinel} />

              {/* End-of-list message */}
              {!hasMore && !loadingMore && (
                <p className={styles["end-of-list"]}>
                  You've seen all {meta?.total ?? messList.length} listings
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}