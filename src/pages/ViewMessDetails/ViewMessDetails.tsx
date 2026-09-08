import { useEffect, useRef, useState } from "react";
import SEO from "../../components/shared/SEO/SEO";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getMessBySlug } from "../../services/messApi";
import type { MessDetails, NewMessPlan } from "../../types/mess";
import {
  MapPin,
  // Star, // commented out — new API does not return ratings
  Phone,
  Mail,
  // Clock,
  Check,
  Leaf,
  Salad,
  Drumstick,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Images,
  CalendarDays,
  Sun,
  Utensils,
  Moon,
  Coffee,
  Tag,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import FloatingContact from "../../components/ui/FloatingContact/FloatingContact";
import styles from "./ViewMessDetails.module.css";

const WhatsappIcon = ({ size = 18, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.013 2a9.98 9.98 0 0 0-8.528 15.17l-1.48 4.417 4.542-1.464A9.98 9.98 0 1 0 12.013 2Zm0 18.293a8.318 8.318 0 0 1-4.238-1.157l-.304-.18-3.15.992.996-3.047-.2-.315A8.307 8.307 0 0 1 3.693 12a8.32 8.32 0 1 1 8.32 8.293Zm4.57-6.223c-.25-.125-1.48-.732-1.708-.816-.23-.083-.396-.125-.563.125-.166.25-.644.815-.79.98-.146.167-.292.188-.542.063-.25-.125-1.055-.39-2.01-1.24-.74-.66-1.24-1.47-1.385-1.72-.146-.25-.015-.385.11-.51.112-.113.25-.292.375-.438.125-.145.166-.25.25-.416.083-.166.04-.312-.02-.437-.063-.125-.563-1.355-.77-1.854-.203-.487-.41-.42-.564-.428l-.48-.008c-.166 0-.437.063-.666.313-.23.25-.875.854-.875 2.083 0 1.23.896 2.417 1.02 2.583.125.167 1.76 2.688 4.263 3.77.596.258 1.06.412 1.423.527.597.19 1.14.163 1.57.1.473-.07 1.48-.605 1.688-1.188.208-.583.208-1.082.146-1.187-.062-.105-.228-.167-.478-.292Z" />
  </svg>
);

const DESCRIPTION_PREVIEW_LENGTH = 110;

const DAY_ORDER_UPPER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const DAY_SHORT: Record<string, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Map a variation title to a suitable lucide icon and color class */
const getVariationConfig = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("breakfast") || t.includes("bf") || t.includes("morning")) {
    return { Icon: Sun, colorClass: styles["pill-breakfast"] };
  }
  if (t.includes("lunch") || t.includes("afternoon") || t.includes("noon")) {
    return { Icon: Utensils, colorClass: styles["pill-lunch"] };
  }
  if (t.includes("dinner") || t.includes("night") || t.includes("dn")) {
    return { Icon: Moon, colorClass: styles["pill-dinner"] };
  }
  if (t.includes("snack") || t.includes("tea")) {
    return { Icon: Coffee, colorClass: styles["pill-snack"] };
  }
  return { Icon: Salad, colorClass: styles["pill-default"] };
};

const sortVariations = <T extends { title: string }>(variations: T[]): T[] => {
  return [...variations].sort((a, b) => {
    const getOrder = (t: string) => {
      const low = t.toLowerCase();
      if (low.includes("breakfast") || low.includes("bf") || low.includes("morning")) return 1;
      if (low.includes("lunch") || low.includes("afternoon") || low.includes("noon")) return 2;
      if (low.includes("snack") || low.includes("tea")) return 3;
      if (low.includes("dinner") || low.includes("night") || low.includes("dn")) return 4;
      return 5;
    };
    return getOrder(a.title) - getOrder(b.title);
  });
};

const humanizeTag = (tag: string) =>
  tag
    .toLowerCase()
    .split("_")
    .map(capitalize)
    .join(" ");

export default function ViewMessDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mess, setMess] = useState<MessDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [planTab, setPlanTab] = useState<"monthly" | "daily">("monthly");
  const [viewPlan, setViewPlan] = useState<NewMessPlan | null>(null);
  const [activePlanImage, setActivePlanImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  // const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [closedPlanInquiry, setClosedPlanInquiry] = useState<NewMessPlan | null>(null);
  const [activeGalleryImage, setActiveGalleryImage] = useState(0);

  // Touch swipe tracking for gallery
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (slug) {
      fetchMessDetails();
    }
  }, [slug]);

  useEffect(() => {
    const isAnyModalOpen = showInquiryModal || viewPlan !== null || showGalleryModal || closedPlanInquiry !== null;
    if (isAnyModalOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [showInquiryModal, viewPlan, showGalleryModal, closedPlanInquiry]);

  // Ref to hold the current sortedImages length for keyboard handler
  const sortedImagesRef = useRef(0);

  // Keyboard navigation for gallery — must be above early returns
  useEffect(() => {
    if (!showGalleryModal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowGalleryModal(false);
      if (e.key === "ArrowLeft")
        setActiveGalleryImage((i) => (i - 1 + sortedImagesRef.current) % sortedImagesRef.current);
      if (e.key === "ArrowRight")
        setActiveGalleryImage((i) => (i + 1) % sortedImagesRef.current);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showGalleryModal]);

  const goToBooking = (planId: string) => {
    const bookingPath = `/mess/${slug}/book?planId=${planId}`;
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: bookingPath } });
      return;
    }
    navigate(bookingPath);
  };

  const openPlanModal = (plan: NewMessPlan) => {
    setViewPlan(plan);
    setActivePlanImage(0);
  };

  const closePlanModal = () => {
    if (viewPlan) {
      setClosedPlanInquiry(viewPlan);
    }
    setViewPlan(null);
  };

  const openGallery = (index: number) => {
    setActiveGalleryImage(index);
    setShowGalleryModal(true);
  };

  const closeGallery = () => setShowGalleryModal(false);

  const prevImage = (total: number) =>
    setActiveGalleryImage((i) => (i - 1 + total) % total);

  const nextImage = (total: number) =>
    setActiveGalleryImage((i) => (i + 1) % total);

  const fetchMessDetails = async () => {
    setLoading(true);
    try {
      const data: MessDetails = await getMessBySlug(slug!);
      setMess(data);
      const hasMonthly = data.plans?.some((p) => p.isMonthlyPlan);
      const hasDaily = data.plans?.some((p) => p.isDailyPlan);
      setPlanTab(hasMonthly ? "monthly" : hasDaily ? "daily" : "monthly");
    } catch (err) {
      console.error("Failed to fetch mess details", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-open plan modal when ?planId= is in the URL
  useEffect(() => {
    const planId = searchParams.get("planId");
    if (planId && mess && mess.plans) {
      const matchedPlan = mess.plans.find((p) => p.id === planId);
      if (matchedPlan) {
        openPlanModal(matchedPlan);
        // Remove planId from URL so refreshing doesn't re-open
        searchParams.delete("planId");
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [mess]);

  function MessImage({
    src,
    alt,
    className,
  }: {
    src?: string | null;
    alt: string;
    className?: string;
  }) {
    const [imgSrc, setImgSrc] = useState(src || "/food-placeholder.png");

    return (
      <img
        className={className}
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onError={() => setImgSrc("/food-placeholder.png")}
      />
    );
  }

  if (loading) {
    return (
      <div className={styles["mess-details-page"]}>
        <SEO title="Find Mess Food Near You | MessMeals" />
        <div className={styles["loading-state"]}>Loading mess details...</div>
      </div>
    );
  }

  if (!mess) {
    return (
      <div className={styles["mess-details-page"]}>
        <SEO title="Mess Not Found | MessMeals" noindex={true} />
        <div className={styles["error-state"]}>Mess not found</div>
      </div>
    );
  }

  // Gallery uses mess.gallery (new API field)
  const sortedImages =
    mess.gallery?.slice().sort((a, b) => a.sortOrder - b.sortOrder) || [];

  // Tags is now string[] in new API
  const tags = mess.tags || [];

  // foodTypes is now string[] in new API
  const isVeg =
    mess.foodTypes.includes("VEG") || mess.foodTypes.includes("MIXED");
  const isNonVeg =
    mess.foodTypes.includes("NON_VEG") || mess.foodTypes.includes("MIXED");

  const hasMonthly = mess.plans?.some((p) => p.isMonthlyPlan);
  const hasDaily = mess.plans?.some((p) => p.isDailyPlan);
  const showPlanTabs = hasMonthly && hasDaily;

  const visiblePlans = (mess.plans || []).filter((plan) => {
    if (!showPlanTabs) return true;
    return planTab === "monthly" ? plan.isMonthlyPlan : plan.isDailyPlan;
  });


  return (
    <main className={styles["mess-details-page"]}>
      <SEO
        title={`${mess.messName} – Menu & Meal Plans | MessMeals`}
        description={`Order homely food from ${mess.messName} in ${mess.address?.location || "your area"}. ${mess.description?.length > 100 ? mess.description.substring(0, 100) + '...' : (mess.description || 'Explore meal plans and pricing on MessMeals.')}`}
        image={mess.coverImage || undefined}
        url={`/mess/${mess.slug}`}
      />
      {/* Details Card */}
      <article className={styles["details-card"]}>
        {/* Hero Section */}
        <div className={styles["hero-card"]}>
          <div className={styles["hero-media"]}>
            <MessImage
              src={mess.coverImage}
              alt={mess.messName}
            />
            <div className={styles["hero-gradient-overlay"]} />
          </div>

          <div className={styles["hero-content"]}>
            <div className={styles["hero-header-row"]}>
              {mess.logo && (
                <div className={styles["hero-logo-container"]}>
                  <MessImage
                    src={mess.logo}
                    alt=""
                    className={styles["hero-logo"]}
                  />
                </div>
              )}

              <div className={styles["hero-header-info"]}>
                <div className={styles["hero-badges"]}>
                  {mess.status.isVerified && (
                    <span className={styles["verified-badge"]}>
                      <span className={styles["verified-badge-icon"]}>
                        <Check size={11} />
                      </span>
                      Verified Mess
                    </span>
                  )}
                </div>

                <h1>{mess.messName}</h1>

                {mess.address.location && (
                  <div className={styles["hero-location"]}>
                    <MapPin size={15} />
                    <span>{mess.address.location}</span>
                  </div>
                )}
              </div>
            </div>

            <p className={`${styles["hero-description"]} ${styles["hero-description-desktop"]}`}>
              {mess.description}
            </p>
          </div>

          <div className={styles["mobile-description-container"]}>
            {mess.description && (
              <p className={`${styles["hero-description"]} ${styles["hero-description-mobile"]}`}>
                {showFullDescription || mess.description.length <= DESCRIPTION_PREVIEW_LENGTH
                  ? mess.description
                  : `${mess.description
                    .slice(0, DESCRIPTION_PREVIEW_LENGTH)
                    .trimEnd()}… `}
                {mess.description.length > DESCRIPTION_PREVIEW_LENGTH && (
                  <button
                    type="button"
                    className={styles["description-toggle-inline"]}
                    onClick={() => setShowFullDescription((prev) => !prev)}
                  >
                    {showFullDescription ? " View Less" : "View More"}
                  </button>
                )}
              </p>
            )}
          </div>


        </div>



        {/* Meal Plans Section */}
        <section className={styles["content-block"]}>
          <div className={styles["plans-section-header"]}>
            <h2 className={`${styles["section-title"]} ${styles["no-margin"]}`}>
              <CalendarDays size={20} /> Our Meal Plans
            </h2>
            {showPlanTabs && (
              <div className={styles["plan-tabs"]}>
                <button
                  className={planTab === "monthly" ? styles.active : ""}
                  onClick={() => setPlanTab("monthly")}
                >
                  Monthly Plans
                </button>
                <button
                  className={planTab === "daily" ? styles.active : ""}
                  onClick={() => setPlanTab("daily")}
                >
                  Daily Plans
                </button>
              </div>
            )}
          </div>
          <p className={styles["plans-section-subtitle"]}>
            Choose the perfect plan that suits your needs
          </p>

          {visiblePlans.length > 0 ? (
            <div className={styles["plans-card-row"]}>
              {visiblePlans.map((plan) => (
                <article key={plan.id} className={styles["plan-card"]}>
                  {/* Top badge */}
                  <span className={styles["plan-card-type-badge"]}>
                    {plan.isMonthlyPlan ? "Monthly" : "Daily"}
                  </span>

                  {/* Plan name */}
                  <h3 className={styles["plan-card-name"]}>{plan.planName}</h3>

                  {/* Plan Includes — variation pills */}
                  {plan.variations && plan.variations.length > 0 && (
                    <div className={styles["plan-includes"]}>
                      <span className={styles["plan-includes-label"]}>Plan Includes:</span>
                      <div className={styles["plan-includes-pills"]}>
                        {sortVariations(plan.variations).map((v) => {
                          const { Icon: VIcon, colorClass } = getVariationConfig(v.title);
                          return (
                            <span key={v.id} className={`${styles["plan-includes-pill"]} ${colorClass}`}>
                              <VIcon size={12} />
                              {v.title}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {/* <p className={styles["plan-card-desc"]}>{plan.description}</p> */}

                  {/* Price */}
                  <div className={styles["plan-card-price"]}>
                    <span className={styles["plan-card-currency"]}>₹</span>
                    <span className={styles["plan-card-amount"]}>{plan.price}</span>
                    <span className={styles["plan-card-period"]}>
                      /{plan.isMonthlyPlan ? "month" : "day"}
                    </span>
                  </div>
                  {/* {plan.minPrice && (
                    <p className={styles["plan-card-min-price"]}>Min. ₹{plan.minPrice}</p>
                  )} */}

                  {/* Actions */}
                  <div className={styles["plan-card-actions"]}>
                    <button
                      className={`${styles["plan-card-btn"]} ${styles.primary}`}
                      onClick={() => openPlanModal(plan)}
                    >
                      View Menu
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles["empty-plans-wrapper"]}>
              <div className={styles["empty-plans-illustration"]}>
                <div className={styles["empty-icon-circle"]}>
                  <div className={styles["clipboard-icon"]}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <path d="M9 14h6" />
                      <path d="M9 10h6" />
                    </svg>
                    <div className={styles["minus-badge"]}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#22c55e" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" />
                        <rect x="6" y="11" width="12" height="2" rx="1" fill="white" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className={styles["empty-plans-title"]}>No meal plans available yet</h3>
              <p className={styles["empty-plans-desc"]}>
                This mess hasn't added any meal plans at the moment.
                Feel free to get in touch for more details or custom plans.
              </p>

              <div className={styles["empty-contact-banner"]}>
                <div className={styles["empty-contact-grid"]}>
                  <div className={styles["empty-contact-item"]}>
                    <div className={styles["eci-icon"]}><MapPin size={16} /></div>
                    <div className={styles["eci-content"]}>
                      <small>LOCATION</small>
                      <p>
                        {[
                          mess.address.address || mess.address.location,
                          mess.address.zipcode
                        ].filter(Boolean).join(" - ") || "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className={styles["empty-contact-actions"]}>
                    <a href={`tel:${mess.phone}`} className={styles["empty-action-circle"]} aria-label="Call us">
                      <Phone size={18} />
                    </a>
                    <a href={`https://wa.me/919544222468`} target="_blank" rel="noreferrer" className={styles["empty-action-circle"]} aria-label="WhatsApp us">
                      <WhatsappIcon size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Food Types Section */}
        {(isVeg || isNonVeg) && (
          <section className={styles["content-block"]}>
            <h2 className={styles["section-title"]}>
              <Salad size={20} /> Food Types
            </h2>
            <div className={styles["food-types-list"]}>
              {isVeg && (
                <span className={`${styles["food-type-pill"]} ${styles.veg}`}>
                  <Leaf size={16} />
                  Vegetarian
                </span>
              )}
              {isNonVeg && (
                <span className={`${styles["food-type-pill"]} ${styles["non-veg"]}`}>
                  <Drumstick size={16} />
                  Non-Vegetarian
                </span>
              )}
            </div>
          </section>
        )}

        {/* Tags Section */}
        {tags.length > 0 && (
          <section className={styles["content-block"]}>
            <h2 className={styles["section-title"]}>
              <Tag size={20} /> Tags
            </h2>
            <div className={styles["tags-list"]}>
              {tags.map((tag, i) => (
                <span key={i} className={styles["tag-pill"]}>
                  {humanizeTag(tag)}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Photo Gallery Section */}
        <section className={styles["content-block"]}>
          {sortedImages.length > 0 ? (
            (() => {
              // Update the ref so keyboard handler always has fresh count
              sortedImagesRef.current = sortedImages.length;

              const MAX_PREVIEW = 5;
              const previewImages = sortedImages.slice(0, MAX_PREVIEW);
              const remainingCount = Math.max(sortedImages.length - MAX_PREVIEW, 0);

              return (
                <>
                  {/* Gallery header */}
                  <div className={styles["gallery-header"]}>
                    <h2 className={`${styles["section-title"]} ${styles["no-margin"]}`}>
                      <Images size={20} />
                      Gallery
                      <span className={styles["gallery-photo-count"]}>· {sortedImages.length} Photo{sortedImages.length !== 1 ? "s" : ""}</span>
                    </h2>
                    {sortedImages.length > 1 && (
                      <button
                        className={styles["gallery-header-action"]}
                        onClick={() => openGallery(0)}
                        aria-label="View all photos"
                      >
                        <Images size={15} />
                        View all photos
                      </button>
                    )}
                  </div>

                  {/* Desktop preview grid */}
                  <div className={styles["gallery-preview"]}>
                    {/* Main (first) image */}
                    <button
                      className={styles["gallery-main"]}
                      onClick={() => openGallery(0)}
                      aria-label={`Open gallery: ${previewImages[0]?.altText || "Photo"}`}
                    >
                      <MessImage
                        src={previewImages[0]?.url}
                        alt={previewImages[0]?.altText || ""}
                      />
                    </button>

                    {/* Side images (up to 4) */}
                    {previewImages.length > 1 && (
                      <div className={styles["gallery-side"]}>
                        {previewImages.slice(1).map((image, idx) => {
                          const globalIndex = idx + 1;
                          const isLast = globalIndex === previewImages.length - 1 && remainingCount > 0;
                          return (
                            <button
                              key={image.id}
                              className={`${styles["gallery-preview-item"]} ${isLast ? styles["gallery-view-all"] : ""}`}
                              onClick={() => openGallery(isLast ? 0 : globalIndex)}
                              aria-label={
                                isLast
                                  ? `View all ${sortedImages.length} photos`
                                  : `Open gallery: ${image.altText || "Photo"}`
                              }
                            >
                              <MessImage
                                src={image.url}
                                alt={image.altText || ""}
                              />
                              {isLast && (
                                <span className={styles["gallery-view-all-overlay"]} aria-hidden="true">
                                  <span className={styles["gallery-view-all-count"]}>+{remainingCount}</span>
                                  <span className={styles["gallery-view-all-label"]}>View all photos</span>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Mobile single-image preview */}
                  <div className={styles["gallery-preview-mobile"]}>
                    <button
                      className={styles["gallery-mobile-main"]}
                      onClick={() => openGallery(0)}
                      aria-label={`View all ${sortedImages.length} photos`}
                    >
                      <MessImage
                        src={previewImages[0]?.url}
                        alt={previewImages[0]?.altText || ""}
                      />
                      {sortedImages.length > 1 && (
                        <span className={styles["gallery-mobile-overlay"]} aria-hidden="true">
                          <span className={styles["gallery-mobile-count"]}>+{sortedImages.length - 1}</span>
                          <span className={styles["gallery-mobile-label"]}>Photos</span>
                        </span>
                      )}
                    </button>
                  </div>
                </>
              );
            })()
          ) : (
            <>
              <div className={styles["gallery-header"]}>
                <h2 className={`${styles["section-title"]} ${styles["no-margin"]}`}>
                  <Images size={20} />
                  Gallery
                </h2>
              </div>
              <div className={styles["no-gallery"]}>
                <p>No photos available</p>
              </div>
            </>
          )}
        </section>

        {/* Contact & Location Section */}
        <section className={styles["content-block"]}>
          <h2 className={styles["section-title"]}>
            <MapPin size={20} /> Contact & Location
          </h2>
          <div className={styles["contact-section"]}>
            <div className={styles["contact-info-grid"]}>
              <div className={styles["contact-info-item"]}>
                <span className={styles["contact-info-icon"]}>
                  <MapPin size={18} />
                </span>
                <div className={styles["contact-info-text"]}>
                  <small>LOCATION</small>
                  <p>
                    {[
                      mess.address.address || mess.address.location,
                      mess.address.zipcode
                    ].filter(Boolean).join(" - ") || "Not available"}
                  </p>
                </div>
              </div>

              <div className={styles["contact-divider"]} />

              <div className={styles["contact-info-item"]}>
                <span className={styles["contact-info-icon"]}>
                  <Mail size={18} />
                </span>
                <div className={styles["contact-info-text"]}>
                  <small>EMAIL</small>
                  <p>{mess.email || "Not available"}</p>
                </div>
              </div>

              <div className={styles["contact-divider"]} />

              <div className={styles["contact-info-item"]}>
                <span className={styles["contact-info-icon"]}>
                  <MessageCircle size={18} />
                </span>
                <div className={styles["contact-info-text"]}>
                  <h3>Have Questions?</h3>
                  <p>Send us an inquiry </p>
                </div>
                <button
                  className={styles["contact-inquiry-btn"]}
                  onClick={() => setShowInquiryModal(true)}
                >
                  Send an Inquiry
                </button>
              </div>
            </div>
          </div>
        </section>
      </article>


      {/* Send an Inquiry Modal */}
      {showInquiryModal && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setShowInquiryModal(false)}
        >
          <div className={styles["modal-card"]} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles["modal-close-btn"]}
              onClick={() => setShowInquiryModal(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h3>Send an Inquiry</h3>
            <p className={styles["inquiry-subtitle"]}>
              Have questions? We're here to help!
            </p>

            <form
              className={styles["inquiry-form"]}
              onSubmit={(e) => {
                e.preventDefault();
                setShowInquiryModal(false);
              }}
            >
              <div className={styles["form-group"]}>
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className={styles["form-input"]}
                />
              </div>

              <div className={styles["form-group"]}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className={styles["form-input"]}
                />
              </div>

              <div className={styles["form-group"]}>
                <label>Your Message</label>
                <textarea
                  placeholder="Type your message here..."
                  className={styles["form-textarea"]}
                  rows={4}
                />
              </div>

              <button type="submit" className={styles["send-message-btn"]}>
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Plan Details Modal — with weekly menu */}
      {viewPlan &&
        (() => {
          const modalImages =
            viewPlan.images
              ?.slice()
              .sort((a, b) => a.sortOrder - b.sortOrder) || [];

          // Build a map of variationId → title for easy lookup
          const variationMap: Record<string, string> = {};
          viewPlan.variations.forEach((v) => {
            variationMap[v.id] = v.title;
          });



          return (
            <div className={styles["modal-overlay"]} onClick={closePlanModal}>
              <div
                className={`${styles["modal-card"]} ${styles["plan-modal-card"]}`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles["modal-close-btn"]}
                  onClick={closePlanModal}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>

                {/* Plan images */}
                {modalImages.length > 0 && (
                  <div className={styles["plan-modal-gallery"]}>
                    <div className={styles["plan-modal-main-image"]}>
                      <MessImage
                        src={modalImages[activePlanImage]?.url}
                        alt={viewPlan.planName}
                      />
                    </div>

                    {modalImages.length > 1 && (
                      <div className={styles["plan-modal-thumbs"]}>
                        {modalImages.map((img, index) => (
                          <button
                            key={img.id}
                            type="button"
                            className={`${styles["plan-modal-thumb"]} ${index === activePlanImage ? styles.active : ""
                              }`}
                            onClick={() => setActivePlanImage(index)}
                            aria-label={`Show image ${index + 1}`}
                          >
                            <MessImage
                              src={img.url}
                              alt=""
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className={styles["plan-modal-body"]}>
                  {/* Header — badge first, then name */}
                  <div className={styles["plan-modal-header"]}>
                    <span className={styles["plan-modal-type-badge"]}>
                      {viewPlan.isMonthlyPlan ? "Monthly Plan" : "Daily Plan"}
                    </span>
                    <h3>{viewPlan.planName}</h3>
                  </div>

                  {/* Plan Includes — variation pills */}
                  {viewPlan.variations && viewPlan.variations.length > 0 && (
                    <div className={styles["plan-includes"]}>
                      <span className={styles["plan-includes-label"]}>Plan Includes</span>
                      <div className={styles["plan-includes-pills"]}>
                        {sortVariations(viewPlan.variations).map((v) => {
                          const { Icon: VIcon, colorClass } = getVariationConfig(v.title);
                          return (
                            <span key={v.id} className={`${styles["plan-includes-pill"]} ${colorClass}`}>
                              <VIcon size={12} />
                              {v.title}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className={styles["plan-price"]}>
                    <span className={styles.currency}>₹</span>
                    <span className={styles.amount}>{viewPlan.price}</span>
                    <span className={styles.period}>
                      /{viewPlan.isMonthlyPlan ? "month" : "day"}
                    </span>
                  </div>

                  {/* Weekly Menu */}
                  {viewPlan.menus && viewPlan.menus.length > 0 && (
                    <div className={styles["plan-menu-section"]}>
                      <div className={styles["plan-menu-header"]}>
                        <CalendarDays size={16} />
                        <span>Weekly Menu</span>
                      </div>

                      <div className={styles["plan-menu-table-wrapper"]}>
                        <table className={styles["plan-menu-table"]}>
                          <thead>
                            <tr>
                              <th>Day</th>
                              {sortVariations(viewPlan.variations).map((variation) => {
                                const { Icon: VIcon, colorClass } = getVariationConfig(variation.title);
                                return (
                                  <th key={variation.id} className={colorClass}>
                                    <div>
                                      <VIcon size={14} />
                                      <span>{variation.title}</span>
                                    </div>
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {DAY_ORDER_UPPER.map((day) => {
                              const entriesForDay = viewPlan.menus.flatMap((menu) =>
                                (menu.schedule[day] || []).map((entry) => ({
                                  ...entry,
                                  menuName: menu.name,
                                }))
                              );

                              const hasAnyEntry = entriesForDay.length > 0;

                              return (
                                <tr key={day}>
                                  <td className={styles["day-cell"]}>
                                    <div className={styles["day-cell-content"]}>
                                      {DAY_SHORT[day]}
                                    </div>
                                  </td>
                                  {hasAnyEntry ? (
                                    sortVariations(viewPlan.variations).map((variation) => {
                                      const entriesForVariation = entriesForDay.filter(
                                        (e) => e.variationId === variation.id
                                      );
                                      const { colorClass } = getVariationConfig(variation.title);
                                      return (
                                        <td key={variation.id}>
                                          {entriesForVariation.length > 0 ? (
                                            <div className={`${styles["plan-menu-table-cell"]} ${colorClass}`}>
                                              <div className={styles["plan-menu-table-items"]}>
                                                {entriesForVariation.map((e, i) => (
                                                  <span key={i}>{e.items}</span>
                                                ))}
                                              </div>
                                            </div>
                                          ) : (
                                            <span className={styles["plan-menu-table-empty"]}>-</span>
                                          )}
                                        </td>
                                      );
                                    })
                                  ) : (
                                    <td colSpan={viewPlan.variations.length + 1} className={styles["holiday-cell"]}>
                                      <div className={styles["plan-menu-holiday"]}>
                                        <span>🏖️</span>
                                        <p>Holiday / No meals on {DAY_SHORT[day]}</p>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className={styles["plan-modal-footer"]}>
                    <button
                      className={`${styles["plan-action-btn"]} ${styles["full-width"]}`}
                      onClick={() => {
                        const planId = viewPlan.id;
                        setViewPlan(null);
                        goToBooking(planId);
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Full-screen Gallery Modal */}
      {showGalleryModal && (
        <div
          className={styles["gallery-modal"]}
          onClick={closeGallery}
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
        >
          <div
            className={styles["gallery-modal-content"]}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const diff = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 40) {
                if (diff > 0) nextImage(sortedImages.length);
                else prevImage(sortedImages.length);
              }
              touchStartX.current = null;
            }}
          >
            {/* Header */}
            <div className={styles["gallery-modal-header"]}>
              <span className={styles["gallery-modal-counter"]}>
                <Images size={16} />
                {activeGalleryImage + 1} / {sortedImages.length}
              </span>
              <button
                className={styles["gallery-modal-close"]}
                onClick={closeGallery}
                aria-label="Close gallery"
              >
                <X size={22} />
              </button>
            </div>

            {/* Main image */}
            <div className={styles["gallery-modal-main"]}>
              <button
                className={`${styles["gallery-modal-nav"]} ${styles["gallery-modal-prev"]}`}
                onClick={() => prevImage(sortedImages.length)}
                aria-label="Previous photo"
              >
                <ChevronLeft size={28} />
              </button>

              <div className={styles["gallery-modal-image"]}>
                <MessImage
                  src={sortedImages[activeGalleryImage]?.url}
                  alt={sortedImages[activeGalleryImage]?.altText || ""}
                />
              </div>

              <button
                className={`${styles["gallery-modal-nav"]} ${styles["gallery-modal-next"]}`}
                onClick={() => nextImage(sortedImages.length)}
                aria-label="Next photo"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className={styles["gallery-modal-thumbs"]}>
              {sortedImages.map((image, index) => (
                <button
                  key={image.id}
                  className={`${styles["gallery-modal-thumb"]} ${index === activeGalleryImage ? styles.active : ""}`}
                  onClick={() => setActiveGalleryImage(index)}
                  aria-label={`View photo ${index + 1}`}
                >
                  <MessImage
                    src={image.url}
                    alt={image.altText || ""}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Post-Plan Inquiry Popup */}
      {closedPlanInquiry && mess?.phone && (
        <div className={styles["post-inquiry-overlay"]} onClick={() => setClosedPlanInquiry(null)}>
          <div className={styles["post-inquiry-modal"]} onClick={(e) => e.stopPropagation()}>
            <button className={styles["post-inquiry-close"]} onClick={() => setClosedPlanInquiry(null)}>
              <X size={20} />
            </button>
            <div className={styles["post-inquiry-icon-wrap"]}>
              <WhatsappIcon size={32} color="#25d366" />
            </div>
            <h3 className={styles["post-inquiry-title"]}>Still have questions?</h3>
            <p className={styles["post-inquiry-desc"]}>
              Need more details about the <strong>{closedPlanInquiry.planName}</strong> plan? We're here to help!
            </p>
            <div className={styles["post-inquiry-actions"]}>
              <a
                href={`https://wa.me/919544222468?text=${encodeURIComponent(`Hello! I saw your "${closedPlanInquiry.planName}" plan on Messmeals for ${mess?.messName}. Could you please share more information about it? Thank you!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles["post-inquiry-wa-btn"]}
                onClick={() => setClosedPlanInquiry(null)}
              >
                Chat on WhatsApp
              </a>
              <button
                className={styles["post-inquiry-cancel-btn"]}
                onClick={() => setClosedPlanInquiry(null)}
              >
                No, thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Contact Trigger */}
      <FloatingContact phone={mess?.phone} />
    </main>
  );
}
