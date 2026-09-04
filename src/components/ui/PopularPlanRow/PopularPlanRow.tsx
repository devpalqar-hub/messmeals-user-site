import styles from "./PopularPlanRow.module.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  MapPin,
  ArrowRight,
  Users,
  Utensils,
  Sun,
  Moon,
  Coffee,
  Salad,
  LucideArrowRight,
} from "lucide-react";
import { getPopularPlans } from "../../../services/popularPlansApi";
import type { PopularPlan } from "../../../types/popularPlan";

/* ---------------- IMAGE COMPONENT ---------------- */
function PlanImage({ src, alt }: { src?: string | null; alt: string }) {
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

/* ---------------- SUBSCRIBER LABEL ---------------- */
function formatSubscribers(count: number): string | null {
  if (count <= 0) return null;
  if (count < 10) return `${count} subscriptions`;
  // Round down to nearest 10/50/100 etc.
  if (count < 50) return "10+ subscriptions";
  if (count < 100) return "50+ subscriptions";
  if (count < 500) return "100+ subscriptions";
  return "500+ subscriptions";
}

/* ---------------- VARIATION CONFIG (matches mess details page) ---------------- */
function getVariationConfig(title: string) {
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
}

function sortVariations<T extends { title: string }>(variations: T[]): T[] {
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
}

/* ---------------- PRICE FORMATTER ---------------- */
function formatPrice(value: string): string {
  const num = Number(value);
  if (isNaN(num)) return value;
  return num.toLocaleString("en-IN");
}

/* ---------------- COMPONENT ---------------- */
export default function PopularPlanRow() {
  const [plans, setPlans] = useState<PopularPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await getPopularPlans(1, 25);
      setPlans(Array.isArray(res) ? res : res?.data ?? []);
    } catch (err) {
      console.error("Failed to fetch popular plans", err);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && plans.length === 0) return null;

  return (
    <section className={styles.section}>
      {/* HEADER */}
      <div className={styles["section-header"]}>
        <div>
          <h2>
            <span className={styles["section-icon"]}>
              <Flame size={22} />
            </span>
            Popular Plans
          </h2>
          <p>Most loved meal plans picked by our community.</p>
        </div>

        <button
          className={styles["view-all"]}
          onClick={() => {/* future: navigate to all plans page */ }}
          style={{ visibility: "hidden" }}
        >
          View all
          <ArrowRight size={18} className={styles["view-all-icon"]} />
        </button>
      </div>

      {/* SCROLLABLE ROW */}
      {loading ? (
        <p>Loading plans...</p>
      ) : (
        <div className={styles["plan-row"]}>
          {plans.map((plan) => {
            const coverImage =
              plan.images?.[0]?.url || plan.mess.coverImage;
            const subscriberLabel = formatSubscribers(plan.totalCustomers);
            const period = plan.isMonthlyPlan ? "/mo" : "/day";

            return (
              <Link
                className={styles["plan-card"]}
                key={plan.id}
                to={`/mess/${plan.mess.slug}?planId=${plan.id}`}
              >
                {/* IMAGE */}
                <div className={styles["image-wrap"]}>
                  <PlanImage
                    src={coverImage}
                    alt={plan.planName}
                  />

                  {/* Plan type badge */}
                  <span
                    className={`${styles["badge-type"]} ${plan.isMonthlyPlan
                        ? styles["badge-monthly"]
                        : styles["badge-daily"]
                      }`}
                  >
                    {plan.isMonthlyPlan ? "Monthly" : "Daily"}
                  </span>

                  {/* Subscriber count */}
                  {subscriberLabel && (
                    <span className={styles["badge-subscribers"]}>
                      <Users size={11} />
                      {subscriberLabel}
                    </span>
                  )}
                </div>

                {/* BODY */}
                <div className={styles["card-body"]}>
                  <h3 className={styles["plan-name"]}>{plan.planName}</h3>

                  {/* Mess info */}
                  <div className={styles["mess-info"]}>
                    {plan.mess.logo && (
                      <img
                        className={styles["mess-logo"]}
                        src={plan.mess.logo}
                        alt={plan.mess.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <div className={styles["mess-details"]}>
                      <span className={styles["mess-name"]}>{plan.mess.name}</span>
                      {(plan.mess.location || plan.mess.address) && (
                        <span className={styles["mess-location"]}>
                          <MapPin size={10} />
                          <span>{plan.mess.location || plan.mess.address}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Variation tags */}
                  {plan.variations.length > 0 && (
                    <div className={styles["variation-tags"]}>
                      {sortVariations(plan.variations).map((v) => {
                        const { Icon: VIcon, colorClass } = getVariationConfig(v.title);
                        return (
                          <span key={v.id} className={`${styles["variation-tag"]} ${colorClass}`}>
                            <VIcon size={10} />
                            {v.title}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <div className={styles["card-divider"]} />

                  {/* FOOTER */}
                  <div className={styles["card-footer"]}>
                    <div>
                      <div className={styles["price-row"]}>
                        <span className={styles["current-price"]}>
                          ₹{formatPrice(plan.price)}
                          <span className={styles.period}>{period}</span>
                        </span>
                      </div>
                    </div>

                    <span className={styles["menu-btn"]}>
                      View Plan
                      <LucideArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
