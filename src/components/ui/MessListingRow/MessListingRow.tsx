import styles from "./MessListingRow.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  // Star, // commented out — new API does not return ratings
  ArrowRight,
  Check,
  Star as StarIcon,
  ShieldCheck,
  type LucideIcon,
  LucideArrowRight,
} from "lucide-react";
import { getAllMess, type MessListFilters } from "../../../services/messApi";
import type { MessListing } from "../../../types/mess";

export type RowBadgeType = "featured" | "verified" | "top-rated" | "affordable" | "popular" | "new";

type MessListingRowProps = {
  title: string;
  icon?: LucideIcon;
  subtitle: string;
  badgeType?: RowBadgeType;
  limit?: number;
  sectionClassName?: string;
  apiFilter?: MessListFilters;
};

/* ---------------- IMAGE COMPONENT ---------------- */
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

/* ---------------- CORNER BADGE ---------------- */
function CornerBadge({ type, status }: { type: RowBadgeType; status: MessListing["status"] }) {
  if (type === "featured" && status.isFeatured) {
    return (
      <span className={`${styles.badge} ${styles["badge-popular"]}`}>
        <StarIcon size={12} fill="currentColor" /> Featured
      </span>
    );
  }
  if (type === "verified" && status.isVerified) {
    return (
      <span className={`${styles.badge} ${styles["badge-verified"]}`}>
        <span className={styles["badge-icon"]}>
          <Check size={11} />
        </span>
        Verified
      </span>
    );
  }
  if (status.isVerified) {
    return (
      <span className={`${styles.badge} ${styles["badge-verified"]}`}>
        <span className={styles["badge-icon"]}>
          <ShieldCheck size={11} />
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
  badgeType = "featured",
  limit = 8,
  sectionClassName = "",
  apiFilter = {},
}: MessListingRowProps) {
  const navigate = useNavigate();

  const [messList, setMessList] = useState<MessListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMess = async () => {
    try {
      const res = await getAllMess(1, limit, apiFilter);
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
          {messList.map((mess) => {
            return (
              <div className={styles["listing-card"]} key={mess.id}>
                {/* IMAGE */}
                <div className={styles["image-wrap"]}>
                  <MessImage
                    src={mess.coverImage}
                    alt={`${mess.messName} mess at ${mess.address.address}`}
                  />

                  <CornerBadge type={badgeType} status={mess.status} />

                  <button className={styles.wishlist} aria-label="Save mess">
                    <Heart size={14} />
                  </button>
                </div>

                {/* BODY */}
                <div className={styles["card-body"]}>
                  <div className={styles["card-name-block"]}>
                    <div className={styles["card-location"]}>
                      <MapPin size={12} />
                      <span>{mess.address.address || mess.address.location || "Location not set"}</span>
                    </div>
                    <h3 className={styles["card-title"]}>{mess.messName}</h3>
                  </div>

                  {/* Star ratings commented out — new API does not return ratings/reviews */}
                  {/* <div className={styles["rating-row"]}>
                    <div className={styles.rating}>
                      <Star size={13} fill="currentColor" /> 4.5
                      <span className={styles["rating-divider"]}>|</span>
                      <span className={styles["review-count"]}>
                        {mess.Testimonials?.length ?? 0} Reviews
                      </span>
                    </div>
                  </div> */}

                  <div className={styles["card-divider"]} />

                  <div className={styles["card-footer"]}>
                    <div className={styles["price-info"]}>
                      <small>STARTING FROM</small>
                      <strong>
                        {mess.startingPlanPrice != null
                          ? <>₹{mess.startingPlanPrice}<span>/mo</span></>
                          : <span className={styles["price-na"]}>Contact for price</span>
                        }
                      </strong>
                    </div>

                    <button
                      className={styles["menu-btn"]}
                      onClick={() => navigate(`/mess/${mess.slug}`)}
                    >
                      View Details
                      <LucideArrowRight size={16} />
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
