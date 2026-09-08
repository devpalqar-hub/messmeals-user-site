"use client";

import { useState, useEffect, useCallback } from "react";
import { Phone, X } from "lucide-react";
import styles from "./FloatingContact.module.css";

const WhatsappIcon = ({ size = 18, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);

interface FloatingContactProps {
  phone?: string;
}

export default function FloatingContact({ phone }: FloatingContactProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Dismiss on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!phone) return null;

  return (
    <div className={styles.container} role="complementary" aria-label="Contact us">
      {/* ── Expandable card ── */}
      <div
        className={`${styles.card} ${isOpen ? styles.cardOpen : ""}`}
        role="dialog"
        aria-label="Contact information"
      >
        {/* Label */}
        <p className={styles.cardLabel}>Contact Us</p>

        {/* Action buttons */}
        <div className={styles.cardActions}>
          <a
            id="floating-contact-call-btn"
            href={`tel:${phone}`}
            className={styles.btnCall}
            aria-label="Call us"
          >
            <Phone size={14} aria-hidden="true" />
            Call Now
          </a>

          <a
            id="floating-contact-sms-btn"
            href={`https://wa.me/919544222468`}
            target="_blank"
            rel="noreferrer"
            className={styles.btnWA}
            aria-label="Send us a WhatsApp message"
          >
            <WhatsappIcon size={15} />
            Text Us
          </a>
        </div>
      </div>

      {/* ── Trigger button ── */}
      <button
        id="floating-contact-trigger"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close contact options" : "Open contact options"}
        aria-expanded={isOpen}
      >
        {/* Pulse rings — only visible when collapsed */}
        <span className={`${styles.pulse} ${isOpen ? styles.pulseHidden : ""}`} aria-hidden="true" />
        <span className={`${styles.pulse2} ${isOpen ? styles.pulseHidden : ""}`} aria-hidden="true" />

        {/* Animated phone / close icon */}
        <div className={`${styles.iconWrapper} ${isOpen ? styles.iconOpen : ""}`}>
          <X className={styles.iconClose} size={22} aria-hidden="true" />
          <Phone className={styles.iconPhone} size={22} aria-hidden="true" />
        </div>
      </button>
    </div>
  );
}
