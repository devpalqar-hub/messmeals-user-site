import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMessById } from "../services/messApi";
import type { MessDetails } from "../types/mess";
import {
  MapPin,
  Star,
  Phone,
  Mail,
//   Clock,
  Check,
  Home,
  Utensils,
  Leaf,
  Package,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./ViewMessDetails.css";

export default function ViewMessDetails() {
  const { messId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mess, setMess] = useState<MessDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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
      if (data.plans?.length > 0) {
        // Auto-select "BEST VALUE" plan or first plan
        const bestValuePlan = data.plans.find(
            (plan: MessDetails["plans"][number]) =>
                plan.planName.toLowerCase().includes("full")
            );
        setSelectedPlan(bestValuePlan?.id || data.plans[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch mess details", err);
    } finally {
      setLoading(false);
    }
  };

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

  const sortedImages = mess.images
    ?.slice()
    .sort((a, b) => a.sortOrder - b.sortOrder) || [];

  const mainImage = sortedImages[activeImageIndex]?.url;

  const formatOpeningHours = (hours: Record<string, string>) => {
    return Object.entries(hours).map(([day, time]) => ({
      day,
      time,
    }));
  };

  const openingHoursList = mess.openingHours
    ? formatOpeningHours(mess.openingHours)
    : [];

  const goToBooking = (planId: string) => {
    const bookingPath = `/mess/${mess.id}/book?planId=${planId}`;
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: bookingPath } });
      return;
    }
    navigate(bookingPath);
  };

//   const selectedPlanData = mess.plans?.find((p) => p.id === selectedPlan);

  return (
    <div className="mess-details-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button onClick={() => navigate("/")}>Home</button>
        <span>/</span>
        <button onClick={() => navigate("/view-all-listings")}>All Listings</button>
        <span>/</span>
        <span>{mess.name}</span>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
      <button className="back-to-listings" onClick={() => navigate("/view-all-listings")}>
        <ChevronLeft size={18} />
        Back to All Listings
      </button>
        <div className="hero-image-container">
          <MessImage
            src={mainImage}
            alt={`${mess.name} - ${mess.location || "Kerala"} Style Homely Food`}
          />

          {mess.is_verified && (
            <div className="verified-badge">
              <Check size={14} />
              VERIFIED
            </div>
          )}

          <div className="dietary-badge">PURE VEG OPTIONS</div>

          <div className="hero-overlay">
            <h1>{mess.name}</h1>
            <div className="hero-location">
              <MapPin size={16} />
              {mess.address || mess.location || "Kerala"}
            </div>
            <div className="hero-rating">
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <span>4.8</span>
              <span className="review-count">(124 Reviews)</span>
            </div>
          </div>

          <div className="hero-actions">
            <button className="call-btn">
              <Phone size={18} />
              Call Now
            </button>
            <button className="whatsapp-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </button>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Left Column */}
        <div className="main-content">
          {/* About Section */}
          <section className="about-section">
            <h2>
              <Home size={20} />
              About the Mess
            </h2>
            <p>{mess.description}</p>

            <div className="features-grid">
              <div className="feature-item">
                <Home size={24} />
                <span>Home Delivery</span>
              </div>
              <div className="feature-item">
                <Utensils size={24} />
                <span>Freshly Cooked</span>
              </div>
              <div className="feature-item">
                <Leaf size={24} />
                <span>Hygienic</span>
              </div>
              <div className="feature-item">
                <Package size={24} />
                <span>Eco-Packing</span>
              </div>
            </div>
          </section>

          {/* Meal Plans Section */}
          <section className="plans-section">
            <h2>
              <Package size={20} />
              Meal Plans & Pricing
            </h2>

            {mess.plans && mess.plans.length > 0 ? (
              <div className="plans-grid">
                {mess.plans.map((plan) => {
                  const isPopular = plan.planName
                    .toLowerCase()
                    .includes("full");
                  const isBestValue = isPopular;

                  return (
                    <div
                      key={plan.id}
                      className={`plan-card ${
                        selectedPlan === plan.id ? "selected" : ""
                      } ${isBestValue ? "best-value" : ""}`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {isPopular && (
                        <div className="popular-badge">POPULAR</div>
                      )}
                      {isBestValue && (
                        <div className="best-value-badge">BEST VALUE</div>
                      )}

                      <h3>{plan.planName}</h3>
                      <p className="plan-description">
                        {plan.description || "Breakfast, Lunch & Dinner"}
                      </p>

                      <div className="plan-price">
                        <span className="currency">₹</span>
                        <span className="amount">{plan.price}</span>
                        <span className="period">/month</span>
                      </div>

                      <ul className="plan-features">
                        {/* Placeholder features - will be dynamic when API provides them */}
                        <li>
                          <Check size={16} />
                          All Items in Lunch Plan
                        </li>
                        <li>
                          <Check size={16} />
                          Snack/Roti: Dosa, Puttu, Appam
                        </li>
                        <li>
                          <Check size={16} />
                          Dinner: Chappati/Rice + Curry
                        </li>
                        <li>
                          <Check size={16} />
                          Sunday Special: Non-Veg
                        </li>
                      </ul>

                      <button
                        className={`plan-action-btn ${
                          selectedPlan === plan.id ? "selected-btn" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlan(plan.id);
                          goToBooking(plan.id);
                        }}
                      >
                        {selectedPlan === plan.id
                          ? "Subscribe Now"
                          : "Choose Plan"}
                      </button>
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

          {/* Photo Gallery Section */}
          <section className="gallery-section">
            <h2>
              <Star size={20} />
              Photo Gallery
            </h2>

            {sortedImages.length > 0 ? (
              <div className="gallery-grid">
                {sortedImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`gallery-item ${
                      index === 0 ? "gallery-main" : ""
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
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

          {/* Customer Reviews Section */}
          <section className="reviews-section">
            <h2>
              <Star size={20} />
              Customer Reviews
            </h2>

            <div className="reviews-summary">
              <div className="rating-overview">
                <div className="rating-number">4.8</div>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="rating-count">Based on 124 reviews</p>
              </div>

              <div className="rating-bars">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="rating-bar-row">
                    <span className="stars-label">{stars}</span>
                    <div className="rating-bar">
                      <div
                        className="rating-bar-fill"
                        style={{
                          width: `${
                            stars === 5
                              ? 93
                              : stars === 4
                              ? 5
                              : stars === 3
                              ? 1
                              : stars === 2
                              ? 1
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="percentage">
                      {stars === 5
                        ? "93"
                        : stars === 4
                        ? "5"
                        : stars === 3
                        ? "1"
                        : stars === 2
                        ? "1"
                        : "0"}
                      %
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Reviews - Replace with actual data when API provides */}
            <div className="reviews-list">
              <div className="review-item">
                <div className="review-header">
                  <div className="reviewer-avatar">AK</div>
                  <div className="reviewer-info">
                    <h4>Arun Kumar</h4>
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={12} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <span className="review-date">2 days ago</span>
                </div>
                <p className="review-text">
                  Absolutely the best homely food in Edappally. The fish curry
                  is to die for! The packaging is also very neat.
                </p>
              </div>

              <div className="review-item">
                <div className="review-header">
                  <div className="reviewer-avatar">SM</div>
                  <div className="reviewer-info">
                    <h4>Sarah Mathews</h4>
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={12} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <span className="review-date">1 week ago</span>
                </div>
                <p className="review-text">
                  Very convenient for working women. Dinner chapatis are soft
                  and curry quantity is good. Highly recommended!
                </p>
              </div>
            </div>
          </section>

          {/* Location Section */}
          <section className="location-section">
            <h2>
              <MapPin size={20} />
              Location
            </h2>

            <div className="map-container">
              {/* Placeholder for map - integrate Google Maps when ready */}
              <div className="map-placeholder">
                <MapPin size={48} />
                <p>{mess.address || mess.location}</p>
                <p className="map-note">Map integration coming soon</p>
              </div>
            </div>

            <div className="location-footer">
              <div className="location-marker">
                <MapPin size={16} />
                <span>{mess.name}</span>
              </div>
              <div className="location-distance">
                {/* Placeholder distances */}
                <span>📍 Near Lulu Mall (3km)</span>
                <span>📍 Chembu Mall (1.8km)</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="sidebar">
          {/* Inquiry Form */}
          <div className="inquiry-card">
            <h3>Send an Inquiry</h3>
            <p className="inquiry-subtitle">
              Reach out to the mess owner directly
            </p>

            <form className="inquiry-form">
              <div className="form-group">
                <label>YOUR NAME</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>PHONE NUMBER</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>MESSAGE</label>
                <textarea
                  placeholder="I am interested in the lunch plan..."
                  className="form-textarea"
                  rows={4}
                />
              </div>

              <button type="submit" className="send-message-btn">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-card">
            <h3>Contact Info</h3>

            <div className="contact-item">
              <Phone size={18} />
              <div>
                <small>Phone</small>
                <p>{mess.phone || "Phone number not available"}</p>
              </div>
            </div>

            <div className="contact-item">
              <Mail size={18} />
              <div>
                <small>Email</small>
                <p>{mess.email || "Email not available"}</p>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="hours-card">
            <h3>Opening Hours</h3>

            {openingHoursList.length > 0 ? (
              <div className="hours-list">
                {openingHoursList.map((item) => (
                  <div key={item.day} className="hours-item">
                    <span className="day">{item.day}</span>
                    <span className="time">{item.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="hours-list">
                <div className="hours-item">
                  <span className="day">Not Available</span>
                  <span className="time">00:00 - 00:00</span>
                </div>
                <div className="hours-item">
                  <span className="day">Not Available</span>
                  <span className="time">00:00 - 00:00</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}