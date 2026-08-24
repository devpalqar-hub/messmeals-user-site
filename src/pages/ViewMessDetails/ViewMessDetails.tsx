import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMessById } from "../../services/messApi";
import type { MessDetails, MessPlan } from "../../types/mess";
import {
  MapPin,
  Star,
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

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
  const { messId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mess, setMess] = useState<MessDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [planTab, setPlanTab] = useState<"monthly" | "daily">("monthly");
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [viewPlan, setViewPlan] = useState<MessPlan | null>(null);
  const [activePlanImage, setActivePlanImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activeGalleryImage, setActiveGalleryImage] = useState(0);

  // Touch swipe tracking for gallery
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (messId) {
      fetchMessDetails();
    }
  }, [messId]);

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
    const bookingPath = `/mess/${messId}/book?planId=${planId}`;
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: bookingPath } });
      return;
    }
    navigate(bookingPath);
  };

  const openPlanModal = (plan: MessPlan) => {
    setViewPlan(plan);
    setActivePlanImage(0);
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
      const data: MessDetails = await getMessById(messId!);
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
    src?: string;
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

  const sortedImages =
    mess.images?.slice().sort((a, b) => a.sortOrder - b.sortOrder) || [];

  const openingHoursList = mess.openingHours
    ? groupOpeningHours(mess.openingHours)
    : [];

  const openNow = isMessOpenNow(mess.openingHours);

  const tags = mess.tags || [];

  const foodTypeValues = (mess.foodTypes || []).map((f) => f.foodType);
  const isVeg =
    foodTypeValues.includes("VEG") || foodTypeValues.includes("MIXED");
  const isNonVeg =
    foodTypeValues.includes("NON_VEG") || foodTypeValues.includes("MIXED");

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
              src={sortedImages[0]?.url}
              alt={`${mess.name} - ${mess.location || "Kerala"} Style Homely Food`}
            />
            <div className={styles["hero-gradient-overlay"]} />
            {openNow && <div className={styles["open-now-badge"]}>Open Now</div>}
          </div>

          <div className={styles["hero-content"]}>
            <div className={styles["hero-badges"]}>
              {mess.is_verified && (
                <span className={styles["verified-badge"]}>
                  <span className={styles["verified-badge-icon"]}>
                    <Check size={11} />
                  </span>
                  Verified Mess
                </span>
              )}
            </div>

            <h1>{mess.name}</h1>

            {mess.location && (
              <div className={styles["hero-location"]}>
                <MapPin size={15} />
                <span>{mess.location}</span>
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
                <p>{mess.address || mess.location || "Not available"}</p>
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

                  {/* Meta: meal type + duration */}
                  <div className={styles["plan-card-meta"]}>
                    {plan.Variation && plan.Variation.length > 0 && (
                      <span className={styles["plan-card-meta-item"]}>
                        <Salad size={13} />
                        {plan.Variation.map((v) => v.title).join(", ")}
                      </span>
                    )}
                    <span className={styles["plan-card-meta-item"]}>
                      <Clock size={13} />
                      {plan.isMonthlyPlan ? "30 Days" : "Per Meal"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className={styles["plan-card-desc"]}>{plan.description}</p>

                  {/* Price */}
                  <div className={styles["plan-card-price"]}>
                    <span className={styles["plan-card-currency"]}>₹</span>
                    <span className={styles["plan-card-amount"]}>{plan.price}</span>
                    <span className={styles["plan-card-period"]}>
                      /{plan.isMonthlyPlan ? "mo" : "meal"}
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
              {tags.map((tag) => (
                <span key={tag.id} className={styles["tag-pill"]}>
                  {humanizeTag(tag.tag)}
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
                      <Star size={20} />
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
                      aria-label={`Open gallery at photo 1: ${previewImages[0]?.altText || mess.name}`}
                    >
                      <MessImage
                        src={previewImages[0]?.url}
                        alt={previewImages[0]?.altText || `${mess.name} photo 1`}
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
                                  : `Open gallery at photo ${globalIndex + 1}: ${image.altText || mess.name}`
                              }
                            >
                              <MessImage
                                src={image.url}
                                alt={image.altText || `${mess.name} photo ${globalIndex + 1}`}
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
                        alt={previewImages[0]?.altText || `${mess.name} photo 1`}
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
                  <Star size={20} />
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

      {/* Plan Details Modal */}
      {viewPlan &&
        (() => {
          const modalImages =
            viewPlan.images
              ?.slice()
              .sort((a, b) => a.sortOrder - b.sortOrder) || [];

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

                <div className={styles["plan-modal-body"]}>
                  <div className={styles["plan-modal-header"]}>
                    <h3>{viewPlan.planName}</h3>
                    <span className={styles["plan-modal-type-badge"]}>
                      {viewPlan.isMonthlyPlan ? "Monthly Plan" : "Daily Plan"}
                    </span>
                  </div>

                  <p className={styles["plan-modal-description"]}>
                    {viewPlan.description}
                  </p>

                  {viewPlan.Variation && viewPlan.Variation.length > 0 && (
                    <div className={styles["plan-modal-variations"]}>
                      {viewPlan.Variation.map((v) => (
                        <span key={v.id} className={styles["plan-meta-item"]}>
                          <Salad size={14} />
                          {v.title}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={styles["plan-price"]}>
                    <span className={styles.currency}>₹</span>
                    <span className={styles.amount}>{viewPlan.price}</span>
                    <span className={styles.period}>
                      /{viewPlan.isMonthlyPlan ? "month" : "meal"}
                    </span>
                  </div>
                  {viewPlan.minPrice && (
                    <p className={styles["plan-min-price"]}>
                      Min. Price: ₹{viewPlan.minPrice}
                    </p>
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
                  alt={sortedImages[activeGalleryImage]?.altText || `${mess.name} photo ${activeGalleryImage + 1}`}
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
                    alt={image.altText || `${mess.name} photo ${index + 1}`}
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
