"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { MessDetails, NewMessPlan } from "../../../../types/mess";
import styles from "./PlanScroller.module.css";

const inr = (v: string | number) => `₹${Number(v).toLocaleString("en-IN")}`;

function waLink(phone: string, messName: string) {
  const digits = phone.replace(/\D/g, "");
  const msg = encodeURIComponent(
    `Hi! I found ${messName} on MessMeals and I'd like to subscribe to your meal plan.`,
  );
  return `https://wa.me/${digits}?text=${msg}`;
}

/**
 * Plan cards in a snapping carousel with prev/next arrows, plus a
 * "View all plans" modal. Shared by every theme.
 */
export default function PlanScroller({
  children,
  plans,
  mess,
}: {
  children: ReactNode;
  plans: NewMessPlan[];
  mess: MessDetails;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  const many = items.length > 1;
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(!many);
  const [open, setOpen] = useState(false);

  const sync = () => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className={styles.root}>
      <div className={styles.stage}>
        {many && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.prev}`}
            onClick={() => scroll(-1)}
            disabled={atStart}
            aria-label="Previous plan"
          >
            ‹
          </button>
        )}
        <div
          ref={ref}
          onScroll={sync}
          className={`${styles.track} ${many ? styles.many : ""}`}
        >
          {items.map((child, i) => (
            <div key={i} className={styles.item}>
              {child}
            </div>
          ))}
        </div>
        {many && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={() => scroll(1)}
            disabled={atEnd}
            aria-label="Next plan"
          >
            ›
          </button>
        )}
      </div>

      {many && (
        <div className={styles.viewAllRow}>
          <button
            type="button"
            className={styles.viewAll}
            onClick={() => setOpen(true)}
          >
            View full plan
          </button>
        </div>
      )}

      {open &&
        createPortal(
        <div
          className={styles.overlay}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label={`All plans at ${mess.messName}`}
          >
            <div className={styles.modalHead}>
              <h3>All plans at {mess.messName}</h3>
              <button
                type="button"
                className={styles.close}
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <ul className={styles.list}>
              {plans.map((p) => {
                const kinds = [p.isDailyPlan && "Daily", p.isMonthlyPlan && "Monthly"]
                  .filter(Boolean)
                  .join(" · ");
                const showMin =
                  Number(p.minPrice) > 0 && Number(p.minPrice) < Number(p.price);
                return (
                  <li key={p.id} className={styles.row}>
                    <div className={styles.rowMain}>
                      <p className={styles.rowName}>{p.planName}</p>
                      {kinds && <p className={styles.rowKind}>{kinds}</p>}
                      {p.description && (
                        <p className={styles.rowDesc}>{p.description}</p>
                      )}
                      {p.variations.length > 0 && (
                        <p className={styles.rowDesc}>
                          Includes {p.variations.map((v) => v.title).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className={styles.rowSide}>
                      <p className={styles.rowPrice}>{inr(p.price)}</p>
                      {showMin && (
                        <p className={styles.rowKind}>from {inr(p.minPrice)}</p>
                      )}
                      <a
                        href={waLink(mess.phone, mess.messName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.rowBtn}
                      >
                        Subscribe
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
