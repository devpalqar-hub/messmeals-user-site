import styles from "./MessListingRow.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  Star,
  ArrowRight,
  Check,
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
      <span className={`${styles.badge} ${styles["badge-popular"]}`}>
        <Flame size={12} fill="currentColor" /> Popular
      </span>
    );
  }
  if (type === "new") {
    return (
      <span className={`${styles.badge} ${styles["badge-new"]}`}>
        <Sparkles size={12} /> NEW
      </span>
    );
  }
  if (type === "affordable") {
    return (
      <span className={`${styles.badge} ${styles["badge-affordable"]}`}>
        <Wallet size={12} /> Great value
      </span>
    );
  }
  if (isVerified) {
    return (
      <span className={`${styles.badge} ${styles["badge-verified"]}`}>
        <span className={styles["badge-icon"]}>
          <Check size={11} />
        </span>
        Verified
      </span>
    );
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
    <section className={`${styles.trending} ${sectionClassName}`}>
      {/* HEADER */}
      <div className={styles["trending-header"]}>
        <div>
          <h2>
            {Icon && (
              <span className={styles["trending-icon"]}>
                <Icon size={22} />
              </span>
            )}
            {title}
          </h2>
          <p>{subtitle}</p>
        </div>

        <button
          className={styles["view-all"]}
          onClick={() => navigate("/view-all-listings")}
        >
          View all
          <ArrowRight size={18} className={styles["view-all-icon"]} />
        </button>
      </div>

      {/* SCROLLABLE ROW */}
      {loading ? (
        <p>Loading messes...</p>
      ) : (
        <div className={styles["listing-row"]}>
          {messList.map((mess, index) => {
            const imageUrl =
              mess.images
                ?.slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)[0]
                ?.url;

            const bookingCount = 40 + ((index * 17) % 160);

            return (
              <div className={styles["listing-card"]} key={mess.id}>
                {/* IMAGE */}
                <div className={styles["image-wrap"]}>
                  <MessImage
                    src={imageUrl}
                    alt={`${mess.name} mess at ${mess.address}`}
                  />

                  <CornerBadge type={badgeType} isVerified={mess.is_verified} />

                  <button className={styles.wishlist} aria-label="Save mess">
                    <Heart size={14} />
                  </button>
                </div>

                {/* BODY */}
                <div className={styles["card-body"]}>
                  <div className={styles["card-name-block"]}>
                    <div className={styles["card-location"]}>
                      <MapPin size={12} />
                      <span>{mess.address}</span>
                    </div>
                    <h3 className={styles["card-title"]}>{mess.name}</h3>
                  </div>

                  <div className={styles["rating-row"]}>
                    <div className={styles.rating}>
                      <Star size={13} fill="currentColor" /> 4.5
                      <span className={styles["rating-divider"]}>|</span>
                      <span className={styles["review-count"]}>
                        {mess.Testimonials?.length ?? 0} Reviews
                      </span>
                    </div>
                    {badgeType === "popular" && (
                      <span className={styles["booking-count"]}>{bookingCount}+ bookings</span>
                    )}
                  </div>

                  <div className={styles["card-divider"]} />

                  <div className={styles["card-footer"]}>
                    <div className={styles["price-info"]}>
                      <small>STARTING FROM</small>
                      <strong>
                        ₹{mess.plans?.[0]?.price ?? "N/A"}
                        <span>/mo</span>
                      </strong>
                    </div>

                    <button
                      className={styles["menu-btn"]}
                      onClick={() => navigate(`/mess/${mess.id}`)}
                    >
                      View Details
                      <ArrowRight size={16} />
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
