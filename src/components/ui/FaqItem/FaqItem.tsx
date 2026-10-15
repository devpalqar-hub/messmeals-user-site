"use client";

import { useState, useId } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./FaqItem.module.css";

export type FaqItemProps = {
  q: string;
  a: string;
  index: number;
  isOpen?: boolean;
  onToggle?: () => void;
  id?: string;
};

export default function FaqItem({
  q,
  a,
  index,
  isOpen: controlledOpen,
  onToggle,
  id: customId,
}: FaqItemProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const reactId = useId();
  const faqId =
    customId || `faq-item-${index + 1}-${reactId.replace(/:/g, "")}`;

  const isExpanded =
    controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  return (
    <div
      className={`${styles["faq-item"]} ${
        isExpanded ? styles["faq-item--open"] : ""
      }`}
    >
      <h3 className={styles["faq-item-heading"]}>
        <button
          type="button"
          id={`${faqId}-btn`}
          className={styles["faq-btn"]}
          aria-expanded={isExpanded}
          aria-controls={`${faqId}-panel`}
          onClick={handleToggle}
        >
          <span className={styles["faq-num"]}>{index + 1}</span>
          <span className={styles["faq-question"]}>{q}</span>
          <span
            className={`${styles["faq-chevron"]} ${
              isExpanded ? styles["faq-chevron--open"] : ""
            }`}
            aria-hidden="true"
          >
            <ChevronDown size={18} strokeWidth={2.2} />
          </span>
        </button>
      </h3>

      <div
        id={`${faqId}-panel`}
        role="region"
        aria-labelledby={`${faqId}-btn`}
        className={`${styles["faq-panel"]} ${
          isExpanded ? styles["faq-panel--open"] : ""
        }`}
      >
        <p className={styles["faq-answer"]}>{a}</p>
      </div>
    </div>
  );
}
