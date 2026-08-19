import "./MessListingRow.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  Star,
  ArrowRight,
  Flame,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { getAllMess } from "../../../services/messApi";
import type { Mess } from "../../../types/mess";

export type RowBadgeType = "top-rated" | "affordable" | "popular" | "new";

type MessListingRowProps = {
  title: string;
  icon?: LucideIcon;
  subtitle: string;
  badgeType?: RowBadgeType;
  limit?: number;
  sectionClassName?: string;
};

/* ---------------- IMAGE COMPONENT ---------------- */
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

/* ---------------- CORNER BADGE ---------------- */
function CornerBadge({ type, isVerified }: { type: RowBadgeType; isVerified: boolean }) {
  if (type === "popular") {
    return (
      <span className="badge badge-popular">
        <Flame size={12} fill="currentColor" /> Popular
      </span>
    );
  }
  if (type === "new") {
    return (
      <span className="badge badge-new">
        <Sparkles size={12} /> NEW
      </span>
    );
  }
  if (type === "affordable") {
    return (
      <span className="badge badge-affordable">
        <Wallet size={12} /> Great value
      </span>
    );
  }
  if (isVerified) {
    return <span className="badge badge-verified">• Verified</span>;
  }
  return null;
}

/* ---------------- COMPONENT ---------------- */
export default function MessListingRow({
  title,
  icon: Icon,
  subtitle,
  badgeType = "top-rated",
  limit = 8,
  sectionClassName = "",
}: MessListingRowProps) {
  const navigate = useNavigate();

  const [messList, setMessList] = useState<Mess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMess = async () => {
    try {
      const res = await getAllMess(1, limit);
      setMessList(Array.isArray(res) ? res : res?.data ?? []);
    } catch (err) {
      console.error("Failed to fetch mess listings", err);
      setMessList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`trending ${sectionClassName}`}>
      {/* HEADER */}
      <div className="trending-header">
        <div>
          <h2>
            {Icon && (
              <span className="trending-icon">
                <Icon size={22} />
              </span>
            )}
            {title}
          </h2>
          <p>{subtitle}</p>
        </div>

        <button
          className="view-all"
          onClick={() => navigate("/view-all-listings")}
        >
          View all
          <ArrowRight size={18} className="view-all-icon" />
        </button>
      </div>

      {/* SCROLLABLE ROW */}
      {loading ? (
        <p>Loading messes...</p>
      ) : (
        <div className="listing-row">
          {messList.map((mess, index) => {
            const imageUrl =
              mess.images
                ?.slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)[0]
                ?.url;

            const bookingCount = 40 + ((index * 17) % 160);

            return (
              <div className="listing-card" key={mess.id}>
                {/* IMAGE */}
                <div className="image-wrap">
                  <MessImage
                    src={imageUrl}
                    alt={`${mess.name} mess in ${mess.location ?? "Kerala"}`}
                  />

                  <CornerBadge type={badgeType} isVerified={mess.is_verified} />

                  <button className="wishlist" aria-label="Save mess">
                    <Heart size={14} />
                  </button>

                  {/* IMAGE TEXT */}
                  <div className="image-info">
                    <div className="location">
                      <MapPin size={14} />
                      {mess.location || "Kerala"}
                    </div>
                    <h3>{mess.name}</h3>
                  </div>
                </div>

                {/* BODY */}
                <div className="card-body">
                  <div className="rating-row">
                    <div className="rating">
                      <Star size={13} fill="currentColor" /> 4.5
                    </div>
                    {badgeType === "popular" && (
                      <span className="booking-count">{bookingCount}+ bookings</span>
                    )}
                  </div>

                  <div className="tags">
                    <span>Homely</span>
                    <span>Monthly Plan</span>
                  </div>

                  <div className="card-divider" />

                  <div className="card-footer">
                    <div>
                      <small>STARTING AT</small>
                      <strong>
                        ₹{mess.plans?.[0]?.price ?? "N/A"}
                        <span>/mo</span>
                      </strong>
                    </div>

                    <button
                      className="menu-btn"
                      onClick={() => navigate(`/mess/${mess.id}`)}
                    >
                      View Menu
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
