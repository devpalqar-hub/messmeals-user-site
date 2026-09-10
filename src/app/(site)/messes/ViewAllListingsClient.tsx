"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getAllMess, getSearchSuggestions, type MessListFilters, type SearchSuggestionResponse } from "../../../services/messApi";
import type { MessListing, MessMeta } from "../../../types/mess";
import {
  MapPin,
  // Star, // commented out — new API does not return ratings
  Search,
  Filter,
  X,
  Utensils,
  ShieldCheck,
  Check,
  ArrowRight,
  Star,
  Loader2,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import styles from "./ViewAllListingsClient.module.css";

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

export default function ViewAllListingsClient({ 
  initialData, 
  initialMeta 
}: { 
  initialData?: MessListing[]; 
  initialMeta?: MessMeta | null; 
}) {
  const [messList, setMessList] = useState<MessListing[]>(initialData || []);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<MessMeta | null>(initialMeta || null);
  const [initialLoading, setInitialLoading] = useState(!initialData);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("name") || "");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestionResponse | null>(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const getInitialFilters = (): Filters => {
    const init: Filters = {};
    if (searchParams.get("name")) init.search = searchParams.get("name")!;
    if (searchParams.get("latitude")) init.latitude = searchParams.get("latitude")!;
    if (searchParams.get("longitude")) init.longitude = searchParams.get("longitude")!;
    if (searchParams.get("foodType")) init.foodType = searchParams.get("foodType")!;
    if (searchParams.get("planType")) init.planType = searchParams.get("planType")!;
    return init;
  };

  const [filters, setFilters] = useState<Filters>(getInitialFilters);
  const [localFilters, setLocalFilters] = useState<Filters>(getInitialFilters);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions(null);
      setIsLoadingSuggestions(false);
      return;
    }
    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        const data = await getSearchSuggestions(debouncedQuery, 50);
        setSuggestions(data);
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      } finally {
        setIsLoadingSuggestions(false);
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
      if (isSuggestionsOpen) setIsSuggestionsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSuggestionsOpen]);

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
  const initialMount = useRef(true);
  useEffect(() => {
    if (initialMount.current && initialData) {
      initialMount.current = false;
      return;
    }
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

  const applyFilters = (filtersToApply = localFilters) => {
    setFilters(filtersToApply);

    const newParams = new URLSearchParams(searchParams.toString());
    const keys: (keyof Filters)[] = ["search", "foodType", "planType", "isVerified", "featured", "latitude", "longitude"];

    keys.forEach((key) => {
      const val = filtersToApply[key];
      if (val) {
        if (key === "search") newParams.set("name", val);
        else newParams.set(key, val);
      } else {
        if (key === "search") newParams.delete("name");
        else newParams.delete(key);
      }
    });

    // scroll:false — this is a filter update on the same page, not a real
    // navigation; react-router's setSearchParams didn't scroll either.
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    setShowMobileFilters(false);
  };

  const updateLocalFilter = (key: keyof Filters, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const updateAndApplySearch = (value: string) => {
    setSearchQuery(value);
    const newFilters = { ...localFilters, search: value || undefined, latitude: undefined, longitude: undefined };
    setLocalFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSelectMess = (mess: any) => {
    setSearchQuery(mess.name);
    setIsSuggestionsOpen(false);
    const newFilters = { ...localFilters, search: mess.name, latitude: undefined, longitude: undefined };
    setLocalFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSelectLocation = (loc: any) => {
    setSearchQuery(loc.name);
    setIsSuggestionsOpen(false);
    const newFilters = {
      ...localFilters,
      search: undefined,
      latitude: loc.latitude.toString(),
      longitude: loc.longitude.toString()
    };
    setLocalFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsSuggestionsOpen(false);
      const newFilters = { ...localFilters, search: searchQuery || undefined, latitude: undefined, longitude: undefined };
      setLocalFilters(newFilters);
      applyFilters(newFilters);
    }
  };

  const clearAllFilters = () => {
    setLocalFilters({});
    setFilters({});
    router.replace(pathname, { scroll: false });
  };

  const hasActiveFilters = Object.keys(localFilters).some(
    (key) => key !== "search" && localFilters[key as keyof Filters]
  );

  const hasMore = meta ? page < meta.totalPages : false;

  return (
    <main className={styles["view-all-page"]}>
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
      <div
        className={styles["top-search"]}
        ref={searchContainerRef}
      >
        <Search size={20} />
        <input
          ref={locationInputRef}
          placeholder="Search mess name or location..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSuggestionsOpen(true);
          }}
          onFocus={() => setIsSuggestionsOpen(true)}
          onKeyDown={handleSearchKeyDown}
        />
        {searchQuery && (
          <button
            className={styles["clear-search-btn"]}
            onClick={() => updateAndApplySearch("")}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}

        {/* AUTOCOMPLETE DROPDOWN */}
        {isSuggestionsOpen && (searchQuery.trim().length > 0 || isLoadingSuggestions) && (
          <div className={styles["hls-dropdown"]}>
            {isLoadingSuggestions ? (
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

                {!isLoadingSuggestions && (!suggestions?.messes || suggestions.messes.length === 0) && (!suggestions?.locations || suggestions.locations.length === 0) && (
                  <div className={styles["hls-dropdown-empty"]}>
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* MOBILE FILTER TOGGLE */}
      <button
        className={styles["mobile-filter-toggle"]}
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        title="Filters"
      >
        <Filter size={18} />
        {hasActiveFilters && <span className={styles["filter-badge"]} />}
      </button>

      <div className={styles.layout}>
        {/* FILTER SIDEBAR */}
        <aside className={`${styles.filters} ${showMobileFilters ? styles.show : ""}`}>
          <div className={styles["filter-header"]}>
            <h2>
              <Filter size={18} />
              Filters
            </h2>
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
              value={localFilters.foodType || ""}
              onChange={(e) => updateLocalFilter("foodType", e.target.value)}
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
              value={localFilters.planType || ""}
              onChange={(e) => updateLocalFilter("planType", e.target.value)}
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
              value={localFilters.isVerified || ""}
              onChange={(e) => updateLocalFilter("isVerified", e.target.value)}
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
              value={localFilters.featured || ""}
              onChange={(e) => updateLocalFilter("featured", e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Featured Only</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button
              className={styles["apply-filters-btn"]}
              onClick={() => applyFilters()}
            >
              <Filter size={16} />
              Apply Filters
            </button>
            <button
              className={styles["clear-all-btn"]}
              onClick={clearAllFilters}
              disabled={!hasActiveFilters}
            >
              Clear
            </button>
          </div>
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
                    <article className={styles["listing-card"]} key={mess.id}>
                      <div className={styles["image-wrap"]}>
                        <MessImage
                          src={mess.coverImage}
                          alt={mess.messName}
                        />

                        {mess.status.isVerified && (
                          <span className={`${styles.badge} ${styles.verified}`}>
                            <span className={styles["badge-icon"]}>
                              <Check size={11} />
                            </span>
                            Verified
                          </span>
                        )}

                        {mess.totalSubscribers !== undefined && mess.totalSubscribers !== null && (
                          <span className={styles["subscribers-badge"]}>
                            <Users size={12} />
                            {mess.totalSubscribers} Subscribers
                          </span>
                        )}
                      </div>

                      <div className={styles["card-body"]}>
                        <div className={styles["card-name-block"]}>
                          <div className={styles["card-location"]}>
                            <MapPin size={12} />
                            <span>{mess.address.address || mess.address.location || "Location not set"}</span>
                          </div>
                          <h2 className={styles["card-title"]}>{mess.messName}</h2>
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

                          <Link
                            className={styles["view-btn"]}
                            href={`/mess/${mess.slug}`}
                          >
                            View Details
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </article>
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
                  You&apos;ve seen all {meta?.total ?? messList.length} listings
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
