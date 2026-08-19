import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMessById } from "../services/messApi";
import type { MessDetails } from "../types/mess";
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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./ViewMessDetails.css";

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

  useEffect(() => {
    if (messId) {
      fetchMessDetails();
    }
  }, [messId]);

  const fetchMessDetails = async () => {
    setLoading(true);
    try {
      const data = await getMessById(messId!);
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
      <div className="mess-details-page">
        <div className="loading-state">Loading mess details...</div>
      </div>
    );
  }

  if (!mess) {
    return (
      <div className="mess-details-page">
        <div className="error-state">Mess not found</div>
      </div>
    );
  }

  const sortedImages =
    mess.images?.slice().sort((a, b) => a.sortOrder - b.sortOrder) || [];

  const openingHoursList = mess.openingHours
    ? groupOpeningHours(mess.openingHours)
    : [];

  const openNow = isMessOpenNow(mess.openingHours);

  const cityCrumb = mess.location?.split(",")[0]?.trim() || "Mess";

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

  const goToBooking = (planId: string) => {
    const bookingPath = `/mess/${mess.id}/book?planId=${planId}`;
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: bookingPath } });
      return;
    }
    navigate(bookingPath);
  };

  return (
    <div className="mess-details-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button onClick={() => navigate("/")}>Home</button>
        <span>/</span>
        <button onClick={() => navigate("/view-all-listings")}>
          {cityCrumb}
        </button>
        <span>/</span>
        <span>{mess.name}</span>
      </div>

      {/* Details Card */}
      <div className="details-card">
      {/* Hero Section */}
      <div className="hero-card">
        <div className="hero-media">
          <MessImage
            src={sortedImages[0]?.url}
            alt={`${mess.name} - ${mess.location || "Kerala"} Style Homely Food`}
          />
          <div className="hero-gradient-overlay" />
          {openNow && <div className="open-now-badge">Open Now</div>}
        </div>

        <div className="hero-content">
          <div className="hero-badges">
            {mess.is_verified && (
              <span className="verified-badge">
                <span className="verified-badge-icon">
                  <Check size={11} />
                </span>
                Verified Mess
              </span>
            )}
          </div>

          <h1>{mess.name}</h1>

          <div className="hero-tagline">
            <Leaf size={16} />
            <span>Homestyle Meals Made with Love</span>
          </div>

          {mess.location && (
            <div className="hero-location">
              <MapPin size={15} />
              <span>{mess.location}</span>
            </div>
          )}

          <p className="hero-description">{mess.description}</p>

          <div className="hero-info-strip">
            <div className="hero-info-item">
              <MapPin size={18} />
              <div>
                <small>Location</small>
                <p>{mess.address || mess.location || "Not available"}</p>
              </div>
            </div>
            <div className="hero-info-item">
              <Phone size={18} />
              <div>
                <small>Phone</small>
                <p>{mess.phone || "Not available"}</p>
              </div>
            </div>
            <div className="hero-info-item">
              <Mail size={18} />
              <div>
                <small>Email</small>
                <p>{mess.email || "Not available"}</p>
              </div>
            </div>
            <div className="hero-info-item">
              <Clock size={18} />
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
      </div>

      {/* Inquiry Banner */}
      <div className="inquiry-banner">
        <div className="inquiry-banner-icon">
          <MessageCircle size={22} />
        </div>
        <div className="inquiry-banner-text">
          <h3>Have Questions?</h3>
          <p>We're here to help! Send us an inquiry and we'll get back to you soon.</p>
        </div>
        <button
          className="inquiry-banner-btn"
          onClick={() => setShowInquiryModal(true)}
        >
          Send an Inquiry
        </button>
      </div>

        {/* Meal Plans Section */}
        <section className="content-block">
          <div className="plans-section-header">
            <h2>Our Meal Plans</h2>
            {showPlanTabs && (
              <div className="plan-tabs">
                <button
                  className={planTab === "monthly" ? "active" : ""}
                  onClick={() => setPlanTab("monthly")}
                >
                  Monthly Plans
                </button>
                <button
                  className={planTab === "daily" ? "active" : ""}
                  onClick={() => setPlanTab("daily")}
                >
                  Daily Plans
                </button>
              </div>
            )}
          </div>
          <p className="plans-section-subtitle">
            Choose the perfect plan that suits your needs
          </p>

          {visiblePlans.length > 0 ? (
            <div className="plans-list">
              {visiblePlans.map((plan) => {
                const planImages =
                  plan.images
                    ?.slice()
                    .sort((a, b) => a.sortOrder - b.sortOrder) || [];

                return (
                  <div key={plan.id} className="plan-row-card">
                    <div className="plan-row-info">
                      <h3>{plan.planName}</h3>
                      <p className="plan-description">{plan.description}</p>

                      <div className="plan-meta">
                        {plan.Variation && plan.Variation.length > 0 && (
                          <span className="plan-meta-item">
                            <Salad size={14} />
                            {plan.Variation.map((v) => v.title).join(", ")}
                          </span>
                        )}
                        <span className="plan-meta-item">
                          <Clock size={14} />
                          {plan.isMonthlyPlan ? "30 Days Plan" : "Daily Plan"}
                        </span>
                      </div>

                      <div className="plan-price">
                        <span className="currency">₹</span>
                        <span className="amount">{plan.price}</span>
                        <span className="period">
                          /{plan.isMonthlyPlan ? "month" : "meal"}
                        </span>
                      </div>
                      {plan.minPrice && (
                        <p className="plan-min-price">
                          Min. Price: ₹{plan.minPrice}
                        </p>
                      )}

                      <button
                        className="plan-action-btn"
                        onClick={() => goToBooking(plan.id)}
                      >
                        {plan.isMonthlyPlan ? "View Full Menu" : "View Details"}
                      </button>
                    </div>

                    {planImages.length > 0 && (
                      <div className="plan-row-images">
                        <MessImage
                          className="plan-row-main-image"
                          src={planImages[0].url}
                          alt={plan.planName}
                        />
                        {planImages.length > 1 && (
                          <div className="plan-row-thumbs">
                            {planImages.slice(1, 5).map((img) => (
                              <MessImage
                                key={img.id}
                                src={img.url}
                                alt={plan.planName}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-plans">
              <p>No meal plans available at the moment.</p>
            </div>
          )}
        </section>

        {/* Tags Section */}
        {tags.length > 0 && (
          <section className="content-block">
            <h2>Tags</h2>
            <div className="tags-list">
              {tags.map((tag) => (
                <span key={tag.id} className="tag-pill">
                  {humanizeTag(tag.tag)}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Food Types Section */}
        {(isVeg || isNonVeg) && (
          <section className="content-block">
            <h2>Food Types</h2>
            <div className="food-types-list">
              {isVeg && (
                <span className="food-type-pill veg">
                  <Leaf size={16} />
                  Vegetarian
                </span>
              )}
              {isNonVeg && (
                <span className="food-type-pill non-veg">
                  <Drumstick size={16} />
                  Non-Vegetarian
                </span>
              )}
            </div>
          </section>
        )}

        {/* Photo Gallery Section */}
        <section className="content-block">
          <h2>
            <Star size={20} />
            Gallery
          </h2>

          {sortedImages.length > 0 ? (
            <div className="gallery-grid">
              {sortedImages.map((image, index) => (
                <div key={image.id} className="gallery-item">
                  <MessImage
                    src={image.url}
                    alt={image.altText || `${mess.name} photo ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-gallery">
              <p>No photos available</p>
            </div>
          )}
        </section>
      </div>

      {/* Send an Inquiry Modal */}
      {showInquiryModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowInquiryModal(false)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setShowInquiryModal(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h3>Send an Inquiry</h3>
            <p className="inquiry-subtitle">
              Have questions? We're here to help!
            </p>

            <form
              className="inquiry-form"
              onSubmit={(e) => {
                e.preventDefault();
                setShowInquiryModal(false);
              }}
            >
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Your Message</label>
                <textarea
                  placeholder="Type your message here..."
                  className="form-textarea"
                  rows={4}
                />
              </div>

              <button type="submit" className="send-message-btn">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
