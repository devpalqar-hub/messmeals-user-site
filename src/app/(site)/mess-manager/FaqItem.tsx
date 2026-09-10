"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./page.module.css";

export default function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`${styles["faq-item"]} ${open ? styles["faq-item--open"] : ""}`}
      onClick={() => setOpen((o) => !o)}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((o) => !o); } }}
    >
      <div className={styles["faq-question"]}>
        <span className={styles["faq-number"]}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles["faq-q-text"]}>{q}</span>
        <ChevronDown size={20} className={styles["faq-chevron"]} />
      </div>
      <div className={styles["faq-answer"]}>
        <p>{a}</p>
      </div>
    </div>
  );
}
