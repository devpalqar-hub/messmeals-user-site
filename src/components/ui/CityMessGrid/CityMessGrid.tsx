"use client";

import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { MapPin, Utensils, Users, BadgeCheck } from "../SvgIcon/SvgIcon";
import Link from "next/link";
import { useState, useMemo } from "react";
import type { MessListing } from "../../../types/mess";
import { formatSubscribers } from "../../../utils/subscribers";
import styles from "./CityMessGrid.module.css";

function MessImage({ src, alt }: { src?: string | null; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || "/MessMealsfallback.png");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      onError={() => setImgSrc("/MessMealsfallback.png")}
    />
  );
}

function MessCard({
  mess,
  defaultCity,
}: {
  mess: MessListing;
  defaultCity?: string;
}) {
  const foodLabel =
    mess.foodTypes && mess.foodTypes.length > 0
      ? mess.foodTypes
        .map((f) =>
          f === "VEG" ? "Vegetarian" : f === "NON_VEG" ? "Non-Veg" : "Mixed"
        )
        .join(" · ")
      : null;

  return (
    <article className={styles["mess-card"]}>
      <div className={styles["mess-card-image"]}>
        <MessImage src={mess.logo || mess.coverImage} alt={mess.messName} />
        {mess.totalSubscribers !== undefined &&
          mess.totalSubscribers !== null &&
          (mess.totalSubscribers < 5 ? (
            <span className={styles["card-new-badge"]}>
              <Sparkles size={11} />
              New
            </span>
          ) : (
            <span className={styles["card-subs-badge"]}>
              <Users size={12} />
              {formatSubscribers(mess.totalSubscribers)}
            </span>
          ))}
      </div>
      <div className={styles["mess-card-body"]}>
        <div className={styles["mess-card-name-row"]}>
          {mess.status.isVerified && (
            <BadgeCheck
              size={16}
              className={styles["mess-card-verified"]}
              aria-label="Verified Mess"
            />
          )}
          <h3 className={styles["mess-card-name"]}>{mess.messName}</h3>
        </div>
        <div className={styles["mess-card-location"]}>
          <MapPin size={11} />
          <span>
            {mess.address.address ||
              mess.address.location ||
              defaultCity ||
              "Location not set"}
          </span>
        </div>
        {foodLabel && (
          <div className={styles["mess-card-food-type"]}>
            <Utensils size={11} />
            <span>{foodLabel}</span>
          </div>
        )}
        <div className={styles["mess-card-divider"]} />
        <div className={styles["mess-card-footer"]}>
          <div className={styles["mess-card-price"]}>
            <small>STARTING FROM</small>
            <strong>
              {mess.startingPlanPrice != null ? (
                <>
                  ₹{mess.startingPlanPrice}
                  <span>/month</span>
                </>
              ) : (
                <span className={styles["mess-card-price-na"]}>
                  Contact for price
                </span>
              )}
            </strong>
          </div>
          <Link href={`/mess/${mess.slug}`} className={styles["mess-card-btn"]}>
            View Mess
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export type CityMessGridProps = {
  messes: MessListing[];
  defaultCity?: string;
  itemsPerPage?: number;
};

export default function CityMessGrid({
  messes,
  defaultCity,
  itemsPerPage = 8,
}: CityMessGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(messes.length / itemsPerPage);

  const currentMesses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return messes.slice(start, start + itemsPerPage);
  }, [messes, currentPage, itemsPerPage]);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (messes.length === 0) {
    return (
      <div className={styles["listings-empty"]}>
        <p>No listings found at the moment. Please check back soon.</p>
      </div>
    );
  }

  return (
    <div className={styles["listings-container"]}>
      <div className={styles["listings-grid"]}>
        {currentMesses.map((mess) => (
          <MessCard key={mess.id} mess={mess} defaultCity={defaultCity} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles["pagination"]}>
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={styles["pagination-btn"]}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
            Prev
          </button>
          <span className={styles["pagination-info"]}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={styles["pagination-btn"]}
            aria-label="Next page"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
