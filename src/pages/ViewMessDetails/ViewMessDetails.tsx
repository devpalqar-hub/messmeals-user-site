import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMessBySlug } from "../../services/messApi";
import type { MessDetails, NewMessPlan } from "../../types/mess";
import {
  MapPin,
  // Star, // commented out — new API does not return ratings
  Phone,
  Mail,
  Clock,
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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import styles from "./ViewMessDetails.module.css";

const DESCRIPTION_PREVIEW_LENGTH = 110;

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

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

const humanizeTag = (tag: string) =>
  tag
    .toLowerCase()
    .split("_")
    .map(capitalize)
    .join(" ");

const formatTime12h = (time: string) => {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = mStr || "00";
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${m} ${period}`;
};

const groupOpeningHours = (openingHours: Record<string, string>) => {
  const groups: { days: string[]; time: string }[] = [];
  DAY_ORDER.forEach((day) => {
    const time = openingHours[day];
    if (!time) return;
    const last = groups[groups.length - 1];
    if (last && last.time === time) {
      last.days.push(day);
    } else {
      groups.push({ days: [day], time });
    }
  });

  return groups.map((group) => {
    const label =
      group.days.length > 1
        ? `${capitalize(group.days[0]).slice(0, 3)} - ${capitalize(
          group.days[group.days.length - 1]
        ).slice(0, 3)}`
        : capitalize(group.days[0]);
    const [start, end] = group.time.split("-");
    return {
      label,
      time: `${formatTime12h(start)} - ${formatTime12h(end)}`,
    };
  });
};

const isMessOpenNow = (openingHours?: Record<string, string>) => {
  if (!openingHours) return false;
  const now = new Date();
  const day = now
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const range = openingHours[day];
  if (!range) return false;
  const [start, end] = range.split("-");
  const current = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
  return current >= start && current <= end;
};

export default function ViewMessDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mess, setMess] = useState<MessDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [planTab, setPlanTab] = useState<"monthly" | "daily">("monthly");
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [viewPlan, setViewPlan] = useState<NewMessPlan | null>(null);
  const [activePlanImage, setActivePlanImage] = useState(0);
  const [activeMenuDay, setActiveMenuDay] = useState<string>("MONDAY");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activeGalleryImage, setActiveGalleryImage] = useState(0);

  // Touch swipe tracking for gallery
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (slug) {
      fetchMessDetails();
    }
  }, [slug]);

  useEffect(() => {
    const isAnyModalOpen = showInquiryModal || viewPlan !== null || showGalleryModal;
    if (isAnyModalOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [showInquiryModal, viewPlan, showGalleryModal]);

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
    // Set active day to first day that has schedule entries
    const firstDayWithEntries = DAY_ORDER_UPPER.find((day) =>
      plan.menus.some((menu) => (menu.schedule[day]?.length ?? 0) > 0)
    );
    setActiveMenuDay(firstDayWithEntries || "MONDAY");
  };

  const closePlanModal = () => setViewPlan(null);

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
        <div className={styles["loading-state"]}>Loading mess details...</div>
      </div>
    );
  }

  if (!mess) {
    return (
      <div className={styles["mess-details-page"]}>
        <div className={styles["error-state"]}>Mess not found</div>
      </div>
    );
  }

  // Gallery uses mess.gallery (new API field)
  const sortedImages =
    mess.gallery?.slice().sort((a, b) => a.sortOrder - b.sortOrder) || [];

  const openingHoursList = mess.openingHours
    ? groupOpeningHours(mess.openingHours)
    : [];

  const openNow = isMessOpenNow(mess.openingHours);

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
    <div className={styles["mess-details-page"]}>
      {/* Details Card */}
      <div className={styles["details-card"]}>
        {/* Hero Section */}
        <div className={styles["hero-card"]}>
          <div className={styles["hero-media"]}>
            <MessImage
              src={mess.coverImage}
              alt={`${mess.messName} - ${mess.address.location || "Kerala"} Style Homely Food`}
            />
            <div className={styles["hero-gradient-overlay"]} />
            {openNow && <div className={styles["open-now-badge"]}>Open Now</div>}
          </div>

          <div className={styles["hero-content"]}>
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

            <p className={`${styles["hero-description"]} ${styles["hero-description-desktop"]}`}>
              {mess.description}
            </p>

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

          <div className={styles["hero-info-strip"]}>
            <div className={styles["hero-info-item"]}>
              <span className={styles["hero-info-icon"]}>
                <MapPin size={18} />
              </span>
              <div>
                <small>Location</small>
                <p>{mess.address.address || mess.address.location || "Not available"}</p>
              </div>
            </div>
            <div className={styles["hero-info-item"]}>
              <span className={styles["hero-info-icon"]}>
                <Phone size={18} />
              </span>
              <div>
                <small>Phone</small>
                <p>{mess.phone || "Not available"}</p>
              </div>
            </div>
            <div className={styles["hero-info-item"]}>
              <span className={styles["hero-info-icon"]}>
                <Mail size={18} />
              </span>
              <div>
                <small>Email</small>
                <p>{mess.email || "Not available"}</p>
              </div>
            </div>
            <div className={styles["hero-info-item"]}>
              <span className={styles["hero-info-icon"]}>
                <Clock size={18} />
              </span>
              <div>
                <small>Opening Hours</small>
                {openingHoursList.length > 0 ? (
                  openingHoursList.map((item) => (
                    <p key={item.label}>
                      {item.label} : {item.time}
                    </p>
                  ))
                ) : (
                  <p>Not available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Banner */}
        <div className={styles["inquiry-banner"]}>
          <div className={styles["inquiry-banner-icon"]}>
            <MessageCircle size={22} />
          </div>
          <div className={styles["inquiry-banner-text"]}>
            <h3>Have Questions?</h3>
            <p>We're here to help! Send us an inquiry and we'll get back to you soon.</p>
          </div>
          <button
            className={styles["inquiry-banner-btn"]}
            onClick={() => setShowInquiryModal(true)}
          >
            Send an Inquiry
          </button>
        </div>

        {/* Meal Plans Section */}
        <section className={styles["content-block"]}>
          <div className={styles["plans-section-header"]}>
            <h2>Our Meal Plans</h2>
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
                <div key={plan.id} className={styles["plan-card"]}>
                  {/* Top badge */}
                  <span className={styles["plan-card-type-badge"]}>
                    {plan.isMonthlyPlan ? "Monthly" : "Daily"}
                  </span>

                  {/* Plan name */}
                  <h3 className={styles["plan-card-name"]}>{plan.planName}</h3>

                  {/* Plan Includes — variation pills */}
                  {plan.variations && plan.variations.length > 0 && (
                    <div className={styles["plan-includes"]}>
                      <span className={styles["plan-includes-label"]}>Plan Includes</span>
                      <div className={styles["plan-includes-pills"]}>
                        {plan.variations.map((v) => {
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

                  {/* Duration chip */}
                  <div className={styles["plan-duration-chip"]}>
                    <Clock size={12} />
                    {plan.isMonthlyPlan ? "30 Days" : "Per Meal"}
                  </div>

                  {/* Description */}
                  <p className={styles["plan-card-desc"]}>{plan.description}</p>

                  {/* Price */}
                  <div className={styles["plan-card-price"]}>
                    <span className={styles["plan-card-currency"]}>₹</span>
                    <span className={styles["plan-card-amount"]}>{plan.price}</span>
                    <span className={styles["plan-card-period"]}>
                      /{plan.isMonthlyPlan ? "month" : "day"}
                    </span>
                  </div>
                  {plan.minPrice && (
                    <p className={styles["plan-card-min-price"]}>Min. ₹{plan.minPrice}</p>
                  )}

                  {/* Actions */}
                  <div className={styles["plan-card-actions"]}>
                    <button
                      className={`${styles["plan-card-btn"]} ${styles.secondary}`}
                      onClick={() => openPlanModal(plan)}
                    >
                      Details
                    </button>
                    <button
                      className={`${styles["plan-card-btn"]} ${styles.primary}`}
                      onClick={() => goToBooking(plan.id)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles["no-plans"]}>
              <p>No meal plans available at the moment.</p>
            </div>
          )}
        </section>

        {/* Food Types Section */}
        {(isVeg || isNonVeg) && (
          <section className={styles["content-block"]}>
            <h2>Food Types</h2>
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
            <h2>Tags</h2>
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
                    <h2>
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
                      aria-label={`Open gallery at photo 1: ${previewImages[0]?.altText || mess.messName}`}
                    >
                      <MessImage
                        src={previewImages[0]?.url}
                        alt={previewImages[0]?.altText || `${mess.messName} photo 1`}
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
                                  : `Open gallery at photo ${globalIndex + 1}: ${image.altText || mess.messName}`
                              }
                            >
                              <MessImage
                                src={image.url}
                                alt={image.altText || `${mess.messName} photo ${globalIndex + 1}`}
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
                        alt={previewImages[0]?.altText || `${mess.messName} photo 1`}
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
                <h2>
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
      </div>

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

          // Get the active day's entries for all menus
          const activeDayEntries = viewPlan.menus.flatMap((menu) =>
            (menu.schedule[activeMenuDay] || []).map((entry) => ({
              ...entry,
              menuName: menu.name,
            }))
          );

          // Check which days have any entries (across all menus)
          const daysWithEntries = new Set(
            DAY_ORDER_UPPER.filter((day) =>
              viewPlan.menus.some((menu) => (menu.schedule[day]?.length ?? 0) > 0)
            )
          );

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
                              alt={`${viewPlan.planName} ${index + 1}`}
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

                  {viewPlan.description && (
                    <p className={styles["plan-modal-description"]}>
                      {viewPlan.description}
                    </p>
                  )}

                  {/* Plan Includes — variation pills */}
                  {viewPlan.variations && viewPlan.variations.length > 0 && (
                    <div className={styles["plan-includes"]}>
                      <span className={styles["plan-includes-label"]}>Plan Includes</span>
                      <div className={styles["plan-includes-pills"]}>
                        {viewPlan.variations.map((v) => {
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
                  {viewPlan.minPrice && (
                    <p className={styles["plan-min-price"]}>
                      Min. Price: ₹{viewPlan.minPrice}
                    </p>
                  )}

                  {/* Weekly Menu */}
                  {viewPlan.menus && viewPlan.menus.length > 0 && (
                    <div className={styles["plan-menu-section"]}>
                      <div className={styles["plan-menu-header"]}>
                        <CalendarDays size={16} />
                        <span>Weekly Menu</span>
                      </div>

                      {/* Day tabs */}
                      <div className={styles["plan-menu-day-tabs"]}>
                        {DAY_ORDER_UPPER.map((day) => (
                          <button
                            key={day}
                            type="button"
                            className={`${styles["plan-menu-day-tab"]} ${activeMenuDay === day ? styles.active : ""} ${!daysWithEntries.has(day) ? styles.empty : ""}`}
                            onClick={() => setActiveMenuDay(day)}
                          >
                            {DAY_SHORT[day]}
                          </button>
                        ))}
                      </div>

                      {/* Day content */}
                      <div className={styles["plan-menu-day-content"]}>
                        {activeDayEntries.length > 0 ? (
                          <div className={styles["plan-menu-entries"]}>
                            {/* Group by variation */}
                            {viewPlan.variations.map((variation) => {
                              const entriesForVariation = activeDayEntries.filter(
                                (e) => e.variationId === variation.id
                              );
                              if (entriesForVariation.length === 0) return null;
                              return (
                                <div key={variation.id} className={styles["plan-menu-variation-group"]}>
                                  <div className={styles["plan-menu-variation-title"]}>
                                    <Salad size={13} />
                                    {variation.title}
                                  </div>
                                  <div className={styles["plan-menu-items"]}>
                                    {entriesForVariation.map((e, i) => (
                                      <span key={i} className={styles["plan-menu-item"]}>
                                        {e.items}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className={styles["plan-menu-holiday"]}>
                            <span>🏖️</span>
                            <p>Holiday / No meals on {DAY_SHORT[activeMenuDay]}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* WhatsApp enquiry banner */}
                  {mess.phone && (
                    <div className={styles["whatsapp-banner"]}>
                      <div className={styles["whatsapp-banner-info"]}>
                        <span className={styles["whatsapp-icon-wrap"]}>
                          {/* WhatsApp SVG */}
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </span>
                        <div>
                          <p className={styles["whatsapp-banner-title"]}>Have questions about this plan?</p>
                          <p className={styles["whatsapp-banner-sub"]}>Chat with us on WhatsApp.</p>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/${mess.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi! I'm interested in the "${viewPlan.planName}" plan. Could you please provide more details?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles["whatsapp-enquire-btn"]}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Enquire on WhatsApp
                      </a>
                    </div>
                  )}

                  <button
                    className={`${styles["plan-action-btn"]} ${styles["full-width"]}`}
                    onClick={() => {
                      const planId = viewPlan.id;
                      closePlanModal();
                      goToBooking(planId);
                    }}
                  >
                    Book Now
                  </button>
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
                  alt={sortedImages[activeGalleryImage]?.altText || `${mess.messName} photo ${activeGalleryImage + 1}`}
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
                  aria-label={`View photo ${index + 1}${image.altText ? `: ${image.altText}` : ""}`}
                >
                  <MessImage
                    src={image.url}
                    alt={image.altText || `${mess.messName} photo ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
